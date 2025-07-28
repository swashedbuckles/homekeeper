import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from '../../../src/components/common/Text';

describe('Text', () => {
  it('renders children correctly', () => {
    render(<Text>Test Text</Text>);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<Text>Default Text</Text>);
    const text = screen.getByTestId('text');
    
    expect(text).toHaveClass('text-sm', 'md:text-base'); // responsive default size medium
    expect(text).toHaveClass('text-text-primary'); // default color dark
  });

  describe('variants', () => {
    it('renders body variant correctly', () => {
      render(<Text variant="body">Body text</Text>);
      const text = screen.getByTestId('text');
      
      expect(text.tagName).toBe('SPAN');
      expect(text).toHaveClass('text-sm', 'md:text-base'); // responsive sizing
    });

    it('renders caption variant correctly', () => {
      render(<Text variant="caption">Caption text</Text>);
      const text = screen.getByTestId('text');
      
      expect(text.tagName).toBe('SPAN');
      expect(text).toHaveClass('text-xs', 'md:text-sm'); // smaller size with responsive scaling
    });

    it('renders label variant correctly', () => {
      render(<Text variant="label">Label text</Text>);
      const text = screen.getByTestId('text');
      
      expect(text.tagName).toBe('SPAN');
      expect(text).toHaveClass('text-xs', 'md:text-sm'); // smaller size with responsive scaling
      expect(text).toHaveClass('tracking-wide'); // label specific styling
    });
  });

  describe('sizes', () => {
    it('renders small size correctly', () => {
      render(<Text size="sm">Small text</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-xs', 'md:text-sm'); // responsive small size
    });

    it('renders medium size correctly', () => {
      render(<Text size="md">Medium text</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-sm', 'md:text-base'); // responsive medium size
    });

    it('renders large size correctly', () => {
      render(<Text size="lg">Large text</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-base', 'md:text-lg'); // responsive large size
    });

    it('renders extra large size correctly', () => {
      render(<Text size="xl">Extra large text</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-lg', 'md:text-xl'); // responsive extra large size
    });

    it('renders 2xl size correctly', () => {
      render(<Text size="2xl">2XL text</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-xl', 'md:text-2xl'); // responsive 2xl size
    });

    it('renders 3xl size correctly', () => {
      render(<Text size="3xl">3XL text</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-2xl', 'md:text-3xl'); // responsive 3xl size
    });
  });

  describe('weights', () => {
    it('renders normal weight correctly', () => {
      render(<Text weight="normal">Normal weight</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('font-normal');
    });

    it('renders bold weight correctly', () => {
      render(<Text weight="bold">Bold weight</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('font-bold');
    });

    it('renders black weight correctly', () => {
      render(<Text weight="black">Black weight</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('font-black');
    });
  });

  describe('colors', () => {
    it('renders primary color correctly', () => {
      render(<Text color="primary">Primary color</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-primary');
    });

    it('renders secondary color correctly', () => {
      render(<Text color="secondary">Secondary color</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-text-secondary');
    });

    it('renders dark color correctly', () => {
      render(<Text color="dark">Dark color</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-text-primary');
    });

    it('renders error color correctly', () => {
      render(<Text color="error">Error color</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-error');
    });

    it('renders white color correctly', () => {
      render(<Text color="white">White color</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('text-white');
    });
  });

  describe('uppercase prop', () => {
    it('applies uppercase when true', () => {
      render(<Text uppercase>Uppercase text</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).toHaveClass('uppercase');
    });

    it('does not apply uppercase when false', () => {
      render(<Text uppercase={false}>Normal case</Text>);
      const text = screen.getByTestId('text');
      
      expect(text).not.toHaveClass('uppercase');
    });
  });

  it('applies custom className', () => {
    render(<Text className="custom-class">Custom class</Text>);
    const text = screen.getByTestId('text');
    
    expect(text).toHaveClass('custom-class');
  });

  it('uses custom testId', () => {
    render(<Text testId="custom-text">Custom test ID</Text>);
    
    expect(screen.getByTestId('custom-text')).toBeInTheDocument();
  });

  it('applies base styles consistently', () => {
    render(<Text>Base styles</Text>);
    const text = screen.getByTestId('text');
    
    expect(text).toHaveClass('font-mono', 'leading-normal');
  });

  describe('real-world usage examples', () => {
    it('renders body text for descriptions', () => {
      render(
        <Text variant="body" size="lg" weight="bold" uppercase className="mb-0">
          Here's what's happening with your home maintenance.
        </Text>
      );
      
      const text = screen.getByText("Here's what's happening with your home maintenance.");
      expect(text).toHaveClass('text-base', 'md:text-lg', 'font-bold', 'uppercase', 'mb-0');
      expect(text.tagName).toBe('SPAN');
    });

    it('renders caption text for subtitles', () => {
      render(
        <Text variant="caption" size="sm" weight="bold" color="secondary" uppercase>
          Kitchen Appliances • 2 hours ago
        </Text>
      );
      
      const text = screen.getByText('Kitchen Appliances • 2 hours ago');
      expect(text).toHaveClass('text-xs', 'text-text-secondary', 'uppercase');
      expect(text.tagName).toBe('SPAN');
    });

    it('renders label text for form fields', () => {
      render(
        <Text variant="label" size="md" weight="bold" color="dark">
          HVAC Filter Change
        </Text>
      );
      
      const text = screen.getByText('HVAC Filter Change');
      expect(text).toHaveClass('text-xs', 'md:text-sm', 'text-text-primary');
      expect(text.tagName).toBe('SPAN');
    });

    it('renders white text for dark backgrounds', () => {
      render(
        <Text variant="caption" size="sm" weight="bold" color="white" uppercase>
          © 2025 HomeKeeper. All rights reserved.
        </Text>
      );
      
      const text = screen.getByText('© 2025 HomeKeeper. All rights reserved.');
      expect(text).toHaveClass('text-white', 'uppercase');
    });
  });
});