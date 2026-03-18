import { useAppliedHackathonsQuery } from '@/apollo/queries/applied-hackathons.generated';
import MobileBackHeader from '@/components/common/mobile-back-header';
import Container from '@/components/layout/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Pagination, PageSize } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/hooks/use-auth';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn, dDay, getCurrencyIcon, getInitials, getUserDisplayName } from '@/lib/utils';
import { format } from 'date-fns';
import { ChevronRight, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

const HackathonDashboardBuilder: React.FC = () => {
  const { userId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const currentPage = Number(searchParams.get('page')) || 1;
  const [search, setSearch] = useState<string>(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const newSP = new URLSearchParams();
    if (debouncedSearch) newSP.set('search', debouncedSearch);
    setSearchParams(newSP, { replace: true });
  }, [debouncedSearch]);

  const { data, loading } = useAppliedHackathonsQuery({
    variables: {
      page: currentPage,
      limit: PageSize,
      search: debouncedSearch || undefined,
    },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  const hackathons = data?.appliedHackathons?.data ?? [];
  const totalCount = data?.appliedHackathons?.count ?? 0;

  return (
    <div className={cn('bg-white px-10 py-7 rounded-md', isMobile && 'p-0')}>
      <MobileBackHeader title="Hackathon" backLink="/dashboard" />
      <Container className={cn('flex flex-col gap-[30px]', isMobile && 'gap-4')}>
        {!isMobile && (
          <div className="flex items-center w-fit text-sm text-muted-foreground">
            <Link to="/dashboard">Dashboard</Link>
            <ChevronRight className="w-4 mx-2" />
            <span className="text-foreground">Hackathon</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className={cn('font-bold text-xl text-gray-600', isMobile && 'text-lg mt-6')}>
            Hackathon
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="relative w-64">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              width={16}
              height={16}
              strokeWidth={2}
            />
            <Input
              className={cn('pl-9', isMobile && 'text-sm')}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={cn('flex flex-col gap-3 mx-15', isMobile && 'mx-0')}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))
          ) : hackathons.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No hackathons found.
            </div>
          ) : (
            hackathons.map((item) => {
              const hackathon = item?.hackathon;
              const sponsor = item?.sponsor;
              const description = item?.firstSection?.value;

              if (!hackathon) return null;

              return (
                <Link
                  key={hackathon.id}
                  to={`/dashboard/hackathon/builder/${hackathon.id}`}
                  className={cn(
                    'flex border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors',
                    isMobile && 'flex-col',
                  )}
                >
                  <img
                    src={hackathon.coverImage ?? ''}
                    alt={hackathon.title ?? ''}
                    className={cn('w-70 object-cover shrink-0 bg-gray-100', isMobile && 'w-full')}
                  />

                  <div
                    className={cn(
                      'flex-1 min-w-0 px-5 py-6 flex flex-col justify-between',
                      isMobile && 'p-3 pb-0',
                    )}
                  >
                    <div>
                      <h3
                        className={cn(
                          'font-semibold text-gray-900 mb-2 line-clamp-1',
                          isMobile && 'mb-0 text-sm',
                        )}
                      >
                        {hackathon.title}
                      </h3>
                      {!isMobile && description && (
                        <p className="text-sm line-clamp-2">{description}</p>
                      )}
                    </div>
                    {!isMobile && sponsor && (
                      <div className="flex items-center gap-2 mt-3">
                        <Avatar className="w-[18px] h-[18px]">
                          <AvatarImage src={sponsor.profileImage ?? ''} />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(getUserDisplayName(sponsor.nickname, sponsor.email))}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground font-medium">
                          {getUserDisplayName(sponsor.nickname, sponsor.email)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className={cn(
                      'w-79 shrink-0 px-5 py-6 border-l border-gray-100 flex flex-col justify-between gap-3 text-sm',
                      isMobile && 'w-full p-3 text-xs',
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-400 w-20 font-bold">Prize</span>
                      <span className="font-semibold text-gray-800">
                        {!hackathon.prizePoolAmount ? (
                          <div className="flex items-center gap-2">
                            {hackathon.token && (
                              <div className="flex items-center [&_svg]:w-4 [&_svg]:h-4">
                                {getCurrencyIcon(hackathon.token.tokenName)}
                              </div>
                            )}
                            <span>Non-cash Prize</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            {hackathon.prizePoolAmount.toLocaleString()}
                            {hackathon.token && (
                              <div className="flex items-center gap-1">
                                <div className="flex items-center [&_svg]:w-4 [&_svg]:h-4">
                                  {getCurrencyIcon(hackathon.token.tokenName)}
                                </div>
                                <span className="text-muted-foreground">
                                  {hackathon.token.tokenName}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </span>
                    </div>
                    {hackathon.submissionAt && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-400 w-20">Submission</span>
                        <div className="flex items-center gap-2">
                          <span className="border border-gray-200 rounded-full px-2 py-[2px] font-semibold text-xs">
                            {dDay(hackathon.submissionAt)}
                          </span>
                          <span className="font-medium">
                            {format(new Date(hackathon.submissionAt), 'dd.MMM.yyyy').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    {hackathon.deadlineAt && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-400 w-20">Deadline</span>
                        <div className="flex items-center gap-2">
                          <span className="border border-gray-200 rounded-full px-2 py-[2px] font-semibold text-xs">
                            {dDay(hackathon.deadlineAt)}
                          </span>
                          <span className="font-medium">
                            {format(new Date(hackathon.deadlineAt), 'dd.MMM.yyyy').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <Pagination totalCount={totalCount} pageSize={PageSize} />
      </Container>
    </div>
  );
};

export default HackathonDashboardBuilder;
