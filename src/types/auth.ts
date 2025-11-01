import type { LoginTypeEnum } from "./types.generated";

export interface AuthProps {
  email?: string | null;
  token?: string | null;
  roles?: string[] | null;
  userId: string;
  isLoggedIn?: boolean;
  isAuthed?: boolean;
  isAdmin?: boolean | null;
  isSuperadmin?: boolean | null;
  login: ({
    email,
    walletAddress,
    loginType,
  }: {
    email?: string | null;
    walletAddress: string;
    loginType: LoginTypeEnum;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

export interface LoginProps {
  email?: string | null;
  walletAddress: string;
  loginType: LoginTypeEnum;
}
