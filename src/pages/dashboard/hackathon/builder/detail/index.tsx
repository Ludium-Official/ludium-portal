import { useAppliedHackathonsQuery } from '@/apollo/queries/applied-hackathons.generated';
import { useHackathonSponsorsQuery } from '@/apollo/queries/hackathon-sponsors.generated';
import {
  type MyBuidlsInHackathonQuery,
  useMyBuidlsInHackathonQuery,
} from '@/apollo/queries/my-buidls-in-hackathon.generated';
import GithubIcon from '@/assets/icons/hackathon/github.svg';
import BrowserIcon from '@/assets/icons/hackathon/browser.svg';
import VideoIcon from '@/assets/icons/hackathon/video.svg';
import MobileBackHeader from '@/components/common/mobile-back-header';
import MarkdownPreviewer from '@/components/markdown/markdown-previewer';
import Container from '@/components/layout/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn, getInitials, getUserDisplayName } from '@/lib/utils';
import { HackathonDetailView } from '@/pages/programs/hackathon/_components/hackathon-detail-view';
import { ChevronDown, ChevronRight, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';

const PAGE_LIMIT = 12;

type MyBuidl = NonNullable<
  NonNullable<NonNullable<MyBuidlsInHackathonQuery['myBuidlsInHackathon']>['data']>[number]
>;

const HackathonDashboardBuilderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBuidl, setSelectedBuidl] = useState<MyBuidl | null>(null);

  const currentTab = searchParams.get('tab') ?? '';
  const search = searchParams.get('search') ?? '';
  const sponsorId = searchParams.get('sponsorId') ?? undefined;

  // Access control
  const { data: appliedData, loading: appliedLoading } = useAppliedHackathonsQuery({
    variables: { limit: 100 },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  const isApplied = appliedData?.appliedHackathons?.data?.some(
    (item) => item?.hackathon?.id === id,
  );

  useEffect(() => {
    if (!appliedLoading && appliedData && !isApplied) {
      navigate('/dashboard/hackathon/builder', { replace: true });
    }
  }, [appliedLoading, appliedData, isApplied, navigate]);

  // Sponsor filter options
  const { data: sponsorsData } = useHackathonSponsorsQuery({
    variables: { hackathonId: id ?? '' },
    skip: !id || currentTab !== 'my-buidls',
  });

  const sponsors = sponsorsData?.hackathonSponsors ?? [];
  const selectedSponsor = sponsors.find((s) => s.id === sponsorId);
  const selectedTrackId = selectedSponsor?.tracks?.[0]?.id ?? undefined;

  // My BUIDLs query (fetchMore pattern)
  const { data: buidlsData, loading: buidlsLoading, fetchMore } = useMyBuidlsInHackathonQuery({
    variables: {
      hackathonId: id ?? '',
      page: 1,
      limit: PAGE_LIMIT,
      search: search || undefined,
      trackId: selectedTrackId,
    },
    skip: !id || !userId || currentTab !== 'my-buidls',
    fetchPolicy: 'network-only',
  });

  const paginated = buidlsData?.myBuidlsInHackathon;
  const buidls = paginated?.data ?? [];
  const hasNextPage = paginated?.hasNextPage ?? false;
  const currentPage = paginated?.currentPage ?? 1;

  const handleSeeMore = () => {
    fetchMore({
      variables: {
        hackathonId: id ?? '',
        page: currentPage + 1,
        limit: PAGE_LIMIT,
        search: search || undefined,
        trackId: selectedTrackId,
      },
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult?.myBuidlsInHackathon) return prev;
        return {
          myBuidlsInHackathon: {
            ...fetchMoreResult.myBuidlsInHackathon,
            data: [
              ...(prev.myBuidlsInHackathon?.data ?? []),
              ...(fetchMoreResult.myBuidlsInHackathon.data ?? []),
            ],
          },
        };
      },
    });
  };

  const setTab = (tab: string) => {
    const newSP = new URLSearchParams();
    if (tab) newSP.set('tab', tab);
    setSearchParams(newSP);
  };

  const setSponsorId = (sponsorId: string | undefined) => {
    const newSP = new URLSearchParams(searchParams);
    if (sponsorId) newSP.set('sponsorId', sponsorId);
    else newSP.delete('sponsorId');
    setSearchParams(newSP);
  };

  if (appliedLoading) {
    return (
      <div className="bg-white px-10 py-7 rounded-md">
        <Container>
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-64 w-full" />
        </Container>
      </div>
    );
  }

  if (!isApplied) return null;

  return (
    <div className={cn('bg-white px-10 py-7 rounded-md', isMobile && 'p-0')}>
      <MobileBackHeader title="Hackathon Overview" backLink="/dashboard/hackathon/builder" />
      <Container className="flex flex-col gap-6">
        {!isMobile && (
          <div className="flex items-center w-fit text-sm text-muted-foreground">
            <Link to="/dashboard">Dashboard</Link>
            <ChevronRight className="w-4 mx-2" />
            <Link to="/dashboard/hackathon/builder">Hackathon</Link>
            <ChevronRight className="w-4 mx-2" />
            <span className="text-foreground">Hackathon Overview</span>
          </div>
        )}

        {/* Tab toggle */}
        <div className="flex border border-gray-200 rounded-md w-fit">
          <button
            type="button"
            onClick={() => setTab('')}
            className={cn(
              'px-8 py-2 text-sm font-medium rounded-l-md transition-colors',
              currentTab !== 'my-buidls'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-gray-50 text-muted-foreground hover:bg-gray-100',
            )}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setTab('my-buidls')}
            className={cn(
              'px-8 py-2 text-sm font-medium rounded-r-md transition-colors border-l border-gray-200',
              currentTab === 'my-buidls'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-gray-50 text-muted-foreground hover:bg-gray-100',
            )}
          >
            My BUIDLs
          </button>
        </div>

        {/* Overview tab */}
        {currentTab !== 'my-buidls' && <HackathonDetailView id={id ?? ''} />}

        {/* My BUIDLs tab */}
        {currentTab === 'my-buidls' && (
          <>
            <div className="flex items-center justify-between gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 text-sm">
                    {selectedSponsor ? selectedSponsor.name : 'Track'}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setSponsorId(undefined)}>All</DropdownMenuItem>
                  {sponsors.map((sponsor) => (
                    <DropdownMenuItem
                      key={sponsor.id}
                      onClick={() => setSponsorId(sponsor.id ?? undefined)}
                    >
                      {sponsor.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative w-64">
                <SearchIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  width={16}
                  height={16}
                  strokeWidth={2}
                />
                <Input
                  className="pl-9"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    const newSP = new URLSearchParams(searchParams);
                    if (e.target.value) newSP.set('search', e.target.value);
                    else newSP.delete('search');
                    setSearchParams(newSP);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {buidlsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-lg" />
                  ))}
                </div>
              ) : buidls.length === 0 ? (
                <div className="mt-3 text-center text-muted-foreground py-16">
                  No BUIDLs submitted yet.
                </div>
              ) : (
                <div className="flex flex-col gap-4 mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {buidls.map((buidl) => (
                      <button
                        key={buidl.id}
                        type="button"
                        onClick={() => setSelectedBuidl(buidl)}
                        className="flex gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0 flex flex-col gap-3">
                          <div className="flex gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm leading-snug line-clamp-2">
                                {buidl.title}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={buidl.owner?.profileImage || ''} />
                                  <AvatarFallback className="text-[10px]">
                                    {getInitials(getUserDisplayName(buidl.owner?.nickname, undefined))}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground truncate">
                                  {getUserDisplayName(buidl.owner?.nickname, undefined)}
                                </span>
                              </div>
                            </div>
                            {buidl.coverImage && (
                              <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden">
                                <img
                                  src={buidl.coverImage}
                                  alt={buidl.title || ''}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center px-2 py-1 rounded-md bg-black/5 text-xs text-neutral-400 font-bold">
                            <div>Track</div>
                            {buidl.sponsors && buidl.sponsors.length > 0 && (
                              <div className="flex items-center gap-1 text-neutral-600">
                                {buidl.sponsors[0].sponsorImage && (
                                  <img
                                    src={buidl.sponsors[0].sponsorImage}
                                    alt={buidl.sponsors[0].name || ''}
                                    className="w-4 h-4 rounded-sm object-cover"
                                  />
                                )}
                                <span>{buidl.sponsors[0].name}</span>
                                {buidl.sponsors.length > 1 && (
                                  <span>+{buidl.sponsors.length - 1}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-foreground line-clamp-2">{buidl.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {hasNextPage && (
                    <div className="flex justify-center">
                      <Button variant="outline" onClick={handleSeeMore}>
                        See more
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Dialog open={!!selectedBuidl} onOpenChange={(open) => !open && setSelectedBuidl(null)}>
              <DialogContent
                className="gap-0 max-w-[920px]! max-h-[85vh] overflow-y-auto p-0"
                overlayClassName="bg-black/80"
              >
                {selectedBuidl && (
                  <>
                    <DialogHeader className="px-10 pt-[50px] pb-[30px] mb-[30px] border-b border-gray-200">
                      <div className="flex gap-5">
                        {selectedBuidl.coverImage && (
                          <img
                            src={selectedBuidl.coverImage}
                            alt={selectedBuidl.title || ''}
                            className="w-36 h-36 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <DialogTitle className="flex flex-col gap-[14px] text-xl font-semibold">
                          {selectedBuidl.title}
                          <div className="text-sm">{selectedBuidl.description}</div>
                        </DialogTitle>
                      </div>
                    </DialogHeader>

                    <div className="flex flex-col gap-[30px] px-10 pb-[50px]">
                      {selectedBuidl.sponsors && selectedBuidl.sponsors.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <div className="text-sm font-bold text-slate-800">Track</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedBuidl.sponsors.map((sponsor) => (
                              <div
                                key={sponsor.id}
                                className="flex items-center gap-[6px] px-[14px] py-[6px] border border-gray-200 rounded text-sm"
                              >
                                {sponsor.sponsorImage && (
                                  <img
                                    src={sponsor.sponsorImage}
                                    alt={sponsor.name || ''}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                )}
                                <span>{sponsor.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(selectedBuidl.githubLink ||
                        selectedBuidl.websiteLink ||
                        selectedBuidl.demoVideoLink) && (
                        <div className="flex flex-col gap-2">
                          <div className="text-sm font-bold text-slate-800">Link</div>
                          <div className="flex flex-col gap-1.5">
                            {selectedBuidl.githubLink && (
                              <Link
                                to={selectedBuidl.githubLink}
                                target="_blank"
                                className="flex items-center gap-2 text-sm underline"
                              >
                                <img src={GithubIcon} alt="github" className="h-6" />
                                {selectedBuidl.githubLink}
                              </Link>
                            )}
                            {selectedBuidl.websiteLink && (
                              <Link
                                to={selectedBuidl.websiteLink}
                                target="_blank"
                                className="flex items-center gap-2 text-sm underline"
                              >
                                <img src={BrowserIcon} alt="browser" className="h-6" />
                                {selectedBuidl.websiteLink}
                              </Link>
                            )}
                            {selectedBuidl.demoVideoLink && (
                              <Link
                                to={selectedBuidl.demoVideoLink}
                                target="_blank"
                                className="flex items-center gap-2 text-sm underline"
                              >
                                <img src={VideoIcon} alt="video" className="h-6" />
                                {selectedBuidl.demoVideoLink}
                              </Link>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedBuidl.buidlDescription && (
                        <div className="flex flex-col gap-2">
                          <div className="text-sm font-bold text-slate-800">Detail</div>
                          <div className="max-h-[256px] overflow-y-auto bg-slate-50 border border-slate-200 rounded-lg p-5">
                            <MarkdownPreviewer value={selectedBuidl.buidlDescription} />
                          </div>
                        </div>
                      )}

                      {selectedBuidl.builders && selectedBuidl.builders.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <div className="text-sm font-bold text-slate-800">Members</div>
                          <div className="flex flex-wrap gap-4">
                            {selectedBuidl.builders.map((builder) => {
                              const name = getUserDisplayName(builder.user?.nickname, undefined);
                              return (
                                <div key={builder.id} className="flex items-center gap-2">
                                  <Avatar className="w-7 h-7">
                                    <AvatarImage src={builder.user?.profileImage || ''} />
                                    <AvatarFallback className="text-[10px]">
                                      {getInitials(name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-muted-foreground">{name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {selectedBuidl.socialLinks && selectedBuidl.socialLinks.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <div className="text-sm font-bold text-slate-800">Social</div>
                          <div className="flex flex-col gap-[18px]">
                            {selectedBuidl.socialLinks.map((link) => (
                              <Link
                                key={link}
                                to={link}
                                target="_blank"
                                className="flex items-center gap-2 text-sm underline"
                              >
                                <img src={BrowserIcon} alt="browser" className="h-6" />
                                {link}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </Container>
    </div>
  );
};

export default HackathonDashboardBuilderDetail;
