// 簡易輪播：自動播放、可左右切換、支援響應式顯示 1~3 張
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.tn-carousel');
  carousels.forEach(initCarousel);
});

function initCarousel(root){
  const track = root.querySelector('.tn-track');
  const slides = Array.from(root.querySelectorAll('.tn-slide'));
  const prev = root.querySelector('.tn-prev');
  const next = root.querySelector('.tn-next');
  const dots = root.querySelector('.tn-dots');
  if (!track || slides.length === 0) return;

  let index = 0;
  let autoplay = root.dataset.autoplay === 'true';
  const interval = parseInt(root.dataset.interval || '4500', 10);
  let timer = null;

  // dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', () => goTo(i));
    dots.appendChild(b);
  });

  function visibleCount(){
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 1024) return 1; // tablet 顯示更大卡片
    return 2; // desktop 顯示兩張大卡
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    const w = 100 / visibleCount();
    track.style.transform = `translateX(-${index * w}%)`;
    dots.querySelectorAll('button').forEach((d, di) => d.classList.toggle('active', di === index));
    restart();
  }

  function nextSlide(){ goTo(index + 1); }
  function prevSlide(){ goTo(index - 1); }

  function start(){ if (autoplay) timer = setInterval(nextSlide, interval); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }
  function restart(){ stop(); start(); }

  next?.addEventListener('click', nextSlide);
  prev?.addEventListener('click', prevSlide);
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  window.addEventListener('resize', () => goTo(index));

  // 初始
  // 將每張寬度設為 100/可視數
  function applyWidth(){
    const n = visibleCount();
    slides.forEach(slide => { slide.style.minWidth = `${100 / n}%`; });
  }
  applyWidth();
  goTo(0);
  start();
}

