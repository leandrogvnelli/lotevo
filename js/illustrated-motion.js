/* Reveal once on entry, then disconnect. No per-scroll geometry work. */
(() => {
  const scenes = document.querySelectorAll('[data-scroll-scene]');
  if (!scenes.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    scenes.forEach(scene => scene.style.setProperty('--scene-progress', 1));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.style.setProperty('--scene-progress', 1);
      observer.unobserve(entry.target);
    }
  }, { threshold: .15 });
  scenes.forEach(scene => { scene.style.setProperty('--scene-progress', 0); observer.observe(scene); });
})();
