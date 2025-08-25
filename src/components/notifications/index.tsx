import { useMarkAllNotificationsAsReadMutation } from '@/apollo/mutation/mark-all-notifications-as-read.generated';
import { useCountNotificationsSubscription } from '@/apollo/subscriptions/count-notifications.generated';
import { useNotificationsSubscription } from '@/apollo/subscriptions/notifications.generated';
import NotificationCard from '@/components/notifications/notification-card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { PopoverClose } from '@radix-ui/react-popover';
import { Bell, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

function Notifications() {
  const location = useLocation();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
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
            'overflow-auto w-[410px]',
            // !data?.notifications?.length ? 'min-w-none' : 'min-w-[348px]',
          )}
        >

          <div className='flex justify-end mb-[14px]'>
            <PopoverClose className='cursor-pointer'>
              <X className='text-foreground w-4 h-4' />
            </PopoverClose>
          </div>

          <div className='flex justify-between items-center mb-3'>
            <h3 className='text-lg font-bold'>Notifications</h3>
            <div className='flex items-center gap-2'>
              <Switch />
              <p className='text-sm'>Unread</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto mb-3">
            <TabsList className="w-auto bg-gray-100 p-1">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="reclaim">Reclaim</TabsTrigger>
              <TabsTrigger value="investment-condition">Ivestment Condition</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
          </Tabs>

          <ScrollArea className='relative overflow-auto h-[calc(100vh-235px)] pb-5'>
            {/* 
            <div className="space-y-4 mb-10">

              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
              <NotificationCard notification={data?.notifications?.[0]} key={data?.notifications?.[0]?.id} />
            </div>
            <Button
              onClick={() => markAllAsRead()}
              className="w-[calc(100%-32px)] fixed bottom-4 bg-red-500"
              variant="destructive"
            >
              Delete All
            </Button> */}
            {data?.notifications?.length ? (
              <div>
                <div className="space-y-4 mb-10">
                  {data?.notifications?.map((n) => (
                    <NotificationCard notification={n} key={n.id} />
                  ))}
                </div>
                <Button
                  onClick={() => markAllAsRead()}
                  className="w-[calc(100%-32px)] fixed bottom-4 bg-red-500 z-20"
                  variant="destructive"
                >
                  Delete All
                </Button>
              </div>
            ) : (
              <p className="text-sm text-center">No notifications yet.</p>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Notifications;
