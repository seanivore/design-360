/**
 * SHARED LIGHTBOX (v4.4.3)
 * Self-contained overlay lightbox shared by entry.html and collection.html.
 *
 * Lightbox-pool contract:
 *   Any <img> participating in the lightbox carries
 *   `data-lightbox-index="<n>"` where <n> is its index in the internal pool
 *   (array of {src, alt}). Global click delegation on document reads that
 *   index and opens the overlay at that position.
 *
 * Public API (window.Lightbox):
 *   register(src, alt) -> index   register an image; src is stored AS-IS
 *                                 (callers pre-transform if needed).
 *   open(i)                       open overlay at pool index i.
 *   nav(dir)                      move +1 / -1 (wraps).
 *   close()                       hide overlay.
 *   reset()                       clear the pool + preload links + index.
 *   init()                        wire overlay controls + global delegation.
 */
(function () {
  // Internal lightbox state pool (one per page load).
  let pool = [];
  let index = 0;
  let preloadLinks = [];
  let initialized = false;

  function register(src, alt) {
    const idx = pool.length;
    pool.push({ src: src, alt: alt || '' });
    return idx;
  }

  /**
   * Inject <link rel="preload" as="image"> for neighbors of `i`.
   * Cleans up old preload links first.
   */
  function preloadNeighbors(i) {
    clearPreloadLinks();
    const neighbors = [i - 1, i + 1];
    neighbors.forEach(n => {
      if (n < 0 || n >= pool.length) return;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = pool[n].src;
      document.head.appendChild(link);
      preloadLinks.push(link);
    });
  }

  function clearPreloadLinks() {
    preloadLinks.forEach(link => link.remove());
    preloadLinks = [];
  }

  function open(i) {
    if (!pool.length) return;
    if (i < 0 || i >= pool.length) return;

    index = i;
    const overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;

    const img = overlay.querySelector('.lightbox-img');
    const counter = overlay.querySelector('.lightbox-counter');

    const entry = pool[i];
    if (img) {
      img.src = entry.src;
      img.alt = entry.alt;
    }
    if (counter) counter.textContent = `${i + 1} / ${pool.length}`;

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    preloadNeighbors(i);
  }

  function close() {
    const overlay = document.getElementById('lightbox-overlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
    clearPreloadLinks();
  }

  function nav(dir) {
    if (!pool.length) return;
    index = (index + dir + pool.length) % pool.length;
    const overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;
    const entry = pool[index];
    const img = overlay.querySelector('.lightbox-img');
    const counter = overlay.querySelector('.lightbox-counter');
    if (img) {
      img.src = entry.src;
      img.alt = entry.alt;
    }
    if (counter) counter.textContent = `${index + 1} / ${pool.length}`;
    preloadNeighbors(index);
  }

  function jump(target) {
    if (!pool.length) return;
    if (target < 0 || target >= pool.length) return;
    index = target;
    const overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;
    const entry = pool[index];
    const img = overlay.querySelector('.lightbox-img');
    const counter = overlay.querySelector('.lightbox-counter');
    if (img) {
      img.src = entry.src;
      img.alt = entry.alt;
    }
    if (counter) counter.textContent = `${index + 1} / ${pool.length}`;
    preloadNeighbors(index);
  }

  function reset() {
    pool = [];
    index = 0;
    clearPreloadLinks();
  }

  /**
   * Initialize: overlay controls + global click delegation for any
   * <img[data-lightbox-index]> on the page. Idempotent — only the first
   * call binds listeners (re-init is a no-op so callers can safely call it
   * after re-rendering a grid).
   */
  function init() {
    if (initialized) return;
    const overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;
    initialized = true;

    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', () => nav(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => nav(1));
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    // Keyboard navigation.
    document.addEventListener('keydown', e => {
      if (overlay.style.display === 'none' || overlay.style.display === '') return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') nav(-1);
      else if (e.key === 'ArrowRight') nav(1);
      else if (e.key === 'Home') jump(0);
      else if (e.key === 'End') jump(pool.length - 1);
    });

    // Touch swipe on the overlay/img for pool nav.
    let touchStartX = 0;
    overlay.addEventListener('touchstart', e => {
      if (e.touches && e.touches.length) touchStartX = e.touches[0].clientX;
    }, { passive: true });
    overlay.addEventListener('touchend', e => {
      if (!e.changedTouches || !e.changedTouches.length) return;
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        nav(diff > 0 ? 1 : -1);
      }
    }, { passive: true });

    // Global click delegation for any <img[data-lightbox-index]>.
    document.addEventListener('click', e => {
      const target = e.target;
      if (!target || target.tagName !== 'IMG') return;
      if (!target.dataset || target.dataset.lightboxIndex === undefined) return;
      const idx = parseInt(target.dataset.lightboxIndex, 10);
      if (Number.isNaN(idx)) return;
      e.preventDefault();
      open(idx);
    });
  }

  window.Lightbox = { register, open, nav, close, reset, init };
})();
