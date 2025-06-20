import { useMarkAllNotificationsAsReadMutation } from '@/apollo/mutation/mark-all-notifications-as-read.generated';
import { useCountNotificationsSubscription } from '@/apollo/subscriptions/count-notifications.generated';
import { useNotificationsSubscription } from '@/apollo/subscriptions/notifications.generated';
import NotificationCard from '@/components/notifications/notification-card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

function Notifications() {
  const location = useLocation();
  const [openNotifications, setOpenNotifications] = useState(false);

  const { data } = useNotificationsSubscription();
  const { data: countData } = useCountNotificationsSubscription();

  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  useEffect(() => {
    setOpenNotifications(false);
  }, [location]);
  return (
    <div>
      <Popover open={openNotifications} onOpenChange={setOpenNotifications}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-10 relative">
            <Bell />
            {!!countData?.countNotifications && (
              <span className="flex justify-center items-center w-4 h-4 text-xs rounded-full bg-red-500 absolute -top-[5px] -right-[5px] text-white">
                {countData.countNotifications}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            'overflow-auto max-h-[500px]',
            !data?.notifications?.length ? 'min-w-none' : 'min-w-[348px]',
          )}
        >
          {data?.notifications?.length ? (
            <div>
              <div className="space-y-4 mb-10">
                {data?.notifications?.map((n) => (
                  <NotificationCard notification={n} key={n.id} />
                ))}
              </div>
              <Button
                onClick={() => markAllAsRead()}
                className="w-full sticky bottom-4 bg-red-500"
                variant="destructive"
              >
                Delete All
              </Button>
            </div>
          ) : (
            <p className="text-sm text-center">No notifications yet.</p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Notifications;
