import { useAcceptApplicationMutation } from '@/apollo/mutation/accept-application.generated';
import { useCheckMilestoneMutation } from '@/apollo/mutation/check-milestone.generated';
// import { useRejectApplicationMutation } from '@/apollo/mutation/reject-application.generated';
import { useApplicationQuery } from '@/apollo/queries/application.generated';
import { useProgramQuery } from '@/apollo/queries/program.generated';
import { CommentSection } from '@/components/comments/comment-section';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShareButton } from '@/components/ui/share-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tokenAddresses } from '@/constant/token-address';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import { useInvestmentContract } from '@/lib/hooks/use-investment-contract';
import notify from '@/lib/notify';
import { getCurrency, getCurrencyIcon, getUserName, mainnetDefaultNetwork } from '@/lib/utils';
import EditApplicationForm from '@/pages/programs/details/_components/edit-application-from';
import EditMilestoneForm from '@/pages/programs/details/_components/edit-milestone-form';
import RejectApplicationForm from '@/pages/programs/details/_components/reject-application-form';
import RejectMilestoneForm from '@/pages/programs/details/_components/reject-milestone-form';
import SubmitMilestoneForm from '@/pages/programs/details/_components/submit-milestone-form';
import { ApplicationStatus, CheckMilestoneStatus, CommentableTypeEnum, MilestoneStatus } from '@/types/types.generated';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import { ArrowUpRight, Check, ChevronDown, CircleAlert, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

function ApplicationDetails() {
  const [mountKey, setMountKey] = useState(0);
  const remountKey = () => setMountKey((v) => v + 1);

  const { userId, isAdmin, isAuthed } = useAuth();
  const { id, applicationId } = useParams();

  const { data, refetch, error: appError } = useApplicationQuery({
    variables: {
      id: applicationId ?? '',
    },
    skip: !applicationId,
  });

  const { data: programData, refetch: programRefetch } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
  });


  // const { data: comments } = useCommentsByCommentableQuery({
  //   variables: {
  //     commentableId: applicationId ?? '',
  //     commentableType: CommentableTypeEnum.Application,
  //   },
  //   skip: !applicationId,
  //   fetchPolicy: 'cache-and-network',
  // });

  // const [createComment] = useCreateCommentMutation();

  const program = programData?.program;

  const { name, keywords, network } = program ?? {};

  const contract = useContract(network || mainnetDefaultNetwork);
  const investmentContract = useInvestmentContract(network || mainnetDefaultNetwork);

  const applicationMutationParams = {
    onCompleted: () => {
      refetch();
      programRefetch();
    },
    variables: {
      id: applicationId ?? '',
    },
  };

  const [checkMilestone] = useCheckMilestoneMutation();

  const [approveApplication] = useAcceptApplicationMutation(applicationMutationParams);
  // const [denyApplication] = useRejectApplicationMutation(applicationMutationParams);

  const navigate = useNavigate();

  const handleAcceptApplication = async () => {
    try {
      let onChainProjectId: number | undefined;

      // If this is a funding program with blockchain deployment, register the project first
      if (program?.type === 'funding' && program?.contractAddress && program?.educhainProgramId) {
        const application = data?.application;
        if (!application) {
          notify('Application data not found', 'error');
          return;
        }

        // Check if application already has an onChainProjectId
        if ((application as any).onChainProjectId) {
          notify('This project is already registered on the blockchain', 'warning');
          onChainProjectId = (application as any).onChainProjectId;
        } else {
          notify('Registering project on blockchain...', 'info');

          try {
            // Prepare milestones for blockchain
            const milestones = application.milestones?.map(m => ({
              title: m.title || '',
              description: m.description || '',
              percentage: parseFloat(m.percentage || '0'),
              deadline: m.deadline || new Date().toISOString()
            })) || [];

            // Call signValidate to register the project on blockchain
            const result = await investmentContract.signValidateProject({
              programId: Number(program.educhainProgramId),
              projectOwner: application.applicant?.walletAddress || '0x0000000000000000000000000000000000000000',
              projectName: application.name || 'Untitled Project',
              targetFunding: application.fundingTarget || application.price || '0',
              milestones
            });

            if (result.projectId !== null) {
              onChainProjectId = result.projectId;
              notify(`Project registered on blockchain with ID: ${onChainProjectId}`, 'success');
            } else {
              notify('Project registered but could not extract ID from blockchain', 'warning');
            }
          } catch (blockchainError) {
            console.error('Blockchain registration failed:', blockchainError);
            notify('Failed to register project on blockchain. Continuing with off-chain approval.', 'warning');
          }
        }
      }

      // Accept the application in the database
      await approveApplication({
        variables: {
          id: applicationId ?? '',
          ...(onChainProjectId !== undefined && { onChainProjectId })
        }
      });

      notify(
        onChainProjectId 
          ? 'Application accepted and registered on blockchain!' 
          : 'Application accepted successfully',
        'success'
      );
    } catch (error) {
      console.error('Failed to accept application:', error);
      notify('Failed to accept application', 'error');
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

  const acceptedPrice = useMemo(
    () =>
      program?.applications
        ?.filter(
          (a) =>
            a.status === ApplicationStatus.Accepted || a.status === ApplicationStatus.Completed,
        )
        .reduce(
          (mlPrev, mlCurr) => {
            const mlPrice = mlCurr?.milestones?.reduce(
              (prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)),
              BigNumber(0, 10),
            );
            return mlPrev.plus(BigNumber(mlPrice ?? 0));
          },
          BigNumber(0, 10),
        )
        .toFixed() || '0',
    [program],
  );



  if (appError?.message === 'You do not have access to this application') {
    return (
      <div className="text-center bg-white rounded-2xl p-10">
        <p className="text-lg font-bold mb-10">You do not have access to this application</p>
        <Link to="/programs" className="text-primary hover:underline font-semibold">
          Go back to programs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F7]">
      <section className="bg-white p-10 pb-0 rounded-b-2xl">
        <div className='max-w-1440 mx-auto'>

          <ProgramStatusBadge program={program} className="inline-flex mb-4" />
          <div className="flex justify-between mb-5">
            <Link to={`/programs/${id}`} className="flex items-center gap-4 mb-4">
              {program?.image ? (
                <img
                  src={program?.image}
                  alt="program"
                  className="w-[60px] aspect-square rounded-xl"
                />
              ) : (
                <div className="bg-slate-200 w-[60px] rounded-md aspect-square" />
              )}
              <h2 className="text-lg font-bold">{name}</h2>
            </Link>
            {/* <div className="flex gap-2 mb-1 flex-wrap max-w-[70%]">
            {keywords?.map((k, i) => (
              <Badge
                key={k.id}
                variant={
                  badgeVariants[i % badgeVariants.length] as 'default' | 'secondary' | 'purple'
                }
              >
                {k.name}
              </Badge>
            ))}
          </div> */}
            <button
              type="button"
              onClick={() => navigate(`/programs/${program?.id}`)}
              className="font-medium flex gap-2 items-center text-sm cursor-pointer"
            >
              Back to Program detail <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-secondary flex justify-between p-4 gap-6 rounded-lg">
            <div className="flex-1/2">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-muted-foreground text-sm font-bold">PRICE</h4>
                <div className="flex items-center gap-2">
                  <span>{getCurrencyIcon(program?.currency)}</span>
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

              <div className="flex justify-between items-center pt-2.5">
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
          </div>
        </div>
      </section>

      <section className="bg-white rounded-b-2xl">
        <div className='max-w-[1520px] mx-auto flex'>

          <div className="p-10 flex-[66.6%]">
            <h3 className="flex items-end mb-3">
              <span className="p-2 border-b border-b-primary font-medium text-sm">Overview</span>
              <span className="block border-b w-full" />
            </h3>
            <div className="flex justify-between mb-5 pt-6">
              <div className="flex gap-4">
                <ApplicationStatusBadge application={data?.application} className='self-center' />
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

              <div className='flex items-center gap-2'>
                {(data?.application?.status === ApplicationStatus.Pending ||
                  data?.application?.status === ApplicationStatus.Rejected) &&
                  data?.application?.applicant?.id === userId && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                          Edit
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="min-w-[800px] p-6 max-h-screen overflow-y-auto">
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

                <ShareButton />

              </div>
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
            <div className="mb-4 bg-[#0000000A] inline-block p-2 rounded-md">
              {/* <p className="font-sans font-bold bg-primary-light text-primary leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]"> */}
              <div className="inline-flex justify-between items-center">
                <h4 className="text-neutral-400 text-sm font-bold">PRICE</h4>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-sm font-bold">
                    <span className="text-sm ml-3">
                      {data?.application?.milestones
                        ?.reduce(
                          (prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)),
                          BigNumber(0, 10),
                        )
                        .toFixed()}
                    </span>
                  </p>
                  <span className="text-muted-foreground">{getCurrencyIcon(program?.currency)}</span>

                  <span className="text-sm text-muted-foreground">{program?.currency}</span>
                </div>
              </div>

              {/* <span className="inline-block mr-2">
                {data?.application?.milestones
                  ?.reduce((prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)), BigNumber(0, 10))
                  .toFixed()}{' '}
                {program?.currency}
              </span> */}
              {/* <span className="h-3 border-l border-primary inline-block" /> */}
              {/* <span className="inline-block ml-2">
                DEADLINE{' '}
                {format(new Date(program?.deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
              </span> */}
              {/* </p> */}
            </div>

            {!!data?.application?.links?.length && (
              <div className="mb-6 flex items-center gap-3">
                <h2 className="font-bold text-muted-foreground text-sm">LINKS</h2>
                <div className="">
                  {data?.application?.links?.length === 1 ? (
                    <a href={data.application.links[0].url ?? ''} target="_blank" rel="noreferrer" className="text-slate-600 text-sm">
                      {data.application.links[0].url}
                    </a>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 h-auto text-slate-600 text-sm hover:bg-transparent">
                          {data?.application?.links?.[0]?.url}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64">
                        {data?.application?.links?.map((link) => (
                          <DropdownMenuItem key={link.url} className="cursor-pointer">
                            <a href={link.url ?? ''} target="_blank" rel="noreferrer" className="flex items-center gap-2">
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
            )}

            <div className="mb-6">
              <h2 className="font-bold text-gray-dark text-lg mb-3">TITLE</h2>
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







            <CommentSection
              commentableId={applicationId ?? ''}
              commentableType={CommentableTypeEnum.Application}
              // comments={comments?.commentsByCommentable ?? []}
              isLoggedIn={isAuthed ?? false}
              // refetchComments={refetchComments}
              rightSide={program?.validators?.some((v) => v.id === userId) &&
                data?.application?.status === 'pending' && (
                  <div className="flex justify-end gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={(e) => e.stopPropagation()} className="h-10" variant="outline">
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="min-w-[600px] p-6 max-h-screen overflow-y-auto">
                        <RejectApplicationForm
                          applicationId={applicationId}
                          refetch={() => {
                            refetch();
                            programRefetch();
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      className="h-10"
                      onClick={handleAcceptApplication}
                    >
                      Select
                    </Button>
                  </div>
                )}
            />
          </div>

          {/* <div className="border-r" /> */}

          <div className="p-10 flex-[33.3%]">
            <h3 className="flex items-end mb-6">
              <span className="p-2 border-b border-b-primary font-medium text-sm">Milestone</span>
              <span className="block border-b w-full" />
            </h3>
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

                      <h2 className="text-lg font-bold mb-2">Milestone #{idx + 1}</h2>

                      <div className='flex items-center gap-2'>

                        {m.rejectionReason && m.status === MilestoneStatus.Rejected ? (
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
                        ) : <div />}

                        {(m.status === MilestoneStatus.Pending || m.status === MilestoneStatus.Rejected) &&
                          data?.application?.applicant?.id === userId && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" className="h-10 w-10">
                                  <Settings className="w-4 h-4 cursor-pointer" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="min-w-[800px] p-6 max-h-screen overflow-y-auto">
                                <EditMilestoneForm milestone={m} refetch={refetch} />
                              </DialogContent>
                            </Dialog>
                          )}
                      </div>
                    </div>

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
                      <p className="text-muted-foreground flex items-center gap-2">
                        {format(
                          new Date(m?.deadline ?? new Date()),
                          'dd . MMM . yyyy',
                        ).toUpperCase()}
                        {m?.deadline &&
                          (() => {
                            const deadlineDate = new Date(m.deadline);
                            const today = new Date();
                            // Zero out the time for both dates to get full days difference
                            deadlineDate.setHours(0, 0, 0, 0);
                            today.setHours(0, 0, 0, 0);
                            const diffTime = deadlineDate.getTime() - today.getTime();
                            const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                            return <Badge className="ml-2">D-{daysRemaining}</Badge>;
                          })()}
                      </p>
                    </div>
                    {/* <div className="mb-6">
                    <p className="font-sans font-bold bg-primary-light text-primary leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
                      <span className="inline-block mr-2">
                        {m?.price} {program?.currency}
                      </span>
                      <span className="h-3 border-l border-primary inline-block" />
                      <span className="inline-block ml-2">
                        DEADLINE{' '}
                        {format(
                          new Date(program?.deadline ?? new Date()),
                          'dd . MMM . yyyy',
                        ).toUpperCase()}
                      </span>
                    </p>
                  </div> */}

                    <div className="mb-6">
                      <h2 className="font-bold text-gray-dark text-sm mb-3">SUMMARY</h2>
                      <p className="text-slate-600 text-xs">{m.summary}</p>
                    </div>

                    <div className="mb-6">
                      <h2 className="font-bold text-gray-dark text-sm mb-3">DESCRIPTION</h2>
                      <p className="text-slate-600 text-xs">{m.description}</p>
                    </div>

                    {!!m.links?.length && (
                      <div className="mb-6">
                        <h2 className="font-bold text-gray-dark text-sm mb-3">LINKS</h2>
                        {m.links?.map((l) => (
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

                    {/* {m.rejectionReason && m.status === MilestoneStatus.Pending && (
                    <div className="mb-6">
                      <h2 className="font-bold text-gray-dark text-sm mb-3">REJECTION REASON</h2>
                      <p className="text-red-400 text-xs">{m.rejectionReason}</p>
                    </div>
                  )} */}

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

                    {(m.status === MilestoneStatus.Pending || m.status === MilestoneStatus.Rejected) &&
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

                    <CommentSection
                      commentableId={m.id ?? ''}
                      commentableType={CommentableTypeEnum.Milestone}
                      // comments={comments?.commentsByCommentable ?? []}
                      isLoggedIn={isAuthed ?? false}
                    // onSubmitComment={async (content) =>
                    //   await createComment({
                    //     variables: {
                    //       input: {
                    //         content,
                    //         commentableId: postId,
                    //         commentableType: CommentableTypeEnum.Post,
                    //       },
                    //     },
                    //   })
                    // }
                    // refetchComments={refetchComments}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

      </section>
    </div>
  );
}

export default ApplicationDetails;
