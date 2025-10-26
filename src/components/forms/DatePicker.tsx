/**
 * DatePicker Component
 *
 * Date picker input with:
 * - Calendar popup
 * - Keyboard navigation
 * - Date formatting
 * - Min/max date constraints
 * - Integration with React Hook Form
 *
 * Uses native HTML date input for better mobile UX
 */

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  /** Field name */
  name: string;
  /** Field label */
  label?: string;
  /** Current date value (YYYY-MM-DD format) */
  value: string;
  /** Callback when date changes */
  onChange: (value: string) => void;
  /** Minimum allowed date */
  min?: string;
  /** Maximum allowed date */
  max?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Disable the input */
  disabled?: boolean;
  /** Mark as required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Date picker component
 *
 * Features:
 * - Native date input for mobile compatibility
 * - Calendar icon indicator
 * - Min/max date validation
 * - Error state display
 * - Accessible labels and hints
 *
 * @param name - Field name for form binding
 * @param label - Field label
 * @param value - Current date value (YYYY-MM-DD)
 * @param onChange - Callback when date changes
 * @param min - Minimum allowed date
 * @param max - Maximum allowed date
 * @param placeholder - Placeholder text
 * @param disabled - Disable input
 * @param required - Mark as required
 * @param error - Error message
 * @param helperText - Helper text
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * const [date, setDate] = useState('2024-01-15');
 *
 * <DatePicker
 *   name="dateOfPurchase"
 *   label="Date of Purchase"
 *   value={date}
 *   onChange={setDate}
 *   max={new Date().toISOString().split('T')[0]}
 *   required
 * />
 * ```
 */
export function DatePicker({
  name,
  label,
  value,
  onChange,
  min,
  max,
  placeholder = 'Select date',
  disabled = false,
  required = false,
  error,
  helperText,
  className,
}: DatePickerProps) {
  // Local state for input value
  const [inputValue, setInputValue] = useState(value || '');

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  /**
   * Handle date input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  /**
   * Set to today's date
   */
  const setToday = () => {
    const today = new Date().toISOString().split('T')[0] ?? '';
    setInputValue(today);
    onChange(today);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <Label htmlFor={name} className="flex items-center gap-1">
          {label}
          {required && (
            <span className="text-red-500" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}

      {/* Date input with calendar icon */}
      <div className="relative">
        <Input
          id={name}
          type="date"
          value={inputValue}
          onChange={handleChange}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={cn('pr-10', error && 'border-red-500 focus-visible:ring-red-500')}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        />

        {/* Calendar icon */}
        <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Quick action: Set to today */}
      {!disabled && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setToday}
            className="h-7 text-xs"
          >
            Today
          </Button>
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setInputValue('');
                onChange('');
              }}
              className="h-7 text-xs text-red-600 hover:text-red-700"
            >
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p id={`${name}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Date range picker component
 * Allows selecting a start and end date
 */
interface DateRangePickerProps {
  /** Start date label */
  startLabel?: string;
  /** End date label */
  endLabel?: string;
  /** Start date value */
  startDate: string;
  /** End date value */
  endDate: string;
  /** Callback when start date changes */
  onStartDateChange: (value: string) => void;
  /** Callback when end date changes */
  onEndDateChange: (value: string) => void;
  /** Start date error */
  startError?: string;
  /** End date error */
  endError?: string;
  /** Disable inputs */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Date range picker for selecting start and end dates
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   startLabel="From Date"
 *   endLabel="To Date"
 *   startDate={fromDate}
 *   endDate={toDate}
 *   onStartDateChange={setFromDate}
 *   onEndDateChange={setToDate}
 * />
 * ```
 */
export function DateRangePicker({
  startLabel = 'From',
  endLabel = 'To',
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startError,
  endError,
  disabled,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      <DatePicker
        name="startDate"
        label={startLabel}
        value={startDate}
        onChange={onStartDateChange}
        max={endDate || undefined}
        error={startError}
        disabled={disabled}
      />
      <DatePicker
        name="endDate"
        label={endLabel}
        value={endDate}
        onChange={onEndDateChange}
        min={startDate || undefined}
        error={endError}
        disabled={disabled}
      />
    </div>
  );
}
