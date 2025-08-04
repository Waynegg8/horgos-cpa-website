// assets/js/components/mobileNav.js

document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (!toggleButton || !mobileNav) {
    return;
  }

  // --- Main toggle for the mobile navigation panel ---
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('mobile-nav-is-open');
  });

  // --- Logic for handling dropdowns within the mobile nav ---
  const dropdownToggles = mobileNav.querySelectorAll('[data-toggle-dropdown]');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent page jump if href is '#'
      const parentItem = toggle.closest('.mobile-nav__item');
      
      if (parentItem) {
        parentItem.classList.toggle('is-open');
      }
    });
  });
});
