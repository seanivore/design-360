/**
 * TILE RENDERER
 * Creates HTML for project tiles
 * Handles both homepage tiles (large/square) and section tiles (wide/short)
 * Magazine aesthetic: Section tiles show only teaser text, no titles
 */

const TileRenderer = (() => {

    /**
     * Render a section tile (magazine aesthetic - text + images only)
     * Simplified horizontal scroll design matching tag filters UX
     */
    function renderSectionTile(project) {
        const { categorization, content } = project;
        const { placement } = categorization;
        const { media = {}, teaser_copy = {} } = content;

        // Build entry URL
        const section = DataLoader.normalizeForURL(placement.section);
        const subsection = DataLoader.normalizeForURL(placement.sub_section);
        const slug = placement.slug;
        const entryURL = `/${section}/${subsection}/${slug}`;

        // Get thumbnail images (all available)
        const thumbnails = media.thumbnail_images || [];

        // Get tile text (use first one initially, then cycle)
        const tileTexts = teaser_copy?.tile_text || [];
        const displayText = tileTexts[0] || teaser_copy?.page_subtitle || teaser_copy?.page_title || 'View Project';

        // Alt text
        const altText = teaser_copy?.page_title || 'Project image';

        // Create wrapper container (100% width)
        const tile = document.createElement('div');
        tile.className = 'tile-section-wrapper fade-in-item';
        tile.setAttribute('data-entry-id', categorization.entry_id);

        // Build horizontal scrolling image gallery (100% width)
        const imagesHTML = thumbnails.length > 0 ? `
            <div class="tile-section__image-scroll">
                ${thumbnails.map(img => `
                    <img
                        src="/${img}"
                        alt="${altText}"
                        class="tile-section__image"
                        loading="lazy"
                    />
                `).join('')}
            </div>
        ` : '';

        // Build text area (90% width)
        const textHTML = `
            <a href="${entryURL}" class="tile-section__text-area">
                <p class="tile-section__text">${displayText}</p>
            </a>
        `;

        tile.innerHTML = `
            ${imagesHTML}
            ${textHTML}
        `;

        // Set up text cycling if there are multiple texts
        if (tileTexts.length > 1) {
            const textElement = tile.querySelector('.tile-section__text');
            let currentIndex = 0;

            setInterval(() => {
                currentIndex = (currentIndex + 1) % tileTexts.length;
                if (textElement) {
                    textElement.style.transition = 'opacity 0.3s ease';
                    textElement.style.opacity = '0';
                    setTimeout(() => {
                        textElement.textContent = tileTexts[currentIndex];
                        textElement.style.opacity = '1';
                    }, 200);
                }
            }, 4000); // Change text every 4 seconds
        }

        return tile;
    }


    /**
     * Render a homepage tile
     * Simplified horizontal scroll design with section name and project count
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

        // Wrapper at 100% width
        const tile = document.createElement('div');
        tile.className = 'homepage-tile-wrapper fade-in-item';
        tile.setAttribute('data-section', section);

        // Build horizontal scrolling image gallery (100% width)
        const imagesHTML = thumbnailImages.length > 0 ? `
            <div class="homepage-tile__image-scroll">
                ${thumbnailImages.map(img => `
                    <img
                        src="/${img}"
                        alt="${altText}"
                        class="homepage-tile__image"
                        loading="lazy"
                    />
                `).join('')}
            </div>
        ` : '';

        // Get display text (use first one initially, then cycle)
        const displayText = tileTexts[0] || '';

        // Build text area with section header (90% width)
        const textHTML = `
            <a href="${sectionURL}" class="homepage-tile__text-area">
                <p class="homepage-tile__text">${displayText}</p>
                <div class="homepage-tile__header">
                    <span class="section-name">${section.toUpperCase()} PROJECTS</span>
                    <span class="project-count">(${projectCount})</span>
                </div>
            </a>
        `;

        tile.innerHTML = `
            ${imagesHTML}
            ${textHTML}
        `;

        // Set up text cycling if there are multiple texts
        if (tileTexts.length > 1) {
            const textElement = tile.querySelector('.homepage-tile__text');
            let currentIndex = 0;

            setInterval(() => {
                currentIndex = (currentIndex + 1) % tileTexts.length;
                if (textElement) {
                    textElement.style.opacity = '0';
                    setTimeout(() => {
                        textElement.textContent = tileTexts[currentIndex];
                        textElement.style.opacity = '1';
                    }, 200);
                }
            }, 4000); // Change text every 4 seconds
        }

        return tile;
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
                try {
                    const tile = renderSectionTile(project);

                    // Stagger animation by setting delay dynamically
                    tile.style.animationDelay = `${index * 100}ms`;

                    container.appendChild(tile);
                } catch (error) {
                    console.error(`❌ Failed to render tile for project:`, project.categorization?.entry_id, error);
                }
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
