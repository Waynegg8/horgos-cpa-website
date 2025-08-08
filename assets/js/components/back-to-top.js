/**
 * 浮動按鈕功能（回到頂端 + 社群媒體）
 */

// 當DOM載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    initBackToTop();
    initSocialButtons();
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

/**
 * 初始化社群媒體按鈕
 */
function initSocialButtons() {
    const socialMenu = document.querySelector('.social-buttons__menu');
    if (!socialMenu) return;
    // 改為常駐顯示，不再使用切換按鈕，避免誤觸造成位置漂移
    socialMenu.style.opacity = '1';
    socialMenu.style.visibility = 'visible';
    socialMenu.style.transform = 'translateY(0)';
}

/**
 * 添加呼吸律動效果
 */
function addPulseAnimation(element) {
    if (!element) return;
    
    // 添加呼吸律動效果的 CSS 類
    element.classList.add('pulse-animation');
}

// 匯出為ES6模組
export default {
    init: initBackToTop
};