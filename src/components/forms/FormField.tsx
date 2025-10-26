/**
 * FormField Component
 *
 * Reusable form field wrapper for React Hook Form with:
 * - Label, input, and error message
 * - Support for various input types
 * - Integration with Zod validation
 * - Consistent styling
 *
 * Built on shadcn/ui form primitives
 */

import { ReactNode } from 'react';
import { UseFormRegister, FieldError, FieldValues, Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

/**
 * Form field types
 */
type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';

interface BaseFormFieldProps<TFieldValues extends FieldValues> {
  /** Field name (must match schema) */
  name: Path<TFieldValues>;
  /** Field label */
  label: string;
  /** Field error from React Hook Form */
  error?: FieldError;
  /** Helper text displayed below input */
  helperText?: string;
  /** Mark field as required */
  required?: boolean;
  /** Custom CSS classes */
  className?: string;
}

interface TextFormFieldProps<TFieldValues extends FieldValues>
  extends BaseFormFieldProps<TFieldValues> {
  /** Input type */
  type?: InputType;
  /** Placeholder text */
  placeholder?: string;
  /** React Hook Form register function */
  register: UseFormRegister<TFieldValues>;
  /** Disable the input */
  disabled?: boolean;
}

interface TextareaFormFieldProps<TFieldValues extends FieldValues>
  extends BaseFormFieldProps<TFieldValues> {
  type: 'textarea';
  placeholder?: string;
  register: UseFormRegister<TFieldValues>;
  disabled?: boolean;
  rows?: number;
}

interface SelectFormFieldProps<TFieldValues extends FieldValues>
  extends BaseFormFieldProps<TFieldValues> {
  type: 'select';
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface CustomFormFieldProps<TFieldValues extends FieldValues>
  extends BaseFormFieldProps<TFieldValues> {
  type: 'custom';
  children: ReactNode;
}

type FormFieldProps<TFieldValues extends FieldValues> =
  | TextFormFieldProps<TFieldValues>
  | TextareaFormFieldProps<TFieldValues>
  | SelectFormFieldProps<TFieldValues>
  | CustomFormFieldProps<TFieldValues>;

/**
 * Form field component with label, input, and error handling
 *
 * Features:
 * - Type-safe field names
 * - Automatic error display
 * - Multiple input types (text, textarea, select, custom)
 * - Consistent styling
 * - Required field indicators
 *
 * @example
 * ```tsx
 * // Text input
 * <FormField
 *   name="siteNo"
 *   label="Site Number"
 *   type="text"
 *   placeholder="Enter site number"
 *   register={register}
 *   error={errors.siteNo}
 *   required
 * />
 *
 * // Textarea
 * <FormField
 *   name="remarks"
 *   label="Remarks"
 *   type="textarea"
 *   register={register}
 *   error={errors.remarks}
 *   rows={4}
 * />
 *
 * // Select
 * <FormField
 *   name="type"
 *   label="Site Type"
 *   type="select"
 *   options={[
 *     { value: 'unipole', label: 'Unipole' },
 *     { value: 'hoarding', label: 'Hoarding' },
 *   ]}
 *   value={watch('type')}
 *   onChange={(value) => setValue('type', value)}
 *   error={errors.type}
 * />
 * ```
 */
export function FormField<TFieldValues extends FieldValues>(props: FormFieldProps<TFieldValues>) {
  const { name, label, error, helperText, required, className } = props;

  /**
   * Render input based on type
   */
  const renderInput = () => {
    if (props.type === 'textarea') {
      return (
        <Textarea
          id={name}
          placeholder={props.placeholder}
          disabled={props.disabled}
          rows={props.rows || 3}
          className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props.register(name)}
        />
      );
    }

    if (props.type === 'select') {
      return (
        <Select value={props.value} onValueChange={props.onChange} disabled={props.disabled}>
          <SelectTrigger
            id={name}
            className={cn(error && 'border-red-500 focus:ring-red-500')}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <SelectValue placeholder={props.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (props.type === 'custom') {
      return props.children;
    }

    // Default text input
    return (
      <Input
        id={name}
        type={props.type || 'text'}
        placeholder={props.placeholder}
        disabled={props.disabled}
        className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props.register(name, {
          valueAsNumber: props.type === 'number',
        })}
      />
    );
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && (
          <span className="text-red-500" aria-label="required">
            *
          </span>
        )}
      </Label>

      {/* Input */}
      {renderInput()}

      {/* Helper text */}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}

      {/* Error message */}
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
