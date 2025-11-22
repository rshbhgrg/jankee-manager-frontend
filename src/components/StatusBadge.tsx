/**
 * StatusBadge Component
 *
 * Color-coded status badges for:
 * - Site status (active/available)
 * - Action types (new/shift/flex_change)
 * - Site types (unipole/hoarding)
 * - Custom statuses
 *
 * Uses consistent color schemes from design system
 */

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SiteType, ActionType } from '@/types';

/**
 * Status badge variant types
 */
type StatusVariant =
  | 'active'
  | 'available'
  | 'new'
  | 'shift'
  | 'flex_change'
  | 'unipole'
  | 'hoarding'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

interface StatusBadgeProps {
  /** Status variant determining color and style */
  variant: StatusVariant;
  /** Custom label (optional, defaults to variant) */
  label?: string;
  /** Show dot indicator */
  showDot?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Color configuration for each status variant
 */
const variantConfig: Record<
  StatusVariant,
  { bg: string; text: string; border?: string; dot?: string; label: string }
> = {
  // Site status
  active: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-600',
    label: 'Active',
  },
  available: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-600',
    label: 'Available',
  },

  // Action types
  new: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-600',
    label: 'New',
  },
  shift: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-600',
    label: 'Shift',
  },
  flex_change: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-600',
    label: 'Flex Change',
  },

  // Site types
  unipole: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    dot: 'bg-teal-600',
    label: 'Unipole',
  },
  hoarding: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-600',
    label: 'Hoarding',
  },

  // Generic statuses
  success: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-600',
    label: 'Success',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    dot: 'bg-yellow-600',
    label: 'Warning',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-600',
    label: 'Error',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-600',
    label: 'Info',
  },
};

const fallbackConfig = {
  bg: 'bg-slate-100',
  text: 'text-slate-700',
  border: 'border-slate-200',
  dot: 'bg-slate-400',
  label: 'Status',
};

/**
 * Status badge component
 *
 * Features:
 * - Predefined color schemes for common statuses
 * - Optional dot indicator
 * - Consistent styling across app
 * - Accessible with proper contrast
 *
 * @param variant - Status variant (determines color)
 * @param label - Custom label text (overrides default)
 * @param showDot - Show colored dot indicator
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * // Site status
 * <StatusBadge variant="active" />
 *
 * // Action type
 * <StatusBadge variant="shift" showDot />
 *
 * // Custom label
 * <StatusBadge variant="success" label="Completed" />
 * ```
 */
export function StatusBadge({ variant, label, showDot = false, className }: StatusBadgeProps) {
  const config = variantConfig[variant] ?? fallbackConfig;

  if (import.meta.env.DEV && !variantConfig[variant]) {
    console.warn(`StatusBadge: unsupported variant "${variant}", falling back to default styling.`);
  }

  const displayLabel = label || config.label;

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 border font-medium',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} aria-hidden="true" />
      )}
      <span>{displayLabel}</span>
    </Badge>
  );
}

/**
 * Convenience components for specific status types
 */

/**
 * Site status badge (active/available)
 */
export function SiteStatusBadge({
  isActive,
  ...props
}: Omit<StatusBadgeProps, 'variant'> & { isActive: boolean }) {
  return <StatusBadge variant={isActive ? 'active' : 'available'} showDot {...props} />;
}

/**
 * Site type badge (unipole/hoarding)
 */
export function SiteTypeBadge({
  type,
  ...props
}: Omit<StatusBadgeProps, 'variant'> & { type: SiteType }) {
  return <StatusBadge variant={type} {...props} />;
}

/**
 * Activity action type badge (new/shift/flex_change)
 */
export function ActionTypeBadge({
  action,
  ...props
}: Omit<StatusBadgeProps, 'variant'> & { action: ActionType }) {
  return <StatusBadge variant={action} {...props} />;
}
