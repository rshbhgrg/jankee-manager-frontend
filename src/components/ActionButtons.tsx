/**
 * ActionButtons Component
 *
 * Reusable action button groups for:
 * - Table row actions (edit, delete, view)
 * - List item actions
 * - Card actions
 * - Confirmation dialogs
 *
 * Provides consistent UI for common CRUD operations
 */

import { useState } from 'react';
import { Edit, Trash2, Eye, MoreHorizontal, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface ActionButtonsProps {
  /** Callback for edit action */
  onEdit?: () => void;
  /** Callback for delete action */
  onDelete?: () => void;
  /** Callback for view action */
  onView?: () => void;
  /** Callback for duplicate action */
  onDuplicate?: () => void;
  /** Custom actions */
  customActions?: Array<{
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }>;
  /** Show as dropdown menu (vs inline buttons) */
  variant?: 'dropdown' | 'inline';
  /** Confirm before delete */
  confirmDelete?: boolean;
  /** Delete confirmation message */
  deleteMessage?: string;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Action buttons component
 *
 * Features:
 * - Common CRUD actions (view, edit, delete)
 * - Optional duplicate action
 * - Custom actions support
 * - Dropdown or inline layout
 * - Delete confirmation dialog
 *
 * @param onEdit - Edit action callback
 * @param onDelete - Delete action callback
 * @param onView - View action callback
 * @param onDuplicate - Duplicate action callback
 * @param customActions - Array of custom action configurations
 * @param variant - Display variant (dropdown or inline)
 * @param confirmDelete - Show confirmation before delete
 * @param deleteMessage - Custom delete confirmation message
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * // Inline buttons
 * <ActionButtons
 *   onView={() => navigate(`/sites/${id}`)}
 *   onEdit={() => navigate(`/sites/${id}/edit`)}
 *   onDelete={handleDelete}
 *   confirmDelete
 * />
 *
 * // Dropdown menu
 * <ActionButtons
 *   variant="dropdown"
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   customActions={[
 *     { label: 'Export', onClick: handleExport }
 *   ]}
 * />
 * ```
 */
export function ActionButtons({
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  customActions,
  variant = 'inline',
  confirmDelete = true,
  deleteMessage = 'Are you sure you want to delete this item? This action cannot be undone.',
  className,
}: ActionButtonsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  /**
   * Handle delete click
   * Shows confirmation dialog if enabled, otherwise deletes immediately
   */
  const handleDeleteClick = () => {
    if (confirmDelete) {
      setShowDeleteDialog(true);
    } else {
      onDelete?.();
    }
  };

  /**
   * Confirm delete action
   */
  const handleConfirmDelete = () => {
    onDelete?.();
    setShowDeleteDialog(false);
  };

  // Dropdown menu variant
  if (variant === 'dropdown') {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={className}>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={onView}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            )}
            {customActions?.map((action, index) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                  className={cn(action.variant === 'destructive' && 'text-red-600')}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </DropdownMenuItem>
              );
            })}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete confirmation dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>{deleteMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Inline buttons variant
  return (
    <>
      <div className={cn('flex items-center gap-1', className)}>
        {onView && (
          <Button variant="ghost" size="icon" onClick={onView} title="View">
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDuplicate && (
          <Button variant="ghost" size="icon" onClick={onDuplicate} title="Duplicate">
            <Copy className="h-4 w-4" />
          </Button>
        )}
        {customActions?.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onClick={action.onClick}
              title={action.label}
              className={cn(action.variant === 'destructive' && 'text-red-600 hover:text-red-700')}
            >
              {Icon ? <Icon className="h-4 w-4" /> : action.label}
            </Button>
          );
        })}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            title="Delete"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>{deleteMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
