import client from '@/apollo/client';
import { useAssignValidatorToProgramMutation } from '@/apollo/mutation/assign-validator-to-program.generated';
import { useCreateProgramMutation } from '@/apollo/mutation/create-program.generated';
import { useInviteUserToProgramMutation } from '@/apollo/mutation/invite-user-to-program.generated';
import { useSubmitProgramMutation } from '@/apollo/mutation/submit-program.generated';
import { ProgramsDocument } from '@/apollo/queries/programs.generated';
import { useAuth } from '@/lib/hooks/use-auth';
import { getInvestmentContract } from '@/lib/hooks/use-investment-contract';
import notify from '@/lib/notify';
import type { OnSubmitInvestmentFunc } from '@/pages/investments/_components/investment-form';
import InvestmentForm from '@/pages/investments/_components/investment-form';
import { FundingCondition, ProgramType, type ProgramVisibility } from '@/types/types.generated';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { http, type PublicClient, createPublicClient } from 'viem';

// Helper functions
function getRpcUrlForNetwork(network: string): string {
  const rpcMap: Record<string, string> = {
    sepolia: 'https://rpc.sepolia.org',
    base: 'https://mainnet.base.org',
    'base-sepolia': 'https://sepolia.base.org',
    'educhain-testnet': 'https://open-campus-codex-sepolia.drpc.org',
    educhain: 'https://rpc.open-campus-codex.gelato.digital',
    arbitrum: 'https://arb1.arbitrum.io/rpc',
    'arbitrum-sepolia': 'https://sepolia-rollup.arbitrum.io/rpc',
  };

  return rpcMap[network] || rpcMap['educhain-testnet'];
}

const CreateInvestment: React.FC = () => {
  const navigate = useNavigate();
  const { sendTransaction, user } = usePrivy();
  const [createProgram] = useCreateProgramMutation();
  const [isDeploying, setIsDeploying] = useState(false);

  const [assignValidatorToProgram] = useAssignValidatorToProgramMutation();
  const [inviteUserToProgram] = useInviteUserToProgramMutation();
  const [submitProgram] = useSubmitProgramMutation();

  const { isLoggedIn, isAuthed } = useAuth();

  // Temporarily disabled for testing
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

  const onSubmit: OnSubmitInvestmentFunc = async (args) => {
    try {
      setIsDeploying(true);

      // Step 1: Deploy to blockchain if user wants blockchain integration
      let txHash: string | null = null;
      let blockchainProgramId: number | null = null;

      if (args.network !== 'off-chain') {
        notify('Deploying to blockchain...');

        // Create public client for the network
        const rpcUrl = getRpcUrlForNetwork(args.network);
        const publicClient = createPublicClient({
          transport: http(rpcUrl),
        }) as PublicClient;

        // Get the investment contract for the selected network
        const investmentContract = getInvestmentContract(
          args.network,
          sendTransaction,
          publicClient,
        );

        // Get validator wallet addresses from the form data
        const currentUserAddress =
          user?.wallet?.address || '0x0000000000000000000000000000000000000000';

        let validatorAddresses: string[] = [];

        if (
          args.validators.length > 0 &&
          args.validatorWalletAddresses &&
          args.validatorWalletAddresses.length > 0
        ) {
          // Use the wallet addresses provided by the form
          validatorAddresses = args.validatorWalletAddresses.filter((addr) => addr && addr !== '');

          // Validate that we have wallet addresses for all validators
          if (validatorAddresses.length !== args.validators.length) {
            // Fill missing addresses with current user address
            while (validatorAddresses.length < args.validators.length) {
              validatorAddresses.push(currentUserAddress);
            }
          }
        } else if (args.validators.length > 0) {
          // No wallet addresses provided but validators selected - use current user as fallback
          validatorAddresses = args.validators.map(() => currentUserAddress);
        } else {
          // No validators specified - use current user as default validator
          validatorAddresses = [currentUserAddress];
        }

        const contractResult = await investmentContract.createInvestmentProgram({
          name: args.programName,
          description: args.description,
          fundingGoal: args.price || '0',
          fundingToken: '0x0000000000000000000000000000000000000000', // Native token for now
          applicationStartDate: args.applicationStartDate || '',
          applicationEndDate: args.applicationEndDate || '',
          fundingStartDate: args.fundingStartDate || '',
          fundingEndDate: args.fundingEndDate || '',
          feePercentage: args.feePercentage || 300, // 3% default
          validators: validatorAddresses,
          tierSettings: args.tierSettings,
        });

        // Store the program ID from blockchain
        blockchainProgramId = contractResult.programId;
        txHash = contractResult.txHash;

        if (blockchainProgramId !== null && blockchainProgramId !== undefined) {
          notify(`Blockchain deployment successful! Program ID: ${blockchainProgramId}`, 'success');
        } else {
          notify('Blockchain deployment successful!', 'success');
        }
      }

      // Step 2: Create program in backend
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
            contractAddress: txHash ?? '', // Store tx hash in contractAddress field temporarily
          },
        },
        onCompleted: async (data) => {
          const programId = data.createProgram?.id ?? '';

          // Step 3: Update program with blockchain ID if we have one
          if (blockchainProgramId !== null && txHash) {
            try {
              await submitProgram({
                variables: {
                  id: programId,
                  educhainProgramId: blockchainProgramId,
                  txHash: txHash,
                },
              });
              notify(`Program linked to blockchain with ID: ${blockchainProgramId}`, 'success');
            } catch (_error) {
              notify('Warning: Failed to link program with blockchain ID', 'error');
            }
          }

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
      notify(`Error creating investment program: ${(error as Error).message}`, 'error');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="w-full bg-[#f7f7f7] p-10 pr-[55px]" defaultValue="edit">
      {isDeploying && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center gap-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            <span>Deploying to blockchain...</span>
          </div>
        </div>
      )}
      <InvestmentForm isEdit={false} onSubmitInvestment={onSubmit} />
    </div>
  );
};

export default CreateInvestment;
