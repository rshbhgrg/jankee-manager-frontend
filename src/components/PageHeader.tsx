/**
 * PageHeader Component
 *
 * Consistent page header for all main pages with:
 * - Page title and description
 * - Action buttons (create, filters, etc.)
 * - Breadcrumbs (optional)
 * - Back button (optional)
 *
 * Provides uniform layout across all pages
 */

import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Page description (optional) */
  description?: string;
  /** Action buttons/elements to show on the right */
  actions?: ReactNode;
  /** Breadcrumb navigation items */
  breadcrumbs?: Breadcrumb[];
  /** Back button configuration */
  back?: {
    label?: string;
    href: string;
  };
  /** Custom CSS classes */
  className?: string;
}

/**
 * Page header component
 *
 * Features:
 * - Responsive layout
 * - Breadcrumb navigation
 * - Action buttons area
 * - Optional back button
 * - Consistent spacing and typography
 *
 * @param title - Main page title
 * @param description - Supporting description text
 * @param actions - Action buttons/elements (typically Create button)
 * @param breadcrumbs - Breadcrumb navigation items
 * @param back - Back button configuration
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * // Simple page header
 * <PageHeader
 *   title="Sites"
 *   description="Manage advertising sites and locations"
 *   actions={
 *     <Button onClick={() => navigate('/sites/new')}>
 *       Create Site
 *     </Button>
 *   }
 * />
 *
 * // With breadcrumbs
 * <PageHeader
 *   title="Edit Site"
 *   breadcrumbs={[
 *     { label: 'Dashboard', href: '/' },
 *     { label: 'Sites', href: '/sites' },
 *     { label: 'Edit', href: '#' },
 *   ]}
 *   back={{ href: '/sites', label: 'Back to Sites' }}
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  back,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 space-y-4', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                <Link
                  to={crumb.href}
                  className={cn(
                    'hover:text-blue-600',
                    index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'
                  )}
                >
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Back button */}
      {back && (
        <Link to={back.href}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {back.label || 'Back'}
          </Button>
        </Link>
      )}

      {/* Title and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title and description */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
          {description && <p className="text-sm text-gray-500 sm:text-base">{description}</p>}
        </div>

        {/* Action buttons */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/**
 * Compact page header variant
 * Smaller version for modals/dialogs
 */
export function CompactPageHeader({
  title,
  description,
  actions,
  className,
}: Omit<PageHeaderProps, 'breadcrumbs' | 'back'>) {
  return (
    <div className={cn('mb-4 space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
