export const AuthStatus = {
  UNKNOWN:     'UNKNOWN',       // Initial app load, error state
  CHECKING:    'CHECKING',      // Checking if user is logged in
  LOGGING_IN:  'LOGGING_IN',    // Login form submitted, waiting for response
  LOGGING_OUT: 'LOGGING_OUT',   // Logout initiated, clearing session
  LOGGED_IN:   'LOGGED_IN',     // User is authenticated
  LOGGED_OUT:  'LOGGED_OUT',    // User is not authenticated (incl. errors0)
} as const;

export type AuthStatusType = (typeof AuthStatus)[keyof typeof AuthStatus];
export const authIsLoading = (status: AuthStatusType) => status === AuthStatus.LOGGING_IN || status === AuthStatus.LOGGING_OUT || status === AuthStatus.CHECKING;
export const authIsKnown   = (status: AuthStatusType) => status === AuthStatus.LOGGED_IN || status === AuthStatus.LOGGED_OUT;
