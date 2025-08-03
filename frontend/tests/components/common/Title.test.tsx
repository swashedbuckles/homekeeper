import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Title } from '../../../src/components/common/Title';

// Helper function to render Title and get heading element
const renderTitle = (children = 'Test Title', props = {}) => {
  render(<Title {...props}>{children}</Title>);
  return screen.getByRole('heading', { level: 1 });
};

describe('Title Component', () => {
  const titleTests = [
    {
      name: 'renders children content',
      test: () => {
        renderTitle();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
      }
    },
    {
      name: 'renders as h1 by default (page variant)',
      test: () => {
        const heading = renderTitle('Page Title');
        expect(heading).toBeInTheDocument();
      }
    },
    {
      name: 'renders as h1 for hero variant',
      test: () => {
        const heading = renderTitle('Hero Title', { variant: 'hero' });
        expect(heading).toBeInTheDocument();
      }
    },
    {
      name: 'applies correct styles for hero variant',
      test: () => {
        const heading = renderTitle('Hero Title', { variant: 'hero' });
        const expectedClasses = [
          'font-mono', 'font-black', 'uppercase', 'tracking-wide', 
          'text-text-primary', 'leading-none', 'text-5xl', 'md:text-7xl', 
          'lg:text-8xl', 'mb-6'
        ];
        expectedClasses.forEach(className => {
          expect(heading).toHaveClass(className);
        });
      }
    },
    {
      name: 'applies text shadow when specified',
      test: () => {
        const heading = renderTitle('Title with shadow', { textShadow: 'orange' });
        expect(heading).toHaveClass('brutal-text-shadow');
      }
    },
    {
      name: 'applies rotation when specified',
      test: () => {
        const heading = renderTitle('Rotated Title', { rotation: 'slight-left' });
        expect(heading).toHaveClass('brutal-rotate-slight-left');
      }
    },
    {
      name: 'applies custom testId',
      test: () => {
        renderTitle('Title', { testId: 'custom-title' });
        expect(screen.getByTestId('custom-title')).toBeInTheDocument();
      }
    }
  ];

  titleTests.forEach(({ name, test }) => {
    it(name, test);
  });
});