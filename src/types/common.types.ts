/**
 * Common Type Definitions
 *
 * Shared types used across the application
 * Includes API responses, pagination, filters, etc.
 */

/**
 * API Response Wrapper
 *
 * Standard response format from backend API
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  error?: ApiError;
}

/**
 * API Error
 *
 * Error response format from backend
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Pagination Metadata
 *
 * Pagination information included in list responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Pagination Parameters
 *
 * Query parameters for paginated requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Sort Order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort Parameters
 *
 * Query parameters for sorting
 */
export interface SortParams {
  sortBy?: string;
  order?: SortOrder;
}

/**
 * Dashboard Statistics
 *
 * Key metrics displayed on dashboard
 */
export interface DashboardStats {
  totalSites: number;
  activeSites: number;
  availableSites: number;
  totalClients: number;
  totalActivities: number;
  totalRevenue: number;
  newBookings: number;
  clientShifts: number;
}

/**
 * Dashboard Metrics (alias for DashboardStats)
 *
 * Extended metrics with occupancy rate
 */
export interface DashboardMetrics extends DashboardStats {
  occupancyRate: number; // Percentage of active sites
}

/**
 * Form Mode
 *
 * Determines if form is in create or edit mode
 */
export type FormMode = 'create' | 'edit';

/**
 * Loading State
 *
 * Possible loading states for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Autocomplete Option
 *
 * Generic autocomplete/select option
 */
export interface AutocompleteOption<T = string> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

/**
 * Date Range
 *
 * For date range filters
 */
export interface DateRange {
  from: string;
  to: string;
}

/**
 * Navigation Item
 *
 * Menu/navigation configuration
 */
export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  badge?: string | number;
  children?: NavigationItem[];
}

/**
 * Toast Notification
 *
 * Toast message configuration
 */
export interface ToastNotification {
  id?: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
}

/**
 * Column Definition for Tables
 *
 * Generic table column configuration
 */
export interface ColumnDef<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => unknown);
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
}

/**
 * Filter Config
 *
 * Generic filter configuration
 */
export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  options?: AutocompleteOption[];
  placeholder?: string;
}

/**
 * Action Button Config
 *
 * Configuration for action buttons in tables/lists
 */
export interface ActionButton<T = unknown> {
  label: string;
  icon?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  onClick: (item: T) => void;
  hidden?: (item: T) => boolean;
  disabled?: (item: T) => boolean;
}
