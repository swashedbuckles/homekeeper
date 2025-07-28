import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHousehold } from '../../src/hooks/useHousehold';
import { HouseholdContext, type HouseholdContextType } from '../../src/context/householdContext';
import type { ReactNode } from 'react';
import { HOUSEHOLD_ROLE } from '@homekeeper/shared';

// Mock context values
const createMockContextValue = (overrides: Partial<HouseholdContextType> = {}): HouseholdContextType => ({
  activeHouseholdId: 'household-123',
  switchHousehold: vi.fn(),
  userHouseholds: [
    {
      id: 'household-123',
      name: 'Test Household',
      ownerId: 'user-456',
      memberCount: 3,
      userRole: HOUSEHOLD_ROLE.OWNER
    },
    {
      id: 'household-456',
      name: 'Another Household',
      ownerId: 'user-789',
      memberCount: 2,
      userRole: HOUSEHOLD_ROLE.MEMBER
    }
  ],
  isLoadingHouseholds: false,
  householdsError: null,
  activeHousehold: {
    id: 'household-123',
    name: 'Test Household',
    ownerId: 'user-456',
    memberCount: 3,
    userRole: HOUSEHOLD_ROLE.OWNER
  },
  isLoadingActiveHousehold: false,
  activeHouseholdError: null,
  canManageHousehold: true,
  currentRole: 'owner',
  ...overrides
});

// Test wrapper component
const createWrapperWithContext = (contextValue: HouseholdContextType | null) => {
  return ({ children }: { children: ReactNode }) => (
    <HouseholdContext.Provider value={contextValue}>
      {children}
    </HouseholdContext.Provider>
  );
};

describe('useHousehold', () => {
  describe('when used within HouseholdProvider', () => {
    it('returns the household context', () => {
      const mockContext = createMockContextValue();
      const wrapper = createWrapperWithContext(mockContext);

      const { result } = renderHook(() => useHousehold(), { wrapper });

      expect(result.current).toEqual(mockContext);
    });

    it('returns active household information', () => {
      const mockContext = createMockContextValue({
        activeHouseholdId: 'household-789',
        activeHousehold: {
          id: 'household-789',
          name: 'My Home',
          ownerId: 'user-123',
          memberCount: 4,
          userRole: 'admin'
        },
        currentRole: 'admin',
        canManageHousehold: true
      });
      const wrapper = createWrapperWithContext(mockContext);

      const { result } = renderHook(() => useHousehold(), { wrapper });

      expect(result.current.activeHouseholdId).toBe('household-789');
      expect(result.current.activeHousehold?.name).toBe('My Home');
      expect(result.current.currentRole).toBe('admin');
      expect(result.current.canManageHousehold).toBe(true);
    });

    it('returns user households list', () => {
      const mockHouseholds = [
        { id: 'house-1', name: 'House 1', ownerId: 'user-1', memberCount: 2, userRole: HOUSEHOLD_ROLE.OWNER },
        { id: 'house-2', name: 'House 2', ownerId: 'user-2', memberCount: 3, userRole: HOUSEHOLD_ROLE.MEMBER },
        { id: 'house-3', name: 'House 3', ownerId: 'user-3', memberCount: 1, userRole: HOUSEHOLD_ROLE.GUEST }
      ];
      const mockContext = createMockContextValue({
        userHouseholds: mockHouseholds
      });
      const wrapper = createWrapperWithContext(mockContext);

      const { result } = renderHook(() => useHousehold(), { wrapper });

      expect(result.current.userHouseholds).toHaveLength(3);
      expect(result.current.userHouseholds).toEqual(mockHouseholds);
    });

    it('returns loading states', () => {
      const mockContext = createMockContextValue({
        isLoadingHouseholds: true,
        isLoadingActiveHousehold: true
      });
      const wrapper = createWrapperWithContext(mockContext);

      const { result } = renderHook(() => useHousehold(), { wrapper });

      expect(result.current.isLoadingHouseholds).toBe(true);
      expect(result.current.isLoadingActiveHousehold).toBe(true);
    });

    it('returns error states', () => {
      const householdsError = new Error('Failed to fetch households');
      const activeHouseholdError = new Error('Failed to fetch active household');
      const mockContext = createMockContextValue({
        householdsError,
        activeHouseholdError
      });
      const wrapper = createWrapperWithContext(mockContext);

      const { result } = renderHook(() => useHousehold(), { wrapper });

      expect(result.current.householdsError).toBe(householdsError);
      expect(result.current.activeHouseholdError).toBe(activeHouseholdError);
    });

    it('provides switchHousehold function', () => {
      const mockSwitchHousehold = vi.fn();
      const mockContext = createMockContextValue({
        switchHousehold: mockSwitchHousehold
      });
      const wrapper = createWrapperWithContext(mockContext);

      const { result } = renderHook(() => useHousehold(), { wrapper });

      expect(result.current.switchHousehold).toBe(mockSwitchHousehold);
      expect(typeof result.current.switchHousehold).toBe('function');
    });

    describe('permission checks', () => {
      it('returns correct permissions for owner', () => {
        const mockContext = createMockContextValue({
          currentRole: 'owner',
          canManageHousehold: true
        });
        const wrapper = createWrapperWithContext(mockContext);

        const { result } = renderHook(() => useHousehold(), { wrapper });

        expect(result.current.currentRole).toBe('owner');
        expect(result.current.canManageHousehold).toBe(true);
      });

      it('returns correct permissions for admin', () => {
        const mockContext = createMockContextValue({
          currentRole: 'admin',
          canManageHousehold: true
        });
        const wrapper = createWrapperWithContext(mockContext);

        const { result } = renderHook(() => useHousehold(), { wrapper });

        expect(result.current.currentRole).toBe('admin');
        expect(result.current.canManageHousehold).toBe(true);
      });

      it('returns correct permissions for member', () => {
        const mockContext = createMockContextValue({
          currentRole: 'member',
          canManageHousehold: false
        });
        const wrapper = createWrapperWithContext(mockContext);

        const { result } = renderHook(() => useHousehold(), { wrapper });

        expect(result.current.currentRole).toBe('member');
        expect(result.current.canManageHousehold).toBe(false);
      });

      it('returns correct permissions for guest', () => {
        const mockContext = createMockContextValue({
          currentRole: 'guest',
          canManageHousehold: false
        });
        const wrapper = createWrapperWithContext(mockContext);

        const { result } = renderHook(() => useHousehold(), { wrapper });

        expect(result.current.currentRole).toBe('guest');
        expect(result.current.canManageHousehold).toBe(false);
      });

      it('handles null role correctly', () => {
        const mockContext = createMockContextValue({
          currentRole: null,
          canManageHousehold: false
        });
        const wrapper = createWrapperWithContext(mockContext);

        const { result } = renderHook(() => useHousehold(), { wrapper });

        expect(result.current.currentRole).toBe(null);
        expect(result.current.canManageHousehold).toBe(false);
      });
    });

    describe('empty/null states', () => {
      it('handles no active household', () => {
        const mockContext = createMockContextValue({
          activeHouseholdId: null,
          activeHousehold: undefined,
          currentRole: null,
          canManageHousehold: false
        });
        const wrapper = createWrapperWithContext(mockContext);

        const { result } = renderHook(() => useHousehold(), { wrapper });

        expect(result.current.activeHouseholdId).toBe(null);
        expect(result.current.activeHousehold).toBe(undefined);
        expect(result.current.currentRole).toBe(null);
        expect(result.current.canManageHousehold).toBe(false);
      });

      it('handles empty households list', () => {
        const mockContext = createMockContextValue({
          userHouseholds: []
        });
        const wrapper = createWrapperWithContext(mockContext);

        const { result } = renderHook(() => useHousehold(), { wrapper });

        expect(result.current.userHouseholds).toEqual([]);
      });

      it('handles undefined households list', () => {
        const mockContext = createMockContextValue({
          userHouseholds: undefined
        });
        const wrapper = createWrapperWithContext(mockContext);

        const { result } = renderHook(() => useHousehold(), { wrapper });

        expect(result.current.userHouseholds).toBe(undefined);
      });
    });
  });

  describe('when used outside HouseholdProvider', () => {
    it('throws an error', () => {
      // Suppress console.error for this test since we expect an error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useHousehold());
      }).toThrow('`useHousehold` must be used within HouseholdProvider');

      consoleSpy.mockRestore();
    });

    it('throws an error when context is null', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const wrapper = createWrapperWithContext(null);

      expect(() => {
        renderHook(() => useHousehold(), { wrapper });
      }).toThrow('`useHousehold` must be used within HouseholdProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('context value consistency', () => {
    it('maintains object reference stability', () => {
      const mockContext = createMockContextValue();
      const wrapper = createWrapperWithContext(mockContext);

      const { result, rerender } = renderHook(() => useHousehold(), { wrapper });
      const firstResult = result.current;

      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it('reflects context updates', () => {
      let mockContext = createMockContextValue({
        activeHouseholdId: 'household-1'
      });

      const TestWrapper = ({ children }: { children: ReactNode }) => (
        <HouseholdContext.Provider value={mockContext}>
          {children}
        </HouseholdContext.Provider>
      );

      const { result, rerender } = renderHook(() => useHousehold(), {
        wrapper: TestWrapper
      });

      expect(result.current.activeHouseholdId).toBe('household-1');

      // Update the context value
      mockContext = createMockContextValue({
        activeHouseholdId: 'household-2'
      });

      rerender();

      expect(result.current.activeHouseholdId).toBe('household-2');
    });
  });
});