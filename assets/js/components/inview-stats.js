// 觀察首頁統計卡片，進場時加入 inview 以觸發動畫
(() => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.stat').forEach(el => el.classList.add('inview'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  document.querySelectorAll('.stat').forEach(el => observer.observe(el));
})();

