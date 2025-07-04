import { Title, type TitleProps } from '../common/Title';

/**
 * SectionTitle Component - Section-level heading.
 * 
 * A specialized wrapper around Title component with variant="section" pre-configured.
 * Perfect for major sections within pages, providing consistent h2-level typography.
 * 
 * @example
 * ```tsx
 * // Basic section title
 * <SectionTitle>
 *   Recent Tasks
 * </SectionTitle>
 * 
 * // With description and text shadow
 * <SectionTitle 
 *   description="Tasks completed in the last 7 days"
 *   textShadow
 * >
 *   Weekly Summary
 * </SectionTitle>
 * 
 * // With slight rotation for visual interest
 * <SectionTitle rotation="slight-right">
 *   Household Members
 * </SectionTitle>
 * ```
 */
export interface SectionTitleProps extends Omit<TitleProps, 'variant'> {}

export const SectionTitle = (props: SectionTitleProps) => {
  return <Title {...props} variant="section" />;
};
