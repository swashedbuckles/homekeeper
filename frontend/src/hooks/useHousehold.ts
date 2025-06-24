import { useContext } from 'react';
import { HouseholdContext } from '../context/householdContext';

export const useHousehold = () => {
  const context = useContext(HouseholdContext);

  if (!context) {
    throw new Error('`useHousehold` must be used within HouseholdProvider');
  }

  return context;
};