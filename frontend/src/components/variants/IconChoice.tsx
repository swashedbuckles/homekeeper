import { 
  Calendar, 
  RotateCcw, 
  Clock, 
  Target, 
  Sparkles, 
  Wrench, 
  ShoppingCart, 
  Hammer, 
  Search, 
  TestTube,
  Circle,
  AlertCircle,
  CheckCircle,
  XCircle,
  HourglassIcon,
  Settings,
  CalendarDays,
  BarChart3,
  Calendar as CalendarIcon,
  FileText
} from 'lucide-react';
import { ChoiceCore, type ChoiceCoreProps, type OptionRenderProps } from '../common/ChoiceCore';
import type { LucideIcon } from 'lucide-react';

// Props for IconChoice are the same as ChoiceCore except renderOption is provided
export interface IconChoiceProps extends Omit<ChoiceCoreProps, 'renderOption'> {
  /** Optional icon mapping for option values */
  iconMap?: Record<string, LucideIcon>;
}

/**
 * Default icon mapping for common option values using Lucide icons
 */
const defaultIconMap: Record<string, LucideIcon> = {
  // Frequency options (from mockup)
  'once': Calendar,
  'one-time': Calendar,
  'recurring': RotateCcw,
  'usage': Clock,
  'usage-based': Clock,
  'condition': Target,
  'condition-based': Target,
  
  // Common categories
  'cleaning': Sparkles,
  'maintenance': Wrench,
  'shopping': ShoppingCart,
  'repairs': Hammer,
  'inspection': Search,
  'testing': TestTube,
  
  // Priority levels
  'low': Circle,
  'medium': AlertCircle, 
  'high': XCircle,
  
  // Status options
  'pending': HourglassIcon,
  'progress': Settings,
  'completed': CheckCircle,
  'cancelled': XCircle,
  
  // Time periods
  'daily': CalendarDays,
  'weekly': BarChart3,
  'monthly': CalendarIcon,
  'yearly': FileText
};

/**
 * Get icon component for an option value, with fallback
 */
const getIcon = (value: string, iconMap?: Record<string, LucideIcon>): LucideIcon => {
  // Check custom icon map first
  if (iconMap?.[value]) {
    return iconMap[value];
  }
  
  // Check default icon map
  if (defaultIconMap[value.toLowerCase()]) {
    return defaultIconMap[value.toLowerCase()];
  }
  
  // Fallback icon
  return Circle;
};

/**
 * Icon renderer for choice options with card-style layout and Lucide icons
 */
const iconOptionRenderer = (iconMap?: Record<string, LucideIcon>) => 
  ({ option, isSelected, isDisabled, onClick }: OptionRenderProps) => {
    const IconComponent = getIcon(option.value, iconMap);
    
    const baseStyles = [
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'p-4',
      'border-4',
      'border-text-primary',
      'font-mono',
      'font-black',
      'uppercase',
      'text-sm',
      'cursor-pointer',
      'brutal-transition',
      'focus:outline-none',
      'min-h-[100px]',
      'text-center'
    ];

    const stateStyles = isSelected 
      ? ['bg-primary', 'text-white', 'brutal-shadow-dark']
      : ['bg-white', 'text-text-primary', 'hover:bg-primary', 'hover:text-white'];

    const interactionStyles = isDisabled 
      ? ['opacity-50', 'cursor-not-allowed', '!hover:transform-none']
      : ['hover:brutal-shadow-dark'];

    const cardStyles = [
      ...baseStyles,
      ...stateStyles,
      ...interactionStyles
    ].filter(Boolean).join(' ');

    return (
      <button 
        disabled={isDisabled} 
        onClick={onClick}
        className={cardStyles}
        type="button"
      >
        <div className="mb-2">
          <IconComponent size={32} className="mx-auto" />
        </div>
        <div className="leading-tight">{option.label}</div>
      </button>
    );
  };

/**
 * Icon Choice component with card-style layout and icons for each option.
 * 
 * This component renders options as cards with large icons and labels, perfect for
 * frequency selection, category choice, or any selection that benefits from visual
 * icons. Matches the frequency options styling from the maintenance task creation mockup.
 * 
 * Icons can be customized via the iconMap prop, or will use sensible defaults based
 * on common option values.
 * 
 * @example Frequency selection (matches mockup)
 * ```tsx
 * <IconChoice name="frequency" value={frequency} onChange={setFrequency}>
 *   <Option value="once">One Time</Option>
 *   <Option value="recurring">Recurring</Option>
 *   <Option value="usage">Based on Usage</Option>
 *   <Option value="condition">Condition Based</Option>
 * </IconChoice>
 * ```
 * 
 * @example Category selection with custom icons
 * ```tsx
 * import { Utensils, Car, Home, Briefcase } from 'lucide-react';
 * 
 * <IconChoice 
 *   name="category" 
 *   label="Task Category"
 *   iconMap={{
 *     cleaning: Home,
 *     maintenance: Car,
 *     shopping: Briefcase,
 *     cooking: Utensils
 *   }}
 *   value={category} 
 *   onChange={setCategory}
 * >
 *   <Option value="cleaning">Cleaning</Option>
 *   <Option value="maintenance">Maintenance</Option>
 *   <Option value="shopping">Shopping</Option>
 *   <Option value="cooking">Cooking</Option>
 * </IconChoice>
 * ```
 * 
 * @example Priority selection with status icons
 * ```tsx
 * <IconChoice name="priority" label="Priority Level" value={priority} onChange={setPriority}>
 *   <Option value="low">Low Priority</Option>
 *   <Option value="medium">Medium Priority</Option>
 *   <Option value="high">High Priority</Option>
 * </IconChoice>
 * ```
 * 
 * @example Multiple selection for features
 * ```tsx
 * import { Bell, Clock, Share2, BarChart } from 'lucide-react';
 * 
 * <IconChoice 
 *   name="features" 
 *   multiple 
 *   label="Select Features"
 *   value={features} 
 *   onChange={setFeatures}
 *   iconMap={{
 *     notifications: Bell,
 *     reminders: Clock,
 *     sharing: Share2,
 *     analytics: BarChart
 *   }}
 * >
 *   <Option value="notifications">Notifications</Option>
 *   <Option value="reminders">Reminders</Option>
 *   <Option value="sharing">Sharing</Option>
 *   <Option value="analytics">Analytics</Option>
 * </IconChoice>
 * ```
 * 
 * @example Grid layout with orientation
 * ```tsx
 * <IconChoice 
 *   name="timeframe" 
 *   label="Select Timeframe"
 *   className="grid grid-cols-2 md:grid-cols-4 gap-4"
 *   value={timeframe} 
 *   onChange={setTimeframe}
 * >
 *   <Option value="daily">Daily</Option>
 *   <Option value="weekly">Weekly</Option>
 *   <Option value="monthly">Monthly</Option>
 *   <Option value="yearly">Yearly</Option>
 * </IconChoice>
 * ```
 */
export const IconChoice = ({ iconMap, ...props }: IconChoiceProps) => (
  <ChoiceCore {...props} renderOption={iconOptionRenderer(iconMap)} />
);