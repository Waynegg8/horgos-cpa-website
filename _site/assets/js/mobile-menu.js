document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('mobile-menu-icon');

  if (menuButton && mobileMenu && menuIcon) {
    menuButton.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuIcon.textContent = 'close'; // 將圖示從「選單」變為「關閉」
      } else {
        mobileMenu.classList.add('hidden');
        menuIcon.textContent = 'menu'; // 將圖示變回「選單」
      }
    });
  }
});