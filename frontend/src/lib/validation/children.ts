import { Children, isValidElement } from 'react';
import { Action, type ActionProps } from '../../components/common/Action';
import { Button, type ButtonProps } from '../../components/common/Button';
import { Step, type StepProps} from '../../components/common/Steps';
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

export type StepElement = ReactElement<StepProps, typeof Step>;
export type AllowedStepsChild = StepElement;
export type AllowedStepsChildren = AllowedStepsChild | AllowedStepsChild[];

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
 * Generic children validator that filters and validates React children against allowed component types.
 * Provides helpful console warnings for invalid children while gracefully filtering them out.
 * 
 * @param children - React children to validate
 * @param componentName - Name of the parent component for error messages
 * @param allowedTypes - Array of allowed component types
 * @param allowedTypeNames - Human-readable names for error messages
 * @param transform - Optional transform function to convert elements to different format
 * @returns Array of validated elements (or transformed data if transform provided)
 */
function validateChildren<T extends ReactElement, P, R = T>(
  children: ReactNode,
  componentName: string,
  allowedTypes: ComponentType<P>[],
  allowedTypeNames: string[],
  transform?: (element: T) => R
): R[] {
  return Children.toArray(children)
    .filter((child): child is T => {
      if (!isValidElement(child)) {
        console.warn(`${componentName}: Non-element child found, skipping`);
        return false;
      }
      
      const isValidChild = allowedTypes.includes(child.type as ComponentType<P>);
      if (!isValidChild) {
        const childName = getComponentName(child.type);
        const typeList = allowedTypeNames.length === 1 
          ? `<${allowedTypeNames[0]}>`
          : allowedTypeNames.slice(0, -1).map(name => `<${name}>`).join(', ') + ` and <${allowedTypeNames[allowedTypeNames.length - 1]}>`;
          
        console.warn(
          `${componentName}: Invalid child component <${childName}>. ` +
          `Only ${typeList} components are allowed as children.`
        );
      }
      
      return isValidChild;
    })
    .map(child => transform ? transform(child) : (child as unknown as R));
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
  return validateChildren(
    children,
    componentName,
    [Action as ComponentType<ActionProps>, Button as ComponentType<ButtonProps>],
    ['Action', 'Button']
  ) as AllowedActionChild[];
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
  return validateChildren(
    children,
    componentName,
    [NavItem as ComponentType<NavItemProps>],
    ['NavItem']
  ) as AllowedNavChild[];
};

/**
 * Validates that children are only Step components.
 * Provides helpful console warnings for invalid children while gracefully filtering them out.
 * 
 * @param children - React children to validate
 * @param componentName - Name of the parent component for error messages
 * @returns Array of validated Step elements
 * 
 * @example
 * ```tsx
 * const validSteps = validateStepsChildren(children, 'Steps');
 * ```
 */
export const validateStepsChildren = (children: ReactNode, componentName: string): AllowedStepsChild[] => {
  return validateChildren(
    children,
    componentName,
    [Step as ComponentType<StepProps>],
    ['Step']
  ) as AllowedStepsChild[];
};