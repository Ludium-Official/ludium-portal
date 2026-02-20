import { useHackathonBuidlsQuery } from '@/apollo/queries/hackathon-buidls.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials, getUserDisplayName } from '@/lib/utils';
import { Link } from 'react-router';

interface HackathonBuidlsTabProps {
  hackathonId: string;
}

function HackathonBuidlsTab({ hackathonId }: HackathonBuidlsTabProps) {
  const { data, loading } = useHackathonBuidlsQuery({
    variables: { hackathonId },
  });

  const buidls = data?.hackathonBuidls ?? [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!buidls.length) {
    return (
      <div className="mt-3 text-center text-muted-foreground py-16">No BUIDLs submitted yet.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
      {buidls.map((buidl) => (
        <Link
          key={buidl.id}
          to={`/programs/hackathon/${hackathonId}/buidl/${buidl.id}`}
          className="flex gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <div className="flex gap-3">
              <div>
                <div className="font-semibold text-sm leading-snug line-clamp-2">{buidl.title}</div>
                <div className="flex items-center gap-2">
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
            <div className='flex justify-between px-2 py-1 rounded-md bg-black/5 text-xs text-neutral-400 font-bold'>
              <div>Tracks</div>
              {buidl.tracks && buidl.tracks.length > 0 && (
                <div className="text-muted-foreground">
                  {buidl.tracks.map((track) => (
                    <Badge
                      key={track.id}
                      variant="outline"
                      className='border-none'
                    >
                      {track.title}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-foreground line-clamp-2">{buidl.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default HackathonBuidlsTab;
