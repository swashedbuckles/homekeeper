export const AuthStatus = {
  CHECKING:    'CHECKING',      // Initial app load, checking if user is logged in
  LOGGING_IN:  'LOGGING_IN',    // Login form submitted, waiting for response
  LOGGING_OUT: 'LOGGING_OUT',   // Logout initiated, clearing session
  LOGGED_IN:   'LOGGED_IN',     // User is authenticated
  LOGGED_OUT:  'LOGGED_OUT',    // User is not authenticated (incl. errors0)
} as const;

export type AuthStatusType = (typeof AuthStatus)[keyof typeof AuthStatus];
export const authIsLoading = (status: AuthStatusType) => status === AuthStatus.LOGGING_IN || status === AuthStatus.LOGGING_OUT;
export const authIsKnown   = (status: AuthStatusType) => status !== AuthStatus.CHECKING;
