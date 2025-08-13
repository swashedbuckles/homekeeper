import { QueryClient } from '@tanstack/react-query';

const FIVE_MINUTES = 5 * 60 * 1000;
const QUERY_RETRIES = 1;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES,
      retry: QUERY_RETRIES,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: QUERY_RETRIES,
    },
  },
});