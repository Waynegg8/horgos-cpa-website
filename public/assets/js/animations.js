// 新增: 滾動觸發動畫與階梯式延遲
// 使用 Intersection Observer 監聽元素進入視窗時套用動畫類別
document.addEventListener('DOMContentLoaded', function() {
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
  // 觀察服務卡、文章卡、聯絡卡與團隊卡
  const animateElements = document.querySelectorAll('.service-card, .post-card, .contact-card, .team-member');
  animateElements.forEach((el, index) => {
    el.classList.add(`stagger-${(index % 4) + 1}`);
    observer.observe(el);
  });
});