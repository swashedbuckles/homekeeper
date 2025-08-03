import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from '../../../src/components/common/ProgressBar';

describe('ProgressBar', () => {
  it('renders basic progress bar with default props', () => {
    render(<ProgressBar value={50} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders with custom max value', () => {
    render(<ProgressBar value={75} max={150} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveAttribute('aria-valuemax', '150');
  });

  describe('Value Clamping', () => {
    const clampingTests = [
      {
        name: 'clamps value above maximum to max value',
        props: { value: 150, max: 100 },
        expectedValue: '100'
      },
      {
        name: 'clamps negative value to zero',
        props: { value: -10, max: 100 },
        expectedValue: '0'
      }
    ];

    clampingTests.forEach(({ name, props, expectedValue }) => {
      it(name, () => {
        render(<ProgressBar {...props} />);
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', expectedValue);
      });
    });
  });

  it('renders label when provided', () => {
    render(<ProgressBar value={60} label="Upload Progress" />);
    
    expect(screen.getByText('Upload Progress')).toBeInTheDocument();
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'Upload Progress');
  });

  describe('Percentage Display', () => {
    const percentageTests = [
      {
        name: 'shows percentage text for medium size and above',
        props: { value: 75, showPercentage: true, size: 'md' as const },
        expectedText: '75%',
        shouldShow: true
      },
      {
        name: 'shows percentage text for large size',
        props: { value: 60, showPercentage: true, size: 'lg' as const },
        expectedText: '60%',
        shouldShow: true
      },
      {
        name: 'shows percentage text for extra large size',
        props: { value: 80, showPercentage: true, size: 'xl' as const },
        expectedText: '80%',
        shouldShow: true
      },
      {
        name: 'suppresses percentage text for extra small size',
        props: { value: 75, showPercentage: true, size: 'xs' as const },
        expectedText: '75%',
        shouldShow: false
      },
      {
        name: 'suppresses percentage text for small size',
        props: { value: 75, showPercentage: true, size: 'sm' as const },
        expectedText: '75%',
        shouldShow: false
      },
      {
        name: 'does not show percentage text when showPercentage is false',
        props: { value: 75, showPercentage: false, size: 'lg' as const },
        expectedText: '75%',
        shouldShow: false
      }
    ];

    percentageTests.forEach(({ name, props, expectedText, shouldShow }) => {
      it(name, () => {
        render(<ProgressBar {...props} />);
        
        if (shouldShow) {
          expect(screen.getByText(expectedText)).toBeInTheDocument();
        } else {
          expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
        }
      });
    });
  });

  describe('Percentage Calculations', () => {
    const calculationTests = [
      {
        name: 'calculates percentage correctly with custom max',
        props: { value: 30, max: 60, showPercentage: true, size: 'md' as const },
        expectedText: '50%'
      },
      {
        name: 'rounds percentage to nearest integer',
        props: { value: 33, max: 100, showPercentage: true, size: 'md' as const },
        expectedText: '33%'
      }
    ];

    calculationTests.forEach(({ name, props, expectedText }) => {
      it(name, () => {
        render(<ProgressBar {...props} />);
        expect(screen.getByText(expectedText)).toBeInTheDocument();
      });
    });
  });

  it('applies custom className when provided', () => {
    render(<ProgressBar value={50} className="custom-class" />);
    
    const container = screen.getByRole('progressbar').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  describe('Color Variants', () => {
    const variantTests = [
      { variant: 'primary', expectedClass: 'bg-primary' },
      { variant: 'secondary', expectedClass: 'bg-secondary' },
      { variant: 'accent', expectedClass: 'bg-accent' },
      { variant: 'success', expectedClass: 'bg-accent' } // success maps to bg-accent in design system
    ];

    variantTests.forEach(({ variant, expectedClass }) => {
      it(`renders with ${variant} color variant`, () => {
        render(<ProgressBar value={50} variant={variant as any} />);
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar.firstChild).toHaveClass(expectedClass);
      });
    });
  });

  it('maintains consistent height for same size regardless of text', () => {
    const { rerender } = render(
      <ProgressBar value={50} size="lg" showPercentage={false} />
    );
    
    let progressBar = screen.getByRole('progressbar');
    const heightWithoutText = progressBar.className;

    rerender(<ProgressBar value={50} size="lg" showPercentage={true} />);
    progressBar = screen.getByRole('progressbar');
    const heightWithText = progressBar.className;

    // Both should have h-6 class (24px height for lg)
    expect(heightWithoutText).toContain('h-6');
    expect(heightWithText).toContain('h-6');
  });
});