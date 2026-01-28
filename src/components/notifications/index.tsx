import { useMarkAllNotificationsAsReadV2Mutation } from '@/apollo/mutation/mark-all-notifications-as-read-v2.generated';
import { useGetNotificationsV2Query } from '@/apollo/queries/notifications-v2.generated';
import { useGetUnreadNotificationsCountV2Query } from '@/apollo/queries/unread-notifications-count-v2.generated';
import { useNotificationsV2Subscription } from '@/apollo/subscriptions/notifications-v2.generated';
import { useUnreadNotificationsCountV2Subscription } from '@/apollo/subscriptions/unread-notifications-count-v2.generated';
import ProgressCard from '@/components/notifications/progress-card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { NotificationV2 } from '@/types/types.generated';
import { PopoverClose } from '@radix-ui/react-popover';
import { Bell, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

function Notifications() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isLoggedIn } = useAuth();

  const [unreadOnly, setUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<NotificationV2[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const { data, refetch, fetchMore } = useGetNotificationsV2Query({
    skip: !isLoggedIn,
    variables: {
      input: {
        limit: 10,
        offset: 0,
        type: activeTab === 'all' ? undefined : activeTab,
        unreadOnly: unreadOnly,
      },
    },
  });

  const { data: countData, refetch: refetchCount } = useGetUnreadNotificationsCountV2Query({
    skip: !isLoggedIn,
  });

  // Subscription for real-time updates - triggers refetch when new data arrives
  const { data: subscriptionCountData } = useUnreadNotificationsCountV2Subscription({
    skip: !isLoggedIn,
  });

  const { data: subscriptionData } = useNotificationsV2Subscription({
    skip: !isLoggedIn,
  });

  useEffect(() => {
    if (data?.notificationsV2?.data) {
      setNotifications(data.notificationsV2.data);
      setOffset(data.notificationsV2.data.length);
      setHasMore(data.notificationsV2.data.length < (data.notificationsV2.total || 0));
    }
  }, [data]);

  useEffect(() => {
    setNotifications([]);
    setOffset(0);
    setHasMore(true);
    refetch();
  }, [activeTab, unreadOnly, refetch]);

  useEffect(() => {
    if (countData?.unreadNotificationsCountV2 !== undefined) {
      refetch();
    }
  }, [countData?.unreadNotificationsCountV2, refetch]);

  // Real-time update via WebSocket subscription for unread count
  useEffect(() => {
    if (subscriptionCountData?.unreadNotificationsCountV2 !== undefined) {
      refetchCount();
    }
  }, [subscriptionCountData?.unreadNotificationsCountV2, refetchCount]);

  // Real-time update via WebSocket subscription for notifications list
  useEffect(() => {
    if (subscriptionData?.notificationsV2?.data) {
      refetch();
    }
  }, [subscriptionData, refetch]);

  const [markAllAsRead] = useMarkAllNotificationsAsReadV2Mutation();

  useEffect(() => {
    setOpenNotifications(false);
  }, [location]);

  const loadMoreNotifications = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const result = await fetchMore({
        variables: {
          input: {
            limit: 10,
            offset: offset,
            type: activeTab === 'all' ? undefined : activeTab,
            unreadOnly: unreadOnly,
          },
        },
      });

      if (result.data?.notificationsV2?.data) {
        const newNotifications = result.data.notificationsV2.data;
        setNotifications((prev) => [...prev, ...newNotifications]);
        setOffset((prev) => prev + newNotifications.length);
        setHasMore(
          notifications.length + newNotifications.length < (result.data.notificationsV2.total || 0),
        );
      }
    } catch (error) {
      console.error('Error loading more notifications:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchMore, loadingMore, hasMore, offset, activeTab, unreadOnly, notifications.length]);

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
            {!!(
              subscriptionCountData?.unreadNotificationsCountV2 ??
              countData?.unreadNotificationsCountV2
            ) && (
              <span className="flex justify-center items-center w-[8px] h-[8px] rounded-full bg-red-400 absolute top-3 right-4 border-2 border-white text-white group-hover:border-accent transition-all" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('overflow-auto w-[410px]', isMobile && 'w-full')}>
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
              <TabsTrigger value="contract">Recruitment</TabsTrigger>
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
                      return <ProgressCard notification={n} key={n.id} />;
                    })}
                </div>

                {loadingMore && (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading more...</span>
                  </div>
                )}

                <Button
                  onClick={() => {
                    markAllAsRead({
                      onCompleted: () => {
                        refetch();
                        refetchCount();
                      },
                    });
                  }}
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
