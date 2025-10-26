/**
 * useSites Hook
 *
 * React Query hooks for sites data:
 * - Fetch all sites with filters
 * - Fetch single site by ID
 * - Fetch sites with status (occupancy)
 * - Create, update, delete site mutations
 *
 * Handles caching, loading states, and optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getSites,
  getSiteById,
  getSitesWithStatus,
  createSite,
  updateSite,
  deleteSite,
} from '@/services/sites.service';
import type { Site, CreateSiteRequest, SiteFilters, SiteCurrentStatus } from '@/types';
import { QUERY_KEYS } from '@/config/constants';

/**
 * Fetch all sites with optional filters
 *
 * @param filters - Optional filter criteria
 *
 * @example
 * const { data: sites, isLoading, error } = useSitesQuery({
 *   type: 'unipole',
 *   location: 'Mumbai'
 * });
 */
export function useSitesQuery(filters?: SiteFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.SITES, filters],
    queryFn: () => getSites(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single site by ID
 *
 * @param id - Site ID
 *
 * @example
 * const { data: site, isLoading } = useSiteQuery(siteId);
 */
export function useSiteQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SITE(id),
    queryFn: () => getSiteById(id),
    enabled: !!id, // Only run query if ID exists
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch sites with current status (occupancy info)
 *
 * Used in dashboard and status views
 *
 * @example
 * const { data: sitesWithStatus } = useSitesWithStatusQuery();
 */
export function useSitesWithStatusQuery() {
  return useQuery<SiteCurrentStatus[]>({
    queryKey: QUERY_KEYS.SITES_WITH_STATUS,
    queryFn: getSitesWithStatus,
    staleTime: 3 * 60 * 1000, // 3 minutes (more frequent updates for status)
  });
}

/**
 * Create new site mutation
 *
 * Automatically invalidates sites list after creation
 *
 * @example
 * const { mutate: createNewSite, isPending } = useCreateSiteMutation();
 *
 * createNewSite(siteData, {
 *   onSuccess: (newSite) => {
 *     navigate(`/sites/${newSite.id}`);
 *   }
 * });
 */
export function useCreateSiteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSiteRequest) => createSite(data),
    onSuccess: (newSite) => {
      // Invalidate sites list to refetch with new site
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITES_WITH_STATUS });

      // Show success toast
      toast.success('Site created successfully', {
        description: `Site ${newSite.siteNo} has been created.`,
      });
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error('Failed to create site', {
        description: error.message || 'An error occurred while creating the site.',
      });
    },
  });
}

/**
 * Update existing site mutation
 *
 * Uses optimistic updates for better UX
 *
 * @example
 * const { mutate: updateExistingSite } = useUpdateSiteMutation();
 *
 * updateExistingSite({ id: siteId, data: updates });
 */
export function useUpdateSiteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSiteRequest> }) =>
      updateSite(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.SITE(id) });

      // Snapshot previous value
      const previousSite = queryClient.getQueryData<Site>(QUERY_KEYS.SITE(id));

      // Optimistically update to new value
      if (previousSite) {
        queryClient.setQueryData<Site>(QUERY_KEYS.SITE(id), {
          ...previousSite,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousSite };
    },
    onSuccess: (updatedSite) => {
      // Update cache with server response
      queryClient.setQueryData(QUERY_KEYS.SITE(updatedSite.id), updatedSite);

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITES_WITH_STATUS });

      toast.success('Site updated successfully');
    },
    onError: (error: Error, { id }, context) => {
      // Rollback on error
      if (context?.previousSite) {
        queryClient.setQueryData(QUERY_KEYS.SITE(id), context.previousSite);
      }

      toast.error('Failed to update site', {
        description: error.message,
      });
    },
  });
}

/**
 * Delete site mutation
 *
 * @example
 * const { mutate: removeSite } = useDeleteSiteMutation();
 *
 * removeSite(siteId, {
 *   onSuccess: () => {
 *     navigate('/sites');
 *   }
 * });
 */
export function useDeleteSiteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSite(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.SITE(deletedId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITES_WITH_STATUS });

      toast.success('Site deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete site', {
        description: error.message,
      });
    },
  });
}

/**
 * Combined hook for all site operations
 *
 * Convenience hook that returns all queries and mutations
 *
 * @example
 * const {
 *   sites,
 *   isLoading,
 *   createSite,
 *   updateSite,
 *   deleteSite
 * } = useSites({ type: 'unipole' });
 */
export function useSites(filters?: SiteFilters) {
  const sitesQuery = useSitesQuery(filters);
  const createMutation = useCreateSiteMutation();
  const updateMutation = useUpdateSiteMutation();
  const deleteMutation = useDeleteSiteMutation();

  return {
    // Query data
    sites: sitesQuery.data,
    isLoading: sitesQuery.isLoading,
    isError: sitesQuery.isError,
    error: sitesQuery.error,
    refetch: sitesQuery.refetch,

    // Mutations
    createSite: createMutation.mutate,
    updateSite: updateMutation.mutate,
    deleteSite: deleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
