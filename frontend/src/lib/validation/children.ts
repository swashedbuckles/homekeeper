import { Children, isValidElement } from 'react';
import { Action, type ActionProps } from '../../components/common/Action';
import { Button, type ButtonProps } from '../../components/common/Button';
import type { ReactNode, ReactElement } from 'react';

// TypeScript types for allowed action children
export type ActionElement = ReactElement<ActionProps, typeof Action>;
export type ButtonElement = ReactElement<ButtonProps, typeof Button>;
export type AllowedActionChild = ActionElement | ButtonElement;
export type AllowedActionChildren = AllowedActionChild | AllowedActionChild[];

/**
 * Validates that children are only Action or Button components.
 * Provides helpful console warnings for invalid children while gracefully filtering them out.
 * 
 * @param children - React children to validate
 * @param componentName - Name of the parent component for error messages
 * @returns Array of validated Action/Button elements
 * 
 * @example
 * ```tsx
 * const validActions = validateActionChildren(children, 'TaskCard');
 * ```
 */
export const validateActionChildren = (children: ReactNode, componentName: string): AllowedActionChild[] => {
  return Children.toArray(children).filter((child): child is AllowedActionChild => {
    if (!isValidElement(child)) {
      console.warn(`${componentName}: Non-element child found, skipping`);
      return false;
    }
    
    const isValidChild = child.type === Action || child.type === Button;
    if (!isValidChild) {
      const childName = typeof child.type === 'string' 
        ? child.type 
        : (child.type as any)?.displayName || (child.type as any)?.name || 'Unknown';
        
      console.warn(
        `${componentName}: Invalid child component <${childName}>. ` +
        'Only <Action> and <Button> components are allowed as children.'
      );
    }
    
    return isValidChild;
  });
};