import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

import type { SafeUser } from '@homekeeper/shared';

import { AuthProvider } from '../../src/context/AuthProvider';
import { AuthStatus, type AuthStatusType } from '../../src/lib/types/authStatus';

// Auth context test provider
interface TestAuthProviderProps {
  children: ReactNode;
  initialAuthStatus?: AuthStatusType;
  initialUser?: SafeUser | null;
}

export function TestAuthProvider({
  children,
  initialAuthStatus = AuthStatus.LOGGED_OUT,
  initialUser = null,
}: TestAuthProviderProps) {
  return (
    <AuthProvider
      initialState={{
        authStatus: initialAuthStatus,
        user: initialUser,
      }}
    >
      {children}
    </AuthProvider>
  );
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authStatus?: AuthStatusType;
  user?: SafeUser | null;
}

export function renderWithAuth(
  ui: ReactElement,
  {
    authStatus = AuthStatus.LOGGED_OUT,
    user = null,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <TestAuthProvider
        initialAuthStatus={authStatus}
        initialUser={user}
      >
        {children}
      </TestAuthProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}