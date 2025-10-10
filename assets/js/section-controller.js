/**
 * SECTION CONTROLLER
 * Main orchestrator for section.html
 * Determines view type from URL, loads data, manages filtering
 */

(async () => {
    // DOM elements
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const tileGrid = document.getElementById('tile-grid');
    const tagFiltersContainer = document.getElementById('tag-filters');

    // State
    let allProjects = [];
    let currentProjects = [];
    let viewType = null;
    let viewData = {};

    /**
     * Parse URL path to determine view type and parameters
     * Returns: { type: 'all'|'section'|'subsection', section, subsection }
     */
    function parseURL() {
        // Check for redirected path from 404.html
        const redirectPath = sessionStorage.getItem('sectionPath');
        const path = redirectPath || window.location.pathname;

        // Clear session storage after reading
        if (redirectPath) {
            sessionStorage.removeItem('sectionPath');
        }

        // Remove leading/trailing slashes and split
        const segments = path.replace(/^\/|\/$/g, '').split('/').filter(Boolean);

        if (segments.length === 0 || segments[0] === 'projects') {
            // /projects or / -> Show all projects
            return { type: 'all' };
        } else if (segments.length === 1) {
            // /web -> Section view
            return {
                type: 'section',
                section: segments[0]
            };
        } else if (segments.length === 2) {
            // /web/html-css-js -> Subsection view
            return {
                type: 'subsection',
                section: segments[0],
                subsection: segments[1]
            };
        }

        // Default to all
        return { type: 'all' };
    }

    /**
     * Update page title and subtitle based on view
     */
    function updatePageHeader() {
        switch (viewType.type) {
            case 'all':
                pageTitle.textContent = 'All Projects';
                pageSubtitle.textContent = `${allProjects.length} projects across all categories`;
                break;

            case 'section':
                // Capitalize first letter
                const sectionName = viewType.section.charAt(0).toUpperCase() + viewType.section.slice(1);
                pageTitle.textContent = sectionName;
                pageSubtitle.textContent = `${currentProjects.length} projects`;
                break;

            case 'subsection':
                // Find a project to get the formatted subsection name
                if (currentProjects.length > 0) {
                    const firstProject = currentProjects[0];
                    pageTitle.textContent = firstProject.categorization.placement.sub_section;
                    pageSubtitle.textContent = `${currentProjects.length} ${firstProject.categorization.placement.section.toLowerCase()} projects`;
                }
                break;
        }
    }

    /**
     * Load projects based on view type
     */
    async function loadProjects() {
        TileRenderer.showLoading(tileGrid);

        try {
            // Load all projects
            allProjects = await DataLoader.loadAllProjects();

            // Filter based on view type
            switch (viewType.type) {
                case 'all':
                    currentProjects = allProjects;
                    break;

                case 'section':
                    currentProjects = DataLoader.filterBySection(allProjects, viewType.section);
                    break;

                case 'subsection':
                    currentProjects = DataLoader.filterBySubsection(
                        allProjects,
                        viewType.section,
                        viewType.subsection
                    );
                    break;
            }

            // Shuffle projects for random ordering
            currentProjects = DataLoader.shuffleArray(currentProjects);

            return currentProjects;

        } catch (error) {
            console.error('Error loading projects:', error);
            TileRenderer.hideLoading();
            return [];
        }
    }

    /**
     * Render the current view
     */
    function renderView() {
        // Get active tags from filter controller
        const activeTags = FilterController.getActiveTags();

        // Apply tag filtering if any tags are active
        let projectsToRender = currentProjects;
        if (activeTags.length > 0) {
            projectsToRender = DataLoader.filterByTags(currentProjects, activeTags);
        }

        // Render tiles
        TileRenderer.renderSectionTiles(projectsToRender, tileGrid);

        // Update page header
        updatePageHeader();
    }

    /**
     * Setup filter pills
     */
    function setupFilters() {
        // Get all unique tags from current projects
        const allTags = DataLoader.getAllTags(currentProjects);

        // Render filter pills
        FilterController.renderFilterPills(allTags, tagFiltersContainer);

        // Initialize filter controller with callback
        FilterController.init((activeTags) => {
            // Re-render when filters change
            renderView();
        });
    }

    /**
     * Initialize the page
     */
    async function init() {
        // Parse URL to determine view
        viewType = parseURL();

        // Load projects
        await loadProjects();

        // Setup filters
        setupFilters();

        // Initial render
        renderView();
    }

    // Start the app
    init().catch(error => {
        console.error('Failed to initialize:', error);
        TileRenderer.hideLoading();
    });

})();
