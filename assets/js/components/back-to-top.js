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

    // 監聽滾動事件：顯示/隱藏 & 自動收合社群列
    const socialMenu = document.querySelector('.social-buttons__menu');
    window.addEventListener('scroll', function() {
        const y = window.pageYOffset || document.documentElement.scrollTop;
        const show = y > 300;
        backToTopButton.style.display = show ? 'flex' : 'none';
        backToTopButton.classList.toggle('visible', show);
        if (socialMenu) {
            // 超過 300px 僅顯示第一顆（靠右對齊），其餘自動收合
            socialMenu.style.opacity = show ? '1' : '0';
            socialMenu.style.visibility = show ? 'visible' : 'hidden';
        }
    }, { passive: true });

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