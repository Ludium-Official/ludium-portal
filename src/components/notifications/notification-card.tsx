import { useMarkNotificationAsReadMutation } from '@/apollo/mutation/mark-notification-as-read.generated';
import { Button } from '@/components/ui/button';
import { type Notification, NotificationType } from '@/types/types.generated';
import { ChevronRight, CircleX } from 'lucide-react';
import { Link } from 'react-router';

function NotificationCard({ notification }: { notification: Notification }) {
  console.log('🚀 ~ NotificationCard ~ notification:', notification);
  const { type, action } = notification;

  const [markAsRead] = useMarkNotificationAsReadMutation();

  let text = '';
  let link = null;

  if (type === NotificationType.Program) {
    text = `Your ${type} is successfully ${action}!`;
    link = `/programs/${notification.entityId}`;
  } else if (type === NotificationType.Application) {
    text = `Application for your program has been ${action}!`;
    link = notification?.metadata?.programId
      ? `/programs/${notification?.metadata?.programId}/application/${notification.entityId}`
      : null;
  } else {
    text = `${type} ${action}`;
  }

  const typeUpperFirst = type?.length ? type.charAt(0).toUpperCase() + type.slice(1) : type;
  const actionUpperFirst = action?.length
    ? action.charAt(0).toUpperCase() + action.slice(1)
    : action;

  return (
    <div className="border rounded-md py-4 px-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-[#861CC4]">
          {typeUpperFirst} {actionUpperFirst}
        </h3>

        <Button
          className="h-10"
          variant="ghost"
          type="button"
          onClick={() =>
            markAsRead({
              variables: {
                id: notification.id ?? '',
              },
            })
          }
        >
          <CircleX className="w-4 h-4 text-red-500" />
        </Button>
      </div>
      <p className="text-sm mb-2">{text}</p>

      <p className="text-xs">{typeUpperFirst} ID:</p>
      <p className="text-xs font-medium">{notification.entityId}</p>

      {link && (
        <div className="flex justify-end mt-4">
          <Link to={link} className="flex items-center text-sm hover:underline">
            Check <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default NotificationCard;
