import { QUERY_KEYS } from '../constants/queryKeys';
import { queryClient } from '../queryClient';
import type { HouseResponse, ApiResponse, MemberResponse } from '@homekeeper/shared';

export const cacheHelpers = {
  // Household cache updates
  setHouseholdData: (householdData: HouseResponse) => {
    queryClient.setQueryData(QUERY_KEYS.household(householdData.id), householdData);
  },
  
  updateHouseholdInList: (householdData: HouseResponse) => {
    queryClient.setQueryData(QUERY_KEYS.households(), (oldData: ApiResponse<HouseResponse[]> | undefined) => {
      if (!oldData?.data) return oldData;
      return {
        ...oldData,
        data: oldData.data.map(h => h.id === householdData.id ? householdData : h)
      };
    });
  },
  
  addHouseholdToList: (householdData: HouseResponse) => {
    queryClient.setQueryData(QUERY_KEYS.households(), (oldData: ApiResponse<HouseResponse[]> | undefined) => {
      if (!oldData?.data) return { data: [householdData] };
      return {
        ...oldData,
        data: [...oldData.data, householdData]
      };
    });
  },
  
  // Member cache updates (for future use)
  setMembersData: (householdId: string, memberData: MemberResponse) => {
    queryClient.setQueryData(QUERY_KEYS.members(householdId), memberData);
  },

  // Cache rollback helper
  rollbackHouseholdData: (householdId: string, originalData: HouseResponse) => {
    queryClient.setQueryData(QUERY_KEYS.household(householdId), originalData);
  }
};