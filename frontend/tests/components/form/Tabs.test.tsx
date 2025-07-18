import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from '../../../src/components/layout/Tabs';
import React from 'react';

const MockHouseholdContent = () => <div>Household Settings Content</div>;
const MockMembersContent = () => <div>Members Management Content</div>;
const MockInviteContent = () => <div>Invite Members Content</div>;

describe('Tabs', () => {
  describe('Basic Functionality', () => {
    it('renders with default tab active', () => {
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MockMembersContent />
          </Tabs.Panel>
        </Tabs>
      );

      // Default tab content should be visible
      expect(screen.getByText('Household Settings Content')).toBeVisible();
      expect(screen.getByText('Members Management Content')).not.toBeVisible();
      
      // Default tab button should be active
      const householdButton = screen.getByRole('tab', { name: 'Household' });
      expect(householdButton).toHaveAttribute('aria-selected', 'true');
      
      const membersButton = screen.getByRole('tab', { name: 'Members' });
      expect(membersButton).toHaveAttribute('aria-selected', 'false');
    });

    it('switches tabs when tab button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MockMembersContent />
          </Tabs.Panel>
        </Tabs>
      );

      // Click on Members tab
      const membersButton = screen.getByRole('tab', { name: 'Members' });
      await user.click(membersButton);

      // Members content should now be visible
      expect(screen.getByText('Members Management Content')).toBeVisible();
      expect(screen.getByText('Household Settings Content')).not.toBeVisible();
      
      // Button states should update
      expect(membersButton).toHaveAttribute('aria-selected', 'true');
      
      const householdButton = screen.getByRole('tab', { name: 'Household' });
      expect(householdButton).toHaveAttribute('aria-selected', 'false');
    });

    it('handles multiple panels correctly', async () => {
      const user = userEvent.setup();
      
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
            <Tabs.Button value="invite">Invite</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MockMembersContent />
          </Tabs.Panel>
          <Tabs.Panel value="invite">
            <MockInviteContent />
          </Tabs.Panel>
        </Tabs>
      );

      // Test switching between all three tabs
      await user.click(screen.getByRole('tab', { name: 'Invite' }));
      expect(screen.getByText('Invite Members Content')).toBeVisible();
      expect(screen.getByText('Household Settings Content')).not.toBeVisible();
      expect(screen.getByText('Members Management Content')).not.toBeVisible();

      await user.click(screen.getByRole('tab', { name: 'Members' }));
      expect(screen.getByText('Members Management Content')).toBeVisible();
      expect(screen.getByText('Household Settings Content')).not.toBeVisible();
      expect(screen.getByText('Invite Members Content')).not.toBeVisible();
    });
  });

  describe('Styling and Design System Integration', () => {
    it('applies default styling to Tabs.List', () => {
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
        </Tabs>
      );

      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveClass('flex', 'flex-wrap', 'gap-4');
    });

    it('applies responsive classes when specified', () => {
      render(
        <Tabs defaultTab="household">
          <Tabs.List className="hidden md:flex gap-4 mb-12">
            <Tabs.Button value="household">Household</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
        </Tabs>
      );

      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveClass('hidden', 'md:flex', 'gap-4', 'mb-12');
    });

    it('applies neobrutalist styling to tab buttons', () => {
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MockMembersContent />
          </Tabs.Panel>
        </Tabs>
      );

      const buttons = screen.getAllByRole('tab');
      buttons.forEach(button => {
        // Check for neobrutalist base classes
        expect(button).toHaveClass(
          'border-4',
          'border-text-primary',
          'font-black',
          'uppercase',
          'tracking-wider',
          'brutal-transition'
        );
      });
    });

    it('applies active state styling correctly', () => {
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MockMembersContent />
          </Tabs.Panel>
        </Tabs>
      );

      const activeButton = screen.getByRole('tab', { name: 'Household' });
      const inactiveButton = screen.getByRole('tab', { name: 'Members' });

      // Active button should have primary styling
      expect(activeButton).toHaveClass('bg-primary', 'text-white');
      expect(activeButton).toHaveClass('transform', 'translate-x-1', 'translate-y-1');
      expect(activeButton).toHaveClass('shadow-none');

      // Inactive button should have transparent background
      expect(inactiveButton).toHaveClass('bg-transparent', 'text-text-primary');
      expect(inactiveButton).toHaveClass('brutal-shadow-dark');
    });

    it('supports custom className on tab buttons', () => {
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household" className="custom-tab-class">
              Household
            </Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
        </Tabs>
      );

      const button = screen.getByRole('tab', { name: 'Household' });
      expect(button).toHaveClass('custom-tab-class');
    });
  });

  describe('Accessibility', () => {
    it('uses proper ARIA attributes', () => {
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MockMembersContent />
          </Tabs.Panel>
        </Tabs>
      );

      // Tab list should have proper role
      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();

      // Tab buttons should have proper roles and attributes
      const buttons = screen.getAllByRole('tab');
      expect(buttons).toHaveLength(2);
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-selected');
        expect(button).toHaveAttribute('aria-controls');
      });

      // Tab panels should have proper roles and attributes
      const visiblePanel = screen.getByRole('tabpanel');
      expect(visiblePanel).toBeInTheDocument();
      expect(visiblePanel).toHaveAttribute('aria-labelledby');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
            <Tabs.Button value="invite">Invite</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MockMembersContent />
          </Tabs.Panel>
          <Tabs.Panel value="invite">
            <MockInviteContent />
          </Tabs.Panel>
        </Tabs>
      );

      const householdButton = screen.getByRole('tab', { name: 'Household' });
      const membersButton = screen.getByRole('tab', { name: 'Members' });
      const inviteButton = screen.getByRole('tab', { name: 'Invite' });

      // Focus first tab
      householdButton.focus();
      expect(householdButton).toHaveFocus();

      // Arrow right should move to next tab
      await user.keyboard('{ArrowRight}');
      expect(membersButton).toHaveFocus();
      expect(screen.getByText('Members Management Content')).toBeVisible();

      // Arrow right again should move to third tab
      await user.keyboard('{ArrowRight}');
      expect(inviteButton).toHaveFocus();
      expect(screen.getByText('Invite Members Content')).toBeVisible();

      // Arrow right should wrap to first tab
      await user.keyboard('{ArrowRight}');
      expect(householdButton).toHaveFocus();
      expect(screen.getByText('Household Settings Content')).toBeVisible();

      // Arrow left should move to previous tab (wrapping)
      await user.keyboard('{ArrowLeft}');
      expect(inviteButton).toHaveFocus();
      expect(screen.getByText('Invite Members Content')).toBeVisible();
    });

    it('supports Home and End key navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <Tabs defaultTab="members">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
            <Tabs.Button value="invite">Invite</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MockMembersContent />
          </Tabs.Panel>
          <Tabs.Panel value="invite">
            <MockInviteContent />
          </Tabs.Panel>
        </Tabs>
      );

      const householdButton = screen.getByRole('tab', { name: 'Household' });
      const membersButton = screen.getByRole('tab', { name: 'Members' });
      const inviteButton = screen.getByRole('tab', { name: 'Invite' });

      // Focus middle tab
      membersButton.focus();
      expect(membersButton).toHaveFocus();

      // Home should move to first tab
      await user.keyboard('{Home}');
      expect(householdButton).toHaveFocus();
      expect(screen.getByText('Household Settings Content')).toBeVisible();

      // End should move to last tab
      await user.keyboard('{End}');
      expect(inviteButton).toHaveFocus();
      expect(screen.getByText('Invite Members Content')).toBeVisible();
    });
  });

  describe('Controlled vs Uncontrolled Behavior', () => {
    it('works as uncontrolled component with defaultTab', () => {
      render(
        <Tabs defaultTab="members">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MockMembersContent />
          </Tabs.Panel>
        </Tabs>
      );

      // Should start with members tab active
      expect(screen.getByText('Members Management Content')).toBeVisible();
      expect(screen.getByText('Household Settings Content')).not.toBeVisible();
    });

    it('works as controlled component with activeTab and onTabChange', async () => {
      const user = userEvent.setup();
      const mockOnTabChange = vi.fn();
      
      const ControlledTabs = () => {
        const [activeTab, setActiveTab] = React.useState('household');
        
        const handleTabChange = (tab: string) => {
          setActiveTab(tab);
          mockOnTabChange(tab);
        };
        
        return (
          <Tabs activeTab={activeTab} onTabChange={handleTabChange}>
            <Tabs.List>
              <Tabs.Button value="household">Household</Tabs.Button>
              <Tabs.Button value="members">Members</Tabs.Button>
            </Tabs.List>
            <Tabs.Panel value="household">
              <MockHouseholdContent />
            </Tabs.Panel>
            <Tabs.Panel value="members">
              <MockMembersContent />
            </Tabs.Panel>
          </Tabs>
        );
      };

      render(<ControlledTabs />);

      // Should start with household content
      expect(screen.getByText('Household Settings Content')).toBeVisible();

      // Click members tab
      await user.click(screen.getByRole('tab', { name: 'Members' }));
      
      // Should call onTabChange
      expect(mockOnTabChange).toHaveBeenCalledWith('members');
      expect(screen.getByText('Members Management Content')).toBeVisible();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles invalid defaultTab gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(
        <Tabs defaultTab="nonexistent">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MockMembersContent />
          </Tabs.Panel>
        </Tabs>
      );

      // Should warn and fall back to first available tab
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('defaultTab "nonexistent" does not match any tab values')
      );
      expect(screen.getByText('Household Settings Content')).toBeVisible();
      
      consoleSpy.mockRestore();
    });

    it('handles missing panels gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="orphan">Orphan Tab</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
        </Tabs>
      );

      // Should warn about orphaned tab
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Tab button "orphan" has no corresponding panel')
      );
      
      consoleSpy.mockRestore();
    });

    it('validates that only Tabs.Button and Tabs.Panel are used as children', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <div>Invalid child in List</div>
          </Tabs.List>
          <Tabs.Panel value="household">
            <MockHouseholdContent />
          </Tabs.Panel>
          <div>Invalid child in Tabs</div>
        </Tabs>
      );

      // Should warn about invalid children
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid child component in Tabs.List')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid child component in Tabs')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance and Optimization', () => {
    it('renders all panels but only shows active one', () => {
      const HouseholdSpy = vi.fn(() => <div>Household Content</div>);
      const MembersSpy = vi.fn(() => <div>Members Content</div>);
      
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <HouseholdSpy />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MembersSpy />
          </Tabs.Panel>
        </Tabs>
      );

      // All panels should render (to preserve state) but only active is visible
      expect(HouseholdSpy).toHaveBeenCalled();
      expect(MembersSpy).toHaveBeenCalled();
      expect(screen.getByText('Household Content')).toBeVisible();
      expect(screen.getByText('Members Content')).not.toBeVisible();
    });

    it('maintains panel state when switching tabs', async () => {
      const user = userEvent.setup();
      
      const StatefulPanel = ({ id }: { id: string }) => {
        const [count, setCount] = React.useState(0);
        return (
          <div>
            <div>{id} Panel</div>
            <div data-testid={`${id}-count`}>{count}</div>
            <button onClick={() => setCount(c => c + 1)}>
              Increment {id}
            </button>
          </div>
        );
      };
      
      render(
        <Tabs defaultTab="household">
          <Tabs.List>
            <Tabs.Button value="household">Household</Tabs.Button>
            <Tabs.Button value="members">Members</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel value="household">
            <StatefulPanel id="household" />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <StatefulPanel id="members" />
          </Tabs.Panel>
        </Tabs>
      );

      // Increment household counter
      await user.click(screen.getByText('Increment household'));
      expect(screen.getByTestId('household-count')).toHaveTextContent('1');

      // Switch to members tab
      await user.click(screen.getByRole('tab', { name: 'Members' }));
      
      // Increment members counter
      await user.click(screen.getByText('Increment members'));
      expect(screen.getByTestId('members-count')).toHaveTextContent('1');

      // Switch back to household
      await user.click(screen.getByRole('tab', { name: 'Household' }));
      
      // Household state should be preserved
      expect(screen.getByTestId('household-count')).toHaveTextContent('1');
    });
  });
});