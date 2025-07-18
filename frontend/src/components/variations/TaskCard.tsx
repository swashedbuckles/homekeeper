import { getResponsiveTextToken } from '../../lib/design-system/sizes';
import { validateActionChildren, type AllowedActionChildren } from '../../lib/validation/children';
import { Card, type CardProps } from '../common/Card';

/**
 * TaskCard component for displaying maintenance tasks with action buttons.
 * 
 * Built on top of the base Card component. Shows task details with colored left borders
 * indicating urgency, due dates, and action buttons via composition. Uses Action and Button
 * child components for maximum flexibility while maintaining type safety.
 * 
 * @example Basic usage with Action components
 * ```tsx
 * <TaskCard
 *   title="Change HVAC Filter"
 *   subtitle="Central Air System • Living Room"
 *   status="urgent"
 *   dueDate="Due Tomorrow"
 *   shadow="double"
 *   hover
 *   hoverEffect="lift"
 * >
 *   <Action variant="danger" onClick={() => markComplete(taskId)}>
 *     Mark Complete
 *   </Action>
 *   <Action variant="outline" onClick={() => reschedule(taskId)}>
 *     Reschedule
 *   </Action>
 * </TaskCard>
 * ```
 * 
 * @example Mixed Action and Button usage
 * ```tsx
 * <TaskCard title="Pool Maintenance" subtitle="Chemical check" status="normal" dueDate="Due in 3 days">
 *   <Action variant="secondary" onClick={handleComplete}>Complete</Action>
 *   <Button variant="outline" size="sm" onClick={handleAddPhotos}>
 *     <CameraIcon className="w-4 h-4 mr-2" />
 *     Add Photos
 *   </Button>
 * </TaskCard>
 * ```
 */
export interface TaskCardProps extends Omit<CardProps, 'children'> {
  title: string;
  subtitle: string;
  status: 'urgent' | 'normal' | 'future' | 'completed';
  dueDate: string;
  children?: AllowedActionChildren; // ← TypeScript validation for Action/Button children only
}

export const TaskCard = ({
  title,
  subtitle, 
  status,
  dueDate,
  children,
  className = '',
  ...cardProps
}: TaskCardProps) => {
  // Validate and extract action children
  const validatedActions = validateActionChildren(children, 'TaskCard');
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
      <h3 className={`${getResponsiveTextToken('lg')} font-black uppercase mb-3 text-text-primary`}>
        {title}
      </h3>
      <p className={`${getResponsiveTextToken('sm')} font-bold text-text-secondary uppercase mb-3`}>
        {subtitle}
      </p>
      <p className={`${getResponsiveTextToken('md')} font-bold ${config.textColor} uppercase mb-4`}>
        {dueDate}
      </p>
      
      {/* Render validated action children */}
      {validatedActions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {validatedActions}
        </div>
      )}
    </Card>
  );
};

// Add displayName for better debugging
TaskCard.displayName = 'TaskCard';