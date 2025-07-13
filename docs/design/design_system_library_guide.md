# 🎯 HomeKeeper Design System Guide

A comprehensive guide to using the standardized size system and hover effects in the HomeKeeper design system.

## 📚 Table of Contents

- [Size System (`sizes.ts`)](#-size-system-sizests)
  - [Core Concepts](#core-concepts)
  - [Size Tokens](#size-tokens)
  - [Responsive Utilities](#responsive-utilities)
  - [Breakpoint Patterns](#breakpoint-patterns)
  - [When to Use What](#when-to-use-what)
- [Hover Effects (`hover-effects.ts`)](#-hover-effects-hover-effectsts)
  - [Available Effects](#available-effects)
  - [Component Recommendations](#component-recommendations)
  - [Implementation Examples](#implementation-examples)
- [Best Practices](#-best-practices)
- [Migration Guide](#-migration-guide)

---

## 🎨 Size System (`sizes.ts`)

The size system provides consistent sizing across all components using a standardized `xs | sm | md | lg | xl` scale.

### Core Concepts

#### StandardSize Scale

```typescript
type StandardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

**Visual Hierarchy:**

- `xs` - Tiny elements (12px text, minimal padding)
- `sm` - Small elements (14px text, compact spacing)
- `md` - Default/medium (16px text, comfortable spacing) ⭐ **Most common**
- `lg` - Large elements (18px text, generous spacing)
- `xl` - Extra large (20px text, maximum spacing)

### Size Tokens

#### Basic Usage

```typescript
import { getSizeToken } from '../lib/design-system/sizes';

// Get individual size aspects
getSizeToken('md', 'padding'); // Returns 'p-4'
getSizeToken('lg', 'text'); // Returns 'text-lg'
getSizeToken('sm', 'border'); // Returns 'border-brutal-sm'
```

#### Available Aspects

```typescript
const aspects = {
  padding: 'p-4', // All-around padding
  paddingX: 'px-4', // Horizontal padding
  paddingY: 'py-3', // Vertical padding
  text: 'text-base', // Font size
  border: 'border-brutal-md', // Border width
  spacing: 'gap-4', // Flex/grid gap
  icon: 'w-5 h-5', // Icon dimensions
};
```

#### Size Token Reference Table

| Size | Padding | Text        | Border             | Spacing | Icon      | Use Case                     |
| ---- | ------- | ----------- | ------------------ | ------- | --------- | ---------------------------- |
| `xs` | `p-2`   | `text-xs`   | `border-2`         | `gap-1` | `w-3 h-3` | Badges, tiny buttons         |
| `sm` | `p-3`   | `text-sm`   | `border-brutal-sm` | `gap-2` | `w-4 h-4` | Small buttons, compact forms |
| `md` | `p-4`   | `text-base` | `border-brutal-md` | `gap-4` | `w-5 h-5` | **Default size**             |
| `lg` | `p-6`   | `text-lg`   | `border-brutal-lg` | `gap-6` | `w-6 h-6` | Prominent buttons, headers   |
| `xl` | `p-8`   | `text-xl`   | `border-brutal-lg` | `gap-8` | `w-8 h-8` | Hero elements, CTAs          |

#### Combining Multiple Aspects

```typescript
import { buildSizeClasses } from '../lib/design-system/sizes';

// Build complete size classes
buildSizeClasses('md', ['padding', 'text', 'border']);
// Returns: 'p-4 text-base border-brutal-md'
```

### Responsive Utilities

#### Responsive Text

```typescript
import { getResponsiveTextToken } from '../lib/design-system/sizes';

// Mobile-first responsive text scaling
getResponsiveTextToken('md'); // Returns 'text-sm md:text-base'
getResponsiveTextToken('lg'); // Returns 'text-base md:text-lg'
```

**Responsive Text Scale:**

- `xs`: `text-xs` (consistent across breakpoints)
- `sm`: `text-xs md:text-sm` (12px → 14px)
- `md`: `text-sm md:text-base` (14px → 16px)
- `lg`: `text-base md:text-lg` (16px → 18px)
- `xl`: `text-lg md:text-xl` (18px → 20px)

#### Responsive Spacing

```typescript
import { getResponsiveSpacingToken } from '../lib/design-system/sizes';

// Mobile-first responsive spacing
getResponsiveSpacingToken('md', 'padding'); // Returns 'p-3 md:p-4'
getResponsiveSpacingToken('lg', 'gap'); // Returns 'gap-4 md:gap-6'
```

**Available Spacing Aspects:**

- `padding`, `paddingX`, `paddingY`
- `margin`, `marginX`, `marginY`
- `gap`

#### Example: Responsive Button

```tsx
// ✅ Good: Using responsive tokens
<button className={`
  ${getResponsiveTextToken('md')}
  ${getResponsiveSpacingToken('md', 'padding')}
  brutal-hover-press
`}>
  Click Me
</button>

// ❌ Bad: Manual responsive classes
<button className="text-sm md:text-base p-3 md:p-4">
  Click Me
</button>
```

### Breakpoint Patterns

#### Standard Responsive Patterns

```typescript
import { getResponsivePattern } from '../lib/design-system/sizes';

// Visibility patterns
getResponsivePattern('mobileOnly'); // 'md:hidden'
getResponsivePattern('tabletUp'); // 'hidden md:block'
getResponsivePattern('desktopUp'); // 'hidden lg:block'

// Layout patterns
getResponsivePattern('stackToRow'); // 'flex-col md:flex-row'
getResponsivePattern('rowToStack'); // 'flex-row md:flex-col'

// Grid patterns
getResponsivePattern('singleToDouble'); // 'grid-cols-1 md:grid-cols-2'
getResponsivePattern('singleToTriple'); // 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
```

#### Breakpoint Strategy

- **Mobile-first approach** - Start with mobile styles, enhance for larger screens
- **Primary breakpoint: `md:` (768px+)** - Most mobile/desktop splits happen here
- **Secondary breakpoint: `lg:` (1024px+)** - Desktop enhancements
- **Touch targets: 44px minimum** - Use `getResponsivePattern('touchTarget')`

#### Example: Responsive Navigation

```tsx
// ✅ Good: Using responsive patterns
<nav className={getResponsivePattern('tabletUp')}>
  <div className={`flex ${getResponsiveSpacingToken('lg', 'gap')}`}>
    <Button size="lg">Home</Button>
    <Button size="lg">About</Button>
  </div>
</nav>

// Mobile menu
<div className={getResponsivePattern('mobileOnly')}>
  <MobileMenuToggle />
</div>
```

### When to Use What

#### ✅ **Use Size Tokens When:**

- Creating new components that need consistent sizing
- You want automatic brutal border scaling (`border-brutal-sm/md/lg`)
- Building responsive components that scale across breakpoints
- Ensuring visual hierarchy consistency

#### ✅ **Use Responsive Functions When:**

- Components need different sizes on mobile vs desktop
- Text needs to scale for readability across devices
- Spacing needs to adapt to screen size
- Following mobile-first design principles

#### ✅ **Use Breakpoint Patterns When:**

- Showing/hiding elements at different screen sizes
- Changing layout direction (stack to row)
- Progressive grid enhancement (1 col → 2 col → 3 col)

#### ❌ **Don't Use Size System When:**

- You need one-off custom sizing that doesn't fit the scale
- The component requires very specific pixel-perfect dimensions
- Using non-standard Tailwind classes that aren't in our tokens

---

## 🎯 Hover Effects (`hover-effects.ts`)

The hover effect system provides consistent interaction patterns across all interactive components.

### Available Effects

#### Effect Types

```typescript
type HoverEffect = 'lift' | 'press' | 'press-small' | 'none';
```

#### Visual Behaviors

**`lift`** - Lifts element with enhanced shadow

```css
/* On hover: */
transform: translate(-4px, -4px);
box-shadow: 6px 6px 0 var(--shadow-primary), 12px 12px 0 var(--shadow-dark);
```

- **Use for:** Cards, content containers, list items
- **Feel:** Elegant, content-focused

**`press`** - Presses element down, removes shadow

```css
/* On hover: */
transform: translate(4px, 4px);
box-shadow: none;
```

- **Use for:** Buttons, CTAs, primary actions
- **Feel:** Tactile, action-oriented

**`press-small`** - Smaller press effect

```css
/* On hover: */
transform: translate(3px, 3px);
box-shadow: none;
```

- **Use for:** Small buttons, badges, secondary actions
- **Feel:** Subtle, refined

**`none`** - No hover effect

- **Use for:** Non-interactive elements, disabled states
- **Feel:** Static, informational

### Component Recommendations

#### Interactive Elements

```typescript
// Primary actions - strong tactile feedback
<Button hoverEffect="press" size="lg">Get Started</Button>
<BackButton hoverEffect="press" size="md">Go Back</BackButton>

// Secondary actions - subtle feedback
<Badge hoverEffect="press-small" size="sm">Status</Badge>
<Button variant="outline" hoverEffect="press-small">Cancel</Button>
```

#### Content Containers

```typescript
// Cards and containers - elegant lift
<Card hoverEffect="lift">Content here</Card>
<TaskCard hoverEffect="lift">Task details</TaskCard>
<OptionCard hoverEffect="press">Selectable option</OptionCard>
```

#### Non-Interactive Elements

```typescript
// Informational elements - no hover
<Alert hoverEffect="none">Important message</Alert>
<TextInput hoverEffect="none">User input</TextInput>
```

### Implementation Examples

#### Basic Usage

```typescript
import { getHoverEffectClass } from '../lib/design-system/hover-effects';

// Get hover class
const hoverClass = getHoverEffectClass('lift'); // Returns 'brutal-hover-lift'

// Apply to component
<div className={`base-styles ${hoverClass}`}>Hoverable content</div>;
```

#### Complete Hover Classes (with transition)

```typescript
import { getHoverEffectClasses } from '../lib/design-system/hover-effects';

// Get complete hover classes including transition
const hoverClasses = getHoverEffectClasses('press');
// Returns ['brutal-transition', 'brutal-hover-press']

<button className={`btn-base ${hoverClasses.join(' ')}`}>Press Me</button>;
```

#### Component Integration

```tsx
interface ButtonProps {
  hoverEffect?: HoverEffect;
  children: ReactNode;
}

export const Button = ({ hoverEffect = 'press', children }: ButtonProps) => {
  const hoverClasses = getHoverEffectClasses(hoverEffect);

  return (
    <button
      className={`
      btn-base
      ${hoverClasses.join(' ')}
    `}
    >
      {children}
    </button>
  );
};
```

---

## 💡 Best Practices

### Size System Best Practices

#### 1. **Stick to the Scale**

```tsx
// ✅ Good: Using standard sizes
<Button size="md">Default</Button>
<Button size="lg">Important</Button>

// ❌ Bad: Custom one-off sizing
<Button className="px-5 py-3.5 text-[17px]">Custom</Button>
```

#### 2. **Use Responsive Tokens for Mobile-First**

```tsx
// ✅ Good: Mobile-first responsive scaling
className={getResponsiveTextToken('lg')} // text-base md:text-lg

// ❌ Bad: Manual responsive classes
className="text-base md:text-lg lg:text-xl"
```

#### 3. **Consistent Breakpoint Usage**

```tsx
// ✅ Good: Using md: as primary breakpoint
className={getResponsivePattern('tabletUp')} // hidden md:block

// ❌ Bad: Inconsistent breakpoint choices
className="hidden lg:block" // Should use md: for mobile/desktop split
```

#### 4. **Combine Size Aspects Thoughtfully**

```tsx
// ✅ Good: Coherent size relationships
<Card size="lg"> {/* lg padding, lg text, lg spacing */}
  <Title size="lg">Large Content</Title>
</Card>

// ❌ Bad: Mismatched size relationships
<Card size="xs"> {/* tiny padding */}
  <Title size="xl">Huge Text</Title> {/* doesn't fit */}
</Card>
```

### Hover Effects Best Practices

#### 1. **Match Effect to Component Purpose**

```tsx
// ✅ Good: Appropriate effect for component type
<Card hoverEffect="lift">Content to explore</Card>
<Button hoverEffect="press">Action to take</Button>

// ❌ Bad: Mismatched effect
<Button hoverEffect="lift">Submit Form</Button> // Buttons should press
```

#### 2. **Consider Visual Weight**

```tsx
// ✅ Good: Effect matches size
<Button size="sm" hoverEffect="press-small">Small Action</Button>
<Button size="xl" hoverEffect="press">Primary CTA</Button>

// ❌ Bad: Heavy effect on small element
<Badge size="xs" hoverEffect="lift">Status</Badge>
```

#### 3. **Account for Shadow Spacing**

```tsx
// ✅ Good: Extra spacing for shadow elements
<Inline spacing="md" className="gap-6"> {/* Compensates for 8px shadow */}
  <Button hoverEffect="press">Action 1</Button>
  <Button hoverEffect="press">Action 2</Button>
</Inline>

// ❌ Bad: Insufficient spacing
<Inline spacing="sm"> {/* gap-2 = 8px, but shadows overlap */}
  <Button hoverEffect="press">Action 1</Button>
  <Button hoverEffect="press">Action 2</Button>
</Inline>
```

---

## 🔄 Migration Guide

### Migrating from Manual Classes

#### Before: Manual Sizing

```tsx
// Old approach
<button className="px-4 py-3 text-base border-4">Manual Button</button>
```

#### After: Size System

```tsx
// New approach
<button className={buildSizeClasses('md', ['paddingX', 'paddingY', 'text', 'border'])}>
  System Button
</button>

// Or using individual tokens
<button className={`
  ${getSizeToken('md', 'paddingX')}
  ${getSizeToken('md', 'paddingY')}
  ${getSizeToken('md', 'text')}
  ${getSizeToken('md', 'border')}
`}>
  Token Button
</button>
```

#### Before: Manual Responsive Classes

```tsx
// Old approach
<div className="text-sm md:text-base lg:text-lg p-2 md:p-4 lg:p-6">Manual Responsive</div>
```

#### After: Responsive Tokens

```tsx
// New approach
<div
  className={`
  ${getResponsiveTextToken('md')} 
  ${getResponsiveSpacingToken('md', 'padding')}
`}
>
  System Responsive
</div>
```

### Migration Checklist

- [ ] **Replace hardcoded sizes** with `getSizeToken()`
- [ ] **Convert manual responsive classes** to responsive token functions
- [ ] **Standardize breakpoints** to use `md:` as primary breakpoint
- [ ] **Add hover effects** using `getHoverEffectClass()`
- [ ] **Update button spacing** to account for shadow overlap
- [ ] **Use responsive patterns** for common layout changes
- [ ] **Test across breakpoints** to ensure proper scaling

### Common Migration Patterns

```typescript
// Text sizing
'text-lg' → getSizeToken('lg', 'text')
'text-sm md:text-base' → getResponsiveTextToken('md')

// Padding
'p-4' → getSizeToken('md', 'padding')
'p-3 md:p-4' → getResponsiveSpacingToken('md', 'padding')

// Spacing
'gap-4' → getSizeToken('md', 'spacing')
'gap-2 md:gap-4' → getResponsiveSpacingToken('md', 'gap')

// Breakpoints
'hidden lg:block' → getResponsivePattern('tabletUp')
'flex-col md:flex-row' → getResponsivePattern('stackToRow')

// Hover effects
'hover:shadow-lg' → getHoverEffectClass('lift')
'hover:translate-y-1' → getHoverEffectClass('press')
```

---

## 🎯 Summary

The HomeKeeper design system provides:

- **🎨 Consistent sizing** through standardized tokens
- **📱 Mobile-first responsive design** with automatic scaling
- **🎯 Standardized breakpoints** using `md:` as primary breakpoint
- **✨ Unified hover effects** for consistent interactions
- **🔧 TypeScript safety** for all design tokens

By following this guide, you'll create components that are visually consistent, responsive across all devices, and maintainable for the entire team.
