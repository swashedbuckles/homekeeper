import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Title } from '../../../src/components/common/Title';

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
});