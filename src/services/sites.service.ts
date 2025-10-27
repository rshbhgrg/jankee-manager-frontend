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

  const response = await apiClient.get<{ sites: Site[]; count: number }>('/sites', { params });
  // Backend returns {sites: [...], count: 5}, extract the sites array
  return (response.data as any).sites || response.data;
};

/**
 * Get site by ID
 *
 * @param id - Site ID
 * @returns Promise<Site>
 */
export const getSiteById = async (id: string): Promise<Site> => {
  const response = await apiClient.get<{ site: Site }>(`/sites/${id}`);
  // Backend returns {site: {...}}, extract the site object
  return (response.data as any).site || response.data;
};

/**
 * Create new site
 *
 * @param data - Site creation data
 * @returns Promise<Site>
 */
export const createSite = async (data: CreateSiteRequest): Promise<Site> => {
  const response = await apiClient.post<{ site: Site }>('/sites', data);
  // Backend returns {site: {...}}, extract the site object
  return (response.data as any).site || response.data;
};

/**
 * Update existing site
 *
 * @param id - Site ID
 * @param data - Site update data
 * @returns Promise<Site>
 */
export const updateSite = async (id: string, data: Partial<CreateSiteRequest>): Promise<Site> => {
  const response = await apiClient.put<{ site: Site }>(`/sites/${id}`, data);
  // Backend returns {site: {...}}, extract the site object
  return (response.data as any).site || response.data;
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
  const response = await apiClient.get<{ sites: Site[]; count: number }>('/sites/search', {
    params: { q: searchTerm },
  });
  // Backend returns {sites: [...], count: N}, extract the sites array
  return (response.data as any).sites || response.data;
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
