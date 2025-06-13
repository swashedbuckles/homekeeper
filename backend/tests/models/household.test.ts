import { beforeEach, describe, expect, it } from 'vitest';
import { Types } from 'mongoose';

import { Household } from '../../src/models/household';
import { User } from '../../src/models/user';
import type { HouseholdDocument } from '../../src/models/household';
import type { UserDocument } from '../../src/types/user';

describe('Household Model Tests', () => {
  describe('Schema Validation', () => {
    it('should create a household with valid data', async () => {
      const householdData = {
        name: 'Test Household',
        description: 'A test household',
        ownerId: new Types.ObjectId(),
        members: [new Types.ObjectId()],
      };

      const household = new Household(householdData);
      const savedHousehold = await household.save();

      expect(savedHousehold.name).toBe(householdData.name);
      expect(savedHousehold.description).toBe(householdData.description);
      expect(savedHousehold.ownerId).toEqual(householdData.ownerId);
      expect(savedHousehold.members).toHaveLength(1);
    });

    it('should require name field', async () => {
      const householdData = {
        ownerId: new Types.ObjectId(),
        members: [new Types.ObjectId()],
      };

      const household = new Household(householdData);
      await expect(household.save()).rejects.toThrow();
    });

    it('should require ownerId field', async () => {
      const householdData = {
        name: 'Test Household',
        members: [new Types.ObjectId()],
      };

      const household = new Household(householdData);
      await expect(household.save()).rejects.toThrow();
    });

    it('should have a members field', async () => {
      const householdData = {
        name: 'Test Household',
        ownerId: new Types.ObjectId(),
      };

      const household = new Household(householdData);
      const res = await household.save();
      expect(Array.isArray(res.members)).toBe(true);
      expect(res.members.length).toEqual(0);
    });
  });

  describe('Static Methods', () => {
    describe('createHousehold', () => {
      it('should create household with owner as member', async () => {
        const ownerId = new Types.ObjectId().toString();
        const household = await Household.createHousehold('My House', ownerId, 'Test description');

        expect(household.name).toBe('My House');
        expect(household.description).toBe('Test description');
        expect(household.ownerId.toString()).toBe(ownerId);
        expect(household.members).toHaveLength(1);
        expect(household.members[0].toString()).toBe(ownerId);
      });

      it('should create household without description', async () => {
        const ownerId = new Types.ObjectId().toString();
        const household = await Household.createHousehold('My House', ownerId);

        expect(household.name).toBe('My House');
        expect(household.description).toBeUndefined();
        expect(household.members[0].toString()).toBe(ownerId);
      });
    });

    describe('findByMember', () => {
      let household: HouseholdDocument;
      let memberId: string;

      beforeEach(async () => {
        memberId = new Types.ObjectId().toString();
        household = await Household.createHousehold('Test House', memberId);
      });

      it('should find households by member ID', async () => {
        const households = await Household.findByMember(memberId);

        expect(households).toHaveLength(1);
        expect(households[0]._id.toString()).toBe(household._id.toString());
      });

      it('should return empty array for non-member', async () => {
        const nonMemberId = new Types.ObjectId().toString();
        const households = await Household.findByMember(nonMemberId);

        expect(households).toHaveLength(0);
      });
    });

    describe('findByOwner', () => {
      let household: HouseholdDocument;
      let ownerId: string;

      beforeEach(async () => {
        ownerId = new Types.ObjectId().toString();
        household = await Household.createHousehold('Owner House', ownerId);
      });

      it('should find households by owner ID', async () => {
        const households = await Household.findByOwner(ownerId);

        expect(households).toHaveLength(1);
        expect(households[0]._id.toString()).toBe(household._id.toString());
      });

      it('should return empty array for non-owner', async () => {
        const nonOwnerId = new Types.ObjectId().toString();
        const households = await Household.findByOwner(nonOwnerId);

        expect(households).toHaveLength(0);
      });
    });
  });

  describe('Instance Methods', () => {
    let household: HouseholdDocument;
    let user: UserDocument;

    beforeEach(async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      user = await User.createUser(userData);
      household = await Household.createHousehold('Test House', user._id.toString());
    });

    describe('hasMember', () => {
      it('should return true for existing member', () => {
        const result = household.hasMember(user._id.toString());
        expect(result).toBe(true);
      });

      it('should return false for non-member', () => {
        const nonMemberId = new Types.ObjectId().toString();
        const result = household.hasMember(nonMemberId);
        expect(result).toBe(false);
      });
    });

    describe('addMember', () => {
      let newUser: UserDocument;

      beforeEach(async () => {
        const userData = {
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        };
        newUser = await User.createUser(userData);
      });

      it('should add new member with role', async () => {
        await household.addMember(newUser._id.toString(), 'admin');

        // Check household was updated
        expect(household.members).toHaveLength(2);
        expect(household.members.map(id => id.toString())).toContain(newUser._id.toString());

        // Check user was updated
        const updatedUser = await User.findById(newUser._id);
        expect(updatedUser?.householdRoles.get(household._id.toString())).toBe('admin');
      });

      it('should throw error if user is already a member', async () => {
        await expect(
          household.addMember(user._id.toString(), 'admin')
        ).rejects.toThrow('User is already a member');
      });

      it('should throw error if user does not exist', async () => {
        const fakeUserId = new Types.ObjectId().toString();
        await expect(
          household.addMember(fakeUserId, 'member')
        ).rejects.toThrow('User not found');
      });
    });
  });

  describe('Type Safety', () => {
    it('should maintain proper typing for static methods', async () => {
      const ownerId = new Types.ObjectId().toString();
      
      // These should compile without type errors
      const household = await Household.createHousehold('Type Test', ownerId);
      const byMember = await Household.findByMember(ownerId);
      const byOwner = await Household.findByOwner(ownerId);

      // Type assertions to ensure return types are correct
      expect(household).toBeInstanceOf(Object);
      expect(Array.isArray(byMember)).toBe(true);
      expect(Array.isArray(byOwner)).toBe(true);
    });
  });
});