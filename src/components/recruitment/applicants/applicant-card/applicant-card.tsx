import { useUpdateApplicationChatroomV2Mutation } from '@/apollo/mutation/update-application-chatroom-v2.generated';
import { MarkdownPreviewer } from '@/components/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { sendMessage } from '@/lib/firebase-chat';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn, formatDate, getUserDisplayName, getUserInitialName } from '@/lib/utils';
import type { RecruitmentApplicant } from '@/types/recruitment';
import { Heart, Loader2, MapPin, Star, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

interface ApplicantCardProps {
  applicant: RecruitmentApplicant;
  onTogglePick?: (applicationId?: string | null, currentPicked?: boolean) => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ applicant, onTogglePick }) => {
  const isMobile = useIsMobile();

  const { id, userInfo, appliedDate, picked, chatroomMessageId } = applicant;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [updateApplicationChatroom, { loading: isUpdatingChatroom }] =
    useUpdateApplicationChatroomV2Mutation();

  const fullName = getUserDisplayName(userInfo.nickname, userInfo.email);
  const initials = getUserInitialName(userInfo.nickname, userInfo.email);

  const handleMessageClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!applicant.applicationId) {
      notify('Application ID is missing', 'error');
      return;
    }

    try {
      if (chatroomMessageId) {
        navigate(
          `/dashboard/recruitment/sponsor/${applicant.programId}?tab=message&chatroomId=${chatroomMessageId}`,
        );
        return;
      }

      const result = await updateApplicationChatroom({
        variables: {
          id: applicant.applicationId,
          input: {},
        },
      });

      if (result.data?.updateApplicationChatroomV2?.chatroomMessageId) {
        const newChatroomId = result.data.updateApplicationChatroomV2.chatroomMessageId;
        navigate(
          `/dashboard/recruitment/sponsor/${applicant.programId}?tab=message&chatroomId=${newChatroomId}`,
        );

        await sendMessage(
          newChatroomId || '',
          'Start by greeting the builder and sharing project details.',
          '0',
        );
        notify('Chatroom created successfully', 'success');
      } else {
        notify('Failed to create chatroom', 'error');
      }
    } catch (error) {
      console.error('Error updating application chatroom:', error);
      notify('Failed to create chatroom. Please try again.', 'error');
    }
  };

  return (
    <>
      <div
        className={cn(
          'bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer',
          isMobile && 'p-4',
        )}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex items-cetner gap-3">
                <Avatar className={cn('h-16 w-16', isMobile && 'h-12 w-12')}>
                  <AvatarImage src={userInfo.image || ''} alt={fullName} />
                  <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-around">
                  <div
                    className={cn(
                      'flex items-center gap-3 text-xl text-neutral-700',
                      isMobile && 'text-base',
                    )}
                  >
                    <Link
                      to={`/users/${userInfo.userId}`}
                      className="font-bold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {fullName}
                    </Link>
                    {userInfo.role && (
                      <p className={cn('text-sm text-muted-foreground', isMobile && 'text-xs')}>
                        {userInfo.role}
                      </p>
                    )}
                  </div>
                  <div
                    className={cn(
                      'flex items-center text-slate-500 text-sm',
                      isMobile && 'text-xs',
                    )}
                  >
                    {userInfo.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{userInfo.location}</span>
                      </div>
                    )}
                    {userInfo.hourlyRate && (
                      <div className="flex items-center">
                        <span className="mx-1">∙</span>
                        <div className="flex items-center gap-1">
                          <span>${userInfo.hourlyRate}/hour</span>
                        </div>
                      </div>
                    )}
                    {userInfo.star && (
                      <div className="flex items-center">
                        <span className="mx-1">∙</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{userInfo.star}</span>
                        </div>
                        <span className="mx-1">∙</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <div className="flex items-center gap-1">
                        Applied {appliedDate && formatDate(appliedDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={cn('flex items-center gap-3', isMobile && 'gap-1')}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  onClick={() => onTogglePick?.(id, picked)}
                  size={isMobile ? 'sm' : 'default'}
                >
                  {picked ? <Heart className="fill-red-500 text-red-500" /> : <Heart />}
                </Button>
                <Button
                  onClick={handleMessageClick}
                  disabled={isUpdatingChatroom}
                  size={isMobile ? 'sm' : 'default'}
                  className={cn(isMobile && 'text-xs')}
                >
                  {isUpdatingChatroom ? 'Creating...' : 'Message'}
                </Button>
              </div>
            </div>

            {((userInfo.skills && userInfo.skills.length > 0) ||
              (userInfo.tools && userInfo.tools.length > 0)) && (
              <div className="flex flex-col gap-5 mt-4 text-sm">
                {userInfo.skills && userInfo.skills.length > 0 && (
                  <div className="flex gap-3">
                    <div className="w-[65px] flex-shrink-0 text-gray-dark font-bold">Skills</div>
                    {userInfo.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                {userInfo.tools && userInfo.tools.length > 0 && (
                  <div className="flex gap-3">
                    <div className="w-[65px] flex-shrink-0 text-gray-dark font-bold">Tools</div>
                    {userInfo.tools.map((tool) => (
                      <Badge key={tool} variant="secondary" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobile ? (
        isDialogOpen && (
          <div className="fixed inset-0 z-50 bg-white flex flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <button type="button" onClick={() => setIsDialogOpen(false)} className="p-1">
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-base font-semibold">Application Details</h2>
              <Button size="sm" onClick={handleMessageClick} disabled={isUpdatingChatroom}>
                {isUpdatingChatroom ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Message'}
              </Button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* User Info */}
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={userInfo.image || ''} alt={fullName} />
                  <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      to={`/users/${userInfo.userId}`}
                      className="font-bold text-base hover:underline"
                    >
                      {fullName}
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePick?.(id, picked);
                      }}
                    >
                      {picked ? (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {userInfo.role && (
                    <p className="text-xs text-muted-foreground mb-1">{userInfo.role}</p>
                  )}
                  <div className="flex flex-wrap items-center text-slate-500 text-xs gap-1">
                    {userInfo.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{userInfo.location}</span>
                      </div>
                    )}
                    {userInfo.hourlyRate && (
                      <>
                        <span>∙</span>
                        <span>${userInfo.hourlyRate}/hour</span>
                      </>
                    )}
                    {userInfo.star && (
                      <>
                        <span>∙</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{userInfo.star}</span>
                        </div>
                      </>
                    )}
                    <>
                      <span>∙</span>
                      <span>Applied {appliedDate && formatDate(appliedDate)}</span>
                    </>
                  </div>
                </div>
              </div>

              {/* Skills & Tools & CV */}
              <div className="space-y-4">
                {userInfo.skills && userInfo.skills.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-gray-dark mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {userInfo.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {userInfo.tools && userInfo.tools.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-gray-dark mb-2">Tools</div>
                    <div className="flex flex-wrap gap-2">
                      {userInfo.tools.map((tool) => (
                        <Badge key={tool} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {userInfo.cv && (
                  <div>
                    <div className="text-xs font-bold text-gray-dark mb-2">Cover Letter</div>
                    <div className="prose prose-sm max-w-none border rounded-lg p-3 bg-gray-50">
                      <MarkdownPreviewer value={userInfo.cv} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-5xl! overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userInfo.image || ''} alt={fullName} />
                    <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xl text-neutral-700 mb-2">
                      <Link to={`/users/${userInfo.userId}`} className="font-bold hover:underline">
                        {fullName}
                      </Link>
                      {userInfo.role && (
                        <p className="text-sm text-muted-foreground">{userInfo.role}</p>
                      )}
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      {userInfo.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{userInfo.location}</span>
                        </div>
                      )}
                      {userInfo.hourlyRate && (
                        <div className="flex items-center">
                          <span className="mx-1">∙</span>
                          <span>${userInfo.hourlyRate}/hour</span>
                        </div>
                      )}
                      {userInfo.star && (
                        <div className="flex items-center">
                          <span className="mx-1">∙</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{userInfo.star}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="mx-1">∙</span>
                        <span>Applied {appliedDate && formatDate(appliedDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePick?.(id, picked);
                    }}
                  >
                    {picked ? <Heart className="fill-red-500 text-red-500" /> : <Heart />}
                  </Button>
                  <Button onClick={handleMessageClick} disabled={isUpdatingChatroom}>
                    {isUpdatingChatroom ? 'Creating...' : 'Message'}
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {userInfo.skills && userInfo.skills.length > 0 && (
                  <div>
                    <div className="text-sm font-bold text-gray-dark mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {userInfo.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {userInfo.tools && userInfo.tools.length > 0 && (
                  <div>
                    <div className="text-sm font-bold text-gray-dark mb-2">Tools</div>
                    <div className="flex flex-wrap gap-2">
                      {userInfo.tools.map((tool) => (
                        <Badge key={tool} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {userInfo.cv && (
                  <div>
                    <div className="text-sm font-bold text-gray-dark mb-3">Cover Letter</div>
                    <div className="prose prose-sm max-w-none max-h-[500px] overflow-y-auto border rounded-lg p-4 bg-gray-50">
                      <MarkdownPreviewer value={userInfo.cv} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ApplicantCard;
