/**
 * Combobox Component
 *
 * A searchable combobox with support for creating new items
 * Built with Radix UI Popover and Command primitives
 */

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * Combobox Item Type
 */
export interface ComboboxItem {
  value: string;
  label: string;
}

/**
 * Combobox Props
 */
export interface ComboboxProps {
  /** Array of items to display */
  items: ComboboxItem[];
  /** Currently selected value */
  value?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Callback when creating a new item */
  onCreateNew?: (name: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Whether combobox is disabled */
  disabled?: boolean;
  /** Whether combobox has error */
  error?: boolean;
  /** Allow creating new items */
  allowCreate?: boolean;
  /** Label for create new option */
  createLabel?: string;
}

/**
 * Combobox Component
 */
export function Combobox({
  items,
  value,
  onValueChange,
  onCreateNew,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  disabled = false,
  error = false,
  allowCreate = true,
  createLabel = 'Create',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // Find selected item
  const selectedItem = items.find((item) => item.value === value);

  // Filter items based on search
  const filteredItems = React.useMemo(() => {
    if (!search) return items;
    const searchLower = search.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(searchLower));
  }, [items, search]);

  // Check if search matches any existing item exactly
  const exactMatch = items.some((item) => item.label.toLowerCase() === search.toLowerCase());

  // Show create option if: allowCreate, has search text, and no exact match
  const showCreateOption = allowCreate && search.trim() && !exactMatch;

  /**
   * Handle item selection
   */
  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue;
    onValueChange?.(newValue);
    setOpen(false);
    setSearch('');
  };

  /**
   * Handle create new
   */
  const handleCreateNew = () => {
    if (search.trim()) {
      onCreateNew?.(search.trim());
      setOpen(false);
      setSearch('');
    }
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between',
            !selectedItem && 'text-muted-foreground',
            error && 'border-red-500'
          )}
        >
          {selectedItem ? selectedItem.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content className="w-[--radix-popover-trigger-width] p-0" align="start">
          <div className="rounded-md border bg-white text-gray-900 shadow-md">
            {/* Search Input */}
            <div className="flex items-center border-b px-3">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Items List */}
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredItems.length === 0 && !showCreateOption ? (
                <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
              ) : (
                <>
                  {/* Filtered Items */}
                  {filteredItems.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleSelect(item.value)}
                      className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === item.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {item.label}
                    </button>
                  ))}

                  {/* Create New Option */}
                  {showCreateOption && (
                    <>
                      {filteredItems.length > 0 && <div className="my-1 border-t" />}
                      <button
                        onClick={handleCreateNew}
                        className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium text-blue-600 outline-none hover:bg-gray-100"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {createLabel} "{search}"
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
