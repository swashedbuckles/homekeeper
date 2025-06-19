import { beforeEach, describe, expect, it } from 'vitest';
import { Types } from 'mongoose';

import { Household } from '../../src/models/household';
import { User } from '../../src/models/user';
import type { HouseholdDocument } from '../../src/models/household';
import type { UserDocument } from '../../src/models/user';

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
        // Create a real user first
        const userData = {
          email: 'owner@example.com',
          password: 'password123',
          name: 'Owner User',
        };
        const user = await User.createUser(userData);

        const household = await Household.createHousehold('My House', user._id.toString(), 'Test description');

        expect(household.name).toBe('My House');
        expect(household.description).toBe('Test description');
        expect(household.ownerId.toString()).toBe(user._id.toString());
        expect(household.members).toHaveLength(1);
        expect(household.members[0].toString()).toBe(user._id.toString());

        // Verify the user has the owner role
        const updatedUser = await User.findById(user._id);
        expect(updatedUser?.householdRoles.get(household._id.toString())).toBe('owner');
      });

      it('should create household without description', async () => {
        // Create a real user first
        const userData = {
          email: 'owner2@example.com',
          password: 'password123',
          name: 'Owner User 2',
        };
        const user = await User.createUser(userData);

        const household = await Household.createHousehold('My House', user._id.toString());

        expect(household.name).toBe('My House');
        expect(household.description).toBeUndefined();
        expect(household.members[0].toString()).toBe(user._id.toString());

        // Verify the user has the owner role
        const updatedUser = await User.findById(user._id);
        expect(updatedUser?.householdRoles.get(household._id.toString())).toBe('owner');
      });
    });

    describe('findByMember', () => {
      let household: HouseholdDocument;
      let user: UserDocument;

      beforeEach(async () => {
        // Create a real user first
        const userData = {
          email: 'member@example.com',
          password: 'password123',
          name: 'Member User',
        };
        user = await User.createUser(userData);
        household = await Household.createHousehold('Test House', user._id.toString());
      });

      it('should find households by member ID', async () => {
        const households = await Household.findByMember(user._id.toString());

        expect(households).toHaveLength(1);
        expect(households[0]._id.toString()).toBe(household._id.toString());
      });

      it('should return empty array for non-member', async () => {
        // Create another user who is not a member
        const nonMemberData = {
          email: 'nonmember@example.com',
          password: 'password123',
          name: 'Non Member',
        };
        const nonMemberUser = await User.createUser(nonMemberData);

        const households = await Household.findByMember(nonMemberUser._id.toString());

        expect(households).toHaveLength(0);
      });
    });

    describe('findByOwner', () => {
      let household: HouseholdDocument;
      let user: UserDocument;

      beforeEach(async () => {
        // Create a real user first
        const userData = {
          email: 'owner3@example.com',
          password: 'password123',
          name: 'Owner User 3',
        };
        user = await User.createUser(userData);
        household = await Household.createHousehold('Owner House', user._id.toString());
      });

      it('should find households by owner ID', async () => {
        const households = await Household.findByOwner(user._id.toString());

        expect(households).toHaveLength(1);
        expect(households[0]._id.toString()).toBe(household._id.toString());
      });

      it('should return empty array for non-owner', async () => {
        // Create another user who is not an owner
        const nonOwnerData = {
          email: 'nonowner@example.com',
          password: 'password123',
          name: 'Non Owner',
        };
        const nonOwnerUser = await User.createUser(nonOwnerData);

        const households = await Household.findByOwner(nonOwnerUser._id.toString());

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

    describe('getMembers', () => {
      it('should return user membership information', async () => {
        // Add another member to test multiple users
        const newUserData = {
          email: 'member2@example.com',
          password: 'password123',
          name: 'Member Two',
        };
        const newUser = await User.createUser(newUserData);
        await household.addMember(newUser._id.toString(), 'admin');

        const members = await household.getMembers();

        expect(members).toHaveLength(2);

        // Check that we get the expected structure
        const ownerMember = members.find(m => m.id === user._id.toString());
        const adminMember = members.find(m => m.id === newUser._id.toString());

        expect(ownerMember).toEqual({
          id: user._id.toString(),
          name: user.name,
          role: 'owner'
        });

        expect(adminMember).toEqual({
          id: newUser._id.toString(),
          name: newUser.name,
          role: 'admin'
        });
      });

      it('should throw an error if a userId is present but User document is missing household role', async () => {
        // Create a user and add them to the household members array
        const userData = {
          email: 'corruptdata@example.com',
          password: 'password123',
          name: 'Corrupt Data User',
        };
        const corruptUser = await User.createUser(userData);

        // Manually add them to members without setting up the household role
        // (simulating data corruption or partial operation failure)
        household.members.push(corruptUser._id);
        await household.save();

        await expect(household.getMembers()).rejects.toThrow('User missing household role');
      });
    });

    describe('removeMember', () => {
      let memberUser: UserDocument;

      beforeEach(async () => {
        // Create and add a member to remove
        const memberData = {
          email: 'removeme@example.com',
          password: 'password123',
          name: 'Remove Me',
        };
        memberUser = await User.createUser(memberData);
        await household.addMember(memberUser._id.toString(), 'member');
      });

      it('should remove the user from members array', async () => {
        const initialMemberCount = household.members.length;
        expect(household.hasMember(memberUser._id.toString())).toBe(true);

        await household.removeMember(memberUser._id.toString());

        expect(household.members).toHaveLength(initialMemberCount - 1);
        expect(household.hasMember(memberUser._id.toString())).toBe(false);
      });

      it('should remove the household from user roles map', async () => {
        // Verify the user has the household role before removal
        const userBeforeRemoval = await User.findById(memberUser._id);
        expect(userBeforeRemoval?.householdRoles.get(household._id.toString())).toBe('member');

        await household.removeMember(memberUser._id.toString());

        // Verify the user no longer has the household role
        const userAfterRemoval = await User.findById(memberUser._id);
        expect(userAfterRemoval?.householdRoles.get(household._id.toString())).toBeUndefined();
      });

      it('should throw if the user is not a member', async () => {
        // Create a user who is not a member
        const nonMemberData = {
          email: 'notamember@example.com',
          password: 'password123',
          name: 'Not A Member',
        };
        const nonMemberUser = await User.createUser(nonMemberData);

        await expect(
          household.removeMember(nonMemberUser._id.toString())
        ).rejects.toThrow('User is already not a member');
      });

      it('should throw if the user can not be found', async () => {
        // Create a user and add them to the household
        const userData = {
          email: 'willbedeleted@example.com',
          password: 'password123',
          name: 'Will Be Deleted',
        };
        const userToDelete = await User.createUser(userData);
        await household.addMember(userToDelete._id.toString(), 'member');

        // Verify they're in the members array
        expect(household.hasMember(userToDelete._id.toString())).toBe(true);

        // Delete the user document directly from the database (simulating corruption)
        await User.findByIdAndDelete(userToDelete._id);

        // Now try to remove the member - should throw because user document doesn't exist
        await expect(
          household.removeMember(userToDelete._id.toString())
        ).rejects.toThrow('User not found');
      });
    });
  });

  describe('Type Safety', () => {
    it('should maintain proper typing for static methods', async () => {
      // Create a real user first
      const userData = {
        email: 'typesafety@example.com',
        password: 'password123',
        name: 'Type Safety User',
      };
      const user = await User.createUser(userData);

      // These should compile without type errors
      const household = await Household.createHousehold('Type Test', user._id.toString());
      const byMember = await Household.findByMember(user._id.toString());
      const byOwner = await Household.findByOwner(user._id.toString());

      // Type assertions to ensure return types are correct
      expect(household).toBeInstanceOf(Object);
      expect(Array.isArray(byMember)).toBe(true);
      expect(Array.isArray(byOwner)).toBe(true);
    });
  });
});