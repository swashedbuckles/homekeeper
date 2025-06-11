import { beforeEach, describe, expect, it } from 'vitest';
import fetchMock from '@fetch-mock/vitest';
import { apiRequest, API_BASE_URL } from '../../src/lib/apiClient';
import { ApiError } from '../../src/lib/types/apiError';

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

      await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const lastCall = fetchMock.callHistory.lastCall();
      expect(lastCall?.options.body).toBe(JSON.stringify(requestBody));
      expect(lastCall?.options.method).toBe('post');
    });

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

      await expect(apiRequest('/bad-json')).rejects.toThrow();
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

    it('should handle 401 unauthorized', async () => {
      fetchMock.route({
        url: 'path:/unauthorized',
        allowRelativeUrls: true,
        response: {
          status: 401,
          body: { error: 'Unauthorized' }
        }
      });

      try {
        await apiRequest('/unauthorized');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(401);
      }
    });

    it('should handle 403 forbidden', async () => {
      fetchMock.route({
        url: 'path:/forbidden',
        allowRelativeUrls: true,
        response: {
          status: 403,
          body: { error: 'Forbidden' }
        }
      });

      try {
        await apiRequest('/forbidden');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(403);
      }
    });
  });
});