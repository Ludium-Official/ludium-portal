import client from '@/apollo/client';
import { useCreateProgramMutation } from '@/apollo/mutation/create-program.generated';
import { useInviteUserToProgramMutation } from '@/apollo/mutation/invite-user-to-program.generated';
import { ProgramsDocument } from '@/apollo/queries/programs.generated';
import ProgramForm from '@/components/program/program-form/program-form';
import { useAuth } from '@/lib/hooks/use-auth';
import { useProgramDraft } from '@/lib/hooks/use-program-draft';
import notify from '@/lib/notify';
import type { OnSubmitProgramFunc } from '@/types/recruitment';
import type { ProgramVisibility } from '@/types/types.generated';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const CreateProgram: React.FC = () => {
  const navigate = useNavigate();

  const { isLoggedIn, isAuthed } = useAuth();

  const [createProgram, { loading }] = useCreateProgramMutation();
  const [inviteUserToProgram] = useInviteUserToProgramMutation();

  const { clearDraft: clearProgramDraft } = useProgramDraft();

  const onSubmit: OnSubmitProgramFunc = (args) => {
    createProgram({
      variables: {
        input: {
          name: args.programTitle,
          currency: args.currency,
          price: args.price ?? '0',
          description: args.description,
          deadline: args.deadline?.toISOString() ?? '',
          keywords: Array.isArray(args.skills) ? args.skills : [],
          network: args.network ?? '',
          visibility: args.visibility as ProgramVisibility,
        },
      },
      onCompleted: async (data) => {
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
        clearProgramDraft();
      },
    });
  };

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

  return (
    <div className="w-full bg-gray-light p-10 pr-[55px]" defaultValue="edit">
      <ProgramForm onSubmitProgram={onSubmit} createLoading={loading} />
    </div>
  );
};

export default CreateProgram;
