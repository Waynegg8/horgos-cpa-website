// Delay GA load until user interaction or after first paint to improve PSI
document.addEventListener('DOMContentLoaded', () => {
  const gaId = document.body?.dataset?.gaId;
  if (!gaId) return;

  const loadGA = () => {
    if (window.__gaLoaded) return;
    // 僅在使用者同意 Cookie 時載入 GA，避免在 PSI 中引入額外第三方請求
    let consentOk = false;
    try {
      consentOk = !!localStorage.getItem('cookieConsent');
    } catch (_) {}
    if (!consentOk) {
      // 後備：檢查第一方 Cookie
      try {
        consentOk = document.cookie.includes('cookieConsent=true');
      } catch (_) {}
    }
    if (!consentOk) return;
    window.__gaLoaded = true;
    const s = document.createElement('script');
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    s.async = true;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaId, { anonymize_ip: true });
  };

  // Load after first user interaction or 2s timeout
  ['pointerdown','keydown','scroll'].forEach(evt => document.addEventListener(evt, loadGA, { once: true, passive: true }));
  setTimeout(loadGA, 2000);
});

