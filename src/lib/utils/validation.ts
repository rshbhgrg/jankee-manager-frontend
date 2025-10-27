/**
 * Validation Utilities
 *
 * Zod schemas for form validation
 * Used with React Hook Form via @hookform/resolvers/zod
 */

import { z } from 'zod';
import { VALIDATION } from '@/config/constants';

/**
 * Site Validation Schema
 *
 * Validates site creation/update data
 */
export const siteSchema = z.object({
  siteNo: z
    .string()
    .min(VALIDATION.SITE_NO.MIN_LENGTH, 'Site number is required')
    .max(
      VALIDATION.SITE_NO.MAX_LENGTH,
      `Site number must be max ${VALIDATION.SITE_NO.MAX_LENGTH} characters`
    )
    .regex(VALIDATION.SITE_NO.PATTERN, 'Site number must be alphanumeric'),

  location: z
    .string()
    .min(
      VALIDATION.LOCATION.MIN_LENGTH,
      `Location must be at least ${VALIDATION.LOCATION.MIN_LENGTH} characters`
    )
    .max(
      VALIDATION.LOCATION.MAX_LENGTH,
      `Location must be max ${VALIDATION.LOCATION.MAX_LENGTH} characters`
    ),

  type: z.enum(['unipole', 'hoarding'], {
    message: 'Please select a site type',
  }),

  size: z.string().min(1, 'Size is required'),

  remarks: z.string().optional(),
});

export type SiteFormData = z.infer<typeof siteSchema>;

/**
 * Client Validation Schema
 *
 * Validates client creation/update data
 * Field names match backend schema
 */
export const clientSchema = z.object({
  name: z
    .string()
    .min(
      VALIDATION.CLIENT_NAME.MIN_LENGTH,
      `Client name must be at least ${VALIDATION.CLIENT_NAME.MIN_LENGTH} characters`
    )
    .max(
      VALIDATION.CLIENT_NAME.MAX_LENGTH,
      `Client name must be max ${VALIDATION.CLIENT_NAME.MAX_LENGTH} characters`
    ),

  contactPerson: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),

  gstNumber: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (val.length === VALIDATION.GST_NUMBER.LENGTH && VALIDATION.GST_NUMBER.PATTERN.test(val)),
      {
        message: `Invalid GST number format. Must be ${VALIDATION.GST_NUMBER.LENGTH} characters. Example: 29ABCDE1234F1Z5`,
      }
    ),
});

export type ClientFormData = z.infer<typeof clientSchema>;

/**
 * Activity Validation Schema
 *
 * Validates activity creation/update data
 * Complex validation with conditional fields based on action type
 */
export const activitySchema = z
  .object({
    date: z.string().min(1, 'Activity date is required'),

    clientId: z.string().min(1, 'Client is required'),

    siteId: z.string().min(1, 'Site is required'),

    previousClientId: z.string().optional(),

    action: z.enum(['shift', 'new', 'flex_change'], {
      message: 'Please select an action type',
    }),

    dateOfPurchase: z.string().min(1, 'Date of purchase is required'),

    fromDate: z.string().min(1, 'From date is required'),

    toDate: z.string().optional(),

    billNo: z
      .string()
      .max(
        VALIDATION.BILL_NO.MAX_LENGTH,
        `Bill number must be max ${VALIDATION.BILL_NO.MAX_LENGTH} characters`
      )
      .optional(),

    billType: z.enum(['quotation', 'bill']).optional(),

    ratePerMonth: z
      .number()
      .min(VALIDATION.RATE.MIN, 'Rate must be positive')
      .max(VALIDATION.RATE.MAX, `Rate must be less than ${VALIDATION.RATE.MAX}`)
      .optional(),

    remarks: z.string().optional(),
  })
  .refine(
    (data) => {
      // If action is 'shift', previousClientId is required
      if (data.action === 'shift') {
        return !!data.previousClientId;
      }
      return true;
    },
    {
      message: 'Previous client is required for shift action',
      path: ['previousClientId'],
    }
  )
  .refine(
    (data) => {
      // If toDate is provided, it must be after fromDate
      if (data.toDate && data.fromDate) {
        return new Date(data.toDate) > new Date(data.fromDate);
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['toDate'],
    }
  )
  .refine(
    (data) => {
      // fromDate should be on or after dateOfPurchase
      if (data.fromDate && data.dateOfPurchase) {
        return new Date(data.fromDate) >= new Date(data.dateOfPurchase);
      }
      return true;
    },
    {
      message: 'Start date should be on or after purchase date',
      path: ['fromDate'],
    }
  );

export type ActivityFormData = z.infer<typeof activitySchema>;

/**
 * Date Range Validation Schema
 *
 * Validates date range filters
 */
export const dateRangeSchema = z
  .object({
    from: z.string().optional(),
    to: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        return new Date(data.to) >= new Date(data.from);
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['to'],
    }
  );

export type DateRangeFormData = z.infer<typeof dateRangeSchema>;

/**
 * Search Validation Schema
 *
 * Validates search input
 */
export const searchSchema = z.object({
  searchTerm: z.string().max(200, 'Search term too long'),
});

export type SearchFormData = z.infer<typeof searchSchema>;

/**
 * Helper function to validate GST number
 *
 * @param gstNo - GST number to validate
 * @returns boolean
 */
export const validateGSTNumber = (gstNo: string): boolean => {
  return VALIDATION.GST_NUMBER.PATTERN.test(gstNo);
};

/**
 * Helper function to validate date is not in future
 *
 * @param date - Date string
 * @returns boolean
 */
export const isDateNotInFuture = (date: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate <= today;
};

/**
 * Helper function to validate date range
 *
 * @param fromDate - Start date
 * @param toDate - End date
 * @returns boolean
 */
export const isValidDateRange = (fromDate: string, toDate: string): boolean => {
  return new Date(toDate) >= new Date(fromDate);
};
