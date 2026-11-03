/* Presentation only: a single timed camera animation between two HTML pages. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 761px)');
  const story = document.querySelector('.scroll-story');
  const stage = story?.querySelector('.story-stage');
  const practice = document.body.classList.contains('practice-page');
  const duration = 1800;
  let busy = false;
  let overlay;
  let activeAnimations = [];
  let unlockTimer;
  const originalBodyClass = document.body.className;
  let quietUntil = performance.now() + 500;
  let wheelAmount = 0, lastWheel = 0;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const enabled = () => desktop.matches && !reduced.matches && !!Element.prototype.animate;
  const save = (key, value) => { try { sessionStorage.setItem(key, value); } catch (_) {} };
  try {
    const returned = Number(sessionStorage.getItem('lotevo-camera-return'));
    sessionStorage.removeItem('lotevo-camera-return');
    if (story && Date.now() - returned < 5000 && !location.hash) {
      document.body.classList.add('zoom-restored');
      scrollTo({ top: 0, behavior: 'instant' });
    }
  } catch (_) {}

  function prepareScene(scene) {
    let camera = scene.querySelector('.scene-camera');
    if (camera) return camera;
    camera = document.createElement('div');
    camera.className = 'scene-camera';
    const background = document.createElement('div');
    background.className = 'scene-backdrop';
    const tablet = scene.querySelector('.tablet-position');
    // Everything shares one camera; only the surroundings receive optical blur.
    for (const child of [...scene.children]) if (child !== tablet) background.append(child);
    camera.append(background, tablet);
    scene.append(camera);
    return camera;
  }
  function layout(scene) {
    const tablet = scene.querySelector('.tablet-position');
    const w = scene.clientWidth, h = scene.clientHeight;
    if (!desktop.matches) return;
    const tw = clamp(w * .26, 305, 430), th = clamp(h * .62, 445, 560);
    tablet.style.setProperty('--tablet-w', `${tw}px`);
    tablet.style.setProperty('--tablet-h', `${th}px`);
    tablet.style.setProperty('--tablet-x', `${w * .605}px`);
    tablet.style.setProperty('--tablet-y', `${Math.max(135, Math.min(h * .30, h - th - 40))}px`);
  }
  if (stage) { prepareScene(stage); layout(stage); }

  function cleanup() {
    clearTimeout(unlockTimer);
    activeAnimations.forEach(animation => animation.cancel());
    activeAnimations = [];
    overlay?.remove(); overlay = null;
    document.documentElement.classList.remove('camera-running');
    document.body.removeAttribute('aria-busy');
    if (practice) document.body.className = originalBodyClass;
    busy = false;
    quietUntil = performance.now() + 700;
    wheelAmount = 0;
  }
  function transition(reverse = false) {
    if (busy) return;
    const target = reverse ? 'index.html' : 'pratica.html';
    if (!enabled()) { location.assign(target); return; }
    const template = document.getElementById(reverse ? 'zoom-home-template' : 'zoom-page-template');
    if (!template) { location.assign(target); return; }
    busy = true;
    document.documentElement.classList.add('camera-running');
    document.body.setAttribute('aria-busy', 'true');
    overlay = document.createElement('div');
    overlay.className = reverse ? 'expressive-page zoom-return-scene' : 'stock-page expressive-stock practice-page zoom-destination';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.inert = true;
    overlay.append(template.content.cloneNode(true));
    document.body.append(overlay);
    const scene = reverse ? overlay.querySelector('.story-stage') : stage;
    const camera = prepareScene(scene);
    // Avoid dashboard typography leaking into the returning landing-page scene.
    if (reverse) document.body.className = 'camera-reversing';
    layout(scene);
    const tablet = scene.querySelector('.tablet-position');
    const background = scene.querySelector('.scene-backdrop');
    // Fixed geometry: no width/height/layout changes during playback.
    const w = scene.clientWidth, h = scene.clientHeight;
    const cx = tablet.offsetLeft + tablet.offsetWidth / 2;
    const cy = tablet.offsetTop + tablet.offsetHeight / 2;
    const zoom = Math.max(w / (tablet.offsetWidth - 20), h / (tablet.offsetHeight - 20)) * 1.04;
    const angle = 5 * Math.PI / 180;
    const tx = w / 2 - zoom * (cx * Math.cos(angle) - cy * Math.sin(angle));
    const ty = h / 2 - zoom * (cx * Math.sin(angle) + cy * Math.cos(angle));
    const end = `translate3d(${tx}px,${ty}px,0) scale(${zoom}) rotate(5deg)`;
    const timing = { duration, easing: 'cubic-bezier(.42,0,.25,1)', fill: 'both', direction: reverse ? 'reverse' : 'normal' };
    activeAnimations.push(camera.animate([{ transform: 'translate3d(0,0,0) scale(1) rotate(0deg)' }, { transform: end }], timing));
    activeAnimations.push(background.animate([{ filter: 'blur(0px)' }, { filter: 'blur(2px)' }], timing));
    if (reverse) {
      // Keep the current, possibly expanded table intact until the camera is visible.
      const tableCover = document.createElement('div');
      tableCover.className = 'stock-page expressive-stock practice-page zoom-destination';
      tableCover.append(document.querySelector('body > .stock-main').cloneNode(true));
      tableCover.inert = true;
      tableCover.setAttribute('aria-hidden', 'true');
      overlay.append(tableCover);
      activeAnimations.push(tableCover.animate([
        { opacity: 0, offset: 0 }, { opacity: 0, offset: .65 }, { opacity: 1, offset: 1 }
      ], { ...timing, easing: 'linear' }));
    } else {
      activeAnimations.push(overlay.animate([
        { opacity: 0, offset: 0 }, { opacity: 0, offset: .65 }, { opacity: 1, offset: 1 }
      ], { ...timing, easing: 'linear' }));
    }
    // Navigate only when the whole video-like motion finishes, never per scroll tick.
    Promise.all(activeAnimations.map(animation => animation.finished)).then(() => {
      if (!busy) return;
      if (reverse) save('lotevo-camera-return', String(Date.now()));
      location.assign(target);
      // Fail safe: links and scrolling recover if navigation is blocked/offline.
      unlockTimer = setTimeout(cleanup, 2500);
    }).catch(() => {});
  }
  const atStart = () => scrollY <= 4;
  const inputTarget = target => target.closest('input,textarea,select,[contenteditable="true"]');
  if (story || practice) {
    window.addEventListener('wheel', event => {
      if (event.ctrlKey || event.defaultPrevented || !enabled() || inputTarget(event.target)) return;
      if (busy) { event.preventDefault(); return; }
      if (!atStart()) return;
      const intended = practice ? event.deltaY < 0 : event.deltaY > 0;
      if (!intended || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      const now = performance.now();
      if (now < quietUntil) { quietUntil = now + 180; return; }
      if (now - lastWheel > 180) wheelAmount = 0;
      lastWheel = now;
      wheelAmount += Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (wheelAmount >= 18) transition(practice);
    }, { passive: false });
    window.addEventListener('keydown', event => {
      if (event.defaultPrevented || inputTarget(event.target)) return;
      if (event.key === 'Escape' && busy) { cleanup(); return; }
      if (!enabled() || !atStart()) return;
      const keys = practice ? ['ArrowUp', 'PageUp'] : ['ArrowDown', 'PageDown', ' '];
      if (keys.includes(event.key) && !event.target.closest('a,button,summary')) {
        event.preventDefault(); transition(practice);
      }
    });
    document.querySelectorAll(practice ? '.panel-back, .tablet-bar .brand' : '[data-zoom-enter]').forEach(link => {
      link.addEventListener('click', event => {
        if (!enabled() || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (practice && !atStart()) scrollTo({ top: 0, behavior: 'instant' });
        transition(practice);
      });
    });
  }
  window.addEventListener('resize', () => { if (busy) cleanup(); if (stage) layout(stage); }, { passive: true });
  reduced.addEventListener('change', cleanup);
  window.addEventListener('pageshow', () => { cleanup(); if (stage) layout(stage); });
  if (!reduced.matches && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('visible'); observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    reduced.addEventListener('change', () => {
      if (reduced.matches) { observer.disconnect(); document.body.classList.remove('motion-ready'); }
    });
  }
})();
