import fetchMock from '@fetch-mock/vitest';
import { expect } from 'vitest';
import { ApiError } from '../../src/lib/types/apiError';

/**
 * @fileoverview API testing utilities for consistent mocking and assertion patterns.
 * These helpers standardize API testing across all service layer tests, providing
 * consistent patterns for success responses, error handling, and network failures.
 * 
 * @example
 * ```typescript
 * import { mockApiSuccess, expectApiSuccess } from '@/tests/helpers/apiTestHelpers';
 * 
 * // Mock a successful API response
 * mockApiSuccess('/households', { id: '123', name: 'My House' });
 * 
 * // Test the API call and verify response
 * await expectApiSuccess(() => getHouseholds(), expectedData);
 * ```
 */

/**
 * Mocks a successful API response with 200 status
 * @param endpoint - API endpoint path to mock
 * @param data - Response data to return
 * @param message - Optional success message
 * @example
 * ```typescript
 * const household = { id: 'house-1', name: 'Test House', ownerId: 'user-123' };
 * mockApiSuccess('/households', household, 'Household retrieved successfully');
 * ```
 */
export const mockApiSuccess = <T>(endpoint: string, data: T, message = 'Success') => {
  return fetchMock.route({
    url: `path:${endpoint}`,
    allowRelativeUrls: true,
    response: { data, message }
  });
};

/**
 * Mocks a successful API creation response with 201 status
 * @param endpoint - API endpoint path to mock
 * @param data - Response data to return
 * @param message - Optional creation message
 * @example
 * ```typescript
 * const newTask = { id: 'task-1', title: 'Clean filters', status: 'pending' };
 * mockApiCreated('/tasks', newTask, 'Task created successfully');
 * ```
 */
export const mockApiCreated = <T>(endpoint: string, data: T, message = 'Created') => {
  return fetchMock.route({
    url: `path:${endpoint}`,
    allowRelativeUrls: true,
    response: {
      status: 201,
      body: { data, message }
    }
  });
};

/**
 * Mocks an API error response with specified status code
 * @param endpoint - API endpoint path to mock
 * @param statusCode - HTTP status code for the error
 * @param error - Error message to return
 * @example
 * ```typescript
 * mockApiError('/households/invalid-id', 404, 'Household not found');
 * mockApiError('/tasks', 403, 'Insufficient permissions');
 * ```
 */
export const mockApiError = (endpoint: string, statusCode: number, error: string) => {
  return fetchMock.route({
    url: `path:${endpoint}`,
    allowRelativeUrls: true,
    response: {
      status: statusCode,
      body: { error }
    }
  });
};

/**
 * Mocks a network-level error (connection failure, timeout, etc.)
 * @param endpoint - API endpoint path to mock
 * @param errorMessage - Network error message
 * @example
 * ```typescript
 * mockNetworkError('/households', 'Connection timeout');
 * mockNetworkError('/auth/login', 'DNS resolution failed');
 * ```
 */
export const mockNetworkError = (endpoint: string, errorMessage = 'Network Error') => {
  return fetchMock.route({
    url: `path:${endpoint}`,
    allowRelativeUrls: true,
    response: Promise.reject(new Error(errorMessage))
  });
};

/**
 * Asserts that an API call returns expected successful data
 * @param apiCall - Function that makes the API call
 * @param expectedData - Data that should be returned
 * @example
 * ```typescript
 * const expectedHouseholds = [{ id: 'house-1', name: 'Test House' }];
 * await expectApiSuccess(() => getHouseholds(), expectedHouseholds);
 * ```
 */
export const expectApiSuccess = async <T>(
  apiCall: () => Promise<{ data: T }>,
  expectedData: T
) => {
  const result = await apiCall();
  expect(result.data).toEqual(expectedData);
};

/**
 * Asserts that an API call throws an ApiError with specific details
 * @param apiCall - Function that makes the API call
 * @param expectedStatusCode - Expected HTTP status code
 * @param expectedMessage - Expected error message
 * @example
 * ```typescript
 * await expectApiError(
 *   () => getHousehold('invalid-id'), 
 *   404, 
 *   'Household not found'
 * );
 * ```
 */
export const expectApiError = async (
  apiCall: () => Promise<any>,
  expectedStatusCode: number,
  expectedMessage: string
) => {
  await expect(apiCall()).rejects.toThrow(ApiError);
  
  try {
    await apiCall();
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).statusCode).toBe(expectedStatusCode);
    expect((error as ApiError).message).toBe(expectedMessage);
  }
};

/**
 * Asserts that an API call throws a network-level error
 * @param apiCall - Function that makes the API call
 * @param expectedMessage - Expected error message
 * @example
 * ```typescript
 * await expectNetworkError(
 *   () => getHouseholds(), 
 *   'Connection timeout'
 * );
 * ```
 */
export const expectNetworkError = async (
  apiCall: () => Promise<any>,
  expectedMessage = 'Network Error'
) => {
  await expect(apiCall()).rejects.toThrow(expectedMessage);
};

// Request verification helpers

/**
 * Verifies that the most recent API call used the expected HTTP method.
 * This helper is essential for ensuring API calls are using the correct HTTP verbs
 * (GET, POST, PUT, DELETE, etc.) as expected by the server endpoints.
 * 
 * @param method - The expected HTTP method (case-insensitive)
 * 
 * @example
 * ```typescript
 * // Test that creating a household uses POST
 * mockApiSuccess('/households', newHousehold);
 * await createHousehold(householdData);
 * expectLastCallToHaveMethod('POST');
 * 
 * // Test that updating a task uses PUT
 * mockApiSuccess('/tasks/task-123', updatedTask);
 * await updateTask('task-123', taskData);
 * expectLastCallToHaveMethod('PUT');
 * 
 * // Test that deleting uses DELETE
 * mockApiSuccess('/households/house-123', {});
 * await deleteHousehold('house-123');
 * expectLastCallToHaveMethod('DELETE');
 * ```
 * 
 * @throws {AssertionError} When the actual HTTP method doesn't match expected method
 */
export const expectLastCallToHaveMethod = (method: string) => {
  const lastCall = fetchMock.callHistory.lastCall();
  expect(lastCall?.options.method).toEqual(method.toLowerCase());
};

/**
 * Verifies that the most recent API call included the expected request body.
 * This helper ensures that POST/PUT requests are sending the correct data payload
 * to the server, validating both structure and content of the request body.
 * 
 * @param expectedBody - The expected request body object
 * 
 * @example
 * ```typescript
 * // Test household creation with correct data
 * const householdData = { name: 'My House', description: 'Family home' };
 * mockApiCreated('/households', newHousehold);
 * await createHousehold(householdData);
 * expectLastCallToHaveBody(householdData);
 * 
 * // Test task update with partial data
 * const updateData = { status: 'completed', completedAt: '2024-01-15' };
 * mockApiSuccess('/tasks/task-123', updatedTask);
 * await updateTaskStatus('task-123', updateData);
 * expectLastCallToHaveBody(updateData);
 * 
 * // Test user profile update
 * const profileData = { displayName: 'John Doe', email: 'john@example.com' };
 * mockApiSuccess('/users/profile', updatedProfile);
 * await updateUserProfile(profileData);
 * expectLastCallToHaveBody(profileData);
 * ```
 * 
 * @throws {AssertionError} When the actual request body doesn't match expected body
 */
export const expectLastCallToHaveBody = (expectedBody: Record<string, any>) => {
  const lastCall = fetchMock.callHistory.lastCall();
  expect(JSON.parse(lastCall?.options.body as string)).toEqual(expectedBody);
};

/**
 * Verifies that the most recent API call included the expected request headers.
 * This helper is crucial for testing authentication, content-type, and other
 * HTTP headers that affect API behavior and security.
 * 
 * @param expectedHeaders - Object containing expected header key-value pairs
 * 
 * @example
 * ```typescript
 * // Test authentication header is included
 * const authHeaders = { 'Authorization': 'Bearer token-123' };
 * mockApiSuccess('/households', households);
 * await getHouseholds();
 * expectLastCallToHaveHeaders(authHeaders);
 * 
 * // Test content-type for JSON requests
 * const jsonHeaders = { 'Content-Type': 'application/json' };
 * mockApiCreated('/tasks', newTask);
 * await createTask(taskData);
 * expectLastCallToHaveHeaders(jsonHeaders);
 * 
 * // Test multiple headers at once
 * const multipleHeaders = {
 *   'Authorization': 'Bearer token-123',
 *   'Content-Type': 'application/json',
 *   'X-Request-ID': 'req-456'
 * };
 * mockApiSuccess('/users/profile', userProfile);
 * await updateUserProfile(profileData);
 * expectLastCallToHaveHeaders(multipleHeaders);
 * ```
 * 
 * @throws {AssertionError} When any expected header is missing or has wrong value
 */
export const expectLastCallToHaveHeaders = (expectedHeaders: Record<string, string>) => {
  const lastCall = fetchMock.callHistory.lastCall();
  const headers = lastCall?.options.headers as Record<string, string>;
  Object.entries(expectedHeaders).forEach(([key, value]) => {
    expect(headers[key]).toBe(value);
  });
};

// Common test scenario factories

/**
 * Factory function that creates a complete test scenario for successful API operations.
 * This factory standardizes the pattern of setting up mocks, making API calls, and
 * verifying both the response data and request details. It's particularly useful for
 * reducing boilerplate in test suites that follow similar patterns.
 * 
 * @template T - The type of data expected in the API response
 * @param description - Human-readable description of what this test scenario covers
 * @param endpoint - API endpoint path that will be mocked
 * @param mockData - The data that the mocked endpoint should return
 * @param apiCall - Function that makes the actual API call to be tested
 * @param expectedRequestBody - Optional expected request body for POST/PUT operations
 * @returns Test scenario object with description, setup, and test functions
 * 
 * @example
 * ```typescript
 * // Create a success test for household creation
 * const newHousehold = { id: 'house-1', name: 'Test House', ownerId: 'user-123' };
 * const householdData = { name: 'Test House', description: 'My family home' };
 * 
 * const createHouseholdTest = createSuccessTest(
 *   'should create household with valid data',
 *   '/households',
 *   newHousehold,
 *   () => createHousehold(householdData),
 *   householdData
 * );
 * 
 * // Use in a test suite
 * describe('Household API', () => {
 *   beforeEach(() => {
 *     fetchMock.reset();
 *     createHouseholdTest.setup();
 *   });
 * 
 *   it(createHouseholdTest.description, createHouseholdTest.test);
 * });
 * 
 * // Create a success test for data retrieval (no request body)
 * const getHouseholdsTest = createSuccessTest(
 *   'should fetch all households',
 *   '/households',
 *   [household1, household2],
 *   () => getHouseholds()
 * );
 * ```
 * 
 * @remarks
 * - Automatically sets up API mock with successful response
 * - Verifies response data matches expected mock data
 * - Assumes POST method by default (override if needed)
 * - Optionally verifies request body content
 * - Reduces test boilerplate and ensures consistent testing patterns
 */
export const createSuccessTest = <T>(
  description: string,
  endpoint: string,
  mockData: T,
  apiCall: () => Promise<{ data: T }>,
  expectedRequestBody?: Record<string, any>
) => {
  return {
    description,
    setup: () => mockApiSuccess(endpoint, mockData),
    test: async () => {
      await expectApiSuccess(apiCall, mockData);
      expectLastCallToHaveMethod('post');
      if (expectedRequestBody) {
        expectLastCallToHaveBody(expectedRequestBody);
      }
    }
  };
};

/**
 * Factory function that creates a complete test scenario for API error responses.
 * This factory standardizes testing of error conditions, ensuring consistent
 * validation of error status codes, messages, and exception types across all
 * API error scenarios in the HomeKeeper application.
 * 
 * @param description - Human-readable description of the error scenario being tested
 * @param endpoint - API endpoint path that will be mocked to return an error
 * @param statusCode - HTTP status code that should be returned (400, 401, 403, 404, 500, etc.)
 * @param errorMessage - Error message that should be included in the response
 * @param apiCall - Function that makes the API call expected to fail
 * @returns Test scenario object with description, setup, and test functions
 * 
 * @example
 * ```typescript
 * // Test household not found error
 * const notFoundTest = createErrorTest(
 *   'should throw 404 error when household does not exist',
 *   '/households/invalid-id',
 *   404,
 *   'Household not found',
 *   () => getHousehold('invalid-id')
 * );
 * 
 * // Test unauthorized access
 * const unauthorizedTest = createErrorTest(
 *   'should throw 401 error when token is invalid',
 *   '/households',
 *   401,
 *   'Invalid authentication token',
 *   () => getHouseholds()
 * );
 * 
 * // Test validation errors
 * const validationTest = createErrorTest(
 *   'should throw 400 error when required fields are missing',
 *   '/households',
 *   400,
 *   'Name is required',
 *   () => createHousehold({ description: 'Missing name' })
 * );
 * 
 * // Use in test suite
 * describe('Error Handling', () => {
 *   beforeEach(() => {
 *     fetchMock.reset();
 *   });
 * 
 *   it(notFoundTest.description, async () => {
 *     notFoundTest.setup();
 *     await notFoundTest.test();
 *   });
 * });
 * ```
 * 
 * @remarks
 * - Automatically sets up API mock to return specified error response
 * - Verifies that ApiError is thrown with correct status code and message
 * - Ensures consistent error handling testing across all API operations
 * - Useful for testing validation errors, authentication failures, and resource not found scenarios
 */
export const createErrorTest = (
  description: string,
  endpoint: string,
  statusCode: number,
  errorMessage: string,
  apiCall: () => Promise<any>
) => {
  return {
    description,
    setup: () => mockApiError(endpoint, statusCode, errorMessage),
    test: () => expectApiError(apiCall, statusCode, errorMessage)
  };
};

/**
 * Factory function that creates a complete test scenario for network-level failures.
 * This factory standardizes testing of network connectivity issues, timeouts, and
 * other infrastructure-level errors that can occur when the API server is unreachable
 * or experiencing connectivity problems.
 * 
 * @param description - Human-readable description of the network failure scenario
 * @param endpoint - API endpoint path that will be mocked to simulate network failure
 * @param apiCall - Function that makes the API call expected to fail with network error
 * @param errorMessage - Optional custom error message (defaults to 'Network Error')
 * @returns Test scenario object with description, setup, and test functions
 * 
 * @example
 * ```typescript
 * // Test connection timeout
 * const timeoutTest = createNetworkErrorTest(
 *   'should handle connection timeout gracefully',
 *   '/households',
 *   () => getHouseholds(),
 *   'Connection timeout'
 * );
 * 
 * // Test DNS resolution failure
 * const dnsTest = createNetworkErrorTest(
 *   'should handle DNS resolution failure',
 *   '/tasks',
 *   () => getTasks(),
 *   'DNS resolution failed'
 * );
 * 
 * // Test generic network error with default message
 * const genericTest = createNetworkErrorTest(
 *   'should handle network connectivity issues',
 *   '/users/profile',
 *   () => getUserProfile()
 *   // Uses default 'Network Error' message
 * );
 * 
 * // Test server unreachable
 * const serverDownTest = createNetworkErrorTest(
 *   'should handle server unavailable',
 *   '/households/house-123',
 *   () => deleteHousehold('house-123'),
 *   'Server unreachable'
 * );
 * 
 * // Use in test suite
 * describe('Network Error Handling', () => {
 *   beforeEach(() => {
 *     fetchMock.reset();
 *   });
 * 
 *   it(timeoutTest.description, async () => {
 *     timeoutTest.setup();
 *     await timeoutTest.test();
 *   });
 * });
 * ```
 * 
 * @remarks
 * - Simulates actual network-level failures rather than HTTP error responses
 * - Tests that the application gracefully handles connectivity issues
 * - Useful for testing offline scenarios and poor network conditions
 * - Verifies that network errors are properly propagated and handled
 * - Essential for robust error handling in production environments
 */
export const createNetworkErrorTest = (
  description: string,
  endpoint: string,
  apiCall: () => Promise<any>,
  errorMessage = 'Network Error'
) => {
  return {
    description,
    setup: () => mockNetworkError(endpoint, errorMessage),
    test: () => expectNetworkError(apiCall, errorMessage)
  };
};