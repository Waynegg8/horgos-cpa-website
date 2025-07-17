document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('testimonial-container');
  if (!container) return;

  const slides = container.querySelectorAll('.testimonial-slide');
  const prevButton = document.getElementById('prev-testimonial');
  const nextButton = document.getElementById('next-testimonial');
  
  let currentIndex = 0;
  let intervalId = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function startAutoplay() {
    // 每 7 秒切換一次
    intervalId = setInterval(nextSlide, 7000);
  }

  function resetAutoplay() {
    clearInterval(intervalId);
    startAutoplay();
  }

  // 綁定按鈕事件
  if (nextButton && prevButton) {
    nextButton.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    prevButton.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  // 初始顯示
  if (slides.length > 0) {
    showSlide(currentIndex);
    startAutoplay();
  }
});