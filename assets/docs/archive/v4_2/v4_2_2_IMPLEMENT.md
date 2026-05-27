# v4.2.2 Implementation Plan — Entry Overhaul + Homepage Redesign + Media Collections

**Initiative**: v4 entry-layout overhaul, homepage redesign with chronological narrative spine, Media Collections subsystem, 3 new showcase entries, hero stats relationship visualization, current-site UX fixes, docs + tooling refresh.
**Version**: v4.2.1 → v4.2.2
**Revision driven by**: 2026-05-27 Sean's direction-setting pass on v4.2.1's open gaps. Major structural locks:
  1. New `feature` tag group (`Featured` / `Phase A/B/C`) + new `item` tag group on `tags.json` (added in lockstep).
  2. New **Narrative Spine** component (3-section, no tabs) — the homepage's storytelling spine, modeled on the showcase vibe without the tab interaction.
  3. **Process** section becomes static-copy + clickable → `section.html?tags=Phase+A` (or B / C).
  4. All four **feature cards** are video tiles, shuffled at runtime from `feature`-tagged entries.
  5. **Hero Stats Revamp** is in scope as a Projects/Roles/Skills relationship chart placed above Credentials. Research + exec spec subagent dispatched → `v4_x_x_HERO_STATS_SPEC.md`.
  6. **Achievements** use organic count (drop "1 per entry" cap). Homepage shows ALL achievements from ALL entries (homepage-content.json tag-filter slot kept empty to leave room for future constraint).
  7. **`homepage-content.json`** becomes copy-aware (breaks old "tags-only" rule). Copy drafts live in `v4_x_x_HOMEPAGE_COPY_PLANNING.md`; once approved, move into the JSON.
  8. **Hero** scope re-locked as native Claude Code build (drop "claude.ai/design paired session" framing — Claude Design just hands off to Claude Code anyway).
  9. **`collection_preview`** becomes a `flow` block type for editorial placement inside flow-layout entries.
  10. **"vNext" terminology dropped** — everything in this initiative is in scope; just sequenced into waves.
  11. **chunk_break placement** done in the 3 phase drafts (Sean placed markers mid-section to "bait" the reader into clicking).
**Status**: Draft — third revision. Both subagent passes complete and integrated: (a) homepage narrative copy → `v4_x_x_HOMEPAGE_COPY_PLANNING.md` (5 ABOUT variants, 3 narrative-spine sections, process steps FOUNDATION/AUTOMATE/EMBED, feature-card pattern, CTA *"Rebuilding around AI is a ground-up job."*); (b) Hero Stats Revamp executable spec → `v4_x_x_HERO_STATS_SPEC.md` (Apache ECharts 6.1.0 force-directed role↔skill graph, 234 KB gz first-third-party-dep, deferred load). **v4.2.2 is the candidate-final plan.** Two Sean-eye items before BUILD: (1) mobile single-tap vs double-tap on the relationship chart (hero stats § 8.4 #10); (2) pick favorites among the 5 ABOUT pool variants and review the AUTOMATE/EMBED verb choices.

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

| Media field                                 | Entries with non-empty data | Migration action in v4.2                                                              |
| ------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------- |
| `slideshows[]`                              | 11 (see WS-5 list)          | Rename `slide-*` → `main-*-N`, move to `main_media` groups                            |
| `gif[]`                                     | 2 (cap-258, sxz-424)        | Rename `gif-*` → `main-*-N`, move to `main_media` groups                              |
| `mobile_img[]`                              | 0                           | No active data — deprecated field can be cleanly removed                              |
| `grids[]` (grouped)                         | 1 (sxz-424)                 | Keep as-is; renderer already supports                                                 |
| `grid[]` (flat)                             | **0 (audited 2026-05-27)**  | **Drop legacy form entirely** — no data to preserve. Simplifies `populateImageGrids`. |
| `media_url`/`media_embed` (YouTube/Behance) | 32 entries                  | No data migration — but renderer change: move embed into sticky right column          |

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

- `assets/docs/_entry_template.json` — **refreshed 2026-05-27 to v6.0** in lockstep with this revision. Deprecated fields (`mobile_img`, `gif`, flat `grid`, flat `slideshows`) removed. New fields populated with placeholder examples: `layout`, `flow[]` (with `chunk_break` + `embed_html` block types), `main_media[]`, `bleed[]`, `bleed_slides{}`, `collection_preview`, **`feature[]`** (new — values from `tags.json` `feature` group), **`feature_video`** (CDN URL for the homepage feature-card video tile), **`feature_video_alt`** (description). WS-6 scope reduces to: align `JSON_ARCHITECTURE.md`, `ENTRY_SOP.md`, `README.md`, and `validate_v6.py` with this already-locked template.
- `assets/docs/_collection_template.json` — **refreshed 2026-05-27 to v6.0**, flat schema (no wrapper). UID format `uid-col-###`.
- `assets/docs/_item_template.json` — **refreshed 2026-05-27 to v6.0**, flat schema (no wrapper). UID format `uid-itm-###`. Includes `media_type` (`image | gif | video`) and `src`. The item `tags[]` field is validated against the new `item` group on `tags.json` — values added freely as items are authored (Sean: *"It is new so you are basically free form and just recording what is being used."*).
- `assets/docs/tags.json` — **updated 2026-05-27** with two new tag groups: (a) `feature` group with values `Featured` / `Phase A` / `Phase B` / `Phase C` — used by entries to opt into homepage feature-card and narrative-spine rendering; (b) `item` group, empty initially, grown as media items are authored. Existing 4 groups (role / skill / product / company) unchanged.
- `assets/scripts/validate_v5.py` — still v5.0; checks v5.0 schema. **Will reject** new fields. **Locked decision: clean rename to `validate_v6.py` with no v5 alias** — templates are already v6, existing entries continue to validate after the renamer adds explicit v5-legacy-tolerance during the WS-5 migration window only (see § 4 #5). Single-pass schema cutover, no dual-version maintenance.

### 2.6 Working-directory authority (locked 2026-05-27)

**`assets/.media/{slug}/` is the staging directory all new entry media is authored into before CDN upload.** Clarified with Sean 2026-05-27:

- `.media/` is **staging + personal local archive**, not just a pre-upload buffer. Once a slug's media is on CDN, Sean is *not* actively deleting it from `.media/` — those files persist as a local reference / safety net.
- `images/` (the old working dir referenced in `ENTRY_SOP.md`) is **being emptied** as items reach CDN. Don't author new content into `images/`. (Sean's note: *"I've been deleting things from images/ if they were already added to the CDN because I was organizing things in the .media/."*)
- **The site itself reads neither directory.** Entry JSON only references CDN URLs at `https://cdn.august.style/media/...`. The renderer never hits a local filesystem path. So neither directory's state ever blocks site rendering.

Audited on-disk state 2026-05-27:

- `assets/.media/awards-viral-social/` — 33 files (showcase entry A1)
- `assets/.media/freelance-marketing-web/` — 37 files (showcase entry A2)
- `assets/.media/generative-blog-workflow/` — 31 files (showcase entry B1)
- `assets/.media/home-anim/hero-cyberpunk-FINAL.mp4` — 9.6 MB (homepage hero source)

WS-6 fix: `ENTRY_SOP.md § 2` (currently `mkdir -p assets/images/{slug}`) updates to `.media/`. `.gitignore` confirms both dirs excluded.

### 2.7 v4_2/ directory: pre-existing staging

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
5. **New `flow` layout renderer** — alternating copy + image rows for storytelling-style entries, with **progressive disclosure via `chunk_break` blocks**. First chunk renders visible; subsequent chunks lazy-load (deferred image src + browser-native `loading="lazy"`); "Continue reading" buttons between chunks reveal next chunk with staggered fade-in (reuse existing `.fade-in-item` pattern). JSON schema in § 3.WS-1.schema below.
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
    { "type": "p",  "text": "Paragraph copy with **markdown bold** and [inline links](https://...)." },
    { "type": "h4", "text": "Subhead", "style": "bold" },
    { "type": "img", "images": ["...flow-1-{slug}-1.webp"], "alt": "" },
    { "type": "h5", "text": "Image caption-heading" },
    { "type": "list", "items": ["First bullet", "Second bullet"], "style": "bluepoints" },
    { "type": "embed_html", "html": "<blockquote class='twitter-tweet'>...</blockquote>", "alt": "Twitter post showing campaign result" },
    { "type": "chunk_break", "button_text": "Continue reading" },
    { "type": "collection_preview", "collection_id": "uid-col-001" }
  ],
  "feature": ["Phase A", "Featured"],
  "feature_video": "https://cdn.august.style/media/{slug}/feature-video-{slug}.mp4",
  "feature_video_alt": ""
}
```

Rationale for the schema choices (consolidation of v4_1_0's deferred-to-implementer notes):

- `main_media`, `bleed`, `flow` use **arrays of group objects** rather than the `img_1` / `alt_1` numbered-key pattern from v4_1_0. Reason: matches the existing `grids[]` and `slideshows[]` precedent (v5.1 already adopted arrays-of-groups), avoids dynamic key parsing in the renderer, and gives each group an optional `title` for visual hierarchy.
- `flow` is a **typed-block list** rather than v4_1_0's nested keyed-copy structure. Reason: nested duplicate keys (`"copy": ..., "copy": ...`) are invalid JSON; the typed list maps 1:1 to renderer dispatch.
- `bleed_slides` is a **single object** (not an array of groups) because the spec says "only ever one row per section." If a project needs two overflow rows, it gets two `bleed_slides` entries via a future schema bump — out of v4.2 scope.
- **`embed_html` block** (added in v4_2_1 after block-type audit of the 3 phase drafts) — PHASE_A1_v4 contains 2 Twitter `<blockquote class='twitter-tweet'>` embeds; PHASE_B1_v2 contains 1 `<iframe>`. The renderer escapes nothing — raw HTML passes through into a sandboxed `<div class="entry-flow-embed">` wrapper. Single-quoted attributes (same convention as `media_embed` for entries) to keep the JSON valid. **Security note**: only Sean's authored JSON ever populates `embed_html`; no user-submitted content reaches this field.
- **`collection_preview` block** (added in v4_2_2) — embeds a Media Collections preview component inline in a flow entry, positioned editorially rather than auto-appended to the page. The block takes a `collection_id` referring to a `uid-col-###` collection JSON. The renderer mounts `<div class="entry-collection-preview" data-collection="...">`; the loader fetches the collection + resolves items, renders a horizontal-scroll tile row with bleed-effect edges (reusing the existing `.tile-image` mobile peek math). Click on any tile → `media.html?path={item-slug}`. Locking this as a flow block (instead of a top-level entry field as v4_1_0 sketched) is editorially cleaner: the author places it where it belongs in the story rather than the renderer guessing.
- **`chunk_break` block** (added in v4_2_1 — progressive disclosure for long flow entries). Splits the flow into reader-paced chapters. Each block before the next `chunk_break` is a "chunk"; the first chunk renders visible, subsequent chunks render hidden with their `<img>` elements `loading="lazy"` and `src` deferred until the chunk is revealed. A "Continue reading" (or per-block `button_text` override) button below the visible chunk reveals the next one and triggers a staggered fade-in on its blocks. The 3 showcase entries — drafts running 350–540 lines each — are the immediate beneficiary; without chunking they'd be a wall on first view and would prefetch 30+ images per entry. Renderer behavior:
  - Walk `flow[]`; cut at each `{ "type": "chunk_break" }`.
  - Chunk 1: rendered visible, all media eager-loaded.
  - Chunks 2+: rendered into the DOM but wrapped in `.entry-flow-chunk[hidden]`; `<img>` tags get `loading="lazy"` and either `data-src` swapped on reveal OR (simpler) rely on browser-native lazy loading once the parent is no longer `hidden`.
  - "Continue reading" button between chunks. Click → remove `hidden`; staggered `fade-in-item` class applied to child blocks with `transition-delay` per element (reuse existing `fade-in-item` pattern from the codebase).
  - Last chunk: no button after.

  Schema:

  ```jsonc
  { "type": "chunk_break", "button_text": "Continue the story" }   // button_text optional; default "Continue reading"
  ```

  Wave 1 ships the schema + the load-more button + simple fade-in. **Elaborate per-chunk animation choreography (waapi sequences, scroll-linked reveals) defers to Wave 2 / TRACK_F polish** — keeping TRACK_A focused on the renderer baseline.

**Block-type completeness audit (2026-05-27)** across the 3 phase drafts confirms the flow catalog above covers every structural element actually in the drafts. The drafts also contain markdown tables and code-fence blocks at the top of each file, but those are doc-metadata for the entry creation process (e.g. the `| JSON Slug | awards-viral-social |` header table) — NOT entry-page content. No table or code-block element type is needed in `flow`.

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

**Execution mode**: native Claude Code BUILD with full executable spec — no separate claude.ai/design session needed. The hero, narrative spine, process section, feature cards, hero stats chart, and CTA are all spec'd here to the same exclusively-executable bar as the rest of the plan. Sean's iteration concern about "applying a new-site tutorial to an already-built site" is addressed by being explicit about working *against the existing `index.html` + `landing.css`* — wholesale-replacing the hero section while preserving the overall site architecture, not standing up a new Vite project from scratch.

**Scope (v4.2 homepage in page order, top → bottom)**:

1. **New animated hero**:
   - Full-viewport video background, asymmetric blurred overlay (right side blurred, left side exposed).
   - Heavy-bold cutout-letter wordmark "SEAN" (top-left, over blur) + "HORVATH" (bottom-right, over video). "AUGUST" optional middle row depending on layout fit.
   - **Rotating ABOUT-copy block** (small-caps label + 1–2 sentence body) on the blurred half. 3–5 rotation entries; ~8s interval; copy drafts in `v4_x_x_HOMEPAGE_COPY_PLANNING.md` § 1.
   - Replace existing nav with current site nav links from `index.html` lines 39–74.
   - Source video: `assets/.media/home-anim/hero-cyberpunk-FINAL.mp4` (9.6 MB, audited present 2026-05-27) — **must reach CDN before TRACK_B starts** (pre-flight step, see § 4 #4).
   - Font candidates for the cutout letterforms: Anton / Bebas Neue / Druk Wide / Inter Display — narrow with Sean during TRACK_B authoring; spec locks the chosen font once picked.

1a. **Narrative Spine** (NEW component, sits directly below the hero):
   - Three sections in page-flow order, no tab buttons (deliberately not the showcase-tab interaction — this is a storytelling spine, not a filter).
   - Each section: narrative copy paragraph (60–140 words) + the linked headlines of the entries in that phase. Phase A links 2 entries (A1, A2); Phase B links 1 (B1); Phase C is copy-only for now (no entries to link, narrative carries the section).
   - Copy drafts in `v4_x_x_HOMEPAGE_COPY_PLANNING.md` § 2–4. Once approved, copy moves into `homepage-content.json` under a `narrative_spine` schema key.
   - DOM scaffolding: `section#narrativeSpine > div.spine-phase[data-phase="A"]` × 3. New CSS class blocks in `landing.css`.
   - Renderer: new `renderNarrativeSpine(content)` function in `landing-controller.js`. Pure copy-driven, no entry filter — Phase A's two entries are referenced by slug in `homepage-content.json`, not by tag.

2. **Process section** — **static copy, clickable steps**:
   - Three steps for Phases A / B / C; each step is a short word + one-line elaboration. Copy is hard-coded into `homepage-content.json` (not data-driven from project filters).
   - Each step is a link → `section.html?tags=Phase+A` (or `Phase+B` / `Phase+C`). Tag URL-encoding uses `+` for spaces per existing tag-routing convention (URL-normalize handles it).
   - Phase C link will arrive at an empty section page for now — that's fine. The link exists for when entries get authored.
   - Copy drafts in `v4_x_x_HOMEPAGE_COPY_PLANNING.md` § 5.

3. **Feature cards (4-card grid)** — all video tiles:
   - All four cards are video tiles (not just card 1 as the Prisma reference had). Source: each card pulls a `feature_video` URL from a `feature`-tagged entry, shuffled at page load.
   - Shuffle pool: entries with `feature` array containing `"Featured"` AND one of `"Phase A"` / `"Phase B"` / `"Phase C"`. Each card slot pulls a random eligible entry; no two cards show the same entry on a given load.
   - Card copy pattern: card number (01/02/03/04) + entry title + 2–3 bullet checklist (drawn from entry's tile copy lines or short skill highlights) + "Learn more" link with rotated arrow to the entry page.
   - Video shape: **vertical 4:5 (1080×1350)** — better for a horizontal 4-card grid than 9:16 (which gets too tall). Sean generates videos in Leonardo.ai with this aspect ratio.
   - Entry JSON field added: `feature_video` (CDN URL) + `feature_video_alt` (description). See template refresh.
   - Pre-flight: at least one video per phase must exist on CDN before TRACK_B ships; if a phase has zero `feature_video`s, the renderer falls back to that entry's `thumb[0]` as a static image card (no animation) so the grid layout doesn't collapse.

3a. **Hero Stats Revamp — Projects/Roles/Skills relationship visualization** (NEW in v4.2.2 scope, was Open Gap #1):
   - Position: directly above Credentials.
   - **Authoritative spec**: `assets/docs/archive/v4_2/v4_x_x_HERO_STATS_SPEC.md` — exclusively-executable, includes data-shape transformation, lib install, full renderer code, CSS additions, edge cases, verification.
   - **Library**: Apache ECharts 6.1.0 (force-directed `graph` series), loaded via jsDelivr CDN with pinned version. 234 KB gzipped; `defer`-loaded so it doesn't touch LCP.
   - **Data model**: role↔skill bipartite projection (NOT tripartite with projects as nodes). Projects become edge *weight*; products + companies surface in tooltips. Client-side projection in a new `buildRelationshipGraph()` function in `data-loader.js`. 191 raw co-occurrence edges filter to ~114 at weight ≥ 2.
   - **Renderer**: new `renderRelationshipChart(projects)` in `landing-controller.js`. New `#relationshipChart` section in `index.html` between feature cards and Credentials.
   - **Open question requiring Sean's eye before TRACK_B BUILD** (per spec § 8.4 #10): mobile single-tap fires both tooltip and click-to-navigate simultaneously. Single-tap is the v0 default; spec defers double-tap pattern to user feedback. If your gut says single-tap is too aggressive on mobile, lock the double-tap pattern now (a few extra lines in the renderer) rather than ship and revisit.
   - **Biggest risk** (also from spec): 234 KB gz is the first third-party JS dep on a vanilla-JS site. Rollback is one `<script>` tag deletion if you decide later it's too much. Spec considered hand-rolling on D3 sub-modules (~50 KB) but the touch/a11y/freeze-after-settle DIY cost outweighed the savings for one chart.

4. **Credentials** — keep, repopulate via new entries.

5. **Achievements** — show ALL achievements from ALL entries for v4.2 (not just the new ones). New entries contribute multiple achievements each (organic count — see WS-4); old entries with no current `achievement` field continue to contribute none. Homepage-content.json keeps the `achievements.filter` slot EMPTY for now; left in place so a tag constraint can be added later without schema change.

6. **CTA section (bottom)** — refresh copy to align with v4.2's career-evolution + custom-AI-solutions theme. Drop the existing generic "Interested in web development?" framing. Copy drafts in `v4_x_x_HOMEPAGE_COPY_PLANNING.md` § 7.

**Remove (locked)**: trio bridge, hero slideshow, flip headline, dynamic CTA, **current** hero stats counter (replaced by Hero Stats Revamp described above, not deleted outright).
2. **Two follow-on sections** modeled on the Prisma reference in v4_1_0:
   - Cinematic quote section (`.about-card`-style): Sean's positioning statement in mixed weight + italic accents.
   - 4-card feature grid: card 1 is a video tile (we'll source a hero-pipeline-style clip), cards 2–4 are "phase highlight" cards linking to the three new entries — title number (01/02/03), short checklist, "Learn more" with rotated arrow.
3. **Process section copy update** — replace generic 3-step copy with Phases A / B / C; each step links to the relevant showcase entry (WS-4) or, for Phase C, a copy block sourced from `PHASE_C.md`.
4. **Remove (locked)**: trio bridge, hero slideshow, flip headline, dynamic CTA, hero stats. Hero Stats removal is **not contingent on** the Hero Stats Revamp (which is a Wave 2 / vNext exploration of a different component entirely — an interactive Projects/Roles/Skills chart that, if pursued, would land below the new homepage flow, not in the hero).
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
4. **Author `flow[]` from the phase draft** — convert the draft's prose + media into the typed-block array. Sean's `**chunk_break**` markers in each draft translate directly into `{type: "chunk_break"}` blocks at those positions. Twitter blockquotes / iframes become `{type: "embed_html"}` blocks.
5. **Achievements: organic count, not capped at 1 per entry** (Sean's lock 2026-05-27). Each entry's `achievement` field becomes an array (was singleton in v5.1). Populate with every notable award / press feature / record-breaking metric from the draft. PETA entry → multiple (awards, viral hits, Yahoo News pickup, etc.); freelance entry → several (Hawaii PPE response, etc.); generative-blog entry → fewer but include the 100+ weekly blogs metric. Schema migration: `achievement` becomes `achievements[]` in v6.0 — see § 2.5 template.
6. **Feature tagging**: each of the 3 entries gets `"feature": ["Featured", "Phase X"]` (X = A, A, or B). This is what makes them eligible for homepage feature cards + narrative spine. Sean: backfilling other entries with `feature` tags is post-Wave-1; only the 3 showcase entries are tagged in this initiative.
7. **Feature video**: each entry needs a 4:5 vertical (1080×1350) video at `assets/.media/{slug}/feature-video-{slug}.mp4` → CDN. Sean generates these in Leonardo.ai once dimensions confirmed (locked here). If a video isn't ready at TRACK_C time, JSON gets the placeholder URL and the homepage renderer falls back to that entry's `thumb[0]` as a static image card so the grid doesn't collapse.
8. Run `validate_v6.py` → `generate_manifest.py`.

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

1. **Schema bump v5.1 → v6.0** (breaking): entry-template is already at v6.0 (refreshed 2026-05-27). Validator, renderer, ENTRY_SOP, JSON_ARCHITECTURE catch up in TRACK_A + TRACK_B prep. Existing v5-shape entries continue to deserialize because the renderer reads all new fields as optional (default `[]` / `null`); only the slideshow-using entries hit a visible gap, which is closed by TRACK_E in Wave 2.
2. **Lightbox state pool**: all new components register into a single index pool managed by `entry-controller.js`. Currently the thumb-grid pre-populates this pool — the new `populateSidebarColumn` must NOT pre-populate (no thumbs in sidebar anymore); the new hero slideshow + main_media + bleed + bleed_slides + grids each register their own slice.
3. **Mobile responsiveness**: bleed_slides reuses `.tile-image` mobile peek math directly. `bleed` (multi-row, no overflow) drops to a 2-col stack below 48rem; `flow` `img` rows already stack vertically. Hero slideshow uses the related-posts tile-image mobile math (90vw + parent bleed).
4. **Asset pipeline pre-flight (locked)**: Before *any* Wave 1 BUILD starts, the orchestrator confirms HTTP 200 from:
   - `https://cdn.august.style/media/home-anim/hero-cyberpunk-FINAL.mp4` (currently at `assets/.media/home-anim/`, 9.6 MB)
   - All thumbnail + flow + main_media URLs for the 3 showcase slugs (`awards-viral-social`, `freelance-marketing-web`, `generative-blog-workflow`) — CDN upload via the Cloudinary→R2 path in ENTRY_SOP § 4–5. Source dirs `assets/.media/{slug}/` confirmed populated (33 / 37 / 31 files respectively, 2026-05-27).
   If any pre-flight URL returns non-200, BUILD pauses and surfaces to Sean.
5a. **`achievement` → `achievements[]` schema migration**: v5.1 had `achievement` as a singleton object (or null). v6.0 changes it to `achievements[]` (array of `{headline, details}` objects) — required because Sean's new entries each have multiple awards/press/metrics. Audit 2026-05-27: only **1 existing entry** (`uid-vin-427` / `freelance-payments-platform`) has `achievement` populated. Migration = update that single entry's field name + wrap value in an array. Template already updated. Renderer (`landing-controller.renderAchievements` + `entry-controller`) reads new field name. Cleanest possible migration — done inline in TRACK_C/D rather than its own track.

5b. **Migration window safety (locked Wave-1 vs Wave-2 split)**: TRACK_A removes only the slideshow rendering paths the 3 new showcase entries don't use; the 11 legacy slideshow entries continue to render via a temporary `legacy-slideshow` codepath kept inside `entry-controller.js` until TRACK_E (Wave 2). TRACK_E removes both the legacy entries' data (via migration to `main_media`) AND the legacy codepath in the same BUILD — single point of truth at all times. The renderer's branch on `project.slideshows?.length` is the only mixed-truth surface and is single-line, single-file.
6. **`.media/` vs `images/` working directory** — **locked to `assets/.media/`** (see § 2.6). ENTRY_SOP fix is part of TRACK_A prep, not deferred.

---

## 5. Open Gaps (refreshed v4_2_2)

**Closed by v4_2_2** (Sean's direction-setting 2026-05-27):

- ~~#1 Hero Stats~~ — IN SCOPE this initiative. Research+exec spec subagent dispatched → `v4_x_x_HERO_STATS_SPEC.md`. Position: above Credentials. "vNext" framing dropped.
- ~~#2 Cutout-letter font~~ — candidate list locked (Anton / Bebas Neue / Druk Wide / Inter Display); final pick in TRACK_B authoring with Sean.
- ~~#3 collection.html + media.html wireframes~~ — Sean: existing description is sufficient; agent uses site aesthetic. No formal wireframe needed.
- ~~#6 YouTube blurry-thumbnail~~ — irrelevant; Sean removing embeds over time.
- ~~#7 `cdn_cleanup.py` delete behavior~~ — locked: scan website for live CDN URLs, anything else in bucket can be deleted. Post-Wave-1.
- ~~#11 `cta_section` copy~~ — drafted by copy subagent (Agent A) into `v4_x_x_HOMEPAGE_COPY_PLANNING.md` § 7. Theme: career evolution + custom AI solutions.
- ~~#12 Item `tags[]` registry vs free-form~~ — locked: new `item` group on `tags.json`, free-form initially + values recorded as items are authored.
- ~~#14 Achievement curation criteria~~ — locked: organic count per entry (multiple for new entries with awards/press/metrics; at least one for older entries that have any; not actively backfilled). `achievement` → `achievements[]` schema migration noted in § 4 #5a.
- ~~#15 Collection-preview placement~~ — locked: `collection_preview` is a `flow` block type. Editorial inline placement per entry.
- ~~#17 Hero ABOUT copy pool~~ — drafted by Agent A; 5 rotation variants in `v4_x_x_HOMEPAGE_COPY_PLANNING.md` § 1. Sean picks 2–3 favorites.
- ~~#18 Feature-card video source~~ — locked: ALL four cards are video tiles (not just card 1), 4:5 vertical (1080×1350), Leonardo.ai. Shuffled at runtime from `feature`-tagged entries.
- ~~#19 `homepage-content.json` schema for new sections~~ — locked: file becomes copy-aware. New keys: `narrative_spine{}`, `feature_cards{}`, `hero.copy_pool[]`, `cta_section{}` (heading + primary + secondary). Drafts in copy planning doc.
- ~~#20 Process section data shape~~ — locked: static copy hard-coded in `homepage-content.json` with `link_url` per step → `section.html?tags=Phase+A` (or B / C). Step words drafted by Agent A (FOUNDATION / AUTOMATE / EMBED, with GROUND flagged as alternate).
- ~~#21 Phase C copy mapping~~ — locked: Phase C copy is the 3rd section of the new **Narrative Spine** component (not the Process section). Drafted by Agent A in copy planning doc § 4.

**Closed by v4_2_1** — no longer open:

- ~~#5 Flow-layout block-type catalog~~ — audited the 3 phase drafts; added `embed_html` block for Twitter/iframe; catalog complete.
- ~~#8 WS-5 migration ordering~~ — locked: legacy slideshow codepath stays in renderer through Wave 1; TRACK_E removes data + codepath together. See § 4 #5.
- ~~#9 Validator rename~~ — locked: clean rename to `validate_v6.py`, no v5 alias. See § 2.5.
- ~~#10 `.media/` vs `images/`~~ — locked: `.media/` is staging+archive; site reads neither. See § 2.6.
- ~~#13 Initial seed collections~~ — locked: `assets/drafts/` (29 entries) + WS-5 → COLLECTION triage rows are the natural seed pool. No separate gap.

**Still open after v4_2_2** (very minimal — all are post-Wave-1 or pure-asset):

| #   | Gap                                                       | Type                  | Notes                                                                                                                                                                                                       |
| --- | --------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 23  | Sean's 4:5 feature videos (Leonardo.ai)                   | Asset (TRACK_C prep)  | Needed: 1 video per phase (minimum) of `feature`-tagged entries. Fallback to thumb image if not ready; renderer handles gracefully.                                                                          |
| 22  | WS-5 triage signoff                                       | Decision (post-Wave1) | Sean tags each WS-5 row MIGRATE or → COLLECTION before TRACK_E starts. Not Wave 1 blocking.                                                                                                                  |
| 24  | Sean's editorial picks                                    | Decision (in-track)   | Inline TRACK_B/C decisions: (a) which 2–3 of the 5 ABOUT pool variants survive; (b) GROUND vs FOUNDATION for Process step 1; (c) cutout-letter font from the candidate shortlist; (d) CTA imperative phrasing. |

---

## 6. Next Revision Plan

Per DEV_RULES § *The Gap-Finding Loop*:

- **v4_2_0 (2026-05-27)** — first reorganized revision. ✓ shipped.
- **v4_2_1 (2026-05-27)** — folded 2026-05-27 cold-review findings (18 surfaced, ~10 closed inline, remainder bounded). ✓ shipped.
- **v4_2_2 (2026-05-27)** — Sean's direction-setting pass: feature tag group, narrative spine component, hero stats in-scope, etc. (this file). Subagent passes run in parallel: copy drafting → `v4_x_x_HOMEPAGE_COPY_PLANNING.md`; hero stats spec → `v4_x_x_HERO_STATS_SPEC.md`. **When both subagent outputs are integrated, v4.2.2 is the candidate-final plan.**
- **v4_2_3 (optional)** — only if a steered-review pass surfaces real new issues after subagent integration. Focused categories: TRACK_B `landing-controller.js` rewrite scope (largest single file change in Wave 1), Hero Stats Revamp implementation feasibility (per the new spec doc), migration-window correctness once the legacy-slideshow codepath is concretely sketched in TRACK_A prep.
- **Stop condition**: Wave-1 gaps all green or asset-only → cut TRACK_A + TRACK_B + TRACK_C in parallel where possible. **Sean's stated bar**: the plan ships TRACK_A + TRACK_B + TRACK_C even if Wave-2 gaps remain — Wave 2 has its own future planning rounds.

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
