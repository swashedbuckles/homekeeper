import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHousehold, getHouseholds, createHousehold, updateHousehold } from '../../../src/lib/api/household';
import { apiRequest } from '../../../src/lib/apiClient';
import { ApiError } from '../../../src/lib/types/apiError';

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
      const mockResponse = { data: { 
        id: 'household-123', 
        name: 'Test Household',
        description: 'A test household'
      }};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await getHousehold('household-123');

      expect(mockApiRequest).toHaveBeenCalledWith('/households/household-123');
      expect(result).toEqual(mockResponse);
    });

    it('throws ApiError when household ID is empty string', () => {
      expect(() => getHousehold('')).toThrow(ApiError);
      expect(() => getHousehold('')).toThrow('Missing household');
    });

    it('throws ApiError when household ID is null', () => {
      expect(() => getHousehold(null as any)).toThrow(ApiError);
      expect(() => getHousehold(null as any)).toThrow('Missing household');
    });

    it('throws ApiError when household ID is undefined', () => {
      expect(() => getHousehold(undefined as any)).toThrow(ApiError);
      expect(() => getHousehold(undefined as any)).toThrow('Missing household');
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
      const apiError = new ApiError(404, 'Household not found');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(getHousehold('nonexistent-id')).rejects.toThrow(apiError);
    });
  });

  describe('getHouseholds', () => {
    it('makes correct API call to fetch all households', async () => {
      const mockResponse = {data: [
        { id: 'household-1', name: 'Household 1' },
        { id: 'household-2', name: 'Household 2' }
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
      const apiError = new ApiError(500, 'Server error');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(getHouseholds()).rejects.toThrow(apiError);
    });
  });

  describe('createHousehold', () => {
    it('makes correct API call with name only', async () => {
      const mockResponse = { data: { 
        id: 'new-household-123', 
        name: 'New Household',
        description: undefined
      }};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await createHousehold('New Household');

      expect(mockApiRequest).toHaveBeenCalledWith('/households', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Household', description: undefined })
      });
      expect(result).toEqual(mockResponse);
    });

    it('makes correct API call with name and description', async () => {
      const mockResponse = { data: { 
        id: 'new-household-456', 
        name: 'Family Home',
        description: 'Our cozy family home'
      }};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await createHousehold('Family Home', 'Our cozy family home');

      expect(mockApiRequest).toHaveBeenCalledWith('/households', {
        method: 'POST',
        body: JSON.stringify({ 
          name: 'Family Home', 
          description: 'Our cozy family home' 
        })
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles empty description correctly', async () => {
      const mockResponse = { data: { 
        id: 'new-household-789', 
        name: 'Test House',
        description: ''
      }};
      mockApiRequest.mockResolvedValue(mockResponse);

      await createHousehold('Test House', '');

      expect(mockApiRequest).toHaveBeenCalledWith('/households', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test House', description: '' })
      });
    });

    it('propagates API request errors', async () => {
      const apiError = new ApiError(400, 'Invalid household data');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(createHousehold('Test')).rejects.toThrow(apiError);
    });
  });

  describe('updateHousehold', () => {
    it('makes correct API call with name only', async () => {
      const mockResponse = { data: { 
        id: 'household-123', 
        name: 'Updated Household',
        description: undefined
      }};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await updateHousehold('household-123', 'Updated Household');

      expect(mockApiRequest).toHaveBeenCalledWith('/households/household-123', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Household', description: undefined })
      });
      expect(result).toEqual(mockResponse);
    });

    it('makes correct API call with name and description', async () => {
      const mockResponse = { data: { 
        id: 'household-456', 
        name: 'Updated Family Home',
        description: 'Updated description'
      }};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await updateHousehold(
        'household-456', 
        'Updated Family Home', 
        'Updated description'
      );

      expect(mockApiRequest).toHaveBeenCalledWith('/households/household-456', {
        method: 'PUT',
        body: JSON.stringify({ 
          name: 'Updated Family Home', 
          description: 'Updated description' 
        })
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles empty description correctly', async () => {
      const mockResponse = { data: { 
        id: 'household-789', 
        name: 'Test House',
        description: ''
      }};
      mockApiRequest.mockResolvedValue(mockResponse);

      await updateHousehold('household-789', 'Test House', '');

      expect(mockApiRequest).toHaveBeenCalledWith('/households/household-789', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Test House', description: '' })
      });
    });

    it('propagates API request errors', async () => {
      const apiError = new ApiError(404, 'Household not found');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(updateHousehold('nonexistent', 'Test')).rejects.toThrow(apiError);
    });
  });
});