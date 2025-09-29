import client from '@/apollo/client';
import { useMarkNotificationAsReadMutation } from '@/apollo/mutation/mark-notification-as-read.generated';
import { GetNotificationsDocument } from '@/apollo/queries/notifications.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getInitials } from '@/lib/utils';
import { TierBadge, type TierType } from '@/pages/investments/_components/tier-badge';
import type { Notification } from '@/types/types.generated';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router';

function ConditionCard({ notification }: { notification: Notification }) {
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
      to={`/${notification.metadata?.programType === 'funding' ? 'investments' : 'programs'}/${notification.entityId}`}
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
      className={cn('block border rounded-lg p-3 space-y-2', notification?.readAt && 'opacity-50')}
    >
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Avatar placeholder */}
          <Avatar className="w-8 h-8">
            <AvatarImage src={notification.metadata?.avatar || ''} />
            <AvatarFallback>
              {getInitials(notification.metadata?.applicantName || '')}
            </AvatarFallback>
          </Avatar>

          <p className="font-bold text-sm">{notification.metadata?.applicantName}</p>
        </div>

        <p className="text-xs text-muted-foreground">
          {getTimeDisplay(notification.createdAt ?? '')}
        </p>
      </header>
      {notification.metadata?.programType !== 'funding' && (
        <p className="text-xs text-muted-foreground">
          You are invited to <span className="font-bold">{notification.metadata?.programName}</span>
        </p>
      )}

      {notification.metadata?.programType === 'funding' && (
        <p className="text-xs text-muted-foreground">
          <span className="font-bold">{notification.metadata?.programName}</span> has given you a
          tier
        </p>
      )}

      {notification.metadata?.programType === 'funding' && (
        <div className="flex items-center justify-between px-2 py-1.5 bg-[#0000000A] rounded-md">
          <p className="text-xs text-neutral-400 font-medium">TIER</p>
          {<TierBadge tier={notification.metadata?.tier as TierType} />}
          {/* <span className=" block bg-[#FFDEA1] rounded-full px-2 py-0.5 text-xs text-[#CA8A04] font-bold">
          {notification.metadata?.tier}
        </span> */}
        </div>
      )}
    </Link>
  );
}

export default ConditionCard;
