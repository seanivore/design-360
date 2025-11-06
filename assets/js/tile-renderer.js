/**
 * TILE RENDERER
 * Creates HTML for project tiles using the unified tile system
 * Magazine aesthetic: Clean, scrollable horizontal galleries
 */

const TileRenderer = (() => {

    /**
     * Render a section tile (magazine aesthetic)
     * Uses window/absolute positioning for reliable scroll behavior
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

        // Get thumbnail images
        const thumbnails = media.thumbnail_images || [];

        // Get tile text (first one for display)
        const tileTexts = teaser_copy?.tile_text || [];
        const displayText = tileTexts[0] || teaser_copy?.page_subtitle || teaser_copy?.page_title || 'View Project';

        // Alt text
        const altText = media.thumb_slideshow_alt_text || teaser_copy?.page_title || 'Project image';

        // Create tile wrapper
        const tile = document.createElement('div');
        tile.className = 'tile fade-in-item';
        tile.setAttribute('data-entry-id', categorization.entry_id);

        // Build gallery window (fixed viewport)
        const galleryWindow = document.createElement('div');
        galleryWindow.className = 'tile-gallery-window';

        // Build gallery container (absolute positioned scroll)
        const gallery = document.createElement('div');
        gallery.className = 'tile-gallery';

        // Add images to gallery
        thumbnails.forEach(img => {
            const image = document.createElement('img');
            image.src = `/${img}`;
            image.alt = altText;
            image.className = 'tile-image';
            image.loading = 'lazy';
            gallery.appendChild(image);
        });

        galleryWindow.appendChild(gallery);

        // Build text area
        const textArea = document.createElement('a');
        textArea.href = entryURL;
        textArea.className = 'tile-text-area';

        const text = document.createElement('p');
        text.className = 'tile-text';
        text.textContent = displayText;

        textArea.appendChild(text);

        // Assemble tile
        tile.appendChild(galleryWindow);
        tile.appendChild(textArea);

        // Set up text cycling if multiple texts available
        if (tileTexts.length > 1) {
            let currentIndex = 0;
            setInterval(() => {
                currentIndex = (currentIndex + 1) % tileTexts.length;
                text.style.opacity = '0';
                setTimeout(() => {
                    text.textContent = tileTexts[currentIndex];
                    text.style.opacity = '1';
                }, 200);
            }, 4000);
        }

        return tile;
    }


    /**
     * Render a homepage tile with dual-row gallery
     * @param {Object} tileData - Data from homepage-controller
     *   {
     *     section: 'Web',
     *     sectionURL: '/web',
     *     thumbnailImagesTop: [...],    // Top row images
     *     thumbnailImagesBottom: [...], // Bottom row images
     *     altText: 'Alt text',
     *     projectCount: 5
     *   }
     */
    function renderHomepageTile(tileData) {
        const { section, sectionURL, thumbnailImagesTop, thumbnailImagesBottom, altText, projectCount } = tileData;

        // Create tile wrapper
        const tile = document.createElement('div');
        tile.className = 'tile-homepage fade-in-item';
        tile.setAttribute('data-section', section);

        // Create dual-row gallery container
        const gallery = document.createElement('div');
        gallery.className = 'tile-homepage-gallery';

        // Create top row
        const topRowWindow = document.createElement('div');
        topRowWindow.className = 'tile-homepage-gallery-window';

        const topRow = document.createElement('div');
        topRow.className = 'tile-homepage-gallery-row';

        thumbnailImagesTop.forEach(img => {
            const image = document.createElement('img');
            image.src = `/${img}`;
            image.alt = altText;
            image.className = 'tile-homepage-image';
            image.loading = 'lazy';
            topRow.appendChild(image);
        });

        topRowWindow.appendChild(topRow);

        // Create bottom row
        const bottomRowWindow = document.createElement('div');
        bottomRowWindow.className = 'tile-homepage-gallery-window';

        const bottomRow = document.createElement('div');
        bottomRow.className = 'tile-homepage-gallery-row';

        thumbnailImagesBottom.forEach(img => {
            const image = document.createElement('img');
            image.src = `/${img}`;
            image.alt = altText;
            image.className = 'tile-homepage-image';
            image.loading = 'lazy';
            bottomRow.appendChild(image);
        });

        bottomRowWindow.appendChild(bottomRow);

        // Assemble gallery
        gallery.appendChild(topRowWindow);
        gallery.appendChild(bottomRowWindow);

        // Create text area with header
        const textArea = document.createElement('a');
        textArea.href = sectionURL;
        textArea.className = 'tile-homepage-text';

        const header = document.createElement('div');
        header.className = 'tile-homepage-header';

        const sectionName = document.createElement('span');
        sectionName.className = 'tile-homepage-section';
        sectionName.textContent = `${section.toUpperCase()} PROJECTS`;

        const count = document.createElement('span');
        count.className = 'tile-homepage-count';
        count.textContent = `(${projectCount})`;

        header.appendChild(sectionName);
        header.appendChild(count);

        textArea.appendChild(header);

        // Assemble tile
        tile.appendChild(gallery);
        tile.appendChild(textArea);

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
     */
    function renderSectionTiles(projects, container) {
        showLoading(container);
        hideEmptyState();

        setTimeout(() => {
            container.innerHTML = '';

            if (projects.length === 0) {
                hideLoading();
                showEmptyState();
                return;
            }

            projects.forEach((project, index) => {
                try {
                    const tile = renderSectionTile(project);
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