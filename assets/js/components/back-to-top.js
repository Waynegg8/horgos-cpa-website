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
    const socialToggle = document.getElementById('social-toggle');
    const socialMenu = document.querySelector('.social-buttons__menu');
    
    if (!socialToggle || !socialMenu) return;

    let isOpen = false;

    // 切換社群媒體選單
    function toggleSocialMenu() {
        isOpen = !isOpen;
        
        socialToggle.classList.toggle('active', isOpen);
        socialMenu.classList.toggle('active', isOpen);
        socialToggle.setAttribute('aria-expanded', isOpen);
        socialMenu.setAttribute('aria-hidden', !isOpen);
    }

    // 點擊切換按鈕
    socialToggle.addEventListener('click', toggleSocialMenu);

    // 鍵盤支援
    socialToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSocialMenu();
        }
    });

    // 點擊外部關閉選單
    document.addEventListener('click', function(e) {
        if (!socialToggle.contains(e.target) && !socialMenu.contains(e.target)) {
            if (isOpen) {
                toggleSocialMenu();
            }
        }
    });

    // ESC鍵關閉選單
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            toggleSocialMenu();
            socialToggle.focus();
        }
    });
}

// 匯出為ES6模組
export default {
    init: initBackToTop
};