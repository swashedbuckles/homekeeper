import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthStatus, type AuthStatusType } from '../../src/lib/types/authStatus';
import type { SafeUser } from '@homekeeper/shared';

/**
 * @fileoverview
 * Specialized testing utilities for React context providers, particularly designed for
 * testing AuthProvider and HouseholdProvider components. This module provides a
 * comprehensive suite of helper functions that standardize context provider testing
 * patterns, reduce code duplication, and ensure consistent testing approaches across
 * different providers.
 * 
 * These helpers are specifically optimized for testing:
 * - Provider initialization with different states
 * - Context state updates and transitions
 * - Provider isolation and error boundaries
 * - Complex multi-step state transitions
 * - Auth-specific scenarios and edge cases
 * 
 * @module contextTestHelpers
 * @since 1.0.0
 */

/**
 * Creates a generic test component that renders context values for testing purposes.
 * This factory function generates a React component that consumes a context hook and
 * displays its value as formatted JSON, making it easy to inspect context state
 * during tests.
 * 
 * Use this helper when you need to test context provider state without creating
 * custom test components for each scenario. It's particularly useful for testing
 * initial state, state changes, and ensuring providers are working correctly.
 * 
 * @template T - The type of the context value returned by the hook
 * @param contextHook - A React hook that consumes the context (e.g., useAuth, useHousehold)
 * @param testId - Optional test ID for the wrapper element (defaults to 'context-test')
 * @returns A React functional component that renders the context value
 * 
 * @example
 * ```tsx
 * // Testing AuthProvider state
 * const AuthTestComponent = createContextTestComponent(useAuth, 'auth-test');
 * 
 * render(
 *   <AuthProvider initialState={{ authStatus: AuthStatus.LOGGED_IN, user: mockUser }}>
 *     <AuthTestComponent />
 *   </AuthProvider>
 * );
 * 
 * const contextValue = JSON.parse(screen.getByTestId('context-value').textContent);
 * expect(contextValue.authStatus).toBe(AuthStatus.LOGGED_IN);
 * ```
 * 
 * @example
 * ```tsx
 * // Testing HouseholdProvider state
 * const HouseholdTestComponent = createContextTestComponent(useHousehold);
 * 
 * render(
 *   <HouseholdProvider initialHousehold={mockHousehold}>
 *     <HouseholdTestComponent />
 *   </HouseholdProvider>
 * );
 * 
 * const contextValue = JSON.parse(screen.getByTestId('context-value').textContent);
 * expect(contextValue.currentHousehold).toEqual(mockHousehold);
 * ```
 */
export const createContextTestComponent = <T,>(
  contextHook: () => T,
  testId = 'context-test'
) => {
  return function ContextTestComponent() {
    const contextValue = contextHook();
    
    return (
      <div data-testid={testId}>
        <pre data-testid="context-value">
          {JSON.stringify(contextValue, null, 2)}
        </pre>
      </div>
    );
  };
};

/**
 * Creates a comprehensive test suite for provider initialization scenarios.
 * This function generates Vitest describe blocks that test how providers initialize
 * with different props and initial states, ensuring they provide the expected
 * context values to consuming components.
 * 
 * Use this helper to systematically test all initialization scenarios for your
 * context providers, including default states, custom initial values, and edge cases.
 * It's essential for verifying that providers correctly set up their initial context.
 * 
 * @template T - The type of the context state object (must extend Record<string, any>)
 * @param providerName - Human-readable name of the provider for test descriptions
 * @param Provider - The React context provider component to test
 * @param contextHook - Hook that consumes the provider's context
 * @param scenarios - Array of test scenarios with descriptions, props, and expected states
 * @returns void - Creates test suites using Vitest describe/it blocks
 * 
 * @example
 * ```tsx
 * // Testing AuthProvider initialization scenarios
 * createProviderInitializationTests(
 *   'AuthProvider',
 *   AuthProvider,
 *   useAuth,
 *   [
 *     AUTH_PROVIDER_SCENARIOS.defaultState,
 *     AUTH_PROVIDER_SCENARIOS.loggedOutState,
 *     AUTH_PROVIDER_SCENARIOS.customState(AuthStatus.LOGGED_IN, mockUser)
 *   ]
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Testing HouseholdProvider initialization scenarios
 * createProviderInitializationTests(
 *   'HouseholdProvider',
 *   HouseholdProvider,
 *   useHousehold,
 *   [
 *     {
 *       description: 'should initialize with no household',
 *       providerProps: {},
 *       expectedState: { currentHousehold: null, households: [] }
 *     },
 *     {
 *       description: 'should initialize with provided household',
 *       providerProps: { initialHousehold: mockHousehold },
 *       expectedState: { currentHousehold: mockHousehold }
 *     }
 *   ]
 * );
 * ```
 */
export const createProviderInitializationTests = <T extends Record<string, any>>(
  providerName: string,
  Provider: React.ComponentType<any>,
  contextHook: () => T,
  scenarios: Array<{
    description: string;
    providerProps: any;
    expectedState: Partial<T>;
  }>
) => {
  describe(`${providerName} initialization`, () => {
    scenarios.forEach(({ description, providerProps, expectedState }) => {
      it(description, () => {
        const TestComponent = createContextTestComponent(contextHook);
        
        render(
          <Provider {...providerProps}>
            <TestComponent />
          </Provider>
        );

        const contextValue = JSON.parse(screen.getByTestId('context-value').textContent || '{}');
        
        Object.entries(expectedState).forEach(([key, value]) => {
          expect(contextValue[key]).toEqual(value);
        });
      });
    });
  });
};

/**
 * Creates test suites for context state update scenarios triggered by actions.
 * This function generates tests that verify how provider state changes in response
 * to actions, ensuring that state updates work correctly and produce expected results.
 * It handles both synchronous and asynchronous state updates.
 * 
 * Use this helper to test action-triggered state changes in your context providers.
 * It's particularly useful for testing login/logout flows, data mutations, and
 * any operations that modify provider state through action functions.
 * 
 * @template T - The type of the context state object (must extend Record<string, any>)
 * @template A - The type of the actions object (must extend Record<string, any>)
 * @param providerName - Human-readable name of the provider for test descriptions
 * @param Provider - The React context provider component to test
 * @param contextHook - Hook that consumes the provider's state context
 * @param actionsHook - Hook that provides action functions to modify state
 * @param scenarios - Array of test scenarios with actions and expected state changes
 * @returns void - Creates test suites using Vitest describe/it blocks
 * 
 * @example
 * ```tsx
 * // Testing AuthProvider state updates
 * createContextStateUpdateTests(
 *   'AuthProvider',
 *   AuthProvider,
 *   useAuth,
 *   useAuthActions,
 *   [
 *     {
 *       description: 'should update state when logging in',
 *       providerProps: { initialState: { authStatus: AuthStatus.LOGGED_OUT, user: null } },
 *       action: (actions) => actions.login(mockUser),
 *       expectedState: { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
 *     },
 *     {
 *       description: 'should clear user when logging out',
 *       providerProps: { initialState: { authStatus: AuthStatus.LOGGED_IN, user: mockUser } },
 *       action: (actions) => actions.logout(),
 *       expectedState: { authStatus: AuthStatus.LOGGED_OUT, user: null }
 *     }
 *   ]
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Testing HouseholdProvider state updates
 * createContextStateUpdateTests(
 *   'HouseholdProvider',
 *   HouseholdProvider,
 *   useHousehold,
 *   useHouseholdActions,
 *   [
 *     {
 *       description: 'should add new household',
 *       providerProps: {},
 *       action: async (actions) => await actions.createHousehold(newHouseholdData),
 *       expectedState: { households: expect.arrayContaining([expect.objectContaining(newHouseholdData)]) }
 *     }
 *   ]
 * );
 * ```
 */
export const createContextStateUpdateTests = <T extends Record<string, any>, A extends Record<string, any>>(
  providerName: string,
  Provider: React.ComponentType<any>,
  contextHook: () => T,
  actionsHook: () => A,
  scenarios: Array<{
    description: string;
    providerProps: any;
    action: (actions: A) => void | Promise<void>;
    expectedState: Partial<T>;
  }>
) => {
  describe(`${providerName} state updates`, () => {
    scenarios.forEach(({ description, providerProps, action, expectedState }) => {
      it(description, async () => {
        function TestComponent() {
          const contextValue = contextHook();
          const actions = actionsHook();
          
          return (
            <div>
              <pre data-testid="context-value">
                {JSON.stringify(contextValue, null, 2)}
              </pre>
              <button
                data-testid="trigger-action"
                onClick={() => action(actions)}
              >
                Trigger Action
              </button>
            </div>
          );
        }
        
        render(
          <Provider {...providerProps}>
            <TestComponent />
          </Provider>
        );

        const actionButton = screen.getByTestId('trigger-action');
        await actionButton.click();

        // Allow for async updates
        await new Promise(resolve => setTimeout(resolve, 0));

        const contextValue = JSON.parse(screen.getByTestId('context-value').textContent || '{}');
        
        Object.entries(expectedState).forEach(([key, value]) => {
          expect(contextValue[key]).toEqual(value);
        });
      });
    });
  });
};

/**
 * Creates tests to verify proper context isolation between state and actions.
 * This function ensures that providers correctly separate their state context
 * from their actions context, preventing coupling and maintaining clean
 * architectural boundaries.
 * 
 * Use this helper to verify that your provider implementation follows the
 * separation of concerns pattern, where state and actions are provided through
 * separate contexts. This is important for performance optimization and
 * architectural clarity.
 * 
 * @template T - The type of the context state
 * @template A - The type of the actions object
 * @param providerName - Human-readable name of the provider for test descriptions
 * @param Provider - The React context provider component to test
 * @param contextHook - Hook that consumes the provider's state context
 * @param actionsHook - Hook that consumes the provider's actions context
 * @param providerProps - Optional props to pass to the provider (defaults to empty object)
 * @returns void - Creates test suites using Vitest describe/it blocks
 * 
 * @example
 * ```tsx
 * // Testing AuthProvider context isolation
 * createContextIsolationTests(
 *   'AuthProvider',
 *   AuthProvider,
 *   useAuth,
 *   useAuthActions,
 *   { initialState: { authStatus: AuthStatus.UNKNOWN, user: null } }
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Testing HouseholdProvider context isolation
 * createContextIsolationTests(
 *   'HouseholdProvider',
 *   HouseholdProvider,
 *   useHousehold,
 *   useHouseholdActions
 * );
 * ```
 */
export const createContextIsolationTests = <T, A>(
  providerName: string,
  Provider: React.ComponentType<any>,
  contextHook: () => T,
  actionsHook: () => A,
  providerProps: any = {}
) => {
  describe(`${providerName} context isolation`, () => {
    it('should provide separate contexts for state and actions', () => {
      function ContextTestComponent() {
        const context = contextHook();
        const actions = actionsHook();

        return (
          <div>
            <span data-testid="has-context">{context ? 'yes' : 'no'}</span>
            <span data-testid="has-actions">{actions ? 'yes' : 'no'}</span>
            <span data-testid="contexts-different">
              {context as unknown !== actions as unknown ? 'different' : 'same'}
            </span>
          </div>
        );
      }

      render(
        <Provider {...providerProps}>
          <ContextTestComponent />
        </Provider>
      );

      expect(screen.getByTestId('has-context')).toHaveTextContent('yes');
      expect(screen.getByTestId('has-actions')).toHaveTextContent('yes');
      expect(screen.getByTestId('contexts-different')).toHaveTextContent('different');
    });
  });
};

/**
 * Predefined test scenarios specifically designed for AuthProvider testing.
 * This object contains common authentication state scenarios that can be reused
 * across different test suites, ensuring consistency and reducing code duplication
 * in authentication-related tests.
 * 
 * These scenarios cover the most common authentication states and transitions
 * that need to be tested in typical auth workflows. Use these with the generic
 * testing helpers to quickly set up comprehensive auth provider tests.
 * 
 * @example
 * ```tsx
 * // Using predefined scenarios with initialization tests
 * createProviderInitializationTests(
 *   'AuthProvider',
 *   AuthProvider,
 *   useAuth,
 *   [
 *     AUTH_PROVIDER_SCENARIOS.defaultState,
 *     AUTH_PROVIDER_SCENARIOS.loggedOutState,
 *     AUTH_PROVIDER_SCENARIOS.customState(AuthStatus.LOGGED_IN, mockUser)
 *   ]
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Using individual scenarios in custom tests
 * it('should handle default state correctly', () => {
 *   const scenario = AUTH_PROVIDER_SCENARIOS.defaultState;
 *   // ... test implementation
 * });
 * ```
 */
export const AUTH_PROVIDER_SCENARIOS = {
  /**
   * Default authentication state scenario with unknown status and no user.
   * This represents the initial state when the app starts and hasn't yet
   * determined the user's authentication status.
   */
  defaultState: {
    description: 'should provide default initial state',
    providerProps: {
      initialState: {
        authStatus: AuthStatus.UNKNOWN,
        user: null,
      }
    },
    expectedState: {
      authStatus: AuthStatus.UNKNOWN,
      user: null
    }
  },
  
  /**
   * Factory function for creating custom authentication state scenarios.
   * This allows you to test any combination of auth status and user data.
   * 
   * @param authStatus - The authentication status to test
   * @param user - Optional user data (defaults to null)
   * @returns A test scenario object with the specified state
   * 
   * @example
   * ```tsx
   * const loggedInScenario = AUTH_PROVIDER_SCENARIOS.customState(
   *   AuthStatus.LOGGED_IN, 
   *   { id: '123', email: 'user@example.com', name: 'Test User' }
   * );
   * ```
   */
  customState: (authStatus: AuthStatusType, user: SafeUser | null = null) => ({
    description: `should provide custom initial state (${authStatus})`,
    providerProps: {
      initialState: { authStatus, user }
    },
    expectedState: { authStatus, user }
  }),
  
  /**
   * Logged out authentication state scenario.
   * This represents the state when a user has been explicitly logged out
   * or when authentication has been cleared.
   */
  loggedOutState: {
    description: 'should provide logged out state',
    providerProps: {
      initialState: {
        authStatus: AuthStatus.LOGGED_OUT,
        user: null,
      }
    },
    expectedState: {
      authStatus: AuthStatus.LOGGED_OUT,
      user: null
    }
  }
};

/**
 * Creates tests to verify proper error handling when context hooks are used outside providers.
 * This function ensures that context hooks throw appropriate errors when accessed without
 * their corresponding provider wrapper, which is essential for developer experience and
 * preventing runtime issues.
 * 
 * Use this helper to test that your context hooks properly validate they are being used
 * within the correct provider context. This is a critical safety feature that helps
 * developers catch integration errors early.
 * 
 * @param providerName - Human-readable name of the provider for test descriptions
 * @param _Provider - The React context provider component (parameter kept for consistency, marked as unused)
 * @param contextHook - Hook that should throw when used outside the provider
 * @returns void - Creates test suites using Vitest describe/it blocks
 * 
 * @example
 * ```tsx
 * // Testing AuthProvider error handling
 * createProviderErrorTests(
 *   'AuthProvider',
 *   AuthProvider,
 *   useAuth
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Testing HouseholdProvider error handling
 * createProviderErrorTests(
 *   'HouseholdProvider', 
 *   HouseholdProvider,
 *   useHousehold
 * );
 * ```
 */
export const createProviderErrorTests = (
  providerName: string,
  _Provider: React.ComponentType<any>,
  contextHook: () => any
) => {
  describe(`${providerName} error handling`, () => {
    it('should throw error when used outside provider', () => {
      function TestComponent() {
        contextHook(); // This should throw
        return <div>Should not render</div>;
      }

      // Suppress console.error for this test
      const originalError = console.error;
      console.error = () => {};

      expect(() => render(<TestComponent />)).toThrow();

      console.error = originalError;
    });
  });
};

/**
 * Creates tests for complex multi-step state transitions in context providers.
 * This function generates test suites that verify sequential state changes through
 * multiple actions, ensuring that complex workflows and state machines work correctly.
 * Each transition is verified independently within the same test execution.
 * 
 * Use this helper when you need to test complex user flows that involve multiple
 * state changes, such as authentication workflows, multi-step forms, or complex
 * data manipulation sequences. It's particularly useful for testing state machines
 * and ensuring proper state progression.
 * 
 * @template T - The type of the context state object (must extend Record<string, any>)
 * @template A - The type of the actions object (must extend Record<string, any>)
 * @param providerName - Human-readable name of the provider for test descriptions
 * @param Provider - The React context provider component to test
 * @param contextHook - Hook that consumes the provider's state context
 * @param actionsHook - Hook that provides action functions to modify state
 * @param transitionScenarios - Array of multi-step transition scenarios to test
 * @returns void - Creates test suites using Vitest describe/it blocks
 * 
 * @example
 * ```tsx
 * // Testing AuthProvider login flow with multiple steps
 * createStateTransitionTests(
 *   'AuthProvider',
 *   AuthProvider,
 *   useAuth,
 *   useAuthActions,
 *   [
 *     {
 *       description: 'should handle complete login flow',
 *       providerProps: { initialState: { authStatus: AuthStatus.LOGGED_OUT, user: null } },
 *       transitions: [
 *         {
 *           action: (actions) => actions.startLogin(),
 *           expectedState: { authStatus: AuthStatus.LOGGING_IN }
 *         },
 *         {
 *           action: (actions) => actions.completeLogin(mockUser),
 *           expectedState: { authStatus: AuthStatus.LOGGED_IN, user: mockUser }
 *         },
 *         {
 *           action: (actions) => actions.logout(),
 *           expectedState: { authStatus: AuthStatus.LOGGED_OUT, user: null }
 *         }
 *       ]
 *     }
 *   ]
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Testing HouseholdProvider household switching flow
 * createStateTransitionTests(
 *   'HouseholdProvider',
 *   HouseholdProvider,
 *   useHousehold,
 *   useHouseholdActions,
 *   [
 *     {
 *       description: 'should handle household creation and switching',
 *       providerProps: {},
 *       transitions: [
 *         {
 *           action: async (actions) => await actions.createHousehold(householdData1),
 *           expectedState: { currentHousehold: expect.objectContaining(householdData1) }
 *         },
 *         {
 *           action: async (actions) => await actions.createHousehold(householdData2),
 *           expectedState: { households: expect.arrayContaining([
 *             expect.objectContaining(householdData1),
 *             expect.objectContaining(householdData2)
 *           ]) }
 *         },
 *         {
 *           action: (actions) => actions.switchHousehold(householdData1.id),
 *           expectedState: { currentHousehold: expect.objectContaining(householdData1) }
 *         }
 *       ]
 *     }
 *   ]
 * );
 * ```
 */
export const createStateTransitionTests = <T extends Record<string, any>, A extends Record<string, any>>(
  providerName: string,
  Provider: React.ComponentType<any>,
  contextHook: () => T,
  actionsHook: () => A,
  transitionScenarios: Array<{
    description: string;
    providerProps: any;
    transitions: Array<{
      action: (actions: A) => void | Promise<void>;
      expectedState: Partial<T>;
    }>;
  }>
) => {
  describe(`${providerName} state transitions`, () => {
    transitionScenarios.forEach(({ description, providerProps, transitions }) => {
      it(description, async () => {
        function TransitionTestComponent() {
          const context = contextHook();
          const actions = actionsHook();

          return (
            <div>
              <pre data-testid="current-state">
                {JSON.stringify(context, null, 2)}
              </pre>
              {transitions.map((_, index) => (
                <button
                  key={index}
                  data-testid={`transition-${index}`}
                  onClick={() => transitions[index].action(actions)}
                >
                  Transition {index + 1}
                </button>
              ))}
            </div>
          );
        }

        render(
          <Provider {...providerProps}>
            <TransitionTestComponent />
          </Provider>
        );

        // Execute each transition and verify state
        for (let i = 0; i < transitions.length; i++) {
          const button = screen.getByTestId(`transition-${i}`);
          await button.click();
          
          // Allow for async updates
          await new Promise(resolve => setTimeout(resolve, 0));

          const currentState = JSON.parse(
            screen.getByTestId('current-state').textContent || '{}'
          );

          Object.entries(transitions[i].expectedState).forEach(([key, value]) => {
            expect(currentState[key]).toEqual(value);
          });
        }
      });
    });
  });
};