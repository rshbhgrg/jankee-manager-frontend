/**
 * Loading Spinner Component
 *
 * Reusable loading spinner with different sizes
 */

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

/**
 * Loading Spinner
 *
 * Displays an animated spinner to indicate loading state
 *
 * @param size - Spinner size (sm, md, lg, xl)
 * @param className - Additional CSS classes
 * @param text - Optional loading text
 *
 * @example
 * <LoadingSpinner size="md" text="Loading..." />
 */
export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      {/* Spinner */}
      <div
        className={cn(
          'animate-spin rounded-full border-blue-600 border-t-transparent',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>

      {/* Optional loading text */}
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
