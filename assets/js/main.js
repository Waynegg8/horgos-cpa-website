/**
 * 主要JavaScript文件
 */

// 導入載入狀態系統
import loadingSystem from './components/loading.js';
// 導入鍵盤導航功能
import keyboardNavigation from './components/keyboard-nav.js';

document.addEventListener('DOMContentLoaded', function() {
    // 初始化載入狀態系統
    loadingSystem.init();
    
    // 初始化鍵盤導航功能
    keyboardNavigation.init();
    
    // 初始化導航選單
    initNavigation();
    
    // 初始化輪播（首頁才會載入對應元件，此處跳過以減少執行成本）
    // initCarousel();
    
    // 初始化Cookie同意條款
    initCookieConsent();
    
    // 更新頁腳年份
    updateFooterYear();

    // 捲動揭示效果（Stripe 風格微互動）
    initReveal();
});

/**
 * 初始化導航選單
 */
function initNavigation() {
    // 行動版導航開關
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav__close');
    const mobileNavOverlay = document.querySelector('.mobile-nav__overlay');
    const dropdownToggles = document.querySelectorAll('.mobile-nav__dropdown-toggle');
    
    if (!mobileNavToggle || !mobileNav) return;
    
    // 開啟行動版導航
    mobileNavToggle.addEventListener('click', function() {
        mobileNav.classList.add('active');
        mobileNavToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // 關閉行動版導航
    function closeMobileNav() {
        mobileNav.classList.remove('active');
        mobileNavToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileNav);
    }
    
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileNav);
    }
    
    // 行動版下拉選單
    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const dropdown = this.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // 桌面版下拉選單延遲
    const desktopDropdowns = document.querySelectorAll('.desktop-nav .has-dropdown');
    let dropdownTimeout;
    
    desktopDropdowns.forEach(function(item) {
        const link = item.querySelector('.main-nav__link');
        const dropdown = item.querySelector('.dropdown-menu');
        
        if (!link || !dropdown) return;
        
        item.addEventListener('mouseenter', function() {
            clearTimeout(dropdownTimeout);
            dropdownTimeout = setTimeout(function() {
                dropdown.style.opacity = '1';
                dropdown.style.visibility = 'visible';
                dropdown.style.transform = 'translateY(0)';
            }, 300);
        });
        
        item.addEventListener('mouseleave', function() {
            clearTimeout(dropdownTimeout);
            dropdown.style.opacity = '';
            dropdown.style.visibility = '';
            dropdown.style.transform = '';
        });
    });
}

/**
 * 初始化輪播
 */
function initCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.hero-carousel__slide');
    const prevBtn = carousel.querySelector('.hero-carousel__control--prev');
    const nextBtn = carousel.querySelector('.hero-carousel__control--next');
    const indicators = carousel.querySelectorAll('.hero-carousel__indicator');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let autoplayInterval;
    
    // 顯示指定幻燈片
    function showSlide(index) {
        // 清除所有活動狀態
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // 設置當前幻燈片
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        
        // 更新指示器
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }
    
    // 下一張幻燈片
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // 上一張幻燈片
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // 設置自動播放
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    // 停止自動播放
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // 綁定按鈕事件
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            startAutoplay(); // 重置自動播放計時器
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            startAutoplay(); // 重置自動播放計時器
        });
    }
    
    // 綁定指示器事件
    indicators.forEach(function(indicator, index) {
        indicator.addEventListener('click', function() {
            showSlide(index);
            startAutoplay(); // 重置自動播放計時器
        });
    });
    
    // 滑鼠懸停時暫停自動播放
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // 觸控事件
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // 向左滑動
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // 向右滑動
        }
    }
    
    // 初始化
    showSlide(0);
    startAutoplay();
}

/**
 * 初始化Cookie同意條款
 */
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('cookie-accept');
    
    if (!cookieConsent || !acceptBtn) return;
    
    // 檢查Cookie是否已接受
    if (!localStorage.getItem('cookieConsent')) {
        // 顯示Cookie同意條款
        setTimeout(function() {
            cookieConsent.classList.add('show');
        }, 1000);
    }
    
    // 接受Cookie
    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'true');
        cookieConsent.classList.remove('show');
    });
}

/**
 * 更新頁腳年份
 */
function updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * 滾動揭示動畫：對 .card-style、.btn、.sidebar-widget、.stat、.testimonial 等元素
 */
function initReveal() {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return;

    const targets = document.querySelectorAll('.card-style, .btn, .sidebar-widget, .stat, .testimonial, .service-card, .download-item, .faq-item');
    if (!targets.length) return;

    targets.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--in');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    targets.forEach(el => io.observe(el));
}