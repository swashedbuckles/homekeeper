import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import {
  getComponentName,
  validateActionChildren,
  validateNavChildren,
  validateOptionChildren,
  validateStepsChildren
} from '../../../src/lib/validation/children';
import { Action } from '../../../src/components/common/Action';
import { Button } from '../../../src/components/common/Button';
import { Step } from '../../../src/components/common/Steps';
import { Option } from '../../../src/components/form/Option';
import { NavItem } from '../../../src/components/headers/NavItem';

describe('children validation utilities', () => {
  describe('getComponentName', () => {
    it('returns string directly if component type is string', () => {
      expect(getComponentName('div')).toBe('div');
      expect(getComponentName('span')).toBe('span');
    });

    it('returns displayName if available on component', () => {
      const ComponentWithDisplayName = () => null;
      ComponentWithDisplayName.displayName = 'CustomComponent';
      
      expect(getComponentName(ComponentWithDisplayName)).toBe('CustomComponent');
    });

    it('returns function name if displayName not available', () => {
      function NamedComponent() {
        return null;
      }
      
      expect(getComponentName(NamedComponent)).toBe('NamedComponent');
    });

    it('returns empty string for anonymous functions without displayName', () => {
      // Create a truly anonymous function by accessing it from an array
      const components = [() => null];
      const anonymousComponent = components[0];
      
      expect(getComponentName(anonymousComponent)).toBe('');
    });

    it('prioritizes displayName over function name', () => {
      function ComponentWithBoth() {
        return null;
      }
      ComponentWithBoth.displayName = 'DisplayNameOverride';
      
      expect(getComponentName(ComponentWithBoth)).toBe('DisplayNameOverride');
    });
  });

  describe('validateActionChildren', () => {
    it('allows valid Action and Button children', () => {
      const children = [
        createElement(Action, { key: '1', children: null }, 'Action 1'),
        createElement(Button, { key: '2', children: null }, 'Button 1'),
        createElement(Action, { key: '3', children: null }, 'Action 2')
      ];

      const result = validateActionChildren(children, 'TestComponent');

      expect(result).toHaveLength(3);
    });

    it('filters out invalid children', () => {
      const children = [
        createElement(Action, { key: '1', children: null }, 'Valid Action'),
        createElement('div', { key: '2' }, 'Invalid div'),
        createElement(Button, { key: '3', children: null }, 'Valid Button'),
        'Invalid string child'
      ];

      const result = validateActionChildren(children, 'TestComponent');

      expect(result).toHaveLength(2);
    });

    it('handles empty children', () => {
      const result = validateActionChildren([], 'TestComponent');
      
      expect(result).toHaveLength(0);
    });

    it('handles null/undefined children', () => {
      const result1 = validateActionChildren(null, 'TestComponent');
      const result2 = validateActionChildren(undefined, 'TestComponent');
      
      expect(result1).toHaveLength(0);
      expect(result2).toHaveLength(0);
    });

    it('preserves React element properties', () => {
      const children = [
        createElement(Action, { key: 'action-1', className: 'test-class', children: null }, 'Action')
      ];

      const result = validateActionChildren(children, 'TestComponent');

      expect(result[0].key).toBe('.$action-1');
      expect(result[0].props.className).toBe('test-class');
    });
  });

  describe('validateNavChildren', () => {
    it('allows valid NavItem children', () => {
      const children = [
        createElement(NavItem, { key: '1', path: '/dashboard', children: null }, 'Dashboard'),
        createElement(NavItem, { key: '2', path: '/settings', children: null }, 'Settings')
      ];

      const result = validateNavChildren(children, 'AppNavigation');

      expect(result).toHaveLength(2);
    });

    it('filters out invalid children', () => {
      const children = [
        createElement(NavItem, { key: '1', path: '/dashboard', children: null }, 'Valid NavItem'),
        createElement('a', { key: '2' }, 'Invalid anchor'),
        createElement(Button, { key: '3', children: null }, 'Invalid Button')
      ];

      const result = validateNavChildren(children, 'AppNavigation');

      expect(result).toHaveLength(1);
    });
  });

  describe('validateOptionChildren', () => {
    it('extracts option data from valid Option children', () => {
      const children = [
        createElement(Option, { key: '1', value: 'us', children: null }, 'United States'),
        createElement(Option, { key: '2', value: 'ca', disabled: true, children: null }, 'Canada'),
        createElement(Option, { key: '3', value: 'uk', children: null }, 'United Kingdom')
      ];

      const result = validateOptionChildren(children, 'Select');

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { value: 'us', label: 'United States', disabled: false },
        { value: 'ca', label: 'Canada', disabled: true },
        { value: 'uk', label: 'United Kingdom', disabled: false }
      ]);
    });

    it('handles non-string children by converting to string', () => {
      const children = [
        createElement(Option, { key: '1', value: 'num', children: null }, 123),
        createElement(Option, { key: '2', value: 'jsx', children: null }, createElement('span', {}, 'JSX Content'))
      ];

      const result = validateOptionChildren(children, 'Select');

      expect(result).toHaveLength(2);
      expect(result[0].label).toBe('123');
      expect(result[1].label).toBe('[object Object]'); // JSX elements convert to [object Object]
    });

    it('filters out invalid children', () => {
      const children = [
        createElement(Option, { key: '1', value: 'valid', children: null }, 'Valid Option'),
        createElement('option', { key: '2', children: null }, 'Invalid HTML option'),
        createElement(Button, { key: '3', children: null }, 'Invalid Button')
      ];

      const result = validateOptionChildren(children, 'Select');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ value: 'valid', label: 'Valid Option', disabled: false });
    });

    it('handles default disabled value correctly', () => {
      const children = [
        createElement(Option, { key: '1', value: 'enabled', children: null }, 'Enabled Option'),
        createElement(Option, { key: '2', value: 'disabled', disabled: false, children: null }, 'Explicitly Enabled')
      ];

      const result = validateOptionChildren(children, 'Select');

      expect(result).toEqual([
        { value: 'enabled', label: 'Enabled Option', disabled: false },
        { value: 'disabled', label: 'Explicitly Enabled', disabled: false }
      ]);
    });
  });

  describe('validateStepsChildren', () => {
    it('allows valid Step children', () => {
      const children = [
        createElement(Step, { key: '1', children: 'Step 1' }),
        createElement(Step, { key: '2', children: 'Step 2' }),
        createElement(Step, { key: '3', children: 'Step 3' })
      ];

      const result = validateStepsChildren(children, 'Steps');

      expect(result).toHaveLength(3);
    });

    it('filters out invalid children', () => {
      const children = [
        createElement(Step, { key: '1', children: 'Valid Step' }),
        createElement('li', { key: '2' }, 'Invalid list item'),
        createElement(Button, { key: '3', children: null }, 'Invalid Button')
      ];

      const result = validateStepsChildren(children, 'Steps');

      expect(result).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('handles mixed valid and invalid children', () => {
      const children = [
        createElement(Action, { key: 'action-1', children: null }, 'Valid Action'),
        createElement('div', { key: 'div-1' }, 'Invalid div'),
        createElement(Button, { key: 'button-1', children: null }, 'Valid Button'),
        'Invalid string'
      ];

      const result = validateActionChildren(children, 'TestComponent');

      expect(result).toHaveLength(2);
    });
  });
});