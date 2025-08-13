import { apiRequest } from '../apiClient';
import { QUERY_KEYS } from '../constants/queryKeys';
import { queryClient } from '../queryClient';
import { ApiError } from '../types/apiError';
import { cacheHelpers } from '../util/cacheHelpers';
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
  }).then(response => {
    cacheHelpers.invalidateHouseholds();
    queryClient.removeQueries({ queryKey: QUERY_KEYS.household(householdId) });
    return response;
  });
}

export function createHousehold(name: string, description?: string) {
  return apiRequest<SerializedHousehold>('/households', {
    method: 'POST',
    body: JSON.stringify({ name, description })
  }).then(response => {
    
    if (response.data) {
      const householdData: HouseResponse = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        ownerId: response.data.ownerId,
        createdAt: response.data.createdAt,
        memberCount: 1, 
        userRole: 'owner' 
      };
      cacheHelpers.setHouseholdData(householdData);
      cacheHelpers.addHouseholdToList(householdData);
    }
    return response;
  });
}

export function updateHousehold(householdId: string, name: string, description?: string) {
  // Store original data for rollback on error
  const originalData = queryClient.getQueryData<HouseResponse>(QUERY_KEYS.household(householdId));
  
  return apiRequest<HouseResponse>(`/households/${householdId}`, {
    method: 'PUT',
    body: JSON.stringify({name, description})
  }).then(response => {
    if (response.data) {
      cacheHelpers.setHouseholdData(response.data);
      cacheHelpers.updateHouseholdInList(response.data);
    }
    return response;
  }).catch(error => {
    // Rollback cache on error
    if (originalData) {
      cacheHelpers.rollbackHouseholdData(householdId, originalData);
    }
    throw error;
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
  }).then(response => {
    if (response.data) {
      cacheHelpers.updateMemberInList(householdId, response.data);
    }
    return response;
  });
}

export function addMember(householdId: string, userId: string, role: HouseholdRoles) {
  return apiRequest<MemberResponse>(`/households/${householdId}/members`, {
    method: 'PUT',
    body: JSON.stringify({ userId, role })
  }).then(response => {
    if (response.data) {
      cacheHelpers.invalidateMembers(householdId);
      cacheHelpers.invalidateHousehold(householdId); 
    }
    return response;
  });
}

export function removeMember(householdId: string, userId: string) {
  return apiRequest<MemberResponse>(`/households/${householdId}/members/${userId}`, {
    method: 'DELETE'
  }).then(response => {
    if (response.data) {
      cacheHelpers.invalidateMembers(householdId);
      cacheHelpers.invalidateHousehold(householdId); 
    }
    return response;
  });
}