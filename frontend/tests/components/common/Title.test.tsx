import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Title, PageTitle } from '../../../src/components/common/Title';

describe('Title Component', () => {
  describe('Title (primary component)', () => {
    it('renders children content', () => {
      render(<Title>Test Title</Title>);
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders as h1 by default (page variant)', () => {
      render(<Title>Page Title</Title>);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('renders as h1 for hero variant', () => {
      render(<Title variant="hero">Hero Title</Title>);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('applies correct styles for hero variant', () => {
      render(<Title variant="hero">Hero Title</Title>);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('font-mono', 'font-black', 'uppercase', 'tracking-wide', 'text-text-primary', 'leading-none', 'text-5xl', 'md:text-7xl', 'lg:text-8xl', 'mb-6');
    });

    it('applies text shadow when specified', () => {
      render(<Title textShadow="orange">Title with shadow</Title>);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('brutal-text-shadow');
    });

    it('applies rotation when specified', () => {
      render(<Title rotation="slight-left">Rotated Title</Title>);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('brutal-rotate-slight-left');
    });

    it('applies custom testId', () => {
      render(<Title testId="custom-title">Title</Title>);
      
      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    });
  });

describe('PageTitle (legacy alias)', () => {
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
    expect(heading).toHaveClass('font-mono', 'font-black', 'uppercase', 'tracking-wide', 'text-text-primary', 'leading-none', 'text-4xl', 'sm:text-5xl', 'md:text-6xl', 'lg:text-7xl', 'mb-4', 'md:mb-6');
  });

  it('applies correct styles for section variant', () => {
    render(<PageTitle variant="section">Section Title</PageTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('font-mono', 'font-black', 'uppercase', 'tracking-wide', 'text-text-primary', 'leading-none', 'text-3xl', 'md:text-5xl', 'mb-4');
  });

  it('applies correct styles for subsection variant', () => {
    render(<PageTitle variant="subsection">Subsection Title</PageTitle>);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('font-mono', 'font-black', 'uppercase', 'tracking-wide', 'text-text-primary', 'leading-none', 'text-2xl', 'md:text-3xl', 'lg:text-4xl', 'mb-3');
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
});