import { useMarkAllNotificationsAsReadMutation } from '@/apollo/mutation/mark-all-notifications-as-read.generated';
import { useGetNotificationsQuery } from '@/apollo/queries/notifications.generated';
import { useCountNotificationsSubscription } from '@/apollo/subscriptions/count-notifications.generated';
import ConditionCard from '@/components/notifications/condition-card';
// import NotificationCard from '@/components/notifications/notification-card';
import ProgressCard from '@/components/notifications/progress-card';
import ReclaimCard from '@/components/notifications/reclaim-card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/types.generated';
import { PopoverClose } from '@radix-ui/react-popover';
import { Bell, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

function Notifications() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isLoggedIn } = useAuth();

  const [unreadOnly, setUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  // const { data } = useNotificationsSubscription();

  const { data, refetch, fetchMore } = useGetNotificationsQuery({
    skip: !isLoggedIn,
    variables: {
      input: {
        limit: 15,
        offset: 0,
        filter: [
          {
            field: 'tab',
            value: activeTab,
          },
          {
            field: 'unread',
            value: unreadOnly ? 'true' : 'false',
          },
        ],
      },
    },
  });

  const { data: countData } = useCountNotificationsSubscription();

  // Update notifications when data changes
  useEffect(() => {
    if (data?.notifications?.data) {
      setNotifications(data.notifications.data);
      setOffset(data.notifications.data.length);
      setHasMore(data.notifications.data.length < (data.notifications.count || 0));
    }
  }, [data]);

  // Reset pagination when filters change
  useEffect(() => {
    setNotifications([]);
    setOffset(0);
    setHasMore(true);
    refetch();
  }, [activeTab, unreadOnly, refetch]);

  useEffect(() => {
    refetch();
  }, [countData, refetch]);

  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  useEffect(() => {
    setOpenNotifications(false);
  }, [location]);

  // Load more notifications function
  const loadMoreNotifications = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const result = await fetchMore({
        variables: {
          input: {
            limit: 10,
            offset: offset,
            filter: [
              {
                field: 'tab',
                value: activeTab,
              },
              {
                field: 'unread',
                value: unreadOnly ? 'true' : 'false',
              },
            ],
          },
        },
      });

      if (result.data?.notifications?.data) {
        const newNotifications = result.data.notifications.data;
        setNotifications((prev) => [...prev, ...newNotifications]);
        setOffset((prev) => prev + newNotifications.length);
        setHasMore(
          notifications.length + newNotifications.length < (result.data.notifications.count || 0),
        );
      }
    } catch (error) {
      console.error('Error loading more notifications:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchMore, loadingMore, hasMore, offset, activeTab, unreadOnly]);

  // Handle scroll event
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom && hasMore && !loadingMore) {
        loadMoreNotifications();
      }
    },
    [hasMore, loadingMore, loadMoreNotifications],
  );

  return (
    <div>
      <Popover open={openNotifications} onOpenChange={setOpenNotifications}>
        <PopoverTrigger asChild className={cn(isMobile && 'flex')}>
          <Button variant="ghost" className={cn('group h-10 relative', isMobile && 'h-auto p-0!')}>
            <Bell />
            {!!countData?.countNotifications && (
              <span className="flex justify-center items-center w-[8px] h-[8px] rounded-full bg-red-400 absolute top-3 right-3 border-2 border-white text-white group-hover:border-accent transition-all">
                {/* {countData.countNotifications} */}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            'overflow-auto w-[410px]',
            isMobile && 'w-full',
            // !data?.notifications?.length ? 'min-w-none' : 'min-w-[348px]',
          )}
        >
          <div className="flex justify-end mb-[14px]">
            <PopoverClose className="cursor-pointer">
              <X className="text-foreground w-4 h-4" />
            </PopoverClose>
          </div>

          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">Notifications</h3>
            <div className="flex items-center gap-2">
              <Switch checked={unreadOnly} onCheckedChange={setUnreadOnly} />
              <p className="text-sm">Unread</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto mb-3">
            <TabsList className="w-auto bg-gray-100 p-1">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="reclaim">Reclaim</TabsTrigger>
              <TabsTrigger value="investment_condition">Investment Condition</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
          </Tabs>

          <ScrollArea
            ref={scrollAreaRef}
            className="relative overflow-auto h-[calc(100vh-235px)] pb-5"
            onScrollCapture={handleScroll}
          >
            {notifications.length ? (
              <div>
                <div className="space-y-4 mb-10">
                  {activeTab === 'all' &&
                    notifications.map((n) => {
                      if (n.metadata?.category === 'progress') {
                        return <ProgressCard notification={n} key={n.id} />;
                      }
                      if (n.metadata?.category === 'investment') {
                        return <ConditionCard notification={n} key={n.id} />;
                      }
                      if (n.metadata?.category === 'reclaim') {
                        return <ReclaimCard notification={n} key={n.id} />;
                      }

                      return <ProgressCard notification={n} key={n.id} />;
                    })}

                  {activeTab === 'progress' &&
                    notifications.map((n) => <ProgressCard notification={n} key={n.id} />)}

                  {activeTab === 'investment_condition' &&
                    notifications.map((n) => <ConditionCard notification={n} key={n.id} />)}

                  {activeTab === 'reclaim' &&
                    notifications.map((n) => <ReclaimCard notification={n} key={n.id} />)}
                </div>

                {/* Loading indicator for infinite scroll */}
                {loadingMore && (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading more...</span>
                  </div>
                )}

                {/* End of results indicator */}
                {/* {!hasMore && notifications.length > 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No more notifications</p>
                  </div>
                )} */}

                <Button
                  onClick={() => markAllAsRead()}
                  className="w-[calc(100%-32px)] fixed bottom-4 z-20"
                >
                  Read All
                </Button>
              </div>
            ) : (
              <p className="text-sm text-center mt-3">No notifications yet.</p>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Notifications;
