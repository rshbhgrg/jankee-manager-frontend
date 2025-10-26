/**
 * Skeleton Component
 *
 * Loading placeholder that mimics content structure
 * Provides better perceived performance than spinners
 */

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  count?: number;
}

/**
 * Skeleton Loader
 *
 * Animated placeholder for loading content
 * Shows content structure while data loads
 *
 * @param className - Additional CSS classes
 * @param variant - Shape of skeleton (text, circular, rectangular)
 * @param width - Custom width (e.g., "200px", "50%")
 * @param height - Custom height
 * @param count - Number of skeleton lines (for text variant)
 *
 * @example
 * // Text skeletons
 * <Skeleton variant="text" count={3} />
 *
 * // Avatar skeleton
 * <Skeleton variant="circular" width="40px" height="40px" />
 *
 * // Card skeleton
 * <Skeleton variant="rectangular" height="200px" />
 */
export function Skeleton({ className, variant = 'text', width, height, count = 1 }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  // Single skeleton
  if (count === 1) {
    return <div className={cn(baseClasses, variantClasses[variant], className)} style={style} />;
  }

  // Multiple skeletons (for text variant)
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(baseClasses, variantClasses[variant])}
          style={{
            ...style,
            // Make last line shorter for more realistic look
            ...(variant === 'text' && index === count - 1 && { width: '80%' }),
          }}
        />
      ))}
    </div>
  );
}

/**
 * Table Skeleton
 *
 * Specialized skeleton for table loading
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Card Skeleton
 *
 * Specialized skeleton for card loading
 */
export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <Skeleton variant="rectangular" height="200px" className="mb-4" />
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text" width="60%" />
    </div>
  );
}

export default Skeleton;
