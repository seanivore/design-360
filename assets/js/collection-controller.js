/**
 * COLLECTION CONTROLLER (v4.2.3)
 * Renders a single collection page: header + filter chips + item tile grid.
 * URL: /collection/{slug} (prod), collection.html?path={slug} (local).
 * Filters re-render via URL hash: #tags=Tag+A+Tag+B (item-tag union, AND match).
 */

window.CollectionController = (() => {
  // DOM mount points
  const headerEl = document.getElementById('collection-header');
  const filtersEl = document.getElementById('collection-filters');
  const gridEl = document.getElementById('collection-grid');

  // State
  let collection = null;
  let items = [];          // legacy: resolved item objects
  let images = [];         // gallery (6.1): ordered image URL strings
  let imageMode = false;   // true when rendering a 6.1 images[] collection
  let activeTags = []; // normalized

  /**
   * Resolve the collection slug (manifest key) from URL/sessionStorage/pathname.
   *
   * Returns the FULL nested path `<entry>/<coll>` for nested gallery URLs
   * (e.g. `/illustration-art-deco/animals` -> `"illustration-art-deco/animals"`)
   * so it matches the manifest.collections key written by generate_manifest.py.
   * Still handles the legacy single-segment slug and `?path=` / sessionStorage
   * forms (a leading `collection/` prefix is stripped, but interior slashes of
   * a nested path are preserved).
   */
  function getCollectionSlug() {
    const strip = (s) => (s || '').replace(/^\/|\/$/g, '').replace(/^collection\//, '');

    const urlParams = new URLSearchParams(window.location.search);
    const pathParam = urlParams.get('path');
    if (pathParam) return strip(pathParam);

    const storedPath = sessionStorage.getItem('collectionPath');
    if (storedPath) {
      sessionStorage.removeItem('collectionPath');
      return strip(storedPath);
    }

    return strip(window.location.pathname);
  }

  /**
   * Resolve image URL (CDN or relative)
   */
  function imgSrc(url) {
    if (!url) return '';
    return url.startsWith('http') ? url : '/' + url;
  }

  /**
   * Parse #tags=Tag+A+Tag+B (or ?tags=...) into normalized slug array.
   */
  function parseTagHash() {
    const tags = [];
    const sources = [window.location.hash.slice(1), window.location.search.slice(1)];
    sources.forEach(src => {
      if (!src) return;
      const m = src.match(/tags?=([^&]+)/);
      if (!m) return;
      m[1].split('+').forEach(t => {
        const decoded = decodeURIComponent(t.replace(/-/g, ' ')).trim();
        if (decoded) {
          const norm = DataLoader.normalizeForURL(decoded);
          if (!tags.includes(norm)) tags.push(norm);
        }
      });
    });
    return tags;
  }

  /**
   * Write the active tag set back to the URL hash.
   */
  function writeTagHash(normalizedTags) {
    if (!normalizedTags || normalizedTags.length === 0) {
      // Clear hash without scroll jump
      const url = window.location.pathname + window.location.search;
      history.replaceState(null, '', url);
      return;
    }
    const hash = '#tags=' + normalizedTags.join('+');
    const url = window.location.pathname + window.location.search + hash;
    history.replaceState(null, '', url);
  }

  /**
   * Build a sorted Set of all tags across items.
   */
  function collectAllTags(itemList) {
    const tagSet = new Set();
    itemList.forEach(item => {
      (item.tags || []).forEach(t => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  }

  /**
   * Items pass when they have ALL of the active tags.
   */
  function filterItems(itemList, normalizedTags) {
    if (!normalizedTags || normalizedTags.length === 0) return itemList;
    return itemList.filter(item => {
      const itemTagsNorm = (item.tags || []).map(t => DataLoader.normalizeForURL(t));
      return normalizedTags.every(t => itemTagsNorm.includes(t));
    });
  }

  /**
   * Render header (title + subtitle) into #collection-header.
   */
  function renderHeader(coll) {
    if (!headerEl) return;
    headerEl.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = coll.title || '';
    headerEl.appendChild(h1);

    if (coll.subtitle) {
      const p = document.createElement('p');
      p.className = 'collection-subtitle';
      p.textContent = coll.subtitle;
      headerEl.appendChild(p);
    }

    // SEO
    document.title = coll.seo_title || coll.title || document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && coll.seo_description) metaDesc.setAttribute('content', coll.seo_description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', coll.seo_title || coll.title || '');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && coll.seo_description) ogDesc.setAttribute('content', coll.seo_description);
  }

  /**
   * Render filter chips. Clicking toggles tag in normalized set; updates hash.
   */
  function renderFilters(itemList) {
    if (!filtersEl) return;
    filtersEl.innerHTML = '';

    const allTags = collectAllTags(itemList);
    if (allTags.length === 0) return;

    const wrap = document.createElement('div');
    wrap.className = 'collection-filter-chips';

    allTags.forEach(tag => {
      const normalized = DataLoader.normalizeForURL(tag);
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'collection-filter-chip';
      chip.textContent = tag;
      chip.setAttribute('data-tag', normalized);
      if (activeTags.includes(normalized)) {
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
      } else {
        chip.setAttribute('aria-pressed', 'false');
      }
      chip.addEventListener('click', () => {
        const idx = activeTags.indexOf(normalized);
        if (idx === -1) {
          activeTags = [...activeTags, normalized];
        } else {
          activeTags = activeTags.filter(t => t !== normalized);
        }
        writeTagHash(activeTags);
        renderFilters(items);
        renderGrid(filterItems(items, activeTags));
      });
      wrap.appendChild(chip);
    });

    if (activeTags.length > 0) {
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'collection-filter-clear';
      clear.textContent = 'Clear';
      clear.addEventListener('click', () => {
        activeTags = [];
        writeTagHash(activeTags);
        renderFilters(items);
        renderGrid(items);
      });
      wrap.appendChild(clear);
    }

    filtersEl.appendChild(wrap);
  }

  /**
   * Render the grid into #collection-grid.
   *
   * In image mode (6.1 images[]) each entry is a URL string rendered as a
   * lightbox-opening <img> tile. In legacy item mode each entry is an item
   * object rendered as a linked tile.
   */
  function renderGrid(list) {
    if (!gridEl) return;
    gridEl.innerHTML = '';

    if (!list || list.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'collection-empty';
      empty.textContent = imageMode ? 'No images in this collection.' : 'No items match the current filters.';
      gridEl.appendChild(empty);
      return;
    }

    if (imageMode) {
      // Natural-aspect masonry "gallery wall" — images keep their aspect ratio
      // (framed-on-a-wall feel, not square-cropped); the lightbox shows the
      // full image on click.
      gridEl.classList.add('collection-masonry');
      list.forEach(url => {
        gridEl.appendChild(buildImageTile(url));
      });
      return;
    }

    gridEl.classList.remove('collection-masonry');
    list.forEach(item => {
      gridEl.appendChild(buildItemTile(item));
    });
  }

  /**
   * Build a single gallery image tile: a bare <img data-lightbox-index="N">
   * registered into the shared lightbox pool. No media.html link, no title.
   * Click opens the shared lightbox (global delegation in lightbox.js).
   * Natural-aspect tile for the masonry wall (.collection-masonry).
   */
  function buildImageTile(url) {
    const alt = (collection && collection.thumb_alt) || (collection && collection.title) || 'Collection image';
    const idx = window.Lightbox.register(imgSrc(url), alt);

    const img = document.createElement('img');
    img.className = 'collection-image-tile fade-in-item';
    img.src = imgSrc(url);
    img.alt = alt;
    img.loading = 'lazy';
    img.dataset.lightboxIndex = String(idx);
    return img;
  }

  /**
   * Build a single item tile <a class="tile tile-item">.
   * Uses thumb[0] (fall back to src). Matches existing .tile-* CSS selectors.
   */
  function buildItemTile(item) {
    const slug = item.slug || '';
    const href = '/media.html?path=' + encodeURIComponent(slug);
    const thumbs = Array.isArray(item.thumb) ? item.thumb : [];
    const thumbUrl = thumbs[0] || item.src || '';
    const alt = item.thumb_alt || item.title || 'Item image';

    const tile = document.createElement('a');
    tile.className = 'tile tile-item fade-in-item';
    tile.href = href;
    tile.setAttribute('data-item-id', item.id || '');

    if (thumbUrl) {
      const img = document.createElement('img');
      img.className = 'tile-image';
      img.src = imgSrc(thumbUrl);
      img.alt = alt;
      img.loading = 'lazy';
      tile.appendChild(img);
    }

    const textArea = document.createElement('div');
    textArea.className = 'tile-text-area';

    const title = document.createElement('h3');
    title.className = 'tile-title';
    title.textContent = item.title || '';
    textArea.appendChild(title);

    if (item.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.className = 'tile-subtitle';
      subtitle.textContent = item.subtitle;
      textArea.appendChild(subtitle);
    }

    tile.appendChild(textArea);
    return tile;
  }

  /**
   * Render an error state into #collection-header.
   */
  function renderError(message) {
    if (!headerEl) return;
    headerEl.innerHTML = '';
    const h1 = document.createElement('h1');
    h1.textContent = 'Collection not found';
    headerEl.appendChild(h1);
    const p = document.createElement('p');
    p.className = 'collection-subtitle';
    p.textContent = message || 'The requested collection could not be loaded.';
    headerEl.appendChild(p);
  }

  /**
   * Initialize the controller.
   */
  async function init() {
    const slug = getCollectionSlug();
    if (!slug) {
      renderError('No collection slug provided in the URL.');
      return;
    }

    try {
      collection = await DataLoader.loadCollection(slug);
      if (!collection) {
        renderError('Collection "' + slug + '" was not found in the manifest.');
        return;
      }

      // Reset the shared lightbox pool for this page load.
      window.Lightbox.reset();

      // 6.1 gallery collections carry an ordered images[] URL array; legacy
      // collections carry media[] item UIDs. Branch on which is present.
      images = DataLoader.resolveCollectionImages(collection);
      imageMode = images.length > 0;

      renderHeader(collection);

      if (imageMode) {
        // Gallery: render images in array order, no tag filters, no per-image
        // title; clicking opens the shared lightbox.
        renderGrid(images);
      } else {
        // Legacy item path: resolve item objects + tag filters.
        items = await DataLoader.resolveCollectionMedia(collection);
        activeTags = parseTagHash();

        renderFilters(items);
        renderGrid(filterItems(items, activeTags));

        // Respond to hashchange (e.g. back/forward, manual hash edit)
        window.addEventListener('hashchange', () => {
          activeTags = parseTagHash();
          renderFilters(items);
          renderGrid(filterItems(items, activeTags));
        });
      }

      // Wire the shared lightbox after the grid has rendered.
      window.Lightbox.init();
    } catch (error) {
      console.error('CollectionController init failed:', error);
      renderError('Something went wrong loading this collection.');
    }
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    getCollectionSlug,
    renderHeader,
    renderFilters,
    renderGrid
  };
})();
