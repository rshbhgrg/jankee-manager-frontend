/**
 * Auth Store (Zustand)
 *
 * Manages authentication state:
 * - User information
 * - Auth token
 * - Login/logout actions
 * - Permission checks
 *
 * Persisted to localStorage for session persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/config/constants';
import type { User, UserRole } from '@/types/user';

// Re-export User type for convenience
export type { User, UserRole };

/**
 * Auth State interface
 */
interface AuthState {
  // User and token
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;

  // Permission checks
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

/**
 * Auth Store
 *
 * Manages authentication state with localStorage persistence
 * Token is synced with localStorage for API client access
 *
 * @example
 * ```tsx
 * import { useAuthStore } from '@/stores/authStore';
 *
 * function LoginButton() {
 *   const { login, logout, isAuthenticated, user } = useAuthStore();
 *
 *   if (isAuthenticated) {
 *     return (
 *       <div>
 *         <span>Welcome, {user?.firstName} {user?.lastName}</span>
 *         <button onClick={logout}>Logout</button>
 *       </div>
 *     );
 *   }
 *
 *   return <button onClick={() => login(userData)}>Login</button>;
 * }
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // Login action - tokens are managed by authService
      login: (user) => {
        set({
          user,
          token: null, // Token managed by authService in localStorage
          isAuthenticated: true,
        });
      },

      // Logout action
      logout: () => {
        // Clear auth state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Clear React Query cache (if needed)
        // queryClient.clear();
      },

      // Update user information
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...updates,
            },
          });
        }
      },

      // Permission checks
      hasRole: (role) => {
        const user = get().user;
        return user?.role === role;
      },

      isAdmin: () => {
        const user = get().user;
        return user?.role === 'admin';
      },

      isManager: () => {
        const user = get().user;
        return user?.role === 'manager' || user?.role === 'admin';
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);

/**
 * Selector hooks for better performance
 */

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsAdmin = () => useAuthStore((state) => state.isAdmin());
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);

/**
 * Initialize auth state on app load
 *
 * Call this in your app initialization to sync auth state from token
 */
export const initializeAuth = () => {
  // Auth state is handled by authService
  // If user data exists in persisted store but token is invalid,
  // the ProtectedRoute will redirect to login
};
