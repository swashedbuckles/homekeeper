import { useState, type ReactNode } from 'react';
import { ConfirmDialog } from '../components/variations/ConfirmDialog';
import { ConfirmationContext, type ConfirmationConfig } from './confirmationContexts';

export interface ConfirmationProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages global confirmation dialog state.
 * 
 * This component should be placed at the root of your application to enable
 * the useConfirmation hook to work from any component in the tree.
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ConfirmationProvider>
 *       <YourAppComponents />
 *     </ConfirmationProvider>
 *   );
 * }
 * ```
 */
export const ConfirmationProvider = ({ children }: ConfirmationProviderProps) => {
  // Private state - not exposed through context
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmationConfig | null>(null);
  const [resolve, setResolve] = useState<((value: boolean) => void) | null>(null);

  /**
   * Shows a confirmation dialog and returns a promise that resolves with the user's choice
   */
  const showConfirmation = (dialogConfig: ConfirmationConfig): Promise<boolean> => {
    return new Promise<boolean>((promiseResolve) => {
      setConfig(dialogConfig);
      setResolve(() => promiseResolve);
      setIsOpen(true);
    });
  };

  /**
   * Handles when the user confirms the dialog
   */
  const handleConfirm = () => {
    resolve?.(true);
    hideDialog();
  };

  /**
   * Handles when the user cancels the dialog
   */
  const handleCancel = () => {
    resolve?.(false);
    hideDialog();
  };

  /**
   * Hides the dialog and cleans up state
   */
  const hideDialog = () => {
    setIsOpen(false);
    setConfig(null);
    setResolve(null);
  };

  const contextValue = {
    showConfirmation,
  };

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        isOpen={isOpen}
        config={config}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationContext.Provider>
  );
};