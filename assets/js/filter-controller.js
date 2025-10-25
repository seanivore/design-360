/**
 * FILTER CONTROLLER
 * Manages tag filtering and URL hash state
 * Handles sticky filters, DOM reordering, and tag type differentiation
 */

const FilterController = (() => {
    let activeTags = [];
    let stickyFilter = null; // Main filter that cannot be removed
    let onFilterChange = null;
    let tagTypesMap = new Map(); // Maps tag names to their types

    /**
     * Parse tags from URL hash
     * Supports both singular and plural: #tag=value or #tags=value+value2
     * Example: #tags=copywriting+illustration -> ['copywriting', 'illustration']
     * Example: #tag=cms -> ['cms']
     *
     * NOTE: Cannot use URLSearchParams because it decodes + as space!
     * Must manually parse the hash to preserve + as a delimiter.
     */
    function parseHashTags() {
        const hash = window.location.hash.slice(1); // Remove #

        if (!hash) {
            return [];
        }

        // Manually parse to avoid URLSearchParams decoding + as space
        // Look for either tags= or tag=
        const tagsMatch = hash.match(/tags?=([^&]+)/);

        if (!tagsMatch) {
            return [];
        }

        const tagsParam = tagsMatch[1];
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
     * Set sticky filter (cannot be removed by user)
     * This is the main filter for the page (e.g., "web" on /web page)
     */
    function setStickyFilter(filter) {
        if (filter) {
            stickyFilter = DataLoader.normalizeForURL(filter);

            // Add to active tags if not already present
            if (!activeTags.includes(stickyFilter)) {
                activeTags.push(stickyFilter);
            }
        }
    }

    /**
     * Toggle a tag (activate if inactive, deactivate if active)
     * SINGLE-SELECT: Only one tag (besides sticky filter) can be active
     * Sticky filters cannot be toggled off
     */
    function toggleTag(tag) {
        const normalized = DataLoader.normalizeForURL(tag);

        // Prevent removing sticky filter
        if (normalized === stickyFilter) {
            console.log('Cannot remove sticky filter:', tag);
            return;
        }

        const index = activeTags.indexOf(normalized);

        if (index === -1) {
            // Activate tag - CLEAR all other non-sticky tags first
            activeTags = stickyFilter ? [stickyFilter, normalized] : [normalized];
        } else {
            // Deactivate tag - remove it
            activeTags.splice(index, 1);
        }

        updateHash();
        updateFilterPills();
        // DISABLED: Tag reordering causes confusion with single-select
        // reorderActiveTags();

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
            const isSticky = tag === stickyFilter;

            pill.classList.toggle('active', isActive);

            // Add sticky indicator (optional - can style differently)
            if (isSticky) {
                pill.setAttribute('data-sticky', 'true');
            }
        });
    }

    /**
     * Reorder DOM elements to move active tags to front
     * This is done in the DOM, not via CSS order property
     */
    function reorderActiveTags() {
        const container = document.getElementById('tag-filters');
        if (!container) return;

        const pills = Array.from(container.querySelectorAll('.tag-filter'));

        // Separate active and inactive pills
        const activePills = [];
        const inactivePills = [];

        pills.forEach(pill => {
            const tag = pill.getAttribute('data-tag');
            if (activeTags.includes(tag)) {
                activePills.push(pill);
            } else {
                inactivePills.push(pill);
            }
        });

        // Clear container
        container.innerHTML = '';

        // Add active pills first (in order they were activated)
        activeTags.forEach(activeTag => {
            const pill = activePills.find(p => p.getAttribute('data-tag') === activeTag);
            if (pill) {
                container.appendChild(pill);
            }
        });

        // Add inactive pills
        inactivePills.forEach(pill => {
            container.appendChild(pill);
        });

        // Re-attach event listeners (they're lost after moving DOM elements)
        attachPillListeners();
    }

    /**
     * Attach click event listeners to pills
     */
    function attachPillListeners() {
        const pills = document.querySelectorAll('.tag-filter');

        pills.forEach(pill => {
            // Remove old listeners by cloning node
            const newPill = pill.cloneNode(true);
            pill.parentNode.replaceChild(newPill, pill);

            // Add new listener
            newPill.addEventListener('click', (e) => {
                e.preventDefault();
                const tag = newPill.getAttribute('data-tag');
                const displayName = newPill.textContent;
                toggleTag(displayName);
            });
        });
    }

    /**
     * Render filter pills from available tags
     * Tags are grouped and colored by type
     */
    function renderFilterPills(tagsWithTypes, container) {
        if (!container) return;

        container.innerHTML = '';
        tagTypesMap.clear();

        // Sort tags: subsection, role, then others
        const sortedTags = sortTagsByType(tagsWithTypes);

        sortedTags.forEach(({ tag, type }) => {
            const normalized = DataLoader.normalizeForURL(tag);
            tagTypesMap.set(normalized, type);

            const pill = document.createElement('button');
            pill.className = 'tag-filter';
            pill.setAttribute('role', 'tab');
            pill.setAttribute('data-tag', normalized);
            pill.setAttribute('data-tag-type', type);
            pill.textContent = tag;

            // Check if this is the sticky filter
            if (normalized === stickyFilter) {
                pill.setAttribute('data-sticky', 'true');
            }

            container.appendChild(pill);
        });

        // Attach event listeners
        attachPillListeners();

        // Update active states
        updateFilterPills();

        // Reorder if any tags are active
        if (activeTags.length > 0) {
            reorderActiveTags();
        }
    }

    /**
     * Sort tags by type: subsection, role, then contextual
     */
    function sortTagsByType(tagsWithTypes) {
        const order = { subsection: 1, role: 2, contextual: 3 };

        return tagsWithTypes.sort((a, b) => {
            const orderA = order[a.type] || 999;
            const orderB = order[b.type] || 999;

            if (orderA !== orderB) {
                return orderA - orderB;
            }

            // Same type - sort alphabetically
            return a.tag.localeCompare(b.tag);
        });
    }

    /**
     * Initialize filter controller
     * Set up hash change listener and parse initial state
     */
    function init(callback, initialStickyFilter = null) {
        onFilterChange = callback;

        // Set sticky filter if provided
        if (initialStickyFilter) {
            setStickyFilter(initialStickyFilter);
        }

        // Parse initial tags from hash
        const hashTags = parseHashTags();
        const hasHashTags = hashTags.length > 0; // Check BEFORE adding sticky filter

        // Merge sticky filter with hash tags
        if (stickyFilter && !hashTags.includes(stickyFilter)) {
            hashTags.unshift(stickyFilter);
        }

        activeTags = hashTags;

        // Listen for hash changes (back/forward navigation)
        window.addEventListener('hashchange', () => {
            const newHashTags = parseHashTags();

            // Always include sticky filter
            if (stickyFilter && !newHashTags.includes(stickyFilter)) {
                newHashTags.unshift(stickyFilter);
            }

            activeTags = newHashTags;
            updateFilterPills();
            reorderActiveTags();

            if (onFilterChange) {
                onFilterChange(activeTags);
            }
        });

        // CRITICAL: If page loaded with hash tags (non-sticky), trigger initial render
        // This handles back button navigation where URL already has hash filtering
        // Only fire if there were ACTUAL hash tags in URL, not just the sticky filter
        if (hasHashTags && onFilterChange) {
            // Defer to ensure DOM is ready and pills are rendered
            setTimeout(() => {
                updateFilterPills();
                reorderActiveTags();
                onFilterChange(activeTags);
            }, 0);
        }

        return activeTags;
    }

    /**
     * Get currently active tags
     */
    function getActiveTags() {
        return [...activeTags];
    }

    /**
     * Clear all active tags (except sticky filter)
     */
    function clearTags() {
        if (stickyFilter) {
            activeTags = [stickyFilter];
        } else {
            activeTags = [];
        }

        updateHash();
        updateFilterPills();
        reorderActiveTags();

        if (onFilterChange) {
            onFilterChange(activeTags);
        }
    }

    /**
     * Set active tags programmatically
     */
    function setTags(tags) {
        activeTags = tags.map(t => DataLoader.normalizeForURL(t));

        // Always include sticky filter
        if (stickyFilter && !activeTags.includes(stickyFilter)) {
            activeTags.unshift(stickyFilter);
        }

        updateHash();
        updateFilterPills();
        reorderActiveTags();

        if (onFilterChange) {
            onFilterChange(activeTags);
        }
    }

    /**
     * Get sticky filter
     */
    function getStickyFilter() {
        return stickyFilter;
    }

    // Public API
    return {
        init,
        renderFilterPills,
        toggleTag,
        getActiveTags,
        clearTags,
        setTags,
        setStickyFilter,
        getStickyFilter
    };
})();
