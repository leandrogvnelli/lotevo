/* Only presentation: a short brand transition before the HTML profile links. */
(() => {
  'use strict';
  const root = document.documentElement;
  const overlay = document.querySelector('.entry-loader');
  const title = document.getElementById('entry-title');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!overlay) return;
  let finished = false;
  let exitTimer;
  const finish = (immediate = false, moveFocus = true) => {
    if (finished) {
      if (immediate) {
        root.classList.remove('entry-loading', 'entry-finishing');
        overlay.hidden = true;
      }
      return;
    }
    finished = true;
    clearTimeout(window.entrySafetyTimer);
    clearTimeout(exitTimer);
    root.classList.add('entry-finishing');
    document.body.classList.add('entry-arrived');
    const release = () => {
      root.classList.remove('entry-loading', 'entry-finishing');
      overlay.hidden = true;
      if (moveFocus && title) title.focus({ preventScroll: true });
    };
    if (immediate || reduced.matches) release();
    else setTimeout(release, 400);
  };
  overlay.querySelector('.loader-skip').addEventListener('click', () => finish(true));
  // At most 1.6 seconds; do not wait for an image or invent a network progress value.
  if (reduced.matches) finish(true, false);
  else exitTimer = setTimeout(() => finish(), 1600);
  reduced.addEventListener('change', event => { if (event.matches) finish(true, false); });
  // The browser's Back button must never restore a blocking loader.
  window.addEventListener('pageshow', event => { if (event.persisted) finish(true, false); });
})();
