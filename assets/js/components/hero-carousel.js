/**
 * Hero 輪播功能
 * 實現自動播放、手動控制、無障礙支援等功能
 */

class HeroCarousel {
  constructor() {
    this.carousel = null;
    this.slides = [];
    this.indicators = [];
    this.prevBtn = null;
    this.nextBtn = null;
    this.currentSlide = 0;
    this.interval = null;
    this.autoPlayDelay = 5000; // 5秒自動切換
    this.isUserInteracting = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  /**
   * 初始化輪播
   */
  init() {
    this.carousel = document.querySelector('.hero-carousel');
    if (!this.carousel) return;

    this.slides = this.carousel.querySelectorAll('.hero-carousel__slide');
    this.indicators = this.carousel.querySelectorAll('.hero-carousel__indicator');
    this.prevBtn = this.carousel.querySelector('.hero-carousel__control--prev');
    this.nextBtn = this.carousel.querySelector('.hero-carousel__control--next');

    if (this.slides.length === 0) return;

    this.setupEventListeners();
    this.showSlide(0);
    this.startAutoPlay();
    this.setupAccessibility();
  }

  /**
   * 設置事件監聽器
   */
  setupEventListeners() {
    // 上一張按鈕
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleUserInteraction();
        this.prevSlide();
      });
    }

    // 下一張按鈕
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleUserInteraction();
        this.nextSlide();
      });
    }

    // 指示器點擊
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleUserInteraction();
        this.showSlide(index);
      });
    });

    // 滑鼠懸停
    this.carousel.addEventListener('mouseenter', () => {
      this.stopAutoPlay();
    });

    this.carousel.addEventListener('mouseleave', () => {
      if (!this.isUserInteracting) {
        this.startAutoPlay();
      }
    });

    // 觸控事件
    this.setupTouchEvents();

    // 鍵盤導航
    this.setupKeyboardNavigation();

    // 頁面可見性變化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
    });
  }

  /**
   * 設置觸控事件
   */
  setupTouchEvents() {
    this.carousel.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.stopAutoPlay();
    });

    this.carousel.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      const diff = this.touchStartX - this.touchEndX;
      
      if (Math.abs(diff) > 50) { // 最小滑動距離
        this.handleUserInteraction();
        if (diff > 0) {
          this.nextSlide(); // 向左滑動，下一張
        } else {
          this.prevSlide(); // 向右滑動，上一張
        }
      }
    });
  }

  /**
   * 設置鍵盤導航
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // 只有在輪播區域聚焦時才響應
      if (!this.carousel.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.handleUserInteraction();
          this.prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.handleUserInteraction();
          this.nextSlide();
          break;
        case 'Home':
          e.preventDefault();
          this.handleUserInteraction();
          this.showSlide(0);
          break;
        case 'End':
          e.preventDefault();
          this.handleUserInteraction();
          this.showSlide(this.slides.length - 1);
          break;
      }
    });
  }

  /**
   * 設置無障礙功能
   */
  setupAccessibility() {
    // 設置 ARIA 屬性
    this.carousel.setAttribute('role', 'region');
    this.carousel.setAttribute('aria-label', '首頁輪播');

    // 更新指示器的 ARIA 屬性
    this.updateIndicatorsAria();
  }

  /**
   * 更新指示器的 ARIA 屬性
   */
  updateIndicatorsAria() {
    this.indicators.forEach((indicator, index) => {
      indicator.setAttribute('aria-selected', index === this.currentSlide ? 'true' : 'false');
    });
  }

  /**
   * 處理用戶互動
   */
  handleUserInteraction() {
    this.isUserInteracting = true;
    this.stopAutoPlay();
    
    // 3秒後重新開始自動播放
    setTimeout(() => {
      this.isUserInteracting = false;
      this.startAutoPlay();
    }, 3000);
  }

  /**
   * 顯示指定幻燈片
   */
  showSlide(index) {
    // 隱藏所有幻燈片
    this.slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // 移除所有指示器活動狀態
    this.indicators.forEach(indicator => {
      indicator.classList.remove('active');
    });
    
    // 顯示當前幻燈片
    if (this.slides[index]) {
      this.slides[index].classList.add('active');
    }
    
    // 設置指示器活動狀態
    if (this.indicators[index]) {
      this.indicators[index].classList.add('active');
    }
    
    this.currentSlide = index;
    this.updateIndicatorsAria();
  }

  /**
   * 下一張幻燈片
   */
  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(next);
  }

  /**
   * 上一張幻燈片
   */
  prevSlide() {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prev);
  }

  /**
   * 開始自動播放
   */
  startAutoPlay() {
    if (this.interval) return;
    
    this.interval = setInterval(() => {
      if (!this.isUserInteracting && !document.hidden) {
        this.nextSlide();
      }
    }, this.autoPlayDelay);
  }

  /**
   * 停止自動播放
   */
  stopAutoPlay() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * 銷毀輪播
   */
  destroy() {
    this.stopAutoPlay();
    // 移除事件監聽器
    this.carousel.removeEventListener('mouseenter', this.stopAutoPlay);
    this.carousel.removeEventListener('mouseleave', this.startAutoPlay);
  }
}

// 當DOM加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
  const heroCarousel = new HeroCarousel();
  heroCarousel.init();
  
  // 將實例掛載到全局，以便後續操作
  window.heroCarousel = heroCarousel;
}); 