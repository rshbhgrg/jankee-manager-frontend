/**
 * Dashboard Service
 *
 * API methods for dashboard data and statistics
 * All methods return typed responses and handle errors consistently
 */

import apiClient from './api';
import type { DashboardStats, DashboardMetrics } from '@/types';
import type {
  Activity,
  ActivityWithRelations,
  transformActivityWithRelations,
} from '@/types/activity.types';
import { transformActivityWithRelations as transformActivity } from '@/types/activity.types';

/**
 * Get dashboard statistics
 *
 * Returns key metrics for the dashboard:
 * - Total sites, active sites, available sites
 * - Total clients
 * - Total activities, new bookings, client shifts
 * - Total revenue
 *
 * @returns Promise<DashboardStats>
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/dashboard/stats');
  return response.data;
};

/**
 * Get dashboard metrics (includes occupancy rate)
 *
 * Extended version of dashboard stats with calculated metrics
 *
 * @returns Promise<DashboardMetrics>
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await apiClient.get<{ metrics: DashboardMetrics }>('/dashboard/metrics');
  // Backend returns {metrics: {...}}, extract the metrics object
  return (response.data as any).metrics || response.data;
};

/**
 * Get recent activities
 *
 * Returns the most recent activities for dashboard display
 * Transforms nested backend structure to flat Activity objects
 *
 * @param limit - Number of activities to fetch (default: 10)
 * @returns Promise<Activity[]>
 */
export const getRecentActivities = async (limit = 10): Promise<Activity[]> => {
  const response = await apiClient.get<{ activities: ActivityWithRelations[]; count: number }>(
    '/dashboard/recent-activities',
    {
      params: { limit },
    }
  );

  // Backend returns {activities: [{activity, site, client}], count: 3}
  const data = response.data as any;
  const activitiesWithRelations = data.activities || data;

  // Transform nested structure to flat Activity objects
  return activitiesWithRelations.map(transformActivity);
};
