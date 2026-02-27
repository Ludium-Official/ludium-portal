import { useHackathonQuery } from '@/apollo/queries/hackathon.generated';
import { ShareButton } from '@/components/ui/share-button';
import StatusBadge from '@/components/recruitment/statusBadge/statusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Container from '@/components/layout/container';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { cn, dDay, getCurrencyIcon, getInitials, getUserDisplayName } from '@/lib/utils';
import { format } from 'date-fns';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import HackathonBuidlsTab from './hackathon-buidls-tab';
import HackathonDetailsTab from './hackathon-details-tab';
import HackathonFaqTab from './hackathon-faq-tab';
import HackathonHackersTab from './hackathon-hackers-tab';
import HackathonTracksTab from './hackathon-tracks-tab';

export function HackathonDetailView({ id }: { id: string }) {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') ?? 'details';
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLoggedIn, isAuthed } = useAuth();

  const basePath = pathname.includes('/dashboard/')
    ? pathname
    : `/programs/hackathon/${id}`;

  const { data, loading, error } = useHackathonQuery({
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <Container className="px-4 py-8">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Container>
    );
  }

  if (error || !data?.hackathon) {
    return (
      <Container className="px-4 py-8">
        <p className="text-red-500">Hackathon not found</p>
      </Container>
    );
  }

  const hackathon = data.hackathon;

  const tabClass = (tab: string) =>
    cn('px-4 py-2 font-medium text-sm border-b-1 -mb-[2px]', {
      'text-primary border-primary': currentTab === tab,
      'text-muted-foreground border-transparent': currentTab !== tab,
    });

  const now = new Date();
  const isSubmissionActive =
    isLoggedIn &&
    hackathon.submissionAt &&
    hackathon.deadlineAt &&
    now >= new Date(hackathon.submissionAt) &&
    now < new Date(hackathon.deadlineAt);

  return (
    <Container>
      <div className="mb-3">
        <StatusBadge status={hackathon.status || 'draft'} className="mb-2" />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{hackathon.title}</h1>
          <ShareButton variant="outline" />
        </div>
      </div>
      <div className="flex items-start gap-7 mb-6">
        <div className="flex-1 min-w-0">
          <img
            src={hackathon.coverImage || ''}
            alt="Post media"
            className="rounded-lg w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-between w-[428px] shrink-0 self-stretch p-4 rounded-lg border border-slate-200">
          <div className="flex flex-col gap-5">
            <div className="flex items-end justify-between">
              <div className="text-muted-foreground text-sm font-bold">Prize</div>
              <div>
                <div className="text-sm text-right">{hackathon.network?.chainName}</div>
                <div className="font-bold text-xl">
                  {!hackathon.prizePoolAmount ? (
                    <div className="flex items-center gap-2">
                      {getCurrencyIcon(hackathon.token?.tokenName || '')}
                      <span>Non-cash Prize</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {hackathon.prizePoolAmount.toLocaleString()}
                      <div className="flex items-center gap-2">
                        {getCurrencyIcon(hackathon.token?.tokenName || '')}
                        {hackathon.token?.tokenName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-gray-50 p-[10px] rounded-lg border border-slate-100">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'text-sm font-medium',
                    isSubmissionActive ? 'text-green-700' : 'text-muted-foreground',
                  )}
                >
                  Submission
                </div>
                <div
                  className={cn(
                    'flex items-center gap-2 text-sm text-right',
                    isSubmissionActive && 'text-green-700',
                  )}
                >
                  <div
                    className={cn(
                      'px-2 py-[2px] border rounded-full text-xs font-semibold',
                      isSubmissionActive
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-white border-gray-200 text-gray-950',
                    )}
                  >
                    {dDay(hackathon.submissionAt || new Date())}
                  </div>
                  <div className="w-23">
                    {format(
                      new Date(hackathon.submissionAt || new Date()),
                      'dd.MMM.yyyy',
                    ).toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm font-medium">Deadline</div>
                <div className="flex items-center gap-2 text-sm text-right">
                  <div className="bg-white px-2 py-[2px] border border-gray-200 rounded-full text-gray-950 text-xs font-semibold">
                    {dDay(hackathon.deadlineAt || new Date())}
                  </div>
                  <div className="w-23">
                    {format(
                      new Date(hackathon.deadlineAt || new Date()),
                      'dd.MMM.yyyy',
                    ).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm font-bold">Sponsor</div>
              <div className="flex items-center gap-2 text-sm">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={hackathon.sponsor?.profileImage || ''} />
                  <AvatarFallback className="text-xs">
                    {getInitials(
                      getUserDisplayName(hackathon.sponsor?.nickname, hackathon.sponsor?.email),
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="text-muted-foreground font-semibold">
                  {getUserDisplayName(hackathon.sponsor?.nickname, hackathon.sponsor?.email)}
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="purple"
            className="w-full"
            disabled={!isSubmissionActive}
            onClick={() => {
              if (!isAuthed) {
                notify('Please check your email and nickname', 'success');
                navigate('/profile');
                return;
              }
              navigate(`/programs/hackathon/${id}/buidl/submit`);
            }}
          >
            Submit
          </Button>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="flex items-center gap-2 w-full border-b border-gray-300">
          <Link to={basePath} className={tabClass('details')}>
            Details
          </Link>
          <Link to={`${basePath}?tab=buidls`} className={tabClass('buidls')}>
            BUIDLs
          </Link>
          <Link to={`${basePath}?tab=hackers`} className={tabClass('hackers')}>
            Hackers
          </Link>
          <Link to={`${basePath}?tab=tracks`} className={tabClass('tracks')}>
            Tracks
          </Link>
          <Link to={`${basePath}?tab=faq`} className={tabClass('faq')}>
            FAQ
          </Link>
        </div>

        {currentTab === 'details' && <HackathonDetailsTab hackathonId={id} />}
        {currentTab === 'buidls' && <HackathonBuidlsTab hackathonId={id} />}
        {currentTab === 'hackers' && <HackathonHackersTab hackathonId={id} />}
        {currentTab === 'tracks' && <HackathonTracksTab hackathonId={id} />}
        {currentTab === 'faq' && <HackathonFaqTab hackathonId={id} />}
      </div>
    </Container>
  );
}
