/**
 * 影片功能相關腳本
 */

// 當DOM加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
  // 影片搜尋功能
  initVideoSearch();
  
  // 時間戳連結功能
  initTimestampLinks();
  
  // 影片延遲載入
  initLazyVideoLoading();
});

/**
 * 初始化影片搜尋功能
 */
function initVideoSearch() {
  const searchInput = document.getElementById('video-search');
  if (!searchInput) return;
  
  const searchResults = document.getElementById('search-results');
  const videosList = document.querySelector('.videos-list');
  
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    
    if (query.length < 2) {
      searchResults.style.display = 'none';
      videosList.style.display = 'block';
      return;
    }
    
    // 這裡將來整合 Fuse.js 搜尋
    // 目前先實現簡單的前端篩選
    const videos = document.querySelectorAll('.video-card');
    let results = [];
    
    videos.forEach(video => {
      const title = video.querySelector('.video-title').textContent.toLowerCase();
      const description = video.querySelector('.video-description').textContent.toLowerCase();
      
      if (title.includes(query) || description.includes(query)) {
        results.push(video.cloneNode(true));
      }
    });
    
    if (results.length > 0) {
      searchResults.innerHTML = '';
      results.forEach(result => {
        searchResults.appendChild(result);
      });
      searchResults.style.display = 'block';
      videosList.style.display = 'none';
    } else {
      searchResults.innerHTML = '<div class="no-results">沒有找到相關影片</div>';
      searchResults.style.display = 'block';
      videosList.style.display = 'none';
    }
  });
}

/**
 * 初始化時間戳連結功能
 * 將文章中的時間戳格式 (00:00) 轉換為可點擊的連結
 */
function initTimestampLinks() {
  const videoDescriptionContent = document.querySelector('.video-description-content');
  if (!videoDescriptionContent) return;
  
  // 獲取當前頁面的YouTube或Vimeo ID
  const youtubeFrame = document.querySelector('iframe[src*="youtube.com"]');
  const vimeoFrame = document.querySelector('iframe[src*="vimeo.com"]');
  
  if (!youtubeFrame && !vimeoFrame) return;
  
  // 時間戳正則表達式
  const timestampRegex = /(\d{1,2}):(\d{2})/g;
  
  // 處理所有段落和列表項
  const textElements = videoDescriptionContent.querySelectorAll('p, li');
  
  textElements.forEach(element => {
    const html = element.innerHTML;
    
    // 替換時間戳為可點擊連結
    const newHtml = html.replace(timestampRegex, function(match, minutes, seconds) {
      const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
      
      if (youtubeFrame) {
        return `<a href="javascript:void(0)" class="timestamp-link" data-time="${totalSeconds}">${match}</a>`;
      } else if (vimeoFrame) {
        return `<a href="javascript:void(0)" class="timestamp-link" data-time="${totalSeconds}">${match}</a>`;
      }
      
      return match;
    });
    
    element.innerHTML = newHtml;
  });
  
  // 添加時間戳點擊事件
  const timestampLinks = document.querySelectorAll('.timestamp-link');
  
  timestampLinks.forEach(link => {
    link.addEventListener('click', function() {
      const time = this.getAttribute('data-time');
      
      if (youtubeFrame) {
        youtubeFrame.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [time, true]
        }), '*');
      } else if (vimeoFrame) {
        vimeoFrame.contentWindow.postMessage({
          method: 'seekTo',
          value: time
        }, '*');
      }
    });
  });
}

/**
 * 初始化影片延遲載入
 */
function initLazyVideoLoading() {
  // 使用 Intersection Observer API 實現延遲載入
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const iframe = container.querySelector('iframe');
          
          if (iframe && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
          }
          
          videoObserver.unobserve(container);
        }
      });
    });
    
    // 觀察所有影片容器
    const videoContainers = document.querySelectorAll('.video-player-container');
    videoContainers.forEach(container => {
      videoObserver.observe(container);
    });
  }
}