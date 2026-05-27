/**
 * MEDIA CONTROLLER (v4.2.3)
 * Renders a single media item page: header + media (image|video) + related strip.
 * URL: /media/{slug} (prod), media.html?path={slug} (local).
 * Related items: ALL items in manifest with >=1 shared tag, sorted by overlap desc, id asc, top 8.
 */

window.MediaController = (() => {
  // DOM mount points
  const headerEl = document.getElementById('item-header');
  const mediaEl = document.getElementById('item-media');
  const relatedSection = document.getElementById('item-related');
  const relatedStrip = document.getElementById('item-related-strip');

  // State
  let currentItem = null;

  /**
   * Resolve item slug from URL/sessionStorage/pathname.
   * Mirrors entry-controller's getEntryPath(), scoped to /media/{slug}.
   */
  function getItemSlug() {
    const urlParams = new URLSearchParams(window.location.search);
    const pathParam = urlParams.get('path');
    if (pathParam) return pathParam.replace(/^\/|\/$/g, '');

    const storedPath = sessionStorage.getItem('itemPath');
    if (storedPath) {
      sessionStorage.removeItem('itemPath');
      return storedPath.replace(/^\/|\/$/g, '').replace(/^media\//, '');
    }

    const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
    if (pathname.startsWith('media/')) {
      return pathname.slice('media/'.length);
    }
    return pathname;
  }

  /**
   * Resolve image/video URL (CDN or relative).
   */
  function mediaSrc(url) {
    if (!url) return '';
    return url.startsWith('http') ? url : '/' + url;
  }

  /**
   * Render item header (title + subtitle) and SEO tags.
   */
  function renderHeader(item) {
    if (!headerEl) return;
    headerEl.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = item.title || '';
    headerEl.appendChild(h1);

    if (item.subtitle) {
      const p = document.createElement('p');
      p.className = 'item-subtitle';
      p.textContent = item.subtitle;
      headerEl.appendChild(p);
    }

    // SEO
    document.title = item.seo_title || item.title || document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && item.seo_description) metaDesc.setAttribute('content', item.seo_description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', item.seo_title || item.title || '');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && item.seo_description) ogDesc.setAttribute('content', item.seo_description);
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && item.src) ogImage.setAttribute('content', mediaSrc(item.src));
    const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
    if (ogImageAlt && item.thumb_alt) ogImageAlt.setAttribute('content', item.thumb_alt);
  }

  /**
   * Render media element (image or video) into #item-media.
   */
  function renderMedia(item) {
    if (!mediaEl) return;
    mediaEl.innerHTML = '';

    if (item.media_type === 'image') {
      const img = document.createElement('img');
      img.className = 'item-media-image';
      img.src = mediaSrc(item.src);
      img.alt = item.thumb_alt || item.title || 'Item image';
      mediaEl.appendChild(img);
    } else if (item.media_type === 'video') {
      const video = document.createElement('video');
      video.className = 'item-media-video';
      video.src = mediaSrc(item.src);
      video.controls = true;
      video.playsInline = true;
      mediaEl.appendChild(video);
    } else {
      console.warn('MediaController: unknown media_type', item.media_type, 'for item', item.id);
    }
  }

  /**
   * Build a single related-item tile (anchor). Same shape as collection grid tile.
   */
  function buildItemTile(item) {
    const slug = item.slug || '';
    const href = '/media.html?path=' + encodeURIComponent(slug);
    const thumbs = Array.isArray(item.thumb) ? item.thumb : [];
    const thumbUrl = thumbs[0] || item.src || '';
    const alt = item.thumb_alt || item.title || 'Item image';

    const tile = document.createElement('a');
    tile.className = 'tile tile-item tile-item--related fade-in-item';
    tile.href = href;
    tile.setAttribute('data-item-id', item.id || '');

    if (thumbUrl) {
      const img = document.createElement('img');
      img.className = 'tile-image';
      img.src = mediaSrc(thumbUrl);
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
   * Load every item JSON via the manifest (parallel via Promise.all).
   * Decision: inlined here as a private helper since DataLoader has no
   * loadAllItems() and we don't want to mutate that file in this subagent pass.
   * Mirrors DataLoader.loadAllProjects() in shape.
   */
  async function loadAllItems() {
    try {
      const manifest = await DataLoader.loadManifest();
      const itemsMap = (manifest && manifest.items) || {};
      const slugs = Object.keys(itemsMap);
      if (slugs.length === 0) return [];

      const loadPromises = slugs.map(slug => DataLoader.loadCollectionItem(slug));
      const results = await Promise.all(loadPromises);
      return results.filter(it => it);
    } catch (error) {
      console.error('MediaController.loadAllItems failed:', error);
      return [];
    }
  }

  /**
   * Render related items strip (top 8 by tag-overlap; hide section if none).
   */
  async function renderRelated(item) {
    if (!relatedSection || !relatedStrip) return;
    relatedStrip.innerHTML = '';

    const currentTags = Array.isArray(item.tags) ? item.tags.map(t => DataLoader.normalizeForURL(t)) : [];
    if (currentTags.length === 0) {
      relatedSection.style.display = 'none';
      return;
    }

    const allItems = await loadAllItems();

    // Score items by tag-overlap; exclude current item.
    const scored = [];
    allItems.forEach(other => {
      if (!other || other.id === item.id) return;
      const otherTags = Array.isArray(other.tags) ? other.tags.map(t => DataLoader.normalizeForURL(t)) : [];
      if (otherTags.length === 0) return;
      const overlap = otherTags.filter(t => currentTags.includes(t)).length;
      if (overlap > 0) {
        scored.push({ item: other, overlap });
      }
    });

    if (scored.length === 0) {
      relatedSection.style.display = 'none';
      return;
    }

    // Sort: tag-overlap desc, then id asc
    scored.sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      const aId = a.item.id || '';
      const bId = b.item.id || '';
      return aId.localeCompare(bId);
    });

    const top = scored.slice(0, 8).map(s => s.item);
    relatedSection.style.display = '';
    top.forEach(rel => relatedStrip.appendChild(buildItemTile(rel)));
  }

  /**
   * Render an error state into #item-header.
   */
  function renderError(message) {
    if (!headerEl) return;
    headerEl.innerHTML = '';
    const h1 = document.createElement('h1');
    h1.textContent = 'Item not found';
    headerEl.appendChild(h1);
    const p = document.createElement('p');
    p.className = 'item-subtitle';
    p.textContent = message || 'The requested item could not be loaded.';
    headerEl.appendChild(p);
    if (relatedSection) relatedSection.style.display = 'none';
  }

  /**
   * Initialize the controller.
   */
  async function init() {
    const slug = getItemSlug();
    if (!slug) {
      renderError('No item slug provided in the URL.');
      return;
    }

    try {
      currentItem = await DataLoader.loadCollectionItem(slug);
      if (!currentItem) {
        renderError('Item "' + slug + '" was not found in the manifest.');
        return;
      }

      renderHeader(currentItem);
      renderMedia(currentItem);
      await renderRelated(currentItem);
    } catch (error) {
      console.error('MediaController init failed:', error);
      renderError('Something went wrong loading this item.');
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
    getItemSlug,
    renderHeader,
    renderMedia,
    renderRelated,
    loadAllItems
  };
})();
