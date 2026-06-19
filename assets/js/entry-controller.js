/**
 * ENTRY CONTROLLER (v4.2.3)
 * Manages individual project entry pages with layout-aware rendering.
 *
 * Layouts:
 *   - "columns" (default) — two-column shape with sticky tag/embed column,
 *     legacy challenge/approach/result body text, plus new main_media / bleed
 *     / bleed_slides regions.
 *   - "flow" — typed-block sequence walked from entry.flow[].
 *
 * Lightbox-pool contract:
 *   Any <img> participating in the unified lightbox pool carries
 *   `data-lightbox-index="<n>"` where <n> is its index in the shared
 *   window.Lightbox pool (array of {src, alt}). Click delegation on
 *   document reads that index and opens the lightbox at that position.
 */

const EntryController = (() => {

    // Lightbox state is owned by the shared window.Lightbox module
    // (assets/js/lightbox.js). This controller only registers images and
    // delegates open/nav/close/reset/init to it.

    /**
     * Get entry path from URL or sessionStorage
     */
    function getEntryPath() {
        const urlParams = new URLSearchParams(window.location.search);
        const pathParam = urlParams.get('path');
        if (pathParam) return pathParam;

        const storedPath = sessionStorage.getItem('entryPath');
        if (storedPath) {
            sessionStorage.removeItem('entryPath');
            return storedPath.replace(/^\//, '');
        }

        return window.location.pathname.replace(/^\/|\/$/g, '');
    }

    /**
     * Load entry data from manifest
     */
    async function loadEntryData(entryPath) {
        const manifest = await DataLoader.loadManifest();
        const jsonPath = manifest.entries[entryPath];
        if (!jsonPath) {
            console.error('Entry not found in manifest:', entryPath);
            return null;
        }
        return await DataLoader.loadProject(jsonPath);
    }

    /**
     * Resolve image URL (CDN or relative)
     */
    function imgSrc(url) {
        return url.startsWith('http') ? url : '/' + url;
    }

    /**
     * Register an image into the shared lightbox pool.
     * Applies the imgSrc() CDN/relative transform, then defers to the shared
     * module. Returns the assigned index.
     */
    function registerLightboxImage(src, alt) {
        return window.Lightbox.register(imgSrc(src), alt);
    }

    /**
     * Populate page metadata (SEO tags)
     */
    function populateMetadata(project) {
        document.title = project.seo_title || project.title;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', project.seo_description || '');

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', project.seo_title || project.title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', project.seo_description || '');

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && project.thumb && project.thumb[0]) {
            ogImage.setAttribute('content', imgSrc(project.thumb[0]));
        }

        const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
        if (ogImageAlt) ogImageAlt.setAttribute('content', project.thumb_alt || project.title);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', `https://august.style/${project.slug}`);
    }

    /**
     * Populate tag pills grouped by type (rendered into every `.entry-tags-card`).
     */
    function populateTagsCards(project) {
        const roles = project.role || [];
        const skills = project.skill || [];
        const products = project.product || [];

        document.querySelectorAll('.entry-tags-card').forEach(container => {
            let html = '';

            if (roles.length > 0) {
                html += '<div class="tag-pill-group tag-pill-group-role">';
                html += roles.map(tag => {
                    const tagURL = `/section.html?tags=${DataLoader.normalizeForURL(tag)}`;
                    return `<a href="${tagURL}" class="entry-tag entry-tag-role">${tag}</a>`;
                }).join('');
                html += '</div>';
            }

            if (skills.length > 0) {
                html += '<div class="tag-pill-group tag-pill-group-skill">';
                html += skills.map(tag => {
                    const tagURL = `/section.html?tags=${DataLoader.normalizeForURL(tag)}`;
                    return `<a href="${tagURL}" class="entry-tag entry-tag-skill">${tag}</a>`;
                }).join('');
                html += '</div>';
            }

            if (products.length > 0) {
                html += '<div class="tag-pill-group tag-pill-group-product">';
                html += products.map(tag => {
                    const tagURL = `/section.html?tags=${DataLoader.normalizeForURL(tag)}`;
                    return `<a href="${tagURL}" class="entry-tag entry-tag-product">${tag}</a>`;
                }).join('');
                html += '</div>';
            }

            container.innerHTML = html;
        });
    }

    /**
     * Populate the sticky tag column (right side of columns layout):
     *   - same role/skill/product tag pills as `.entry-tags-card`
     *   - optional `media_embed` iframe (YouTube/Behance) below the pills
     */
    function populateTagColumn(project) {
        const container = document.getElementById('entry-tag-column');
        if (!container) return;

        const roles = project.role || [];
        const skills = project.skill || [];
        const products = project.product || [];

        let html = '<div class="entry-tags-card">';

        if (roles.length > 0) {
            html += '<div class="tag-pill-group tag-pill-group-role">';
            html += roles.map(tag => {
                const tagURL = `/section.html?tags=${DataLoader.normalizeForURL(tag)}`;
                return `<a href="${tagURL}" class="entry-tag entry-tag-role">${tag}</a>`;
            }).join('');
            html += '</div>';
        }

        if (skills.length > 0) {
            html += '<div class="tag-pill-group tag-pill-group-skill">';
            html += skills.map(tag => {
                const tagURL = `/section.html?tags=${DataLoader.normalizeForURL(tag)}`;
                return `<a href="${tagURL}" class="entry-tag entry-tag-skill">${tag}</a>`;
            }).join('');
            html += '</div>';
        }

        if (products.length > 0) {
            html += '<div class="tag-pill-group tag-pill-group-product">';
            html += products.map(tag => {
                const tagURL = `/section.html?tags=${DataLoader.normalizeForURL(tag)}`;
                return `<a href="${tagURL}" class="entry-tag entry-tag-product">${tag}</a>`;
            }).join('');
            html += '</div>';
        }

        html += '</div>';

        if (project.media_embed) {
            html += `<div class="entry-tag-column__embed video-container" aria-label="${project.media_alt || ''}">${project.media_embed}</div>`;
        }

        container.innerHTML = html;
    }

    /**
     * Populate the hero thumbnail slideshow into #entry-hero / .entry-hero-slideshow.
     * Each thumb registers into the lightbox pool. Pagination chrome shows only
     * when there are 2+ thumbs.
     */
    function populateThumbHero(project) {
        const hero = document.getElementById('entry-hero');
        if (!hero) return;

        const thumbs = Array.isArray(project.thumb) ? project.thumb : [];
        if (thumbs.length === 0) {
            hero.style.display = 'none';
            return;
        }

        const gallery = hero.querySelector('.entry-hero-gallery');
        if (!gallery) return;

        const altText = project.thumb_alt || project.title || '';

        // Build a horizontal peeking-tile row — same pattern as the related-posts
        // .tile-gallery but the parent section bleeds full-viewport-width on
        // both desktop and mobile (see .entry-hero CSS).
        gallery.innerHTML = '';
        thumbs.forEach((url, i) => {
            const lightboxIdx = registerLightboxImage(url, altText);
            const img = document.createElement('img');
            img.src = imgSrc(url);
            img.alt = altText;
            img.className = 'entry-hero-tile';
            img.loading = i === 0 ? 'eager' : 'lazy';
            img.dataset.lightboxIndex = String(lightboxIdx);
            gallery.appendChild(img);
        });

        hero.style.display = 'block';
    }

    /**
     * Walk entry.main_media[] (groups of {title, images[], alt}).
     * Replaces legacy populateGifs / populateMobileImg.
     */
    function populateMainMedia(project) {
        const container = document.getElementById('main-media-region');
        if (!container) return;

        const groups = Array.isArray(project.main_media) ? project.main_media : [];
        const validGroups = groups.filter(g => g && Array.isArray(g.images) && g.images.length > 0);

        if (validGroups.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = '';
        validGroups.forEach(group => {
            const wrapper = document.createElement('div');
            wrapper.className = 'entry-main-media__group';

            if (group.title) {
                const heading = document.createElement('h4');
                heading.className = 'entry-main-media__title';
                heading.textContent = group.title;
                wrapper.appendChild(heading);
            }

            const row = document.createElement('div');
            row.className = 'entry-main-media__row';
            const altText = group.alt || project.title || '';

            group.images.forEach(url => {
                const lightboxIdx = registerLightboxImage(url, altText);
                const img = document.createElement('img');
                img.src = imgSrc(url);
                img.alt = altText;
                img.className = 'entry-main-media__image';
                img.loading = 'lazy';
                img.dataset.lightboxIndex = String(lightboxIdx);
                row.appendChild(img);
            });

            wrapper.appendChild(row);
            container.appendChild(wrapper);
        });

        container.style.display = 'block';
    }

    /**
     * Populate 3-across square image grid(s).
     * Prefers grouped `grids[]` schema; falls back to legacy flat `grid[]`.
     */
    function populateImageGrid(project) {
        const groupedContainer = document.getElementById('entry-image-grids');
        const legacyContainer = document.getElementById('entry-image-grid');

        const groups = Array.isArray(project.grids) ? project.grids.filter(g => g && Array.isArray(g.images) && g.images.length > 0) : [];

        if (groups.length > 0 && groupedContainer) {
            groupedContainer.innerHTML = '';
            groups.forEach(group => {
                const wrapper = document.createElement('div');
                wrapper.className = 'entry-image-grid-group';

                if (group.title) {
                    const heading = document.createElement('h4');
                    heading.className = 'entry-image-grid-title';
                    heading.textContent = group.title;
                    wrapper.appendChild(heading);
                }

                const grid = document.createElement('div');
                grid.className = 'entry-image-grid';
                const altText = group.alt || project.grid_alt || 'Project image';
                group.images.forEach(url => {
                    const lightboxIdx = registerLightboxImage(url, altText);
                    const img = document.createElement('img');
                    img.src = imgSrc(url);
                    img.alt = altText;
                    img.className = 'entry-grid-image';
                    img.loading = 'lazy';
                    img.dataset.lightboxIndex = String(lightboxIdx);
                    grid.appendChild(img);
                });
                wrapper.appendChild(grid);

                groupedContainer.appendChild(wrapper);
            });
            groupedContainer.style.display = 'block';
            if (legacyContainer) legacyContainer.style.display = 'none';
            return;
        }

        // Legacy flat grid[] path
        if (!legacyContainer || !project.grid || project.grid.length === 0) return;
        const altText = project.grid_alt || 'Project image';
        legacyContainer.innerHTML = '';
        project.grid.forEach(url => {
            const lightboxIdx = registerLightboxImage(url, altText);
            const img = document.createElement('img');
            img.src = imgSrc(url);
            img.alt = altText;
            img.className = 'entry-grid-image';
            img.loading = 'lazy';
            img.dataset.lightboxIndex = String(lightboxIdx);
            legacyContainer.appendChild(img);
        });
        legacyContainer.style.display = 'grid';
    }

    /**
     * Walk entry.bleed[] (groups of {images[], alt}); render full-bleed rows.
     */
    function populateBleed(project) {
        const container = document.getElementById('bleed-region');
        if (!container) return;

        const groups = Array.isArray(project.bleed) ? project.bleed : [];
        const validGroups = groups.filter(g => g && Array.isArray(g.images) && g.images.length > 0);

        if (validGroups.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = '';
        validGroups.forEach(group => {
            const wrapper = document.createElement('div');
            wrapper.className = 'entry-bleed';

            const row = document.createElement('div');
            row.className = 'entry-bleed__row';
            const altText = group.alt || project.title || '';

            group.images.forEach(url => {
                const lightboxIdx = registerLightboxImage(url, altText);
                const img = document.createElement('img');
                img.src = imgSrc(url);
                img.alt = altText;
                img.className = 'entry-bleed__image';
                img.loading = 'lazy';
                img.dataset.lightboxIndex = String(lightboxIdx);
                row.appendChild(img);
            });

            wrapper.appendChild(row);
            container.appendChild(wrapper);
        });

        container.style.display = 'block';
    }

    /**
     * Render entry.bleed_slides ({images[], alt}) as a single full-bleed
     * slideshow with pagination dots. NOTE: bleed_slides is an OBJECT, not
     * an array (single slideshow per entry).
     */
    function populateBleedSlides(project) {
        const container = document.getElementById('bleed-slides-region');
        if (!container) return;

        const data = project.bleed_slides;
        const images = (data && Array.isArray(data.images)) ? data.images : [];

        if (images.length === 0) {
            container.style.display = 'none';
            return;
        }

        const altText = (data && data.alt) || project.title || '';

        container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'entry-bleed-slides';

        const slot = document.createElement('div');
        slot.className = 'entry-bleed-slides__slot';
        wrapper.appendChild(slot);

        const slideEls = images.map((url, i) => {
            const lightboxIdx = registerLightboxImage(url, altText);
            const img = document.createElement('img');
            img.src = imgSrc(url);
            img.alt = altText;
            img.className = 'entry-bleed-slides__image';
            img.loading = i === 0 ? 'eager' : 'lazy';
            img.dataset.lightboxIndex = String(lightboxIdx);
            img.style.display = i === 0 ? '' : 'none';
            slot.appendChild(img);
            return img;
        });

        if (images.length > 1) {
            const dotsWrap = document.createElement('div');
            dotsWrap.className = 'entry-bleed-slides__dots';
            wrapper.appendChild(dotsWrap);

            let current = 0;
            const dots = images.map((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'entry-bleed-slides__dot' + (i === 0 ? ' is-active' : '');
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    current = i;
                    slideEls.forEach((el, idx) => {
                        el.style.display = idx === current ? '' : 'none';
                    });
                    dots.forEach((d, idx) => d.classList.toggle('is-active', idx === current));
                });
                dotsWrap.appendChild(dot);
                return dot;
            });
        }

        container.appendChild(wrapper);
        container.style.display = 'block';
    }

    /**
     * Walk entry.flow[] and emit typed-block DOM. Mount into #flow-region.
     * Each block gets `data-flow-index` for chunk-break sibling targeting.
     */
    async function populateFlowLayout(project) {
        const container = document.getElementById('flow-region');
        if (!container) return;

        const blocks = Array.isArray(project.flow) ? project.flow : [];
        if (blocks.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = '';
        let pastChunkBreak = false;

        // Render synchronously first; collection_preview blocks resolve async after.
        // (Async resolution still mounts in-place via placeholder.)
        const asyncTasks = [];

        blocks.forEach((block, i) => {
            const el = buildFlowBlock(block, i, project);
            if (!el) return;

            el.dataset.flowIndex = String(i);

            if (pastChunkBreak) {
                el.classList.add('flow-chunk-hidden');
            }

            container.appendChild(el);

            if (block.type === 'chunk_break') {
                pastChunkBreak = true;
                wireChunkBreak(el, container);
            }

            if (block.type === 'collection_preview') {
                asyncTasks.push(resolveCollectionPreview(el, block, project));
            }
        });

        container.style.display = 'block';

        // Let collection previews resolve in background.
        if (asyncTasks.length > 0) {
            await Promise.allSettled(asyncTasks);
        }
    }

    /**
     * Build a single flow block element. Returns null for unknown types
     * (and warns). collection_preview returns a placeholder that is filled
     * asynchronously by resolveCollectionPreview.
     */
    /**
     * Build a <ul> for a list block, supporting nested items. An item is either:
     *   - a string (plain leaf bullet), or
     *   - { text, items } where items is a list of strings or further nested
     *     {text, items} objects → recursively emits a sub-<ul>.
     *
     * Depth is tracked so CSS can style each level differently (different
     * bullet, indent, font size).
     */
    function buildListUL(items, style, depth) {
        const ul = document.createElement('ul');
        ul.className = `flow-list style-${style} flow-list--depth-${depth}`;
        items.forEach(item => {
            const li = document.createElement('li');
            if (typeof item === 'string') {
                li.textContent = item;
            } else if (item && typeof item === 'object') {
                li.textContent = item.text || '';
                if (Array.isArray(item.items) && item.items.length > 0) {
                    li.classList.add('flow-list__topic');
                    li.appendChild(buildListUL(item.items, style, depth + 1));
                }
            }
            ul.appendChild(li);
        });
        return ul;
    }

    function buildFlowBlock(block, index, project) {
        if (!block || !block.type) return null;

        switch (block.type) {
            case 'h3':
            case 'h4':
            case 'h5': {
                const el = document.createElement(block.type);
                el.className = `flow-${block.type}`;
                el.textContent = block.text || '';
                return el;
            }

            case 'p': {
                const el = document.createElement('p');
                el.className = 'flow-p';
                el.textContent = block.text || '';
                return el;
            }

            case 'img': {
                const wrapper = document.createElement('div');
                wrapper.className = 'flow-img';

                const row = document.createElement('div');
                row.className = 'flow-img__row';

                const images = Array.isArray(block.images) ? block.images : [];
                const altText = block.alt || '';

                images.forEach(url => {
                    const lightboxIdx = registerLightboxImage(url, altText);
                    const img = document.createElement('img');
                    img.src = imgSrc(url);
                    img.alt = altText;
                    img.className = 'flow-img__image';
                    img.loading = 'lazy';
                    img.dataset.lightboxIndex = String(lightboxIdx);
                    row.appendChild(img);
                });

                wrapper.appendChild(row);
                return wrapper;
            }

            case 'list': {
                const style = block.style || 'bluepoints';
                const items = Array.isArray(block.items) ? block.items : [];
                return buildListUL(items, style, 0);
            }

            case 'chunk_break': {
                const wrapper = document.createElement('div');
                wrapper.className = 'flow-chunk-break';
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'flow-chunk-break__btn';
                btn.textContent = block.button_text || 'Continue reading';
                wrapper.appendChild(btn);
                return wrapper;
            }

            case 'embed_html': {
                const wrapper = document.createElement('div');
                wrapper.className = 'flow-embed-html';
                if (block.alt) wrapper.setAttribute('aria-label', block.alt);
                // Trusted HTML: we authored these strings in the entry JSONs.
                wrapper.innerHTML = block.html || '';

                // Twitter blockquotes won't transform without widgets.js, and
                // <script> tags injected via innerHTML don't execute. Detect
                // and load (or re-run) widgets.js explicitly.
                if (wrapper.querySelector('.twitter-tweet')) {
                    ensureTwitterWidgets();
                }
                return wrapper;
            }

            case 'collection_preview': {
                const wrapper = document.createElement('div');
                wrapper.className = 'flow-collection-preview';
                wrapper.dataset.collectionSlug = block.collection || '';
                // Placeholder; filled by resolveCollectionPreview asynchronously.
                return wrapper;
            }

            case 'project_link': {
                // Right-aligned, stacked button. Consecutive project_links stack
                // and align to the right edge of the content column ("classy").
                // Filled default; { "variant": "ghost" } for outline.
                const wrap = document.createElement('div');
                wrap.className = 'flow-project-link';
                const a = document.createElement('a');
                a.className = block.variant === 'ghost'
                    ? 'project-link-btn project-link-btn--ghost'
                    : 'project-link-btn';
                a.href = block.url || '#';
                a.textContent = block.text || '';
                if (/^https?:\/\//i.test(block.url || '')) {
                    a.target = '_blank';
                    a.rel = 'noopener';
                }
                wrap.appendChild(a);
                return wrap;
            }

            case 'video': {
                // Paired desktop (wide) + mobile (skinny) MP4s in one row, GIF-like
                // (muted/looping/no-controls). Plays when scrolled into view.
                const wrapper = document.createElement('div');
                wrapper.className = 'flow-video';

                const row = document.createElement('div');
                row.className = 'flow-video-row';

                [['desktop', block.desktop], ['mobile', block.mobile]].forEach(([role, url]) => {
                    if (!url) return;
                    const v = document.createElement('video');
                    v.className = `flow-video-${role}`;
                    v.src = url;
                    v.muted = true;
                    v.setAttribute('muted', '');
                    v.loop = true;
                    v.playsInline = true;
                    v.setAttribute('playsinline', '');
                    v.autoplay = true;
                    v.setAttribute('autoplay', '');
                    v.preload = 'auto';   // load the first frame so it isn't blank
                    if (block.alt) v.setAttribute('aria-label', block.alt);
                    row.appendChild(v);

                    // Play on scroll-into-view — reliable iOS autoplay (the bare
                    // autoplay attr is flaky there), and shows frames immediately.
                    if ('IntersectionObserver' in window) {
                        new IntersectionObserver((entries) => {
                            entries.forEach(e => {
                                if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
                                else v.pause();
                            });
                        }, { threshold: 0.2 }).observe(v);
                    }
                });

                wrapper.appendChild(row);

                if (block.caption) {
                    const cap = document.createElement('p');
                    cap.className = 'flow-video-caption';
                    cap.textContent = block.caption;
                    wrapper.appendChild(cap);
                }
                return wrapper;
            }

            default: {
                console.warn('Unknown flow block type:', block.type);
                return null;
            }
        }
    }

    /**
     * Wire the chunk-break button. Two trigger paths converge on the same
     * reveal logic per Sean's "best of both worlds" direction:
     *   1. Manual: explicit click on the button.
     *   2. Auto-scroll: IntersectionObserver fires the reveal when the
     *      button comes into view, so a scrolling reader never needs to
     *      stop and click. The button stays as a visible affordance until
     *      either trigger fires.
     */
    /**
     * Load Twitter's widgets.js once, then call twttr.widgets.load() to
     * transform every .twitter-tweet on the page into the rendered iframe.
     * Called whenever an embed_html block contains a Twitter blockquote
     * (the <script> tag inside the embed HTML cannot execute since it's
     * being injected via innerHTML — see HTML spec on inserted scripts).
     */
    function ensureTwitterWidgets() {
        // Already loaded — just re-run the parser on any newly-added blockquotes.
        if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load();
            return;
        }
        // Loading in flight — let it finish; widgets.js auto-parses on load.
        if (document.querySelector('script[data-twitter-widgets]')) return;

        const s = document.createElement('script');
        s.src = 'https://platform.twitter.com/widgets.js';
        s.async = true;
        s.charset = 'utf-8';
        s.dataset.twitterWidgets = 'true';
        document.head.appendChild(s);
    }

    function wireChunkBreak(chunkEl, parent) {
        const btn = chunkEl.querySelector('.flow-chunk-break__btn');
        if (!btn) return;

        let revealed = false;
        const reveal = () => {
            if (revealed) return;
            revealed = true;
            const hidden = parent.querySelectorAll('.flow-chunk-hidden');
            hidden.forEach(el => {
                el.classList.remove('flow-chunk-hidden');
                el.classList.add('flow-chunk-revealed');
            });
            // Remove the entire chunk-break wrapper (not just the button) so no
            // empty space remains in the flow. Also remove any OTHER chunk_break
            // wrappers in the same parent — once the first gate opens, every
            // subsequent gate is moot (we don't ladder chunk_breaks).
            parent.querySelectorAll('.flow-chunk-break').forEach(el => el.remove());
        };

        btn.addEventListener('click', reveal);

        if ('IntersectionObserver' in window) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        reveal();
                        obs.disconnect();
                    }
                });
            }, {
                // Fire when the button is just barely visible (~25% into view).
                // rootMargin pulls the trigger slightly earlier so the reveal
                // happens before the user fully reaches the button.
                threshold: 0.1,
                rootMargin: '0px 0px -10% 0px'
            });
            obs.observe(btn);
        }
    }

    /**
     * Resolve a collection_preview block: load collection, resolve its media,
     * render a horizontal-scroll strip of the first 8 items. Failure logs a
     * warning and leaves the placeholder empty.
     */
    async function resolveCollectionPreview(wrapper, block, project) {
        const slug = block.collection;
        if (!slug) {
            console.warn('collection_preview block missing collection slug');
            return;
        }

        try {
            const collection = await DataLoader.loadCollection(slug);
            if (!collection) {
                console.warn('collection_preview: collection not found for slug', slug);
                return;
            }

            const items = await DataLoader.resolveCollectionMedia(collection);
            if (!items || items.length === 0) {
                console.warn('collection_preview: no items resolved for', slug);
                return;
            }

            const preview = items.slice(0, 8);

            const header = document.createElement('div');
            header.className = 'flow-collection-preview__header';
            const title = document.createElement('h4');
            title.className = 'flow-collection-preview__title';
            title.textContent = collection.title || slug;
            header.appendChild(title);
            wrapper.appendChild(header);

            const strip = document.createElement('div');
            strip.className = 'flow-collection-preview__strip';

            preview.forEach(item => {
                const thumbUrl = (item.thumb && item.thumb[0]) || item.src;
                if (!thumbUrl) return;
                const altText = item.thumb_alt || item.title || '';
                const lightboxIdx = registerLightboxImage(thumbUrl, altText);

                const link = document.createElement('a');
                link.className = 'flow-collection-preview__item';
                link.href = `/media.html?path=${encodeURIComponent(item.slug)}`;

                const img = document.createElement('img');
                img.src = imgSrc(thumbUrl);
                img.alt = altText;
                img.className = 'flow-collection-preview__thumb';
                img.loading = 'lazy';
                img.dataset.lightboxIndex = String(lightboxIdx);

                link.appendChild(img);
                strip.appendChild(link);
            });

            wrapper.appendChild(strip);

            const more = document.createElement('a');
            more.className = 'flow-collection-preview__more';
            more.href = `/collection.html?path=${encodeURIComponent(collection.slug || slug)}`;
            more.textContent = 'View Full Collection';
            wrapper.appendChild(more);
        } catch (err) {
            console.warn('collection_preview: failed to resolve', slug, err);
        }
    }

    /**
     * Populate multiple slideshows from slideshows array (legacy).
     */
    function populateSlideshows(project) {
        const container = document.getElementById('entry-slideshows');
        if (!container) return;

        let groups = project.slideshows || [];

        // Legacy fallback: if mobile_img exists but no slideshows
        if (groups.length === 0 && project.mobile_img && project.mobile_img.length > 0) {
            groups = [{
                title: 'Mobile Screenshots',
                type: 'mobile',
                images: project.mobile_img,
                alt: project.mobile_img_alt || 'Mobile screenshot'
            }];
        }

        if (groups.length === 0) return;

        container.innerHTML = '';
        groups.forEach((group, groupIndex) => {
            const slideshowEl = buildSlideshow(group, groupIndex);
            container.appendChild(slideshowEl);
        });
        container.style.display = 'block';
    }

    /**
     * Build a single slideshow instance (legacy slideshows[] array).
     */
    function buildSlideshow(group, groupIndex) {
        const wrapper = document.createElement('div');
        wrapper.className = 'slideshow-group';

        // Title
        if (group.title) {
            const heading = document.createElement('h4');
            heading.className = 'slideshow-title';
            heading.textContent = group.title;
            wrapper.appendChild(heading);
        }

        const isMobile = group.type === 'mobile';
        const images = group.images || [];
        if (images.length === 0) return wrapper;

        // Build slides: mobile shows 2-3 per slide, standard shows 1
        const slides = [];
        if (isMobile) {
            const perSlide = images.length <= 4 ? 2 : 3;
            for (let i = 0; i < images.length; i += perSlide) {
                slides.push(images.slice(i, i + perSlide));
            }
        } else {
            images.forEach(img => slides.push([img]));
        }

        // Slideshow container
        const slideshow = document.createElement('div');
        slideshow.className = 'slideshow';
        slideshow.dataset.groupIndex = groupIndex;

        // Main display
        const display = document.createElement('div');
        display.className = `slideshow-display ${isMobile ? 'slideshow-display-mobile' : ''}`;
        slideshow.appendChild(display);

        // Render first slide (registers into lightbox pool)
        renderSlide(display, slides[0], group.alt || '', isMobile);

        // Navigation (only if multiple slides)
        if (slides.length > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'slideshow-arrow slideshow-prev';
            prevBtn.innerHTML = '&lsaquo;';
            prevBtn.setAttribute('aria-label', 'Previous slide');
            slideshow.appendChild(prevBtn);

            const nextBtn = document.createElement('button');
            nextBtn.className = 'slideshow-arrow slideshow-next';
            nextBtn.innerHTML = '&rsaquo;';
            nextBtn.setAttribute('aria-label', 'Next slide');
            slideshow.appendChild(nextBtn);

            const counter = document.createElement('span');
            counter.className = 'slideshow-counter';
            counter.textContent = `1 / ${slides.length}`;
            slideshow.appendChild(counter);

            const strip = document.createElement('div');
            strip.className = 'slideshow-strip';
            slides.forEach((slide, i) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc(slide[0]);
                thumb.alt = group.alt || '';
                thumb.className = `slideshow-strip-thumb ${i === 0 ? 'active' : ''}`;
                thumb.loading = 'lazy';
                thumb.addEventListener('click', () => goToSlide(i));
                strip.appendChild(thumb);
            });
            slideshow.appendChild(strip);

            let currentSlide = 0;

            function goToSlide(index) {
                currentSlide = index;
                renderSlide(display, slides[index], group.alt || '', isMobile);
                counter.textContent = `${index + 1} / ${slides.length}`;
                strip.querySelectorAll('.slideshow-strip-thumb').forEach((t, i) => {
                    t.classList.toggle('active', i === index);
                });
                const activeThumb = strip.querySelector('.active');
                if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }

            prevBtn.addEventListener('click', () => goToSlide((currentSlide - 1 + slides.length) % slides.length));
            nextBtn.addEventListener('click', () => goToSlide((currentSlide + 1) % slides.length));

            // Swipe support
            let startX = 0;
            display.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
            display.addEventListener('touchend', e => {
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    goToSlide(diff > 0
                        ? (currentSlide + 1) % slides.length
                        : (currentSlide - 1 + slides.length) % slides.length);
                }
            }, { passive: true });
        }

        wrapper.appendChild(slideshow);
        return wrapper;
    }

    /**
     * Render a single slide's content into the display area.
     * Each rendered image registers into the unified lightbox pool.
     */
    function renderSlide(display, imageUrls, altText, isMobile) {
        display.innerHTML = '';
        imageUrls.forEach(url => {
            const lightboxIdx = registerLightboxImage(url, altText);
            const img = document.createElement('img');
            img.src = imgSrc(url);
            img.alt = altText || '';
            img.className = `slideshow-image ${isMobile ? 'slideshow-image-mobile' : ''}`;
            img.loading = 'lazy';
            img.dataset.lightboxIndex = String(lightboxIdx);
            display.appendChild(img);
        });
    }

    /**
     * Hide the entry-page top nav on scroll-down (past 200px), restore on
     * scroll-up. Same pattern as landing-controller.initNavCollapse — the
     * .nav-pill hamburger appears while the nav is hidden and brings it
     * back when clicked.
     */
    function initNavCollapse() {
        const nav = document.getElementById('siteNav');
        const pill = document.getElementById('navPill');
        if (!nav || !pill) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const cur = window.scrollY;
            if (cur > 200 && cur > lastScroll) {
                nav.classList.add('hide');
                pill.classList.add('vis');
            } else if (cur < lastScroll - 5) {
                nav.classList.remove('hide');
                pill.classList.remove('vis');
            }
            lastScroll = cur;
        }, { passive: true });

        pill.addEventListener('click', () => {
            nav.classList.remove('hide');
            pill.classList.remove('vis');
        });
    }

    /**
     * Populate project URL link card.
     */
    function populateProjectURL(project) {
        const container = document.getElementById('entry-project-url');
        if (!container || !project.origin_url) return;

        container.innerHTML = `
            <a href="${project.origin_url}" target="_blank" rel="noopener noreferrer" class="project-link-card">
                <span class="link-icon">&#128279;</span>
                <span class="link-url">${project.origin_url_text || project.origin_url}</span>
            </a>
        `;
        container.style.display = 'block';
    }

    /**
     * Populate GitHub repository card.
     */
    function populateGitHubRepo(url) {
        const container = document.getElementById('entry-github-repo');
        if (!container) return;

        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        const repoName = match ? `${match[1]}/${match[2]}` : url;

        container.innerHTML = `
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="github-repo-card">
                <svg class="github-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span class="repo-name">${repoName}</span>
            </a>
        `;
        container.style.display = 'block';
    }

    /**
     * Generate related posts using 6-hour time-seeded random.
     */
    function generateRelatedPosts(currentProject, allProjects) {
        const otherProjects = allProjects.filter(p => p.id !== currentProject.id);
        if (otherProjects.length === 0) return [];

        const timeSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 6));
        function seededRandom(seed) {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        }

        return otherProjects
            .map((project, index) => ({ project, score: seededRandom(timeSeed + index) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(item => item.project);
    }

    /**
     * Populate related posts section.
     */
    async function populateRelatedPosts(currentProject) {
        const container = document.getElementById('related-posts-grid');
        if (!container) return;

        const allProjects = await DataLoader.loadAllProjects();
        const relatedPosts = generateRelatedPosts(currentProject, allProjects);

        if (relatedPosts.length === 0) {
            container.innerHTML = '<p class="text-secondary">No related posts available.</p>';
            return;
        }

        relatedPosts.forEach((project, index) => {
            const tile = TileRenderer.renderSectionTile(project);
            tile.style.animationDelay = `${index * 100}ms`;
            container.appendChild(tile);
        });
    }

    /**
     * Populate top-of-page text content (title, subtitle, role, body copy).
     * Shared by both layouts; columns layout uses the challenge/approach/result
     * fields, flow layout typically renders body text via flow[] blocks.
     */
    function populateContent(project) {
        const titleEl = document.getElementById('entry-title');
        if (titleEl) titleEl.textContent = project.title;

        const subtitleEl = document.getElementById('entry-subtitle');
        if (subtitleEl) subtitleEl.textContent = project.subtitle;

        const roleEl = document.getElementById('entry-role');
        if (roleEl) roleEl.textContent = (project.role && project.role[0]) || '';

        // Columns-layout body text.
        const challengeEl = document.getElementById('entry-challenge');
        if (challengeEl) challengeEl.textContent = project.challenge || '';

        const approachEl = document.getElementById('entry-approach');
        if (approachEl) approachEl.textContent = project.approach || '';

        const resultEl = document.getElementById('entry-result');
        if (resultEl) resultEl.textContent = project.result || '';
    }

    /**
     * Orchestrate the columns layout (default).
     * Two-column structure: text on left, sticky tag/embed column on right
     * (the v4.2.3 home for tags — top + bottom .entry-tags-card are hidden
     * to avoid duplicate tag rendering).
     */
    function populateColumnsLayout(project) {
        hideTagsCardsLegacy();
        populateContent(project);
        populateThumbHero(project);
        populateTagColumn(project);
        populateMainMedia(project);
        populateImageGrid(project);
        populateSlideshows(project);
        if (project.origin_url) populateProjectURL(project);
        if (project.repository) populateGitHubRepo(project.repository);
        populateBleed(project);
        populateBleedSlides(project);
    }

    /**
     * Populate gallery-layout copy: same title/subtitle/role as columns, but
     * the left text column is gated to TWO blurbs — `challenge` relabelled
     * "About" + `approach` relabelled "Details"; the RESULT section is hidden.
     */
    function populateGalleryContent(project) {
        const titleEl = document.getElementById('entry-title');
        if (titleEl) titleEl.textContent = project.title;

        const subtitleEl = document.getElementById('entry-subtitle');
        if (subtitleEl) subtitleEl.textContent = project.subtitle;

        const roleEl = document.getElementById('entry-role');
        if (roleEl) roleEl.textContent = (project.role && project.role[0]) || '';

        // "About" <- challenge
        const challengeEl = document.getElementById('entry-challenge');
        if (challengeEl) {
            challengeEl.textContent = project.challenge || '';
            relabelSection(challengeEl, 'About');
        }

        // "Details" <- approach
        const approachEl = document.getElementById('entry-approach');
        if (approachEl) {
            approachEl.textContent = project.approach || '';
            relabelSection(approachEl, 'Details');
        }

        // Omit result entirely — hide its section wrapper.
        const resultEl = document.getElementById('entry-result');
        if (resultEl) {
            const section = resultEl.closest('.entry-section');
            if (section) section.style.display = 'none';
        }
    }

    /**
     * Relabel the .section-label heading that sits in the same .entry-section
     * as `bodyEl`. Used by the gallery layout to turn CHALLENGE/APPROACH into
     * About/Details without touching the shared entry.html markup.
     */
    function relabelSection(bodyEl, label) {
        const section = bodyEl.closest('.entry-section');
        if (!section) return;
        const heading = section.querySelector('.section-label');
        if (heading) heading.textContent = label;
    }

    /**
     * Orchestrate the gallery layout (third layout).
     * Mirrors columns (hero thumbnail-slideshow + bleed/main_media/grids shell)
     * but the left copy column shows only the two gallery blurbs (About +
     * Details), and a capped bleed-style preview row is rendered per collection
     * listed in project.collections[].
     */
    async function populateGalleryLayout(project) {
        hideTagsCardsLegacy();
        populateGalleryContent(project);
        populateThumbHero(project);
        populateTagColumn(project);
        populateMainMedia(project);
        populateImageGrid(project);
        populateSlideshows(project);
        if (project.origin_url) populateProjectURL(project);
        if (project.repository) populateGitHubRepo(project.repository);
        populateBleed(project);
        populateBleedSlides(project);
        await populateGalleryCollections(project);
    }

    /**
     * Render the gallery entry's collection preview as a justified bleed wall —
     * SAME shape as the homepage bleed: all images across the entry's
     * collections, shuffled, laid into 3 rows of a random 3–5 images each. No
     * per-collection titles (the rows just flow). Each image links to its own
     * nested collection page (`/<entry>/<coll>`). Mounted into #bleed-region.
     */
    async function populateGalleryCollections(project) {
        const slugs = Array.isArray(project.collections) ? project.collections : [];
        if (slugs.length === 0) return;

        const container = document.getElementById('bleed-region');
        if (!container) return;

        const entrySlug = project.slug || '';

        // Gather every image across the entry's collections (each tagged with its
        // own collection so it links to the right nested page).
        const pool = [];
        for (const slug of slugs) {
            try {
                const collectionKey = slug.includes('/') ? slug : `${entrySlug}/${slug}`;
                const collection = await DataLoader.loadCollection(collectionKey);
                if (!collection) {
                    console.warn('gallery collection not found for slug', collectionKey);
                    continue;
                }
                const images = DataLoader.resolveCollectionImages(collection);
                const href = '/' + entrySlug + '/' + (collection.slug || slug);
                const alt = collection.thumb_alt || collection.title || project.title || '';
                images.forEach(src => pool.push({ src, href, alt }));
            } catch (err) {
                console.warn('gallery collection failed to resolve', slug, err);
            }
        }
        if (!pool.length) return;

        // Fisher-Yates shuffle — fresh each reload.
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // Mobile: 4 rows, 2-4 per row. Desktop: 3 rows, 3-5 per row.
        const isMobile = window.matchMedia('(max-width: 47.9375rem)').matches;
        const rowCount = isMobile ? 4 : 3;
        let cursor = 0;
        for (let r = 0; r < rowCount && cursor < pool.length; r++) {
            const count = isMobile ? (2 + Math.floor(Math.random() * 3)) : (3 + Math.floor(Math.random() * 3));
            const slice = pool.slice(cursor, cursor + count);
            cursor += count;
            if (!slice.length) break;

            const wrapper = document.createElement('div');
            wrapper.className = 'entry-bleed entry-bleed--collection';
            const row = document.createElement('div');
            row.className = 'entry-bleed__row';

            slice.forEach(o => {
                const link = document.createElement('a');
                link.href = o.href;
                link.className = 'entry-bleed__link';

                const img = document.createElement('img');
                img.src = imgSrc(o.src);
                img.alt = o.alt;
                img.className = 'entry-bleed__image';
                img.loading = 'lazy';

                // Justified row: flex-grow = aspect ratio so every image in the
                // row shares one height while keeping its natural width.
                const applyAR = () => {
                    const ar = (img.naturalWidth && img.naturalHeight)
                        ? (img.naturalWidth / img.naturalHeight) : 1.5;
                    link.style.flexGrow = String(ar);
                };
                if (img.complete && img.naturalWidth) applyAR();
                else img.addEventListener('load', applyAR, { once: true });

                link.appendChild(img);
                row.appendChild(link);
            });

            wrapper.appendChild(row);
            container.appendChild(wrapper);
        }
        container.style.display = 'block';
    }

    /**
     * Orchestrate the flow layout.
     * Single-column long-form. Tags live in the top + bottom .entry-tags-card
     * (the sticky right column is hidden because there's no two-column anchor
     * in flow). Body is the typed sequence walked from entry.flow[]. Media
     * regions outside flow[] are intentionally not rendered.
     */
    async function populateFlow(project) {
        populateTagsCards(project);
        populateContent(project);
        populateThumbHero(project);
        hideTagColumnAndContentMedia();
        if (project.origin_url) populateProjectURL(project);
        if (project.repository) populateGitHubRepo(project.repository);
        await populateFlowLayout(project);
    }

    /**
     * Hide the top + bottom .entry-tags-card containers — used by columns
     * layout where tags live in the sticky right column instead.
     */
    function hideTagsCardsLegacy() {
        document.querySelectorAll('.entry-tags-layout').forEach(el => {
            el.style.display = 'none';
        });
    }

    /**
     * Hide the .entry-content-media two-column wrapper (which holds the
     * sticky #entry-tag-column) — used by flow layout where the wrapper
     * has no left text column to anchor against.
     */
    function hideTagColumnAndContentMedia() {
        const wrapper = document.querySelector('.entry-content-media');
        if (wrapper) wrapper.style.display = 'none';
    }

    /**
     * Initialize entry page.
     */
    async function init() {
        try {
            // Reset the shared lightbox pool at the start of every page load.
            window.Lightbox.reset();

            const entryPath = getEntryPath();
            const project = await loadEntryData(entryPath);

            if (!project) {
                console.error('Failed to load project data');
                document.body.innerHTML = '<div class="container"><h1>Entry not found</h1></div>';
                return;
            }

            populateMetadata(project);

            // Top-level layout dispatch.
            const layout = project.layout;
            if (layout === 'flow') {
                await populateFlow(project);
            } else if (layout === 'gallery') {
                await populateGalleryLayout(project);
            } else {
                if (layout && layout !== 'columns') {
                    console.warn(`Unknown layout "${layout}" — defaulting to columns`);
                }
                populateColumnsLayout(project);
            }

            window.Lightbox.init();
            initNavCollapse();
            await populateRelatedPosts(project);
        } catch (error) {
            console.error('Error initializing entry page:', error);
        }
    }

    return {
        init,
        loadEntryData,
        generateRelatedPosts
    };
})();

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', EntryController.init);
} else {
    EntryController.init();
}
