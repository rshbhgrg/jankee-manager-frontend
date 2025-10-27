/**
 * Route Configuration
 *
 * Centralized route definitions using React Router v6
 * - All application routes
 * - Lazy loading for code splitting (future enhancement)
 * - Protected routes (future enhancement)
 * - 404 handling
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { SitesPage } from '@/pages/SitesPage';
import { SiteFormPage } from '@/pages/SiteFormPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { ClientFormPage } from '@/pages/ClientFormPage';
import { ActivitiesPage } from '@/pages/ActivitiesPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Application Router
 *
 * Uses createBrowserRouter for React Router v6.4+ features:
 * - Data loading
 * - Error boundaries
 * - Pending UI
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // Dashboard (Home)
      {
        index: true,
        element: <DashboardPage />,
      },

      // Sites Routes
      {
        path: 'sites',
        children: [
          {
            index: true,
            element: <SitesPage />,
          },
          {
            path: 'new',
            element: <SiteFormPage />,
          },
          {
            path: ':id',
            element: <Navigate to="/sites" replace />, // Placeholder - will be SiteDetailPage
          },
          {
            path: ':id/edit',
            element: <SiteFormPage />,
          },
        ],
      },

      // Clients Routes
      {
        path: 'clients',
        children: [
          {
            index: true,
            element: <ClientsPage />,
          },
          {
            path: 'new',
            element: <ClientFormPage />,
          },
          {
            path: ':id',
            element: <Navigate to="/clients" replace />, // Placeholder - will be ClientDetailPage
          },
          {
            path: ':id/edit',
            element: <ClientFormPage />,
          },
        ],
      },

      // Activities Routes
      {
        path: 'activities',
        children: [
          {
            index: true,
            element: <ActivitiesPage />,
          },
          {
            path: 'new',
            element: <Navigate to="/activities" replace />, // Placeholder - will be ActivityFormPage
          },
          {
            path: ':id/edit',
            element: <Navigate to="/activities" replace />, // Placeholder - will be ActivityFormPage
          },
        ],
      },

      // Reports Route (placeholder)
      {
        path: 'reports',
        element: (
          <div className="flex h-[60vh] items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
              <p className="mt-2 text-gray-600">Reports page coming soon</p>
            </div>
          </div>
        ),
      },

      // Settings Route (placeholder)
      {
        path: 'settings',
        element: (
          <div className="flex h-[60vh] items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <p className="mt-2 text-gray-600">Settings page coming soon</p>
            </div>
          </div>
        ),
      },

      // 404 catch-all (must be last)
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

/**
 * Route paths for reference
 *
 * Authenticated routes:
 * - / (Dashboard)
 * - /sites (Sites list)
 * - /sites/new (Create site)
 * - /sites/:id (Site detail)
 * - /sites/:id/edit (Edit site)
 * - /clients (Clients list)
 * - /clients/new (Create client)
 * - /clients/:id (Client detail)
 * - /clients/:id/edit (Edit client)
 * - /activities (Activities list)
 * - /activities/new (Create activity)
 * - /activities/:id/edit (Edit activity)
 * - /reports (Reports)
 * - /settings (Settings)
 *
 * Error routes:
 * - * (404 Not Found)
 */
