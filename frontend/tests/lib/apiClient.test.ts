import fetchMock from '@fetch-mock/vitest';
import { beforeEach, describe, expect, it } from 'vitest';
import { apiRequest, API_BASE_URL, clearCsrfToken } from '../../src/lib/apiClient';
import { ApiError } from '../../src/lib/types/apiError';
import { createMockUser } from '../helpers/testUtils';
import { mockApiSuccess, mockApiError, expectApiError } from '../helpers/apiTestHelpers';

describe('apiClient', () => {
  beforeEach(() => {
    fetchMock.clearHistory();
    fetchMock.mockGlobal();
  });

  describe('apiRequest', () => {
    it('should make successful GET request with default options', async () => {
      const mockData = { id: '1', name: 'Test' };
      fetchMock.route({
        url: 'path:/test',
        allowRelativeUrls: true,
        response: { data: mockData }
      });

      const result = await apiRequest('/test');

      expect(result).toEqual({ data: mockData });

      const lastCall = fetchMock.callHistory.lastCall();
      expect(lastCall).toBeTruthy();
      expect(lastCall?.url).toBe(`${API_BASE_URL}/test`);
    });

    it('should include credentials in request', async () => {
      fetchMock.route({
        url: 'path:/test',
        allowRelativeUrls: true,
        response: {}
      });

      await apiRequest('/test');

      const lastCall = fetchMock.callHistory.lastCall();
      expect(lastCall?.options.credentials).toBe('include');
    });

    it('should merge custom options with defaults', async () => {
      fetchMock.route({
        url: 'path:/test',
        allowRelativeUrls: true,
        response: {}
      });
      fetchMock.route({
        url: 'path:/auth/csrf-token',
        response: {
          status: 200,
          body: {
            csrfToken: 'mock-csrf-token'
          }
        }
      });

      await apiRequest('/test', {
        method: 'POST',
        headers: { 'Custom-Header': 'value' },
      });

      const lastCall = fetchMock.callHistory.lastCall();
      const options = lastCall?.options;

      expect(options?.method).toBe('post');
      expect(options?.headers).toEqual(
        expect.objectContaining({
          'custom-header': 'value',
          'content-type': 'application/json',
        })
      );
      expect(options?.credentials).toBe('include');
    });

    it('should handle POST request with body', async () => {
      const requestBody = { email: 'test@example.com', password: 'password' };
      fetchMock.route({
        url: 'path:/login',
        allowRelativeUrls: true,
        response: { data: { user: 'mock-user' } }
      });
      fetchMock.route({
        url: 'path:/auth/csrf-token',
        response: {
          status: 200,
          body: {
            csrfToken: 'mock-csrf-token'
          }
        }
      });

      await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const lastCall = fetchMock.callHistory.lastCall();
      expect(lastCall?.options.body).toBe(JSON.stringify(requestBody));
      expect(lastCall?.options.method).toBe('post');
    });

    it('should handle response without data wrapper', async () => {
      const directData = { message: 'Success' };
      fetchMock.route({
        url: 'path:/direct',
        allowRelativeUrls: true,
        response: directData
      });

      const result = await apiRequest('/direct');
      expect(result).toEqual(directData);
    });

    describe('Error handling', () => {
      const errorScenarios = [
        {
          name: 'should throw ApiError for HTTP error status',
          endpoint: '/error',
          statusCode: 400,
          errorMessage: 'Bad Request',
          verifyDetails: true
        },
        {
          name: 'should throw ApiError for 500 server error',
          endpoint: '/server-error',
          statusCode: 500,
          errorMessage: 'Internal Server Error',
          verifyDetails: false
        }
      ];

      errorScenarios.forEach(({ name, endpoint, statusCode, errorMessage, verifyDetails }) => {
        it(name, async () => {
          mockApiError(endpoint, statusCode, errorMessage);

          await expectApiError(
            () => apiRequest(endpoint),
            statusCode,
            errorMessage
          );

          if (verifyDetails) {
            try {
              await apiRequest(endpoint);
            } catch (error) {
              expect(error).toBeInstanceOf(ApiError);
              expect((error as ApiError).statusCode).toBe(statusCode);
              expect((error as ApiError).message).toBe(errorMessage);
            }
          }
        });
      });

      it('should handle network errors', async () => {
        fetchMock.route({
          url: 'path:/network-error',
          allowRelativeUrls: true,
          response: Promise.reject(new Error('Network Error'))
        });

        await expect(apiRequest('/network-error')).rejects.toThrow('Network Error');
      });

      it('should handle malformed JSON response', async () => {
        fetchMock.route({
          url: 'path:/bad-json',
          allowRelativeUrls: true,
          response: {
            status: 200,
            body: 'not json',
            headers: { 'Content-Type': 'application/json' }
          }
        });

        /** @todo consider which is the correct behavior here */
        // await expect(apiRequest('/bad-json')).rejects.toThrow();
        const result = await apiRequest('/bad-json');
        expect(result).toEqual({});
      });

      it('should handle empty response body', async () => {
        fetchMock.route({
          url: 'path:/empty',
          allowRelativeUrls: true,
          response: {
            status: 200,
            body: {}
          }
        });

        const result = await apiRequest('/empty');
        expect(result).toEqual({});
      });

      it('should not attempt refresh for non-401 errors', async () => {
        mockApiError('/forbidden', 403, 'Forbidden');
        mockApiSuccess('/auth/refresh', { message: 'Token refreshed successfully' });

        await expectApiError(
          () => apiRequest('/forbidden'),
          403,
          'Forbidden'
        );
        expect(fetchMock.callHistory.calls('path:/auth/refresh').length).toBe(0);
      });
    });

    describe('JWT Refresh handling', () => {
      beforeEach(() => {
        mockApiSuccess('/auth/refresh', { message: 'Token refreshed successfully' });
      });

      const authEndpointScenarios = [
        {
          name: 'should NOT attempt refresh for auth endpoints on 401',
          endpoint: '/auth/login',
          method: 'POST',
          errorMessage: 'Invalid credentials'
        },
        {
          name: 'should NOT attempt refresh for auth/register endpoint on 401',
          endpoint: '/auth/register',
          method: 'POST',
          errorMessage: 'Registration failed'
        },
        {
          name: 'should NOT attempt refresh for auth/logout endpoint on 401',
          endpoint: '/auth/logout',
          method: 'POST',
          errorMessage: 'Logout failed'
        },
        {
          name: 'should NOT attempt refresh for csrf-token endpoint on 401',
          endpoint: '/auth/csrf-token',
          method: undefined,
          errorMessage: 'Unauthorized'
        }
      ];

      authEndpointScenarios.forEach(({ name, endpoint, method, errorMessage }) => {
        it(name, async () => {
          mockApiError(endpoint, 401, errorMessage);

          const requestOptions = method ? { method } : undefined;
          await expectApiError(
            () => apiRequest(endpoint, requestOptions),
            401,
            errorMessage
          );
          
          // Should not attempt refresh for auth endpoints
          expect(fetchMock.callHistory.calls('path:/auth/refresh').length).toBe(0);
        });
      });

      it('should retry request after 401 and successful refresh', async () => {
        fetchMock.once({
          url: 'path:/protected',
          method: 'POST',
          response: { status: 401, body: { error: 'Unauthorized' } }
        });

        fetchMock.once({
          url: 'path:/protected',
          method: 'POST',
          response: { status: 200, body: { data: 'success' } }
        });

        fetchMock.route({
          url: 'path:/auth/csrf-token',
          response: {
            status: 200,
            body: { csrfToken: 'mock-csrf-token' }
          }
        });

        const result = await apiRequest('/protected', { method: 'POST' });
        
        expect(result).toEqual({ data: 'success' });
        expect(fetchMock.callHistory.calls('path:/auth/refresh').length).toBe(1);
        expect(fetchMock.callHistory.calls('path:/protected').length).toBe(2);
      });

      it('should throw error if refresh fails with server error', async () => {
        fetchMock.route({
          url: 'path:/auth/refresh',
          method: 'POST',
          response: { status: 500, body: { error: 'Refresh failed' } },
        });

        fetchMock.route({
          url: 'path:/protected',
          method: 'POST',
          response: { status: 401, body: { error: 'Unauthorized' } }
        });

        fetchMock.route({
          url: 'path:/auth/csrf-token',
          response: {
            status: 200,
            body: { csrfToken: 'mock-csrf-token' }
          }
        });

        await expect(apiRequest('/protected', { method: 'POST' }))
          .rejects.toThrow('Unauthorized');
      });

      it('should throw ApiError when refresh returns 205 (session expired)', async () => {
        fetchMock.mockReset();

        fetchMock.route({
          url: 'path:/auth/refresh',
          method: 'POST',
          response: {
            status: 205
          }
        });

        fetchMock.route({
          url: 'path:/protected',
          method: 'POST',
          response: { status: 401, body: { error: 'Unauthorized' } }
        });

        fetchMock.route({
          url: 'path:/auth/csrf-token',
          response: {
            status: 200,
            body: { csrfToken: 'mock-csrf-token' }
          }
        });

        await expect(apiRequest('/protected', { method: 'POST' }))
          .rejects.toThrow('Session expired, please log in again');
          
        try {
          await apiRequest('/protected', { method: 'POST' });
        } catch (error) {
          expect(error).toBeInstanceOf(ApiError);
          expect((error as ApiError).statusCode).toBe(205);
        }
      });

      it('should handle 401 unauthorized with refresh attempt for GET request', async () => {
        fetchMock.once({
          url: 'path:/unauthorized',
          allowRelativeUrls: true,
          response: { status: 401, body: { error: 'Unauthorized' } }
        });

        fetchMock.once({
          url: 'path:/unauthorized',
          allowRelativeUrls: true,
          response: { status: 200, body: { data: 'success after refresh' } }
        });

        const result = await apiRequest('/unauthorized');
        expect(result).toEqual({ data: 'success after refresh' });
        expect(fetchMock.callHistory.calls('path:/auth/refresh').length).toBe(1);
        expect(fetchMock.callHistory.calls('path:/unauthorized').length).toBe(2);
      });

      it('should not call clearCsrfToken on refresh failure', async () => {
        // CSRF tokens persist across refresh failures since they're session-based
        fetchMock.route({
          url: 'path:/auth/refresh',
          method: 'POST', 
          response: { status: 205 },
        });

        fetchMock.route({
          url: 'path:/protected',
          method: 'POST',
          response: { status: 401, body: { error: 'Unauthorized' } }
        });

        fetchMock.route({
          url: 'path:/auth/csrf-token',
          response: {
            status: 200,
            body: { csrfToken: 'mock-csrf-token' }
          }
        });

        // Set up CSRF token first
        await apiRequest('/protected', { method: 'POST' }).catch(() => {});
        
        // CSRF token should still be cached (verify no additional CSRF fetch on second call)
        const initialCsrfCalls = fetchMock.callHistory.calls('path:/auth/csrf-token').length;
        
        await apiRequest('/protected', { method: 'POST' }).catch(() => {});
        expect(fetchMock.callHistory.calls('path:/auth/csrf-token').length).toBe(initialCsrfCalls);
      });
    });

    describe('CSRF Token handling', () => {
      beforeEach(() => clearCsrfToken());
      beforeEach(() => {
        fetchMock.route({
          url: 'path:/auth/csrf-token',
          response: {
            status: 200,
            body: {
              csrfToken: 'mock-csrf-token'
            }
          }
        });

        fetchMock.route({
          url: 'path:/auth/login',
          method: 'POST',
          response: {
            status: 200,
            body: {
              data: createMockUser(),
              message: 'Logged in'
            }
          }
        });

        fetchMock.route({
          url: 'path:/protected',
          method: 'POST',
          response: {
            status: 200,
            body: {
              data: 'asdf',
              message: 'qwerty'
            }
          }
        });
      });

      const csrfTokenTests = [
        {
          name: 'should only fetches a token if needed',
          test: async () => {
            await apiRequest('/protected', { method: 'POST' });
            expect(fetchMock.callHistory.called('path:/auth/csrf-token')).toBe(true);

            await apiRequest('/protected', { method: 'POST' });
            expect(fetchMock.callHistory.calls('path:/auth/csrf-token').length).toEqual(1);
          }
        },
        {
          name: 'should add header to protected methods',
          test: async () => {
            await apiRequest('/protected', { method: 'POST' });
            const apiCall = fetchMock.callHistory.calls('path:/protected')[0];
            const options = apiCall?.options;

            expect(options?.method).toBe('post');
            expect(options?.headers).toEqual(
              expect.objectContaining({
                'x-csrf-token': 'mock-csrf-token',
                'content-type': 'application/json',
              }));
          }
        },
        {
          name: 'should not add header to any auth endpoint',
          test: async () => {
            await apiRequest('/auth/login', { method: 'POST' });
            const apiCall = fetchMock.callHistory.calls('path:/auth/login')[0];
            const options = apiCall?.options;

            expect(options?.method).toBe('post');
            expect(options?.headers).toEqual(
              expect.objectContaining({
                'content-type': 'application/json',
              }));
            expect(options?.headers).not.toHaveProperty('x-csrf-token');
          }
        }
      ];

      csrfTokenTests.forEach(({ name, test }) => {
        it(name, test);
      });

      it('should have a way to clear the token', async () => {
        await apiRequest('/protected', { method: 'POST' });
        expect(fetchMock.callHistory.called('path:/auth/csrf-token')).toBe(true);
        clearCsrfToken();
        await apiRequest('/protected', { method: 'POST' });
        expect(fetchMock.callHistory.calls('path:/auth/csrf-token').length).toEqual(2);
      });

      it('should not add CSRF token to GET requests', async () => {
        fetchMock.route({
          url: 'path:/protected',
          method: 'GET',
          response: {
            status: 200,
            body: {
              data: 'asdf',
              message: 'qwerty'
            }
          }
        });
        
        await apiRequest('/protected', { method: 'GET' });
        const apiCall = fetchMock.callHistory.calls('path:/protected')[0];
        const options = apiCall?.options;

        expect(options?.headers).not.toHaveProperty('x-csrf-token');
        expect(fetchMock.callHistory.calls('path:/auth/csrf-token').length).toBe(0);
      });

      it.todo('should handle token fetch errors');
    });
  });
});
