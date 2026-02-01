import client from '@/apollo/client';
import { useMarkNotificationAsReadV2Mutation } from '@/apollo/mutation/mark-notification-as-read-v2.generated';
import { GetNotificationsV2Document } from '@/apollo/queries/notifications-v2.generated';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  type NotificationV2,
  NotificationV2Action,
  NotificationV2Type,
} from '@/types/types.generated';
import { Check } from 'lucide-react';
import { Link } from 'react-router';

function ProgressCard({ notification }: { notification: NotificationV2 }) {
  const isMobile = useIsMobile();

  const { type, action, readAt, metadata, title, content } = notification;

  const [markAsRead] = useMarkNotificationAsReadV2Mutation();

  let link = null;

  const icon =
    action !== NotificationV2Action.Rejected ? (
      <span className="bg-green-400 text-white flex items-center justify-center rounded-full w-4 h-4">
        <Check className="w-3 h-3" />
      </span>
    ) : (
      <span className="bg-red-500 text-white flex items-center justify-center rounded-full w-4 h-4">
        <span className="text-xs">!</span>
      </span>
    );

  if (type === NotificationV2Type.Contract && action === NotificationV2Action.Completed) {
    link = metadata?.programId
      ? `/dashboard/recruitment/sponsor/${metadata?.programId}?tab=message&chatroomId=${metadata?.chatroomId}`
      : null;
  } else if (
    type === NotificationV2Type.Contract ||
    (type === NotificationV2Type.Application && action === NotificationV2Action.Created) ||
    (type === NotificationV2Type.System && action === NotificationV2Action.Created)
  ) {
    link = metadata?.programId
      ? `/dashboard/recruitment/builder/${metadata?.programId}?tab=message`
      : null;
  } else if (type === NotificationV2Type.Application && action === NotificationV2Action.Submitted) {
    link = metadata?.programId
      ? `/dashboard/recruitment/sponsor/${metadata?.programId}?tab=applicants`
      : null;
  } else if (type === NotificationV2Type.Article && action === NotificationV2Action.Created) {
    link = `/community/articles/${metadata?.articleId}`;
  } else if (type === NotificationV2Type.Thread && action === NotificationV2Action.Created) {
    link = `/community/threads/${metadata?.threadId}`;
  }

  return (
    <Link
      to={link ?? ''}
      onClick={() =>
        markAsRead({
          variables: {
            notificationId: notification.id ?? '',
          },
          onCompleted: () => {
            client.refetchQueries({ include: [GetNotificationsV2Document] });
          },
        })
      }
      className={cn('flex gap-3 items-center border rounded-md py-4 px-3', readAt && 'opacity-50')}
    >
      {icon}
      <div className={cn("flex flex-col gap-1 font-semibold", isMobile && 'text-sm')}>
        {title}
        <div className={cn("text-sm font-medium text-secondary-foreground", isMobile && 'text-xs')}>{content}</div>
      </div>
    </Link>
  );
}

export default ProgressCard;
