import { Title, type TitleProps } from '../common/Title';

/**
 * SubSectionTitle Component - Subsection-level heading.
 * 
 * A specialized wrapper around Title component with variant="subsection" pre-configured.
 * Perfect for smaller sections and content groupings within pages, providing consistent 
 * h3-level typography.
 * 
 * @example
 * ```tsx
 * // Basic subsection title
 * <SubSectionTitle>
 *   Task Details
 * </SubSectionTitle>
 * 
 * // With description
 * <SubSectionTitle description="Additional information about this task">
 *   Assignment History
 * </SubSectionTitle>
 * 
 * // With rotation for visual hierarchy
 * <SubSectionTitle rotation="slight-left">
 *   Comments & Notes
 * </SubSectionTitle>
 * ```
 */
export interface SubSectionTitleProps extends Omit<TitleProps, 'variant'> {}

export const SubSectionTitle = (props: SubSectionTitleProps) => {
  return <Title {...props} variant="subsection" />;
};