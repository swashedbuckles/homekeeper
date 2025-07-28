import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createInvitation, 
  redeemInvitation, 
  fetchInvitations, 
  cancelInvitation 
} from '../../../src/lib/api/invitations';
import { apiRequest } from '../../../src/lib/apiClient';
import { ApiError } from '../../../src/lib/types/apiError';

// Mock the apiClient
vi.mock('../../../src/lib/apiClient', () => ({
  apiRequest: vi.fn()
}));

const mockApiRequest = vi.mocked(apiRequest);

describe('invitations API', () => {
  beforeEach(() => {
    mockApiRequest.mockClear();
  });

  describe('createInvitation', () => {
    it('makes correct API call with invitation data', async () => {
      const householdId = 'household-123';
      const invitationData = {
        email: 'test@example.com',
        role: 'member' as const,
        expiresInDays: 7
      };
      const mockResponse = { data: {
        id: 'invitation-456',
        code: 'ABC123',
        email: 'test@example.com',
        role: 'member',
        createdAt: '2023-01-01T00:00:00Z',
        expiresAt: '2023-01-08T00:00:00Z'
      }};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await createInvitation(householdId, invitationData);

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/households/household-123/members/invite',
        {
          method: 'POST',
          body: JSON.stringify(invitationData)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles different role types', async () => {
      const householdId = 'household-123';
      const adminInvitation = {
        email: 'admin@example.com',
        role: 'admin' as const,
        expiresInDays: 3
      };

      await createInvitation(householdId, adminInvitation);

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/households/household-123/members/invite',
        {
          method: 'POST',
          body: JSON.stringify(adminInvitation)
        }
      );
    });

    it('propagates API request errors', async () => {
      const apiError = new ApiError(400, 'Invalid invitation data');
      mockApiRequest.mockRejectedValue(apiError);

      const invitationData = {
        email: 'invalid-email',
        role: 'member' as const,
        expiresInDays: 7
      };

      await expect(createInvitation('household-123', invitationData)).rejects.toThrow(apiError);
    });

    it('handles household not found errors', async () => {
      const apiError = new ApiError(404, 'Household not found');
      mockApiRequest.mockRejectedValue(apiError);

      const invitationData = {
        email: 'test@example.com',
        role: 'member' as const,
        expiresInDays: 7
      };

      await expect(createInvitation('nonexistent-household', invitationData)).rejects.toThrow(apiError);
    });
  });

  describe('redeemInvitation', () => {
    it('makes correct API call with invitation code', async () => {
      const invitationCode = 'ABC123DEF';
      const mockResponse = { data: {
        household: {
          id: 'household-123',
          name: 'Test Household',
          description: 'A test household'
        },
        membership: {
          id: 'membership-456',
          role: 'member',
          joinedAt: '2023-01-01T00:00:00Z'
        }
      }};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await redeemInvitation(invitationCode);

      expect(mockApiRequest).toHaveBeenCalledWith('/invitations/redeem', {
        method: 'POST',
        body: JSON.stringify({ code: invitationCode })
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles invalid invitation codes', async () => {
      const apiError = new ApiError(400, 'Invalid invitation code');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(redeemInvitation('INVALID123')).rejects.toThrow(apiError);
    });

    it('handles expired invitation codes', async () => {
      const apiError = new ApiError(410, 'Invitation expired');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(redeemInvitation('EXPIRED123')).rejects.toThrow(apiError);
    });

    it('handles already redeemed invitations', async () => {
      const apiError = new ApiError(409, 'Invitation already redeemed');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(redeemInvitation('REDEEMED123')).rejects.toThrow(apiError);
    });
  });

  describe('fetchInvitations', () => {
    it('makes correct API call to fetch household invitations', async () => {
      const householdId = 'household-123';
      const mockResponse = { data: [
        {
          id: 'invitation-1',
          code: 'ABC123',
          email: 'user1@example.com',
          role: 'member',
          createdAt: '2023-01-01T00:00:00Z',
          expiresAt: '2023-01-08T00:00:00Z'
        },
        {
          id: 'invitation-2',
          code: 'DEF456',
          email: 'user2@example.com',
          role: 'admin',
          createdAt: '2023-01-02T00:00:00Z',
          expiresAt: '2023-01-09T00:00:00Z'
        }
      ]};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await fetchInvitations(householdId);

      expect(mockApiRequest).toHaveBeenCalledWith('/households/household-123/invitations');
      expect(result).toEqual(mockResponse);
    });

    it('returns empty array when no invitations exist', async () => {
      mockApiRequest.mockResolvedValue({data: []});

      const result = await fetchInvitations('household-123');

      expect(result).toEqual({data: []});
    });

    it('handles unauthorized access to household invitations', async () => {
      const apiError = new ApiError(403, 'Access denied');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(fetchInvitations('unauthorized-household')).rejects.toThrow(apiError);
    });

    it('handles household not found errors', async () => {
      const apiError = new ApiError(404, 'Household not found');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(fetchInvitations('nonexistent-household')).rejects.toThrow(apiError);
    });
  });

  describe('cancelInvitation', () => {
    it('makes correct API call to cancel invitation', async () => {
      const householdId = 'household-123';
      const invitationId = 'invitation-456';
      const mockResponse = { data: {
        id: 'invitation-456',
        code: 'ABC123',
        email: 'test@example.com',
        role: 'member',
        createdAt: '2023-01-01T00:00:00Z',
        expiresAt: '2023-01-08T00:00:00Z',
        cancelledAt: '2023-01-03T00:00:00Z'
      }};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await cancelInvitation(householdId, invitationId);

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/households/household-123/invitations/invitation-456',
        { method: 'DELETE' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles invitation not found errors', async () => {
      const apiError = new ApiError(404, 'Invitation not found');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(cancelInvitation('household-123', 'nonexistent-invitation')).rejects.toThrow(apiError);
    });

    it('handles unauthorized cancellation attempts', async () => {
      const apiError = new ApiError(403, 'Access denied');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(cancelInvitation('household-123', 'invitation-456')).rejects.toThrow(apiError);
    });

    it('handles already cancelled invitations', async () => {
      const apiError = new ApiError(410, 'Invitation already cancelled');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(cancelInvitation('household-123', 'cancelled-invitation')).rejects.toThrow(apiError);
    });

    it('handles household not found errors', async () => {
      const apiError = new ApiError(404, 'Household not found');
      mockApiRequest.mockRejectedValue(apiError);

      await expect(cancelInvitation('nonexistent-household', 'invitation-456')).rejects.toThrow(apiError);
    });
  });
});