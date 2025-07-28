import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionTitle } from '../../../src/components/variations/SectionTitle';

describe('SectionTitle', () => {
  it('renders as h2 (section variant)', () => {
    render(<SectionTitle>Section Title</SectionTitle>);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Section Title');
  });

  it('applies section variant styles', () => {
    render(<SectionTitle>Section Title</SectionTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('font-mono', 'font-black', 'uppercase', 'tracking-wide', 'text-text-primary', 'leading-none', 'text-3xl', 'md:text-5xl', 'mb-4');
  });
});