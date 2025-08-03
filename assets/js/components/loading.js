/**
 * 載入狀態管理系統
 * 提供頁面載入進度條、表單提交載入、內容載入骨架屏和圖片漸進式載入功能
 */

class LoadingSystem {
  constructor() {
    this.initialized = false;
    this.progressBar = null;
    this.progressValue = 0;
    this.progressInterval = null;
  }

  /**
   * 初始化載入系統
   */
  init() {
    if (this.initialized) return;
    
    this.createProgressBar();
    this.setupFormLoading();
    this.setupProgressiveImages();
    this.initialized = true;
    
    // 當頁面完全載入後，確保進度條完成
    window.addEventListener('load', () => {
      this.completeProgress();
    });
  }

  /**
   * 創建頁面頂部進度條
   */
  createProgressBar() {
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'page-loading-bar';
    document.body.appendChild(this.progressBar);
    
    // 開始模擬載入進度
    this.startProgress();
  }

  /**
   * 開始進度條載入動畫
   */
  startProgress() {
    this.progressValue = 0;
    this.updateProgressBar();
    
    // 清除可能存在的舊計時器
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    // 模擬載入進度，隨機增加進度值
    this.progressInterval = setInterval(() => {
      // 進度隨機增加，但接近100%時變慢
      const increment = this.progressValue < 50 ? 
        Math.random() * 10 : 
        this.progressValue < 80 ? 
          Math.random() * 5 : 
          Math.random() * 2;
      
      this.progressValue = Math.min(this.progressValue + increment, 95);
      this.updateProgressBar();
    }, 200);
  }

  /**
   * 更新進度條寬度
   */
  updateProgressBar() {
    if (this.progressBar) {
      this.progressBar.style.width = `${this.progressValue}%`;
    }
  }

  /**
   * 完成進度條載入
   */
  completeProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    
    this.progressValue = 100;
    this.updateProgressBar();
    
    // 進度完成後淡出進度條
    setTimeout(() => {
      if (this.progressBar) {
        this.progressBar.style.opacity = '0';
        
        // 動畫結束後移除進度條
        setTimeout(() => {
          if (this.progressBar && this.progressBar.parentNode) {
            this.progressBar.parentNode.removeChild(this.progressBar);
            this.progressBar = null;
          }
        }, 300);
      }
    }, 200);
  }

  /**
   * 設置表單載入狀態
   */
  setupFormLoading() {
    // 監聽所有表單提交事件
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', e => {
        // 如果表單有noloading屬性，則不顯示載入狀態
        if (form.hasAttribute('data-noloading')) return;
        
        // 添加載入狀態類
        form.classList.add('form-loading');
        
        // 禁用提交按鈕
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.dataset.originalText = submitButton.textContent;
          submitButton.innerHTML = '<span class="spinner"></span> ' + (submitButton.dataset.loadingText || '處理中...');
        }
      });
    });
  }

  /**
   * 移除表單載入狀態
   * @param {HTMLFormElement} form - 表單元素
   * @param {boolean} success - 是否成功
   */
  removeFormLoading(form, success = true) {
    if (!form) return;
    
    // 移除載入狀態類
    form.classList.remove('form-loading');
    
    // 恢復提交按鈕
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.originalText || '提交';
    }
    
    // 顯示結果訊息
    const formStatus = form.querySelector('.form-status');
    if (formStatus) {
      formStatus.textContent = success ? 
        (form.dataset.successMessage || '提交成功！') : 
        (form.dataset.errorMessage || '提交失敗，請稍後再試。');
      
      formStatus.className = 'form-status ' + (success ? 'success' : 'error');
      
      // 5秒後清除狀態訊息
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
    }
  }

  /**
   * 設置漸進式圖片載入
   */
  setupProgressiveImages() {
    // 使用Intersection Observer監視圖片載入
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const container = entry.target;
            const fullImage = container.querySelector('.full-image');
            
            if (fullImage && fullImage.dataset.src) {
              // 創建新圖片元素預載入
              const img = new Image();
              img.onload = () => {
                // 圖片載入完成後，替換src並添加loaded類
                fullImage.src = fullImage.dataset.src;
                container.classList.add('loaded');
              };
              img.src = fullImage.dataset.src;
              
              // 圖片開始載入後，取消觀察
              imageObserver.unobserve(container);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });
      
      // 觀察所有漸進式圖片容器
      document.querySelectorAll('.progressive-image-container').forEach(container => {
        imageObserver.observe(container);
      });
    } else {
      // 對於不支援Intersection Observer的瀏覽器，直接載入所有圖片
      document.querySelectorAll('.progressive-image-container').forEach(container => {
        const fullImage = container.querySelector('.full-image');
        if (fullImage && fullImage.dataset.src) {
          fullImage.src = fullImage.dataset.src;
          container.classList.add('loaded');
        }
      });
    }
  }

  /**
   * 創建骨架屏
   * @param {string} type - 骨架屏類型：'card', 'article', 'list'
   * @param {HTMLElement} container - 容器元素
   */
  createSkeleton(type, container) {
    if (!container) return;
    
    let skeletonHTML = '';
    
    switch (type) {
      case 'card':
        skeletonHTML = `
          <div class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
          </div>
        `;
        break;
        
      case 'article':
        skeletonHTML = `
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-image"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
        `;
        break;
        
      case 'list':
        skeletonHTML = '';
        for (let i = 0; i < 5; i++) {
          skeletonHTML += `
            <div class="skeleton-card" style="display: flex; align-items: center;">
              <div class="skeleton-circle" style="flex-shrink: 0; margin-right: 1rem;"></div>
              <div style="flex-grow: 1;">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
              </div>
            </div>
          `;
        }
        break;
        
      default:
        return;
    }
    
    // 保存原始內容
    container.dataset.originalContent = container.innerHTML;
    
    // 替換為骨架屏
    container.innerHTML = skeletonHTML;
    container.classList.add('content-skeleton');
    
    return container;
  }

  /**
   * 移除骨架屏並恢復內容
   * @param {HTMLElement} container - 容器元素
   */
  removeSkeleton(container) {
    if (!container || !container.classList.contains('content-skeleton')) return;
    
    // 恢復原始內容
    if (container.dataset.originalContent) {
      container.innerHTML = container.dataset.originalContent;
      delete container.dataset.originalContent;
    }
    
    container.classList.remove('content-skeleton');
  }

  /**
   * 顯示內容載入中狀態
   * @param {HTMLElement} container - 容器元素
   */
  showContentLoading(container) {
    if (!container) return;
    
    // 保存原始內容
    container.dataset.originalContent = container.innerHTML;
    
    // 添加載入中覆蓋
    container.innerHTML = '<div class="spinner"></div>';
    container.classList.add('content-loading');
  }

  /**
   * 移除內容載入中狀態
   * @param {HTMLElement} container - 容器元素
   */
  removeContentLoading(container) {
    if (!container || !container.classList.contains('content-loading')) return;
    
    // 恢復原始內容
    if (container.dataset.originalContent) {
      container.innerHTML = container.dataset.originalContent;
      delete container.dataset.originalContent;
    }
    
    container.classList.remove('content-loading');
  }
}

// 創建並導出載入系統實例
const loadingSystem = new LoadingSystem();
export default loadingSystem;

// 頁面載入時初始化載入系統
document.addEventListener('DOMContentLoaded', () => {
  loadingSystem.init();
});