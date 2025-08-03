import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from '../../../src/components/layout/Tabs';
import React from 'react';

// Mock content components
const MockHouseholdContent = () => <div>Household Settings Content</div>;
const MockMembersContent = () => <div>Members Management Content</div>;
const MockInviteContent = () => <div>Invite Members Content</div>;

// Helper function to render basic tabs setup
const renderBasicTabs = (defaultTab = 'household', additionalTabs: string[] = []) => {
  const allTabs = ['household', 'members', ...additionalTabs];
  
  return render(
    <Tabs defaultTab={defaultTab}>
      <Tabs.List>
        {allTabs.includes('household') && <Tabs.Button value="household">Household</Tabs.Button>}
        {allTabs.includes('members') && <Tabs.Button value="members">Members</Tabs.Button>}
        {allTabs.includes('invite') && <Tabs.Button value="invite">Invite</Tabs.Button>}
      </Tabs.List>
      {allTabs.includes('household') && (
        <Tabs.Panel value="household">
          <MockHouseholdContent />
        </Tabs.Panel>
      )}
      {allTabs.includes('members') && (
        <Tabs.Panel value="members">
          <MockMembersContent />
        </Tabs.Panel>
      )}
      {allTabs.includes('invite') && (
        <Tabs.Panel value="invite">
          <MockInviteContent />
        </Tabs.Panel>
      )}
    </Tabs>
  );
};

// Helper function to get tab button by name
const getTabButton = (name: string) => screen.getByRole('tab', { name });

// Helper function to check tab visibility and state
const expectTabState = (activeTab: string, allTabs: string[] = ['household', 'members']) => {
  const contentMap = {
    household: 'Household Settings Content',
    members: 'Members Management Content',
    invite: 'Invite Members Content'
  };
  
  allTabs.forEach(tab => {
    const button = getTabButton(tab.charAt(0).toUpperCase() + tab.slice(1));
    const content = contentMap[tab as keyof typeof contentMap];
    
    if (tab === activeTab) {
      expect(button).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText(content)).toBeVisible();
    } else {
      expect(button).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByText(content)).not.toBeVisible();
    }
  });
};

describe('Tabs', () => {
  describe('Basic Functionality', () => {
    it('renders with default tab active', () => {
      renderBasicTabs('household');
      expectTabState('household');
    });

    it('switches tabs when tab button is clicked', async () => {
      const user = userEvent.setup();
      renderBasicTabs('household');

      // Click on Members tab
      await user.click(getTabButton('Members'));
      expectTabState('members');
    });

    it('handles multiple panels correctly', async () => {
      const user = userEvent.setup();
      renderBasicTabs('household', ['invite']);
      const allTabs = ['household', 'members', 'invite'];

      // Test switching between all three tabs
      await user.click(getTabButton('Invite'));
      expectTabState('invite', allTabs);

      await user.click(getTabButton('Members'));
      expectTabState('members', allTabs);
    });
  });

  describe('Styling and Design System Integration', () => {
    it('applies default styling to Tabs.List', () => {
      renderBasicTabs('household');
      
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
      renderBasicTabs('household');

      const buttons = screen.getAllByRole('tab');
      const expectedClasses = [
        'font-mono',
        'font-black', 
        'uppercase',
        'tracking-wider',
        'brutal-transition',
        'border-text-primary'
      ];
      
      buttons.forEach(button => {
        expectedClasses.forEach(className => {
          expect(button).toHaveClass(className);
        });
        expect(button.className).toMatch(/border-brutal-(xs|sm|md|lg|xl)/);
      });
    });

    it('applies active state styling correctly', () => {
      renderBasicTabs('household');

      const activeButton = getTabButton('Household');
      const inactiveButton = getTabButton('Members');

      // Active button styling
      const activeClasses = ['bg-primary', 'text-white', 'transform', 'translate-x-1', 'translate-y-1', 'shadow-none'];
      activeClasses.forEach(className => {
        expect(activeButton).toHaveClass(className);
      });

      // Inactive button styling
      const inactiveClasses = ['bg-transparent', 'text-text-primary', 'brutal-shadow-dark'];
      inactiveClasses.forEach(className => {
        expect(inactiveButton).toHaveClass(className);
      });
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
      renderBasicTabs('household', ['invite']);

      const householdButton = getTabButton('Household');
      const membersButton = getTabButton('Members');
      const inviteButton = getTabButton('Invite');

      // Test keyboard navigation sequence
      const navigationTests = [
        { action: () => householdButton.focus(), expectedFocus: householdButton, expectedContent: 'Household Settings Content' },
        { action: () => user.keyboard('{ArrowRight}'), expectedFocus: membersButton, expectedContent: 'Members Management Content' },
        { action: () => user.keyboard('{ArrowRight}'), expectedFocus: inviteButton, expectedContent: 'Invite Members Content' },
        { action: () => user.keyboard('{ArrowRight}'), expectedFocus: householdButton, expectedContent: 'Household Settings Content' },
        { action: () => user.keyboard('{ArrowLeft}'), expectedFocus: inviteButton, expectedContent: 'Invite Members Content' }
      ];

      for (const { action, expectedFocus, expectedContent } of navigationTests) {
        await action();
        expect(expectedFocus).toHaveFocus();
        expect(screen.getByText(expectedContent)).toBeVisible();
      }
    });

    it('supports Home and End key navigation', async () => {
      const user = userEvent.setup();
      renderBasicTabs('members', ['invite']);

      const householdButton = getTabButton('Household');
      const membersButton = getTabButton('Members');
      const inviteButton = getTabButton('Invite');

      // Focus middle tab and test Home/End navigation
      membersButton.focus();
      expect(membersButton).toHaveFocus();

      const homeEndTests = [
        { key: '{Home}', expectedFocus: householdButton, expectedContent: 'Household Settings Content' },
        { key: '{End}', expectedFocus: inviteButton, expectedContent: 'Invite Members Content' }
      ];

      for (const { key, expectedFocus, expectedContent } of homeEndTests) {
        await user.keyboard(key);
        expect(expectedFocus).toHaveFocus();
        expect(screen.getByText(expectedContent)).toBeVisible();
      }
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