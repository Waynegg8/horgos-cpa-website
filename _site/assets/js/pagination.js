document.addEventListener('DOMContentLoaded', () => {
  const paginationButtons = document.querySelectorAll('.pagination-button');
  paginationButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      if (!button.disabled) {
        window.location.href = button.getAttribute('href');
      }
    });
  });
});
