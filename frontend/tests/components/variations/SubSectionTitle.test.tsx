import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SubSectionTitle } from '../../../src/components/variations/SubSectionTitle';

// Helper function to render SubSectionTitle and get heading element
const renderSubSectionTitle = (children = 'Subsection Title', props = {}) => {
  render(<SubSectionTitle {...props}>{children}</SubSectionTitle>);
  return screen.getByRole('heading', { level: 3 });
};

describe('SubSectionTitle', () => {
  const subSectionTitleTests = [
    {
      name: 'renders as h3 (subsection variant)',
      test: () => {
        const heading = renderSubSectionTitle();
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Subsection Title');
      }
    },
    {
      name: 'applies subsection variant styles',
      test: () => {
        const heading = renderSubSectionTitle();
        const expectedClasses = [
          'font-mono', 'font-black', 'uppercase', 'tracking-wide', 'leading-none',
          'text-text-primary', 'text-3xl', 'md:text-3xl', 'lg:text-4xl', 'mb-3'
        ];
        expectedClasses.forEach(className => {
          expect(heading).toHaveClass(className);
        });
      }
    }
  ];

  subSectionTitleTests.forEach(({ name, test }) => {
    it(name, test);
  });
});