import { useLoginMutation } from '@/apollo/mutation/login.generated';
import { useProfileQuery } from '@/apollo/queries/profile.generated';
import type { AuthProps, LoginProps } from '@/types/auth';
import { UserRole } from '@/types/types.generated';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export const AuthContext = createContext<AuthProps>({
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
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();
  const [userId, setUserId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean | null>();
  const [isSuperadmin, setIsSuperadmin] = useState<boolean | null>();

  const { data: userProfile, error } = useProfileQuery({
    skip: !token,
    fetchPolicy: 'network-only',
  });

  const [loginMutation] = useLoginMutation();

  const login = async (props: LoginProps) => {
    await loginMutation({
      variables: props,
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
    if (userProfile) {
      setUserId(userProfile.profile?.id ?? '');
      setIsAdmin(
        userProfile.profile?.role === UserRole.Admin ||
          userProfile.profile?.role === UserRole.Superadmin,
      );
      setIsSuperadmin(userProfile.profile?.role === UserRole.Superadmin);
    }
  }, [userProfile]);

  useEffect(() => {
    const tkn = localStorage.getItem('token');

    if (tkn) setToken(tkn);
  }, []);

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
        isAuthed: !!token && !!userProfile?.profile?.email,
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
