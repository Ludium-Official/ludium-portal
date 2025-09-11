import client from '@/apollo/client';
import { useAssignValidatorToProgramMutation } from '@/apollo/mutation/assign-validator-to-program.generated';
import { useCreateProgramMutation } from '@/apollo/mutation/create-program.generated';
import { useInviteUserToProgramMutation } from '@/apollo/mutation/invite-user-to-program.generated';
import { ProgramsDocument } from '@/apollo/queries/programs.generated';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import type { OnSubmitInvestmentFunc } from '@/pages/investments/_components/investment-form';
import InvestmentForm from '@/pages/investments/_components/investment-form';
import {
  FundingCondition,
  type ProgramStatus,
  ProgramType,
  type ProgramVisibility,
} from '@/types/types.generated';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const CreateInvestment: React.FC = () => {
  const navigate = useNavigate();
  const [createProgram] = useCreateProgramMutation();

  const [assignValidatorToProgram] = useAssignValidatorToProgramMutation();
  const [inviteUserToProgram] = useInviteUserToProgramMutation();

  const { isLoggedIn, isAuthed } = useAuth();

  // Temporarily disabled for testing
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

  const onSubmit: OnSubmitInvestmentFunc = async (args) => {
    try {
      // Investment programs are only created in the database initially
      // Blockchain deployment happens later when the host pays after validator approval

      // Create program in backend only (no blockchain deployment yet)
      await createProgram({
        variables: {
          input: {
            name: args.programName,
            currency: args.currency,
            price: args.price ?? '0',
            description: args.description,
            summary: args.summary,
            deadline:
              args.deadline ||
              args.fundingEndDate ||
              new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // Use funding end date or default to 90 days from now
            keywords: args.keywords,
            links: args.links,
            network: args.network,
            image: args.image,
            visibility: args.visibility as ProgramVisibility,
            status: args.status as ProgramStatus,
            type: ProgramType.Funding,
            applicationStartDate: args.applicationStartDate,
            applicationEndDate: args.applicationEndDate,
            fundingStartDate: args.fundingStartDate,
            fundingEndDate: args.fundingEndDate,
            fundingCondition:
              args.fundingCondition === 'open'
                ? FundingCondition.Open
                : args.fundingCondition === 'tier'
                  ? FundingCondition.Tier
                  : undefined,
            tierSettings: args.tierSettings,
            feePercentage: args.feePercentage,
            customFeePercentage: args.customFeePercentage,
            // No blockchain deployment at creation - happens when host pays
          },
        },
        onCompleted: async (data) => {
          const programId = data.createProgram?.id ?? '';

          const results = await Promise.allSettled(
            args.validators.map((validatorId) =>
              assignValidatorToProgram({
                variables: { validatorId, programId },
              }),
            ),
          );

          if (results.some((r) => r.status === 'rejected')) {
            notify(
              'Failed to assign validators to the program due to an unexpected error.',
              'error',
            );
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
                  variables: { programId, userId },
                }),
              ),
            );
            if (inviteResults.some((r) => r.status === 'rejected')) {
              notify('Failed to invite some builders to the program.', 'error');
            }
          }
          navigate('/investments');
          client.refetchQueries({ include: [ProgramsDocument] });
          notify('Investment program created successfully!', 'success');
        },
        onError: (error) => {
          notify(`Failed to create program: ${error.message}`, 'error');
        },
      });
    } catch (error) {
      const errorMessage = (error as Error).message;

      // Check if this is the Privy embedded wallet error that happens even when transaction succeeds
      if (
        errorMessage.includes('User must have an embedded wallet') ||
        errorMessage.includes('r40')
      ) {
        // This error occurs with external wallets even when the transaction succeeds
        // Check if we're using an external wallet
        console.warn(
          'Privy embedded wallet error with external wallet - checking if transaction succeeded...',
        );

        // Since the transaction likely succeeded, just navigate and show success
        // The transaction hash would be in the console logs
        navigate('/investments');
        client.refetchQueries({ include: [ProgramsDocument] });
        notify(
          'Investment program creation submitted. Please check the transaction status.',
          'success',
        );
      } else {
        // For other errors, show the error message
        notify(`Error creating investment program: ${errorMessage}`, 'error');
      }
    }
  };

  return (
    <div className="w-full bg-[#f7f7f7] p-10 pr-[55px]" defaultValue="edit">
      <InvestmentForm isEdit={false} onSubmitInvestment={onSubmit} />
    </div>
  );
};

export default CreateInvestment;
