import { useState } from 'react';

import { Button } from '@/components/ui/button';
import notify from '@/lib/notify';
import { wepinPin, wepinSdk } from '@/lib/wepin';
// 1. Import the package
// import { WepinLogin } from '@wepin/login-js'
// import { WepinPin } from '@wepin/pin-js'
import { useNavigate } from 'react-router';


// Create instance
// Initialize
//  wepinPin.init({
//   defaultLanguage: 'en',
// })


// 2. Initialization
// const wepinLogin = new WepinLogin({
//   appId: import.meta.env.VITE_WEPIN_APP_ID,
//   appKey: import.meta.env.VITE_WEPIN_APP_KEY,
// })

// const wepinPin = new WepinPin({
//   appKey: import.meta.env.VITE_WEPIN_APP_KEY,
//   wepinLogin
// })

// // const initPromise = wepinLogin.init('en')
// const initPromise = wepinPin.init({
//   defaultLanguage: 'en',
// })

function LoginPage() {
  const [idToken, setIdToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const navigate = useNavigate()

  console.log("🚀 ~ App ~ refreshToken:", refreshToken)
  console.log("🚀 ~ App ~ idToken:", idToken)

  const loginViaGoogle = async () => {
    // await initPromise

    // const oauthResponse = await wepinLogin.loginWithOauthProvider({ provider: 'google', withLogout: true })
    const oauthResponse = await wepinPin.login.loginWithOauthProvider({ provider: 'google', withLogout: true })
    if (!("token" in oauthResponse)) {
      notify("Failed to login with Google", 'error')
      return;
    }

    const { idToken, refreshToken } = oauthResponse.token

    setIdToken(idToken)
    setRefreshToken(refreshToken)

    localStorage.setItem('idToken', idToken)
    localStorage.setItem('refreshToken', refreshToken)
    // const wepinResponse = await wepinLogin.loginWepin({ provider: 'google', token: { idToken, refreshToken } })
    const wepinResponse = await wepinPin.login.loginWepin({ provider: 'google', token: { idToken, refreshToken } })

    if (wepinResponse.userStatus?.pinRequired) {
      const pinBlock = await wepinPin.generateRegistrationPINBlock()



      console.log("IM HERE")

      const pinResponse = await fetch('https://sdk.wepin.io/v1/app/register', {
        // url: 'https://sdk.wepin.io/v1/app/register',
        method: 'POST',
        // Omit authentication headers
        headers: {
          Host: "sdk.wepin.io",
          'Content-Type': 'application/json',
          "X-API-KEY": import.meta.env.VITE_WEPIN_APP_KEY,
          "X-SDK-TYPE": "web_rest_api",
          "X-API-DOMAIN": "",
          Authorization: `Bearer ${idToken}`
          // X-API-KEY: ${APP_KEY}
          // X-API-DOMAIN: {APP_DOMAIN}
          // X-SDK-TYPE: {platform}_rest_api
        },
        body: JSON.stringify({
          appId: import.meta.env.VITE_WEPIN_APP_ID,
          userId: wepinResponse.userInfo?.userId,
          loginStatus: wepinResponse.userStatus.loginStatus,
          // Omit other bodies
          UVD: pinBlock.UVD,
          hint: pinBlock.hint,
        })
      })
      console.log("🚀 ~ loginViaGoogle ~ pinResponse:", pinResponse)

      if (!pinResponse.ok) {
        notify("Failed to register PIN", 'error')
        return;
      }
    }

    notify("Successfully logged in", 'success')
    navigate('/profile')
  }

  return (
    <div className='flex flex-col items-center justify-center h-[70vh]'>
      <Button className='w-[346px] mb-[23px] bg-[#D9D9D9] text-[#7C7C7C] hover:bg-[#7C7C7C] hover:text-[#D9D9D9]' onClick={loginViaGoogle}>login via Google</Button>
      <Button className='w-[346px]' onClick={async () => {

        const user = await wepinSdk.loginWithUI()
        console.log("🚀 ~ <ButtonclassName='w-[346px]'onClick={ ~ user:", user)

        if (user.status === 'success') {
          localStorage.setItem('idToken', user.userInfo?.userId ?? '')
          notify("Successfully logged in", 'success')
          navigate('/profile')
        }
      }}>login via WEPIN</Button>

    </div>
  );
}

export default LoginPage;
