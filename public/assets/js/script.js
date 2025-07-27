// 霍爾果斯會計師事務所網站 – 前端互動腳本
// 此檔案包含導覽列切換、回到頂端按鈕等簡易互動功能。

document.addEventListener('DOMContentLoaded', () => {
  // 漢堡選單切換
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navbar-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // 回到頂端按鈕顯示與隱藏
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 列表頁即時搜尋功能
  const listSearchInputs = document.querySelectorAll('.list-search');
  listSearchInputs.forEach((input) => {
    input.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();
      const section = this.closest('.list-section');
      if (!section) return;
      // 對應卡片容器
      const cards = section.querySelectorAll('.list-card');
      cards.forEach((card) => {
        const text = card.innerText.toLowerCase();
        if (text.indexOf(query) >= 0) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Hero 輪播功能
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.querySelector('.slider-controls .prev');
  const nextBtn = document.querySelector('.slider-controls .next');
  let currentSlide = 0;
  function showSlide(n) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === n);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === n);
    });
    currentSlide = n;
  }
  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }
  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
    });
  }
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });
  // 自動輪播
  if (slides.length > 1) {
    setInterval(() => {
      nextSlide();
    }, 5000);
  }

  // FAQ 搜尋功能：篩選常見問題卡片
  const faqInput = document.querySelector('.faq-search');
  if (faqInput) {
    faqInput.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach((item) => {
        const text = item.innerText.toLowerCase();
        if (text.indexOf(query) >= 0) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 更新營業狀態：根據台北時區判斷是否開放
  const statusElem = document.getElementById('business-status');
  if (statusElem) {
    function updateStatus() {
      const now = new Date();
      const taipeiDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
      const day = taipeiDate.getDay(); // 0 = Sunday
      const hours = taipeiDate.getHours();
      const minutes = taipeiDate.getMinutes();
      const timeVal = hours + minutes / 60;
      let open = false;
      // 營業時間：週一至週五 08:30–12:30 、13:30–17:30
      if (day >= 1 && day <= 5) {
        if ((timeVal >= 8.5 && timeVal < 12.5) || (timeVal >= 13.5 && timeVal < 17.5)) {
          open = true;
        }
      }
      statusElem.textContent = open ? '營業中' : '休息中';
    }
    updateStatus();
    setInterval(updateStatus, 60000);
  }

  /**
   * 浮動社交按鈕顯示/隱藏邏輯
   * 在回頂按鈕與社交按鈕區域上移入/移出時，切換 .show 類別
   */
  const socialFloat = document.querySelector('.social-float');
  if (backToTopBtn && socialFloat) {
    const showFloat = () => socialFloat.classList.add('show');
    const hideFloat = () => socialFloat.classList.remove('show');
    backToTopBtn.addEventListener('mouseenter', showFloat);
    backToTopBtn.addEventListener('mouseleave', hideFloat);
    socialFloat.addEventListener('mouseenter', showFloat);
    socialFloat.addEventListener('mouseleave', hideFloat);
  }

  /**
   * 列表頁搜尋與分類篩選功能
   * 支援在文章、常見問題、影音與下載列表中過濾內容
   */
  const listSearchEl = document.querySelector('#list-search');
  const categoryTags = document.querySelectorAll('.category-tag');
  const postCards = document.querySelectorAll('.post-card');
  let activeCategory = '全部';

  function filterPosts() {
    const query = listSearchEl ? listSearchEl.value.trim().toLowerCase() : '';
    postCards.forEach((card) => {
      const titleEl = card.querySelector('h2');
      const title = titleEl ? titleEl.textContent.toLowerCase() : '';
      const categories = card.dataset.categories ? card.dataset.categories.toLowerCase() : '';
      const series = card.dataset.series ? card.dataset.series.toLowerCase() : '';
      const matchQuery = query === '' || title.includes(query);
      const matchCategory = activeCategory === '全部' || categories.includes(activeCategory.toLowerCase()) || series.includes(activeCategory.toLowerCase());
      if (matchQuery && matchCategory) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
  if (listSearchEl) {
    listSearchEl.addEventListener('input', filterPosts);
  }
  categoryTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      categoryTags.forEach((t) => t.classList.remove('active'));
      tag.classList.add('active');
      activeCategory = tag.dataset.category;
      filterPosts();
    });
  });

  // 如果 URL 中帶有 series 參數，則初始化篩選條件
  const urlParams = new URLSearchParams(window.location.search);
  const seriesParam = urlParams.get('series');
  if (seriesParam) {
    activeCategory = seriesParam;
    // 找出對應的標籤並設為 active
    categoryTags.forEach((t) => {
      if (t.dataset.category === seriesParam) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    // 執行篩選
    filterPosts();
  }

  // 若 URL 帶有 tag 參數，作為搜尋字串預先填入
  const tagParam = urlParams.get('tag');
  if (tagParam && listSearchEl) {
    listSearchEl.value = tagParam;
    filterPosts();
  }

  // 初始化預約頁驗證碼功能
  const captchaQuestion = document.getElementById('captcha-question');
  if (captchaQuestion) {
    let captchaAnswer = 0;
    function generateCaptcha() {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      captchaAnswer = a + b;
      captchaQuestion.textContent = `${a} + ${b} = ?`;
    }
    generateCaptcha();
    window.validateCaptcha = function (event) {
      const input = document.getElementById('captcha');
      if (!input) return true;
      const userAnswer = parseInt(input.value, 10);
      if (userAnswer !== captchaAnswer) {
        alert('驗證碼錯誤，請重新輸入');
        generateCaptcha();
        event.preventDefault();
        return false;
      }
      return true;
    };
  }
});

// --------------------------------------------------------------------
// 新增互動：滾動載入動畫、表單提交載入狀態與頂部進度條
// 為保持 Hugo 模板不變，直接在主腳本中註冊新的 DOMContentLoaded 監聽
document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  const animateElements = document.querySelectorAll('.service-card, .post-card, .contact-card, .team-member');
  animateElements.forEach((el, index) => {
    el.classList.add(`stagger-${(index % 4) + 1}`);
    observer.observe(el);
  });

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
  if (document.readyState === 'loading') {
    showProgress();
  }
});
