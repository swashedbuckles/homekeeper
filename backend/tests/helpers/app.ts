import supertest from 'supertest';

import { createApp } from '../../src/index';
import { RegistrationParams } from '../../src/services/authentication';

export const app = createApp();
export const request = supertest(app);

type TestRes = supertest.Test;

/**
 * Test helper to login the user
 * @param email email address
 * @param password password
 * @returns Test Response
 */
export const loginUser = async (email: string, password: string): Promise<TestRes> =>
  await request.post('/auth/login').send({ email, password });

/**
 * Test helper to register a user
 * @param userData email/name/password
 * @returns Test Response
 */
export const registerUser = async (userData: RegistrationParams): Promise<TestRes> =>
  await request.post('/auth/register').send(userData);

/**
 * Test helper to get the authentication cookie
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

type HttpVerbs = 'get' | 'post' | 'put' | 'delete';
/**
 * Make an authenticated request against SuperTest to help with testing
 *
 * @param method HTTP method
 * @param url location
 * @param authCookie jwt authentication cookie
 * @returns Authenticated request for testing
 */
export const makeAuthenticatedRequest = (method: HttpVerbs, url: string, authCookie: string): TestRes => {
  return request[method](url).set('Cookie', [authCookie]);
};
