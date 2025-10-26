/**
 * Utility Functions
 *
 * Common utility functions used throughout the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 *
 * This utility is essential for shadcn/ui components
 * - clsx: handles conditional class names
 * - twMerge: intelligently merges Tailwind classes (prevents conflicts)
 *
 * @param inputs - Class names to combine
 * @returns Merged class name string
 *
 * @example
 * cn('px-4 py-2', 'bg-blue-500', className)
 * cn('text-base', isActive && 'text-bold', 'text-gray-900')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
