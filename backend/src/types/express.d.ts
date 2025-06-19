import { HouseholdDocument } from '../models/household';
import type { SafeUser } from '../models/user';
import type { ApiResponse } from '@homekeeper/shared';

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
      household?: HouseholdDocument
    }
  }
}

// This export makes it a module and ensures the declarations are processed
export {};