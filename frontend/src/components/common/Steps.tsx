import {Children, isValidElement} from 'react';
import type { ReactNode, ReactElement } from 'react';

/**
 * Props for individual Step component
 * 
 * @public
 */
export interface StepProps {
  /** Whether this step has been completed */
  completed?: boolean;
  /** Whether this step is currently active */
  active?: boolean;
  /** Whether this step has an error state */
  error?: boolean;
  /** Content to display as the step label */
  children: ReactNode;
}

/**
 * Props for Steps container component
 * 
 * @public
 */
export interface StepsProps {
  /** Step components to display in the progress indicator */
  children: ReactNode;
  /** Layout orientation for the steps */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Internal props for step indicator circles
 * 
 * @internal
 */
interface StepIndicatorProps {
  /** Step number to display */
  position: number;
  /** Whether this step has been completed */
  completed?: boolean;
  /** Whether this step is currently active */
  active?: boolean;
  /** Whether this step has an error state */
  error?: boolean;
}

/**
 * Visual indicator showing step number and status
 * 
 * @param props - StepIndicatorProps
 * @returns Styled circle with step number
 * 
 * @internal
 */
const StepIndicator = ({position, completed, active, error}: StepIndicatorProps) => {
  let backgroundClass = 'bg-white';
  let textClass = 'text-text-primary';
  let shadowClass = '';

  if(error) {
    backgroundClass = 'bg-error';
    textClass = 'text-white';
  } else if(completed && !active) {
    backgroundClass = 'bg-accent';
    textClass = 'text-white';
  } else if (!completed && active) {
    backgroundClass = 'bg-primary';
    textClass = 'text-white';
    shadowClass = 'brutal-shadow-dark';
  }
  
  const boxStyles = [
    'flex items-center justify-center',
    'w-12 h-12',
    'border-4 border-text-primary',
    backgroundClass,
    textClass,
    'font-mono font-black text-lg',
    'transition-all duration-100',
    shadowClass
  ].filter(Boolean).join(' ');

  return (
    <div className={boxStyles}>
      {position}
    </div>
  );
};

/**
 * Internal props for connecting lines between steps
 * 
 * @internal
 */
interface StepLineProps {
  /** Whether this line should show as completed */
  completed?: boolean;
  /** Layout orientation for the line */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Connecting line between step indicators
 * 
 * @param props - StepLineProps
 * @returns Styled horizontal or vertical line
 * 
 * @internal
 */
const StepLine = ({completed, orientation = 'horizontal'}: StepLineProps) => {
  const backgroundClass = completed ? 'bg-accent' : 'bg-text-secondary';
  
  if (orientation === 'vertical') {
    return (
      <div className={`w-1 flex-1 ${backgroundClass} border-2 border-text-primary my-2`}></div>
    );
  }
  
  return (
    <div className={`flex-1 h-1 ${backgroundClass} border-2 border-text-primary`}></div>
  );
};

/**
 * Individual step component containing just the label content.
 * Used as children within the Steps container component.
 * 
 * @param props - StepProps
 * @returns Step label content
 * 
 * @example Basic step
 * ```tsx
 * <Step>Task Information</Step>
 * ```
 * 
 * @example Step with status
 * ```tsx
 * <Step completed>Task Information</Step>
 * <Step active>Equipment Selection</Step>
 * <Step error>Failed Step</Step>
 * ```
 * 
 * @public
 */
export const Step = ({children}: StepProps) => {
  return (
    <span className="text-text-secondary font-mono font-bold uppercase text-sm">
      {children}
    </span>
  );
};

/**
 * Progress steps container component following neobrutalist design principles.
 * Displays a series of numbered step indicators with connecting lines,
 * and step labels. Supports both horizontal and vertical orientations.
 * Automatically handles positioning and status styling.
 * 
 * Features:
 * - Automatic step numbering (1, 2, 3, ...)
 * - Visual status indicators (completed, active, error)
 * - Connecting lines that show progress
 * - Horizontal and vertical layout options
 * - Responsive layout with proper spacing
 * - Neobrutalist styling with thick borders and bold typography
 * 
 * @param props - StepsProps
 * @returns Complete step progress indicator
 * 
 * @example Basic horizontal usage
 * ```tsx
 * <Steps>
 *   <Step completed>Task Info</Step>
 *   <Step active>Equipment</Step>
 *   <Step>Schedule</Step>
 *   <Step>Notifications</Step>
 * </Steps>
 * ```
 * 
 * @example Vertical layout
 * ```tsx
 * <Steps orientation="vertical">
 *   <Step completed>Create Account</Step>
 *   <Step active>Set Up Profile</Step>
 *   <Step>Join Household</Step>
 * </Steps>
 * ```
 * 
 * @example With error state
 * ```tsx
 * <Steps>
 *   <Step completed>Step 1</Step>
 *   <Step error>Failed Step</Step>
 *   <Step>Step 3</Step>
 * </Steps>
 * ```
 * 
 * @public
 */
export const Steps = ({children, orientation = 'horizontal'}: StepsProps) => {
  if(!children) {
    return null;
  }

  const stepArray = Children.toArray(children).filter(isValidElement) as ReactElement<StepProps>[];

  if (orientation === 'vertical') {
    return (
      <div className="w-full max-w-md">
        {stepArray.map((step, index) => {
          const isLastStep = index === stepArray.length - 1;
          const isCompleted = step.props.completed;
          const isActive = step.props.active;
          const textColor = isActive ? 'text-primary' : 'text-text-secondary';
          
          return (
            <div key={index} className="flex">
              {/* Indicator and line column */}
              <div className="flex flex-col items-center mr-4">
                <StepIndicator 
                  position={index + 1}
                  completed={isCompleted}
                  active={isActive}
                  error={step.props.error}
                />
                {!isLastStep && (
                  <StepLine 
                    completed={isCompleted && !isActive} 
                    orientation="vertical"
                  />
                )}
              </div>
              
              {/* Label column */}
              <div className={`font-mono font-bold uppercase text-sm ${textColor} py-3`}>
                {step.props.children}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal layout (default)
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Indicators and lines row */}
      <div className="flex items-center justify-between mb-4">
        {stepArray.map((step, index) => {
          const isLastStep = index === stepArray.length - 1;
          const isCompleted = step.props.completed;
          const isActive = step.props.active;
          
          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <StepIndicator 
                position={index + 1}
                completed={isCompleted}
                active={isActive}
                error={step.props.error}
              />
              {!isLastStep && (
                <StepLine completed={isCompleted && !isActive} />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Labels row */}
      <div className="flex justify-between">
        {stepArray.map((step, index) => {
          const isActive = step.props.active;
          const textColor = isActive ? 'text-primary' : 'text-text-secondary';
          
          return (
            <div key={index} className={`font-mono font-bold uppercase text-sm ${textColor}`}>
              {step.props.children}
            </div>
          );
        })}
      </div>
    </div>
  );
};