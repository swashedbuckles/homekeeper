import { describe, it, expect, beforeEach } from 'vitest';
import { User } from '../../src/models/user';
import { UserDocument } from '../../src/models/user.d';
import becrypt from 'bcryptjs';

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
        name: 'Test User'
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should require password field', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should require name field', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      // Create first user
      const user1 = new User(userData);
      await user1.save();

      // Try to create second user with same email
      const user2 = new User({
        ...userData,
        name: 'Another User'
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
          name: 'Test User'
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
          name: 'Test User'
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
          name: 'Test User'
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
          password: 'password1234'
        };

        const user = await User.createUser(userData);

        expect(user.email).toBe(userData.email);
        expect(user.name).toBe(userData.name);
        expect(user.password).not.toBe(userData.password);

        const foundUser = await User.findById(user._id);
        expect(foundUser).toBeTruthy();
        expect(foundUser!.email).toBe(userData.email);
      });

      it('should not bypass validations', async () => {
        const userData = {
          email: 'email-invalid',
          password: 'password',
          name: 'invalid'
        }

        await expect(User.createUser(userData)).rejects.toThrow();
      });
    });

    describe('findByEmail', () => {
      beforeEach(async () => {
        const userData = {
          email: 'findme@example.com',
          password: 'password123',
          name: 'Claude Raines'
        };

        await User.createUser(userData);
      });

      it('should find user by email', async () => {
        const user = await User.findByEmail('findme@example.com');

        expect(user).toBeTruthy();
        expect(user!.email).toBe('findme@example.com');
        expect(user!.name).toBe('Claude Raines');
      });

      it('should return null for non-existent email', async () => {
        const user = await User.findByEmail('nonexistent@example.com');
        expect(user).toBeNull();
      });

      it('should not be case-sensitive for email search', async () => {
        const user = await User.findByEmail('FindMe@Example.com');
        expect(user).toBeTruthy();
        expect(user!.email).toBe('findme@example.com');
        expect(user!.name).toBe('Claude Raines');
      });
    });
  });
});