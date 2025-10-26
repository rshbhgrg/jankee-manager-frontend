/**
 * useActivities Hook
 *
 * React Query hooks for activities data:
 * - Fetch all activities with filters
 * - Fetch single activity by ID
 * - Fetch activities by site/client
 * - Create, update, delete activity mutations
 *
 * Handles caching, loading states, and optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getActivities,
  getActivityById,
  getActivitiesBySite,
  getActivitiesByClient,
  createActivity,
  updateActivity,
  deleteActivity,
} from '@/services/activities.service';
import type { Activity, CreateActivityRequest, ActivityFilters } from '@/types';
import { QUERY_KEYS } from '@/config/constants';

/**
 * Fetch all activities with optional filters
 *
 * @param filters - Optional filter criteria
 *
 * @example
 * const { data: activities, isLoading } = useActivitiesQuery({
 *   clientId: 'client-123',
 *   action: 'new'
 * });
 */
export function useActivitiesQuery(filters?: ActivityFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ACTIVITIES, filters],
    queryFn: () => getActivities(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes (activities change more frequently)
  });
}

/**
 * Fetch single activity by ID
 *
 * @param id - Activity ID
 *
 * @example
 * const { data: activity } = useActivityQuery(activityId);
 */
export function useActivityQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ACTIVITY(id),
    queryFn: () => getActivityById(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Fetch activities for a specific site
 *
 * @param siteId - Site ID
 *
 * @example
 * const { data: siteActivities } = useSiteActivitiesQuery(siteId);
 */
export function useSiteActivitiesQuery(siteId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SITE_ACTIVITIES(siteId),
    queryFn: () => getActivitiesBySite(siteId),
    enabled: !!siteId,
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Fetch activities for a specific client
 *
 * @param clientId - Client ID
 *
 * @example
 * const { data: clientActivities } = useClientActivitiesQuery(clientId);
 */
export function useClientActivitiesQuery(clientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENT_ACTIVITIES(clientId),
    queryFn: () => getActivitiesByClient(clientId),
    enabled: !!clientId,
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Create new activity mutation
 *
 * @example
 * const { mutate: createNewActivity } = useCreateActivityMutation();
 *
 * createNewActivity(activityData, {
 *   onSuccess: () => {
 *     navigate('/activities');
 *   }
 * });
 */
export function useCreateActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityRequest) => createActivity(data),
    onSuccess: (newActivity) => {
      // Invalidate activities list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVITIES });

      // Invalidate site activities
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITE_ACTIVITIES(newActivity.siteId) });

      // Invalidate client activities
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CLIENT_ACTIVITIES(newActivity.clientId),
      });

      // Invalidate sites with status (occupancy changed)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITES_WITH_STATUS });

      // Invalidate dashboard data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });

      toast.success('Activity created successfully', {
        description: `Activity for ${newActivity.siteNo} has been created.`,
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to create activity', {
        description: error.message || 'An error occurred while creating the activity.',
      });
    },
  });
}

/**
 * Update existing activity mutation
 *
 * Uses optimistic updates
 *
 * @example
 * const { mutate: updateExistingActivity } = useUpdateActivityMutation();
 *
 * updateExistingActivity({ id: activityId, data: updates });
 */
export function useUpdateActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateActivityRequest> }) =>
      updateActivity(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.ACTIVITY(id) });

      const previousActivity = queryClient.getQueryData<Activity>(QUERY_KEYS.ACTIVITY(id));

      if (previousActivity) {
        queryClient.setQueryData<Activity>(QUERY_KEYS.ACTIVITY(id), {
          ...previousActivity,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousActivity };
    },
    onSuccess: (updatedActivity) => {
      queryClient.setQueryData(QUERY_KEYS.ACTIVITY(updatedActivity.id), updatedActivity);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVITIES });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SITE_ACTIVITIES(updatedActivity.siteId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CLIENT_ACTIVITIES(updatedActivity.clientId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITES_WITH_STATUS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });

      toast.success('Activity updated successfully');
    },
    onError: (error: Error, { id }, context) => {
      if (context?.previousActivity) {
        queryClient.setQueryData(QUERY_KEYS.ACTIVITY(id), context.previousActivity);
      }

      toast.error('Failed to update activity', {
        description: error.message,
      });
    },
  });
}

/**
 * Delete activity mutation
 *
 * @example
 * const { mutate: removeActivity } = useDeleteActivityMutation();
 *
 * removeActivity(activityId);
 */
export function useDeleteActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.ACTIVITY(deletedId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVITIES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITES_WITH_STATUS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });

      toast.success('Activity deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete activity', {
        description: error.message,
      });
    },
  });
}

/**
 * Combined hook for all activity operations
 *
 * @example
 * const {
 *   activities,
 *   isLoading,
 *   createActivity,
 *   updateActivity,
 *   deleteActivity
 * } = useActivities({ dateFrom: '2024-01-01' });
 */
export function useActivities(filters?: ActivityFilters) {
  const activitiesQuery = useActivitiesQuery(filters);
  const createMutation = useCreateActivityMutation();
  const updateMutation = useUpdateActivityMutation();
  const deleteMutation = useDeleteActivityMutation();

  return {
    // Query data
    activities: activitiesQuery.data,
    isLoading: activitiesQuery.isLoading,
    isError: activitiesQuery.isError,
    error: activitiesQuery.error,
    refetch: activitiesQuery.refetch,

    // Mutations
    createActivity: createMutation.mutate,
    updateActivity: updateMutation.mutate,
    deleteActivity: deleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
