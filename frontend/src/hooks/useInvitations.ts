import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelInvitation, getPendingInvitations } from '../lib/api/invitations';
import { QUERY_KEYS } from '../lib/constants/queryKeys';
import { useAuth } from './useAuth';

const TEN_MINUTES = 10 * 60 * 1000;

export const usePendingInvitations = (householdId: string) => {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: QUERY_KEYS.invitations(householdId),
    enabled: Boolean(householdId) && isAuthenticated,
    staleTime: TEN_MINUTES,
    queryFn: () => getPendingInvitations(householdId)
  });

  return query;
};


export function useCancelInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ householdId, invitationId }: { householdId: string; invitationId: string }) =>
      cancelInvitation(householdId, invitationId),
    onSuccess: (data, { householdId }) => {
      // Invalidate invitations cache to refetch the list
      queryClient.invalidateQueries({ queryKey: ['invitations', householdId] });
    },
  });
}