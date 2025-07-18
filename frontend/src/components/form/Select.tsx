import { ChevronDown } from 'lucide-react';
import { forwardRef, useState, useRef, useEffect, Children, isValidElement } from 'react';
import { getHoverEffectClass } from '../../lib/design-system/hover-effects';
import { type StandardSize, getSizeToken } from '../../lib/design-system/sizes';
import type { ReactNode, ReactElement } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface OptionProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

export const Option: React.FC<OptionProps> = ({ children }) => {
  return <>{children}</>;
};

// Add displayName for better debugging
Option.displayName = 'Option';

// TypeScript types for allowed children
type OptionElement = ReactElement<OptionProps, typeof Option>;
type AllowedSelectChildren = OptionElement | OptionElement[];

export interface SelectProps {
  label: string;
  children?: AllowedSelectChildren; // ← TypeScript validation for Option children only
  placeholder?: string;
  error?: string;
  validationFeedback?: ReactNode;
  register?: UseFormRegisterReturn;
  testId?: string;
  className?: string;
  grouped?: boolean;
  size?: StandardSize;
  variant?: 'default' | 'search';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  name?: string;
}

const baseTriggerStyles = [
  'w-full',
  'font-mono',
  'font-bold',
  'uppercase',
  'brutal-transition',
  'cursor-pointer',
  'flex',
  'items-center',
  'justify-between',
  'focus:outline-none'
];

const baseDropdownStyles = [
  'absolute',
  'top-full',
  'left-0',
  'right-0',
  'z-50',
  'font-mono',
  'font-bold',
  'uppercase',
  'mt-1',
  'max-h-60',
  'overflow-y-auto',
  'overflow-x-hidden'
];

const baseOptionStyles = [
  'w-full',
  'text-left',
  'cursor-pointer',
  'brutal-transition',
  'block'
];

// Size variations using standardized tokens
const getSizeStyles = (size: StandardSize): string[] => [
  getSizeToken(size, 'paddingX'),
  getSizeToken(size, 'paddingY'),
  getSizeToken(size, 'text'),
  getSizeToken(size, 'border')
];

const getDropdownSizeStyles = (size: StandardSize): string[] => [
  getSizeToken(size, 'border')
];

const getOptionSizeStyles = (size: StandardSize): string[] => [
  getSizeToken(size, 'paddingX'),
  getSizeToken(size, 'paddingY'),
  getSizeToken(size, 'text')
];

const variantStyles = {
  default: {
    trigger: [
      'bg-white',
      'border-text-primary',
      'text-text-primary',
      'focus:brutal-shadow-primary'
    ],
    dropdown: [
      'bg-white',
      'border-text-primary',
      'brutal-shadow-primary'
    ],
    option: [
      'text-text-primary',
      'hover:bg-primary',
      'hover:text-white'
    ],
    optionSelected: [
      'bg-accent',
      'text-white'
    ]
  },
  search: {
    trigger: [
      'bg-text-primary',
      'border-white',
      'text-white',
      'focus:bg-background',
      'focus:text-text-primary',
      'focus:brutal-shadow-primary'
    ],
    dropdown: [
      'bg-text-primary',
      'border-white',
      'brutal-shadow-primary'
    ],
    option: [
      'text-white',
      'hover:bg-white',
      'hover:text-text-primary'
    ],
    optionSelected: [
      'bg-accent',
      'text-white'
    ]
  }
};

// Icon positioning based on size
const getIconStyles = (size: StandardSize = 'md'): string => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };
  return sizeMap[size];
};

/**
 * Custom Select Component with neobrutalist dropdown menu and full react-hook-form integration.
 * 
 * Features a custom-styled dropdown that matches the design system instead of relying on
 * native browser select UI. Includes thick borders, bold typography, and press hover effects.
 * 
 * @example Basic select with options
 * ```tsx
 * <Select 
 *   label="Country" 
 *   placeholder="Choose your country"
 * >
 *   <Option value="us">United States</Option>
 *   <Option value="ca">Canada</Option>
 *   <Option value="uk">United Kingdom</Option>
 * </Select>
 * ```
 * 
 * @example With error state
 * ```tsx
 * <Select 
 *   label="Household Role" 
 *   error="Please select your role in the household"
 * >
 *   <Option value="parent">Parent</Option>
 *   <Option value="child">Child</Option>
 *   <Option value="other">Other</Option>
 * </Select>
 * ```
 * 
 * @example Large size for hero forms
 * ```tsx
 * <Select 
 *   label="Household Type"
 *   size="lg"
 *   placeholder="Select household type"
 * >
 *   <Option value="single">Single Person</Option>
 *   <Option value="family">Family</Option>
 *   <Option value="shared">Shared Living</Option>
 * </Select>
 * ```
 * 
 * @example Search variant (dark theme)
 * ```tsx
 * <Select 
 *   label="Filter by Category"
 *   variant="search"
 *   placeholder="All categories"
 * >
 *   <Option value="cleaning">Cleaning</Option>
 *   <Option value="maintenance">Maintenance</Option>
 *   <Option value="shopping">Shopping</Option>
 * </Select>
 * ```
 * 
 * @example With controlled value and change handler
 * ```tsx
 * const [selectedValue, setSelectedValue] = useState('');
 * 
 * <Select
 *   label="Priority Level"
 *   value={selectedValue}
 *   onChange={(value) => setSelectedValue(value)}
 * >
 *   <Option value="low">Low</Option>
 *   <Option value="medium">Medium</Option>
 *   <Option value="high">High</Option>
 * </Select>
 * ```
 * 
 * @example With react-hook-form
 * ```tsx
 * const { register, formState: { errors }, setValue, watch } = useForm();
 * const watchedValue = watch('priority');
 * 
 * <Select
 *   label="Priority Level"
 *   value={watchedValue}
 *   onChange={(value) => setValue('priority', value)}
 *   register={register('priority', { required: 'Priority is required' })}
 *   error={errors.priority?.message}
 * >
 *   <Option value="low">Low</Option>
 *   <Option value="medium">Medium</Option>
 *   <Option value="high">High</Option>
 * </Select>
 * ```
 * 
 * @param label - Accessible label for the select field
 * @param children - Option components that define the available choices
 * @param placeholder - Placeholder text shown when no option is selected
 * @param error - Error message to display below the select
 * @param validationFeedback - Custom feedback content (e.g., success messages, progress indicators)
 * @param register - react-hook-form register function for form integration
 * @param testId - Test identifier for automated testing
 * @param className - Additional CSS classes to apply
 * @param grouped - Whether this select is part of a grouped form layout
 * @param size - Size variant affecting padding, text size, and borders (xs|sm|md|lg|xl)
 * @param variant - Visual variant (default for light theme, search for dark theme)
 * @param value - Controlled value (use with onChange)
 * @param defaultValue - Default value for uncontrolled usage
 * @param onChange - Change handler function called with selected value
 * @param onBlur - Blur handler function
 * @param disabled - Disables the select and applies opacity
 * @param name - Name attribute for form submission
 */
export const Select = forwardRef<HTMLInputElement, SelectProps>((props, ref) => {
  const { 
    label, 
    children,
    placeholder, 
    error, 
    validationFeedback, 
    register, 
    testId, 
    className, 
    grouped, 
    size = 'md', 
    variant = 'default',
    value: controlledValue,
    defaultValue,
    onChange,
    onBlur,
    disabled = false,
    name,
    ...restProps 
  } = props;

  // Extract options from children with validation and helpful error messages
  const options = Children.toArray(children)
    .filter((child): child is React.ReactElement<OptionProps> => {
      if (!isValidElement(child)) {
        console.warn('Select: Non-element child found, skipping');
        return false;
      }
      
      const isValidChild = child.type === Option;
      if (!isValidChild) {
        const componentName = typeof child.type === 'string' 
          ? child.type 
          : (child.type as any)?.displayName || (child.type as any)?.name || 'Unknown';
          
        console.warn(
          `Select: Invalid child component <${componentName}>. ` +
          'Only <Option> components are allowed as children.'
        );
      }
      
      return isValidChild;
    })
    .map(child => ({
      value: child.props.value,
      label: typeof child.props.children === 'string' ? child.props.children : String(child.props.children),
      disabled: child.props.disabled || false
    }));
  
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  // Use controlled value if provided, otherwise use internal state
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  
  const selectId = `select-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const hasFeedback = validationFeedback != null;
  const hasError = error != null;

  // Find selected option for display
  const selectedOption = options.find(option => option.value === currentValue);
  const displayValue = selectedOption?.label || placeholder || 'Select...';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onBlur]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();
          // Could implement keyboard navigation here
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(optionValue);
    }
    
    onChange?.(optionValue);
    
    // Trigger register onChange if using react-hook-form
    if (register?.onChange) {
      register.onChange({
        target: { name: register.name, value: optionValue }
      });
    }
    
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const errorStyles = hasError ? [
    'border-error',
    'focus:brutal-shadow-error'
  ] : [];

  const disabledStyles = disabled ? [
    'opacity-50',
    'cursor-not-allowed',
    '!hover:transform-none'
  ] : [];

  const triggerStyles = [
    ...(grouped ? [] : ['w-full']),
    ...baseTriggerStyles,
    ...getSizeStyles(size),
    ...variantStyles[variant].trigger,
    ...errorStyles,
    ...disabledStyles,
    className
  ].filter(Boolean).join(' ');

  const dropdownStyles = [
    ...baseDropdownStyles,
    ...getDropdownSizeStyles(size),
    ...variantStyles[variant].dropdown
  ].filter(Boolean).join(' ');

  const iconColor = variant === 'search' ? 'text-white' : 'text-text-primary';
  const hoverEffect = disabled ? 'none' : 'press-small';

  return (
    <div className={grouped ? 'mb-4' : 'w-full mb-4'}>
      <label
        htmlFor={selectId}
        className="block font-mono font-black text-text-primary uppercase mb-2 text-lg tracking-wide"
      >
        {label}
        {register?.required && (
          <span className="text-error ml-1">*</span>
        )}
      </label>

      <div className="relative" ref={dropdownRef}>
        {/* Hidden input for form integration */}
        <input
          ref={ref}
          type="hidden"
          id={selectId}
          name={name || register?.name}
          value={currentValue}
          data-testid={testId}
          {...restProps}
        />

        {/* Custom trigger button */}
        <button
          ref={triggerRef}
          type="button"
          className={`${triggerStyles} ${getHoverEffectClass(hoverEffect)}`}
          onClick={handleToggle}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          data-testid={testId ? `${testId}-trigger` : undefined}
        >
          <span className={!selectedOption ? 'opacity-60' : ''}>
            {displayValue}
          </span>
          <div 
            className={`${getIconStyles(size)} ${iconColor} transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            <ChevronDown className="w-full h-full" />
          </div>
        </button>

        {/* Custom dropdown menu */}
        {isOpen && (
          <div 
            className={dropdownStyles}
            role="listbox"
            aria-labelledby={selectId}
          >
            {options.map((option) => {
              const isSelected = option.value === currentValue;
              const isDisabled = option.disabled;
              
              const optionStyles = [
                ...baseOptionStyles,
                ...getOptionSizeStyles(size),
                ...(isSelected 
                  ? variantStyles[variant].optionSelected 
                  : variantStyles[variant].option
                ),
                ...(isDisabled ? ['opacity-50', 'cursor-not-allowed'] : [getHoverEffectClass('press-small')])
              ].filter(Boolean).join(' ');

              return (
                <button
                  key={option.value}
                  type="button"
                  className={optionStyles}
                  onClick={() => !isDisabled && handleOptionSelect(option.value)}
                  disabled={isDisabled}
                  role="option"
                  aria-selected={isSelected}
                  data-testid={testId ? `${testId}-option-${option.value}` : undefined}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {hasError && (
        <div className="mt-1 mb-2 p-3 bg-error border-brutal-sm border-text-primary text-white">
          <div className="font-mono font-bold uppercase text-sm">
            ⚠ {error}
          </div>
        </div>
      )}

      {hasFeedback && (
        <div className="mt-1 mb-2 p-3 bg-background border-brutal-sm border-text-primary text-white">
          <div className="font-mono font-bold uppercase text-sm">
            {validationFeedback}
          </div>
        </div>
      )}
    </div>
  );
});

// Add displayName for better debugging
Select.displayName = 'Select';