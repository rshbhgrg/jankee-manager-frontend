/**
 * Main Layout Component
 *
 * Provides the overall application layout structure with:
 * - Fixed sidebar navigation on the left
 * - Header/topbar at the top
 * - Main content area (renders nested routes via Outlet)
 * - Responsive design (sidebar collapses on mobile)
 *
 * This component wraps all main application pages
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

/**
 * Main application layout
 *
 * Features:
 * - Sidebar with navigation menu
 * - Collapsible sidebar for mobile responsiveness
 * - Header with branding and user actions
 * - Scrollable content area
 * - Renders nested routes via React Router's Outlet
 *
 * @example
 * // Used in router configuration
 * {
 *   path: '/',
 *   element: <MainLayout />,
 *   children: [...]
 * }
 */
export function MainLayout() {
  // Sidebar collapsed state (for mobile/tablet)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /**
   * Toggle sidebar visibility
   * Used primarily on mobile devices
   */
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on larger screens, overlay on mobile */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main content area - offset by sidebar width */}
      <div
        className={cn(
          'transition-all duration-300',
          'lg:ml-64', // Offset by sidebar width on large screens
          sidebarCollapsed ? 'ml-0' : 'ml-0' // No offset when collapsed on mobile
        )}
      >
        {/* Header - Fixed at top */}
        <Header onMenuClick={toggleSidebar} />

        {/* Page content - renders nested routes */}
        <main
          className={cn(
            'p-4 md:p-6 lg:p-8',
            'mt-16', // Offset by header height
            'min-h-[calc(100vh-4rem)]' // Full height minus header
          )}
        >
          <Outlet />
        </main>

        {/* Footer (optional, can be added later) */}
        <footer className="border-t bg-white px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2024 Jankee Manager. All rights reserved.</p>
            <p>
              Built with{' '}
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                React
              </a>{' '}
              &{' '}
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Tailwind CSS
              </a>
            </p>
          </div>
        </footer>
      </div>

      {/* Mobile overlay when sidebar is open */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
