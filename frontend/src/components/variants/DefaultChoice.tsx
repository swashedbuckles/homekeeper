import { Button } from '../common/Button';
import { ChoiceCore, type ChoiceCoreProps, type OptionRenderProps } from '../common/ChoiceCore';

// Props for DefaultChoice are the same as ChoiceCore except renderOption is provided
export interface DefaultChoiceProps extends Omit<ChoiceCoreProps, 'renderOption'> {}

/**
 * Default renderer for choice options using Button component with neobrutalist styling
 */
const defaultOptionRenderer = ({ option, isSelected, isDisabled, onClick }: OptionRenderProps) => {
  return (
    <Button
      variant={isSelected ? 'accent' : 'tertiary'}
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
 * Default Choice component with standard neobrutalist button styling.
 * 
 * This is the standard choice component that uses Button components with tertiary styling
 * for unselected options and accent styling for selected options. Maintains full consistency
 * with the design system's Button component.
 * 
 * @example Basic usage
 * ```tsx
 * <DefaultChoice name="category" value={category} onChange={setCategory}>
 *   <Option value="cleaning">Cleaning</Option>
 *   <Option value="maintenance">Maintenance</Option>
 *   <Option value="shopping">Shopping</Option>
 * </DefaultChoice>
 * ```
 * 
 * @example Multiple selection
 * ```tsx
 * <DefaultChoice name="tags" multiple value={tags} onChange={setTags}>
 *   <Option value="urgent">Urgent</Option>
 *   <Option value="easy">Easy</Option>
 *   <Option value="weekly">Weekly</Option>
 * </DefaultChoice>
 * ```
 * 
 * @example With label and error
 * ```tsx
 * <DefaultChoice 
 *   name="priority" 
 *   label="Task Priority"
 *   error={errors.priority?.message}
 *   value={priority} 
 *   onChange={setPriority}
 * >
 *   <Option value="low">Low</Option>
 *   <Option value="medium">Medium</Option>
 *   <Option value="high">High</Option>
 * </DefaultChoice>
 * ```
 * 
 * @example Vertical orientation
 * ```tsx
 * <DefaultChoice name="options" orientation="vertical">
 *   <Option value="a">Option A</Option>
 *   <Option value="b">Option B</Option>
 *   <Option value="c">Option C</Option>
 * </DefaultChoice>
 * ```
 */
export const DefaultChoice = (props: DefaultChoiceProps) => (
  <ChoiceCore {...props} renderOption={defaultOptionRenderer} />
);