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
});