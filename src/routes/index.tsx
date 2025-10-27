/**
 * Route Configuration
 *
 * Centralized route definitions using React Router v6
 * - All application routes
 * - Protected routes with authentication
 * - Public routes (login, register)
 * - 404 handling
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { SitesPage } from '@/pages/SitesPage';
import { SiteFormPage } from '@/pages/SiteFormPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { ClientFormPage } from '@/pages/ClientFormPage';
import { ActivitiesPage } from '@/pages/ActivitiesPage';
import { ActivityFormPage } from '@/pages/ActivityFormPage';
import LoginPage from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Application Router
 *
 * Uses createBrowserRouter for React Router v6.4+ features:
 * - Data loading
 * - Error boundaries
 * - Pending UI
 * - Authentication protection
 */
export const router = createBrowserRouter([
  // Public routes (no layout)
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Protected routes (with layout)
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // Dashboard (Home)
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },

      // Sites Routes
      {
        path: 'sites',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <SitesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'new',
            element: (
              <ProtectedRoute>
                <SiteFormPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ':id',
            element: <Navigate to="/sites" replace />, // Placeholder - will be SiteDetailPage
          },
          {
            path: ':id/edit',
            element: (
              <ProtectedRoute>
                <SiteFormPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Clients Routes
      {
        path: 'clients',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'new',
            element: (
              <ProtectedRoute>
                <ClientFormPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ':id',
            element: <Navigate to="/clients" replace />, // Placeholder - will be ClientDetailPage
          },
          {
            path: ':id/edit',
            element: (
              <ProtectedRoute>
                <ClientFormPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Activities Routes
      {
        path: 'activities',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <ActivitiesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'new',
            element: (
              <ProtectedRoute>
                <ActivityFormPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <ProtectedRoute>
                <ActivityFormPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Reports Route (placeholder)
      {
        path: 'reports',
        element: (
          <ProtectedRoute>
            <div className="flex h-[60vh] items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
                <p className="mt-2 text-gray-600">Reports page coming soon</p>
              </div>
            </div>
          </ProtectedRoute>
        ),
      },

      // Settings Route (placeholder)
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <div className="flex h-[60vh] items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="mt-2 text-gray-600">Settings page coming soon</p>
              </div>
            </div>
          </ProtectedRoute>
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
 * Public routes:
 * - /login (Login page)
 *
 * Protected routes (require authentication):
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
