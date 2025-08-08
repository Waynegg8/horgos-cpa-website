// Ensure video area never stays as a blank/"loading" block
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.video-player-container');
  if (!containers.length) return;

  containers.forEach((container) => {
    const hasIframe = !!container.querySelector('iframe');
    const isPlaceholder = !!container.querySelector('.video-placeholder');
    if (hasIframe && !isPlaceholder) return;

    // Build graceful fallback
    const og = document.querySelector('meta[property="og:image"]');
    const imgSrc = (og && og.getAttribute('content')) || '/uploads/images/general/general-default.jpg';

    const fallback = document.createElement('div');
    fallback.className = 'video-fallback';
    fallback.innerHTML = `
      <div class="video-fallback__media">
        <img src="${imgSrc}" alt="video placeholder" loading="lazy" decoding="async" />
      </div>
      <div class="video-fallback__note">本頁目前以圖文說明呈現，影片將於近期上線。</div>
    `;
    container.innerHTML = '';
    container.appendChild(fallback);
  });
});

