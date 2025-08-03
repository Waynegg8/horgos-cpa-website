/**
 * 搜尋功能管理器
 * 使用 Fuse.js 實現前端即時搜尋
 */

class SearchManager {
  constructor() {
    this.searchData = [];
    this.fuse = null;
    this.searchInput = document.getElementById('search-input');
    this.searchResults = document.getElementById('search-results');
    this.searchForm = document.getElementById('search-form');
    this.currentSection = document.body.dataset.section || '';
    this.minChars = 2;
    this.maxResults = 10;
    this.loadingClass = 'is-loading';
    this.activeClass = 'is-active';
    this.itemTemplate = `
      <li class="search-result-item">
        <a href="{{uri}}" class="search-result-link">
          <span class="search-result-title">{{title}}</span>
          <span class="search-result-section">{{sectionName}}</span>
          <span class="search-result-description">{{description}}</span>
        </a>
      </li>
    `;
    
    this.init();
  }
  
  /**
   * 初始化搜尋功能
   */
  init() {
    if (!this.searchInput || !this.searchResults) return;
    
    // 載入搜尋索引
    this.loadSearchIndex();
    
    // 綁定事件
    this.bindEvents();
  }
  
  /**
   * 載入搜尋索引
   */
  loadSearchIndex() {
    fetch('/index.json')
      .then(response => response.json())
      .then(data => {
        this.searchData = data;
        this.initFuse();
      })
      .catch(error => console.error('Error loading search index:', error));
  }
  
  /**
   * 初始化 Fuse.js
   */
  initFuse() {
    const options = {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'content', weight: 0.5 },
        { name: 'tags', weight: 0.3 },
        { name: 'description', weight: 0.3 }
      ],
      threshold: 0.3,
      ignoreLocation: true,
      includeMatches: true,
      includeScore: true
    };
    
    this.fuse = new Fuse(this.searchData, options);
  }
  
  /**
   * 綁定事件
   */
  bindEvents() {
    // 輸入搜尋關鍵字
    this.searchInput.addEventListener('input', this.debounce(() => {
      const query = this.searchInput.value.trim();
      
      if (query.length >= this.minChars) {
        this.searchInput.classList.add(this.loadingClass);
        this.performSearch(query);
      } else {
        this.clearResults();
      }
    }, 300));
    
    // 提交搜尋表單
    if (this.searchForm) {
      this.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = this.searchInput.value.trim();
        
        if (query.length >= this.minChars) {
          // 如果是側邊欄搜尋，則跳轉到列表頁
          if (this.searchForm.dataset.type === 'sidebar') {
            const section = this.currentSection || 'articles';
            window.location.href = `/${section}/?search=${encodeURIComponent(query)}`;
          } else {
            this.performSearch(query);
          }
        }
      });
    }
    
    // 點擊其他區域關閉搜尋結果
    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
        this.clearResults();
      }
    });
    
    // 鍵盤導航
    document.addEventListener('keydown', (e) => {
      if (!this.searchResults.classList.contains(this.activeClass)) return;
      
      const items = this.searchResults.querySelectorAll('li');
      const activeItem = this.searchResults.querySelector('li.is-active');
      const activeIndex = activeItem ? Array.from(items).indexOf(activeItem) : -1;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (activeIndex < items.length - 1) {
            if (activeItem) activeItem.classList.remove('is-active');
            items[activeIndex + 1].classList.add('is-active');
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (activeIndex > 0) {
            if (activeItem) activeItem.classList.remove('is-active');
            items[activeIndex - 1].classList.add('is-active');
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (activeItem) {
            const link = activeItem.querySelector('a');
            if (link) window.location.href = link.href;
          }
          break;
        case 'Escape':
          e.preventDefault();
          this.clearResults();
          break;
      }
    });
    
    // 檢查URL參數中是否有搜尋關鍵字
    this.checkUrlParams();
  }
  
  /**
   * 執行搜尋
   * @param {string} query - 搜尋關鍵字
   */
  performSearch(query) {
    if (!this.fuse || !query) return;
    
    // 如果有指定當前區域，只搜尋該區域的內容
    let results = this.fuse.search(query);
    
    if (this.currentSection) {
      results = results.filter(result => result.item.section === this.currentSection);
    }
    
    // 限制結果數量
    results = results.slice(0, this.maxResults);
    
    this.displayResults(results, query);
    this.searchInput.classList.remove(this.loadingClass);
  }
  
  /**
   * 顯示搜尋結果
   * @param {Array} results - 搜尋結果
   * @param {string} query - 搜尋關鍵字
   */
  displayResults(results, query) {
    if (!results.length) {
      this.searchResults.innerHTML = `<li class="search-result-empty">找不到符合「${query}」的結果</li>`;
      this.searchResults.classList.add(this.activeClass);
      return;
    }
    
    const sectionNames = {
      'articles': '知識文章',
      'videos': '影音專區',
      'faq': '常見問題',
      'downloads': '下載專區'
    };
    
    const html = results.map(result => {
      const item = result.item;
      const sectionName = sectionNames[item.section] || item.section;
      
      // 高亮關鍵字
      let description = item.description;
      const regex = new RegExp(`(${query})`, 'gi');
      description = description.replace(regex, '<mark>$1</mark>');
      
      return this.itemTemplate
        .replace('{{uri}}', item.uri)
        .replace('{{title}}', item.title)
        .replace('{{sectionName}}', sectionName)
        .replace('{{description}}', this.truncateText(description, 100));
    }).join('');
    
    this.searchResults.innerHTML = html;
    this.searchResults.classList.add(this.activeClass);
  }
  
  /**
   * 清除搜尋結果
   */
  clearResults() {
    this.searchResults.innerHTML = '';
    this.searchResults.classList.remove(this.activeClass);
  }
  
  /**
   * 檢查URL參數中是否有搜尋關鍵字
   */
  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery && this.searchInput) {
      this.searchInput.value = searchQuery;
      this.performSearch(searchQuery);
    }
  }
  
  /**
   * 截斷文字
   * @param {string} text - 原始文字
   * @param {number} length - 截斷長度
   * @returns {string} - 截斷後的文字
   */
  truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
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

// 當文檔載入完成後初始化搜尋功能
document.addEventListener('DOMContentLoaded', () => {
  // 載入 Fuse.js
  const fuseScript = document.createElement('script');
  fuseScript.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js';
  fuseScript.onload = () => new SearchManager();
  document.head.appendChild(fuseScript);
});