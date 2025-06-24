import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SubsectionTitle } from '../../../src/components/variations/SubSectionTitle';

describe('SubsectionTitle', () => {
  it('renders as h3 (subsection variant)', () => {
    render(<SubsectionTitle>Subsection Title</SubsectionTitle>);
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Subsection Title');
  });

  it('applies subsection variant styles', () => {
    render(<SubsectionTitle>Subsection Title</SubsectionTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-base', 'md:text-lg', 'font-semibold', 'text-text-primary');
  });

  it('accepts PageTitle props except variant', () => {
    render(<SubsectionTitle className="custom-class" description="Subsection description">Subsection</SubsectionTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('custom-class');
    expect(screen.getByText('Subsection description')).toBeInTheDocument();
  });
});