/**
 * FEATURED TILE CONTROLLER (v4.2.3)
 * Drives the homepage feature-tile auto-play sequence and tap interactions.
 *
 * States: idle | playing-sequence | paused-on-tile | tile-stopped (per-tile) | tiles-default
 *
 * Initialized by landing-controller.renderFeaturedTiles() via a
 * 'featured-tiles:ready' CustomEvent on `document` with detail.tiles.
 */

const FeaturedTileController = (() => {
  // ---- Constants ----
  const MAX_TILE_DURATION_MS = 8000;
  const TAP_WINDOW_MS = 600;
  const TAP_RESOLVE_DELAY_MS = 300;
  const INTERSECTION_THRESHOLD = 0.5;
  const FLIP_CLASS = 'feature-tile__flip';

  // ---- Internal state ----
  const state = {
    active: 'idle',
    currentTile: 0,
    tiles: [],
    stoppedTiles: new Set(),
    pausedTile: null,
    tapTimestamps: [],     // per-tile arrays
    tapResolveTimers: [],  // per-tile pending resolve timer ids
    advanceTimeoutId: null,
    activeEndedHandler: null,
    activeEndedTile: null,
    hasPlayedOnce: false,
    outsideHandlerAttached: false,
    container: null,
    observer: null
  };

  // ---- Helpers ----

  /**
   * Get the <video> element inside a tile.
   */
  function videoOf(tile) {
    return tile ? tile.querySelector('.feature-tile__video') : null;
  }

  /**
   * Pause a single tile's video and reset to the first frame (poster).
   */
  function freezeTile(tile) {
    const video = videoOf(tile);
    if (!video) return;
    try {
      video.pause();
      video.currentTime = 0;
    } catch (e) {
      // Some browsers throw on currentTime before metadata is ready; ignore.
    }
    tile.classList.remove(FLIP_CLASS);
  }

  /**
   * Freeze every tile except the optionally-provided "keep playing" index.
   */
  function freezeAllExcept(keepIndex) {
    state.tiles.forEach((tile, i) => {
      if (i === keepIndex) return;
      freezeTile(tile);
    });
  }

  /**
   * Cancel any pending advance timer + 'ended' listener from the previous tile.
   */
  function clearAdvanceWatchers() {
    if (state.advanceTimeoutId !== null) {
      clearTimeout(state.advanceTimeoutId);
      state.advanceTimeoutId = null;
    }
    if (state.activeEndedHandler && state.activeEndedTile !== null) {
      const prevVideo = videoOf(state.tiles[state.activeEndedTile]);
      if (prevVideo) {
        prevVideo.removeEventListener('ended', state.activeEndedHandler);
      }
    }
    state.activeEndedHandler = null;
    state.activeEndedTile = null;
  }

  /**
   * Find the next non-stopped tile index after `fromN` (wrapping). Returns -1
   * if every tile is in stoppedTiles.
   */
  function nextPlayableIndex(fromN) {
    const total = state.tiles.length;
    if (total === 0) return -1;
    for (let step = 1; step <= total; step++) {
      const idx = (fromN + step) % total;
      if (!state.stoppedTiles.has(idx)) return idx;
    }
    return -1;
  }

  /**
   * Find the first playable index starting at 0 (used when restarting).
   */
  function firstPlayableIndex() {
    for (let i = 0; i < state.tiles.length; i++) {
      if (!state.stoppedTiles.has(i)) return i;
    }
    return -1;
  }

  /**
   * Play tile N as the active tile of the sequence.
   * Freezes other tiles, schedules advance after MAX_TILE_DURATION_MS or
   * the video's 'ended' event (whichever fires first).
   */
  function playTile(n) {
    if (n < 0 || n >= state.tiles.length) return;
    if (state.stoppedTiles.has(n)) {
      const next = nextPlayableIndex(n);
      if (next === -1) {
        state.active = 'idle';
        return;
      }
      playTile(next);
      return;
    }

    clearAdvanceWatchers();

    state.currentTile = n;
    state.active = 'playing-sequence';
    state.hasPlayedOnce = true;

    freezeAllExcept(n);

    const tile = state.tiles[n];
    const video = videoOf(tile);
    if (!video) {
      // Nothing to play here — schedule the advance immediately.
      state.advanceTimeoutId = setTimeout(() => advance(n), 0);
      return;
    }

    tile.classList.add(FLIP_CLASS);

    try {
      video.currentTime = 0;
    } catch (e) {
      // ignore
    }
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay may be blocked; the advance timer will move us forward.
      });
    }

    // Listen for 'ended'. Because video.loop is true, 'ended' won't normally
    // fire — but the spec wants whichever fires first, so the listener is
    // still wired in case loop is overridden elsewhere.
    const endedHandler = () => advance(n);
    video.addEventListener('ended', endedHandler);
    state.activeEndedHandler = endedHandler;
    state.activeEndedTile = n;

    state.advanceTimeoutId = setTimeout(() => advance(n), MAX_TILE_DURATION_MS);

    // Attach the outside-tap handler the first time we enter playing-sequence.
    attachOutsideTapHandler();
  }

  /**
   * Advance the sequence from tile `fromN` to the next playable tile.
   * No-ops if we've moved on (state.currentTile no longer === fromN) or if
   * the state has left 'playing-sequence'.
   */
  function advance(fromN) {
    if (state.active !== 'playing-sequence') return;
    if (state.currentTile !== fromN) return;

    clearAdvanceWatchers();

    const next = nextPlayableIndex(fromN);
    if (next === -1) {
      // All tiles stopped — freeze everything and idle.
      freezeAllExcept(-1);
      state.active = 'idle';
      return;
    }
    playTile(next);
  }

  /**
   * Resolve tap-count for tile `n` based on the recorded timestamps.
   * 1 → pause sequence on tile N.
   * 2 → navigate to entry slug.
   * 3+ → mark tile N as stopped and advance.
   */
  function resolveTapCount(n) {
    const stamps = state.tapTimestamps[n] || [];
    if (stamps.length === 0) return;

    // Only count taps within TAP_WINDOW_MS of the first tap in this burst.
    const firstStamp = stamps[0];
    const validTaps = stamps.filter(t => t - firstStamp < TAP_WINDOW_MS);
    const count = validTaps.length;

    // Reset the per-tile buffer for the next burst.
    state.tapTimestamps[n] = [];
    state.tapResolveTimers[n] = null;

    if (count === 1) {
      handleSingleTap(n);
    } else if (count === 2) {
      handleDoubleTap(n);
    } else if (count >= 3) {
      handleTripleTap(n);
    }
  }

  /**
   * Single-tap on tile N → pause sequence, keep N looping, freeze others.
   */
  function handleSingleTap(n) {
    clearAdvanceWatchers();
    state.active = 'paused-on-tile';
    state.pausedTile = n;
    state.currentTile = n;

    freezeAllExcept(n);

    const tile = state.tiles[n];
    const video = videoOf(tile);
    if (video) {
      tile.classList.add(FLIP_CLASS);
      // Video has loop=true in markup, so it will keep cycling.
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  }

  /**
   * Double-tap on tile N → navigate to the entry slug.
   */
  function handleDoubleTap(n) {
    const tile = state.tiles[n];
    if (!tile) return;
    const slug = tile.dataset && tile.dataset.slug;
    if (!slug) return;
    window.location.href = '/' + slug + '/';
  }

  /**
   * Triple-tap on tile N → mark stopped, freeze it, advance the sequence.
   */
  function handleTripleTap(n) {
    state.stoppedTiles.add(n);
    freezeTile(state.tiles[n]);

    if (state.active === 'paused-on-tile' && state.pausedTile === n) {
      state.pausedTile = null;
    }

    // Resume sequence from this tile.
    state.active = 'playing-sequence';
    advance(n);
  }

  /**
   * Pointerdown handler for a tile (handles tap counting).
   */
  function onTilePointerDown(n) {
    return function (event) {
      // Don't let the document-level outside-tap handler treat this as outside.
      // (It already checks containment, so this is defensive only.)
      if (!state.tapTimestamps[n]) state.tapTimestamps[n] = [];
      state.tapTimestamps[n].push(performance.now());

      if (state.tapResolveTimers[n]) {
        clearTimeout(state.tapResolveTimers[n]);
      }
      state.tapResolveTimers[n] = setTimeout(
        () => resolveTapCount(n),
        TAP_RESOLVE_DELAY_MS
      );
    };
  }

  /**
   * Keydown handler for a tile — Enter = double-tap equivalent (navigate).
   */
  function onTileKeyDown(n) {
    return function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleDoubleTap(n);
      }
    };
  }

  /**
   * Document-level pointerdown listener: any tap outside #featured-tiles
   * resets the controller to 'tiles-default' and restarts from tile 0.
   * Attached lazily after the first playTile so the IntersectionObserver
   * trigger doesn't cause an immediate "outside" reset.
   */
  function attachOutsideTapHandler() {
    if (state.outsideHandlerAttached) return;
    if (!state.container) return;
    document.addEventListener('pointerdown', onDocumentPointerDown, true);
    state.outsideHandlerAttached = true;
  }

  /**
   * Handler bound to document for outside-tap detection.
   */
  function onDocumentPointerDown(event) {
    if (!state.container) return;
    if (state.container.contains(event.target)) return;

    // Reset to default sequence.
    clearAdvanceWatchers();
    state.stoppedTiles.clear();
    state.pausedTile = null;
    state.active = 'tiles-default';

    const start = firstPlayableIndex();
    if (start === -1) {
      state.active = 'idle';
      return;
    }
    playTile(start);
  }

  /**
   * Set up the IntersectionObserver that kicks off the first sequence.
   */
  function setupObserver() {
    if (!('IntersectionObserver' in window) || !state.container) {
      // Fallback: start immediately.
      playTile(0);
      return;
    }
    state.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= INTERSECTION_THRESHOLD) {
          if (state.observer) {
            state.observer.disconnect();
            state.observer = null;
          }
          if (state.active === 'idle') {
            playTile(0);
          }
          break;
        }
      }
    }, { threshold: INTERSECTION_THRESHOLD });
    state.observer.observe(state.container);
  }

  /**
   * Wire up event listeners on each tile (pointer + keyboard).
   */
  function wireTiles() {
    state.tiles.forEach((tile, i) => {
      state.tapTimestamps[i] = [];
      state.tapResolveTimers[i] = null;
      tile.addEventListener('pointerdown', onTilePointerDown(i));
      tile.addEventListener('keydown', onTileKeyDown(i));
    });
  }

  /**
   * Public init — called with the NodeList of tiles produced by
   * landing-controller.renderFeaturedTiles(). Idempotent: re-init replaces
   * any prior wiring (useful for dev hot-reloads).
   */
  function init(tilesNodeList) {
    // Tear down any previous state.
    clearAdvanceWatchers();
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
    if (state.outsideHandlerAttached) {
      document.removeEventListener('pointerdown', onDocumentPointerDown, true);
      state.outsideHandlerAttached = false;
    }

    const container = document.getElementById('featured-tiles');
    if (!container) {
      console.warn('FeaturedTileController.init: #featured-tiles not found');
      return;
    }
    state.container = container;

    const tiles = tilesNodeList && tilesNodeList.length
      ? Array.from(tilesNodeList)
      : Array.from(container.querySelectorAll('.feature-tile'));

    if (tiles.length === 0) {
      console.warn('FeaturedTileController.init: no tiles found');
      return;
    }

    state.tiles = tiles;
    state.stoppedTiles = new Set();
    state.pausedTile = null;
    state.tapTimestamps = [];
    state.tapResolveTimers = [];
    state.currentTile = 0;
    state.active = 'idle';
    state.hasPlayedOnce = false;

    // Freeze every tile to its poster initially.
    state.tiles.forEach(freezeTile);

    wireTiles();
    setupObserver();
  }

  // Auto-listen for the ready event dispatched by landing-controller.
  document.addEventListener('featured-tiles:ready', (event) => {
    const detail = event && event.detail ? event.detail : {};
    init(detail.tiles);
  });

  // Public API
  return {
    init
  };
})();

// Expose on window for consistency with DataLoader.
if (typeof window !== 'undefined') {
  window.FeaturedTileController = FeaturedTileController;
}
