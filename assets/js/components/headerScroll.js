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

    // 列表頁：保證側邊欄為 sticky（僅 section kind）
    const body = document.body;
    if (body && body.dataset && body.dataset.kind === 'section') {
      document.querySelectorAll('.two-column__sidebar').forEach((el) => {
        if (getComputedStyle(el).position !== 'sticky') {
          el.style.position = 'sticky';
          el.style.top = '16px';
          el.style.height = 'max-content';
          el.style.alignSelf = 'flex-start';
          el.style.willChange = 'top';
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial check in case the page is reloaded with the scroll position past the threshold
  handleScroll();
});
