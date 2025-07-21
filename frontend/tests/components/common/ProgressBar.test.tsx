import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from '../../../src/components/common/ProgressBar';

describe('ProgressBar', () => {
  it('renders basic progress bar with default props', () => {
    render(<ProgressBar value={50} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders with custom max value', () => {
    render(<ProgressBar value={75} max={150} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveAttribute('aria-valuemax', '150');
  });

  it('clamps values outside valid range', () => {
    const { rerender } = render(<ProgressBar value={150} max={100} />);
    
    let progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');

    rerender(<ProgressBar value={-10} max={100} />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders label when provided', () => {
    render(<ProgressBar value={60} label="Upload Progress" />);
    
    expect(screen.getByText('Upload Progress')).toBeInTheDocument();
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'Upload Progress');
  });

  it('shows percentage text for medium size and above', () => {
    render(<ProgressBar value={75} showPercentage size="md" />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('shows percentage text for large and extra large sizes', () => {
    const { rerender } = render(
      <ProgressBar value={60} showPercentage size="lg" />
    );
    
    expect(screen.getByText('60%')).toBeInTheDocument();

    rerender(<ProgressBar value={80} showPercentage size="xl" />);
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('suppresses percentage text for extra small and small sizes', () => {
    const { rerender } = render(
      <ProgressBar value={75} showPercentage size="xs" />
    );
    
    expect(screen.queryByText('75%')).not.toBeInTheDocument();

    rerender(<ProgressBar value={75} showPercentage size="sm" />);
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });

  it('does not show percentage text when showPercentage is false', () => {
    render(<ProgressBar value={75} showPercentage={false} size="lg" />);
    
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });

  it('calculates percentage correctly with custom max', () => {
    render(<ProgressBar value={30} max={60} showPercentage size="md" />);
    
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('rounds percentage to nearest integer', () => {
    render(<ProgressBar value={33} max={100} showPercentage size="md" />);
    
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<ProgressBar value={50} className="custom-class" />);
    
    const container = screen.getByRole('progressbar').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('renders with different color variants', () => {
    const { rerender } = render(
      <ProgressBar value={50} variant="primary" />
    );
    
    let progressBar = screen.getByRole('progressbar');
    expect(progressBar.firstChild).toHaveClass('bg-primary');

    rerender(<ProgressBar value={50} variant="secondary" />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar.firstChild).toHaveClass('bg-secondary');
  });

  it('maintains consistent height for same size regardless of text', () => {
    const { rerender } = render(
      <ProgressBar value={50} size="lg" showPercentage={false} />
    );
    
    let progressBar = screen.getByRole('progressbar');
    const heightWithoutText = progressBar.className;

    rerender(<ProgressBar value={50} size="lg" showPercentage={true} />);
    progressBar = screen.getByRole('progressbar');
    const heightWithText = progressBar.className;

    // Both should have h-6 class (24px height for lg)
    expect(heightWithoutText).toContain('h-6');
    expect(heightWithText).toContain('h-6');
  });
});