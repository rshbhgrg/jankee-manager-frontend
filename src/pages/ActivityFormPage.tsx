/**
 * Activity Form Page
 *
 * Unified form for creating and editing activities
 * - Handles both create and edit modes
 * - Form validation with Zod
 * - Autocomplete for Site and Client selection
 * - Conditional fields based on action type
 * - Optimistic updates on edit
 * - Navigation on success
 *
 * Route: /activities/new (create) or /activities/:id/edit (edit)
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/PageHeader';
import { FormField } from '@/components/forms/FormField';
import { ClientCombobox } from '@/components/forms/ClientCombobox';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/EmptyState';
import {
  useActivityQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
} from '@/hooks/useActivities';
import { useClientsQuery } from '@/hooks/useClients';
import { useSitesQuery } from '@/hooks/useSites';
import { activitySchema, type ActivityFormData } from '@/lib/utils/validation';
import { ROUTES } from '@/config/constants';
import type { ActionType, BillType } from '@/types';

/**
 * Activity Form Page Component
 */
export function ActivityFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Fetch existing activity data if editing
  const {
    data: existingActivity,
    isLoading: isLoadingActivity,
    isError,
  } = useActivityQuery(id || '');

  // Fetch clients and sites for dropdowns
  const { data: clients = [], isLoading: isLoadingClients } = useClientsQuery();
  const { data: sites = [], isLoading: isLoadingSites } = useSitesQuery();

  // Mutations
  const { mutate: createActivity, isPending: isCreating } = useCreateActivityMutation();
  const { mutate: updateActivity, isPending: isUpdating } = useUpdateActivityMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0] ?? '',
      clientId: '',
      siteId: '',
      action: '',
      dateOfPublish: new Date().toISOString().split('T')[0] ?? '',
      fromDate: new Date().toISOString().split('T')[0] ?? '',
      toDate: '',
      billNo: '',
      billType: '',
      ratePerMonth: undefined,
      remarks: '',
      previousClientId: '',
    },
  });

  // Watch action type to show/hide previousClient field
  const selectedAction = watch('action');

  /**
   * Populate form with existing activity data
   */
  useEffect(() => {
    if (existingActivity && isEditMode) {
      reset({
        date: existingActivity.createdAt?.split('T')[0] ?? '',
        clientId: existingActivity.clientId,
        siteId: existingActivity.siteId,
        action: existingActivity.action,
        previousClientId: existingActivity.previousClientId || '',
        dateOfPublish: existingActivity.startDate?.split('T')[0] ?? '',
        fromDate: existingActivity.startDate?.split('T')[0] ?? '',
        toDate: existingActivity.endDate?.split('T')[0] || '',
        billNo: '',
        billType: '',
        ratePerMonth: existingActivity.ratePerMonth
          ? typeof existingActivity.ratePerMonth === 'string'
            ? parseFloat(existingActivity.ratePerMonth)
            : existingActivity.ratePerMonth
          : undefined,
        remarks: existingActivity.notes || '',
      });
    }
  }, [existingActivity, isEditMode, reset]);

  /**
   * Handle form submission
   * Transform form data to match backend API schema
   */
  const onSubmit = (data: ActivityFormData) => {
    // Calculate totalMonths if toDate is provided
    let totalMonths: number | undefined;
    if (data.toDate && data.fromDate) {
      const from = new Date(data.fromDate);
      const to = new Date(data.toDate);
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalMonths = Math.ceil(diffDays / 30);
    }

    // Calculate totalAmount if ratePerMonth and totalMonths are available
    const totalAmount =
      data.ratePerMonth && totalMonths ? data.ratePerMonth * totalMonths : undefined;

    // Transform form data to API format
    const apiData = {
      action: data.action as ActionType,
      siteId: data.siteId,
      clientId: data.clientId,
      previousClientId: data.action === 'shift' ? data.previousClientId : undefined,
      startDate: data.fromDate,
      endDate: data.toDate || undefined,
      ratePerMonth: data.ratePerMonth || 0,
      totalMonths,
      totalAmount,
      printingCost: 0, // Not in form yet
      mountingCost: 0, // Not in form yet
      notes: data.remarks || undefined,
    };

    if (isEditMode && id) {
      // Update existing activity
      updateActivity(
        { id, data: apiData },
        {
          onSuccess: (updatedActivity) => {
            navigate(ROUTES.ACTIVITIES);
          },
        }
      );
    } else {
      // Create new activity
      createActivity(apiData, {
        onSuccess: (newActivity) => {
          navigate(ROUTES.ACTIVITIES);
        },
      });
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    navigate(ROUTES.ACTIVITIES);
  };

  // Loading state for edit mode
  if (isEditMode && isLoadingActivity) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading activity..." />
      </div>
    );
  }

  // Error state for edit mode
  if (isEditMode && isError) {
    return (
      <div>
        <PageHeader title="Edit Activity" back={{ href: ROUTES.ACTIVITIES }} />
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const isSaving = isCreating || isUpdating;
  const isLoadingData = isLoadingClients || isLoadingSites;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={isEditMode ? 'Edit Activity' : 'Create New Activity'}
        description={isEditMode ? 'Update activity information' : 'Add a new activity'}
        back={{
          href: ROUTES.ACTIVITIES,
          label: 'Back',
        }}
      />

      {/* Form Card */}
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Activity Information' : 'New Activity Details'}</CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update the activity information below'
              : 'Enter the details for the new activity'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading form data..." />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Activity Date */}
              <FormField
                name="date"
                label="Activity Date"
                type="date"
                register={register}
                error={errors.date}
                required
                helperText="Date of this activity record"
              />

              {/* Action Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Action Type <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="action"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.action ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Booking</SelectItem>
                        <SelectItem value="shift">Client Shift</SelectItem>
                        <SelectItem value="flex_change">Flex Change</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.action && <p className="text-sm text-red-500">{errors.action.message}</p>}
                <p className="text-xs text-gray-500">Type of activity or transaction</p>
              </div>

              {/* Site Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Site <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="siteId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.siteId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.siteNo} - {site.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.siteId && <p className="text-sm text-red-500">{errors.siteId.message}</p>}
              </div>

              {/* Client Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Client <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <ClientCombobox
                      clients={clients}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select or create client..."
                      error={!!errors.clientId}
                    />
                  )}
                />
                {errors.clientId && (
                  <p className="text-sm text-red-500">{errors.clientId.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Select existing or type a new name to create
                </p>
              </div>

              {/* Previous Client (conditional - only for shift) */}
              {selectedAction === 'shift' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Previous Client <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="previousClientId"
                    control={control}
                    render={({ field }) => (
                      <ClientCombobox
                        clients={clients}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select or create previous client..."
                        error={!!errors.previousClientId}
                      />
                    )}
                  />
                  {errors.previousClientId && (
                    <p className="text-sm text-red-500">{errors.previousClientId.message}</p>
                  )}
                  <p className="text-xs text-gray-500">Client being replaced in this shift</p>
                </div>
              )}

              {/* Date of Publish */}
              <FormField
                name="dateOfPublish"
                label="Date of Publish"
                type="date"
                register={register}
                error={errors.dateOfPublish}
                required
                helperText="When this booking was published"
              />

              {/* From Date */}
              <FormField
                name="fromDate"
                label="From Date (Campaign Start)"
                type="date"
                register={register}
                error={errors.fromDate}
                required
                helperText="Campaign start date"
              />

              {/* To Date */}
              <FormField
                name="toDate"
                label="To Date (Campaign End)"
                type="date"
                register={register}
                error={errors.toDate}
                helperText="Campaign end date (leave empty for ongoing)"
              />

              {/* Rate Per Month */}
              <FormField
                name="ratePerMonth"
                label="Rate Per Month"
                type="number"
                register={register}
                error={errors.ratePerMonth}
                helperText="Monthly rental rate in INR"
              />

              {/* Bill Number */}
              <FormField
                name="billNo"
                label="Bill Number"
                type="text"
                placeholder="e.g., INV-2024-001"
                register={register}
                error={errors.billNo}
                helperText="Invoice or bill number"
              />

              {/* Bill Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Bill Type</label>
                <Controller
                  name="billType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bill type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quotation">Quotation</SelectItem>
                        <SelectItem value="bill">Bill</SelectItem>
                        <SelectItem value="foc">FOC</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-gray-500">Stage of billing</p>
              </div>

              {/* Remarks */}
              <FormField
                name="remarks"
                label="Remarks"
                type="textarea"
                placeholder="Additional notes..."
                register={register}
                error={errors.remarks}
                helperText="Any additional information about the activity"
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
                      {isEditMode ? 'Update Activity' : 'Create Activity'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
