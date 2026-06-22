/**
 * SECTION CONTROLLER (v4.5.0)
 * Universal tag page — shows project entries AND art collections as tiles.
 * Filtering is driven by FilterController's structured state: one dropdown per
 * tag group (role / skill / product, each with its own any/all mode), combined
 * AND across groups, plus a Projects/Collections content-type selector.
 * URL: section.html?tags=web-developer (+more), #tags=...&mode=all&type=collection
 */

(async () => {
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const tileGrid = document.getElementById('tile-grid');
    const tagFiltersContainer = document.getElementById('tag-filters');

    const GROUPS = ['role', 'skill', 'product'];

    let allContent = [];        // entries (_type:'entry') + collections (_type:'collection')
    let shuffledContent = [];
    let activeTags = [];        // flat normalized list (for tile pill exclusion + header)

    /**
     * Find the display name for a URL-normalized tag.
     */
    function resolveTagDisplayName(normalizedTag, pool) {
        const allTags = DataLoader.getAllTags(pool);
        const match = allTags.find(t => DataLoader.normalizeForURL(t) === normalizedTag);
        return match || normalizedTag.replace(/-/g, ' ');
    }

    /**
     * Apply the structured filter state to the full pool.
     * Within a group: the group's any/all mode. Across groups: AND. Then narrow
     * by content type (Projects / Collections / both).
     */
    function applyFilter(state) {
        let result = allContent;
        GROUPS.forEach(type => {
            const g = state.groups[type];
            if (g && g.tags.length) {
                const display = g.tags.map(t => resolveTagDisplayName(t, allContent));
                result = g.mode === 'all'
                    ? DataLoader.filterByAllTags(result, display)
                    : DataLoader.filterByAnyTag(result, display);
            }
        });
        const c = state.content || { entry: true, collection: true };
        if (!(c.entry && c.collection)) {
            result = result.filter(p => c.entry ? p._type !== 'collection' : p._type === 'collection');
        }
        return result;
    }

    /**
     * Update page header + meta.
     */
    function updatePageHeader(count) {
        pageTitle.textContent = `${count} ${count === 1 ? 'Result' : 'Results'}`;
        pageSubtitle.textContent = '';

        if (activeTags.length > 0) {
            const tagNames = activeTags.map(t => resolveTagDisplayName(t, allContent));
            document.title = `${tagNames.join(', ')} | Sean August Horvath`;
        } else {
            document.title = 'All Projects | Sean August Horvath';
        }

        const description = `Portfolio showcasing ${count} projects and art collections by Sean August Horvath.`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', description);
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', document.title);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);
    }

    /**
     * Filter + shuffle + render for the given filter state.
     */
    function applyAndRender(state) {
        const filtered = applyFilter(state);
        shuffledContent = DataLoader.shuffleArray(filtered);
        activeTags = FilterController.getActiveTags();
        TileRenderer.renderSectionTiles(shuffledContent, tileGrid, activeTags);
        updatePageHeader(shuffledContent.length);
    }

    /**
     * Hide the top nav on scroll-down (past 200px), restore on scroll-up.
     */
    function initNavCollapse() {
        const nav = document.getElementById('siteNav');
        const pill = document.getElementById('navPill');
        if (!nav || !pill) return;
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const cur = window.scrollY;
            if (cur > 200 && cur > lastScroll) {
                nav.classList.add('hide');
                pill.classList.add('vis');
            } else if (cur < lastScroll - 5) {
                nav.classList.remove('hide');
                pill.classList.remove('vis');
            }
            lastScroll = cur;
        }, { passive: true });
        pill.addEventListener('click', () => {
            nav.classList.remove('hide');
            pill.classList.remove('vis');
        });
    }

    async function init() {
        TileRenderer.showLoading(tileGrid);
        try {
            allContent = await DataLoader.loadAllContent();
        } catch (error) {
            console.error('Error loading content:', error);
            TileRenderer.hideLoading();
            return;
        }

        if (tagFiltersContainer) tagFiltersContainer.style.position = 'relative';

        // FilterController owns URL parsing + state; it calls applyAndRender on
        // every change (and on hashchange). renderFilters builds the dropdowns
        // from the static per-type tag lists across the whole pool.
        FilterController.init(applyAndRender);
        FilterController.renderFilters(DataLoader.getTagsByType(allContent), tagFiltersContainer, allContent);

        // Initial render reflecting any URL-derived filter state.
        applyAndRender(FilterController.getState());
        initNavCollapse();
    }

    init().catch(error => {
        console.error('Failed to initialize:', error);
        TileRenderer.hideLoading();
    });

})();
