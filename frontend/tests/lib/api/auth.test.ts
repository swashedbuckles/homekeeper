import fetchMock from '@fetch-mock/vitest';
import { beforeEach, describe, expect, it } from 'vitest';
import { login, register, logout, getProfile } from '../../../src/lib/api/auth';
import { ApiError } from '../../../src/lib/types/apiError';
import { createMockUser } from '../../helpers/testUtils';
import { 
  mockApiSuccess, 
  mockApiError, 
  mockNetworkError,
  expectApiError,
  expectNetworkError,
  expectLastCallToHaveMethod,
  expectLastCallToHaveBody,
  mockApiCreated
} from '../../helpers/apiTestHelpers';

describe('auth API', () => {
  beforeEach(() => {
    fetchMock.clearHistory();
    fetchMock.mockGlobal();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = createMockUser();
      mockApiSuccess('/auth/login', mockUser, 'Login successful');

      const result = await login('test@example.com', 'password123');
      expect(result.data).toEqual(mockUser);
      
      expectLastCallToHaveMethod('post');
      expectLastCallToHaveBody({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    const loginErrorTests = [
      {
        name: 'should throw ApiError for invalid credentials',
        statusCode: 401,
        errorMessage: 'Invalid credentials',
        credentials: { email: 'wrong@example.com', password: 'wrongpass' }
      },
      {
        name: 'should handle server errors during login',
        statusCode: 500,
        errorMessage: 'Internal server error',
        credentials: { email: 'test@example.com', password: 'password' }
      }
    ];

    loginErrorTests.forEach(({ name, statusCode, errorMessage, credentials }) => {
      it(name, async () => {
        mockApiError('/auth/login', statusCode, errorMessage);
        
        await expectApiError(
          () => login(credentials.email, credentials.password),
          statusCode,
          errorMessage
        );
      });
    });

    it('should handle Network Errors during login', async () => {
      mockNetworkError('/auth/login', 'Network Error');
      
      await expectNetworkError(
        () => login('test@example.com', 'password'),
        'Network Error'
      );
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = createMockUser({ 
        email: 'newuser@example.com', 
        name: 'New User' 
      });
      
      mockApiCreated('/auth/register', mockUser, 'Registration successful');

      const result = await register('newuser@example.com', 'password123', 'New User');
      expect(result.data).toEqual(mockUser);
      
      expectLastCallToHaveMethod('post');
      expectLastCallToHaveBody({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      });
    });

    const registerErrorTests = [
      {
        name: 'should throw ApiError for duplicate email',
        statusCode: 409,
        errorMessage: 'Email already exists',
        userData: { email: 'existing@example.com', password: 'password', name: 'User' }
      },
      {
        name: 'should throw ApiError for validation errors',
        statusCode: 400,
        errorMessage: 'Password too weak',
        userData: { email: 'test@example.com', password: '123', name: 'User' }
      }
    ];

    registerErrorTests.forEach(({ name, statusCode, errorMessage, userData }) => {
      it(name, async () => {
        mockApiError('/auth/register', statusCode, errorMessage);
        
        await expectApiError(
          () => register(userData.email, userData.password, userData.name),
          statusCode,
          errorMessage
        );
      });
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      mockApiSuccess('/auth/logout', {}, 'Logout successful');

      await expect(logout()).resolves.not.toThrow();
      expectLastCallToHaveMethod('post');
    });

    const logoutErrorTests = [
      {
        name: 'should handle logout when not logged in',
        statusCode: 401,
        errorMessage: 'Not authenticated'
      },
      {
        name: 'should handle server errors during logout',
        statusCode: 500,
        errorMessage: 'Server error'
      }
    ];

    logoutErrorTests.forEach(({ name, statusCode, errorMessage }) => {
      it(name, async () => {
        mockApiError('/auth/logout', statusCode, errorMessage);
        await expect(logout()).rejects.toThrow(ApiError);
      });
    });
  });

  describe('getProfile', () => {
    it('should successfully get user profile', async () => {
      const mockUser = createMockUser();
      mockApiSuccess('/auth/whoami', mockUser);

      const result = await getProfile();
      expect(result.data).toEqual(mockUser);
      expectLastCallToHaveMethod('get');
    });

    it('should throw ApiError when not authenticated', async () => {
      fetchMock.mockReset();
      fetchMock.route({
        url: 'path:/auth/whoami',
        allowRelativeUrls: true,
        response: {
          status: 401,
          body: { error: 'Not authenticated' }
        }
      });

      fetchMock.route({
        url: 'path:/auth/refresh',
        response: {
          status: 205,
        }
      });

      await expect(getProfile()).rejects.toThrow(ApiError);
      
      try {
        await getProfile();
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(205);
      }
    });

    const profileErrorTests = [
      {
        name: 'should handle server errors when getting profile',
        statusCode: 500,
        errorMessage: 'Internal server error'
      }
    ];

    profileErrorTests.forEach(({ name, statusCode, errorMessage }) => {
      it(name, async () => {
        mockApiError('/auth/whoami', statusCode, errorMessage);
        await expect(getProfile()).rejects.toThrow(ApiError);
      });
    });

    it('should handle Network Errors when getting profile', async () => {
      mockNetworkError('/auth/whoami', 'Network Error');
      await expectNetworkError(() => getProfile(), 'Network Error');
    });
  });

  describe('request headers and options', () => {
    const headerTests = [
      {
        name: 'should include proper content-type for POST requests',
        apiCall: () => login('test@example.com', 'password'),
        mockEndpoint: '/auth/login',
        expectedHeader: 'content-type',
        expectedValue: 'application/json'
      },
      {
        name: 'should include credentials for all requests',
        apiCall: () => getProfile(),
        mockEndpoint: '/auth/whoami',
        expectedOption: 'credentials',
        expectedValue: 'include'
      }
    ];

    headerTests.forEach(({ name, apiCall, mockEndpoint, expectedHeader, expectedOption, expectedValue }) => {
      it(name, async () => {
        mockApiSuccess(mockEndpoint, {});
        await apiCall();

        const lastCall = fetchMock.callHistory.lastCall();
        if (expectedHeader) {
          const headers = lastCall?.options.headers as Record<string, string>;
          expect(headers?.[expectedHeader]).toBe(expectedValue);
        }
        if (expectedOption) {
          expect(lastCall?.options[expectedOption as keyof RequestInit]).toBe(expectedValue);
        }
      });
    });
  });
});