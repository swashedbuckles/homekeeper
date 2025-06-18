import { beforeEach, describe, expect, it } from 'vitest';
import { Types } from 'mongoose';
import { User } from '../../src/models/user';
import type { UserDocument } from '../../src/types/user.d';

describe('User Model Tests', () => {
  describe('Validation', () => {
    it('should be able to create a user with valid data', async () => {
      const userData = {
        email: 'dracula@example.com',
        password: 'bl00d',
        name: 'Dr. Acula',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      // expect(savedUser._id).toBeValidObjectId();
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.password).not.toBe(userData.password);
    });

    it('should require email field', async () => {
      const userData = {
        password: 'password123',
        name: 'Test User',
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should require password field', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should require name field', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Create first user
      const user1 = new User(userData);
      await user1.save();

      // Try to create second user with same email
      const user2 = new User({
        ...userData,
        name: 'Another User',
      });

      await expect(user2.save()).rejects.toThrow();
    });
  });

  describe('Lifecycle Hooks', () => {
    describe('PRE save', () => {
      it('should hash password before saving', async () => {
        const plainPassword = 'password123';
        const userData = {
          email: 'test@example.com',
          password: plainPassword,
          name: 'Test User',
        };

        const user = new User(userData);
        const savedUser = await user.save();

        // Password should be hashed, not plain text
        expect(savedUser.password).not.toBe(plainPassword);
        expect(savedUser.password).toMatch(/^\$2[ayb]\$\d+\$/); // bcrypt hash pattern
      });

      it('should not rehash password if not modified', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        };

        const user = new User(userData);
        const savedUser = await user.save();
        const originalHash = savedUser.password;

        // Update user without changing password
        savedUser.name = 'Updated Name';
        const updatedUser = await savedUser.save();

        // Password hash should remain the same
        expect(updatedUser.password).toBe(originalHash);
      });

      it('should rehash password when password is modified', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        };

        const user = new User(userData);
        const savedUser = await user.save();
        const originalHash = savedUser.password;

        // Update password
        savedUser.password = 'newpassword456';
        const updatedUser = await savedUser.save();

        // Password hash should be different
        expect(updatedUser.password).not.toBe(originalHash);
        expect(updatedUser.password).toMatch(/^\$2[ayb]\$\d+\$/);
      });
    });
  });

  describe('Instance Methods', () => {
    let user: UserDocument;

    beforeEach(async () => {
      const userData = {
        email: 'maptest@example.com',
        password: 'password123',
        name: 'Map Test User',
      };
      user = await User.createUser(userData);
    });

    describe('addHousehold method', () => {
      it('should add household role using Map.set', async () => {
        const householdId = new Types.ObjectId().toString();

        await user.addHouseholdRole(householdId, 'admin');

        // Verify the Map was updated
        expect(user.householdRoles.get(householdId)).toBe('admin');
        expect(user.householdRoles.size).toBe(1);

        // Verify it was persisted
        const reloadedUser = await User.findById(user._id);
        expect(reloadedUser?.householdRoles.get(householdId)).toBe('admin');
      });

      it('should handle multiple household roles', async () => {
        const household1 = new Types.ObjectId().toString();
        const household2 = new Types.ObjectId().toString();

        await user.addHouseholdRole(household1, 'owner');
        await user.addHouseholdRole(household2, 'member');

        expect(user.householdRoles.get(household1)).toBe('owner');
        expect(user.householdRoles.get(household2)).toBe('member');
        expect(user.householdRoles.size).toBe(2);
      });

      it('should update existing household role', async () => {
        const householdId = new Types.ObjectId().toString();

        await user.addHouseholdRole(householdId, 'member');
        expect(user.householdRoles.get(householdId)).toBe('member');

        await user.addHouseholdRole(householdId, 'admin');
        expect(user.householdRoles.get(householdId)).toBe('admin');
        expect(user.householdRoles.size).toBe(1); // Should still be 1
      });
    });

    describe('toSafeObject method', () => {
      it('should convert Map to plain object', async () => {
        const household1 = new Types.ObjectId().toString();
        const household2 = new Types.ObjectId().toString();

        await user.addHouseholdRole(household1, 'owner');
        await user.addHouseholdRole(household2, 'admin');

        const safeUser = user.toSafeObject();

        // Should be a plain object, not a Map
        expect(safeUser.householdRoles).toBeTypeOf('object');
        expect(safeUser.householdRoles).not.toBeInstanceOf(Map);

        // Should contain the right data
        expect(safeUser.householdRoles[household1]).toBe('owner');
        expect(safeUser.householdRoles[household2]).toBe('admin');

        // Should not have password
        expect(safeUser).not.toHaveProperty('password');

        // Should have id instead of _id
        expect(safeUser.id).toBe(user.id);
        expect(safeUser).not.toHaveProperty('_id');
      });

      it('should handle empty household roles', () => {
        const safeUser = user.toSafeObject();

        expect(safeUser.householdRoles).toEqual({});
        expect(typeof safeUser.householdRoles).toBe('object');
      });
    });

    describe('toJSON method', () => {
      it('should return same as toSafeObject', async () => {
        const householdId = new Types.ObjectId().toString();
        await user.addHouseholdRole(householdId, 'member');

        const jsonResult = user.toJSON();
        const safeResult = user.toSafeObject();

        expect(jsonResult).toEqual(safeResult);
        expect(jsonResult.householdRoles[householdId]).toBe('member');
      });
    });

    describe('comparePassword', () => {
      let user: UserDocument;

      beforeEach(async () => {
        const testUser = {
          email: 'tom@example.com',
          password: '1234Aasdf',
          name: 'Tomtomtomtotmtom',
        };

        user = new User(testUser) as UserDocument;
        await user.save();
      });

      it('should return true for correct password', async () => {
        const result = await user.comparePassword('1234Aasdf');
        expect(result).toBe(true);
      });

      it('should return false for incorrect password', async () => {
        const result = await user.comparePassword('nope');
        expect(result).toBe(false);
      });

      it('should handle no password', async () => {
        const empty = await user.comparePassword('');
        expect(empty).toBe(false);
      });
    });
  });

  describe('Static Methods', () => {
    describe('createUser', () => {
      it('should create a user', async () => {
        const userData = {
          email: 'boris.karloff@example.com',
          name: 'Boris Karloff',
          password: 'password1234',
        };

        const user = await User.createUser(userData);

        expect(user.email).toBe(userData.email);
        expect(user.name).toBe(userData.name);
        expect(user.password).not.toBe(userData.password);

        const foundUser = await User.findById(user._id);
        expect(foundUser).toBeTruthy();
        expect(foundUser?.email).toBe(userData.email);
      });

      it('should not bypass validations', async () => {
        const userData = {
          email: 'email-invalid',
          password: 'password',
          name: 'invalid',
        };

        await expect(User.createUser(userData)).rejects.toThrow();
      });
    });

    describe('findByEmail', () => {
      beforeEach(async () => {
        const userData = {
          email: 'findme@example.com',
          password: 'password123',
          name: 'Claude Raines',
        };

        await User.createUser(userData);
      });

      it('should find user by email', async () => {
        const user = await User.findByEmail('findme@example.com');

        expect(user).toBeTruthy();
        expect(user?.email).toBe('findme@example.com');
        expect(user?.name).toBe('Claude Raines');
      });

      it('should return null for non-existent email', async () => {
        const user = await User.findByEmail('nonexistent@example.com');
        expect(user).toBeNull();
      });

      it('should not be case-sensitive for email search', async () => {
        const user = await User.findByEmail('FindMe@Example.com');
        expect(user).toBeTruthy();
        expect(user?.email).toBe('findme@example.com');
        expect(user?.name).toBe('Claude Raines');
      });
    });
  });
});
