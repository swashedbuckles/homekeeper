import { Children, isValidElement } from 'react';
import type { ReactNode, ReactElement, ComponentType } from 'react';

/**
 * Utility functions for working with compound components.
 * 
 * These helpers allow compound components to extract specific child component types
 * from their children prop, enabling the compound component pattern where parent
 * components can conditionally render sections based on which child components are provided.
 * 
 * @example
 * ```tsx
 * // In a compound component:
 * const avatar = findChildOfType(children, MyComponent.Avatar);
 * const badges = findChildrenOfType(children, MyComponent.Badge);
 * 
 * return (
 *   <div>
 *     {avatar && <div className="avatar-section">{avatar}</div>}
 *     {badges.length > 0 && <div className="badges">{badges}</div>}
 *   </div>
 * );
 * ```
 */

/**
 * Find all children of a specific compound component type.
 * 
 * Searches through React children and returns an array of all elements
 * that match the specified component type. Useful for compound components
 * that support multiple instances of a child component (like badges).
 * 
 * @param children - React children to search through
 * @param targetType - The component type to find
 * @param _componentName - Name for error reporting (currently unused but kept for API consistency)
 * @returns Array of matching child elements
 * 
 * @example
 * ```tsx
 * const badges = findChildrenOfType(children, Badge as ComponentType, 'MyComponent');
 * // Returns all Badge components found in children
 * ```
 */
export function findChildrenOfType<T extends ReactElement>(
  children: ReactNode,
  targetType: ComponentType,
  _componentName?: string
): T[] {
  return Children.toArray(children)
    .filter((child): child is T => {
      if (!isValidElement(child)) {
        return false;
      }
      return child.type === targetType;
    });
}

/**
 * Find the first child of a specific compound component type.
 * 
 * Searches through React children and returns the first element that matches
 * the specified component type, or null if none found. Useful for compound
 * components that support only one instance of a child component (like avatars).
 * 
 * @param children - React children to search through
 * @param targetType - The component type to find
 * @param componentName - Name for error reporting (passed to findChildrenOfType)
 * @returns First matching child element or null
 * 
 * @example
 * ```tsx
 * const avatar = findChildOfType(children, Avatar as ComponentType, 'MyComponent');
 * // Returns the first Avatar component found, or null
 * ```
 */
export function findChildOfType<T extends ReactElement>(
  children: ReactNode,
  targetType: ComponentType,
  componentName?: string
): T | null {
  const found = findChildrenOfType<T>(children, targetType, componentName);
  return found[0] || null;
}

/**
 * Find all children that are NOT specific compound component types.
 * 
 * Searches through React children and returns all elements that do NOT match
 * any of the specified component types. Useful for compound components that
 * want to render "other content" separately from their compound components.
 * 
 * @param children - React children to search through
 * @param excludeTypes - Array of component types to exclude
 * @returns Array of non-compound children (can include text nodes, other components, etc.)
 * 
 * @example
 * ```tsx
 * const otherContent = findNonCompoundChildren(children, [Avatar, Badge]);
 * // Returns all children that are not Avatar or Badge components
 * ```
 */
export function findNonCompoundChildren(
  children: ReactNode,
  excludeTypes: ComponentType[]
): ReactNode[] {
  return Children.toArray(children)
    .filter((child) => {
      if (!isValidElement(child)) {
        return true; // Keep text nodes, numbers, etc.
      }
      return !excludeTypes.includes(child.type as ComponentType);
    });
}