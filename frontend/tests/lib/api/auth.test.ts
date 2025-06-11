import { beforeEach, describe, expect, it } from 'vitest';
import fetchMock from '@fetch-mock/vitest';
import { login, register, logout, getProfile } from '../../../src/lib/api/auth';
import { ApiError } from '../../../src/lib/types/apiError';
import { createMockUser } from '../../helpers/testUtils';

describe('auth API', () => {
  beforeEach(() => {
    fetchMock.clearHistory();
    fetchMock.mockGlobal();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = createMockUser();
      fetchMock.route({
        url: 'path:/auth/login',
        allowRelativeUrls: true,
        response: { data: mockUser, message: 'Login successful' }
      });

      const result = await login('test@example.com', 'password123');
      expect(result.data).toEqual(mockUser);

      const lastCall = fetchMock.callHistory.lastCall();
      expect(lastCall?.options.method).toEqual('post');
      expect(JSON.parse(lastCall?.options.body as string)).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw ApiError for invalid credentials', async () => {
      fetchMock.route({
        url: 'path:/auth/login',
        allowRelativeUrls: true,
        response: {
          status: 401,
          body: { error: 'Invalid credentials' }
        }
      });

      await expect(login('wrong@example.com', 'wrongpass')).rejects.toThrow(ApiError);
      
      try {
        await login('wrong@example.com', 'wrongpass');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(401);
        expect((error as ApiError).message).toBe('Invalid credentials');
      }
    });

    it('should handle server errors during login', async () => {
      fetchMock.route({
        url: 'path:/auth/login',
        allowRelativeUrls: true,
        response: {
          status: 500,
          body: { error: 'Internal server error' }
        }
      });

      await expect(login('test@example.com', 'password')).rejects.toThrow(ApiError);
    });

    it('should handle Network Errors during login', async () => {
      fetchMock.route({
        url: 'path:/auth/login',
        allowRelativeUrls: true,
        response: Promise.reject(new Error('Network Error'))
      });

      await expect(login('test@example.com', 'password')).rejects.toThrow('Network Error');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = createMockUser({ 
        email: 'newuser@example.com', 
        name: 'New User' 
      });
      
      fetchMock.route({
        url: 'path:/auth/register',
        allowRelativeUrls: true,
        response: {
          status: 201,
          body: { data: mockUser, message: 'Registration successful' }
        }
      });

      const result = await register('newuser@example.com', 'password123', 'New User');

      expect(result.data).toEqual(mockUser);
      
      const lastCall = fetchMock.callHistory.lastCall();
      expect(lastCall?.options.method).toEqual('post');
      expect(JSON.parse(lastCall?.options.body as string)).toEqual({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      });
    });

    it('should throw ApiError for duplicate email', async () => {
      fetchMock.route({
        url: 'path:/auth/register',
        allowRelativeUrls: true,
        response: {
          status: 409,
          body: { error: 'Email already exists' }
        }
      });

      await expect(register('existing@example.com', 'password', 'User')).rejects.toThrow(ApiError);
    });

    it('should throw ApiError for validation errors', async () => {
      fetchMock.route({
        url: 'path:/auth/register',
        allowRelativeUrls: true,
        response: {
          status: 400,
          body: { error: 'Password too weak' }
        }
      });

      await expect(register('test@example.com', '123', 'User')).rejects.toThrow(ApiError);
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      fetchMock.route({
        url: 'path:/auth/logout',
        allowRelativeUrls: true,
        response: { message: 'Logout successful' }
      });

      await expect(logout()).resolves.not.toThrow();
      
      const lastCall = fetchMock.callHistory.lastCall();
      expect(lastCall?.options.method).toEqual('post');
    });

    it('should handle logout when not logged in', async () => {
      fetchMock.route({
        url: 'path:/auth/logout',
        allowRelativeUrls: true,
        response: {
          status: 401,
          body: { error: 'Not authenticated' }
        }
      });

      await expect(logout()).rejects.toThrow(ApiError);
    });

    it('should handle server errors during logout', async () => {
      fetchMock.route({
        url: 'path:/auth/logout',
        allowRelativeUrls: true,
        response: {
          status: 500,
          body: { error: 'Server error' }
        }
      });

      await expect(logout()).rejects.toThrow(ApiError);
    });
  });

  describe('getProfile', () => {
    it('should successfully get user profile', async () => {
      const mockUser = createMockUser();
      fetchMock.route({
        url: 'path:/auth/whoami',
        allowRelativeUrls: true,
        response: { data: mockUser }
      });

      const result = await getProfile();

      expect(result.data).toEqual(mockUser);
      
      const lastCall = fetchMock.callHistory.lastCall();
      expect(lastCall?.options.method).toEqual('get');
    });

    it('should throw ApiError when not authenticated', async () => {
      fetchMock.route({
        url: 'path:/auth/whoami',
        allowRelativeUrls: true,
        response: {
          status: 401,
          body: { error: 'Not authenticated' }
        }
      });

      await expect(getProfile()).rejects.toThrow(ApiError);
      
      try {
        await getProfile();
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(401);
      }
    });

    it('should handle server errors when getting profile', async () => {
      fetchMock.route({
        url: 'path:/auth/whoami',
        allowRelativeUrls: true,
        response: {
          status: 500,
          body: { error: 'Internal server error' }
        }
      });

      await expect(getProfile()).rejects.toThrow(ApiError);
    });

    it('should handle Network Errors when getting profile', async () => {
      fetchMock.route({
        url: 'path:/auth/whoami',
        allowRelativeUrls: true,
        response: Promise.reject(new Error('Network Error'))
      });

      await expect(getProfile()).rejects.toThrow('Network Error');
    });
  });

  describe('request headers and options', () => {
    it('should include proper content-type for POST requests', async () => {
      fetchMock.route({
        url: 'path:/auth/login',
        allowRelativeUrls: true,
        response: {}
      });

      await login('test@example.com', 'password');

      const lastCall = fetchMock.callHistory.lastCall();
      const headers = lastCall?.options.headers as Record<string, string>;
      expect(headers?.['content-type']).toBe('application/json');
    });

    it('should include credentials for all requests', async () => {
      fetchMock.route({
        url: 'path:/auth/whoami',
        allowRelativeUrls: true,
        response: {}
      });

      await getProfile();

      const lastCall = fetchMock.callHistory.lastCall();
      expect(lastCall?.options.credentials).toBe('include');
    });
  });
});