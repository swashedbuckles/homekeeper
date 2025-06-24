import { createContext } from 'react';

import type { Nullable } from '../lib/types/nullable';
import type { HouseResponse } from '@homekeeper/shared';

export interface HouseholdContextType {
  // Active household selection
  activeHouseholdId: Nullable<string>;
  switchHousehold: (id: string) => void;
  
  // User's households list
  userHouseholds: HouseResponse[] | undefined;
  isLoadingHouseholds: boolean;
  householdsError: Error | null;
  
  // Active household details  
  activeHousehold: HouseResponse | undefined;
  isLoadingActiveHousehold: boolean;
  activeHouseholdError: Nullable<Error>;
  
  // Utility functions
  canManageHousehold: boolean;
  currentRole: Nullable<string>;
}

export const HouseholdContext = createContext<Nullable<HouseholdContextType>>(null);
