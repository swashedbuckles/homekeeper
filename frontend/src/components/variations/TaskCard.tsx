import { Button } from '../common/Button';
import { Card, type CardProps } from '../common/Card';

/**
 * TaskCard component for displaying maintenance tasks with status indicators.
 * 
 * Built on top of the base Card component. Shows task details with colored left borders
 * indicating urgency, due dates, and optional action buttons. Delegates all styling
 * to Card component and focuses on content structure and status semantics.
 * 
 * @example
 * ```tsx
 * // Urgent task with custom styling
 * <TaskCard
 *   title="Change HVAC Filter"
 *   subtitle="Central Air System • Living Room"
 *   status="urgent"
 *   dueDate="Due in 2 Days"
 *   onAction={() => markComplete(taskId)}
 *   actionLabel="Mark Done"
 *   shadow="double"
 *   hover
 *   hoverEffect="lift"
 * />
 * ```
 */
export interface TaskCardProps extends Omit<CardProps, 'children'> {
  title :       string;
  subtitle :    string;
  status :      'urgent' | 'normal' | 'future' | 'completed';
  dueDate :     string;
  actions?:     Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'danger' | 'accent';
  }>;
}

export const TaskCard = ({
  title,
  subtitle, 
  status,
  dueDate,
  actions,
  className = '',
  ...cardProps
}: TaskCardProps) => {
  // Status-specific content styling (semantic, not layout)
  const statusConfig = {
    urgent: {
      borderColor:   'border-l-error border-l-brutal-xl',
      textColor:     'text-error',
      buttonVariant: 'danger' as const
    },
    normal: {
      borderColor:   'border-l-secondary border-l-brutal-xl',
      textColor:     'text-secondary',
      buttonVariant: 'secondary' as const
    },
    future: {
      borderColor:   'border-l-accent border-l-brutal-xl',
      textColor:     'text-accent',
      buttonVariant: 'accent' as const
    },
    completed: {
      borderColor:   'border-l-accent border-l-brutal-xl',
      textColor:     'text-accent',
      buttonVariant: 'accent' as const
    }
  };

  const config = statusConfig[status];

  return (
    <Card
      variant="default"
      className={`${config.borderColor} ${className}`}
      {...cardProps}
    >
      <h3 className="text-xl font-black uppercase mb-3 text-text-primary">
        {title}
      </h3>
      <p className="text-sm font-bold text-text-secondary uppercase mb-3">
        {subtitle}
      </p>
      <p className={`text-lg font-bold ${config.textColor} uppercase mb-4`}>
        {dueDate}
      </p>
      
      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {actions.map((action, index) => (
            <Button
              key={`${action.label}-${index}`}
              variant={action.variant || (index === 0 ? config.buttonVariant : 'outline')}
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};