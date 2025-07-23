import client from '@/apollo/client';
import { useAssignValidatorToProgramMutation } from '@/apollo/mutation/assign-validator-to-program.generated';
import { useCreateProgramMutation } from '@/apollo/mutation/create-program.generated';
import { useInviteUserToProgramMutation } from '@/apollo/mutation/invite-user-to-program.generated';
import { ProgramsDocument } from '@/apollo/queries/programs.generated';
import type { OnSubmitProgramFunc } from '@/components/program-form';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import InvestmentForm from '@/pages/investments/_components/investment-form';
import type { ProgramVisibility } from '@/types/types.generated';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const CreateProgram: React.FC = () => {
  const navigate = useNavigate();
  const [createProgram] = useCreateProgramMutation();

  const [assignValidatorToProgram] = useAssignValidatorToProgramMutation();
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

          visibility: args.visibility as ProgramVisibility,
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
      },
    });
  };

  return (
    <div className="w-full bg-[#f7f7f7] p-10 pr-[55px]" defaultValue="edit">
      <InvestmentForm isEdit={false} onSubmitInvestment={onSubmit} />
    </div>
  );
};

export default CreateProgram;
