import type { SafeUser } from './user';

/**
 * Patch the Express Request object so that we know about our User data
 */
declare global {
  // biome-ignore lint/style/noNamespace: patching express type
  namespace Express {
    /**
     * Express Request Object
     */
    interface Request {
      user?: SafeUser;
    }
  }
}
