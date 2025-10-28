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

        // Get tile text (just use first one - simpler)
        const tileTexts = teaser_copy?.tile_text || [];
        const displayText = tileTexts[0] || teaser_copy?.page_subtitle || teaser_copy?.page_title || 'View Project';

        // Alt text
        const altText = teaser_copy?.page_title || 'Project image';

        // Create tile container
        const tile = document.createElement('div');
        tile.className = 'tile-section fade-in-item';
        tile.setAttribute('data-entry-id', categorization.entry_id);

        // Build horizontal scrolling image gallery
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

        // Build text area
        const textHTML = `
            <a href="${entryURL}" class="tile-section__text-area">
                <p class="tile-section__text">${displayText}</p>
            </a>
        `;

        tile.innerHTML = `
            ${imagesHTML}
            ${textHTML}
        `;

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

        const tile = document.createElement('div');
        tile.className = 'homepage-tile fade-in-item';
        tile.setAttribute('data-section', section);

        // Build horizontal scrolling image gallery
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

        // Get display text (just use first one - simpler)
        const displayText = tileTexts[0] || '';

        // Build text area with section header
        const textHTML = `
            <a href="${sectionURL}" class="homepage-tile__text-area">
                <p class="homepage-tile__text">${displayText}</p>
                <div class="homepage-tile__header">
                    <span class="section-name">${section.toUpperCase()}</span>
                    <span class="project-count">${projectCount} project${projectCount !== 1 ? 's' : ''}</span>
                </div>
            </a>
        `;

        tile.innerHTML = `
            ${imagesHTML}
            ${textHTML}
        `;

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
