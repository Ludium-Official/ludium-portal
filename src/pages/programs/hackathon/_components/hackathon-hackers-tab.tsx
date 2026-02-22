import { useHackathonParticipantsQuery } from '@/apollo/queries/hackathon-participants.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials, getUserDisplayName } from '@/lib/utils';

const PAGE_LIMIT = 12;

interface HackathonHackersTabProps {
  hackathonId: string;
}

function HackathonHackersTab({ hackathonId }: HackathonHackersTabProps) {
  const { data, loading, fetchMore } = useHackathonParticipantsQuery({
    variables: { hackathonId, page: 1, limit: PAGE_LIMIT },
  });

  const paginated = data?.hackathonParticipants;
  const participants = paginated?.data ?? [];
  const hasNextPage = paginated?.hasNextPage ?? false;
  const currentPage = paginated?.currentPage ?? 1;

  const handleSeeMore = () => {
    fetchMore({
      variables: { hackathonId, page: currentPage + 1, limit: PAGE_LIMIT },
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult?.hackathonParticipants) return prev;
        return {
          hackathonParticipants: {
            ...fetchMoreResult.hackathonParticipants,
            data: [
              ...(prev.hackathonParticipants?.data ?? []),
              ...(fetchMoreResult.hackathonParticipants.data ?? []),
            ],
          },
        };
      },
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!participants.length) {
    return <div className="mt-3 text-center text-muted-foreground py-16">No hackers yet.</div>;
  }

  return (
    <div className="flex flex-col gap-4 mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.map((participant) => {
          const displayName = getUserDisplayName(participant.user?.nickname, undefined);
          const buidls = participant.buidls ?? [];

          return (
            <div
              key={`${participant.hackathonId}-${participant.user?.id}`}
              className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg"
            >
              <Avatar className="w-16 h-16 shrink-0">
                <AvatarImage src={participant.user?.profileImage || ''} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{displayName}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {participant.user?.userRole}
                </div>
              </div>

              {buidls.length > 0 && (
                <div className="flex flex-col gap-1 shrink-0 max-w-[40%]">
                  {buidls.slice(0, 2).map((buidl) => (
                    <div key={buidl.id} className="flex items-center gap-[6px]">
                      {buidl.coverImage && (
                        <img
                          src={buidl.coverImage}
                          alt={buidl.title || ''}
                          className="w-[18px] h-[18px] object-cover shrink-0"
                        />
                      )}
                      <span className="text-xs text-muted-foreground truncate">{buidl.title}</span>
                    </div>
                  ))}
                  {buidls.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{buidls.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleSeeMore}>
            See more
          </Button>
        </div>
      )}
    </div>
  );
}

export default HackathonHackersTab;
