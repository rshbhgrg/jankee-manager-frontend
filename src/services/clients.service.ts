/**
 * Clients Service
 *
 * API methods for client management
 * All methods return typed responses and handle errors consistently
 */

import apiClient from './api';
import type { Client, CreateClientRequest, ClientFilters } from '@/types';

/**
 * Get all clients with optional filters
 *
 * @param filters - Optional filter criteria
 * @returns Promise<Client[]>
 */
export const getClients = async (filters?: ClientFilters): Promise<Client[]> => {
  const params = {
    ...(filters?.searchTerm && { search: filters.searchTerm }),
  };

  const response = await apiClient.get<Client[]>('/clients', { params });
  return response.data;
};

/**
 * Get client by ID
 *
 * @param id - Client ID
 * @returns Promise<Client>
 */
export const getClientById = async (id: string): Promise<Client> => {
  const response = await apiClient.get<Client>(`/clients/${id}`);
  return response.data;
};

/**
 * Create new client
 *
 * @param data - Client creation data
 * @returns Promise<Client>
 */
export const createClient = async (data: CreateClientRequest): Promise<Client> => {
  const response = await apiClient.post<Client>('/clients', data);
  return response.data;
};

/**
 * Update existing client
 *
 * @param id - Client ID
 * @param data - Client update data
 * @returns Promise<Client>
 */
export const updateClient = async (
  id: string,
  data: Partial<CreateClientRequest>
): Promise<Client> => {
  const response = await apiClient.put<Client>(`/clients/${id}`, data);
  return response.data;
};

/**
 * Delete client
 *
 * @param id - Client ID
 * @returns Promise<void>
 */
export const deleteClient = async (id: string): Promise<void> => {
  await apiClient.delete(`/clients/${id}`);
};

/**
 * Search clients by keyword
 *
 * @param searchTerm - Search keyword
 * @returns Promise<Client[]>
 */
export const searchClients = async (searchTerm: string): Promise<Client[]> => {
  const response = await apiClient.get<Client[]>('/clients/search', {
    params: { q: searchTerm },
  });
  return response.data;
};
