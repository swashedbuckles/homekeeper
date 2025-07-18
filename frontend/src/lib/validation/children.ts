import { Children, isValidElement } from 'react';
import { Action, type ActionProps } from '../../components/common/Action';
import { Button, type ButtonProps } from '../../components/common/Button';
import { NavItem, type NavItemProps } from '../../components/headers/NavItem';
import type { ReactNode, ReactElement, ComponentType } from 'react';

// TypeScript types for allowed action children
export type ActionElement = ReactElement<ActionProps, typeof Action>;
export type ButtonElement = ReactElement<ButtonProps, typeof Button>;
export type AllowedActionChild = ActionElement | ButtonElement;
export type AllowedActionChildren = AllowedActionChild | AllowedActionChild[];

// TypeScript types for allowed navigation children
export type NavItemElement = ReactElement<NavItemProps, typeof NavItem>;
export type AllowedNavChild = NavItemElement;
export type AllowedNavChildren = AllowedNavChild | AllowedNavChild[];

/**
 * Type-safe utility to get a component's display name for error messages
 * 
 * @param componentType - The React component type
 * @returns A string representation of the component name
 * 
 * @public
 */
export function getComponentName(componentType: string | ComponentType): string {
  if (typeof componentType === 'string') {
    return componentType;
  }
  
  // Check for displayName first (commonly set on forwardRef components)
  if ('displayName' in componentType && typeof componentType.displayName === 'string') {
    return componentType.displayName;
  }
  
  // Check for function name
  if ('name' in componentType && typeof componentType.name === 'string') {
    return componentType.name;
  }
  
  return 'Unknown';
}

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
      const childName = getComponentName(child.type);
        
      console.warn(
        `${componentName}: Invalid child component <${childName}>. ` +
        'Only <Action> and <Button> components are allowed as children.'
      );
    }
    
    return isValidChild;
  });
};

/**
 * Validates that children are only NavItem components.
 * Provides helpful console warnings for invalid children while gracefully filtering them out.
 * 
 * @param children - React children to validate
 * @param componentName - Name of the parent component for error messages
 * @returns Array of validated NavItem elements
 * 
 * @example
 * ```tsx
 * const validNavItems = validateNavChildren(children, 'AppNavigation');
 * ```
 */
export const validateNavChildren = (children: ReactNode, componentName: string): AllowedNavChild[] => {
  return Children.toArray(children).filter((child): child is AllowedNavChild => {
    if (!isValidElement(child)) {
      console.warn(`${componentName}: Non-element child found, skipping`);
      return false;
    }
    
    const isValidChild = child.type === NavItem;
    if (!isValidChild) {
      const childName = getComponentName(child.type);
        
      console.warn(
        `${componentName}: Invalid child component <${childName}>. ` +
        'Only <NavItem> components are allowed as children.'
      );
    }
    
    return isValidChild;
  });
};