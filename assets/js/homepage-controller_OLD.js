/**
 * HOMEPAGE CONTROLLER
 * Manages homepage section tiles with random project selection
 * Each section tile randomly selects ONE project from that section
 * Section tiles shuffle order on every reload
 */

const HomepageController = (() => {
    // The four main sections
    const SECTIONS = ['Web', 'Print', 'Digital', 'Video'];

    /**
     * Select a random project from a given section
     * @param {String} section - Section name (Web, Print, Digital, Video)
     * @param {Array} allProjects - All loaded projects
     * @returns {Object|null} - Random project from that section
     */
    function selectRandomProjectFromSection(section, allProjects) {
        const sectionProjects = DataLoader.filterBySection(allProjects, section);

        if (sectionProjects.length === 0) {
            console.warn(`⚠️ No projects found for section: ${section}`);
            return null;
        }

        // Pick random project
        const randomIndex = Math.floor(Math.random() * sectionProjects.length);
        const selectedProject = sectionProjects[randomIndex];

        console.log(`🎲 Selected random project for ${section}:`, selectedProject.categorization.entry_id);

        return selectedProject;
    }

    /**
     * Count total projects in a section
     * @param {String} section - Section name
     * @param {Array} allProjects - All loaded projects
     * @returns {Number} - Count of projects in section
     */
    function countProjectsInSection(section, allProjects) {
        const sectionProjects = DataLoader.filterBySection(allProjects, section);
        return sectionProjects.length;
    }

    /**
     * Shuffle the order of the four sections
     * @returns {Array} - Shuffled array of section names
     */
    function shuffleSectionOrder() {
        return DataLoader.shuffleArray(SECTIONS);
    }

    /**
     * Build homepage tile data object for a section
     * @param {String} section - Section name
     * @param {Object} project - Random project selected for this section
     * @param {Number} projectCount - Total projects in section
     * @returns {Object} - Tile data for rendering
     */
    function buildHomepageTileData(section, project, projectCount) {
        const { content } = project;
        const { teaser_copy, media } = content;

        // Section URL
        const sectionURL = `/${DataLoader.normalizeForURL(section)}`;

        // Thumbnail images from selected project
        const thumbnailImages = media.thumbnail_images || [];

        // Tile text from selected project
        const tileTexts = teaser_copy.tile_text || [];

        // Alt text from selected project
        const altText = media.thumb_slideshow_alt_text || teaser_copy.page_title || `${section} project`;

        return {
            section,
            sectionURL,
            thumbnailImages,
            tileTexts,
            altText,
            projectCount
        };
    }

    /**
     * Load and render all homepage tiles
     */
    async function loadHomepageTiles() {
        console.log('📂 Loading homepage tiles...');

        const container = document.getElementById('homepage-tile-grid');
        if (!container) {
            console.error('❌ Homepage tile grid container not found');
            return;
        }

        try {
            // Show loading state
            TileRenderer.showLoading(container);

            // Load all projects
            const allProjects = await DataLoader.loadAllProjects();

            if (allProjects.length === 0) {
                console.warn('⚠️ No projects loaded');
                TileRenderer.hideLoading();
                return;
            }

            console.log(`✅ Loaded ${allProjects.length} total projects`);

            // Shuffle section order for variety on each reload
            const shuffledSections = shuffleSectionOrder();
            console.log('🔀 Shuffled section order:', shuffledSections);

            // Build tile data for each section
            const tilesToRender = [];

            for (const section of shuffledSections) {
                // Select random project from this section
                const randomProject = selectRandomProjectFromSection(section, allProjects);

                if (!randomProject) {
                    console.warn(`⚠️ Skipping ${section} - no projects found`);
                    continue;
                }

                // Count projects in section
                const projectCount = countProjectsInSection(section, allProjects);

                // Build tile data
                const tileData = buildHomepageTileData(section, randomProject, projectCount);
                tilesToRender.push(tileData);
            }

            // Clear container
            container.innerHTML = '';

            // Render tiles with staggered fade-in
            tilesToRender.forEach((tileData, index) => {
                const tile = TileRenderer.renderHomepageTile(tileData);

                // Stagger animation
                tile.style.animationDelay = `${index * 100}ms`;

                container.appendChild(tile);
            });

            TileRenderer.hideLoading();
            console.log(`✅ Rendered ${tilesToRender.length} homepage tiles`);

        } catch (error) {
            console.error('❌ Error loading homepage tiles:', error);
            TileRenderer.hideLoading();
        }
    }

    /**
     * Initialize homepage
     */
    function init() {
        console.log('🚀 Initializing homepage controller...');

        // Load tiles on page load
        loadHomepageTiles();
    }

    // Public API
    return {
        init,
        loadHomepageTiles,
        selectRandomProjectFromSection,
        countProjectsInSection,
        shuffleSectionOrder
    };
})();

// Auto-initialize if on homepage
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('homepage-tile-grid')) {
            HomepageController.init();
        }
    });
} else {
    if (document.getElementById('homepage-tile-grid')) {
        HomepageController.init();
    }
}
