/**
 * 營業狀態處理腳本
 * 異步獲取並更新網站的營業狀態
 */
document.addEventListener('DOMContentLoaded', function() {
  const statusElements = document.querySelectorAll('.business-status-text');
  const indicatorElements = document.querySelectorAll('.business-status-indicator');

  if (statusElements.length === 0) {
    return;
  }

  function updateStatus(statusData) {
    statusElements.forEach(el => {
      el.textContent = statusData.message || '無法取得狀態';
    });

    indicatorElements.forEach(el => {
      el.classList.remove('status-open', 'status-closed', 'status-loading');
      if (statusData.status === 'open') {
        el.classList.add('status-open');
      } else {
        el.classList.add('status-closed');
      }
    });
  }

  function fetchBusinessStatus() {
    fetch('/api/business-status')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        updateStatus(data);
      })
      .catch(error => {
        console.error('獲取營業狀態失敗:', error);
        updateStatus({ status: 'closed', message: '無法取得狀態' });
      });
  }

  // 立即獲取一次狀態
  fetchBusinessStatus();

  // 每分鐘更新一次
  setInterval(fetchBusinessStatus, 60000);
});
