import { beforeEach, describe, expect, it } from 'vitest';
import fetchMock from '@fetch-mock/vitest';
import { apiRequest, API_BASE_URL, clearCsrfToken } from '../../src/lib/apiClient';
import { ApiError } from '../../src/lib/types/apiError';
import { createMockUser } from '../helpers/testUtils';

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
      it('should throw ApiError for HTTP error status', async () => {
        fetchMock.route({
          url: 'path:/error',
          allowRelativeUrls: true,
          response: {
            status: 400,
            body: { error: 'Bad Request' }
          }
        });

        await expect(apiRequest('/error')).rejects.toThrow(ApiError);

        try {
          await apiRequest('/error');
        } catch (error) {
          expect(error).toBeInstanceOf(ApiError);
          expect((error as ApiError).statusCode).toBe(400);
          expect((error as ApiError).message).toBe('Bad Request');
        }
      });

      it('should throw ApiError for 500 server error', async () => {
        fetchMock.route({
          url: 'path:/server-error',
          allowRelativeUrls: true,
          response: {
            status: 500,
            body: { error: 'Internal Server Error' }
          }
        });

        await expect(apiRequest('/server-error')).rejects.toThrow(ApiError);
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
        fetchMock.route({
          url: 'path:/forbidden',
          allowRelativeUrls: true,
          response: { status: 403, body: { error: 'Forbidden' } }
        });

        fetchMock.route({
          url: 'path:/auth/refresh',
          method: 'POST',
          response: { status: 200, body: { message: 'Token refreshed successfully' } }
        });

        await expect(apiRequest('/forbidden')).rejects.toThrow(ApiError);
        expect(fetchMock.callHistory.calls('path:/auth/refresh').length).toBe(0);
      });
    });

    describe('JWT Refresh handling', () => {
      beforeEach(() => {
        fetchMock.route({
          url: 'path:/auth/refresh',
          method: 'POST',
          response: { status: 200, body: { message: 'Token refreshed successfully' } }
        });
      });

      it('should retry request after 401 and successful refresh', async () => {
        fetchMock.once({
          url: 'path:/protected',
          method: 'POST',
          response: 
            { status: 401, body: { error: 'Unauthorized' } },
        });

        fetchMock.once({
          url: 'path:/protected',
          method: 'POST',
          response: 
            { status: 200, body: { data: 'success' } }
          
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
          response: 
            { status: 401, body: { error: 'Unauthorized' } },
        });

        fetchMock.once({
          url: 'path:/unauthorized',
          allowRelativeUrls: true,
          response: 
            { status: 200, body: { data: 'success after refresh' } }
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

      it('should only fetches a token if needed', async () => {
        await apiRequest('/protected', { method: 'POST' });
        expect(fetchMock.callHistory.called('path:/auth/csrf-token')).toBe(true);

        await apiRequest('/protected', { method: 'POST' });
        expect(fetchMock.callHistory.calls('path:/auth/csrf-token').length).toEqual(1);
      });

      it('should add header to protected methods', async () => {
        await apiRequest('/protected', { method: 'POST' });
        const apiCall = fetchMock.callHistory.calls('path:/protected')[0];
        const options = apiCall?.options;

        expect(options?.method).toBe('post');
        expect(options?.headers).toEqual(
          expect.objectContaining({
            'x-csrf-token': 'mock-csrf-token',
            'content-type': 'application/json',
          }));
      });

      it('should not add header to any auth endpoint', async () => {
        await apiRequest('/auth/login', { method: 'POST' });
        const apiCall = fetchMock.callHistory.calls('path:/auth/login')[0];
        const options = apiCall?.options;

        expect(options?.method).toBe('post');
        expect(options?.headers).toEqual(
          expect.objectContaining({
            'content-type': 'application/json',
          }));
        expect(options?.headers).not.toHaveProperty('x-csrf-token');
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
