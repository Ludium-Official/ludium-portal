import { useCountNotificationsSubscription } from '@/apollo/subscriptions/count-notifications.generated';
import { useNotificationsSubscription } from '@/apollo/subscriptions/notifications.generated';
import DevToolsDialog from '@/components/dev-tools-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';

import { wepinSdk } from '@/lib/wepin';
import { useNavigate } from 'react-router';

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
  const { login, isAuthed, logout } = useAuth();

  const { data } = useNotificationsSubscription();
  const { data: countData } = useCountNotificationsSubscription();
  console.log('🚀 ~ Header ~ data:', data);
  console.log('🚀 ~ Header ~ countData:', countData?.countNotifications);

  // const [loginMutation] = useLoginMutation()

  return (
    <header className="flex justify-between items-center px-10 py-[14px] border-b">
      {import.meta.env.VITE_MODE === 'local' && <DevToolsDialog />}
      <div>
        Notification COunt: {countData?.countNotifications}
        <Button onClick={() => console.log('🚀 ~ Header ~ notifications:', data)}>
          print notifications
        </Button>
      </div>

      <div className="flex gap-2">
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
