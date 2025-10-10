/**
 * FILTER CONTROLLER
 * Manages tag filtering and URL hash state
 * Handles filter pill interactions and project filtering
 */

const FilterController = (() => {
    let activeTags = [];
    let onFilterChange = null;

    /**
     * Parse tags from URL hash
     * Example: #tags=copywriting+illustration -> ['copywriting', 'illustration']
     */
    function parseHashTags() {
        const hash = window.location.hash.slice(1); // Remove #
        const params = new URLSearchParams(hash);
        const tagsParam = params.get('tags');

        if (!tagsParam) {
            return [];
        }

        return tagsParam.split('+').map(t => t.trim()).filter(Boolean);
    }

    /**
     * Update URL hash with current active tags
     */
    function updateHash() {
        if (activeTags.length === 0) {
            // Remove hash if no tags active
            history.replaceState(null, '', window.location.pathname);
        } else {
            const tagsParam = activeTags.join('+');
            history.replaceState(null, '', `${window.location.pathname}#tags=${tagsParam}`);
        }
    }

    /**
     * Toggle a tag (activate if inactive, deactivate if active)
     */
    function toggleTag(tag) {
        const normalized = DataLoader.normalizeForURL(tag);
        const index = activeTags.indexOf(normalized);

        if (index === -1) {
            // Activate tag
            activeTags.push(normalized);
        } else {
            // Deactivate tag
            activeTags.splice(index, 1);
        }

        updateHash();
        updateFilterPills();

        // Trigger callback if set
        if (onFilterChange) {
            onFilterChange(activeTags);
        }
    }

    /**
     * Update visual state of filter pills
     */
    function updateFilterPills() {
        const pills = document.querySelectorAll('.tag-filter');

        pills.forEach(pill => {
            const tag = pill.getAttribute('data-tag');
            const isActive = activeTags.includes(tag);
            pill.classList.toggle('active', isActive);
        });
    }

    /**
     * Render filter pills from available tags
     */
    function renderFilterPills(tags, container) {
        if (!container) return;

        container.innerHTML = '';

        // Sort tags alphabetically
        const sortedTags = [...tags].sort();

        sortedTags.forEach(tag => {
            const pill = document.createElement('button');
            pill.className = 'tag-filter';
            pill.setAttribute('role', 'tab');
            pill.setAttribute('data-tag', DataLoader.normalizeForURL(tag));
            pill.textContent = tag;

            // Add click handler
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                toggleTag(tag);
            });

            container.appendChild(pill);
        });

        // Update active states
        updateFilterPills();
    }

    /**
     * Initialize filter controller
     * Set up hash change listener and parse initial state
     */
    function init(callback) {
        onFilterChange = callback;

        // Parse initial tags from hash
        activeTags = parseHashTags();

        // Listen for hash changes (back/forward navigation)
        window.addEventListener('hashchange', () => {
            activeTags = parseHashTags();
            updateFilterPills();
            if (onFilterChange) {
                onFilterChange(activeTags);
            }
        });

        return activeTags;
    }

    /**
     * Get currently active tags
     */
    function getActiveTags() {
        return [...activeTags];
    }

    /**
     * Clear all active tags
     */
    function clearTags() {
        activeTags = [];
        updateHash();
        updateFilterPills();
        if (onFilterChange) {
            onFilterChange(activeTags);
        }
    }

    /**
     * Set active tags programmatically
     */
    function setTags(tags) {
        activeTags = tags.map(t => DataLoader.normalizeForURL(t));
        updateHash();
        updateFilterPills();
        if (onFilterChange) {
            onFilterChange(activeTags);
        }
    }

    // Public API
    return {
        init,
        renderFilterPills,
        toggleTag,
        getActiveTags,
        clearTags,
        setTags
    };
})();
