import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stats } from '../../../src/components/common/Stats';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';

describe('Stats', () => {
  it('renders value and label correctly', () => {
    render(<Stats value={47} label="Total Manuals" />);
    
    expect(screen.getByText('47')).toBeInTheDocument();
    expect(screen.getByText('Total Manuals')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<Stats value={100} label="Default Stats" />);
    const stats = screen.getByTestId('stats');
    
    expect(stats).toBeInTheDocument();
    // Check for default size (medium) and color (primary)
    const value = screen.getByText('100');
    expect(value).toHaveClass('text-4xl', 'md:text-5xl', 'text-primary');
  });

  describe('sizes', () => {
    const sizeTests = [
      {
        size: 'small',
        props: { value: 25, label: 'Small Stats', size: 'sm' as const },
        valueClasses: ['text-2xl', 'md:text-3xl'],
        labelClasses: ['text-sm', 'mt-1']
      },
      {
        size: 'medium', 
        props: { value: 50, label: 'Medium Stats', size: 'md' as const },
        valueClasses: ['text-4xl', 'md:text-5xl'],
        labelClasses: ['text-base', 'mt-2']
      },
      {
        size: 'large',
        props: { value: 100, label: 'Large Stats', size: 'lg' as const },
        valueClasses: ['text-5xl', 'md:text-6xl', 'lg:text-7xl'],
        labelClasses: ['text-lg', 'mt-3']
      }
    ];

    sizeTests.forEach(({ size, props, valueClasses, labelClasses }) => {
      it(`renders ${size} size correctly`, () => {
        render(<Stats {...props} />);
        
        const value = screen.getByText(props.value.toString());
        const label = screen.getByText(props.label);
        
        expectElementToHaveClasses(value, valueClasses);
        expectElementToHaveClasses(label, labelClasses);
      });
    });
  });

  describe('colors', () => {
    const colorTests = [
      {
        color: 'primary',
        props: { value: 10, label: 'Primary', color: 'primary' as const },
        valueClasses: ['text-primary'],
        labelClasses: ['text-text-primary']
      },
      {
        color: 'secondary',
        props: { value: 20, label: 'Secondary', color: 'secondary' as const },
        valueClasses: ['text-text-secondary'],
        labelClasses: ['text-text-primary']
      },
      {
        color: 'accent',
        props: { value: 30, label: 'Accent', color: 'accent' as const },
        valueClasses: ['text-accent'],
        labelClasses: ['text-text-primary']
      },
      {
        color: 'error',
        props: { value: 50, label: 'Error', color: 'error' as const },
        valueClasses: ['text-error'],
        labelClasses: ['text-text-primary']
      },
      {
        color: 'white',
        props: { value: 60, label: 'White', color: 'white' as const },
        valueClasses: ['text-white'],
        labelClasses: ['text-white']
      }
    ];

    colorTests.forEach(({ color, props, valueClasses, labelClasses }) => {
      it(`renders ${color} color correctly`, () => {
        render(<Stats {...props} />);
        
        const value = screen.getByText(props.value.toString());
        const label = screen.getByText(props.label);
        
        expectElementToHaveClasses(value, valueClasses);
        expectElementToHaveClasses(label, labelClasses);
      });
    });
  });

  describe('subtitle', () => {
    it('renders subtitle when provided', () => {
      render(
        <Stats 
          value={47} 
          label="Total Manuals" 
          subtitle="+3 This Month" 
        />
      );
      
      expect(screen.getByText('+3 This Month')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<Stats value={47} label="Total Manuals" />);
      
      // Check that no subtitle element exists
      const stats = screen.getByTestId('stats');
      expect(stats.children).toHaveLength(2); // Only value and label
    });

    it('applies correct subtitle styling', () => {
      render(
        <Stats 
          value={47} 
          label="Total Manuals" 
          subtitle="+3 This Month"
          size="lg"
          color="white"
        />
      );
      
      const subtitle = screen.getByText('+3 This Month');
      expect(subtitle).toHaveClass('font-bold', 'uppercase', 'tracking-wide', 'text-base', 'mt-2', 'text-white/80');
    });
  });

  describe('value types', () => {
    it('renders string values correctly', () => {
      render(<Stats value="$2,340" label="Saved This Year" />);
      
      expect(screen.getByText('$2,340')).toBeInTheDocument();
    });

    it('renders JSX element values correctly', () => {
      render(
        <Stats 
          value={<span>47<small>%</small></span>} 
          label="Progress" 
        />
      );
      
      expect(screen.getByText('47')).toBeInTheDocument();
      expect(screen.getByText('%')).toBeInTheDocument();
    });

    it('renders numeric values correctly', () => {
      render(<Stats value={12345} label="Large Number" />);
      
      expect(screen.getByText('12345')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(<Stats value={100} label="Custom" className="custom-class" />);
    const stats = screen.getByTestId('stats');
    
    expect(stats).toHaveClass('custom-class');
  });

  it('uses custom testId', () => {
    render(<Stats value={100} label="Custom Test" testId="custom-stats" />);
    
    expect(screen.getByTestId('custom-stats')).toBeInTheDocument();
  });

  it('applies base styles consistently', () => {
    render(<Stats value={100} label="Base Styles" />);
    const stats = screen.getByTestId('stats');
    
    expect(stats).toHaveClass('font-mono', 'text-center');
    
    const value = screen.getByText('100');
    expect(value).toHaveClass('font-black', 'leading-none', 'tracking-tight');
    
    const label = screen.getByText('Base Styles');
    expect(label).toHaveClass('font-bold', 'uppercase', 'tracking-wide');
  });

  describe('real-world usage examples', () => {
    const usageExamples = [
      {
        name: 'dashboard manual count',
        props: { value: 47, label: 'Total Manuals', subtitle: '+3 This Month', size: 'lg' as const, color: 'primary' as const },
        expectations: [
          { text: '47', classes: ['text-5xl', 'text-primary'] },
          { text: 'Total Manuals', classes: ['text-lg'] },
          { text: '+3 This Month', classes: ['text-base'] }
        ]
      },
      {
        name: 'overdue tasks counter',
        props: { value: 5, label: 'Pending Tasks', subtitle: '2 Due Soon', size: 'md' as const, color: 'error' as const },
        expectations: [
          { text: '5', classes: ['text-error'] },
          { text: 'Pending Tasks', exists: true },
          { text: '2 Due Soon', exists: true }
        ]
      },
      {
        name: 'completion statistics',
        props: { value: 12, label: 'Completed', subtitle: 'This Month', size: 'md' as const, color: 'accent' as const },
        expectations: [{ text: '12', classes: ['text-accent', 'text-4xl'] }]
      }
    ];

    usageExamples.forEach(({ name, props, expectations }) => {
      it(`renders ${name}`, () => {
        render(<Stats {...props} />);
        
        expectations.forEach((expectation) => {
          const element = screen.getByText(expectation.text);
          if ('exists' in expectation && expectation.exists) {
            expect(element).toBeInTheDocument();
          }
          if ('classes' in expectation && expectation.classes) {
            expectElementToHaveClasses(element, expectation.classes);
          }
        });
      });
    });
  });

  describe('Progress Functionality', () => {
    const progressScenarios = [
      {
        name: 'does not render when progressValue not provided',
        props: { value: 47, label: 'No Progress' },
        test: () => {
          const stats = screen.getByTestId('stats');
          expect(stats.querySelector('.h-2')).not.toBeInTheDocument();
        }
      },
      {
        name: 'renders when progressValue provided',
        props: { value: '85%', label: 'Equipment Health', progressValue: 85, progressColor: 'accent' as const },
        test: () => {
          const stats = screen.getByTestId('stats');
          expect(stats.querySelector('[role="progressbar"]')).toBeInTheDocument();
        }
      },
      {
        name: 'applies correct aria attributes',
        props: { value: '60%', label: 'Task Completion', progressValue: 60 },
        test: () => {
          const progressBar = screen.getByRole('progressbar');
          expect(progressBar).toHaveAttribute('aria-valuenow', '60');
          expect(progressBar).toHaveAttribute('aria-valuemin', '0');
          expect(progressBar).toHaveAttribute('aria-valuemax', '100');
        }
      },
      {
        name: 'clamps values outside 0-100 range',
        props: { value: '150%', label: 'Over Limit', progressValue: 150 },
        test: () => {
          const progressBar = screen.getByRole('progressbar');
          const progressFill = progressBar.firstChild as HTMLElement;
          expect(progressFill).toHaveStyle('width: 100%');
        }
      },
      {
        name: 'handles negative values',
        props: { value: '-10%', label: 'Negative', progressValue: -10 },
        test: () => {
          const progressBar = screen.getByRole('progressbar');
          const progressFill = progressBar.firstChild as HTMLElement;
          expect(progressFill).toHaveStyle('width: 0%');
        }
      }
    ];

    progressScenarios.forEach(({ name, props, test }) => {
      it(name, () => {
        render(<Stats {...props} />);
        test();
      });
    });

    describe('Progress Colors', () => {
      const progressColors = [
        { color: 'accent', label: 'System Health', expected: 'bg-accent' },
        { color: 'primary', label: 'Progress', expected: 'bg-primary' },
        { color: 'error', label: 'Critical Status', expected: 'bg-error' },
        { color: 'secondary', label: 'Information', expected: 'bg-secondary' }
      ];

      progressColors.forEach(({ color, label, expected }) => {
        it(`applies ${color} color correctly`, () => {
          render(
            <Stats 
              value="67%" 
              label={label}
              progressValue={67}
              progressColor={color as any}
            />
          );
          
          const progressBar = screen.getByRole('progressbar');
          expect(progressBar.querySelector(`[class*="${expected}"]`)).toBeInTheDocument();
        });
      });

      it('defaults to primary color when not specified', () => {
        render(<Stats value="50%" label="Default Color" progressValue={50} />);
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar.querySelector('[class*="bg-primary"]')).toBeInTheDocument();
      });
    });

    it('applies correct progress bar container styling', () => {
      render(<Stats value="45%" label="Progress Test" progressValue={45} />);
      
      const progressContainer = screen.getByRole('progressbar');
      expect(progressContainer).toHaveClass('relative', 'overflow-hidden', 'bg-subtle', 'border', 'border-text-primary', 'h-1', 'brutal-transition');
    });

    describe('Progress Edge Cases', () => {
      const edgeCases = [
        {
          name: 'handles fractional values',
          props: { value: '33.7%', label: 'Precise Progress', progressValue: 33.7 },
          test: () => {
            const progressBar = screen.getByRole('progressbar');
            const progressFill = progressBar.firstChild as HTMLElement;
            expect(progressFill).toHaveStyle('width: 33.7%');
            expect(progressBar).toHaveAttribute('aria-valuenow', '33.7');
          }
        },
        {
          name: 'handles zero progress',
          props: { value: '0%', label: 'Not Started', progressValue: 0 },
          test: () => {
            const progressBar = screen.getByRole('progressbar');
            const progressFill = progressBar.firstChild as HTMLElement;
            expect(progressFill).toHaveStyle('width: 0%');
          }
        },
        {
          name: 'works without subtitle',
          props: { value: '58%', label: 'Simple Progress', progressValue: 58 },
          test: () => {
            expect(screen.getByText('58%')).toBeInTheDocument();
            expect(screen.getByText('Simple Progress')).toBeInTheDocument();
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
          }
        }
      ];

      edgeCases.forEach(({ name, props, test }) => {
        it(name, () => {
          render(<Stats {...props} />);
          test();
        });
      });
    });
  });
});