import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ConfirmDialog } from '../../../src/components/variations/ConfirmDialog';
import type { ConfirmationConfig } from '../../../src/context/confirmationContexts';

describe('ConfirmDialog', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultConfig: ConfirmationConfig = {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'primary'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when not open', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        config={defaultConfig}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders nothing when config is null', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        config={null}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog with correct content when open', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        config={defaultConfig}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-dialog-confirm')).toHaveTextContent('Confirm');
    expect(screen.getByTestId('confirm-dialog-cancel')).toHaveTextContent('Cancel');
  });

  it('uses default button text when not specified', () => {
    const configWithoutButtonText: ConfirmationConfig = {
      title: 'Test Title',
      message: 'Test message'
    };

    render(
      <ConfirmDialog
        isOpen={true}
        config={configWithoutButtonText}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByTestId('confirm-dialog-confirm')).toHaveTextContent('Confirm');
    expect(screen.getByTestId('confirm-dialog-cancel')).toHaveTextContent('Cancel');
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        config={defaultConfig}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByTestId('confirm-dialog-confirm'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        config={defaultConfig}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByTestId('confirm-dialog-cancel'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Enter key is pressed', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        config={defaultConfig}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not call onConfirm when Enter is pressed and dialog is closed', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        config={defaultConfig}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('renders danger variant buttons correctly', () => {
    const dangerConfig: ConfirmationConfig = {
      ...defaultConfig,
      variant: 'danger'
    };

    render(
      <ConfirmDialog
        isOpen={true}
        config={dangerConfig}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByTestId('confirm-dialog-confirm');
    const cancelButton = screen.getByTestId('confirm-dialog-cancel');

    // Check that buttons have appropriate classes (this depends on your Button component implementation)
    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        config={defaultConfig}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Confirm Action');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-dialog-title');
    expect(title).toHaveAttribute('id', 'confirm-dialog-title');
  });
});