import { useQuery } from '@tanstack/react-query';
import { type ReactNode, useState, useEffect } from 'react';

import { useAuth } from '../hooks/useAuth';
import { getHouseholds, getHousehold } from '../lib/api/household';
import { QUERY_KEYS } from '../lib/constants/queryKeys';
import { type HouseholdContextType, HouseholdContext } from './householdContext';

import type { Nullable } from '../lib/types/nullable';
import type { HouseResponse, ApiResponse } from '@homekeeper/shared';

const TEN_MINUTES = 10 * 60 * 1000;
const DEFAULT_HOUSEHOLD: HouseResponse = {
  name: '',
  id: '',
  ownerId: '',
  memberCount: 0,
  userRole: 'guest',
  createdAt: new Date().toLocaleDateString(),
};

export const HouseholdProvider = ({ children }: { children: ReactNode }) => {
  const {user, isAuthenticated} = useAuth();
  const [activeHouseholdId, setActiveHouseholdId] = useState<Nullable<string>>(null);

  const {
    data:      userHouseholds,
    isLoading: isLoadingHouseholds,
    error:     householdsError
  } = useQuery({
    enabled:   isAuthenticated,
    queryFn:   getHouseholds,
    queryKey:  QUERY_KEYS.households(),
    select:    (data: ApiResponse<HouseResponse[]>): HouseResponse[] => data.data ?? [],
    staleTime: TEN_MINUTES,
  });

  const {
    data:      activeHousehold,
    isLoading: isLoadingActiveHousehold,
    error:     activeHouseholdError
  } = useQuery ({
    enabled:   isAuthenticated && Boolean(activeHouseholdId),
    queryFn:   () => {
      if (!activeHouseholdId) {
        return Promise.reject(new Error('No active household selected'));
      }
      return getHousehold(activeHouseholdId);
    },
    queryKey:  activeHouseholdId ? QUERY_KEYS.household(activeHouseholdId) : ['no-household'],
    select:    (data: ApiResponse<HouseResponse>): HouseResponse => data.data ?? DEFAULT_HOUSEHOLD,
    staleTime: TEN_MINUTES,
  });

  const currentMembership  = userHouseholds?.find(h => h.id === activeHouseholdId);
  const currentRole        = currentMembership?.userRole || null;
  const canManageHousehold = currentRole === 'owner' || currentRole === 'admin';

  useEffect(() => {
    if (!activeHouseholdId && userHouseholds?.length) {
      const defaultHousehold = user?.preferences?.defaultHouseholdId 
        ? userHouseholds.find(h => h.id === user.preferences.defaultHouseholdId)
        : userHouseholds[0];
      
      if (defaultHousehold) {
        setActiveHouseholdId(defaultHousehold.id);
      }
    }
  }, [userHouseholds, user?.preferences?.defaultHouseholdId, activeHouseholdId]);


  const contextValue: HouseholdContextType = {
    activeHouseholdId,
    switchHousehold: setActiveHouseholdId,
    
    userHouseholds,
    isLoadingHouseholds,
    householdsError,
    
    activeHousehold,
    isLoadingActiveHousehold,
    activeHouseholdError,
    
    canManageHousehold,
    currentRole,
  };

  return (
    <HouseholdContext.Provider value={contextValue}>
      {children}
    </HouseholdContext.Provider>
  );
};
