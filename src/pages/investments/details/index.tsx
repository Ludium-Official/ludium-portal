// import { useAcceptProgramMutation } from '@/apollo/mutation/accept-program.generated';
import { useAcceptProgramMutation } from '@/apollo/mutation/accept-program.generated';

import { useSubmitProgramMutation } from '@/apollo/mutation/submit-program.generated';
import { useProgramQuery } from '@/apollo/queries/program.generated';

import { AdminDropdown } from '@/components/admin-dropdown';
import { MarkdownPreviewer } from '@/components/markdown';
import { ProgramStatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { ShareButton } from '@/components/ui/share-button';
import { Tabs } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
// import { tokenAddresses } from '@/constant/token-address';
import { useAuth } from '@/lib/hooks/use-auth';
import { getInvestmentContract } from '@/lib/hooks/use-investment-contract';
import { TOKEN_CONFIGS } from '@/lib/investment-helpers';
import notify from '@/lib/notify';
import { cn, getInitials, getUserName, mainnetDefaultNetwork } from '@/lib/utils';
import ProjectCard from '@/pages/investments/details/_components/project-card';
import SupportersModal from '@/pages/investments/details/_components/supporters-modal';
import RejectProgramForm from '@/pages/programs/details/_components/reject-program-form';
// import RejectProgramForm from '@/pages/programs/details/_components/reject-program-form';
import { FundingCondition, ProgramStatus, ProgramVisibility } from '@/types/types.generated';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { format } from 'date-fns';
import { CircleAlert, Settings, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { http, type Chain, type PublicClient, createPublicClient } from 'viem';
import { arbitrumSepolia, baseSepolia, eduChainTestnet } from 'viem/chains';

function getChainForNetwork(network: string) {
  const chainMap: Record<string, Chain> = {
    'educhain-testnet': eduChainTestnet,
    'base-sepolia': baseSepolia,
    'arbitrum-sepolia': arbitrumSepolia,
  };
  return chainMap[network] || eduChainTestnet;
}

const InvestmentDetailsPage: React.FC = () => {
  const { userId, isAdmin, isLoggedIn } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSupportersModalOpen, setIsSupportersModalOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    setIsMobileDevice(isMobile);
  }, []);

  const {
    data,
    refetch,
    error: programError,
  } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
    fetchPolicy: 'network-only', // Force fresh data from server
  });

  const program = data?.program;

  // Check if funding is currently active
  const isFundingActive = () => {
    if (!program?.fundingStartDate || !program?.fundingEndDate) return false;
    const now = new Date();
    const fundingStart = new Date(program.fundingStartDate);
    const fundingEnd = new Date(program.fundingEndDate);
    return now >= fundingStart && now <= fundingEnd;
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

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const [acceptProgram] = useAcceptProgramMutation({
    variables: {
      id: program?.id ?? '',
    },
    onCompleted: () => {
      refetch();
    },
  });
  const [publishProgram] = useSubmitProgramMutation();

  // const contract = useContract(program?.network || mainnetDefaultNetwork);
  const { sendTransaction, user } = usePrivy();
  const { wallets } = useWallets();

  const callTx = async () => {
    try {
      if (program) {
        // Step 1: Deploy to blockchain if user wants blockchain integration
        let txHash: string | null = null;
        let blockchainProgramId: number | null = null;

        if (program.network !== 'off-chain') {
          notify('Deploying to blockchain...');

          // Switch to the correct network if needed
          const chain = getChainForNetwork(program.network ?? mainnetDefaultNetwork);

          // Check if we have a wallet and switch network if needed
          const currentWallet = wallets.find((wallet) => wallet.address === user?.wallet?.address);
          if (currentWallet?.switchChain) {
            try {
              await currentWallet.switchChain(chain.id);
              notify(`Switched to ${chain.name} network`, 'success');
            } catch (error) {
              console.warn('Failed to switch network:', error);
              // Continue anyway, Privy modal will handle network switching
            }
          }

          // Create public client for the network with proper chain configuration
          const publicClient = createPublicClient({
            chain,
            transport: http(chain.rpcUrls.default.http[0]),
          }) as PublicClient;

          // Check if user is using an external wallet (MetaMask, etc.)
          const isExternalWallet =
            user?.wallet?.connectorType && user.wallet.connectorType !== 'embedded';

          console.log('Wallet detection for investment program:', {
            connectorType: user?.wallet?.connectorType,
            isExternalWallet,
            currentWallet: currentWallet?.address,
            userWalletAddress: user?.wallet?.address,
          });

          // Create a custom sendTransaction function for external wallets
          let customSendTransaction = sendTransaction;

          if (isExternalWallet && currentWallet) {
            console.log('Using external wallet for investment program deployment');
            // For external wallets, we need to handle transactions differently
            // @ts-ignore - We're overriding the type to handle external wallets
            customSendTransaction = async (input, _uiOptions) => {
              try {
                // Get the provider from the wallet
                const eip1193Provider = await currentWallet.getEthereumProvider();
                const { ethers } = await import('ethers');
                const provider = new ethers.providers.Web3Provider(eip1193Provider);
                const signer = provider.getSigner();

                // Send the transaction directly
                const txResponse = await signer.sendTransaction({
                  to: input.to,
                  data: input.data,
                  value: input.value?.toString() || '0',
                  chainId: input.chainId,
                });

                return { hash: txResponse.hash as `0x${string}` };
              } catch (error) {
                console.error('External wallet transaction error:', error);
                throw error;
              }
            };
          } else if (isExternalWallet && !currentWallet) {
            console.warn('External wallet detected but currentWallet not found, trying fallback');
            // Fallback: Try to use the first wallet if available
            const fallbackWallet = wallets[0];
            if (fallbackWallet) {
              console.log('Using fallback wallet:', fallbackWallet.address);
              // @ts-ignore
              customSendTransaction = async (input, _uiOptions) => {
                try {
                  const eip1193Provider = await fallbackWallet.getEthereumProvider();
                  const { ethers } = await import('ethers');
                  const provider = new ethers.providers.Web3Provider(eip1193Provider);
                  const signer = provider.getSigner();

                  const txResponse = await signer.sendTransaction({
                    to: input.to,
                    data: input.data,
                    value: input.value?.toString() || '0',
                    chainId: input.chainId,
                  });

                  return { hash: txResponse.hash as `0x${string}` };
                } catch (error) {
                  console.error('Fallback wallet transaction error:', error);
                  throw error;
                }
              };
            }
          } else {
            console.log('Using Privy embedded wallet or default sendTransaction');
          }

          // Get the investment contract for the selected network
          // The contract will use the chainId to ensure transactions go to the correct network
          const investmentContract = getInvestmentContract(
            program.network ?? mainnetDefaultNetwork,
            customSendTransaction,
            publicClient,
          );

          // Get validator wallet addresses from the form data
          const currentUserAddress =
            user?.wallet?.address || '0x0000000000000000000000000000000000000000';

          let validatorAddresses: string[] = [];

          if ((program?.validators?.length ?? 0) > 0) {
            // Use the wallet addresses provided by the form
            // validatorAddresses = args.validatorWalletAddresses.filter((addr) => addr && addr !== '');

            validatorAddresses = program?.validators?.map((v) => v.walletAddress ?? '') ?? [];

            // Validate that we have wallet addresses for all validators
            if (validatorAddresses.length !== (program?.validators?.length ?? 0)) {
              // Fill missing addresses with current user address
              while (validatorAddresses.length < (program?.validators?.length ?? 0)) {
                validatorAddresses.push(currentUserAddress);
              }
            }
          } else if ((program?.validators?.length ?? 0) > 0) {
            // No wallet addresses provided but validators selected - use current user as fallback
            validatorAddresses = program?.validators?.map(() => currentUserAddress) ?? [];
          } else {
            // No validators specified - use current user as default validator
            validatorAddresses = [currentUserAddress];
          }

          // Determine the funding token address based on the program's currency
          let fundingTokenAddress = '0x0000000000000000000000000000000000000000'; // Default to native token

          // Check if it's not a native token (EDU, ETH)
          if (program?.currency && program.currency !== 'EDU' && program.currency !== 'ETH') {
            // Get the network key (convert to lowercase and replace spaces)
            const networkKey =
              program?.network?.toLowerCase().replace(' ', '-') || 'educhain-testnet';
            // Map network to TOKEN_CONFIGS key
            const tokenConfigKey =
              networkKey === 'educhain-testnet'
                ? 'educhain'
                : networkKey === 'base-sepolia'
                  ? 'base-sepolia'
                  : networkKey === 'arbitrum-sepolia'
                    ? 'arbitrum-sepolia'
                    : networkKey === 'sepolia'
                      ? 'sepolia'
                      : 'educhain';

            const networkConfig = TOKEN_CONFIGS[tokenConfigKey as keyof typeof TOKEN_CONFIGS];
            if (networkConfig) {
              const tokenConfig = networkConfig[program.currency as keyof typeof networkConfig];
              if (tokenConfig) {
                fundingTokenAddress = tokenConfig.address;
                console.log(
                  `Using ${program.currency} token address:`,
                  fundingTokenAddress,
                  'on network:',
                  tokenConfigKey,
                );
              } else {
                console.warn(
                  `Token ${program.currency} not found in TOKEN_CONFIGS for network ${tokenConfigKey}`,
                );
              }
            } else {
              console.warn(`Network ${tokenConfigKey} not found in TOKEN_CONFIGS`);
            }
          } else {
            console.log(`Using native token for currency: ${program?.currency || 'default'}`);
          }

          // Determine token decimals based on currency
          const tokenDecimals =
            program?.currency === 'USDT' || program?.currency === 'USDC' ? 6 : 18;

          const contractResult = await investmentContract.createInvestmentProgram({
            name: program?.name ?? '',
            description: program?.description ?? '',
            fundingGoal: program?.price || '0',
            fundingToken: fundingTokenAddress,
            tokenDecimals, // Pass correct decimals for USDT/USDC
            applicationStartDate: program?.applicationStartDate || '',
            applicationEndDate: program?.applicationEndDate || '',
            fundingStartDate: program?.fundingStartDate || '',
            fundingEndDate: program?.fundingEndDate || '',
            feePercentage: program?.feePercentage || 300, // 3% default
            validators: validatorAddresses,
            requiredValidations: validatorAddresses.length,
            fundingCondition: program?.fundingCondition === 'tier' ? 'tier' : 'open',
          });

          // Store the program ID from blockchain
          blockchainProgramId = contractResult.programId;
          txHash = contractResult.txHash;

          console.log('Contract deployment result:', contractResult);
          console.log('Program ID:', blockchainProgramId);
          console.log('TX Hash:', txHash);

          if (blockchainProgramId !== null && blockchainProgramId !== undefined) {
            notify(
              `Blockchain deployment successful! Program ID: ${blockchainProgramId}`,
              'success',
            );
          } else {
            notify('Blockchain deployment successful!', 'success');
          }
        }

        // For off-chain programs or blockchain programs
        if (program.network === 'off-chain') {
          // For off-chain programs, just publish without blockchain details
          await publishProgram({
            variables: {
              id: program?.id ?? '',
              educhainProgramId: 0, // No blockchain ID for off-chain
              txHash: '', // No tx hash for off-chain
            },
          });
          notify('Program published successfully', 'success');
          refetch(); // Refresh the program data
          // Close the dialog
          document.getElementById('pay-dialog-close')?.click();
        } else if (txHash) {
          // For blockchain programs, we have a transaction hash
          // Use program ID if available, otherwise use 0 (transaction was successful but ID extraction failed)
          await publishProgram({
            variables: {
              id: program?.id ?? '',
              educhainProgramId: blockchainProgramId ?? 0,
              txHash: txHash,
            },
          });

          if (blockchainProgramId !== null && blockchainProgramId !== undefined) {
            notify('Program published successfully with blockchain ID!', 'success');
          } else {
            notify(
              'Program published! Transaction successful but program ID could not be extracted. Check blockchain explorer.',
              'success',
            );
          }

          refetch(); // Refresh the program data
          // Close the dialog
          document.getElementById('pay-dialog-close')?.click();
        } else {
          notify('Failed to deploy to blockchain. Please try again.', 'error');
        }
      }
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  if (programError?.message === 'You do not have access to this program') {
    return (
      <div className="text-center bg-white rounded-2xl p-10">
        <p className="text-lg font-bold mb-10">You do not have access to this program</p>
        <Link to="/investments" className="text-primary hover:underline font-semibold">
          Go back to investments
        </Link>
      </div>
    );
  }

  // Projects section component
  const ProjectsSection = () => (
    <div className="bg-white rounded-2xl p-4 md:p-10 mt-0 md:mt-3">
      <div className="max-w-full md:max-w-[1440px] mx-auto" id="applications">
        <h2 className="text-xl font-bold mb-4">Projects</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {!data?.program?.applications?.length && (
            <div className="text-slate-600 text-sm col-span-full">No applications yet.</div>
          )}
          {data?.program?.applications?.map((a) => (
            <ProjectCard key={a.id} application={a} program={data?.program} />
          ))}
        </section>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F7F7F7]">
      {/* Show Projects first on mobile when funding is active */}
      {isMobileDevice && isFundingActive() && <ProjectsSection />}

      <div
        className={`bg-white p-4 md:p-10 rounded-2xl ${
          isMobileDevice && isFundingActive() ? 'mt-3' : ''
        }`}
      >
        <section className="max-w-full md:max-w-[1440px] mx-auto">
          <ProgramStatusBadge program={program} className="inline-flex mb-2" />

          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h1 className="text-xl md:text-2xl font-bold">{program?.name}</h1>
            <div className="flex flex-wrap justify-start md:justify-end items-center gap-2">
              {(program?.creator?.id === userId || isAdmin) &&
                program?.fundingCondition === FundingCondition.Tier && (
                  <>
                    <Button
                      className="flex gap-2 items-center bg-primary hover:bg-primary/90 text-white"
                      onClick={() => setIsSupportersModalOpen(true)}
                    >
                      Manage Supporters
                    </Button>
                    <SupportersModal
                      isOpen={isSupportersModalOpen}
                      onOpenChange={setIsSupportersModalOpen}
                      program={program}
                      programId={id ?? ''}
                      onRefetch={refetch}
                    />
                  </>
                )}

              {isAdmin && (
                <AdminDropdown
                  entityId={program?.id || ''}
                  entityType="program"
                  entityVisibility={program?.visibility || ProgramVisibility.Public}
                />
              )}
              {(program?.creator?.id === userId || isAdmin) && (
                <Link to={`/investments/${program?.id}/edit`}>
                  <Button variant="ghost" className="flex gap-2 items-center">
                    Edit <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              <ShareButton program={program ?? undefined} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Overview */}
            <div className="w-full lg:max-w-[360px]">
              <h3 className="flex items-end mb-3">
                <span className="p-2 border-b border-b-primary font-medium text-sm">Overview</span>
                <span className="block border-b w-full" />
              </h3>

              {/* Temporary image placeholder until the actual image is added */}
              {/* <div className='bg-[#eaeaea] w-full rounded-xl aspect-square mb-6' /> */}
              {program?.image ? (
                <img
                  src={program?.image}
                  alt="program"
                  className="w-full aspect-square rounded-xl mb-6"
                />
              ) : (
                <div className="bg-[#eaeaea] w-full rounded-xl aspect-square mb-6" />
              )}

              {/* <div className="flex justify-end text-sm font-bold text-muted-foreground">
              {getCurrency(program?.network)?.display}
            </div>
            <div className="flex justify-between items-center font-bold mb-6">
              <p className="text-muted-foreground text-sm">PRICE</p>

              <div className="flex gap-2 items-center">
                <span>{getCurrency(program?.network)?.icon}</span>
                <p>
                  <span className="text-xl">{acceptedPrice}</span>{' '}
                  <span className="text-muted-foreground text-xs mr-1.5">
                    {acceptedPrice && ' / '}
                    {program?.price}
                  </span>
                  {program?.currency}
                </p>
              </div>
            </div>

            <div className="w-full border-b mb-6" />

            <div className="flex justify-between items-center font-bold ">
              <p className="text-muted-foreground text-sm">DEADLINE</p>

              <p className="text-xl leading-7">
                {format(new Date(program?.deadline ?? new Date()), 'dd.MMM.yyyy').toUpperCase()}
              </p>
            </div> */}

              {/* {
              isLoggedIn &&
              program?.status === 'published' &&
              program.creator?.id !== userId &&
              program?.validators?.every((validator) => validator.id !== userId) &&
              (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={(e) => {
                        if (!isAuthed) {
                          notify('Please add your email', 'success');
                          navigate('/my-profile/edit');
                          return;
                        }

                        e.stopPropagation();
                      }}
                      className="mt-6 mb-3 text-sm w-full h-11 font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px]"
                    >
                      Submit application
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[800px] min-h-[760px] z-50 w-full max-w-full md:max-w-[1440px] p-6 max-h-screen overflow-y-auto">
                    <CreateApplicationForm program={program} />
                  </DialogContent>
                </Dialog>
              )} */}

              <div className="mt-6">
                <div className="space-y-3">
                  {/* Application Step */}
                  {(() => {
                    const isApplicationActive =
                      program?.applicationStartDate &&
                      program?.applicationEndDate &&
                      new Date() >= new Date(program.applicationStartDate) &&
                      new Date() <= new Date(program.applicationEndDate);

                    return (
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            isApplicationActive ? 'bg-green-500' : 'bg-gray-400',
                          )}
                        />
                        <div className="flex items-center justify-between gap-4 flex-1">
                          <span
                            className={cn(
                              'font-bold text-sm',
                              isApplicationActive ? 'text-gray-900' : 'text-gray-400',
                            )}
                          >
                            APPLICATION
                          </span>
                          <span
                            className={cn(
                              'font-bold text-sm',
                              isApplicationActive ? 'text-gray-900' : 'text-gray-400',
                            )}
                          >
                            {program?.applicationStartDate && program?.applicationEndDate
                              ? `${format(
                                  new Date(program.applicationStartDate),
                                  'dd. MMM. yyyy',
                                ).toUpperCase()} – ${format(
                                  new Date(program.applicationEndDate),
                                  'dd. MMM. yyyy',
                                ).toUpperCase()}`
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Funding Step */}
                  {(() => {
                    const isFundingActive =
                      program?.fundingStartDate &&
                      program?.fundingEndDate &&
                      new Date() >= new Date(program.fundingStartDate) &&
                      new Date() <= new Date(program.fundingEndDate);

                    return (
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            isFundingActive ? 'bg-green-500' : 'bg-gray-400',
                          )}
                        />
                        <div className="flex items-center justify-between gap-4 flex-1">
                          <span
                            className={cn(
                              'font-bold text-sm',
                              isFundingActive ? 'text-gray-900' : 'text-gray-400',
                            )}
                          >
                            FUNDING
                          </span>
                          <span
                            className={cn(
                              'font-bold text-sm',
                              isFundingActive ? 'text-gray-900' : 'text-gray-400',
                            )}
                          >
                            {program?.fundingStartDate && program?.fundingEndDate
                              ? `${format(
                                  new Date(program.fundingStartDate),
                                  'dd. MMM. yyyy',
                                ).toUpperCase()} – ${format(
                                  new Date(program.fundingEndDate),
                                  'dd. MMM. yyyy',
                                ).toUpperCase()}`
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-muted-foreground text-sm font-bold mb-3">KEYWORDS</p>

                <div className="flex gap-2 flex-wrap">
                  {program?.keywords?.map((k) => (
                    <Badge key={k.id} variant="secondary">
                      {k.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-muted-foreground text-sm font-bold mb-3">SUMMARY</p>

                <p className="text-slate-600 text-sm whitespace-pre-wrap">{program?.summary}</p>
              </div>

              {!!program?.links?.length && (
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm font-bold mb-3">PROGRAM LINKS</p>
                  {program?.links?.map((l) => (
                    <a
                      href={l?.url ?? ''}
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

              <Button
                size="lg"
                className="w-full mt-6"
                disabled={
                  !isLoggedIn ||
                  program?.status !== 'published' ||
                  program?.creator?.id === userId ||
                  program?.validators?.some((validator) => validator.id === userId) ||
                  (program?.applicationStartDate &&
                    new Date() < new Date(program.applicationStartDate)) ||
                  (program?.applicationEndDate && new Date() > new Date(program.applicationEndDate))
                }
                onClick={() => navigate(`/investments/${program?.id}/create-project`)}
              >
                Submit Project
              </Button>

              {program?.validators?.some((v) => v.id === userId) &&
                program.status === ProgramStatus.Pending && (
                  <div className="flex justify-end gap-2 w-full mt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-11 flex-1">
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="min-w-[800px] p-0 max-h-screen overflow-y-auto">
                        <RejectProgramForm programId={program.id} refetch={refetch} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={async () => {
                        await acceptProgram();
                        notify('Program accepted', 'success');
                      }}
                      className="h-11 flex-1"
                    >
                      Confirm
                    </Button>
                  </div>
                )}

              {program?.creator?.id === userId &&
                program.status === ProgramStatus.PaymentRequired && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-3 text-sm font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px] w-full h-11">
                        Pay
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[400px] p-6 max-h-screen overflow-y-auto">
                      <DialogClose id="pay-dialog-close" />
                      <div className="text-center">
                        <span className="text-red-600 w-[42px] h-[42px] rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                          <TriangleAlert />
                        </span>
                        <DialogTitle className="font-semibold text-lg text-[#18181B] mb-2">
                          Are you sure to pay the settlement for the program?
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm mb-4">
                          The amount will be securely stored until you will confirm the completion
                          of the project.
                        </DialogDescription>
                        <Button onClick={callTx}>Yes, Pay now</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

              {program?.status === ProgramStatus.Rejected && program.creator?.id === userId && (
                <div className="flex justify-end gap-2 w-full mt-3">
                  <Button disabled className="h-11 flex-1">
                    Rejected
                  </Button>
                </div>
              )}

              {program?.status === ProgramStatus.Rejected &&
                program.validators?.some((v) => v.id === userId) && (
                  <div className="flex justify-end gap-2 w-full mt-3">
                    <Button disabled variant="outline" className="h-11 flex-1">
                      Rejection Reason Submitted
                    </Button>
                  </div>
                )}

              <div className="mt-6">
                <p className="text-muted-foreground text-sm font-bold mb-3">PROGRAM HOST</p>
                <div className="border rounded-xl w-full p-4 mb-6">
                  <span className="items-center text-secondary-foreground gap-2 bg-gray-light px-2.5 py-0.5 rounded-full font-semibold text-sm inline-flex mb-3">
                    <span
                      className={cn('bg-gray-400 w-[14px] h-[14px] rounded-full block', {
                        'bg-green-400':
                          program?.status === ProgramStatus.Published ||
                          program?.status === ProgramStatus.Completed,
                      })}
                    />
                    {program?.status === ProgramStatus.Published ||
                    program?.status === ProgramStatus.Completed
                      ? 'Confirmed'
                      : 'Not confirmed'}
                  </span>

                  <Link
                    to={`/users/${program?.creator?.id}`}
                    className="flex gap-2 items-center text-lg font-bold mb-5"
                  >
                    {/* <div className="w-10 h-10 bg-gray-200 rounded-full" /> */}

                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={program?.creator?.image || ''}
                        alt={`${program?.creator?.firstName} ${program?.creator?.lastName}`}
                      />
                      <AvatarFallback>
                        {getInitials(
                          `${program?.creator?.firstName || ''} ${
                            program?.creator?.lastName || ''
                          }`,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-bold">{getUserName(program?.creator)}</p>
                  </Link>

                  <div className="flex gap-3 mb-4">
                    <p className="text-xs font-bold w-[57px]">Summary</p>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {program?.creator?.summary}
                    </p>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <p className="text-xs font-bold w-[57px]">Email</p>
                    <p className="text-xs">{program?.creator?.email}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {program?.creator?.keywords?.map((k) => (
                      <Badge key={k.id} variant="secondary" className="text-xs font-semibold">
                        {k.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {!!program?.validators?.length && (
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm font-bold mb-3">PROGRAM VALIDATOR</p>

                  {program.validators.map((validator) => (
                    <div className="border rounded-xl w-full p-6 mb-6" key={validator.id}>
                      {/* <ProgramStatusBadge program={program} className='inline-flex mb-3' /> */}
                      <div className="flex justify-between items-center  mb-3">
                        <span className="items-center text-secondary-foreground gap-2 bg-gray-light px-2.5 py-0.5 rounded-full font-semibold text-sm inline-flex">
                          <span
                            className={cn('bg-gray-400 w-[14px] h-[14px] rounded-full block', {
                              'bg-red-200': program.status === ProgramStatus.Rejected,
                              'bg-green-400':
                                program.status !== ProgramStatus.Pending &&
                                program.status !== ProgramStatus.Rejected,
                              'bg-gray-400': program.status === ProgramStatus.Pending,
                            })}
                          />
                          {program.status === ProgramStatus.Rejected
                            ? 'Rejected'
                            : program.status === ProgramStatus.Pending
                              ? 'Not confirmed'
                              : 'Accepted'}
                        </span>

                        {program.status === ProgramStatus.Rejected && program.rejectionReason && (
                          <Tooltip>
                            <TooltipTrigger className="text-destructive flex gap-2 items-center">
                              <CircleAlert className="w-4 h-4" />{' '}
                              <p className="text-sm font-medium underline">View reason</p>
                            </TooltipTrigger>
                            <TooltipContent className="text-destructive flex gap-2 items-start bg-white border shadow-[0px_4px_6px_-1px_#0000001A]">
                              <div className="mt-1.5">
                                <CircleAlert className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium text-base mb-1">Reason for rejection</p>
                                <p className="text-sm">{program.rejectionReason}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <Link
                        to={`/users/${program?.creator?.id}`}
                        className="flex gap-2 items-center text-lg font-bold"
                      >
                        {/* <div className="w-10 h-10 bg-gray-200 rounded-full" /> */}

                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={validator?.image || ''}
                            alt={`${validator?.firstName} ${validator?.lastName}`}
                          />
                          <AvatarFallback>
                            {getInitials(
                              `${validator?.firstName || ''} ${validator?.lastName || ''}`,
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm mb-2">{getUserName(validator)}</p>

                          <div className="flex gap-2 flex-wrap">
                            {validator?.keywords?.map((k) => (
                              <Badge
                                key={k.id}
                                variant="secondary"
                                className="text-xs font-semibold"
                              >
                                {k.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Funding Condition */}
              {program?.fundingCondition && (
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm font-bold mb-3">FUNDING CONDITION</p>
                  <p className="text-slate-600 text-sm capitalize">
                    {program.fundingCondition === 'tier' ? 'Tier-based' : program.fundingCondition}
                  </p>
                </div>
              )}

              {/* Tier Settings */}
              {program?.fundingCondition === 'tier' && program?.tierSettings && (
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm font-bold mb-3">TIER SETTINGS</p>
                  <div className="space-y-2">
                    {program.tierSettings.bronze?.enabled && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Bronze</span>
                        <span className="text-sm text-gray-600">
                          Max: {program.tierSettings.bronze.maxAmount} {program.currency}
                        </span>
                      </div>
                    )}
                    {program.tierSettings.silver?.enabled && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Silver</span>
                        <span className="text-sm text-gray-600">
                          Max: {program.tierSettings.silver.maxAmount} {program.currency}
                        </span>
                      </div>
                    )}
                    {program.tierSettings.gold?.enabled && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Gold</span>
                        <span className="text-sm text-gray-600">
                          Max: {program.tierSettings.gold.maxAmount} {program.currency}
                        </span>
                      </div>
                    )}
                    {program.tierSettings.platinum?.enabled && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Platinum</span>
                        <span className="text-sm text-gray-600">
                          Max: {program.tierSettings.platinum.maxAmount} {program.currency}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fee Information */}
              {(program?.feePercentage || program?.customFeePercentage) && (
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm font-bold mb-3">PLATFORM FEE</p>
                  <p className="text-slate-600 text-sm">
                    {program.feePercentage
                      ? `${(program.feePercentage / 100).toFixed(1)}% (Default)`
                      : program.customFeePercentage
                        ? `${(program.customFeePercentage / 100).toFixed(1)}% (Custom)`
                        : 'Not Set'}
                  </p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="w-full">
              <h3 className="flex items-end">
                <span className="p-2 border-b border-b-primary font-medium text-sm">Details</span>
                <span className="block border-b w-full" />
              </h3>

              <div className="mt-3">
                {program?.description && <MarkdownPreviewer value={program?.description} />}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Show Projects section normally when not mobile or funding is not active */}
      {(!isMobileDevice || !isFundingActive()) && <ProjectsSection />}
    </div>
  );
};

export default InvestmentDetailsPage;
