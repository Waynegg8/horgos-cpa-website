// 新增: 表單提交載入狀態與頁面頂部進度條
// 當 DOM 解析完成後，為所有表單的送出按鈕添加載入中的樣式，並顯示頂部進度條
document.addEventListener('DOMContentLoaded', function() {
  // 表單提交載入狀態
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function() {
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('btn-loading');
        submitBtn.textContent = '送出中...';
      }
    });
  });
  // 頁面載入進度條
  function showProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);
    let width = 0;
    const interval = setInterval(() => {
      width += Math.random() * 15;
      if (width >= 90) {
        clearInterval(interval);
        width = 100;
      }
      progressBar.style.width = width + '%';
      if (width >= 100) {
        setTimeout(() => {
          progressBar.style.opacity = '0';
          setTimeout(() => progressBar.remove(), 300);
        }, 200);
      }
    }, 200);
  }
  // 如果網頁仍在載入中則顯示進度條
  if (document.readyState === 'loading') {
    showProgress();
  }
});