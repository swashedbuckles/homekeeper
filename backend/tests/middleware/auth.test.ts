/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';

import { requireAuth, optionalAuth } from '../../src/middleware/auth';
import type { SafeUser } from '../../src/types/user';

vi.mock('passport', () => ({
  default: {
    authenticate: vi.fn(),
  },
}));

describe('Authentication Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: typeof vi.fn;
  let mockPassportAuthenticate: MockedFunction<typeof passport.authenticate>;

  const mockUser: Partial<SafeUser> = {
    id: 'user-123',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      user: undefined,
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();

    mockPassportAuthenticate = passport.authenticate as MockedFunction<typeof passport.authenticate>;
  });

  describe('requireAuth', () => {
    it('should call passport.authenticate with correct parameters', () => {
      const mockAuthFunction = vi.fn();
      mockPassportAuthenticate.mockReturnValue(mockAuthFunction);

      requireAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockPassportAuthenticate).toHaveBeenCalledWith('jwt', { session: false }, expect.any(Function));
      expect(mockAuthFunction).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });

    it('should return 500 error when authentication throws an error', () => {
      const mockError = new Error('Database connection failed');

      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(mockError, null);
        };
      });

      requireAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Authentication error' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 error when user is not authenticated', () => {
      const mockInfo = { message: 'Token expired' };

      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(null, null, mockInfo);
        };
      });

      requireAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'Token expired',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 error with default message when info is not provided', () => {
      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(null, null);
        };
      });

      requireAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 error with default message when info.message is empty', () => {
      const mockInfo = { message: '' };

      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(null, null, mockInfo);
        };
      });

      requireAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should set user on request and call next when authentication succeeds', () => {
      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(null, mockUser);
        };
      });

      requireAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should handle falsy user values correctly', () => {
      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(null, undefined, { message: 'No token provided' });
        };
      });

      requireAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should call passport.authenticate with correct parameters', () => {
      const mockAuthFunction = vi.fn();
      mockPassportAuthenticate.mockReturnValue(mockAuthFunction);

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockPassportAuthenticate).toHaveBeenCalledWith('jwt', { session: false }, expect.any(Function));
      expect(mockAuthFunction).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });

    it('should set user on request and call next when authentication succeeds', () => {
      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(null, mockUser);
        };
      });

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should call next without setting user when authentication fails', () => {
      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(null, null);
        };
      });

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should call next without setting user when there is an error', () => {
      const mockError = new Error('JWT malformed');

      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(mockError, null);
        };
      });

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should not set user when user is falsy even without error', () => {
      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(null, undefined);
        };
      });

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should handle both error and user being falsy', () => {
      const mockError = new Error('Token validation failed');

      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(mockError, undefined);
        };
      });

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should set user even when there is a non-critical error with valid user', () => {
      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(null, mockUser);
        };
      });

      optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle request objects that already have a user', () => {
      const existingUser: Partial<SafeUser> = { id: 'existing-user', email: 'existing@example.com' };
      mockReq.user = existingUser;

      mockPassportAuthenticate.mockImplementation((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction): void => {
          callback!(null, mockUser);
        };
      });

      requireAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBe(mockUser);
      expect(mockReq.user).not.toBe(existingUser);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should handle passport authenticate returning a function that throws', () => {
      const thrownError = new Error('Passport internal error');

      mockPassportAuthenticate.mockImplementation(() => {
        return (): void => {
          throw thrownError;
        };
      });

      expect(() => {
        requireAuth(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow('Passport internal error');
    });
  });
});
