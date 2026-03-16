/**
 * SECTION CONTROLLER (v5.0)
 * Universal tag page -- works for any tag or combination of tags
 * Tags come from 4 groups: role, skill, product, company
 * URL: section.html?tags=Web+Developer or #tags=Web+Developer
 */

(async () => {
    // DOM elements
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const tileGrid = document.getElementById('tile-grid');
    const tagFiltersContainer = document.getElementById('tag-filters');

    // State
    let allProjects = [];
    let shuffledProjects = [];
    let activeTags = [];

    /**
     * Parse tags from URL parameters or hash
     * Supports: ?tags=Web+Developer or #tags=Web+Developer
     */
    function parseURL() {
        const tags = [];

        // Manually parse query string to preserve + as delimiter
        const search = window.location.search.slice(1); // remove ?
        const tagsMatch = search.match(/tags?=([^&]+)/);

        if (tagsMatch) {
            tagsMatch[1].split('+').forEach(tag => {
                const decoded = decodeURIComponent(tag.replace(/-/g, ' '));
                if (decoded) tags.push(decoded);
            });
        }

        // Check hash for additional/alternative tags
        const hash = window.location.hash.slice(1);
        if (hash) {
            const tagMatch = hash.match(/tags?=([^&]+)/);
            if (tagMatch) {
                tagMatch[1].split('+').forEach(tag => {
                    const decoded = decodeURIComponent(tag.replace(/-/g, ' '));
                    if (decoded && !tags.some(t =>
                        DataLoader.normalizeForURL(t) === DataLoader.normalizeForURL(decoded)
                    )) {
                        tags.push(decoded);
                    }
                });
            }
        }

        // Check for redirected path from 404.html
        const redirectPath = sessionStorage.getItem('sectionPath');
        if (redirectPath && tags.length === 0) {
            sessionStorage.removeItem('sectionPath');
            const cleanPath = redirectPath.replace(/^\/|\/$/g, '');
            if (cleanPath && cleanPath !== 'section.html' && cleanPath !== 'projects') {
                tags.push(cleanPath);
            }
        }

        return tags;
    }

    /**
     * Find the display name for a URL-normalized tag
     */
    function resolveTagDisplayName(normalizedTag, projects) {
        const allTags = DataLoader.getAllTags(projects);
        const match = allTags.find(t => DataLoader.normalizeForURL(t) === normalizedTag);
        return match || normalizedTag;
    }

    /**
     * Update page header
     */
    function updatePageHeader(filteredCount) {
        const count = filteredCount || shuffledProjects.length;

        pageTitle.textContent = `${count} Projects`;
        pageSubtitle.textContent = '';

        if (activeTags.length > 0) {
            const tagNames = activeTags.map(t => resolveTagDisplayName(t, allProjects));
            document.title = `${tagNames.join(', ')} Projects | Sean August Horvath`;
        } else {
            document.title = 'All Projects | Sean August Horvath';
        }

        // Update meta tags
        const description = `Portfolio showcasing ${count} projects by Sean August Horvath.`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', description);
    }

    /**
     * Load and filter projects
     */
    async function loadProjects() {
        TileRenderer.showLoading(tileGrid);

        try {
            allProjects = await DataLoader.loadAllProjects();

            // Filter by active tags if any (OR logic — show projects with ANY matching tag)
            let filtered = allProjects;
            if (activeTags.length > 0) {
                const resolvedTags = activeTags.map(tag =>
                    resolveTagDisplayName(tag, allProjects)
                );
                activeTags = resolvedTags.map(t => DataLoader.normalizeForURL(t));
                filtered = DataLoader.filterByAnyTag(allProjects, resolvedTags);
            }

            shuffledProjects = DataLoader.shuffleArray(filtered);
            return shuffledProjects;

        } catch (error) {
            console.error('Error loading projects:', error);
            TileRenderer.hideLoading();
            return [];
        }
    }

    /**
     * Render tiles
     */
    function renderView(filteredProjects) {
        const projects = filteredProjects || shuffledProjects;
        TileRenderer.renderSectionTiles(projects, tileGrid);
        updatePageHeader(projects.length);
    }

    /**
     * Get filter tags to display
     * Shows all tags present on the currently displayed projects
     * Uses all 4 tag groups: role, skill, product (skip company)
     */
    function getTagsForDisplay() {
        const tagsWithTypes = [];
        const seenTags = new Set();
        const activeNormalized = new Set(activeTags.map(t => DataLoader.normalizeForURL(t)));
        const tagsByType = DataLoader.getTagsByType(allProjects);

        // Add role tags first, then skill, then product (skip company)
        ['role', 'skill', 'product'].forEach(type => {
            (tagsByType[type] || []).forEach(tag => {
                const normalized = DataLoader.normalizeForURL(tag);
                if (!seenTags.has(normalized) && !activeNormalized.has(normalized)) {
                    seenTags.add(normalized);
                    tagsWithTypes.push({ tag, type });
                }
            });
        });

        return tagsWithTypes;
    }

    /**
     * Setup filters
     */
    function setupFilters() {
        const tagsWithTypes = getTagsForDisplay();

        // Set position relative on container for dropdown positioning
        if (tagFiltersContainer) {
            tagFiltersContainer.style.position = 'relative';
        }

        FilterController.renderFilters(tagsWithTypes, tagFiltersContainer, allProjects);

        FilterController.init((newActiveTags, mode) => {
            // Re-filter using the selected match mode (any = OR, all = AND)
            let filtered = allProjects;
            if (newActiveTags.length > 0) {
                const resolvedTags = newActiveTags.map(t =>
                    resolveTagDisplayName(t, allProjects)
                );
                filtered = mode === 'all'
                    ? DataLoader.filterByAllTags(allProjects, resolvedTags)
                    : DataLoader.filterByAnyTag(allProjects, resolvedTags);
            }

            const reshuffled = DataLoader.shuffleArray(filtered);
            shuffledProjects = reshuffled;

            // Re-render filters with updated tag counts
            const updatedTags = getTagsForDisplay();
            FilterController.renderFilters(updatedTags, tagFiltersContainer, allProjects);

            renderView(reshuffled);
        });
    }

    /**
     * Initialize
     */
    async function init() {
        activeTags = parseURL();

        await loadProjects();
        setupFilters();
        renderView();
    }

    init().catch(error => {
        console.error('Failed to initialize:', error);
        TileRenderer.hideLoading();
    });

})();
