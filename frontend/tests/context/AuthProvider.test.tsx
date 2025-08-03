import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { describe, it, expect } from 'vitest';
import { AuthContext, AuthActionsContext } from '../../src/context/authContexts';
import { AuthProvider } from '../../src/context/AuthProvider';
import { AuthStatus } from '../../src/lib/types/authStatus';
import { createMockUser } from '../helpers/testUtils';

// Helper function to render AuthProvider with test consumer
const renderAuthProvider = (initialState: any, children?: React.ReactNode) => {
  const TestComponent = () => {
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
        {children}
      </div>
    );
  };

  return render(
    <AuthProvider initialState={initialState}>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthProvider', () => {
  describe('initialization', () => {
    const initializationTests = [
      {
        name: 'should provide default initial state',
        initialState: {
          authStatus: AuthStatus.UNKNOWN,
          user: null,
        },
        expectedAuthStatus: AuthStatus.UNKNOWN,
        expectedUserEmail: 'no-user'
      },
      {
        name: 'should provide custom initial state',
        initialState: {
          authStatus: AuthStatus.LOGGED_IN,
          user: createMockUser({ email: 'test@example.com' }),
        },
        expectedAuthStatus: AuthStatus.LOGGED_IN,
        expectedUserEmail: 'test@example.com'
      },
      {
        name: 'should provide logged out state',
        initialState: {
          authStatus: AuthStatus.LOGGED_OUT,
          user: null,
        },
        expectedAuthStatus: AuthStatus.LOGGED_OUT,
        expectedUserEmail: 'no-user'
      }
    ];

    initializationTests.forEach(({ name, initialState, expectedAuthStatus, expectedUserEmail }) => {
      it(name, () => {
        renderAuthProvider(initialState);

        expect(screen.getByTestId('auth-status')).toHaveTextContent(expectedAuthStatus);
        expect(screen.getByTestId('user-email')).toHaveTextContent(expectedUserEmail);
      });
    });
  });

  describe('state updates', () => {
    const stateUpdateTests = [
      {
        name: 'should update auth status',
        initialState: {
          authStatus: AuthStatus.LOGGED_OUT,
          user: null,
        },
        action: async (getByTestId: any) => {
          await getByTestId('set-logged-in').click();
        },
        expectations: {
          initialAuthStatus: AuthStatus.LOGGED_OUT,
          finalAuthStatus: AuthStatus.LOGGED_IN
        }
      },
      {
        name: 'should update user data',
        initialState: {
          authStatus: AuthStatus.LOGGED_OUT,
          user: null,
        },
        action: async (getByTestId: any) => {
          await getByTestId('set-user').click();
        },
        expectations: {
          initialUserEmail: 'no-user',
          finalUserEmail: 'updated@example.com'
        }
      }
    ];

    stateUpdateTests.forEach(({ name, initialState, action, expectations }) => {
      it(name, async () => {
        const { getByTestId } = renderAuthProvider(initialState);

        // Check initial state
        if (expectations.initialAuthStatus) {
          expect(getByTestId('auth-status')).toHaveTextContent(expectations.initialAuthStatus);
        }
        if (expectations.initialUserEmail) {
          expect(getByTestId('user-email')).toHaveTextContent(expectations.initialUserEmail);
        }

        // Perform action
        await action(getByTestId);

        // Check final state
        if (expectations.finalAuthStatus) {
          expect(getByTestId('auth-status')).toHaveTextContent(expectations.finalAuthStatus);
        }
        if (expectations.finalUserEmail) {
          expect(getByTestId('user-email')).toHaveTextContent(expectations.finalUserEmail);
        }
      });
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

      const { getByTestId } = renderAuthProvider(
        {
          authStatus: AuthStatus.LOGGED_IN,
          user: mockUser,
        },
        <ClearUserButton />
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
      const ContextTestComponent = () => {
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
      };

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
          authStatus: AuthStatus.UNKNOWN,
          user: null,
        }}>
          <TransitionTestComponent />
        </AuthProvider>
      );

      const transitionSteps = [
        { action: 'initial', expectedStatus: AuthStatus.UNKNOWN },
        { action: 'start-login', expectedStatus: AuthStatus.LOGGING_IN },
        { action: 'complete-login', expectedStatus: AuthStatus.LOGGED_IN },
        { action: 'start-logout', expectedStatus: AuthStatus.LOGGING_OUT },
        { action: 'complete-logout', expectedStatus: AuthStatus.LOGGED_OUT }
      ];

      for (const { action, expectedStatus } of transitionSteps) {
        if (action !== 'initial') {
          await getByTestId(action).click();
        }
        expect(screen.getByTestId('current-status')).toHaveTextContent(expectedStatus);
      }
    });
  });
});