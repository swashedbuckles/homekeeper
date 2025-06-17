// backend/tests/models/user-household-integration.test.ts
import { beforeEach, describe, expect, it } from 'vitest';

import { Household } from '../../src/models/household';
import { User } from '../../src/models/user';
import type { HouseholdDocument } from '../../src/models/household';
import type { UserDocument } from '../../src/types/user';

describe('User-Household Integration Tests', () => {
  let owner: UserDocument;
  let member: UserDocument;
  let household: HouseholdDocument;

  beforeEach(async () => {
    // Create users
    owner = await User.createUser({
      email: 'owner@example.com',
      password: 'password123',
      name: 'Household Owner',
    });

    member = await User.createUser({
      email: 'member@example.com',
      password: 'password123',
      name: 'Household Member',
    });

    // Create household with owner
    household = await Household.createHousehold(
      'Integration Test House',
      owner._id.toString(),
      'A test household for integration testing'
    );
  });

  describe('Household Creation Integration', () => {
    it('should create household with owner as member', async () => {
      // Household should exist
      expect(household.name).toBe('Integration Test House');
      expect(household.ownerId.toString()).toBe(owner._id.toString());
      expect(household.members).toHaveLength(1);
      expect(household.members[0].toString()).toBe(owner._id.toString());

      // Owner should be able to be found as member
      const households = await Household.findByMember(owner._id.toString());
      expect(households).toHaveLength(1);
      expect(households[0]._id.toString()).toBe(household._id.toString());
    });
  });

  describe('Adding Members Integration', () => {
    it('should add member to household and update user roles', async () => {
      // Add member to household
      await household.addMember(member._id.toString(), 'admin');

      // Verify household side
      expect(household.members).toHaveLength(2);
      expect(household.members.map(id => id.toString())).toContain(member._id.toString());
      expect(household.hasMember(member._id.toString())).toBe(true);

      // Verify user side
      const updatedMember = await User.findById(member._id);
      expect(updatedMember?.householdRoles.get(household._id.toString())).toBe('admin');

      // Verify queries work both ways
      const memberHouseholds = await Household.findByMember(member._id.toString());
      expect(memberHouseholds).toHaveLength(1);
      expect(memberHouseholds[0]._id.toString()).toBe(household._id.toString());
    });

    it('should handle multiple members with different roles', async () => {
      // Create another member
      const adminUser = await User.createUser({
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
      });

      // Add both members with different roles
      await household.addMember(member._id.toString(), 'member');
      await household.addMember(adminUser._id.toString(), 'admin');

      // Verify household has all members
      expect(household.members).toHaveLength(3); // owner + 2 new members
      
      // Verify roles are correct
      const updatedMember = await User.findById(member._id);
      const updatedAdmin = await User.findById(adminUser._id);

      expect(updatedMember?.householdRoles.get(household._id.toString())).toBe('member');
      expect(updatedAdmin?.householdRoles.get(household._id.toString())).toBe('admin');

      // Verify all can be found
      const allMembers = [owner._id.toString(), member._id.toString(), adminUser._id.toString()];
      
      for (const memberId of allMembers) {
        const memberHouseholds = await Household.findByMember(memberId);
        expect(memberHouseholds).toHaveLength(1);
        expect(memberHouseholds[0]._id.toString()).toBe(household._id.toString());
      }
    });
  });

  describe('Serialization Integration', () => {
    it('should properly serialize user with household data for API', async () => {
      // Add user to household
      await household.addMember(member._id.toString(), 'admin');

      // Get updated user
      const updatedUser = await User.findById(member._id);
      const safeUser = updatedUser?.toSafeObject();

      // Should have proper structure for frontend
      expect(safeUser).toBeDefined();
      expect(safeUser?.householdRoles).toEqual({
        [household._id.toString()]: 'admin'
      });

      // Should be JSON serializable
      const jsonString = JSON.stringify(safeUser);
      const parsed = JSON.parse(jsonString);
      
      expect(parsed.householdRoles[household._id.toString()]).toBe('admin');
      expect(parsed).not.toHaveProperty('password');
      expect(parsed.id).toBe(updatedUser?.id);
    });
  });

  describe('Query Performance Verification', () => {
    it('should efficiently find households by member', async () => {
      // Create multiple households with the same member
      const household2 = await Household.createHousehold(
        'Second House',
        owner._id.toString()
      );

      // Add member to both households
      await household.addMember(member._id.toString(), 'member');
      await household2.addMember(member._id.toString(), 'admin');

      // Should find both households
      const memberHouseholds = await Household.findByMember(member._id.toString());
      expect(memberHouseholds).toHaveLength(2);

      const householdIds = memberHouseholds.map(h => h._id.toString()).sort();
      const expectedIds = [household._id.toString(), household2._id.toString()].sort();
      expect(householdIds).toEqual(expectedIds);
    });

    it('should efficiently find households by owner', async () => {
      // Create multiple households with same owner
      const household2 = await Household.createHousehold(
        'Owner Second House',
        owner._id.toString()
      );

      // Should find both households
      const ownerHouseholds = await Household.findByOwner(owner._id.toString());
      expect(ownerHouseholds).toHaveLength(2);

      const householdIds = ownerHouseholds.map(h => h._id.toString()).sort();
      const expectedIds = [household._id.toString(), household2._id.toString()].sort();
      expect(householdIds).toEqual(expectedIds);
    });
  });

  describe('Error Handling Integration', () => {
    it('should maintain data consistency on partial failures', async () => {
      // This test verifies that if something goes wrong, we don't end up with 
      // inconsistent state between User and Household
      
      const initialMemberCount = household.members.length;
      
      // Try to add a non-existent user (should fail)
      const fakeUserId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
      
      await expect(
        household.addMember(fakeUserId, 'member')
      ).rejects.toThrow('User not found');

      // Household should be unchanged
      expect(household.members).toHaveLength(initialMemberCount);
      expect(household.hasMember(fakeUserId)).toBe(false);
    });
  });
});