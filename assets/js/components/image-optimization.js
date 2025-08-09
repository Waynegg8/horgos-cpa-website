/**
 * 圖片優化系統
 * 實現延遲載入、漸進式載入、響應式圖片等功能
 */

class ImageOptimization {
  constructor() {
    this.initialized = false;
    this.intersectionObserver = null;
    this.lazyImages = [];
  }

  /**
   * 初始化圖片優化系統
   */
  init() {
    if (this.initialized) return;
    // 首屏階段不註冊任何觀察，延後到頁面穩定再進行，避免關鍵路徑依附樹延長
    window.addEventListener('load', () => {
      this.setupIntersectionObserver();
      this.setupLazyLoading();
      this.setupProgressiveLoading();
      this.initialized = true;
    }, { once: true });
  }

  /**
   * 設置 Intersection Observer
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      // 降級處理：直接載入所有圖片
      this.loadAllImages();
      return;
    }

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });
  }

  /**
   * 設置延遲載入
   */
  setupLazyLoading() {
    // 觀察所有延遲載入的圖片
    document.querySelectorAll('img[loading="lazy"], [data-lazy="true"]').forEach(img => {
      this.intersectionObserver.observe(img);
    });

    // 觀察響應式圖片
    document.querySelectorAll('.responsive-image[data-lazy="true"]').forEach(picture => {
      this.intersectionObserver.observe(picture);
    });

    // 觀察影片 iframe 延遲載入（data-src -> src）
    document.querySelectorAll('iframe[data-src]').forEach(iframe => {
      this.intersectionObserver.observe(iframe);
    });
  }

  /**
   * 設置漸進式載入
   */
  setupProgressiveLoading() {
    document.querySelectorAll('.progressive-image-container').forEach(container => {
      this.intersectionObserver.observe(container);
    });
  }

  /**
   * 載入圖片
   */
  loadImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    }

    // 處理漸進式圖片
    if (img.classList.contains('full-image')) {
      const container = img.closest('.progressive-image-container');
      if (container) {
        container.classList.add('loaded');
      }
    }

    // 處理響應式圖片
    if (img.closest && img.closest('.responsive-image')) {
      const picture = img.closest('.responsive-image');
      picture.classList.add('loaded');
    }

    // 處理 iframe lazy
    if (img.tagName === 'IFRAME' && img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  }

  /**
   * 載入所有圖片（降級處理）
   */
  loadAllImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.loadImage(img);
    });
  }

  /**
   * 預載入圖片
   */
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  /**
   * 優化圖片載入順序
   */
  optimizeLoadingOrder() {
    // 優先載入首屏圖片
    const viewportImages = document.querySelectorAll('img[data-src]:not(.lazy)');
    viewportImages.forEach(img => {
      if (this.isInViewport(img)) {
        this.loadImage(img);
      }
    });
  }

  /**
   * 檢查元素是否在視窗內
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * 處理圖片載入錯誤
   */
  handleImageError(img) {
    img.classList.add('error');
    img.alt = '圖片載入失敗';
    
    // 可以設置預設圖片
    if (img.dataset.fallback) {
      img.src = img.dataset.fallback;
    }
  }

  /**
   * 銷毀實例
   */
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    this.initialized = false;
  }
}

// 創建並導出圖片優化實例
const imageOptimization = new ImageOptimization();
export default imageOptimization;

// 頁面載入時初始化圖片優化系統
document.addEventListener('DOMContentLoaded', () => {
  imageOptimization.init();
});

// 將實例掛載到全局，以便後續操作
window.imageOptimization = imageOptimization;