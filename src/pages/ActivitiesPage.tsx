/**
 * Activities List Page
 *
 * Displays all activities with:
 * - Search by site or client
 * - Filter by action type and date range
 * - Sortable columns
 * - Actions (view, edit, delete)
 * - Create new activity button
 *
 * Activities show site bookings and client interactions
 */

import { useState } from 'react';
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
import { ActionTypeBadge } from '@/components/StatusBadge';
import { DateRangePicker } from '@/components/forms/DatePicker';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState, ErrorState, FirstTimeEmpty } from '@/components/EmptyState';
import { useActivitiesQuery, useDeleteActivityMutation } from '@/hooks/useActivities';
import { useFilterStore } from '@/stores/filterStore';
import { formatDate, formatCurrency } from '@/lib/utils/format';
import { ROUTES } from '@/config/constants';
import type { Activity, ActionType } from '@/types';

/**
 * Activities List Page Component
 */
export function ActivitiesPage() {
  const navigate = useNavigate();
  const {
    activitiesFilters,
    setActivitiesFilters,
    resetActivitiesFilters,
    setActivitiesSearch,
    setActivitiesDateRange,
  } = useFilterStore();
  const [showFilters, setShowFilters] = useState(false);

  // Fetch activities with filters
  const {
    data: activities,
    isLoading,
    isError,
    refetch,
  } = useActivitiesQuery({
    searchTerm: activitiesFilters.searchTerm,
    action: activitiesFilters.action,
    fromDate: activitiesFilters.dateFrom,
    toDate: activitiesFilters.dateTo,
    clientId: activitiesFilters.clientId,
    siteId: activitiesFilters.siteId,
  });

  // Delete mutation
  const { mutate: deleteActivity } = useDeleteActivityMutation();

  /**
   * Handle activity deletion
   */
  const handleDelete = (id: string) => {
    deleteActivity(id);
  };

  /**
   * Handle search
   */
  const handleSearch = (value: string) => {
    setActivitiesSearch(value);
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    resetActivitiesFilters();
  };

  /**
   * Table columns definition
   */
  const columns: DataTableColumn<Activity>[] = [
    {
      id: 'date',
      header: 'Date',
      accessorKey: 'createdAt',
      sortable: true,
      cell: (activity) => formatDate(activity.createdAt),
    },
    {
      id: 'siteNo',
      header: 'Site',
      accessorKey: 'siteNo',
      sortable: true,
      cell: (activity) => <span className="font-medium">{activity.siteNo}</span>,
    },
    {
      id: 'clientName',
      header: 'Client',
      accessorKey: 'clientName',
      sortable: true,
      cell: (activity) => <span className="font-medium">{activity.clientName}</span>,
    },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'action',
      sortable: true,
      cell: (activity) => <ActionTypeBadge action={activity.action} />,
    },
    {
      id: 'fromDate',
      header: 'From',
      accessorKey: 'startDate',
      cell: (activity) => formatDate(activity.startDate),
    },
    {
      id: 'toDate',
      header: 'To',
      accessorKey: 'endDate',
      cell: (activity) => (activity.endDate ? formatDate(activity.endDate) : 'Ongoing'),
    },
    {
      id: 'ratePerMonth',
      header: 'Rate/Month',
      accessorKey: 'ratePerMonth',
      cell: (activity) => (activity.ratePerMonth ? formatCurrency(activity.ratePerMonth) : '-'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (activity) => (
        <ActionButtons
          variant="dropdown"
          onEdit={() => navigate(ROUTES.ACTIVITIES_EDIT(activity.id))}
          onDelete={() => handleDelete(activity.id)}
          deleteMessage={`Are you sure you want to delete this activity? This action cannot be undone.`}
        />
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading activities..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  // No activities at all (first time)
  if (!activities || (activities.length === 0 && !hasActiveFilters(activitiesFilters))) {
    return (
      <div>
        <PageHeader title="Activities" description="Manage site activities and bookings" />
        <FirstTimeEmpty
          resourceName="activity"
          onCreateNew={() => navigate(ROUTES.ACTIVITIES_NEW)}
        />
      </div>
    );
  }

  const hasFilters = hasActiveFilters(activitiesFilters);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Activities"
        description={`${activities?.length || 0} activities total`}
        actions={
          <Button onClick={() => navigate(ROUTES.ACTIVITIES_NEW)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Activity
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="flex-1 sm:max-w-sm">
          <SearchBar
            value={activitiesFilters.searchTerm}
            onSearch={handleSearch}
            placeholder="Search activities..."
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
            {hasFilters && (
              <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {countActiveFilters(activitiesFilters)}
              </span>
            )}
          </Button>

          {hasFilters && (
            <Button variant="ghost" onClick={handleClearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-lg border bg-white p-4">
          <div className="space-y-4">
            {/* Action Type Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium">Action Type</label>
              <Select
                value={activitiesFilters.action || 'all'}
                onValueChange={(value) =>
                  setActivitiesFilters({
                    action: value === 'all' ? undefined : (value as ActionType),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="shift">Shift</SelectItem>
                  <SelectItem value="flex_change">Flex Change</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium">Date Range</label>
              <DateRangePicker
                startDate={activitiesFilters.dateFrom || ''}
                endDate={activitiesFilters.dateTo || ''}
                onStartDateChange={(date) => setActivitiesDateRange(date, activitiesFilters.dateTo)}
                onEndDateChange={(date) => setActivitiesDateRange(activitiesFilters.dateFrom, date)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Activities Table */}
      {activities && activities.length > 0 ? (
        <DataTable data={activities} columns={columns} />
      ) : (
        <EmptyState
          variant="no-results"
          title="No activities found"
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

/**
 * Helper function to check if any filters are active
 */
function hasActiveFilters(filters: {
  searchTerm: string;
  action?: ActionType;
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  siteId?: string;
}): boolean {
  return !!(
    filters.searchTerm ||
    filters.action ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.clientId ||
    filters.siteId
  );
}

/**
 * Count active filters
 */
function countActiveFilters(filters: {
  searchTerm: string;
  action?: ActionType;
  dateFrom?: string;
  dateTo?: string;
}): number {
  let count = 0;
  if (filters.searchTerm) count++;
  if (filters.action) count++;
  if (filters.dateFrom || filters.dateTo) count++;
  return count;
}
