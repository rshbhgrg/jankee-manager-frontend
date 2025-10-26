/**
 * useClients Hook
 *
 * React Query hooks for clients data:
 * - Fetch all clients with filters
 * - Fetch single client by ID
 * - Search clients
 * - Create, update, delete client mutations
 *
 * Handles caching, loading states, and optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getClients,
  getClientById,
  searchClients,
  createClient,
  updateClient,
  deleteClient,
} from '@/services/clients.service';
import type { Client, CreateClientRequest, ClientFilters } from '@/types';
import { QUERY_KEYS } from '@/config/constants';

/**
 * Fetch all clients with optional filters
 *
 * @param filters - Optional filter criteria
 *
 * @example
 * const { data: clients, isLoading } = useClientsQuery({
 *   searchTerm: 'Acme'
 * });
 */
export function useClientsQuery(filters?: ClientFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CLIENTS, filters],
    queryFn: () => getClients(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single client by ID
 *
 * @param id - Client ID
 *
 * @example
 * const { data: client, isLoading } = useClientQuery(clientId);
 */
export function useClientQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENT(id),
    queryFn: () => getClientById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Search clients by keyword
 *
 * Debounced search query
 *
 * @param searchTerm - Search keyword
 *
 * @example
 * const { data: results } = useClientSearchQuery(debouncedSearch);
 */
export function useClientSearchQuery(searchTerm: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CLIENTS, 'search', searchTerm],
    queryFn: () => searchClients(searchTerm),
    enabled: searchTerm.length >= 2, // Only search with 2+ characters
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Create new client mutation
 *
 * @example
 * const { mutate: createNewClient } = useCreateClientMutation();
 *
 * createNewClient(clientData, {
 *   onSuccess: (newClient) => {
 *     navigate(`/clients/${newClient.id}`);
 *   }
 * });
 */
export function useCreateClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientRequest) => createClient(data),
    onSuccess: (newClient) => {
      // Invalidate clients list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });

      toast.success('Client created successfully', {
        description: `${newClient.clientName} has been created.`,
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to create client', {
        description: error.message || 'An error occurred while creating the client.',
      });
    },
  });
}

/**
 * Update existing client mutation
 *
 * Uses optimistic updates
 *
 * @example
 * const { mutate: updateExistingClient } = useUpdateClientMutation();
 *
 * updateExistingClient({ id: clientId, data: updates });
 */
export function useUpdateClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateClientRequest> }) =>
      updateClient(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CLIENT(id) });

      const previousClient = queryClient.getQueryData<Client>(QUERY_KEYS.CLIENT(id));

      if (previousClient) {
        queryClient.setQueryData<Client>(QUERY_KEYS.CLIENT(id), {
          ...previousClient,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousClient };
    },
    onSuccess: (updatedClient) => {
      queryClient.setQueryData(QUERY_KEYS.CLIENT(updatedClient.id), updatedClient);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });

      toast.success('Client updated successfully');
    },
    onError: (error: Error, { id }, context) => {
      if (context?.previousClient) {
        queryClient.setQueryData(QUERY_KEYS.CLIENT(id), context.previousClient);
      }

      toast.error('Failed to update client', {
        description: error.message,
      });
    },
  });
}

/**
 * Delete client mutation
 *
 * @example
 * const { mutate: removeClient } = useDeleteClientMutation();
 *
 * removeClient(clientId, {
 *   onSuccess: () => {
 *     navigate('/clients');
 *   }
 * });
 */
export function useDeleteClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.CLIENT(deletedId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });

      toast.success('Client deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete client', {
        description: error.message,
      });
    },
  });
}

/**
 * Combined hook for all client operations
 *
 * @example
 * const {
 *   clients,
 *   isLoading,
 *   createClient,
 *   updateClient,
 *   deleteClient
 * } = useClients({ searchTerm: 'Acme' });
 */
export function useClients(filters?: ClientFilters) {
  const clientsQuery = useClientsQuery(filters);
  const createMutation = useCreateClientMutation();
  const updateMutation = useUpdateClientMutation();
  const deleteMutation = useDeleteClientMutation();

  return {
    // Query data
    clients: clientsQuery.data,
    isLoading: clientsQuery.isLoading,
    isError: clientsQuery.isError,
    error: clientsQuery.error,
    refetch: clientsQuery.refetch,

    // Mutations
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
