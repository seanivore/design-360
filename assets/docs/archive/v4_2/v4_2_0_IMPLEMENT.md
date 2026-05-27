# v4.2.0 Implementation Plan — Entry Overhaul + Homepage Redesign + Media Collections

**Initiative**: v4 entry-layout overhaul, homepage cyberpunk-hero redesign, Media Collections subsystem, 3 new showcase entries, current-site UX fixes, docs + tooling refresh.
**Version**: v4.1.0 → v4.2.0
**Revision driven by**: 2026-05-27 planning session — codebase-grounded reorganization of `v4_1_0_IMPLEMENT.md`, scope expansion to keep Media Collections fully in this initiative, accurate audit of legacy-media entries, explicit gap list for next revision. Pushing toward exclusively-executable per `.agent/DEV_RULES.md` § *The Gap-Finding Loop*.
**Status**: Draft — first revision. Hand to a fresh cold-review subagent next session to produce `v4_2_1_IMPLEMENT.md`.

---

## Required reading

The next agent reads these before touching this plan:

- `assets/docs/JSON_ARCHITECTURE.md` — current schema reference (v5.1, will be bumped to v6.0 by this initiative)
- `assets/docs/ENTRY_SOP.md` — entry creation flow (also bumped this initiative)
- `.agent/DEV_RULES.md` — versioning, gap-finding loop, BUILD contract, no-mixed-truth
- `.agent/AGENTS.md` — agent persona and document map
- `assets/docs/archive/v4_1/v4_1_0_IMPLEMENT.md` — original strategic framing. **Reference only — do not re-execute from it.** All decisions Sean locked in conversation are folded into this v4_2_0 file; v4_1_0 is the historical "why".
- The phase entry drafts: `assets/docs/archive/v4_1/PHASE_A1_v4.md`, `PHASE_A2_v2.md`, `PHASE_B1_v2.md`, `PHASE_C.md`
- `.agent/CLAUDE_DESIGN_ANIM_SITE.md` — hero animation reference (referenced from v4_1_0)

**If you find missing context**: Confirm with Sean and update this file (or `JSON_ARCHITECTURE.md`) — do not paper over the gap inline somewhere else.

---

## 1. Strategy & Narrative (carried verbatim from v4_1_0)

The in-demand skill this portfolio illustrates aptitude for is **Building Custom AI Pipelines**. Companies want to know what it means to rebuild themselves to use AI. The portfolio answers by showing Sean's own three-phase adaptation:

1. **Phase A — Foundation (Pre-AI)**: anchor expertise; show breadth and accolades.
2. **Phase B — Generative Automations (Early AI)**: low-code-tool LLM automations; legitimize the shift; demonstrate pace of personal adaptation.
3. **Phase C — Custom AI Solutions (Modern AI)**: agentic tools + custom chat surfaces that remove client-side friction.

The homepage funnels visitors through this narrative; entries are the proof; Media Collections will be where supporting media that doesn't deserve a full entry page lives.

See `v4_1_0_IMPLEMENT.md` § *The Strategy* + § *Chronological Timeline Structure* + § *Copywriting → My AI Focused "Sell"* for the full unedited copy. No re-litigation in this revision.

---

## 1.5. Priority & Sequencing (Sean's brain order)

Confirmed 2026-05-27: **the goal of "today's push" is a presentable state to resume job applications** — cohesive homepage narrative + 3 new showcase entries live + nothing visibly broken. Everything else is "continue forward after." Sean explicitly wants room left to keep iterating on collections and bleed-style polish for non-showcased entries on his own cadence afterward.

That reorders v4.2's BUILD tracks into two waves:

**Wave 1 — Ship-for-jobs (the critical path)**:
- WS-2 (homepage redesign) — **full scope** (this is the narrative funnel)
- WS-4 (the 3 new showcase entries A1 / A2 / B1, plus Phase C as homepage copy only — no Phase C entry rushed)
- WS-1 **minimum-viable subset**: thumbnail slideshow hero + flow layout renderer + `main_media` component + sticky tag/embed column + slideshow removal scoped only to what the 3 new entries need. `bleed`, `bleed_slides`, lightbox-everywhere extension, and tile-tag UX fix can land in Wave 2 if they're not strictly required for A1/A2/B1.
- WS-6 **minimum-viable subset**: validator + `_entry_template.json` updated enough to accept the 3 new entries; ENTRY_SOP edits for flow layout authoring; JSON_ARCHITECTURE summary update. Full v6 rewrite + collection/item SOPs defer to Wave 2.

**Wave 2 — Continue-forward (after you're applying)**:
- WS-3 (Media Collections subsystem — full build, paired with seeding from `assets/drafts/`)
- WS-5 (legacy migration of the 12 published entries — after Sean's triage pass; some likely move to drafts + future collections instead)
- WS-1 remainder: `bleed`, `bleed_slides`, full lightbox-everywhere extension, tile-tag UX fix, YouTube blurry-thumbnail investigation
- WS-6 remainder: `cdn_cleanup.py`, full doc rewrite, README refresh, collection/item SOPs

Wave 1 cuts as TRACK_A + TRACK_B + TRACK_C (homepage / entries / docs+templates minimum); Wave 2 cuts as TRACK_D + TRACK_E + TRACK_F when ready. See § 6 for the refined track table.

This reordering does **not** descope anything in this initiative — it just stages execution. The full v4.2 plan still ships v4.2 features; it just lands the visible-to-recruiter parts first.

---

## 2. Codebase Grounding (ground truth — referenced from every WS below)

### 2.1 Entry page anatomy (`entry.html` + `styles.css`)

| Component                 | Classes / DOM                                                                                       | CSS lines          | Notes                                                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Hero                      | `.entry-hero`, `.entry-hero-image`                                                                  | 1216–1234          | Currently shows single random `thumb` image or video embed. Will be rebuilt as a thumbnail slideshow (peek behavior on mobile). |
| Content media grid        | `.entry-content-media`, `.entry-text-column`                                                        | 1177–1215          | Two columns, 50/50 at tablet+. Will shift to ~60/40 with sticky right column.                                                   |
| Right-column thumb grid   | `.entry-thumb-grid`, `.entry-thumb`                                                                 | 1236–1256          | **Remove** — replaced by sticky tag+embed column.                                                                               |
| Tag layout (top + bottom) | `.entry-tags-layout`, `.entry-tags-card`, `.tag-pill-group-role/skill/product`                      | 1035–1074          | Top instance moves into the right column; bottom instance kept as-is.                                                           |
| GIFs section              | `.entry-gifs`, `.entry-gif`                                                                         | 1257–1274          | Folded into `.entry-main-media`.                                                                                                |
| Image grid                | `.entry-image-grid` (legacy flat) / `.entry-image-grids` (grouped)                                  | ~1275–1310         | Kept — both flat `grid[]` and grouped `grids[]` already supported by renderer.                                                  |
| Slideshow section         | `.entry-slideshows`                                                                                 | inline HTML        | **Remove entirely** in v4.2.                                                                                                    |
| Related posts             | `.related-posts-section` → `.grid-related` → `.tile.fade-in-item` → `.tile-gallery` → `.tile-image` | 1628–1700          | Mobile bleed/peek behavior to mirror in new hero.                                                                               |
| Lightbox overlay          | `.lightbox-overlay`, `.lightbox-img`, `.lightbox-counter`                                           | entry.html 120–126 | Extend to grid + bleed + bleed_slides + main_media.                                                                             |

**Mobile bleed math** (reuse for new components):

- Desktop (≥64rem): `.tile-image { width: 21.875rem; }`
- Tablet (48–63.9rem): `.tile-image { width: 18.75rem; }`
- Mobile (<48rem): `.tile-image { width: 90vw; }` + parent `.tile { width: 100vw; max-width: 100vw; margin-left: calc(-1 * var(--space-md)); margin-right: calc(+1 * var(--space-md)); }`

### 2.2 Controllers

| File                              | Function                        | Responsibility                                                 | Lines    |
| --------------------------------- | ------------------------------- | -------------------------------------------------------------- | -------- |
| `assets/js/entry-controller.js`   | `populateHero(project)`         | Hero: video embed (priority) or random thumb                   | ~122–134 |
|                                   | `populateThumbGrid(project)`    | 2-col thumb grid + lightbox state                              | ~139–160 |
|                                   | `populateGifs(project)`         | GIF section                                                    | ~165–178 |
|                                   | `populateImageGrids(project)`   | Both legacy `grid[]` and grouped `grids[]`                     | ~180–227 |
|                                   | `buildSlideshow(group, index)`  | Slideshow carousel                                             | ~226–320 |
|                                   | `populateTagsCards(project)`    | Top + bottom tag pills                                         | ~80–117  |
|                                   | `populateRelatedPosts(project)` | Bottom 5 tile rotation                                         | ~478+    |
| `assets/js/landing-controller.js` | `renderHero(config, projects)`  | Hero scroll + flip headline + stats                            | ~52–136  |
|                                   | `renderShowcase(config, ...)`   | Tabbed project cards                                           | ~137–195 |
|                                   | `renderProcess(config, ...)`    | 3-step process (current generic copy)                          | ~231+    |
|                                   | `renderCredentials(config)`     | Credentials accordion                                          | ~197–229 |
|                                   | `renderAchievements(config)`    | Achievements list                                              | later    |
| `assets/js/tile-renderer.js`      | exports `TileRenderer`          | Shared tile DOM (`.tile-gallery → .tile-image`)                | utility  |
| `assets/js/data-loader.js`        | manifest/projects/filter utils  | `loadManifest`, `loadProject`, `resolveFilter`, `shuffleArray` | utility  |

### 2.3 Entry inventory (audited 2026-05-27 across 42 entries)

| Media field                                 | Entries with non-empty data | Migration action in v4.2                                                         |
| ------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `slideshows[]`                              | 11 (see WS-5 list)          | Rename `slide-*` → `main-*-N`, move to `main_media` groups                       |
| `gif[]`                                     | 2 (cap-258, sxz-424)        | Rename `gif-*` → `main-*-N`, move to `main_media` groups                         |
| `mobile_img[]`                              | 0                           | No active data — deprecated field can be cleanly removed                         |
| `grids[]` (grouped)                         | 1 (sxz-424)                 | Keep as-is; renderer already supports                                            |
| `grid[]` (flat)                             | unknown — to confirm        | Keep both forms in renderer (already supported); evaluate during BUILD-time pass |
| `media_url`/`media_embed` (YouTube/Behance) | 32 entries                  | No data migration — but renderer change: move embed into sticky right column     |

**Unique entries needing legacy migration: 12.** (See WS-5 § *Affected entries*.)

### 2.4 Homepage anatomy

| Section                     | HTML id / class                                                           | Controller fn       | Disposition in v4.2                                                                                           |
| --------------------------- | ------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| Hero scroll wrap            | `#heroWrapper`, `#heroSticky`, `.hero-scroll-wrapper`, `.hero-img-scroll` | `renderHero`        | **Replace wholesale** with new animated hero                                                                  |
| Trio bridge                 | `#trioBridge`, `.hero-trio-bridge`                                        | (CSS-only)          | **Remove**                                                                                                    |
| Flip headline / dynamic CTA | `.flip-headline`, `.flip-track`, `.hero-cta`                              | `renderHero`        | **Remove**                                                                                                    |
| Hero stats                  | `.hero-stats`                                                             | `renderHero`        | **Remove** (Hero Stats Revamp = open gap, see § 5)                                                            |
| Showcase tabs               | `#showcase`, `.showcase`, `.showcase-tabs`                                | `renderShowcase`    | Reframe as the two new follow-on sections (cinematic quote + 4-card grid); reuse container, replace internals |
| Process                     | `#process`, `.process-scroll`                                             | `renderProcess`     | Re-purpose copy to Phases A/B/C; link to the three new entries                                                |
| Credentials                 | `#credentials`, `.cred-list`                                              | `renderCredentials` | **Keep**; new entries populate                                                                                |
| Achievements                | `#achievements`                                                           | controller fn       | **Keep**; new entries populate                                                                                |

### 2.5 Templates & validator state

- `assets/docs/_entry_template.json` — currently v5.1. Contains deprecated fields: `mobile_img`, `gif`, flat `grid`, `slideshows`. **No** entries for: `layout`, `flow`, `main_media`, `bleed`, `bleed_slides`. Will be rewritten under WS-6.
- `assets/docs/_collection_template.json` — drafted but uses a `collection.*` wrapper (inconsistent with flat v5.1 entry schema). **Will be refactored to flat-field schema** under WS-3 / WS-6 in lockstep with the loader and validator.
- `assets/docs/_item_template.json` — same wrapper issue (`media.*`). Same flat-refactor under WS-3 / WS-6.
- `assets/scripts/validate_v5.py` — checks v5.0 schema. **Will reject** all new v4.2 fields. Rename to `validate_v6.py` and extend under WS-6.

### 2.6 v4_2/ directory: pre-existing staging

`assets/docs/archive/v4_2/PHASE_A2_PART_2.md`, `PHASE_A3.md`, `PHASE_B2_v2.md`, `PHASE_B3_v2.md` are **next-after-v4.2 staged content** — additional Phase A and B entries that will follow this initiative ships. They are NOT scope for v4.2.0; they are reference material for v4.3 or later.

---

## 3. Work Streams

Six work streams. Each maps to a coherent execution boundary. Multiple WS may bundle into one BUILD track (see § 6 — expected splits).

### WS-1 — Entry-page layout overhaul

**Scope**:

1. **Thumbnail slideshow hero** — replace `.entry-hero-image` with a horizontal thumbnail strip that uses the same mobile peek behavior as `.tile-image` in related posts. Always present, identical visual regardless of layout choice.
2. **Two-column ratio shift** — `.entry-content-media` becomes ~60/40 (text/right). Right column hosts the tag groupings (currently at page top) + YouTube/Behance embed if present. Right column is **sticky** within the bounds of the two-column section.
3. **YouTube/Behance embed responsiveness** — embed sits in the narrower right column; aspect ratio preserved; click-to-expand intact. Investigate and fix blurry initial-load thumbnail (see Open Gap #6).
4. **New `layout` field** — JSON entry gets `"layout": "columns" | "flow"` (default `"columns"`).
5. **New `flow` layout renderer** — alternating copy + image rows for storytelling-style entries. JSON schema in § 3.WS-1.schema below.
6. **New `main_media` component** — replaces `gif[]` + `mobile_img[]` with a grouped structure that handles 1–3 items per row, mixed aspect ratios, equal-row-height auto-sizing. JSON schema in § 3.WS-1.schema below.
7. **New `bleed` component** — flush-edge multi-row image groups, no gaps; lightbox enabled. JSON schema in § 3.WS-1.schema below.
8. **New `bleed_slides` component** — single row, off-page-right overflow, same mobile-peek trick as `.tile-image`. JSON schema in § 3.WS-1.schema below.
9. **Lightbox everywhere** — extend `.lightbox-overlay` registration to grid + bleed + bleed_slides + main_media images (currently only thumb + grid).
10. **Slideshow removal** — drop `.entry-slideshows`, `buildSlideshow()`, and CSS for slideshow controls entirely.
11. **Tile-tag UX fix (current-site bug)**:
    - Entry pages at desktop: related-post tile tag container width capped to width of the black text box above; overflow hidden, scroll-to-reveal.
    - Entry pages at tablet: fix asymmetric right margin; widen black text box to match tile width minus a small inset; tags inherit width.

**JSON schema additions** (WS-1.schema):

```jsonc
{
  "layout": "columns",                 // "columns" | "flow"; default "columns"
  "main_media": [                      // array of groups; replaces gif[] + mobile_img[]
    {
      "title": "",                     // optional small-caps heading
      "images": [
        "https://cdn.august.style/media/{slug}/main-1-{slug}-1.webp",
        "https://cdn.august.style/media/{slug}/main-1-{slug}-2.gif"
      ],
      "alt": ""
    }
  ],
  "bleed": [                           // array of rows (1+ images per row, flush)
    {
      "images": ["...row-1-img-1.webp", "...row-1-img-2.webp"],
      "alt": ""
    }
  ],
  "bleed_slides": {                    // single row, off-page overflow
    "images": ["...slide-1.webp", "...slide-2.webp"],
    "alt": ""
  },
  "flow": [                            // ordered list of typed blocks for flow layout
    { "type": "h3", "text": "Section heading" },
    { "type": "p",  "text": "Paragraph copy." },
    { "type": "h4", "text": "Subhead", "style": "bold" },
    { "type": "img", "images": ["...flow-1-{slug}-1.webp"], "alt": "" },
    { "type": "h5", "text": "Image caption-heading" },
    { "type": "list", "items": ["First bullet", "Second bullet"], "style": "bluepoints" }
  ]
}
```

Rationale for the schema choices (consolidation of v4_1_0's deferred-to-implementer notes):

- `main_media`, `bleed`, `flow` use **arrays of group objects** rather than the `img_1` / `alt_1` numbered-key pattern from v4_1_0. Reason: matches the existing `grids[]` and `slideshows[]` precedent (v5.1 already adopted arrays-of-groups), avoids dynamic key parsing in the renderer, and gives each group an optional `title` for visual hierarchy.
- `flow` is a **typed-block list** rather than v4_1_0's nested keyed-copy structure. Reason: nested duplicate keys (`"copy": ..., "copy": ...`) are invalid JSON; the typed list maps 1:1 to renderer dispatch.
- `bleed_slides` is a **single object** (not an array of groups) because the spec says "only ever one row per section." If a project needs two overflow rows, it gets two `bleed_slides` entries via a future schema bump — out of v4.2 scope.

**Files touched**:

- `entry.html` — restructure `.entry-content-media`, insert hero slideshow container, add `<section>` slots for `main_media`, `bleed`, `bleed_slides`, `flow`.
- `styles.css` — rewrite `.entry-hero` block (1216–1234), `.entry-content-media` (1177–1215) for 60/40, sticky right column; remove slideshow CSS; new `.entry-main-media`, `.entry-bleed`, `.entry-bleed-slides`, `.entry-flow-*` blocks; fix tile-tag container width at related-posts section.
- `assets/js/entry-controller.js`:
  - `populateHero` → rewrite for thumbnail slideshow (lightbox-aware).
  - `populateThumbGrid` → **remove**; replaced by `populateSidebarColumn(project)` that mounts tags + embed.
  - `populateGifs` + flat-mobile-img logic → **remove**; folded into new `populateMainMedia(project)`.
  - `buildSlideshow` → **remove**.
  - New: `populateMainMedia`, `populateBleed`, `populateBleedSlides`, `populateFlow`.
  - `populateImageGrids` → keep; add lightbox registration if missing.
- Branch: `feat/entry-layout-v6`

**Dependencies**: WS-4 (the three new entries author flow layout JSON; can't author until schema is locked here). WS-6 (validator + template + docs change in lockstep — DEV_RULES § *No Mixed Truth*).

**Open gaps**: Hero Stats Revamp interplay (none — that's homepage only). Sticky-column boundary on very long entries (Open Gap #4). Flow-layout block-type catalog (do we need `blockquote`, `code`, `video`? — currently no entries demand them).

### WS-2 — Homepage redesign

**Scope**:

1. **New animated hero**:
   - Full-viewport video background, asymmetric blurred overlay (right side blurred, left side exposed).
   - Heavy-bold cutout-letter wordmark "SEAN" (top-left, over blur) + "HORVATH" (bottom-right, over video). "AUGUST" optional middle row.
   - Rotating ABOUT-copy block (small-caps label + 1–2 sentence body) on the blurred half; copy pool seeded from v4_1_0's "My AI Focused Sell" bullets.
   - Replace existing nav with current site nav links.
   - Source video: `assets/.media/home-anim/hero-cyberpunk-FINAL.mp4` — **needs CDN upload first** (asset blocker).
2. **Two follow-on sections** modeled on the Prisma reference in v4_1_0:
   - Cinematic quote section (`.about-card`-style): Sean's positioning statement in mixed weight + italic accents.
   - 4-card feature grid: card 1 is a video tile (we'll source a hero-pipeline-style clip), cards 2–4 are "phase highlight" cards linking to the three new entries — title number (01/02/03), short checklist, "Learn more" with rotated arrow.
3. **Process section copy update** — replace generic 3-step copy with Phases A / B / C; each step links to the relevant showcase entry (WS-4) or, for Phase C, a copy block sourced from `PHASE_C.md`.
4. **Remove**: trio bridge, hero slideshow, flip headline, dynamic CTA, hero stats (pending Hero Stats Revamp — Open Gap #1).
5. **Keep + repopulate**: Credentials (`#credentials`) and Achievements (`#achievements`). Three new entries each contribute one `achievement` and one Credentials-list `tags` row.

**Files touched**:

- `index.html` — replace `#heroWrapper` block (lines 39–74) with new hero markup; replace `#showcase` block (80–90) with quote + 4-card grid; update `#process` block (103–111) copy slots; remove `#trioBridge` (line 77).
- `landing.css` — rewrite hero CSS wholesale; new `.about-card`, `.feature-card`, `.feature-card-video`, `.feature-card-numbered` blocks; new noise-overlay SVG utilities (`.noise-overlay`, `.bg-noise` from the Prisma reference); cutout-letter font setup.
- `assets/js/landing-controller.js`:
  - `renderHero` → rewrite for video-bg + cutout-letter + rotating ABOUT copy.
  - `renderShowcase` → rewrite to render the quote + 4-card grid (still data-driven; quote and card copy live in `homepage-content.json`).
  - `renderProcess` → keep mechanism; update `homepage-content.json` `process` filters to point at the three new entries.
  - `renderCredentials` → no code change; depends on WS-4 supplying entries with `achievement` fields.
- `assets/js/homepage-content.json` — schema additions for `quote` section + `feature_cards` array; rewrite `process` to phase-anchored config; remove `hero.cta` text fields (replaced by rotating copy pool); add `hero.copy_pool[]`.

**Dependencies**: WS-4 (entries to link to from feature cards + process). WS-3 indirectly (if collection preview shows on homepage — Sean's "could also be added to the home page if desired" is **deferred** to a later round; v4.2 puts collection preview only inside `entry.html`).

**Open gaps**: Hero Stats Revamp (Open Gap #1). Cutout-letter font (Open Gap #2). Confirming we don't lose `cta_section` (bottom of homepage) — keep, or refresh copy? (Open Gap #11.)

### WS-3 — Media Collections subsystem (full build)

**Scope**:

1. **Schema lockdown** (and rewrite to match flat v5.1+ convention — the current templates use a wrapper):

   `_collection_template.json` (flat, no wrapper):

   ```jsonc
   {
     "_metadata": { "schema_version": "6.0", "template_type": "media_collection" },
     "id": "uid-xxx-###",
     "slug": "collection-name",
     "title": "Display Title",
     "subtitle": "One-line tagline",
     "seo_title": "",
     "seo_description": "",
     "role": [], "skill": [], "product": [],
     "company": "Freelance",
     "thumb": ["https://cdn.august.style/media/collection/{slug}/thumb-{slug}-1.webp"],
     "thumb_alt": "",
     "media": ["uid-itm-001", "uid-itm-002"],   // array of item UIDs
     "notes": []
   }
   ```

   `_item_template.json` (flat, no wrapper):

   ```jsonc
   {
     "_metadata": { "schema_version": "6.0", "template_type": "collection_item" },
     "id": "uid-itm-###",
     "slug": "item-name",
     "title": "Display Title",
     "subtitle": "",
     "seo_title": "",
     "seo_description": "",
     "media_type": "image",           // "image" | "gif" | "video"
     "src": "https://cdn.august.style/media/item/{slug}.webp",
     "thumb": ["https://cdn.august.style/media/item/{slug}-thumb.webp"],
     "thumb_alt": "",
     "tags": [],                       // free-form (e.g. "bauhaus", "art-history") — distinct from entry role/skill/product registry
     "notes": []
   }
   ```

   Tag inheritance: when an item is referenced by a collection, the collection's `role` / `skill` / `product` / `company` are passed down at render time. Item-level `tags[]` is for finer-grained filtering inside collection.html (Sean's Shopify-style all-products UX).

2. **Page templates**:
   - `collection.html` — new file; renders one collection. Sections: hero (collection thumb + title/subtitle + parent-tag pills), filter bar (drives item tag filter inside the page), media grid (maximized visual space per tile, click → `media.html` for that item).
   - `media.html` — new file; renders one media item. Sections: large media display, title/subtitle, parent-tag pills (resolved from any owning collection), `tags[]` pills, back-to-collection navigation if accessed from one.
   - Both files follow the `entry.html` precedent: pre-rendered via `generate_manifest.py` as Jekyll collections, permalink `/:basename/`, OG tags baked from JSON.

3. **Manifest extension** (`generate_manifest.py`):
   - Add `collections` and `items` sections to `manifest.json` (parallel to `entries`).
   - Generate `_pages/{collection-slug}.html` and `_pages/{item-slug}.html`.
   - Validate that every `media[]` entry in a collection resolves to a real item file.

4. **Data loader extension** (`assets/js/data-loader.js`):
   - `loadAllCollections()` — fetches all collection JSONs.
   - `loadAllItems()` — fetches all item JSONs.
   - `loadCollection(slug)` / `loadItem(slug)` — single fetches.
   - `resolveCollectionItems(collectionUids, mode)` — `mode` = `"union" | "intersection" | "difference"`. Implements v4_1_0's modular-overlap idea.

5. **Collection preview component** for `entry.html`:
   - Class: `.entry-collection-preview`, full-page-width, negative-margin bleed on both sides, horizontal scroll inside, mobile peek behavior reusing the `.tile-image` math (§ 2.1).
   - JSON: an entry references a collection via new optional field `collection_preview` (string, collection UID or slug).
   - Click on any item → `media.html` for that item.

6. **Validator extension** (`assets/scripts/validate_v6.py` — renamed from v5):
   - Detect template_type from `_metadata` (`project_entry` | `media_collection` | `collection_item`).
   - Per-type required-field check.
   - Cross-reference check: every `media[]` UID in collections resolves; every collection-`media` URL CDN-shape-valid.

**Files touched / created**:

- New: `collection.html`, `media.html`, `assets/scripts/validate_v6.py` (renamed), `assets/scripts/cdn_cleanup.py` (under WS-6).
- New directories: `assets/collections/`, `assets/items/`.
- Refactored templates: `assets/docs/_collection_template.json`, `assets/docs/_item_template.json`.
- Modified: `generate_manifest.py`, `assets/js/data-loader.js`, `assets/js/entry-controller.js` (collection preview rendering — add `populateCollectionPreview(project)`), `styles.css` (`.entry-collection-preview` block).

**Dependencies**: WS-6 (validator + template lockstep). The collection preview component shares the bleed math with WS-1's hero slideshow — both must land before either ships, or one wraps in a feature flag.

**Open gaps**:

- Collection.html UI layout wireframe — Open Gap #3.
- Media.html UI layout — Open Gap #3 (combined).
- Whether `tags[]` on items should be free-form or constrained to a new registry — Open Gap #12.
- Initial seed-content for collections: which projects' "extra media" populate the first collections? — Open Gap #13.

### WS-4 — New showcase entries (3) + Phase C homepage copy

**Scope**:

| Phase | Slug                       | Title                                                     | Source draft (`assets/docs/archive/v4_1/`) | Layout | Thumbs source dir                         |
| ----- | -------------------------- | --------------------------------------------------------- | ------------------------------------------ | ------ | ----------------------------------------- |
| A1    | `awards-viral-social`      | PETA Marketing & Social Media Achievements                | `PHASE_A1_v4.md`                           | flow   | `assets/.media/awards-viral-social/`      |
| A2    | `freelance-marketing-web`  | Self-Employed Web Design & Digital Consultancy Highlights | `PHASE_A2_v2.md`                           | flow   | `assets/.media/freelance-marketing-web/`  |
| B1    | `generative-blog-workflow` | Database Powered Generative Content Engine                | `PHASE_B1_v2.md`                           | flow   | `assets/.media/generative-blog-workflow/` |
| C     | (no entry — homepage copy) | —                                                         | `PHASE_C.md`                               | n/a    | n/a                                       |

For each of the three entries:

1. Process source media in `assets/.media/{slug}/` through Cloudinary per ENTRY_SOP § 4.
2. Sync to R2 CDN per ENTRY_SOP § 5.
3. Generate UID via `python3 assets/scripts/new_project.py`, populate JSON with v6.0 schema (flow layout, no deprecated fields).
4. Extract `achievement` entries from the draft's "achievements collection" sections (drafts say *"Please come up with a handful of them from the collection below"* — this is a curation task, not blind copy).
5. Run `validate_v6.py` → `generate_manifest.py`.

Phase C copy: lifted directly into `homepage-content.json` `process[2]` section + the corresponding 4th feature-card detail (if we map cards 2/3/4 to A/B/C).

**Files touched / created**:

- 3 new entry JSONs in `assets/entries/` (UIDs generated at creation time).
- 3 CDN sync operations under `s3://portfolio/media/{slug}/`.
- `assets/js/homepage-content.json` (Phase C process step + feature-card 4).

**Dependencies**: WS-1 (flow layout schema must be locked before authoring). WS-6 (validator must accept v6 schema before validate step).

**Open gaps**:

- The `assets/.media/` vs `assets/images/` working-directory mismatch — ENTRY_SOP says `assets/images/{slug}/`, drafts say `assets/.media/{slug}/`. Reconcile (Open Gap #10) before processing media to avoid a path-renaming pass later.
- Source-media volumes — drafts indicate 5–7 thumbnails each, but no inventory of in-flow media (the alternating images each flow row needs). Confirm volumes before CDN sync.

### WS-5 — Legacy entry filename migration

**Scope** (per Sean's confirmed decision: rename only; keep these entries published as-is layout-wise; produce URL list for later review):

For each affected entry:

1. Rename CDN files under `s3://portfolio/media/{slug}/`:
   - `slide-{slug}-N.webp` → `main-1-{slug}-N.webp`
   - `gif-{slug}-N.gif` → `main-2-{slug}-N.gif` (use `main-2-` if entry also had slideshow; else `main-1-`)
   - `img-mobile-{slug}-N.webp` → `main-3-{slug}-N.webp` (n/a — no entries currently use this)
2. Edit the entry JSON:
   - Delete `slideshows`, `gif`, `mobile_img` fields.
   - Populate `main_media[]` groups with the renamed CDN URLs preserving order.
   - Add `"layout": "columns"`.
3. Validate + regenerate manifest.

**Pre-migration triage by Sean** (2026-05-27 note): some of the entries below are art-collection-style posts (e.g. baroque still-life studies, Bauhaus/constructivist series) that are likely candidates for the new Media Collections subsystem (WS-3) rather than a flat filename migration. Before TRACK_A runs, Sean reviews this list and tags each row as **MIGRATE** (rename per spec) or **→ COLLECTION** (move JSON to `assets/drafts/`, exclude from this BUILD, queue for Media Collections-style rework in a later round). Entries tagged **→ COLLECTION** drop out of WS-5's scope entirely.

The audit confirms none of the rows below are *currently* in `assets/drafts/` — `assets/drafts/` already holds 29 separate entries (including art series like `neo-expressionism-cyberpunk`, `psychedelic-desert-drive`, `transmutations-hyperobject`) that are out of scope for v4.2 because Sean has flagged them for rewrite/recombination. The triage decision below adds to that drafts queue.

**Affected entries** (audited 2026-05-27 — 12 unique, currently published):

| UID         | Slug                               | Production URL                                          | Legacy fields | Triage (Sean fills before TRACK_A)            |
| ----------- | ---------------------------------- | ------------------------------------------------------- | ------------- | --------------------------------------------- |
| uid-bsj-738 | baroque-de-heem-still-life         | https://august.style/baroque-de-heem-still-life         | SLIDE×1       | _draft per Sean's note — likely → COLLECTION_ |
| uid-cap-258 | advanced-animation-system          | https://august.style/advanced-animation-system          | GIF×5         | ?                                             |
| uid-dff-987 | automated-e-commerce-shop-lookbook | https://august.style/automated-e-commerce-shop-lookbook | SLIDE×1       | ?                                             |
| uid-fth-565 | animated-cms-weekly-blogs          | https://august.style/animated-cms-weekly-blogs          | SLIDE×1       | ?                                             |
| uid-hxp-812 | bau-noir-haus                      | https://august.style/bau-noir-haus                      | SLIDE×1       | _possibly art series → COLLECTION_            |
| uid-kts-582 | bohemian-abstractions              | https://august.style/bohemian-abstractions              | SLIDE×1       | _possibly art series → COLLECTION_            |
| uid-sdz-155 | ai-virtual-photoshoot-design       | https://august.style/ai-virtual-photoshoot-design       | SLIDE×1       | ?                                             |
| uid-sjz-330 | agentic-marketing-department       | https://august.style/agentic-marketing-department       | SLIDE×1       | ?                                             |
| uid-skz-743 | agentic-social-manager             | https://august.style/agentic-social-manager             | SLIDE×1       | ?                                             |
| uid-svz-258 | agentic-fashion-designer           | https://august.style/agentic-fashion-designer           | SLIDE×1       | ?                                             |
| uid-sxz-424 | api-automate-video-production      | https://august.style/api-automate-video-production      | SLIDE×1 GIF×2 | ?                                             |
| uid-xuk-296 | art-nouveau-brand-design           | https://august.style/art-nouveau-brand-design           | SLIDE×1       | _possibly art series → COLLECTION_            |

Italicized triage hints are best-guess only — Sean's call governs. The "?" rows are obvious project work and almost certainly MIGRATE.

**Files touched**:

- 12 entry JSONs in `assets/entries/`.
- 12 directories under `s3://portfolio/media/{slug}/` (rename ops via `aws s3 mv` or copy-then-delete).
- `manifest.json` (regenerated).

**Dependencies**: WS-1 (renderer must support `main_media` before this migration runs, else these entries will render with no body media). WS-6 (validator must accept new fields, reject deprecated ones — and must NOT reject *during* the migration since both forms transiently exist; consider a `--legacy-ok` validator flag for the migration BUILD only).

**Open gaps**: Migration ordering relative to WS-1 renderer (Open Gap #8). Validator "transient state" handling during the migration BUILD (Open Gap #9).

### WS-6 — Docs, tooling, CDN hygiene

**Scope**:

1. **`JSON_ARCHITECTURE.md` → v6.0 rewrite**:
   - Schema reference for new fields: `layout`, `flow[]`, `main_media[]`, `bleed[]`, `bleed_slides{}`, `collection_preview`.
   - Removal notes for `slideshows`, `gif`, `mobile_img`, deprecated flat `grid` (keep as legacy-read for the migration window).
   - New sections: Media Collections architecture; Collection ↔ Item resolution; Routing for `/collections/{slug}/` and `/media/{slug}/`.
2. **`ENTRY_SOP.md` extension**:
   - § *Flow layout authoring* — block types, ordering rules.
   - § *Main media filenames* — `main-{group#}-{slug}-{position#}.{ext}`.
   - § *Bleed image sourcing* — aspect-ratio guidelines (Sean's "all same height, downsized for varying widths").
   - § *Collection creation* — new SOP, parallel structure to entry SOP.
   - § *Media item creation* — minimal SOP, since items are often produced as a by-product of project work.
   - Reconcile `assets/images/` vs `assets/.media/` working dir (Open Gap #10).
3. **`_entry_template.json` rewrite to v6.0** — remove deprecated, add new; align with WS-1 schema verbatim.
4. **`_collection_template.json` + `_item_template.json` refactor** — flat schema per WS-3.
5. **`validate_v5.py` → `validate_v6.py`** — rename, extend per WS-3.
6. **`README.md` refresh** — current state, new page types, deploy URL list.
7. **`assets/scripts/cdn_cleanup.py` (new)**:
   - Scan `assets/entries/*.json`, `assets/collections/*.json`, `assets/items/*.json` for referenced CDN URLs.
   - List R2 bucket contents (via `aws s3 ls --recursive`).
   - Output two files: `referenced.txt` (URLs in use) and `orphaned.txt` (URLs in bucket but not in JSON).
   - **Does not delete** — emits the orphan list for Sean to review and run `aws s3 rm` manually. Also handles `assets/drafts/` exclusion (Sean explicitly noted draft entries' media is stale).
8. **`generate_manifest.py` updates** — emit `_pages/` for collections and items in addition to entries; add cross-reference validation; surface broken references at generation time.

**Files touched**:

- `assets/docs/JSON_ARCHITECTURE.md`
- `assets/docs/ENTRY_SOP.md`
- `assets/docs/_entry_template.json`
- `assets/docs/_collection_template.json`
- `assets/docs/_item_template.json`
- `assets/scripts/validate_v6.py` (renamed from `validate_v5.py`)
- `assets/scripts/cdn_cleanup.py` (new)
- `generate_manifest.py`
- `README.md`

**Dependencies**: WS-1, WS-3 (schema decisions must finalize there first). Conversely, **the templates lock first** in practice — the IMPLEMENT writer for v4_2_1 or v4_2_2 should produce the final template files inline (Sean explicitly authorized hybrid plan+execute for low-risk template refactors).

**Open gaps**: validator-rename strategy (keep alias? — Open Gap #9). Whether `cdn_cleanup.py` should support `--dry-run` only or also auto-delete confirmed orphans (Open Gap #7).

---

## 4. Cross-cutting Concerns

1. **Schema bump v5.1 → v6.0** (breaking): entry-template, validator, renderer, ENTRY_SOP, JSON_ARCHITECTURE — all change together in one BUILD or carefully sequenced BUILDs. DEV_RULES § *No Mixed Truth* — don't let an executing agent see both old and new schema as live.
2. **Lightbox state pool**: all new components register into a single index pool managed by `entry-controller.js`. Currently the thumb-grid pre-populates this pool — the new `populateSidebarColumn` must NOT pre-populate (no thumbs in sidebar anymore); the new hero slideshow + main_media + bleed + bleed_slides + grids each register their own slice.
3. **Mobile responsiveness**: bleed_slides reuses `.tile-image` mobile peek math directly. `bleed` (multi-row, no overflow) needs its own mobile spec — likely "stack into 2-col responsive grid below 48rem" — to be locked in v4_2_1.
4. **Asset pipeline blockers**: cyberpunk hero mp4 + 3 new entries' source media — all must be on CDN before any front-end BUILD runs.
5. **Migration window safety**: from the moment the renderer drops slideshow support to the moment WS-5 migrates the 12 entries, those entries will render with missing body media. Mitigation: WS-5's CDN+JSON edits happen in the same BUILD as WS-1's renderer changes (single track), or a feature flag in the renderer keeps slideshow rendering during migration.
6. **`.media/` vs `images/` working directory**: pick one, update ENTRY_SOP + drafts + `.gitignore` accordingly.

---

## 5. Open Gaps (explicit targets for next revision)

| #   | Gap                                                             | Resolution type     | Notes                                                                                                                                                                                                                                                                                                         |
| --- | --------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hero Stats Revamp — chart library, data model, interaction spec | Research + decision | Could be ECharts, D3, Cytoscape, simple SVG, or removed entirely. Data source = `assets/entries/*.json` aggregated by tag overlap.                                                                                                                                                                            |
| 2   | Cutout-letter font for cyberpunk hero                           | Research            | Reference images point at extremely heavy bold sans; candidates: Anton, Bebas Neue, Druk Wide, custom. License check needed.                                                                                                                                                                                  |
| 3   | `collection.html` + `media.html` UI wireframes                  | Spec                | Shopify-style all-products UI for collection; SEO-detail-page minimalism for media. Hand-sketch or steered Plan-agent pass.                                                                                                                                                                                   |
| 4   | Sticky tag+embed column boundary                                | Spec                | What happens when entry body is much shorter than viewport? Sticky-end behavior on flow-layout entries.                                                                                                                                                                                                       |
| 5   | Flow-layout block-type catalog completeness                     | Spec                | Are `h3/h4/h5/p/img/list` enough? Drafts may surface `blockquote`/`emphasis` needs after a careful re-read.                                                                                                                                                                                                   |
| 6   | YouTube embed blurry-thumbnail root cause                       | Research            | `assets/docs/archive/v3/IMG/youtube-blurry-embed.jpg` shows the bug. Likely lazy-load thumbnail size negotiation.                                                                                                                                                                                             |
| 7   | `cdn_cleanup.py` delete behavior                                | Spec                | Dry-run-only vs `--apply` flag with confirmation.                                                                                                                                                                                                                                                             |
| 8   | WS-5 migration ordering vs WS-1 renderer changes                | Decision            | Same BUILD (paired) vs sequential with feature flag. Recommend same BUILD.                                                                                                                                                                                                                                    |
| 9   | Validator rename / dual-version transient                       | Decision            | Keep `validate_v5.py` as alias? Allow a `--legacy-ok` mode during migration BUILD?                                                                                                                                                                                                                            |
| 10  | `assets/.media/` vs `assets/images/` working dir                | Spec                | Drafts use `.media/`; ENTRY_SOP uses `images/`. Pick one.                                                                                                                                                                                                                                                     |
| 11  | Homepage `cta_section` (bottom) — refresh copy or remove?       | Decision            | Current copy is generic web-developer pitch; new narrative may want different framing.                                                                                                                                                                                                                        |
| 12  | Item `tags[]` registry vs free-form                             | Decision            | Constraining to a registry adds operational overhead but enables clean filter UI on collection.html.                                                                                                                                                                                                          |
| 13  | Initial seed collections                                        | Decision            | `assets/drafts/` already holds 29 entries Sean has flagged for rewrite — many are art series (neo-expressionism-cyberpunk, psychedelic-desert-drive, transmutations-hyperobject, etc.) that are natural seed content for the first Media Collections. The drafts queue is the feeder, not a separate problem. |
| 16  | WS-5 triage signoff                                             | Decision            | Sean reviews the WS-5 table and tags each row MIGRATE or → COLLECTION before TRACK_A is cut. → COLLECTION rows move to `assets/drafts/` and rejoin the seed-collection pool from Gap #13.                                                                                                                     |
| 14  | Achievement curation for the 3 new entries                      | Spec                | Drafts list a candidate pool; selection criteria for the homepage Achievements section.                                                                                                                                                                                                                       |
| 15  | Collection-preview placement on entry pages                     | Spec                | Where does it sit in the page flow? After bleed? Before related-posts?                                                                                                                                                                                                                                        |

---

## 6. Next Revision Plan

Per DEV_RULES § *The Gap-Finding Loop*:

- **v4_2_1** (next session): **cold-review** subagent pass over this file. Instruction: *"find every gap, ambiguity, contradiction, or unverified claim — no categories supplied."* Findings folded into `v4_2_1_IMPLEMENT.md` in this directory. Expected to close ~half of the Open Gaps and surface 5–10 new ones.
- **v4_2_2**: **steered** review pass. Categories: schema/renderer lockstep risk, mobile responsiveness coverage, asset-pipeline ordering, collection-page UX, validator edge cases.
- **v4_2_3+**: alternate cold + steered until two consecutive passes return only nitpicks.
- **Stop condition**: nitpick-only → plan is exclusively executable → split into BUILD tracks.

**Expected BUILD splits** — reordered to match § 1.5 two-wave sequencing.

**Wave 1 (ship for jobs):**

- **TRACK_A** — WS-1 minimum-viable (thumb-slideshow hero, flow renderer, `main_media`, sticky right column, slideshow removal) + the v6 entry-template + validator changes from WS-6 needed for the 3 new entries. Single track because schema + renderer + template lock together (DEV_RULES § *No Mixed Truth*).
- **TRACK_B** — WS-2 homepage hero + two follow-on sections + Process section rewrite with Phase A/B/C copy + `homepage-content.json` updates.
- **TRACK_C** — WS-4 author the 3 entries (CDN upload, JSON authoring with v6 schema, achievements extraction). Depends on TRACK_A's flow renderer landing first; otherwise independent.

TRACK_A and TRACK_B share no files and can run in parallel as separate orchestrator sessions. TRACK_C is sequential after TRACK_A.

**Wave 2 (continue forward after applying):**

- **TRACK_D** — WS-3 Media Collections subsystem (collection.html, media.html, loader extensions, manifest extension, validator extensions, collection preview component for entry.html). Includes seeding the first 1–3 collections from `assets/drafts/`.
- **TRACK_E** — WS-5 legacy migration of the 12 published entries (after Sean's triage tags rows MIGRATE vs → COLLECTION; the → COLLECTION rows divert into TRACK_D's seed pool).
- **TRACK_F** — WS-1 remainder + WS-6 remainder: `bleed` + `bleed_slides` components, full lightbox-everywhere, tile-tag UX fix, YouTube blurry-thumbnail fix, `cdn_cleanup.py`, full JSON_ARCHITECTURE/ENTRY_SOP/README rewrites.

TRACK_D and TRACK_E pair (the triage flows triaged → COLLECTION rows into D); TRACK_F is independent and can interleave whenever attention's available.

---

## 7. Verification (this revision is "done enough" for cold review)

- [x] File at `assets/docs/archive/v4_2/v4_2_0_IMPLEMENT.md`.
- [x] Header declares Initiative, Version bump, Revision driven by.
- [x] Required-reading list present.
- [x] Codebase-grounding section is concrete (file:line, controller fn names, audited entry counts).
- [x] Six WS sections each with Scope / Files / Dependencies / Open gaps.
- [x] WS-5 enumerates 12 affected entries with production URLs.
- [x] WS-4 references the 4 phase drafts by path.
- [x] WS-1 commits to a concrete JSON schema for `layout`, `flow`, `main_media`, `bleed`, `bleed_slides`.
- [x] WS-3 commits to a flat-schema refactor for collection/item templates.
- [x] Open Gaps section is bounded (15 items) and each is actionable.
- [x] Next Revision section names the v4_2_1 cold-review pass.
- [x] `v4_1_0_IMPLEMENT.md` untouched (DEV_RULES § *Nothing is deleted*).

---

## Cross-references — find here:

- Tech stack, current schema, routing, file structure → `assets/docs/JSON_ARCHITECTURE.md`
- Entry creation step-by-step → `assets/docs/ENTRY_SOP.md`
- Versioning, file naming, gap-finding loop, BUILD contract → `.agent/DEV_RULES.md`
- Original strategic framing + full copy pool + UI fix screenshots → `assets/docs/archive/v4_1/v4_1_0_IMPLEMENT.md`
- Phase entry source drafts → `assets/docs/archive/v4_1/PHASE_*.md`
- Hero animation reference → `.agent/CLAUDE_DESIGN_ANIM_SITE.md`
