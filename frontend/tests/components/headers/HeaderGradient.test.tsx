import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeaderGradient } from '../../../src/components/headers/HeaderGradient';

// Helper function to render HeaderGradient and get element
const renderHeaderGradient = () => {
  render(<HeaderGradient />);
  return screen.getByRole('presentation', { hidden: true });
};

describe('HeaderGradient', () => {
  const gradientTests = [
    {
      name: 'renders gradient bar with correct positioning and sizing classes',
      expectedClasses: ['absolute', 'bottom-0', 'left-0', 'w-full', 'h-2', 'bg-gradient-to-r']
    },
    {
      name: 'applies the multi-color gradient classes',
      expectedClasses: ['from-primary', 'via-secondary', 'via-accent', 'to-error']
    }
  ];

  gradientTests.forEach(({ name, expectedClasses }) => {
    it(name, () => {
      const gradient = renderHeaderGradient();
      expectedClasses.forEach(className => {
        expect(gradient).toHaveClass(className);
      });
    });
  });
});