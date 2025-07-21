import { Button } from '../common/Button';
import { ChoiceCore, type ChoiceCoreProps, type OptionRenderProps } from '../common/ChoiceCore';

// Props for FilterChoice are the same as ChoiceCore except renderOption is provided
export interface FilterChoiceProps extends Omit<ChoiceCoreProps, 'renderOption'> {}

/**
 * Filter renderer for choice options with secondary (blue) styling when selected
 */
const filterOptionRenderer = ({ option, isSelected, isDisabled, onClick }: OptionRenderProps) => {
  return (
    <Button
      variant={isSelected ? 'secondary' : 'tertiary'}
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
 * Filter Choice component with blue secondary styling for selected filters.
 * 
 * This component is designed for filter selection interfaces where multiple
 * filters can be applied. Selected filters show with blue (secondary) background
 * to clearly indicate active filters. Commonly used for status filters, category
 * filters, or any multi-selection filtering interface.
 * 
 * @example Status filtering (like maintenance dashboard)
 * ```tsx
 * <FilterChoice 
 *   name="statusFilters" 
 *   multiple 
 *   value={activeFilters} 
 *   onChange={setActiveFilters}
 * >
 *   <Option value="all">All</Option>
 *   <Option value="overdue">Overdue</Option>
 *   <Option value="due-soon">Due Soon</Option>
 *   <Option value="upcoming">Upcoming</Option>
 *   <Option value="completed">Completed</Option>
 * </FilterChoice>
 * ```
 * 
 * @example Category filtering
 * ```tsx
 * <FilterChoice 
 *   name="categoryFilters" 
 *   multiple 
 *   label="Filter by Category"
 *   value={categories} 
 *   onChange={setCategories}
 * >
 *   <Option value="cleaning">Cleaning</Option>
 *   <Option value="maintenance">Maintenance</Option>
 *   <Option value="shopping">Shopping</Option>
 *   <Option value="repairs">Repairs</Option>
 * </FilterChoice>
 * ```
 * 
 * @example Assignee filtering
 * ```tsx
 * <FilterChoice 
 *   name="assigneeFilters" 
 *   multiple 
 *   label="Assigned To"
 *   value={assignees} 
 *   onChange={setAssignees}
 * >
 *   <Option value="me">Assigned to Me</Option>
 *   <Option value="john">John Smith</Option>
 *   <Option value="sarah">Sarah Johnson</Option>
 *   <Option value="unassigned">Unassigned</Option>
 * </FilterChoice>
 * ```
 * 
 * @example Single filter selection
 * ```tsx
 * <FilterChoice 
 *   name="sortFilter" 
 *   label="Sort By"
 *   value={sortBy} 
 *   onChange={setSortBy}
 * >
 *   <Option value="date">Date</Option>
 *   <Option value="priority">Priority</Option>
 *   <Option value="name">Name</Option>
 * </FilterChoice>
 * ```
 * 
 * @example Horizontal layout for compact filters
 * ```tsx
 * <FilterChoice 
 *   name="quickFilters" 
 *   multiple 
 *   orientation="horizontal"
 *   value={quickFilters} 
 *   onChange={setQuickFilters}
 * >
 *   <Option value="urgent">Urgent</Option>
 *   <Option value="today">Due Today</Option>
 *   <Option value="mine">My Tasks</Option>
 * </FilterChoice>
 * ```
 */
export const FilterChoice = (props: FilterChoiceProps) => (
  <ChoiceCore {...props} renderOption={filterOptionRenderer} />
);