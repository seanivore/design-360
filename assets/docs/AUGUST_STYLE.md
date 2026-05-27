# august.style — Project Architecture & Schema Reference

**Aligned with**: v4.2.3 shipped state (post-ship visual review folded in)
**Last updated**: 2026-05-27

Living master document for the august.style portfolio site (vanilla HTML/CSS/JS + Jekyll, zero JS dependencies, Cloudflare R2 CDN). Updated each planning session to reflect the current target state of schema, controllers, and architecture. Symbiotic with the highest-numbered `vX_Y_Z_IMPLEMENT.md` in `assets/docs/archive/vX_Y/`.

**Note on this revision**: v4.2.3 shipped against the IMPLEMENT spec, then went through a substantial post-ship visual review with Sean. The doc below describes the **shipped state**, which diverged from IMPLEMENT in several places (hero composition, featured-tile interaction model, spine typography, entry-hero shape, entry-page nav). Where the IMPLEMENT and the ship diverge, this doc reflects what's actually in the repo.

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

- `{ "type": "h3", "text": "..." }` — chapter-tier heading (large bold sans, normal case).
- `{ "type": "h4", "text": "..." }` — section-tier heading (medium bold sans).
- `{ "type": "h5", "text": "..." }` — leaf-tier heading. Renders as **italic Instrument Serif** in terracotta — distinct family + style so even at small size it stays distinguishable from h4. The IMPLEMENT spec called for uppercase all-caps; that was reversed post-ship for readability.
- `{ "type": "p", "text": "..." }` — paragraph. Max-width 56rem (--flow-text-measure) centered.
- `{ "type": "img", "images": [...], "alt": "..." }` — image row. Single-image rows constrain to 60% width centered (so they read at the size a 2-up tile would); multi-image rows fill the row.
- `{ "type": "list", "items": [...], "style": "bluepoints" }` — bulleted list. **Items can be either plain strings (leaf bullet) OR `{ "text": "Topic", "items": [...] }`** for nested topic-with-sub-bullets. Top-level depth-0 list = topic-tier (bolder, terracotta dot, narrower 44rem); depth-1 sub-list = leaf-tier (smaller font, bluepoint sub-bullets). The Wave 3 entries were initially authored with flat "Topic — sub1; sub2; sub3" strings; a one-shot migration converted them to the nested shape post-ship.
- `{ "type": "chunk_break", "button_text": "Continue reading" }` — progressive-disclosure marker. Auto-reveals on scroll via IntersectionObserver (button doesn't have to be clicked), OR by manual click. When the first chunk-break fires, ALL `.flow-chunk-hidden` siblings reveal and every subsequent chunk-break wrapper is removed too (no laddering).
- `{ "type": "embed_html", "html": "<blockquote>...</blockquote>", "alt": "..." }` — raw HTML embed. Centered (max-width 56rem). Twitter `<blockquote class='twitter-tweet'>` blocks auto-load `platform.twitter.com/widgets.js` via `ensureTwitterWidgets()` since `<script>` tags injected via `innerHTML` don't execute. Tweet blockquotes should use `data-theme='light'` so they read on the dark site.
- `{ "type": "collection_preview", "collection": "slug-here" }` — renders a horizontal-scroll preview of the first 8 items in the named collection + a "View Full Collection" link. Each thumb registers into the lightbox pool.

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

### Filter-based + copy-only sections

```json
{
  "hero": {
    "filter": { "any": [] },
    "about_pool": ["Line one variant", "Line two variant"],
    "cta_secondary": { "text": "All Projects", "href": "/section.html" }
  },
  "narrative_spine": {
    "phase_a": { "label": "Phase A", "heading": "Foundation", "body": "..." },
    "phase_b": { "label": "Phase B", "heading": "Generative Automations", "body": "..." },
    "phase_c": { "label": "Phase C", "heading": "Custom AI Solutions", "body": "..." }
  },
  "featured_tiles": {
    "heading": "Three phases. One through-line.",
    "subheading": "Find the friction. Design the system. Ship the thing.",
    "video_card": { "filter": { "any": ["Featured"] } },
    "cards": [
      { "phase": "Phase A", "title": "Foundation", "bullets": ["..."], "href": "/section.html?tags=Phase%20A" },
      { "phase": "Phase B", "title": "Generative Automations", "bullets": ["..."], "href": "/section.html?tags=Phase%20B" },
      { "phase": "Phase C", "title": "Custom AI Solutions", "bullets": ["..."], "href": "/section.html?tags=Phase%20C" }
    ]
  },
  "process": { "heading": "...", "steps": [ { "word": "FOUNDATION", "body": "...", "href": "..." } ] },
  "credentials": { "heading": "Experience", "items": [/* unchanged shape */] },
  "achievements": { "heading": "Achievements", "source": "entries", "limit": null },
  "cta_section": { "heading": "...", "body": "...", "primary": { "text": "...", "href": "..." }, "secondary": { "text": "...", "href": "..." } }
}
```

### Filter operators

- `"any": [...]` — entry has at least one of these tags
- `"all": [...]` — entry has every one of these tags

Both can combine. `DataLoader.resolveFilter()` applies `all` first, then `any` on the result. `DataLoader.getProjectTags(project)` includes role + skill + product + **placement** + company — the placement-inclusion was a post-ship fix (the original implementation omitted placement, breaking featured-tile filtering).

### Featured-tiles section (Prisma 4-card grid — shipped reality)

The shipped featured-tiles section is a 4-card grid: **one video card** (left) + **three phase cards** (right). The IMPLEMENT spec called for three sequenced video tiles with a tap-state machine — that was replaced post-ship with this layout per Sean's Prisma reference.

- **Video card** (card 1): random pick from any entry whose tags match `video_card.filter` (default `{any: ["Featured"]}`) AND has a non-empty `feature_tile[]`. Random URL from that pool. Auto-plays, muted/loop/playsinline. Subtle warm-wash CSS filter (sepia .25 / saturate .7 / brightness .95 / contrast 1.05) so it reads as "aesthetic mood" not as a project teaser. No click-through.
- **Phase cards** (cards 2–4): each renders the phase label + title + 4 bullets (terracotta ✓ markers) + "Learn more →" linking to `/section.html?tags=Phase%20X`.
- Section heading above the grid: `featured_tiles.heading` (white) + `featured_tiles.subheading` (gray).
- The `featured-tile-controller.js` state machine from IMPLEMENT § 4.5 (sequenced auto-play, single/double/triple-tap detection) is **dormant in the shipped homepage**. The file still exists for compatibility; it listens for `'featured-tiles:ready'` but there's only one video card now, so its state machine doesn't actually run.

### URL routing — Phase URLs

Phase URLs use `%20` (URL-encoded space), not `+`: e.g. `?tags=Phase%20A`. The section-controller splits `tags` queries on `+` as the multi-tag AND delimiter; passing `Phase+A` would parse as two tags ("Phase", "A") and match zero entries.

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

- **Section page filter UI**: dropdown grouped by Role / Skill / Product. `company` and `placement` excluded from filter display. (Known gap: `company` isn't surfaced in the section-page filter dropdown yet; logged for a later patch.)
- **Entry page tags — layout-aware** (shipped post-ship dedup):
  - `layout: "flow"` entries: top + bottom `.entry-tags-card` pills (clickable to `section.html?tags=...`). The sticky `#entry-tag-column` is hidden because there's no two-column structure to anchor it.
  - `layout: "columns"` entries: sticky `#entry-tag-column` on the right holds the tag pills + media_embed iframe. Top + bottom `.entry-tags-card` are hidden to avoid duplicate tag rendering.
- **Homepage credentials tags**: render as visual `<span class="tag">` pills (non-clickable, `pointer-events: none`). The whole `.cred-item` is the clickthrough anchor — links to `?tags={company}`. Tag-level filter routing is parked until those routes have real content; the visual pills stay either way.

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

- `getEntryPath()` — resolves slug from URL/sessionStorage/pathname.
- `loadEntryData(slug)` — fetches via manifest.
- `populateMetadata()` — title, meta tags, OG tags.
- `populateTagsCards()` — role/skill/product tag pills into top + bottom `.entry-tags-card`. Called for flow layout only (columns hides these; see § 6 Tag display).
- `populateTagColumn()` — sticky right-column tag pills + `media_embed` iframe. Called for columns layout only (flow hides the `.entry-content-media` wrapper entirely).
- `populateThumbHero()` — renders the entry-hero as a **full-bleed peeking-row of thumbnails** (post-ship redesign). One `<img class="entry-hero-tile">` per `entry.thumb[]` URL, each 80vw wide with `aspect-ratio: 16/9` and a 2px white border. The row scrolls horizontally; on every viewport the row breaks out of the container padding via the `width: 100vw; margin-left: calc(50% - 50vw)` trick. Pagination/arrows from the IMPLEMENT spec were removed — the horizontal scroll IS the navigation.
- `populateColumnsLayout()` — orchestrates the columns shape: tag column, content text, thumb hero, main_media, image_grids, slideshows, project_url, github_repo, bleed, bleed_slides.
- `populateFlow()` — orchestrates flow: shared shell (tags / thumb hero / content / origin links) + `populateFlowLayout`.
- `populateFlowLayout()` — walks `entry.flow[]`. Block types: h3/h4/h5/p/img/list/chunk_break/embed_html/collection_preview.
- `buildListUL(items, style, depth)` — recursive list renderer (post-ship). Items can be plain strings (leaf bullets) OR `{text, items}` (topic + nested sub-bullets). Top-level depth-0 list is "topic-tier" (terracotta dot, bolder); depth-1 sub-list is "leaf-tier" (smaller font, smaller dot, in bluepoints style or default).
- `populateMainMedia()` / `populateBleed()` / `populateBleedSlides()` — render their respective sections.
- `populateRelatedPosts()` — 5 entries via 6-hour seeded random.
- `wireChunkBreak(chunkEl, parent)` — wires a chunk-break block. Two trigger paths: manual click OR `IntersectionObserver` auto-reveal as the button scrolls into view. Both call the same `reveal()` (idempotent), which strips `.flow-chunk-hidden` from all subsequent siblings and removes every `.flow-chunk-break` wrapper from the parent (gates collapse, no leftover empty space).
- `ensureTwitterWidgets()` — loads `platform.twitter.com/widgets.js` on demand when an `embed_html` block contains a `.twitter-tweet`. Necessary because `<script>` tags injected via `innerHTML` don't execute. Calls `twttr.widgets.load()` on re-entry.
- `initLightbox()` — unified lightbox index pool. Every image-emitting renderer (`populateThumbHero`, `populateMainMedia`, `populateImageGrid`, `populateBleed`, `populateBleedSlides`, `renderSlide`, flow `img` blocks, `resolveCollectionPreview`) registers into one `lightboxPool[]` and sets `data-lightbox-index` on each `<img>`. Document-level click delegation reads the index. Keyboard: arrows + Home/End + Esc. Touch swipe + neighbor preload via injected `<link rel="preload" as="image">`.
- `initNavCollapse()` — fixed `#siteNav` (entry-page top bar) hides on scroll-down past 200px, returns on scroll-up. `#navPill` hamburger reappears as a "bring nav back" affordance when the nav is hidden.

### `landing-controller.js`

- `renderHero()` — picks one random line from `homepage-content.json.hero.about_pool[]` and writes `#heroAboutLine`. The video, blur, AUGUST cutout, HORVATH cutout are CSS-only.
- `renderNarrativeSpine()` — emits three `.spine-section` blocks, one per phase. Each section is a clickable anchor to `/section.html?tags=Phase%20X`. Heading uses a mixed-style pattern: `<span>Phase A is</span> <em class="spine-section__heading-accent">Foundation</em>.` — italic-serif (Instrument Serif) accent on the heading word, normal sans on the prefix. Body paragraph below in a narrower (34rem) measure at 0.8rem.
- `renderFeaturedTiles()` — 4-card grid. Video card uses `featured_tiles.video_card.filter` to pick from any qualifying entry's `feature_tile[]`; phase cards are static from `featured_tiles.cards[]`. Dispatches `'featured-tiles:ready'` for the featured-tile-controller (which is dormant in this layout).
- `renderProcess()` — 01/02/03 horizontal-scroll cards (terra/blue/mauve nth-child color cycle), restored to pre-rewrite layout per "Final Keepers" direction. Each card clickable to `step.href`.
- `renderCredentials()` — emits each item as a `<a class="cred-item">` linking to the company filter. Tag pills inside are `<span class="tag">` with `pointer-events: none` (post-ship dedup: whole card is the clickthrough, individual tag clicks parked).
- `renderAchievements()` — flattens `achievements[]` across all projects, keeping each entry's `slug` + `title` alongside. Each item is an expandable accordion (`.ach-item` + `initAccordion`). Body ends with an italic-serif terracotta `see where this happened →` link to the source entry.
- `renderCTASection()` — heading + body + `.cta-actions` row with two buttons (primary + secondary). Stacks to column on mobile (≤32rem).
- `initAccordion()` — toggles `.open` on `.ach-item` when the header is clicked.
- `initScrollReveal()` — IntersectionObserver fades in `.sr` elements.
- `initNavCollapse()` — hides `.hero-cyberpunk__nav.hide` on scroll-down past 200px, returns on scroll-up. The homepage **does not ship a nav-pill** (removed post-ship: the hero-integrated nav lives inside the hero section, so a "bring me back" pill has no useful action). `initNavCollapse` is pill-optional — if `#navPill` doesn't exist, scroll-hide still works.

### `featured-tile-controller.js` (dormant in shipped homepage)

Sequenced auto-play state machine from IMPLEMENT § 4.5 — IntersectionObserver trigger, Pointer Events single/double/triple-tap detection. **Currently dormant**: the shipped featured-tiles section has only one video card (auto-plays on its own with `autoplay loop muted playsinline`), so the controller's state machine has nothing to sequence. The file is retained for compatibility and for any future return to the 3-tile sequenced layout.

### `data-loader.js`

- `loadManifest()` / `loadProject()` / `loadAllProjects()` (existing).
- `loadCollection()` / `loadCollectionItem()` — slug-keyed Promise cache; resolves via `manifest.collections[slug]` / `manifest.items[slug]`.
- `resolveCollectionMedia(collection)` — lazy UID→slug index then `Promise.all` resolves `collection.media[]` UIDs to loaded item objects.
- `unionCollections(slugs)` / `intersectCollections(slugs)` — set operations on multiple collections' resolved media.
- `resolveFilter(projects, filter)` — applies `all` then `any`.
- `filterByAllTags()` / `filterByAnyTag()` — section-page filtering.
- `getProjectTags(project)` — combined tag union: role + skill + product + **placement** + company. Placement was added post-ship (the original implementation omitted it, breaking featured-tile filtering).
- `normalizeForURL()` — tag normalization for matching.

### `section-controller.js`

- `parseURL()` — querystring + hash + sessionStorage merge.
- Renders filtered tiles, wires `FilterController` callbacks.

### `collection-controller.js` / `media-controller.js`

- Per § 7 routing description above.
- `media-controller.js` has an inlined private `loadAllItems()` helper (mirror of `loadAllProjects` but for items) — kept local to the controller rather than added to `data-loader.js` to avoid a parallel-write conflict during Wave 2.

### DOM regions (high-level)

- `entry.html`:
  - **Nav**: `<nav class="site-nav site-nav--entry" id="siteNav">` (fixed top bar) with `.site-logo` favicon SVG + `.nav-links` (Home / All Projects / Contact). `#navPill` hamburger appears when nav is hidden. Both controlled by `entry-controller.initNavCollapse`.
  - **Header**: `.entry-header` (h1 title + h2 subtitle), `.entry-role-section` (h3 role).
  - **Tags**: `.entry-tags-layout` (top + bottom `.entry-tags-card`) — hidden on columns layout. `#entry-tag-column` (sticky right) — hidden on flow layout.
  - **Hero**: `#entry-hero > .entry-hero-gallery > .entry-hero-tile[]` — full-bleed peeking-row of thumbs (post-ship redesign).
  - **Media regions**: `#main-media-region`, `#bleed-region`, `#bleed-slides-region`, `#flow-region` (flow layout only).
  - **Legacy regions**: `#entry-image-grid`, `#entry-image-grids`, `#entry-slideshows`, `#entry-gifs` (display:none until populated for legacy entries).
  - **Lightbox**: `#lightbox-overlay`.
  - **Related**: `.related-posts-section > #related-posts-grid`.
- `index.html`:
  - **Hero**: `<section id="hero" class="hero-cyberpunk">` — integrated nav overlay (logo + lowercase +prefix links + +contact), bg-video, frost blur (left half), AUGUST cutout (top-left, Bernina Sans Compressed Exbold), HORVATH cutout (bottom-right), bottom-left footer block (`#heroAboutLine` + explore CTA + socials). No separate top nav bar. No `#navPill` on homepage.
  - **Spine**: `<section id="narrative-spine" class="spine">` — three `.spine-section` blocks with alternating subtle bg tint.
  - **Featured tiles**: `<section id="featured-tiles" class="feature-tiles">` — 4-card grid (1 video + 3 phase cards).
  - **Process**: `<section id="process" class="process">` — heading + horizontal-scroll cards.
  - **Credentials**: `<section id="credentials" class="credentials">` — 56rem-wide centered list of company cards.
  - **Achievements**: `<section id="achievements" class="achievements">` — 40rem-wide centered accordion.
  - **CTA trios**: `.cta-trio--minimal` between Achievements and CTA, `.cta-trio--full` (animated) after CTA.
  - **CTA**: `<section id="ctaSection" class="cta-section">` — heading + body + `.cta-actions` row of two buttons.

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
