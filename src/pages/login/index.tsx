import { Button } from '@/components/ui/button';
import notify from '@/lib/notify';
import { wepinPin, wepinSdk } from '@/lib/wepin';
import { useNavigate } from 'react-router';

function LoginPage() {
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
          // Omit other bodies
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
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Button
        className="w-[346px] mb-[23px] bg-[#D9D9D9] text-[#7C7C7C] hover:bg-[#7C7C7C] hover:text-[#D9D9D9]"
        onClick={loginViaGoogle}
      >
        login via Google
      </Button>
      <Button
        className="w-[346px]"
        onClick={async () => {
          const user = await wepinSdk.loginWithUI();

          if (user.status === 'success') {
            localStorage.setItem('idToken', user.userInfo?.userId ?? '');
            notify('Successfully logged in', 'success');
            navigate('/profile');
          }
        }}
      >
        login via WEPIN
      </Button>
    </div>
  );
}

export default LoginPage;
