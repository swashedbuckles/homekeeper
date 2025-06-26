import type { ReactNode } from 'react';

/**
 * ActionItem Component.
 * 
 * Displays a task or action item with optional subtitle and action buttons.
 * Features thick borders, bold typography, and optional status indicators.
 * 
 * @example
 * ```tsx
 * // Basic action item
 * <ActionItem 
 *   title="Review House Rules"
 *   subtitle="Last updated 2 days ago"
 *   actions={<Button variant="primary" size="small">Edit</Button>}
 * />
 * 
 * // Action item with status
 * <ActionItem 
 *   title="Complete Monthly Budget"
 *   subtitle="Due in 3 days"
 *   status="urgent"
 *   actions={<Button variant="danger">Complete Now</Button>}
 * />
 * ```
 */
export interface ActionItemProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  status?: 'default' | 'urgent' | 'completed' | 'info';
  hover?: boolean;
  onClick?: () => void;
  className?: string;
  testId?: string;
}

export const ActionItem = ({
  title,
  subtitle,
  actions,
  status = 'default',
  hover = false,
  onClick,
  className = '',
  testId = 'action-item'
}: ActionItemProps) => {
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
    'brutal-transition',
    'brutal-hover-lift'
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

      {actions && (
        <div className="ml-6 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};