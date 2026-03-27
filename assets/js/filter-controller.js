/**
 * FILTER CONTROLLER (v5.0)
 * Shadcn-style multi-select dropdown for tag filtering
 * Supports true multi-select with URL hash state
 */

const FilterController = (() => {
    let activeTags = [];
    let matchMode = 'any'; // 'any' (OR) or 'all' (AND)
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
.filter-selected { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; align-items: center; }
.filter-selected:empty { display: none; margin-bottom: 0; }
.filter-pill { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; font-size: .6875rem; font-weight: 600; background: rgba(201,166,138,.12); color: #C9A68A; border-radius: 3px; border: 1px solid rgba(201,166,138,.2); cursor: pointer; font-family: inherit; transition: background .15s, border-color .15s; white-space: nowrap; }
.filter-pill:hover { background: rgba(201,166,138,.22); border-color: rgba(201,166,138,.35); }
.filter-pill .pill-x { font-size: .5625rem; opacity: .5; margin-left: 2px; }
.filter-clear-inline { display: inline-flex; align-items: center; padding: 4px 10px; font-size: .6875rem; font-weight: 500; color: #9a9590; background: none; border: 1px solid rgba(255,255,255,.06); border-radius: 3px; cursor: pointer; font-family: inherit; transition: color .15s, border-color .15s; white-space: nowrap; }
.filter-clear-inline:hover { color: #C9A68A; border-color: rgba(201,166,138,.2); }
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
.filter-mode { display: flex; align-items: center; justify-content: space-between; padding: 8px 4px 10px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,.06); }
.filter-mode-label { font-size: .6875rem; color: #9a9590; font-weight: 500; }
.filter-mode-toggle { display: flex; background: #1f1f1f; border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,.08); }
.filter-mode-btn { padding: 4px 12px; font-size: .6875rem; font-weight: 600; background: none; border: none; color: #9a9590; cursor: pointer; font-family: inherit; transition: background .15s, color .15s; }
.filter-mode-btn.active { background: rgba(201,166,138,.2); color: #C9A68A; }
.filter-mode-btn:hover:not(.active) { color: #D7CDCC; }
.filter-clear { display: block; width: 100%; padding: 10px; font-size: .75rem; font-weight: 500; color: #9a9590; background: none; border: none; border-top: 1px solid rgba(255,255,255,.06); cursor: pointer; text-align: center; font-family: inherit; margin-top: 6px; transition: color .15s; }
.filter-clear:hover { color: #C9A68A; }
`;
        document.head.appendChild(style);
    }

    /**
     * Parse tags and mode from URL query string or hash
     * Returns { tags: [...], mode: 'any'|'all'|null }
     */
    function parseHashTags() {
        const tags = [];
        let mode = null;

        // Check query string first
        const search = window.location.search.slice(1);
        if (search) {
            const qMatch = search.match(/tags?=([^&]+)/);
            if (qMatch) {
                qMatch[1].split('+').forEach(t => {
                    const decoded = decodeURIComponent(t.replace(/-/g, ' ')).trim();
                    if (decoded) {
                        const normalized = DataLoader.normalizeForURL(decoded);
                        if (!tags.includes(normalized)) tags.push(normalized);
                    }
                });
            }
            const modeMatch = search.match(/mode=(any|all)/);
            if (modeMatch) mode = modeMatch[1];
        }

        // Check hash
        const hash = window.location.hash.slice(1);
        if (hash) {
            const hMatch = hash.match(/tags?=([^&]+)/);
            if (hMatch) {
                hMatch[1].split('+').forEach(t => {
                    const decoded = t.trim();
                    if (decoded && !tags.includes(decoded)) tags.push(decoded);
                });
            }
            if (!mode) {
                const hModeMatch = hash.match(/mode=(any|all)/);
                if (hModeMatch) mode = hModeMatch[1];
            }
        }

        return { tags, mode };
    }

    /**
     * Update URL hash with current active tags and mode
     */
    function updateHash() {
        if (activeTags.length === 0) {
            history.replaceState(null, '', window.location.pathname);
        } else {
            const tagsParam = activeTags.join('+');
            const modeParam = matchMode === 'all' ? '&mode=all' : '';
            history.replaceState(null, '', `${window.location.pathname}#tags=${tagsParam}${modeParam}`);
        }
    }

    /**
     * Set match mode (any/all) and re-trigger filter
     */
    function setMatchMode(mode, btnAny, btnAll) {
        matchMode = mode;
        btnAny.classList.toggle('active', mode === 'any');
        btnAll.classList.toggle('active', mode === 'all');

        if (onFilterChange && activeTags.length > 0) {
            onFilterChange(activeTags, matchMode);
        }
    }

    /**
     * Toggle a tag — TRUE multi-select (multiple tags can be active simultaneously)
     */
    function toggleTag(tag) {
        const normalized = DataLoader.normalizeForURL(tag);
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
            onFilterChange(activeTags, matchMode);
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
                const pill = document.createElement('button');
                pill.className = 'filter-pill';
                pill.textContent = normalized.replace(/-/g, ' ');

                const x = document.createElement('span');
                x.className = 'pill-x';
                x.textContent = '×';
                pill.appendChild(x);
                pill.addEventListener('click', () => toggleTag(normalized));

                selectedRow.appendChild(pill);
            });

            // Add inline clear button when multiple tags are active
            if (activeTags.length > 1) {
                const clearInline = document.createElement('button');
                clearInline.className = 'filter-clear-inline';
                clearInline.textContent = 'Clear all';
                clearInline.addEventListener('click', () => clearTags());
                selectedRow.appendChild(clearInline);
            }
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
            if (alreadyPresent) return;

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

        // Match mode toggle (any/all)
        const modeRow = document.createElement('div');
        modeRow.className = 'filter-mode';

        const modeLabel = document.createElement('span');
        modeLabel.className = 'filter-mode-label';
        modeLabel.textContent = 'Matching';

        const modeToggle = document.createElement('div');
        modeToggle.className = 'filter-mode-toggle';

        const btnAny = document.createElement('button');
        btnAny.className = 'filter-mode-btn' + (matchMode === 'any' ? ' active' : '');
        btnAny.textContent = 'any';
        btnAny.addEventListener('click', () => setMatchMode('any', btnAny, btnAll));

        const btnAll = document.createElement('button');
        btnAll.className = 'filter-mode-btn' + (matchMode === 'all' ? ' active' : '');
        btnAll.textContent = 'all';
        btnAll.addEventListener('click', () => setMatchMode('all', btnAny, btnAll));

        modeToggle.appendChild(btnAny);
        modeToggle.appendChild(btnAll);
        modeRow.appendChild(modeLabel);
        modeRow.appendChild(modeToggle);

        panel.appendChild(search);
        panel.appendChild(modeRow);
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
    function init(callback) {
        onFilterChange = callback;

        // Parse initial tags and mode from URL
        const parsed = parseHashTags();
        const hasHashTags = parsed.tags.length > 0;

        activeTags = parsed.tags;
        if (parsed.mode) matchMode = parsed.mode;

        // Listen for hash changes (back/forward navigation)
        window.addEventListener('hashchange', () => {
            const reparsed = parseHashTags();
            activeTags = reparsed.tags;
            if (reparsed.mode) matchMode = reparsed.mode;
            updateFilterUI();

            if (onFilterChange) {
                onFilterChange(activeTags, matchMode);
            }
        });

        // If page loaded with hash tags, trigger initial render
        if (hasHashTags && onFilterChange) {
            setTimeout(() => {
                updateFilterUI();
                onFilterChange(activeTags, matchMode);
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
     * Clear all active tags
     */
    function clearTags() {
        activeTags = [];

        updateHash();
        updateFilterUI();

        if (onFilterChange) {
            onFilterChange(activeTags, matchMode);
        }
    }

    /**
     * Set active tags programmatically
     */
    function setTags(tags) {
        activeTags = tags.map(t => DataLoader.normalizeForURL(t));

        updateHash();
        updateFilterUI();

        if (onFilterChange) {
            onFilterChange(activeTags, matchMode);
        }
    }

    /**
     * Get current match mode
     */
    function getMatchMode() {
        return matchMode;
    }

    // Public API
    return {
        init,
        renderFilters,
        toggleTag,
        getActiveTags,
        getMatchMode,
        clearTags,
        setTags
    };
})();
