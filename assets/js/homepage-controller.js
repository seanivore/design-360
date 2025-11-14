/**
 * HOMEPAGE CONTROLLER
 * Manages homepage section tiles with dynamic section detection
 * and random thumbnail selection from section-tagged projects
 * 
 * Pulls 12 random thumbnails from projects tagged with each section
 * When a section has <10 entries, distributes images equally from all entries
 */

const HomepageController = (() => {
    const THUMBNAILS_TOTAL = 12;  // Total thumbnails per homepage tile (two rows of 6)

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
     * Select random thumbnails from a section
     * When section has >=10 entries: no duplicates needed
     * When section has <10 entries: distribute equally from all entries
     * @param {String} section - Section name
     * @param {Array} allProjects - All loaded projects
     * @param {Number} count - Number of thumbnails to get (12)
     * @returns {Array} - Array of thumbnail paths
     */
    function selectRandomThumbnails(section, allProjects, count) {
        const sectionProjects = DataLoader.filterBySection(allProjects, section);

        if (sectionProjects.length === 0) {
            return [];
        }

        // Shuffle projects for random selection
        const shuffledProjects = DataLoader.shuffleArray([...sectionProjects]);
        const thumbnails = [];

        // If we have 10+ projects, no need to duplicate
        if (sectionProjects.length >= 10) {
            // Pull one random thumbnail from each project until we have 12
            let projectIndex = 0;
            while (thumbnails.length < count && projectIndex < shuffledProjects.length * 2) {
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
        } else {
            // Less than 10 projects: distribute equally from all entries
            const thumbsPerProject = Math.ceil(count / sectionProjects.length);
            
            shuffledProjects.forEach(project => {
                const projectThumbnails = project.content.media.thumbnail_images || [];
                
                // Shuffle this project's thumbnails
                const shuffledThumbs = DataLoader.shuffleArray([...projectThumbnails]);
                
                // Take up to thumbsPerProject thumbnails from this project
                const thumbsToTake = Math.min(thumbsPerProject, shuffledThumbs.length);
                for (let i = 0; i < thumbsToTake && thumbnails.length < count; i++) {
                    thumbnails.push(shuffledThumbs[i]);
                }
            });

            // If still need more, cycle through again
            let projectIndex = 0;
            while (thumbnails.length < count) {
                const project = shuffledProjects[projectIndex % shuffledProjects.length];
                const projectThumbnails = project.content.media.thumbnail_images || [];

                if (projectThumbnails.length > 0) {
                    const randomThumbIndex = Math.floor(Math.random() * projectThumbnails.length);
                    thumbnails.push(projectThumbnails[randomThumbIndex]);
                }

                projectIndex++;

                // Safety check
                if (projectIndex > shuffledProjects.length * 20) {
                    console.warn(`⚠️ Could only gather ${thumbnails.length}/${count} thumbnails for ${section}`);
                    break;
                }
            }
        }

        console.log(`🎲 Selected ${thumbnails.length} thumbnails for ${section} (${sectionProjects.length} projects)`);

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
     * @returns {Object} - Tile data for rendering
     */
    function buildHomepageTileData(section, allProjects) {
        // Get project count for display
        const sectionProjects = DataLoader.filterBySection(allProjects, section);
        const projectCount = sectionProjects.length;

        // Get 12 random thumbnails from this section
        const allThumbnails = selectRandomThumbnails(section, allProjects, THUMBNAILS_TOTAL);

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

            // Shuffle section order for variety on each reload
            const shuffledSections = shuffleSectionOrder(sections);
            console.log('🔀 Shuffled section order:', shuffledSections);

            // Build tile data for each section (12 thumbnails each)
            const tilesToRender = [];

            for (const section of shuffledSections) {
                // Build tile data with 12 random thumbnails from this section
                const tileData = buildHomepageTileData(section, allProjects);
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
        countProjectsPerSection
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