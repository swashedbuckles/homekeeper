import {describe, it, expect, beforeEach} from 'vitest';

import * as permissions from '../../src/config/permissions';
import * as roles from '../../src/config/roles';

import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  getUserPermissions
} from '../../src/services/permission';

import { createMockUser } from '../helpers/testDataUtils';
import { SafeUser } from '../../src/models/user';

describe('Permissions Management', () => {
  let mockUser: SafeUser;

  beforeEach(() => {
    mockUser = createMockUser({
        householdRoles: {
        'owner-household-id': 'owner',
        'admin-household-id': 'admin', 
        'member-household-id': 'member',
        'guest-household-id': 'guest'
      }
    });
  });

  describe('Checking Permissions', () => {
    it('should be able to determine if a user has a permission', () => {
      const ownerPerm  = hasPermission(mockUser, 'owner-household-id', permissions.HouseholdPermissions.HOUSEHOLD_DELETE);
      const adminPerm  = hasPermission(mockUser, 'admin-household-id', permissions.HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS);
      const memberPerm = hasPermission(mockUser, 'member-household-id', permissions.AssetPermissions.ASSET_UPDATE);
      const guestPerm  = hasPermission(mockUser, 'guest-household-id', permissions.DocumentPermissions.DOCUMENT_VIEW);
      
      expect(ownerPerm).toBeTruthy();
      expect(adminPerm).toBeTruthy();
      expect(memberPerm).toBeTruthy();
      expect(guestPerm).toBeTruthy();
    });

    it('should be able to report if a user does not have a permission', () => {
      const adminPerm  = hasPermission(mockUser, 'admin-household-id', permissions.HouseholdPermissions.HOUSEHOLD_DELETE);
      const memberPerm = hasPermission(mockUser, 'member-household-id', permissions.AssetPermissions.ASSET_DELETE);
      const guestPerm  = hasPermission(mockUser, 'guest-household-id', permissions.DocumentPermissions.DOCUMENT_CREATE);
      
      expect(adminPerm).toBeFalsy();
      expect(memberPerm).toBeFalsy();
      expect(guestPerm).toBeFalsy();

      const adminPermFail  = hasAnyPermission(mockUser, 'admin-household-id',  [permissions.HouseholdPermissions.HOUSEHOLD_DELETE]);
      const memberPermFail = hasAnyPermission(mockUser, 'member-household-id', [permissions.HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS, permissions.HouseholdPermissions.HOUSEHOLD_DELETE]);
      const guestPermFail  = hasAnyPermission(mockUser, 'guest-household-id',  [permissions.DocumentPermissions.DOCUMENT_DELETE, permissions.HouseholdPermissions.HOUSEHOLD_DELETE]);
      
      expect(adminPermFail).toBeFalsy();
      expect(memberPermFail).toBeFalsy();
      expect(guestPermFail).toBeFalsy();
    });

    it('should be able to report if a user has at least one required permission', () => {
      const ownerPerm  = hasAnyPermission(mockUser, 'owner-household-id',  [permissions.HouseholdPermissions.HOUSEHOLD_DELETE, permissions.HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS]);
      const adminPerm  = hasAnyPermission(mockUser, 'admin-household-id',  [permissions.HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS, permissions.HouseholdPermissions.HOUSEHOLD_DELETE]);
      const memberPerm = hasAnyPermission(mockUser, 'member-household-id', [permissions.AssetPermissions.ASSET_UPDATE, permissions.HouseholdPermissions.HOUSEHOLD_DELETE]);
      const guestPerm  = hasAnyPermission(mockUser, 'guest-household-id',  [permissions.DocumentPermissions.DOCUMENT_VIEW, permissions.HouseholdPermissions.HOUSEHOLD_DELETE]);
      
      expect(ownerPerm).toBeTruthy();
      expect(adminPerm).toBeTruthy();
      expect(memberPerm).toBeTruthy();
      expect(guestPerm).toBeTruthy();
    });

    it('should be able to report if a user has all permissions', () => {
      const ownerPerm  = hasAllPermissions(mockUser, 'owner-household-id',  [permissions.HouseholdPermissions.HOUSEHOLD_DELETE, permissions.HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS]);
      const adminPerm  = hasAllPermissions(mockUser, 'admin-household-id',  [permissions.HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS, permissions.AssetPermissions.ASSET_UPDATE]);
      const memberPerm = hasAllPermissions(mockUser, 'member-household-id', [permissions.AssetPermissions.ASSET_UPDATE, permissions.DocumentPermissions.DOCUMENT_VIEW]);
      const guestPerm  = hasAllPermissions(mockUser, 'guest-household-id',  [permissions.DocumentPermissions.DOCUMENT_VIEW, permissions.HouseholdPermissions.HOUSEHOLD_VIEW]);
      
      expect(ownerPerm).toBeTruthy();
      expect(adminPerm).toBeTruthy();
      expect(memberPerm).toBeTruthy();
      expect(guestPerm).toBeTruthy();
    });

    it('should be able to report if a user does not have all required permissions', () => {
      const adminPerm  = hasAllPermissions(mockUser, 'admin-household-id',  [permissions.HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS, permissions.HouseholdPermissions.HOUSEHOLD_DELETE]);
      const memberPerm = hasAllPermissions(mockUser, 'member-household-id', [permissions.AssetPermissions.ASSET_UPDATE, permissions.HouseholdPermissions.HOUSEHOLD_DELETE]);
      const guestPerm  = hasAllPermissions(mockUser, 'guest-household-id',  [permissions.DocumentPermissions.DOCUMENT_VIEW, permissions.HouseholdPermissions.HOUSEHOLD_DELETE]);
      
      expect(adminPerm).toBeFalsy();
      expect(memberPerm).toBeFalsy();
      expect(guestPerm).toBeFalsy();
    });

    it('should return false if user does not have a role for a household', () => {
      const one = hasPermission(mockUser, 'not-a-house', permissions.HouseholdPermissions.HOUSEHOLD_VIEW)
      const any = hasAnyPermission(mockUser, 'not-a-house', [permissions.HouseholdPermissions.HOUSEHOLD_VIEW]);
      const all = hasAllPermissions(mockUser, 'not-a-house', [permissions.HouseholdPermissions.HOUSEHOLD_VIEW]);

      expect(one).toBeFalsy()
      expect(any).toBeFalsy()
      expect(all).toBeFalsy()
    });

    it('should be able to return the permissions a user has for a household', () => {
      const ownerPerm  = getUserPermissions(mockUser, 'owner-household-id');
      const adminPerm  = getUserPermissions(mockUser, 'admin-household-id');
      const memberPerm = getUserPermissions(mockUser, 'member-household-id');
      const guestPerm  = getUserPermissions(mockUser, 'guest-household-id');
      
      expect(ownerPerm).toEqual(roles.Owner);
      expect(adminPerm).toEqual(roles.Admin);
      expect(memberPerm).toEqual(roles.Member);
      expect(guestPerm).toEqual(roles.Guest);
    });

    it('should throw an error if trying to get permissions for a non-existant house', () => {
      expect(() => getUserPermissions(mockUser, 'not-a-house')).toThrow();
    });
  });
});