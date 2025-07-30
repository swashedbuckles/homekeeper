/**
 * LoadingIndicator Component.
 * 
 * A neo-brutalist loading indicator featuring chunky square pulsars that align with
 * the brutal design system aesthetic. Uses thick borders, bold colors, and geometric
 * shapes instead of traditional circular spinners.
 * 
 * @example Basic loading indicator
 * ```tsx
 * <LoadingIndicator />
 * ```
 * 
 * @example With custom message
 * ```tsx
 * <LoadingIndicator message="Loading your dashboard..." />
 * ```
 * 
 * @example Small variant
 * ```tsx
 * <LoadingIndicator size="sm" />
 * ```
 * 
 * @example Inline usage (no centering)
 * ```tsx
 * <LoadingIndicator inline />
 * ```
 */

/**
 * Props for LoadingIndicator component
 */
export interface LoadingIndicatorProps {
  /** Size variant for the loading squares */
  size?: 'sm' | 'md' | 'lg';
  
  /** Optional loading message to display below the indicator */
  message?: string;
  
  /** Whether to display inline instead of centered in container */
  inline?: boolean;
  
  /** Color scheme for the loading squares */
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  
  /** Additional CSS classes to apply */
  className?: string;
  
  /** Test identifier for automated testing */
  testId?: string;
}

/**
 * Individual loading square component with brutal styling
 */
interface LoadingSquareProps {
  color: string;
  size: string;
  delay: string;
  className?: string;
}

const LoadingSquare = ({ color, size, delay, className = '' }: LoadingSquareProps) => {
  const squareStyles = [
    size,
    color,
    'border-brutal-sm border-text-primary',
    'animate-pulse',
    'flex-shrink-0',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={squareStyles}
      style={{ animationDelay: delay }}
    />
  );
};

export const LoadingIndicator = ({
  size = 'md',
  message,
  inline = false,
  variant = 'default',
  className = '',
  testId = 'loading-indicator'
}: LoadingIndicatorProps) => {
  
  // Size configurations for squares
  const sizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-6 h-6'
  };

  // Gap sizes between squares
  const gapStyles = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  };

  // Color variants for the squares
  const colorVariants = {
    default: ['bg-primary', 'bg-secondary', 'bg-accent'],
    primary: ['bg-primary', 'bg-primary/80', 'bg-primary/60'],
    secondary: ['bg-secondary', 'bg-secondary/80', 'bg-secondary/60'],
    accent: ['bg-accent', 'bg-accent/80', 'bg-accent/60']
  };

  // Text size for message
  const messageSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const colors = colorVariants[variant];
  const squareSize = sizeStyles[size];
  const gap = gapStyles[size];

  // Container for the loading squares
  const indicatorContent = (
    <div className={`flex ${gap} items-center justify-center`}>
      <LoadingSquare 
        color={colors[0]} 
        size={squareSize} 
        delay="0ms"
      />
      <LoadingSquare 
        color={colors[1]} 
        size={squareSize} 
        delay="200ms"
      />
      <LoadingSquare 
        color={colors[2]} 
        size={squareSize} 
        delay="400ms"
      />
    </div>
  );

  // Message component if provided
  const messageContent = message && (
    <p className={`text-text-secondary font-mono font-bold uppercase tracking-wide mt-4 text-center ${messageSize[size]}`}>
      {message}
    </p>
  );

  // Inline version - just the indicator and optional message
  if (inline) {
    const inlineStyles = [
      'flex flex-col items-center',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={inlineStyles} data-testid={testId}>
        {indicatorContent}
        {messageContent}
      </div>
    );
  }

  // Full-screen centered version
  const centeredStyles = [
    'min-h-screen flex items-center justify-center',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={centeredStyles} data-testid={testId}>
      <div className="text-center">
        {indicatorContent}
        {messageContent}
      </div>
    </div>
  );
};

// Add displayName for better debugging
LoadingIndicator.displayName = 'LoadingIndicator';