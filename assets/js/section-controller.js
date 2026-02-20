/**
 * SECTION CONTROLLER (v4.0)
 * Universal tag page — works for any tag or combination of tags
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
        // (URLSearchParams decodes + as space, breaking multi-tag URLs)
        const search = window.location.search.slice(1); // remove ?
        const tagsMatch = search.match(/tags?=([^&]+)/);

        if (tagsMatch) {
            // ?tags=web-developer+graphic-designer
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
            // Path like /web-developer → treat as tag "Web Developer"
            const cleanPath = redirectPath.replace(/^\/|\/$/g, '');
            if (cleanPath && cleanPath !== 'section.html' && cleanPath !== 'projects') {
                // Convert URL-normalized path back to display name
                // We'll match against actual tags from loaded projects
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

        if (activeTags.length > 0) {
            // Show primary tag as title
            const primaryTag = activeTags[0];
            const displayName = resolveTagDisplayName(primaryTag, allProjects);
            
            pageTitle.innerHTML = `${displayName} <span style="font-size: 0.8125rem; font-weight: 400; color: var(--color-text-secondary); margin-left: 0.5rem;">(${count})</span>`;
            pageSubtitle.textContent = '';
            document.title = `${displayName} Projects | Sean August Horvath`;
        } else {
            pageTitle.textContent = 'All Projects';
            pageSubtitle.textContent = `${count} projects`;
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

            // Filter by active tags if any
            let filtered = allProjects;
            if (activeTags.length > 0) {
                // Resolve URL-normalized tags to actual tag values
                const resolvedTags = activeTags.map(tag => 
                    resolveTagDisplayName(tag, allProjects)
                );
                // Update active tags with resolved names
                activeTags = resolvedTags.map(t => DataLoader.normalizeForURL(t));
                filtered = DataLoader.filterByAllTags(allProjects, resolvedTags);
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
     * Get filter pills to display
     * Shows all tags present on the currently displayed projects
     */
    function getTagsForDisplay() {
        const tagsWithTypes = [];
        const seenTags = new Set();

        // Skip tags that are already active (they'll be shown as sticky)
        const activeNormalized = new Set(activeTags.map(t => DataLoader.normalizeForURL(t)));

        const tagsByType = DataLoader.getTagsByType(shuffledProjects);

        // Add role tags first
        tagsByType.role.forEach(tag => {
            const normalized = DataLoader.normalizeForURL(tag);
            if (!seenTags.has(normalized) && !activeNormalized.has(normalized)) {
                seenTags.add(normalized);
                tagsWithTypes.push({ tag, type: 'role' });
            }
        });

        // Then skill tags
        tagsByType.skill.forEach(tag => {
            const normalized = DataLoader.normalizeForURL(tag);
            if (!seenTags.has(normalized) && !activeNormalized.has(normalized)) {
                seenTags.add(normalized);
                tagsWithTypes.push({ tag, type: 'skill' });
            }
        });

        return tagsWithTypes;
    }

    /**
     * Setup filters
     */
    function setupFilters() {
        const tagsWithTypes = getTagsForDisplay();

        FilterController.renderFilterPills(tagsWithTypes, tagFiltersContainer);
        setupScrollShadows();

        // Set up sticky filter (the primary tag)
        const stickyFilter = activeTags.length > 0 ? activeTags[0] : null;

        FilterController.init((newActiveTags) => {
            // Re-filter and re-render
            let filtered = allProjects;
            if (newActiveTags.length > 0) {
                const resolvedTags = newActiveTags.map(t => 
                    resolveTagDisplayName(t, allProjects)
                );
                filtered = DataLoader.filterByAllTags(allProjects, resolvedTags);
            }

            const reshuffled = DataLoader.shuffleArray(filtered);
            renderView(reshuffled);
        }, stickyFilter);
    }

    /**
     * Setup scroll shadows for tag filters
     */
    function setupScrollShadows() {
        const wrapper = document.querySelector('.tag-filters-wrapper');
        const scroller = document.getElementById('tag-filters');

        if (!wrapper || !scroller) return;

        function updateShadows() {
            const scrollLeft = scroller.scrollLeft;
            const maxScroll = scroller.scrollWidth - scroller.clientWidth;

            if (scrollLeft > 10) {
                wrapper.classList.add('scrolled-left');
            } else {
                wrapper.classList.remove('scrolled-left');
            }

            if (scrollLeft >= maxScroll - 10) {
                wrapper.classList.add('scrolled-right');
            } else {
                wrapper.classList.remove('scrolled-right');
            }
        }

        scroller.addEventListener('scroll', updateShadows);
        setTimeout(updateShadows, 100);
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
