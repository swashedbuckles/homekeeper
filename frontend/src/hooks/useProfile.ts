import { useQuery } from '@tanstack/react-query';

import { getProfile } from '../lib/api/auth';
import { QUERY_KEYS } from '../lib/constants/queryKeys';
import { useAuth } from './useAuth';

const TEN_MINUTES = 10 * 60 * 1000;

export const useProfile = () => {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: QUERY_KEYS.profile(),
    enabled: isAuthenticated,
    staleTime: TEN_MINUTES,
    queryFn: () => getProfile()
  });

  return query;
};
