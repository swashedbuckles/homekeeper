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
.brutal-shadow-double     /* Two-layer shadow effect */
.brutal-shadow-triple     /* Three-layer shadow effect */
.brutal-shadow-mega       /* Four-layer shadow effect */
```

### Text Shadows
For large headings and emphasis:

```css
.brutal-text-shadow       /* Dual-layer text shadow */
.brutal-text-shadow-mega  /* Four-layer text shadow */
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

## Shadows and Borders

### Shadow Hierarchy
Use shadows to establish visual hierarchy and interaction states:

1. **No Shadow** - Background elements, subtle content
2. **Single Shadow** (`brutal-shadow-primary`) - Standard interactive elements
3. **Double Shadow** (`brutal-shadow-double`) - Important content
4. **Triple Shadow** (`brutal-shadow-triple`) - Major page sections
5. **Mega Shadow** (`brutal-shadow-mega`) - Hero elements, critical UI

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

### Component-Specific Variants

#### Button Variants
```tsx
<Button variant="primary" size="default">    // Orange, standard size
<Button variant="outline" size="small">      // Transparent, small
<Button variant="danger" size="large">       // Red, large
```

#### Card Variants
```tsx
<Card variant="default" shadow="triple">     // White card, triple shadow
<Card variant="primary" shadow="primary">    // Orange card, orange shadow
<Card variant="subtle" shadow="none">        // Subtle card, no shadow
```

#### Alert Variants
```tsx
<Alert variant="error" size="default">       // Red alert, standard size
<Alert variant="success" size="large">       // Green alert, large size
<Alert variant="info" size="small">          // Blue alert, small size
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

### Toast Component Example
```tsx
export const Toast = ({
  variant = 'info',
  size = 'default',
  dismissible = true
}) => {
  const styles = [
    'font-mono', 'font-bold', 'uppercase',
    'border-brutal-md', 'p-4',
    'brutal-shadow-primary',
    'brutal-rotate-slight-right',
    variantStyles[variant],
    sizeStyles[size]
  ].join(' ');
  
  return (
    <div className={styles}>
      {/* Toast content */}
    </div>
  );
};
```

### Page Layout Example
```tsx
// Dashboard page with brutal styling
export const Dashboard = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Page title with brutal text shadow */}
      <h1 className="text-6xl font-black uppercase text-text-primary brutal-text-shadow-mega mb-8">
        Dashboard
      </h1>
      
      {/* Stats grid with varied rotations */}
      <div className="grid grid-cols-4 gap-8 mb-12">
        <StatCard variant="dark" rotation="slight-left" />
        <StatCard variant="primary" rotation="slight-right" />
        <StatCard variant="secondary" rotation="slight-left" />
        <StatCard variant="accent" rotation="slight-right" />
      </div>
      
      {/* Main content area */}
      <Card variant="default" shadow="triple" className="p-8">
        {/* Dashboard content */}
      </Card>
    </div>
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

This guide should be referenced when creating any new components or layouts to ensure consistency with the HomeKeeper neo-brutalist design system.