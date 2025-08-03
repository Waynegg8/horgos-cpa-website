/**
 * 目錄功能管理器
 * 自動生成目錄，並支援平滑滾動和當前位置高亮
 */

class TableOfContents {
  constructor() {
    this.tocContainer = document.getElementById('toc-container');
    this.contentContainer = document.querySelector('.single-content');
    this.headings = [];
    this.activeClass = 'is-active';
    this.tocItemTemplate = `<li class="toc-item toc-item--{level}"><a href="#{id}" class="toc-link">{text}</a></li>`;
    this.offsetTop = 20; // 頂部偏移量，用於固定目錄
    
    this.init();
  }
  
  /**
   * 初始化目錄功能
   */
  init() {
    if (!this.tocContainer || !this.contentContainer) return;
    
    // 收集標題
    this.collectHeadings();
    
    // 如果沒有標題，隱藏目錄容器
    if (this.headings.length === 0) {
      this.tocContainer.style.display = 'none';
      return;
    }
    
    // 生成目錄
    this.generateToc();
    
    // 綁定事件
    this.bindEvents();
  }
  
  /**
   * 收集文章中的標題
   */
  collectHeadings() {
    // 只收集 h2 和 h3 標題
    const headingElements = this.contentContainer.querySelectorAll('h2, h3');
    
    headingElements.forEach(heading => {
      // 為標題生成ID
      if (!heading.id) {
        heading.id = this.generateId(heading.textContent);
      }
      
      this.headings.push({
        id: heading.id,
        text: heading.textContent,
        level: heading.tagName.toLowerCase()
      });
    });
  }
  
  /**
   * 生成目錄
   */
  generateToc() {
    if (this.headings.length === 0) return;
    
    let tocHtml = '<ul class="toc-list">';
    
    this.headings.forEach(heading => {
      tocHtml += this.tocItemTemplate
        .replace('{level}', heading.level)
        .replace('{id}', heading.id)
        .replace('{text}', heading.text);
    });
    
    tocHtml += '</ul>';
    
    this.tocContainer.innerHTML = tocHtml;
  }
  
  /**
   * 綁定事件
   */
  bindEvents() {
    // 點擊目錄項目，平滑滾動到對應標題
    const tocLinks = this.tocContainer.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // 平滑滾動到目標位置
          window.scrollTo({
            top: targetElement.offsetTop - 100, // 減去頁頭高度
            behavior: 'smooth'
          });
          
          // 更新 URL 錨點
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });
    
    // 滾動時更新當前位置
    window.addEventListener('scroll', this.debounce(() => {
      this.updateActiveItem();
    }, 100));
    
    // 頁面載入時檢查 URL 錨點
    window.addEventListener('load', () => {
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // 延遲滾動，確保頁面完全載入
          setTimeout(() => {
            window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: 'smooth'
            });
          }, 300);
        }
      }
      
      // 初始化當前位置
      this.updateActiveItem();
    });
    
    // 實現目錄的固定定位
    this.initStickyToc();
  }
  
  /**
   * 更新當前位置
   */
  updateActiveItem() {
    // 獲取當前滾動位置
    const scrollPosition = window.scrollY;
    
    // 找到當前位置對應的標題
    let currentHeading = null;
    
    for (let i = 0; i < this.headings.length; i++) {
      const heading = this.headings[i];
      const headingElement = document.getElementById(heading.id);
      
      if (headingElement.offsetTop - 120 <= scrollPosition) {
        currentHeading = heading;
      } else {
        break;
      }
    }
    
    // 更新目錄項目的高亮狀態
    const tocLinks = this.tocContainer.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
      link.classList.remove(this.activeClass);
    });
    
    if (currentHeading) {
      const activeLink = this.tocContainer.querySelector(`a[href="#${currentHeading.id}"]`);
      
      if (activeLink) {
        activeLink.classList.add(this.activeClass);
      }
    }
  }
  
  /**
   * 實現目錄的固定定位
   */
  initStickyToc() {
    // 獲取目錄容器的初始位置
    const tocRect = this.tocContainer.getBoundingClientRect();
    const initialOffsetTop = tocRect.top + window.scrollY;
    
    // 監聽滾動事件
    window.addEventListener('scroll', this.debounce(() => {
      const scrollPosition = window.scrollY;
      
      // 當滾動位置超過目錄容器的初始位置時，固定目錄
      if (scrollPosition > initialOffsetTop - this.offsetTop) {
        this.tocContainer.classList.add('is-sticky');
        this.tocContainer.style.top = `${this.offsetTop}px`;
      } else {
        this.tocContainer.classList.remove('is-sticky');
        this.tocContainer.style.top = '';
      }
    }, 10));
  }
  
  /**
   * 為標題生成ID
   * @param {string} text - 標題文字
   * @returns {string} - 生成的ID
   */
  generateId(text) {
    // 將中文轉換為拼音或其他方式處理
    // 這裡採用簡單的方式，將文字轉換為小寫，並替換空格為連字符
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
  
  /**
   * 防抖函數
   * @param {Function} func - 要執行的函數
   * @param {number} wait - 等待時間（毫秒）
   * @returns {Function} - 防抖後的函數
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// 當文檔載入完成後初始化目錄功能
document.addEventListener('DOMContentLoaded', () => {
  // 只在文章頁面初始化目錄功能
  if (document.body.classList.contains('articles') && document.querySelector('.single-content')) {
    new TableOfContents();
  }
});