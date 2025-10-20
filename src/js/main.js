// View Transitions API implementation
document.addEventListener('DOMContentLoaded', () => {
  // Check if View Transitions API is supported
  if (!document.startViewTransition) {
    console.log('View Transitions API not supported');
    return;
  }

  // Intercept navigation clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    
    // Only handle same-origin navigation
    if (
      !link ||
      link.origin !== location.origin ||
      link.target === '_blank' ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    e.preventDefault();
    const url = link.href;

    // Start view transition
    document.startViewTransition(async () => {
      // Fetch the new page
      const response = await fetch(url);
      const html = await response.text();
      
      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Replace the main content
      document.body.innerHTML = doc.body.innerHTML;
      document.title = doc.title;
      
      // Update the URL
      history.pushState(null, '', url);
      
      // Re-attach event listeners
      attachEventListeners();
    });
  });

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    document.startViewTransition(async () => {
      const response = await fetch(location.href);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      document.body.innerHTML = doc.body.innerHTML;
      document.title = doc.title;
      
      attachEventListeners();
    });
  });

  function attachEventListeners() {
    // Re-attach any dynamic event listeners here if needed
    initScrollbarColorObserver();
    console.log('Event listeners attached');
  }
  
  // Initialize scrollbar color observer on page load
  initScrollbarColorObserver();
});

// Dynamic scrollbar colors based on snapped section
function initScrollbarColorObserver() {
  const sections = document.querySelectorAll('[data-scrollbar-color]');
  
  if (sections.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: Array.from({ length: 21 }, (_, i) => i * 0.05) // 0, 0.05, 0.1, ..., 1.0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const colorVar = entry.target.dataset.scrollbarColor;
        const intersectionRatio = entry.intersectionRatio;
        updateScrollbarColor(colorVar, intersectionRatio);
      }
    });
  }, observerOptions);
  
  // Observe all sections with scrollbar color data
  sections.forEach((section) => observer.observe(section));
}

function updateScrollbarColor(colorVar, intersectionRatio) {
  const root = document.documentElement;
  const baseColor = getComputedStyle(root).getPropertyValue(colorVar).trim();
  
  if (!baseColor) {
    console.warn(`Color variable ${colorVar} not found`);
    return;
  }
  
  // Clamp intersection ratio with guardrails (minimum 0.3, maximum 1.0)
  const minIntensity = 0.3;
  const maxIntensity = 1.0;
  const intensity = Math.max(minIntensity, Math.min(maxIntensity, intersectionRatio));
  
  // Calculate dynamic lightness and chroma adjustments based on clamped intersection
  const trackLightnessAdjust = 0.2 + (0.1 * intensity); // Range: 0.2 to 0.3
  const trackChromaMultiplier = 0.2 + (0.1 * intensity); // Range: 0.2 to 0.3
  const thumbChromaBase = 0.04 + (0.01 * intensity); // Range: 0.04 to 0.05
  const thumbChromaHover = 0.06 + (0.02 * intensity); // Range: 0.06 to 0.08
  const thumbLightnessAdjust = 0.05 + (0.05 * intensity); // Range: 0.05 to 0.1
  
  // Update scrollbar colors derived from the base color
  root.style.setProperty('--scrollbar-thumb-active', baseColor);
  
  // Update scrollbar track, thumb, and hover colors with dynamic calculations
  root.style.setProperty('--scrollbar-track', `light-dark(
    oklch(from ${baseColor} calc(l + ${trackLightnessAdjust}) calc(c * ${trackChromaMultiplier}) h),
    oklch(from ${baseColor} calc(l - ${trackLightnessAdjust}) calc(c * ${trackChromaMultiplier}) h)
  )`);
  
  root.style.setProperty('--scrollbar-thumb', `light-dark(
    oklch(from ${baseColor} l ${thumbChromaBase} h),
    oklch(from ${baseColor} calc(l - ${thumbLightnessAdjust}) ${thumbChromaBase} h)
  )`);
  
  root.style.setProperty('--scrollbar-thumb-hover', `light-dark(
    oklch(from ${baseColor} calc(l - ${thumbLightnessAdjust}) ${thumbChromaHover} h),
    oklch(from ${baseColor} l ${thumbChromaHover} h)
  )`);
}
