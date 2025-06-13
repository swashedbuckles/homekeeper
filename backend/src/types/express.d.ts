import type { SafeUser } from './user';
import type { ApiResponse } from '@homekeeper/shared';

console.log('hey??');
/**
 * Patch the Express Request object so that we know about our User data
 */
declare global {
  namespace Express {
    interface Response {
      apiSuccess<T>(data: ApiResponse<T>): this;
      apiError(statusCode: number, error: string): this;
    }
    
    interface Request {
      user?: SafeUser;
    }
  }
}

// This export makes it a module and ensures the declarations are processed
export {};