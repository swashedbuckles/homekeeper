import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from '../../../src/components/common/Text';

// Helper function to render Text and get text element
const renderText = (children = 'Test Text', props = {}) => {
  render(<Text {...props}>{children}</Text>);
  return screen.getByTestId(props.testId || 'text');
};

describe('Text', () => {
  it('renders children correctly', () => {
    renderText();
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    const text = renderText('Default Text');
    expect(text).toHaveClass('text-sm', 'md:text-base', 'text-text-primary');
  });

  const variantTests = [
    {
      name: 'renders body variant correctly',
      variant: 'body',
      expectedClasses: ['text-sm', 'md:text-base']
    },
    {
      name: 'renders caption variant correctly',
      variant: 'caption',
      expectedClasses: ['text-xs', 'md:text-sm']
    },
    {
      name: 'renders label variant correctly',
      variant: 'label',
      expectedClasses: ['text-xs', 'md:text-sm', 'tracking-wide']
    }
  ];

  describe('variants', () => {
    variantTests.forEach(({ name, variant, expectedClasses }) => {
      it(name, () => {
        const text = renderText(`${variant} text`, { variant });
        
        expect(text.tagName).toBe('SPAN');
        expectedClasses.forEach(className => {
          expect(text).toHaveClass(className);
        });
      });
    });
  });

  const sizeTests = [
    { name: 'renders small size correctly', size: 'sm', expectedClasses: ['text-xs', 'md:text-sm'] },
    { name: 'renders medium size correctly', size: 'md', expectedClasses: ['text-sm', 'md:text-base'] },
    { name: 'renders large size correctly', size: 'lg', expectedClasses: ['text-base', 'md:text-lg'] },
    { name: 'renders extra large size correctly', size: 'xl', expectedClasses: ['text-lg', 'md:text-xl'] },
    { name: 'renders 2xl size correctly', size: '2xl', expectedClasses: ['text-xl', 'md:text-2xl'] },
    { name: 'renders 3xl size correctly', size: '3xl', expectedClasses: ['text-2xl', 'md:text-3xl'] }
  ];

  describe('sizes', () => {
    sizeTests.forEach(({ name, size, expectedClasses }) => {
      it(name, () => {
        const text = renderText(`${size} text`, { size });
        expectedClasses.forEach(className => {
          expect(text).toHaveClass(className);
        });
      });
    });
  });

  const weightTests = [
    { name: 'renders normal weight correctly', weight: 'normal', expectedClass: 'font-normal' },
    { name: 'renders bold weight correctly', weight: 'bold', expectedClass: 'font-bold' },
    { name: 'renders black weight correctly', weight: 'black', expectedClass: 'font-black' }
  ];

  describe('weights', () => {
    weightTests.forEach(({ name, weight, expectedClass }) => {
      it(name, () => {
        const text = renderText(`${weight} weight`, { weight });
        expect(text).toHaveClass(expectedClass);
      });
    });
  });

  const colorTests = [
    { name: 'renders primary color correctly', color: 'primary', expectedClass: 'text-primary' },
    { name: 'renders secondary color correctly', color: 'secondary', expectedClass: 'text-text-secondary' },
    { name: 'renders dark color correctly', color: 'dark', expectedClass: 'text-text-primary' },
    { name: 'renders error color correctly', color: 'error', expectedClass: 'text-error' },
    { name: 'renders white color correctly', color: 'white', expectedClass: 'text-white' }
  ];

  describe('colors', () => {
    colorTests.forEach(({ name, color, expectedClass }) => {
      it(name, () => {
        const text = renderText(`${color} color`, { color });
        expect(text).toHaveClass(expectedClass);
      });
    });
  });

  const uppercaseTests = [
    { name: 'applies uppercase when true', uppercase: true, shouldHaveClass: true },
    { name: 'does not apply uppercase when false', uppercase: false, shouldHaveClass: false }
  ];

  describe('uppercase prop', () => {
    uppercaseTests.forEach(({ name, uppercase, shouldHaveClass }) => {
      it(name, () => {
        const text = renderText('case text', { uppercase });
        if (shouldHaveClass) {
          expect(text).toHaveClass('uppercase');
        } else {
          expect(text).not.toHaveClass('uppercase');
        }
      });
    });
  });

  const propTests = [
    {
      name: 'applies custom className',
      props: { className: 'custom-class' },
      test: (text: HTMLElement) => expect(text).toHaveClass('custom-class')
    },
    {
      name: 'uses custom testId',
      props: { testId: 'custom-text' },
      test: () => expect(screen.getByTestId('custom-text')).toBeInTheDocument()
    },
    {
      name: 'applies base styles consistently',
      props: {},
      test: (text: HTMLElement) => expect(text).toHaveClass('font-mono', 'leading-normal')
    }
  ];

  propTests.forEach(({ name, props, test }) => {
    it(name, () => {
      const text = renderText('test text', props);
      test(text);
    });
  });

  const realWorldExamples = [
    {
      name: 'renders body text for descriptions',
      props: { variant: 'body', size: 'lg', weight: 'bold', uppercase: true, className: 'mb-0' },
      content: "Here's what's happening with your home maintenance.",
      expectedClasses: ['text-base', 'md:text-lg', 'font-bold', 'uppercase', 'mb-0']
    },
    {
      name: 'renders caption text for subtitles',
      props: { variant: 'caption', size: 'sm', weight: 'bold', color: 'secondary', uppercase: true },
      content: 'Kitchen Appliances • 2 hours ago',
      expectedClasses: ['text-xs', 'text-text-secondary', 'uppercase']
    },
    {
      name: 'renders label text for form fields',
      props: { variant: 'label', size: 'md', weight: 'bold', color: 'dark' },
      content: 'HVAC Filter Change',
      expectedClasses: ['text-xs', 'md:text-sm', 'text-text-primary']
    },
    {
      name: 'renders white text for dark backgrounds',
      props: { variant: 'caption', size: 'sm', weight: 'bold', color: 'white', uppercase: true },
      content: '© 2025 HomeKeeper. All rights reserved.',
      expectedClasses: ['text-white', 'uppercase']
    }
  ];

  describe('real-world usage examples', () => {
    realWorldExamples.forEach(({ name, props, content, expectedClasses }) => {
      it(name, () => {
        render(<Text {...props}>{content}</Text>);
        const text = screen.getByText(content);
        
        expectedClasses.forEach(className => {
          expect(text).toHaveClass(className);
        });
        expect(text.tagName).toBe('SPAN');
      });
    });
  });
});