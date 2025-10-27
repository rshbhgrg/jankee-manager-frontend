/**
 * Sites List Page
 *
 * Displays all sites in a searchable, filterable table with:
 * - Client-side search by site number or location (instant)
 * - Client-side filter by type (unipole/hoarding) (instant)
 * - Sortable columns
 * - Actions (view, edit, delete)
 * - Create new site button
 *
 * Uses DataTable component for display
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/PageHeader';
import { SearchBar } from '@/components/SearchBar';
import { DataTable, DataTableColumn } from '@/components/DataTable';
import { ActionButtons } from '@/components/ActionButtons';
import { SiteTypeBadge } from '@/components/StatusBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState, ErrorState, FirstTimeEmpty } from '@/components/EmptyState';
import { useSitesQuery, useDeleteSiteMutation } from '@/hooks/useSites';
import { useFilterStore } from '@/stores/filterStore';
import { formatDate } from '@/lib/utils/format';
import { ROUTES } from '@/config/constants';
import type { Site, SiteType } from '@/types';

/**
 * Sites List Page Component
 */
export function SitesPage() {
  const navigate = useNavigate();
  const { sitesFilters, setSitesFilters, resetSitesFilters, setSitesSearch } = useFilterStore();
  const [showFilters, setShowFilters] = useState(false);

  // Fetch ALL sites (no server-side filtering)
  const { data: allSites, isLoading, isError, refetch } = useSitesQuery();

  // Delete mutation
  const { mutate: deleteSite } = useDeleteSiteMutation();

  /**
   * Client-side filtering - instant search and filter, no API calls
   */
  const filteredSites = useMemo(() => {
    if (!allSites) return [];

    return allSites.filter((site) => {
      // Search filter
      if (sitesFilters.searchTerm) {
        const searchLower = sitesFilters.searchTerm.toLowerCase();
        const matchesSearch =
          site.siteNo.toLowerCase().includes(searchLower) ||
          site.location.toLowerCase().includes(searchLower) ||
          site.address?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (sitesFilters.type && site.type !== sitesFilters.type) {
        return false;
      }

      return true;
    });
  }, [allSites, sitesFilters.searchTerm, sitesFilters.type]);

  /**
   * Handle site deletion
   */
  const handleDelete = (id: string) => {
    deleteSite(id);
  };

  /**
   * Handle search
   */
  const handleSearch = (value: string) => {
    setSitesSearch(value);
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    resetSitesFilters();
  };

  /**
   * Table columns definition
   */
  const columns: DataTableColumn<Site>[] = [
    {
      id: 'siteNo',
      header: 'Site Number',
      accessorKey: 'siteNo',
      sortable: true,
      cell: (site) => (
        <button
          onClick={() => navigate(ROUTES.SITES_DETAIL(site.id))}
          className="font-medium text-blue-600 hover:underline"
        >
          {site.siteNo}
        </button>
      ),
    },
    {
      id: 'location',
      header: 'Location',
      accessorKey: 'location',
      sortable: true,
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
      sortable: true,
      cell: (site) => <SiteTypeBadge type={site.type} />,
    },
    {
      id: 'size',
      header: 'Size',
      accessorKey: 'size',
    },
    {
      id: 'updatedAt',
      header: 'Last Updated',
      accessorKey: 'updatedAt',
      sortable: true,
      cell: (site) => formatDate(site.updatedAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (site) => (
        <ActionButtons
          variant="dropdown"
          onView={() => navigate(ROUTES.SITES_DETAIL(site.id))}
          onEdit={() => navigate(ROUTES.SITES_EDIT(site.id))}
          onDelete={() => handleDelete(site.id)}
          deleteMessage={`Are you sure you want to delete site ${site.siteNo}? This action cannot be undone.`}
        />
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading sites..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  // No sites at all (first time)
  if (!allSites || (allSites.length === 0 && !sitesFilters.searchTerm && !sitesFilters.type)) {
    return (
      <div>
        <PageHeader title="Sites" description="Manage advertising sites and locations" />
        <FirstTimeEmpty resourceName="site" onCreateNew={() => navigate(ROUTES.SITES_NEW)} />
      </div>
    );
  }

  // Has filters but no results
  const hasActiveFilters = !!(
    sitesFilters.searchTerm ||
    sitesFilters.type ||
    sitesFilters.location
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Sites"
        description={`${filteredSites.length} of ${allSites?.length || 0} sites`}
        actions={
          <Button onClick={() => navigate(ROUTES.SITES_NEW)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Site
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="flex-1 sm:max-w-sm">
          <SearchBar
            value={sitesFilters.searchTerm}
            onSearch={handleSearch}
            placeholder="Search sites..."
          />
        </div>

        {/* Filter Button */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-gray-100' : ''}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {
                  [sitesFilters.searchTerm, sitesFilters.type, sitesFilters.location].filter(
                    Boolean
                  ).length
                }
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={handleClearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-lg border bg-white p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Type Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium">Type</label>
              <Select
                value={sitesFilters.type || 'all'}
                onValueChange={(value) =>
                  setSitesFilters({ type: value === 'all' ? undefined : (value as SiteType) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="unipole">Unipole</SelectItem>
                  <SelectItem value="hoarding">Hoarding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <Select
                value={sitesFilters.status || 'all'}
                onValueChange={(value) =>
                  setSitesFilters({
                    status: value === 'all' ? undefined : (value as 'active' | 'available'),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter - Could be enhanced with autocomplete */}
            <div>
              <label className="mb-2 block text-sm font-medium">Location</label>
              <Select
                value={sitesFilters.location || 'all'}
                onValueChange={(value) =>
                  setSitesFilters({ location: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {/* Dynamically populated in real app */}
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Sites Table */}
      {filteredSites && filteredSites.length > 0 ? (
        <DataTable
          data={filteredSites}
          columns={columns}
          onRowClick={(site) => navigate(ROUTES.SITES_DETAIL(site.id))}
        />
      ) : (
        <EmptyState
          variant="no-results"
          title="No sites found"
          description="Try adjusting your search or filters"
          action={{
            label: 'Clear filters',
            onClick: handleClearFilters,
          }}
        />
      )}
    </div>
  );
}
