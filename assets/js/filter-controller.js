/**
 * FILTER CONTROLLER (v4.5.0)
 * One dropdown PER tag group (role / skill / product), each with its own
 * any/all toggle + checkboxes, plus a content-type selector (Projects /
 * Collections). Selected tags surface as removable pills above the bar.
 *
 * Cross-group combination is AND (a tile must satisfy every group that has a
 * selection); within a group, the group's own any/all mode applies. The
 * content-type selector narrows the pool to project entries, art collections,
 * or both (both by default).
 *
 * Emits the full state to the section controller:
 *   onFilterChange({ groups: { role:{mode,tags[]}, ... }, content:{entry,collection} })
 * where tags[] are normalized tokens. The controller owns URL state.
 */

const FilterController = (() => {
  const GROUPS = ['role', 'skill', 'product'];
  const GROUP_LABELS = { role: 'Role', skill: 'Skill', product: 'Product' };

  let groupState = {
    role: { mode: 'any', tags: [] },
    skill: { mode: 'any', tags: [] },
    product: { mode: 'any', tags: [] },
  };
  let content = { entry: true, collection: true };

  let onFilterChange = null;
  let filterContainer = null;
  let tagsByType = { role: [], skill: [], product: [] };

  // URL-parsed values awaiting distribution into groups once data is available.
  let pendingTags = [];
  let pendingMode = null;
  let pendingApplied = false;

  // ── styles ──────────────────────────────────────────────
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
.filter-bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.filter-dropdown { position: relative; }
.filter-trigger { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: .8125rem; font-weight: 600; background: rgba(255,255,255,.04); color: #D7CDCC; border: 1px solid rgba(255,255,255,.1); border-radius: 6px; cursor: pointer; font-family: inherit; transition: background .15s, border-color .15s; }
.filter-trigger:hover { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.15); }
.filter-trigger.has-active { border-color: rgba(201,166,138,.45); color: #C9A68A; }
.filter-trigger::after { content: ''; display: inline-block; width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 4px solid #9a9590; margin-left: 2px; }
.filter-trigger-count { font-size: .6875rem; color: #C9A68A; }
.filter-panel { position: absolute; top: 100%; left: 0; width: 280px; max-height: 380px; overflow-y: auto; background: #272727; border: 1px solid rgba(255,255,255,.1); border-radius: 8px; margin-top: 6px; z-index: 50; padding: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.4); }
/* Product is the rightmost dropdown — anchor its panel to the button's right edge so it never runs off-screen on narrow viewports. */
.filter-dropdown[data-group="product"] .filter-panel { left: auto; right: 0; }
.filter-search { width: 100%; padding: 9px 12px; font-size: .8125rem; background: #1f1f1f; color: #EBEBEB; border: 1px solid rgba(255,255,255,.08); border-radius: 6px; margin-bottom: 10px; font-family: inherit; outline: none; box-sizing: border-box; transition: border-color .15s; }
.filter-search:focus { border-color: rgba(201,166,138,.4); }
.filter-item { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 4px; cursor: pointer; font-size: .8125rem; color: #D7CDCC; transition: background .1s; }
.filter-item:hover { background: rgba(255,255,255,.05); }
.filter-checkbox { accent-color: #C9A68A; width: 14px; height: 14px; }
.filter-item-count { margin-left: auto; font-size: .6875rem; color: #9a9590; }
.filter-mode { display: flex; align-items: center; justify-content: space-between; padding: 4px 4px 10px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,.06); }
.filter-mode-label { font-size: .6875rem; color: #9a9590; font-weight: 500; }
.filter-mode-toggle { display: flex; background: #1f1f1f; border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,.08); }
.filter-mode-btn { padding: 4px 12px; font-size: .6875rem; font-weight: 600; background: none; border: none; color: #9a9590; cursor: pointer; font-family: inherit; transition: background .15s, color .15s; }
.filter-mode-btn.active { background: rgba(201,166,138,.2); color: #C9A68A; }
.filter-mode-btn:hover:not(.active) { color: #D7CDCC; }
.filter-content-type { display: inline-flex; background: #1f1f1f; border: 1px solid rgba(255,255,255,.1); border-radius: 6px; overflow: hidden; margin-left: auto; }
.ct-btn { padding: 10px 14px; font-size: .75rem; font-weight: 600; background: none; border: none; color: #9a9590; cursor: pointer; font-family: inherit; transition: background .15s, color .15s; }
.ct-btn.active { background: rgba(201,166,138,.18); color: #C9A68A; }
.ct-btn:hover:not(.active) { color: #D7CDCC; }
@media (max-width: 47.9375rem) {
  .filter-content-type { margin-left: 0; }
  .filter-panel { width: min(280px, 80vw); }
}
`;
    document.head.appendChild(style);
  }

  // ── URL state ───────────────────────────────────────────
  function parseHashTags() {
    const tags = [];
    let mode = null;
    let type = null;

    const read = (str) => {
      const m = str.match(/tags?=([^&]+)/);
      if (m) {
        m[1].split('+').forEach(t => {
          const decoded = DataLoader.normalizeForURL(decodeURIComponent(t.replace(/-/g, ' ')).trim());
          if (decoded && !tags.includes(decoded)) tags.push(decoded);
        });
      }
      const mm = str.match(/mode=(any|all)/);
      if (mm && !mode) mode = mm[1];
      const tm = str.match(/type=(entry|collection)/);
      if (tm && !type) type = tm[1];
    };
    read(window.location.search.slice(1));
    read(window.location.hash.slice(1));
    return { tags, mode, type };
  }

  function allActiveTags() {
    return GROUPS.flatMap(g => groupState[g].tags);
  }

  function updateHash() {
    const tags = allActiveTags();
    const onlyEntry = content.entry && !content.collection;
    const onlyColl = content.collection && !content.entry;
    if (tags.length === 0 && !onlyEntry && !onlyColl) {
      history.replaceState(null, '', window.location.pathname);
      return;
    }
    const parts = [];
    if (tags.length) {
      const anyAll = GROUPS.some(g => groupState[g].mode === 'all' && groupState[g].tags.length > 1) ? 'all' : 'any';
      parts.push(`tags=${tags.join('+')}`);
      parts.push(`mode=${anyAll}`);
    }
    if (onlyEntry) parts.push('type=entry');
    if (onlyColl) parts.push('type=collection');
    history.replaceState(null, '', `${window.location.pathname}#${parts.join('&')}`);
  }

  // ── mutations ───────────────────────────────────────────
  function fire() {
    if (onFilterChange) onFilterChange(getState());
  }

  function getState() {
    return {
      groups: {
        role: { mode: groupState.role.mode, tags: [...groupState.role.tags] },
        skill: { mode: groupState.skill.mode, tags: [...groupState.skill.tags] },
        product: { mode: groupState.product.mode, tags: [...groupState.product.tags] },
      },
      content: { ...content },
    };
  }

  function toggleTag(type, tag) {
    const normalized = DataLoader.normalizeForURL(tag);
    const arr = groupState[type].tags;
    const i = arr.indexOf(normalized);
    if (i === -1) arr.push(normalized); else arr.splice(i, 1);
    updateHash();
    updateFilterUI();
    fire();
  }

  function removeTag(normalized) {
    GROUPS.forEach(g => {
      const i = groupState[g].tags.indexOf(normalized);
      if (i !== -1) groupState[g].tags.splice(i, 1);
    });
    updateHash();
    updateFilterUI();
    fire();
  }

  function setGroupMode(type, mode) {
    groupState[type].mode = mode;
    updateHash();
    updateFilterUI();
    if (groupState[type].tags.length > 1) fire();
  }

  function setContentType(kind) {
    // Toggle a content type; never allow both off (fall back to both on).
    content[kind] = !content[kind];
    if (!content.entry && !content.collection) {
      content.entry = true;
      content.collection = true;
    }
    updateHash();
    updateFilterUI();
    fire();
  }

  function clearTags() {
    GROUPS.forEach(g => { groupState[g].tags = []; });
    content = { entry: true, collection: true };
    updateHash();
    updateFilterUI();
    fire();
  }

  // ── render ──────────────────────────────────────────────
  function tagCount(normalized, allContent) {
    return allContent.filter(p => DataLoader.getProjectTags(p)
      .some(t => DataLoader.normalizeForURL(t) === normalized)).length;
  }

  function distributePending() {
    if (pendingApplied) return;
    pendingApplied = true;
    if (pendingMode) GROUPS.forEach(g => { groupState[g].mode = pendingMode; });
    pendingTags.forEach(normalized => {
      const type = GROUPS.find(g =>
        tagsByType[g].some(t => DataLoader.normalizeForURL(t) === normalized));
      if (type && !groupState[type].tags.includes(normalized)) {
        groupState[type].tags.push(normalized);
      }
    });
  }

  function buildDropdown(type, allContent) {
    const tags = (tagsByType[type] || []).slice()
      .sort((a, b) => a.localeCompare(b));
    if (!tags.length) return null;

    const dropdown = document.createElement('div');
    dropdown.className = 'filter-dropdown';
    dropdown.dataset.group = type;

    const trigger = document.createElement('button');
    trigger.className = 'filter-trigger';
    trigger.innerHTML = `${GROUP_LABELS[type]} <span class="filter-trigger-count"></span>`;

    const panel = document.createElement('div');
    panel.className = 'filter-panel';
    panel.style.display = 'none';

    // search
    const search = document.createElement('input');
    search.className = 'filter-search';
    search.type = 'text';
    search.placeholder = `Search ${type}...`;

    // any/all mode
    const modeRow = document.createElement('div');
    modeRow.className = 'filter-mode';
    const modeLabel = document.createElement('span');
    modeLabel.className = 'filter-mode-label';
    modeLabel.textContent = 'Matching';
    const modeToggle = document.createElement('div');
    modeToggle.className = 'filter-mode-toggle';
    const btnAny = document.createElement('button');
    btnAny.className = 'filter-mode-btn' + (groupState[type].mode === 'any' ? ' active' : '');
    btnAny.textContent = 'any';
    const btnAll = document.createElement('button');
    btnAll.className = 'filter-mode-btn' + (groupState[type].mode === 'all' ? ' active' : '');
    btnAll.textContent = 'all';
    btnAny.addEventListener('click', () => { setGroupMode(type, 'any'); btnAny.classList.add('active'); btnAll.classList.remove('active'); });
    btnAll.addEventListener('click', () => { setGroupMode(type, 'all'); btnAll.classList.add('active'); btnAny.classList.remove('active'); });
    modeToggle.appendChild(btnAny);
    modeToggle.appendChild(btnAll);
    modeRow.appendChild(modeLabel);
    modeRow.appendChild(modeToggle);

    // items
    const items = document.createElement('div');
    items.className = 'filter-items';
    tags.forEach(tag => {
      const normalized = DataLoader.normalizeForURL(tag);
      const item = document.createElement('label');
      item.className = 'filter-item';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'filter-checkbox';
      cb.dataset.tag = normalized;
      cb.checked = groupState[type].tags.includes(normalized);
      const label = document.createElement('span');
      label.className = 'filter-item-label';
      label.textContent = tag;
      const count = document.createElement('span');
      count.className = 'filter-item-count';
      count.textContent = `(${tagCount(normalized, allContent)})`;
      item.appendChild(cb);
      item.appendChild(label);
      item.appendChild(count);
      items.appendChild(item);
      cb.addEventListener('change', () => toggleTag(type, tag));
    });

    panel.appendChild(search);
    panel.appendChild(modeRow);
    panel.appendChild(items);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.style.display !== 'none';
      // Close sibling panels first.
      filterContainer.querySelectorAll('.filter-panel').forEach(p => { p.style.display = 'none'; });
      panel.style.display = open ? 'none' : 'block';
    });

    search.addEventListener('input', () => {
      const q = search.value.toLowerCase();
      items.querySelectorAll('.filter-item').forEach(it => {
        const t = it.querySelector('.filter-item-label').textContent.toLowerCase();
        it.style.display = t.includes(q) ? '' : 'none';
      });
    });

    dropdown.appendChild(trigger);
    dropdown.appendChild(panel);
    return dropdown;
  }

  /**
   * @param {Object} tagsByTypeData - { role:[...], skill:[...], product:[...] }
   * @param {HTMLElement} container
   * @param {Array} allContent - the full entry+collection pool (for counts)
   */
  function renderFilters(tagsByTypeData, container, allContent) {
    if (!container) return;
    injectStyles();
    filterContainer = container;
    tagsByType = {
      role: tagsByTypeData.role || [],
      skill: tagsByTypeData.skill || [],
      product: tagsByTypeData.product || [],
    };
    distributePending();
    container.innerHTML = '';

    const selectedRow = document.createElement('div');
    selectedRow.className = 'filter-selected';
    selectedRow.id = 'filter-selected';

    const bar = document.createElement('div');
    bar.className = 'filter-bar';

    GROUPS.forEach(type => {
      const dd = buildDropdown(type, allContent);
      if (dd) bar.appendChild(dd);
    });

    // Content-type selector
    const ct = document.createElement('div');
    ct.className = 'filter-content-type';
    [['entry', 'Projects'], ['collection', 'Collections']].forEach(([kind, label]) => {
      const btn = document.createElement('button');
      btn.className = 'ct-btn' + (content[kind] ? ' active' : '');
      btn.dataset.ct = kind;
      btn.textContent = label;
      btn.addEventListener('click', () => setContentType(kind));
      ct.appendChild(btn);
    });
    bar.appendChild(ct);

    container.appendChild(selectedRow);
    container.appendChild(bar);

    // Close any open panel on outside click.
    if (!renderFilters._outsideBound) {
      document.addEventListener('click', (e) => {
        if (filterContainer && !filterContainer.contains(e.target)) {
          filterContainer.querySelectorAll('.filter-panel').forEach(p => { p.style.display = 'none'; });
        }
      });
      renderFilters._outsideBound = true;
    }

    updateFilterUI();
  }

  function updateFilterUI() {
    if (!filterContainer) return;

    // Selected pills
    const selectedRow = filterContainer.querySelector('#filter-selected');
    if (selectedRow) {
      selectedRow.innerHTML = '';
      allActiveTags().forEach(normalized => {
        const pill = document.createElement('button');
        pill.className = 'filter-pill';
        pill.textContent = normalized.replace(/-/g, ' ');
        const x = document.createElement('span');
        x.className = 'pill-x';
        x.textContent = '×';
        pill.appendChild(x);
        pill.addEventListener('click', () => removeTag(normalized));
        selectedRow.appendChild(pill);
      });
      if (allActiveTags().length > 0) {
        const clear = document.createElement('button');
        clear.className = 'filter-clear-inline';
        clear.textContent = 'Clear';
        clear.addEventListener('click', () => clearTags());
        selectedRow.appendChild(clear);
      }
    }

    // Per-group trigger counts + active styling
    GROUPS.forEach(type => {
      const dd = filterContainer.querySelector(`.filter-dropdown[data-group="${type}"]`);
      if (!dd) return;
      const n = groupState[type].tags.length;
      const trigger = dd.querySelector('.filter-trigger');
      const countEl = dd.querySelector('.filter-trigger-count');
      if (countEl) countEl.textContent = n ? `(${n})` : '';
      if (trigger) trigger.classList.toggle('has-active', n > 0);
      dd.querySelectorAll('.filter-checkbox').forEach(cb => {
        cb.checked = groupState[type].tags.includes(cb.dataset.tag);
      });
    });

    // Content-type buttons
    filterContainer.querySelectorAll('.ct-btn').forEach(btn => {
      btn.classList.toggle('active', !!content[btn.dataset.ct]);
    });
  }

  // ── init ────────────────────────────────────────────────
  function init(callback) {
    onFilterChange = callback;
    const parsed = parseHashTags();
    pendingTags = parsed.tags;
    pendingMode = parsed.mode;
    pendingApplied = false;
    if (parsed.type === 'entry') content = { entry: true, collection: false };
    else if (parsed.type === 'collection') content = { entry: false, collection: true };

    window.addEventListener('hashchange', () => {
      const re = parseHashTags();
      GROUPS.forEach(g => { groupState[g].tags = []; });
      pendingTags = re.tags;
      pendingMode = re.mode;
      pendingApplied = false;
      if (re.type === 'entry') content = { entry: true, collection: false };
      else if (re.type === 'collection') content = { entry: false, collection: true };
      else content = { entry: true, collection: true };
      distributePending();
      updateFilterUI();
      fire();
    });

    return getState();
  }

  function getActiveTags() {
    return allActiveTags();
  }

  function hasActiveFilters() {
    return allActiveTags().length > 0 || !content.entry || !content.collection;
  }

  return {
    init,
    renderFilters,
    getActiveTags,
    getState,
    hasActiveFilters,
    clearTags,
  };
})();
