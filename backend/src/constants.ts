/**
 * Application constants
 */

export const HOUSEHOLD_ROLES = ['owner', 'admin', 'member', 'guest'];

// Authentication & JWT
export const JWT_REFRESH_EXPIRE_TIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const JWT_EXPIRE_TIME_MS = 10 * 60 * 1000; // 10 minutes
export const JWT_SECRET = process.env.JWT_SECRET ?? 'DEV_JWT_SECRET';
export const JWT_COOKIE_NAME = 'jwt';
export const REFRESH_COOKIE_NAME = 'refresh';

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 5;

// Password hashing
export const BCRYPT_SALT_ROUNDS = 12;

// CSRF token
export const CSRF_TOKEN_BYTES = 32;
export const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];
export const CSRF_COOKIE_NAME = 'csrfToken';

// Server configuration
export const DEFAULT_PORT = 4000;
export const DEV_FRONTEND = 'http://localhost:3000';

// Response messages
export const RESPONSE_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'Registration successful.',
  LOGOUT_SUCCESS: 'You have logged out',
  SERVER_RUNNING: 'Server is running',
  API_RUNNING: 'API server is running',
  PROTECTED_ROUTE_WELCOME: 'Welcome to the protected route!',
  REFRESHED: 'Token refresh successful',
} as const;

export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Invalid input',
  INVALID_CREDENTIALS: 'Invalid credentials',
  AUTHENTICATION_ERROR: 'Authentication error',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  UNAUTHORIZED: 'Unauthorized',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  FORBIDDEN: 'Forbidden',
  NO_JWT_PAYLOAD: 'No JWT payload',
  TOKEN_EXPIRED: 'Token expired',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_CURRENT_PASSWORD: 'Invalid current password',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  RESET_CONTENT: 205,
  NOT_ACCEPTABLE: 406,
} as const;
