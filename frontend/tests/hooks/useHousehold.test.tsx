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

    describe('loading and error states', () => {
      const stateTests = [
        {
          name: 'returns loading states',
          contextOverrides: {
            isLoadingHouseholds: true,
            isLoadingActiveHousehold: true
          },
          expectations: {
            isLoadingHouseholds: true,
            isLoadingActiveHousehold: true
          }
        },
        {
          name: 'returns error states',
          contextOverrides: {
            householdsError: new Error('Failed to fetch households'),
            activeHouseholdError: new Error('Failed to fetch active household')
          },
          expectations: {
            householdsError: new Error('Failed to fetch households'),
            activeHouseholdError: new Error('Failed to fetch active household')
          }
        }
      ];

      stateTests.forEach(({ name, contextOverrides, expectations }) => {
        it(name, () => {
          const mockContext = createMockContextValue(contextOverrides);
          const wrapper = createWrapperWithContext(mockContext);

          const { result } = renderHook(() => useHousehold(), { wrapper });

          Object.entries(expectations).forEach(([key, expectedValue]) => {
            if (expectedValue instanceof Error) {
              expect(result.current[key as keyof typeof result.current]).toEqual(expectedValue);
            } else {
              expect(result.current[key as keyof typeof result.current]).toBe(expectedValue);
            }
          });
        });
      });
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
      const permissionTests = [
        {
          role: 'owner',
          contextOverrides: { currentRole: 'owner', canManageHousehold: true },
          expectedRole: 'owner',
          expectedCanManage: true
        },
        {
          role: 'admin',
          contextOverrides: { currentRole: 'admin', canManageHousehold: true },
          expectedRole: 'admin',
          expectedCanManage: true
        },
        {
          role: 'member',
          contextOverrides: { currentRole: 'member', canManageHousehold: false },
          expectedRole: 'member',
          expectedCanManage: false
        },
        {
          role: 'guest',
          contextOverrides: { currentRole: 'guest', canManageHousehold: false },
          expectedRole: 'guest',
          expectedCanManage: false
        },
        {
          role: 'null role',
          contextOverrides: { currentRole: null, canManageHousehold: false },
          expectedRole: null,
          expectedCanManage: false
        }
      ];

      permissionTests.forEach(({ role, contextOverrides, expectedRole, expectedCanManage }) => {
        it(`returns correct permissions for ${role}`, () => {
          const mockContext = createMockContextValue(contextOverrides);
          const wrapper = createWrapperWithContext(mockContext);

          const { result } = renderHook(() => useHousehold(), { wrapper });

          expect(result.current.currentRole).toBe(expectedRole);
          expect(result.current.canManageHousehold).toBe(expectedCanManage);
        });
      });
    });

    describe('empty/null states', () => {
      const nullStateTests = [
        {
          name: 'handles no active household',
          contextOverrides: {
            activeHouseholdId: null,
            activeHousehold: undefined,
            currentRole: null,
            canManageHousehold: false
          },
          expectations: {
            activeHouseholdId: null,
            activeHousehold: undefined,
            currentRole: null,
            canManageHousehold: false
          }
        },
        {
          name: 'handles empty households list',
          contextOverrides: { userHouseholds: [] },
          expectations: { userHouseholds: [] }
        },
        {
          name: 'handles undefined households list',
          contextOverrides: { userHouseholds: undefined },
          expectations: { userHouseholds: undefined }
        }
      ];

      nullStateTests.forEach(({ name, contextOverrides, expectations }) => {
        it(name, () => {
          const mockContext = createMockContextValue(contextOverrides);
          const wrapper = createWrapperWithContext(mockContext);

          const { result } = renderHook(() => useHousehold(), { wrapper });

          Object.entries(expectations).forEach(([key, expectedValue]) => {
            expect(result.current[key as keyof typeof result.current]).toEqual(expectedValue);
          });
        });
      });
    });
  });

  describe('when used outside HouseholdProvider', () => {
    const errorTests = [
      {
        name: 'throws an error when used without provider',
        setup: () => renderHook(() => useHousehold())
      },
      {
        name: 'throws an error when context is null',
        setup: () => {
          const wrapper = createWrapperWithContext(null);
          return renderHook(() => useHousehold(), { wrapper });
        }
      }
    ];

    errorTests.forEach(({ name, setup }) => {
      it(name, () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
          setup();
        }).toThrow('`useHousehold` must be used within HouseholdProvider');

        consoleSpy.mockRestore();
      });
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