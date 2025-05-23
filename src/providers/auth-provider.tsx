import { useLoginMutation } from '@/apollo/mutation/login.generated';
import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

interface AuthValues {
  email?: string | null;
  token?: string | null;
  roles?: string[] | null;
  userId: string;
  isAuthed?: boolean;
  isSponsor?: boolean;
  isValidator?: boolean;
  isBuilder?: boolean;
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
  isAuthed: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();

  const { data: profileData, error } = useProfileQuery({
    skip: !token,
    fetchPolicy: 'network-only',
  });

  const [loginMutation] = useLoginMutation();

  useEffect(() => {
    setUserId(profileData?.profile?.id ?? '');
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
    <AuthContext.Provider value={{ userId, email, token, isAuthed: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
