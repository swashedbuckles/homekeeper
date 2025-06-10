import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

import type { SafeUser } from '@homekeeper/shared';

import { AuthProvider } from '../../src/context/AuthProvider';
import { AuthStatus, type AuthStatusType } from '../../src/types/authStatus';

// Auth context test provider
interface TestAuthProviderProps {
  children: ReactNode;
  initialAuthStatus?: AuthStatusType;
  initialUser?: SafeUser | null;
  initialCsrfToken?: string | null;
}

export function TestAuthProvider({
  children,
  initialAuthStatus = AuthStatus.LOGGED_OUT,
  initialUser = null,
  initialCsrfToken = null,
}: TestAuthProviderProps) {
  return (
    <AuthProvider
      initialState={{
        authStatus: initialAuthStatus,
        user: initialUser,
        csrfToken: initialCsrfToken,
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
  csrfToken?: string | null;
}

export function renderWithAuth(
  ui: ReactElement,
  {
    authStatus = AuthStatus.LOGGED_OUT,
    user = null,
    csrfToken = null,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <TestAuthProvider
        initialAuthStatus={authStatus}
        initialUser={user}
        initialCsrfToken={csrfToken}
      >
        {children}
      </TestAuthProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}