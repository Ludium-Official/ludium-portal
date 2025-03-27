import { AuthContext } from '@/providers/auth-provider';
import { useContext } from 'react';

export const useAuth = () => {
  return useContext(AuthContext);
};
