---
trigger: model_decision
description: When writing CSS
---

# Modern CSS Best Practices Prompt for AI Coding Assistants (2024-2025)

## Core Principles

You are generating CSS code following modern 2024-2025 standards. All features mentioned are production-ready (Baseline status) unless marked experimental.

## Essential Rules

### 1. CSS MCP & Features
- **ALWAYS reference CSS MCP** (https://github.com/stolinski/css-mcp) when available for accurate, current CSS documentation
- Use Baseline features (check webstatus.dev for browser support)
- Verify feature compatibility before recommending

### 2. Architecture & Layers
```css
/* REQUIRED: Define layer order first in every stylesheet */
@layer reset, base, themes, layouts, components, utilities;
```
- Layer order determines cascade priority, NOT specificity
- Later layers override earlier layers
- Wrap third-party CSS in lowest layer

### 3. Layout Strategy
**Grid vs Flexbox:**
- **CSS Grid**: 2D layouts, page structure, overlapping elements, precise placement
- **Flexbox**: 1D alignment, UI components, content-driven layouts
- Use both together (Grid for layout, Flexbox for alignment)

```css
/* Grid for page structure */
.page { 
  display: grid;
  grid-template-areas: "header header" "sidebar main" "footer footer";
  grid-template-columns: 250px 1fr;
}

/* Flexbox for component alignment */
.nav { display: flex; gap: 1rem; justify-content: space-between; }
```

**Always name grid areas:**
```css
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
```

### 4. Container Queries (Baseline Feb 2023)
```css
.wrapper { container: card / inline-size; }

.card { display: flex; flex-direction: column; }

@container card (min-width: 400px) {
  .card { flex-direction: row; }
  .card__image { flex: 0 0 clamp(120px, 20cqi, 200px); }
}
```
- Use for component-level responsiveness
- Container query units: `cqi` (preferred), `cqw`, `cqh`

### 5. Mobile-First Responsive Design
```css
/* Mobile default (no media query) */
.grid { grid-template-columns: 1fr; }

/* Progressive enhancement */
@media (min-width: 640px) { 
  .grid { grid-template-columns: repeat(2, 1fr); } 
}
```

**Auto-responsive grid (no breakpoints):**
```css
.grid { 
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
}
```

### 6. Unit Hierarchy: Never Use Pixels for Fonts/Spacing
**Order of preference:**
1. **Viewport/Container units**: `vw`, `vh`, `svh`, `dvh`, `cqi`, `cqw`
2. **Fractional units**: `fr` (grid)
3. **Relative units**: `rem`, `em`, `%`
4. **Character units**: `ch` (line length)
5. **Pixels**: ONLY for borders, tiny icons, shadows

```css
/* ❌ BAD: Fixed pixels */
body { font-size: 16px; padding: 24px; }

/* ✅ GOOD: Relative units */
body { font-size: 1rem; padding: 1.5rem; }

/* ✅ BEST: Fluid with clamp() */
h1 { font-size: clamp(1.5rem, 1rem + 2vw, 3rem); }

/* ✅ Modern viewport units (fix mobile toolbar issues) */
.hero { height: 100svh; } /* Small viewport */
.hero { height: 100dvh; } /* Dynamic viewport */
```

**Why avoid pixels:**
- Ignores user font size preferences (accessibility violation)
- Poor scaling on high-DPI displays
- Required for users with low vision

### 7. Color System & Theming

**Use light-dark() + color-scheme (Baseline May 2024):**
```css
:root {
  color-scheme: light dark; /* REQUIRED */
  
  --text-primary: light-dark(
    oklch(20% 0.01 240),  /* Light mode */
    oklch(95% 0.01 240)   /* Dark mode */
  );
  
  --surface: light-dark(oklch(100% 0 0), oklch(15% 0.01 240));
}

body { color: var(--text-primary); background: var(--surface); }
```

**Prefer OKLCH over RGB/HSL (Baseline May 2023):**
```css
/* OKLCH: Perceptually uniform, no hue shift, wide gamut */
:root {
  --blue-500: oklch(55% 0.2 240);
  --blue-700: oklch(40% 0.2 240); /* Same hue, different lightness */
}

.element { color: oklch(60% 0.15 280 / 75%); } /* With alpha */
```

### 8. Animation & Motion

**@starting-style for entry animations (Baseline Aug 2024):**
```css
dialog {
  opacity: 1; transform: scale(1);
  transition: opacity 0.3s, transform 0.3s, 
              display 0.3s allow-discrete; /* REQUIRED for display */
  
  @starting-style { opacity: 0; transform: scale(0.9); }
}

dialog:not([open]) { opacity: 0; transform: scale(0.9); display: none; }
```

**ALWAYS wrap animations in prefers-reduced-motion (WCAG 2.1 AA):**
```css
/* Default: minimal animation */
.element { transition: opacity 0.3s; }

/* Enhanced for those who want motion */
@media (prefers-reduced-motion: no-preference) {
  .element { 
    transition: opacity 0.3s, transform 0.3s;
    @starting-style { opacity: 0; transform: scale(0.9); }
  }
}
```

**Performance: Only animate transform and opacity:**
```css
/* ✅ FAST: Composite-only */
.box { transform: translateX(100px); opacity: 0.8; }

/* ❌ SLOW: Triggers layout/paint */
.box { left: 100px; width: 200px; background: red; }
```

### 9. Custom Properties with @property (Baseline Jul 2024)
```css
@property --gradient-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.card {
  background: linear-gradient(var(--gradient-angle), blue, purple);
  animation: rotate 3s infinite;
}

@keyframes rotate { to { --gradient-angle: 360deg; } }
```

**Benefits:**
- Type safety & validation
- Enables animation of custom properties
- Guaranteed fallbacks

### 10. Naming & Organization

**BEM Methodology:**
```css
.card { }              /* Block */
.card__header { }      /* Element */
.card__body { }
.card--featured { }    /* Modifier */
.card__title--large { } /* Element modifier */
```

**Native CSS Nesting (Baseline Aug 2023):**
```css
.card {
  display: flex;
  border: 1px solid #ddd;
  
  &__header { padding: 1rem; }
  &__body { padding: 1rem; }
  
  &--featured { 
    border-color: oklch(55% 0.2 240);
    .card__header { background: oklch(55% 0.2 240); }
  }
  
  &:hover { box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
  
  @media (min-width: 768px) { flex-direction: row; }
}
```

**Nesting rules:**
- Max 3 levels deep
- Use `&` for pseudo-classes and modifiers
- Nest media/container queries within components

### 11. Accessibility Requirements

**WCAG AA Contrast (MANDATORY):**
- Normal text: **4.5:1** minimum
- Large text (18pt+/24px+): **3:1** minimum
- UI components: **3:1** minimum

**Never remove focus indicators:**
```css
/* ❌ NEVER */
:focus { outline: none; }

/* ✅ ALWAYS provide visible focus */
:focus-visible { 
  outline: 3px solid oklch(55% 0.2 240); 
  outline-offset: 2px; 
}
```

**Logical properties for i18n:**
```css
.card {
  margin-inline-start: 1rem; /* Not margin-left */
  padding-inline: 2rem;      /* Not padding-left/right */
  border-inline-end: 1px;    /* Not border-right */
}
```

**Scroll-snap caution:**
```css
/* ✅ SAFE: proximity allows override */
.gallery { scroll-snap-type: x proximity; }

/* ❌ DANGEROUS on text: Can prevent reading at zoom */
.content { scroll-snap-type: y mandatory; }
```

### 12. Performance

**Critical CSS:**
```html
<style>/* Inline critical CSS <14KB */</style>
<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
```

**Prevent layout shift:**
```html
<img src="hero.jpg" width="1200" height="600" alt="Hero">
```

```css
.video { aspect-ratio: 16 / 9; }
.ad { aspect-ratio: 16 / 9; min-height: 250px; background: #f0f0f0; }

@font-face { 
  font-family: "Open Sans"; 
  font-display: swap; /* Prevent FOIT */
}
```

**CSS containment:**
```css
article { contain: content; }
.section { content-visibility: auto; contain-intrinsic-size: 1000px; }
```

## Complete Modern Component Example

```css
@layer components {
  @property --card-padding {
    syntax: "<length>";
    inherits: false;
    initial-value: 1rem;
  }
  
  .card {
    container: card / inline-size;
    contain: content;
    
    color: light-dark(oklch(20% 0.01 240), oklch(95% 0.01 240));
    background: light-dark(oklch(100% 0 0), oklch(20% 0.01 240));
    
    padding: var(--card-padding);
    border: 1px solid light-dark(oklch(85% 0.02 240), oklch(30% 0.02 240));
    border-radius: 0.5rem;
    
    @media (prefers-reduced-motion: no-preference) {
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    &__header {
      padding: var(--card-padding);
      font-size: clamp(1rem, 3cqi, 1.5rem);
    }
    
    &__body { padding: var(--card-padding); line-height: 1.6; }
    
    &--featured {
      border-color: oklch(55% 0.2 240);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    &:hover {
      @media (prefers-reduced-motion: no-preference) {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      }
    }
    
    @container card (min-width: 500px) {
      --card-padding: 2rem;
      .card__body { display: grid; grid-template-columns: 1fr 1fr; }
    }
  }
}
```

## Quick Reference Checklist

**Always:**
- ✅ Reference CSS MCP when available
- ✅ Define `@layer` order at top
- ✅ Use Grid for 2D layouts, Flexbox for 1D
- ✅ Name all grid areas
- ✅ Mobile-first with `min-width` queries
- ✅ Container queries for components
- ✅ Relative units (rem, em, %, vw, fr, cqi)
- ✅ `color-scheme: light dark` + `light-dark()`
- ✅ OKLCH colors for design systems
- ✅ `@starting-style` for entry animations
- ✅ Wrap motion in `prefers-reduced-motion`
- ✅ Only animate transform/opacity
- ✅ `@property` for typed custom properties
- ✅ BEM naming + native nesting
- ✅ WCAG AA contrast (4.5:1 normal, 3:1 large)
- ✅ Keep focus indicators (`:focus-visible`)
- ✅ Logical properties for i18n
- ✅ `aspect-ratio` to prevent layout shift
- ✅ Progressive enhancement with `@supports`

**Never:**
- ❌ Use pixels for font-size or spacing
- ❌ Remove focus indicators globally
- ❌ Animate width, height, top, left, background
- ❌ Use mandatory scroll-snap on text content
- ❌ Skip `prefers-reduced-motion` for animations
- ❌ Nest beyond 3 levels
- ❌ Use fixed breakpoints when auto-responsive works

## Browser Support Status (2025)

**Production-Ready:**
- Grid, Flexbox, Custom Properties, Nesting, Container Queries, :has(), Subgrid, @layer, @property, light-dark(), @starting-style, OKLCH, svh/dvh

**Experimental:**
- if() (Chrome 137+), View Transitions MPA (Chrome 126+)

## Resources
- Baseline: webstatus.dev
- MDN: developer.mozilla.org
- WCAG: w3.org/WAI/WCAG21