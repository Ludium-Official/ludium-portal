import { useLoginMutation } from "@/apollo/mutation/login.generated";
import { wepinSdk } from "@/lib/wepin";
import type { } from "@wepin/sdk-js";
import { createContext, useState } from "react";

interface AuthValues {
  email?: string | null;
  token?: string | null;
  roles?: string[] | null;
  isAuthed?: boolean;
  isSponsor?: boolean;
  isValidator?: boolean;
  isBuilder?: boolean;
  login: ({ email, userId, walletId, address, network }: { email: string, userId: string, walletId: string, address: string, network: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthValues>({
  email: null,
  token: null,
  roles: null,
  isAuthed: false,
  isSponsor: false,
  isValidator: false,
  isBuilder: false,
  login: async () => { },
  logout: async () => { }
})


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>()
  const [roles, setRoles] = useState<string[] | null>()
  const [email, setEmail] = useState<string | null>()

  const [loginMutation] = useLoginMutation()

  const login = async ({ email, userId, walletId, address, network }: { email: string, userId: string, walletId: string, address: string, network: string }) => {
    await loginMutation({
      variables: {
        email,
        userId,
        walletId,
        address,
        network
      },
      onCompleted: (data) => {
        setToken(data?.login?.token)
        setRoles(data?.login?.userRoles)
        setEmail(email)
        localStorage.setItem('token', data.login?.token ?? "")
        localStorage.setItem('roles', JSON.stringify(data?.login?.userRoles) ?? "")
      }
    })
  }

  const logout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('roles')
    setRoles(null)
    setToken(null)
    await wepinSdk.logout()
  }

  const isSponsor = !!roles?.find(r => r === 'sponsor')
  const isValidator = !!roles?.find(r => r === 'validator')
  const isBuilder = !!roles?.find(r => r === 'builder')

  return (
    <AuthContext.Provider value={{ email, token, roles, isAuthed: !!token, login, logout, isSponsor, isValidator, isBuilder }}>
      {children}
    </AuthContext.Provider>
  )
}