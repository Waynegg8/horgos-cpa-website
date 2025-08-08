// Update business status inside footer container without inline scripts (CSP-friendly)
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('footer-business-status');
  if (!root) return;

  const el = document.createElement('div');
  el.className = 'business-status';
  el.innerHTML = `
    <div class="status-indicator">
      <span class="status-dot" id="status-dot"></span>
      <span class="status-text" id="status-text">載入中...</span>
    </div>
    <div class="next-status" id="next-status"></div>
  `;
  root.appendChild(el);

  const statusDot = el.querySelector('#status-dot');
  const statusText = el.querySelector('#status-text');
  const nextStatus = el.querySelector('#next-status');

  const updateUI = (data) => {
    statusDot.classList.remove('open', 'closed', 'lunch');
    switch (data.status) {
      case 'open':
        statusDot.classList.add('open');
        statusText.textContent = data.message || '營業中';
        nextStatus.textContent = data.nextChangeTime ? `下次時間：${data.nextChangeTime}` : '';
        break;
      case 'lunch':
        statusDot.classList.add('lunch');
        statusText.textContent = data.message || '午休中';
        nextStatus.textContent = data.nextChangeTime ? `下次時間：${data.nextChangeTime}` : '';
        break;
      default:
        statusDot.classList.add('closed');
        statusText.textContent = data.message || '休息中';
        nextStatus.textContent = data.nextChangeTime ? `下次時間：${data.nextChangeTime}` : '';
    }
  };

  const fallback = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const cur = hour * 60 + minute;
    const morningStart = 510, morningEnd = 750; // 08:30-12:30
    const afternoonStart = 810, afternoonEnd = 1050; // 13:30-17:30
    const isWeekday = day >= 1 && day <= 5;
    const isOpen = isWeekday && ((cur >= morningStart && cur < morningEnd) || (cur >= afternoonStart && cur < afternoonEnd));
    const isLunch = isWeekday && cur >= morningEnd && cur < afternoonStart;
    updateUI({ status: isOpen ? 'open' : (isLunch ? 'lunch' : 'closed'), message: isOpen ? '營業中' : (isLunch ? '午休中' : '休息中') });
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/business-status', { headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) return fallback();
      const data = await res.json();
      if (!data.success) return fallback();
      updateUI(data);
    } catch (e) {
      fallback();
    }
  };

  // 僅在頁腳進入可視區時才開始請求（避免影響首屏與主執行緒）
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchStatus();
          setInterval(fetchStatus, 60000);
          io.disconnect();
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    io.observe(root);
  } else {
    // 降級：延後少許再請求
    setTimeout(() => {
      fetchStatus();
      setInterval(fetchStatus, 60000);
    }, 1500);
  }
});

