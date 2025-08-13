import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatCard } from '../../../src/components/variations/StatCard';

// Helper function to render StatCard
const renderStatCard = (props = {}) => {
  const defaultProps = {
    label: 'Test Label',
    value: 100
  };
  
  return render(<StatCard {...defaultProps} {...props} />);
};

// Helper function to get value element
const getValueElement = (value = '100') => screen.getByText(value.toString());

describe('StatCard', () => {
  const basicTests = [
    {
      name: 'renders label and value correctly',
      props: { label: 'Total Manuals', value: 47 },
      test: () => {
        expect(screen.getByText('Total Manuals')).toBeInTheDocument();
        expect(screen.getByText('47')).toBeInTheDocument();
      }
    },
    {
      name: 'renders with default props',
      props: { label: 'Default Card', value: 100 },
      test: () => {
        const value = getValueElement();
        expect(value).toBeInTheDocument();
        expect(value).toHaveClass('text-5xl', 'md:text-6xl', 'lg:text-7xl', 'text-white');
      }
    }
  ];

  basicTests.forEach(({ name, props, test }) => {
    it(name, () => {
      renderStatCard(props);
      test();
    });
  });

  const sizeTests = [
    {
      name: 'renders small size correctly',
      props: { label: 'Small Card', value: '25', size: 'sm' },
      expectedClasses: ['text-2xl', 'md:text-3xl']
    },
    {
      name: 'renders medium size correctly',
      props: { label: 'Medium Card', value: '50', size: 'md' },
      expectedClasses: ['text-4xl', 'md:text-5xl']
    },
    {
      name: 'renders large size correctly',
      props: { label: 'Large Card', value: '100', size: 'lg' },
      expectedClasses: ['text-5xl', 'md:text-6xl', 'lg:text-7xl']
    }
  ];

  describe('sizes', () => {
    sizeTests.forEach(({ name, props, expectedClasses }) => {
      it(name, () => {
        renderStatCard(props);
        const value = getValueElement(props.value);
        
        expectedClasses.forEach(className => {
          expect(value).toHaveClass(className);
        });
      });
    });
  });

  const variantTests = [
    { name: 'renders default variant with dark text', variant: 'default', value: '10', expectedColor: 'text-text-primary' },
    { name: 'renders subtle variant with dark text', variant: 'subtle', value: '20', expectedColor: 'text-text-primary' },
    { name: 'renders primary variant with white text', variant: 'primary', value: '30', expectedColor: 'text-white' },
    { name: 'renders secondary variant with white text', variant: 'secondary', value: '40', expectedColor: 'text-white' },
    { name: 'renders accent variant with white text', variant: 'accent', value: '50', expectedColor: 'text-white' },
    { name: 'renders danger variant with white text', variant: 'danger', value: '60', expectedColor: 'text-white' },
    { name: 'renders dark variant with white text', variant: 'dark', value: '70', expectedColor: 'text-white' }
  ];

  describe('variants and color mapping', () => {
    variantTests.forEach(({ name, variant, value, expectedColor }) => {
      it(name, () => {
        renderStatCard({ label: variant.charAt(0).toUpperCase() + variant.slice(1), value, variant });
        const valueElement = getValueElement(value);
        expect(valueElement).toHaveClass(expectedColor);
      });
    });
  });

  const subtitleTests = [
    {
      name: 'renders subtitle when provided',
      props: { label: 'Total Manuals', value: 47, subtitle: '+3 This Month' },
      test: () => {
        expect(screen.getByText('+3 This Month')).toBeInTheDocument();
      }
    },
    {
      name: 'does not render subtitle when not provided',
      props: { label: 'Total Manuals', value: 47 },
      test: () => {
        expect(screen.queryByText('+3 This Month')).not.toBeInTheDocument();
      }
    }
  ];

  describe('subtitle', () => {
    subtitleTests.forEach(({ name, props, test }) => {
      it(name, () => {
        renderStatCard(props);
        test();
      });
    });
  });

  const cardPropsTests = [
    {
      name: 'passes Card props correctly',
      props: {
        label: 'Card Props',
        value: 100,
        shadow: 'double',
        rotation: 'slight-left',
        className: 'custom-class',
        testId: 'custom-stat-card'
      },
      test: () => {
        const card = screen.getByTestId('custom-stat-card');
        expect(card).toHaveClass('custom-class');
      }
    },
    {
      name: 'handles hover and click events',
      props: {
        label: 'Clickable',
        value: 42,
        hover: true,
        onClick: vi.fn()
      },
      test: () => {
        const card = screen.getByTestId('card');
        fireEvent.click(card);
        expect(vi.mocked(cardPropsTests[1].props.onClick)).toHaveBeenCalledTimes(1);
      }
    },
    {
      name: 'applies shadow variants',
      props: {
        label: 'Shadow Test',
        value: 123,
        shadow: 'primary',
        testId: 'shadow-card'
      },
      test: () => {
        expect(screen.getByTestId('shadow-card')).toBeInTheDocument();
      }
    }
  ];

  describe('Card props delegation', () => {
    cardPropsTests.forEach(({ name, props, test }) => {
      it(name, () => {
        renderStatCard(props);
        test();
      });
    });
  });

  const valueTypeTests = [
    { name: 'renders string values correctly', props: { label: 'String Value', value: '$2,340' } },
    { name: 'renders numeric values correctly', props: { label: 'Numeric Value', value: 12345 } },
    { name: 'renders zero values correctly', props: { label: 'Zero Value', value: 0 } }
  ];

  describe('value types', () => {
    valueTypeTests.forEach(({ name, props }) => {
      it(name, () => {
        renderStatCard(props);
        expect(screen.getByText(props.value.toString())).toBeInTheDocument();
      });
    });
  });

  const realWorldExamples = [
    {
      name: 'renders dashboard manual count card',
      props: {
        label: 'Total Manuals',
        value: 47,
        subtitle: '+3 This Month',
        size: 'md',
        variant: 'dark',
        rotation: 'left',
        shadow: 'double',
        hover: true,
        hoverEffect: 'lift'
      },
      tests: [
        () => expect(screen.getByText('47')).toHaveClass('text-4xl', 'md:text-5xl', 'text-white'),
        () => expect(screen.getByText('Total Manuals')).toHaveClass('text-white'),
        () => expect(screen.getByText('+3 This Month')).toBeInTheDocument()
      ]
    },
    {
      name: 'renders pending tasks card',
      props: {
        label: 'Pending Tasks',
        value: 5,
        subtitle: '2 Due Soon',
        size: 'md',
        variant: 'secondary',
        rotation: 'slight-right',
        shadow: 'double',
        hover: true,
        hoverEffect: 'lift'
      },
      tests: [
        () => expect(screen.getByText('5')).toHaveClass('text-white'),
        () => expect(screen.getByText('Pending Tasks')).toBeInTheDocument(),
        () => expect(screen.getByText('2 Due Soon')).toBeInTheDocument()
      ]
    },
    {
      name: 'renders completed tasks card',
      props: {
        label: 'Completed',
        value: 12,
        subtitle: 'This Month',
        size: 'md',
        variant: 'accent',
        rotation: 'slight-left',
        shadow: 'double',
        hover: true,
        hoverEffect: 'lift'
      },
      tests: [
        () => expect(screen.getByText('12')).toHaveClass('text-white')
      ]
    },
    {
      name: 'renders small floating stat card',
      props: {
        size: 'sm',
        className: 'absolute -top-16 -right-8 hidden lg:block',
        label: 'Manuals Stored',
        value: 47,
        variant: 'primary',
        rotation: 'slight-right'
      },
      tests: [
        () => expect(screen.getByText('47')).toHaveClass('text-2xl', 'md:text-3xl'),
        () => {
          const card = screen.getByTestId('card') || screen.getByText('47').closest('div');
          expect(card).toHaveClass('absolute', '-top-16', '-right-8');
        }
      ]
    },
    {
      name: 'renders tasks completed card with bottom positioning',
      props: {
        size: 'sm',
        className: 'absolute -bottom-24 -left-16 hidden lg:block',
        label: 'Tasks Completed',
        value: 12,
        variant: 'accent',
        rotation: 'left'
      },
      tests: [
        () => expect(screen.getByText('12')).toHaveClass('text-white'),
        () => {
          const card = screen.getByTestId('card') || screen.getByText('12').closest('div');
          expect(card).toHaveClass('absolute', '-bottom-24', '-left-16');
        }
      ]
    }
  ];

  describe('real-world usage examples', () => {
    realWorldExamples.forEach(({ name, props, tests }) => {
      it(name, () => {
        renderStatCard(props);
        tests.forEach(test => test());
      });
    });
  });
});