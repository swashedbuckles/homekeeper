import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS } from '../../src/constants';
import { assertHasHouse, isMemberOf } from '../../src/middleware/isMemberOf';
import { Household } from '../../src/models/household';
import { User } from '../../src/models/user';
import type { SafeUser } from '../../src/types/user';
import { ApiResponse } from '@homekeeper/shared';

describe('isMemberOf Middleware (Integration)', () => {
  interface middlewareExtension extends Response {
    apiSuccess<T>(data: ApiResponse<T>): Response;
    apiError(statusCode: number, error: string): Response;
  }

  let mockRequest: Partial<Request & { user: SafeUser, household?: any }>;
  let mockResponse: Partial<middlewareExtension>;
  let mockNext: NextFunction;
  
  // Test data
  let testUser: any;
  let testHousehold: any;
  let nonMemberUser: any;

  beforeEach(async () => {
    // Create real test users
    testUser = await User.create({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123'
    });

    nonMemberUser = await User.create({
      email: 'nonmember@example.com', 
      name: 'Non Member',
      password: 'password123'
    });

    // Create real test household
    testHousehold = await Household.create({
      name: 'Test Household',
      ownerId: testUser._id,
      members: [testUser._id]
    });

    mockRequest = {
      params: { id: testHousehold._id.toString() },
      user: {
        id: testUser._id.toString(),
        email: testUser.email,
        name: testUser.name
      } as SafeUser
    };

    mockResponse = {
      apiError: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('assertHasHouse', () => {
    it('should pass when req.household exists', () => {
      const req = { household: testHousehold } as any;
      
      expect(() => assertHasHouse(req)).not.toThrow();
      expect(req.household).toBeDefined();
    });

    it('should throw error when req.household is undefined', () => {
      const req = {} as any;
      
      expect(() => assertHasHouse(req)).toThrow('User is not a member of household');
    });
  });

  describe('isMemberOf middleware', () => {
    it('should call next() when user is not present', async () => {
      mockRequest.user = undefined;

      await isMemberOf(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledOnce();
      expect(mockResponse.apiError).not.toHaveBeenCalled();
    });

    it('should return 404 when household does not exist', async () => {
      mockRequest.params = { id: '507f1f77bcf86cd799439011' }; // Valid ObjectId that doesn't exist

      await isMemberOf(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(
        HTTP_STATUS.NOT_FOUND, 
        'Household not found'
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 404 when user is not a member of household', async () => {
      // Use non-member user
      mockRequest.user = {
        id: nonMemberUser._id.toString(),
        email: nonMemberUser.email,
        name: nonMemberUser.name
      } as SafeUser;

      await isMemberOf(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(
        HTTP_STATUS.NOT_FOUND, 
        'Household not found'
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should set req.household and call next() when user is a valid member', async () => {
      await isMemberOf(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.household).toBeDefined();
      expect(mockRequest.household._id.toString()).toBe(testHousehold._id.toString());
      expect(mockNext).toHaveBeenCalledOnce();
      expect(mockResponse.apiError).not.toHaveBeenCalled();
    });

    it('should work when user is added as a member after household creation', async () => {
      // Add non-member user to household
      testHousehold.members.push(nonMemberUser._id);
      await testHousehold.save();

      mockRequest.user = {
        id: nonMemberUser._id.toString(),
        email: nonMemberUser.email,
        name: nonMemberUser.name
      } as SafeUser;

      await isMemberOf(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.household).toBeDefined();
      expect(mockNext).toHaveBeenCalledOnce();
      expect(mockResponse.apiError).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle invalid ObjectId format', async () => {
      mockRequest.params = { id: 'invalid-id' };

      await isMemberOf(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(
        HTTP_STATUS.NOT_FOUND, 
        'Household not found'
      );
    });

    it('should handle missing params.id', async () => {
      mockRequest.params = {};

      await isMemberOf(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(
        HTTP_STATUS.NOT_FOUND, 
        'Household not found'
      );
    });
  });
});