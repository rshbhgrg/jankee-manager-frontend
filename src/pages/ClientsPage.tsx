/**
 * Clients List Page
 *
 * Displays all clients in a searchable table with:
 * - Search by client name or GST number
 * - Sortable columns
 * - Actions (view, edit, delete)
 * - Create new client button
 *
 * Uses DataTable component for display
 */

import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { SearchBar } from '@/components/SearchBar';
import { DataTable, DataTableColumn } from '@/components/DataTable';
import { ActionButtons } from '@/components/ActionButtons';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState, ErrorState, FirstTimeEmpty } from '@/components/EmptyState';
import { useClientsQuery, useDeleteClientMutation } from '@/hooks/useClients';
import { useFilterStore } from '@/stores/filterStore';
import { formatDate } from '@/lib/utils/format';
import { ROUTES } from '@/config/constants';
import type { Client } from '@/types';

/**
 * Clients List Page Component
 */
export function ClientsPage() {
  const navigate = useNavigate();
  const { clientsFilters, setClientsSearch, resetClientsFilters } = useFilterStore();

  // Fetch clients with filters
  const {
    data: clients,
    isLoading,
    isError,
    refetch,
  } = useClientsQuery({
    searchTerm: clientsFilters.searchTerm,
  });

  // Delete mutation
  const { mutate: deleteClient } = useDeleteClientMutation();

  /**
   * Handle client deletion
   */
  const handleDelete = (id: string) => {
    deleteClient(id);
  };

  /**
   * Handle search
   */
  const handleSearch = (value: string) => {
    setClientsSearch(value);
  };

  /**
   * Clear filters
   */
  const handleClearFilters = () => {
    resetClientsFilters();
  };

  /**
   * Table columns definition
   */
  const columns: DataTableColumn<Client>[] = [
    {
      id: 'clientName',
      header: 'Client Name',
      accessorKey: 'clientName',
      sortable: true,
      cell: (client) => (
        <button
          onClick={() => navigate(ROUTES.CLIENTS_DETAIL(client.id))}
          className="font-medium text-blue-600 hover:underline"
        >
          {client.clientName}
        </button>
      ),
    },
    {
      id: 'gstNo',
      header: 'GST Number',
      accessorKey: 'gstNo',
      sortable: true,
      cell: (client) => <span className="font-mono text-sm">{client.gstNo}</span>,
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
      sortable: true,
      cell: (client) => formatDate(client.createdAt),
    },
    {
      id: 'updatedAt',
      header: 'Last Updated',
      accessorKey: 'updatedAt',
      sortable: true,
      cell: (client) => formatDate(client.updatedAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (client) => (
        <ActionButtons
          variant="dropdown"
          onView={() => navigate(ROUTES.CLIENTS_DETAIL(client.id))}
          onEdit={() => navigate(ROUTES.CLIENTS_EDIT(client.id))}
          onDelete={() => handleDelete(client.id)}
          deleteMessage={`Are you sure you want to delete client "${client.clientName}"? This action cannot be undone.`}
        />
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading clients..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  // No clients at all (first time)
  if (!clients || (clients.length === 0 && !clientsFilters.searchTerm)) {
    return (
      <div>
        <PageHeader title="Clients" description="Manage your advertising clients" />
        <FirstTimeEmpty resourceName="client" onCreateNew={() => navigate(ROUTES.CLIENTS_NEW)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Clients"
        description={`${clients?.length || 0} clients total`}
        actions={
          <Button onClick={() => navigate(ROUTES.CLIENTS_NEW)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Client
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 sm:max-w-sm">
          <SearchBar
            value={clientsFilters.searchTerm}
            onSearch={handleSearch}
            placeholder="Search by name or GST number..."
          />
        </div>

        {clientsFilters.searchTerm && (
          <Button variant="ghost" onClick={handleClearFilters}>
            Clear Search
          </Button>
        )}
      </div>

      {/* Clients Table */}
      {clients && clients.length > 0 ? (
        <DataTable
          data={clients}
          columns={columns}
          onRowClick={(client) => navigate(ROUTES.CLIENTS_DETAIL(client.id))}
        />
      ) : (
        <EmptyState
          variant="no-results"
          title="No clients found"
          description={`No clients match "${clientsFilters.searchTerm}"`}
          action={{
            label: 'Clear search',
            onClick: handleClearFilters,
          }}
        />
      )}
    </div>
  );
}
