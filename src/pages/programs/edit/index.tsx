import client from '@/apollo/client';
import { useAssignValidatorToProgramMutation } from '@/apollo/mutation/assign-validator-to-program.generated';
import { useInviteUserToProgramMutation } from '@/apollo/mutation/invite-user-to-program.generated';
import { useRemoveValidatorFromProgramMutation } from '@/apollo/mutation/remove-validator-from-program.generated';
import { useUpdateProgramMutation } from '@/apollo/mutation/update-program.generated';
import { ProgramDocument } from '@/apollo/queries/program.generated';
import { ProgramsDocument } from '@/apollo/queries/programs.generated';
import type { OnSubmitProgramFunc } from '@/components/program-form';
import ProgramForm from '@/components/program-form';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
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
      navigate('/profile/edit');
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
        const validatorsToAssign = args.validators.filter((validatorId) => !data.updateProgram?.validators?.some((v) => v.id === validatorId));
        const validatorsToUnassign = data.updateProgram?.validators?.map((v) => v.id) ?? [];

        const unassignResults = await Promise.allSettled(
          validatorsToUnassign.map((validatorId) =>
            removeValidatorFromProgram({
              variables: { programId: data.updateProgram?.id ?? '', validatorId: validatorId ?? '' },
            }),
          ),
        );
        if (unassignResults.some((r) => r.status === 'rejected')) {
          notify('Failed to unassign validators from the program due to an unexpected error.', 'error');
        }

        const results = await Promise.allSettled(
          validatorsToAssign.map((validatorId) =>
            assignValidatorToProgram({
              variables: { validatorId, programId: data.updateProgram?.id ?? '' },
            }),
          ),
        );

        if (results.some((r) => r.status === 'rejected')) {
          notify('Failed to assign validators to the program due to an unexpected error.', 'error');
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
