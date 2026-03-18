import {
  type HackathonBuidlsQuery,
  useHackathonBuidlsQuery,
} from '@/apollo/queries/hackathon-buidls.generated';
import { useHackathonSponsorsQuery } from '@/apollo/queries/hackathon-sponsors.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getInitials, getUserDisplayName } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { ChevronDown, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { BuidlDetailDialog } from './buidl-detail-dialog';

const PAGE_LIMIT = 12;

interface HackathonBuidlsTabProps {
  hackathonId: string;
}

type Buidl = NonNullable<
  NonNullable<NonNullable<HackathonBuidlsQuery['hackathonBuidls']>['data']>[number]
>;

function HackathonBuidlsTab({ hackathonId }: HackathonBuidlsTabProps) {
  const isMobile = useIsMobile();
  const [selectedBuidl, setSelectedBuidl] = useState<Buidl | null>(null);
  const [search, setSearch] = useState('');
  const [sponsorId, setSponsorId] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(search);

  const { data: sponsorsData } = useHackathonSponsorsQuery({
    variables: { hackathonId },
  });

  const sponsors = sponsorsData?.hackathonSponsors?.filter((s) => !s.isRequired) ?? [];
  const selectedSponsor = sponsors.find((s) => s.id === sponsorId);

  const { data, loading, fetchMore } = useHackathonBuidlsQuery({
    variables: { hackathonId, page: 1, limit: PAGE_LIMIT, search: debouncedSearch || undefined },
  });

  const paginated = data?.hackathonBuidls;
  const allBuidls = paginated?.data ?? [];
  const buidls = sponsorId
    ? allBuidls.filter((b) => b.sponsors?.some((s) => s.id === sponsorId))
    : allBuidls;
  const hasNextPage = paginated?.hasNextPage ?? false;
  const currentPage = paginated?.currentPage ?? 1;

  const handleSeeMore = () => {
    fetchMore({
      variables: {
        hackathonId,
        page: currentPage + 1,
        limit: PAGE_LIMIT,
        search: debouncedSearch || undefined,
      },
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult?.hackathonBuidls) return prev;
        return {
          hackathonBuidls: {
            ...fetchMoreResult.hackathonBuidls,
            data: [
              ...(prev.hackathonBuidls?.data ?? []),
              ...(fetchMoreResult.hackathonBuidls.data ?? []),
            ],
          },
        };
      },
    });
  };

  return (
    <>
      <div className={cn('flex items-center justify-between gap-4 mt-3', isMobile && 'mt-5')}>
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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : !buidls.length ? (
        <div className="mt-3 text-center text-muted-foreground py-16">No BUIDLs submitted yet.</div>
      ) : (
        <div className={cn('flex flex-col gap-4 mt-3', isMobile && 'mt-5')}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buidls.map((buidl) => (
              <button
                key={buidl.id}
                type="button"
                onClick={() => setSelectedBuidl(buidl)}
                className={cn(
                  'flex gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left',
                  isMobile && 'p-5',
                )}
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
                      <div
                        className={cn(
                          'w-20 h-20 shrink-0 rounded-md overflow-hidden',
                          isMobile && 'w-14 h-14',
                        )}
                      >
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
                        {buidl.sponsors.length > 1 && <span>+{buidl.sponsors.length - 1}</span>}
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

      <BuidlDetailDialog
        buidl={selectedBuidl}
        hackathonId={hackathonId}
        onClose={() => setSelectedBuidl(null)}
        mobileTitle="BUIDLs"
      />
    </>
  );
}

export default HackathonBuidlsTab;
