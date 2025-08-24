import { createContext } from 'react';

/**
 * Configuration for a confirmation dialog
 */
export interface ConfirmationConfig {
  /** Title displayed at the top of the dialog */
  title: string;
  /** Main message/question to display */
  message: string;
  /** Text for the confirm button (default: "Confirm") */
  confirmText?: string;
  /** Text for the cancel button (default: "Cancel") */
  cancelText?: string;
  /** Visual variant for styling (affects button colors) */
  variant?: 'primary' | 'danger' | 'secondary';
}

/**
 * Public API for the confirmation service
 */
export interface ConfirmationContextValue {
  /** Show a confirmation dialog and return a promise that resolves with the user's choice */
  showConfirmation: (config: ConfirmationConfig) => Promise<boolean>;
}

/**
 * Context for accessing the confirmation service
 */
export const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);