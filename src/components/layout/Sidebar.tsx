/**
 * Sidebar Component
 *
 * Navigation sidebar with:
 * - App branding/logo
 * - Navigation menu items with icons
 * - Active route highlighting
 * - Responsive collapse on mobile
 *
 * Fixed on the left side of the viewport
 */

import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Users, Activity, FileText, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/constants';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Navigation menu item configuration
 */
interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string | number;
}

/**
 * Navigation menu items
 * Define all app routes with icons
 */
const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: ROUTES.HOME,
  },
  {
    label: 'Sites',
    icon: MapPin,
    href: ROUTES.SITES,
  },
  {
    label: 'Clients',
    icon: Users,
    href: ROUTES.CLIENTS,
  },
  {
    label: 'Activities',
    icon: Activity,
    href: ROUTES.ACTIVITIES,
  },
  {
    label: 'Reports',
    icon: FileText,
    href: ROUTES.REPORTS,
  },
];

/**
 * Application sidebar component
 *
 * Features:
 * - Fixed position navigation
 * - Active route highlighting
 * - Icon-based menu items
 * - Collapsible on mobile
 *
 * @param collapsed - Whether sidebar is collapsed (mobile)
 * @param onToggle - Callback to toggle sidebar
 * @param className - Optional CSS classes
 *
 * @example
 * <Sidebar collapsed={false} onToggle={() => setCollapsed(!collapsed)} />
 */
export function Sidebar({ collapsed, onToggle, className }: SidebarProps) {
  const location = useLocation();

  /**
   * Check if nav item is active (current route)
   */
  const isActive = (href: string): boolean => {
    if (href === ROUTES.HOME) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64',
          'border-r bg-white shadow-lg',
          'transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0', // Always visible on large screens
          collapsed ? '-translate-x-full' : 'translate-x-0', // Toggle on mobile
          className
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          {/* App branding */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">Jankee Manager</span>
          </Link>

          {/* Close button (mobile only) */}
          <Button variant="ghost" size="icon" onClick={onToggle} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5',
                  'text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className={cn('h-5 w-5', active ? 'text-blue-700' : 'text-gray-500')} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      'ml-auto rounded-full px-2 py-0.5 text-xs font-semibold',
                      active ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t p-3">
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Settings className="h-5 w-5 text-gray-500" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
