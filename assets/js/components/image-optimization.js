/**
 * 圖片優化腳本
 * 實現延遲載入和漸進式載入效果
 */

document.addEventListener('DOMContentLoaded', function() {
  // 初始化延遲載入
  initLazyLoading();
  
  // 初始化漸進式載入
  initProgressiveLoading();
});

/**
 * 初始化延遲載入
 */
function initLazyLoading() {
  // 檢查瀏覽器是否支援 Intersection Observer
  if ('IntersectionObserver' in window) {
    // 獲取所有需要延遲載入的圖片
    const lazyImages = document.querySelectorAll('img.lazy-image');
    
    // 創建 Intersection Observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // 如果圖片有 data-src 屬性，則設置 src
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // 如果圖片有 data-srcset 屬性，則設置 srcset
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          // 移除 lazy-image 類別
          img.classList.remove('lazy-image');
          
          // 停止觀察此圖片
          imageObserver.unobserve(img);
        }
      });
    });
    
    // 開始觀察所有圖片
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // 不支援 Intersection Observer，使用備用方案
    const lazyImages = document.querySelectorAll('img.lazy-image');
    
    // 簡單的滾動事件處理
    function lazyLoad() {
      const scrollTop = window.pageYOffset;
      const viewportHeight = window.innerHeight;
      
      lazyImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        
        // 檢查圖片是否在視口中
        if (rect.top >= -viewportHeight && rect.top <= viewportHeight * 2) {
          // 如果圖片有 data-src 屬性，則設置 src
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // 如果圖片有 data-srcset 屬性，則設置 srcset
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          // 移除 lazy-image 類別
          img.classList.remove('lazy-image');
        }
      });
      
      // 如果所有圖片都已載入，移除滾動事件監聽器
      if (lazyImages.length === 0) {
        window.removeEventListener('scroll', lazyLoad);
        window.removeEventListener('resize', lazyLoad);
        window.removeEventListener('orientationChange', lazyLoad);
      }
    }
    
    // 添加事件監聽器
    window.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationChange', lazyLoad);
    
    // 初始載入
    lazyLoad();
  }
}

/**
 * 初始化漸進式載入
 */
function initProgressiveLoading() {
  // 獲取所有需要漸進式載入的圖片
  const progressiveImages = document.querySelectorAll('.progressive-image');
  
  progressiveImages.forEach(container => {
    const placeholder = container.querySelector('.placeholder-image');
    const fullImage = container.querySelector('.full-image');
    
    if (placeholder && fullImage) {
      // 創建新的圖片元素用於預載入
      const img = new Image();
      
      // 設置載入完成事件
      img.onload = function() {
        // 移除佔位圖片的模糊效果
        placeholder.classList.add('loaded');
        
        // 顯示完整圖片
        fullImage.classList.add('loaded');
      };
      
      // 開始載入完整圖片
      img.src = fullImage.src;
    }
  });
}