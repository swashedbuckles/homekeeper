import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import supertest from 'supertest';
import { vi } from 'vitest';

import { createApp } from '../../src/index';
import { RegistrationParams } from '../../src/services/authentication';
import type { SafeUser } from '../../src/types/user';

// Mock passport globally for tests
vi.mock('passport', () => ({
  default: {
    authenticate: vi.fn(),
    initialize: vi.fn(() => (req: Request, res: Response, next: NextFunction) => next()),
    use: vi.fn(),
  },
}));

export const app = createApp();
export const request = supertest(app);

/** Shorthand for SuperTest API Type */
type TestRes = supertest.Test;

/**
 * Mock out the auth middleware for unit tests
 *
 * @param user User or User-like object
 */
export const mockAuthenticatedUser = (user: SafeUser | null): void => {
  vi.mocked(passport.authenticate).mockImplementation((strategy, options, callback) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (user) {
        req.user = user;
        callback!(null, user);
      } else {
        callback!(null, null);
      }
      next();
    };
  });
};

// Helper to mock authentication error
export const mockAuthenticationError = (error: Error) => {
  vi.mocked(passport.authenticate).mockImplementation((strategy, options, callback) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      callback!(error, null);
      next();
    };
  });
};

/**
 * Test helper to login the user
 *
 * @param email email address
 * @param password password
 * @returns Test Response
 */
export const loginUser = async (email: string, password: string): Promise<TestRes> =>
  await request.post('/auth/login').send({ email, password });

/**
 * Test helper to register a user
 *
 * @param userData email/name/password
 * @returns Test Response
 */
export const registerUser = async (userData: RegistrationParams): Promise<TestRes> =>
  await request.post('/auth/register').send(userData);

/**
 * Test helper to get the authentication cookie
 *
 * @param response Test Response
 * @returns auth cookie (Jwt)
 */
export const getAuthCookie = (response: supertest.Response): string | undefined => {
  const setCookieHeader = response.get('Set-Cookie');
  if (!setCookieHeader) {
    return;
  }

  /** @todo extract cookie name to a common place */
  const jwtCookie = setCookieHeader.find((cookie) => cookie.startsWith('jwt='));
  return jwtCookie?.split(';')[0];
};
