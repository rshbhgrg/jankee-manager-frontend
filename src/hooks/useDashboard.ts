/**
 * useDashboard Hook
 *
 * React Query hooks for dashboard data:
 * - Overview metrics (total sites, active, available, etc.)
 * - Recent activities
 * - Revenue metrics
 * - Occupancy trends
 *
 * Dashboard data is cached with shorter stale time for freshness
 */

import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics, getRecentActivities } from '@/services/dashboard.service';
import type { DashboardMetrics } from '@/types';
import { QUERY_KEYS } from '@/config/constants';

/**
 * Fetch dashboard overview metrics
 *
 * Includes:
 * - Total sites count
 * - Active sites count
 * - Available sites count
 * - Total clients count
 * - Recent activities count
 * - Revenue metrics
 *
 * @example
 * const { data: metrics, isLoading } = useDashboardMetricsQuery();
 *
 * if (metrics) {
 *   console.log(`Total Sites: ${metrics.totalSites}`);
 *   console.log(`Occupancy: ${metrics.occupancyRate}%`);
 * }
 */
export function useDashboardMetricsQuery() {
  return useQuery<DashboardMetrics>({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: getDashboardMetrics,
    staleTime: 2 * 60 * 1000, // 2 minutes (dashboard should be fresh)
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
}

/**
 * Fetch recent activities for dashboard
 *
 * Returns the most recent activities (typically last 10-20)
 *
 * @param limit - Number of activities to fetch (default: 10)
 *
 * @example
 * const { data: recentActivities } = useRecentActivitiesQuery(10);
 */
export function useRecentActivitiesQuery(limit = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, 'recent-activities', limit],
    queryFn: () => getRecentActivities(limit),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Combined dashboard hook
 *
 * Returns all dashboard data in one hook
 *
 * @example
 * const {
 *   metrics,
 *   recentActivities,
 *   isLoading,
 *   refetchAll
 * } = useDashboard();
 *
 * if (isLoading) return <LoadingSpinner />;
 *
 * return (
 *   <div>
 *     <MetricsCards metrics={metrics} />
 *     <RecentActivities activities={recentActivities} />
 *   </div>
 * );
 */
export function useDashboard(recentLimit = 10) {
  const metricsQuery = useDashboardMetricsQuery();
  const recentActivitiesQuery = useRecentActivitiesQuery(recentLimit);

  return {
    // Metrics data
    metrics: metricsQuery.data,
    metricsLoading: metricsQuery.isLoading,
    metricsError: metricsQuery.error,

    // Recent activities data
    recentActivities: recentActivitiesQuery.data,
    activitiesLoading: recentActivitiesQuery.isLoading,
    activitiesError: recentActivitiesQuery.error,

    // Combined loading state
    isLoading: metricsQuery.isLoading || recentActivitiesQuery.isLoading,
    isError: metricsQuery.isError || recentActivitiesQuery.isError,

    // Refetch functions
    refetchMetrics: metricsQuery.refetch,
    refetchActivities: recentActivitiesQuery.refetch,
    refetchAll: async () => {
      await Promise.all([metricsQuery.refetch(), recentActivitiesQuery.refetch()]);
    },
  };
}
