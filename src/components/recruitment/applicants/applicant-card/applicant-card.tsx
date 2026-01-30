import LudiumBadgeLogo from '@/assets/icons/profile/ludium-badge.svg';
import { useUpdateApplicationChatroomV2Mutation } from '@/apollo/mutation/update-application-chatroom-v2.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MobileFullScreenDialog } from '@/components/ui/mobile-full-screen-dialog';
import { sendMessage } from '@/lib/firebase-chat';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn, formatDate, getUserDisplayName, getUserInitialName } from '@/lib/utils';
import type { RecruitmentApplicant } from '@/types/recruitment';
import { ChevronDown, ChevronUp, MapPin, Pin, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCreateChatNotificationV2Mutation } from '@/apollo/mutation/create-chat-notification-v2.generated';
import { fetchTimezones, Timezone } from '@/lib/api/timezones';

interface ApplicantCardProps {
  applicant: RecruitmentApplicant;
  onTogglePick?: (applicationId?: string | null, currentPicked?: boolean) => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ applicant, onTogglePick }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { id, userInfo, appliedDate, picked, chatroomMessageId } = applicant;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedPortfolioId, setExpandedPortfolioId] = useState<string | null>(null);
  const [location, setLocation] = useState<Timezone | null>(null);

  const [updateApplicationChatroom, { loading: isUpdatingChatroom }] =
    useUpdateApplicationChatroomV2Mutation();
  const [createChatNotification] = useCreateChatNotificationV2Mutation();

  const fullName = getUserDisplayName(userInfo.nickname, userInfo.email);
  const initials = getUserInitialName(userInfo.nickname, userInfo.email);

  const handleMessageClick = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

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
        await createChatNotification({
          variables: {
            entityId: newChatroomId,
            recipientId: Number(userInfo.userId),
            metadata: {
              programId: applicant.programId,
            },
          },
        });
        notify('Chatroom created successfully', 'success');
      } else {
        notify('Failed to create chatroom', 'error');
      }
    } catch (error) {
      console.error('Error updating application chatroom:', error);
      notify('Failed to create chatroom. Please try again.', 'error');
    }
  };

  useEffect(() => {
    const loadTimezones = async () => {
      try {
        const data = await fetchTimezones();

        setLocation(data.find((tz) => tz.value === userInfo.location) || null);
      } catch (error) {
        console.error('Failed to fetch timezones:', error);
      }
    };
    loadTimezones();
  }, [userInfo.location]);

  const locationLabel = location?.label || userInfo.location;

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
            <div className={cn('flex items-start justify-between', isMobile && 'flex-col')}>
              <div className={cn('flex items-center gap-3', isMobile && 'mb-3')}>
                <Avatar className={cn('h-16 w-16', isMobile && 'h-12 w-12')}>
                  <AvatarImage src={userInfo.image || ''} alt={fullName} />
                  <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-around gap-2">
                  <div
                    className={cn(
                      'flex items-center gap-3 text-xl text-neutral-700',
                      isMobile && 'flex-col items-start gap-1 text-base',
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
                  {!isMobile && (
                    <div
                      className={cn(
                        'flex items-center text-slate-500 text-sm',
                        isMobile && 'text-xs',
                      )}
                    >
                      {locationLabel && (
                        <div className="flex items-center">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{locationLabel}</span>
                          </div>
                          <span className="mx-1">∙</span>
                        </div>
                      )}
                      {userInfo.hourlyRate && (
                        <div className="flex items-center">
                          <div className="flex items-center gap-1">
                            <span>${userInfo.hourlyRate}/hour</span>
                          </div>
                          <span className="mx-1">∙</span>
                        </div>
                      )}
                      {userInfo.star && (
                        <div className="flex items-center">
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
                  )}
                </div>
              </div>
              {!isMobile && (
                <div
                  className={cn('flex items-center gap-3', isMobile && 'gap-1')}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    onClick={() => onTogglePick?.(id, picked)}
                    size={isMobile ? 'sm' : 'default'}
                    className="rounded-full border bg-zinc-100 [&_svg]:text-slate-400 w-10 h-10"
                  >
                    {picked ? <Pin className="fill-slate-400" /> : <Pin />}
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
              )}
              {isMobile && (
                <div
                  className={cn('flex items-center text-slate-500 text-sm', isMobile && 'text-xs')}
                >
                  {locationLabel && (
                    <div className="flex items-center">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{locationLabel}</span>
                      </div>
                      <span className="mx-1">∙</span>
                    </div>
                  )}
                  {userInfo.hourlyRate && (
                    <div className="flex items-center">
                      <div className="flex items-center gap-1">
                        <span>${userInfo.hourlyRate}/hour</span>
                      </div>
                      <span className="mx-1">∙</span>
                    </div>
                  )}
                  {userInfo.star && (
                    <div className="flex items-center">
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
              )}
            </div>

            {((userInfo.skills && userInfo.skills.length > 0) ||
              (userInfo.tools && userInfo.tools.length > 0)) && (
              <div className="flex flex-col gap-5 mt-4 text-sm">
                {userInfo.skills && userInfo.skills.length > 0 && (
                  <div className={cn('flex gap-3', isMobile && 'text-sm')}>
                    <div
                      className={cn(
                        'w-[65px] flex-shrink-0 text-gray-dark font-bold',
                        isMobile && 'w-auto',
                      )}
                    >
                      Skills
                    </div>
                    <div className={cn('flex flex-wrap gap-3', isMobile && 'gap-1')}>
                      {userInfo.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
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
        <MobileFullScreenDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Application Details"
          onAction={() => handleMessageClick()}
          actionLabel="Message"
          actionDisabled={isUpdatingChatroom}
          actionLoading={isUpdatingChatroom}
        >
          <div className="flex flex-col gap-3 border-b mb-4 pb-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userInfo.image || ''} alt={fullName} />
                <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      to={`/users/${userInfo.userId}`}
                      className="font-bold text-base hover:underline"
                    >
                      {fullName}
                    </Link>
                  </div>
                  {userInfo.role && (
                    <p className="text-xs text-muted-foreground">{userInfo.role}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border bg-zinc-100 [&_svg]:text-slate-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePick?.(id, picked);
                  }}
                >
                  {picked ? <Pin className="fill-slate-400" /> : <Pin />}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center text-slate-500 text-xs gap-1">
              {locationLabel && (
                <div className="flex items-center">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{locationLabel}</span>
                  </div>
                  <span className="mx-1">∙</span>
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
                <span>Applied {appliedDate && formatDate(appliedDate)}</span>
              </>
            </div>
          </div>

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
                  {userInfo.cv}
                </div>
              </div>
            )}
          </div>
        </MobileFullScreenDialog>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-5xl! max-h-[90vh] overflow-y-auto">
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
                      {locationLabel && (
                        <div className="flex items-center">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{locationLabel}</span>
                          </div>
                          <span className="mx-1">∙</span>
                        </div>
                      )}
                      {userInfo.hourlyRate && (
                        <div className="flex items-center gap-1">
                          <span>${userInfo.hourlyRate}/hour</span>
                          <span className="mx-1">∙</span>
                        </div>
                      )}
                      {userInfo.star && (
                        <div className="flex items-center">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{userInfo.star}</span>
                          </div>
                          <span className="mx-1">∙</span>
                        </div>
                      )}
                      <div className="flex items-center">
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
                    className="rounded-full border bg-zinc-100 [&_svg]:text-slate-400 w-10 h-10"
                  >
                    {picked ? <Pin className="fill-slate-400" /> : <Pin />}
                  </Button>
                  <Button onClick={handleMessageClick} disabled={isUpdatingChatroom} size={isMobile ? 'sm' : 'default'}>
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
                  <>
                    <div>
                      <div className="text-sm font-bold text-gray-dark mb-3">Cover Letter</div>
                      <div className="prose prose-sm max-w-none max-h-[500px] overflow-y-auto border rounded-lg p-4 bg-gray-50">
                        {userInfo.cv}
                      </div>
                    </div>
                    {userInfo.portfolios && (
                      <div>
                        <div className="text-sm font-bold text-gray-dark mb-3">Portfolio</div>
                        <div className="prose prose-sm max-w-none">
                          {userInfo.portfolios.map((portfolio) => {
                            const isExpanded = expandedPortfolioId === portfolio.id;

                            return (
                              <div key={portfolio.id} className="border rounded-lg">
                                <div className="flex items-center justify-between px-5 py-7">
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">{portfolio.title}</span>
                                    {portfolio.isLudiumProject && (
                                      <img
                                        src={LudiumBadgeLogo}
                                        alt="Ludium Badge"
                                        className="my-0!"
                                      />
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedPortfolioId(
                                        isExpanded ? null : (portfolio.id ?? null),
                                      )
                                    }
                                    className="p-1"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    )}
                                  </button>
                                </div>
                                {isExpanded && (
                                  <div className="px-4 pb-4 border-t pt-3">
                                    <div className="text-sm font-medium text-muted-foreground mb-1">
                                      {portfolio.role}
                                    </div>
                                    <div className="text-sm text-muted-foreground mb-3">
                                      {portfolio.description}
                                    </div>
                                    {portfolio.images && portfolio.images.length > 0 && (
                                      <Carousel className="w-full">
                                        <CarouselContent className="overflow-y-auto">
                                          {portfolio.images.map((image, index) => (
                                            <CarouselItem key={index}>
                                              <img
                                                src={image}
                                                alt={`${portfolio.title ?? ''} ${index + 1}`}
                                                className="w-full object-cover rounded-md my-0!"
                                              />
                                            </CarouselItem>
                                          ))}
                                        </CarouselContent>
                                      </Carousel>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
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
