import { apiRequest } from '../apiClient';
import { ApiError } from '../types/apiError';
import type { 
  MemberDetail, 
  HouseholdRoles, 
  HouseResponse, 
  MemberResponse, 
  SerializedHousehold, 
} from '@homekeeper/shared';


export function getHousehold(householdId: string) {
  if(!householdId) {
    throw new ApiError(400, 'Missing household');
  }

  return apiRequest<HouseResponse>(`/households/${householdId}`);
}

export function getHouseholds() {
  return apiRequest<HouseResponse[]>('/households');
}

export function deleteHousehold(householdId: string) {
  return apiRequest(`/households/${householdId}`, {
    method: 'DELETE'
  });
}

export function createHousehold(name: string, description?: string) {
  return apiRequest<SerializedHousehold>('/households', {
    method: 'POST',
    body: JSON.stringify({ name, description })
  });
}

export function updateHousehold(householdId: string, name: string, description?: string) {
  return apiRequest<SerializedHousehold>(`/households/${householdId}`, {
    method: 'PUT',
    body: JSON.stringify({name, description})
  });
}

export function getMembers(householdId: string) {
  return apiRequest<MemberResponse>(`/households/${householdId}/members`, {
    method: 'GET',
  });
}

export function setMemberRole(householdId: string, memberId: string, role: HouseholdRoles) {
  return apiRequest<MemberDetail>(`/households/${householdId}/members/${memberId}/role`, {
    method: 'PUT', 
    body: JSON.stringify({
      role
    })
  });
}