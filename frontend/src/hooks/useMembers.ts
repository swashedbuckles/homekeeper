import { useQuery } from '@tanstack/react-query';
import { getMembers } from '../lib/api/household';
import { QUERY_KEYS } from '../lib/constants/queryKeys';
import { useAuth } from './useAuth';

const TEN_MINUTES = 10 * 60 * 1000;

export const useMembers = (householdId: string) => {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: QUERY_KEYS.members(householdId),
    enabled: Boolean(householdId) && isAuthenticated,
    staleTime: TEN_MINUTES,
    queryFn: () => getMembers(householdId)
  });

  return query;
};
