import { Card } from '../common/Card';

/**
 * StatCard component for displaying key metrics and dashboard statistics.
 * 
 * Built on top of the base Card component. Features large numbers with labels and subtitles,
 * perfect for dashboard KPIs, counts, and metrics. Supports various color themes and
 * optional click interactions for drill-down navigation.
 * 
 * @example
 * ```tsx
 * // Dashboard metric with click navigation
 * <StatCard
 *   label="Total Manuals"
 *   value={47}
 *   subtitle="+3 This Month"
 *   variant="dark"
 *   rotation="slight-left"
 *   onClick={() => navigate('/manuals')}
 * />
 * 
 * // Simple stat display
 * <StatCard
 *   label="Completed Tasks"
 *   value={12}
 *   variant="accent"
 * />
 * ```
 */
export interface StatCardProps {
  label :     string;
  value :     string | number;
  subtitle?:  string;
  variant?:   'primary' | 'secondary' | 'accent' | 'dark';
  rotation?:  'left' | 'right' | 'slight-left' | 'slight-right';
  onClick?:   () => void;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  subtitle,
  variant = 'dark',
  rotation = 'slight-left', 
  onClick,
  className = ''
}: StatCardProps) => {
  const variantConfig = {
    primary: {
      cardVariant: 'primary' as const,
      valueColor:  'text-white',
      shadow:      'secondary' as const
    },
    secondary: {
      cardVariant: 'secondary' as const,
      valueColor:  'text-background',
      shadow:      'error' as const
    },
    accent: {
      cardVariant: 'accent' as const,
      valueColor:  'text-background',
      shadow:      'secondary' as const
    },
    dark: {
      cardVariant: 'dark' as const,
      valueColor:  'text-primary',
      shadow:      'mega' as const
    }
  };

  const config = variantConfig[variant];

  return (
    <Card
      variant={config.cardVariant}
      shadow={config.shadow}
      rotation={rotation}
      hover={!!onClick}
      onClick={onClick}
      className={className}
    >
      <div className="text-white font-bold text-lg uppercase mb-4">
        {label}
      </div>
      <div className={`text-7xl font-black ${config.valueColor} leading-none mb-3`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-white font-bold uppercase">
          {subtitle}
        </div>
      )}
    </Card>
  );
};