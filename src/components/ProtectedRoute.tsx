/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * Redirects to login page if user is not authenticated.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import authService from '@/services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'manager' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { user } = useAuthStore();

  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location
    // so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && user) {
    const roleHierarchy: Record<string, number> = {
      user: 1,
      manager: 2,
      admin: 3,
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      // User doesn't have required role, redirect to dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has required role, render children
  return <>{children}</>;
}
