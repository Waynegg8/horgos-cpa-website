/**
 * Hero 輪播功能
 */

// 當DOM加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
  initHeroCarousel();
});

/**
 * 初始化 Hero 輪播
 */
function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.hero-carousel__slide');
  const indicators = carousel.querySelectorAll('.hero-carousel__indicator');
  const prevBtn = carousel.querySelector('.hero-carousel__control--prev');
  const nextBtn = carousel.querySelector('.hero-carousel__control--next');
  
  let currentSlide = 0;
  let interval;
  const autoPlayDelay = 5000; // 5秒自動切換

  // 初始化輪播
  function initCarousel() {
    if (slides.length === 0) return;
    
    // 設置第一張為活動狀態
    showSlide(0);
    
    // 開始自動播放
    startAutoPlay();
    
    // 添加事件監聽器
    addEventListeners();
  }

  // 顯示指定幻燈片
  function showSlide(index) {
    // 隱藏所有幻燈片
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // 移除所有指示器活動狀態
    indicators.forEach(indicator => {
      indicator.classList.remove('active');
    });
    
    // 顯示當前幻燈片
    if (slides[index]) {
      slides[index].classList.add('active');
    }
    
    // 設置指示器活動狀態
    if (indicators[index]) {
      indicators[index].classList.add('active');
    }
    
    currentSlide = index;
  }

  // 下一張幻燈片
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  // 上一張幻燈片
  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  // 開始自動播放
  function startAutoPlay() {
    interval = setInterval(nextSlide, autoPlayDelay);
  }

  // 停止自動播放
  function stopAutoPlay() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  // 添加事件監聽器
  function addEventListeners() {
    // 上一張按鈕
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
      });
    }

    // 下一張按鈕
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
      });
    }

    // 指示器點擊
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', function(e) {
        e.preventDefault();
        stopAutoPlay();
        showSlide(index);
        startAutoPlay();
      });
    });

    // 滑鼠懸停時停止自動播放
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // 觸控事件支持
    let startX = 0;
    let endX = 0;

    carousel.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      stopAutoPlay();
    });

    carousel.addEventListener('touchend', function(e) {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) { // 最小滑動距離
        if (diff > 0) {
          nextSlide(); // 向左滑動，下一張
        } else {
          prevSlide(); // 向右滑動，上一張
        }
      }
      
      startAutoPlay();
    });

    // 鍵盤導航
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
      } else if (e.key === 'ArrowRight') {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
      }
    });
  }

  // 初始化輪播
  initCarousel();
} 