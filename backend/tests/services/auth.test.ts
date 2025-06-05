import { beforeEach, describe, expect, it } from 'vitest';

import { User } from '../../src/models/user';
import {
  type RegistrationParams,
  changePassword,
  login,
  register,
} from '../../src/services/auth';

describe('Authentication Service', () => {
  describe('register', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      const result = await register(userData);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(result.user['password']).toBeUndefined();

      const savedUser = await User.findByEmail(userData.email);
      expect(savedUser).toBeTruthy();
      expect(savedUser?.email).toBe(userData.email);
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'First User',
      };

      await register(userData);

      const duplicateData = {
        ...userData,
        name: 'Second User',
      };

      await expect(register(duplicateData)).rejects.toThrow();
    });

    it('should throw error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Invalid Email User',
      };

      await expect(register(userData)).rejects.toThrow();
    });

    it('should throw error for missing required fields', async () => {
      await expect(
        register({
          password: 'password123',
          name: 'No Email User',
        } as RegistrationParams),
      ).rejects.toThrow();

      await expect(
        register({
          email: 'noemail@example.com',
          name: 'No Password User',
        } as RegistrationParams),
      ).rejects.toThrow();

      await expect(
        register({
          email: 'noname@example.com',
          password: 'password123',
        } as RegistrationParams),
      ).rejects.toThrow();
    });

    it('should hash password before storing', async () => {
      const userData = {
        email: 'hashtest@example.com',
        password: 'password123',
        name: 'Hash Test User',
      };

      await register(userData);

      const savedUser = await User.findByEmail(userData.email);
      expect(savedUser).toBeTruthy();
      expect(savedUser?.password).not.toBe(userData.password);
      expect(savedUser?.password.length).toBeGreaterThan(userData.password.length);
    });
  });

  describe('login', () => {
    const testUser = {
      email: 'logintest@example.com',
      password: 'password123',
      name: 'Login Test User',
    };

    beforeEach(async () => {
      await register(testUser);
    });

    it('should successfully login with correct credentials', async () => {
      const result = await login(testUser.email, testUser.password);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(testUser.email);
      expect(result.user.name).toBe(testUser.name);

      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(result.user['password']).toBeUndefined();
    });

    it('should throw error for non-existent email', async () => {
      await expect(login('nonexistent@example.com', 'password123')).rejects.toThrow();
    });

    it('should throw error for incorrect password', async () => {
      await expect(login(testUser.email, 'wrongpassword')).rejects.toThrow();
    });

    it('should throw error for empty email', async () => {
      await expect(login('', testUser.password)).rejects.toThrow();
    });

    it('should throw error for empty password', async () => {
      await expect(login(testUser.email, '')).rejects.toThrow();
    });
  });

  describe('changePassword', () => {
    const testUser = {
      email: 'changepass@example.com',
      password: 'oldpassword123',
      name: 'Change Password User',
    };
    let userId: string;

    beforeEach(async () => {
      const result = await register(testUser);
      userId = result.user._id.toString();
    });

    it('should successfully change password with correct old password', async () => {
      const newPassword = 'newpassword456';

      const result = await changePassword(userId, testUser.password, newPassword);

      expect(result).toBeDefined();
      const loginResult = await login(testUser.email, newPassword);
      expect(loginResult.user.email).toBe(testUser.email);

      await expect(login(testUser.email, testUser.password)).rejects.toThrow();
    });

    it('should throw error for incorrect old password', async () => {
      const newPassword = 'newpassword456';

      await expect(changePassword(userId, 'wrongoldpassword', newPassword)).rejects.toThrow();
    });

    it('should throw error for non-existent user', async () => {
      const fakeUserId = '507f1f77bcf86cd799439011';
      const newPassword = 'newpassword456';

      await expect(
        changePassword(fakeUserId, testUser.password, newPassword),
      ).rejects.toThrow();
    });

    it('should throw error for invalid user ID', async () => {
      const invalidUserId = 'invalid-id';
      const newPassword = 'newpassword456';

      await expect(
        changePassword(invalidUserId, testUser.password, newPassword),
      ).rejects.toThrow();
    });

    it('should throw error for empty old password', async () => {
      const newPassword = 'newpassword456';

      await expect(changePassword(userId, '', newPassword)).rejects.toThrow();
    });

    it('should throw error for empty new password', async () => {
      await expect(changePassword(userId, testUser.password, '')).rejects.toThrow();
    });

    it('should hash new password properly', async () => {
      const newPassword = 'newhashedpassword789';

      await changePassword(userId, testUser.password, newPassword);

      const user = await User.findById(userId);
      expect(user).toBeTruthy();
      expect(user?.password).not.toBe(newPassword);
      expect(user?.password.length).toBeGreaterThan(newPassword.length);
      expect(user?.password).toMatch(/^\$2[ayb]\$\d+\$/);
    });

    it('should update password in database', async () => {
      const newPassword = 'databaseupdatetest';

      const originalUser = await User.findById(userId);
      const originalPasswordHash = originalUser?.password;

      await changePassword(userId, testUser.password, newPassword);

      const updatedUser = await User.findById(userId);
      expect(updatedUser?.password).not.toBe(originalPasswordHash);
    });
  });
});
