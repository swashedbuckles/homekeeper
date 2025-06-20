import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert } from '../../../src/components/common/Alert';

describe('Alert', () => {
  it('renders children content', () => {
    render(<Alert>Test alert message</Alert>);
    
    expect(screen.getByText('Test alert message')).toBeInTheDocument();
  });

  it('renders with default info variant', () => {
    const { container } = render(<Alert>Info message</Alert>);
    
    const alertDiv = container.firstChild;
    expect(alertDiv).toHaveClass('bg-blue-50', 'border-blue-200');
  });

  it('applies correct styles for warning variant', () => {
    const { container } = render(<Alert variant="warning">Warning message</Alert>);
    
    const alertDiv = container.firstChild;
    expect(alertDiv).toHaveClass('bg-orange-50', 'border-orange-200');
  });

  it('applies correct styles for error variant', () => {
    const { container } = render(<Alert variant="error">Error message</Alert>);
    
    const alertDiv = container.firstChild;
    expect(alertDiv).toHaveClass('bg-red-50', 'border-red-200');
  });

  it('applies correct styles for success variant', () => {
    const { container } = render(<Alert variant="success">Success message</Alert>);
    
    const alertDiv = container.firstChild;
    expect(alertDiv).toHaveClass('bg-green-50', 'border-green-200');
  });

  it('renders default icon for each variant', () => {
    const { container } = render(<Alert variant="info">Info message</Alert>);
    
    const icon = container.querySelector('.w-4.h-4');
    expect(icon).toBeInTheDocument();
  });

  it('hides icon when hideIcon is true', () => {
    const { container } = render(<Alert hideIcon>No icon message</Alert>);
    
    const icon = container.querySelector('.w-4.h-4');
    expect(icon).not.toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    const customIcon = <div data-testid="custom-icon">Custom</div>;
    render(<Alert icon={customIcon}>Custom icon message</Alert>);
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Alert className="custom-class">Message</Alert>);
    
    const alertDiv = container.firstChild;
    expect(alertDiv).toHaveClass('custom-class');
  });
});
