/**
 * UI Store (Zustand)
 *
 * Manages client-side UI state:
 * - Sidebar collapsed state
 * - Theme preferences
 * - Modal open/close states
 * - Loading states
 * - Toast notifications
 *
 * Uses Zustand for lightweight state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI State interface
 */
interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Modals
  openModals: Set<string>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;

  // Loading states
  loadingStates: Map<string, boolean>;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;

  // Page size preferences (for tables)
  pageSize: number;
  setPageSize: (size: number) => void;
}

/**
 * UI Store
 *
 * Persists sidebar and theme preferences to localStorage
 * Other UI states are kept in memory only
 *
 * @example
 * ```tsx
 * import { useUIStore } from '@/stores/uiStore';
 *
 * function MyComponent() {
 *   const { sidebarCollapsed, toggleSidebar } = useUIStore();
 *
 *   return (
 *     <button onClick={toggleSidebar}>
 *       {sidebarCollapsed ? 'Expand' : 'Collapse'}
 *     </button>
 *   );
 * }
 * ```
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Theme state
      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },

      // Modal state
      openModals: new Set(),
      openModal: (modalId) =>
        set((state) => {
          const newSet = new Set(state.openModals);
          newSet.add(modalId);
          return { openModals: newSet };
        }),
      closeModal: (modalId) =>
        set((state) => {
          const newSet = new Set(state.openModals);
          newSet.delete(modalId);
          return { openModals: newSet };
        }),
      isModalOpen: (modalId) => get().openModals.has(modalId),

      // Loading states
      loadingStates: new Map(),
      setLoading: (key, loading) =>
        set((state) => {
          const newMap = new Map(state.loadingStates);
          if (loading) {
            newMap.set(key, true);
          } else {
            newMap.delete(key);
          }
          return { loadingStates: newMap };
        }),
      isLoading: (key) => get().loadingStates.get(key) ?? false,

      // Page size preference
      pageSize: 10,
      setPageSize: (size) => set({ pageSize: size }),
    }),
    {
      name: 'ui-storage', // localStorage key
      // Only persist these fields
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        pageSize: state.pageSize,
      }),
    }
  )
);

/**
 * Selector hooks for better performance
 * Only re-render when specific state changes
 */

export const useSidebarCollapsed = () => useUIStore((state) => state.sidebarCollapsed);
export const useToggleSidebar = () => useUIStore((state) => state.toggleSidebar);
export const useTheme = () => useUIStore((state) => state.theme);
export const useSetTheme = () => useUIStore((state) => state.setTheme);
export const usePageSize = () => useUIStore((state) => state.pageSize);
