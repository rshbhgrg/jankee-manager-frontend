/**
 * DataTable Component
 *
 * Generic, reusable table component with:
 * - Sortable columns
 * - Row selection
 * - Custom cell rendering
 * - Loading and empty states
 * - Pagination support
 *
 * Built on shadcn/ui Table primitives
 */

import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

/**
 * Column definition for the table
 */
export interface DataTableColumn<T> {
  /** Column unique identifier */
  id: string;
  /** Column header label */
  header: string;
  /** Accessor function to get cell value from row data */
  accessorKey?: keyof T;
  /** Custom cell renderer function */
  cell?: (row: T) => ReactNode;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Custom CSS classes for column cells */
  className?: string;
  /** Custom CSS classes for header cell */
  headerClassName?: string;
}

/**
 * Props for DataTable component
 */
export interface DataTableProps<T> {
  /** Array of data rows */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row IDs */
  selectedRows?: string[];
  /** Callback when row selection changes */
  onRowSelectionChange?: (selectedIds: string[]) => void;
  /** Row ID accessor */
  getRowId?: (row: T) => string;
  /** Current sort configuration */
  sortBy?: { column: string; direction: 'asc' | 'desc' };
  /** Callback when sort changes */
  onSortChange?: (column: string) => void;
  /** Custom CSS classes for table container */
  className?: string;
  /** Callback when row is clicked */
  onRowClick?: (row: T) => void;
}

/**
 * Generic data table component
 *
 * Features:
 * - Type-safe column definitions
 * - Sortable columns with indicators
 * - Optional row selection
 * - Custom cell rendering
 * - Loading and empty states
 * - Click handlers for rows
 *
 * @example
 * ```tsx
 * const columns: DataTableColumn<Site>[] = [
 *   {
 *     id: 'siteNo',
 *     header: 'Site Number',
 *     accessorKey: 'siteNo',
 *     sortable: true,
 *   },
 *   {
 *     id: 'actions',
 *     header: 'Actions',
 *     cell: (row) => <ActionButtons row={row} />,
 *   },
 * ];
 *
 * <DataTable
 *   data={sites}
 *   columns={columns}
 *   loading={isLoading}
 *   sortBy={sortConfig}
 *   onSortChange={handleSort}
 * />
 * ```
 */
export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  selectable = false,
  selectedRows = [],
  onRowSelectionChange,
  getRowId = (row: T) => (row as { id: string }).id,
  sortBy,
  onSortChange,
  className,
  onRowClick,
}: DataTableProps<T>) {
  /**
   * Handle select all checkbox
   */
  const handleSelectAll = (checked: boolean) => {
    if (!onRowSelectionChange) return;
    const allIds = data.map((row) => getRowId(row));
    onRowSelectionChange(checked ? allIds : []);
  };

  /**
   * Handle individual row selection
   */
  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!onRowSelectionChange) return;
    const newSelection = checked
      ? [...selectedRows, rowId]
      : selectedRows.filter((id) => id !== rowId);
    onRowSelectionChange(newSelection);
  };

  /**
   * Check if all rows are selected
   */
  const allSelected = data.length > 0 && selectedRows.length === data.length;

  /**
   * Check if some (but not all) rows are selected
   */
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  /**
   * Render sort icon for column header
   */
  const renderSortIcon = (columnId: string) => {
    if (!sortBy || sortBy.column !== columnId) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortBy.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading data..." />
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border border-gray-200', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Select all checkbox */}
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  {...(someSelected && { 'data-state': 'indeterminate' })}
                />
              </TableHead>
            )}

            {/* Column headers */}
            {columns.map((column) => (
              <TableHead key={column.id} className={column.headerClassName}>
                {column.sortable && onSortChange ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSortChange(column.id)}
                    className="-ml-3 h-8 font-semibold"
                  >
                    {column.header}
                    {renderSortIcon(column.id)}
                  </Button>
                ) : (
                  <span className="font-semibold">{column.header}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => {
            const rowId = getRowId(row);
            const isSelected = selectedRows.includes(rowId);

            return (
              <TableRow
                key={rowId}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-gray-50',
                  isSelected && 'bg-blue-50'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {/* Row selection checkbox */}
                {selectable && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectRow(rowId, checked as boolean)}
                      aria-label={`Select row ${rowId}`}
                    />
                  </TableCell>
                )}

                {/* Row cells */}
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.className}>
                    {column.cell
                      ? column.cell(row)
                      : column.accessorKey
                        ? String(row[column.accessorKey])
                        : '-'}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
