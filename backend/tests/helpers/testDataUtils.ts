import { Types } from 'mongoose';
import { User } from '../../src/models/user';
import { Household } from '../../src/models/household';
import type { SafeUser, UserDocument } from '../../src/models/user';
import type { HouseholdDocument } from '../../src/models/household';
import { HouseholdRoles } from '@homekeeper/shared';

// =============================================================================
// CLEAN MOCK DATA GENERATORS (No DB insertion)
// =============================================================================

export interface MockUserOptions {
  id?: string;
  email?: string;
  name?: string;
  householdRoles?: Record<string, HouseholdRoles>;
}

export interface MockHouseholdOptions {
  id?: string;
  name?: string;
  description?: string;
  ownerId?: string;
  members?: string[];
}

/**
 * Create a clean mock user object (no DB insertion)
 * Returns a SafeUser that can be used with mockAuthenticatedUser
 */
export const createMockUser = (options: MockUserOptions = {}): SafeUser => {
  const userId = options.id || new Types.ObjectId().toString();
  
  return {
    id: userId,
    email: options.email || 'test@example.com',
    name: options.name || 'Test User',
    preferences: {
      theme: 'light',
      notifications: { email: true, push: false },
      defaultHouseholdId: undefined
    },
    householdRoles: options.householdRoles || {}
  };
};

/**
 * Create a clean mock household object (no DB insertion)
 * Useful for mocking API responses or setting up test data
 */
export const createMockHousehold = (options: MockHouseholdOptions = {}) => {
  const householdId = options.id || new Types.ObjectId().toString();
  const ownerId = options.ownerId || new Types.ObjectId().toString();
  
  return {
    id: householdId,
    name: options.name || 'Test Household',
    description: options.description || 'A test household',
    ownerId: ownerId,
    members: options.members || [ownerId],
  };
};

// =============================================================================
// DATABASE INSERTION UTILITIES
// =============================================================================

/**
 * Insert a real user into the test database
 * Returns the created UserDocument
 */
export const insertTestUser = async (options: MockUserOptions = {}): Promise<UserDocument> => {
  const userData = {
    email: options.email || 'test@example.com',
    name: options.name || 'Test User',
    password: 'password123' // Default test password
  };

  return User.createUser(userData);
};

/**
 * Insert a real household into the test database
 * Returns the created HouseholdDocument
 */
export const insertTestHousehold = async (
  ownerId: string, 
  options: Omit<MockHouseholdOptions, 'ownerId'> = {}
): Promise<HouseholdDocument> => {
  return Household.createHousehold(
    options.name || 'Test Household',
    ownerId,
    options.description || 'A test household'
  );
};

/**
 * Create a complete test setup with user and household
 * Returns both the user and household documents
 */
export const createTestUserWithHousehold = async (
  userOptions: MockUserOptions = {},
  householdOptions: Omit<MockHouseholdOptions, 'ownerId'> = {}
) => {
  const user = await insertTestUser(userOptions);
  const household = await insertTestHousehold(user.id, householdOptions);
  
  return { user, household };
};