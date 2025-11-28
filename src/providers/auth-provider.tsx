import { useLoginV2Mutation } from '@/apollo/mutation/loginV2.generated';
import { useProfileV2Query } from '@/apollo/queries/profile-v2.generated';
import type { AuthProps, LoginProps } from '@/types/auth';
import { UserRoleV2 } from '@/types/types.generated';
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

  const { data: userProfile, error } = useProfileV2Query({
    skip: !token,
    fetchPolicy: 'network-only',
  });

  const [loginMutation] = useLoginV2Mutation();

  const login = async (props: LoginProps) => {
    await loginMutation({
      variables: props,
      onCompleted: (data) => {
        setToken(data.loginV2);
        setEmail(email);

        localStorage.setItem('token', data.loginV2 ?? '');
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
      setUserId(userProfile.profileV2?.id ?? '');
      setIsAdmin(userProfile.profileV2?.role === UserRoleV2.Admin);
      setIsSuperadmin(userProfile.profileV2?.role === UserRoleV2.Admin);
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
        isAuthed: !!token && !!userProfile?.profileV2?.email,
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
