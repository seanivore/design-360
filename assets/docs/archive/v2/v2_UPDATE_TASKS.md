# v2.0 Portfolio Update — Task Checklist
*UI version located: `/Users/seanivore/.gemini/antigravity/brain/20d9ce39-882c-4850-b12b-aaf6d58750d8/task.md.resolved`*

## Phase 1: Tag System & Foundation
- [x] Write + run tag migration script (36 entries, v3.2 → v4.0)
- [x] Update [_entry_template.json](file:///Users/seanivore/Development/360-design/assets/docs/_entry_template.json) to v4.0 schema
- [x] Update [data-loader.js](file:///Users/seanivore/Development/360-design/assets/js/data-loader.js) (new filtering)
- [x] Update [generate_manifest.py](file:///Users/seanivore/Development/360-design/generate_manifest.py) + regenerate manifest
- [x] Update [404.html](file:///Users/seanivore/Development/360-design/404.html) (routing works with flat slugs via existing manifest check)
- [x] Update [section-controller.js](file:///Users/seanivore/Development/360-design/assets/js/section-controller.js) (universal tag page)
- [x] Update [filter-controller.js](file:///Users/seanivore/Development/360-design/assets/js/filter-controller.js) (role/skill types)
- [x] Update [entry.html](file:///Users/seanivore/Development/360-design/entry.html) + [entry-controller.js](file:///Users/seanivore/Development/360-design/assets/js/entry-controller.js) (remove breadcrumbs, tag pills)
- [x] Update [tile-renderer.js](file:///Users/seanivore/Development/360-design/assets/js/tile-renderer.js) (flat slug URLs)
- [x] Update [styles.css](file:///Users/seanivore/Development/360-design/styles.css) (tag pills, remove breadcrumbs)
- [x] Delete [placement.json](file:///Users/seanivore/Development/360-design/assets/js/placement.json)
- [x] Local testing of Phase 1

## Phase 2: Landing Page Prototype
- [x] Create [landing-prototype.html](file:///Users/seanivore/Development/360-design/landing-prototype.html) with real project data
- [x] Build all component sections with hardcoded content
- [ ] Discover + document entry schema additions needed
- [/] User review of prototype in browser

## Phase 3: Template-ize & Wire Up
- [ ] Finalize entry schema additions
- [ ] Update all 36 entries with new copy fields
- [ ] Create `homepage-content.json` (tags only)
- [ ] Convert prototype → [index.html](file:///Users/seanivore/Development/360-design/index.html) template
- [ ] Create `landing-controller.js`
- [ ] Delete [homepage-controller.js](file:///Users/seanivore/Development/360-design/assets/js/homepage-controller.js)
- [ ] Delete [renderHomepageTile()](file:///Users/seanivore/Development/360-design/assets/js/tile-renderer.js#81-162) from [tile-renderer.js](file:///Users/seanivore/Development/360-design/assets/js/tile-renderer.js) (still uses old section URLs)
- [ ] Update [styles.css](file:///Users/seanivore/Development/360-design/styles.css) with landing page components

## Phase 4: Verification
- [ ] JSON validation script
- [ ] Manifest check
- [ ] Local server testing
- [ ] Live deployment test
- [ ] Update [DESIGN_360_PORTFOLIO.md](file:///Users/seanivore/Development/360-design/assets/docs/DESIGN_360_PORTFOLIO.md)
