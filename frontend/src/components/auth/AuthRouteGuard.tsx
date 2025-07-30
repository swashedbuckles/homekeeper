import { Navigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { AuthStatus } from '../../lib/types/authStatus';
import { LoadingIndicator } from '../common/LoadingIndicator';


interface AuthRouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  publicRoute?: boolean;
}

export function AuthRouteGuard({ children, requireAuth = false, publicRoute = false }: AuthRouteGuardProps) {
  if((!requireAuth && !publicRoute) || (requireAuth && publicRoute)) {
    throw new Error('You did not configure route guard properly');
  }

  const { authStatus, isLoading } = useAuth();
  const IS_DEV = !import.meta.env.PROD;


  if (isLoading) {
    return <LoadingIndicator message="Loading..." />;
  }

  const isAuthenticated = authStatus === AuthStatus.LOGGED_IN;

  if (!IS_DEV && requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!IS_DEV && !requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}