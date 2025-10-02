import client from '@/apollo/client';
import { useAssignValidatorToProgramMutation } from '@/apollo/mutation/assign-validator-to-program.generated';
import { useInviteUserToProgramMutation } from '@/apollo/mutation/invite-user-to-program.generated';
import { useRemoveValidatorFromProgramMutation } from '@/apollo/mutation/remove-validator-from-program.generated';
import { useUpdateProgramMutation } from '@/apollo/mutation/update-program.generated';
import { ProgramDocument } from '@/apollo/queries/program.generated';
import { ProgramsDocument } from '@/apollo/queries/programs.generated';
import ProgramForm from '@/components/program-form';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { OnSubmitProgramFunc } from '@/types/recruitment';
import type { ProgramStatus, ProgramVisibility } from '@/types/types.generated';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

const EditProgram: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [updateProgram] = useUpdateProgramMutation();
  const [assignValidatorToProgram] = useAssignValidatorToProgramMutation();
  const [removeValidatorFromProgram] = useRemoveValidatorFromProgramMutation();
  const [inviteUserToProgram] = useInviteUserToProgramMutation();
  const { isLoggedIn, isAuthed } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      notify('Please login first', 'success');
      return;
    }
    if (!isAuthed) {
      navigate('/my-profile/edit');
      notify('Please add your email', 'success');
      return;
    }
  }, [isLoggedIn, isAuthed]);

  const onSubmit: OnSubmitProgramFunc = (args) => {
    updateProgram({
      variables: {
        input: {
          id: args.id ?? '',
          name: args.programName,
          price: args.price,
          description: args.description,
          summary: args.summary,
          currency: args.currency,
          deadline: args.deadline,
          keywords: args.keywords,
          // validatorId: args.validatorId,
          links: args.links,
          network: args.network,

          visibility: args.visibility as ProgramVisibility,
          image: args.image,

          status: args.status as ProgramStatus,
        },
      },
      onCompleted: async (data) => {
        const programId = data.updateProgram?.id ?? '';
        const currentValidators = data.updateProgram?.validators?.map((v) => v.id) ?? [];
        const targetValidators = args.validators ?? [];

        // Edge case: Validate inputs
        if (!programId) {
          notify('Program ID is missing. Cannot update validators.', 'error');
          return;
        }

        // Filter out invalid validator IDs
        const validTargetValidators = targetValidators.filter((id) => id && typeof id === 'string');
        const validCurrentValidators = currentValidators.filter(
          (id) => id && typeof id === 'string',
        );

        if (validTargetValidators.length !== targetValidators.length) {
          notify('Some validator IDs are invalid and will be skipped.', 'error');
        }

        // Calculate validators to assign and unassign
        const validatorsToAssign = validTargetValidators.filter(
          (validatorId) => validatorId && !validCurrentValidators.includes(validatorId),
        );

        const validatorsToUnassign = validCurrentValidators.filter(
          (validatorId) => validatorId && !validTargetValidators.includes(validatorId),
        );

        // Edge case: Check for duplicates within the same operation
        const duplicateAssigns = validatorsToAssign.filter(
          (id, index) => validatorsToAssign.indexOf(id) !== index,
        );
        const duplicateUnassigns = validatorsToUnassign.filter(
          (id, index) => validatorsToUnassign.indexOf(id) !== index,
        );

        if (duplicateAssigns.length > 0) {
          notify(
            `Duplicate validators found in assign list: ${duplicateAssigns.join(
              ', ',
            )}. Duplicates will be skipped.`,
            'error',
          );
        }

        if (duplicateUnassigns.length > 0) {
          notify(
            `Duplicate validators found in unassign list: ${duplicateUnassigns.join(
              ', ',
            )}. Duplicates will be skipped.`,
            'error',
          );
        }

        // Remove duplicates
        const uniqueValidatorsToAssign = [...new Set(validatorsToAssign)];
        const uniqueValidatorsToUnassign = [...new Set(validatorsToUnassign)];

        // Edge case: Check for validators that appear in both arrays (shouldn't happen with current logic, but good to check)
        const conflictingValidators = uniqueValidatorsToAssign.filter((id) =>
          uniqueValidatorsToUnassign.includes(id),
        );
        if (conflictingValidators.length > 0) {
          notify(
            `Validators found in both assign and unassign lists: ${conflictingValidators.join(
              ', ',
            )}. These will be skipped.`,
            'error',
          );
          // Remove conflicting validators from both arrays
          const finalValidatorsToAssign = uniqueValidatorsToAssign.filter(
            (id) => !conflictingValidators.includes(id ?? ''),
          );
          const finalValidatorsToUnassign = uniqueValidatorsToUnassign.filter(
            (id) => !conflictingValidators.includes(id ?? ''),
          );

          // Process unassignments first
          if (finalValidatorsToUnassign.length > 0) {
            const unassignResults = await Promise.allSettled(
              finalValidatorsToUnassign.map((validatorId) =>
                removeValidatorFromProgram({
                  variables: { programId, validatorId: validatorId ?? '' },
                }),
              ),
            );

            const failedUnassigns = unassignResults
              .map((result, index) =>
                result.status === 'rejected' ? finalValidatorsToUnassign[index] : null,
              )
              .filter((id): id is string => id !== null && id !== undefined);

            if (failedUnassigns.length > 0) {
              notify(`Failed to unassign validators: ${failedUnassigns.join(', ')}`, 'error');
            }
          }

          // Process assignments
          if (finalValidatorsToAssign.length > 0) {
            const assignResults = await Promise.allSettled(
              finalValidatorsToAssign.map((validatorId) =>
                assignValidatorToProgram({
                  variables: { validatorId, programId },
                }),
              ),
            );

            const failedAssigns = assignResults
              .map((result, index) =>
                result.status === 'rejected' ? finalValidatorsToAssign[index] : null,
              )
              .filter((id): id is string => id !== null && id !== undefined);

            if (failedAssigns.length > 0) {
              notify(`Failed to assign validators: ${failedAssigns.join(', ')}`, 'error');
            }
          }
        } else {
          // No conflicts, proceed with normal flow
          // Process unassignments first
          if (uniqueValidatorsToUnassign.length > 0) {
            const unassignResults = await Promise.allSettled(
              uniqueValidatorsToUnassign.map((validatorId) =>
                removeValidatorFromProgram({
                  variables: { programId, validatorId: validatorId ?? '' },
                }),
              ),
            );

            const failedUnassigns = unassignResults
              .map((result, index) =>
                result.status === 'rejected' ? uniqueValidatorsToUnassign[index] : null,
              )
              .filter((id): id is string => id !== null && id !== undefined);

            if (failedUnassigns.length > 0) {
              notify(`Failed to unassign validators: ${failedUnassigns.join(', ')}`, 'error');
            }
          }

          // Process assignments
          if (uniqueValidatorsToAssign.length > 0) {
            const assignResults = await Promise.allSettled(
              uniqueValidatorsToAssign.map((validatorId) =>
                assignValidatorToProgram({
                  variables: { validatorId, programId },
                }),
              ),
            );

            const failedAssigns = assignResults
              .map((result, index) =>
                result.status === 'rejected' ? uniqueValidatorsToAssign[index] : null,
              )
              .filter((id): id is string => id !== null && id !== undefined);

            if (failedAssigns.length > 0) {
              notify(`Failed to assign validators: ${failedAssigns.join(', ')}`, 'error');
            }
          }
        }
        // Invite builders if private
        if (
          args.visibility === 'private' &&
          Array.isArray(args.builders) &&
          args.builders.length > 0
        ) {
          const inviteResults = await Promise.allSettled(
            args.builders.map((userId) =>
              inviteUserToProgram({
                variables: { programId: data.updateProgram?.id ?? '', userId },
              }),
            ),
          );
          if (inviteResults.some((r) => r.status === 'rejected')) {
            notify('Failed to invite some builders to the program.', 'error');
          }
        }

        notify('Program successfully updated.');
        client.refetchQueries({ include: [ProgramsDocument, ProgramDocument] });
        navigate(`/programs/${id}`);
      },
    });
  };

  return (
    <div className="w-full bg-[#f7f7f7] p-10 pr-[55px]" defaultValue="edit">
      <ProgramForm isEdit={true} onSubmitProgram={onSubmit} />
    </div>
  );
};

export default EditProgram;
