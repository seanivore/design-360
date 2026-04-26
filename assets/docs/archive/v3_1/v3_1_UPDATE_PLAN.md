# Plan: v3.1.0 Feedback Round 2 — All tracks, one session

**Source**: `assets/docs/archive/v3/v3_1_FEEDBACK_1.md`

## Context

Second round of v3.1.0 feedback covers eight workstreams. Initial instinct was to defer half of them, but with images already staged in `assets/images/{slug}/`, Cloudinary not needed, GIFs already working in slideshows (renderer is extension-agnostic), and subagents handling content drafts in parallel, everything fits in one session. Sean is juggling client work and a job hunt — dragging this out across multiple sessions adds scheduling friction for no technical reason.

## Locked decisions

- **Tile title style**: Bold compressed caps, `BerninaSans-CompressedExbold`, uppercase, ~1.5–1.75rem, positioned at the bottom of a taller `.tile-text-area`.
- **Grid schema**: Add optional `grids[]` (array of `{title, images, alt}` groups, mirroring `slideshows[]`) alongside legacy flat `grid[]`. Zero migration risk — existing entries keep working.

---

## Main thread (serial, me)

### Step 1 — Section tile page title row (A3)

**Files**: `assets/js/tile-renderer.js`, `styles.css`.

- `styles.css:376-403` — change `.tile-text-area` to `height: ~8rem`, add `display: flex; flex-direction: column; justify-content: space-between;`.
- `styles.css` top (near `:11-16`) — add `@font-face` for `BerninaSans-CompressedExbold` pointing to `/assets/fonts/BerninaSans-CompressedExbold.otf`.
- Add `.tile-title` rule: new font, `~1.5rem`, uppercase, tight letter-spacing, color same as `.tile-text`.
- `assets/js/tile-renderer.js:47-58` (`renderSectionTile`) — after appending `<p class="tile-text">`, append a `<h3 class="tile-title">` with `project.title`.

### Step 2 — Multi-grid schema (A1)

**Files**: `assets/js/entry-controller.js`, `entry.html`, `styles.css`, `assets/docs/JSON_ARCHITECTURE.md`, `assets/scripts/validate_v5.py`.

- Entry JSON schema: add optional `grids[]` with `[{title, images, alt}]` group objects (matches `slideshows[]` pattern at `entry-controller.js:192-216`).
- `entry-controller.js:178-187` (`populateImageGrid`) — refactor into two paths:
  1. If `project.grids` is a non-empty array, render each group inside a wrapping `<div class="grid-group">` with optional `<h4 class="grid-title">`.
  2. Else fall back to legacy flat `project.grid` rendering.
- `entry.html:105` — keep `#entry-image-grid` as the legacy container, add new `#entry-image-grids` container for the grouped path (or reuse and let the controller rewrite innerHTML). Simpler: keep the one container, controller picks which layout to emit.
- `styles.css:1241-1260` — add `.grid-group` wrapper (`margin-block: var(--space-lg);`) and `.grid-title` styling.
- `validate_v5.py` — allow both `grid[]` and `grids[]`; validate `grids[]` shape if present; require each group to have `images[]` with CDN URLs.
- `JSON_ARCHITECTURE.md` §1 — add `grids[]` to the optional fields table with structured example.

### Step 3 — Image replacement sweep for all 10 entries (B1)

For each slug in the feedback doc (agentic-fashion-designer, agentic-marketing-department, agentic-social-manager, ai-virtual-photoshoot-design, all-that-glitters, api-automate-video-production, art-nouveau-brand-design, baroque-de-heem-still-life, bau-noir-haus, bohemian-abstractions):

1. `aws s3 sync assets/images/{slug}/ s3://portfolio/media/{slug}/ --endpoint-url ... --profile r2` (per `ENTRY_SOP.md` §5).
2. Open the entry JSON; update `thumb[]`, `img[]` (square), `gif[]`, `grid[]` or new `grids[]`, and `slideshows[]` arrays to match the exact filenames listed in the feedback doc, using the `https://cdn.august.style/media/{slug}/...` URL pattern.
3. For `api-automate-video-production`: populate `grids[]` with two groups (`grid-1-...` and `grid-2-...`), and add a `slideshows[]` group whose `images[]` array contains `.gif` URLs (`slide-gif-...`).

### Step 4 — Validate + regenerate

- `python3 assets/scripts/validate_v5.py` → fix any errors.
- `python3 generate_manifest.py` → regenerate `manifest.json` + `_pages/{slug}.html`.

### Step 5 — Browser verification (me, foreground)

Start `python3 -m http.server 5500 --bind 127.0.0.1`, open:
- `http://localhost:5500/section.html` — confirm taller tile + page title at bottom.
- `http://localhost:5500/entry.html?path=api-automate-video-production` — confirm two grid blocks render, GIF slideshow renders and cycles.
- Spot-check 2 other image-replaced entries.

---

## Parallel subagent work (launched at start of session)

All spawned in one message, running while I execute the main thread.

### Subagent 1 — Art History copy reframe (B2)

Rewrite `challenge` / `approach` / `result` (and `subtitle` / `tiles` if stale) for art-history entries: `baroque-de-heem-still-life`, `art-nouveau-brand-design`, `bohemian-abstractions`, `bau-noir-haus`, plus any others with art-movement-themed slugs in `assets/entries/`. Voice: non-technical, growth-focused — "researched the movement, crafted prompts, kept what captured what I learned and what I liked." Target: HR recruiter who isn't in the field. Returns: per-slug proposed copy blocks + list of updated URLs (not written to files — Sean reviews first).

### Subagent 2 — AI Pipeline reframe (B3)

Rewrite copy for entries where the AI pipeline is the story but current copy buries it: `automated-e-commerce-shop-lookbook`, `animated-cms-weekly-blogs`, `full-stack-automated-ecommerce`, `agentic-marketing-department`, `agentic-social-manager`, `api-automate-video-production`. Also scan `assets/entries/` for entries that used Make.com / LLM tagging / GPT agents but don't lead with it. Voice: accessible to non-technical recruiters. Returns: per-slug proposed copy + list of entry URLs with AI-pipeline potential.

### Subagent 3 — Everlastings by Emaline entry draft (B4)

Run `python3 assets/scripts/new_project.py` to generate the JSON skeleton in `assets/docs/`. Read `assets/docs/entries-prep/PRODUCT_PROTOCOL_COPY.md` and `assets/docs/EVERLASTINGS_STORE.md`. Draft all copy fields: `title`, `subtitle`, `seo_title`, `seo_description`, `tiles`, `challenge`, `approach`, `result`, plus tags from `assets/docs/tags.json`. Leave image arrays empty (image CDN upload is a follow-up task for Sean). Entry stays in `assets/docs/` as a draft. Returns: draft JSON path + summary.

### Subagent 4 — Identification lists (C1 + C2 + C3)

Three deliverables in one report:
- **C1**: Best-in-class entries for each of the three homepage topics (WEBSITE DESIGN/DEV, GRAPHIC DESIGN/SOCIAL, AI PIPELINE SOLUTIONS). Propose `homepage-content.json` filter/section structure.
- **C2**: URL list of entries with strong art/design slideshows that belong highlighted on the front page.
- **C3**: Audit of all `assets/entries/*.json` not in the 10-fix list — flag any whose images look wrong/mismatched (e.g., thumbs referencing a different project). Produce URL list for Sean's next-session cleanup.

Returns: structured markdown report. No file writes.

---

## Critical files touched

- `assets/js/tile-renderer.js`
- `assets/js/entry-controller.js`
- `entry.html`
- `styles.css`
- `assets/scripts/validate_v5.py`
- `assets/docs/JSON_ARCHITECTURE.md`
- 10 entry JSONs in `assets/entries/` (image field updates)
- `assets/js/manifest.json` + `_pages/*.html` (regenerated)
- No changes to `homepage-content.json` yet — Subagent 4 produces proposals for Sean to approve separately.

## Verification

- `python3 assets/scripts/validate_v5.py` → clean.
- `python3 generate_manifest.py` → all slugs present.
- Local server smoke tests in Step 5.
- Subagent drafts land in plan comments / messages — Sean reviews voice before any content is written to entry files.
