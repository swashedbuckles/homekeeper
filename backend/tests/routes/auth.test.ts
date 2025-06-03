import { describe, it, expect, beforeEach, vi } from 'vitest';

import { register, login } from '../../src/services/authentication';
import { SafeUser } from '../../src/types/user';
import { request, loginUser, registerUser, getAuthCookie, mockAuthenticatedUser } from '../helpers/app';

// Mock the authentication service
vi.mock('../../src/services/authentication');

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should return 400 for invalid email', async () => {
      const response = await request.post('/auth/login').send({ email: 'invalid-email', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 401 for invalid credentials', async () => {
      vi.mocked(login).mockRejectedValue(new Error('Invalid credentials'));

      const response = await loginUser('test@example.com', 'wrongpassword');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should return 200 with JWT cookie on success', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com', name: 'Test User' } as SafeUser;
      vi.mocked(login).mockResolvedValue({ user: mockUser });

      const response = await loginUser('test@example.com', 'password123');

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUser);

      const authCookie = getAuthCookie(response);
      expect(authCookie).toBeDefined();
      expect(authCookie).toMatch(/^jwt=.+/);
    });
  });

  describe('POST /auth/register', () => {
    it('should return 201 on successful registration', async () => {
      const mockUser = { id: 'user-123', email: 'new@example.com', name: 'New User' } as SafeUser;
      vi.mocked(register).mockResolvedValue({ user: mockUser });

      const response = await registerUser({
        email: 'new@example.com',
        password: 'Password123!',
        name: 'New User',
      });

      expect(response.status).toBe(201);
      expect(response.body.user).toEqual(mockUser);
    });

    it('should return 409 for existing user', async () => {
      vi.mocked(register).mockRejectedValue(new Error('User already exists'));

      const response = await registerUser({
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Existing User',
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('GET /auth/logout', () => {
    it('should clear JWT cookie when present', async () => {
      const response = await request.get('/auth/logout').set('Cookie', ['jwt=some-token']);

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

      // Mock the user as authenticated
      mockAuthenticatedUser(mockUser);

      const response = await request.get('/auth/whoami');

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUser);
    });

    it('should return 204 if not logged in', async () => {
      const response = await request.get('/auth/whoami/').send();
      expect(response.status).toBe(204);
    });
  });
});
