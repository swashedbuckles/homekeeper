import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS } from '../../src/constants';
import { handleValidation } from '../../src/middleware/validation';

// Mock express-validator
vi.mock('express-validator', () => ({
  validationResult: vi.fn(),
}));

describe('handleValidation', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it('should call next() when there are no validation errors', () => {
    // Mock no errors
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    } as any);

    handleValidation(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledOnce();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it('should return 400 error when validation errors exist', () => {
    const mockErrors = [
      { field: 'email', message: 'Invalid email format' },
      { field: 'password', message: 'Password too weak' },
    ];

    // Mock validation errors
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => false,
      array: () => mockErrors,
    } as any);

    handleValidation(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid input',
      details: mockErrors,
    });
  });

  it('should not call next() when validation errors exist', () => {
    // Mock validation errors
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ field: 'test', message: 'Test error' }],
    } as any);

    handleValidation(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call validationResult with the request object', () => {
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    } as any);

    handleValidation(mockReq as Request, mockRes as Response, mockNext);

    expect(validationResult).toHaveBeenCalledWith(mockReq);
  });
});