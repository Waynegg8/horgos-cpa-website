// 觀察首頁統計卡片，進場時加入 inview 以觸發動畫
(() => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.stat').forEach(el => el.classList.add('inview'));
    return;
  }

  const animateCount = (el) => {
    const targetStr = el.getAttribute('data-target') || '0';
    const numericTarget = parseInt(targetStr.toString().replace(/[^0-9]/g, ''), 10) || 0;
    const suffix = targetStr.replace(/[0-9]/g, ''); // 保留 10+ 的 + 或其他字尾
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const val = Math.floor(numericTarget * eased);
      el.textContent = val.toString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');
        const numberEl = entry.target.querySelector('.stat__number');
        if (numberEl && !numberEl.dataset.animated) {
          numberEl.dataset.animated = 'true';
          animateCount(numberEl);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  document.querySelectorAll('.stat').forEach(el => observer.observe(el));
})();

