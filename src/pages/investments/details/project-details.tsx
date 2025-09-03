import client from '@/apollo/client';
import { useAcceptApplicationMutation } from '@/apollo/mutation/accept-application.generated';
import { useCheckMilestoneMutation } from '@/apollo/mutation/check-milestone.generated';
import { useCreateInvestmentMutation } from '@/apollo/mutation/create-investment.generated';
import { ApplicationDocument, useApplicationQuery } from '@/apollo/queries/application.generated';
import { ProgramDocument, useProgramQuery } from '@/apollo/queries/program.generated';
import MarkdownPreviewer from '@/components/markdown/markdown-previewer';
import {
  ApplicationStatusBadge,
  MilestoneStatusBadge,
  ProgramStatusBadge,
} from '@/components/status-badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tokenAddresses } from '@/constant/token-address';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import { useInvestmentContract } from '@/lib/hooks/use-investment-contract';
import notify from '@/lib/notify';
import { cn, getCurrencyIcon, getUserName, mainnetDefaultNetwork } from '@/lib/utils';
import { TierBadge, type TierType } from '@/pages/investments/_components/tier-badge';
// import ProgramStatusBadge from '@/pages/programs/_components/program-status-badge';
import EditApplicationForm from '@/pages/programs/details/_components/edit-application-from';
import EditMilestoneForm from '@/pages/programs/details/_components/edit-milestone-form';
import RejectApplicationForm from '@/pages/programs/details/_components/reject-application-form';
import RejectMilestoneForm from '@/pages/programs/details/_components/reject-milestone-form';
import SubmitMilestoneForm from '@/pages/programs/details/_components/submit-milestone-form';
import { ApplicationStatus, CheckMilestoneStatus, MilestoneStatus } from '@/types/types.generated';
import { usePrivy } from '@privy-io/react-auth';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import * as ethers from 'ethers';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleAlert,
  Coins,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

function ProjectDetailsPage() {
  const [mountKey, setMountKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'terms' | 'milestones'>('terms');
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [_onChainFundingProgress, setOnChainFundingProgress] = useState<{
    targetFunding: number;
    totalInvested: number;
    fundingProgress: number;
  } | null>(null);
  const remountKey = () => setMountKey((v) => v + 1);

  const { userId, isAdmin } = useAuth();
  const { user: privyUser } = usePrivy();
  const { id, projectId } = useParams();

  const { data, refetch } = useApplicationQuery({
    variables: {
      id: projectId ?? '',
    },
    skip: !projectId,
  });

  const { data: programData, refetch: programRefetch } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
  });

  const program = programData?.program;

  const { name, keywords, network } = program ?? {};

  const contract = useContract(network || mainnetDefaultNetwork);
  const investmentContract = useInvestmentContract(network || 'educhain-testnet');

  const applicationMutationParams = {
    onCompleted: () => {
      refetch();
      programRefetch();
    },
    variables: {
      id: projectId ?? '',
    },
  };

  const [checkMilestone] = useCheckMilestoneMutation();

  const [approveApplication] = useAcceptApplicationMutation(applicationMutationParams);
  const [createInvestment] = useCreateInvestmentMutation();
  // const [denyApplication] = useRejectApplicationMutation(applicationMutationParams);

  const navigate = useNavigate();

  const handleAcceptApplication = async () => {
    try {
      let onChainProjectId: number | undefined;

      // If this is a funding program with blockchain deployment, register the project first
      if (
        program?.type === 'funding' &&
        program?.educhainProgramId !== null &&
        program?.educhainProgramId !== undefined
      ) {
        const application = data?.application;

        if (!application) {
          notify('Application data not found', 'error');
          return;
        }

        // Check if application already has an onChainProjectId
        if (application.onChainProjectId) {
          notify('This project is already registered on the blockchain', 'error');
          onChainProjectId = application.onChainProjectId;
        } else {
          notify('Registering project on blockchain...', 'loading');

          try {
            // Validate that all milestone deadlines are after funding end date
            const fundingEndDate = program.fundingEndDate ? new Date(program.fundingEndDate) : null;

            // Check for invalid milestone deadlines BEFORE attempting blockchain transaction
            if (fundingEndDate && application.milestones) {
              const invalidMilestones = application.milestones.filter((m) => {
                const milestoneDeadline = m.deadline ? new Date(m.deadline) : new Date();
                return milestoneDeadline <= fundingEndDate;
              });

              if (invalidMilestones.length > 0) {
                const milestoneNames = invalidMilestones
                  .map((m) => m.title || 'Untitled')
                  .join(', ');
                notify(
                  `Cannot accept application: The following milestones have deadlines before or on the funding end date (${fundingEndDate.toLocaleDateString()}): ${milestoneNames}. The builder must update these milestones first.`,
                  'error',
                );
                return; // Exit without proceeding
              }
            }

            // Prepare milestones for blockchain - no adjustment, just pass them as-is
            const milestones =
              application.milestones?.map((m) => ({
                title: m.title || '',
                description: m.description || '',
                percentage: Number.parseFloat(m.percentage || '0'),
                deadline: m.deadline || new Date().toISOString(),
              })) || [];

            // Prepare funding target
            const fundingTarget = application.fundingTarget || '0';

            // Call signValidate to register the project on blockchain FIRST
            const result = await investmentContract.signValidate({
              programId: program.educhainProgramId,
              projectOwner: application.applicant?.walletAddress || application.applicant?.id || '',
              projectName: application.name || '',
              targetFunding: fundingTarget,
              milestones,
            });

            if (result.projectId !== null) {
              onChainProjectId = result.projectId;
              notify(`Project registered on blockchain with ID: ${onChainProjectId}`, 'success');
            } else {
              notify('Failed to extract project ID from blockchain transaction', 'error');
              return; // Don't save to DB if we couldn't get the project ID
            }
          } catch (blockchainError) {
            // Check if user rejected the transaction
            const errorMessage =
              blockchainError instanceof Error ? blockchainError.message : String(blockchainError);
            const errorCode = (blockchainError as { code?: number })?.code;

            if (
              errorMessage.includes('User rejected') ||
              errorMessage.includes('User denied') ||
              errorCode === 4001
            ) {
              notify('Transaction canceled by user', 'error');
            } else {
              notify('Failed to register project on blockchain', 'error');
            }
            return; // Exit without saving to database
          }
        }
      }

      // Only save to database AFTER successful blockchain transaction (or if off-chain)
      await approveApplication({
        variables: {
          id: projectId ?? '',
          ...(onChainProjectId !== undefined && { onChainProjectId }),
        },
      });

      // Refetch the application data to get the updated onChainProjectId
      await refetch();
      await programRefetch();

      notify(
        onChainProjectId !== undefined
          ? `Application accepted and registered on blockchain! Project ID: ${onChainProjectId}`
          : 'Application accepted successfully',
        'success',
      );
    } catch (_error) {
      notify('Failed to accept application', 'error');
    }
  };

  // Fetch on-chain funding progress
  useEffect(() => {
    const fetchOnChainProgress = async () => {
      if (program?.educhainProgramId && data?.application?.onChainProjectId) {
        try {
          const progress = await investmentContract.getProjectFundingProgress(
            Number(data.application.onChainProjectId),
          );
          setOnChainFundingProgress({
            targetFunding: Number(progress.targetAmount),
            totalInvested: Number(progress.totalRaised),
            fundingProgress: progress.fundingProgress,
          });
        } catch (_error) {
          // Silently fail - funding progress is not critical
        }
      }
    };

    fetchOnChainProgress();
    // Refresh every 30 seconds
    const interval = setInterval(fetchOnChainProgress, 30000);
    return () => clearInterval(interval);
  }, [program?.educhainProgramId, data?.application?.onChainProjectId]);

  const handleInvest = async () => {
    try {
      if (!selectedTier || !projectId) {
        notify('Please select a tier first', 'error');
        return;
      }

      // Check if user has tier assignment for tier-based programs
      const userTierAssignment = program?.userTierAssignment;
      if (program?.fundingCondition === 'tier') {
        if (!userTierAssignment) {
          notify(
            'You are not assigned to any tier for this program. Please contact the program creator to get tier access.',
            'error',
          );
          return;
        }

        // Validate selected tier matches user's assigned tier
        if (userTierAssignment.tier !== selectedTier) {
          notify(`You can only invest in your assigned tier: ${userTierAssignment.tier}`, 'error');
          return;
        }
      }

      // Find the selected term to get the amount
      const selectedTerm = data?.application?.investmentTerms?.find(
        (term) => term.price === selectedTier,
      );
      if (!selectedTerm) {
        notify('Selected tier not found', 'error');
        return;
      }

      // Get the amount from the program tier settings or term price
      // This amount should already be in Wei format from the backend
      const amountInWei =
        program?.tierSettings?.[selectedTier as keyof typeof program.tierSettings]?.maxAmount ||
        selectedTerm.price;

      // Get token information
      const network = program?.network as keyof typeof tokenAddresses;
      const tokens = tokenAddresses[network] || tokenAddresses['educhain-testnet'];
      const targetToken = tokens.find((token) => token.name === program?.currency);

      // Validate investment amount against tier limits
      if (userTierAssignment?.remainingCapacity) {
        // remainingCapacity is likely in display format, amountInWei is in Wei
        // Convert amountInWei to display format for comparison
        const decimals = targetToken?.decimal || 18;
        const investmentAmountDisplay = ethers.utils.formatUnits(amountInWei, decimals);
        const remainingCapacity = Number.parseFloat(userTierAssignment.remainingCapacity);
        const investmentAmount = Number.parseFloat(investmentAmountDisplay);

        if (investmentAmount > remainingCapacity) {
          notify(
            `Investment exceeds your remaining capacity of ${remainingCapacity} ${program?.currency}`,
            'error',
          );
          return;
        }
      }

      let txHash: string | undefined;

      // IMPORTANT: For published programs (with educhainProgramId), blockchain transaction is REQUIRED
      if (program?.educhainProgramId !== null && program?.educhainProgramId !== undefined) {
        // Get the on-chain project ID from the application
        const onChainProjectId = data?.application?.onChainProjectId;

        // Check if project is registered (0 is a valid project ID)
        if (onChainProjectId === null || onChainProjectId === undefined) {
          notify(
            'This project needs to be registered on the blockchain before investments can be made. Please contact the program administrator.',
            'error',
          );
          return; // Don't continue with investment
        }

        try {
          // First check program status
          let programStatus = await investmentContract.getProgramStatusDetailed(
            program.educhainProgramId,
          );

          // If program is "Ready" but timestamps show it should be active, update it
          if (programStatus.status === 'Ready' && programStatus.isInFundingPeriod) {
            notify('Updating program status to Active...', 'loading');

            try {
              await investmentContract.updateProgramStatus(program.educhainProgramId);
              // Re-check the status
              programStatus = await investmentContract.getProgramStatusDetailed(
                program.educhainProgramId,
              );

              if (programStatus.status === 'Active') {
                notify('Program status updated to Active', 'success');
              }
            } catch (updateError) {
              console.error('Failed to update program status:', updateError);
              notify('Failed to update program status. Contact administrator.', 'error');
              return;
            }
          }

          if (!programStatus.isInFundingPeriod || programStatus.status !== 'Active') {
            notify(
              `Investment failed: Program is not active. Current status: ${programStatus.status}`,
              'error',
            );
            return;
          }

          const userAddress = privyUser?.wallet?.address || '';

          if (!userAddress) {
            notify('Please connect your wallet to invest', 'error');
            return;
          }

          // Check current project funding status
          try {
            await investmentContract.getProjectInvestmentDetails(Number(onChainProjectId));
          } catch (error) {
            console.error('Failed to get project funding status:', error);
          }

          // Check investment eligibility
          const eligibility = await investmentContract.checkInvestmentEligibility(
            Number(onChainProjectId),
            userAddress,
            amountInWei,
          );

          if (!eligibility.eligible) {
            if (eligibility.reason === 'Investment would exceed target funding') {
              try {
                const fundingStatus = await investmentContract.getProjectInvestmentDetails(
                  Number(onChainProjectId),
                );
                notify(
                  `Investment failed: This would exceed the funding target. Current: ${fundingStatus.totalRaised} / Target: ${fundingStatus.targetAmount} ${program?.currency}`,
                  'error',
                );
              } catch {
                notify(`Investment failed: ${eligibility.reason}`, 'error');
              }
            } else {
              notify(`Investment failed: ${eligibility.reason}`, 'error');
            }
            return;
          }

          notify('Please approve the transaction in your wallet', 'loading');

          // Call the blockchain investment function with the actual on-chain project ID
          const result = await investmentContract.investFund({
            projectId: Number(onChainProjectId), // Use the actual on-chain project ID
            amount: amountInWei, // Amount already in Wei from backend
            token: targetToken?.address, // Token address for ERC20, undefined for native
            tokenName: program?.currency ?? undefined, // Display name (EDU, USDT, etc.)
            tokenDecimals: targetToken?.decimal || 18, // Token decimals for formatting
          });

          txHash = result.txHash;
          notify('Transaction submitted! Waiting for confirmation...', 'loading');
        } catch (blockchainError) {
          // Try to extract the actual error message
          const errorMessage =
            blockchainError instanceof Error ? blockchainError.message : String(blockchainError);
          const errorCode = (blockchainError as { code?: number })?.code;

          // Check if user rejected the transaction
          if (
            errorCode === 4001 ||
            errorMessage?.includes('User rejected') ||
            errorMessage?.includes('User denied')
          ) {
            notify('Transaction cancelled by user', 'error');
          } else if (errorMessage.includes('Project not in funding period')) {
            notify(
              'Investment failed: The program is not currently accepting investments. Please check the funding period.',
              'error',
            );
          } else if (errorMessage.includes('InvalidProjectId')) {
            notify(
              `Investment failed: Project #${onChainProjectId} not found on blockchain.`,
              'error',
            );
          } else if (errorMessage.includes('InvestmentTooSmall')) {
            notify('Investment failed: Amount is below minimum requirement.', 'error');
          } else if (errorMessage.includes('InvestmentExceedsTarget')) {
            notify('Investment failed: Amount would exceed the funding target.', 'error');
          } else if (errorMessage.includes('execution reverted')) {
            notify(
              'Investment failed: Transaction was rejected by the smart contract. Please ensure the program is in its funding period.',
              'error',
            );
          } else {
            notify(`Blockchain transaction failed: ${errorMessage}`, 'error');
          }
          return;
        }
      } else {
        // Program not published to blockchain yet - this shouldn't happen for published programs
        notify(
          'Warning: This program is not published on blockchain. Contact administrator.',
          'error',
        );
        return; // Don't allow investment for non-published programs
      }

      // Only record investment in database if we have a successful blockchain transaction
      if (!txHash) {
        notify('Error: Investment requires blockchain transaction for published programs', 'error');
        return;
      }

      // Record investment in database with txHash
      // Convert Wei amount to display format for database storage
      const displayAmount = targetToken?.decimal
        ? ethers.utils.formatUnits(amountInWei, targetToken.decimal)
        : ethers.utils.formatUnits(amountInWei, 18);

      await createInvestment({
        variables: {
          input: {
            amount: displayAmount, // Store in display format in database
            projectId: projectId,
            ...(txHash && { txHash }), // Include txHash if blockchain transaction was made
          },
        },
        onCompleted: () => {
          notify(
            txHash
              ? 'Investment successfully recorded on blockchain and database!'
              : 'Investment created successfully',
            'success',
          );
          setIsInvestDialogOpen(false);
          setSelectedTier('');
          client.refetchQueries({ include: [ApplicationDocument, ProgramDocument] });
          refetch();
        },
        onError: (error) => {
          notify(error.message, 'error');
        },
      });
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  const callTx = async (
    price?: string | null,
    milestoneId?: string | null,
    milestoneIndex?: number,
  ) => {
    try {
      if (program) {
        // For investment programs, use the investment contract to approve milestones
        if (
          program.type === 'funding' &&
          program.educhainProgramId !== null &&
          program.educhainProgramId !== undefined
        ) {
          if (!data?.application?.onChainProjectId && data?.application?.onChainProjectId !== 0) {
            notify(
              'This project needs to be registered on blockchain first. Please ensure the application has been properly accepted.',
              'error',
            );
            return;
          }
          // This releases funds from the investment pool, not from validator's wallet
          const result = await investmentContract.approveMilestone(
            Number(data.application.onChainProjectId),
            milestoneIndex ?? 0, // The index of the milestone being approved
          );

          if (result?.txHash) {
            await checkMilestone({
              variables: {
                input: {
                  id: milestoneId ?? '',
                  status: CheckMilestoneStatus.Completed,
                },
              },
              onCompleted: () => {
                refetch();
                programRefetch();
                notify('Milestone approved! Funds released from investment pool.', 'success');
              },
            });
          }
        } else {
          // For regular programs, use the old flow (validator pays)
          const network = program.network as keyof typeof tokenAddresses;
          const tokens = tokenAddresses[network] || [];
          const targetToken = tokens.find((token) => token.name === program.currency);

          const tx = await contract.acceptMilestone(
            Number(program?.educhainProgramId),
            data?.application?.applicant?.walletAddress ?? '',
            price ?? '',
            targetToken ?? { name: program.currency as string },
          );

          if (tx) {
            await checkMilestone({
              variables: {
                input: {
                  id: milestoneId ?? '',
                  status: CheckMilestoneStatus.Completed,
                },
              },
              onCompleted: () => {
                refetch();
                programRefetch();
                notify('Milestone accepted successfully', 'success');
              },
            });
          } else {
            notify("Can't find acceptMilestone event", 'error');
          }
        }
      }
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  // const acceptedPrice = useMemo(
  //   () =>
  //     program?.applications
  //       ?.filter(
  //         (a) =>
  //           a.status === ApplicationStatus.Accepted || a.status === ApplicationStatus.Completed,
  //       )
  //       .reduce(
  //         (mlPrev, mlCurr) => {
  //           const mlPrice = mlCurr?.milestones?.reduce(
  //             (prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)),
  //             BigNumber(0, 10),
  //           );
  //           return mlPrev.plus(BigNumber(mlPrice ?? 0));
  //         },
  //         BigNumber(0, 10),
  //       )
  //       .toFixed() || '0',
  //   [program],
  // );

  return (
    <div className="bg-white  rounded-2xl">
      <div className="max-w-[1440px] mx-auto bg-white">
        <section className="bg-white p-10 pb-0 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <ProgramStatusBadge program={program} className="inline-flex mb-4" />

            <button
              type="button"
              onClick={() => navigate(`/investments/${id}`)}
              className="font-medium flex gap-2 items-center text-sm cursor-pointer"
            >
              Back to Program detail <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-between items-center gap-6">
            <div className="flex justify-between flex-1/2">
              <div className="flex items-center gap-4 mb-4 w-full">
                {program?.image ? (
                  <img
                    src={program?.image}
                    alt="program"
                    className="w-[148px] aspect-square rounded-xl"
                  />
                ) : (
                  <div className="bg-slate-200 w-[148px] rounded-md aspect-square" />
                )}
                <div className="w-full">
                  <h2 className="text-xl py-3 mb-2 font-bold">{name}</h2>
                  <div className="flex justify-between w-full pb-2 border-b">
                    <p className="text-muted-foreground text-sm font-bold">FUNDING DATE</p>
                    <div className="flex items-center gap-2">
                      {program?.fundingStartDate && (
                        <p className="text-sm text-foreground font-bold">
                          {format(
                            new Date(program.fundingStartDate),
                            'dd . MMM . yyyy',
                          ).toUpperCase()}
                        </p>
                      )}
                      {program?.fundingStartDate && program?.fundingEndDate && (
                        <span className="inline-block w-[10px] border-b border-muted-foreground" />
                      )}
                      {program?.fundingEndDate && (
                        <p className="text-sm text-foreground font-bold">
                          {format(
                            new Date(program.fundingEndDate),
                            'dd . MMM . yyyy',
                          ).toUpperCase()}
                        </p>
                      )}
                      {!program?.fundingStartDate && !program?.fundingEndDate && (
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between w-full pb-2 border-b mt-2">
                    <p className="text-muted-foreground text-sm font-bold">KEYWORDS</p>
                    <div className="flex gap-2">
                      {keywords?.map((k) => (
                        <Badge key={k.id}>{k.name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1/2 bg-secondary self-stretch rounded-lg p-4">
              <h2 className="text-sm text-muted-foreground font-bold mb-3">SUMMARY</h2>

              <p className="text-slate-600 text-sm line-clamp-4">{program?.summary}</p>
            </div>
          </div>

          {/* <div className="bg-secondary flex justify-between p-4 gap-6">
          <div className="flex-1/2">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="text-muted-foreground text-sm font-bold">PRICE</h4>
              <div className="flex items-center gap-2">
                <span>{getCurrency(program?.network)?.icon}</span>
                <p className="text-muted-foreground text-sm font-bold">
                  <span className="text-sm text-foreground">{acceptedPrice}</span>{' '}
                  <span className="text-muted-foreground text-xs mr-1.5">
                    {acceptedPrice && ' / '}
                    {program?.price}
                  </span>
                  <span className="text-sm text-foreground">{program?.currency}</span>
                </p>
                <div className="border-r self-stretch" />

                <span className="text-sm font-bold text-muted-foreground">
                  {getCurrency(program?.network)?.display}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b py-2">
              <h4 className="text-muted-foreground text-sm font-bold">DEADLINE</h4>
              <div className="text-sm text-foreground font-bold">
                {format(new Date(program?.deadline ?? new Date()), 'dd.MMM.yyyy').toUpperCase()}
              </div>
            </div>

            <div className="flex justify-between items-center border-b py-2.5">
              <h4 className="text-muted-foreground text-sm font-bold">KEYWORDS</h4>
              <div className="flex gap-2 mb-1 flex-wrap max-w-[70%]">
                {keywords?.map((k) => (
                  <Badge key={k.id}>{k.name}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1/2">
            <h2 className="text-sm text-muted-foreground font-bold mb-3">SUMMARY</h2>

            <p className="text-slate-600 text-sm line-clamp-3">{program?.summary}</p>
          </div>
        </div> */}

          {/* <div className="mb-4">
          <p className="flex flex-col w-fit font-sans font-bold bg-primary-light text-primary leading-4 text-xs py-1 px-2 rounded-[6px]">
            <div className="mb-1">{getCurrency(program?.network)?.display}</div>
            <div>
              <span className="inline-block mr-2">
                {data?.application?.milestones
                  ?.reduce((prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)), BigNumber(0, 10))
                  .toFixed()}{' '}
                {program?.currency} / {program?.price} {program?.currency}
              </span>
              <span className="h-3 border-l border-primary inline-block" />
              <span className="inline-block ml-2">
                DEADLINE{' '}
                {format(new Date(program?.deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
              </span>
            </div>
          </p>
        </div> */}
        </section>

        <section className="flex bg-white rounded-b-2xl">
          <div className="relative p-10 flex-[66.6%]">
            <h3 className="flex items-end mb-3">
              <span className="p-2 border-b border-b-primary font-medium text-sm">Project</span>
              <span className="block border-b w-full" />
            </h3>
            <div className="flex justify-between mb-5 pt-6">
              <div className="flex gap-4">
                <ApplicationStatusBadge application={data?.application} />
                {data?.application?.status === ApplicationStatus.Rejected && (
                  <Tooltip>
                    <TooltipTrigger className="text-destructive flex gap-2 items-center">
                      <CircleAlert className="w-5 h-5" /> View reason
                    </TooltipTrigger>
                    <TooltipContent className="text-destructive flex gap-2 items-start bg-white border shadow-[0px_4px_6px_-1px_#0000001A]">
                      <div className="mt-1.5">
                        <CircleAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-base mb-1">Reason for rejection</p>
                        <p className="text-sm">{data?.application?.rejectionReason}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {/* <div className="flex gap-2 mb-1">
              <Badge variant="default">{data?.application?.status}</Badge>
            </div> */}

              {(data?.application?.status === ApplicationStatus.Pending ||
                data?.application?.status === ApplicationStatus.Rejected) &&
                data?.application?.applicant?.id === userId && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Settings className="w-4 h-4 cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="min-w-[600px] p-6 max-h-screen overflow-y-auto">
                      <EditApplicationForm
                        application={data?.application}
                        refetch={() => {
                          refetch();
                          remountKey();
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <Link
                className="text-lg font-bold hover:underline"
                to={`/users/${data?.application?.applicant?.id}`}
              >
                {getUserName(data?.application?.applicant)}
              </Link>
            </div>
            <div className="mb-4 bg-[#0000000A] py-2 px-3 rounded-md">
              {/* <p className="font-sans font-bold bg-primary-light text-primary leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]"> */}
              <div className="w-full flex justify-between items-center">
                <h4 className="text-neutral-400 text-sm font-bold">FUNDING AMOUNT</h4>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-sm font-bold">
                    <span className="text-xl ml-3">
                      {data?.application?.milestones
                        ?.reduce(
                          (prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)),
                          BigNumber(0, 10),
                        )
                        .toFixed()}
                    </span>
                  </p>
                  <span className="text-muted-foreground">
                    {getCurrencyIcon(program?.currency)}
                  </span>

                  <span className="text-sm text-muted-foreground">{program?.currency}</span>
                </div>
              </div>

              <div className="flex items-center gap-[20px] justify-between w-full mt-4">
                <h4 className="text-neutral-400 text-sm font-bold">STATUS</h4>

                <Progress
                  value={data?.application?.fundingProgress ?? 0}
                  rootClassName="w-full"
                  indicatorClassName="bg-primary"
                />

                <p className="text-xl text-primary font-bold flex items-center">
                  {data?.application?.fundingProgress ?? 0}
                  <span className="text-sm text-muted-foreground">%</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-muted-foreground text-sm">LINKS</h2>
                <div className="">
                  {data?.application?.links?.length === 1 ? (
                    <a
                      href={data.application.links[0].url ?? ''}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 text-sm"
                    >
                      {data.application.links[0].url}
                    </a>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto text-slate-600 text-sm hover:bg-transparent"
                        >
                          {data?.application?.links?.[0]?.url}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64">
                        {data?.application?.links?.map((link) => (
                          <DropdownMenuItem key={link.url} className="cursor-pointer">
                            <a
                              href={link.url ?? ''}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2"
                            >
                              <Check className="h-4 w-4" />
                              {link.url}
                            </a>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {program?.tierSettings &&
                  Object.keys(program.tierSettings).map((tierKey) => (
                    <TierBadge key={tierKey} tier={tierKey as TierType} />
                  ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-bold text-gray-dark text-lg mb-3">APPLICATION</h2>
              <p className="text-slate-600 text-sm">{data?.application?.name}</p>
            </div>

            <div className="mb-6">
              <h2 className="font-bold text-gray-dark text-lg mb-3">SUMMARY</h2>
              <p className="text-slate-600 text-sm">{data?.application?.summary}</p>
            </div>

            <div className="mb-6">
              <h2 className="font-bold text-gray-dark text-lg mb-3">DESCRIPTION</h2>
              {data?.application?.content && (
                <MarkdownPreviewer key={mountKey} value={data?.application?.content} />
              )}
              {/* <p className="text-slate-600 text-sm">{data?.application?.content}</p> */}
            </div>

            {/* <div className="mb-6">
            <h2 className="font-bold text-gray-dark text-lg mb-3">LINKS</h2>
            {data?.application?.links?.map((l) => (
              <p className="text-slate-600 text-sm" key={l.url}>
                {l.url}
              </p>
            ))}
          </div> */}

            {/* {data?.application?.rejectionReason &&
            data?.application?.status === ApplicationStatus.Rejected &&
            data?.application.applicant?.id === userId && (
              <div className="mb-6">
                <h2 className="font-bold text-gray-dark text-lg mb-3">Rejection Reason</h2>
                <p className="text-sm text-red-400">{data?.application?.rejectionReason}</p>
              </div>
            )} */}

            {/* {data?.application?.status === ApplicationStatus.Rejected &&
            data?.application.applicant?.id === userId && (
              <p className="text-sm text-red-400">You can edit and resubmit your application.</p>
            )} */}

            {program?.validators?.some((v) => v.id === userId) &&
              data?.application?.status === ApplicationStatus.Pending && (
                <div className="flex justify-end gap-3 absolute bottom-10 right-10">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        className="h-10"
                        variant="outline"
                      >
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="min-w-[600px] p-6 max-h-screen overflow-y-auto">
                      <RejectApplicationForm
                        applicationId={projectId}
                        refetch={() => {
                          refetch();
                          programRefetch();
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button className="h-10" onClick={handleAcceptApplication}>
                    Select
                  </Button>
                </div>
              )}
          </div>

          {/* <div className="border-r" /> */}

          <div className="py-10 pr-5 flex-[33.3%] relative">
            {/* Tabs */}
            <div className="flex items-end mb-6">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('terms')}
                  type="button"
                  className={`p-2 font-medium text-sm transition-colors ${
                    activeTab === 'terms'
                      ? 'border-b border-b-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground border-b'
                  }`}
                >
                  Terms
                </button>
                <button
                  onClick={() => setActiveTab('milestones')}
                  type="button"
                  className={`p-2 font-medium text-sm transition-colors ${
                    activeTab === 'milestones'
                      ? 'border-b border-b-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground border-b'
                  }`}
                >
                  Milestones
                </button>
              </div>
              <span className="block border-b w-full" />
            </div>

            {/* Scrollable Content Area */}
            <ScrollArea className="relative pr-2 pb-10">
              {/* Terms Tab Content */}
              {activeTab === 'terms' && (
                <div className="space-y-6 pb-5">
                  {/* Display user's tier assignment if available */}
                  {program?.userTierAssignment && (
                    <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">
                            YOUR TIER ASSIGNMENT
                          </p>
                          <TierBadge tier={program.userTierAssignment.tier as TierType} />
                        </div>
                        <Badge variant="outline" className="bg-white">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Max Investment:</span>
                          <span className="font-semibold">
                            {program.userTierAssignment.maxInvestmentAmount} {program?.currency}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Already Invested:</span>
                          <span className="font-semibold">
                            {program.userTierAssignment.currentInvestment} {program?.currency}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Remaining Capacity:</span>
                          <span className="font-semibold text-primary">
                            {program.userTierAssignment.remainingCapacity} {program?.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.application?.investmentTerms?.map((t) => {
                    // Check if user can select this tier
                    const isTierBased = program?.fundingCondition === 'tier';
                    const userTierAssignment = program?.userTierAssignment;
                    const canSelectTier =
                      !isTierBased || (userTierAssignment && userTierAssignment.tier === t.price);
                    const purchaseLimitReached =
                      typeof t.purchaseLimit === 'number' &&
                      t.purchaseLimit -
                        (data?.application?.investors?.filter((i) => i.tier === t.price).length ??
                          0) <=
                        0;

                    return (
                      <button
                        disabled={
                          !canSelectTier ||
                          purchaseLimitReached ||
                          data?.application?.status !== ApplicationStatus.Accepted ||
                          (program?.fundingStartDate &&
                            new Date() < new Date(program.fundingStartDate)) ||
                          (program?.fundingEndDate && new Date() > new Date(program.fundingEndDate))
                        }
                        type="button"
                        className={cn(
                          'group block w-full text-left border rounded-lg p-4 shadow-sm cursor-pointer transition-all disabled:opacity-60',
                          selectedTier === t.price ? 'bg-[#F4F4F5]' : 'bg-white',
                        )}
                        key={t.id}
                        onClick={() => setSelectedTier(t.price || '')}
                        aria-label={`Select ${t.price} tier`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          {programData?.program?.tierSettings ? (
                            <TierBadge tier={t.price as TierType} />
                          ) : (
                            <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                              Open
                            </Badge>
                          )}

                          <div className="flex items-center gap-2">
                            {selectedTier === t.price && (
                              <div className="flex items-center bg-[#B331FF1A] p-1 rounded-full">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                            )}
                            <Badge
                              variant="secondary"
                              className="bg-primary text-white group-disabled:bg-gray-200 group-disabled:text-gray-600"
                            >
                              {t.purchaseLimit
                                ? t.purchaseLimit -
                                  (data?.application?.investors?.filter((i) => i.tier === t.price)
                                    .length ?? 0)
                                : 0}{' '}
                              left
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-1">PRICE</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">
                              {program?.tierSettings
                                ? program?.tierSettings[t.price as TierType]?.maxAmount
                                : t.price}
                            </span>
                            {getCurrencyIcon(program?.currency)}
                            <span className="text-lg font-semibold">{program?.currency}</span>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p>{t.description}</p>
                        </div>
                        {isTierBased && !canSelectTier && (
                          <div className="mt-2 text-xs text-orange-600">
                            This tier is not available for your assignment
                          </div>
                        )}
                        {program?.fundingStartDate &&
                          new Date() < new Date(program.fundingStartDate) && (
                            <div className="mt-2 text-xs text-orange-600">
                              Funding period has not started yet
                            </div>
                          )}
                        {program?.fundingEndDate &&
                          new Date() > new Date(program.fundingEndDate) && (
                            <div className="mt-2 text-xs text-orange-600">
                              Funding period has ended
                            </div>
                          )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Milestones Tab Content */}
              {activeTab === 'milestones' && (
                <div className="pb-5">
                  <Accordion type="single" collapsible>
                    {data?.application?.milestones?.map((m, idx) => (
                      <AccordionItem key={m.id} value={`${m.id}${idx}`}>
                        <AccordionTrigger>
                          <div className="flex w-full justify-between">
                            <p>{m.title}</p>{' '}
                            <MilestoneStatusBadge
                              milestone={m}
                              className="inline-flex self-center"
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex justify-between">
                            <Badge variant="secondary" className="mb-2">
                              {m.status}
                            </Badge>

                            {m.rejectionReason && m.status === MilestoneStatus.Pending && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <CircleAlert className="text-destructive w-5 h-5" />
                                </TooltipTrigger>
                                <TooltipContent className="text-destructive flex gap-2 items-start bg-white border shadow-[0px_4px_6px_-1px_#0000001A]">
                                  <div className="mt-1.5">
                                    <CircleAlert className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-base mb-1">
                                      Reason for rejection
                                    </p>
                                    <p className="text-sm">{m.rejectionReason}</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}

                            {m.status === MilestoneStatus.Pending &&
                              data?.application?.applicant?.id === userId && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Settings className="w-4 h-4 cursor-pointer" />
                                  </DialogTrigger>
                                  <DialogContent className="min-w-[600px] p-6 max-h-screen overflow-y-auto">
                                    <EditMilestoneForm milestone={m} refetch={refetch} />
                                  </DialogContent>
                                </Dialog>
                              )}
                          </div>
                          <h2 className="text-lg font-bold mb-2">Milestone #{idx + 1}</h2>

                          <div className="mb-2">
                            <div className="text-muted-foreground inline-flex items-center gap-4 bg-[#0000000A] rounded-md p-1 px-2">
                              <p className="font-medium text-sm text-neutral-400">PRICE</p>
                              <p>
                                <span className="text-primary font-bold text-xl">
                                  {m.percentage}
                                </span>{' '}
                                <span>%</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-muted-foreground inline-flex items-center gap-4 bg-[#0000000A] rounded-md p-2 mb-4">
                            <p className="font-medium text-sm text-neutral-400">DEADLINE</p>
                            <p className="text-muted-foreground">
                              {format(
                                new Date(program?.deadline ?? new Date()),
                                'dd . MMM . yyyy',
                              ).toUpperCase()}
                            </p>
                          </div>

                          <div className="mb-6">
                            <h2 className="font-bold text-gray-dark text-sm mb-3">SUMMARY</h2>
                            <p className="text-slate-600 text-xs">{m.summary}</p>
                          </div>

                          <div className="mb-6">
                            <h2 className="font-bold text-gray-dark text-sm mb-3">DESCRIPTION</h2>
                            <p className="text-slate-600 text-xs">{m.description}</p>
                          </div>

                          {m.links && m.links.length > 0 && (
                            <div className="mb-6">
                              <h2 className="font-bold text-gray-dark text-sm mb-3">LINKS</h2>
                              {m.links.map((l) => (
                                <a
                                  href={l.url ?? ''}
                                  key={l.url}
                                  className="block hover:underline text-slate-600 text-sm"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {l?.url}
                                </a>
                              ))}
                            </div>
                          )}

                          {(program?.creator?.id === userId ||
                            program?.validators?.some((v) => v.id === userId) ||
                            isAdmin ||
                            data?.application?.applicant?.id === userId) &&
                            m.file && (
                              <div className="mb-6">
                                <h2 className="font-bold text-gray-dark text-sm mb-3">UPLOAD</h2>
                                <a
                                  href={m.file ?? ''}
                                  download
                                  className="underline text-slate-600"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Click to see upload
                                </a>
                              </div>
                            )}

                          {m.status === MilestoneStatus.Submitted &&
                            program?.validators?.some((v) => v.id === userId) && (
                              <div className="flex justify-between">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      onClick={(e) => e.stopPropagation()}
                                      className="h-10"
                                      variant="outline"
                                    >
                                      Reject Milestone
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="min-w-[600px] p-6 max-h-screen overflow-y-auto">
                                    <RejectMilestoneForm
                                      milestoneId={m.id}
                                      refetch={() => {
                                        refetch();
                                        programRefetch();
                                      }}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button className="h-10" onClick={() => callTx(m.price, m.id, idx)}>
                                  Accept Milestone
                                </Button>
                              </div>
                            )}

                          {m.status === MilestoneStatus.Pending &&
                            data?.application?.status === ApplicationStatus.Accepted &&
                            data?.application?.applicant?.id === userId && (
                              <Dialog>
                                <DialogTrigger
                                  asChild
                                  disabled={
                                    (idx !== 0 &&
                                      data?.application?.milestones?.[idx - 1]?.status !==
                                        MilestoneStatus.Completed) ||
                                    // Prevent milestone submission before funding ends
                                    (program?.fundingEndDate &&
                                      new Date() <= new Date(program.fundingEndDate))
                                  }
                                >
                                  <Button
                                    className="h-10 block ml-auto"
                                    title={
                                      program?.fundingEndDate &&
                                      new Date() <= new Date(program.fundingEndDate)
                                        ? `Milestones can only be submitted after funding ends on ${new Date(program.fundingEndDate).toLocaleDateString()}`
                                        : undefined
                                    }
                                  >
                                    Submit Milestone
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogTitle />
                                  <DialogDescription />
                                  <DialogClose id="submit-milestone-dialog-close" />
                                  <SubmitMilestoneForm
                                    milestone={m}
                                    refetch={refetch}
                                    program={program}
                                  />
                                </DialogContent>
                              </Dialog>
                            )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Invest Button - Only show when terms tab is active */}
              {activeTab === 'terms' && (
                <div className="absolute bottom-0 left-0 right-0">
                  <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        disabled={
                          !selectedTier ||
                          data?.application?.status !== ApplicationStatus.Accepted ||
                          (program?.fundingStartDate &&
                            new Date() < new Date(program.fundingStartDate)) ||
                          (program?.fundingEndDate && new Date() > new Date(program.fundingEndDate))
                        }
                        className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2"
                        onClick={() => {
                          if (!selectedTier) {
                            notify('Please select a tier first', 'error');
                            return;
                          }
                          if (
                            program?.fundingStartDate &&
                            new Date() < new Date(program.fundingStartDate)
                          ) {
                            notify('Funding period has not started yet', 'error');
                            return;
                          }
                          if (
                            program?.fundingEndDate &&
                            new Date() > new Date(program.fundingEndDate)
                          ) {
                            notify('Funding period has ended', 'error');
                            return;
                          }
                        }}
                      >
                        <TrendingUp className="w-5 h-5" />
                        Invest
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <div className="text-lg font-semibold flex items-center justify-center">
                        <span className="flex justify-center items-center w-[42px] h-[42px] rounded-full bg-[#B331FF1A]">
                          <Coins className="text-primary" />
                        </span>
                      </div>
                      <DialogTitle className="text-center font-semibold text-lg">
                        Are you sure to pay the settlement for the project?
                      </DialogTitle>
                      {/* {selectedTier && (
                        <div className="text-center mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Selected Tier:</p>
                          <div className="inline-flex items-center gap-2">
                            {programData?.program?.tierSettings ? (
                              <TierBadge tier={selectedTier as TierType} />
                            ) : (
                              <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                                {selectedTier}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Amount: {program?.tierSettings?.[selectedTier as keyof typeof program.tierSettings]?.maxAmount || selectedTier} {program?.currency}
                          </p>
                        </div>
                      )} */}
                      <DialogDescription className="text-sm text-muted-foreground text-center">
                        The amount will be securely stored until you will confirm the completion of
                        the project.
                      </DialogDescription>

                      <Button onClick={handleInvest} className="bg-foreground text-white">
                        Yes, Pay now
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </ScrollArea>
          </div>
        </section>

        {/* User's Investments Section */}
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
