import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Children,
  isValidElement,

  type ReactNode,
  type KeyboardEvent,
} from 'react';

/** @internal Tab key type for identifying tabs */
type TabKey = string;

/** @internal Tab reference type for keyboard navigation */
type TabRef = HTMLElement;

/**
 * Props for the main Tabs component
 * 
 * @public
 */
export interface TabsProps {
  /** React children - should contain Tabs.List and Tabs.Panel components */
  children: ReactNode;
  /** Default active tab for uncontrolled mode. If not provided, first tab will be selected */
  defaultTab?: TabKey;
  /** Active tab for controlled mode. When provided, component becomes controlled */
  activeTab?: TabKey;
  /** Callback fired when tab changes. Required for controlled mode */
  onTabChange?: (tab: TabKey) => void;
}

/**
 * Props for the Tabs.List component
 * 
 * @public
 */
export interface TabsListProps {
  /** React children - should contain Tabs.Button components */
  children: ReactNode;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * Props for the Tabs.Button component
 * 
 * @public
 */
export interface TabsButtonProps {
  /** Button content */
  children: ReactNode;
  /** Unique identifier for this tab - must match corresponding Tabs.Panel value */
  value: string;
  /** Additional CSS classes to apply */
  className?: string;
  /** Whether the tab button is disabled */
  disabled?: boolean;
}

/**
 * Props for the Tabs.Panel component
 * 
 * @public
 */
export interface TabsPanelProps {
  /** Panel content */
  children: ReactNode;
  /** Unique identifier for this panel - must match corresponding Tabs.Button value */
  value: string;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * Internal context interface for Tabs component state management
 * 
 * @internal
 */
interface ITabsContext {
  /** Currently active tab value */
  activeTab: string | undefined;
  /** State setter for active tab (uncontrolled mode only) */
  setActiveTab: React.Dispatch<React.SetStateAction<string | undefined>>;
  /** Register a tab button ref for keyboard navigation */
  registerTab: (value: TabKey, ref: TabRef) => void;
  /** Unregister a tab button ref */
  unregisterTab: (value: TabKey) => boolean;
  /** Handle keyboard navigation events */
  handleKeyDown: (event: KeyboardEvent, currentTab: string) => void;
  /** Whether component is in controlled mode */
  isControlled: boolean;
  /** Tab change callback */
  onTabChange?: (tab: TabKey) => void;
}

/**
 * Internal React context for managing tabs state
 * 
 * @internal
 */
const TabsContext = createContext<ITabsContext>({} as ITabsContext);

/**
 * Hook to access the tabs context
 * 
 * @internal
 * @throws {Error} When used outside of a Tabs provider
 * @returns The tabs context value
 */
function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs provider');
  }

  return context;
}

/**
 * Tabs component with compound component pattern supporting both controlled and uncontrolled usage
 * 
 * Features:
 * - Compound components (Tabs.List, Tabs.Button, Tabs.Panel)
 * - Controlled and uncontrolled modes
 * - Full keyboard navigation (Arrow keys, Home/End)
 * - Accessibility with ARIA attributes
 * - Neobrutalist design system integration
 * - Validation and error handling
 * - State preservation (panels remain mounted)
 * 
 * @example
 * ```tsx
 * // Uncontrolled usage
 * <Tabs defaultTab="settings">
 *   <Tabs.List>
 *     <Tabs.Button value="settings">Settings</Tabs.Button>
 *     <Tabs.Button value="members">Members</Tabs.Button>
 *   </Tabs.List>
 *   <Tabs.Panel value="settings">
 *     Settings content here
 *   </Tabs.Panel>
 *   <Tabs.Panel value="members">
 *     Members content here
 *   </Tabs.Panel>
 * </Tabs>
 * 
 * // Controlled usage
 * <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
 *   ...
 * </Tabs>
 * ```
 * 
 * @param props - The tabs component props
 * @returns JSX element
 * 
 * @public
 */
export const Tabs = ({ children, defaultTab, onTabChange, activeTab: controlledTab }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(() => validateAndGetInitialTab(children, defaultTab));
  const tabRefs = useRef(new Map<TabKey, TabRef>());
  const isControlled = controlledTab !== undefined;

  // Validate for orphaned tabs
  useEffect(() => {
    const { tabValues, panelValues } = collectTabsAndPanels(children);
    
    tabValues.forEach(tabValue => {
      if (!panelValues.has(tabValue)) {
        console.warn(`Tab button "${tabValue}" has no corresponding panel`);
      }
    });
  }, [children]);

  const contextValue = useMemo(() => {
    const registerTab = (value: TabKey, ref: TabRef) => {
      tabRefs.current.set(value, ref);
    };

    const unregisterTab = (value: TabKey) => tabRefs.current.delete(value);

    const handleKeyDown = (event: KeyboardEvent, currentTab: string) => {
      const tabs = Array.from(tabRefs.current.keys());
      const currentIndex = tabs.indexOf(currentTab);
      let newIndex;

      switch (event.key) {
        case 'ArrowRight': newIndex = (currentIndex + 1) % tabs.length; break;
        case 'ArrowLeft': newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1; break;
        case 'Home': newIndex = 0; break;
        case 'End': newIndex = tabs.length - 1; break;
        default: return;
      }

      event.preventDefault();
      const newTab = tabs[newIndex];
      
      if (isControlled) {
        // In controlled mode, only call onTabChange
        if (onTabChange) {
          onTabChange(newTab);
        }
      } else {
        // In uncontrolled mode, update internal state
        setActiveTab(newTab);
        if (onTabChange) {
          onTabChange(newTab);
        }
      }

      const newTabRef = tabRefs.current.get(newTab);
      if(newTabRef) {
        newTabRef.focus();
      }
    };

    return {
      activeTab: isControlled ? controlledTab : activeTab,
      setActiveTab,
      registerTab,
      unregisterTab,
      handleKeyDown,
      isControlled,
      onTabChange
    };
  }, [controlledTab, activeTab, onTabChange, isControlled]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div data-testid="tabs-stub">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

/**
 * Container for tab buttons with flex layout and gap spacing
 * 
 * @param props - The tabs list props
 * @returns JSX element
 * 
 * @public
 */
const TabsList = ({ children, className }: TabsListProps) => {
  const baseClasses = 'flex flex-wrap gap-4';
  const classes = [
    baseClasses,
    className, 
  ].filter(Boolean).join(' ');
  return (
    <div role="tablist" className={classes} data-testid="tabs-list">
      {children}
    </div>
  );
};

/**
 * Individual tab button with neobrutalist styling and keyboard navigation
 * 
 * Features:
 * - Automatic registration for keyboard navigation
 * - ARIA attributes for accessibility
 * - Active/inactive state styling
 * - Click and keyboard event handling
 * - Disabled state support
 * 
 * @param props - The tab button props
 * @returns JSX element
 * 
 * @public
 */
const TabsButton = ({ children, value, className, disabled }: TabsButtonProps) => {
  const context = useTabsContext();
  const buttonRef = useRef(null);
  const isActive = context.activeTab === value;

  useEffect(() => {
    if (!buttonRef.current) {
      return () => { };
    }

    context.registerTab(value, buttonRef.current);
    return () => context.unregisterTab(value);
  }, [value, context]);

  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }

    if (context.isControlled) {
      // In controlled mode, only call onTabChange
      if (context.onTabChange) {
        context.onTabChange(value);
      }
    } else {
      // In uncontrolled mode, update internal state
      context.setActiveTab(value);
      if (context.onTabChange) {
        context.onTabChange(value);
      }
    }
  }, [value, disabled, context]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => context.handleKeyDown(event, value), [value, context]);

  const baseClasses = 'border-4 border-text-primary font-black uppercase tracking-wider brutal-transition';
  const activeClasses = 'bg-primary text-white shadow-none transform translate-x-1 translate-y-1';
  const inactiveClasses = 'bg-transparent text-text-primary brutal-shadow-dark';
  const classes = [
    baseClasses,
    isActive ? activeClasses : inactiveClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={buttonRef}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isActive ? 0 : -1}
      className={classes}
      data-testid="tabs-button-stub"
    >
      {children}
    </button>
  );
};

/**
 * Tab panel that shows/hides content based on active tab
 * 
 * Panels remain mounted to preserve state (forms, scroll position, etc.)
 * but are hidden using CSS classes and the `hidden` attribute.
 * 
 * @param props - The tab panel props
 * @returns JSX element
 * 
 * @public
 */
const TabsPanel = ({ children, value, className }: TabsPanelProps) => {
  const context = useTabsContext();
  const isActive = context.activeTab === value;
  const panelClasses = [
    isActive ? 'block' : 'hidden',
    className
  ].join(' ' );

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      data-testid="tabs-panel-stub"
      hidden={!isActive}
      tabIndex={0}
      className={panelClasses}
    >
      {children}
    </div>
  );
};

/**
 * Attach subcomponents to main component for compound component pattern
 * 
 * This allows usage like:
 * - Tabs.List
 * - Tabs.Button  
 * - Tabs.Panel
 */
Tabs.List = TabsList;
Tabs.Button = TabsButton;
Tabs.Panel = TabsPanel;

/* ====== Child Validation Utilities ====== */

/**
 * Traverses children to collect tab and panel values for validation
 * 
 * @internal
 * @param children - React children to process
 * @returns Object containing sets of tab values and panel values
 */
function collectTabsAndPanels(children: ReactNode) {
  const tabValues = new Set<string>();
  const panelValues = new Set<string>();
  
  const processChild = (child: ReactNode) => {
    if (!isValidElement(child)) return;
    
    if (child.type === TabsList) {
      Children.forEach((child.props as TabsListProps).children, (listChild: ReactNode) => {
        if (isValidElement(listChild)) {
          if (listChild.type === TabsButton) {
            tabValues.add((listChild.props as TabsButtonProps).value);
          } else {
            const typeName = typeof listChild.type === 'function' ? listChild.type.name : String(listChild.type);
            console.warn(`Invalid child component in Tabs.List. Expected Tabs.Button, got ${typeName}`);
          }
        }
      });
    } else if (child.type === TabsPanel) {
      panelValues.add((child.props as TabsPanelProps).value);
    } else if (child.type !== TabsButton) {
      const typeName = typeof child.type === 'function' ? child.type.name : String(child.type);
      console.warn(`Invalid child component in Tabs. Expected Tabs.List or Tabs.Panel, got ${typeName}`);
    }
  };
  
  Children.forEach(children, processChild);
  return { tabValues, panelValues };
}

/**
 * Gets the value of the first tab button found in children
 * 
 * @internal
 * @param children - React children to search
 * @returns The first tab value found, or undefined if none found
 */
function getFirstTabValue(children: ReactNode): string | undefined {
  let firstTab: string | undefined;
  
  Children.forEach(children, (child: ReactNode) => {
    if (isValidElement(child) && child.type === TabsList) {
      Children.forEach((child.props as TabsListProps).children, (listChild: ReactNode) => {
        if (isValidElement(listChild) && listChild.type === TabsButton && !firstTab) {
          firstTab = (listChild.props as TabsButtonProps).value;
        }
      });
    }
  });
  
  return firstTab;
}

/**
 * Validates the defaultTab prop and returns the initial active tab
 * 
 * @internal
 * @param children - React children to validate against
 * @param defaultTab - The default tab value to validate
 * @returns The validated initial tab value, falling back to first tab if invalid
 */
function validateAndGetInitialTab(children: ReactNode, defaultTab?: string): string | undefined {
  const { tabValues } = collectTabsAndPanels(children);
  const firstTab = getFirstTabValue(children);
  
  if (defaultTab && !tabValues.has(defaultTab)) {
    console.warn(`defaultTab "${defaultTab}" does not match any tab values. Available tabs: ${Array.from(tabValues).join(', ')}`);
    return firstTab;
  }
  
  return defaultTab || firstTab;
}