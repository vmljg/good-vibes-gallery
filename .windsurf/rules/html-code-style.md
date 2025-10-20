---
trigger: glob
globs: *.html
---

# HTML Code Style Guide

## Core Principles
Generate HTML that is **accessible**, **responsive**, **standards-compliant**, and follows **modern best practices**.

---

## 1. Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description (150-160 chars)">
  <title>Page Title - Site Name</title>
  <link rel="stylesheet" href="styles.css">
</head>
```

**Required:**
- HTML5 DOCTYPE
- `lang` attribute on `<html>`
- `charset="UTF-8"` and viewport meta tag
- Unique `<title>` per page (50-60 chars)
- Meta description for SEO

---

## 2. Semantic HTML

```html
<header>
  <nav><ul><li><a href="#home">Home</a></li></ul></nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <section>
      <h2>Section Heading</h2>
      <p>Content...</p>
    </section>
  </article>
  <aside><h2>Related Content</h2></aside>
</main>

<footer><p>&copy; 2024 Company</p></footer>
```

**Use semantic elements:** `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`

**Heading hierarchy:**
- One `<h1>` per page
- Don't skip levels (h1 → h2 → h3)
- Use for structure, not styling

---

## 3. Accessibility (WCAG 2.1 AA)

### Images
```html
<!-- Decorative -->
<img src="decoration.svg" alt="">

<!-- Informative -->
<img src="chart.png" alt="Sales increased 40% in Q4">

<!-- Complex -->
<figure>
  <img src="diagram.png" alt="System architecture">
  <figcaption>Detailed description...</figcaption>
</figure>
```
- Empty `alt=""` for decorative
- Descriptive for informative
- Use `<figcaption>` for complex images

### Links & Buttons
```html
<!-- Descriptive text -->
<a href="/guide">Read accessibility guide</a>

<!-- External links -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External <span class="sr-only">(opens in new tab)</span>
</a>

<!-- Button vs Link -->
<button type="button">Toggle Menu</button>
<a href="/products">Products</a>
```
- Descriptive link text (no "click here")
- `<button>` for actions, `<a>` for navigation
- Add `rel="noopener noreferrer"` to external links

### Forms
```html
<form action="/submit" method="post">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required autocomplete="email">
  
  <fieldset>
    <legend>Address</legend>
    <label for="city">City</label>
    <input type="text" id="city" autocomplete="address-level2">
  </fieldset>
  
  <button type="submit">Submit</button>
</form>
```
- Always associate labels with inputs
- Use appropriate `type` and `autocomplete`
- Use `<fieldset>`/`<legend>` for groups
- Provide error messages with `aria-describedby`

### ARIA
```html
<!-- Dynamic widgets -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<nav id="menu" aria-hidden="true">...</nav>

<!-- Live regions -->
<div role="status" aria-live="polite">3 items in cart</div>
<div role="alert" aria-live="assertive">Error occurred</div>
```
- Prefer semantic HTML over ARIA
- Use for dynamic content (modals, tabs)
- `aria-live` for status updates

### Keyboard & Focus
- All interactive elements keyboard accessible
- Skip link for long pages: `<a href="#main-content" class="skip-link">Skip to content</a>`
- Visible focus indicators (don't remove outlines)

---

## 4. Responsive Design

```html
<!-- Viewport (required) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Responsive images with srcset -->
<img src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, 800px"
  alt="Description">

<!-- Picture for art direction -->
<picture>
  <source media="(max-width: 600px)" srcset="mobile.jpg">
  <img src="desktop.jpg" alt="Description">
</picture>

<!-- Modern formats -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

- Mobile-first approach
- Use relative units (`rem`, `em`, `%`)
- Touch targets min 44×44px

---

## 5. Performance

```html
<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Preload critical resources -->
<link rel="preload" href="critical.css" as="style">

<!-- Script loading -->
<script src="analytics.js" defer></script>
<script src="widget.js" async></script>

<!-- Lazy loading -->
<img src="image.jpg" loading="lazy" alt="Description">
<iframe src="video.html" loading="lazy"></iframe>
```

- `defer` - Execute after DOM (in order)
- `async` - Execute when ready (independent)
- Lazy load images/iframes with `loading="lazy"`
- Use modern formats (WebP, AVIF)
- Inline critical CSS

---

## 6. Code Quality

```html
<article>
  <header>
    <h1>Title</h1>
    <time datetime="2024-10-17">October 17, 2024</time>
  </header>
  <p>Content...</p>
</article>
```

- Consistent indentation (2 or 4 spaces)
- Lowercase tags and attributes
- Double quotes for attributes
- Boolean attributes: `<input checked>`

**Attribute order:** `type`, `id`, `class`, `name`, `value`, `src`/`href`/`alt`, ARIA, data-*

**Comments:** Use for major sections, avoid obvious comments

---

## 7. SEO & Social

```html
<head>
  <title>Page Title - Site Name</title>
  <meta name="description" content="150-160 char description">
  <link rel="canonical" href="https://example.com/page">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Description">
  <meta property="og:image" content="https://example.com/image.jpg">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {"@context": "https://schema.org", "@type": "Article", "headline": "Title"}
  </script>
</head>
```

---

## 8. Security

```html
<!-- External links -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">Link</a>

<!-- CSRF protection -->
<form method="post"><input type="hidden" name="csrf_token" value="..."></form>

<!-- Subresource Integrity -->
<script src="https://cdn.com/lib.js" integrity="sha384-hash" crossorigin="anonymous"></script>
```

- `rel="noopener noreferrer"` for external links
- CSRF tokens for forms
- Use HTTPS for all resources
- SRI for CDN resources

---

## 9. Validation & Checklist

**Tools:** [W3C Validator](https://validator.w3.org/), [WAVE](https://wave.webaim.org/), [axe DevTools](https://www.deque.com/axe/), Lighthouse

**Every Page Checklist:**
- [ ] Valid HTML5, `<!DOCTYPE html>`, `<html lang="en">`
- [ ] `charset="UTF-8"` and viewport meta tag
- [ ] Unique `<title>` and meta description
- [ ] One `<h1>`, logical heading hierarchy
- [ ] Semantic HTML structure
- [ ] All images have `alt` text
- [ ] Forms have associated labels
- [ ] Descriptive links
- [ ] Keyboard navigable
- [ ] WCAG 2.1 AA compliant (4.5:1 contrast)
- [ ] Mobile responsive

---

## 10. Common Patterns

**Card:**
```html
<article class="card">
  <img src="image.jpg" alt="Description" loading="lazy">
  <h2>Title</h2>
  <p>Description...</p>
  <a href="/details">Read more <span class="sr-only">about Title</span></a>
</article>
```

**Modal:**
```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Title</h2>
  <button type="button" aria-label="Close">×</button>
</div>
```

**Responsive Nav:**
```html
<nav aria-label="Primary">
  <button aria-expanded="false" aria-controls="menu">Menu</button>
  <ul id="menu">
    <li><a href="/" aria-current="page">Home</a></li>
  </ul>
</nav>
```

---

**Resources:** [MDN](https://developer.mozilla.org/docs/Web/HTML) · [WCAG](https://www.w3.org/WAI/WCAG21/quickref/) · [Can I Use](https://caniuse.com/)