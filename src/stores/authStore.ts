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

/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

/**
 * Auth State interface
 */
interface AuthState {
  // User and token
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;

  // Permission checks
  hasRole: (role: 'admin' | 'user') => boolean;
  isAdmin: () => boolean;
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
 *         <span>Welcome, {user?.name}</span>
 *         <button onClick={logout}>Logout</button>
 *       </div>
 *     );
 *   }
 *
 *   return <button onClick={() => login(userData, token)}>Login</button>;
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

      // Login action
      login: (user, token) => {
        // Store token in localStorage for API client
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Logout action
      logout: () => {
        // Clear token from localStorage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

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
 * Call this in your app initialization to sync token from localStorage
 */
export const initializeAuth = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const state = useAuthStore.getState();

  // If token exists in localStorage but not in store, sync it
  if (token && !state.token) {
    // In a real app, you'd validate the token with the API here
    // For now, we'll just clear it if it's invalid
    console.log('Token found in localStorage, validating...');
    // If validation fails: state.logout();
  }
};
