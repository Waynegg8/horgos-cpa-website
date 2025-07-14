function trackClick(type, id) {
  gtag('event', 'click', {
    'event_category': type,
    'event_label': id,
    'value': 1
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-track]').forEach(element => {
    element.addEventListener('click', () => {
      const [type, id] = element.dataset.track.split(':');
      trackClick(type, id);
    });
  });
});
