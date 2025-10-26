/**
 * SearchBar Component
 *
 * Debounced search input with:
 * - Automatic debouncing to reduce API calls
 * - Search icon and clear button
 * - Loading indicator
 * - Keyboard shortcuts (Escape to clear)
 *
 * Optimized for performance with large datasets
 */

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  /** Current search value */
  value?: string;
  /** Callback when search value changes (debounced) */
  onSearch: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Show loading indicator */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
}

/**
 * Debounced search input component
 *
 * Features:
 * - Debounced onChange to reduce server requests
 * - Clear button to reset search
 * - Keyboard shortcuts (Escape to clear)
 * - Loading indicator during search
 * - Auto-focus support
 *
 * @param value - Controlled search value
 * @param onSearch - Callback fired after debounce delay
 * @param placeholder - Input placeholder text
 * @param debounceMs - Debounce delay (default: 300ms)
 * @param loading - Show loading indicator
 * @param className - Additional CSS classes
 * @param autoFocus - Auto-focus input on mount
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 *
 * <SearchBar
 *   value={search}
 *   onSearch={(value) => {
 *     setSearch(value);
 *     // Fetch filtered data
 *   }}
 *   placeholder="Search sites..."
 *   loading={isLoading}
 * />
 * ```
 */
export function SearchBar({
  value = '',
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
  loading = false,
  className,
  autoFocus = false,
}: SearchBarProps) {
  // Local state for immediate UI updates
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced value for API calls
  const debouncedValue = useDebounce(inputValue, debounceMs);

  /**
   * Sync external value changes with local state
   * (e.g., when parent resets search)
   */
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  /**
   * Fire onSearch callback when debounced value changes
   */
  useEffect(() => {
    onSearch(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  /**
   * Auto-focus input on mount
   */
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  /**
   * Clear search input
   */
  const handleClear = () => {
    setInputValue('');
    onSearch('');
    inputRef.current?.focus();
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Escape key clears search
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Search icon */}
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

      {/* Input field */}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-9 pr-9"
        aria-label="Search"
      />

      {/* Clear button or loading indicator */}
      {inputValue && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {loading ? (
            <div className="flex h-5 w-5 items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-5 w-5 rounded-full p-0 hover:bg-gray-100"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
