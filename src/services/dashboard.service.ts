/**
 * Dashboard Service
 *
 * API methods for dashboard data and statistics
 * All methods return typed responses and handle errors consistently
 */

import apiClient from './api';
import type { DashboardStats } from '@/types';

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
