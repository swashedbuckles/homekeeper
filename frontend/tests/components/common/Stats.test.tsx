import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stats } from '../../../src/components/common/Stats';

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
    it('renders small size correctly', () => {
      render(<Stats value={25} label="Small Stats" size="sm" />);
      
      const value = screen.getByText('25');
      const label = screen.getByText('Small Stats');
      
      expect(value).toHaveClass('text-2xl', 'md:text-3xl');
      expect(label).toHaveClass('text-sm', 'mt-1');
    });

    it('renders medium size correctly', () => {
      render(<Stats value={50} label="Medium Stats" size="md" />);
      
      const value = screen.getByText('50');
      const label = screen.getByText('Medium Stats');
      
      expect(value).toHaveClass('text-4xl', 'md:text-5xl');
      expect(label).toHaveClass('text-base', 'mt-2');
    });

    it('renders large size correctly', () => {
      render(<Stats value={100} label="Large Stats" size="lg" />);
      
      const value = screen.getByText('100');
      const label = screen.getByText('Large Stats');
      
      expect(value).toHaveClass('text-5xl', 'md:text-6xl', 'lg:text-7xl');
      expect(label).toHaveClass('text-lg', 'mt-3');
    });
  });

  describe('colors', () => {
    it('renders primary color correctly', () => {
      render(<Stats value={10} label="Primary" color="primary" />);
      
      const value = screen.getByText('10');
      const label = screen.getByText('Primary');
      
      expect(value).toHaveClass('text-primary');
      expect(label).toHaveClass('text-text-primary');
    });

    it('renders secondary color correctly', () => {
      render(<Stats value={20} label="Secondary" color="secondary" />);
      
      const value = screen.getByText('20');
      const label = screen.getByText('Secondary');
      
      expect(value).toHaveClass('text-text-secondary');
      expect(label).toHaveClass('text-text-primary');
    });

    it('renders accent color correctly', () => {
      render(<Stats value={30} label="Accent" color="accent" />);
      
      const value = screen.getByText('30');
      const label = screen.getByText('Accent');
      
      expect(value).toHaveClass('text-accent');
      expect(label).toHaveClass('text-text-primary');
    });

    it('renders dark color correctly', () => {
      render(<Stats value={40} label="Dark" color="dark" />);
      
      const value = screen.getByText('40');
      const label = screen.getByText('Dark');
      
      expect(value).toHaveClass('text-text-primary');
      expect(label).toHaveClass('text-text-primary');
    });

    it('renders error color correctly', () => {
      render(<Stats value={50} label="Error" color="error" />);
      
      const value = screen.getByText('50');
      const label = screen.getByText('Error');
      
      expect(value).toHaveClass('text-error');
      expect(label).toHaveClass('text-text-primary');
    });

    it('renders white color correctly', () => {
      render(<Stats value={60} label="White" color="white" />);
      
      const value = screen.getByText('60');
      const label = screen.getByText('White');
      
      expect(value).toHaveClass('text-white');
      expect(label).toHaveClass('text-white');
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
    it('renders dashboard manual count', () => {
      render(
        <Stats 
          value={47} 
          label="Total Manuals" 
          subtitle="+3 This Month"
          size="lg"
          color="primary"
        />
      );
      
      expect(screen.getByText('47')).toHaveClass('text-5xl', 'text-primary');
      expect(screen.getByText('Total Manuals')).toHaveClass('text-lg');
      expect(screen.getByText('+3 This Month')).toHaveClass('text-base');
    });

    it('renders overdue tasks counter', () => {
      render(
        <Stats 
          value={5} 
          label="Pending Tasks" 
          subtitle="2 Due Soon"
          size="md"
          color="error"
        />
      );
      
      expect(screen.getByText('5')).toHaveClass('text-error');
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
      expect(screen.getByText('2 Due Soon')).toBeInTheDocument();
    });

    it('renders completion statistics', () => {
      render(
        <Stats 
          value={12} 
          label="Completed" 
          subtitle="This Month"
          size="md"
          color="accent"
        />
      );
      
      const value = screen.getByText('12');
      expect(value).toHaveClass('text-accent', 'text-4xl');
    });

    it('renders white stats for dark backgrounds', () => {
      render(
        <Stats 
          value="Quick Actions"
          label="Available Now"
          size="lg"
          color="white"
        />
      );
      
      const value = screen.getByText('Quick Actions');
      const label = screen.getByText('Available Now');
      expect(value).toHaveClass('text-white');
      expect(label).toHaveClass('text-white');
    });

    it('renders small compact stats', () => {
      render(
        <Stats 
          value={47} 
          label="Manuals Stored"
          size="sm"
          color="primary"
        />
      );
      
      const value = screen.getByText('47');
      const label = screen.getByText('Manuals Stored');
      expect(value).toHaveClass('text-2xl', 'md:text-3xl');
      expect(label).toHaveClass('text-sm', 'mt-1');
    });
  });

  describe('Progress Functionality (Enhanced)', () => {
    it('does not render progress bar when progressValue is not provided', () => {
      render(<Stats value={47} label="No Progress" />);
      
      const stats = screen.getByTestId('stats');
      expect(stats.querySelector('.h-2')).not.toBeInTheDocument(); // No progress bar
    });

    it('renders progress bar when progressValue is provided', () => {
      render(
        <Stats 
          value="85%" 
          label="Equipment Health" 
          progressValue={85}
          progressColor="accent"
        />
      );
      
      const stats = screen.getByTestId('stats');
      const progressContainer = stats.querySelector('[role="progressbar"]');
      expect(progressContainer).toBeInTheDocument();
    });

    it('applies correct progress value and aria attributes', () => {
      render(
        <Stats 
          value="60%" 
          label="Task Completion" 
          progressValue={60}
        />
      );
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '60');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('clamps progress values outside 0-100 range', () => {
      render(
        <Stats 
          value="150%" 
          label="Over Limit" 
          progressValue={150}
        />
      );
      
      const progressBar = screen.getByRole('progressbar');
      const progressFill = progressBar.firstChild as HTMLElement;
      expect(progressFill).toHaveStyle('width: 100%');
    });

    it('handles negative progress values', () => {
      render(
        <Stats 
          value="-10%" 
          label="Negative" 
          progressValue={-10}
        />
      );
      
      const progressBar = screen.getByRole('progressbar');
      const progressFill = progressBar.firstChild as HTMLElement;
      expect(progressFill).toHaveStyle('width: 0%');
    });

    describe('Progress Colors', () => {
      it('applies accent color for success metrics', () => {
        render(
          <Stats 
            value="94%" 
            label="System Health" 
            progressValue={94}
            progressColor="accent"
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar.querySelector('[class*="bg-accent"]')).toBeInTheDocument();
      });

      it('applies primary color for general metrics', () => {
        render(
          <Stats 
            value="67%" 
            label="Progress" 
            progressValue={67}
            progressColor="primary"
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar.querySelector('[class*="bg-primary"]')).toBeInTheDocument();
      });

      it('applies error color for critical metrics', () => {
        render(
          <Stats 
            value="15%" 
            label="Critical Status" 
            progressValue={15}
            progressColor="error"
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar.querySelector('[class*="bg-error"]')).toBeInTheDocument();
      });

      it('applies secondary color for informational metrics', () => {
        render(
          <Stats 
            value="72%" 
            label="Information" 
            progressValue={72}
            progressColor="secondary"
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar.querySelector('[class*="bg-secondary"]')).toBeInTheDocument();
      });

      it('defaults to primary color when progressColor not specified', () => {
        render(
          <Stats 
            value="50%" 
            label="Default Color" 
            progressValue={50}
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar.querySelector('[class*="bg-primary"]')).toBeInTheDocument();
      });
    });

    describe('Progress Bar Styling', () => {
      it('applies correct progress bar container styling', () => {
        render(
          <Stats 
            value="45%" 
            label="Progress Test" 
            progressValue={45}
          />
        );
        
        const progressContainer = screen.getByRole('progressbar');
        expect(progressContainer).toHaveClass('relative overflow-hidden bg-subtle border border-text-primary h-1 brutal-transition');
      });

      it('applies progress bar size correctly (xs)', () => {
        render(
          <Stats 
            value="75%" 
            label="Small Progress" 
            progressValue={75}
            size="xs"
          />
        );
        const stats = screen.getByTestId('stats');
        const progressContainer = stats.querySelector('[role="progressbar"]');
        expect(progressContainer).toHaveClass('h-1');
      });
    });

    describe('Real-world Progress Examples', () => {
      it('renders equipment health with progress', () => {
        render(
          <Stats 
            value="94%" 
            label="HVAC System Health" 
            subtitle="Last service: 2 months ago"
            size="lg" 
            color="accent"
            progressValue={94}
            progressColor="accent"
          />
        );
        
        expect(screen.getByText('94%')).toHaveClass('text-accent');
        expect(screen.getByText('HVAC System Health')).toBeInTheDocument();
        expect(screen.getByText('Last service: 2 months ago')).toBeInTheDocument();
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '94');
        expect(progressBar.querySelector('[class*="bg-accent"]')).toBeInTheDocument();
      });

      it('renders task completion progress', () => {
        render(
          <Stats 
            value="8/10" 
            label="Daily Tasks" 
            subtitle="Almost done!"
            size="md" 
            color="accent"
            progressValue={80}
            progressColor="accent"
          />
        );
        
        expect(screen.getByText('8/10')).toBeInTheDocument();
        expect(screen.getByText('Daily Tasks')).toBeInTheDocument();
        
        const progressBar = screen.getByRole('progressbar');
        const progressFill = progressBar.firstChild as HTMLElement;
        expect(progressFill).toHaveStyle('width: 80%');
      });

      it('renders critical status with error progress', () => {
        render(
          <Stats 
            value="23%" 
            label="Kitchen Appliances" 
            subtitle="Multiple issues"
            size="sm" 
            color="error"
            progressValue={23}
            progressColor="error"
          />
        );
        
        expect(screen.getByText('23%')).toHaveClass('text-error');
        expect(screen.getByText('Kitchen Appliances')).toBeInTheDocument();
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar.querySelector('[class*="bg-error"]')).toBeInTheDocument();
      });

      it('renders completed task (100%) progress', () => {
        render(
          <Stats 
            value="12/12" 
            label="Annual Tasks" 
            subtitle="Complete!"
            size="md" 
            color="accent"
            progressValue={100}
            progressColor="accent"
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        const progressFill = progressBar.firstChild as HTMLElement;
        expect(progressFill).toHaveStyle('width: 100%');
        expect(progressBar).toHaveAttribute('aria-valuenow', '100');
      });

      it('renders low progress warning state', () => {
        render(
          <Stats 
            value="3/20" 
            label="Monthly Goals" 
            subtitle="Need to catch up"
            size="md" 
            color="primary"
            progressValue={15}
            progressColor="primary"
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        const progressFill = progressBar.firstChild as HTMLElement;
        expect(progressFill).toHaveStyle('width: 15%');
        expect(progressBar.querySelector('[class*="bg-primary"]')).toBeInTheDocument();
      });
    });

    describe('Progress Integration with Size Variants', () => {
      it('works correctly with extra small stats', () => {
        render(
          <Stats 
            value="29%" 
            label="Extra Small" 
            subtitle="Minimal space"
            size="xs" 
            color="error"
            progressValue={29}
            progressColor="error"
          />
        );
        
        const value = screen.getByText('29%');
        expect(value).toHaveClass('text-xl', 'md:text-2xl'); // xs size classes
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
      });

      it('works correctly with extra large stats', () => {
        render(
          <Stats 
            value="92%" 
            label="Extra Large Display" 
            subtitle="Prominent dashboard metric"
            size="xl" 
            color="primary"
            progressValue={92}
            progressColor="primary"
          />
        );
        
        const value = screen.getByText('92%');
        expect(value).toHaveClass('text-6xl', 'md:text-7xl', 'lg:text-8xl'); // xl size classes
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
      });
    });

    describe('Progress Accessibility', () => {
      // it('includes proper ARIA labels from the label prop', () => {
      //   render(
      //     <Stats 
      //       value="67%" 
      //       label="System Performance" 
      //       progressValue={67}
      //     />
      //   );
        
      //   const progressBar = screen.getByRole('progressbar');
      // });

      it('provides complete progress information to screen readers', () => {
        render(
          <Stats 
            value="45%" 
            label="Upload Progress" 
            progressValue={45}
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '45');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      });
    });

    describe('Progress Edge Cases', () => {
      it('handles fractional progress values correctly', () => {
        render(
          <Stats 
            value="33.7%" 
            label="Precise Progress" 
            progressValue={33.7}
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        const progressFill = progressBar.firstChild as HTMLElement;
        expect(progressFill).toHaveStyle('width: 33.7%');
        expect(progressBar).toHaveAttribute('aria-valuenow', '33.7');
      });

      it('handles zero progress correctly', () => {
        render(
          <Stats 
            value="0%" 
            label="Not Started" 
            progressValue={0}
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        const progressFill = progressBar.firstChild as HTMLElement;
        expect(progressFill).toHaveStyle('width: 0%');
      });

      it('works with stats that have only progress (no subtitle)', () => {
        render(
          <Stats 
            value="58%" 
            label="Simple Progress" 
            progressValue={58}
          />
        );
        
        expect(screen.getByText('58%')).toBeInTheDocument();
        expect(screen.getByText('Simple Progress')).toBeInTheDocument();
        expect(screen.queryByText('subtitle')).not.toBeInTheDocument();
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
      });
    });
  });
});