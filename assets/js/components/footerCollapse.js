// assets/js/components/footerCollapse.js

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = () => window.innerWidth <= 640; // Matches SCSS breakpoint

  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  const toggles = footer.querySelectorAll('.footer-collapse-toggle');

  toggles.forEach(toggle => {
    // Set initial state based on screen size
    if (isMobile()) {
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', () => {
      if (!isMobile()) return; // Only allow toggling on mobile

      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
    });
  });

  // Re-evaluate on resize
  window.addEventListener('resize', () => {
    toggles.forEach(toggle => {
      if (isMobile()) {
        // On mobile, respect the user's choice, don't auto-set
        if (toggle.getAttribute('aria-expanded') === null) {
           toggle.setAttribute('aria-expanded', 'false');
        }
      } else {
        // On desktop, always expand
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
