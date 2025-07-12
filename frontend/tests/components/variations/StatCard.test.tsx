import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatCard } from '../../../src/components/variations/StatCard';

describe('StatCard', () => {
  it('renders label and value correctly', () => {
    render(<StatCard label="Total Manuals" value={47} />);
    
    expect(screen.getByText('Total Manuals')).toBeInTheDocument();
    expect(screen.getByText('47')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<StatCard label="Default Card" value={100} />);
    
    // Check that StatCard renders (may or may not be a button)
    expect(screen.getByText('100')).toBeInTheDocument();
    
    // Check default size (lg -> large) and variant (dark -> white text)
    const value = screen.getByText('100');
    expect(value).toHaveClass('text-5xl', 'md:text-6xl', 'lg:text-7xl', 'text-white');
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<StatCard label="Small Card" value={25} size="sm" />);
      
      const value = screen.getByText('25');
      expect(value).toHaveClass('text-2xl', 'md:text-3xl'); // small Stats size
    });

    it('renders medium size correctly', () => {
      render(<StatCard label="Medium Card" value={50} size="md" />);
      
      const value = screen.getByText('50');
      expect(value).toHaveClass('text-4xl', 'md:text-5xl'); // medium Stats size
    });

    it('renders large size correctly', () => {
      render(<StatCard label="Large Card" value={100} size="lg" />);
      
      const value = screen.getByText('100');
      expect(value).toHaveClass('text-5xl', 'md:text-6xl', 'lg:text-7xl'); // large Stats size
    });
  });

  describe('variants and color mapping', () => {
    it('renders default variant with dark text', () => {
      render(<StatCard label="Default" value={10} variant="default" />);
      
      const value = screen.getByText('10');
      expect(value).toHaveClass('text-text-primary'); // dark color
    });

    it('renders subtle variant with dark text', () => {
      render(<StatCard label="Subtle" value={20} variant="subtle" />);
      
      const value = screen.getByText('20');
      expect(value).toHaveClass('text-text-primary'); // dark color
    });

    it('renders primary variant with white text', () => {
      render(<StatCard label="Primary" value={30} variant="primary" />);
      
      const value = screen.getByText('30');
      expect(value).toHaveClass('text-white'); // white color
    });

    it('renders secondary variant with white text', () => {
      render(<StatCard label="Secondary" value={40} variant="secondary" />);
      
      const value = screen.getByText('40');
      expect(value).toHaveClass('text-white'); // white color
    });

    it('renders accent variant with white text', () => {
      render(<StatCard label="Accent" value={50} variant="accent" />);
      
      const value = screen.getByText('50');
      expect(value).toHaveClass('text-white'); // white color
    });

    it('renders danger variant with white text', () => {
      render(<StatCard label="Danger" value={60} variant="danger" />);
      
      const value = screen.getByText('60');
      expect(value).toHaveClass('text-white'); // white color
    });

    it('renders dark variant with white text', () => {
      render(<StatCard label="Dark" value={70} variant="dark" />);
      
      const value = screen.getByText('70');
      expect(value).toHaveClass('text-white'); // white color
    });
  });

  describe('subtitle', () => {
    it('renders subtitle when provided', () => {
      render(
        <StatCard 
          label="Total Manuals" 
          value={47} 
          subtitle="+3 This Month" 
        />
      );
      
      expect(screen.getByText('+3 This Month')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<StatCard label="Total Manuals" value={47} />);
      
      // Subtitle should not exist
      expect(screen.queryByText('+3 This Month')).not.toBeInTheDocument();
    });
  });

  describe('Card props delegation', () => {
    it('passes Card props correctly', () => {
      render(
        <StatCard 
          label="Card Props" 
          value={100}
          shadow="double"
          rotation="slight-left"
          className="custom-class"
          testId="custom-stat-card"
        />
      );
      
      const card = screen.getByTestId('custom-stat-card');
      expect(card).toHaveClass('custom-class');
    });

    it('handles hover and click events', () => {
      const mockClick = vi.fn();
      render(
        <StatCard 
          label="Clickable" 
          value={42}
          hover
          onClick={mockClick}
        />
      );
      
      const card = screen.getByTestId('card');
      fireEvent.click(card);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('applies shadow variants', () => {
      render(
        <StatCard 
          label="Shadow Test" 
          value={123}
          shadow="primary"
          testId="shadow-card"
        />
      );
      
      // Shadow classes should be applied by Card component
      expect(screen.getByTestId('shadow-card')).toBeInTheDocument();
    });
  });

  describe('value types', () => {
    it('renders string values correctly', () => {
      render(<StatCard label="String Value" value="$2,340" />);
      
      expect(screen.getByText('$2,340')).toBeInTheDocument();
    });

    it('renders numeric values correctly', () => {
      render(<StatCard label="Numeric Value" value={12345} />);
      
      expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('renders zero values correctly', () => {
      render(<StatCard label="Zero Value" value={0} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('real-world usage examples', () => {
    it('renders dashboard manual count card', () => {
      render(
        <StatCard
          label="Total Manuals"
          value={47}
          subtitle="+3 This Month"
          size="md"
          variant="dark"
          rotation="left"
          shadow="double"
          hover
          hoverEffect="lift"
        />
      );
      
      expect(screen.getByText('47')).toHaveClass('text-4xl', 'md:text-5xl', 'text-white');
      expect(screen.getByText('Total Manuals')).toHaveClass('text-white');
      expect(screen.getByText('+3 This Month')).toBeInTheDocument();
    });

    it('renders pending tasks card', () => {
      render(
        <StatCard
          label="Pending Tasks"
          value={5}
          subtitle="2 Due Soon"
          size="md"
          variant="secondary"
          rotation="slight-right"
          shadow="double"
          hover
          hoverEffect="lift"
        />
      );
      
      const value = screen.getByText('5');
      expect(value).toHaveClass('text-white'); // secondary variant uses white text
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
      expect(screen.getByText('2 Due Soon')).toBeInTheDocument();
    });

    it('renders completed tasks card', () => {
      render(
        <StatCard
          label="Completed"
          value={12}
          subtitle="This Month"
          size="md"
          variant="accent"
          rotation="slight-left"
          shadow="double"
          hover
          hoverEffect="lift"
        />
      );
      
      const value = screen.getByText('12');
      expect(value).toHaveClass('text-white'); // accent variant uses white text
    });

    it('renders small floating stat card', () => {
      render(
        <StatCard
          size="sm"
          className="absolute -top-16 -right-8 hidden lg:block"
          label="Manuals Stored"
          value={47}
          variant="primary"
          rotation="slight-right"
        />
      );
      
      const value = screen.getByText('47');
      expect(value).toHaveClass('text-2xl', 'md:text-3xl'); // small size
      const card = screen.getByTestId('card') || screen.getByText('47').closest('div');
      expect(card).toHaveClass('absolute', '-top-16', '-right-8');
    });

    it('renders tasks completed card with bottom positioning', () => {
      render(
        <StatCard
          size="sm"
          className="absolute -bottom-24 -left-16 hidden lg:block"
          label="Tasks Completed"
          value={12}
          variant="accent"
          rotation="left"
        />
      );
      
      expect(screen.getByText('12')).toHaveClass('text-white');
      const card = screen.getByTestId('card') || screen.getByText('12').closest('div');
      expect(card).toHaveClass('absolute', '-bottom-24', '-left-16');
    });
  });
});