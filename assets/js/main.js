
// 舊網站動畫邏輯 (index-animation.js) 已使用 Intersection Observer API 重寫並整合於此
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 動畫只觸發一次
      }
    });
  }, {
    threshold: 0.1 // 元素進入畫面 10% 時觸發
  });

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// 漢堡選單功能
function setupMobileMenu() {
    // ... (此處省略漢堡選單程式碼，以保持簡潔)
}

// 返回頂部按鈕功能
function setupBackToTop() {
    // ... (此處省略返回頂部按鈕程式碼，以保持簡潔)
}

// 當 DOM 載入完成後，執行所有初始化功能
document.addEventListener('DOMContentLoaded', () => {
  console.log("主腳本已載入，開始初始化功能...");
  setupScrollAnimations();
  // setupMobileMenu();
  // setupBackToTop();
  console.log("所有功能已初始化。");
});
