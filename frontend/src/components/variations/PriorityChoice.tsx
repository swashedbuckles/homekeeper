import { Button } from '../common/Button';
import { ChoiceCore, type ChoiceCoreProps, type OptionRenderProps } from '../common/ChoiceCore';

// Props for PriorityChoice are the same as ChoiceCore except renderOption is provided
export interface PriorityChoiceProps extends Omit<ChoiceCoreProps, 'renderOption'> {}

/**
 * Get Button variant based on priority level and selection state
 */
const getPriorityVariant = (priorityValue: string, isSelected: boolean): 'accent' | 'primary' | 'danger' | 'tertiary' => {
  if (!isSelected) {
    return 'tertiary';
  }
  
  switch (priorityValue.toLowerCase()) {
    case 'low':
      return 'accent';   // Green for low priority
    case 'medium':
      return 'primary';  // Orange for medium priority  
    case 'high':
      return 'danger';   // Red for high priority
    default:
      return 'accent';   // Default to green
  }
};

/**
 * Priority renderer for choice options with color-coded styling based on priority level
 */
const priorityOptionRenderer = ({ option, isSelected, isDisabled, onClick }: OptionRenderProps) => {
  const variant = getPriorityVariant(option.value, isSelected);
  
  return (
    <Button
      variant={variant}
      size="sm"
      disabled={isDisabled}
      onClick={onClick}
      type="button"
    >
      {option.label}
    </Button>
  );
};

/**
 * Priority Choice component with color-coded styling for priority levels.
 * 
 * This component is designed for priority selection where each priority level
 * gets a different color when selected:
 * - Low: Green (accent)
 * - Medium: Orange (primary) 
 * - High: Red (danger)
 * - Unselected: White (tertiary)
 * 
 * Perfect for task priority, issue severity, or any importance-based selection.
 * 
 * @example Basic priority selection
 * ```tsx
 * <PriorityChoice name="priority" value={priority} onChange={setPriority}>
 *   <Option value="low">Low</Option>
 *   <Option value="medium">Medium</Option>
 *   <Option value="high">High</Option>
 * </PriorityChoice>
 * ```
 * 
 * @example With custom priority levels
 * ```tsx
 * <PriorityChoice name="severity" label="Issue Severity" value={severity} onChange={setSeverity}>
 *   <Option value="low">Minor</Option>
 *   <Option value="medium">Major</Option>
 *   <Option value="high">Critical</Option>
 * </PriorityChoice>
 * ```
 * 
 * @example Multiple priority selection (for filtering)
 * ```tsx
 * <PriorityChoice 
 *   name="priorityFilters" 
 *   multiple 
 *   label="Show Priority Levels"
 *   value={filters} 
 *   onChange={setFilters}
 * >
 *   <Option value="low">Low Priority</Option>
 *   <Option value="medium">Medium Priority</Option>
 *   <Option value="high">High Priority</Option>
 * </PriorityChoice>
 * ```
 * 
 * @example With error handling
 * ```tsx
 * <PriorityChoice 
 *   name="taskPriority" 
 *   label="Task Priority"
 *   error={errors.priority?.message}
 *   value={priority} 
 *   onChange={setPriority}
 * >
 *   <Option value="low">Low</Option>
 *   <Option value="medium">Medium</Option>
 *   <Option value="high">High</Option>
 * </PriorityChoice>
 * ```
 */
export const PriorityChoice = (props: PriorityChoiceProps) => (
  <ChoiceCore {...props} renderOption={priorityOptionRenderer} />
);