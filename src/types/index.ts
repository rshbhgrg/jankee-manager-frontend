/**
 * Type Definitions - Central Export
 *
 * Re-exports all type definitions for clean imports
 * Usage: import { Site, Client, Activity } from '@/types';
 */

// Site types
export type {
  Site,
  SiteType,
  CreateSiteRequest,
  UpdateSiteRequest,
  SiteFilters,
  SiteSearchResult,
  SiteCurrentStatus,
  SiteStatus,
} from './site.types';
export { getSiteStatus } from './site.types';

// Client types
export type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  ClientFilters,
  ClientSearchResult,
  ClientWithStats,
} from './client.types';
export { GST_NUMBER_PATTERN, isValidGSTNumber } from './client.types';

// Activity types
export type {
  Activity,
  ActionType,
  BillType,
  CreateActivityRequest,
  UpdateActivityRequest,
  ActivityFilters,
  ActivitySearchResult,
  ActivityFormData,
} from './activity.types';
export {
  ACTION_TYPE_LABELS,
  BILL_TYPE_LABELS,
  isActivityActive,
  calculateActivityDuration,
  calculateActivityRevenue,
} from './activity.types';

// Common types
export type {
  ApiResponse,
  ApiError,
  PaginationMeta,
  PaginationParams,
  SortOrder,
  SortParams,
  DashboardStats,
  FormMode,
  LoadingState,
  AutocompleteOption,
  DateRange,
  NavigationItem,
  ToastNotification,
  ColumnDef,
  FilterConfig,
  ActionButton,
} from './common.types';
