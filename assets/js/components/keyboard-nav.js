/**
 * 鍵盤導航功能
 * 提供鍵盤友善的導航體驗，支援Tab鍵導航、快速鍵和焦點管理
 */

class KeyboardNavigation {
  constructor() {
    this.initialized = false;
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.skipLinks = document.querySelectorAll('.skip-link');
    this.focusableContent = null;
    this.lastFocusedElement = null;
  }

  /**
   * 初始化鍵盤導航
   */
  init() {
    if (this.initialized) return;
    
    this.setupSkipLinks();
    this.setupFocusTrap();
    this.setupKeyboardShortcuts();
    this.setupFocusIndicator();
    this.initialized = true;
  }

  /**
   * 設置跳過連結功能
   */
  setupSkipLinks() {
    this.skipLinks.forEach(skipLink => {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
          
          // 移除tabindex以避免影響正常的鍵盤導航
          setTimeout(() => {
            targetElement.removeAttribute('tabindex');
          }, 1000);
        }
      });
    });
  }

  /**
   * 設置焦點陷阱（用於模態框等）
   */
  setupFocusTrap() {
    // 監聽模態框開啟
    document.addEventListener('modal:open', (e) => {
      const modal = e.detail.modal;
      if (!modal) return;
      
      // 保存上一個焦點元素
      this.lastFocusedElement = document.activeElement;
      
      // 獲取模態框內的可聚焦元素
      this.focusableContent = modal.querySelectorAll(this.focusableElements);
      if (this.focusableContent.length === 0) return;
      
      // 聚焦到第一個元素
      this.focusableContent[0].focus();
      
      // 添加鍵盤事件監聽
      modal.addEventListener('keydown', this.handleTabKey);
    });
    
    // 監聽模態框關閉
    document.addEventListener('modal:close', () => {
      // 移除鍵盤事件監聽
      const modals = document.querySelectorAll('.modal.active');
      modals.forEach(modal => {
        modal.removeEventListener('keydown', this.handleTabKey);
      });
      
      // 恢復焦點
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
      
      this.focusableContent = null;
    });
  }

  /**
   * 處理Tab鍵在模態框內的循環
   * @param {KeyboardEvent} e - 鍵盤事件
   */
  handleTabKey = (e) => {
    if (!this.focusableContent || this.focusableContent.length === 0) return;
    
    // 檢查是否為Tab鍵
    if (e.key === 'Tab' || e.keyCode === 9) {
      const firstElement = this.focusableContent[0];
      const lastElement = this.focusableContent[this.focusableContent.length - 1];
      
      // Shift + Tab 從第一個元素到最後一個元素
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // Tab 從最後一個元素到第一個元素
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    
    // Esc鍵關閉模態框
    if (e.key === 'Escape' || e.keyCode === 27) {
      const closeButton = document.querySelector('.modal.active .close-button');
      if (closeButton) {
        closeButton.click();
      }
    }
  }

  /**
   * 設置鍵盤快速鍵
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // 只有在沒有輸入框聚焦時才啟用快速鍵
      const tagName = document.activeElement.tagName.toLowerCase();
      const isInputFocused = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
      const hasContentEditable = document.activeElement.getAttribute('contenteditable') === 'true';
      
      if (isInputFocused || hasContentEditable) return;
      
      // Alt + 數字鍵 快速導航到主要區域
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        // Alt + 1: 主內容
        if (e.key === '1') {
          e.preventDefault();
          const mainContent = document.querySelector('#main-content');
          if (mainContent) {
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
            setTimeout(() => {
              mainContent.removeAttribute('tabindex');
            }, 1000);
          }
        }
        
        // Alt + 2: 主導航
        if (e.key === '2') {
          e.preventDefault();
          const mainNav = document.querySelector('.main-nav');
          if (mainNav) {
            const firstLink = mainNav.querySelector('a');
            if (firstLink) {
              firstLink.focus();
            }
          }
        }
        
        // Alt + 3: 搜尋框
        if (e.key === '3') {
          e.preventDefault();
          const searchInput = document.querySelector('.search-form input');
          if (searchInput) {
            searchInput.focus();
          }
        }
        
        // Alt + 4: 頁腳
        if (e.key === '4') {
          e.preventDefault();
          const footer = document.querySelector('.footer');
          if (footer) {
            footer.setAttribute('tabindex', '-1');
            footer.focus();
            setTimeout(() => {
              footer.removeAttribute('tabindex');
            }, 1000);
          }
        }
      }
      
      // 其他快速鍵
      // / 鍵: 聚焦搜尋框
      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        const searchInput = document.querySelector('.search-form input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  /**
   * 設置焦點指示器
   */
  setupFocusIndicator() {
    // 檢測使用者輸入方式
    let usingMouse = false;
    
    // 滑鼠事件發生時標記為使用滑鼠
    document.addEventListener('mousedown', () => {
      usingMouse = true;
      document.body.classList.add('using-mouse');
    });
    
    // 鍵盤事件發生時標記為使用鍵盤
    document.addEventListener('keydown', (e) => {
      // Tab鍵表示使用鍵盤導航
      if (e.key === 'Tab') {
        usingMouse = false;
        document.body.classList.remove('using-mouse');
      }
    });
  }

  /**
   * 設置表單無障礙功能
   */
  setupFormAccessibility() {
    // 確保所有輸入框都有關聯的標籤
    document.querySelectorAll('input, select, textarea').forEach(input => {
      const id = input.getAttribute('id');
      if (!id) return;
      
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label) {
        console.warn(`Input with id "${id}" has no associated label.`);
      }
    });
    
    // 確保所有必填欄位都有適當的ARIA標籤
    document.querySelectorAll('[required]').forEach(field => {
      if (!field.getAttribute('aria-required')) {
        field.setAttribute('aria-required', 'true');
      }
    });
    
    // 設置表單錯誤訊息的ARIA屬性
    document.querySelectorAll('.error-message').forEach(errorMsg => {
      const id = errorMsg.getAttribute('id');
      if (!id) return;
      
      const inputId = id.replace('-error', '');
      const input = document.getElementById(inputId);
      
      if (input && errorMsg.textContent.trim()) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', id);
      } else if (input) {
        input.removeAttribute('aria-invalid');
      }
    });
  }
}

// 創建並導出鍵盤導航實例
const keyboardNavigation = new KeyboardNavigation();
export default keyboardNavigation;

// 頁面載入時初始化鍵盤導航
document.addEventListener('DOMContentLoaded', () => {
  keyboardNavigation.init();
});