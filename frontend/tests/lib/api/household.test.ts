import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHousehold, getHouseholds, createHousehold, updateHousehold } from '../../../src/lib/api/household';
import { apiRequest } from '../../../src/lib/apiClient';
import { ApiError } from '../../../src/lib/types/apiError';

// Test data factories
const createMockHousehold = (overrides = {}) => ({
  id: 'household-123',
  name: 'Test Household',
  description: 'A test household',
  ...overrides
});

const createApiErrorTest = (statusCode: number, message: string) => ({
  error: new ApiError(statusCode, message),
  expectation: (apiCall: () => Promise<any>) => 
    expect(apiCall()).rejects.toThrow(new ApiError(statusCode, message))
});

// Mock the apiClient
vi.mock('../../../src/lib/apiClient', () => ({
  apiRequest: vi.fn()
}));

const mockApiRequest = vi.mocked(apiRequest);

describe('household API', () => {
  beforeEach(() => {
    mockApiRequest.mockClear();
  });

  describe('getHousehold', () => {
    it('makes correct API call for valid household ID', async () => {
      const mockResponse = { data: createMockHousehold() };
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await getHousehold('household-123');

      expect(mockApiRequest).toHaveBeenCalledWith('/households/household-123');
      expect(result).toEqual(mockResponse);
    });

    const validationTests = [
      { name: 'throws ApiError when household ID is empty string', input: '' },
      { name: 'throws ApiError when household ID is null', input: null as any },
      { name: 'throws ApiError when household ID is undefined', input: undefined as any }
    ];

    validationTests.forEach(({ name, input }) => {
      it(name, () => {
        expect(() => getHousehold(input)).toThrow(ApiError);
        expect(() => getHousehold(input)).toThrow('Missing household');
      });
    });

    it('throws ApiError with correct status code', () => {
      try {
        getHousehold('');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).statusCode).toBe(400);
      }
    });

    it('propagates API request errors', async () => {
      const { error } = createApiErrorTest(404, 'Household not found');
      mockApiRequest.mockRejectedValue(error);

      await expect(getHousehold('nonexistent-id')).rejects.toThrow(error);
    });
  });

  describe('getHouseholds', () => {
    it('makes correct API call to fetch all households', async () => {
      const mockResponse = {data: [
        createMockHousehold({ id: 'household-1', name: 'Household 1' }),
        createMockHousehold({ id: 'household-2', name: 'Household 2' })
      ]};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await getHouseholds();

      expect(mockApiRequest).toHaveBeenCalledWith('/households');
      expect(result).toEqual(mockResponse);
    });

    it('returns empty array when no households exist', async () => {
      mockApiRequest.mockResolvedValue({data: []});

      const result = await getHouseholds();

      expect(result).toEqual({data: []});
    });

    it('propagates API request errors', async () => {
      const { error } = createApiErrorTest(500, 'Server error');
      mockApiRequest.mockRejectedValue(error);

      await expect(getHouseholds()).rejects.toThrow(error);
    });
  });

  describe('createHousehold', () => {
    const createHouseholdTests = [
      {
        name: 'makes correct API call with name only',
        args: ['New Household'] as const,
        expectedBody: { name: 'New Household', description: undefined },
        mockResponse: { data: createMockHousehold({ id: 'new-household-123', name: 'New Household', description: undefined }) }
      },
      {
        name: 'makes correct API call with name and description',
        args: ['Family Home', 'Our cozy family home'] as const,
        expectedBody: { name: 'Family Home', description: 'Our cozy family home' },
        mockResponse: { data: createMockHousehold({ id: 'new-household-456', name: 'Family Home', description: 'Our cozy family home' }) }
      },
      {
        name: 'handles empty description correctly',
        args: ['Test House', ''] as const,
        expectedBody: { name: 'Test House', description: '' },
        mockResponse: { data: createMockHousehold({ id: 'new-household-789', name: 'Test House', description: '' }) }
      }
    ];

    createHouseholdTests.forEach(({ name, args, expectedBody, mockResponse }) => {
      it(name, async () => {
        mockApiRequest.mockResolvedValue(mockResponse);

        const result = await createHousehold(args[0], args[1]);

        expect(mockApiRequest).toHaveBeenCalledWith('/households', {
          method: 'POST',
          body: JSON.stringify(expectedBody)
        });
        if (name.includes('correctly')) {
          // For tests that just verify the call, we don't need to check result
          return;
        }
        expect(result).toEqual(mockResponse);
      });
    });

    it('propagates API request errors', async () => {
      const { error } = createApiErrorTest(400, 'Invalid household data');
      mockApiRequest.mockRejectedValue(error);

      await expect(createHousehold('Test')).rejects.toThrow(error);
    });
  });

  describe('updateHousehold', () => {
    const updateHouseholdTests = [
      {
        name: 'makes correct API call with name only',
        args: ['household-123', 'Updated Household'] as const,
        expectedBody: { name: 'Updated Household', description: undefined },
        mockResponse: { data: createMockHousehold({ name: 'Updated Household', description: undefined }) }
      },
      {
        name: 'makes correct API call with name and description',
        args: ['household-456', 'Updated Family Home', 'Updated description'] as const,
        expectedBody: { name: 'Updated Family Home', description: 'Updated description' },
        mockResponse: { data: createMockHousehold({ id: 'household-456', name: 'Updated Family Home', description: 'Updated description' }) }
      },
      {
        name: 'handles empty description correctly',
        args: ['household-789', 'Test House', ''] as const,
        expectedBody: { name: 'Test House', description: '' },
        mockResponse: { data: createMockHousehold({ id: 'household-789', name: 'Test House', description: '' }) }
      }
    ];

    updateHouseholdTests.forEach(({ name, args, expectedBody, mockResponse }) => {
      it(name, async () => {
        mockApiRequest.mockResolvedValue(mockResponse);

        const result = await updateHousehold(args[0], args[1], args[2]);

        expect(mockApiRequest).toHaveBeenCalledWith(`/households/${args[0]}`, {
          method: 'PUT',
          body: JSON.stringify(expectedBody)
        });
        if (name.includes('correctly')) {
          // For tests that just verify the call, we don't need to check result
          return;
        }
        expect(result).toEqual(mockResponse);
      });
    });

    it('propagates API request errors', async () => {
      const { error } = createApiErrorTest(404, 'Household not found');
      mockApiRequest.mockRejectedValue(error);

      await expect(updateHousehold('nonexistent', 'Test')).rejects.toThrow(error);
    });
  });
});