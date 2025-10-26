/**
 * Dashboard Service
 *
 * API methods for dashboard data and statistics
 * All methods return typed responses and handle errors consistently
 */

import apiClient from './api';
import type { DashboardStats, DashboardMetrics, Activity } from '@/types';

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
  const response = await apiClient.get<DashboardMetrics>('/dashboard/metrics');
  return response.data;
};

/**
 * Get recent activities
 *
 * Returns the most recent activities for dashboard display
 *
 * @param limit - Number of activities to fetch (default: 10)
 * @returns Promise<Activity[]>
 */
export const getRecentActivities = async (limit = 10): Promise<Activity[]> => {
  const response = await apiClient.get<Activity[]>('/dashboard/recent-activities', {
    params: { limit },
  });
  return response.data;
};
