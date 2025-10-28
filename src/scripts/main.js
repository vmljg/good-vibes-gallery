// Main JavaScript file for Good Vibes Gallery
// This file can be used for any interactive functionality

// Example: Smooth scroll behavior for anchor links
document.addEventListener('DOMContentLoaded', () => {
  // Handle smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add any other interactive functionality here
  console.log('Good Vibes Gallery loaded');
});
