import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { wepinPin, wepinProvider, wepinSdk } from '@/lib/wepin';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router';

function DevToolsDialog() {
  const { login, logout } = useAuth();

  const navigate = useNavigate();

  const loginViaGoogle = async () => {
    const oauthResponse = await wepinPin.login.loginWithOauthProvider({
      provider: 'google',
      withLogout: true,
    });
    if (!('token' in oauthResponse)) {
      notify('Failed to login with Google', 'error');
      return;
    }

    const { idToken, refreshToken } = oauthResponse.token;

    localStorage.setItem('idToken', idToken);
    localStorage.setItem('refreshToken', refreshToken);
    const wepinResponse = await wepinPin.login.loginWepin({
      provider: 'google',
      token: { idToken, refreshToken },
    });

    if (wepinResponse.userStatus?.pinRequired) {
      const pinBlock = await wepinPin.generateRegistrationPINBlock();

      const pinResponse = await fetch('https://sdk.wepin.io/v1/app/register', {
        method: 'POST',
        headers: {
          Host: 'sdk.wepin.io',
          'Content-Type': 'application/json',
          'X-API-KEY': import.meta.env.VITE_WEPIN_APP_KEY,
          'X-SDK-TYPE': 'web_rest_api',
          'X-API-DOMAIN': '',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          appId: import.meta.env.VITE_WEPIN_APP_ID,
          userId: wepinResponse.userInfo?.userId,
          loginStatus: wepinResponse.userStatus.loginStatus,
          UVD: pinBlock.UVD,
          hint: pinBlock.hint,
        }),
      });

      if (!pinResponse.ok) {
        notify('Failed to register PIN', 'error');
        return;
      }
    }

    notify('Successfully logged in', 'success');
    navigate('/profile');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="max-h-10" variant="outline">
          Dev Tools
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogClose id="dev-tools-dialog" />
        <DialogHeader>
          <DialogTitle>Dev Tools</DialogTitle>
          <DialogDescription>Buttons for development purposes</DialogDescription>
        </DialogHeader>

        <Button
          size="sm"
          onClick={async () => {
            const wpnProvider = await wepinProvider.getProvider('evmopencampus-testnet');

            const provider = new ethers.providers.Web3Provider(wpnProvider);

            const signer = provider.getSigner();

            const address = await signer.getAddress();
            console.log('Wepin Signer Address:', address);
            console.log('Wepin Signer:', signer);
          }}
        >
          Check Provider
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            await login({
              email: 'admin@example.com',
              userId: String(Math.random() * 100000000),
              walletId: String(Math.random() * 100000000),
              address: String(Math.random() * 100000000),
              network: String(Math.random() * 100000000),
            });
            notify('Successfully logged in as admin', 'success');
          }}
        >
          Login as Admin
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            await login({
              email: 'sponsor@example.com',
              userId: String(Math.random() * 100000000),
              walletId: String(Math.random() * 100000000),
              address: String(Math.random() * 100000000),
              network: String(Math.random() * 100000000),
            });
            notify('Successfully logged in as sponsor', 'success');
          }}
        >
          Login as Sponsor
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            await login({
              email: 'validator@example.com',
              userId: String(Math.random() * 100000000),
              walletId: String(Math.random() * 100000000),
              address: String(Math.random() * 100000000),
              network: String(Math.random() * 100000000),
            });
            notify('Successfully logged in as validator', 'success');
          }}
        >
          Login as Validator
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            await login({
              email: 'builder@example.com',
              userId: String(Math.random() * 100000000),
              walletId: String(Math.random() * 100000000),
              address: String(Math.random() * 100000000),
              network: String(Math.random() * 100000000),
            });
            notify('Successfully logged in as builder', 'success');
          }}
        >
          Login as Builder
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            await login({
              email: 'multi@example.com',
              userId: String(Math.random() * 100000000),
              walletId: String(Math.random() * 100000000),
              address: String(Math.random() * 100000000),
              network: String(Math.random() * 100000000),
            });
          }}
        >
          Login as Multi
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            const checkWepinStatus = async () => {
              const status = await wepinSdk.getStatus();
              notify(status, 'blank');
            };

            checkWepinStatus();
          }}
        >
          Check Wepin Status
        </Button>

        <Button size="sm" onClick={loginViaGoogle}>
          login via Google
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            const user = await wepinSdk.loginWithUI();
            console.log("🚀 ~ <ButtonclassName='w-[346px]'onClick={ ~ user:", user);

            if (user.status === 'success') {
              localStorage.setItem('idToken', user.userInfo?.userId ?? '');
              notify('Successfully logged in', 'success');
              navigate('/profile');
            }
          }}
        >
          Login With UI
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            await wepinSdk.register();
          }}
        >
          REGISTER
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            await logout();
          }}
        >
          LOGOUT
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            document.getElementById('dev-tools-dialog')?.click();
            wepinSdk.openWidget();
          }}
        >
          Open WepinUI
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            const accounts = await wepinSdk.getAccounts();
            console.log("🚀 ~ <Buttonsize='sm'onClick={ ~ accounts:", accounts);
          }}
        >
          Log Accounts
        </Button>

        <Button
          size="sm"
          onClick={async () => {
            const balance = await wepinSdk.getBalance();
            console.log("🚀 ~ <Buttonsize='sm'onClick={ ~ balance:", balance);
          }}
        >
          Log Balance
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default DevToolsDialog;
