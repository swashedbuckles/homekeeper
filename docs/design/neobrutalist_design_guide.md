# HomeKeeper Neo-Brutalist Design System Guide

A comprehensive guide for implementing neo-brutalist design patterns in HomeKeeper components and layouts.

## Table of Contents
1. [Overview](#overview)
2. [Theme Variables](#theme-variables)
3. [Utility Classes](#utility-classes)
4. [Shadows and Borders](#shadows-and-borders)
5. [Hover States and Interactions](#hover-states-and-interactions)
6. [Component Variants](#component-variants)
7. [Neo-Brutalist Principles](#neo-brutalist-principles)
8. [Implementation Examples](#implementation-examples)

## Overview

The HomeKeeper neo-brutalist design system emphasizes bold, unapologetic design through:
- **Thick borders and strong shadows** for visual hierarchy
- **Monospace typography** with bold weights and uppercase text
- **Bright, high-contrast colors** against neutral backgrounds
- **Intentional imperfection** through rotations and asymmetry
- **Tactile interactions** with press effects and transforms

## Theme Variables

All design tokens are centralized in `styles/theme.css` using CSS custom properties.

### Color System
```css
/* Primary brand colors */
--color-primary: #e67e22;      /* Orange - main CTAs, highlights */
--color-secondary: #4a6fa5;    /* Blue - secondary actions, info */
--color-accent: #5d9c59;       /* Green - success, completion */

/* Background and text */
--color-background: #f5f0e8;   /* Cream - page backgrounds */
--color-text-primary: #2c3e50; /* Dark blue-gray - main text */
--color-text-secondary: #7f8c8d; /* Gray - secondary text */

/* Semantic colors */
--color-success: #5d9c59;      /* Success states */
--color-warning: #e67e22;      /* Warnings, attention */
--color-error: #e74c3c;        /* Errors, urgent items */
--color-info: #4a6fa5;         /* Information, neutral */
```

### Spacing and Sizing
```css
/* Brutal-specific spacing for shadows and offsets */
--spacing-brutal-offset-sm: 3px;
--spacing-brutal-offset-md: 6px;
--spacing-brutal-offset-lg: 8px;
--spacing-brutal-offset-xl: 12px;

/* Border thicknesses */
--border-brutal-sm: 3px;
--border-brutal-md: 4px;
--border-brutal-lg: 6px;
--border-brutal-xl: 8px;
```

### Typography
```css
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

## Utility Classes

### Shadow Utilities
Apply consistent brutal shadows to elements:

```css
.brutal-shadow-primary    /* Orange shadow, 8px offset */
.brutal-shadow-secondary  /* Blue shadow, 8px offset */
.brutal-shadow-accent     /* Green shadow, 8px offset */
.brutal-shadow-dark       /* Dark shadow, 8px offset */
.brutal-shadow-error      /* Red shadow, 8px offset */
.brutal-shadow-triple     /* Three-layer shadow effect */
.brutal-shadow-mega       /* Four-layer shadow effect */
```

### Text Shadows
For large headings and emphasis:

```css
.brutal-text-shadow       /* Standard text shadow */
.brutal-text-shadow-small /* Small text shadow */
.brutal-text-shadow-tiny  /* Minimal text shadow */
.brutal-text-shadow-mega  /* Four-layer text shadow */
.brutal-text-shadow-white /* White text shadow for dark backgrounds */
```

### Rotation Utilities
Add intentional imperfection:

```css
.brutal-rotate-left        /* -2deg rotation */
.brutal-rotate-right       /* 2deg rotation */
.brutal-rotate-slight-left /* -1deg rotation */
.brutal-rotate-slight-right /* 1deg rotation */
.brutal-rotate-tiny-left   /* -0.5deg rotation */
.brutal-rotate-tiny-right  /* 0.5deg rotation */
```

### Border Utilities
Consistent border thickness:

```css
.border-brutal-sm    /* 3px border */
.border-brutal-md    /* 4px border */
.border-brutal-lg    /* 6px border */
.border-brutal-xl    /* 8px border */
.border-l-brutal-xl  /* 8px left border only */
```

### Typography Utilities
Brutal text styling:

```css
.text-brutal-header  /* Mono, bold, uppercase, letter-spacing */
.text-brutal-button  /* Optimized for button text */
.text-brutal-small   /* Smaller brutal text styling */
```

### Transition Utilities
Consistent animation timing:

```css
.brutal-transition      /* Fast 0.1s transitions */
.brutal-transition-slow /* Slower 0.2s transitions */
```

### Interactive Utilities
Hover and interaction effects:

```css
.brutal-hover-press       /* Press-down effect on hover */
.brutal-hover-press-small /* Smaller press effect */
.brutal-hover-lift        /* Lift effect on hover */
```

## Shadows and Borders

### Shadow Hierarchy
Use shadows to establish visual hierarchy and interaction states:

1. **No Shadow** - Background elements, subtle content
2. **Single Shadow** (`brutal-shadow-primary`) - Standard interactive elements
3. **Triple Shadow** (`brutal-shadow-triple`) - Major page sections
4. **Mega Shadow** (`brutal-shadow-mega`) - Hero elements, critical UI

### Border Guidelines

**Border Thickness by Component Type:**
- **Small Elements** (badges, pills): `border-brutal-sm` (3px)
- **Default Elements** (buttons, inputs): `border-brutal-md` (4px)
- **Large Elements** (cards, containers): `border-brutal-lg` (6px)
- **Hero Elements** (headers, major sections): `border-brutal-xl` (8px)

**Border Colors:**
- **White borders** on colored backgrounds
- **Dark borders** (`border-text-primary`) on light backgrounds
- **Colored borders** for status indicators (error, success, etc.)

### Status Indicators
Use left borders for status communication:

```css
/* Urgent/Error */
.border-l-brutal-xl .border-l-error

/* Normal/Info */
.border-l-brutal-xl .border-l-secondary

/* Success/Complete */
.border-l-brutal-xl .border-l-accent
```

## Hover States and Interactions

### The Press Effect (Primary Interaction)
The signature brutal interaction removes shadows and translates elements to simulate a physical press:

```css
/* Default state: elevated with shadow */
.brutal-hover-press {
  box-shadow: 8px 8px 0 var(--shadow-dark);
  transition: var(--transition-brutal);
}

/* Hover state: pressed down, no shadow */
.brutal-hover-press:hover {
  transform: translate(4px, 4px);
  box-shadow: none;
}
```

### The Lift Effect (Secondary Interaction)
For non-button elements that need hover feedback:

```css
.brutal-hover-lift:hover {
  transform: translate(-3px, -3px);
  box-shadow: enhanced-shadow; /* Larger, more complex shadow */
}
```

### When to Use Each Effect

**Press Effect (`brutal-hover-press`):**
- ✅ Buttons and clickable CTAs
- ✅ Submittable forms elements
- ✅ Primary interactive elements

**Lift Effect (`brutal-hover-lift`):**
- ✅ Cards with navigation
- ✅ Selectable options
- ✅ Secondary interactive elements

**No Hover Effect:**
- ✅ Text inputs (use focus transforms instead)
- ✅ Display-only content
- ✅ Disabled elements

### Size Variations
Different hover distances for different element sizes:

```css
.brutal-hover-press        /* 4px movement for default elements */
.brutal-hover-press-small  /* 3px movement for small elements */
```

## Component Variants

### Standard Variant Pattern
All components follow a consistent variant naming convention:

#### Color Variants
- **`default`** - White background, dark borders (neutral content)
- **`subtle`** - Background color, lighter borders (secondary content)
- **`primary`** - Orange background, white text (main actions)
- **`secondary`** - Blue background, white text (secondary actions)
- **`accent`** - Green background, white text (success, positive)
- **`danger`** - Red background, white text (destructive actions)
- **`dark`** - Dark background, white text (emphasis, contrast)

#### Size Variants
- **`small`** - Compact sizing, thinner borders
- **`default`** - Standard sizing and borders
- **`large`** - Expanded sizing, thicker borders

### Current Component Library

#### Core Components

**Button Component:**
- **Variants:** `primary`, `secondary`, `outline`, `text`, `danger`
- **Sizes:** `small`, `default`, `large`
- **States:** `loading`, `disabled`, `full` (full-width)
- **Props:** `loadingText`, `type`, `onClick`

**Card Component:**
- **Variants:** `default`, `subtle`, `primary`, `secondary`, `accent`, `danger`, `dark`
- **Padding:** `sm`, `md`, `lg`
- **Shadows:** `none`, `primary`, `secondary`, `accent`, `dark`, `error`, `triple`, `mega`
- **Rotation:** `none`, `left`, `right`, `slight-left`, `slight-right`
- **Props:** `hover`, `onClick`, `testId`

**Title Component:**
- **Variants:** `page` (h1), `section` (h2), `subsection` (h3)
- **Props:** `textShadow`, `rotation`, `description`, `className`
- **Features:** Semantic HTML tags, optional descriptions

**StatCard Component:**
- **Sizes:** `sm` (text-4xl), `md` (text-5xl), `lg` (text-7xl)
- **Variants:** `primary`, `secondary`, `accent`, `dark`
- **Props:** `label`, `value`, `subtitle`, `rotation`, `onClick`
- **Built on:** Card component with statistical display

#### Form Components

**TextInput Component:**
- **Variants:** `default`, `search`
- **Sizes:** `small`, `default`, `large`
- **States:** `error`, `disabled`
- **Props:** `label`, `description`, `placeholder`, `validation`

**TextArea Component:**
- **Props:** `rows`, `label`, `description`, `error`, `validation`
- **Features:** Auto-resize, character counting

**CodeInput Component:**
- **Features:** Centered, uppercase, monospace styling
- **Use case:** Verification codes, short inputs

#### Container Components

**SectionContainer:**
- **Spacing:** `tight` (py-8), `default` (py-10), `loose` (py-16)
- **Props:** `hero` (removes max-width), `className`
- **Built on:** ContentContainer with vertical spacing

**ContentContainer:**
- **Max-width:** `4xl`, `5xl`, `6xl`, `7xl`, `none`
- **Features:** Horizontal centering, responsive padding

#### Specialized Components

**TaskCard Component:**
- **Status:** `urgent`, `normal`, `future`, `completed`
- **Features:** Status-based left border, action buttons
- **Built on:** Card component

**OptionCard Component:**
- **Features:** Icon + content layout, selection states
- **Use case:** Choice selection, feature cards

**ActionItem Component:**
- **Features:** Horizontal layout, status indicators
- **Use case:** Task lists, action items

#### Brand Components

**HeaderLogo Component:**
- **Features:** Logo with text, responsive sizing
- **Use case:** Header navigation

**FooterLogo Component:**
- **Features:** Logo for footer areas
- **Use case:** Footer branding

### Component Variant Examples

#### Button Variants
```tsx
<Button variant="primary" size="default">     // Orange, standard size
<Button variant="outline" size="small">       // Transparent, small
<Button variant="danger" size="large">        // Red, large
<Button variant="text" disabled>              // Text-only, disabled
<Button loading loadingText="Saving...">      // Loading state
```

#### Card Variants
```tsx
<Card variant="default" shadow="triple">     // White card, triple shadow
<Card variant="primary" shadow="primary">    // Orange card, orange shadow
<Card variant="subtle" shadow="none">        // Subtle card, no shadow
<Card rotation="slight-left" hover>          // Rotated card with hover
<Card padding="lg" onClick={() => {}}>        // Large padding, clickable
```

#### Title Variants
```tsx
<Title variant="page" textShadow>             // Page heading with shadow
<Title variant="section" rotation="slight-left"> // Section heading, rotated
<Title variant="subsection" description="Sub info"> // With description
```

#### StatCard Variants
```tsx
<StatCard size="lg" variant="primary" value={47} label="Total Items" />
<StatCard size="sm" variant="accent" value={12} rotation="slight-right" />
<StatCard size="md" variant="dark" value={3} subtitle="+2 This Week" />
```

## Neo-Brutalist Principles

### 1. Bold Typography
- **Always use monospace fonts** (`font-mono`)
- **Prefer bold weights** (`font-bold`, `font-black`)
- **Use uppercase text** (`uppercase`) for emphasis
- **Add letter spacing** (`tracking-wide`, `tracking-wider`)

```css
/* Standard brutal text */
.text-brutal-header {
  font-family: var(--font-family-mono);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 2. High Contrast Colors
- **Use saturated colors** against neutral backgrounds
- **Maintain strong contrast** (4.5:1 minimum for accessibility)
- **Embrace color boldness** - avoid muted or pastel colors
- **Use white text on colored backgrounds**

### 3. Thick Borders and Strong Shadows
- **Never use border-radius** - keep sharp corners
- **Use thick borders** (minimum 3px, prefer 4-6px)
- **Apply bold shadows** for depth and hierarchy
- **Match shadow colors** to border or background colors

### 4. Intentional Imperfection
- **Add subtle rotations** to break rigid layouts
- **Vary element positioning** slightly
- **Use asymmetrical spacing** when appropriate
- **Embrace the "hand-drawn" aesthetic**

### 5. Tactile Interactions
- **Make interactions feel physical** (press effects)
- **Provide immediate feedback** (fast transitions)
- **Use transforms over opacity changes**
- **Maintain spatial relationships** during interactions

## Implementation Examples

### Creating a New Component

When creating a new component (like Toast or Tabs), follow this process:

#### 1. Start with Base Styling
```tsx
const baseStyles = [
  'font-mono',           // Monospace typography
  'font-bold',           // Bold weight
  'uppercase',           // Uppercase text
  'border-brutal-md',    // Thick borders
  'brutal-transition'    // Consistent transitions
];
```

#### 2. Add Variant System
```tsx
const variantStyles = {
  default: ['bg-white', 'text-text-primary', 'border-text-primary'],
  primary: ['bg-primary', 'text-white', 'border-white'],
  // ... other variants
};
```

#### 3. Include Shadow and Hover
```tsx
const sizeConfig = {
  small: {
    shadow: 'brutal-shadow-primary',
    hover: 'brutal-hover-press-small'
  },
  default: {
    shadow: 'brutal-shadow-dark',
    hover: 'brutal-hover-press'
  }
};
```

#### 4. Add Rotation (Optional)
```tsx
const rotationClass = rotation ? `brutal-rotate-${rotation}` : '';
```

### Real Component Example - StatCard
```tsx
export interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'dark';
  rotation?: 'left' | 'right' | 'slight-left' | 'slight-right';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  subtitle,
  variant = 'dark',
  rotation = 'slight-left',
  size = 'lg',
  onClick,
  className = ''
}: StatCardProps) => {
  const sizeStyles = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-7xl'
  };

  return (
    <Card
      variant={config.cardVariant}
      shadow={config.shadow}
      rotation={rotation}
      hover={!!onClick}
      onClick={onClick}
      padding={size}
      className={className}
    >
      <div className="text-white font-bold text-lg uppercase mb-4">
        {label}
      </div>
      <div className={`${sizeStyles[size]} font-black ${config.valueColor} leading-none mb-3`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-white font-bold uppercase">
          {subtitle}
        </div>
      )}
    </Card>
  );
};
```

### Page Layout Example - Using Container System
```tsx
// Landing page with container system
export const LandingPage = () => {
  return (
    <>
      {/* Hero section with full-width background */}
      <SectionContainer className="relative min-h-screen flex items-start">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Title variant="page" textShadow className="uppercase text-6xl md:text-8xl lg:text-9xl">
              Organize<br />Your<br />Home
            </Title>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Button size="large" variant="primary">Get Started</Button>
              <Button size="large" variant="secondary">Learn More</Button>
            </div>
          </div>
          
          <div className="relative">
            <Card variant="default" shadow="dark" padding="lg">
              {/* Feature content */}
            </Card>
            
            <StatCard size="sm" variant="primary" 
              label="Manuals Stored" value={47} 
              rotation="slight-right" 
              className="absolute -top-16 -right-8" />
          </div>
        </div>
      </SectionContainer>
      
      {/* Features section with hero container */}
      <SectionContainer className="bg-text-primary border-t-8 border-primary" 
                       spacing="loose" hero>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature cards */}
        </div>
      </SectionContainer>
    </>
  );
};
```

### Settings Page Layout
```tsx
export const Settings = () => {
  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      {/* Brutal page header */}
      <section className="mb-12">
        <h1 className="text-6xl font-black uppercase text-text-primary brutal-text-shadow mb-6">
          Settings &<br>
          Household<br>
          Management
        </h1>
      </section>
      
      {/* Tab navigation with brutal styling */}
      <nav className="flex gap-4 mb-12">
        <button className="tab-brutal bg-primary text-white">
          Household
        </button>
        <button className="tab-brutal bg-transparent text-text-primary hover:bg-text-primary hover:text-white">
          Members
        </button>
      </nav>
    </div>
  );
};
```

## Best Practices

### Do's ✅
- **Use the established variant system** for consistency
- **Apply hover effects consistently** across interactive elements
- **Maintain the brutal aesthetic** with thick borders and bold shadows
- **Use monospace typography** for all text
- **Leverage the utility classes** instead of custom styles
- **Test contrast ratios** for accessibility
- **Add subtle rotations** for visual interest

### Don'ts ❌
- **Don't use border-radius** - keep sharp corners
- **Don't mix thin borders** with brutal elements
- **Don't use subtle hover effects** - make them bold and obvious
- **Don't ignore the variant system** - create new variants if needed
- **Don't use multiple font families** - stick to monospace
- **Don't apply rotations to text-heavy content**
- **Don't overuse mega shadows** - reserve for hero elements

### Performance Considerations
- **Use CSS custom properties** for easy theming
- **Leverage Tailwind's utilities** instead of custom CSS
- **Keep animations fast** (0.1s) for snappy interactions
- **Use transform over position changes** for better performance

---

## Appendix: Tailwind Spacing & Layout Consistency Guide

### Understanding Tailwind's Spacing Scale

Tailwind uses a **consistent spacing scale** based on `0.25rem` (4px) increments. This isn't arbitrary - it creates visual harmony and makes layouts predictable.

#### The Spacing Scale
```css
/* Tailwind spacing values */
1 = 0.25rem = 4px
2 = 0.5rem  = 8px
3 = 0.75rem = 12px
4 = 1rem    = 16px
5 = 1.25rem = 20px
6 = 1.5rem  = 24px
8 = 2rem    = 32px
10 = 2.5rem = 40px
12 = 3rem   = 48px
16 = 4rem   = 64px
20 = 5rem   = 80px
```

### HomeKeeper Spacing Standards

#### Component Internal Spacing (Padding)

**Small Components** (buttons, badges, pills):
```tsx
className="px-4 py-2"     // 16px horizontal, 8px vertical
className="px-6 py-3"     // 24px horizontal, 12px vertical  
```

**Medium Components** (cards, inputs):
```tsx
className="p-4"           // 16px all around
className="p-6"           // 24px all around
className="px-6 py-4"     // 24px horizontal, 16px vertical
```

**Large Components** (sections, major cards):
```tsx
className="p-8"           // 32px all around
className="px-8 py-6"     // 32px horizontal, 24px vertical
```

#### Component External Spacing (Margins)

**Between Related Elements**:
```tsx
className="mb-4"          // 16px bottom margin
className="gap-4"         // 16px gap in flex/grid
```

**Between Component Groups**:
```tsx
className="mb-6"          // 24px bottom margin
className="gap-6"         // 24px gap in flex/grid
```

**Between Major Sections**:
```tsx
className="mb-8"          // 32px bottom margin
className="mb-12"         // 48px bottom margin
className="gap-8"         // 32px gap in flex/grid
```

#### Page Layout Spacing

**Container Padding** (consistent across all pages):
```tsx
className="px-5"          // 20px horizontal padding on mobile
className="px-5 md:px-8"  // 20px mobile, 32px desktop
```

**Section Spacing** (use SectionContainer instead):
```tsx
// Use these in SectionContainer component:
spacing="tight"    // py-8  (32px top/bottom)
spacing="default"  // py-10 (40px top/bottom)  
spacing="loose"    // py-16 (64px top/bottom)
```

### Common Layout Patterns

#### Card Layouts
```tsx
// Standard card with consistent spacing
<Card className="p-6">          {/* Internal padding */}
  <h3 className="mb-4">Title</h3>  {/* Title to content */}
  <p className="mb-6">Content</p>  {/* Content to actions */}
  <div className="flex gap-4">     {/* Button spacing */}
    <Button>Action</Button>
    <Button>Cancel</Button>
  </div>
</Card>
```

#### Form Layouts
```tsx
// Consistent form field spacing
<form className="space-y-6">        {/* 24px between fields */}
  <TextInput label="Name" />
  <TextInput label="Email" />
  <div className="flex gap-4 pt-4">  {/* Button area spacing */}
    <Button type="submit">Save</Button>
    <Button variant="secondary">Cancel</Button>
  </div>
</form>
```

#### Grid Layouts
```tsx
// Consistent grid spacing
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">  {/* 24px gaps */}
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// Large feature grids
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16"> {/* 64px gaps */}
  <div>Large content block</div>
  <div>Large content block</div>
</div>
```

### Responsive Spacing Patterns

#### Mobile-First Approach
Always start with mobile spacing, then increase for larger screens:

```tsx
// Good: Mobile-first spacing
className="mb-6 md:mb-8 lg:mb-12"    // 24px → 32px → 48px
className="px-4 md:px-6 lg:px-8"     // 16px → 24px → 32px

// Good: Container responsive padding
className="px-5 md:px-8 lg:px-12"    // 20px → 32px → 48px
```

#### Responsive Grid Gaps
```tsx
// Smaller gaps on mobile, larger on desktop
className="gap-4 md:gap-6 lg:gap-8"  // 16px → 24px → 32px
className="gap-6 lg:gap-16"          // 24px → 64px (skip medium)
```

### When to Use Which Spacing

#### Use `4` (16px) for:
- ✅ Default padding inside components
- ✅ Gaps between closely related elements
- ✅ Default margins between similar components
- ✅ Form field internal padding

#### Use `6` (24px) for:
- ✅ Padding in medium-sized cards
- ✅ Gaps between component groups
- ✅ Margins between different content types
- ✅ Form field spacing (`space-y-6`)

#### Use `8` (32px) for:
- ✅ Large component padding
- ✅ Major section spacing
- ✅ Hero area padding
- ✅ Grid gaps for card layouts

#### Use `12` (48px) or `16` (64px) for:
- ✅ Major section separation
- ✅ Hero section spacing
- ✅ Page-level margins
- ✅ Large feature grid gaps

### HomeKeeper-Specific Guidelines

#### Container System Usage
Instead of manual spacing, use the container components:

```tsx
// ❌ Don't do manual spacing
<div className="max-w-7xl mx-auto px-5 py-16">

// ✅ Use SectionContainer
<SectionContainer spacing="loose">
  {/* Content automatically gets proper spacing */}
</SectionContainer>
```

#### Consistent Element Spacing
Follow the established patterns in existing components:

```tsx
// Button spacing (from Button component)
className="px-6 py-3"        // Default buttons
className="px-8 py-4"        // Large buttons  
className="px-4 py-2"        // Small buttons

// Card spacing (from Card component)
padding="sm"   // p-4  (16px)
padding="md"   // p-6  (24px)
padding="lg"   // p-8  (32px)
```

#### Statistical Cards
```tsx
// StatCard positioning (from Landing page)
className="absolute -top-16 -right-8"   // Overlap with large offset
className="absolute -bottom-24 -left-16" // Overlap with large offset
```

### Common Mistakes to Avoid

#### ❌ Don't Use Arbitrary Values
```tsx
// Bad: Inconsistent, arbitrary spacing
className="mb-5 px-7 gap-9"
className="p-[15px] m-[25px]"
```

#### ❌ Don't Mix Spacing Systems
```tsx
// Bad: Mixing different spacing scales
className="mb-4 gap-6 p-5"  // Different scales
```

#### ❌ Don't Over-Complicate Responsive Spacing
```tsx
// Bad: Too many breakpoints
className="mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6"

// Good: Simplified responsive
className="mb-4 lg:mb-8"
```

### Quick Reference

#### Most Common Spacing Combinations
```tsx
// Standard component spacing
"p-6"                    // Standard card padding
"mb-6"                   // Standard bottom margin
"gap-6"                  // Standard flex/grid gap
"space-y-6"             // Standard vertical form spacing

// Large section spacing  
"p-8"                    // Large container padding
"mb-12"                  // Large section separation
"gap-8"                  // Large grid gaps

// Page-level spacing
"px-5"                   // Standard page padding
"py-16"                  // Section vertical spacing
"gap-16"                 // Hero/feature grid gaps
```

#### Brutal Design Spacing
For HomeKeeper's brutal design, prefer **bold, obvious spacing** over subtle differences:

```tsx
// ✅ Good: Clear spacing differences
className="mb-4"         // Small spacing
className="mb-8"         // Medium spacing  
className="mb-16"        // Large spacing

// ❌ Avoid: Subtle differences that are hard to notice
className="mb-5 md:mb-6 lg:mb-7"
```

---

## Appendix: Component Style Overrides with className

### Understanding the className Prop

Most HomeKeeper components include a `className` prop that allows you to **extend or override** the component's default styling. This provides flexibility while maintaining the core design system.

### How className Works

#### CSS Class Precedence
Tailwind applies classes in **source order**, so later classes can override earlier ones:

```tsx
// Component internal classes are applied first
<Button className="bg-red-500">  // Your className can override defaults
```

#### Component Implementation Pattern
```tsx
// Typical component structure
export const Button = ({ className = '', ...props }) => {
  const baseStyles = ['font-mono', 'font-bold', 'px-6', 'py-3'];
  const variantStyles = ['bg-primary', 'text-white'];
  
  return (
    <button 
      className={[...baseStyles, ...variantStyles, className].join(' ')}
    >
      {children}
    </button>
  );
};
```

Your `className` is applied **last**, giving it highest precedence.

### When to Use className Overrides

#### ✅ Appropriate Use Cases

**1. Layout and Positioning**
```tsx
// Position components in layouts
<Card className="absolute top-4 right-4">
<Button className="ml-auto">           // Push button to right
<StatCard className="col-span-2">      // Span multiple grid columns
```

**2. Responsive Behavior** 
```tsx
// Add responsive visibility or sizing
<Button className="hidden md:block">   // Hide on mobile
<Card className="md:col-span-2">       // Different grid behavior
<Title className="text-4xl lg:text-6xl"> // Override responsive sizing
```

**3. Context-Specific Spacing**
```tsx
// Adjust spacing for specific contexts
<Button className="mb-8">              // Extra bottom margin
<Card className="mt-0">                // Remove default top margin
<TextInput className="w-full md:w-auto"> // Full width on mobile
```

**4. State-Based Styling**
```tsx
// Conditional styling based on application state
<Card className={isSelected ? "ring-4 ring-primary" : ""}>
<Button className={isLoading ? "opacity-50" : ""}>
<StatCard className={isHighlighted ? "scale-105" : ""}>
```

**5. Animation and Transitions**
```tsx
// Add animations to components
<Card className="transition-transform hover:scale-105">
<Button className="animate-pulse">     // Loading state
<Title className="transition-colors"> // Smooth color changes
```

#### ❌ Inappropriate Use Cases

**1. Don't Override Core Design Tokens**
```tsx
// ❌ Bad: Changes core brutal design
<Button className="rounded-lg">        // Removes sharp corners
<Card className="border-thin">         // Uses thin borders
<Title className="font-sans">          // Changes to sans-serif
```

**2. Don't Replicate Existing Variants**
```tsx
// ❌ Bad: Should use variant prop instead
<Button className="bg-red-500 text-white"> // Use variant="danger"
<Card className="bg-primary">              // Use variant="primary"  
<Title className="text-2xl">               // Use variant="section"
```

**3. Don't Break Accessibility**
```tsx
// ❌ Bad: Reduces contrast
<Button className="text-gray-300">     // Poor contrast
<Card className="cursor-none">         // Breaks interactions
```

**4. Don't Use for Complex Layout Changes**
```tsx
// ❌ Bad: Complex layout should be a new component
<Card className="flex items-center justify-between p-2 border-dashed">
// ✅ Good: Create a SpecialCard component instead
```

### Common className Patterns

#### Layout and Grid Positioning
```tsx
// Grid layout positioning
<div className="grid grid-cols-4 gap-6">
  <StatCard className="col-span-2" />      // Spans 2 columns
  <StatCard />                             // Default 1 column
  <StatCard />                             // Default 1 column
</div>

// Absolute positioning for overlays
<div className="relative">
  <Card>Main content</Card>
  <StatCard className="absolute -top-4 -right-4" rotation="slight-right" />
</div>
```

#### Responsive Visibility and Sizing
```tsx
// Progressive disclosure
<Button className="hidden sm:block">Desktop Action</Button>
<Button className="sm:hidden" size="small">Mobile Action</Button>

// Responsive component sizing
<Title className="text-4xl md:text-6xl lg:text-8xl">
  Responsive Heading
</Title>
```

#### Conditional State Classes
```tsx
// Selection states
const CardWithSelection = ({ isSelected, children }) => (
  <Card className={isSelected ? "ring-4 ring-primary scale-105" : ""}>
    {children}
  </Card>
);

// Loading states  
const ButtonWithLoading = ({ isLoading, children, ...props }) => (
  <Button 
    className={isLoading ? "opacity-60 pointer-events-none" : ""} 
    {...props}
  >
    {children}
  </Button>
);
```

#### Animation and Interaction Enhancements
```tsx
// Enhanced hover effects
<Card className="transition-all duration-200 hover:shadow-2xl">
  
// Entrance animations
<StatCard className="animate-fade-in delay-100">

// Interactive transforms
<Button className="active:scale-95 transition-transform">
```

### Best Practices for className Usage

#### 1. Prefer Component Props Over className
```tsx
// ✅ Good: Use component props when available
<Button variant="primary" size="large">
<Card variant="dark" shadow="mega">

// ❌ Avoid: Replicating variant functionality
<Button className="bg-primary text-white px-8 py-4">
<Card className="bg-text-primary text-white brutal-shadow-mega">
```

#### 2. Use Descriptive Class Combinations
```tsx
// ✅ Good: Clear, purposeful classes
<Card className="sticky top-4">              // Sticky positioning
<Button className="w-full md:w-auto">         // Responsive width
<StatCard className="transform rotate-3">     // Specific rotation

// ❌ Avoid: Random styling combinations
<Card className="mt-3 mr-2 rotate-1 scale-98"> // Unclear purpose
```

#### 3. Consider Component Composition
```tsx
// If you're using complex className overrides frequently...

// ❌ Repeated complex overrides
<Card className="flex items-center gap-4 p-4 bg-white border-l-4 border-l-primary">
<Card className="flex items-center gap-4 p-4 bg-white border-l-4 border-l-accent">

// ✅ Create a specialized component
export const StatusCard = ({ status, children, ...props }) => {
  const statusStyles = {
    active: 'border-l-primary',
    completed: 'border-l-accent',
    pending: 'border-l-secondary'
  };
  
  return (
    <Card 
      className={`flex items-center gap-4 border-l-4 ${statusStyles[status]}`}
      {...props}
    >
      {children}
    </Card>
  );
};
```

#### 4. Document Complex Overrides
```tsx
// For complex className usage, add comments
<StatCard 
  className="absolute -top-8 -right-8 z-10" // Overlays main content
  variant="primary" 
  size="sm"
/>

<Card 
  className="md:sticky md:top-8"  // Sticky sidebar on desktop only
  variant="subtle"
>
  Sidebar content
</Card>
```

### Common Scenarios and Solutions

#### Scenario 1: Custom Spacing for Specific Layout
```tsx
// Context: Landing page hero section needs tighter spacing
<Title 
  variant="page" 
  className="mb-4 lg:mb-6"  // Tighter spacing than default
>
  Hero Title
</Title>
```

#### Scenario 2: Responsive Component Visibility
```tsx
// Context: Show different CTAs based on screen size
<div className="flex gap-4">
  <Button variant="primary" className="hidden md:block">
    Desktop Action
  </Button>
  <Button variant="primary" size="small" className="md:hidden">
    Mobile Action
  </Button>
</div>
```

#### Scenario 3: Dynamic State Styling
```tsx
// Context: Show validation state on form inputs
const InputWithValidation = ({ isValid, error, ...props }) => (
  <div>
    <TextInput 
      className={cn(
        isValid === false && "border-error focus:ring-error",
        isValid === true && "border-accent focus:ring-accent"
      )}
      {...props}
    />
    {error && <p className="text-error text-sm mt-2">{error}</p>}
  </div>
);
```

#### Scenario 4: Layout-Specific Positioning
```tsx
// Context: Statistical overlays on hero cards
<div className="relative">
  <Card variant="default" padding="lg">
    Main feature content
  </Card>
  
  {/* Positioned overlays using className */}
  <StatCard 
    className="absolute -top-6 -right-6" 
    size="sm" 
    variant="primary"
    label="Active Users" 
    value="2.4K" 
  />
  <StatCard 
    className="absolute -bottom-6 -left-6" 
    size="sm" 
    variant="accent"
    label="Success Rate" 
    value="94%" 
  />
</div>
```

### Quick Reference

#### Safe className Overrides
```tsx
// Layout and positioning
"absolute top-4 right-4"
"sticky top-8"
"col-span-2"
"row-span-3"

// Spacing adjustments
"mt-8"
"mb-0" 
"mx-auto"
"space-y-8"

// Responsive behavior
"hidden md:block"
"w-full md:w-auto"
"text-sm lg:text-base"

// State-based styling
"opacity-50"
"ring-4 ring-primary"
"scale-105"

// Animation and transitions
"transition-all duration-200"
"hover:scale-105"
"animate-pulse"
```

#### Avoid These Overrides
```tsx
// Don't change core design tokens
"rounded-lg"          // Breaks brutal aesthetic
"border-thin"         // Inconsistent with thick borders
"font-sans"           // Should stay monospace

// Don't replicate variants
"bg-primary"          // Use variant="primary"
"text-white"          // Handled by variants
"p-8"                 // Use padding="lg"
```

---

This guide should be referenced when creating any new components or layouts to ensure consistency with the HomeKeeper neo-brutalist design system.