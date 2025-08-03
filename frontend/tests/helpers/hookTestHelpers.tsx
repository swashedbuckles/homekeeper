import { renderHook, act, waitFor, type RenderHookResult } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { ReactNode } from 'react';
import { AuthStatus, type AuthStatusType } from '../../src/lib/types/authStatus';
import type { SafeUser } from '@homekeeper/shared';
import { TestAuthProvider } from './testProviderUtils';
import { createMockUser } from './testUtils';

/**
 * @fileoverview Hook testing utilities for consistent patterns across custom hook tests.
 * These helpers provide standardized approaches for testing React hooks with various
 * authentication states, loading states, and error conditions.
 * 
 * @example
 * ```typescript
 * import { createHookInitialStateTests, createAuthWrapper } from '@/tests/helpers/hookTestHelpers';
 * 
 * // Test useAuth hook initial states
 * createHookInitialStateTests('useAuth', useAuth, [
 *   AUTH_STATE_SCENARIOS.unknown,
 *   AUTH_STATE_SCENARIOS.loggedOut,
 *   AUTH_STATE_SCENARIOS.loggedIn()
 * ]);
 * ```
 */

/**
 * Type definition for React hook wrapper components
 */
type HookWrapper = ({ children }: { children: ReactNode }) => React.JSX.Element;

/**
 * Creates a wrapper component for testing hooks that depend on authentication context.
 * This wrapper provides a controlled authentication environment for hook testing,
 * allowing you to simulate different auth states and user scenarios.
 * 
 * @param authStatus - The authentication status to initialize the test environment with
 * @param user - The user object to provide in the authentication context (null for unauthenticated states)
 * @returns A wrapper component that provides authentication context to child components
 * 
 * @example
 * ```typescript
 * // Test a hook with logged-in user
 * const mockUser = createMockUser({ id: '123', email: 'test@example.com' });
 * const wrapper = createAuthWrapper(AuthStatus.LOGGED_IN, mockUser);
 * const { result } = renderHook(() => useHousehold(), { wrapper });
 * 
 * // Test a hook with logged-out state
 * const loggedOutWrapper = createAuthWrapper(AuthStatus.LOGGED_OUT);
 * const { result } = renderHook(() => useAuth(), { wrapper: loggedOutWrapper });
 * 
 * // Test a hook with unknown auth state
 * const unknownWrapper = createAuthWrapper(AuthStatus.UNKNOWN);
 * const { result } = renderHook(() => useProfile(), { wrapper: unknownWrapper });
 * ```
 */
export const createAuthWrapper = (
  authStatus: AuthStatusType = AuthStatus.UNKNOWN,
  user: SafeUser | null = null
): HookWrapper => {
  return ({ children }) => (
    <TestAuthProvider initialAuthStatus={authStatus} initialUser={user}>
      {children}
    </TestAuthProvider>
  );
};

/**
 * Creates a standardized test suite for testing hook initial states across different scenarios.
 * This function generates a complete describe block with individual test cases for each scenario,
 * helping ensure consistent testing patterns for hook initialization behavior.
 * 
 * @template T - The type of the hook's return value
 * @param hookName - The name of the hook being tested (used in test descriptions)
 * @param useHook - The hook function to test
 * @param scenarios - Array of test scenarios, each defining a specific initial state test case
 * @param scenarios[].description - Description of what this scenario tests
 * @param scenarios[].wrapper - Optional wrapper component to provide context (e.g., auth, theme)
 * @param scenarios[].expectedState - Partial state object defining expected initial values
 * 
 * @example
 * ```typescript
 * // Test useAuth hook with different authentication states
 * createHookInitialStateTests('useAuth', useAuth, [
 *   {
 *     description: 'should start with unknown auth status',
 *     wrapper: createAuthWrapper(AuthStatus.UNKNOWN),
 *     expectedState: {
 *       authStatus: AuthStatus.UNKNOWN,
 *       user: null,
 *       isAuthenticated: false,
 *       isLoading: false
 *     }
 *   },
 *   {
 *     description: 'should start logged in with user data',
 *     wrapper: createAuthWrapper(AuthStatus.LOGGED_IN, createMockUser()),
 *     expectedState: {
 *       authStatus: AuthStatus.LOGGED_IN,
 *       isAuthenticated: true,
 *       isLoading: false
 *     }
 *   }
 * ]);
 * 
 * // Test useHousehold hook with different scenarios
 * createHookInitialStateTests('useHousehold', useHousehold, [
 *   {
 *     description: 'should initialize with empty state when logged out',
 *     wrapper: createAuthWrapper(AuthStatus.LOGGED_OUT),
 *     expectedState: {
 *       households: [],
 *       currentHousehold: null,
 *       isLoading: false
 *     }
 *   }
 * ]);
 * ```
 */
export const createHookInitialStateTests = <T extends Record<string, any>>(
  hookName: string,
  useHook: () => T,
  scenarios: Array<{
    description: string;
    wrapper?: HookWrapper;
    expectedState: Partial<T>;
  }>
) => {
  describe(`${hookName} initial state`, () => {
    scenarios.forEach(({ description, wrapper, expectedState }) => {
      it(description, () => {
        const { result } = renderHook(() => useHook(), { wrapper });
        
        Object.entries(expectedState).forEach(([key, value]) => {
          expect(result.current[key]).toEqual(value);
        });
      });
    });
  });
};

/**
 * Creates a standardized test suite for testing hook actions and their side effects.
 * This function generates test cases that execute hook actions and verify the resulting
 * state changes, providing consistent patterns for testing hook behavior.
 * 
 * @template T - The type of the hook's return value
 * @param hookName - The name of the hook being tested (used in test descriptions)
 * @param useHook - The hook function to test
 * @param scenarios - Array of action test scenarios
 * @param scenarios[].description - Description of what this action test verifies
 * @param scenarios[].wrapper - Optional wrapper component to provide context
 * @param scenarios[].action - Function that executes the hook action to test
 * @param scenarios[].expectedState - Optional partial state to verify after action execution
 * @param scenarios[].expectation - Optional custom expectation function for complex assertions
 * 
 * @example
 * ```typescript
 * // Test useAuth login/logout actions
 * createHookActionTests('useAuth', useAuth, [
 *   {
 *     description: 'should log in user successfully',
 *     wrapper: createAuthWrapper(AuthStatus.LOGGED_OUT),
 *     action: async (auth) => {
 *       await auth.login('test@example.com', 'password123');
 *     },
 *     expectedState: {
 *       authStatus: AuthStatus.LOGGED_IN,
 *       isAuthenticated: true,
 *       isLoading: false
 *     }
 *   },
 *   {
 *     description: 'should handle login error gracefully',
 *     wrapper: createAuthWrapper(AuthStatus.LOGGED_OUT),
 *     action: async (auth) => {
 *       await auth.login('invalid@example.com', 'wrong-password');
 *     },
 *     expectation: (auth) => {
 *       expect(auth.error).toBeDefined();
 *       expect(auth.authStatus).toBe(AuthStatus.LOGGED_OUT);
 *     }
 *   }
 * ]);
 * 
 * // Test useHousehold actions
 * createHookActionTests('useHousehold', useHousehold, [
 *   {
 *     description: 'should create new household',
 *     wrapper: createAuthWrapper(AuthStatus.LOGGED_IN, createMockUser()),
 *     action: async (household) => {
 *       await household.createHousehold({ name: 'Test House' });
 *     },
 *     expectation: (household) => {
 *       expect(household.households).toHaveLength(1);
 *       expect(household.currentHousehold?.name).toBe('Test House');
 *     }
 *   }
 * ]);
 * ```
 */
export const createHookActionTests = <T extends Record<string, any>>(
  hookName: string,
  useHook: () => T,
  scenarios: Array<{
    description: string;
    wrapper?: HookWrapper;
    action: (hookResult: T) => Promise<void> | void;
    expectedState?: Partial<T>;
    expectation?: (hookResult: T) => void;
  }>
) => {
  describe(`${hookName} actions`, () => {
    scenarios.forEach(({ description, wrapper, action, expectedState, expectation }) => {
      it(description, async () => {
        const { result } = renderHook(() => useHook(), { wrapper });
        
        await act(async () => {
          await action(result.current);
        });

        if (expectedState) {
          Object.entries(expectedState).forEach(([key, value]) => {
            expect(result.current[key]).toEqual(value);
          });
        }

        if (expectation) {
          expectation(result.current);
        }
      });
    });
  });
};

/**
 * Asserts that a hook result contains the expected authentication state values.
 * This helper provides a convenient way to verify all authentication-related
 * properties in a single assertion, reducing test boilerplate.
 * 
 * @param result - The hook result object from renderHook
 * @param expectedAuthStatus - The expected authentication status
 * @param expectedUser - The expected user object (defaults to null)
 * @param expectedIsAuthenticated - The expected authenticated state (defaults to false)
 * @param expectedIsLoading - The expected loading state (defaults to false)
 * 
 * @example
 * ```typescript
 * // Test logged-in state
 * const mockUser = createMockUser();
 * const { result } = renderHook(() => useAuth(), {
 *   wrapper: createAuthWrapper(AuthStatus.LOGGED_IN, mockUser)
 * });
 * expectAuthState(
 *   result,
 *   AuthStatus.LOGGED_IN,
 *   mockUser,
 *   true,  // isAuthenticated
 *   false  // isLoading
 * );
 * 
 * // Test logged-out state
 * const { result } = renderHook(() => useAuth(), {
 *   wrapper: createAuthWrapper(AuthStatus.LOGGED_OUT)
 * });
 * expectAuthState(result, AuthStatus.LOGGED_OUT); // Other params default to null/false
 * 
 * // Test loading state during login
 * const { result } = renderHook(() => useAuth());
 * act(() => {
 *   result.current.login('test@example.com', 'password');
 * });
 * expectAuthState(result, AuthStatus.UNKNOWN, null, false, true);
 * ```
 */
export const expectAuthState = (
  result: RenderHookResult<any, any>['result'],
  expectedAuthStatus: AuthStatusType,
  expectedUser: SafeUser | null = null,
  expectedIsAuthenticated = false,
  expectedIsLoading = false
) => {
  expect(result.current.authStatus).toBe(expectedAuthStatus);
  expect(result.current.user).toEqual(expectedUser);
  expect(result.current.isAuthenticated).toBe(expectedIsAuthenticated);
  expect(result.current.isLoading).toBe(expectedIsLoading);
};

/**
 * Asserts that a hook is currently in a loading state.
 * This helper provides a quick way to verify loading states during async operations.
 * 
 * @param result - The hook result object from renderHook
 * 
 * @example
 * ```typescript
 * const { result } = renderHook(() => useHousehold());
 * 
 * // Trigger an async action
 * act(() => {
 *   result.current.fetchHouseholds();
 * });
 * 
 * // Verify loading state immediately after action
 * expectLoadingState(result);
 * 
 * // Wait for completion and verify not loading
 * await waitFor(() => {
 *   expectNotLoadingState(result);
 * });
 * ```
 */
export const expectLoadingState = (result: RenderHookResult<any, any>['result']) => {
  expect(result.current.isLoading).toBe(true);
};

/**
 * Asserts that a hook is not currently in a loading state.
 * This helper provides a quick way to verify that async operations have completed.
 * 
 * @param result - The hook result object from renderHook
 * 
 * @example
 * ```typescript
 * const { result } = renderHook(() => useAuth());
 * 
 * // Initially should not be loading
 * expectNotLoadingState(result);
 * 
 * // After successful login
 * await act(async () => {
 *   await result.current.login('test@example.com', 'password');
 * });
 * expectNotLoadingState(result);
 * 
 * // Check loading state during operation
 * act(() => {
 *   result.current.refreshUser();
 * });
 * expectLoadingState(result);
 * 
 * await waitFor(() => {
 *   expectNotLoadingState(result);
 * });
 * ```
 */
export const expectNotLoadingState = (result: RenderHookResult<any, any>['result']) => {
  expect(result.current.isLoading).toBe(false);
};

/**
 * Pre-configured authentication state scenarios for consistent testing across the application.
 * This object provides standardized test scenarios for common authentication states,
 * ensuring consistent behavior testing for hooks that depend on authentication context.
 * 
 * @example
 * ```typescript
 * // Use with createHookInitialStateTests
 * createHookInitialStateTests('useAuth', useAuth, [
 *   AUTH_STATE_SCENARIOS.unknown,
 *   AUTH_STATE_SCENARIOS.loggedOut,
 *   AUTH_STATE_SCENARIOS.loggedIn()
 * ]);
 * 
 * // Use individual scenarios in custom tests
 * it('should handle unknown auth state', () => {
 *   const { result } = renderHook(() => useProfile(), {
 *     wrapper: AUTH_STATE_SCENARIOS.unknown.wrapper
 *   });
 *   expect(result.current.profile).toBeNull();
 * });
 * 
 * // Use logged-in scenario with custom user
 * const adminUser = createMockUser({ role: 'admin' });
 * const adminScenario = AUTH_STATE_SCENARIOS.loggedIn(adminUser);
 * const { result } = renderHook(() => useAdminPanel(), {
 *   wrapper: adminScenario.wrapper
 * });
 * 
 * // Test household-specific functionality
 * const userWithHousehold = createMockUser({ householdId: 'house-123' });
 * createHookInitialStateTests('useHousehold', useHousehold, [
 *   AUTH_STATE_SCENARIOS.loggedOut,
 *   AUTH_STATE_SCENARIOS.loggedIn(userWithHousehold)
 * ]);
 * ```
 */
export const AUTH_STATE_SCENARIOS = {
  /**
   * Scenario for testing with unknown authentication status.
   * Represents the initial state before auth status is determined.
   */
  unknown: {
    description: 'should initialize with UNKNOWN status',
    wrapper: createAuthWrapper(AuthStatus.UNKNOWN),
    expectedState: {
      authStatus: AuthStatus.UNKNOWN,
      user: null,
      isLoading: false,
      isAuthenticated: false
    }
  },
  /**
   * Scenario for testing with logged-out authentication status.
   * Represents a confirmed unauthenticated state.
   */
  loggedOut: {
    description: 'should initialize with LOGGED_OUT status',
    wrapper: createAuthWrapper(AuthStatus.LOGGED_OUT),
    expectedState: {
      authStatus: AuthStatus.LOGGED_OUT,
      user: null,
      isLoading: false,
      isAuthenticated: false
    }
  },
  /**
   * Factory function for creating logged-in authentication scenarios.
   * Allows customization of the user object for different test cases.
   * 
   * @param mockUser - The user object to use (defaults to createMockUser())
   * @returns A scenario object with logged-in state and the specified user
   */
  loggedIn: (mockUser: SafeUser = createMockUser()) => ({
    description: 'should initialize with LOGGED_IN status and user',
    wrapper: createAuthWrapper(AuthStatus.LOGGED_IN, mockUser),
    expectedState: {
      authStatus: AuthStatus.LOGGED_IN,
      user: mockUser,
      isLoading: false,
      isAuthenticated: true
    }
  })
};

/**
 * Re-renders a hook with a new wrapper component, useful for testing hook behavior
 * when context changes (e.g., authentication state changes, theme changes).
 * 
 * @template T - The type of the hook's return value
 * @param hookResult - The result object from renderHook containing rerender function
 * @param newWrapper - The new wrapper component to use for re-rendering
 * 
 * @example
 * ```typescript
 * // Test auth state changes
 * const { result, rerender } = renderHook(() => useAuth(), {
 *   wrapper: createAuthWrapper(AuthStatus.UNKNOWN)
 * });
 * 
 * // Initially unknown
 * expect(result.current.authStatus).toBe(AuthStatus.UNKNOWN);
 * 
 * // Simulate login by changing wrapper
 * const loggedInWrapper = createAuthWrapper(AuthStatus.LOGGED_IN, createMockUser());
 * rerenderHookWithNewWrapper({ result, rerender }, loggedInWrapper);
 * 
 * // Now should be logged in
 * expect(result.current.authStatus).toBe(AuthStatus.LOGGED_IN);
 * expect(result.current.isAuthenticated).toBe(true);
 * 
 * // Test household context changes
 * const { result } = renderHook(() => useHousehold());
 * const householdWrapper = createHouseholdWrapper(mockHousehold);
 * rerenderHookWithNewWrapper(result, householdWrapper);
 * expect(result.current.currentHousehold).toEqual(mockHousehold);
 * ```
 */
export const rerenderHookWithNewWrapper = <T,>(
  hookResult: RenderHookResult<T, any>,
  newWrapper: HookWrapper
) => {
  hookResult.rerender({ wrapper: newWrapper });
};

/**
 * Waits for a hook's state to change according to a custom predicate function.
 * This helper is useful for testing async hook operations and state transitions.
 * 
 * @template T - The type of the hook's return value (must be an object)
 * @param result - The hook result object from renderHook
 * @param predicate - Function that returns true when the desired state is reached
 * @param timeout - Maximum time to wait in milliseconds (defaults to 5000ms)
 * 
 * @example
 * ```typescript
 * // Wait for auth login to complete
 * const { result } = renderHook(() => useAuth());
 * 
 * act(() => {
 *   result.current.login('test@example.com', 'password');
 * });
 * 
 * // Wait for login to complete successfully
 * await waitForHookStateChange(
 *   result,
 *   (auth) => auth.isAuthenticated && !auth.isLoading,
 *   10000
 * );
 * 
 * expect(result.current.user).toBeDefined();
 * 
 * // Wait for household data to load
 * const { result } = renderHook(() => useHousehold(), {
 *   wrapper: createAuthWrapper(AuthStatus.LOGGED_IN, createMockUser())
 * });
 * 
 * await waitForHookStateChange(
 *   result,
 *   (household) => household.households.length > 0 && !household.isLoading
 * );
 * 
 * // Wait for error state
 * await waitForHookStateChange(
 *   result,
 *   (state) => state.error !== null,
 *   3000
 * );
 * ```
 */
export const waitForHookStateChange = async <T extends Record<string, any>>(
  result: RenderHookResult<T, any>['result'],
  predicate: (state: T) => boolean,
  timeout = 5000
) => {
  await waitFor(() => {
    expect(predicate(result.current)).toBe(true);
  }, { timeout });
};

/**
 * Tests that an async hook action throws the expected error.
 * This helper provides a clean way to test error handling in hooks.
 * 
 * @template T - The return type of the hook action
 * @param hookAction - The async function that should throw an error
 * @param expectedError - The expected error (can be string, Error instance, or error matcher)
 * 
 * @example
 * ```typescript
 * // Test login with invalid credentials
 * const { result } = renderHook(() => useAuth());
 * 
 * await expectHookToThrow(
 *   () => result.current.login('invalid@example.com', 'wrong-password'),
 *   'Invalid credentials'
 * );
 * 
 * // Test with Error instance
 * await expectHookToThrow(
 *   () => result.current.createHousehold({ name: '' }), // Invalid data
 *   new Error('Household name is required')
 * );
 * 
 * // Test API errors
 * await expectHookToThrow(
 *   () => result.current.deleteHousehold('non-existent-id'),
 *   /Household not found/
 * );
 * 
 * // Test network errors
 * const { result } = renderHook(() => useProfile());
 * 
 * // Mock network failure
 * jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
 * 
 * await expectHookToThrow(
 *   () => result.current.updateProfile({ name: 'New Name' }),
 *   'Network error'
 * );
 * ```
 */
export const expectHookToThrow = async <T,>(
  hookAction: () => Promise<T>,
  expectedError: any
) => {
  await expect(hookAction()).rejects.toThrow(expectedError);
};