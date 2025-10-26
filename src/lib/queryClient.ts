/**
 * React Query Configuration
 *
 * Configures TanStack Query (React Query) for server state management
 * - Query client with default options
 * - Cache configuration
 * - Error handling
 * - Retry logic
 */

import { QueryClient } from '@tanstack/react-query';
import { logError } from './errors';

/**
 * Default query options applied to all queries
 */
const defaultQueryOptions = {
  queries: {
    // Stale time: How long data is considered fresh (5 minutes)
    staleTime: 5 * 60 * 1000, // 5 minutes

    // Cache time: How long inactive data stays in cache (10 minutes)
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

    // Retry failed requests
    retry: (failureCount: number, error: Error) => {
      // Don't retry on 404 or 401 errors
      if (error.message.includes('404') || error.message.includes('401')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },

    // Refetch on window focus (good for data freshness)
    refetchOnWindowFocus: true,

    // Refetch on reconnect
    refetchOnReconnect: true,

    // Don't refetch on mount if data is still fresh
    refetchOnMount: false,
  },

  mutations: {
    // Retry failed mutations once
    retry: 1,

    // Global error handler for mutations
    onError: (error: Error) => {
      logError(error, { type: 'mutation' });
    },
  },
};

/**
 * Create and configure the Query Client
 *
 * This client manages all server state in the application
 * including caching, background updates, and synchronization
 */
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

/**
 * Helper function to invalidate queries by key
 *
 * @param queryKey - Query key or array of query keys to invalidate
 *
 * @example
 * // Invalidate all site queries
 * invalidateQueries(['sites'])
 *
 * // Invalidate specific site query
 * invalidateQueries(['sites', siteId])
 */
export const invalidateQueries = async (queryKey: string | string[]) => {
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  await queryClient.invalidateQueries({ queryKey: key });
};

/**
 * Helper function to prefetch queries
 *
 * Useful for preloading data before navigation
 *
 * @param queryKey - Query key
 * @param queryFn - Query function to fetch data
 *
 * @example
 * // Prefetch site details before navigation
 * prefetchQuery(['sites', siteId], () => getSiteById(siteId))
 */
export const prefetchQuery = async <T>(queryKey: string[], queryFn: () => Promise<T>) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
};

/**
 * Helper function to set query data manually
 *
 * Useful for optimistic updates or caching data from mutations
 *
 * @param queryKey - Query key
 * @param data - Data to set
 *
 * @example
 * // Update site in cache after mutation
 * setQueryData(['sites', siteId], updatedSite)
 */
export const setQueryData = <T>(queryKey: string[], data: T) => {
  queryClient.setQueryData(queryKey, data);
};

/**
 * Helper function to get cached query data
 *
 * @param queryKey - Query key
 * @returns Cached data or undefined
 *
 * @example
 * const cachedSite = getQueryData(['sites', siteId])
 */
export const getQueryData = <T>(queryKey: string[]): T | undefined => {
  return queryClient.getQueryData<T>(queryKey);
};

/**
 * Helper function to clear all cached data
 *
 * Useful for logout or when switching accounts
 *
 * @example
 * clearAllCache()
 */
export const clearAllCache = () => {
  queryClient.clear();
};
