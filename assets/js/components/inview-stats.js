// 觀察首頁統計卡片，進場時加入 inview 以觸發動畫
(() => {
  // 等到頁面 load 後再初始化，避免關鍵路徑阻塞
  if (document.readyState !== 'complete') {
    window.addEventListener('load', init, { once: true });
  } else {
    init();
  }

  function init() {
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

  // 作法：
  // 1) 進場時觸發一次
  // 2) 之後每隔幾秒自動重新播放數字滾動與卡片微動態，營造「一直有動畫」的感覺
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      card.classList.add('inview');
      const numberEl = card.querySelector('.stat__number');
      if (!numberEl) return;

      const play = () => {
        // 每次重播前，先把數字歸零（保留字尾）
        const targetStr = numberEl.getAttribute('data-target') || '0';
        const suffix = targetStr.replace(/[0-9]/g, '');
        numberEl.textContent = '0' + suffix;
        animateCount(numberEl);
        // 加上短暫微動態類（由 CSS 控制）
        card.classList.add('stat-replay');
        setTimeout(() => card.classList.remove('stat-replay'), 700);
      };

      // 首次播放
      play();
      // 循環播放（每 6 秒）
      const interval = setInterval(play, 6000);
      card.dataset.statInterval = interval;

      // 當卡片離開視窗很遠時停止循環，節省資源
      const stopObserver = new IntersectionObserver((ents) => {
        ents.forEach(e => {
          if (!e.isIntersecting) {
            clearInterval(Number(card.dataset.statInterval));
            stopObserver.disconnect();
          }
        });
      }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
      stopObserver.observe(card);

      observer.unobserve(card);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  document.querySelectorAll('.stat').forEach(el => observer.observe(el));
  }
})();

