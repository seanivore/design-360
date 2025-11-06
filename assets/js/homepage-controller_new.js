/**
 * HOMEPAGE CONTROLLER
 * Manages homepage section tiles with dynamic section detection
 * and proportional thumbnail distribution
 * 
 * Pulls thumbnails proportionally based on project count per section
 * Example: If Web has 14 projects (70%) and Print has 6 (30%),
 * thumbnails are allocated 70/30 accordingly
 */

const HomepageController = (() => {
    const THUMBNAILS_PER_ROW = 6;  // Number of thumbnails per row (12 total)

    /**
     * Get all unique sections dynamically from projects
     * @param {Array} allProjects - All loaded projects
     * @returns {Array} - Array of section names
     */
    function extractSections(allProjects) {
        const sections = new Set();
        allProjects.forEach(project => {
            const section = project.categorization.placement.section;
            if (section) {
                sections.add(section);
            }
        });
        return Array.from(sections);
    }

    /**
     * Count projects per section
     * @param {Array} allProjects - All loaded projects
     * @returns {Object} - { 'Web': 14, 'Print': 3, ... }
     */
    function countProjectsPerSection(allProjects) {
        const counts = {};
        allProjects.forEach(project => {
            const section = project.categorization.placement.section;
            if (section) {
                counts[section] = (counts[section] || 0) + 1;
            }
        });
        return counts;
    }

    /**
     * Calculate proportional thumbnail allocation
     * Uses "largest remainder method" for fair rounding
     * @param {Object} sectionCounts - { 'Web': 14, 'Digital': 3 }
     * @param {Number} totalThumbnails - Total thumbnails to allocate (12)
     * @returns {Object} - { 'Web': 10, 'Digital': 2 }
     */
    function calculateProportionalAllocation(sectionCounts, totalThumbnails) {
        const totalProjects = Object.values(sectionCounts).reduce((sum, count) => sum + count, 0);

        if (totalProjects === 0) {
            return {};
        }

        const allocation = {};
        const remainders = {};
        let allocatedSoFar = 0;

        // Calculate exact proportions and floor them
        Object.entries(sectionCounts).forEach(([section, count]) => {
            const exactShare = (count / totalProjects) * totalThumbnails;
            const flooredShare = Math.floor(exactShare);
            allocation[section] = flooredShare;
            remainders[section] = exactShare - flooredShare;
            allocatedSoFar += flooredShare;
        });

        // Distribute remaining slots to sections with largest remainders
        const remaining = totalThumbnails - allocatedSoFar;
        const sortedByRemainder = Object.entries(remainders)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);

        for (let i = 0; i < remaining; i++) {
            const section = sortedByRemainder[i];
            allocation[section] += 1;
        }

        console.log('📊 Proportional allocation:', allocation);

        return allocation;
    }

    /**
     * Select random thumbnails from a section
     * @param {String} section - Section name
     * @param {Array} allProjects - All loaded projects
     * @param {Number} count - Number of thumbnails to get
     * @returns {Array} - Array of thumbnail paths
     */
    function selectRandomThumbnails(section, allProjects, count) {
        const sectionProjects = DataLoader.filterBySection(allProjects, section);

        if (sectionProjects.length === 0 || count === 0) {
            return [];
        }

        // Shuffle projects for random selection
        const shuffledProjects = DataLoader.shuffleArray([...sectionProjects]);
        const thumbnails = [];

        // Pull one thumbnail from each project until we have enough
        let projectIndex = 0;
        while (thumbnails.length < count) {
            const project = shuffledProjects[projectIndex % shuffledProjects.length];
            const projectThumbnails = project.content.media.thumbnail_images || [];

            if (projectThumbnails.length > 0) {
                // Randomly select one thumbnail from this project
                const randomThumbIndex = Math.floor(Math.random() * projectThumbnails.length);
                thumbnails.push(projectThumbnails[randomThumbIndex]);
            }

            projectIndex++;

            // Safety check: prevent infinite loop
            if (projectIndex > shuffledProjects.length * 10) {
                console.warn(`⚠️ Could only gather ${thumbnails.length}/${count} thumbnails for ${section}`);
                break;
            }
        }

        console.log(`🎲 Selected ${thumbnails.length} thumbnails for ${section}`);

        return thumbnails;
    }

    /**
     * Shuffle the order of sections
     */
    function shuffleSectionOrder(sections) {
        return DataLoader.shuffleArray(sections);
    }

    /**
     * Build homepage tile data for a section
     * @param {String} section - Section name
     * @param {Array} allProjects - All projects
     * @param {Number} thumbnailCount - Number of thumbnails for this section
     * @returns {Object} - Tile data for rendering
     */
    function buildHomepageTileData(section, allProjects, thumbnailCount) {
        // Get project count for display
        const sectionProjects = DataLoader.filterBySection(allProjects, section);
        const projectCount = sectionProjects.length;

        // Get proportionally allocated thumbnails
        const allThumbnails = selectRandomThumbnails(section, allProjects, thumbnailCount);

        // Split into top and bottom rows (as evenly as possible)
        const halfPoint = Math.ceil(allThumbnails.length / 2);
        const thumbnailImagesTop = allThumbnails.slice(0, halfPoint);
        const thumbnailImagesBottom = allThumbnails.slice(halfPoint);

        // Section URL
        const sectionURL = `/${DataLoader.normalizeForURL(section)}`;

        // Alt text
        const altText = `${section} project thumbnails`;

        return {
            section,
            sectionURL,
            thumbnailImagesTop,
            thumbnailImagesBottom,
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
            TileRenderer.showLoading(container);

            // Load all projects
            const allProjects = await DataLoader.loadAllProjects();

            if (allProjects.length === 0) {
                console.warn('⚠️ No projects loaded');
                TileRenderer.hideLoading();
                return;
            }

            console.log(`✅ Loaded ${allProjects.length} total projects`);

            // Extract sections dynamically
            const sections = extractSections(allProjects);
            console.log('🗂️ Detected sections:', sections);

            if (sections.length === 0) {
                console.warn('⚠️ No sections found');
                TileRenderer.hideLoading();
                return;
            }

            // Count projects per section
            const sectionCounts = countProjectsPerSection(allProjects);
            console.log('📊 Projects per section:', sectionCounts);

            // Calculate proportional thumbnail allocation
            const totalThumbnails = THUMBNAILS_PER_ROW * 2;  // 12 total per tile
            const thumbnailAllocation = calculateProportionalAllocation(sectionCounts, totalThumbnails);

            // Shuffle section order for variety on each reload
            const shuffledSections = shuffleSectionOrder(sections);
            console.log('🔀 Shuffled section order:', shuffledSections);

            // Build tile data for each section
            const tilesToRender = [];

            for (const section of shuffledSections) {
                const thumbnailCount = thumbnailAllocation[section] || 0;

                if (thumbnailCount === 0) {
                    console.warn(`⚠️ Skipping ${section} - no thumbnails allocated`);
                    continue;
                }

                // Build tile data with proportionally allocated thumbnails
                const tileData = buildHomepageTileData(section, allProjects, thumbnailCount);
                tilesToRender.push(tileData);
            }

            // Clear container
            container.innerHTML = '';

            // Render tiles with staggered fade-in
            tilesToRender.forEach((tileData, index) => {
                const tile = TileRenderer.renderHomepageTile(tileData);
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
        loadHomepageTiles();
    }

    // Public API
    return {
        init,
        loadHomepageTiles,
        extractSections,
        countProjectsPerSection,
        calculateProportionalAllocation
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