import { useLoginMutation } from '@/apollo/mutation/login.generated';
import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { UserRole } from '@/types/types.generated';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

interface AuthValues {
  email?: string | null;
  token?: string | null;
  roles?: string[] | null;
  userId: string;
  isLoggedIn?: boolean;
  isAuthed?: boolean;
  isSponsor?: boolean;
  isValidator?: boolean;
  isBuilder?: boolean;
  isAdmin?: boolean | null;
  isSuperadmin?: boolean | null;
  login: ({
    email,
    walletAddress,
    loginType,
  }: {
    email: string | null;
    walletAddress: string;
    loginType: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthValues>({
  email: null,
  token: null,
  roles: null,
  userId: '',
  isLoggedIn: false,
  isAuthed: false,
  isAdmin: false,
  isSuperadmin: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();
  const [userId, setUserId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean | null>();
  const [isSuperadmin, setIsSuperadmin] = useState<boolean | null>();
  const navigate = useNavigate();

  const { data: profileData, error } = useProfileQuery({
    skip: !token,
    fetchPolicy: 'network-only',
  });

  const [loginMutation] = useLoginMutation();

  useEffect(() => {
    setUserId(profileData?.profile?.id ?? '');
    setIsAdmin(
      profileData?.profile?.role === UserRole.Admin ||
        profileData?.profile?.role === UserRole.Superadmin,
    );
    setIsSuperadmin(profileData?.profile?.role === UserRole.Superadmin);
  }, [profileData]);

  useEffect(() => {
    const tkn = localStorage.getItem('token');
    if (tkn) setToken(tkn);
  }, []);

  const login = async ({
    email,
    walletAddress,
    loginType,
  }: {
    email: string | null;
    walletAddress: string;
    loginType: string;
  }) => {
    await loginMutation({
      variables: {
        email,
        walletAddress,
        loginType,
      },
      onCompleted: (data) => {
        setToken(data.login);
        setEmail(email);
        localStorage.setItem('token', data.login ?? '');
      },
    });
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    setToken(null);
    navigate('/');
  };

  useEffect(() => {
    if (error) {
      console.error('Error fetching profile:', error);
      logout();
    }
  }, [error]);

  return (
    <AuthContext.Provider
      value={{
        userId,
        email,
        token,
        isLoggedIn: !!token,
        isAuthed: !!token && !!profileData?.profile?.email,
        login,
        logout,
        isAdmin,
        isSuperadmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
