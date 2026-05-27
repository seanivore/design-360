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
  let items = [];
  let activeTags = []; // normalized

  /**
   * Resolve collection slug from URL/sessionStorage/pathname.
   * Mirrors entry-controller's getEntryPath(), scoped to /collection/{slug}.
   */
  function getCollectionSlug() {
    const urlParams = new URLSearchParams(window.location.search);
    const pathParam = urlParams.get('path');
    if (pathParam) return pathParam.replace(/^\/|\/$/g, '');

    const storedPath = sessionStorage.getItem('collectionPath');
    if (storedPath) {
      sessionStorage.removeItem('collectionPath');
      return storedPath.replace(/^\/|\/$/g, '').replace(/^collection\//, '');
    }

    const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
    if (pathname.startsWith('collection/')) {
      return pathname.slice('collection/'.length);
    }
    return pathname;
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
   * Render item grid into #collection-grid.
   */
  function renderGrid(itemList) {
    if (!gridEl) return;
    gridEl.innerHTML = '';

    if (!itemList || itemList.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'collection-empty';
      empty.textContent = 'No items match the current filters.';
      gridEl.appendChild(empty);
      return;
    }

    itemList.forEach(item => {
      gridEl.appendChild(buildItemTile(item));
    });
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

      items = await DataLoader.resolveCollectionMedia(collection);
      activeTags = parseTagHash();

      renderHeader(collection);
      renderFilters(items);
      renderGrid(filterItems(items, activeTags));

      // Respond to hashchange (e.g. back/forward, manual hash edit)
      window.addEventListener('hashchange', () => {
        activeTags = parseTagHash();
        renderFilters(items);
        renderGrid(filterItems(items, activeTags));
      });
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
