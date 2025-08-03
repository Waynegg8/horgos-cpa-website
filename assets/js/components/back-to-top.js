/**
 * 回到頂端按鈕功能
 */

// 當DOM載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    initBackToTop();
});

/**
 * 初始化回到頂端按鈕
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    // 初始隱藏按鈕
    backToTopButton.style.display = 'none';

    // 監聽滾動事件
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'flex';
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.style.display = 'none';
            backToTopButton.classList.remove('visible');
        }
    });

    // 點擊事件 - 回到頂端
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 鍵盤無障礙支援
    backToTopButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// 匯出為ES6模組
export default {
    init: initBackToTop
};