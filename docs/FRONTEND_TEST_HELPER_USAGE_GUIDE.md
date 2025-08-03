# HomeKeeper Test Helper Usage Guide

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Helper Categories](#helper-categories)
4. [Usage Patterns](#usage-patterns)
5. [Best Practices](#best-practices)
6. [Examples by Component Type](#examples-by-component-type)
7. [Migration Guide](#migration-guide)
8. [Troubleshooting](#troubleshooting)

## Overview

The HomeKeeper test helper system provides a comprehensive set of utilities designed to eliminate repetitive test code and ensure consistent testing patterns across the entire frontend codebase. These helpers implement data-driven testing approaches and consolidate common assertions into reusable functions.

### Benefits

- **Reduced Code Duplication**: 25% average reduction in test file size
- **Consistent Patterns**: Standardized testing approaches across all components
- **Improved Maintainability**: Changes to test patterns centralized in helper files
- **Enhanced Readability**: Tests focus on what's being tested, not how
- **Type Safety**: Full TypeScript support with comprehensive type annotations

### Helper Files Structure

```
tests/helpers/
├── testHelpers.ts              # Core assertion utilities
├── componentTestHelpers.tsx    # Component test factories
├── apiTestHelpers.ts          # API mocking and testing utilities
├── hookTestHelpers.tsx        # React hook testing patterns
├── compoundComponentHelpers.tsx # Complex component testing
└── contextTestHelpers.tsx     # Context provider testing
```

## Quick Start

### 1. Basic Component Testing

```typescript
import { expectElementToHaveClasses } from '@/tests/helpers/testHelpers';

describe('Button', () => {
  it('applies correct styling', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    
    // Instead of multiple expect statements
    expectElementToHaveClasses(button, [
      'bg-primary', 'text-white', 'font-bold'
    ]);
  });
});
```

### 2. Data-Driven Variant Testing

```typescript
import { createVariantTests } from '@/tests/helpers/componentTestHelpers';

// Generates complete test suite for all variants
createVariantTests('Button', Button, [
  { name: 'primary', props: { variant: 'primary' }, expectedClasses: ['bg-primary', 'text-white'] },
  { name: 'secondary', props: { variant: 'secondary' }, expectedClasses: ['bg-secondary', 'text-dark'] },
  { name: 'danger', props: { variant: 'danger' }, expectedClasses: ['bg-error', 'text-white'] }
], { children: 'Test Button' });
```

### 3. API Testing

```typescript
import { mockApiSuccess, expectApiSuccess } from '@/tests/helpers/apiTestHelpers';

describe('getHouseholds', () => {
  it('fetches household data successfully', async () => {
    const mockData = [{ id: 'house-1', name: 'Test House' }];
    
    mockApiSuccess('/households', mockData);
    await expectApiSuccess(() => getHouseholds(), mockData);
  });
});
```

## Helper Categories

### 1. Core Assertion Helpers (`testHelpers.ts`)

**Purpose**: Fundamental assertion utilities used across all test types.

**Key Functions**:
- `expectElementToHaveClasses()` - CSS class verification
- `expectTextToBeVisible()` - Text content assertions
- `expectErrorState()` - Error state validation
- `expectShadowClasses()` - Design system shadow testing

**When to Use**: Every test that needs to verify styling, content, or component states.

### 2. Component Test Factories (`componentTestHelpers.tsx`)

**Purpose**: Generate complete test suites for common component patterns.

**Key Functions**:
- `createVariantTests()` - Variant testing (primary, secondary, etc.)
- `createSizeTests()` - Size testing (sm, md, lg)
- `createShadowTests()` - Shadow effect testing
- `createInteractionTests()` - User interaction testing

**When to Use**: Components with variants, sizes, or interactive states.

### 3. API Testing Utilities (`apiTestHelpers.ts`)

**Purpose**: Standardize API mocking and response testing.

**Key Functions**:
- `mockApiSuccess()` - Mock successful API responses
- `mockApiError()` - Mock API error responses
- `expectApiSuccess()` - Verify successful API calls
- `createSuccessTest()` - Generate complete success test scenarios

**When to Use**: Testing any code that interacts with APIs or HTTP requests.

### 4. Hook Testing Patterns (`hookTestHelpers.tsx`)

**Purpose**: Consistent patterns for testing React hooks.

**Key Functions**:
- `createHookInitialStateTests()` - Initial state testing
- `createHookActionTests()` - Hook action testing
- `createAuthWrapper()` - Authentication context wrapper
- `AUTH_STATE_SCENARIOS` - Predefined auth state scenarios

**When to Use**: Testing custom hooks, especially authentication and state management hooks.

### 5. Compound Component Helpers (`compoundComponentHelpers.tsx`)

**Purpose**: Testing complex components with multiple sub-components.

**Key Functions**:
- `createAvatarTests()` - Avatar sub-component testing
- `createBadgeTests()` - Badge sub-component testing
- `createComplexScenarioTests()` - Multi-component integration
- `createCompoundComponentTestSuite()` - Complete test suite factory

**When to Use**: Components like MediaCard, ListItem, TaskCard with nested sub-components.

### 6. Context Testing Utilities (`contextTestHelpers.tsx`)

**Purpose**: Testing React context providers and consumers.

**Key Functions**:
- `createProviderInitializationTests()` - Provider setup testing
- `createContextStateUpdateTests()` - State update testing
- `createStateTransitionTests()` - Complex state machine testing
- `AUTH_PROVIDER_SCENARIOS` - Auth provider test scenarios

**When to Use**: Testing context providers like AuthProvider, HouseholdProvider.

## Usage Patterns

### Pattern 1: Data-Driven Testing

Replace repetitive test blocks with data-driven approaches:

**Before**:
```typescript
it('renders small size correctly', () => {
  render(<Button size="sm">Small</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('text-sm');
  expect(button).toHaveClass('px-3');
  expect(button).toHaveClass('py-1');
});

it('renders medium size correctly', () => {
  render(<Button size="md">Medium</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('text-base');
  expect(button).toHaveClass('px-4');
  expect(button).toHaveClass('py-2');
});
```

**After**:
```typescript
const sizeTests = [
  { size: 'sm', expectedClasses: ['text-sm', 'px-3', 'py-1'] },
  { size: 'md', expectedClasses: ['text-base', 'px-4', 'py-2'] },
  { size: 'lg', expectedClasses: ['text-lg', 'px-6', 'py-3'] }
];

describe('sizes', () => {
  sizeTests.forEach(({ size, expectedClasses }) => {
    it(`renders ${size} size correctly`, () => {
      render(<Button size={size}>Test</Button>);
      const button = screen.getByRole('button');
      expectElementToHaveClasses(button, expectedClasses);
    });
  });
});
```

### Pattern 2: Helper Function Consolidation

Extract common rendering patterns:

**Before**:
```typescript
it('test 1', () => {
  render(<Component variant="primary" size="md" testId="test">Content</Component>);
  const element = screen.getByTestId('test');
  // test logic
});

it('test 2', () => {
  render(<Component variant="secondary" size="lg" testId="test">Content</Component>);
  const element = screen.getByTestId('test');
  // test logic
});
```

**After**:
```typescript
const renderComponent = (props = {}) => {
  render(<Component testId="test" {...props}>Content</Component>);
  return screen.getByTestId('test');
};

it('test 1', () => {
  const element = renderComponent({ variant: 'primary', size: 'md' });
  // test logic
});

it('test 2', () => {
  const element = renderComponent({ variant: 'secondary', size: 'lg' });
  // test logic
});
```

### Pattern 3: Factory Function Usage

Use factories for comprehensive test coverage:

```typescript
// Generate complete test suites
createVariantTests('Button', Button, BUTTON_VARIANTS, BASE_PROPS);
createSizeTests('Button', Button, BUTTON_SIZES, BASE_PROPS);
createInteractionTests('Button', Button, INTERACTION_SCENARIOS);

// Custom test data
const BUTTON_VARIANTS = [
  { name: 'primary', props: { variant: 'primary' }, expectedClasses: ['bg-primary'] },
  { name: 'secondary', props: { variant: 'secondary' }, expectedClasses: ['bg-secondary'] }
];
```

## Best Practices

### 1. Choose the Right Helper

**For simple assertions**: Use core helpers from `testHelpers.ts`
```typescript
expectElementToHaveClasses(button, ['bg-primary', 'text-white']);
```

**For systematic testing**: Use factory functions from `componentTestHelpers.tsx`
```typescript
createVariantTests('Button', Button, variants);
```

**For complex components**: Use specialized helpers from `compoundComponentHelpers.tsx`
```typescript
createCompoundComponentTestSuite('MediaCard', MediaCard, scenarios);
```

### 2. Organize Test Data

Keep test data close to tests but reusable:

```typescript
// Test data constants
const VARIANT_SCENARIOS = [
  { variant: 'primary', expectedClasses: ['bg-primary', 'text-white'] },
  { variant: 'secondary', expectedClasses: ['bg-secondary', 'text-dark'] }
];

const BASE_PROPS = {
  children: 'Test Button',
  testId: 'button'
};

// Use in tests
createVariantTests('Button', Button, VARIANT_SCENARIOS, BASE_PROPS);
```

### 3. Layer Your Testing

Combine different helpers for comprehensive coverage:

```typescript
describe('Button', () => {
  // Basic rendering
  it('renders with default props', () => {
    render(<Button>Test</Button>);
    expectElementToHaveClasses(screen.getByRole('button'), ['font-mono', 'font-bold']);
  });

  // Systematic variant testing
  createVariantTests('Button', Button, VARIANT_SCENARIOS, BASE_PROPS);
  
  // Systematic size testing
  createSizeTests('Button', Button, SIZE_SCENARIOS, BASE_PROPS);
  
  // Interaction testing
  createInteractionTests('Button', Button, INTERACTION_SCENARIOS);
});
```

### 4. Maintain Type Safety

Always use TypeScript properly with helpers:

```typescript
// Good: Typed scenarios
const scenarios: Array<{
  name: string;
  props: Partial<ButtonProps>;
  expectedClasses: string[];
}> = [
  { name: 'primary', props: { variant: 'primary' }, expectedClasses: ['bg-primary'] }
];

// Good: Generic factory usage
createVariantTests<ButtonProps>('Button', Button, scenarios);
```

### 5. Error Handling

Test both success and error states:

```typescript
describe('API calls', () => {
  it('handles success', async () => {
    mockApiSuccess('/households', mockData);
    await expectApiSuccess(() => getHouseholds(), mockData);
  });

  it('handles errors', async () => {
    mockApiError('/households', 404, 'Not found');
    await expectApiError(() => getHouseholds(), 404, 'Not found');
  });
});
```

## Examples by Component Type

### Simple Components (Button, Badge, Text)

```typescript
import { expectElementToHaveClasses, createVariantTests } from '@/tests/helpers';

describe('Badge', () => {
  const variantTests = [
    { name: 'default', props: { variant: 'default' }, expectedClasses: ['bg-gray-100'] },
    { name: 'success', props: { variant: 'success' }, expectedClasses: ['bg-green-100'] },
    { name: 'error', props: { variant: 'error' }, expectedClasses: ['bg-red-100'] }
  ];

  createVariantTests('Badge', Badge, variantTests, { children: 'Test Badge' });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Test</Badge>);
    expectElementToHaveClasses(screen.getByText('Test'), ['custom-class']);
  });
});
```

### Form Components (TextInput, Select, Checkbox)

```typescript
import { expectErrorState, createErrorStateTests } from '@/tests/helpers';

describe('TextInput', () => {
  createErrorStateTests(
    'TextInput',
    TextInput,
    { label: 'Email', type: 'email' },
    { error: 'Invalid email address' }
  );

  const sizeTests = [
    { size: 'sm', expectedClasses: ['text-sm', 'px-3', 'py-2'] },
    { size: 'md', expectedClasses: ['text-base', 'px-4', 'py-3'] },
    { size: 'lg', expectedClasses: ['text-lg', 'px-6', 'py-4'] }
  ];

  sizeTests.forEach(({ size, expectedClasses }) => {
    it(`renders ${size} size correctly`, () => {
      render(<TextInput label="Test" size={size} />);
      const input = screen.getByLabelText('Test');
      expectElementToHaveClasses(input, expectedClasses);
    });
  });
});
```

### Complex Components (MediaCard, ListItem, TaskCard)

```typescript
import { createCompoundComponentTestSuite, createAvatarTests } from '@/tests/helpers';

describe('MediaCard', () => {
  createCompoundComponentTestSuite('MediaCard', MediaCard, {
    baseProps: { testId: 'media-card' },
    avatarScenarios: [
      {
        description: 'renders with avatar',
        children: <MediaCard.Avatar src="/test.jpg" alt="Test" />,
        expectedClasses: ['rounded-full', 'w-12', 'h-12']
      }
    ],
    badgeScenarios: [
      {
        description: 'renders with status badge',
        children: <MediaCard.Badge variant="success">Active</MediaCard.Badge>,
        expectedClasses: ['bg-green-100', 'text-green-800']
      }
    ]
  });
});
```

### Hook Testing

```typescript
import { createHookInitialStateTests, AUTH_STATE_SCENARIOS } from '@/tests/helpers';

describe('useAuth', () => {
  createHookInitialStateTests('useAuth', useAuth, [
    AUTH_STATE_SCENARIOS.unknown,
    AUTH_STATE_SCENARIOS.loggedOut,
    AUTH_STATE_SCENARIOS.loggedIn()
  ]);

  createHookActionTests('useAuth', useAuth, [
    {
      description: 'logs in successfully',
      wrapper: createAuthWrapper(AuthStatus.LOGGED_OUT),
      action: async (result) => {
        await result.login('test@example.com', 'password');
      },
      expectedState: {
        isAuthenticated: true,
        authStatus: AuthStatus.LOGGED_IN
      }
    }
  ]);
});
```

### API Testing

```typescript
import { 
  mockApiSuccess, 
  mockApiError, 
  expectApiSuccess, 
  createSuccessTest 
} from '@/tests/helpers';

describe('household API', () => {
  const mockHousehold = { id: 'house-1', name: 'Test House' };

  it('fetches household successfully', async () => {
    mockApiSuccess('/households/house-1', mockHousehold);
    await expectApiSuccess(() => getHousehold('house-1'), mockHousehold);
  });

  // Or use factory for complete test
  const successTest = createSuccessTest(
    'creates household successfully',
    '/households',
    mockHousehold,
    () => createHousehold({ name: 'Test House' }),
    { name: 'Test House' }
  );

  it(successTest.description, async () => {
    successTest.setup();
    await successTest.test();
  });
});
```

### Context Provider Testing

```typescript
import { 
  createProviderInitializationTests, 
  AUTH_PROVIDER_SCENARIOS 
} from '@/tests/helpers';

describe('AuthProvider', () => {
  createProviderInitializationTests('AuthProvider', AuthProvider, useAuth, [
    AUTH_PROVIDER_SCENARIOS.defaultState,
    AUTH_PROVIDER_SCENARIOS.customState(AuthStatus.LOGGED_IN, mockUser)
  ]);

  createContextStateUpdateTests('AuthProvider', AuthProvider, useAuth, [
    {
      description: 'updates state on login',
      initialProps: {},
      action: async (contextValue) => {
        await contextValue.login('test@example.com', 'password');
      },
      expectedState: {
        isAuthenticated: true,
        authStatus: AuthStatus.LOGGED_IN
      }
    }
  ]);
});
```

## Migration Guide

### From Manual Tests to Helper-Based Tests

#### Step 1: Identify Patterns

Look for repetitive code in existing tests:
- Multiple similar expect statements
- Repeated component rendering
- Similar test structure across variants

#### Step 2: Choose Appropriate Helpers

- **Repetitive assertions** → Use core helpers from `testHelpers.ts`
- **Variant/size testing** → Use factory functions from `componentTestHelpers.tsx`
- **API testing** → Use utilities from `apiTestHelpers.ts`
- **Hook testing** → Use patterns from `hookTestHelpers.tsx`

#### Step 3: Migrate Incrementally

```typescript
// Phase 1: Replace assertions
expect(element).toHaveClass('bg-primary');
expect(element).toHaveClass('text-white');
// ↓
expectElementToHaveClasses(element, ['bg-primary', 'text-white']);

// Phase 2: Extract render patterns
const renderButton = (props) => {
  render(<Button {...props}>Test</Button>);
  return screen.getByRole('button');
};

// Phase 3: Use factory functions
createVariantTests('Button', Button, variants);
```

#### Step 4: Validate Results

Ensure all tests still pass and coverage is maintained:
```bash
npm test
npm run coverage
```

### Common Migration Scenarios

#### Variant Testing Migration

**Before**:
```typescript
describe('Button variants', () => {
  it('renders primary variant', () => {
    render(<Button variant="primary">Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-white');
  });

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-dark');
  });
});
```

**After**:
```typescript
const variantTests = [
  { name: 'primary', props: { variant: 'primary' }, expectedClasses: ['bg-primary', 'text-white'] },
  { name: 'secondary', props: { variant: 'secondary' }, expectedClasses: ['bg-secondary', 'text-dark'] }
];

createVariantTests('Button', Button, variantTests, { children: 'Test' });
```

**Benefits**: 
- 60% reduction in code
- Easier to add new variants
- Consistent test structure

## Troubleshooting

### Common Issues and Solutions

#### Issue: Helper not finding elements

**Problem**: `expectElementToHaveClasses` throws "element not found"

**Solutions**:
```typescript
// 1. Check testId usage
expectTestIdToHaveClasses('button', classes); // Use this for testId

// 2. Wait for async elements
await waitFor(() => {
  expectElementToHaveClasses(screen.getByRole('button'), classes);
});

// 3. Check element selection
const element = screen.getByRole('button', { name: 'Specific Button' });
expectElementToHaveClasses(element, classes);
```

#### Issue: Factory tests not working as expected

**Problem**: `createVariantTests` generates failing tests

**Solutions**:
```typescript
// 1. Check prop structure
const variants = [
  { 
    name: 'primary', 
    props: { variant: 'primary' }, // Make sure props match component interface
    expectedClasses: ['bg-primary'], 
    testId: 'button' // Optional custom testId
  }
];

// 2. Verify base props
const baseProps = {
  children: 'Test Button', // Required for Button component
  testId: 'test-button'    // Consistent testId
};

createVariantTests('Button', Button, variants, baseProps);
```

#### Issue: API mocks not working

**Problem**: `mockApiSuccess` not intercepting requests

**Solutions**:
```typescript
// 1. Check endpoint format
mockApiSuccess('/households', data); // Correct
mockApiSuccess('households', data);  // Missing leading slash

// 2. Clear mocks between tests
beforeEach(() => {
  fetchMock.clearAll();
});

// 3. Verify mock setup order
mockApiSuccess('/households', data); // Mock first
const result = await getHouseholds(); // Then call API
```

#### Issue: Hook tests failing

**Problem**: `createHookInitialStateTests` not working with context

**Solutions**:
```typescript
// 1. Provide proper wrapper
const wrapper = createAuthWrapper(AuthStatus.LOGGED_IN, mockUser);

createHookInitialStateTests('useAuth', useAuth, [
  {
    description: 'returns authenticated state',
    wrapper, // Include wrapper for context
    expectedState: { isAuthenticated: true }
  }
]);

// 2. Check wrapper component structure
const CustomWrapper = ({ children }) => (
  <AuthProvider initialAuthStatus={AuthStatus.LOGGED_IN}>
    <HouseholdProvider>
      {children}
    </HouseholdProvider>
  </AuthProvider>
);
```

### Performance Considerations

#### Helper Selection for Performance

**Fast Helpers** (use liberally):
- `expectElementToHaveClasses`
- `expectTextToBeVisible`
- Core assertion helpers

**Moderate Helpers** (use thoughtfully):
- Factory functions that generate multiple tests
- Helper functions that render components

**Expensive Helpers** (use sparingly):
- Complex scenario factories with many iterations
- Helpers that involve API calls or async operations

#### Optimizing Test Suites

```typescript
// Good: Focused testing
createVariantTests('Button', Button, ESSENTIAL_VARIANTS);

// Avoid: Over-testing
createVariantTests('Button', Button, ALL_POSSIBLE_VARIANTS);

// Good: Reuse rendered components
describe('Button interactions', () => {
  let button;
  
  beforeEach(() => {
    render(<Button onClick={mockFn}>Test</Button>);
    button = screen.getByRole('button');
  });

  it('calls onClick', () => {
    fireEvent.click(button);
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Debugging Tips

#### Test Failures

1. **Check component props**: Ensure test props match component interface
2. **Verify element selection**: Use `screen.debug()` to see rendered output
3. **Check async operations**: Use `waitFor` for async state changes
4. **Validate mock setup**: Ensure mocks are configured before API calls

#### Helper Development

When creating new helpers:

1. **Start simple**: Begin with basic assertion helpers
2. **Add TypeScript**: Include proper type annotations
3. **Test the helper**: Write tests for your test helpers
4. **Document thoroughly**: Include TSDoc comments and examples

### Getting Help

#### Resources

1. **Test Helper Documentation**: TSDoc comments in helper files
2. **Example Tests**: Look at existing test files using helpers
3. **TypeScript Types**: Leverage IDE type hints and autocomplete

#### Best Practices for Questions

When asking for help:

1. **Include code examples**: Show what you're trying to test
2. **Specify component type**: Simple, complex, or compound component
3. **Describe expected behavior**: What should the test verify
4. **Share error messages**: Include full error text and stack traces

## Conclusion

The HomeKeeper test helper system provides a powerful foundation for consistent, maintainable, and comprehensive testing. By following these patterns and best practices, you can:

- Write tests faster with less repetition
- Maintain consistent testing patterns across the codebase
- Focus on test logic rather than test setup
- Ensure comprehensive coverage with minimal effort

Remember: The goal is to make testing easier and more effective, not to add unnecessary complexity. Choose the right helper for your specific testing needs and always prioritize test clarity and maintainability.