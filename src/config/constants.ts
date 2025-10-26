/**
 * Application Constants
 *
 * Centralized configuration and constant values
 * Update these values to change app-wide behavior
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 25,
  LIMIT_OPTIONS: [10, 25, 50, 100],
} as const;

/**
 * Date Formats
 *
 * Using date-fns format strings
 * See: https://date-fns.org/docs/format
 */
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy', // 26/10/2025
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm', // 26/10/2025 14:30
  API: 'yyyy-MM-dd', // 2025-10-26 (ISO date)
  INPUT: 'yyyy-MM-dd', // For HTML date inputs
} as const;

/**
 * Currency Configuration
 */
export const CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
  LOCALE: 'en-IN',
} as const;

/**
 * Local Storage Keys
 *
 * Consistent keys for localStorage operations
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'jankee_auth_token',
  USER: 'jankee_user',
  THEME: 'jankee_theme',
  SIDEBAR_STATE: 'jankee_sidebar',
  FILTERS: 'jankee_filters',
} as const;

/**
 * Query Keys for React Query
 *
 * Centralized query keys for cache management
 */
export const QUERY_KEYS = {
  // Sites
  SITES: ['sites'],
  SITE: (id: string) => ['sites', id],
  SITES_WITH_STATUS: ['sites', 'status'],
  SITES_SEARCH: (term: string) => ['sites', 'search', term],

  // Clients
  CLIENTS: ['clients'],
  CLIENT: (id: string) => ['clients', id],
  CLIENTS_SEARCH: (term: string) => ['clients', 'search', term],

  // Activities
  ACTIVITIES: ['activities'],
  ACTIVITY: (id: string) => ['activities', id],
  ACTIVITIES_BY_SITE: (siteId: string) => ['activities', 'site', siteId],
  ACTIVITIES_BY_CLIENT: (clientId: string) => ['activities', 'client', clientId],

  // Dashboard
  DASHBOARD_STATS: ['dashboard', 'stats'],
} as const;

/**
 * Route Paths
 *
 * Application route constants for type-safe navigation
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',

  // Sites
  SITES: '/sites',
  SITES_NEW: '/sites/new',
  SITES_EDIT: (id: string) => `/sites/${id}/edit`,
  SITES_DETAIL: (id: string) => `/sites/${id}`,

  // Clients
  CLIENTS: '/clients',
  CLIENTS_NEW: '/clients/new',
  CLIENTS_EDIT: (id: string) => `/clients/${id}/edit`,
  CLIENTS_DETAIL: (id: string) => `/clients/${id}`,

  // Activities
  ACTIVITIES: '/activities',
  ACTIVITIES_NEW: '/activities/new',
  ACTIVITIES_EDIT: (id: string) => `/activities/${id}/edit`,

  // Reports
  REPORTS: '/reports',

  // Error pages
  NOT_FOUND: '/404',
} as const;

/**
 * Toast Duration (milliseconds)
 */
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;

/**
 * Debounce Delays (milliseconds)
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 200,
} as const;

/**
 * File Size Limits
 */
export const FILE_SIZE = {
  MAX_IMAGE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * Application Metadata
 */
export const APP_INFO = {
  NAME: import.meta.env.VITE_APP_NAME || 'Jankee Manager',
  VERSION: '1.0.0',
  DESCRIPTION: 'Outdoor advertising site management system',
} as const;

/**
 * Site Types Configuration
 */
export const SITE_TYPES = {
  UNIPOLE: 'unipole',
  HOARDING: 'hoarding',
} as const;

/**
 * Activity Actions Configuration
 */
export const ACTIVITY_ACTIONS = {
  NEW: 'new',
  SHIFT: 'shift',
  FLEX_CHANGE: 'flex_change',
} as const;

/**
 * Bill Types Configuration
 */
export const BILL_TYPES = {
  QUOTATION: 'quotation',
  BILL: 'bill',
} as const;

/**
 * Status Colors for UI
 */
export const STATUS_COLORS = {
  ACTIVE: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  AVAILABLE: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
  },
  INACTIVE: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  },
} as const;

/**
 * Validation Rules
 */
export const VALIDATION = {
  SITE_NO: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    PATTERN: /^[A-Z0-9]+$/i, // Alphanumeric
  },
  LOCATION: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 200,
  },
  CLIENT_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 200,
  },
  GST_NUMBER: {
    LENGTH: 15,
    PATTERN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  },
  BILL_NO: {
    MAX_LENGTH: 100,
  },
  RATE: {
    MIN: 0,
    MAX: 10000000, // 1 Crore
  },
} as const;
