import client from '@/apollo/client';
import { useAcceptProgramMutation } from '@/apollo/mutation/accept-program.generated';
import { useSubmitProgramMutation } from '@/apollo/mutation/submit-program.generated';
import { ProgramDocument, useProgramQuery } from '@/apollo/queries/program.generated';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tokenAddresses } from '@/constant/token-address';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import notify from '@/lib/notify';
import {
  cn,
  getCurrency,
  getCurrencyIcon,
  getInitials,
  getUserName,
  mainnetDefaultNetwork,
} from '@/lib/utils';
import ApplicationCard from '@/pages/programs/details/_components/application-card';
import CreateApplicationForm from '@/pages/programs/details/_components/create-application-form';
import RejectProgramForm from '@/pages/programs/details/_components/reject-program-form';
// import MainSection from '@/pages/programs/details/_components/main-section';
import { ApplicationStatus, ProgramStatus, type User } from '@/types/types.generated';
import { useWallets } from '@privy-io/react-auth';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import { CircleAlert, Settings, TriangleAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

const DetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, isAdmin, isLoggedIn, isAuthed } = useAuth();
  const { wallets } = useWallets();
  const { id } = useParams();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const {
    data,
    refetch,
    error: programError,
  } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
  });

  const program = data?.program;

  const filteredApplications = useMemo(() => {
    if (selectedStatus === 'all') {
      return data?.program?.applications || [];
    }
    return (
      data?.program?.applications?.filter((application) => application.status === selectedStatus) ||
      []
    );
  }, [data?.program?.applications, selectedStatus]);

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

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const programActionOptions = {
    variables: { id: program?.id ?? id ?? '' },
    onCompleted: () => {
      client.refetchQueries({ include: [ProgramDocument] });
    },
  };

  const [acceptProgram] = useAcceptProgramMutation(programActionOptions);
  const [publishProgram] = useSubmitProgramMutation();

  const contract = useContract(program?.network || mainnetDefaultNetwork);

  const callTx = async () => {
    try {
      if (program) {
        // Check if program is already on blockchain
        if (program.educhainProgramId !== null && program.educhainProgramId !== undefined) {
          notify('This program has already been registered on blockchain', 'error');
          console.error('Program already on blockchain with ID:', program.educhainProgramId);
          return;
        }

        const network = program.network as keyof typeof tokenAddresses;
        const tokens = tokenAddresses[network] || [];
        const targetToken = tokens.find((token) => token.name === program.currency);

        // Get the current user's wallet address (sponsor who is paying)
        const currentWallet = wallets?.[0];
        if (!currentWallet) {
          notify('Please connect your wallet first', 'error');
          return;
        }
        const sponsorAddress = currentWallet.address;

        console.log('Creating program with params:', {
          name: program.name,
          price: program.price,
          deadline: program.deadline,
          validatorAddress: program?.validators?.[0]?.walletAddress,
          token: targetToken,
          ownerAddress: sponsorAddress,
          network,
          currency: program.currency,
          existingEduchainId: program.educhainProgramId,
        });

        const result = await contract.createProgram({
          name: program.name as string | undefined,
          price: program.price as string | undefined,
          deadline: program.deadline,
          validatorAddress: program?.validators?.[0] as User | undefined,
          token: targetToken ?? { name: program.currency as string },
          ownerAddress: sponsorAddress,
        });

        if (result?.txHash) {
          console.log('Publishing program with result:', result);

          await publishProgram({
            variables: {
              id: program?.id ?? '',
              educhainProgramId: result.programId || 0,
              txHash: result.txHash,
            },
          });

          notify('Program published successfully', 'success');

          // Refetch to update the UI
          await refetch();
        } else {
          notify('Program published failed - no transaction hash', 'error');
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
        <Link to="/programs" className="text-primary hover:underline font-semibold">
          Go back to programs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F7]">
      <section className="bg-white rounded-2xl">
        <div className="max-w-1440 mx-auto p-10">
          <div className="flex justify-between items-center mb-2">
            <ProgramStatusBadge program={program} />
          </div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">{program?.name}</h1>

            <div className="flex gap-2">
              {(program?.creator?.id === userId || isAdmin) && (
                <Link to={`/programs/${program?.id}/edit`}>
                  <Button variant="ghost" className="flex gap-2 items-center">
                    Edit
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              <ShareButton program={program ?? undefined} />
            </div>
          </div>

          <div className="flex gap-6">
            {/* Overview */}
            <div className="w-full max-w-[360px]">
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

              <div className="flex justify-end text-sm font-bold text-muted-foreground">
                {getCurrency(program?.network)?.display}
              </div>
              <div className="flex justify-between items-center font-bold mb-6">
                <p className="text-muted-foreground text-sm">PRICE</p>

                <div className="flex gap-2 items-center">
                  <span>{getCurrencyIcon(program?.currency)}</span>
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

                {/* <div className='flex gap-2 items-center'>
                <span>{getCurrency(program?.network)?.icon}</span>
                <p><span className='text-xl'>{acceptedPrice}</span> <span className='text-muted-foreground text-xs mr-1.5'>{acceptedPrice && ' / '}{program?.price}</span>{program?.currency}</p>
              </div> */}

                <p className="text-xl leading-7">
                  {format(new Date(program?.deadline ?? new Date()), 'dd.MMM.yyyy').toUpperCase()}
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={
                      !isLoggedIn ||
                      program?.status !== 'published' ||
                      program.creator?.id === userId ||
                      program?.validators?.some((validator) => validator.id === userId) ||
                      (program?.applicationStartDate &&
                        new Date() < new Date(program.applicationStartDate)) ||
                      (program?.applicationEndDate && new Date() > new Date(program.applicationEndDate)) ||
                      (program?.price && acceptedPrice && BigNumber(acceptedPrice).isGreaterThanOrEqualTo(BigNumber(program.price)))
                    }
                    onClick={(e) => {
                      if (!isAuthed) {
                        notify('Please add your email', 'success');
                        navigate('/profile/edit');
                        return;
                      }

                      e.stopPropagation();
                    }}
                    className="mt-6 mb-3 text-sm w-full h-11 font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px]"
                  >
                    Submit application
                  </Button>
                </DialogTrigger>
                <DialogContent className="min-w-[800px] min-h-[760px] z-50 w-full max-w-[1440px] p-6 max-h-screen overflow-y-auto">
                  <CreateApplicationForm program={program} />
                </DialogContent>
              </Dialog>

              {program?.validators?.some((v) => v.id === userId) &&
                program.status === ProgramStatus.Pending && (
                  <div className="flex justify-end gap-2 w-full">
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
                    {/* <Button onClick={() => rejectProgram()} variant="outline" className="h-11 w-[118px]">
                    Reject
                  </Button> */}
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
                      <Button className="text-sm font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px] w-full h-11">
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
                <div className="flex justify-end gap-2 w-full">
                  <Button disabled className="h-11 flex-1">
                    Rejected
                  </Button>
                </div>
              )}

              {program?.status === ProgramStatus.Rejected &&
                program.validators?.some((v) => v.id === userId) && (
                  <div className="flex justify-end gap-2 w-full">
                    <Button disabled variant="outline" className="h-11 flex-1">
                      Rejection Reason Submitted
                    </Button>
                  </div>
                )}

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

              <div className="mt-6">
                <p className="text-muted-foreground text-sm font-bold mb-3">PROGRAM SPONSOR</p>
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
                      ? 'Paid'
                      : 'Not paid'}
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
                          `${program?.creator?.firstName || ''} ${program?.creator?.lastName || ''}`,
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
        </div>
      </section>

      {/* <MainSection program={program} refetch={() => refetch} /> */}

      <section className="bg-white rounded-2xl mt-3">
        <div className="max-w-1440 mx-auto p-10">
          <Tabs
            id="applications"
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <h2 className="text-xl font-bold mb-4">Applications</h2>
            <section className="">
              <TabsList className="mb-3.5">
                <TabsTrigger value="all">All</TabsTrigger>
                {Object.values(ApplicationStatus).map((status) => (
                  <TabsTrigger key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </TabsTrigger>
                ))}
                {/* <TabsTrigger value="newest">Newest</TabsTrigger>
                <TabsTrigger value="imminent">Imminent</TabsTrigger>
                <TabsTrigger value="my-programs">My programs</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger> */}
              </TabsList>
            </section>

            <section className="grid grid-cols-3 gap-5">
              {!filteredApplications.length && (
                <div className="text-slate-600 text-sm">
                  {selectedStatus === 'all'
                    ? 'No applications yet.'
                    : `No ${selectedStatus.toLowerCase()} applications yet.`}
                </div>
              )}
              {filteredApplications.map((a) => (
                <ApplicationCard key={a.id} application={a} program={data?.program} />
              ))}
            </section>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default DetailsPage;
