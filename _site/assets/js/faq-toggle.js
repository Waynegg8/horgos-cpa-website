document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  const toggleAllButton = document.getElementById('toggle-all');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      answer.classList.toggle('hidden');
    });
  });

  toggleAllButton.addEventListener('click', () => {
    const isHidden = faqItems[0].querySelector('.faq-answer').classList.contains('hidden');
    faqItems.forEach(item => {
      const answer = item.querySelector('.faq-answer');
      answer.classList.toggle('hidden', !isHidden);
    });
    toggleAllButton.textContent = isHidden ? '全部摺疊' : '全部展開';
  });
});
