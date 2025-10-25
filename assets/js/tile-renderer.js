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
        // DEBUG: Log exactly what keys we have
        console.log('🔍 renderSectionTile - project keys:', project ? Object.keys(project) : 'null');
        console.log('🔍 renderSectionTile - has teaser_copy:', project && 'teaser_copy' in project);
        console.log('🔍 renderSectionTile - has page_copy:', project && 'page_copy' in project);

        const { categorization, content, teaser_copy } = project;
        const { placement } = categorization;
        const { media } = content;

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
        let startY = 0;
        let currentIndex = 0;
        let isSwiping = false;

        const images = tile.querySelectorAll('.tile-section__image');
        const texts = tile.querySelectorAll('.tile-section__text');
        const imageContainer = tile.querySelector('.tile-section__image-container');

        // Touch start
        tile.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = false;
        });

        // Touch move - detect if user is swiping
        tile.addEventListener('touchmove', (e) => {
            const moveX = Math.abs(e.touches[0].clientX - startX);
            const moveY = Math.abs(e.touches[0].clientY - startY);

            // If horizontal movement > vertical, it's a swipe
            if (moveX > moveY && moveX > 10) {
                isSwiping = true;
            }
        });

        // Touch end
        tile.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            // Swipe threshold: 50px
            if (isSwiping && Math.abs(diff) > 50) {
                e.preventDefault(); // Prevent link navigation
                e.stopPropagation();

                if (diff > 0 && currentIndex < imageCount - 1) {
                    // Swipe left - next
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    // Swipe right - previous
                    currentIndex--;
                }

                updateSectionTile();
            }
        });

        // Desktop: Click on image container to cycle
        if (imageContainer) {
            imageContainer.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Cycle to next image
                currentIndex = (currentIndex + 1) % imageCount;
                updateSectionTile();
            });
        }

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
     * Render a homepage tile (1:1 square format)
     * Used on homepage to link to section pages
     * Shows section overlay, count badge, and random project images/text
     * @param {Object} tileData - Data from homepage-controller
     *   {
     *     section: 'Web',
     *     sectionURL: '/web',
     *     thumbnailImages: [...],
     *     tileTexts: [...],
     *     altText: 'Alt text for images',
     *     projectCount: 5
     *   }
     */
    function renderHomepageTile(tileData) {
        const { section, sectionURL, thumbnailImages, tileTexts, altText, projectCount } = tileData;

        const tile = document.createElement('a');
        tile.href = sectionURL;
        tile.className = 'homepage-tile fade-in-item';
        tile.setAttribute('data-current-index', '0');
        tile.setAttribute('data-section', section);

        // Count badge (top-right)
        const badgeHTML = `
            <div class="homepage-tile__count-badge">
                ${projectCount} project${projectCount !== 1 ? 's' : ''}
            </div>
        `;

        // Images container
        const imagesHTML = thumbnailImages.length > 0 ? `
            <div class="homepage-tile__images">
                ${thumbnailImages.map((img, index) => `
                    <img
                        src="/${img}"
                        alt="${altText}"
                        class="homepage-tile__image ${index === 0 ? 'active' : ''}"
                        loading="lazy"
                    />
                `).join('')}
            </div>
        ` : '';

        // Section overlay (with gradient background and section name)
        const overlayHTML = `
            <div class="homepage-tile__overlay">
                <span class="section-name">${section.toUpperCase()}</span>
            </div>
        `;

        // Tile text container (cycles with images if available)
        const textHTML = tileTexts.length > 0 ? `
            <div class="homepage-tile__text">
                ${tileTexts.map((text, index) => `
                    <p style="display: ${index === 0 ? 'block' : 'none'};" data-text-index="${index}">
                        ${text}
                    </p>
                `).join('')}
            </div>
        ` : '';

        tile.innerHTML = `
            ${badgeHTML}
            ${imagesHTML}
            ${overlayHTML}
            ${textHTML}
        `;

        // Add swipe functionality if multiple images
        if (thumbnailImages.length > 1) {
            addHomepageTileSwipe(tile, thumbnailImages.length, tileTexts.length);
        }

        return tile;
    }

    /**
     * Add swipe functionality to homepage tiles
     * Cycles through images and text
     */
    function addHomepageTileSwipe(tile, imageCount, textCount) {
        let startX = 0;
        let startY = 0;
        let currentIndex = 0;
        let isSwiping = false;

        const images = tile.querySelectorAll('.homepage-tile__image');
        const texts = tile.querySelectorAll('.homepage-tile__text p');
        const imagesContainer = tile.querySelector('.homepage-tile__images');

        // Touch start
        tile.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = false;
        });

        // Touch move - detect if user is swiping
        tile.addEventListener('touchmove', (e) => {
            const moveX = Math.abs(e.touches[0].clientX - startX);
            const moveY = Math.abs(e.touches[0].clientY - startY);

            // If horizontal movement > vertical, it's a swipe
            if (moveX > moveY && moveX > 10) {
                isSwiping = true;
            }
        });

        // Touch end
        tile.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            // Swipe threshold: 50px
            if (isSwiping && Math.abs(diff) > 50) {
                e.preventDefault(); // Prevent link navigation
                e.stopPropagation();

                if (diff > 0 && currentIndex < imageCount - 1) {
                    // Swipe left - next
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    // Swipe right - previous
                    currentIndex--;
                }

                updateHomepageTile();
            }
        });

        // Desktop: Click on images container to cycle
        if (imagesContainer) {
            imagesContainer.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Cycle to next image
                currentIndex = (currentIndex + 1) % imageCount;
                updateHomepageTile();
            });
        }

        function updateHomepageTile() {
            // Update images - simple active class toggle
            images.forEach((img, index) => {
                img.classList.toggle('active', index === currentIndex);
            });

            // Update text (cycle through available texts)
            if (textCount > 0) {
                const textIndex = currentIndex % textCount;
                texts.forEach((text, index) => {
                    text.style.display = index === textIndex ? 'block' : 'none';
                });
            }

            // Store current index
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
