import client from '@/apollo/client';
import { useAssignValidatorToProgramMutation } from '@/apollo/mutation/assign-validator-to-program.generated';
import { useCreateProgramMutation } from '@/apollo/mutation/create-program.generated';
import { useInviteUserToProgramMutation } from '@/apollo/mutation/invite-user-to-program.generated';
import { ProgramsDocument } from '@/apollo/queries/programs.generated';
import type { OnSubmitProgramFunc } from '@/components/program-form';
import ProgramForm from '@/components/program-form';
import { useAuth } from '@/lib/hooks/use-auth';
import { useProgramDraft } from '@/lib/hooks/use-program-draft';
import notify from '@/lib/notify';
import { type ProgramStatus, ProgramType, type ProgramVisibility } from '@/types/types.generated';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const CreateProgram: React.FC = () => {
  const navigate = useNavigate();
  const [createProgram, { loading }] = useCreateProgramMutation();

  const [assignValidatorToProgram] = useAssignValidatorToProgramMutation();
  const [inviteUserToProgram] = useInviteUserToProgramMutation();

  const { isLoggedIn, isAuthed } = useAuth();
  const { clearDraft: clearProgramDraft } = useProgramDraft();

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
    createProgram({
      variables: {
        input: {
          name: args.programName,
          currency: args.currency,
          price: args.price ?? '0',
          description: args.description,
          summary: args.summary,
          deadline: args.deadline ?? '',
          keywords: args.keywords,
          links: args.links,
          network: args.network,
          image: args.image,
          type: ProgramType.Regular,

          visibility: args.visibility as ProgramVisibility,
          status: args.status as ProgramStatus,
        },
      },
      onCompleted: async (data) => {
        const results = await Promise.allSettled(
          args.validators.map((validatorId) =>
            assignValidatorToProgram({
              variables: { validatorId, programId: data.createProgram?.id ?? '' },
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
                variables: { programId: data.createProgram?.id ?? '', userId },
              }),
            ),
          );
          if (inviteResults.some((r) => r.status === 'rejected')) {
            notify('Failed to invite some builders to the program.', 'error');
          }
        }
        navigate('/programs');
        client.refetchQueries({ include: [ProgramsDocument] });
        // Clear local program draft after successful creation
        clearProgramDraft();
      },
    });
  };

  return (
    <div className="w-full bg-[#f7f7f7] p-10 pr-[55px]" defaultValue="edit">
      <ProgramForm isEdit={false} onSubmitProgram={onSubmit} createLoading={loading} />
    </div>
  );
};

export default CreateProgram;
