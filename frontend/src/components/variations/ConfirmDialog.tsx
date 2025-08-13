import { useEffect } from 'react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { ConfirmationConfig } from '../../context/confirmationContexts';

export interface ConfirmDialogProps {
  /** Whether the dialog is currently open */
  isOpen: boolean;
  /** Configuration for the dialog content and appearance */
  config: ConfirmationConfig | null;
  /** Function called when the user confirms the dialog */
  onConfirm: () => void;
  /** Function called when the user cancels the dialog */
  onCancel: () => void;
}

/**
 * Confirmation dialog component that provides a standardized way to ask for user confirmation.
 * 
 * Built on top of the base Modal component with consistent styling and behavior.
 * Used internally by the ConfirmationProvider - consumers should use the useConfirmation hook instead.
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={true}
 *   config={{
 *     title: "Delete Item",
 *     message: "Are you sure you want to delete this item? This action cannot be undone.",
 *     confirmText: "Delete",
 *     cancelText: "Cancel",
 *     variant: "danger"
 *   }}
 *   onConfirm={() => console.log('confirmed')}
 *   onCancel={() => console.log('cancelled')}
 * />
 * ```
 */
export const ConfirmDialog = ({ isOpen, config, onConfirm, onCancel }: ConfirmDialogProps) => {
  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm]);

  if (!config) return null;

  const {
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary'
  } = config;

  // Determine button variants based on dialog variant
  const confirmVariant = variant === 'danger' ? 'danger' : 'primary';
  const cancelVariant = 'secondary';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onCancel}
      ariaLabelledBy="confirm-dialog-title"
    >
      <div className="p-6 space-y-6 max-w-md">
        {/* Header */}
        <div className="space-y-2">
          <h2 
            id="confirm-dialog-title"
            className="font-mono font-black text-text-primary uppercase text-xl tracking-wide"
          >
            {title}
          </h2>
          <p className="font-mono text-text-secondary leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant={cancelVariant}
            size="md"
            onClick={onCancel}
            testId="confirm-dialog-cancel"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            size="md"
            onClick={onConfirm}
            testId="confirm-dialog-confirm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};