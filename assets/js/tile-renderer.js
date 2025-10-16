/**
 * TILE RENDERER
 * Creates HTML for project tiles
 * Handles both homepage tiles (large/square) and section tiles (wide/short)
 * Magazine aesthetic: Section tiles show only teaser text, no titles
 */

const TileRenderer = (() => {

    /**
     * Render a section tile (magazine aesthetic - text + images only)
     * Text cycles through tile_text array as images swipe
     */
    function renderSectionTile(project) {
        const { categorization, content } = project;
        const { placement } = categorization;
        const { teaser_copy, media } = content;

        // Build entry URL
        const section = DataLoader.normalizeForURL(placement.section);
        const subsection = DataLoader.normalizeForURL(placement.sub_section);
        const slug = placement.slug;
        const entryURL = `/${section}/${subsection}/${slug}`;

        // Get thumbnail images (all available)
        const thumbnails = media.thumbnail_images || [];
        
        // Get tile text (all available)
        const tileTexts = teaser_copy.tile_text || [];
        
        // Fallback if no tile_text provided
        const defaultText = teaser_copy.page_subtitle || teaser_copy.page_title || '';
        if (tileTexts.length === 0 && defaultText) {
            tileTexts.push(defaultText);
        }

        // Create tile HTML
        const tile = document.createElement('a');
        tile.href = entryURL;
        tile.className = 'tile-section fade-in-item';
        tile.setAttribute('data-entry-id', categorization.entry_id);
        tile.setAttribute('data-current-index', '0');

        // Build images HTML (all images, first one active)
        const imagesHTML = thumbnails.length > 0 ? 
            thumbnails.map((img, index) => `
                <img 
                    src="/${img}" 
                    alt="${teaser_copy.page_title}" 
                    class="tile-section__image ${index === 0 ? 'active' : ''}"
                    loading="lazy"
                />
            `).join('') : '';

        // Build text HTML (all texts, first one visible)
        const textHTML = tileTexts.length > 0 ?
            tileTexts.map((text, index) => `
                <p class="tile-section__text" 
                   style="display: ${index === 0 ? 'block' : 'none'};"
                   data-text-index="${index}">
                    ${text}
                </p>
            `).join('') : '';

        tile.innerHTML = `
            <div class="tile-section__content">
                ${textHTML}
            </div>
            <div class="tile-section__images">
                <div class="tile-section__image-container">
                    ${imagesHTML}
                </div>
            </div>
        `;

        // Add swipe functionality (cycles both images and text)
        if (thumbnails.length > 1) {
            addSectionTileSwipe(tile, thumbnails.length, tileTexts.length);
        }

        return tile;
    }

    /**
     * Add swipe functionality to section tiles
     * Cycles through images AND corresponding text
     */
    function addSectionTileSwipe(tile, imageCount, textCount) {
        let startX = 0;
        let currentIndex = 0;

        const images = tile.querySelectorAll('.tile-section__image');
        const texts = tile.querySelectorAll('.tile-section__text');

        // Touch start
        tile.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        // Touch end
        tile.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            // Swipe threshold: 50px
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < imageCount - 1) {
                    // Swipe left - next
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    // Swipe right - previous
                    currentIndex--;
                }

                updateSectionTile();
            }
        }, { passive: true });

        function updateSectionTile() {
            // Update images
            images.forEach((img, index) => {
                img.classList.toggle('active', index === currentIndex);
            });

            // Update text (cycle through available texts)
            const textIndex = currentIndex % textCount;
            texts.forEach((text, index) => {
                text.style.display = index === textIndex ? 'block' : 'none';
            });

            // Store current index
            tile.setAttribute('data-current-index', currentIndex);
        }
    }

    /**
     * Render a homepage tile (large/square format)
     * Used on homepage to link to section pages
     * Shows 1/8th bleed of next image (handled in CSS)
     */
    function renderHomepageTile(sectionData) {
        const { title, subtitle, images, texts, link } = sectionData;

        const tile = document.createElement('a');
        tile.href = link;
        tile.className = 'tile-homepage fade-in-item';
        tile.setAttribute('data-current-index', '0');

        // Create carousel HTML (no dots - just images with bleed)
        const carouselHTML = `
            <div class="tile-homepage__image-carousel">
                <div class="tile-homepage__images">
                    ${images.map((img, index) => `
                        <img 
                            src="${img}" 
                            alt="${title}" 
                            class="tile-homepage__image"
                            loading="lazy"
                        />
                    `).join('')}
                </div>
            </div>
        `;

        // Get first text or fallback to subtitle
        const displayText = texts && texts.length > 0 ? texts[0] : subtitle;

        tile.innerHTML = `
            ${carouselHTML}
            <div class="tile-homepage__content">
                <h2 class="tile-homepage__title">${title}</h2>
                <p class="tile-homepage__subtitle">${subtitle}</p>
                ${displayText ? `<p class="tile-homepage__text">${displayText}</p>` : ''}
            </div>
        `;

        // Add swipe functionality
        if (images.length > 1) {
            addHomepageTileSwipe(tile, images.length, texts);
        }

        return tile;
    }

    /**
     * Add swipe functionality to homepage tiles
     * Cycles through images and optionally text
     */
    function addHomepageTileSwipe(tile, imageCount, texts) {
        const carousel = tile.querySelector('.tile-homepage__images');
        const textElement = tile.querySelector('.tile-homepage__text');

        let startX = 0;
        let currentIndex = 0;

        // Touch start
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        // Touch end
        carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            // Swipe threshold: 50px
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < imageCount - 1) {
                    // Swipe left - next
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    // Swipe right - previous
                    currentIndex--;
                }

                updateHomepageTile();
            }
        }, { passive: true });

        function updateHomepageTile() {
            // Move carousel (each image is 87.5% width with 12.5% margin)
            carousel.style.transform = `translateX(-${currentIndex * 87.5}%)`;
            
            // Update text if available
            if (textElement && texts && texts.length > 0) {
                const textIndex = currentIndex % texts.length;
                textElement.style.opacity = '0';
                
                setTimeout(() => {
                    textElement.textContent = texts[textIndex];
                    textElement.style.opacity = '1';
                }, 150); // Half of transition duration for smooth cross-fade
            }

            tile.setAttribute('data-current-index', currentIndex);
        }
    }

    /**
     * Clear a container and show loading state
     */
    function showLoading(container) {
        if (!container) return;
        container.innerHTML = '';
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'flex';
        }
    }

    /**
     * Hide loading state
     */
    function hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    /**
     * Show empty state
     */
    function showEmptyState() {
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    }

    /**
     * Hide empty state
     */
    function hideEmptyState() {
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    /**
     * Render multiple section tiles into a container
     * Tiles appear in random order, maintained during filtering
     */
    function renderSectionTiles(projects, container) {
        showLoading(container);
        hideEmptyState();

        // Small delay to show loading state
        setTimeout(() => {
            container.innerHTML = '';

            if (projects.length === 0) {
                hideLoading();
                showEmptyState();
                return;
            }

            // Render each tile
            projects.forEach((project, index) => {
                const tile = renderSectionTile(project);

                // Stagger animation by setting delay dynamically
                tile.style.animationDelay = `${index * 100}ms`;

                container.appendChild(tile);
            });

            hideLoading();
        }, 100);
    }

    // Public API
    return {
        renderSectionTile,
        renderHomepageTile,
        renderSectionTiles,
        showLoading,
        hideLoading,
        showEmptyState,
        hideEmptyState
    };
})();
