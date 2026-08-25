/**
 * Rive animation block.
 * Authors set the .riv path via block table:
 *   animation       | /blocks/rive/hero.riv  (or absolute URL)
 *   state-machine   | State Machine 1        (optional)
 *   artboard        | Artboard               (optional)
 *   aspect-ratio    | 16/9                   (optional, default 16/9)
 *
 * Loads the @rive-app/canvas runtime from a CDN on demand and starts the
 * animation only once the block scrolls near the viewport.
 */
import { readBlockConfig } from '../../scripts/aem.js';

const RIVE_RUNTIME_SRC = 'https://unpkg.com/@rive-app/canvas@2.36.0';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Script failed: ${src}`));
    document.body.appendChild(script);
  });
}

function waitForRive(maxMs = 5000) {
  if (window.rive && typeof window.rive.Rive === 'function') {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + maxMs;
    const check = () => {
      if (window.rive && typeof window.rive.Rive === 'function') {
        resolve();
        return;
      }
      if (Date.now() > deadline) {
        reject(new Error('Rive runtime not available'));
        return;
      }
      setTimeout(check, 50);
    };
    check();
  });
}

function toAbsoluteRivUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = window.hlx?.codeBasePath ? window.hlx.codeBasePath.replace(/\/$/, '') : '';
  const path = trimmed.startsWith('/')
    ? trimmed
    : (`${base ? `/${base}` : ''}/${trimmed.replace(/^\//, '')}`).replace(/\/+/g, '/');
  try {
    return new URL(path, window.location.origin).href;
  } catch {
    return trimmed;
  }
}

function showError(container, msg, err) {
  container.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'rive-error';
  p.textContent = msg;
  container.appendChild(p);
  // eslint-disable-next-line no-console
  if (err) console.error('[Rive]', msg, err);
}

function initRive(container) {
  if (container.dataset.riveLoaded === 'true') return;
  container.dataset.riveLoaded = 'true';

  const src = container.getAttribute('data-src');
  if (!src) return;
  const stateMachine = container.getAttribute('data-state-machine') || 'State Machine 1';
  const artboard = container.getAttribute('data-artboard') || 'Artboard';

  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', container.getAttribute('aria-label') || 'Animation');
  container.appendChild(canvas);

  loadScript(RIVE_RUNTIME_SRC)
    .then(() => waitForRive())
    .then(() => {
      const r = new window.rive.Rive({
        src,
        canvas,
        autoplay: true,
        stateMachines: stateMachine,
        artboard,
        layout: new window.rive.Layout({
          fit: window.rive.Fit.Contain,
          alignment: window.rive.Alignment.Center,
        }),
        onLoad: () => r.resizeDrawingSurfaceToCanvas(),
      });

      let frame = 0;
      const resize = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          r.resizeDrawingSurfaceToCanvas();
        });
      };
      window.addEventListener('resize', resize);
      // catch container size changes (aspect-ratio settles after onLoad)
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(resize).observe(container);
      }
    })
    .catch((err) => {
      showError(container, 'Animation could not be loaded.', err);
    });
}

function initRiveWhenVisible(container) {
  let started = false;
  const run = () => {
    if (started) return;
    started = true;
    initRive(container);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        run();
      }
    });
  }, { rootMargin: '200px', threshold: 0 });

  observer.observe(container);

  setTimeout(() => {
    if (container.dataset.riveLoaded !== 'true') run();
  }, 500);
}

export default function decorate(block) {
  const config = readBlockConfig(block);
  const raw = config.animation && String(config.animation).trim()
    ? String(config.animation).trim()
    : '/blocks/rive/hero.riv';
  const src = toAbsoluteRivUrl(raw);
  const aspect = (config['aspect-ratio'] && String(config['aspect-ratio']).trim()) || '16 / 9';

  const container = document.createElement('div');
  container.className = 'rive-canvas-wrap';
  container.setAttribute('data-src', src);
  if (config['state-machine']) {
    container.setAttribute('data-state-machine', String(config['state-machine']).trim());
  }
  if (config.artboard) {
    container.setAttribute('data-artboard', String(config.artboard).trim());
  }
  container.style.setProperty('--rive-aspect', aspect.replace('/', ' / '));

  block.innerHTML = '';
  block.appendChild(container);

  const immediate = config.immediate === true || config.immediate === 'true'
    || window.location?.search?.includes('rive=immediate');
  if (immediate) {
    initRive(container);
  } else {
    initRiveWhenVisible(container);
  }
}
