import { apiRequest } from '../apiClient';
import { cacheHelpers } from '../util/cacheHelpers';

import type { 
  InvitationResponse, 
  CreateInvitationRequest, 
  RedeemResponse 
} from '@homekeeper/shared';

export function createInvitation(householdId: string, invitation: CreateInvitationRequest) {
  const url = `/households/${householdId}/members/invite`;
  return apiRequest<InvitationResponse>(url, {
    method: 'POST',
    body: JSON.stringify(invitation)
  }).then(response => {
    if (response.data) {
      cacheHelpers.addInvitationToList(householdId, response.data);
    }
    return response;
  });
}

export function redeemInvitation(code: string) {
  return apiRequest<RedeemResponse>('/invitations/redeem', {
    method: 'POST',
    body: JSON.stringify({code})
  }).then(response => {
    if (response.data) {
      cacheHelpers.invalidateHouseholds(); // User now member of household
      if (response.data.householdId) {
        cacheHelpers.invalidateMembers(response.data.householdId); // New member added
        cacheHelpers.invalidateInvitations(response.data.householdId); // Invitation consumed
        cacheHelpers.invalidateHousehold(response.data.householdId); // Member count changed
      }
    }
    return response;
  });
}

export function getInvitations(householdId: string) {
  const url = `/households/${householdId}/invitations`;
  return apiRequest<InvitationResponse[]>(url);
}

export function cancelInvitation(householdId: string, invitationId: string) {
  const url = `/households/${householdId}/invitations/${invitationId}`;
  return apiRequest<InvitationResponse>(url, {
    method: 'DELETE'
  }).then(response => {
    if (response.data) {
      cacheHelpers.removeInvitationFromList(householdId, invitationId);
    }
    return response;
  });
}
