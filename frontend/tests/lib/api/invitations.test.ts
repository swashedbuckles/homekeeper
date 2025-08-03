import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createInvitation, 
  redeemInvitation, 
  fetchInvitations, 
  cancelInvitation 
} from '../../../src/lib/api/invitations';
import { apiRequest } from '../../../src/lib/apiClient';
import { ApiError } from '../../../src/lib/types/apiError';

// Test data factories
const createMockInvitation = (overrides = {}) => ({
  id: 'invitation-456',
  code: 'ABC123',
  email: 'test@example.com',
  role: 'member',
  createdAt: '2023-01-01T00:00:00Z',
  expiresAt: '2023-01-08T00:00:00Z',
  ...overrides
});

const createMockRedemptionResponse = () => ({
  data: {
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
  }
});

const createApiErrorScenario = (statusCode: number, message: string, testData?: any) => ({
  error: new ApiError(statusCode, message),
  testData,
  expectation: (apiCall: () => Promise<any>) => 
    expect(apiCall()).rejects.toThrow(new ApiError(statusCode, message))
});

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
    const householdId = 'household-123';
    const baseInvitationData = {
      email: 'test@example.com',
      role: 'member' as const,
      expiresInDays: 7
    };

    it('makes correct API call with invitation data', async () => {
      const mockResponse = { data: createMockInvitation() };
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await createInvitation(householdId, baseInvitationData);

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/households/household-123/members/invite',
        {
          method: 'POST',
          body: JSON.stringify(baseInvitationData)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    const roleTests = [
      {
        name: 'handles admin role invitations',
        invitationData: {
          email: 'admin@example.com',
          role: 'admin' as const,
          expiresInDays: 3
        }
      },
      {
        name: 'handles member role invitations',
        invitationData: baseInvitationData
      }
    ];

    roleTests.forEach(({ name, invitationData }) => {
      it(name, async () => {
        await createInvitation(householdId, invitationData);

        expect(mockApiRequest).toHaveBeenCalledWith(
          '/households/household-123/members/invite',
          {
            method: 'POST',
            body: JSON.stringify(invitationData)
          }
        );
      });
    });

    const errorScenarios = [
      {
        name: 'propagates API request errors',
        ...createApiErrorScenario(400, 'Invalid invitation data'),
        householdId: 'household-123',
        invitationData: { email: 'invalid-email', role: 'member' as const, expiresInDays: 7 }
      },
      {
        name: 'handles household not found errors',
        ...createApiErrorScenario(404, 'Household not found'),
        householdId: 'nonexistent-household',
        invitationData: baseInvitationData
      }
    ];

    errorScenarios.forEach(({ name, error, householdId: testHouseholdId, invitationData }) => {
      it(name, async () => {
        mockApiRequest.mockRejectedValue(error);
        await expect(createInvitation(testHouseholdId, invitationData)).rejects.toThrow(error);
      });
    });
  });

  describe('redeemInvitation', () => {
    it('makes correct API call with invitation code', async () => {
      const invitationCode = 'ABC123DEF';
      const mockResponse = createMockRedemptionResponse();
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await redeemInvitation(invitationCode);

      expect(mockApiRequest).toHaveBeenCalledWith('/invitations/redeem', {
        method: 'POST',
        body: JSON.stringify({ code: invitationCode })
      });
      expect(result).toEqual(mockResponse);
    });

    const redeemErrorScenarios = [
      {
        name: 'handles invalid invitation codes',
        ...createApiErrorScenario(400, 'Invalid invitation code'),
        code: 'INVALID123'
      },
      {
        name: 'handles expired invitation codes',
        ...createApiErrorScenario(410, 'Invitation expired'),
        code: 'EXPIRED123'
      },
      {
        name: 'handles already redeemed invitations',
        ...createApiErrorScenario(409, 'Invitation already redeemed'),
        code: 'REDEEMED123'
      }
    ];

    redeemErrorScenarios.forEach(({ name, error, code }) => {
      it(name, async () => {
        mockApiRequest.mockRejectedValue(error);
        await expect(redeemInvitation(code)).rejects.toThrow(error);
      });
    });
  });

  describe('fetchInvitations', () => {
    const householdId = 'household-123';

    it('makes correct API call to fetch household invitations', async () => {
      const mockResponse = { data: [
        createMockInvitation({ id: 'invitation-1', email: 'user1@example.com' }),
        createMockInvitation({ id: 'invitation-2', code: 'DEF456', email: 'user2@example.com', role: 'admin', createdAt: '2023-01-02T00:00:00Z', expiresAt: '2023-01-09T00:00:00Z' })
      ]};
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await fetchInvitations(householdId);

      expect(mockApiRequest).toHaveBeenCalledWith('/households/household-123/invitations');
      expect(result).toEqual(mockResponse);
    });

    it('returns empty array when no invitations exist', async () => {
      mockApiRequest.mockResolvedValue({data: []});

      const result = await fetchInvitations(householdId);

      expect(result).toEqual({data: []});
    });

    const fetchErrorScenarios = [
      {
        name: 'handles unauthorized access to household invitations',
        ...createApiErrorScenario(403, 'Access denied'),
        householdId: 'unauthorized-household'
      },
      {
        name: 'handles household not found errors',
        ...createApiErrorScenario(404, 'Household not found'),
        householdId: 'nonexistent-household'
      }
    ];

    fetchErrorScenarios.forEach(({ name, error, householdId: testHouseholdId }) => {
      it(name, async () => {
        mockApiRequest.mockRejectedValue(error);
        await expect(fetchInvitations(testHouseholdId)).rejects.toThrow(error);
      });
    });
  });

  describe('cancelInvitation', () => {
    const householdId = 'household-123';
    const invitationId = 'invitation-456';

    it('makes correct API call to cancel invitation', async () => {
      const mockResponse = { data: createMockInvitation({ cancelledAt: '2023-01-03T00:00:00Z' }) };
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await cancelInvitation(householdId, invitationId);

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/households/household-123/invitations/invitation-456',
        { method: 'DELETE' }
      );
      expect(result).toEqual(mockResponse);
    });

    const cancelErrorScenarios = [
      {
        name: 'handles invitation not found errors',
        ...createApiErrorScenario(404, 'Invitation not found'),
        invitationId: 'nonexistent-invitation'
      },
      {
        name: 'handles unauthorized cancellation attempts',
        ...createApiErrorScenario(403, 'Access denied'),
        invitationId: 'invitation-456'
      },
      {
        name: 'handles already cancelled invitations',
        ...createApiErrorScenario(410, 'Invitation already cancelled'),
        invitationId: 'cancelled-invitation'
      },
      {
        name: 'handles household not found errors',
        ...createApiErrorScenario(404, 'Household not found'),
        householdId: 'nonexistent-household',
        invitationId: 'invitation-456'
      }
    ];

    cancelErrorScenarios.forEach((scenario) => {
      const { name, error } = scenario;
      const testHouseholdId = 'householdId' in scenario ? scenario.householdId : householdId;
      const testInvitationId = 'invitationId' in scenario ? scenario.invitationId : invitationId;
      it(name, async () => {
        mockApiRequest.mockRejectedValue(error);
        await expect(cancelInvitation(testHouseholdId, testInvitationId)).rejects.toThrow(error);
      });
    });
  });
});