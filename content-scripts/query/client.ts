import { QueryCache, QueryClient } from '@tanstack/react-query';

export const wppQueryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error(error, query);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      networkMode: 'always',
    },
    mutations: {
      retry: false,
      networkMode: 'always',
    },
  },
});
