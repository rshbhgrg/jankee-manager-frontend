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
 */
export type BillType = 'quotation' | 'bill';

/**
 * Main Activity Interface
 *
 * Represents a booking/transaction linking client to site over time
 * Contains denormalized fields (clientName, siteNo) for performance
 *
 * @property id - Unique identifier (UUID)
 * @property date - Activity date (when recorded)
 * @property clientId - Reference to client (FK)
 * @property clientName - Denormalized client name
 * @property siteId - Reference to site (FK)
 * @property siteNo - Denormalized site number
 * @property previousClientId - Previous client (for shifts)
 * @property previousClientName - Denormalized previous client name
 * @property action - Type of activity
 * @property dateOfPurchase - When booking was purchased
 * @property fromDate - Campaign start date
 * @property toDate - Campaign end date (optional for ongoing)
 * @property billNo - Invoice/quotation number
 * @property billType - Billing stage
 * @property ratePerMonth - Monthly rental rate (INR)
 * @property remarks - Additional notes
 * @property createdAt - Creation timestamp (ISO string)
 * @property updatedAt - Last update timestamp (ISO string)
 */
export interface Activity {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  siteId: string;
  siteNo: string;
  previousClientId?: string;
  previousClientName?: string;
  action: ActionType;
  dateOfPurchase: string;
  fromDate: string;
  toDate?: string;
  billNo?: string;
  billType?: BillType;
  ratePerMonth?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Activity Request
 *
 * Data required to create a new activity
 * Omits id, denormalized fields, and timestamps
 */
export interface CreateActivityRequest {
  date: string;
  clientId: string;
  siteId: string;
  previousClientId?: string;
  action: ActionType;
  dateOfPurchase: string;
  fromDate: string;
  toDate?: string;
  billNo?: string;
  billType?: BillType;
  ratePerMonth?: number;
  remarks?: string;
}

/**
 * Update Activity Request
 *
 * Data for updating an existing activity
 * All fields are optional except id
 */
export interface UpdateActivityRequest {
  id: string;
  date?: string;
  clientId?: string;
  siteId?: string;
  previousClientId?: string;
  action?: ActionType;
  dateOfPurchase?: string;
  fromDate?: string;
  toDate?: string;
  billNo?: string;
  billType?: BillType;
  ratePerMonth?: number;
  remarks?: string;
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
};

/**
 * Helper function to check if activity is currently active
 */
export const isActivityActive = (activity: Activity): boolean => {
  if (!activity.toDate) return true; // Open-ended booking is active
  const today = new Date().toISOString().split('T')[0] ?? '';
  return activity.toDate >= today;
};

/**
 * Helper function to calculate activity duration in months
 */
export const calculateActivityDuration = (fromDate: string, toDate?: string): number => {
  const from = new Date(fromDate);
  const to = toDate ? new Date(toDate) : new Date();
  const diffTime = Math.abs(to.getTime() - from.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 30); // Approximate months
};

/**
 * Helper function to calculate total revenue for an activity
 */
export const calculateActivityRevenue = (activity: Activity): number => {
  if (!activity.ratePerMonth) return 0;
  const months = calculateActivityDuration(activity.fromDate, activity.toDate);
  return activity.ratePerMonth * months;
};
