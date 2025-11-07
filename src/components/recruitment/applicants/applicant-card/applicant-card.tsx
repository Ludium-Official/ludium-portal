import { useUpdateApplicationChatroomV2Mutation } from '@/apollo/mutation/update-application-chatroom-v2.generated';
import { MarkdownPreviewer } from '@/components/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import notify from '@/lib/notify';
import { formatDate } from '@/lib/utils';
import type { RecruitmentApplicant } from '@/types/recruitment';
import { Heart, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

interface ApplicantCardProps {
  applicant: RecruitmentApplicant;
  onTogglePick?: (applicationId?: string | null, currentPicked?: boolean) => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ applicant, onTogglePick }) => {
  const { id, userInfo, appliedDate, picked, chatroomMessageId } = applicant;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [updateApplicationChatroom, { loading: isUpdatingChatroom }] =
    useUpdateApplicationChatroomV2Mutation();

  const fullName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim();
  const initials = `${userInfo.firstName?.[0] || ''}${userInfo.lastName?.[0] || ''}`.toUpperCase();

  const handleMessageClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!applicant.applicationId) {
      notify('Application ID is missing', 'error');
      return;
    }

    try {
      if (chatroomMessageId) {
        navigate(`/profile/recruitment/sponser/${applicant.programId}?tab=message`);
        return;
      }

      const result = await updateApplicationChatroom({
        variables: {
          id: applicant.applicationId,
          input: {},
        },
      });

      if (result.data?.updateApplicationChatroomV2?.chatroomMessageId) {
        navigate(`/profile/recruitment/sponser/${applicant.programId}?tab=message`);
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
        className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-cetner gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userInfo.image || ''} alt={fullName} />
                  <AvatarFallback className="text-lg font-semibold">
                    {initials || '??'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-around">
                  <div className="flex items-center gap-3 text-xl text-neutral-700">
                    <Link
                      to={`/users/${userInfo.userId}`}
                      className="font-bold"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="mx-1">∙</span>
                      <div className="flex items-center gap-1">
                        Applied {appliedDate && formatDate(appliedDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" onClick={() => onTogglePick?.(id, picked)}>
                  {picked ? <Heart className="fill-red-500 text-red-500" /> : <Heart />}
                </Button>
                <Button onClick={handleMessageClick} disabled={isUpdatingChatroom}>
                  {isUpdatingChatroom ? 'Creating...' : 'Message'}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-5 text-sm">
              {userInfo.cv && (
                <div className="flex gap-3">
                  <div className="w-[65px] flex-shrink-0 text-gray-dark font-bold">CV</div>
                  <p className="text-gray-700 line-clamp-2">{userInfo.cv}</p>
                </div>
              )}

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
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl! overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userInfo.image || ''} alt={fullName} />
                <AvatarFallback className="text-lg font-semibold">
                  {initials || '??'}
                </AvatarFallback>
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

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicantCard;
