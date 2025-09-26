import client from '@/apollo/client';
import { useMarkNotificationAsReadMutation } from '@/apollo/mutation/mark-notification-as-read.generated';
import { GetNotificationsDocument } from '@/apollo/queries/notifications.generated';
import { cn } from '@/lib/utils';
import { type Notification, NotificationAction, NotificationType } from '@/types/types.generated';
import { Check } from 'lucide-react';
import { Link } from 'react-router';

function ProgressCard({ notification }: { notification: Notification }) {
  const { type, action, readAt } = notification;

  const [markAsRead] = useMarkNotificationAsReadMutation();

  // let text = '';
  let link = null;
  const content = (
    <p className="text-sm font-medium text-secondary-foreground">
      <span className="font-bold">Your {type}</span> is {action}
    </p>
  );

  const icon =
    action !== NotificationAction.Rejected ? (
      <span className="bg-green-400 text-white flex items-center justify-center rounded-full w-4 h-4">
        <Check className="w-3 h-3" />
      </span>
    ) : (
      <span className="bg-red-500 text-white flex items-center justify-center rounded-full w-4 h-4">
        <span className="text-xs">!</span>
      </span>
    );

  if (type === NotificationType.Program) {
    // text = `Your ${type} is successfully ${action}!`;
    link = `/programs/${notification.entityId}`;
  } else if (type === NotificationType.Application) {
    // text = `Application for your program has been ${action}!`;
    link = notification?.metadata?.programId
      ? `/programs/${notification?.metadata?.programId}/application/${notification.entityId}`
      : null;
  } else {
    // text = `${type} ${action}`;
  }

  return (
    <Link
      to={link ?? ''}
      onClick={() =>
        markAsRead({
          variables: {
            id: notification.id ?? '',
          },
          onCompleted: () => {
            client.refetchQueries({ include: [GetNotificationsDocument] });
          },
        })
      }
      className={cn('flex gap-2 items-center border rounded-md py-4 px-3', readAt && 'opacity-50')}
    >
      {/* <p className="text-sm">{text}</p> */}
      {icon} {content}
    </Link>
  );
}

export default ProgressCard;
