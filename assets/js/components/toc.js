// 生成與控制單篇文章 TOC，達到：
// - 滾到 TOC 區時才吸附（CSS sticky 已處理）
// - TOC 固定在側邊欄上方；直到文章結束，下面標籤雲才可出現
// - 自動掃描文章標題生成索引

// 移除舊的初始化邏輯，避免與下方 initTableOfContents 重複生成 TOC

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
  // 僅從內容中抓取（排除文章首個大標題 h1）
  const headings = article.querySelectorAll('h2, h3, h4');
  if (headings.length === 0) {
    tocContainer.style.display = 'none';
    return;
  }
  
  // 創建目錄（支援巢狀結構）
  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';
  
  // 標題層級映射（起點為 h2）
  const levelMap = {
    'H2': 1,
    'H3': 2,
    'H4': 3
  };
  
  // 使用堆疊構建巢狀 UL 結構
  const stack = [{ level: 0, ul: tocList }];
  
  headings.forEach((heading, index) => {
    // 確保每個標題有 id
    if (!heading.id) heading.id = `heading-${index}`;
    const level = levelMap[heading.tagName];
    
    // 回到對應層級
    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    
    // 目前層級的父 UL
    const parent = stack[stack.length - 1];
    const li = document.createElement('li');
    li.className = `toc-item toc-level-${level}`;
    li.dataset.target = heading.id;
    
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.className = 'toc-link';
    li.appendChild(link);
    
    // 預建子清單（初始收合）
    const sub = document.createElement('ul');
    sub.className = 'toc-sublist';
    li.appendChild(sub);
    
    parent.ul.appendChild(li);
    // 將子層壓入堆疊
    stack.push({ level, ul: sub });
    
    // 點擊滾動
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // 與側邊欄 sticky 對齊（依 _layout.scss top: $spacing-4）
        const offset = 24; // 約等於 $spacing-4
        window.scrollTo({ top: targetElement.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });
  
  // 清空容器，避免重複
  tocContainer.innerHTML = '';
  // 包一層 sidebar widget，並置入標題（避免標題重複）
  const widget = document.createElement('div');
  widget.className = 'sidebar-widget toc-widget';
  const title = document.createElement('h3');
  title.className = 'sidebar-widget__title toc-title';
  title.textContent = '文章目錄';
  widget.appendChild(title);
  widget.appendChild(tocList);
  tocContainer.appendChild(widget);
  
  // 置頂與自動收合
  setupAutoCollapseTOC();
  
  // 設置目錄項高亮
  setupTOCHighlight();
  // 初始化展開第一個章節
  const first = tocContainer.querySelector('.toc-item');
  if (first) first.classList.add('expanded');

  // 讓 TOC 到文章結尾才釋放，避免覆蓋標籤雲
  setupTOCStickyBoundary();
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
  
  // 滾動時自動展開目前章節、收起其他章節
  window.addEventListener('scroll', () => {
    const active = document.querySelector('.toc-link.active');
    if (!active) return;
    const activeItem = active.closest('.toc-item');
    if (!activeItem) return;
    // 先移除所有展開
    tocContainer.querySelectorAll('.toc-item.expanded').forEach(el => el.classList.remove('expanded'));
    // 由內而外展開父鏈
    let node = activeItem;
    while (node && node.classList && node.classList.contains('toc-item')) {
      node.classList.add('expanded');
      node = node.parentElement.closest('.toc-item');
    }
  });
}

/**
 * 讓 TOC 的 sticky 僅在文章範圍內作用，文章結尾即釋放，讓下方標籤雲上移顯示
 */
function setupTOCStickyBoundary() {
  const toc = document.querySelector('.toc-container');
  const article = document.querySelector('.article-content');
  if (!toc || !article) return;

  const offsetTop = parseInt(getComputedStyle(toc).top || '72', 10) || 72;
  const onScroll = () => {
    const articleRect = article.getBoundingClientRect();
    const tocRect = toc.getBoundingClientRect();
    // 當文章底部已與視窗上緣距離小於 TOC 高度 + top，代表 TOC 應該釋放
    const shouldRelease = articleRect.bottom - (tocRect.height + offsetTop) <= 0;
    toc.style.position = shouldRelease ? 'static' : 'sticky';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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
    const stickyOffset = 80; // 與 CSS top 對應
    const scrollPosition = window.scrollY + stickyOffset;
    
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
    tocLinks.forEach(link => link.classList.remove('active'));
    
    // 添加活動狀態到當前標題對應的目錄項
    if (currentHeading) {
      const activeLink = document.querySelector(`.toc-link[href="#${currentHeading.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        // 同步展開/收合
        const activeItem = activeLink.closest('.toc-item');
        const tocContainer = document.getElementById('toc-container');
        if (activeItem && tocContainer) {
          tocContainer.querySelectorAll('.toc-item.expanded').forEach(el => el.classList.remove('expanded'));
          let node = activeItem;
          while (node && node.classList && node.classList.contains('toc-item')) {
            node.classList.add('expanded');
            node = node.parentElement.closest('.toc-item');
          }
        }
      }
    }
  });
}