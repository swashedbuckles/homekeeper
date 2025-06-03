import { SafeUser } from './user';

/**
 * Patch the Express Request object so that we know about our User data
 */
declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}
