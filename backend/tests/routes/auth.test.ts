/** @TODO split tests up into individual controllers */
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { login, register } from '../../src/services/auth';
import type { SafeUser } from '../../src/types/user';
import {
  getAuthCookie,
  loginUser,
  mockAuthenticatedUser,
  mockAuthenticationError,
  registerUser,
  request,
} from '../helpers/app';
import { CSRF_COOKIE_NAME } from '../../src/constants';
import type { NextFunction } from 'express';

vi.mock('../../src/services/auth');
vi.mock('passport', () => ({
  default: {
    authenticate: vi.fn(),
    initialize: vi.fn(() => (_req: Request, _res: Response, next: NextFunction) => next()),
    use: vi.fn(),
  },
}));

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.doUnmock('passport');
  });

  describe('POST /auth/login', () => {
    it('should return 400 for invalid email', async () => {

      const response = await request
        .post('/auth/login')
        .set('Cookie', [`${[CSRF_COOKIE_NAME]}=1234`])
        .set('x-csrf-token', '1234')
        .send({ email: 'invalid-email', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 401 for invalid credentials', async () => {
      vi.mocked(login).mockRejectedValue(new Error('Invalid credentials'));

      const response = await loginUser('test@example.com', 'wrongpassword');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 200 with JWT cookie on success', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      } as SafeUser;
      vi.mocked(login).mockResolvedValue({ user: mockUser });

      const response = await loginUser('test@example.com', 'password123');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUser);

      const authCookie = getAuthCookie(response);
      expect(authCookie).toBeDefined();
      expect(authCookie).toMatch(/^jwt=.+/);
    });
  });

  describe('POST /auth/register', () => {
    it('should return 201 on successful registration', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'new@example.com',
        name: 'New User',
      } as SafeUser;
      vi.mocked(register).mockResolvedValue({ user: mockUser });

      const response = await registerUser({
        email: 'new@example.com',
        password: 'Password123!',
        name: 'New User',
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockUser);
    });

    it('should obfuscate if user exists', async () => {
      vi.mocked(register).mockRejectedValue(new Error('User already exists'));

      const response = await registerUser({
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Existing User',
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Registration successful.');
    });
  });

  describe('POST /auth/logout', () => {
    it('should clear JWT cookie when present', async () => {
      const response = await request
        .post('/auth/logout')
        .set('Cookie', ['jwt=some-token'])
        .set('Cookie', [`${[CSRF_COOKIE_NAME]}=1234`])
        .set('x-csrf-token', '1234');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('You have logged out');
    });
  });

  describe('GET /auth/whoami', () => {
    beforeEach(() => {
      mockAuthenticatedUser(null);
    });

    it('should return a user if logged in', async () => {
      const mockUser: SafeUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      } as SafeUser;

      mockAuthenticatedUser(mockUser);

      const response = await request.get('/auth/whoami');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUser);
    });

    it('should return 204 if not logged in', async () => {
      const response = await request.get('/auth/whoami/').send();
      expect(response.status).toBe(204);
    });
  });

  describe('GET /auth/csrf-token', () => {
    it('should return CSRF token and set cookie for anonymous users', async () => {
      mockAuthenticatedUser(null);

      const response = await request.get('/auth/csrf-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('csrfToken');
      expect(response.body.csrfToken).toMatch(/^[a-f0-9]{64}$/);

      const setCookieHeader = response.get('Set-Cookie');
      expect(setCookieHeader).toBeDefined();

      const csrfCookie = setCookieHeader?.find((cookie) => cookie.startsWith('csrfToken='));
      expect(csrfCookie).toBeDefined();
      expect(csrfCookie).toContain(`csrfToken=${response.body.csrfToken}`);
      expect(csrfCookie).toContain('SameSite=Strict');
    });

    it('should return CSRF token and set cookie for authenticated users', async () => {
      const mockUser: SafeUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      } as SafeUser;

      mockAuthenticatedUser(mockUser);

      const response = await request.get('/auth/csrf-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('csrfToken');
      expect(response.body.csrfToken).toMatch(/^[a-f0-9]{64}$/);

      const setCookieHeader = response.get('Set-Cookie');
      expect(setCookieHeader).toBeDefined();

      const csrfCookie = setCookieHeader?.find((cookie) => cookie.startsWith('csrfToken='));
      expect(csrfCookie).toBeDefined();
      expect(csrfCookie).toContain(`csrfToken=${response.body.csrfToken}`);
    });

    it('should generate unique tokens on multiple requests', async () => {
      mockAuthenticatedUser(null);

      const response1 = await request.get('/auth/csrf-token');
      const response2 = await request.get('/auth/csrf-token');

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body.csrfToken).not.toBe(response2.body.csrfToken);
      expect(response1.body.csrfToken).toMatch(/^[a-f0-9]{64}$/);
      expect(response2.body.csrfToken).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should set cookie with correct security attributes in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      mockAuthenticatedUser(null);

      const response = await request.get('/auth/csrf-token');

      expect(response.status).toBe(200);

      const setCookieHeader = response.get('Set-Cookie');
      const csrfCookie = setCookieHeader?.find((cookie) => cookie.startsWith('csrfToken='));

      expect(csrfCookie).toContain('Secure');
      expect(csrfCookie).toContain('SameSite=Strict');

      process.env.NODE_ENV = originalEnv;
    });

    it('should set cookie without Secure flag in development', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      mockAuthenticatedUser(null);

      const response = await request.get('/auth/csrf-token');

      expect(response.status).toBe(200);

      const setCookieHeader = response.get('Set-Cookie');
      const csrfCookie = setCookieHeader?.find((cookie) => cookie.startsWith('csrfToken='));

      expect(csrfCookie).not.toContain('Secure');
      expect(csrfCookie).toContain('SameSite=Strict');

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle authentication errors gracefully', async () => {
      mockAuthenticationError(new Error('Token validation failed'));

      const response = await request.get('/auth/csrf-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('csrfToken');
      expect(response.body.csrfToken).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should return valid JSON response format', async () => {
      mockAuthenticatedUser(null);

      const response = await request.get('/auth/csrf-token');

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.body).toEqual({
        csrfToken: expect.stringMatching(/^[a-f0-9]{64}$/),
      });
    });

    it('should work with existing cookies', async () => {
      mockAuthenticatedUser(null);

      const response = await request
        .get('/auth/csrf-token')
        .set('Cookie', ['existingCookie=value', 'anotherCookie=anotherValue']);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('csrfToken');

      const setCookieHeader = response.get('Set-Cookie');
      const csrfCookie = setCookieHeader?.find((cookie) => cookie.startsWith('csrfToken='));
      expect(csrfCookie).toBeDefined();
    });
  });
});
