// =============================================================================
// Testing Utilities
// =============================================================================

import { mockPassportSuccess } from "./passportMocks";
import { MockUserOptions, createMockUser, MockHouseholdOptions, createTestUserWithHousehold } from "./testDataUtils";

/**
 * Set up a mock authenticated user for testing
 * Combines creating mock user data with passport mocking
 */
export const setupMockAuth = (userOptions: MockUserOptions = {}) => {
  const mockUser = createMockUser(userOptions);
  mockPassportSuccess(mockUser);
  return mockUser;
};

/**
 * Set up test data in the database and mock authentication
 * Returns real database objects and sets up authentication
 */
export const setupTestUserAuth = async (
  userOptions: MockUserOptions = {},
  householdOptions: Omit<MockHouseholdOptions, 'ownerId'> = {}
) => {
  const { user, household } = await createTestUserWithHousehold(userOptions, householdOptions);
  const safeUser = user.toSafeObject();
  mockPassportSuccess(safeUser);
  
  return { user, household, safeUser };
};