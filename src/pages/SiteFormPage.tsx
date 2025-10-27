/**
 * Site Form Page
 *
 * Unified form for creating and editing sites
 * - Handles both create and edit modes
 * - Form validation with Zod
 * - Optimistic updates on edit
 * - Navigation on success
 *
 * Route: /sites/new (create) or /sites/:id/edit (edit)
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
import { useSiteQuery, useCreateSiteMutation, useUpdateSiteMutation } from '@/hooks/useSites';
import { siteSchema, type SiteFormData } from '@/lib/utils/validation';
import { ROUTES } from '@/config/constants';

/**
 * Site Form Page Component
 */
export function SiteFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Fetch existing site data if editing
  const { data: existingSite, isLoading: isLoadingSite, isError } = useSiteQuery(id || '');

  // Mutations
  const { mutate: createSite, isPending: isCreating } = useCreateSiteMutation();
  const { mutate: updateSite, isPending: isUpdating } = useUpdateSiteMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      siteNo: '',
      location: '',
      type: 'unipole',
      size: '',
      remarks: '',
    },
  });

  // Watch type for Select component
  const selectedType = watch('type');

  /**
   * Populate form with existing site data
   */
  useEffect(() => {
    if (existingSite && isEditMode) {
      reset({
        siteNo: existingSite.siteNo,
        location: existingSite.location,
        type: existingSite.type,
        size: existingSite.size,
        remarks: existingSite.remarks || '',
      });
    }
  }, [existingSite, isEditMode, reset]);

  /**
   * Handle form submission
   */
  const onSubmit = (data: SiteFormData) => {
    if (isEditMode && id) {
      // Update existing site
      updateSite(
        { id, data },
        {
          onSuccess: (updatedSite) => {
            navigate(ROUTES.SITES_DETAIL(updatedSite.id));
          },
        }
      );
    } else {
      // Create new site
      createSite(data, {
        onSuccess: (newSite) => {
          navigate(ROUTES.SITES_DETAIL(newSite.id));
        },
      });
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    if (isEditMode && id) {
      navigate(ROUTES.SITES_DETAIL(id));
    } else {
      navigate(ROUTES.SITES);
    }
  };

  // Loading state for edit mode
  if (isEditMode && isLoadingSite) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading site..." />
      </div>
    );
  }

  // Error state for edit mode
  if (isEditMode && isError) {
    return (
      <div>
        <PageHeader title="Edit Site" back={{ href: ROUTES.SITES }} />
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={isEditMode ? 'Edit Site' : 'Create New Site'}
        description={isEditMode ? 'Update site information' : 'Add a new advertising site'}
        back={{
          href: isEditMode && id ? ROUTES.SITES_DETAIL(id) : ROUTES.SITES,
          label: 'Back',
        }}
      />

      {/* Form Card */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Site Information' : 'New Site Details'}</CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update the site information below'
              : 'Enter the details for the new advertising site'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Site Number */}
            <FormField
              name="siteNo"
              label="Site Number"
              type="text"
              placeholder="e.g., SITE-001"
              register={register}
              error={errors.siteNo}
              required
              helperText="Unique identifier for the site"
            />

            {/* Location */}
            <FormField
              name="location"
              label="Location"
              type="text"
              placeholder="e.g., MG Road, Mumbai"
              register={register}
              error={errors.location}
              required
              helperText="Physical location of the advertising site"
            />

            {/* Type */}
            <FormField
              name="type"
              label="Site Type"
              type="select"
              options={[
                { value: 'unipole', label: 'Unipole' },
                { value: 'hoarding', label: 'Hoarding' },
              ]}
              value={selectedType}
              onChange={(value) => setValue('type', value as 'unipole' | 'hoarding')}
              error={errors.type}
              required
              helperText="Type of advertising structure"
            />

            {/* Size */}
            <FormField
              name="size"
              label="Size"
              type="text"
              placeholder="e.g., 20x10 ft"
              register={register}
              error={errors.size}
              required
              helperText="Dimensions of the advertising space"
            />

            {/* Remarks */}
            <FormField
              name="remarks"
              label="Remarks"
              type="textarea"
              placeholder="Additional notes about the site..."
              register={register}
              error={errors.remarks}
              rows={3}
              helperText="Optional notes or special instructions"
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
                    {isEditMode ? 'Update Site' : 'Create Site'}
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
