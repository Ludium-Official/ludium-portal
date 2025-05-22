import Notifications from '@/components/notifications';

import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { reduceString } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';

function Header() {
  const { user, authenticated, login: privyLogin, logout: privyLogout } = usePrivy();
  const { login: authLogin, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const walletInfo = user?.wallet;

  const login = async () => {
    try {
      const googleInfo = user?.google;
      const farcasterInfo = user?.farcaster;

      const loginType = (() => {
        const types = {
          google: googleInfo,
          farcaster: farcasterInfo,
        };

        return (
          (Object.keys(types) as Array<keyof typeof types>).find((key) => types[key]) || 'wallet'
        );
      })();

      privyLogin();

      if (user && walletInfo) {
        await authLogin({
          email: googleInfo?.email || null,
          walletAddress: walletInfo.address,
          loginType,
        });
      }
    } catch (error) {
      notify('Failed to login', 'error');
      console.error('Failed to login:', error);
    }
  };

  const logout = async () => {
    try {
      authLogout();
      privyLogout();

      notify('Successfully logged out', 'success');
      navigate('/');
    } catch (error) {
      notify('Error logging out', 'error');
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    if (user) {
      login();
    }
  }, [user]);

  return (
    <header className="flex justify-between items-center px-10 py-[14px] border-b">
      <div />

      <div className="flex gap-2">
        {authenticated && <Notifications />}
        <div>
          <Button
            className="bg-[#B331FF] hover:bg-[#B331FF]/90 h-fit"
            onClick={authenticated ? logout : login}
          >
            {authenticated ? reduceString(walletInfo?.address || '', 6, 6) : 'Login'}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
