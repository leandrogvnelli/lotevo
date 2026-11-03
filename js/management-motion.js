/* Motion only. Links are native hyperlinks and all content works without JS. */
(() => {
  'use strict';
  const page = document.querySelector('.management-page');
  if (!page) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!reduced.matches && 'IntersectionObserver' in window) {
    const rows = page.querySelectorAll('.lot-data-row, .product-data-row, .history-row, .urgency-panel a');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: .08, rootMargin: '0px 0px 60px 0px' });
    for (const row of rows) {
      row.classList.add('reveal-pending');
      observer.observe(row);
    }
    reduced.addEventListener('change', event => {
      if (!event.matches) return;
      observer.disconnect();
      rows.forEach(row => row.classList.remove('reveal-pending'));
    });
  }

  for (const link of page.querySelectorAll('a[href$=".html"], a[href*=".html#"]')) {
    link.addEventListener('click', event => {
      if (reduced.matches || event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.altKey || event.shiftKey ||
          link.target && link.target !== '_self') return;
      event.preventDefault();
      page.classList.add('is-leaving');
      window.setTimeout(() => { window.location.href = link.href; }, 180);
    });
  }
  window.addEventListener('pageshow', () => page.classList.remove('is-leaving'));
})();
