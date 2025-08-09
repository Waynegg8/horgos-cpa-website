// assets/js/components/headerScroll.js

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');

  if (!header) {
    return;
  }

  const scrollThreshold = 10;
  let ticking = false;

  const update = () => {
    const y = window.scrollY || window.pageYOffset;
    if (y > scrollThreshold) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  update();
});
