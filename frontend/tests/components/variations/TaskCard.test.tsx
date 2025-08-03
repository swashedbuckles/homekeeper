import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from '../../../src/components/variations/TaskCard';
import { Action } from '../../../src/components/common/Action';
import { Button } from '../../../src/components/common/Button';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';
import type { AllowedActionChildren } from '../../../src/lib/validation/children';

describe('TaskCard', () => {
  const defaultProps = {
    title: 'Change HVAC Filter',
    subtitle: 'Central Air System • Living Room',
    status: 'urgent' as const,
    dueDate: 'Due Tomorrow'
  };

  // Helper function to render TaskCard with optional actions
  const renderTaskCard = (props = {}, actions?: AllowedActionChildren) => {
    const combinedProps = { ...defaultProps, ...props };
    return render(
      <TaskCard {...combinedProps}>
        {actions}
      </TaskCard>
    );
  };

  // Helper function to create action components
  const createActions = {
    single: () => <Action variant="danger" onClick={vi.fn()}>Mark Complete</Action>,
    multiple: () => [
      <Action key="complete" variant="danger" onClick={vi.fn()}>Mark Complete</Action>,
      <Action key="reschedule" variant="outline" onClick={vi.fn()}>Reschedule</Action>
    ],
    mixed: () => [
      <Action key="complete" variant="danger" onClick={vi.fn()}>Mark Complete</Action>,
      <Button key="notes" variant="outline" size="sm" onClick={vi.fn()}>Add Notes</Button>
    ]
  };

  it('renders title, subtitle, and due date', () => {
    renderTaskCard();
    
    expect(screen.getByText('Change HVAC Filter')).toBeInTheDocument();
    expect(screen.getByText('Central Air System • Living Room')).toBeInTheDocument();
    expect(screen.getByText('Due Tomorrow')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    renderTaskCard({}, createActions.single());
    
    expect(screen.getByRole('button', { name: 'Mark Complete' })).toBeInTheDocument();
  });

  it('does not render actions section when not provided', () => {
    renderTaskCard();
    
    // Should not have any buttons when no actions provided
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles multiple actions', () => {
    renderTaskCard({}, createActions.multiple());
    
    expect(screen.getByRole('button', { name: 'Mark Complete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reschedule' })).toBeInTheDocument();
  });

  it('calls action handlers when actions are clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    
    renderTaskCard({}, <Action variant="danger" onClick={mockOnClick}>Mark Complete</Action>);
    
    await user.click(screen.getByRole('button', { name: 'Mark Complete' }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  describe('Status-Based Styling', () => {
    const statusTests = [
      {
        name: 'applies urgent status styling',
        status: 'urgent',
        expectedBorderClass: 'border-l-error',
        expectedTextClass: 'text-error'
      },
      {
        name: 'applies normal status styling',
        status: 'normal',
        expectedBorderClass: 'border-l-secondary',
        expectedTextClass: 'text-secondary'
      },
      {
        name: 'applies future status styling',
        status: 'future',
        expectedBorderClass: 'border-l-accent',
        expectedTextClass: 'text-accent'
      },
      {
        name: 'applies completed status styling',
        status: 'completed',
        expectedBorderClass: 'border-l-accent',
        expectedTextClass: 'text-accent'
      }
    ];

    statusTests.forEach(({ name, status, expectedBorderClass, expectedTextClass }) => {
      it(name, () => {
        const { container } = renderTaskCard({ status: status as any });
        
        // Check border color
        const card = container.querySelector(`[class*="${expectedBorderClass}"]`);
        expect(card).toBeInTheDocument();
        
        // Check due date text color
        const dueDate = screen.getByText('Due Tomorrow');
        expect(dueDate).toHaveClass(expectedTextClass);
      });
    });
  });

  describe('Element Styling', () => {
    const elementTests = [
      {
        name: 'applies correct title styling',
        element: () => screen.getByText('Change HVAC Filter'),
        expectedTag: 'H3',
        expectedClasses: ['font-black', 'uppercase', 'text-text-primary']
      },
      {
        name: 'applies correct subtitle styling',
        element: () => screen.getByText('Central Air System • Living Room'),
        expectedTag: 'P',
        expectedClasses: ['font-bold', 'text-text-secondary', 'uppercase']
      }
    ];

    elementTests.forEach(({ name, element, expectedTag, expectedClasses }) => {
      it(name, () => {
        renderTaskCard();
        
        const targetElement = element();
        expect(targetElement.tagName).toBe(expectedTag);
        expectElementToHaveClasses(targetElement, expectedClasses);
      });
    });
  });

  describe('Composition Pattern', () => {
    const compositionTests = [
      {
        name: 'supports mixed Action and Button components',
        renderActions: () => createActions.mixed(),
        expectedButtons: ['Mark Complete', 'Add Notes']
      },
      {
        name: 'handles multiple actions with proper spacing',
        renderActions: () => [
          <Action key="complete" variant="danger" onClick={vi.fn()}>Complete</Action>,
          <Action key="reschedule" variant="secondary" onClick={vi.fn()}>Reschedule</Action>,
          <Action key="skip" variant="outline" onClick={vi.fn()}>Skip</Action>
        ],
        expectedButtons: ['Complete', 'Reschedule', 'Skip'],
        verifySpacing: true
      }
    ];

    compositionTests.forEach(({ name, renderActions, expectedButtons, verifySpacing }) => {
      it(name, () => {
        renderTaskCard({}, renderActions());
        
        expectedButtons.forEach(buttonName => {
          expect(screen.getByRole('button', { name: buttonName })).toBeInTheDocument();
        });
        
        if (verifySpacing) {
          const actionsContainer = screen.getByRole('button', { name: expectedButtons[0] }).parentElement;
          expect(actionsContainer).toHaveClass('flex', 'flex-wrap', 'gap-3');
        }
      });
    });

    it('validates children and filters out invalid components', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      renderTaskCard({}, [
        <Action key="valid" variant="danger" onClick={vi.fn()}>Valid Action</Action>,
        <div key="invalid">Invalid Child</div>,
        <Button key="button" variant="outline" size="sm" onClick={vi.fn()}>Valid Button</Button>
      ]);
      
      // Valid components should render
      expect(screen.getByRole('button', { name: 'Valid Action' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Valid Button' })).toBeInTheDocument();
      
      // Invalid component should not render
      expect(screen.queryByText('Invalid Child')).not.toBeInTheDocument();
      
      // Should warn about invalid child
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('TaskCard: Invalid child component <div>')
      );
      
      consoleSpy.mockRestore();
    });

    it('handles empty children gracefully', () => {
      renderTaskCard();
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('TypeScript Integration', () => {
    const typeScriptTests = [
      {
        name: 'Action component uses correct default size',
        actionProps: { variant: 'danger' as const, children: 'Test Action' },
        expectedClasses: ['px-3', 'py-2', 'text-sm']
      },
      {
        name: 'Action component can override size',
        actionProps: { variant: 'danger' as const, size: 'lg' as const, children: 'Large Action' },
        expectedClasses: ['px-6', 'py-4', 'text-lg']
      }
    ];

    typeScriptTests.forEach(({ name, actionProps, expectedClasses }) => {
      it(name, () => {
        renderTaskCard({}, <Action onClick={vi.fn()} {...actionProps} />);
        
        const actionButton = screen.getByRole('button', { name: actionProps.children as string });
        expectElementToHaveClasses(actionButton, expectedClasses);
      });
    });

    it('passes all card props to underlying Card component', () => {
      renderTaskCard({
        shadow: 'double',
        hover: true,
        hoverEffect: 'lift',
        className: 'custom-class',
        testId: 'custom-task-card'
      });
      
      const card = screen.getByTestId('custom-task-card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('custom-class');
    });
  });
});