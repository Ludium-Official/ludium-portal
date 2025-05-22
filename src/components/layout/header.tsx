import { useMarkAllNotificationsAsReadMutation } from '@/apollo/mutation/mark-all-notifications-as-read.generated';
import { useCountNotificationsSubscription } from '@/apollo/subscriptions/count-notifications.generated';
import { useNotificationsSubscription } from '@/apollo/subscriptions/notifications.generated';
import DevToolsDialog from '@/components/dev-tools-dialog';
import { Button } from '@/components/ui/button';
import NotificationCard from '@/components/ui/notification-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { cn } from '@/lib/utils';

import { wepinSdk } from '@/lib/wepin';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

// 2. Initialization
// const wepinSdk = new WepinSDK({
//   appId: import.meta.env.VITE_WEPIN_APP_ID,
//   appKey: import.meta.env.VITE_WEPIN_APP_KEY,
// })

// const initWepin = wepinSdk.init({
//   defaultLanguage: 'en',
//   defaultCurrency: 'KRW',
// })

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openNotifications, setOpenNotifications] = useState(false);
  const { login, isAuthed, logout } = useAuth();

  const { data } = useNotificationsSubscription();
  const { data: countData } = useCountNotificationsSubscription();

  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  useEffect(() => {
    setOpenNotifications(false);
  }, [location]);
  // const [loginMutation] = useLoginMutation()

  return (
    <header className="flex justify-between items-center px-10 py-[14px] border-b">
      {import.meta.env.VITE_MODE === 'local' && <DevToolsDialog />}
      <div />

      <div className="flex gap-2">
        <div>
          <Popover open={openNotifications} onOpenChange={setOpenNotifications}>
            <PopoverTrigger>
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
                'relative overflow-auto max-h-[500px]',
                !data?.notifications?.length ? 'min-w-none' : 'min-w-[348px]',
              )}
            >
              {data?.notifications?.length ? (
                <>
                  <div className="space-y-4 max-h-screen mb-14">
                    {data?.notifications?.map((n) => (
                      <NotificationCard notification={n} key={n.id} />
                      // <div key={n.id} className="border rounded-md p-2">
                      //   <div>{n.title}</div>
                      //   <div>{n.action}</div>
                      //   {/* <div>{n.entityId}</div> */}
                      //   {/* <div>{n.id}</div> */}
                      //   <div>{n.readAt}</div>
                      //   <div>type: {n.type}</div>
                      //   <div>{n.metadata}</div>
                      // </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => markAllAsRead()}
                    className="w-full sticky bottom-4 bg-red-500"
                    variant="destructive"
                  >
                    Delete All
                  </Button>
                </>
              ) : (
                <p className="text-sm text-center">No notifications yet.</p>
              )}
            </PopoverContent>
          </Popover>
        </div>
        {isAuthed ? (
          <>
            <Button
              onClick={() => logout()}
              variant="ghost"
              className="rounded-md min-w-[83px] h-10"
            >
              Log out
            </Button>
            <Button
              onClick={() => navigate('/profile')}
              className="rounded-md min-w-[83px] h-10 bg-[#B331FF] hover:bg-[#B331FF]/90"
            >
              Profile
            </Button>
          </>
        ) : (
          <Button
            className="rounded-md min-w-[83px] h-10"
            onClick={async () => {
              const user = await wepinSdk.loginWithUI();

              if (user.status === 'success') {
                const accounts = await wepinSdk.getAccounts();

                await login({
                  email: user.userInfo?.email ?? '',
                  userId: user.userInfo?.userId ?? '',
                  walletId: user.walletId ?? '',
                  address: accounts?.[0]?.address ?? '',
                  network: accounts?.[0]?.network ?? '',
                });

                notify('Successfully logged in', 'success');
                navigate('/profile');
              }
            }}
          >
            Log in
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
