/**
 * User Type Definitions
 *
 * Matches backend user schema
 */

/**
 * User role types
 */
export type UserRole = 'user' | 'manager' | 'admin';

/**
 * User interface (matches backend response)
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get full name from user
 */
export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

/**
 * Get user initials
 */
export function getUserInitials(user: User): string {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
}
