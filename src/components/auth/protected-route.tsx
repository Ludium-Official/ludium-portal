import { useAuth } from '@/lib/hooks/use-auth';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Navigate, Outlet } from 'react-router';

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo = '/' }) => {
  const { isLoggedIn } = useAuth();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.error('Login is required to access this page.');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
