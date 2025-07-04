import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import { BackButton } from '../../../src/components/common/BackButton';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('BackButton', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders with default Back label', () => {
    renderWithRouter(<BackButton />);
    
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    renderWithRouter(<BackButton label="Go Back" />);
    
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('renders chevron icon', () => {
    const { container } = renderWithRouter(<BackButton />);
    
    const icon = container.querySelector('.w-5.h-5');
    expect(icon).toBeInTheDocument();
  });

  it('navigates back when clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BackButton />);
    
    await user.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('navigates to historyOverride when provided', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BackButton historyOverride="/custom-path" />);
    
    await user.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/custom-path');
  });

  it('applies correct CSS classes', () => {
    renderWithRouter(<BackButton />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('font-mono', 'font-bold', 'uppercase', 'brutal-transition', 'mb-4');
  });
});