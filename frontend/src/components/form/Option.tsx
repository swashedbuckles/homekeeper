import type { ReactNode } from 'react';

/**
 * Props for Option component used within Select
 * 
 * @public
 */
export interface OptionProps {
  /** The value to be submitted when this option is selected */
  value: string;
  /** Content to display for this option */
  children: ReactNode;
  /** Whether this option is disabled */
  disabled?: boolean;
}

/**
 * Option component for use within Select components.
 * Represents a single selectable choice in a dropdown menu.
 * 
 * @param props - OptionProps
 * @returns React fragment containing the option content
 * 
 * @example Basic option
 * ```tsx
 * <Option value="us">United States</Option>
 * ```
 * 
 * @example Disabled option
 * ```tsx
 * <Option value="restricted" disabled>Restricted Option</Option>
 * ```
 * 
 * @public
 */
export const Option: React.FC<OptionProps> = ({ children }) => {
  return <>{children}</>;
};

// Add displayName for better debugging
Option.displayName = 'Option';