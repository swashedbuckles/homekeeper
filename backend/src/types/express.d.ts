import { SafeUser } from './user';

/**
 * Patch the Express Request object so that we know about our User data
 */
declare global {
  namespace Express {
    /**
     * Express Request Object
     */
    interface Request {
      user?: SafeUser;
    }
  }
}
