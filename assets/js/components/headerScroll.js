// assets/js/components/headerScroll.js

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');

  if (!header) {
    return;
  }

  const scrollThreshold = 10; // Only add class after scrolling 10px

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial check in case the page is reloaded with the scroll position past the threshold
  handleScroll();
});
