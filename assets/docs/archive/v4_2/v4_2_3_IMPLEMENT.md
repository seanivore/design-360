**Initiative**: august.style v4.2 — entry-layout overhaul + homepage redesign + Media Collections subsystem + three new showcase entries
**Version**: v4.2.2 → v4.2.3
**Revision driven by**: 2026_05_27 planning session — folded v4_2_2_FEEDBACK, DEV_RULES v3.5.0 re-read, validation subagent punch list, hero-stats research deferral, and Sean's structural locks (no premature tracks/phases, no plan-author meta-strategy in orchestrator-facing doc).
**Status**: Exclusively executable. Ready for orchestrator.

---

## Required reading

Read in full before touching the codebase:

1. `assets/docs/AUGUST_STYLE.md` — schema reference, controller map, file structure, data flow. Aligned with v4.2.3.
2. `README.md` — project status, deploy URL, local-dev commands.
3. `.agent/DEV_RULES.md` — versioning, mixed-truth rule, subagent delegation, build-log requirement.
4. `assets/docs/ENTRY_SOP.md` — entry-authoring pipeline. Note: gets updated as part of this initiative (§ Docs & Tooling below); current version describes pre-v4.2.3 entry authoring.

Do NOT read past IMPLEMENTs, FEEDBACK files, SESSION logs, or planning sidecars (`v4_x_x_HOMEPAGE_COPY_PLANNING.md`, `v4_x_x_HERO_STATS_SPEC.md`). Their content has been folded into this document and into `AUGUST_STYLE.md`. Reading them creates mixed truth.

---

## 1. Build-log requirement

Write `assets/docs/archive/v4_2/BUILD_REPORT_v4_2_3.md` at session close per `.agent/DEV_RULES.md` § *BUILD.md and the BUILD_REPORT*. The four required sections (what changed / what deviated / gaps and bugs / verification results) are specified there.

Note on naming: this initiative ships its IMPLEMENT directly to the orchestrator without an intervening BUILD packet. DEV_RULES describes BUILD packets as the typical executable artifact, but for plans that reach exclusively-executable in one round, IMPLEMENT serves the same role. The BUILD_REPORT filename mirrors the IMPLEMENT version it pairs with.

---

## 2. Subagent delegation guidance

This plan is sized so that a single orchestrator can complete it, delegating parallel work to subagents at the orchestrator's discretion. Logical groupings below (§ 3–§ 7) are NOT pre-assigned tracks — they organize the spec, not the execution. The orchestrator chooses the parallelization shape based on what's actually parallelizable.

Suggested subagent groupings (the orchestrator refines). For each, the context the subagent needs is listed alongside:

- **Schema cascade** — propagate `placement` / `feature_tile` / `tile_alt` renames across all `assets/entries/*.json` per § 3.1. Idempotent, no dependencies. Solo subagent task. *Context to pass*: § 3.1 of this doc + `AUGUST_STYLE.md` § 2 + the list of files in `assets/entries/`.
- **CSS component blocks** — new component styles per § 3.3 + § 4.3. One subagent in `styles.css` + `landing.css`. *Context to pass*: § 3.3 and § 4.3 of this doc + `AUGUST_STYLE.md` § 10 (DOM regions and class names).
- **JS controllers** — `entry-controller` flow renderer + lightbox pool (§ 3.4), `landing-controller` new sections (§ 4.4), `featured-tile-controller` (§ 4.5, new), `collection-controller` (§ 5.3, new), `media-controller` (§ 5.4, new). Parallelize across two subagents on independent files; orchestrator owns wiring. *Context to pass*: the relevant section of this doc + `AUGUST_STYLE.md` § 9 (data flow) + § 10 (controller responsibilities).
- **HTML templates** — `entry.html` DOM update (§ 3.2), `index.html` hero rewrite (§ 4.1), `collection.html` and `media.html` scaffolds (§ 5.1). One subagent. *Context to pass*: § 3.2, § 4.1, § 5.1 of this doc + the current files (to be modified, not authored fresh).
- **Python tooling** — `generate_manifest.py` extension for collections/items (§ 5.2), validator rename and extension (§ 5.6), `cdn_cleanup.py` (§ 7.3). One subagent. *Context to pass*: those three sections + `AUGUST_STYLE.md` § 7 (URL routing for slugs) + the current scripts.
- **New entry JSONs** — three new showcase entries per § 6. Depends on flow-layout renderer landing first (§ 3.4). One subagent. *Context to pass*: § 6 + the three phase draft files (`PHASE_A1_v4.md`, `PHASE_A2_v2.md`, `PHASE_B1_v2.md`) + `ENTRY_SOP.md` + `AUGUST_STYLE.md` § 2 (entry schema) + § 2a (flow blocks).

What the orchestrator does NOT delegate: schema-version verification (read `_metadata.schema_version` from each template against AUGUST_STYLE.md § Schema Version Alignment Check before starting), git commits, the build-log writing, gate decisions, and any moment of "is this spec actually saying what I think it's saying" — surface those to Sean.

Placeholders: where a subagent's work depends on another's output, use `<!-- PLACEHOLDER: {description} -->` and update once the dependency resolves. Strict convention so dependencies are visible.

---

## 3. Entry-page layout overhaul

### 3.1. Schema cascade

For every file under `assets/entries/uid-*.json`:

- Rename field `feature` → `placement`. If absent, set `placement: []`.
- Rename field `feature_video` → `feature_tile` and convert from string → array of one string (or leave empty array if previously absent).
- Rename field `feature_video_alt` → `tile_alt`.
- If any entry has a singleton `achievement` object, convert to `achievements: [<the object>]`.
- Set `layout: "columns"` on every existing entry (the three new entries in § 6 declare `layout: "flow"` explicitly).

The three new entries (§ 6) receive non-empty `placement[]` arrays — see that section. All existing entries get `placement: []`.

Validator (§ 7) checks the rename completed across all 30+ entry files.

### 3.2. `entry.html` DOM updates

- Replace `.entry-hero-image` region with a thumbnail slideshow hero. Source: entry's `thumb[]` array. If only one thumb, no pagination chrome. Mobile + desktop both.
- Replace `.entry-thumb-grid` region with a sticky tag-and-embed column. Position: right side on desktop (40% width), full-width below main content on mobile. Sticky boundary: top of section to bottom of viewport, releases when the column would scroll past the page footer.
- The two-column ratio shifts from 50/50 to 60/40 (main column / tag column).
- Add DOM regions: `#main-media-region`, `#bleed-region`, `#bleed-slides-region`, `#flow-region`.

### 3.3. `styles.css` new component blocks

- Sticky tag+embed column (`.entry-tag-column`, `.entry-tag-column.is-sticky`) — sticky positioning per § 3.2 mobile + desktop.
- `main_media` rendering (`.entry-main-media`, `.entry-main-media__group`, `.entry-main-media__row`) — centered block; multiple images in one group render side-by-side.
- `bleed` rendering (`.entry-bleed`, `.entry-bleed__row`) — full-viewport-width, edge-to-edge. Multiple images: flex row, equal width.
- `bleed_slides` rendering (`.entry-bleed-slides`) — full-bleed slideshow with overlay pagination dots.
- Flow blocks (`.flow-h3`, `.flow-h4`, `.flow-h5`, `.flow-p`, `.flow-img`, `.flow-list`, `.flow-embed-html`, `.flow-collection-preview`) — consistent vertical rhythm; `.flow-list.style-bluepoints` matches the existing bluepoints style.
- `chunk_break` rendering (`.flow-chunk-break`) — button styled to match site CTAs; hidden subsequent content fades in (200ms opacity + 8px translateY) on click.
- Tile-tag width fix (`.tile .tile-tag`) — existing CSS allows tags to overflow tile width on desktop and tablet. Constrain via `max-width: 100%; overflow: hidden; text-overflow: ellipsis;` on the tag pill, ensure tile container has `min-width: 0` on its grid track.
- YouTube embed responsiveness + blurry-thumbnail fix — embedded iframes (Behance, YouTube) need `aspect-ratio: 16 / 9; width: 100%; height: auto;` plus a Cloudflare-fetched thumbnail at 2x display resolution as `poster` to avoid blur. Test against an entry like uid-cop-802 that uses YouTube.

Mobile breakpoints for new components: bleed and bleed_slides stay full-width; main_media `__row` becomes vertical stack below 720px; sticky tag column un-sticks below 900px and stacks below main content.

### 3.4. `entry-controller.js` rewrite

- Rename `populateGifs` → `populateMainMedia`. Walks `entry.main_media[]` array; emits `.entry-main-media__group` per item. Drop legacy `populateMobileImg`.
- Add `populateBleed()` — walks `entry.bleed[]` and `entry.bleed_slides` (object, not array).
- Add `populateFlowLayout()` — for entries with `layout: "flow"`:
    - Walks `entry.flow[]` array.
    - Dispatches per `type`: `h3`/`h4`/`h5` → headings; `p` → paragraph; `img` → image row block; `list` → ul with style class; `chunk_break` → button + hides subsequent siblings; `embed_html` → wraps `html` string in container with `alt` text fallback; `collection_preview` → calls `loadCollection(slug)` and renders horizontal-scroll preview component.
    - Each block element gets a `data-flow-index` attribute so the controller can manage chunk-break unhiding.
- Lightbox state pool: `entry-controller` maintains ONE array of all lightbox-able media in document order: `img[]`, `main_media[]` images, `grids[]` images, `bleed[]` images, `bleed_slides.images[]`, `flow[]` `img` block images, `collection_preview` thumbnails. Each `<img>` element receives `data-lightbox-index="<n>"` matching its position in this array. Click handler reads that index and opens the lightbox at it.
- `populateColumnsLayout()` orchestrates the existing two-column flow for `layout: "columns"`; updated to call new `populateMainMedia`, `populateBleed`.
- Top-level dispatch: branch on `entry.layout`; if missing or unknown, default to `columns` and console.warn.

### 3.5. `data-loader.js` extension

- Add `loadCollection(slug)` — fetches the collection JSON via `manifest.collections[slug]`.
- Add `loadCollectionItem(slug)` — fetches the item JSON via `manifest.items[slug]`.
- Add a resolver `resolveCollectionMedia(collection)` — given a loaded collection object, fetches all item JSONs referenced in `collection.media[]` (parallel `Promise.all`), returns an array of resolved item objects in `collection.media[]` order.
- Add `unionCollections(slugs)` — given multiple collection slugs, returns the union of their item arrays, deduped by item id.
- Add `intersectCollections(slugs)` — given multiple collection slugs, returns only items appearing in all.

Cache strategy mirrors `loadProject`: in-memory `Map<slug, Promise<json>>`, keyed by slug.

### 3.6. Lightbox extension

The existing lightbox supports `slideshows` and `thumb`. Extend to:

- Index pool established by `entry-controller` (§ 3.4) is the only source of truth.
- Add keyboard handling: left/right navigates; Esc closes (already there); also: Home → first, End → last.
- Add touch swipe handling on mobile (already there for slideshows; needs porting to the unified pool).
- Preload neighbor images: when lightbox at index N is open, ensure N-1 and N+1 are fetched. Use a hidden `<link rel="preload" as="image" href="...">` injected on open.

---

## 4. Homepage redesign

### 4.1. `index.html` hero rewrite

Replace the existing hero block (currently a video-trio + dynamic text + CTA) with:

- Background: a single looping cyberpunk video (mp4, muted, autoplay, playsinline, `object-fit: cover` filling the hero). Source: `https://cdn.august.style/media/home-anim/hero-cyberpunk-FINAL.mp4`. Pre-flight check: video uploaded to CDN before BUILD starts; if 404 at BUILD time, surface to Sean.
- Foreground: full-bleed blurred-half overlay (left half of viewport, backdrop-filter blur 20px + 50% black overlay).
- Centerpiece: cutout-letter name "AUGUST" treatment. Letters use `mix-blend-mode: difference` against the blurred half so the video shows through the letterforms. Font is **Bebas Neue** — free Google Font, single weight, strong stencil-like letterforms suited to cutout treatment. The font is carried via CSS variable `--hero-cutout-font` (not in homepage-content.json) so swapping it later is a one-line CSS change.
- ABOUT pool: a single short line of copy beneath the name, swapping at random on every page load from the array `homepage-content.json.hero.about_pool[]`. CSS for animated text crossfade if needed.
- Nav: persistent top nav (Work / About / Contact). Same as current site's nav placement — preserve current `nav` element wiring.

### 4.2. `homepage-content.json` extension

Replace the existing file contents with:

```json
{
  "hero": {
    "filter": { "any": [] },
    "about_pool": [
      "I build the custom AI pipelines companies need to actually adapt to AI. Fifteen years of designing systems for scale, now applied to removing friction between people and the tools they use every day.",
      "Three phases, one through-line: find the friction, design the system, ship the thing. The tools changed from Photoshop to Make.com to custom agentic pipelines. The instinct didn't.",
      "I learn fast and think in systems rather than outputs. That's how a marketing strategist becomes a content systems architect becomes the person who builds the AI pipeline your team will actually use."
    ],
    "cta_secondary": { "text": "All Projects", "href": "/section.html" }
  },
  "narrative_spine": {
    "phase_a": {
      "label": "Phase A",
      "heading": "Foundation",
      "body": "Before AI, I learned the part of the job that doesn't change. On a two-person social team at PETA, my mentor Helena and I pioneered the rapid, visual-first publishing playbook that the rest of the industry adopted years later — 3.2 billion impressions a year, a #1 engagement rate across nonprofits, viral campaigns that landed in YahooNews, Refinery 29, and a Kanye lyric. Then I went independent and ran every part of that work — strategy, brand, design, build — for clients of my own. This is the foundation the rest of the portfolio is built on: systems thinking, gut-check storytelling, and shipping under real deadlines.",
      "feature_cards": [
        { "slug": "awards-viral-social", "subtitle": "Our First Viral Moments, Hijacking #AskSeaWorld, and a foul-mouthed vegan grandma with a billion video views." },
        { "slug": "freelance-marketing-web", "subtitle": "Carrying one brand across every medium, ten years with a single client, and a hand-drawn website where the human touch was the deliverable." }
      ]
    },
    "phase_b": {
      "label": "Phase B",
      "heading": "Generative Automations",
      "body": "When the first GPT release shipped, I stopped doing almost anything else and learned. The question that mattered wasn't whether AI was safe or inevitable: it was how to apply it to every skill I already had. The answer turned out to be pipelines: Notion as the structured data layer, Make.com as the connective tissue, ChatGPT as the writer, Adobe Firefly for the art, Webflow for the surface. Then I built one: Astrofluenced, an astrology-based self-help network publishing 100+ blogs a week, a podcast voiced by two AI characters with distinct personalities, and matching social assets. Mostly hands-off, all of it on-brand.",
      "feature_cards": [
        { "slug": "generative-blog-workflow", "subtitle": "Fully Automated Daily Astrological Readings, 100+ weekly blogs, hand-drawn artwork covering an AI blog, and a podcast with 68 episodes hosted by characters named Theodore and Stella." }
      ]
    },
    "phase_c": {
      "label": "Phase C",
      "heading": "Custom AI Solutions",
      "body": "Most companies are trying to roll out AI the way they roll out any new software: pick a few people from each department, send them to a seminar, expect them to come back as the \"AI person\" on their team. It doesn't work, because AI isn't that kind of tool. The value isn't in adding it on top of how you already work — it's in rebuilding the work itself.\n\nThat's what Phase C is. Custom digital products built agentically against ironed-out dev protocols, then taken one step further: the friction that's *still* left after launch — updating a website, onboarding clients, scheduling content, pushing a new product to a storefront — gets absorbed into a custom AI pipeline the client already uses every day. They open the same ChatGPT they were already using. It asks what changed. It edits the images, writes the copy, updates the database, and pushes the site. No new tool to learn, no Zapier rats-nest to maintain, no new vendor. This portfolio is one example. The Everlastings webstore is another. The DataEdger investment plan and the Thot App are next."
    }
  },
  "featured_tiles": {
    "tiles": [
      { "phase": "Phase A", "filter": { "all": ["Featured", "Phase A"] } },
      { "phase": "Phase B", "filter": { "all": ["Featured", "Phase B"] } },
      { "phase": "Phase C", "filter": { "all": ["Featured", "Phase C"] } }
    ]
  },
  "process": {
    "heading": "Building Custom AI Pipelines",
    "steps": [
      { "word": "FOUNDATION", "body": "A decade of strategy, design, and storytelling built for scale — measured in billions of impressions, not vanity metrics.", "href": "/section.html?tags=Phase+A" },
      { "word": "AUTOMATE", "body": "Generative pipelines that turn one hour of input into a hundred blog posts, a podcast, and a week of social.", "href": "/section.html?tags=Phase+B" },
      { "word": "EMBED", "body": "Custom AI solutions wired into the model your team already uses — no new tool, no friction, no maintenance overhead.", "href": "/section.html?tags=Phase+C" }
    ]
  },
  "credentials": {
    "heading": "Experience",
    "items": []
  },
  "achievements": {
    "heading": "Achievements",
    "source": "entries",
    "limit": null
  },
  "cta_section": {
    "heading": "Rebuilding around AI is a ground-up job.",
    "body": "If your company is trying to do real work with AI — not seminars, not pilots, not another tool slotted on top of the old process — that's the kind of thing I build.",
    "primary": { "text": "Start a custom pipeline", "href": "mailto:sean@august.style?subject=Custom%20AI%20Pipeline" },
    "secondary": { "text": "See how Phase C works", "href": "/section.html?tags=Phase+C" }
  }
}
```

Preserve the existing `credentials.items[]` array — copy the current values from the live `homepage-content.json` into the new file's credentials section before overwriting. All other sections in the current file (`showcase`, `creative`, `impact`, any `stats` / `relationship_chart`) are removed; they're superseded by `narrative_spine` + `featured_tiles` + `process`.

Hero Stats is deferred to v5.x — do not add a stats section. If `landing-controller.js` has a `renderHeroStats` or `renderRelationshipChart` function, delete it.

### 4.3. `landing.css` new sections

- Hero (`.hero-cyberpunk`, `.hero-cyberpunk__bg-video`, `.hero-cyberpunk__blur`, `.hero-cyberpunk__cutout`, `.hero-cyberpunk__about`) — per § 4.1.
- Narrative spine (`.spine`, `.spine-section`, `.spine-section__label`, `.spine-section__heading`, `.spine-section__body`) — three sections stacked vertically, no tabs. Generous spacing between sections. Background alternates between site bg and a subtle tint.
- Featured tiles (`.feature-tiles`, `.feature-tile`, `.feature-tile__video`, `.feature-tile__flip`, `.feature-tile__phase-label`) — three tiles in a row on desktop, stacked on mobile. Tile aspect ratio 4:5 vertical (1080×1350) matching the video source.
- Process (`.process`, `.process-step`, `.process-step__word`, `.process-step__body`) — three steps stacked, each clickable to the linked section URL.

Mobile breakpoints: spine sections stack; feature tiles stack vertically; process stays stacked.

### 4.4. `landing-controller.js` rewrite

- `renderHero()` — populate from `homepage-content.json.hero`; rotate `about_pool[]` to one randomly picked line per reload.
- `renderNarrativeSpine()` — populate from `homepage-content.json.narrative_spine.{phase_a,b,c}`. Each phase section is clickable to `section.html?tags=Phase+X` (uses the URL-normalize logic).
- `renderFeaturedTiles()` — for each tile in `homepage-content.json.featured_tiles.tiles[]`: apply the tile's filter against all entries, pick one entry at random from the qualifying set, pick one URL from that entry's `feature_tile[]` at random, render the tile. If 0 qualifying entries for a phase, hide that tile slot. Hand off animation state to `featured-tile-controller.js`.
- `renderProcess()` — populate from `homepage-content.json.process.steps[]`. Each step is a clickable card that navigates to `step.href`.
- `renderAchievements()` — flatten `achievements[]` across all entries; render every item (no limit unless `homepage-content.json.achievements.limit` is set).
- `renderCTASection()` — populate from `homepage-content.json.cta_section`.
- REMOVE: any `renderHeroTrio()`, `renderHeroSlideshow()`, `renderDynamicText()`, `renderHeroStats()`. If those functions exist, delete them.

### 4.5. `featured-tile-controller.js` (new)

A standalone controller for the homepage feature-tile sequence behavior. Initialized by `landing-controller.renderFeaturedTiles()` after the DOM is built.

State machine:

- States: `idle`, `playing-sequence`, `paused-on-tile`, `tile-stopped` (per-tile), `tiles-default`.
- Trigger to start playing: IntersectionObserver fires when any tile becomes 50%+ visible.
- Sequence behavior: tiles auto-play one at a time. While tile N is playing, all other tiles show a frozen poster (first frame). When tile N's video ends (or after a max duration of 8s, whichever is sooner), advance to tile N+1. Loop back to tile 0 after the last.
- Single-tap on tile N: state → `paused-on-tile`; tile N keeps looping, all others freeze at their poster.
- Double-tap on tile N: navigate to `${entry.slug}` (via `window.location.href = '/' + slug + '/'`).
- Triple-tap on tile N (3 taps within 600ms): state → `tile-stopped` for tile N; video stops, poster shown; sequence continues to N+1.
- Tap anywhere outside the feature-tiles region: state → `tiles-default`; reset all tile states; resume sequence from tile 0.

Use `Pointer Events` API for unified mouse + touch handling. Tap-count detection via `pointerdown` timestamps within a 600ms rolling window.

Accessibility: each tile has `role="button"` and `tabindex="0"`; Enter key triggers navigation (the double-tap equivalent on keyboard). Provide aria-labels: "[Entry title] — feature tile, double-tap to view project, single-tap to pause sequence".

### 4.6. Hero video pre-flight

Before any front-end work on the hero, verify the cyberpunk video is available at the expected CDN URL:

```bash
curl -I https://cdn.august.style/media/home-anim/hero-cyberpunk-FINAL.mp4
```

If HTTP 200 with `content-type: video/mp4`: proceed.

If HTTP 404: the source file at `assets/.media/home-anim/hero-cyberpunk-FINAL.mp4` needs uploading. Use the CDN-upload pattern from `ENTRY_SOP.md` (aws s3 sync against R2 with the project's profile). After upload, re-verify the URL returns 200.

If anything else (403, 5xx, wrong content-type): pause and surface to Sean.

---

## 5. Media Collections subsystem

### 5.1. New page templates

`collection.html` — mirrors the structure of `section.html`. Header: collection title + subtitle. Body: filterable grid of resolved items, each rendering as a tile with `thumb[]` + `title` + `subtitle`. Filter UI: dropdown over the item tags present across this collection's items (free-form tags from `tags.json` `item` group).

`media.html` — single-item view. Header: item title + subtitle. Body: full `src` rendering (image or short video based on `media_type`). Below: 8 related items (other items sharing tags), rendered as horizontal tile strip.

Both templates Jekyll front matter compatible — `generate_manifest.py` pre-renders them with SEO meta tags.

### 5.2. `generate_manifest.py` extension

Update the existing script:

- Scan `assets/entries/*.json` (existing behavior), `assets/collections/*.json` (new), `assets/items/*.json` (new).
- Emit `manifest.json` with three keys: `entries`, `collections`, `items`. Each maps `slug` → JSON file path.
- Emit `_pages/{slug}.html` for entries (existing behavior), `_pages/collection-{slug}.html` for collections, `_pages/media-{slug}.html` for items.
- Per-page SEO meta tags pulled from each JSON's `seo_title`, `seo_description`, plus `og:image` from `thumb[0]` or `src` (for items).

### 5.3. `collection-controller.js` (new)

```
init()
  -> getCollectionSlug()                          (from URL/sessionStorage/pathname)
  -> DataLoader.loadCollection(slug)
  -> DataLoader.resolveCollectionMedia(collection)
  -> renderHeader()
  -> renderFilters()                              (from item tag union in this collection)
  -> renderGrid()                                 (initially unfiltered; respond to filter changes)
```

Filter behavior: clicking a tag chip in the filter dropdown adds the tag to a URL hash `#tags=Tag+A+Tag+B`; controller re-filters and re-renders.

### 5.4. `media-controller.js` (new)

```
init()
  -> getItemSlug()
  -> DataLoader.loadCollectionItem(slug)
  -> renderItem()                                 (image or video based on media_type)
  -> renderRelated()
       -> DataLoader.loadAllItems()
       -> filter items sharing >= 1 tag with current item
       -> sort by tag-overlap descending, then by id
       -> take top 8
       -> render as horizontal scroll strip
```

### 5.5. `collection_preview` flow block (in entry pages)

When an entry's `flow[]` contains a `collection_preview` block, the entry's controller renders a horizontal-scroll component:

- Calls `DataLoader.loadCollection(block.collection)`.
- Calls `DataLoader.resolveCollectionMedia(collection)` to fetch the items.
- Renders the first 8 items as a horizontal scroll strip; clicking any item opens it via `media.html?path={slug}`.
- Below the strip: a "View Full Collection" link to `collection.html?path={collection.slug}`.
- This block REPLACES a media row in the flow — it's not a layout type. The entry stays `layout: "flow"`.
- Each thumb registers into the entry's lightbox index pool (per § 3.4).

CSS: `.flow-collection-preview` — horizontal scroll, scroll-snap-x mandatory, item width fixed at 200px desktop / 150px mobile.

### 5.6. Validator extension

Rename `assets/scripts/validate_v5.py` → `assets/scripts/validate.py`. (Old name lingered from the v5.x naming era; drop the version suffix since it's outdated semantics.)

Extend to validate:

- Entry JSON against `_entry_template.json` v6.1 schema (all renamed fields present where required; placement values come from `tags.json.placement`; `layout` is `"columns"` or `"flow"`; flow blocks have valid `type` values).
- Collection JSON against `_collection_template.json` v6.0 schema.
- Item JSON against `_item_template.json` v6.0 schema.
- Cross-references: every UID in `collection.media[]` exists in `assets/items/`. Every collection slug referenced in a `collection_preview` flow block exists.
- Tag values are members of the appropriate `tags.json` group (except `item` tags, which are free-form).

Output: list of errors with file paths + field paths. Exit code 1 on any error.

### 5.7. Initial seed content

This initiative does NOT create example collections or items. Sean populates them at his cadence after the subsystem ships. The orchestrator confirms `assets/collections/` and `assets/items/` directories exist (empty is fine) and that the manifest generator handles empty directories without error.

---

## 6. New showcase entries

Three new entries, all `layout: "flow"`. Source briefs at `assets/docs/archive/v4_1/`:

- `PHASE_A1_v4.md` → entry `awards-viral-social`, `placement: ["Featured", "Phase A"]`
- `PHASE_A2_v2.md` → entry `freelance-marketing-web`, `placement: ["Featured", "Phase A"]`
- `PHASE_B1_v2.md` → entry `generative-blog-workflow`, `placement: ["Featured", "Phase B"]`

Each phase draft's top section contains an "Attention" table that names all the JSON-bound values (feature-tile MP4 source path, flow asset paths, etc.) the orchestrator inlines into the JSON. Per-entry process follows `assets/docs/ENTRY_SOP.md` end-to-end; that doc is the canonical pipeline reference. Specific to this initiative:

1. **Generate JSON skeleton** per ENTRY_SOP § *Generate*. Set `layout: "flow"`.
2. **Tag the entry**: set `placement` exactly per the table above; set the `role`, `skill`, `product`, `company` values declared at the top of the phase draft.
3. **Feature-tile**: pull the MP4 source path from the phase draft's top-of-doc attention table (look for `JSON Feature Tile Video` row — value is `assets/.media/{slug}/feature-tile-{slug}-1.mp4`). Set `feature_tile: ["https://cdn.august.style/media/{slug}/feature-tile-{slug}-1.mp4"]`. Set `tile_alt` to a one-line description of the video content (the orchestrator writes this from the phase draft's narrative).
4. **CDN pre-flight for feature-tile**: per ENTRY_SOP § *CDN handling*, check the resulting URL returns 200. If 404, upload from the source path; re-verify.
5. **Convert prose to flow array**. Each phase draft's narrative is structured for direct mapping to flow blocks:
    - `### Heading` → `{ "type": "h3", "text": "Heading" }`
    - `#### Heading` → `{ "type": "h4", ... }`
    - `##### Heading` → `{ "type": "h5", ... }`
    - Paragraphs → `{ "type": "p", "text": "..." }`
    - Image references in the draft (referenced via `Asset` rows in the attention tables) → `{ "type": "img", "images": [...], "alt": "..." }`. CDN URL pattern is `media/{slug}/flow-{slug}-{NN}.webp` (or `.mp4` for video assets) where `NN` matches the number used in the draft's `Asset` rows (zero-padded two-digit, e.g. `flow-freelance-marketing-web-28.mp4`).
    - Bulleted lists → `{ "type": "list", "items": [...], "style": "bluepoints" }`
    - Embedded HTML blocks in the draft (e.g., `<video controls>` blocks for flow MP4s, `<blockquote class='twitter-tweet'>` for tweet embeds, `<iframe>` for YouTube / Behance / Bluesky cards) → `{ "type": "embed_html", "html": "...", "alt": "..." }`. The draft's existing HTML inside fenced code blocks is the source; copy verbatim, then convert to a JSON-safe string (escape double quotes; preserve `&amp;` entities; the existing convention is to use single quotes for HTML attributes per `ENTRY_SOP.md`).
    - `**chunk_break**` markers in the draft → `{ "type": "chunk_break", "button_text": "Continue reading" }`.
6. **CDN pre-flight for all flow media**: per ENTRY_SOP § *CDN handling*, verify every URL emitted into the JSON returns 200. Upload from local source paths (declared in the draft's attention tables) where any 404 surfaces. Re-verify.
7. **Populate `achievements[]`** from the awards / press / metrics noted in each draft. Each item: `{ "headline": "...", "details": "..." }`. The homepage Achievements section will surface every item across all three new entries.
8. **Validate** via `python3 assets/scripts/validate.py`.
9. **Regenerate manifest** via `python3 generate_manifest.py` — adds the three entries to `manifest.json` + emits `_pages/{slug}.html` files.

---

## 7. Docs & tooling

### 7.1. `ENTRY_SOP.md` extension

The current SOP covers columns-layout entries with the old `gif`/`mobile_img`/`slideshows` fields. Update to:

- Replace any reference to `feature` → `placement`, `feature_video` → `feature_tile`, `feature_video_alt` → `tile_alt`.
- Add a section on `layout: "flow"` entry authoring — when to use it (long-form storytelling), how to build the `flow[]` array, the `chunk_break` mid-content placement strategy.
- Add a section on `main_media` filename conventions: `media/{slug}/main-{N}-{slug}-{M}.webp` where N is the group index, M is the image index within the group.
- Add a section on `bleed` and `bleed_slides` filename conventions: `bleed-{N}-{slug}-{M}.webp` and `bleed-slide-{slug}-{N}.webp` respectively.
- Add a section on collection authoring: when to create one, how `media[]` references items, how `thumb[]` works for collection-level imagery.
- Add a section on item authoring: when to create one, the free-form `tags[]` workflow.

### 7.2. `README.md` refresh

Update the project README to reflect v4.2.3 state:

- Schema version line: v6.1.
- File-structure mirrors `AUGUST_STYLE.md` § 8.
- Local-dev commands unchanged.
- Add: "See `AUGUST_STYLE.md` for the architecture reference. See `ENTRY_SOP.md` for the entry-authoring pipeline."
- Add: "Brand copy iteration: `BRAND_COPY_STRATEGY.md`."

### 7.3. `cdn_cleanup.py` (new)

Located at `assets/scripts/cdn_cleanup.py`. Scans local JSON sources for CDN URLs, compares against the R2 bucket listing, outputs an orphan report for manual review.

```python
# Scans:
#   assets/entries/*.json     -> all thumb[], img[], main_media[*].images[], grids[*].images[],
#                                bleed[*].images[], bleed_slides.images[], flow[*].images[],
#                                feature_tile[], media_url, media_embed
#   assets/collections/*.json -> thumb[]
#   assets/items/*.json       -> src, thumb[]
#
# Lists all R2 objects under media/ via:
#   aws s3 ls s3://portfolio/media/ --recursive --profile cloudflare-r2 --endpoint-url ...
#
# Output: a markdown report at assets/docs/archive/v4_2/cdn_orphans_2026_05_27.md listing:
#   - Total CDN objects scanned
#   - Total referenced in local JSON
#   - Orphan list (full S3 path), grouped by slug
#   - One-liner aws s3 rm command per orphan (commented out; Sean uncomments after review)
```

The script does NOT delete anything. Output is for manual review.

### 7.4. Schema-version sync

After all field changes land:

- Verify `_entry_template.json._metadata.schema_version` is `"6.1"`.
- Verify `_collection_template.json._metadata.schema_version` is `"6.0"`.
- Verify `_item_template.json._metadata.schema_version` is `"6.0"`.
- These match `AUGUST_STYLE.md` § Schema Version Alignment Check. If any mismatch surfaces, pause and surface to Sean — do not patch silently.

---

## 8. Cross-cutting concerns

### 8.1. Lightbox state pool

Single source of truth for all entry-page lightbox-able imagery is the array built by `entry-controller.populateColumnsLayout()` or `populateFlowLayout()`. Order matches document order. Every lightbox-eligible `<img>` carries `data-lightbox-index="<n>"`. The lightbox open handler reads this attribute; navigation walks the array.

### 8.2. Mobile responsiveness coverage

For every new component, the orchestrator manually tests at 360px, 720px, 1024px, 1440px viewports. Specific checks:

- Sticky tag column un-sticks below 900px (§ 3.3).
- Featured tiles stack vertically below 720px.
- `bleed` images stay full-bleed at every breakpoint.
- `bleed_slides` pagination dots visible at every breakpoint.
- Flow `img` blocks (multi-image) become vertical stacks below 720px.
- `collection_preview` horizontal scroll has working touch-swipe on mobile.

### 8.3. Asset pipeline pre-flight

Before front-end work begins on any region that depends on CDN assets, verify the assets are uploaded:

- `https://cdn.august.style/media/home-anim/hero-cyberpunk-FINAL.mp4` (hero video, § 4.1)
- `https://cdn.august.style/media/{slug}/feature-tile-{slug}-1.mp4` × 3 (one per new entry, § 6)
- All `https://cdn.august.style/media/{slug}/...` referenced in each new entry's JSON (§ 6)

If any return non-200, pause and surface to Sean before proceeding.

### 8.4. `assets/.media/` and `assets/images/`

Both are gitignored working directories. `.media/` is Sean's pre-CDN staging + personal archive (files persist after CDN upload). `images/` is the legacy working dir; files are deleted as they reach CDN. Neither directory is read by any runtime browser code.

The orchestrator READS from these directories when running the entry-creation pipeline (per `ENTRY_SOP.md` — source files for Cloudinary processing or direct R2 upload). The orchestrator does NOT delete from these directories — Sean manages cleanup at his own cadence. Outside the entry pipeline, the orchestrator does not touch these directories.

### 8.5. Hero Stats Revamp — deferred to v5.x

Not in v4.2.3 scope. The homepage does NOT render a relationship graph. If the current `homepage-content.json` contains a `stats` or `relationship_chart` section, remove it. If `landing-controller.js` has a `renderHeroStats` or `renderRelationshipChart` function, delete it.

---

## 9. Verification

End-to-end verification before declaring v4.2.3 shipped:

1. **Validator passes** — `python3 assets/scripts/validate.py` runs clean across all entries, collections, items.
2. **Manifest regenerates cleanly** — `python3 generate_manifest.py` produces a valid `manifest.json` with all three keys (`entries`, `collections`, `items`) and corresponding `_pages/*.html` files.
3. **Local server boots** — `python3 -m http.server 5500 --bind 127.0.0.1` serves the homepage without console errors.
4. **Homepage visual review** — hero video plays + cutout name visible + ABOUT line rotates on reload + narrative spine renders all three phases + three feature tiles populate with random video per phase per reload + tile interactions work per § 4.5 + process section clickable + achievements lists every item across the three new entries + CTA renders.
5. **Three new entries load** — visit each `/{slug}/`, confirm flow renderer emits headings/paragraphs/images/lists/chunk-breaks/embed_html as expected.
6. **One columns-layout legacy entry loads** — pick any entry not in the three new ones; confirm sticky tag column, main_media, lightbox pool all work; confirm tile-tag width fix on its tags region.
7. **Collection page loads** — placeholder test: create one minimal collection + one item by hand, run manifest generator, visit `/collection/{slug}/`, confirm renders.
8. **Cross-browser smoke** — Chrome, Safari, Firefox; desktop + mobile.
9. **CDN orphans report generated** — `python3 assets/scripts/cdn_cleanup.py` produces the markdown report.
10. **Build log written** — `BUILD_REPORT_v4_2_3.md` exists in `assets/docs/archive/v4_2/` with all four sections (changed / deviations / gaps / verification results).

If any item fails, the orchestrator does NOT mark shipped. Pause, surface to Sean, fix or escalate.

---

---

## 10. Rollback

Per DEV_RULES § *Implementation Plans Must Haves — 4. Common Pitfalls Identified*, every initiative carries a rollback path. v4.2.3 is shipped via Git on the existing `design-360` branch; the rollback unit is a Git revert of the commit(s) that land the work, not a per-file undo.

Rollback strategy by area:

- **Schema cascade (§ 3.1)** — if entry-JSON renames cause runtime failures, `git revert` the commit; existing entries return to their pre-rename state. The template (`_entry_template.json`) is rolled back along with the cascade. No data loss.
- **Entry page layout overhaul (§ 3.2–3.6)** — DOM + CSS + JS changes are co-committed; rollback is a single revert. The legacy `populateGifs` / `populateMobileImg` are restored from Git history. Pre-revert, capture screenshots of the broken state for the BUILD_REPORT.
- **Homepage redesign (§ 4)** — the new `homepage-content.json` shape is breaking; rollback restores the old shape. Before committing the homepage rewrite, save the pre-state `homepage-content.json` as `homepage-content.json.pre-v423.bak` (gitignored or committed alongside under a `.bak` suffix that the validator ignores) so partial rollback is possible if only the homepage misbehaves while entries are fine.
- **Media Collections (§ 5)** — net-new templates and controllers. Rollback is a revert of the new files; the existing site (entries + section pages) is unaffected because the new pages have no inbound links from the old surface until the new entries reference `collection_preview` blocks. Rollback for the new entries (§ 6) removes their collection_preview references first.
- **New entries (§ 6)** — three new entry JSON files. Rollback deletes them and regenerates the manifest. Rollback of `feature_tile` videos in CDN: not necessary (orphaned media is fine; `cdn_cleanup.py` flags them on the next pass).
- **Docs & tooling (§ 7)** — pure doc rewrites + a new script. Rollback is a Git revert; the script is removed; `validate.py` reverts to `validate_v5.py`. No runtime impact.

Rollback order: revert most-recent-commit-first. If multiple area commits were bundled, revert as a unit. After rollback, run the validator + manifest regen + a smoke test on the homepage and one entry page.

If a regression surfaces post-ship that is not large enough to warrant a rollback, file `assets/docs/archive/v4_2/v4_2_3_BUGS.md` per DEV_RULES § *Four File Types* and proceed in patch mode.

---

*End of v4.2.3 implementation plan. The orchestrator returns `BUILD_REPORT_v4_2_3.md` at session close.*
