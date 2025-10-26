/**
 * Formatting Utilities
 *
 * Functions for formatting dates, currency, and other display values
 */

import { format, parseISO } from 'date-fns';
import { DATE_FORMATS, CURRENCY } from '@/config/constants';

/**
 * Format date for display
 *
 * @param date - Date string (ISO format) or Date object
 * @param formatString - Optional custom format (defaults to DD/MM/YYYY)
 * @returns Formatted date string
 *
 * @example
 * formatDate('2025-10-26') // '26/10/2025'
 * formatDate('2025-10-26', 'dd MMM yyyy') // '26 Oct 2025'
 */
export const formatDate = (date: string | Date, formatString?: string): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString || DATE_FORMATS.DISPLAY);
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format date with time for display
 *
 * @param date - Date string (ISO format) or Date object
 * @returns Formatted date string with time
 *
 * @example
 * formatDateTime('2025-10-26T14:30:00') // '26/10/2025 14:30'
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME);
};

/**
 * Format date for API (ISO format: YYYY-MM-DD)
 *
 * @param date - Date object
 * @returns ISO date string
 *
 * @example
 * formatDateForAPI(new Date()) // '2025-10-26'
 */
export const formatDateForAPI = (date: Date): string => {
  return format(date, DATE_FORMATS.API);
};

/**
 * Format currency (Indian Rupees)
 *
 * @param amount - Number to format
 * @param includeSymbol - Whether to include ₹ symbol (default: true)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(25000) // '₹25,000'
 * formatCurrency(25000.50) // '₹25,000.50'
 * formatCurrency(25000, false) // '25,000'
 */
export const formatCurrency = (amount: number, includeSymbol = true): string => {
  const formatted = new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: includeSymbol ? 'currency' : 'decimal',
    currency: includeSymbol ? CURRENCY.CODE : undefined,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return formatted;
};

/**
 * Format large numbers with K/L/Cr suffixes
 *
 * @param num - Number to format
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1500) // '1.5K'
 * formatNumber(150000) // '1.5L'
 * formatNumber(15000000) // '1.5Cr'
 */
export const formatNumber = (num: number): string => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`; // Crores
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`; // Lakhs
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`; // Thousands
  }
  return num.toString();
};

/**
 * Format phone number
 *
 * @param phone - Phone number string
 * @returns Formatted phone number
 *
 * @example
 * formatPhoneNumber('9876543210') // '+91 98765 43210'
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

/**
 * Format GST number for display
 *
 * @param gstNo - GST number string
 * @returns Formatted GST number
 *
 * @example
 * formatGSTNumber('29ABCDE1234F1Z5') // '29-ABCDE-1234F-1Z5'
 */
export const formatGSTNumber = (gstNo: string): string => {
  if (gstNo.length !== 15) return gstNo;
  return `${gstNo.slice(0, 2)}-${gstNo.slice(2, 7)}-${gstNo.slice(7, 12)}-${gstNo.slice(12)}`;
};

/**
 * Format site size for display
 *
 * @param size - Size string (e.g., "20 * 10")
 * @returns Formatted size with units
 *
 * @example
 * formatSiteSize('20 * 10') // '20ft × 10ft'
 */
export const formatSiteSize = (size: string): string => {
  // Replace * with × and add 'ft'
  return size.replace(/\*/g, '×').trim() + ' ft';
};

/**
 * Truncate text with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 50)
 * @returns Truncated text
 *
 * @example
 * truncateText('This is a long text...', 10) // 'This is a...'
 */
export const truncateText = (text: string, maxLength = 50): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter of each word
 *
 * @param text - Text to capitalize
 * @returns Capitalized text
 *
 * @example
 * capitalizeWords('hello world') // 'Hello World'
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Format relative time (e.g., "2 days ago")
 *
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};
