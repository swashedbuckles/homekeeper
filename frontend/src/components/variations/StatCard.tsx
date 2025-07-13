import { Card, type CardProps } from '../common/Card';
import { Stats } from '../common/Stats';

/**
 * StatCard component for displaying key metrics and dashboard statistics.
 * 
 * Built on top of the base Card component. Features large numbers with labels and subtitles,
 * perfect for dashboard KPIs, counts, and metrics. Delegates all styling to Card component
 * and focuses on content structure.
 * 
 * @example
 * ```tsx
 * // Dashboard metric with custom styling
 * <StatCard
 *   label="Total Manuals"
 *   value={47}
 *   subtitle="+3 This Month"
 *   variant="dark"
 *   shadow="double"
 *   hover
 *   hoverEffect="lift"
 *   rotation="slight-left"
 *   onClick={() => navigate('/manuals')}
 * />
 * ```
 */
export interface StatCardProps extends Omit<CardProps, 'children'> {
  label :     string;
  value :     string | number;
  subtitle?:  string;
  size?:      'sm' | 'md' | 'lg';
}

export const StatCard = ({
  label,
  value,
  subtitle,
  size = 'lg',
  variant = 'dark',
  ...cardProps
}: StatCardProps) => {
  // Map StatCard sizes to Stats component sizes
  const statsSize = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const
  };

  // Map card variants to appropriate Stats colors
  const statsColor = {
    default:   'dark' as const,
    subtle:    'dark' as const,
    primary:   'white' as const,
    secondary: 'white' as const,
    accent:    'white' as const,
    danger:    'white' as const,
    dark:      'white' as const
  };

  return (
    <Card
      variant={variant}
      {...cardProps}
    >
      <Stats
        value={value}
        label={label}
        subtitle={subtitle}
        size={statsSize[size]}
        color={statsColor[variant || 'dark']}
      />
    </Card>
  );
};