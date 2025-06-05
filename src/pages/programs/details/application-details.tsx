import { useAcceptApplicationMutation } from '@/apollo/mutation/accept-application.generated';
import { useCheckMilestoneMutation } from '@/apollo/mutation/check-milestone.generated';
// import { useRejectApplicationMutation } from '@/apollo/mutation/reject-application.generated';
import { useApplicationQuery } from '@/apollo/queries/application.generated';
import { useProgramQuery } from '@/apollo/queries/program.generated';
import MarkdownPreviewer from '@/components/markdown-previewer';
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
import { tokenAddresses } from '@/constant/token-address';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import notify from '@/lib/notify';
import { mainnetDefaultNetwork } from '@/lib/utils';
import EditApplicationForm from '@/pages/programs/details/_components/edit-application-from';
import EditMilestoneForm from '@/pages/programs/details/_components/edit-milestone-form';
import RejectApplicationForm from '@/pages/programs/details/_components/reject-application-form';
import RejectMilestoneForm from '@/pages/programs/details/_components/reject-milestone-form';
import SubmitMilestoneForm from '@/pages/programs/details/_components/submit-milestone-form';
import { ApplicationStatus, CheckMilestoneStatus, MilestoneStatus } from '@/types/types.generated';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import { ArrowRight, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

function ApplicationDetails() {
  const [mountKey, setMountKey] = useState(0);
  const remountKey = () => setMountKey((v) => v + 1);

  const { userId } = useAuth();
  const { id, applicationId } = useParams();

  const { data, refetch } = useApplicationQuery({
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

  const program = programData?.program;

  const { name, keywords, network } = program ?? {};

  const contract = useContract(network || mainnetDefaultNetwork);

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

  const badgeVariants = ['teal', 'orange', 'pink'];

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
          targetToken,
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

  return (
    <div className="bg-[#F7F7F7]">
      <section className="bg-white p-10 mb-3 rounded-b-2xl">
        <div className="flex justify-between mb-5">
          <div className="flex gap-2 mb-1 flex-wrap max-w-[70%]">
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
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="font-medium flex gap-2 items-center text-sm cursor-pointer"
          >
            Back to Program detail <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <Link to={`/programs/${id}`} className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <h2 className="text-lg font-bold">{name}</h2>
        </Link>
        <div className="mb-4">
          <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
            <span className="inline-block mr-2">
              {data?.application?.milestones
                ?.reduce((prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)), BigNumber(0, 10))
                .toFixed()}{' '}
              {program?.currency} / {program?.price} {program?.currency}
            </span>
            <span className="h-3 border-l border-[#B331FF] inline-block" />
            <span className="inline-block ml-2">
              DEADLINE{' '}
              {format(new Date(program?.deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
            </span>
          </p>
        </div>
      </section>

      <section className="flex bg-white rounded-t-2xl">
        <div className="p-10 flex-[60%]">
          <div className="flex justify-between mb-5">
            <div className="flex gap-2 mb-1">
              <Badge variant="default">{data?.application?.status}</Badge>
            </div>

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

          <Link to={`/programs/${id}`} className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <h2 className="text-lg font-bold">{data?.application?.applicant?.organizationName}</h2>
          </Link>
          <div className="mb-6">
            <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
              <span className="inline-block mr-2">
                {data?.application?.milestones
                  ?.reduce((prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)), BigNumber(0, 10))
                  .toFixed()}{' '}
                {program?.currency}
              </span>
              <span className="h-3 border-l border-[#B331FF] inline-block" />
              <span className="inline-block ml-2">
                DEADLINE{' '}
                {format(new Date(program?.deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
              </span>
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-[#18181B] text-lg mb-3">APPLICATION</h2>
            <p className="text-slate-600 text-sm">{data?.application?.name}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-[#18181B] text-lg mb-3">SUMMARY</h2>
            <p className="text-slate-600 text-sm">{data?.application?.summary}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-[#18181B] text-lg mb-3">DESCRIPTION</h2>
            {data?.application?.content && (
              <MarkdownPreviewer key={mountKey} value={data?.application?.content} />
            )}
            {/* <p className="text-slate-600 text-sm">{data?.application?.content}</p> */}
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-[#18181B] text-lg mb-3">LINKS</h2>
            {data?.application?.links?.map((l) => (
              <p className="text-slate-600 text-sm" key={l.url}>
                {l.url}
              </p>
            ))}
          </div>

          {data?.application?.rejectionReason &&
            data?.application?.status === ApplicationStatus.Rejected && (
              <div className="mb-6">
                <h2 className="font-bold text-[#18181B] text-lg mb-3">Rejection Reason</h2>
                <p className="text-sm text-red-400">{data?.application?.rejectionReason}</p>
              </div>
            )}

          {data?.application?.status === ApplicationStatus.Rejected &&
            data?.application.applicant?.id === userId && (
              <p className="text-sm text-red-400">You can edit and resubmit your application.</p>
            )}

          {program?.validator?.id === userId && data?.application?.status === 'pending' && (
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
              {/* <Button className="h-10" variant="outline" onClick={() => denyApplication()}>
                Deny
              </Button> */}
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

        <div className="border-r" />

        <div className="p-10 flex-[40%]">
          <Accordion type="single" collapsible>
            {data?.application?.milestones?.map((m, idx) => (
              <AccordionItem key={m.id} value={`${m.id}${idx}`}>
                <AccordionTrigger>{m.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-between">
                    <Badge variant="secondary" className="mb-2">
                      {m.status}
                    </Badge>
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
                  <div className="mb-6">
                    <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
                      <span className="inline-block mr-2">
                        {m?.price} {program?.currency}
                      </span>
                      <span className="h-3 border-l border-[#B331FF] inline-block" />
                      <span className="inline-block ml-2">
                        DEADLINE{' '}
                        {format(
                          new Date(program?.deadline ?? new Date()),
                          'dd . MMM . yyyy',
                        ).toUpperCase()}
                      </span>
                    </p>
                  </div>

                  <div className="mb-6">
                    <h2 className="font-bold text-[#18181B] text-sm mb-3">SUMMARY</h2>
                    <p className="text-slate-600 text-xs">{m.description}</p>
                  </div>

                  {!!m.links?.length && (
                    <div className="mb-10">
                      <h2 className="font-bold text-[#18181B] text-sm mb-3">LINKS</h2>
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

                  {m.rejectionReason && m.status === MilestoneStatus.Pending && (
                    <div className="mb-6">
                      <h2 className="font-bold text-[#18181B] text-sm mb-3">REJECTION REASON</h2>
                      <p className="text-red-400 text-xs">{m.rejectionReason}</p>
                    </div>
                  )}

                  {m.status === MilestoneStatus.Submitted && program?.validator?.id === userId && (
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
                      {/* <Button
                        className="h-10"
                        variant="outline"
                        onClick={() => {
                          checkMilestone({
                            variables: {
                              input: {
                                id: m.id ?? '',
                                status: CheckMilestoneStatus.Pending,
                              },
                            },
                            onCompleted: () => {
                              refetch();
                              programRefetch();
                            },
                          });
                        }}
                      >
                        Reject Milestone
                      </Button> */}
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
      </section>
    </div>
  );
}

export default ApplicationDetails;
