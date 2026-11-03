/* Decorative motion only. No navigation, inventory or profile logic. */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const art = document.querySelectorAll('[data-touch-art]');
  const reset = element => {
    element.style.setProperty('--art-x', '0px');
    element.style.setProperty('--art-y', '0px');
    element.style.setProperty('--art-turn', '0deg');
  };
  art.forEach(element => {
    const isPhoto = element.classList.contains('food-scene') || element.classList.contains('sustain-art') || element.classList.contains('shelf-art');
    let frame = 0;
    let lastPoint;
    let lastTap = -Infinity;
    if (isPhoto) {
      element.addEventListener('pointermove', event => {
        if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
        lastPoint = { x: event.clientX, y: event.clientY };
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (!lastPoint || reduced.matches) return;
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const x = Math.max(-.5, Math.min(.5, (lastPoint.x - rect.left) / rect.width - .5));
          const y = Math.max(-.5, Math.min(.5, (lastPoint.y - rect.top) / rect.height - .5));
          element.style.setProperty('--art-x', `${x * 12}px`);
          element.style.setProperty('--art-y', `${y * 8}px`);
          element.style.setProperty('--art-turn', `${x * .8}deg`);
        });
      }, { passive: true });
      element.addEventListener('pointerleave', () => {
        lastPoint = null;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        reset(element);
      });
    }
    // Draw one short ink-like mark at the contact point. Native clicks and scrolling remain intact.
    element.addEventListener('pointerdown', event => {
      if (reduced.matches || event.button > 0 || !event.isPrimary) return;
      const now = performance.now();
      if (now - lastTap < 180) return;
      lastTap = now;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ns = 'http://www.w3.org/2000/svg';
      const mark = document.createElementNS(ns, 'svg');
      mark.setAttribute('viewBox', '0 0 100 100');
      mark.setAttribute('class', 'touch-mark');
      mark.setAttribute('aria-hidden', 'true');
      mark.setAttribute('focusable', 'false');
      mark.setAttribute('fill', 'none');
      mark.setAttribute('stroke', 'currentColor');
      mark.setAttribute('stroke-width', '2');
      mark.setAttribute('stroke-linecap', 'round');
      // Account for CSS scale so the ink starts at the actual point of contact.
      const scaleX = element.offsetWidth / rect.width;
      const scaleY = element.offsetHeight / rect.height;
      mark.style.left = `${(event.clientX - rect.left) * scaleX}px`;
      mark.style.top = `${(event.clientY - rect.top) * scaleY}px`;
      const circle = document.createElementNS(ns, 'path');
      circle.setAttribute('class', 'touch-circle');
      circle.setAttribute('pathLength', '100');
      circle.setAttribute('d', 'M76 34C61 12 31 21 24 41S34 81 55 78s35-23 23-39');
      const rays = document.createElementNS(ns, 'path');
      rays.setAttribute('class', 'touch-rays');
      rays.setAttribute('d', 'M49 4v9M83 14l-7 9M96 49l-10 2M82 84l-7-7M47 96l1-10M13 82l9-7M4 45l10 1M16 14l8 8');
      mark.append(circle, rays);
      // Limit decorative nodes even during repeated touch input.
      element.querySelectorAll('.touch-mark').forEach(old => old.remove());
      element.append(mark);
      setTimeout(() => mark.remove(), 950);
    }, { passive: true });
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) art.forEach(element => {
      reset(element);
      element.querySelectorAll('.touch-mark').forEach(mark => mark.remove());
    });
  });
})();
