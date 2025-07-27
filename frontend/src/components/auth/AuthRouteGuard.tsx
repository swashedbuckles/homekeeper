import { Navigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { AuthStatus } from '../../lib/types/authStatus';

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = authStatus === AuthStatus.LOGGED_IN;

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}