import { type ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export function AuthInitializer({ children }: { children: ReactNode; }) {

  const context = useAuth();
  useEffect(() => {
    context.checkAuth();
  }, []);
  return (
    <>{children}</>
  );
}
