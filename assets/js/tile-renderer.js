/**
 * TILE RENDERER
 * Creates HTML for project tiles
 * Handles both homepage tiles (large/square) and section tiles (wide/short)
 */

const TileRenderer = (() => {

    /**
     * Render a section tile (wide/short format with images to side)
     * Used on section pages to link to entry pages
     */
    function renderSectionTile(project) {
        const { categorization, content } = project;
        const { placement, tagging } = categorization;
        const { teaser_copy, media } = content;

        // Build entry URL
        const section = DataLoader.normalizeForURL(placement.section);
        const subsection = DataLoader.normalizeForURL(placement.sub_section);
        const slug = placement.slug;
        const entryURL = `/${section}/${subsection}/${slug}`;

        // Get first 3 thumbnail images
        const thumbnails = media.thumbnail_images.slice(0, 3);

        // Get first tile text line
        const tileText = teaser_copy.tile_text?.[0] || '';

        // Create tile HTML
        const tile = document.createElement('a');
        tile.href = entryURL;
        tile.className = 'tile-section fade-in-item';
        tile.setAttribute('data-entry-id', categorization.entry_id);

        tile.innerHTML = `
      <div class="tile-section__content">
        <h3 class="tile-section__title">${teaser_copy.page_title}</h3>
        <p class="tile-section__subtitle">${placement.sub_section}</p>
        <p class="tile-section__text">${tileText}</p>
      </div>
      <div class="tile-section__images">
        ${thumbnails.map(img => `
          <img 
            src="/${img}" 
            alt="${teaser_copy.page_title}" 
            class="tile-section__image"
            loading="lazy"
          />
        `).join('')}
      </div>
    `;

        return tile;
    }

    /**
     * Render a homepage tile (large/square format)
     * Used on homepage to link to section pages
     */
    function renderHomepageTile(sectionData) {
        const { title, subtitle, images, link } = sectionData;

        const tile = document.createElement('a');
        tile.href = link;
        tile.className = 'tile-homepage fade-in-item';

        // Create carousel HTML
        const carouselHTML = `
      <div class="tile-homepage__image-carousel">
        <div class="tile-homepage__images" data-current-index="0">
          ${images.map(img => `
            <img 
              src="${img}" 
              alt="${title}" 
              class="tile-homepage__image"
              loading="lazy"
            />
          `).join('')}
        </div>
        <div class="tile-homepage__dots">
          ${images.map((_, index) => `
            <span class="tile-homepage__dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
          `).join('')}
        </div>
      </div>
    `;

        tile.innerHTML = `
      ${carouselHTML}
      <div class="tile-homepage__content">
        <h2 class="tile-homepage__title">${title}</h2>
        <p class="tile-homepage__subtitle">${subtitle}</p>
      </div>
    `;

        // Add swipe functionality
        addSwipeFunctionality(tile);

        return tile;
    }

    /**
     * Add basic swipe functionality to homepage tiles
     * Touch-based navigation through images
     */
    function addSwipeFunctionality(tile) {
        const carousel = tile.querySelector('.tile-homepage__images');
        const dots = tile.querySelectorAll('.tile-homepage__dot');
        const images = carousel.querySelectorAll('.tile-homepage__image');

        if (images.length <= 1) return; // No need for swipe if only one image

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
                if (diff > 0 && currentIndex < images.length - 1) {
                    // Swipe left - next image
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    // Swipe right - previous image
                    currentIndex--;
                }

                updateCarousel();
            }
        }, { passive: true });

        function updateCarousel() {
            // Move carousel
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            carousel.setAttribute('data-current-index', currentIndex);

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }

    /**
     * Clear a container and show loading state
     */
    function showLoading(container) {
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
