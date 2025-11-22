/**
 * Activity Type Definitions
 *
 * Type definitions for Activity entities matching the backend schema
 * Activities represent all site-client interactions and bookings
 */

/**
 * Action Type - Type of activity/transaction
 *
 * @value new - Fresh booking of a previously unoccupied site
 * @value shift - Client moves from one site to another
 * @value flex_change - Flex/banner change without client change
 */
export type ActionType = 'shift' | 'new' | 'flex_change';

/**
 * Bill Type - Stage of billing
 *
 * @value quotation - Initial pricing proposal
 * @value bill - Confirmed invoice after booking
 * @value foc - Free of charge / complimentary booking
 */
export type BillType = 'quotation' | 'bill' | 'foc';

/**
 * Main Activity Interface
 *
 * Represents a booking/transaction linking client to site over time
 * Field names match backend schema exactly
 * Contains denormalized fields (clientName, siteNo) for UI display
 *
 * @property id - Unique identifier (UUID)
 * @property action - Type of activity (new, shift, flex_change)
 * @property siteId - Reference to site (FK)
 * @property clientId - Reference to client (FK)
 * @property clientName - Denormalized client name (for display)
 * @property siteNo - Denormalized site number (for display)
 * @property previousClientId - Previous client (for shifts)
 * @property previousClientName - Denormalized previous client name (for display)
 * @property startDate - Campaign start date
 * @property endDate - Campaign end date (null for ongoing)
 * @property ratePerMonth - Monthly rental rate (INR)
 * @property totalMonths - Duration in months
 * @property totalAmount - Total contract amount
 * @property printingCost - Cost of printing materials
 * @property mountingCost - Cost of mounting/installation
 * @property notes - Additional notes
 * @property createdBy - User who created this activity
 * @property createdAt - Creation timestamp (ISO string)
 * @property updatedAt - Last update timestamp (ISO string)
 */
export interface Activity {
  id: string;
  action: ActionType;
  siteId: string;
  siteNo: string;
  clientId: string;
  clientName: string;
  previousClientId?: string;
  previousClientName?: string;
  startDate: string;
  endDate?: string | null;
  ratePerMonth: string | number;
  totalMonths?: number | null;
  totalAmount?: string | number | null;
  printingCost?: string | number | null;
  mountingCost?: string | number | null;
  notes?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Activity Request
 *
 * Data required to create a new activity
 * Omits id, denormalized fields, and timestamps
 * Field names match backend schema
 */
export interface CreateActivityRequest {
  action: ActionType;
  siteId: string;
  clientId: string;
  previousClientId?: string;
  startDate: string;
  endDate?: string;
  ratePerMonth: number | string;
  totalMonths?: number;
  totalAmount?: number | string;
  printingCost?: number | string;
  mountingCost?: number | string;
  notes?: string;
}

/**
 * Update Activity Request
 *
 * Data for updating an existing activity
 * All fields are optional except id
 * Field names match backend schema
 */
export interface UpdateActivityRequest {
  id: string;
  action?: ActionType;
  siteId?: string;
  clientId?: string;
  previousClientId?: string;
  startDate?: string;
  endDate?: string;
  ratePerMonth?: number | string;
  totalMonths?: number;
  totalAmount?: number | string;
  printingCost?: number | string;
  mountingCost?: number | string;
  notes?: string;
}

/**
 * Activity Filters
 *
 * Filter criteria for querying activities
 */
export interface ActivityFilters {
  siteId?: string;
  clientId?: string;
  action?: ActionType;
  billType?: BillType;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
}

/**
 * Activity Search Result
 *
 * Paginated response for activity queries
 */
export interface ActivitySearchResult {
  activities: Activity[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Activity Form Data
 *
 * Form state for creating/editing activities
 * Includes UI-specific fields for autocomplete
 */
export interface ActivityFormData {
  date: string;
  clientId: string;
  clientName: string;
  siteId: string;
  siteNo: string;
  previousClientId?: string;
  action: ActionType | '';
  dateOfPurchase: string;
  fromDate: string;
  toDate?: string;
  billNo?: string;
  billType?: BillType | '';
  ratePerMonth?: string;
  remarks?: string;
}

/**
 * Action Type Labels for UI
 */
export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  new: 'New Booking',
  shift: 'Client Shift',
  flex_change: 'Flex Change',
};

/**
 * Bill Type Labels for UI
 */
export const BILL_TYPE_LABELS: Record<BillType, string> = {
  quotation: 'Quotation',
  bill: 'Bill',
  foc: 'FOC',
};

/**
 * Helper function to check if activity is currently active
 */
export const isActivityActive = (activity: Activity): boolean => {
  if (!activity.endDate) return true; // Open-ended booking is active
  const today = new Date().toISOString().split('T')[0] ?? '';
  return activity.endDate >= today;
};

/**
 * Helper function to calculate activity duration in months
 */
export const calculateActivityDuration = (startDate: string, endDate?: string | null): number => {
  const from = new Date(startDate);
  const to = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(to.getTime() - from.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 30); // Approximate months
};

/**
 * Helper function to calculate total revenue for an activity
 */
export const calculateActivityRevenue = (activity: Activity): number => {
  if (!activity.ratePerMonth) return 0;
  const ratePerMonth =
    typeof activity.ratePerMonth === 'string'
      ? parseFloat(activity.ratePerMonth)
      : activity.ratePerMonth;
  const months = calculateActivityDuration(activity.startDate, activity.endDate);
  return ratePerMonth * months;
};

/**
 * Activity with Relations (API Response)
 *
 * Structure returned by backend for activities endpoints
 * Includes full related objects (site, client, previousClient) instead of just IDs
 * Field names match actual backend response
 */
export interface ActivityWithRelations {
  activity: {
    id: string;
    action: ActionType;
    siteId: string;
    clientId: string;
    previousClientId?: string | null;
    startDate: string;
    endDate?: string | null;
    ratePerMonth: string;
    totalMonths?: number | null;
    totalAmount?: string | null;
    printingCost?: string | null;
    mountingCost?: string | null;
    notes?: string | null;
    createdBy?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  site: {
    id: string;
    siteNo: string;
    location: string;
    type: string;
    size: string;
    latitude?: string | null;
    longitude?: string | null;
    address?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  client: {
    id: string;
    clientNo: string;
    name: string;
    contactPerson?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    gstNumber?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  previousClient?: {
    id: string;
    clientNo: string;
    name: string;
    contactPerson?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    gstNumber?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  creator?: any | null;
}

/**
 * Transform ActivityWithRelations to flat Activity structure
 * Extracts nested data into a flat Activity object for UI consumption
 * Maps backend field names to frontend display structure
 */
export const transformActivityWithRelations = (item: ActivityWithRelations): Activity => {
  return {
    id: item.activity.id,
    action: item.activity.action,
    siteId: item.site?.id ?? '',
    siteNo: item.site?.siteNo ?? 'Unknown Site',
    clientId: item.client?.id ?? '',
    clientName: item.client?.name ?? 'Unknown Client',
    previousClientId: item.activity.previousClientId ?? undefined,
    previousClientName: item.previousClient?.name,
    startDate: item.activity.startDate,
    endDate: item.activity.endDate,
    ratePerMonth: item.activity.ratePerMonth,
    totalMonths: item.activity.totalMonths,
    totalAmount: item.activity.totalAmount,
    printingCost: item.activity.printingCost,
    mountingCost: item.activity.mountingCost,
    notes: item.activity.notes,
    createdBy: item.activity.createdBy,
    createdAt: item.activity.createdAt,
    updatedAt: item.activity.updatedAt,
  };
};
