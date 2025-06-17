// =============================================================================
// PASSPORT MOCKING UTILITIES
// =============================================================================

import passport from 'passport';
import { vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { SafeUser } from '@homekeeper/shared';

/**
 * Mock passport.authenticate for successful authentication
 * Sets req.user and calls next()
 */
export const mockPassportSuccess = (user: SafeUser | null = null) => {
  vi.mocked(passport.authenticate).mockImplementation(() => {
    return (req: Request, res: Response, next: NextFunction): void => {
      // This mimics your actual requireAuth middleware logic
      const callback = (err: unknown, authUser?: SafeUser, info?: { message: string }) => {
        if (err) {
          return res.status(500).json({ error: 'Authentication Error' });
        }
        
        if (!authUser) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: info?.message || 'Authentication required'
          });
        }
        
        req.user = authUser;
        next();
      };
      
      // Call the callback with our mock data - no error, return the user
      callback(null, user || undefined);
    };
  });
};

/**
 * Mock passport.authenticate for authentication errors
 * Calls the error callback to trigger your actual error handling logic
 */
export const mockPassportError = (error: Error) => {
  vi.mocked(passport.authenticate).mockImplementation(() => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const callback = (err: unknown, authUser?: SafeUser, info?: { message: string }) => {
        if (err) {
          return res.status(500).json({ error: 'Authentication Error' });
        }
        
        if (!authUser) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: info?.message || 'Authentication required'
          });
        }
        
        req.user = authUser;
        next();
      };
      
      // Call the callback with an error to trigger your error handling
      callback(error);
    };
  });
};

/**
 * Mock passport.authenticate for failed authentication (no user)
 * Triggers the "no user" path in your middleware
 */
export const mockPassportNoUser = (message = 'Invalid credentials') => {
  vi.mocked(passport.authenticate).mockImplementation(() => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const callback = (err: unknown, authUser?: SafeUser, info?: { message: string }) => {
        if (err) {
          return res.status(500).json({ error: 'Authentication Error' });
        }
        
        if (!authUser) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: info?.message || 'Authentication required'
          });
        }
        
        req.user = authUser;
        next();
      };
      
      // Call the callback with no error but no user (failed auth)
      callback(null, undefined, { message });
    };
  });
};