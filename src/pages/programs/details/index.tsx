import { useProgramQuery } from '@/apollo/queries/program.generated';
import { MarkdownPreviewer } from '@/components/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ShareButton } from '@/components/ui/share-button';
import { Tabs } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { getCurrency, getInitials, getUserName } from '@/lib/utils';
import ProgramStatusBadge from '@/pages/programs/_components/program-status-badge';
import ApplicationCard from '@/pages/programs/details/_components/application-card';
import CreateApplicationForm from '@/pages/programs/details/_components/create-application-form';
// import MainSection from '@/pages/programs/details/_components/main-section';
import { ApplicationStatus } from '@/types/types.generated';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import { Settings, } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

const DetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, isAdmin, isLoggedIn, isAuthed } = useAuth();
  const { id } = useParams();

  const { data, refetch } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
  });

  const program = data?.program;

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

  return (
    <div className="bg-[#F7F7F7]">
      <section className="bg-white rounded-2xl">
        <div className="max-w-1440 mx-auto p-10">
          <div className="flex justify-between items-center mb-2">
            <ProgramStatusBadge program={program} />

          </div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">{program?.name}</h1>

            <div className='flex gap-2'>
              {(program?.creator?.id === userId || isAdmin) && (
                <Link to={`/programs/${program?.id}/edit`}>
                  <Button variant='ghost' className='flex gap-2 items-center bg-secondary'>
                    Edit
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              <ShareButton />
              {/* <Button variant="ghost" className="flex gap-2 items-center">
                Share <Share2 />
              </Button> */}
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
                <img src={program?.image} alt="program" className='w-full aspect-square rounded-xl' />
              ) : (
                <div className="bg-[#eaeaea] w-full rounded-xl aspect-square mb-6" />
              )}

              <div className="flex justify-end text-sm font-bold text-muted-foreground">
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
                    disabled={!isLoggedIn || program?.status !== 'published' || program.creator?.id === userId || program?.validators?.some((validator) => validator.id === userId)}
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

              <div className="mt-6">
                <p className="text-muted-foreground text-sm font-bold mb-3">PROGRAM HOST</p>
                <div className="border rounded-xl w-full p-4 mb-6">
                  <ProgramStatusBadge program={program} className='inline-flex mb-3' />
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
                    <p className='text-sm font-bold'>
                      {getUserName(program?.creator)}
                    </p>
                  </Link>

                  <div className="flex gap-3 mb-4">
                    <p className="text-xs font-bold w-[57px]">Summary</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{program?.creator?.summary}</p>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <p className="text-xs font-bold w-[57px]">Email</p>
                    <p className="text-xs">{program?.creator?.email}</p>
                  </div>

                  <div className='flex gap-2 flex-wrap'>
                    <Badge variant='secondary' className='text-xs font-semibold'>
                      DB
                    </Badge>
                    <Badge variant='secondary' className='text-xs font-semibold'>
                      Developer
                    </Badge>
                    <Badge variant='secondary' className='text-xs font-semibold'>
                      Solidity
                    </Badge>
                  </div>
                </div>
              </div>

              {!!program?.validators?.length && (
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm font-bold mb-3">PROGRAM VALIDATOR</p>

                  {program.validators.map((validator) => (
                    <div className="border rounded-xl w-full p-6 mb-6" key={validator.id}>

                      <ProgramStatusBadge program={program} className='inline-flex mb-3' />
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
                          <p className='text-sm mb-2'>
                            {getUserName(validator)}
                          </p>

                          <div className='flex gap-2 flex-wrap'>
                            <Badge variant='secondary' className='text-xs font-semibold'>
                              DB
                            </Badge>
                            <Badge variant='secondary' className='text-xs font-semibold'>
                              Developer
                            </Badge>
                            <Badge variant='secondary' className='text-xs font-semibold'>
                              Solidity
                            </Badge>
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
          <Tabs id="applications">
            <h2 className="text-xl font-bold mb-4">Applications</h2>
            <section className="" />

            <section className="grid grid-cols-3 gap-5">
              {!data?.program?.applications?.length && (
                <div className="text-slate-600 text-sm">No applications yet.</div>
              )}
              {data?.program?.applications?.map((a) => (
                <ApplicationCard
                  key={a.id}
                  application={a}
                  program={data.program}
                  refetch={refetch}
                  hideControls={
                    a.status !== ApplicationStatus.Pending ||
                    program?.validators?.every((validator) => validator.id !== userId)
                  }
                />
              ))}
            </section>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default DetailsPage;
