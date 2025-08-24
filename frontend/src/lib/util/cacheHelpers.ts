import { QUERY_KEYS } from '../constants/queryKeys';
import { queryClient } from '../queryClient';
import type { HouseResponse, ApiResponse, MemberResponse, MemberDetail, InvitationResponse } from '@homekeeper/shared';

/**
 * Centralized cache management utilities for TanStack Query.
 * 
 * This module implements a hybrid cache management strategy:
 * - **Simple Updates**: Direct cache replacement for operations returning complete objects
 * - **Strategic Invalidation**: Cache invalidation for complex multi-resource operations
 * 
 * @see {@link /docs/decisions/cache_management_strategy.md} for detailed strategy documentation
 * 
 * @example
 * ```typescript
 * // Simple cache update (API returns updated object)
 * cacheHelpers.updateMemberInList(householdId, updatedMember);
 * 
 * // Strategic invalidation (complex operation affecting multiple resources)
 * cacheHelpers.invalidateMembers(householdId);
 * ```
 */
export const cacheHelpers = {
  /**
   * Sets household data in the individual household cache.
   * Used when we have the complete, updated household object.
   * 
   * @param householdData - Complete household data to cache
   * @example
   * ```typescript
   * // After successful household update
   * cacheHelpers.setHouseholdData(response.data);
   * ```
   */
  setHouseholdData: (householdData: HouseResponse) => {
    queryClient.setQueryData(QUERY_KEYS.household(householdData.id), householdData);
  },
  
  /**
   * Updates a specific household in the households list cache.
   * Replaces the existing household with the updated data while preserving other households.
   * 
   * @param householdData - Updated household data to replace in the list
   * @example
   * ```typescript
   * // After household name/description update
   * cacheHelpers.updateHouseholdInList(updatedHousehold);
   * ```
   */
  updateHouseholdInList: (householdData: HouseResponse) => {
    queryClient.setQueryData(QUERY_KEYS.households(), (oldData: ApiResponse<HouseResponse[]> | undefined) => {
      if (!oldData?.data) return oldData;
      return {
        ...oldData,
        data: oldData.data.map(h => h.id === householdData.id ? householdData : h)
      };
    });
  },
  
  /**
   * Adds a new household to the households list cache.
   * Used when creating a new household to provide immediate UI feedback.
   * 
   * @param householdData - New household data to add to the list
   * @example
   * ```typescript
   * // After successful household creation
   * cacheHelpers.addHouseholdToList(newHousehold);
   * ```
   */
  addHouseholdToList: (householdData: HouseResponse) => {
    queryClient.setQueryData(QUERY_KEYS.households(), (oldData: ApiResponse<HouseResponse[]> | undefined) => {
      if (!oldData?.data) return { data: [householdData] };
      return {
        ...oldData,
        data: [...oldData.data, householdData]
      };
    });
  },
  
  /**
   * Sets complete members data for a household.
   * Replaces the entire members cache with new data.
   * 
   * @param householdId - ID of the household
   * @param memberData - Complete member response data
   */
  setMembersData: (householdId: string, memberData: MemberResponse) => {
    queryClient.setQueryData(QUERY_KEYS.members(householdId), memberData);
  },

  /**
   * Updates a specific member in the members list cache.
   * Used for simple member updates like role changes where we have the complete updated member object.
   * 
   * @param householdId - ID of the household the member belongs to
   * @param memberData - Updated member data to replace in the list
   * @example
   * ```typescript
   * // After member role update
   * cacheHelpers.updateMemberInList(householdId, updatedMember);
   * ```
   */
  updateMemberInList: (householdId: string, memberData: MemberDetail) => {
    queryClient.setQueryData(QUERY_KEYS.members(householdId), (oldData: MemberResponse | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        members: oldData.members.map(m => m.id === memberData.id ? memberData : m)
      };
    });
  },

  /**
   * Adds a new invitation to the invitations list cache.
   * Provides immediate UI feedback when creating invitations.
   * 
   * @param householdId - ID of the household the invitation belongs to
   * @param invitationData - New invitation data to add to the list
   * @example
   * ```typescript
   * // After successful invitation creation
   * cacheHelpers.addInvitationToList(householdId, newInvitation);
   * ```
   */
  addInvitationToList: (householdId: string, invitationData: InvitationResponse) => {
    queryClient.setQueryData(QUERY_KEYS.invitations(householdId), (oldData: InvitationResponse[] | undefined) => {
      if (!oldData) return [invitationData];
      return [...oldData, invitationData];
    });
  },

  /**
   * Removes an invitation from the invitations list cache.
   * Used when cancelling invitations to provide immediate UI feedback.
   * 
   * @param householdId - ID of the household the invitation belongs to
   * @param invitationId - ID of the invitation to remove
   * @example
   * ```typescript
   * // After successful invitation cancellation
   * cacheHelpers.removeInvitationFromList(householdId, invitationId);
   * ```
   */
  removeInvitationFromList: (householdId: string, invitationId: string) => {
    queryClient.setQueryData(QUERY_KEYS.invitations(householdId), (oldData: ApiResponse<InvitationResponse[]> | undefined) => {
      if (!oldData?.data) return oldData;
      console.log('OLD DATA', oldData);
      return oldData.data.filter(inv => inv.id !== invitationId);
    });
  },

  /**
   * Invalidates the households list cache, triggering a fresh fetch.
   * Used for complex operations that affect the households list in ways that are
   * difficult to predict or update optimistically.
   * 
   * @example
   * ```typescript
   * // After household deletion or when user joins new household
   * cacheHelpers.invalidateHouseholds();
   * ```
   */
  invalidateHouseholds: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.households() });
  },

  /**
   * Invalidates a specific household's cache, triggering a fresh fetch.
   * Used when household data changes in complex ways (e.g., member count changes).
   * 
   * @param householdId - ID of the household to invalidate
   * @example
   * ```typescript
   * // After adding/removing members (affects member count)
   * cacheHelpers.invalidateHousehold(householdId);
   * ```
   */
  invalidateHousehold: (householdId: string) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.household(householdId) });
  },

  /**
   * Invalidates a household's members cache, triggering a fresh fetch.
   * Used for complex member operations where optimistic updates are too complex.
   * 
   * @param householdId - ID of the household whose members cache to invalidate
   * @example
   * ```typescript
   * // After adding/removing members
   * cacheHelpers.invalidateMembers(householdId);
   * ```
   */
  invalidateMembers: (householdId: string) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members(householdId) });
  },

  /**
   * Invalidates a household's invitations cache, triggering a fresh fetch.
   * Used when invitation state changes in ways affecting the entire list.
   * 
   * @param householdId - ID of the household whose invitations cache to invalidate
   * @example
   * ```typescript
   * // After invitation redemption (affects multiple caches)
   * cacheHelpers.invalidateInvitations(householdId);
   * ```
   */
  invalidateInvitations: (householdId: string) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invitations(householdId) });
  },

  /**
   * Clears all cached data from TanStack Query.
   * Used during authentication state changes to ensure no stale user data persists.
   * 
   * @example
   * ```typescript
   * // On login/logout/register
   * cacheHelpers.clearAllCaches();
   * ```
   * 
   * @warning This is a nuclear option - use sparingly and only for auth state changes
   */
  clearAllCaches: () => {
    queryClient.clear();
  },

  /**
   * Rolls back household data to a previous state.
   * Used for error recovery when API calls fail after optimistic updates.
   * 
   * @param householdId - ID of the household to rollback
   * @param originalData - Original household data to restore
   * @example
   * ```typescript
   * // On API error after optimistic update
   * cacheHelpers.rollbackHouseholdData(householdId, originalData);
   * ```
   */
  rollbackHouseholdData: (householdId: string, originalData: HouseResponse) => {
    queryClient.setQueryData(QUERY_KEYS.household(householdId), originalData);
  }
};