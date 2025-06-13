import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { describe, it, expect } from 'vitest';
import { AuthContext, AuthActionsContext } from '../../src/context/authContexts';
import { AuthProvider } from '../../src/context/AuthProvider';
import { AuthStatus } from '../../src/lib/types/authStatus';
import { createMockUser } from '../helpers/testUtils';

// Test component to access context values
function TestComponent() {
  const auth = useContext(AuthContext);
  const actions = useContext(AuthActionsContext);

  return (
    <div>
      <span data-testid="auth-status">{auth.authStatus}</span>
      <span data-testid="user-email">{auth.user?.email || 'no-user'}</span>
      <button
        data-testid="set-logged-in"
        onClick={() => actions.setAuthStatus(AuthStatus.LOGGED_IN)}
      >
        Set Logged In
      </button>
      <button
        data-testid="set-user"
        onClick={() => actions.setUser(createMockUser({ email: 'updated@example.com' }))}
      >
        Set User
      </button>
    </div>
  );
}

describe('AuthProvider', () => {
  describe('initialization', () => {
    it('should provide default initial state', () => {
      const defaultInitialState = {
        authStatus: AuthStatus.CHECKING,
        user: null,
      };

      render(
        <AuthProvider initialState={defaultInitialState}>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent(AuthStatus.CHECKING);
      expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    });

    it('should provide custom initial state', () => {
      const mockUser = createMockUser({ email: 'test@example.com' });
      const customInitialState = {
        authStatus: AuthStatus.LOGGED_IN,
        user: mockUser,
      };

      render(
        <AuthProvider initialState={customInitialState}>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent(AuthStatus.LOGGED_IN);
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    it('should provide logged out state', () => {
      const loggedOutState = {
        authStatus: AuthStatus.LOGGED_OUT,
        user: null,
      };

      render(
        <AuthProvider initialState={loggedOutState}>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent(AuthStatus.LOGGED_OUT);
      expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    });
  });

  describe('state updates', () => {
    it('should update auth status', async () => {
      const { getByTestId } = render(
        <AuthProvider initialState={{
          authStatus: AuthStatus.LOGGED_OUT,
          user: null,
        }}>
          <TestComponent />
        </AuthProvider>
      );


      expect(getByTestId('auth-status')).toHaveTextContent(AuthStatus.LOGGED_OUT);

      await getByTestId('set-logged-in').click();

      expect(getByTestId('auth-status')).toHaveTextContent(AuthStatus.LOGGED_IN);
    });

    it('should update user data', async () => {
      const { getByTestId } = render(
        <AuthProvider initialState={{
          authStatus: AuthStatus.LOGGED_OUT,
          user: null,
        }}>
          <TestComponent />
        </AuthProvider>
      );

      expect(getByTestId('user-email')).toHaveTextContent('no-user');

      await getByTestId('set-user').click();

      expect(getByTestId('user-email')).toHaveTextContent('updated@example.com');
    });

    it('should handle clearing user data', async () => {
      const mockUser = createMockUser({ email: 'initial@example.com' });

      const ClearUserButton = () => {
        const actions = useContext(AuthActionsContext);

        return (<button
          data-testid="clear-user"
          onClick={() => {
            actions.setUser(null);
            actions.setAuthStatus(AuthStatus.LOGGED_OUT);
          }}
        >
          Clear User
        </button>);
      };

      const { getByTestId } = render(
        <AuthProvider initialState={{
          authStatus: AuthStatus.LOGGED_IN,
          user: mockUser,
        }}>
          <div>
            <TestComponent />
            <ClearUserButton />
          </div>
        </AuthProvider>
      );

      // Initial state
      expect(getByTestId('auth-status')).toHaveTextContent(AuthStatus.LOGGED_IN);
      expect(getByTestId('user-email')).toHaveTextContent('initial@example.com');

      // Clear everything
      getByTestId('clear-user').click();

      await Promise.resolve();

      expect(getByTestId('auth-status')).toHaveTextContent(AuthStatus.LOGGED_OUT);
      expect(getByTestId('user-email')).toHaveTextContent('no-user');
    });
  });

  describe('context isolation', () => {
    it('should provide separate contexts for state and actions', () => {
      function ContextTestComponent() {
        const auth = useContext(AuthContext);
        const actions = useContext(AuthActionsContext);

        return (
          <div>
            <span data-testid="has-auth-context">{auth ? 'yes' : 'no'}</span>
            <span data-testid="has-actions-context">{actions ? 'yes' : 'no'}</span>
            <span data-testid="contexts-different">
              {auth as unknown !== actions as unknown ? 'different' : 'same'}
            </span>
          </div>
        );
      }

      render(
        <AuthProvider initialState={{
          authStatus: AuthStatus.LOGGED_OUT,
          user: null,
        }}>
          <ContextTestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('has-auth-context')).toHaveTextContent('yes');
      expect(screen.getByTestId('has-actions-context')).toHaveTextContent('yes');
      expect(screen.getByTestId('contexts-different')).toHaveTextContent('different');
    });
  });

  describe('multiple auth status transitions', () => {
    it('should handle complex auth state transitions', async () => {
      function TransitionTestComponent() {
        const auth = useContext(AuthContext);
        const actions = useContext(AuthActionsContext);
        const mockUser = createMockUser();

        return (
          <div>
            <span data-testid="current-status">{auth.authStatus}</span>
            <button
              data-testid="start-login"
              onClick={() => actions.setAuthStatus(AuthStatus.LOGGING_IN)}
            >
              Start Login
            </button>
            <button
              data-testid="complete-login"
              onClick={() => {
                actions.setUser(mockUser);
                actions.setAuthStatus(AuthStatus.LOGGED_IN);
              }}
            >
              Complete Login
            </button>
            <button
              data-testid="start-logout"
              onClick={() => actions.setAuthStatus(AuthStatus.LOGGING_OUT)}
            >
              Start Logout
            </button>
            <button
              data-testid="complete-logout"
              onClick={() => {
                actions.setUser(null);
                actions.setAuthStatus(AuthStatus.LOGGED_OUT);
              }}
            >
              Complete Logout
            </button>
          </div>
        );
      }

      const { getByTestId } = render(
        <AuthProvider initialState={{
          authStatus: AuthStatus.CHECKING,
          user: null,
        }}>
          <TransitionTestComponent />
        </AuthProvider>
      );

      // Initial state
      expect(screen.getByTestId('current-status')).toHaveTextContent(AuthStatus.CHECKING);

      // Start login process
      await getByTestId('start-login').click();
      expect(screen.getByTestId('current-status')).toHaveTextContent(AuthStatus.LOGGING_IN);

      // Complete login
      await getByTestId('complete-login').click();
      expect(screen.getByTestId('current-status')).toHaveTextContent(AuthStatus.LOGGED_IN);

      // Start logout process
      await getByTestId('start-logout').click();
      expect(screen.getByTestId('current-status')).toHaveTextContent(AuthStatus.LOGGING_OUT);

      // Complete logout
      await getByTestId('complete-logout').click();
      expect(screen.getByTestId('current-status')).toHaveTextContent(AuthStatus.LOGGED_OUT);
    });
  });
});