/**
 * ClientCombobox Component
 *
 * Searchable combobox for selecting or creating clients
 * - Shows existing clients
 * - Allows creating new clients inline with minimal data (name only)
 * - Auto-creates client when "+ Create [name]" is selected
 * - Returns clientId to parent form
 */

import * as React from 'react';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { useCreateClientMutation } from '@/hooks/useClients';
import type { Client } from '@/types';

/**
 * ClientCombobox Props
 */
export interface ClientComboboxProps {
  /** Array of existing clients */
  clients: Client[];
  /** Currently selected client ID */
  value?: string;
  /** Callback when client is selected or created */
  onValueChange?: (clientId: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether combobox has error */
  error?: boolean;
  /** Whether combobox is disabled */
  disabled?: boolean;
}

/**
 * ClientCombobox Component
 */
export function ClientCombobox({
  clients,
  value,
  onValueChange,
  placeholder = 'Select client...',
  error = false,
  disabled = false,
}: ClientComboboxProps) {
  const { mutate: createClient, isPending } = useCreateClientMutation();

  // Transform clients to combobox items
  const items: ComboboxItem[] = React.useMemo(
    () =>
      clients.map((client) => ({
        value: client.id,
        label: client.name,
      })),
    [clients]
  );

  /**
   * Handle creating a new client
   */
  const handleCreateNew = (name: string) => {
    createClient(
      {
        name: name.trim(),
        // Minimal data - other fields can be added later
      },
      {
        onSuccess: (newClient) => {
          // Immediately select the newly created client
          onValueChange?.(newClient.id);
        },
      }
    );
  };

  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={onValueChange}
      onCreateNew={handleCreateNew}
      placeholder={placeholder}
      searchPlaceholder="Search clients..."
      emptyMessage="No clients found."
      disabled={disabled || isPending}
      error={error}
      allowCreate={true}
      createLabel="Create client"
    />
  );
}
