/**
 * Activities Service
 *
 * API methods for activity/booking management
 * All methods return typed responses and handle errors consistently
 */

import apiClient from './api';
import type { Activity, CreateActivityRequest, ActivityFilters } from '@/types';

/**
 * Get all activities with optional filters
 *
 * @param filters - Optional filter criteria
 * @returns Promise<Activity[]>
 */
export const getActivities = async (filters?: ActivityFilters): Promise<Activity[]> => {
  const params = {
    ...(filters?.siteId && { siteId: filters.siteId }),
    ...(filters?.clientId && { clientId: filters.clientId }),
    ...(filters?.action && { action: filters.action }),
    ...(filters?.billType && { billType: filters.billType }),
    ...(filters?.fromDate && { fromDate: filters.fromDate }),
    ...(filters?.toDate && { toDate: filters.toDate }),
    ...(filters?.searchTerm && { search: filters.searchTerm }),
  };

  const response = await apiClient.get<Activity[]>('/activities', { params });
  return response.data;
};

/**
 * Get activity by ID
 *
 * @param id - Activity ID
 * @returns Promise<Activity>
 */
export const getActivityById = async (id: string): Promise<Activity> => {
  const response = await apiClient.get<Activity>(`/activities/${id}`);
  return response.data;
};

/**
 * Get activities for a specific site
 *
 * @param siteId - Site ID
 * @returns Promise<Activity[]>
 */
export const getActivitiesBySite = async (siteId: string): Promise<Activity[]> => {
  const response = await apiClient.get<Activity[]>(`/activities/site/${siteId}`);
  return response.data;
};

/**
 * Get activities for a specific client
 *
 * @param clientId - Client ID
 * @returns Promise<Activity[]>
 */
export const getActivitiesByClient = async (clientId: string): Promise<Activity[]> => {
  const response = await apiClient.get<Activity[]>(`/activities/client/${clientId}`);
  return response.data;
};

/**
 * Create new activity
 *
 * @param data - Activity creation data
 * @returns Promise<Activity>
 */
export const createActivity = async (data: CreateActivityRequest): Promise<Activity> => {
  const response = await apiClient.post<Activity>('/activities', data);
  return response.data;
};

/**
 * Update existing activity
 *
 * @param id - Activity ID
 * @param data - Activity update data
 * @returns Promise<Activity>
 */
export const updateActivity = async (
  id: string,
  data: Partial<CreateActivityRequest>
): Promise<Activity> => {
  const response = await apiClient.put<Activity>(`/activities/${id}`, data);
  return response.data;
};

/**
 * Delete activity
 *
 * @param id - Activity ID
 * @returns Promise<void>
 */
export const deleteActivity = async (id: string): Promise<void> => {
  await apiClient.delete(`/activities/${id}`);
};
