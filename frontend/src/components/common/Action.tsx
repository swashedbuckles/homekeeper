import { Button, type ButtonProps } from './Button';
import type { ReactNode } from 'react';

/**
 * Action component - A lightweight wrapper around Button with smart defaults.
 * 
 * Designed for use within action containers like TaskCard and ListItem.
 * Automatically applies size="sm" and provides semantic meaning for action buttons.
 * Can be used alongside Button components for complex actions that need full control.
 * 
 * @example Simple action
 * ```tsx
 * <Action variant="primary" onClick={handleSave}>
 *   Save Changes
 * </Action>
 * ```
 * 
 * @example Action with custom size override
 * ```tsx
 * <Action variant="danger" size="md" onClick={handleDelete}>
 *   Delete Item
 * </Action>
 * ```
 * 
 * @example Used within TaskCard
 * ```tsx
 * <TaskCard title="Maintenance Task" status="urgent" dueDate="Due Tomorrow">
 *   <Action variant="danger" onClick={handleComplete}>Complete</Action>
 *   <Action variant="outline" onClick={handleReschedule}>Reschedule</Action>
 * </TaskCard>
 * ```
 */
export interface ActionProps extends Omit<ButtonProps, 'size'> {
  /** Button content */
  children: ReactNode;
  /** Size override - defaults to 'sm' for action contexts */
  size?: ButtonProps['size'];
}

/**
 * Action component implementation
 */
export const Action: React.FC<ActionProps> = ({ 
  size = 'sm', 
  children, 
  ...buttonProps 
}) => {
  return (
    <Button size={size} {...buttonProps}>
      {children}
    </Button>
  );
};

// Add displayName for better debugging and validation
Action.displayName = 'Action';