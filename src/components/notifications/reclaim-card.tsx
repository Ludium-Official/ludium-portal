import client from '@/apollo/client';
import { useMarkNotificationAsReadMutation } from '@/apollo/mutation/mark-notification-as-read.generated';
import { GetNotificationsDocument } from '@/apollo/queries/notifications.generated';
import { ApplicationStatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { getCurrency, getCurrencyIcon, getInitials } from '@/lib/utils';
import type { Notification } from '@/types/types.generated';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router';

function ReclaimCard({ notification }: { notification: Notification }) {
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const getTimeDisplay = (createdAt: string) => {
    const notificationDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return 'today';
    }

    return formatDistanceToNow(notificationDate, { addSuffix: true });
  };

  return (
    <Link
      to={`/investments/${notification.entityId}`}
      onClick={() => {
        markAsRead({
          variables: {
            id: notification.id ?? '',
          },
          onCompleted: () => {
            client.refetchQueries({ include: [GetNotificationsDocument] });
          },
        });
      }}
      className="block border rounded-lg p-3 space-y-2"
    >
      <header className="flex justify-between items-center mb-3">
        <span className="block px-2 py-0.5 bg-[#0000000A] rounded-full font-semibold text-xs">
          {notification.metadata?.programType === 'funding' ? 'Investment' : 'Recruitment'}
        </span>

        <p className="text-xs text-muted-foreground">
          {getTimeDisplay(notification.createdAt ?? '')}
        </p>
      </header>
      <div className="flex items-center gap-2">
        {/* Avatar placeholder */}
        <Avatar className="w-8 h-8">
          <AvatarImage src={notification.metadata?.avatar || ''} />
          <AvatarFallback>{getInitials(notification.metadata?.applicantName || '')}</AvatarFallback>
        </Avatar>

        <p className="font-bold text-sm">{notification.metadata?.applicantName}</p>
      </div>

      <div className="text-sm bg-secondary py-1 px-2 items-center rounded-md">
        <div className="flex justify-between self-start">
          <span className="text-neutral-400 mr-3">PRICE</span>{' '}
          <div className="flex items-center">
            <span className="flex items-center text-muted-foreground gap-1 font-medium">
              {notification.metadata?.price ??
                notification.metadata?.fundingProgress?.currentAmount}{' '}
              {getCurrencyIcon(notification.metadata?.currency)} {notification.metadata?.currency}
            </span>
            <span className="block ml-2 border-l pl-2 text-muted-foreground font-medium">
              {getCurrency(notification.metadata?.network)?.display}
            </span>
          </div>
        </div>

        {notification.metadata?.programType === 'funding' && (
          <div className="flex justify-between items-center self-start mt-1 gap-2">
            <span className="text-neutral-400">STATUS</span>{' '}
            {/* <div className="flex items-center"> */}
            <Progress
              value={25}
              rootClassName="w-full bg-gray-200"
              indicatorClassName="bg-primary"
            />
            {/* </div> */}
            <div className="flex items-center gap-0.5">
              <p className="font-bold text-xl text-primary">
                {notification.metadata?.fundingProgress?.percentage ?? 0}
              </p>
              <p className="font-bold text-sm text-muted-foreground">%</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">{notification.metadata?.milestoneName}</p>
        <ApplicationStatusBadge application={{ status: notification.metadata?.milestoneStatus }} />
      </div>
    </Link>
  );
}

export default ReclaimCard;
