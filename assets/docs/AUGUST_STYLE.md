# august.style — Project Architecture & Schema Reference

**Aligned with**: v4.2.3_IMPLEMENT.md
**Last updated**: 2026-05-27

Living master document for the august.style portfolio site (vanilla HTML/CSS/JS + Jekyll, zero JS dependencies, Cloudflare R2 CDN). Updated each planning session to reflect the current target state of schema, controllers, and architecture. Symbiotic with the highest-numbered `vX_Y_Z_IMPLEMENT.md` in `assets/docs/archive/vX_Y/`.

---

## Schema Version Alignment Check

| Template | Version | Last bumped |
| -------- | ------- | ----------- |
| `_entry_template.json` | 6.1 | v4.2.3 (placement / feature_tile renames + flow layout + main_media + bleed + achievements array) |
| `_collection_template.json` | 6.0 | v4.2.2 (initial flat schema) |
| `_item_template.json` | 6.0 | v4.2.2 (initial flat schema) |

The orchestrator confirms each template's `_metadata.schema_version` matches this table before reading the corresponding section. A mismatch means a stale plan — pause and surface to Sean.

---

## 1. Project Type

Vanilla HTML/CSS/JS site with a Jekyll layer for pre-rendered per-entry pages (SEO meta tags). No bundler, no framework, no JS package dependencies as of v4.2.x. Hosted on GitHub Pages, custom domain `august.style`. All media on Cloudflare R2 at `cdn.august.style`.

The homepage is data-driven: `homepage-content.json` defines which entries (and which sections of those entries) populate each homepage region. Changing this file reshapes the homepage without touching HTML/JS.

---

## 2. Entry Schema (v6.1)

Each project lives in a single JSON file at `assets/entries/uid-xxx-###.json`. Flat schema — no nested `categorization` or `content` wrappers.

### Required fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | `string` | Unique ID matching filename, e.g. `"uid-rfr-187"` |
| `slug` | `string` | URL path segment |
| `title` | `string` | Display title |
| `subtitle` | `string` | One-line tagline |
| `seo_title` | `string` | 50–60 chars |
| `seo_description` | `string` | 150–160 chars |
| `role` | `string[]` | From `tags.json` role group |
| `skill` | `string[]` | From `tags.json` skill group |
| `product` | `string[]` | From `tags.json` product group |
| `company` | `string` | Single value from `tags.json` company group |
| `thumb` | `string[]` | Thumbnail CDN URLs |
| `thumb_alt` | `string` | Alt text for thumbnail slideshow |
| `layout` | `string` | `"columns"` or `"flow"` — selects entry-page rendering shape |

### Layout-aware fields

`layout: "columns"` uses the existing two-column entry shape with sticky tag/embed column and main media column.

`layout: "flow"` renders a typed-block sequence from the `flow[]` array — see § 2a below.

### Homepage placement

| Field | Type | Description |
| ----- | ---- | ----------- |
| `placement` | `string[]` | Values from `tags.json` placement group. Empty `[]` = excluded from homepage feature tiles. Qualifying entries need BOTH `"Featured"` AND one of `"Phase A"` / `"Phase B"` / `"Phase C"`. |
| `feature_tile` | `string[]` | CDN URLs for tile videos (mp4, looping, muted, playsinline). Multiple entries supported; one is picked at random per page reload. |
| `tile_alt` | `string` | Single alt-text string applied to whichever video plays. |

Filename convention: `https://cdn.august.style/media/{slug}/feature-tile-{slug}-N.mp4`.

### Media fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `img` | `string[]` | Square page images (hero fallback) |
| `img_alt` | `string` | Alt text |
| `main_media` | `array` | Grouped media blocks — see § 2b |
| `grids` | `array` | Grouped 3-across grid blocks — see § 2c |
| `bleed` | `array` | Full-bleed image blocks — see § 2d |
| `bleed_slides` | `object` | Bleed-style slideshow — see § 2e |
| `slideshows` | `array` | Grouped slideshows (legacy form retained for older entries) |
| `flow` | `array` | Typed-block content sequence for flow layouts — see § 2a |
| `media_url` | `string` | External video URL (e.g. YouTube link) |
| `media_embed` | `string` | Raw iframe embed HTML for video |
| `media_alt` | `string` | Alt text for video embed |

### Editorial / CTA fields (optional)

| Field | Type | Description |
| ----- | ---- | ----------- |
| `tiles` | `string[]` | Text lines that cycle on section tiles |
| `challenge` | `string` | Problem statement (2–4 sentences) — used in columns layout |
| `approach` | `string` | Approach (2–4 sentences) — used in columns layout |
| `result` | `string` | Outcome (2–4 sentences) — used in columns layout |
| `origin_url` | `string` | External live project URL |
| `origin_url_text` | `string` | Display text for origin URL |
| `repository` | `string` | GitHub repo URL |
| `role_headline` | `string\|null` | Headline for hero flip clock when this entry is selected |
| `hero_btn_cta` | `string\|null` | Hero CTA button text |
| `final_cta_text` | `string\|null` | Bottom CTA section heading |
| `final_btn_cta` | `string\|null` | Bottom CTA button text |
| `skill_summary` | `string` | Brief skills summary |
| `process` | `array\|null` | Process steps (legacy field; homepage process now driven from `homepage-content.json`) |
| `metric` | `object\|null` | Impact metric `{ value, kpi, context }` |
| `achievements` | `array` | All achievements for this entry. Each: `{ headline, details }`. Replaces the singleton `achievement`. Homepage achievements section shows every item across all entries. |
| `notes` | `string[]` | Internal-only; not rendered |

`collection_preview` is NOT a top-level entry field. It exists only as a `flow[]` block type — see § 2a.

### Fields removed in v6.1

- `mobile_img` / `mobile_img_alt` — use `slideshows` with `type: "mobile"`, or `main_media` with mobile-shaped images
- `gif` / `gif_alt` — use `main_media` (images array accepts gif filenames)
- Flat `grid[]` / `grid_alt` — use `grids[]`
- Singleton `achievement` — use `achievements[]`
- `feature` / `feature_video` / `feature_video_alt` — renamed to `placement` / `feature_tile[]` / `tile_alt`

### Metadata block

```json
"_metadata": { "schema_version": "6.1", "template_type": "project_entry" }
```

Informational, not consumed by controllers.

### 2a. Flow layout (`flow[]`)

A flow-layout entry replaces the columns shape with a typed-block sequence. Each block is one of:

- `{ "type": "h3", "text": "..." }` — section heading
- `{ "type": "h4", "text": "..." }` — sub-heading
- `{ "type": "h5", "text": "..." }` — minor heading
- `{ "type": "p", "text": "..." }` — paragraph
- `{ "type": "img", "images": [...], "alt": "..." }` — image row (1–N images side by side)
- `{ "type": "list", "items": [...], "style": "bluepoints" }` — bulleted list
- `{ "type": "chunk_break", "button_text": "Continue reading" }` — progressive-disclosure marker; everything after this block is hidden until the button is clicked, then fades in with light animation
- `{ "type": "embed_html", "html": "<blockquote>...</blockquote>", "alt": "..." }` — raw HTML embed for tweet / YouTube / Bluesky cards
- `{ "type": "collection_preview", "collection": "slug-here" }` — renders a horizontal-scroll collection preview component. Replaces a media row; can sit anywhere a typed `img` block would.

The flow renderer walks the array, emits the right DOM for each block, and registers any media into the lightbox state pool used by the columns layout.

### 2b. `main_media`

```json
"main_media": [
  {
    "title": "",
    "images": ["https://cdn.august.style/media/{slug}/main-1-{slug}-1.webp"],
    "alt": ""
  }
]
```

One or more groups. Each group renders as a centered block; multiple images in one group render as a horizontal row. Replaces the legacy `gif[]` and `mobile_img[]` use cases.

### 2c. `grids`

```json
"grids": [
  {
    "title": "Launch Campaign",
    "images": ["https://cdn.august.style/media/{slug}/grid-1-{slug}-1.webp"],
    "alt": "Alt text for this grid block"
  }
]
```

Each group renders as an independent 3-column grid. `title` optional; rendered as a small-caps heading.

### 2d. `bleed`

```json
"bleed": [
  {
    "images": [
      "https://cdn.august.style/media/{slug}/bleed-1-{slug}-1.webp",
      "https://cdn.august.style/media/{slug}/bleed-1-{slug}-2.webp"
    ],
    "alt": ""
  }
]
```

Full-bleed image row (edge-to-edge of viewport). Multiple images render side-by-side, filling the row.

### 2e. `bleed_slides`

```json
"bleed_slides": {
  "images": ["https://cdn.august.style/media/{slug}/bleed-slide-{slug}-1.webp"],
  "alt": ""
}
```

Single object (not array). Full-bleed slideshow — pagination controls overlaid on the imagery.

### Lightbox state pool

All on-page imagery — `img`, `main_media`, `grids`, `bleed`, `bleed_slides`, `flow` `img` blocks, `collection_preview` thumbnails — registers into one unified lightbox index pool, managed by `entry-controller.js`. Clicking any image opens lightbox at the right index; arrow keys / swipe navigates across the entire page's media, in document order.

---

## 3. Collection Schema (v6.0)

Each collection lives at `assets/collections/uid-col-###.json`. A collection is a curated set of media items that can be browsed standalone (at `august.style/collection/{slug}`) or previewed inside an entry via the `collection_preview` flow block.

```json
{
  "_metadata": { "schema_version": "6.0", "template_type": "media_collection" },
  "id": "uid-col-###",
  "slug": "collection-name",
  "title": "Display Title",
  "subtitle": "One-line tagline",
  "seo_title": "...",
  "seo_description": "...",
  "role": [],
  "skill": [],
  "product": [],
  "company": "Freelance",
  "thumb": ["https://cdn.august.style/media/collection/{slug}/thumb-{slug}-1.webp"],
  "thumb_alt": "...",
  "media": ["uid-itm-001", "uid-itm-002"],
  "notes": []
}
```

`media[]` references item UIDs. Items resolve via the manifest the same way entries do.

---

## 4. Item Schema (v6.0)

Each item lives at `assets/items/uid-itm-###.json`. An item is a single piece of media (image or short video) that can belong to one or more collections.

```json
{
  "_metadata": { "schema_version": "6.0", "template_type": "collection_item" },
  "id": "uid-itm-###",
  "slug": "item-name",
  "title": "...",
  "subtitle": "",
  "seo_title": "",
  "seo_description": "",
  "media_type": "image",
  "src": "https://cdn.august.style/media/item/{slug}.webp",
  "thumb": ["https://cdn.august.style/media/item/{slug}-thumb.webp"],
  "thumb_alt": "...",
  "tags": [],
  "notes": []
}
```

`tags[]` values come from `tags.json` group `item` — this group is free-form and grows organically as items are added. Unlike role/skill/product, the item group is not pre-locked.

---

## 5. Homepage Configuration (`homepage-content.json`)

Located at `assets/js/homepage-content.json`. Controls which entries populate each homepage region AND holds copy strings for sections that don't currently live in entry JSONs.

### Copy-aware sections (v4.2.3)

`homepage-content.json` now holds editable copy strings for:

- `hero.about_pool[]` — array of rotating "ABOUT" lines, picked at random per reload
- `narrative_spine.phase_a` / `.phase_b` / `.phase_c` — section copy for the three-section spine on the homepage
- `process.steps[]` — three-step labels + body copy
- `cta_section.heading` / `.body` / `.primary.text` / `.secondary.text` — final CTA block copy

Editing these strings is a push-redeploy without touching any entry JSON. Source-of-truth for in-progress drafts lives in `assets/docs/BRAND_COPY_STRATEGY.md`; locked picks propagate to `homepage-content.json` during BUILD.

### Filter-based sections

Sections that pull from entries use `filter` objects:

```json
{
  "hero": {
    "filter": { "any": ["Web Developer"] },
    "about_pool": [
      "Line one variant",
      "Line two variant"
    ],
    "cta_secondary": { "text": "All Projects", "href": "/section.html" }
  },
  "featured_tiles": {
    "tiles": [
      { "phase": "Phase A", "filter": { "all": ["Featured", "Phase A"] } },
      { "phase": "Phase B", "filter": { "all": ["Featured", "Phase B"] } },
      { "phase": "Phase C", "filter": { "all": ["Featured", "Phase C"] } }
    ]
  },
  "credentials": { /* unchanged from v5.1 */ },
  "achievements": {
    "heading": "Achievements",
    "source": "entries",
    "limit": null
  },
  "cta_section": { /* copy block */ }
}
```

### Filter operators

- `"any": [...]` — entry has at least one of these tags
- `"all": [...]` — entry has every one of these tags

Both can combine. `DataLoader.resolveFilter()` applies `all` first, then `any` on the result.

### Featured-tile selection

A homepage tile populates only from entries whose `placement[]` contains BOTH `"Featured"` AND one of `"Phase A"` / `"Phase B"` / `"Phase C"`. Each tile is reserved for a specific phase. On every reload, one qualifying entry per phase is picked at random; one of that entry's `feature_tile[]` videos is then picked at random.

### Tile interaction model

Scroll-into-view triggers a flip animation that reveals the video. Tiles auto-play sequentially, one at a time. Mobile + desktop both:

- Single-tap: pauses sequence; tapped tile keeps looping
- Double-tap: navigates to the entry
- Triple-tap (rapid): stops just that tile's video; sequence continues
- Tap-elsewhere: returns all tiles to default sequenced behavior

---

## 6. Tag System

### Six tag groups

| Group | Field | Type | Behavior |
| ----- | ----- | ---- | -------- |
| `role` | `role` | `string[]` | Pre-locked list, used in entry tag pills + filter |
| `skill` | `skill` | `string[]` | Pre-locked list |
| `product` | `product` | `string[]` | Pre-locked list |
| `company` | `company` | `string` | Pre-locked list, singular |
| `placement` | `placement` | `string[]` | Pre-locked list (`Featured`, `Phase A`, `Phase B`, `Phase C`) — controls homepage feature-tile eligibility |
| `item` | (on `_item_template.json` `tags[]`) | `string[]` | Free-form — grows organically as items are tagged |

### Tag registry (`assets/docs/tags.json`)

Canonical list of valid tags grouped by type. `role`, `skill`, `product`, `company`, `placement` are pre-locked; `item` is free-form (empty array on initial use, populates as items create new tags).

### Matching behavior

All matching uses exact string comparison after `normalizeForURL()`:

```
"HTML/CSS/JS"   -> "html-css-js"
"Web Developer" -> "web-developer"
"PETA, Inc."    -> "peta,-inc."
```

Case-insensitive via normalization. No partial/substring matching.

### Tag display

- Section page filter UI: dropdown grouped by Role / Skill / Product. `company` and `placement` excluded from filter display.
- Entry page: tags render as clickable pills grouped by role/skill/product, each linking to `section.html?tags={normalized}`.

---

## 7. URL Routing

### Flat slug architecture

```
Production: august.style/{slug}
Local:      localhost:5500/entry.html?path={slug}
```

### Entry pages

Pre-rendered HTML per entry at `_pages/{slug}.html`, generated by `generate_manifest.py` from `entry.html` + entry JSON's SEO fields. Jekyll outputs at `/{slug}/`. `entry-controller.js` hydrates client-side.

### Section pages

`section.html` is a universal tag browser. Routing:

```
section.html?tags=Web+Developer
section.html?tags=Web+Developer+Framer    (AND of multiple tags)
section.html#tags=Copywriting             (hash form, no reload)
```

URL parser merges querystring + hash, treats `+` as delimiter, applies `normalizeForURL()` per tag.

### Collection pages (v4.2.3)

```
august.style/collection/{slug}
```

Pre-rendered HTML at `_pages/collection-{slug}.html` (also via `generate_manifest.py`). Controller: `collection-controller.js`. Filter UI similar to section page but scoped to one collection's `media[]` UIDs.

### Item pages (v4.2.3)

```
august.style/media/{slug}
```

Pre-rendered HTML at `_pages/media-{slug}.html`. Controller: `media-controller.js`. Shows single item + related items (same tags).

### 404 fallback

`404.html` handles unknown paths by assuming section-style routing; sets `sessionStorage('sectionPath')` and injects `section.html` template body inline (no redirect).

### Manifest (`assets/js/manifest.json`)

Maps every slug to JSON path. Auto-generated:

```json
{
  "entries": { "saas-product-sale-features": "assets/entries/uid-rfr-187.json" },
  "collections": { "logo-marks-2026": "assets/collections/uid-col-001.json" },
  "items": { "logo-mark-acme": "assets/items/uid-itm-001.json" }
}
```

Run `python3 generate_manifest.py` after adding/renaming/removing entries, collections, or items. This also regenerates all `_pages/*.html` files.

---

## 8. File Structure

```
/
+-- index.html                           Homepage
+-- section.html                         Universal tag/filter page
+-- entry.html                           Entry page template
+-- collection.html                      Collection page template (v4.2.3)
+-- media.html                           Item page template (v4.2.3)
+-- 404.html                             SPA fallback for section pages
+-- landing.css                          Homepage styles
+-- styles.css                           Entry + section + collection + item page styles
+-- generate_manifest.py                 Manifest + per-page HTML generator
+-- _pages/
|   +-- {slug}.html                      Entry pages with SEO meta tags
|   +-- collection-{slug}.html           Collection pages
|   +-- media-{slug}.html                Item pages
|
+-- assets/
    +-- js/
    |   +-- data-loader.js               Fetching, caching, filtering, tag helpers; collection/item resolvers
    |   +-- landing-controller.js        Homepage: hero + narrative spine + process + featured tiles + CTA
    |   +-- section-controller.js        Section page: tag parsing, filtering, tile rendering
    |   +-- entry-controller.js          Entry page: columns + flow renderers, lightbox state pool
    |   +-- collection-controller.js     Collection page (v4.2.3)
    |   +-- media-controller.js          Item page (v4.2.3)
    |   +-- tile-renderer.js             Tile DOM construction (section + homepage tiles)
    |   +-- filter-controller.js         Multi-select dropdown + URL hash state
    |   +-- featured-tile-controller.js  Sequenced auto-play + tap-state machine for homepage tiles (v4.2.3)
    |   +-- manifest.json                Auto-generated
    |   +-- homepage-content.json        Homepage config + copy strings
    |
    +-- entries/
    |   +-- uid-*.json                   Published entries (v6.1 schema)
    +-- collections/
    |   +-- uid-col-*.json               Published collections (v6.0 schema)
    +-- items/
    |   +-- uid-itm-*.json               Published items (v6.0 schema)
    +-- drafts/
    |   +-- uid-*.json                   Entries removed from publication; staging-or-archive
    +-- .media/                          Pre-CDN media staging + personal archive (gitignored)
    +-- images/                          Legacy working directory for CDN uploads (gitignored)
    |
    +-- docs/
    |   +-- _entry_template.json         Blank entry template (v6.1)
    |   +-- _collection_template.json    Blank collection template (v6.0)
    |   +-- _item_template.json          Blank item template (v6.0)
    |   +-- tags.json                    Tag registry (6 groups)
    |   +-- AUGUST_STYLE.md              This document
    |   +-- ENTRY_SOP.md                 Entry creation standard operating procedure
    |   +-- BRAND_COPY_STRATEGY.md       Living homepage-copy iteration surface
    |   +-- archive/
    |       +-- v4_1/                    v4.1.x planning artifacts (historical)
    |       +-- v4_2/                    v4.2.x planning artifacts
    |       +-- v4_3/                    v4.3 staging
    |
    +-- scripts/
        +-- project.sh                   CLI for generating new entry/collection/item files
        +-- new_project.py               Entry/collection/item generator
        +-- validate.py                  Schema validator (entries + collections + items)
        +-- cdn_cleanup.py               R2 orphan-detection script (v4.2.3)
```

---

## 9. Data Flow

### Homepage

```
index.html
  -> landing-controller.js
       -> DataLoader.loadAllProjects()      (manifest + every entry JSON)
       -> DataLoader.loadHomepageContent()  (homepage-content.json: filters + copy strings)
       -> Renders sections in order:
            hero (uses about_pool copy)
            narrative_spine (uses phase_a/b/c copy)
            featured_tiles (filters by placement[Featured]+placement[Phase X])
            process (uses process.steps copy)
            credentials (unchanged)
            achievements (flattens all entries' achievements[] arrays)
            cta_section (uses copy block)
       -> Sections with 0 results / empty copy are hidden
```

### Section page

```
section.html (or 404.html -> section.html template)
  -> section-controller.js
       -> parseURL()                          (querystring + hash + sessionStorage)
       -> DataLoader.loadAllProjects()
       -> DataLoader.filterByAllTags()
       -> TileRenderer.renderSectionTiles()
       -> FilterController.init(callback)
```

### Entry page

```
entry.html (pre-rendered at _pages/{slug}.html)
  -> entry-controller.js
       -> getEntryPath()
       -> DataLoader.loadProject()
       -> Branch on entry.layout:
            "columns" -> populateColumnsLayout()
              populateTagsColumn(), populateMainColumn(), populateBleed(),
              populateChallenge/Approach/Result
            "flow"    -> populateFlowLayout()
              For each block in flow[]: emit DOM per type
              chunk_break -> show "Continue reading" button; rest of flow loads on click
       -> All on-page imagery registers into one lightbox index pool
```

### Collection / Item pages (v4.2.3)

```
collection.html -> collection-controller.js
  loadCollection(slug) -> renders header + filterable grid of resolved items

media.html -> media-controller.js
  loadItem(slug) -> renders single item + related items by shared tags
```

---

## 10. Codebase Grounding

Controllers and their responsibilities. File:line references are intentionally omitted — grep at execution time, since edits shift lines.

### `entry-controller.js`

- `getEntryPath()` — resolves slug from URL/sessionStorage/pathname
- `loadEntryData(slug)` — fetches via manifest
- `populateMetadata()` — title, meta tags, OG tags
- `populateTagsCards()` — role/skill/product tag pills
- `populateColumnsLayout()` — orchestrates columns-layout rendering
- `populateFlowLayout()` — walks `flow[]` array, dispatches per block type (v4.2.3)
- `populateMainMedia()` — renders `main_media[]` groups (v4.2.3, replaces populateGifs / populateMobileImg)
- `populateBleed()` / `populateBleedSlides()` — new bleed components (v4.2.3)
- `populateRelatedPosts()` — 5 entries via 6-hour seeded random
- Lightbox index pool registration happens inline during each populate function

### `landing-controller.js`

- Hero render (background video, blurred half, cutout name, rotating ABOUT pool from homepage-content.json)
- Narrative spine render (three-section, no tabs)
- Featured tiles render (delegated to `featured-tile-controller.js`)
- Process section render (static three-step, clickable to `section.html?tags=Phase+X`)
- Credentials / Achievements / CTA renders (achievements flattens across all entries)

### `featured-tile-controller.js` (new, v4.2.3)

- Sequenced auto-play state machine (one tile at a time, scroll-into-view trigger)
- Tap-state machine (single / double / triple-tap behavior)
- Random pick of qualifying entry per phase slot + random pick of video from that entry's `feature_tile[]`

### `data-loader.js`

- `loadManifest()` / `loadProject()` / `loadAllProjects()` (existing)
- `loadCollection()` / `loadCollectionItem()` (v4.2.3, with resolver for collection-of-collections union/intersection)
- `resolveFilter()` — applies `all` then `any`
- `filterByAllTags()` — section-page filtering
- `normalizeForURL()` — tag normalization for matching

### `section-controller.js`

- `parseURL()` — querystring + hash + sessionStorage merge
- Renders filtered tiles, wires `FilterController` callbacks

### `collection-controller.js` / `media-controller.js` (new, v4.2.3)

- Per § 7 routing description above
- Collection page reuses `FilterController` scoped to one collection's items

### DOM regions (high-level)

- `entry.html` — `.entry-hero-image` (replaced in v4.2.3 by thumbnail slideshow hero), `.entry-thumb-grid` (replaced by sticky tag+embed column), `#main-media-region`, `#bleed-region`, `#bleed-slides-region`, `#flow-region`
- `index.html` — `#hero`, `#narrative-spine` (new v4.2.3), `#featured-tiles` (new v4.2.3), `#process`, `#credentials`, `#achievements`, `#cta-section`

---

## 11. Local Development

```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

Local URLs:

```
Homepage:   http://localhost:5500/
Section:    http://localhost:5500/section.html
Section:    http://localhost:5500/section.html?tags=Web+Developer
Entry:      http://localhost:5500/entry.html?path={slug}
Collection: http://localhost:5500/collection.html?path={slug}      (v4.2.3)
Item:       http://localhost:5500/media.html?path={slug}           (v4.2.3)
```

### Adding new content

See `assets/docs/ENTRY_SOP.md` for the entry-authoring pipeline. Collections and items follow the same shape: generate via `assets/scripts/project.sh`, fill fields, validate, regenerate manifest.

---

*Schema and architecture decisions for v4.2.3 are spelled out in `assets/docs/archive/v4_2/v4_2_3_IMPLEMENT.md`.*
