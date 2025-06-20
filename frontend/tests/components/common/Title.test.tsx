import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageTitle } from '../../../src/components/common/Title';

describe('PageTitle', () => {
  it('renders children content', () => {
    render(<PageTitle>Test Title</PageTitle>);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders as h1 by default (page variant)', () => {
    render(<PageTitle>Page Title</PageTitle>);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders as h2 for section variant', () => {
    render(<PageTitle variant="section">Section Title</PageTitle>);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('renders as h3 for subsection variant', () => {
    render(<PageTitle variant="subsection">Subsection Title</PageTitle>);
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('applies correct styles for page variant', () => {
    render(<PageTitle variant="page">Page Title</PageTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-2xl', 'md:text-3xl', 'font-bold', 'text-text-primary');
  });

  it('applies correct styles for section variant', () => {
    render(<PageTitle variant="section">Section Title</PageTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-lg', 'md:text-xl', 'font-semibold', 'text-text-primary');
  });

  it('applies correct styles for subsection variant', () => {
    render(<PageTitle variant="subsection">Subsection Title</PageTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-base', 'md:text-lg', 'font-semibold', 'text-text-primary');
  });

  it('renders description when provided', () => {
    render(<PageTitle description="Test description">Title</PageTitle>);
    
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<PageTitle className="custom-class">Title</PageTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('custom-class');
  });
});