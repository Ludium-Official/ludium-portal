import { useAcceptApplicationMutation } from '@/apollo/mutation/accept-application.generated';
import { useCheckMilestoneMutation } from '@/apollo/mutation/check-milestone.generated';
import { useCreateInvestmentMutation } from '@/apollo/mutation/create-investment.generated';
// import { useRejectApplicationMutation } from '@/apollo/mutation/reject-application.generated';
import { useApplicationQuery } from '@/apollo/queries/application.generated';
import { useProgramQuery } from '@/apollo/queries/program.generated';
import MarkdownPreviewer from '@/components/markdown/markdown-previewer';
import { ApplicationStatusBadge, MilestoneStatusBadge, ProgramStatusBadge } from '@/components/status-badge';
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
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tokenAddresses } from '@/constant/token-address';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import notify from '@/lib/notify';
import { getCurrency, getCurrencyIcon, getUserName, mainnetDefaultNetwork } from '@/lib/utils';
import { TierBadge, type TierType } from '@/pages/investments/_components/tier-badge';
// import ProgramStatusBadge from '@/pages/programs/_components/program-status-badge';
import EditApplicationForm from '@/pages/programs/details/_components/edit-application-from';
import EditMilestoneForm from '@/pages/programs/details/_components/edit-milestone-form';
import RejectApplicationForm from '@/pages/programs/details/_components/reject-application-form';
import RejectMilestoneForm from '@/pages/programs/details/_components/reject-milestone-form';
import SubmitMilestoneForm from '@/pages/programs/details/_components/submit-milestone-form';
import { ApplicationStatus, CheckMilestoneStatus, MilestoneStatus } from '@/types/types.generated';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import { ArrowUpRight, Check, CircleAlert, Coins, Settings, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

function ProjectDetailsPage() {
  const [mountKey, setMountKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'terms' | 'milestones'>('terms');
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const remountKey = () => setMountKey((v) => v + 1);

  const { userId, isAdmin } = useAuth();
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

  const handleInvest = async () => {
    try {
      if (!selectedTier || !projectId) {
        notify('Please select a tier first', 'error');
        return;
      }

      // Find the selected term to get the amount
      const selectedTerm = data?.application?.investmentTerms?.find(term => term.price === selectedTier);
      if (!selectedTerm) {
        notify('Selected tier not found', 'error');
        return;
      }

      // Get the amount from the program tier settings or term price
      const amount = program?.tierSettings?.[selectedTier as keyof typeof program.tierSettings]?.maxAmount || selectedTerm.price;

      await createInvestment({
        variables: {
          input: {
            amount: amount,
            projectId: projectId,
          }
        },
        onCompleted: () => {
          notify('Investment created successfully', 'success');
          setIsInvestDialogOpen(false);
          refetch();
        },
        onError: (error) => {
          notify(error.message, 'error');
        }
      });
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  const callTx = async (price?: string | null, applicationId?: string | null) => {
    try {
      if (program) {
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
                id: applicationId ?? '',
                status: CheckMilestoneStatus.Completed,
              },
            },
            onCompleted: () => {
              refetch();
              programRefetch();
            },
          });

          notify('Milestone accept successfully', 'success');
        } else {
          notify("Can't found acceptMilestone event", 'error');
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
              onClick={() => navigate(-1)}
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
                          {format(new Date(program.fundingStartDate), 'dd . MMM . yyyy').toUpperCase()}
                        </p>
                      )}
                      {program?.fundingStartDate && program?.fundingEndDate && (
                        <span className="inline-block w-[10px] border-b border-muted-foreground" />
                      )}
                      {program?.fundingEndDate && (
                        <p className="text-sm text-foreground font-bold">
                          {format(new Date(program.fundingEndDate), 'dd . MMM . yyyy').toUpperCase()}
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
                  <span className="text-muted-foreground">{getCurrency(program?.network)?.icon}</span>

                  <span className="text-sm text-muted-foreground">{program?.currency}</span>
                </div>
              </div>

              <div className="flex items-center gap-[20px] justify-between w-full mt-4">
                <h4 className="text-neutral-400 text-sm font-bold">STATUS</h4>

                <Progress value={25} rootClassName="w-full" indicatorClassName="bg-primary" />

                <p className="text-xl text-primary font-bold flex items-center">
                  25<span className="text-sm text-muted-foreground">%</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-start gap-3">
                <h2 className="font-bold text-muted-foreground text-sm mb-3">LINKS</h2>
                <div className="">
                  {data?.application?.links?.map((l) => (
                    <p className="text-slate-600 text-sm" key={l.url}>
                      {l.url}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="font-semibold text-[#CA8A04] bg-[#FFDEA1]">Gold</Badge>
                <p className="text-sm text-muted-foreground">or higher only</p>
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
              data?.application?.status === 'pending' && (
                <div className="flex justify-end gap-3 absolute bottom-10 right-10">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={(e) => e.stopPropagation()} className="h-10" variant="outline">
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
                  <Button
                    className="h-10"
                    onClick={() => {
                      approveApplication();
                    }}
                  >
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
                  className={`p-2 font-medium text-sm transition-colors ${activeTab === 'terms'
                    ? 'border-b border-b-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground border-b'
                    }`}
                >
                  Terms
                </button>
                <button
                  onClick={() => setActiveTab('milestones')}
                  type="button"
                  className={`p-2 font-medium text-sm transition-colors ${activeTab === 'milestones'
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
            <ScrollArea className="relative pr-2 h-[calc(100vh-200px)] pb-10">
              {/* Terms Tab Content */}
              {activeTab === 'terms' && (
                <div className="space-y-6 pb-5">

                  {data?.application?.investmentTerms?.map((t) => (
                    <button
                      type="button"
                      className={`block w-full text-left border rounded-lg p-4 shadow-sm cursor-pointer transition-all ${selectedTier === t.price ? 'bg-[#F4F4F5]' : 'bg-white'
                        }`}
                      key={t.id}
                      onClick={() => setSelectedTier(t.price || '')}
                      aria-label={`Select ${t.price} tier`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        {programData?.program?.tierSettings ? <TierBadge tier={t.price as TierType} /> : <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                          Open
                        </Badge>}

                        <div className="flex items-center gap-2">
                          {selectedTier === t.price && (
                            <div className="flex items-center bg-[#B331FF1A] p-1 rounded-full">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                          )}
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            {t.purchaseLimit} left
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">PRICE</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{program?.tierSettings ? program?.tierSettings[t.price as TierType]?.maxAmount : t.price}</span>
                          {getCurrencyIcon(program?.currency)}
                          <span className="text-lg font-semibold">{program?.currency}</span>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>{t.description}</p>
                      </div>
                    </button>
                  ))}
                  {/* Gold Tier */}
                  {/* <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Gold
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      70 left
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">PRICE</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">1,000</span>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T</span>
                      </div>
                      <span className="text-lg font-semibold">USDT</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment
                      solution that leverages smart contracts and Zero-Knowledge TLS (zkTLS) to
                      ensure secure, private, and verifiable task-based payments.
                    </p>
                    <p>
                      It enables seamless collaboration between sponsors and builders, automating
                      fund disbursement upon task completion while maintaining privacy and trust.
                    </p>
                  </div>
                </div> */}

                  {/* Platinum Tier */}
                  {/* <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Platinum
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      70 left
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">PRICE</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">5,000</span>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T</span>
                      </div>
                      <span className="text-lg font-semibold">USDT</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment
                      solution that leverages smart contracts and Zero-Knowledge TLS (zkTLS) to
                      ensure secure, private, and verifiable task-based payments.
                    </p>
                    <p>
                      It enables seamless collaboration between sponsors and builders, automating
                      fund disbursement upon task completion while maintaining privacy and trust.
                    </p>
                  </div>
                </div> */}

                  {/* Gold Tier (Duplicate) */}
                  {/* <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Gold
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      70 left
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">PRICE</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">1,000</span>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T</span>
                      </div>
                      <span className="text-lg font-semibold">USDT</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment
                      solution that leverages smart contracts and Zero-Knowledge TLS (zkTLS) to
                      ensure secure, private, and verifiable task-based payments.
                    </p>
                    <p>
                      It enables seamless collaboration between sponsors and builders, automating
                      fund disbursement upon task completion while maintaining privacy and trust.
                    </p>
                  </div>
                </div> */}
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
                            <p>{m.title}</p> <MilestoneStatusBadge milestone={m} />
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
                                    <p className="font-medium text-base mb-1">Reason for rejection</p>
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
                                <span className="text-primary font-bold text-xl">{m.percentage}</span>{' '}
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
                            <p className="text-slate-600 text-xs">{m.description}</p>
                          </div>

                          <div className="mb-6">
                            <h2 className="font-bold text-gray-dark text-sm mb-3">DESCRIPTION</h2>
                            <p className="text-slate-600 text-xs">
                              Ludium's zkTLS Builder Escrow Payment Service introduces a trustless,
                              decentralized payment solution for global builders and sponsors. By
                              integrating zkTLS technology, it ensures secure and private verification
                              of work completion without exposing sensitive data. Smart contracts
                              serve as Escrow Treasuries, automating fund releases once tasks are
                              validated. The platform simplifies grant allocations, hackathon payouts,
                              and marketing incentives by streamlining payments through blockchain
                              technology. With open-source development, Ludium fosters a collaborative
                              ecosystem that enhances transparency, efficiency, and scalability for
                              builder payments.
                            </p>
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
                                <Button className="h-10" onClick={() => callTx(m.price, m.id)}>
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
                                    idx !== 0 &&
                                    data?.application?.milestones?.[idx - 1]?.status !==
                                    MilestoneStatus.Completed
                                  }
                                >
                                  <Button className="h-10 block ml-auto">Submit Milestone</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogTitle />
                                  <DialogDescription />
                                  <DialogClose id="submit-milestone-dialog-close" />
                                  <SubmitMilestoneForm milestone={m} refetch={refetch} />
                                </DialogContent>
                              </Dialog>
                            )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Invest Button - Fixed to Bottom of Right Section */}
              <div className="absolute bottom-0 left-0 right-0">
                <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={!selectedTier}
                      className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2"
                      onClick={() => {
                        if (!selectedTier) {
                          notify('Please select a tier first', 'error');
                          return;
                        }
                      }}
                    >
                      <TrendingUp className="w-5 h-5" />
                      Invest
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <div className="text-lg font-semibold flex items-center justify-center"><span className='flex justify-center items-center w-[42px] h-[42px] rounded-full bg-[#B331FF1A]'><Coins className='text-primary' /></span></div>
                    <DialogTitle className='text-center font-semibold text-lg'>
                      Are you sure to pay the settlement for the project?
                    </DialogTitle>
                    {selectedTier && (
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
                    )}
                    <DialogDescription className="text-sm text-muted-foreground text-center">
                      The amount will be securely stored until you will confirm the completion of
                      the project.
                    </DialogDescription>

                    <Button
                      onClick={handleInvest}
                      className="bg-foreground text-white"
                    >
                      Yes, Pay now
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </ScrollArea>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
