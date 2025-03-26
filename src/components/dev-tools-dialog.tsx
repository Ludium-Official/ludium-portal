import { useLoginMutation } from "@/apollo/mutation/login.generated"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import notify from "@/lib/notify"
import { wepinPin, wepinSdk } from "@/lib/wepin"
import type { WepinLifeCycle } from "@wepin/sdk-js"
import { useState } from "react"
import { useNavigate } from "react-router"

function DevToolsDialog() {
  const [idToken, setIdToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [wepinStatus, setWepinStatus] = useState<WepinLifeCycle>()
  console.log("🚀 ~ Header ~ wepinStatus:", wepinStatus)

  const [loginMutation] = useLoginMutation()

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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="max-h-10" variant="outline">Dev Tools</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dev Tools</DialogTitle>
          <DialogDescription>
            Buttons for development purposes
          </DialogDescription>
        </DialogHeader>

        <Button size="sm" onClick={async () => {
          // await initWepin
          loginMutation({
            variables: { email: 'admin@example.com', userId: String(Math.random() * 100000000), walletId: String(Math.random() * 100000000) },
            onCompleted: (data) => {
              console.log("🚀 ~ onCompleted ~ data", data)
              localStorage.setItem('token', data.login?.token ?? "")
              notify("Successfully logged in as admin", 'success')
            }
          })
        }
        }>Login as Admin</Button>

        <Button size="sm" onClick={async () => {
          // await initWepin
          loginMutation({
            variables: { email: 'sponsor@example.com', userId: String(Math.random() * 100000000), walletId: String(Math.random() * 100000000) },
            onCompleted: (data) => {
              console.log("🚀 ~ onCompleted ~ data", data)
              localStorage.setItem('token', data.login?.token ?? "")
              notify("Successfully logged in as sponsor", 'success')

            }
          })
        }
        }>Login as Sponsor</Button>

        <Button size="sm" onClick={async () => {
          // await initWepin
          loginMutation({
            variables: { email: 'validator@example.com', userId: String(Math.random() * 100000000), walletId: String(Math.random() * 100000000) },
            onCompleted: (data) => {
              console.log("🚀 ~ onCompleted ~ data", data)
              localStorage.setItem('token', data.login?.token ?? "")
              notify("Successfully logged in as validator", 'success')

            }
          })
        }
        }>Login as Validator</Button>

        <Button size="sm" onClick={async () => {
          // await initWepin
          loginMutation({
            variables: { email: 'builder@example.com', userId: String(Math.random() * 100000000), walletId: String(Math.random() * 100000000) },
            onCompleted: (data) => {
              console.log("🚀 ~ onCompleted ~ data", data)
              localStorage.setItem('token', data.login?.token ?? "")
              notify("Successfully logged in as builder", 'success')

            }
          })
        }
        }>Login as Builder</Button>

        <Button size="sm" onClick={async () => {
          // await initWepin
          loginMutation({
            variables: { email: 'multi@example.com', userId: String(Math.random() * 100000000), walletId: String(Math.random() * 100000000) },
            onCompleted: (data) => {
              console.log("🚀 ~ onCompleted ~ data", data)
              localStorage.setItem('token', data.login?.token ?? "")
            }
          })
        }
        }>Login as Multi</Button>

        <Button size="sm" onClick={async () => {
          // await initWepin

          const checkWepinStatus = async () => {
            const status = await wepinSdk.getStatus()
            setWepinStatus(status)
            notify(status, 'blank')
          }

          checkWepinStatus()
        }
        }>Check Wepin Status</Button>

        <Button size="sm" onClick={loginViaGoogle}>login via Google</Button>


        <Button size="sm" onClick={async () => {
          // await initWepin
          const user = await wepinSdk.loginWithUI()
          console.log("🚀 ~ <ButtonclassName='w-[346px]'onClick={ ~ user:", user)

          if (user.status === 'success') {
            localStorage.setItem('idToken', user.userInfo?.userId ?? '')
            notify("Successfully logged in", 'success')
            navigate('/profile')
          }
        }
        }>Login With UI</Button>


        <Button size="sm" onClick={async () => {
          // await initWepin
          await wepinSdk.register()
        }
        }>REGISTER</Button>

        <Button size="sm" onClick={async () => {
          // await initWepin
          await wepinSdk.logout()
        }
        }>LOGOUT</Button>


        <Button size="sm" onClick={async () => {
          // await initWepin
          wepinSdk.openWidget()
        }}>Open WepinUI</Button>

        <Button size="sm" onClick={async () => {
          // await initWepin
          const accounts = await wepinSdk.getAccounts()
          console.log("🚀 ~ <Buttonsize='sm'onClick={ ~ accounts:", accounts)
        }}>Log Accounts</Button>

        <Button size="sm" onClick={async () => {
          // await initWepin
          const balance = await wepinSdk.getBalance()
          console.log("🚀 ~ <Buttonsize='sm'onClick={ ~ balance:", balance)
        }}>Log Balance</Button>
      </DialogContent>
    </Dialog>
  )
}

export default DevToolsDialog