import {
  type HackathonBuidlsQuery,
  useHackathonBuidlsQuery,
} from '@/apollo/queries/hackathon-buidls.generated';
import MarkdownPreviewer from '@/components/markdown/markdown-previewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials, getUserDisplayName } from '@/lib/utils';
import { Github, Globe, Play } from 'lucide-react';
import { useState } from 'react';

const PAGE_LIMIT = 12;

interface HackathonBuidlsTabProps {
  hackathonId: string;
}

type Buidl = NonNullable<
  NonNullable<NonNullable<HackathonBuidlsQuery['hackathonBuidls']>['data']>[number]
>;

function HackathonBuidlsTab({ hackathonId }: HackathonBuidlsTabProps) {
  const [selectedBuidl, setSelectedBuidl] = useState<Buidl | null>(null);

  const { data, loading, fetchMore } = useHackathonBuidlsQuery({
    variables: { hackathonId, page: 1, limit: PAGE_LIMIT },
  });

  const paginated = data?.hackathonBuidls;
  const buidls = paginated?.data ?? [];
  const hasNextPage = paginated?.hasNextPage ?? false;
  const currentPage = paginated?.currentPage ?? 1;

  const handleSeeMore = () => {
    fetchMore({
      variables: { hackathonId, page: currentPage + 1, limit: PAGE_LIMIT },
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
    <>
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

      <Dialog open={!!selectedBuidl} onOpenChange={(open) => !open && setSelectedBuidl(null)}>
        <DialogContent className="gap-0 max-w-[920px]! max-h-[85vh] overflow-y-auto p-0">
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
                        <a
                          href={selectedBuidl.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <Github className="w-4 h-4 shrink-0 text-gray-500" />
                          {selectedBuidl.githubLink}
                        </a>
                      )}
                      {selectedBuidl.websiteLink && (
                        <a
                          href={selectedBuidl.websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <Globe className="w-4 h-4 shrink-0 text-gray-500" />
                          {selectedBuidl.websiteLink}
                        </a>
                      )}
                      {selectedBuidl.demoVideoLink && (
                        <a
                          href={selectedBuidl.demoVideoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <Play className="w-4 h-4 shrink-0 text-gray-500" />
                          {selectedBuidl.demoVideoLink}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {selectedBuidl.buidlDescription && (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-bold text-slate-800">Detail</div>
                    <div className="border border-gray-200 rounded-lg px-5 py-4">
                      <MarkdownPreviewer value={selectedBuidl.buidlDescription} />
                    </div>
                  </div>
                )}

                {selectedBuidl.builders && selectedBuidl.builders.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-bold text-slate-800">Members</div>
                    <div className="flex flex-wrap gap-3">
                      {selectedBuidl.builders.map((builder) => {
                        const name = getUserDisplayName(builder.user?.nickname, undefined);
                        return (
                          <div key={builder.id} className="flex items-center gap-1.5">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={builder.user?.profileImage || ''} />
                              <AvatarFallback className="text-[10px]">
                                {getInitials(name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedBuidl.socialLinks && selectedBuidl.socialLinks.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-bold text-slate-800">Social</div>
                    <div className="flex flex-col gap-1.5">
                      {selectedBuidl.socialLinks.map((link) => (
                        <a
                          key={link}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <Globe className="w-4 h-4 shrink-0 text-gray-500" />
                          {link}
                        </a>
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
  );
}

export default HackathonBuidlsTab;
