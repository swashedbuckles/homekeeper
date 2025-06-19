import { describe, it, expect, beforeEach, vi } from 'vitest';

import { requireAllPermissions, requireAnyPermission, requirePermission } from '../../src/middleware/rbac';
import { createMockHousehold, createMockUser } from '../helpers/testDataUtils';
import { HouseholdPermissions } from '../../src/config/permissions';

import type { NextFunction, Request, Response } from 'express';
import { SafeUser } from '../../src/models/user';
import { ApiResponse } from '@homekeeper/shared';

describe('RBAC Middleware', () => {
  let mockUser: SafeUser;
  let mockHouse: any;
  let mockRequest: Partial<Request & { user?: SafeUser }>;
  let mockResponse: Partial<Response & {
    apiSuccess<T>(data: ApiResponse<T>): Response;
    apiError(statusCode: number, error: string): Response;
  }>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockHouse = createMockHousehold();
    mockUser = createMockUser({
      householdRoles: {
        [mockHouse.id]: 'admin'
      }
    });

    mockNext = vi.fn();

    mockRequest = {
      user: undefined,
      params: {}
    };

    mockResponse = {
      apiSuccess: vi.fn().mockReturnThis(),
      apiError: vi.fn().mockReturnThis(),
    }
  });

  describe('Require A Permission', () => {
    it('should return 401 if user is missing', () => {
      const mw = requirePermission(HouseholdPermissions.HOUSEHOLD_DELETE);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(401, 'Unauthorized');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if household id is missing', () => {
      mockRequest.user = mockUser;
      const mw = requirePermission(HouseholdPermissions.HOUSEHOLD_DELETE);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(401, 'Unauthorized');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not have permission', () => {
      mockRequest.user = mockUser;
      mockRequest.params = {
        id: mockHouse.id
      };

      const mw = requirePermission(HouseholdPermissions.HOUSEHOLD_DELETE);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(403, 'Forbidden');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next if user has permission', () => {
      mockRequest.user = mockUser;
      mockRequest.params = {
        id: mockHouse.id
      };

      const mw = requirePermission(HouseholdPermissions.HOUSEHOLD_VIEW);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Require Any Permission', () => {
    it('should return 401 if user is missing', () => {
      const mw = requireAnyPermission([HouseholdPermissions.HOUSEHOLD_DELETE, HouseholdPermissions.HOUSEHOLD_UPDATE]);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(401, 'Unauthorized');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if household id is missing', () => {
      mockRequest.user = mockUser;
      const mw = requireAnyPermission([HouseholdPermissions.HOUSEHOLD_DELETE, HouseholdPermissions.HOUSEHOLD_UPDATE]);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(401, 'Unauthorized');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not have any permission', () => {
      mockRequest.user = mockUser;
      mockRequest.params = {
        id: mockHouse.id
      };

      // Admin doesn't have DELETE or TRANSFER_OWNERSHIP permissions
      const mw = requireAnyPermission([HouseholdPermissions.HOUSEHOLD_DELETE, HouseholdPermissions.HOUSEHOLD_TRANSFER_OWNERSHIP]);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(403, 'Forbidden');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next if user has at least one permission', () => {
      mockRequest.user = mockUser;
      mockRequest.params = {
        id: mockHouse.id
      };

      // Admin has VIEW and UPDATE but not DELETE
      const mw = requireAnyPermission([HouseholdPermissions.HOUSEHOLD_VIEW, HouseholdPermissions.HOUSEHOLD_DELETE]);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Require All Permissions', () => {
    it('should return 401 if user is missing', () => {
      const mw = requireAllPermissions([HouseholdPermissions.HOUSEHOLD_VIEW, HouseholdPermissions.HOUSEHOLD_UPDATE]);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(401, 'Unauthorized');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if household id is missing', () => {
      mockRequest.user = mockUser;
      const mw = requireAllPermissions([HouseholdPermissions.HOUSEHOLD_VIEW, HouseholdPermissions.HOUSEHOLD_UPDATE]);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(401, 'Unauthorized');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not have all permissions', () => {
      mockRequest.user = mockUser;
      mockRequest.params = {
        id: mockHouse.id
      };

      // Admin has VIEW and UPDATE but not DELETE
      const mw = requireAllPermissions([HouseholdPermissions.HOUSEHOLD_VIEW, HouseholdPermissions.HOUSEHOLD_DELETE]);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.apiError).toHaveBeenCalledWith(403, 'Forbidden');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next if user has all permissions', () => {
      mockRequest.user = mockUser;
      mockRequest.params = {
        id: mockHouse.id
      };

      // Admin has both VIEW and UPDATE permissions
      const mw = requireAllPermissions([HouseholdPermissions.HOUSEHOLD_VIEW, HouseholdPermissions.HOUSEHOLD_UPDATE]);
      void mw(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});