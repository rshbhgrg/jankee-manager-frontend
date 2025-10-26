/**
 * Sites Service
 *
 * API methods for site management
 * All methods return typed responses and handle errors consistently
 */

import apiClient from './api';
import type { Site, CreateSiteRequest, SiteFilters, SiteCurrentStatus } from '@/types';

/**
 * Get all sites with optional filters
 *
 * @param filters - Optional filter criteria
 * @returns Promise<Site[]>
 */
export const getSites = async (filters?: SiteFilters): Promise<Site[]> => {
  const params = {
    ...(filters?.type && { type: filters.type }),
    ...(filters?.location && { location: filters.location }),
    ...(filters?.searchTerm && { search: filters.searchTerm }),
  };

  const response = await apiClient.get<Site[]>('/sites', { params });
  return response.data;
};

/**
 * Get site by ID
 *
 * @param id - Site ID
 * @returns Promise<Site>
 */
export const getSiteById = async (id: string): Promise<Site> => {
  const response = await apiClient.get<Site>(`/sites/${id}`);
  return response.data;
};

/**
 * Create new site
 *
 * @param data - Site creation data
 * @returns Promise<Site>
 */
export const createSite = async (data: CreateSiteRequest): Promise<Site> => {
  const response = await apiClient.post<Site>('/sites', data);
  return response.data;
};

/**
 * Update existing site
 *
 * @param id - Site ID
 * @param data - Site update data
 * @returns Promise<Site>
 */
export const updateSite = async (id: string, data: Partial<CreateSiteRequest>): Promise<Site> => {
  const response = await apiClient.put<Site>(`/sites/${id}`, data);
  return response.data;
};

/**
 * Delete site
 *
 * @param id - Site ID
 * @returns Promise<void>
 */
export const deleteSite = async (id: string): Promise<void> => {
  await apiClient.delete(`/sites/${id}`);
};

/**
 * Search sites by keyword
 *
 * @param searchTerm - Search keyword
 * @returns Promise<Site[]>
 */
export const searchSites = async (searchTerm: string): Promise<Site[]> => {
  const response = await apiClient.get<Site[]>('/sites/search', {
    params: { q: searchTerm },
  });
  return response.data;
};

/**
 * Get sites with current status (occupancy info)
 *
 * Used in dashboard to show which sites are active/available
 * @returns Promise<SiteCurrentStatus[]>
 */
export const getSitesWithStatus = async (): Promise<SiteCurrentStatus[]> => {
  const response = await apiClient.get<SiteCurrentStatus[]>('/sites/status');
  return response.data;
};
