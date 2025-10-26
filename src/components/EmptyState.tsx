/**
 * EmptyState Component
 *
 * User-friendly empty state displays for:
 * - No search results
 * - Empty lists/tables
 * - Error states
 * - First-time experiences
 *
 * Includes optional action buttons
 */

import { ReactNode } from 'react';
import { FileX, Search, AlertCircle, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Empty state variant types
 */
type EmptyStateVariant = 'no-data' | 'no-results' | 'error' | 'first-time';

interface EmptyStateProps {
  /** Visual variant determining icon and style */
  variant?: EmptyStateVariant;
  /** Main heading text */
  title: string;
  /** Description or instructions */
  description?: string;
  /** Custom icon component */
  icon?: ReactNode;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Custom CSS classes */
  className?: string;
}

/**
 * Icon configuration for each variant
 */
const variantIcons: Record<EmptyStateVariant, ReactNode> = {
  'no-data': <Inbox className="h-12 w-12 text-gray-400" />,
  'no-results': <Search className="h-12 w-12 text-gray-400" />,
  error: <AlertCircle className="h-12 w-12 text-red-400" />,
  'first-time': <FileX className="h-12 w-12 text-gray-400" />,
};

/**
 * Empty state component
 *
 * Features:
 * - Multiple visual variants
 * - Customizable icon, title, and description
 * - Optional action buttons
 * - Centered layout with proper spacing
 * - Accessible and responsive
 *
 * @param variant - Visual variant (determines default icon)
 * @param title - Main heading text
 * @param description - Supporting description text
 * @param icon - Custom icon (overrides variant icon)
 * @param action - Primary action button configuration
 * @param secondaryAction - Secondary action button configuration
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * // No data state
 * <EmptyState
 *   variant="no-data"
 *   title="No sites found"
 *   description="Get started by creating your first site"
 *   action={{
 *     label: "Create Site",
 *     onClick: () => navigate('/sites/new')
 *   }}
 * />
 *
 * // No search results
 * <EmptyState
 *   variant="no-results"
 *   title="No results found"
 *   description="Try adjusting your search or filters"
 *   action={{
 *     label: "Clear filters",
 *     onClick: clearFilters
 *   }}
 * />
 *
 * // Error state
 * <EmptyState
 *   variant="error"
 *   title="Failed to load data"
 *   description="There was a problem loading the data. Please try again."
 *   action={{
 *     label: "Retry",
 *     onClick: refetch
 *   }}
 * />
 * ```
 */
export function EmptyState({
  variant = 'no-data',
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  // Use custom icon or default variant icon
  const displayIcon = icon || variantIcons[variant];

  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center',
        'rounded-lg border border-gray-200 bg-white p-8 text-center',
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4">{displayIcon}</div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>

      {/* Description */}
      {description && <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>}

      {/* Action buttons */}
      {(action || secondaryAction) && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {action && (
            <Button onClick={action.onClick} size="default">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="outline" size="default">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Convenience components for common empty states
 */

/**
 * No search results empty state
 */
export function NoSearchResults({
  searchTerm,
  onClear,
}: {
  searchTerm: string;
  onClear: () => void;
}) {
  return (
    <EmptyState
      variant="no-results"
      title="No results found"
      description={`No results found for "${searchTerm}". Try different keywords or clear filters.`}
      action={{
        label: 'Clear search',
        onClick: onClear,
      }}
    />
  );
}

/**
 * First-time empty state with call-to-action
 */
export function FirstTimeEmpty({
  resourceName,
  onCreateNew,
}: {
  resourceName: string;
  onCreateNew: () => void;
}) {
  return (
    <EmptyState
      variant="first-time"
      title={`No ${resourceName} yet`}
      description={`Get started by creating your first ${resourceName}.`}
      action={{
        label: `Create ${resourceName}`,
        onClick: onCreateNew,
      }}
    />
  );
}

/**
 * Error state with retry action
 */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      variant="error"
      title="Failed to load data"
      description="There was a problem loading the data. Please try again."
      action={{
        label: 'Retry',
        onClick: onRetry,
      }}
    />
  );
}
