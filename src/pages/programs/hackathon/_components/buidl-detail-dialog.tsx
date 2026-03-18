import GithubIcon from '@/assets/icons/hackathon/github.svg';
import BrowserIcon from '@/assets/icons/hackathon/browser.svg';
import VideoIcon from '@/assets/icons/hackathon/video.svg';
import MarkdownPreviewer from '@/components/markdown/markdown-previewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MobileFullScreenDialog } from '@/components/ui/mobile-full-screen-dialog';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { getInitials, getUserDisplayName } from '@/lib/utils';
import { Link, useNavigate } from 'react-router';

export interface BuidlDialogItem {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  coverImage?: string | null;
  githubLink?: string | null;
  websiteLink?: string | null;
  demoVideoLink?: string | null;
  buidlDescription?: string | null;
  sponsors?: Array<{
    id?: string | null;
    name?: string | null;
    sponsorImage?: string | null;
  }> | null;
  builders?: Array<{
    id?: string | null;
    user?: {
      nickname?: string | null;
      profileImage?: string | null;
    } | null;
  }> | null;
  socialLinks?: Array<string> | null;
  owner?: {
    id?: string | null;
    nickname?: string | null;
    profileImage?: string | null;
  } | null;
}

interface BuidlDetailDialogProps {
  buidl: BuidlDialogItem | null;
  hackathonId: string;
  onClose: () => void;
  mobileTitle?: string;
}

function BuidlDetailContent({ buidl }: { buidl: BuidlDialogItem }) {
  return (
    <div className="flex flex-col gap-[30px]">
      {buidl.sponsors && buidl.sponsors.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold text-slate-800">Track</div>
          <div className="flex flex-wrap gap-2">
            {buidl.sponsors.map((sponsor) => (
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

      {(buidl.githubLink || buidl.websiteLink || buidl.demoVideoLink) && (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold text-slate-800">Link</div>
          <div className="flex flex-col gap-1.5">
            {buidl.githubLink && (
              <Link
                to={buidl.githubLink}
                target="_blank"
                className="flex items-center gap-2 text-sm underline"
              >
                <img src={GithubIcon} alt="github" className="h-6" />
                {buidl.githubLink}
              </Link>
            )}
            {buidl.websiteLink && (
              <Link
                to={buidl.websiteLink}
                target="_blank"
                className="flex items-center gap-2 text-sm underline"
              >
                <img src={BrowserIcon} alt="browser" className="h-6" />
                {buidl.websiteLink}
              </Link>
            )}
            {buidl.demoVideoLink && (
              <Link
                to={buidl.demoVideoLink}
                target="_blank"
                className="flex items-center gap-2 text-sm underline"
              >
                <img src={VideoIcon} alt="video" className="h-6" />
                {buidl.demoVideoLink}
              </Link>
            )}
          </div>
        </div>
      )}

      {buidl.buidlDescription && (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold text-slate-800">Detail</div>
          <div className="max-h-[256px] overflow-y-auto bg-slate-50 border border-slate-200 rounded-lg p-5">
            <MarkdownPreviewer value={buidl.buidlDescription} />
          </div>
        </div>
      )}

      {buidl.builders && buidl.builders.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold text-slate-800">Members</div>
          <div className="flex flex-wrap gap-4">
            {buidl.builders.map((builder) => {
              const name = getUserDisplayName(builder.user?.nickname, undefined);
              return (
                <div key={builder.id} className="flex items-center gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={builder.user?.profileImage || ''} />
                    <AvatarFallback className="text-[10px]">{getInitials(name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {buidl.socialLinks && buidl.socialLinks.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold text-slate-800">Social</div>
          <div className="flex flex-col gap-[18px]">
            {buidl.socialLinks.map((link) => (
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
  );
}

export function BuidlDetailDialog({
  buidl,
  hackathonId,
  onClose,
  mobileTitle = 'BUIDLs',
}: BuidlDetailDialogProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const isOwner = buidl?.owner?.id && String(buidl.owner.id) === String(userId);

  const handleEdit = () => {
    if (!buidl?.id) return;
    navigate(`/programs/hackathon/${hackathonId}/buidl/${buidl.id}/edit`, {
      state: { buidl },
    });
  };

  if (isMobile) {
    return (
      <MobileFullScreenDialog
        open={!!buidl}
        onClose={onClose}
        title={mobileTitle}
        contentClassName="p-0"
        actionChildren={
          isOwner ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          ) : undefined
        }
      >
        {buidl && (
          <>
            <div className="px-4 pt-4 pb-[30px] mb-[30px] border-b border-gray-200">
              <div className="flex flex-col gap-5">
                {buidl.coverImage && (
                  <img
                    src={buidl.coverImage}
                    alt={buidl.title || ''}
                    className="w-24 h-24 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex flex-col gap-[14px] min-w-0">
                  <div className="text-lg font-semibold">{buidl.title}</div>
                  <div className="text-sm text-muted-foreground">{buidl.description}</div>
                </div>
              </div>
            </div>
            <div className="px-4 pb-6">
              <BuidlDetailContent buidl={buidl} />
            </div>
          </>
        )}
      </MobileFullScreenDialog>
    );
  }

  return (
    <Dialog open={!!buidl} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="gap-0 max-w-[920px]! max-h-[85vh] overflow-y-auto p-0"
        overlayClassName="bg-black/80"
      >
        {buidl && (
          <>
            <DialogHeader className="px-10 pt-[50px] pb-[30px] mb-[30px] border-b border-gray-200">
              {isOwner && (
                <div className="flex justify-end -mt-7 mb-2">
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    Edit
                  </Button>
                </div>
              )}
              <div className="flex gap-5">
                {buidl.coverImage && (
                  <img
                    src={buidl.coverImage}
                    alt={buidl.title || ''}
                    className="w-36 h-36 rounded-lg object-cover shrink-0"
                  />
                )}
                <DialogTitle className="flex flex-col gap-[14px] text-xl font-semibold">
                  {buidl.title}
                  <div className="text-sm">{buidl.description}</div>
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="px-10 pb-[50px]">
              <BuidlDetailContent buidl={buidl} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
