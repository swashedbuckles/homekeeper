import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ConfirmationProvider } from '../../src/context/ConfirmationProvider';
import { useConfirmation } from '../../src/hooks/useConfirmation';

// Test component that uses the hook
function TestComponent({ resultTestId = 'confirmation-result' }: { resultTestId?: string }) {
  const confirm = useConfirmation();

  const handleConfirm = async () => {
    const result = await confirm({
      title: 'Test Title',
      message: 'Test message',
      confirmText: 'Yes',
      cancelText: 'No',
      variant: 'danger'
    });
    
    // Add result to DOM for testing
    const resultDiv = document.createElement('div');
    resultDiv.textContent = `Result: ${result}`;
    resultDiv.setAttribute('data-testid', resultTestId);
    document.body.appendChild(resultDiv);
  };

  return (
    <button onClick={handleConfirm} data-testid="trigger-confirmation">
      Trigger Confirmation
    </button>
  );
}


describe('useConfirmation', () => {
  beforeEach(() => {
    // Clean up any existing result divs
    document.querySelectorAll('[data-testid*="result"]').forEach(el => el.remove());
  });

  const renderWithProvider = (children: React.ReactNode) => {
    return render(
      <ConfirmationProvider>
        {children}
      </ConfirmationProvider>
    );
  };

  it('throws error when used outside of ConfirmationProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useConfirmation());
    }).toThrow('useConfirmation must be used within a ConfirmationProvider');
    
    consoleErrorSpy.mockRestore();
  });

  it('returns confirmation function that shows dialog', async () => {
    renderWithProvider(<TestComponent />);
    
    // Dialog should not be visible initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Trigger confirmation
    fireEvent.click(screen.getByTestId('trigger-confirmation'));
    
    // Dialog should appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Check dialog content
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-dialog-confirm')).toHaveTextContent('Yes');
    expect(screen.getByTestId('confirm-dialog-cancel')).toHaveTextContent('No');
  });

  it('resolves promise with true when confirmed', async () => {
    renderWithProvider(<TestComponent resultTestId="confirm-result" />);
    
    // Trigger confirmation
    fireEvent.click(screen.getByTestId('trigger-confirmation'));
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Click confirm button
    fireEvent.click(screen.getByTestId('confirm-dialog-confirm'));
    
    // Wait for result to be added to DOM
    await waitFor(() => {
      expect(screen.getByTestId('confirm-result')).toHaveTextContent('Result: true');
    });
    
    // Dialog should be hidden
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('resolves promise with false when cancelled', async () => {
    renderWithProvider(<TestComponent resultTestId="cancel-result" />);
    
    // Trigger confirmation
    fireEvent.click(screen.getByTestId('trigger-confirmation'));
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Click cancel button
    fireEvent.click(screen.getByTestId('confirm-dialog-cancel'));
    
    // Wait for result to be added to DOM
    await waitFor(() => {
      expect(screen.getByTestId('cancel-result')).toHaveTextContent('Result: false');
    });
    
    // Dialog should be hidden
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('resolves promise with false when escape key is pressed', async () => {
    renderWithProvider(<TestComponent resultTestId="escape-result" />);
    
    // Trigger confirmation
    fireEvent.click(screen.getByTestId('trigger-confirmation'));
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Press escape key on the dialog element itself
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    
    // Wait for result to be added to DOM
    await waitFor(() => {
      expect(screen.getByTestId('escape-result')).toHaveTextContent('Result: false');
    });
    
    // Dialog should be hidden
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('resolves promise with true when enter key is pressed', async () => {
    renderWithProvider(<TestComponent resultTestId="enter-result" />);
    
    // Trigger confirmation
    fireEvent.click(screen.getByTestId('trigger-confirmation'));
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Press enter key
    fireEvent.keyDown(document, { key: 'Enter' });
    
    // Wait for result to be added to DOM
    await waitFor(() => {
      expect(screen.getByTestId('enter-result')).toHaveTextContent('Result: true');
    });
    
    // Dialog should be hidden
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});