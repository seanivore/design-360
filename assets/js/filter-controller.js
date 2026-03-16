/**
 * FILTER CONTROLLER (v5.0)
 * Shadcn-style multi-select dropdown for tag filtering
 * Supports true multi-select with URL hash state
 */

const FilterController = (() => {
    let activeTags = [];
    let stickyFilter = null;
    let onFilterChange = null;
    let filterContainer = null;

    /**
     * Inject CSS styles for the filter UI (once)
     */
    function injectStyles() {
        if (document.getElementById('filter-controller-styles')) return;

        const style = document.createElement('style');
        style.id = 'filter-controller-styles';
        style.textContent = `
.filter-selected { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.filter-selected:empty { display: none; }
.filter-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: .75rem; font-weight: 600; background: rgba(201,166,138,.15); color: #C9A68A; border-radius: 4px; border: 1px solid rgba(201,166,138,.25); cursor: pointer; font-family: inherit; transition: background .15s, border-color .15s; }
.filter-pill:hover { background: rgba(201,166,138,.25); border-color: rgba(201,166,138,.4); }
.filter-pill .pill-x { font-size: .625rem; opacity: .6; }
.filter-trigger { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; font-size: .8125rem; font-weight: 600; background: rgba(255,255,255,.04); color: #D7CDCC; border: 1px solid rgba(255,255,255,.1); border-radius: 6px; cursor: pointer; font-family: inherit; transition: background .15s, border-color .15s; }
.filter-trigger:hover { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.15); }
.filter-trigger::after { content: ''; display: inline-block; width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 4px solid #9a9590; margin-left: 4px; }
.filter-panel { position: absolute; top: 100%; left: 0; width: 320px; max-height: 400px; overflow-y: auto; background: #272727; border: 1px solid rgba(255,255,255,.1); border-radius: 8px; margin-top: 6px; z-index: 50; padding: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.4); }
.filter-search { width: 100%; padding: 10px 12px; font-size: .8125rem; background: #1f1f1f; color: #EBEBEB; border: 1px solid rgba(255,255,255,.08); border-radius: 6px; margin-bottom: 10px; font-family: inherit; outline: none; box-sizing: border-box; transition: border-color .15s; }
.filter-search:focus { border-color: rgba(201,166,138,.4); }
.filter-group-header { font-size: .6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #C9A68A; padding: 10px 4px 6px; }
.filter-item { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 4px; cursor: pointer; font-size: .8125rem; color: #D7CDCC; transition: background .1s; }
.filter-item:hover { background: rgba(255,255,255,.05); }
.filter-checkbox { accent-color: #C9A68A; width: 14px; height: 14px; }
.filter-item-count { margin-left: auto; font-size: .6875rem; color: #9a9590; }
.filter-clear { display: block; width: 100%; padding: 10px; font-size: .75rem; font-weight: 500; color: #9a9590; background: none; border: none; border-top: 1px solid rgba(255,255,255,.06); cursor: pointer; text-align: center; font-family: inherit; margin-top: 6px; transition: color .15s; }
.filter-clear:hover { color: #C9A68A; }
`;
        document.head.appendChild(style);
    }

    /**
     * Parse tags from URL hash
     */
    function parseHashTags() {
        const hash = window.location.hash.slice(1);
        if (!hash) return [];

        const tagsMatch = hash.match(/tags?=([^&]+)/);
        if (!tagsMatch) return [];

        return tagsMatch[1].split('+').map(t => t.trim()).filter(Boolean);
    }

    /**
     * Update URL hash with current active tags
     */
    function updateHash() {
        if (activeTags.length === 0) {
            history.replaceState(null, '', window.location.pathname);
        } else {
            const tagsParam = activeTags.join('+');
            history.replaceState(null, '', `${window.location.pathname}#tags=${tagsParam}`);
        }
    }

    /**
     * Set sticky filter (cannot be removed by user)
     */
    function setStickyFilter(filter) {
        if (filter) {
            stickyFilter = DataLoader.normalizeForURL(filter);
            if (!activeTags.includes(stickyFilter)) {
                activeTags.push(stickyFilter);
            }
        }
    }

    /**
     * Toggle a tag — TRUE multi-select (multiple tags can be active simultaneously)
     */
    function toggleTag(tag) {
        const normalized = DataLoader.normalizeForURL(tag);

        // Prevent removing sticky filter
        if (normalized === stickyFilter) return;

        const index = activeTags.indexOf(normalized);

        if (index === -1) {
            // Activate tag — add alongside existing active tags
            activeTags.push(normalized);
        } else {
            // Deactivate tag — remove it
            activeTags.splice(index, 1);
        }

        updateHash();
        updateFilterUI();

        if (onFilterChange) {
            onFilterChange(activeTags);
        }
    }

    /**
     * Update the visual state of the filter UI (selected pills + checkbox states)
     */
    function updateFilterUI() {
        if (!filterContainer) return;

        // Update selected pills row
        const selectedRow = filterContainer.querySelector('#filter-selected');
        if (selectedRow) {
            selectedRow.innerHTML = '';

            activeTags.forEach(normalized => {
                const isSticky = normalized === stickyFilter;
                const pill = document.createElement('button');
                pill.className = 'filter-pill';
                pill.textContent = normalized.replace(/-/g, ' ');

                if (!isSticky) {
                    const x = document.createElement('span');
                    x.className = 'pill-x';
                    x.textContent = ' x';
                    pill.appendChild(x);
                    pill.addEventListener('click', () => toggleTag(normalized));
                }

                selectedRow.appendChild(pill);
            });
        }

        // Update trigger text
        const triggerText = filterContainer.querySelector('.filter-trigger-text');
        if (triggerText) {
            if (activeTags.length > 0) {
                triggerText.textContent = `Filter by tag (${activeTags.length})`;
            } else {
                triggerText.textContent = 'Filter by tag';
            }
        }

        // Update checkbox states
        const checkboxes = filterContainer.querySelectorAll('.filter-checkbox');
        checkboxes.forEach(cb => {
            const tag = cb.dataset.tag;
            cb.checked = activeTags.includes(tag);
        });
    }

    /**
     * Render the complete filter UI (dropdown + selected pills)
     */
    function renderFilters(tagsWithTypes, container, allProjects) {
        if (!container) return;

        injectStyles();
        filterContainer = container;
        container.innerHTML = '';

        // Selected pills row (shown above dropdown when tags are active)
        const selectedRow = document.createElement('div');
        selectedRow.className = 'filter-selected';
        selectedRow.id = 'filter-selected';

        // Dropdown trigger
        const trigger = document.createElement('button');
        trigger.className = 'filter-trigger';
        trigger.innerHTML = '<span class="filter-trigger-text">Filter by tag</span>';

        // Dropdown panel
        const panel = document.createElement('div');
        panel.className = 'filter-panel';
        panel.style.display = 'none';

        // Search input
        const search = document.createElement('input');
        search.className = 'filter-search';
        search.placeholder = 'Search tags...';
        search.type = 'text';

        // Tag groups
        const groups = document.createElement('div');
        groups.className = 'filter-groups';

        // Group tags by type
        const grouped = {};
        tagsWithTypes.forEach(({ tag, type }) => {
            if (!grouped[type]) grouped[type] = [];
            // Count projects with this tag
            const count = allProjects.filter(p => {
                const allTags = DataLoader.getProjectTags(p);
                return allTags.some(t => DataLoader.normalizeForURL(t) === DataLoader.normalizeForURL(tag));
            }).length;
            grouped[type].push({ tag, count });
        });

        // Also add currently active tags into their groups so they appear as checked
        activeTags.forEach(normalized => {
            // Skip if already in tagsWithTypes
            const alreadyPresent = tagsWithTypes.some(({ tag }) =>
                DataLoader.normalizeForURL(tag) === normalized
            );
            if (alreadyPresent || normalized === stickyFilter) return;

            // Determine type from all projects
            const type = DataLoader.getTagType(allProjects, normalized);
            if (!grouped[type]) grouped[type] = [];

            const displayName = normalized.replace(/-/g, ' ');
            const count = allProjects.filter(p => {
                const allTags = DataLoader.getProjectTags(p);
                return allTags.some(t => DataLoader.normalizeForURL(t) === normalized);
            }).length;
            grouped[type].push({ tag: displayName, count });
        });

        // Render groups
        ['role', 'skill', 'product'].forEach(type => {
            if (!grouped[type] || grouped[type].length === 0) return;
            const groupEl = document.createElement('div');
            groupEl.className = 'filter-group';

            const header = document.createElement('div');
            header.className = 'filter-group-header';
            header.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            groupEl.appendChild(header);

            grouped[type].forEach(({ tag, count }) => {
                const item = document.createElement('label');
                item.className = 'filter-item';
                const normalized = DataLoader.normalizeForURL(tag);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'filter-checkbox';
                checkbox.dataset.tag = normalized;
                checkbox.dataset.display = tag;
                checkbox.checked = activeTags.includes(normalized);

                const label = document.createElement('span');
                label.className = 'filter-item-label';
                label.textContent = tag;

                const countEl = document.createElement('span');
                countEl.className = 'filter-item-count';
                countEl.textContent = `(${count})`;

                item.appendChild(checkbox);
                item.appendChild(label);
                item.appendChild(countEl);
                groupEl.appendChild(item);

                checkbox.addEventListener('change', () => toggleTag(tag));
            });

            groups.appendChild(groupEl);
        });

        // Clear all link
        const clearBtn = document.createElement('button');
        clearBtn.className = 'filter-clear';
        clearBtn.textContent = 'Clear all';
        clearBtn.addEventListener('click', () => clearTags());

        panel.appendChild(search);
        panel.appendChild(groups);
        panel.appendChild(clearBtn);

        container.appendChild(selectedRow);
        container.appendChild(trigger);
        container.appendChild(panel);

        // Toggle dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = panel.style.display !== 'none';
            panel.style.display = isOpen ? 'none' : 'block';
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                panel.style.display = 'none';
            }
        });

        // Search filter
        search.addEventListener('input', () => {
            const query = search.value.toLowerCase();
            panel.querySelectorAll('.filter-item').forEach(item => {
                const labelText = item.querySelector('.filter-item-label').textContent.toLowerCase();
                item.style.display = labelText.includes(query) ? '' : 'none';
            });
            // Hide group headers if all items in group are hidden
            panel.querySelectorAll('.filter-group').forEach(group => {
                const visibleItems = group.querySelectorAll('.filter-item[style=""], .filter-item:not([style])');
                const header = group.querySelector('.filter-group-header');
                if (header) {
                    header.style.display = visibleItems.length > 0 ? '' : 'none';
                }
            });
        });

        updateFilterUI();
    }

    /**
     * Initialize filter controller
     */
    function init(callback, initialStickyFilter) {
        onFilterChange = callback;

        if (initialStickyFilter) {
            setStickyFilter(initialStickyFilter);
        }

        // Parse initial tags from hash
        const hashTags = parseHashTags();
        const hasHashTags = hashTags.length > 0;

        // Merge sticky filter with hash tags
        if (stickyFilter && !hashTags.includes(stickyFilter)) {
            hashTags.unshift(stickyFilter);
        }

        activeTags = hashTags;

        // Listen for hash changes (back/forward navigation)
        window.addEventListener('hashchange', () => {
            const newHashTags = parseHashTags();

            if (stickyFilter && !newHashTags.includes(stickyFilter)) {
                newHashTags.unshift(stickyFilter);
            }

            activeTags = newHashTags;
            updateFilterUI();

            if (onFilterChange) {
                onFilterChange(activeTags);
            }
        });

        // If page loaded with hash tags, trigger initial render
        if (hasHashTags && onFilterChange) {
            setTimeout(() => {
                updateFilterUI();
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
        updateFilterUI();

        if (onFilterChange) {
            onFilterChange(activeTags);
        }
    }

    /**
     * Set active tags programmatically
     */
    function setTags(tags) {
        activeTags = tags.map(t => DataLoader.normalizeForURL(t));

        if (stickyFilter && !activeTags.includes(stickyFilter)) {
            activeTags.unshift(stickyFilter);
        }

        updateHash();
        updateFilterUI();

        if (onFilterChange) {
            onFilterChange(activeTags);
        }
    }

    // Public API
    return {
        init,
        renderFilters,
        toggleTag,
        getActiveTags,
        clearTags,
        setTags
    };
})();
