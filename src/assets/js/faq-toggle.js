document.addEventListener('DOMContentLoaded', () => {
  // --- 處理直達特定問答的連結 ---
  const handleHashChange = () => {
    const hash = window.location.hash;
    if (hash) {
      // 先關閉所有 <details>
      document.querySelectorAll('details').forEach(details => {
        details.open = false;
      });
      
      // 打開對應 hash 的 <details>
      const targetDetails = document.querySelector(hash);
      if (targetDetails && targetDetails.tagName === 'DETAILS') {
        targetDetails.open = true;
        // 平滑滾動到該元素
        targetDetails.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // 頁面載入時檢查一次
  handleHashChange();

  // --- 處理分享按鈕點擊事件 ---
  const shareButtons = document.querySelectorAll('.share-faq-btn');
  shareButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      
      const faqId = button.dataset.id;
      const questionText = button.dataset.question;
      
      // 組合包含 hash 的當前頁面網址
      const itemUrl = `${window.location.origin}${window.location.pathname}#${faqId}`;
      
      // 組合 Line 的分享網址
      const shareText = `我想與你分享這個問題：「${questionText}」`;
      const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(itemUrl)}&text=${encodeURIComponent(shareText)}`;
      
      // 在新分頁中開啟分享網址
      window.open(lineShareUrl, '_blank', 'noopener,noreferrer');
    });
  });
});