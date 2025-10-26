/**
 * usePagination Hook
 *
 * Manages pagination state for tables and lists
 */

import { useState } from 'react';
import { PAGINATION } from '@/config/constants';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: (totalPages: number) => void;
  canGoNext: (totalPages: number) => boolean;
  canGoPrev: boolean;
}

/**
 * Pagination state management hook
 *
 * @param options - Configuration options
 * @returns Pagination state and controls
 *
 * @example
 * const {
 *   page,
 *   limit,
 *   setPage,
 *   nextPage,
 *   prevPage,
 *   canGoNext,
 *   canGoPrev
 * } = usePagination();
 *
 * // Use with React Query
 * const { data } = useQuery(['items', page, limit], () =>
 *   fetchItems({ page, limit })
 * );
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = PAGINATION.DEFAULT_PAGE, initialLimit = PAGINATION.DEFAULT_LIMIT } =
    options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToFirstPage = () => setPage(1);
  const goToLastPage = (totalPages: number) => setPage(totalPages);

  const canGoNext = (totalPages: number) => page < totalPages;
  const canGoPrev = page > 1;

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrev,
  };
}

/**
 * Calculate pagination metadata
 *
 * @param total - Total number of items
 * @param page - Current page (1-indexed)
 * @param limit - Items per page
 * @returns Pagination metadata
 */
export const calculatePaginationMeta = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
  };
};
