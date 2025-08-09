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

    // 初始隱藏按鈕（避免載入瞬間閃爍）
    backToTopButton.style.display = 'none';

    // 監聽滾動事件：顯示/隱藏
    window.addEventListener('scroll', function() {
        const y = window.pageYOffset || document.documentElement.scrollTop;
        const show = y > 300;
        backToTopButton.style.display = show ? 'flex' : 'none';
        backToTopButton.classList.toggle('visible', show);
    }, { passive: true });

    // 點擊事件 - 回到頂端
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'auto' });
    });

    // 鍵盤無障礙支援
    backToTopButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    });
}

/**
 * 初始化社群媒體按鈕
 */
function initSocialButtons() {
    // 由 CSS 控制展開/收合（hover/focus-within）；行動裝置預設常駐顯示
    // 此處保留函式以維持匯入結構
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