// src/assets/js/mobile-menu.js
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon'); // Assuming the icon inside the button has this ID

  if (mobileMenuButton && mobileMenu && menuIcon) {
    mobileMenuButton.addEventListener('click', () => {
      const isMenuOpen = mobileMenu.classList.contains('hidden');
      if (isMenuOpen) {
        mobileMenu.classList.remove('hidden');
        menuIcon.textContent = 'close'; // 改變圖標為關閉
        mobileMenuButton.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.classList.add('hidden');
        menuIcon.textContent = 'menu'; // 改變圖標為選單
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
});