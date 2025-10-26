/**
 * Filter Store (Zustand)
 *
 * Manages filter state across different pages:
 * - Sites filters (type, location, search)
 * - Clients filters (search)
 * - Activities filters (date range, client, site, action)
 * - Sort state
 *
 * Keeps filter state in memory (not persisted)
 */

import { create } from 'zustand';
import type { SiteType, ActionType } from '@/types';

/**
 * Sites filter state
 */
export interface SitesFilters {
  searchTerm: string;
  type?: SiteType;
  location?: string;
  status?: 'active' | 'available' | 'all';
  sortBy?: 'siteNo' | 'location' | 'type' | 'updatedAt';
  sortDirection: 'asc' | 'desc';
}

/**
 * Clients filter state
 */
export interface ClientsFilters {
  searchTerm: string;
  sortBy?: 'clientName' | 'gstNo' | 'updatedAt';
  sortDirection: 'asc' | 'desc';
}

/**
 * Activities filter state
 */
export interface ActivitiesFilters {
  searchTerm: string;
  clientId?: string;
  siteId?: string;
  action?: ActionType;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'clientName' | 'siteNo' | 'action';
  sortDirection: 'asc' | 'desc';
}

/**
 * Filter Store State
 */
interface FilterState {
  // Sites filters
  sitesFilters: SitesFilters;
  setSitesFilters: (filters: Partial<SitesFilters>) => void;
  resetSitesFilters: () => void;
  setSitesSearch: (search: string) => void;
  setSitesSort: (sortBy: SitesFilters['sortBy'], direction: 'asc' | 'desc') => void;

  // Clients filters
  clientsFilters: ClientsFilters;
  setClientsFilters: (filters: Partial<ClientsFilters>) => void;
  resetClientsFilters: () => void;
  setClientsSearch: (search: string) => void;
  setClientsSort: (sortBy: ClientsFilters['sortBy'], direction: 'asc' | 'desc') => void;

  // Activities filters
  activitiesFilters: ActivitiesFilters;
  setActivitiesFilters: (filters: Partial<ActivitiesFilters>) => void;
  resetActivitiesFilters: () => void;
  setActivitiesSearch: (search: string) => void;
  setActivitiesSort: (sortBy: ActivitiesFilters['sortBy'], direction: 'asc' | 'desc') => void;
  setActivitiesDateRange: (from?: string, to?: string) => void;

  // Global reset
  resetAllFilters: () => void;
}

/**
 * Default filter values
 */
const defaultSitesFilters: SitesFilters = {
  searchTerm: '',
  status: 'all',
  sortBy: 'updatedAt',
  sortDirection: 'desc',
};

const defaultClientsFilters: ClientsFilters = {
  searchTerm: '',
  sortBy: 'clientName',
  sortDirection: 'asc',
};

const defaultActivitiesFilters: ActivitiesFilters = {
  searchTerm: '',
  sortBy: 'date',
  sortDirection: 'desc',
};

/**
 * Filter Store
 *
 * Manages filter state for sites, clients, and activities pages
 * Filter state is kept in memory only (not persisted)
 *
 * @example
 * ```tsx
 * import { useFilterStore } from '@/stores/filterStore';
 *
 * function SitesPage() {
 *   const { sitesFilters, setSitesFilters, resetSitesFilters } = useFilterStore();
 *
 *   return (
 *     <div>
 *       <SearchBar
 *         value={sitesFilters.searchTerm}
 *         onSearch={(value) => setSitesFilters({ searchTerm: value })}
 *       />
 *       <button onClick={resetSitesFilters}>Clear Filters</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useFilterStore = create<FilterState>((set) => ({
  // Sites filters
  sitesFilters: defaultSitesFilters,
  setSitesFilters: (filters) =>
    set((state) => ({
      sitesFilters: { ...state.sitesFilters, ...filters },
    })),
  resetSitesFilters: () => set({ sitesFilters: defaultSitesFilters }),
  setSitesSearch: (searchTerm) =>
    set((state) => ({
      sitesFilters: { ...state.sitesFilters, searchTerm },
    })),
  setSitesSort: (sortBy, sortDirection) =>
    set((state) => ({
      sitesFilters: { ...state.sitesFilters, sortBy, sortDirection },
    })),

  // Clients filters
  clientsFilters: defaultClientsFilters,
  setClientsFilters: (filters) =>
    set((state) => ({
      clientsFilters: { ...state.clientsFilters, ...filters },
    })),
  resetClientsFilters: () => set({ clientsFilters: defaultClientsFilters }),
  setClientsSearch: (searchTerm) =>
    set((state) => ({
      clientsFilters: { ...state.clientsFilters, searchTerm },
    })),
  setClientsSort: (sortBy, sortDirection) =>
    set((state) => ({
      clientsFilters: { ...state.clientsFilters, sortBy, sortDirection },
    })),

  // Activities filters
  activitiesFilters: defaultActivitiesFilters,
  setActivitiesFilters: (filters) =>
    set((state) => ({
      activitiesFilters: { ...state.activitiesFilters, ...filters },
    })),
  resetActivitiesFilters: () => set({ activitiesFilters: defaultActivitiesFilters }),
  setActivitiesSearch: (searchTerm) =>
    set((state) => ({
      activitiesFilters: { ...state.activitiesFilters, searchTerm },
    })),
  setActivitiesSort: (sortBy, sortDirection) =>
    set((state) => ({
      activitiesFilters: { ...state.activitiesFilters, sortBy, sortDirection },
    })),
  setActivitiesDateRange: (dateFrom, dateTo) =>
    set((state) => ({
      activitiesFilters: { ...state.activitiesFilters, dateFrom, dateTo },
    })),

  // Reset all filters
  resetAllFilters: () =>
    set({
      sitesFilters: defaultSitesFilters,
      clientsFilters: defaultClientsFilters,
      activitiesFilters: defaultActivitiesFilters,
    }),
}));

/**
 * Selector hooks for better performance
 */

export const useSitesFilters = () => useFilterStore((state) => state.sitesFilters);
export const useClientsFilters = () => useFilterStore((state) => state.clientsFilters);
export const useActivitiesFilters = () => useFilterStore((state) => state.activitiesFilters);
