/**
 * Client Form Page
 *
 * Unified form for creating and editing clients
 * - Handles both create and edit modes
 * - Form validation with Zod (GST number validation)
 * - Optimistic updates on edit
 * - Navigation on success
 *
 * Route: /clients/new (create) or /clients/:id/edit (edit)
 */

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';
import { FormField } from '@/components/forms/FormField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/EmptyState';
import {
  useClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
} from '@/hooks/useClients';
import { clientSchema, type ClientFormData } from '@/lib/utils/validation';
import { ROUTES } from '@/config/constants';

/**
 * Client Form Page Component
 */
export function ClientFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Fetch existing client data if editing
  const { data: existingClient, isLoading: isLoadingClient, isError } = useClientQuery(id || '');

  // Mutations
  const { mutate: createClient, isPending: isCreating } = useCreateClientMutation();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClientMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      gstNumber: '',
      notes: '',
    },
  });

  /**
   * Populate form with existing client data
   */
  useEffect(() => {
    if (existingClient && isEditMode) {
      reset({
        name: existingClient.name,
        contactPerson: existingClient.contactPerson || '',
        email: existingClient.email || '',
        phone: existingClient.phone || '',
        address: existingClient.address || '',
        gstNumber: existingClient.gstNumber || '',
        notes: existingClient.notes || '',
      });
    }
  }, [existingClient, isEditMode, reset]);

  /**
   * Handle form submission
   */
  const onSubmit = (data: ClientFormData) => {
    if (isEditMode && id) {
      // Update existing client
      updateClient(
        { id, data },
        {
          onSuccess: (updatedClient) => {
            navigate(ROUTES.CLIENTS_DETAIL(updatedClient.id));
          },
        }
      );
    } else {
      // Create new client
      createClient(data, {
        onSuccess: (newClient) => {
          navigate(ROUTES.CLIENTS_DETAIL(newClient.id));
        },
      });
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    if (isEditMode && id) {
      navigate(ROUTES.CLIENTS_DETAIL(id));
    } else {
      navigate(ROUTES.CLIENTS);
    }
  };

  // Loading state for edit mode
  if (isEditMode && isLoadingClient) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading client..." />
      </div>
    );
  }

  // Error state for edit mode
  if (isEditMode && isError) {
    return (
      <div>
        <PageHeader title="Edit Client" back={{ href: ROUTES.CLIENTS }} />
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={isEditMode ? 'Edit Client' : 'Create New Client'}
        description={isEditMode ? 'Update client information' : 'Add a new client'}
        back={{
          href: isEditMode && id ? ROUTES.CLIENTS_DETAIL(id) : ROUTES.CLIENTS,
          label: 'Back',
        }}
      />

      {/* Form Card */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Client Information' : 'New Client Details'}</CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update the client information below'
              : 'Enter the details for the new client'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Client Name */}
            <FormField
              name="name"
              label="Client Name"
              type="text"
              placeholder="e.g., Acme Corporation"
              register={register}
              error={errors.name}
              required
              helperText="Full legal name of the client"
            />

            {/* Contact Person */}
            <FormField
              name="contactPerson"
              label="Contact Person"
              type="text"
              placeholder="e.g., John Doe"
              register={register}
              error={errors.contactPerson}
              helperText="Primary contact person's name"
            />

            {/* Email */}
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="e.g., contact@company.com"
              register={register}
              error={errors.email}
              helperText="Contact email address"
            />

            {/* Phone */}
            <FormField
              name="phone"
              label="Phone"
              type="tel"
              placeholder="e.g., +91 98765 43210"
              register={register}
              error={errors.phone}
              helperText="Contact phone number"
            />

            {/* Address */}
            <FormField
              name="address"
              label="Address"
              type="textarea"
              placeholder="Full address"
              register={register}
              error={errors.address}
              helperText="Physical address of the client"
            />

            {/* GST Number */}
            <FormField
              name="gstNumber"
              label="GST Number"
              type="text"
              placeholder="e.g., 29ABCDE1234F1Z5"
              register={register}
              error={errors.gstNumber}
              helperText="15-character GST identification number (Format: 29ABCDE1234F1Z5)"
            />

            {/* Notes */}
            <FormField
              name="notes"
              label="Notes"
              type="textarea"
              placeholder="Additional notes..."
              register={register}
              error={errors.notes}
              helperText="Any additional information about the client"
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-3 border-t pt-6">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? 'Update Client' : 'Create Client'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
