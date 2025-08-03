import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { BackButton } from '../../../src/components/common/BackButton';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';

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

  describe('Label Rendering', () => {
    const labelTests = [
      {
        name: 'renders with default Back label',
        props: {},
        expectedText: 'Back'
      },
      {
        name: 'renders with custom label',
        props: { label: 'Go Back' },
        expectedText: 'Go Back'
      }
    ];

    labelTests.forEach(({ name, props, expectedText }) => {
      it(name, () => {
        renderWithRouter(<BackButton {...props} />);
        expect(screen.getByText(expectedText)).toBeInTheDocument();
      });
    });
  });

  it('renders chevron icon', () => {
    const { container } = renderWithRouter(<BackButton />);
    
    const icon = container.querySelector('.w-5.h-5');
    expect(icon).toBeInTheDocument();
  });

  describe('Navigation Behavior', () => {
    const navigationTests = [
      {
        name: 'navigates back when clicked',
        props: {},
        expectedCall: -1
      },
      {
        name: 'navigates to historyOverride when provided',
        props: { historyOverride: '/custom-path' },
        expectedCall: '/custom-path'
      }
    ];

    navigationTests.forEach(({ name, props, expectedCall }) => {
      it(name, async () => {
        const user = userEvent.setup();
        renderWithRouter(<BackButton {...props} />);
        
        await user.click(screen.getByRole('button'));
        expect(mockNavigate).toHaveBeenCalledWith(expectedCall);
      });
    });
  });

  it('applies correct CSS classes', () => {
    renderWithRouter(<BackButton />);
    
    const button = screen.getByRole('button');
    expectElementToHaveClasses(button, ['font-mono', 'font-bold', 'uppercase', 'brutal-transition', 'mb-4']);
  });
});