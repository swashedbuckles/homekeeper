import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SubSectionTitle } from '../../../src/components/variations/SubSectionTitle';

describe('SubSectionTitle', () => {
  it('renders as h3 (subsection variant)', () => {
    render(<SubSectionTitle>Subsection Title</SubSectionTitle>);
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Subsection Title');
  });

  it('applies subsection variant styles', () => {
    render(<SubSectionTitle>Subsection Title</SubSectionTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('font-mono', 'font-black', 'uppercase', 'tracking-wide', 'text-text-primary', 'leading-none', 'text-2xl', 'md:text-3xl', 'lg:text-4xl', 'mb-3');
  });

  it('accepts PageTitle props except variant', () => {
    render(<SubSectionTitle className="custom-class" description="Subsection description">Subsection</SubSectionTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('custom-class');
    expect(screen.getByText('Subsection description')).toBeInTheDocument();
  });
});