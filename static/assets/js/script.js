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
