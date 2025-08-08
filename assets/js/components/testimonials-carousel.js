// Stripe 風格：無限水平流動跑馬燈 + 懸停暫停 + RWD
document.addEventListener('DOMContentLoaded', () => {
  initInfiniteCarousels();
});

function initInfiniteCarousels(){
  const roots = document.querySelectorAll('.tn-infinite');
  roots.forEach(setupInfinite);
}

function setupInfinite(root){
  const viewport = root.querySelector('.tn-infinite__viewport');
  const track = root.querySelector('.tn-infinite__track');
  let slides = Array.from(root.querySelectorAll('.tn-infinite__slide'));
  if (!viewport || !track || slides.length === 0) return;

  // 依視窗決定一屏顯示張數
  function perView(){
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 1;
    return 2;
  }

  // 複製節點，確保可循環滾動
  function populate(){
    // 清掉舊複本
    track.querySelectorAll('.tn-infinite__clone').forEach(n => n.remove());
    const n = perView();
    const need = Math.max(4, n * 4); // 至少4*n張以確保順暢
    while (slides.length < need){
      const copy = slides.map(s => s.cloneNode(true));
      copy.forEach(c => { c.classList.add('tn-infinite__clone'); track.appendChild(c); });
      slides = Array.from(track.querySelectorAll('.tn-infinite__slide'));
    }
    applyWidths();
  }

  function applyWidths(){
    const n = perView();
    const w = 100 / n;
    Array.from(track.children).forEach(el => el.style.minWidth = `${w}%`);
  }

  // 使用 CSS 變換連續移動
  let rafId = null;
  const baseSpeed = parseFloat(root.dataset.speed || '0.5'); // px/ms 相對速度
  let lastTs = 0;
  let offset = 0; // 以百分比為單位偏移

  function step(ts){
    if (!lastTs) lastTs = ts;
    const dt = ts - lastTs; lastTs = ts;
    const n = perView();
    const w = 100 / n; // 單張寬度百分比
    offset += (baseSpeed * dt) / 10; // 速度調校
    // 無限循環：位移達一張寬度就重置
    if (offset >= w) offset -= w;
    track.style.transform = `translateX(-${offset}%)`;
    rafId = requestAnimationFrame(step);
  }

  function start(){ cancelAnimationFrame(rafId); rafId = requestAnimationFrame(step); }
  function stop(){ cancelAnimationFrame(rafId); rafId = null; }

  // 互動：懸停暫停、視窗改變重算
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  window.addEventListener('resize', () => { populate(); });

  populate();
  start();
}

