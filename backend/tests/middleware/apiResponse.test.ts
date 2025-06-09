import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi, expectTypeOf } from 'vitest';
import { apiResponseMiddleware } from '../../src/middleware/apiResponse';
import { ApiResponse } from '@homekeeper/shared';

describe('apiResponseMiddleware', () => {
  interface middlewareExtension extends Response {
      apiSuccess<T>(data: ApiResponse<T>): Response;
      apiError(statusCode: number, error: string): Response;
    };
  let mockReq: Partial<Request>;
  let mockRes: Partial<middlewareExtension>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  it('should add apiSuccess method to response object', () => {
    apiResponseMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.apiSuccess).toBeDefined();
    expect(typeof mockRes.apiSuccess).toBe('function');
  });

  it('should add apiError method to response object', () => {
    apiResponseMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.apiError).toBeDefined();
    expect(typeof mockRes.apiError).toBe('function');
  });

  it('should call next() to continue middleware chain', () => {
    apiResponseMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledOnce();
  });

  describe('apiSuccess method', () => {
    beforeEach(() => {
      apiResponseMiddleware(mockReq as Request, mockRes as Response, mockNext);
    });

    it('should call res.json with wrapped data', () => {
      const testData = { message: 'Success', data: { id: 1, name: 'Test' } };
      
      mockRes.apiSuccess!(testData);

      expect(mockRes.json).toHaveBeenCalledWith(testData);
    });

    it('should return the response object for chaining', () => {
      const testData = { message: 'Success', data: { id: 1 } };
      
      const result = mockRes.apiSuccess!(testData);

      expect(result).toBe(mockRes);
    });

    // Vitest type assertion example
    it('should preserve type information', () => {
      const testData = { message: 'Success', data: { userId: 123, email: 'test@example.com' } };
      
      if(!mockRes.apiSuccess) {
        throw new Error('Middleware unsuccessful');
      }
      
      mockRes.apiSuccess<{ userId: number; email: string }>(testData);
      
      expectTypeOf(mockRes.apiSuccess).toBeFunction();
      expectTypeOf(mockRes.apiSuccess).parameter(0).toHaveProperty('data');
    });
  });

  describe('apiError method', () => {
    beforeEach(() => {
      apiResponseMiddleware(mockReq as Request, mockRes as Response, mockNext);
    });

    it('should call res.status and res.json with error data', () => {
      const statusCode = 400;
      const errorMessage = 'Bad Request';

      mockRes.apiError!(statusCode, errorMessage);

      expect(mockRes.status).toHaveBeenCalledWith(statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: errorMessage, 
        statusCode 
      });
    });

    it('should return the response object for chaining', () => {
      const result = mockRes.apiError!(500, 'Server Error');

      expect(result).toBe(mockRes);
    });
  });
});
