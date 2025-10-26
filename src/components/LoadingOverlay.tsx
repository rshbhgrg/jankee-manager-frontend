/**
 * Loading Overlay Component
 *
 * Full-screen or container-relative loading overlay
 */

import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Loading Overlay
 *
 * Displays a semi-transparent overlay with spinner
 * Can be full-screen or relative to parent container
 *
 * @param isLoading - Whether to show the overlay
 * @param text - Optional loading message
 * @param fullScreen - Whether to cover entire viewport (default: false)
 * @param className - Additional CSS classes
 *
 * @example
 * <div className="relative">
 *   <LoadingOverlay isLoading={isLoading} text="Loading data..." />
 *   <YourContent />
 * </div>
 */
export function LoadingOverlay({
  isLoading,
  text,
  fullScreen = false,
  className,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-white/80 backdrop-blur-sm',
        fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10',
        className
      )}
    >
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export default LoadingOverlay;
