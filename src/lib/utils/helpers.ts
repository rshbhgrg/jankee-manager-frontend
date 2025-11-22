/**
 * Helper Utilities
 *
 * Miscellaneous helper functions for business logic
 */

import type { SiteCurrentStatus, Activity } from '@/types';

/**
 * Calculate site occupancy rate
 *
 * @param sites - Array of sites with status
 * @returns Occupancy rate as percentage (0-100)
 *
 * @example
 * calculateOccupancy(sites) // 75.5
 */
export const calculateOccupancy = (sites: SiteCurrentStatus[]): number => {
  if (sites.length === 0) return 0;
  const activeSites = sites.filter((site) => site.currentClientId).length;
  return (activeSites / sites.length) * 100;
};

/**
 * Get site status badge color classes
 *
 * @param status - Site status ('active' or 'available')
 * @returns Tailwind CSS classes for badge
 */
export const getSiteStatusColor = (
  status: 'active' | 'available'
): {
  bg: string;
  text: string;
  border: string;
} => {
  if (status === 'active') {
    return {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
    };
  }
  return {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
  };
};

/**
 * Get action type badge color classes
 *
 * @param action - Action type
 * @returns Tailwind CSS classes for badge
 */
export const getActionTypeColor = (
  action: 'shift' | 'new' | 'flex_change'
): {
  bg: string;
  text: string;
} => {
  switch (action) {
    case 'new':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'shift':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'flex_change':
      return { bg: 'bg-orange-100', text: 'text-orange-800' };
  }
};

/**
 * Get site type badge color classes
 *
 * @param type - Site type
 * @returns Tailwind CSS classes for badge
 */
export const getSiteTypeColor = (
  type: 'unipole' | 'hoarding'
): {
  bg: string;
  text: string;
} => {
  if (type === 'hoarding') {
    return { bg: 'bg-blue-100', text: 'text-blue-800' };
  }
  return { bg: 'bg-green-100', text: 'text-green-800' };
};

/**
 * Calculate days between two dates
 *
 * @param startDate - Start date string
 * @param endDate - End date string (defaults to today)
 * @returns Number of days
 */
export const getDaysBetween = (startDate: string, endDate?: string): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate months between two dates
 *
 * @param startDate - Start date string
 * @param endDate - End date string (defaults to today)
 * @returns Number of months (approximate)
 */
export const getMonthsBetween = (startDate: string, endDate?: string): number => {
  const days = getDaysBetween(startDate, endDate);
  return Math.ceil(days / 30);
};

/**
 * Check if activity is currently active (within date range)
 *
 * @param activity - Activity object
 * @returns boolean
 */
export const isActivityActive = (activity: Activity): boolean => {
  const today = new Date().toISOString().split('T')[0] ?? '';
  const isAfterStart = activity.startDate <= today;
  const isBeforeEnd = !activity.endDate || activity.endDate >= today;
  return isAfterStart && isBeforeEnd;
};

/**
 * Calculate total revenue from activities
 *
 * @param activities - Array of activities
 * @returns Total revenue
 */
export const calculateTotalRevenue = (activities: Activity[]): number => {
  return activities.reduce((total, activity) => {
    if (!activity.ratePerMonth) return total;
    const ratePerMonth =
      typeof activity.ratePerMonth === 'string'
        ? parseFloat(activity.ratePerMonth)
        : activity.ratePerMonth;
    const months = getMonthsBetween(activity.startDate, activity.endDate ?? undefined);
    return total + ratePerMonth * months;
  }, 0);
};

/**
 * Group activities by month
 *
 * @param activities - Array of activities
 * @returns Record of month to activities
 */
export const groupActivitiesByMonth = (activities: Activity[]): Record<string, Activity[]> => {
  return activities.reduce(
    (groups, activity) => {
      const month = activity.startDate.substring(0, 7); // YYYY-MM
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(activity);
      return groups;
    },
    {} as Record<string, Activity[]>
  );
};

/**
 * Sort activities by date (newest first)
 *
 * @param activities - Array of activities
 * @returns Sorted array
 */
export const sortActivitiesByDate = (activities: Activity[]): Activity[] => {
  return [...activities].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
};

/**
 * Filter activities by date range
 *
 * @param activities - Array of activities
 * @param fromDate - Start date (inclusive)
 * @param toDate - End date (inclusive)
 * @returns Filtered activities
 */
export const filterActivitiesByDateRange = (
  activities: Activity[],
  fromDate: string,
  toDate: string
): Activity[] => {
  return activities.filter((activity) => {
    return activity.startDate >= fromDate && activity.startDate <= toDate;
  });
};

/**
 * Debounce function for search inputs
 *
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate a random ID (client-side only, for temporary use)
 *
 * @returns Random string ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

/**
 * Sleep function for async operations
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Check if string is empty or whitespace only
 *
 * @param str - String to check
 * @returns boolean
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Safe parse number from string
 *
 * @param value - String value
 * @param defaultValue - Default value if parse fails
 * @returns Number
 */
export const parseNumber = (value: string, defaultValue = 0): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
