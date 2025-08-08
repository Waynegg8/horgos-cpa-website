// In-view tilt-to-straight animation for team photos on About page
// Adds 'inview' class when <img> elements within '.team-member__image' enter viewport

const setupInviewTilt = () => {
  const section = document.querySelector('.about-page');
  if (!section) return;

  const images = section.querySelectorAll('.team-member__image img');
  if (!images.length) return;

  const onIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(onIntersect, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.2,
  });

  images.forEach((img) => observer.observe(img));
};

// Only run on About pages
if (document.body?.dataset?.section === 'about') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupInviewTilt);
  } else {
    setupInviewTilt();
  }
}

