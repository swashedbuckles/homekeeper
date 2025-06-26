import { Button } from '../common/Button';
import { Card } from '../common/Card';

/**
 * TaskCard component for displaying maintenance tasks with status indicators.
 * 
 * Built on top of the base Card component. Shows task details with colored left borders
 * indicating urgency, due dates, and optional action buttons. Perfect for dashboard
 * task lists and maintenance workflows.
 * 
 * @example
 * ```tsx
 * // Urgent task with action button
 * <TaskCard
 *   title="Change HVAC Filter"
 *   subtitle="Central Air System • Living Room"
 *   status="urgent"
 *   dueDate="Due in 2 Days"
 *   onAction={() => markComplete(taskId)}
 *   actionLabel="Mark Done"
 * />
 * 
 * // Future task without action
 * <TaskCard
 *   title="Pool Opening Checklist"
 *   subtitle="Above Ground Pool • Backyard"
 *   status="future"
 *   dueDate="Due in 3 Weeks"
 * />
 * ```
 */
export interface TaskCardProps {
  title :       string;
  subtitle :    string;
  status :      'urgent' | 'normal' | 'future' | 'completed';
  dueDate :     string;
  onAction?:    () => void;
  actionLabel?: string;
  className?:   string;
}

export const TaskCard = ({
  title,
  subtitle, 
  status,
  dueDate,
  onAction,
  actionLabel = 'View',
  className = ''
}: TaskCardProps) => {
  const statusConfig = {
    urgent: {
      borderColor:   'border-l-error border-l-brutal-xl',
      shadow:        'error' as const,
      textColor:     'text-error',
      buttonVariant: 'danger' as const
    },
    normal: {
      borderColor:   'border-l-secondary border-l-brutal-xl',
      shadow:        'secondary' as const,
      textColor:     'text-secondary',
      buttonVariant: 'secondary' as const
    },
    future: {
      borderColor:   'border-l-accent border-l-brutal-xl',
      shadow:        'accent' as const,
      textColor:     'text-accent',
      buttonVariant: 'accent' as const
    },
    completed: {
      borderColor:   'border-l-accent border-l-brutal-xl',
      shadow:        'accent' as const,
      textColor:     'text-accent',
      buttonVariant: 'accent' as const
    }
  };

  const config = statusConfig[status];

  return (
    <Card
      variant="default"
      shadow={config.shadow}
      className={`${config.borderColor} mb-6 ${className}`}
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
      
      {onAction && (
        <Button
          variant={
            config.buttonVariant === 'danger' ? 'danger' :
            config.buttonVariant === 'secondary' ? 'secondary' : 
            'primary'
          }
          size="small"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};