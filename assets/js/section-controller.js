/**
 * SECTION CONTROLLER
 * Main orchestrator for section.html
 * Determines view type from URL, loads data, manages filtering
 * Handles sophisticated filter display: section pages vs click-through pages
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
    let shuffledProjects = []; // Store initial shuffle to maintain order during filtering
    let viewType = null;
    let featuredTags = [];

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
     * Load featured tags from configuration
     */
    async function loadFeaturedTags() {
        try {
            const response = await fetch('/assets/js/featured.json');
            if (!response.ok) {
                console.warn('Featured tags not found, using all tags');
                return [];
            }
            const data = await response.json();
            return data.toggle_tags || [];
        } catch (error) {
            console.warn('Error loading featured tags:', error);
            return [];
        }
    }

    /**
     * Update page title and main filter heading
     */
    function updatePageHeader() {
        let mainFilterHeading = null;

        switch (viewType.type) {
            case 'all':
                pageTitle.textContent = 'All Projects';
                pageSubtitle.textContent = `${shuffledProjects.length} projects across all categories`;
                break;

            case 'section':
                // Capitalize section name
                const sectionName = viewType.section.charAt(0).toUpperCase() + viewType.section.slice(1);

                // Show section as main filter heading (small, above title)
                mainFilterHeading = sectionName;

                pageTitle.textContent = 'Projects';
                pageSubtitle.textContent = `${shuffledProjects.length} ${sectionName.toLowerCase()} projects`;
                break;

            case 'subsection':
                // Find a project to get the formatted subsection name
                if (shuffledProjects.length > 0) {
                    const firstProject = shuffledProjects[0];
                    const sectionName = firstProject.categorization.placement.section;
                    const subsectionName = firstProject.categorization.placement.sub_section;

                    // Show subsection as main heading
                    mainFilterHeading = `${sectionName} › ${subsectionName}`;

                    pageTitle.textContent = subsectionName;
                    pageSubtitle.textContent = `${shuffledProjects.length} projects`;
                }
                break;
        }

        // Display main filter heading if present
        displayMainFilterHeading(mainFilterHeading);
    }

    /**
     * Display main filter heading above filters
     */
    function displayMainFilterHeading(heading) {
        // Remove existing heading if present
        const existing = document.querySelector('.main-filter-heading');
        if (existing) {
            existing.remove();
        }

        if (!heading) return;

        // Create and insert heading
        const headingElement = document.createElement('div');
        headingElement.className = 'main-filter-heading';
        headingElement.textContent = heading;

        // Insert before tag filters
        const container = document.querySelector('.tag-filters-container');
        if (container) {
            container.insertBefore(headingElement, container.firstChild);
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

            // Shuffle projects ONCE for random ordering
            shuffledProjects = DataLoader.shuffleArray(currentProjects);

            return shuffledProjects;

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

        // Apply tag filtering if any tags are active (beyond sticky filter)
        let projectsToRender = shuffledProjects;

        // Filter out sticky filter for tag filtering logic
        const stickyFilter = FilterController.getStickyFilter();
        const filterTags = activeTags.filter(tag => tag !== stickyFilter);

        if (filterTags.length > 0) {
            projectsToRender = DataLoader.filterByTags(shuffledProjects, filterTags);
        }

        // Render tiles (maintains shuffle order, just hides non-matching)
        TileRenderer.renderSectionTiles(projectsToRender, tileGrid);

        // Update page header
        updatePageHeader();
    }

    /**
     * Get tags to display based on page type
     * Section pages: subsection + role + featured tags
     * Click-through pages: section + subsection + role + all contextual tags
     */
    function getTagsForDisplay() {
        const tagsWithTypes = [];
        const seenTags = new Set();

        // Helper to add unique tags
        function addTag(tag, type) {
            const normalized = DataLoader.normalizeForURL(tag);
            if (!seenTags.has(normalized)) {
                seenTags.add(normalized);
                tagsWithTypes.push({ tag, type });
            }
        }

        if (viewType.type === 'section' || viewType.type === 'subsection') {
            // SECTION-TYPE PAGE: Show subsection, role, and featured tags

            // 1. Add subsections from current projects
            const subsections = new Set();
            shuffledProjects.forEach(project => {
                subsections.add(project.categorization.placement.sub_section);
            });
            subsections.forEach(sub => addTag(sub, 'subsection'));

            // 2. Add roles from current projects
            const roles = new Set();
            shuffledProjects.forEach(project => {
                const roleArray = project.categorization.tagging.role;
                if (Array.isArray(roleArray)) {
                    roleArray.forEach(role => roles.add(role));
                }
            });
            roles.forEach(role => addTag(role, 'role'));

            // 3. Add featured tags (if they exist in current projects)
            if (featuredTags.length > 0) {
                const allProjectTags = new Set();
                shuffledProjects.forEach(project => {
                    const tagging = project.categorization.tagging;
                    ['technology', 'media', 'skill'].forEach(category => {
                        if (Array.isArray(tagging[category])) {
                            tagging[category].forEach(tag => allProjectTags.add(tag));
                        }
                    });
                });

                featuredTags.forEach(featuredTag => {
                    if (allProjectTags.has(featuredTag)) {
                        addTag(featuredTag, 'contextual');
                    }
                });
            }

        } else {
            // CLICK-THROUGH PAGE (from entry page tag): Show all tags

            // 1. Add sections
            const sections = new Set();
            shuffledProjects.forEach(project => {
                sections.add(project.categorization.placement.section);
            });
            sections.forEach(section => addTag(section, 'subsection')); // Use subsection color

            // 2. Add subsections
            const subsections = new Set();
            shuffledProjects.forEach(project => {
                subsections.add(project.categorization.placement.sub_section);
            });
            subsections.forEach(sub => addTag(sub, 'subsection'));

            // 3. Add roles
            const roles = new Set();
            shuffledProjects.forEach(project => {
                const roleArray = project.categorization.tagging.role;
                if (Array.isArray(roleArray)) {
                    roleArray.forEach(role => roles.add(role));
                }
            });
            roles.forEach(role => addTag(role, 'role'));

            // 4. Add all contextual tags
            const contextualTags = new Set();
            shuffledProjects.forEach(project => {
                const tagging = project.categorization.tagging;
                ['technology', 'media', 'skill'].forEach(category => {
                    if (Array.isArray(tagging[category])) {
                        tagging[category].forEach(tag => contextualTags.add(tag));
                    }
                });
            });
            contextualTags.forEach(tag => addTag(tag, 'contextual'));
        }

        return tagsWithTypes;
    }

    /**
     * Setup filter pills
     */
    function setupFilters() {
        // Determine sticky filter based on view type
        let stickyFilter = null;

        if (viewType.type === 'section') {
            // Sticky filter is the section
            stickyFilter = viewType.section;
        } else if (viewType.type === 'subsection') {
            // Sticky filter is the subsection
            stickyFilter = viewType.subsection;
        }

        // Get tags to display (based on page type)
        const tagsWithTypes = getTagsForDisplay();

        // Render filter pills
        FilterController.renderFilterPills(tagsWithTypes, tagFiltersContainer);

        // Initialize filter controller with callback and sticky filter
        FilterController.init((activeTags) => {
            // Re-render when filters change
            renderView();
        }, stickyFilter);
    }

    /**
     * Initialize the page
     */
    async function init() {
        // Parse URL to determine view
        viewType = parseURL();

        // Load featured tags
        featuredTags = await loadFeaturedTags();

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
