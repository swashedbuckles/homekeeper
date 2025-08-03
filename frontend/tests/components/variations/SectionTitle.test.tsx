import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionTitle } from '../../../src/components/variations/SectionTitle';

// Helper function to render SectionTitle and get heading element
const renderSectionTitle = (children = 'Section Title', props = {}) => {
  render(<SectionTitle {...props}>{children}</SectionTitle>);
  return screen.getByRole('heading', { level: 2 });
};

describe('SectionTitle', () => {
  const sectionTitleTests = [
    {
      name: 'renders as h2 (section variant)',
      test: () => {
        const heading = renderSectionTitle();
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Section Title');
      }
    },
    {
      name: 'applies section variant styles',
      test: () => {
        const heading = renderSectionTitle();
        const expectedClasses = [
          'font-mono', 'font-black', 'uppercase', 'tracking-wide', 
          'text-text-primary', 'leading-none', 'text-3xl', 'md:text-5xl', 'mb-4'
        ];
        expectedClasses.forEach(className => {
          expect(heading).toHaveClass(className);
        });
      }
    }
  ];

  sectionTitleTests.forEach(({ name, test }) => {
    it(name, test);
  });
});