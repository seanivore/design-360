# v4.4.0 Implementation Plan — Art galleries (lean visual entries)

**Initiative**: A new *gallery* content shape — entries that are mostly images + a few lines of copy, "absorbed in a sitting." First instance = `illustration-art-deco` (Sean's recovered hand-drawn Art-Deco art); more galleries follow (he's staging them now, **with the copy mostly pre-written** — a sentence or two explaining what it is). The schema/system changes here make every future gallery a fast "images + 2 sentences" entry.
**Revision driven by**: Sean's scope correction — no item files, no per-image titles, gallery = lean columns layout.
**Required reading first**: `assets/docs/AUGUST_STYLE.md` · `assets/docs/ENTRY_SOP.md` · this doc only.
**Branch**: build on `dev` → preview review → ff `dev`→`design-360` + tag `v4.4.0`.

---

## v4.3.0 note (folded here — infra only, no separate v4_3 doc)
Done + live: GitHub Pages → **Vercel** (team SEANIVORE, project `design-360`), www.august.style, SSL; two-branch `dev`→Preview / `design-360`→Prod; `vercel.json` routing parity. **`/api/upload`** endpoint (`api/upload.ts` + `api/_lib/{env,cors}.ts`): image → Cloudinary `c_limit 2400 f_webp` → R2 (`portfolio`, `cdn.august.style`) → destroy; `UPLOAD_API_KEY` bearer; `skip_transform`. 7 env vars in Vercel Prod+Preview + gitignored `.env`. See memory `project_vercel_migration`.

## Already done this session (do NOT redo)
- **All 39 art files uploaded + verified** on the CDN (verify with a browser User-Agent — `cdn.august.style` 403s headless requests via Cloudflare bot-protection):
  - Collections: `https://cdn.august.style/media/illustration-art-deco/animals/illustration-art-deco-collection-animals-{1..26}.webp` · `.../motif/illustration-art-deco-collection-motif-{1..7}.webp`
  - Entry thumbs (hero slideshow, 1200×742): `https://cdn.august.style/media/illustration-art-deco/thumb-illustration-art-deco-{1..6}.webp`
- `"Art Gallery"` added to `assets/docs/tags.json` `placement` group.
- Memory written; tasks #1,2,3,12 done.

## Core decisions (locked)
- **No item JSON files, no per-image titles.** A collection holds an **ordered array of CDN URLs**. Lightbox already works everywhere.
- **Collection page already exists** (`collection.html` + `collection-controller.js`) — feed it URLs + a title (subtitle optional).
- **`gallery` = a third entry `layout`** (alongside `columns`/`flow`): the `columns` shell (hero thumbnail-slideshow + sticky tag column + dynamic `main_media`/`bleed`/`grids`) but the left copy column shows **1–2 short blurbs** (Sean-supplied) instead of `challenge`/`approach`/`result`. Model on how `flow` was added.
- **Nested collection URLs**: `/<entry-slug>/<collection-slug>` (e.g. `/illustration-art-deco/animals`); entry stays `/illustration-art-deco`. No exposed `/collection` index.
- **Intent**: page through images, minimal copy ("what is it / how made / materials / how used" in a sentence or two).

---

## Build slices (exclusively executable)

### A. Collection = ordered URL array (deletes the item system for galleries)
- `assets/docs/_collection_template.json`: replace `"media": ["uid-itm-001",…]` with `"images": ["https://cdn.august.style/…-1.webp", …]` (ordered). Keep `title`, optional `subtitle`, `thumb`, tags; add `"entry": "<parent-entry-slug>"`. Bump schema 6.0→6.1.
- `assets/js/collection-controller.js` (`renderGrid()`/`buildItemTile()`/`init()`): render directly from `collection.images[]` URLs — each tile is an `<img>` opening the **shared lightbox** on click (no `media.html` link, no title). Replace `DataLoader.resolveCollectionMedia()` item-UID resolution with reading `collection.images[]`.
- `assets/js/data-loader.js` `resolveCollectionMedia()` → return `collection.images || []`.
- Collection PAGE renders `images[]` **in array order** (= filename order; intentional). Do NOT shuffle here.
- Leave `media.html` + `_item_template.json` in place but unused — don't delete.

### B. Nested collection URLs (`/<entry>/<collection>`)
- `generate_manifest.py` (~line 284, collection `_pages` gen): emit nested `_pages/<entry>/<coll>.html` + nested manifest key (`illustration-art-deco/animals`) using the collection's `entry` field; instead of flat `_pages/collection-<slug>.html`.
- `vercel.json`: add a two-segment rewrite `{ "source": "/:entry/:coll", "destination": "/_pages/:entry/:coll" }` AFTER the existing single-segment rule (real files + single-segment entry slugs still win).
- `collection-controller.js getCollectionSlug()`: resolve from the nested path (it already half-handles `collection/` pathnames — extend to `<entry>/<coll>`).

### C. `gallery` entry layout
- `assets/docs/_entry_template.json`: document `"layout": "gallery"`; gallery copy = **1–2 short blurbs** — recommend reusing `challenge` ("About") + `approach` ("Details") and skipping `result` (keeps schema stable); add `"collections": []`.
- `assets/js/entry-controller.js`: layout dispatch (`columns` default vs `flow`→`populateFlowLayout`) gets a `gallery` branch = columns render path, but the left copy column renders only the 1–2 gallery blurbs (skip the challenge/approach/result trio). Hero slideshow + `bleed`/`main_media`/`grids` regions render unchanged.
- **Entry → collections**: add `"collections": ["animals","motif"]` on gallery entries → render one **shuffled, capped** bleed-style preview row per collection (reuse `.entry-bleed`), each **clicking through to the nested collection page** (`/illustration-art-deco/animals`).

### D. `project_link` flow block + restyle
- `assets/js/entry-controller.js buildFlowBlock()` switch (`:538`): add `case 'project_link':` → `<a>` styled like the homepage `.cta-buttons` (tan-filled/outline), inline-placeable. Shape: `{"type":"project_link","url":"…","text":"…"}`.
- `styles.css`: add the button style; restyle legacy `.project-link-card` (`:1644`) to match.

### E. Author the content
- **Collections** `assets/collections/`: `animals` ("Animals", 26 URLs ordered) + `motif` ("Motif", 7 URLs ordered); each `"entry":"illustration-art-deco"`, `images[]` = the CDN URLs above, a `thumb`, company/tags. Slugs `animals` / `motif`.
- **Entry** `assets/entries/`: `illustration-art-deco`, `layout:"gallery"`, `placement:["Art Gallery"]`, `product:["Digital Art Collection","Art Print"]`, `skill:["Illustration","Adobe Creative Cloud","Art Direction"]`, `thumb[]` = the 6 thumbnails, 1–2 short blurbs (Sean-supplied or a placeholder he edits on preview), `collections:["animals","motif"]`, a `project_link`/`origin_url` to `/generative-blog-workflow`.
- **Blog cross-link** `assets/entries/uid-gbw-103.json`: insert a bold `project_link` flow block → `https://generative-horoscopes.august.style/` right after the `"Automating 100+ Weekly Blog Posts"` h5 (`flow[]`, ~line 225).

### F. Homepage gallery component + shuffle
- New `<section id="art-gallery">` in `index.html` between `:79 #featured-tiles` and `:81 #process`; `renderArtGallery()` in `landing-controller.js` between `renderFeaturedTiles()` and `renderProcess()`; config in `homepage-content.json`. Reuse `.entry-bleed`; pull images across all `"Art Gallery"`-placement entries, **shuffle each reload**, click → `/entry?path=<slug>`.
- **Shuffle scope**: entry collection-preview rows + homepage shuffle on reload; **collection PAGE stays in `images[]` order**.

### G. Ship
- `python3 generate_manifest.py` → `python3 assets/scripts/validate.py` (update validator: collections now use `images[]` not `media[]` UIDs) → smoke-test on **dev preview** → Sean signs off → ff `dev`→`design-360` + tag `v4.4.0`.
- Then task #11: one bundled doc pass — `AUGUST_STYLE.md` + `ENTRY_SOP.md` + `README.md` (endpoint + URL-array collection + `gallery` layout + `project_link` + nested URLs + homepage gallery).

## Verification (dev preview; browser UA for any CDN curl)
- `/illustration-art-deco` = gallery layout: thumbnail hero, 1–2 blurbs, two shuffled collection preview rows; each row clicks through to `/illustration-art-deco/animals` | `/motif`.
- Nested collection pages render the full image grid **in order** with working lightbox; title shows.
- Blog post shows the fresh `generative-horoscopes` button inline under the heading.
- Homepage gallery section in position, reshuffles on reload, image → correct entry; featured-tiles/process unaffected.
- `validate.py` clean; `generate_manifest.py` lists the new entry + 2 collections; no console errors.

## Gap-review corrections (light in-session review found these — apply them; line refs verified against repo)

**A · The lightbox is NOT on collection pages (biggest wrong assumption).** `initLightbox`, `#lightbox-overlay`, the `img[data-lightbox-index]` click delegation, and `lightboxPool` live only in `entry-controller.js` + `entry.html`. `collection.html` loads only data-loader/tile-renderer/filter-controller/collection-controller — no lightbox. **Fix:** extract a shared `assets/js/lightbox.js` (port from entry-controller), include it on BOTH `entry.html` + `collection.html`, add the `#lightbox-overlay` markup to `collection.html`. Then collection `<img>`s with `data-lightbox-index` work. **Navigation requirement (everywhere — entry + collection lightboxes):** the shared lightbox must support (1) clickable ‹ › prev/next arrow buttons (the entry overlay already has `.lightbox-prev`/`.lightbox-next` — keep them), (2) **keyboard ←/→** to move between images, and (3) **touch swipe** left/right on mobile. Verify the existing entry lightbox already does all three; add any that are missing to the shared module so it's consistent on every page.

**A · Do NOT overload `resolveCollectionMedia()`.** It's reused by the legacy entry `collection_preview` (`entry-controller.js resolveCollectionPreview()` ~:721, which expects item OBJECTS — `item.thumb[0]`, `item.slug`). Returning bare URLs breaks it. **Fix:** add a NEW `resolveCollectionImages()` → `collection.images || []`; leave `resolveCollectionMedia()` for the legacy item path.

**B · Nested keying must be consistent in 3 places.** `loadCollection(slug)` looks up `manifest.collections[slug]` by exact string. **Fix:** collection JSON keeps `slug:"animals"` + `entry:"illustration-art-deco"`; `generate_manifest.py` keys the manifest by the NESTED path `illustration-art-deco/animals` (built from entry+slug) AND `generate_collection_html` (~:328) writes `_pages/illustration-art-deco/animals.html` (mkdir the nested dir); `getCollectionSlug()` returns the full nested path so it matches the manifest key. (Two-segment vs single-segment rewrites don't collide — different segment counts.)

**C · Pin the gallery copy fields + add a real branch.** Gallery copy = `challenge` (render labelled "About") + `approach` (render labelled "Details"); omit `result`. Use these exact fields in BOTH the renderer and the authored entry. The dispatch (`entry-controller.js` ~:1285) only special-cases `flow`; everything else falls to `populateColumnsLayout` → `populateContent()` (~:1196–1212) which ALWAYS renders challenge/approach/result. **Fix:** add a `gallery` branch rendering the columns shell but gating the copy to only those 2 blurbs. Add `"gallery"` to `validate.py VALID_LAYOUTS` (:36). "Model on flow" touch-points = `_entry_template.json` layout value + the dispatch site + `populateColumnsLayout`/`populateContent` (no manifest change for layout).

**D · The button style does NOT exist.** `.cta-buttons` (index.html:121) is a CONTAINER; its buttons are `.btn.btn-primary`/`.btn.btn-ghost` (landing-controller.js ~:429) which have NO rules in live `styles.css` (only in archived prototypes). **Fix:** slice D must AUTHOR the button CSS (define `.btn-primary`/`.btn-ghost`, or a new `.project-link-btn`); use tan-filled as the `project_link` default, restyle `.project-link-card` (:1644) to match.

**E · Confirm identifiers + supply values.** Entry slug `generative-blog-workflow` ↔ file `assets/entries/uid-gbw-103.json`; external target `https://generative-horoscopes.august.style/`. Collection `company:"Freelance"`; each collection's `thumb` = one of its own images.

**F · Define the homepage config + a cap count.** `renderArtGallery()` reads a `homepage-content.json` block — give it `{ heading?, cap, placement:"Art Gallery" }`. Caps: ~12 images on the homepage row, ~8 per collection-preview row on the entry.

## Deferred (NOT v4.4.0)
- **v4.5.0** — refresh entry/collection/section aesthetics to match the fresh homepage ("other pages falling behind"). Galleries ship on current templates now; the art carries the weight.
