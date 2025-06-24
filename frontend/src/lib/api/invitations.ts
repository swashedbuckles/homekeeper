import { apiRequest } from '../apiClient';

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
  });
}

export function redeemInvitation(code: string) {
  return apiRequest<RedeemResponse>('/invitations/redeem', {
    method: 'POST',
    body: JSON.stringify({code})
  });
}

export function fetchInvitations(householdId: string) {
  const url = `/households/${householdId}/invitations`;
  return apiRequest<InvitationResponse[]>(url);
}

export function cancelInvitation(householdId: string, invitationId: string) {
  const url = `/households/${householdId}/invitations/${invitationId}`;
  return apiRequest<InvitationResponse>(url, {
    method: 'DELETE'
  });
}
