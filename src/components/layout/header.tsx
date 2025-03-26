
import { useLoginMutation } from '@/apollo/mutation/login.generated';
import DevToolsDialog from '@/components/dev-tools-dialog';
import { Button } from '@/components/ui/button';
import { } from '@/components/ui/dialog';
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
  const navigate = useNavigate()
  const [loginMutation] = useLoginMutation()


  return (
    <header className='flex justify-between items-center px-10 py-[14px] border-b'>

      <DevToolsDialog />




      <div className='flex gap-2'>
        {/* <Button variant="outline">Login</Button> */}
        <Button className='rounded-md min-w-[83px] h-10' onClick={async () => {
          // await initWepin
          const user = await wepinSdk.loginWithUI()
          console.log("🚀 ~ <ButtonclassName='w-[346px]'onClick={ ~ user:", user)



          if (user.status === 'success') {

            const accounts = await wepinSdk.getAccounts()

            await loginMutation({
              variables: {
                email: user.userInfo?.email ?? '',
                userId: user.userInfo?.userId ?? '',
                walletId: user.walletId ?? '',
                address: accounts?.[0]?.address ?? '',
                network: accounts?.[0]?.network ?? ''
              },
              onCompleted: (data) => {
                localStorage.setItem('token', data.login?.token ?? "")
                localStorage.setItem('roles', JSON.stringify(data?.login?.userRoles) ?? "")
              }
            })

            notify("Successfully logged in", 'success')
            navigate('/profile')
          }
        }}>Log in</Button>
        {/* <img src={search} alt='search' />
        <img src={notification} alt='notification' />
        <img src={profile} alt='profile' /> */}
      </div>
    </header>
  );
}

export default Header;
