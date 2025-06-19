import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import supertest from 'supertest';
import { vi } from 'vitest';

import { CSRF_COOKIE_NAME, JWT_COOKIE_NAME } from '../../src/constants';
import { createApp } from '../../src/index';
import type { RegistrationParams } from '../../src/services/auth';
import type { SafeUser } from '../../src/models/user';

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
  vi.mocked(passport.authenticate).mockImplementation((_strategy, _options, callback) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
      if (user) {
        req.user = user;
        callback?.(null, user);
      } else {
        callback?.(null, null);
      }
      next();
    };
  });
};

// Helper to mock authentication error
export const mockAuthenticationError = (error: Error) => {
  vi.mocked(passport.authenticate).mockImplementation((_strategy, _options, callback) => {
    return (_req: Request, _res: Response, next: NextFunction): void => {
      callback?.(error, null);
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
  await request.post('/auth/login').set('Cookie', [`${[CSRF_COOKIE_NAME]}=1234`]).set('x-csrf-token', '1234').send({ email, password });

/**
 * Test helper to register a user
 *
 * @param userData email/name/password
 * @returns Test Response
 */
export const registerUser = async (userData: RegistrationParams): Promise<TestRes> =>
  await request.post('/auth/register').set('Cookie', [`${[CSRF_COOKIE_NAME]}=1234`]).set('x-csrf-token', '1234').send(userData);

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

  const jwtCookie = setCookieHeader.find((cookie) => cookie.startsWith(`${JWT_COOKIE_NAME}=`));
  return jwtCookie?.split(';')[0];
};
