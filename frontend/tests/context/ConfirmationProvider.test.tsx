import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ConfirmationProvider } from '../../src/context/ConfirmationProvider';
import { useConfirmation } from '../../src/hooks/useConfirmation';

// Test component that triggers multiple confirmations
function MultipleConfirmationsComponent() {
  const confirm = useConfirmation();

  const handleFirstConfirmation = async () => {
    const result = await confirm({
      title: 'First Confirmation',
      message: 'First message'
    });
    
    const resultDiv = document.createElement('div');
    resultDiv.textContent = `First: ${result}`;
    resultDiv.setAttribute('data-testid', 'first-result');
    document.body.appendChild(resultDiv);
  };

  const handleSecondConfirmation = async () => {
    const result = await confirm({
      title: 'Second Confirmation', 
      message: 'Second message'
    });
    
    const resultDiv = document.createElement('div');
    resultDiv.textContent = `Second: ${result}`;
    resultDiv.setAttribute('data-testid', 'second-result');
    document.body.appendChild(resultDiv);
  };

  return (
    <div>
      <button onClick={handleFirstConfirmation} data-testid="first-trigger">
        First Confirmation
      </button>
      <button onClick={handleSecondConfirmation} data-testid="second-trigger">
        Second Confirmation
      </button>
    </div>
  );
}

describe('ConfirmationProvider', () => {
  it('provides confirmation context to child components', async () => {
    render(
      <ConfirmationProvider>
        <MultipleConfirmationsComponent />
      </ConfirmationProvider>
    );

    // Should be able to trigger confirmation without errors
    fireEvent.click(screen.getByTestId('first-trigger'));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveTextContent('First Confirmation');
    });
  });

  it('handles multiple sequential confirmations correctly', async () => {
    render(
      <ConfirmationProvider>
        <MultipleConfirmationsComponent />
      </ConfirmationProvider>
    );

    // Trigger first confirmation
    fireEvent.click(screen.getByTestId('first-trigger'));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toHaveTextContent('First Confirmation');
    });

    // Confirm first dialog
    fireEvent.click(screen.getByTestId('confirm-dialog-confirm'));
    
    await waitFor(() => {
      expect(screen.getByTestId('first-result')).toHaveTextContent('First: true');
    });

    // Dialog should be hidden
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Trigger second confirmation
    fireEvent.click(screen.getByTestId('second-trigger'));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toHaveTextContent('Second Confirmation');
    });

    // Cancel second dialog
    fireEvent.click(screen.getByTestId('confirm-dialog-cancel'));
    
    await waitFor(() => {
      expect(screen.getByTestId('second-result')).toHaveTextContent('Second: false');
    });

    // Dialog should be hidden
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('properly cleans up state when dialog is closed', async () => {
    render(
      <ConfirmationProvider>
        <MultipleConfirmationsComponent />
      </ConfirmationProvider>
    );

    // Trigger confirmation
    fireEvent.click(screen.getByTestId('first-trigger'));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close dialog with escape - fire on the dialog element itself
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Trigger new confirmation - should work fine
    fireEvent.click(screen.getByTestId('second-trigger'));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveTextContent('Second Confirmation');
    });
  });

  it('renders only one dialog at a time', async () => {
    render(
      <ConfirmationProvider>
        <MultipleConfirmationsComponent />
      </ConfirmationProvider>
    );

    // Trigger first confirmation
    fireEvent.click(screen.getByTestId('first-trigger'));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Should only have one dialog
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getByRole('dialog')).toHaveTextContent('First Confirmation');
  });

  it('preserves confirmation state during dialog interaction', async () => {
    render(
      <ConfirmationProvider>
        <MultipleConfirmationsComponent />
      </ConfirmationProvider>
    );

    // Trigger confirmation
    fireEvent.click(screen.getByTestId('first-trigger'));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveTextContent('First Confirmation');
      expect(screen.getByRole('dialog')).toHaveTextContent('First message');
    });

    // Content should remain stable
    expect(screen.getByRole('dialog')).toHaveTextContent('First Confirmation');
    expect(screen.getByRole('dialog')).toHaveTextContent('First message');
  });
});