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

  const response = await apiClient.get<{ clients: Client[]; count: number }>('/clients', {
    params,
  });
  // Backend returns {clients: [...], count: 4}, extract the clients array
  return (response.data as any).clients || response.data;
};

/**
 * Get client by ID
 *
 * @param id - Client ID
 * @returns Promise<Client>
 */
export const getClientById = async (id: string): Promise<Client> => {
  const response = await apiClient.get<{ client: Client }>(`/clients/${id}`);
  // Backend returns {client: {...}}, extract the client object
  return (response.data as any).client || response.data;
};

/**
 * Create new client
 *
 * @param data - Client creation data
 * @returns Promise<Client>
 */
export const createClient = async (data: CreateClientRequest): Promise<Client> => {
  const response = await apiClient.post<{ client: Client }>('/clients', data);
  // Backend returns {client: {...}}, extract the client object
  return (response.data as any).client || response.data;
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
  const response = await apiClient.put<{ client: Client }>(`/clients/${id}`, data);
  // Backend returns {client: {...}}, extract the client object
  return (response.data as any).client || response.data;
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
  const response = await apiClient.get<{ clients: Client[]; count: number }>('/clients/search', {
    params: { q: searchTerm },
  });
  // Backend returns {clients: [...], count: N}, extract the clients array
  return (response.data as any).clients || response.data;
};
