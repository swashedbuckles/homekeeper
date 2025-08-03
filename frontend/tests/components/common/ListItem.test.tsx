import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ListItem } from '../../../src/components/common/ListItem';
import { Action } from '../../../src/components/common/Action';
import { Button } from '../../../src/components/common/Button';
import { expectElementToHaveClasses } from '../../helpers/testHelpers';
import { createCompoundComponentTestSuite } from '../../helpers/compoundComponentHelpers';

describe('ListItem (Compound Component)', () => {
  const defaultProps = {
    title: 'Test ListItem'
  };

  describe('Basic Rendering', () => {
    it('renders title correctly', () => {
      render(<ListItem {...defaultProps} />);
      
      expect(screen.getByText('Test ListItem')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
      render(<ListItem {...defaultProps} subtitle="Test subtitle" />);
      
      expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<ListItem {...defaultProps} />);
      
      expect(screen.queryByText('Test subtitle')).not.toBeInTheDocument();
    });

    const stylingTests = [
      {
        name: 'applies correct CSS classes for basic structure',
        element: 'wrapper',
        expectedClasses: [
          'flex', 'flex-col', 'md:flex-row', 'items-start', 'md:items-center', 'justify-between',
          'p-4', 'md:p-6', 'bg-white', 'font-mono'
        ]
      },
      {
        name: 'applies correct title styling',
        element: 'title',
        expectedClasses: ['font-bold', 'text-lg', 'md:text-xl', 'uppercase', 'tracking-wide', 'mb-2']
      },
      {
        name: 'applies correct subtitle styling when provided',
        element: 'subtitle',
        props: { subtitle: 'Test subtitle' },
        expectedClasses: ['text-sm', 'font-bold', 'uppercase', 'tracking-wide']
      }
    ];

    stylingTests.forEach(({ name, element, expectedClasses, props = {} }) => {
      it(name, () => {
        const renderProps = { ...defaultProps, ...props };
        const { container } = render(<ListItem {...renderProps} />);
        
        let targetElement: HTMLElement;
        if (element === 'wrapper') {
          targetElement = container.firstChild as HTMLElement;
        } else if (element === 'title') {
          targetElement = screen.getByText('Test ListItem');
        } else {
          targetElement = screen.getByText('Test subtitle');
        }
        
        expectElementToHaveClasses(targetElement, expectedClasses);
      });
    });
  });

  describe('Status Variants', () => {
    const statusTests = [
      {
        status: 'default',
        expectedClasses: ['border-4', 'md:border-6', 'border-text-primary'],
        notExpectedClasses: ['border-l-8', 'border-l-12']
      },
      {
        status: 'urgent',
        expectedClasses: ['border-l-8', 'md:border-l-12', 'border-l-error'],
        notExpectedClasses: []
      },
      {
        status: 'completed',
        expectedClasses: ['border-l-8', 'md:border-l-12', 'border-l-accent'],
        notExpectedClasses: []
      },
      {
        status: 'info',
        expectedClasses: ['border-l-8', 'md:border-l-12', 'border-l-secondary'],
        notExpectedClasses: []
      }
    ];

    statusTests.forEach(({ status, expectedClasses, notExpectedClasses }) => {
      it(`applies ${status} status correctly`, () => {
        const { container } = render(<ListItem {...defaultProps} status={status as any} />);
        
        const wrapper = container.firstChild as HTMLElement;
        expectElementToHaveClasses(wrapper, expectedClasses);
        notExpectedClasses.forEach(className => {
          expect(wrapper).not.toHaveClass(className);
        });
      });
    });
  });

  describe('Interactive Behavior', () => {
    const interactionTests = [
      {
        name: 'handles click events when onClick is provided',
        props: { onClick: vi.fn() },
        test: async (props: any) => {
          const user = userEvent.setup();
          render(<ListItem {...defaultProps} {...props} />);
          
          const wrapper = screen.getByTestId('new-list-item');
          await user.click(wrapper);
          
          expect(props.onClick).toHaveBeenCalledTimes(1);
        }
      },
      {
        name: 'applies cursor-pointer when clickable',
        props: { onClick: () => {} },
        test: (props: any) => {
          const { container } = render(<ListItem {...defaultProps} {...props} />);
          
          const wrapper = container.firstChild as HTMLElement;
          expect(wrapper).toHaveClass('cursor-pointer');
        }
      },
      {
        name: 'applies hover effects when hover prop is true',
        props: { hover: true },
        test: (props: any) => {
          const { container } = render(<ListItem {...defaultProps} {...props} />);
          
          const wrapper = container.firstChild as HTMLElement;
          expect(wrapper).toHaveClass('cursor-pointer');
        }
      },
      {
        name: 'does not apply interactive styles when not clickable',
        props: {},
        test: (props: any) => {
          const { container } = render(<ListItem {...defaultProps} {...props} />);
          
          const wrapper = container.firstChild as HTMLElement;
          expect(wrapper).not.toHaveClass('cursor-pointer');
        }
      }
    ];

    interactionTests.forEach(({ name, props, test }) => {
      it(name, async () => {
        await test(props);
      });
    });
  });

// Avatar compound component tests are handled by compound component test suite below

// Badge compound component tests are handled by compound component test suite below

  describe('Actions Compound Component', () => {
    it('renders actions when provided', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary">Complete</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
    });

    it('renders multiple actions', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary">Complete</Action>
            <Action variant="outline">Reschedule</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reschedule' })).toBeInTheDocument();
    });

    it('does not render actions section when not provided', () => {
      render(<ListItem {...defaultProps} />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles action clicks correctly', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary" onClick={mockOnClick}>Click Me</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      await user.click(screen.getByRole('button', { name: 'Click Me' }));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('applies responsive layout classes', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary">Action</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      const actionButton = screen.getByRole('button', { name: 'Action' });
      const actionsContainer = actionButton.parentElement;
      expect(actionsContainer).toHaveClass(
        'md:ml-6', 'flex-shrink-0', 'flex', 'gap-2',
        'flex-col', 'sm:flex-row'
      );
    });

    it('supports mixed Action and Button components', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary">Action Button</Action>
            <Button variant="outline" size="sm">Regular Button</Button>
          </ListItem.Actions>
        </ListItem>
      );
      
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Regular Button' })).toBeInTheDocument();
    });
  });

  describe('Complex Compound Usage', () => {
    it('renders all compound components together', () => {
      render(
        <ListItem {...defaultProps} subtitle="Complex example" status="urgent">
          <ListItem.Avatar color="primary">JS</ListItem.Avatar>
          <ListItem.Badge variant="danger">Overdue</ListItem.Badge>
          <ListItem.Badge variant="secondary">High Priority</ListItem.Badge>
          <ListItem.Actions>
            <Action variant="primary">Primary Action</Action>
            <Action variant="outline">Secondary Action</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      // Check all elements are present
      expect(screen.getByText('Test ListItem')).toBeInTheDocument();
      expect(screen.getByText('Complex example')).toBeInTheDocument();
      expect(screen.getByText('JS')).toBeInTheDocument();
      expect(screen.getByText('Overdue')).toBeInTheDocument();
      expect(screen.getByText('High Priority')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Primary Action' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Secondary Action' })).toBeInTheDocument();
    });

    it('handles mixed interaction scenarios correctly', async () => {
      const user = userEvent.setup();
      const listItemClick = vi.fn();
      const actionClick = vi.fn();
      
      render(
        <ListItem {...defaultProps} onClick={listItemClick}>
          <ListItem.Avatar color="primary">JS</ListItem.Avatar>
          <ListItem.Actions>
            <Action variant="primary" onClick={(e) => { e.stopPropagation(); actionClick(); }}>
              Action
            </Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      // Click the action button - should only trigger action click
      await user.click(screen.getByRole('button', { name: 'Action' }));
      expect(actionClick).toHaveBeenCalledTimes(1);
      expect(listItemClick).not.toHaveBeenCalled();
      
      // Click the avatar area - should trigger list item click
      await user.click(screen.getByText('JS'));
      expect(listItemClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Layout and Styling', () => {
    const layoutTests = [
      {
        name: 'applies correct main content layout',
        setup: () => render(
          <ListItem {...defaultProps} subtitle="Test subtitle">
            <ListItem.Badge variant="primary">Badge</ListItem.Badge>
          </ListItem>
        ),
        test: () => {
          const title = screen.getByText('Test ListItem');
          const mainContent = title.closest('.flex-1');
          expect(mainContent).toHaveClass('flex-1');
        }
      },
      {
        name: 'positions avatar with correct spacing',
        setup: () => render(
          <ListItem {...defaultProps}>
            <ListItem.Avatar color="primary">AV</ListItem.Avatar>
          </ListItem>
        ),
        test: () => {
          const avatar = screen.getByText('AV');
          const avatarContainer = avatar.parentElement?.parentElement;
          expectElementToHaveClasses(avatarContainer!, [
            'flex', 'flex-col', 'md:flex-row', 'items-start', 'md:items-center', 'justify-between',
            'p-4', 'md:p-6', 'bg-white', 'border-4', 'md:border-6', 'border-text-primary', 'font-mono'
          ]);
        }
      },
      {
        name: 'handles responsive design classes correctly',
        setup: () => render(<ListItem {...defaultProps} />),
        test: () => {
          const { container } = render(<ListItem {...defaultProps} />);
          const wrapper = container.firstChild as HTMLElement;
          expectElementToHaveClasses(wrapper, ['p-4', 'md:p-6', 'border-4', 'md:border-6']);
        }
      }
    ];

    layoutTests.forEach(({ name, setup, test }) => {
      it(name, () => {
        setup();
        test();
      });
    });
  });

  describe('Accessibility', () => {
    it('applies correct test id', () => {
      render(<ListItem {...defaultProps} testId="custom-test-id" />);
      
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    it('uses default test id when not provided', () => {
      render(<ListItem {...defaultProps} />);
      
      expect(screen.getByTestId('new-list-item')).toBeInTheDocument();
    });

    it('maintains semantic structure with headings and content', () => {
      render(
        <ListItem {...defaultProps} subtitle="Subtitle text">
          <ListItem.Avatar color="primary">AV</ListItem.Avatar>
          <ListItem.Badge variant="primary">Status</ListItem.Badge>
          <ListItem.Actions>
            <Action variant="primary">Action</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      // Title should be in a semantic heading-like div
      const title = screen.getByText('Test ListItem');
      expect(title).toHaveClass('font-bold', 'text-lg', 'md:text-xl', 'uppercase');
      
      // Actions should be properly labeled buttons
      const action = screen.getByRole('button', { name: 'Action' });
      expect(action).toBeInTheDocument();
    });
  });

  // Compound component test suite - includes Avatar, Badge, complex scenarios, accessibility, and edge cases
  createCompoundComponentTestSuite('ListItem', ListItem as any, {
    baseProps: defaultProps,
    testId: 'new-list-item',
    hasAvatar: true,
    hasBadge: true,
    hasComplexLayout: true
  });

  describe('Actions Compound Component', () => {
    const actionTests = [
      {
        name: 'renders actions when provided',
        children: (
          <ListItem.Actions>
            <Action variant="primary">Complete</Action>
          </ListItem.Actions>
        ),
        expectation: () => expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument()
      },
      {
        name: 'renders multiple actions',
        children: (
          <ListItem.Actions>
            <Action variant="primary">Complete</Action>
            <Action variant="outline">Reschedule</Action>
          </ListItem.Actions>
        ),
        expectation: () => {
          expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
          expect(screen.getByRole('button', { name: 'Reschedule' })).toBeInTheDocument();
        }
      },
      {
        name: 'does not render actions section when not provided',
        children: null,
        expectation: () => expect(screen.queryByRole('button')).not.toBeInTheDocument()
      }
    ];

    actionTests.forEach(({ name, children, expectation }) => {
      it(name, () => {
        render(
          <ListItem {...defaultProps}>
            {children}
          </ListItem>
        );
        expectation();
      });
    });

    it('handles action clicks correctly', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary" onClick={mockOnClick}>Click Me</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      await user.click(screen.getByRole('button', { name: 'Click Me' }));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }); 

    it('applies responsive layout classes', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary">Action</Action>
          </ListItem.Actions>
        </ListItem>
      );
      
      const actionButton = screen.getByRole('button', { name: 'Action' });
      const actionsContainer = actionButton.parentElement;
      expectElementToHaveClasses(actionsContainer!, [
        'md:ml-6', 'flex-shrink-0', 'flex', 'gap-2', 'flex-col', 'sm:flex-row'
      ]);
    });

    it('supports mixed Action and Button components', () => {
      render(
        <ListItem {...defaultProps}>
          <ListItem.Actions>
            <Action variant="primary">Action Button</Action>
            <Button variant="outline" size="sm">Regular Button</Button>
          </ListItem.Actions>
        </ListItem>
      );
      
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Regular Button' })).toBeInTheDocument();
    });
  });
});