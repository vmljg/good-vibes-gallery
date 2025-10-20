---
trigger: glob
globs: css/*.css, css/**/*.css, *.css
---

# CSS Code Style

- ALWAYS reference the CSS MCP for accurate information and latest features.
- Use the latest Baseline CSS features.
- Use `@layer` features to organize the stylesheet
- Use CSS grid features before flexbox features.
- Always create a responsive, mobile-first layout.
- Prefer using viewport units, fractional units, container query units and percentages (in that order) over ANY fixed-size value.
- Never use pixels.
- Use CSS `light-dark()` function and `color-scheme` property
- Prefer using color names and OKLCH colors over any other color format. https://htmlcolorcodes.com/color-names/
- Use `@starting-style` for transitioning from discrete properties.
- Always wrap transitions in a `prefers-reduced-motion: no-preference` media query.
- Utilize CSS scroll-snapping features.
- Utilize view-transition features.
- Include `@property` for custom CSS properties
- Use `@supports` around newly available CSS @function and `if()` but DO utilize these features.
- Use BEM class names
- Use native CSS nesting
- Always name CSS grid areas