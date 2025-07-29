import { getHoverEffectClasses } from '../../lib/design-system/hover-effects';
import { validateActionChildren, type AllowedActionChildren } from '../../lib/validation/children';

/**
 * ListItem Component.
 * 
 * Displays a horizontal list item with optional subtitle and action buttons via composition.
 * Features thick borders, bold typography, and optional status indicators. Uses Action and Button
 * child components for maximum flexibility while maintaining type safety.
 * Perfect for lists like invitations, settings, notifications, and admin tasks.
 * 
 * @example Basic list item with single action
 * ```tsx
 * <ListItem 
 *   title="Review House Rules"
 *   subtitle="Last updated 2 days ago"
 * >
 *   <Action variant="primary" onClick={handleEdit}>Edit</Action>
 * </ListItem>
 * ```
 * 
 * @example List item with multiple actions
 * ```tsx
 * <ListItem 
 *   title="Complete Monthly Budget"
 *   subtitle="Due in 3 days"
 *   status="urgent"
 * >
 *   <Action variant="danger" onClick={handleComplete}>Complete Now</Action>
 *   <Action variant="outline" onClick={handlePostpone}>Postpone</Action>
 * </ListItem>
 * ```
 * 
 * @example Mixed Action and Button usage
 * ```tsx
 * <ListItem title="Document Review" subtitle="Needs approval">
 *   <Action variant="primary" onClick={handleApprove}>Approve</Action>
 *   <Button variant="outline" size="sm" onClick={handleComment}>
 *     <MessageIcon className="w-4 h-4 mr-2" />
 *     Comment
 *   </Button>
 * </ListItem>
 * ```
 */
export interface SimpleListItemProps {
  title: string;
  subtitle?: string;
  children?: AllowedActionChildren; // ← TypeScript validation for Action/Button children only
  status?: 'default' | 'urgent' | 'completed' | 'info';
  hover?: boolean;
  onClick?: () => void;
  className?: string;
  testId?: string;
}

export const SimpleListItem = ({
  title,
  subtitle,
  children,
  status = 'default',
  hover = false,
  onClick,
  className = '',
  testId = 'list-item'
}: SimpleListItemProps) => {
  // Validate and extract action children
  const validatedActions = validateActionChildren(children, 'ListItem');
  const isClickable = onClick || hover;

  // Base styles with brutal design
  const baseStyles = [
    'flex', 'items-center', 'justify-between',
    'p-6',
    'bg-white',
    'border-brutal-lg', 'border-text-primary',
    'font-mono'
  ];

  // Status-based left border colors
  const statusStyles = {
    default: '',
    urgent: 'border-l-brutal-xl border-l-error',
    completed: 'border-l-brutal-xl border-l-accent',
    info: 'border-l-brutal-xl border-l-secondary'
  };

  // Interactive styles
  const interactiveStyles = isClickable ? [
    'cursor-pointer',
    ...getHoverEffectClasses('lift')
  ] : [];

  const itemStyles = [
    ...baseStyles,
    statusStyles[status],
    ...interactiveStyles,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={itemStyles}
      onClick={onClick}
      data-testid={testId}
    >
      <div className="flex-1">
        <div className="font-bold text-xl text-text-primary uppercase tracking-wide mb-2">
          {title}
        </div>
        {subtitle && (
          <div className="text-text-secondary text-sm font-bold uppercase tracking-wide">
            {subtitle}
          </div>
        )}
      </div>

      {validatedActions.length > 0 && (
        <div className="ml-6 flex-shrink-0 flex gap-2">
          {validatedActions}
        </div>
      )}
    </div>
  );
};

// Add displayName for better debugging
SimpleListItem.displayName = 'ListItem';