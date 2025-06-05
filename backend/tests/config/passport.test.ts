import type { Request } from 'express';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { jwtVerifyCallback, localVerifyFn, jwtFromRequest, type JwtPayload } from '../../src/config/passport';
import { User } from '../../src/models/user';
import { login } from '../../src/services/auth';
import type { UserDocument, SafeUser } from '../../src/types/user';

// Mock dependencies
vi.mock('../../src/models/user');
vi.mock('../../src/services/auth');

describe('Passport Strategy Callbacks', () => {
  const mockDone = vi.fn();
  const mockUser = {
    _id: 'user-123',
    email: 'test@example.com',
    toSafeObject: vi.fn().mockReturnValue({
      id: 'user-123',
      email: 'test@example.com',
    } as SafeUser),
  } as unknown as UserDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('jwtFromRequest', () => {
    it('should extract JWT from cookies', () => {
      const mockReq = {
        cookies: { jwt: 'test-token' },
      } as Request;

      const result = jwtFromRequest(mockReq);
      expect(result).toBe('test-token');
    });

    it('should return null when no cookies', () => {
      const mockReq = {} as Request;
      const result = jwtFromRequest(mockReq);
      expect(result).toBeNull();
    });

    it('should return null when no jwt cookie', () => {
      const mockReq = {
        cookies: { other: 'value' },
      } as Request;

      const result = jwtFromRequest(mockReq);
      expect(result).toBeNull();
    });
  });

  describe('jwtVerifyCallback', () => {
    const validPayload: JwtPayload = {
      id: 'user-123',
      email: 'test@example.com',
      expiration: Date.now() + 3600000, // 1 hour from now
    };

    it('should call done with false when no payload', async () => {
      await jwtVerifyCallback(null, mockDone);

      expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'No JWT payload' });
    });

    it('should call done with false when token is expired', async () => {
      const expiredPayload: JwtPayload = {
        ...validPayload,
        expiration: Date.now() - 1000, // 1 second ago
      };

      await jwtVerifyCallback(expiredPayload, mockDone);

      expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'Token expired' });
    });

    it('should call done with false when user not found', async () => {
      vi.mocked(User.findById).mockResolvedValue(null);

      await jwtVerifyCallback(validPayload, mockDone);

      expect(User.findById).toHaveBeenCalledWith('user-123');
      expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'User not found' });
    });

    it('should call done with user when authentication succeeds', async () => {
      vi.mocked(User.findById).mockResolvedValue(mockUser);

      await jwtVerifyCallback(validPayload, mockDone);

      expect(User.findById).toHaveBeenCalledWith('user-123');
      expect(mockUser.toSafeObject).toHaveBeenCalled();
      expect(mockDone).toHaveBeenCalledWith(null, {
        id: 'user-123',
        email: 'test@example.com',
      });
    });

    it('should call done with error when database throws', async () => {
      const dbError = new Error('Database connection failed');
      vi.mocked(User.findById).mockRejectedValue(dbError);

      await jwtVerifyCallback(validPayload, mockDone);

      expect(mockDone).toHaveBeenCalledWith(dbError, false);
    });

    it('should handle edge case with exactly expired token', async () => {
      const exactlyExpiredPayload: JwtPayload = {
        ...validPayload,
        expiration: Date.now(), // Exactly now
      };

      // Advance time by 1ms to make it expired
      vi.advanceTimersByTime(1);

      await jwtVerifyCallback(exactlyExpiredPayload, mockDone);

      expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'Token expired' });
    });
  });

  describe('localVerifyFn', () => {
    const mockLoginResult = {
      id: 'user-123',
      email: 'test@example.com',
    } as SafeUser;

    it('should call done with user when login succeeds', async () => {
      vi.mocked(login).mockResolvedValue({ user: mockLoginResult });

      await localVerifyFn('test@example.com', 'password123', mockDone);

      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockDone).toHaveBeenCalledWith(null, mockLoginResult);
    });

    it('should call done with false when login fails', async () => {
      vi.mocked(login).mockRejectedValue(new Error('Invalid credentials'));

      await localVerifyFn('test@example.com', 'wrongpassword', mockDone);

      expect(login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'Invalid credentials' });
    });

    it('should handle login service throwing non-credential errors', async () => {
      vi.mocked(login).mockRejectedValue(new Error('Database connection failed'));

      await localVerifyFn('test@example.com', 'password123', mockDone);

      expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'Invalid credentials' });
    });

    it('should handle empty email and password', async () => {
      vi.mocked(login).mockRejectedValue(new Error('Email required'));

      await localVerifyFn('', '', mockDone);

      expect(login).toHaveBeenCalledWith('', '');
      expect(mockDone).toHaveBeenCalledWith(null, false, { message: 'Invalid credentials' });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle User.findById returning different user types', async () => {
      const userWithoutToSafeObject = {
        _id: 'user-123',
        email: 'test@example.com',
      } as unknown as UserDocument;

      vi.mocked(User.findById).mockResolvedValue(userWithoutToSafeObject);

      const validPayload: JwtPayload = {
        id: 'user-123',
        email: 'test@example.com',
        expiration: Date.now() + 3600000,
      };

      await jwtVerifyCallback(validPayload, mockDone);

      // Should call done with error when toSafeObject fails
      expect(mockDone).toHaveBeenCalledWith(expect.any(Error), false);

      // Verify the error is a TypeError about missing method
      const [error] = mockDone.mock.calls[0];
      expect(error).toBeInstanceOf(TypeError);
    });

    it('should handle malformed JWT payload', async () => {
      const malformedPayload = {
        // Missing required fields
        email: 'test@example.com',
      } as unknown as JwtPayload;

      await jwtVerifyCallback(malformedPayload, mockDone);

      // Should handle missing id gracefully
      expect(User.findById).toHaveBeenCalledWith(undefined);
    });
  });
});
