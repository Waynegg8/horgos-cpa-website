/**
 * 目錄功能
 */

document.addEventListener('DOMContentLoaded', function() {
  initTableOfContents();
});

function initTableOfContents() {
  const tocContainer = document.getElementById('toc-container');
  if (!tocContainer) return;
  
  const article = document.querySelector('.article-content');
  if (!article) return;
  
  // 獲取所有標題
  const headings = article.querySelectorAll('h2, h3, h4');
  if (headings.length === 0) {
    tocContainer.style.display = 'none';
    return;
  }
  
  // 創建目錄
  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';
  
  // 標題層級映射
  const levelMap = {
    'H2': 1,
    'H3': 2,
    'H4': 3
  };
  
  // 為每個標題創建目錄項
  headings.forEach((heading, index) => {
    // 為標題添加ID，如果沒有的話
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
    
    const listItem = document.createElement('li');
    listItem.className = `toc-item toc-level-${levelMap[heading.tagName]}`;
    
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.className = 'toc-link';
    
    listItem.appendChild(link);
    tocList.appendChild(listItem);
    
    // 添加點擊事件，平滑滾動
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 添加目錄到容器
  tocContainer.appendChild(tocList);
  
  // 置頂與自動收合
  setupAutoCollapseTOC();
  
  // 設置目錄項高亮
  setupTOCHighlight();
}

function setupAutoCollapseTOC() {
  const tocContainer = document.getElementById('toc-container');
  if (!tocContainer) return;
  
  // 標題
  let tocTitle = tocContainer.querySelector('.toc-title');
  if (!tocTitle) {
    tocTitle = document.createElement('h3');
    tocTitle.className = 'toc-title';
    tocTitle.textContent = '文章目錄';
    tocContainer.insertBefore(tocTitle, tocContainer.firstChild);
  }
  
  const tocList = tocContainer.querySelector('.toc-list');
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toc-toggle';
  toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  tocTitle.appendChild(toggleBtn);
  
  let isCollapsed = false;
  
  // 點擊折疊
  toggleBtn.addEventListener('click', function() {
    isCollapsed = !isCollapsed;
    tocList.style.display = isCollapsed ? 'none' : 'block';
    toggleBtn.innerHTML = isCollapsed ? '<i class="fas fa-chevron-down"></i>' : '<i class="fas fa-chevron-up"></i>';
  });
  
  // 滾動時自動收起子層（僅保留當前區塊）
  window.addEventListener('scroll', () => {
    const active = document.querySelector('.toc-link.active');
    const items = document.querySelectorAll('.toc-item');
    if (!active) return;
    const activeItem = active.parentElement;
    items.forEach(item => {
      const isParentOrSelf = item === activeItem || item.contains(activeItem);
      // 僅顯示父層與自身，同層其他子項淡出
      item.style.opacity = isParentOrSelf ? '1' : '0.6';
    });
  });
}

function setupTOCHighlight() {
  const tocLinks = document.querySelectorAll('.toc-link');
  if (tocLinks.length === 0) return;
  
  // 獲取所有標題元素
  const headingElements = Array.from(document.querySelectorAll('h2, h3, h4')).filter(heading => {
    // 只包含有對應目錄項的標題
    return document.querySelector(`.toc-link[href="#${heading.id}"]`);
  });
  
  // 滾動事件處理
  window.addEventListener('scroll', function() {
    // 當前滾動位置
    const scrollPosition = window.scrollY + 150;
    
    // 找到當前可見的標題
    let currentHeading = null;
    
    for (let i = 0; i < headingElements.length; i++) {
      const heading = headingElements[i];
      const nextHeading = headingElements[i + 1];
      
      // 檢查是否在當前標題和下一個標題之間
      if (
        heading.offsetTop <= scrollPosition &&
        (!nextHeading || nextHeading.offsetTop > scrollPosition)
      ) {
        currentHeading = heading;
        break;
      }
    }
    
    // 如果沒有找到當前標題，並且滾動位置在第一個標題之前
    if (!currentHeading && headingElements.length > 0 && scrollPosition < headingElements[0].offsetTop) {
      currentHeading = headingElements[0];
    }
    
    // 移除所有活動狀態
    tocLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // 添加活動狀態到當前標題對應的目錄項
    if (currentHeading) {
      const activeLink = document.querySelector(`.toc-link[href="#${currentHeading.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}