# v4.4.2 Implementation Plan — Galleries + portfolio feedback batch

**Initiative**: Shift the portfolio toward "reviewable in a sitting" — visual, minimal copy, scroll-and-go. Two things ship together: (1) a new *gallery* content shape (URL-array collections + a `gallery` entry layout + a shared lightbox + nested collection URLs), first instance the recovered hand-drawn Art-Deco art; (2) a batch of human feedback hardening the homepage, footer, copy, and a new Phase C entry (the freelance-payments platform — **prioritized because every Phase C link currently loads empty**).
**Revision driven by**: gap-review fold (A cold / B fidelity / C integration / D design-correctness) on top of the v4.4.1 feedback fold. (v4.4.0 = pre-feedback gallery draft, kept as history.)
**Required reading first**: `assets/docs/AUGUST_STYLE.md` · `assets/docs/ENTRY_SOP.md` · `.agent/EMOTION_DRIVEN_COPYWRITING.md` · this doc only.
**Branch**: build on `dev` → preview review → ff `dev`→`design-360` + tag.
**This is a delta on a shipped, live system.** The current repo + architecture doc are the proven substrate; review/execute the delta and its fit — do not re-litigate settled behavior.

---

## Settled context (done, do NOT redo)
- **v4.3 infra (live):** GitHub Pages → Vercel (team SEANIVORE, project `design-360`), www.august.style + SSL; two-branch `dev`→Preview / `design-360`→Prod; `vercel.json` routing parity. **`/api/upload`** (`api/upload.ts` + `api/_lib/{env,cors}.ts`): image → Cloudinary `c_limit 2400 f_webp` → R2 (`portfolio`, `cdn.august.style`) → destroy; `UPLOAD_API_KEY` bearer; `skip_transform`. See memory `project_vercel_migration`.
- **39 gallery art files uploaded + verified** on the CDN: `media/illustration-art-deco/animals/illustration-art-deco-collection-animals-{1..26}.webp` · `.../motif/illustration-art-deco-collection-motif-{1..7}.webp` · `.../thumb-illustration-art-deco-{1..6}.webp`.
- `"Art Gallery"` already in `assets/docs/tags.json` `placement`.

## Landmines (carry into every gap-review prompt)
- `cdn.august.style` has Cloudflare bot-protection: header-less `curl`/`python` GET → **403** even for valid objects. Use a **browser User-Agent** for any headless CDN check.
- **Two CSS files, loaded per page:** `index.html` → `landing.css` ONLY; `section.html`/`entry.html`/`collection.html`/`media.html`/`404.html` → `styles.css` ONLY. A class styled in `landing.css` (e.g. `.btn-primary`/`.btn-ghost`, defined at `landing.css:254–262`) is **unstyled on entry/section pages.** Entry-page buttons must be authored in `styles.css`.
- **Two footer variants:** `index.html` uses `.footer-icons` + `.footer-copy` (landing.css). `section/entry/collection/media.html` use `.social-links.social-links--footer` + `.text-center.text-secondary`, wrapped in `.container` (styles.css). Footers are **duplicated inline per page**, not a shared partial — every footer edit touches each page file.
- The entry lightbox **already supports** keyboard ←/→ (`entry-controller.js:1070–1071`), touch swipe (`:1077–1087`), and clickable `.lightbox-prev`/`.lightbox-next` (`:1058–1063`). The shared module **ports** this — no new nav behavior to invent.
- Stage **only v4.4.x files** when committing; leave Sean's pending `.agent/` + `_collection_template` + deleted-entry working-tree changes untouched.
- Validate against reality, not training data; this is a delta on proven code.

---

# PART 1 — Gallery system

### 1A. Collection = ordered URL array + shared lightbox
- `assets/docs/_collection_template.json`: replace `"media": ["uid-itm-001",…]` with `"images": ["https://cdn.august.style/…-1.webp", …]` (ordered); keep `title`, optional `subtitle`, `thumb`, tags; add `"entry": "<parent-entry-slug>"`. Bump `schema_version` 6.0→**6.1**.
- `assets/js/data-loader.js`: add a NEW `resolveCollectionImages(collection)` → `return collection.images || []`. **Do NOT modify `resolveCollectionMedia()`** (`data-loader.js:205–224`) — it returns item OBJECTS and still feeds the legacy entry `collection_preview` via `entry-controller.js resolveCollectionPreview()` (`:741`, reads `item.thumb[0]`/`item.slug`).
- `assets/js/collection-controller.js` (`renderGrid()` `:195`, `buildItemTile()` `:216`, `init()` `:274`/`:288`): render tiles directly from `collection.images[]` URLs — each tile an `<img data-lightbox-index="N">` opening the **shared lightbox** on click (no `media.html` link, no per-image title). Replace the `DataLoader.resolveCollectionMedia()` call at `:288` with `resolveCollectionImages()`.
- Collection PAGE renders `images[]` in array order (= filename order; intentional). No shuffle here.
- **Extract `assets/js/lightbox.js`** — port the overlay open/close + `lightboxNav(±1)` + keyboard ←/→ + touch swipe + `.lightbox-prev`/`.lightbox-next` click delegation + `lightboxPool` from `entry-controller.js` (`:1053–1090`) into a standalone module exposing an init that binds to `img[data-lightbox-index]`. Include `<script src="/assets/js/lightbox.js">` on BOTH `entry.html` and `collection.html`; add the `#lightbox-overlay` markup (currently `entry.html:133–139`, with `.lightbox-prev`/`.lightbox-next`) to `collection.html`. `entry-controller.js` calls the shared init instead of its inline copy. **Confirm the `#lightbox-overlay` CSS lives in `styles.css`** (both pages load `styles.css`) so the ported markup is styled on both; if any lightbox CSS is entry-only, move it into shared `styles.css`.
- Leave `media.html` + `_item_template.json` in place but unused — don't delete.

### 1B. Nested collection URLs (`/<entry>/<collection>`)
- `generate_manifest.py` `generate_collection_html` (~`:328`): write nested `_pages/<entry>/<coll>.html` (mkdir the nested dir) instead of flat `_pages/collection-<slug>.html`; key the manifest `collections` map by the NESTED path `illustration-art-deco/animals` (built from the collection's `entry` + `slug`).
- `vercel.json`: add a two-segment rewrite `{ "source": "/:entry/:coll", "destination": "/_pages/:entry/:coll" }` AFTER the existing single-segment `/:slug` rule (different segment counts → no collision; real files + single-segment slugs still win).
- `collection-controller.js getCollectionSlug()` (`:23–39`): return the full nested path (`<entry>/<coll>`) so it matches the manifest key used by `loadCollection()` (`data-loader.js:117`, exact-string `manifest.collections[slug]`).
- Entry `collection_preview` "view full collection" links + bleed click-throughs point at the nested URL.

### 1C. `gallery` entry layout (third layout)
- Model on how `flow` was added. Dispatch at `entry-controller.js:1285–1293` only special-cases `flow`; everything else falls to `populateColumnsLayout`→`populateContent()` (`:1185–1204`) which always renders challenge/approach/result. **Add a `gallery` branch**: render the columns shell (hero thumbnail-slideshow + `bleed`/`main_media`/`grids` regions unchanged) but gate the left copy column to the gallery blurbs only — render `challenge` labelled **"About"** + `approach` labelled **"Details"**, omit `result`. Use those exact two fields in renderer AND authored entry.
- `assets/docs/_entry_template.json`: document `"layout": "gallery"` + `"collections": []`.
- Gallery entries: `"collections": ["animals","motif"]` → render one shuffled, capped (~8) bleed-style preview row per collection (reuse `.entry-bleed`, `styles.css:1915–1947`), each clicking through to its nested collection page.

### 1D. Validator + manifest (validate.py edits)
`assets/scripts/validate.py` — these must NOT break the **existing legacy collection** (`uid-col-001.json`, schema 6.0 / `media[]` UIDs, still feeding the legacy entry `collection_preview`). **Accept both shapes; do NOT hard-flip:**
1. `VALID_LAYOUTS` (`:36`) `{"columns","flow"}` → add `"gallery"`.
2. **`VALID_FLOW_TYPES`** (~`:38–48`; the h3/h4/h5/p/img/list/chunk_break/embed_html/collection_preview set) → add `"project_link"` and `"video"`. **Build-breaker if missed** — the freelance entry + the blog cross-link use them.
3. Collection `schema_version` check (`:282–286`): accept **both** `"6.0"` and `"6.1"` (legacy media-collections stay 6.0; new gallery collections are 6.1).
4. `COLLECTION_REQUIRED_FIELDS` (`:70–81`): make it **conditional** — a 6.0 collection requires `"media"`, a 6.1 collection requires `"images"`. Do NOT globally drop `"media"`.
5. `media[]` UID cross-ref (`:307–318`): gate it to run **only** for collections that have `media[]`; skip for 6.1 `images[]` (URLs don't resolve to local item UIDs).
Then `python3 generate_manifest.py` emits the new entry + nested collection pages. **Re-run `validate.py` and confirm the existing collections + entries still pass** before proceeding.

### 1E. Gallery content
- **Collections** `assets/collections/`: `animals` ("Animals", 26 URLs ordered) + `motif` ("Motif", 7 URLs ordered); each `"entry":"illustration-art-deco"`, `"company":"Freelance"`, schema 6.1, a `thumb` = one of its own images, `images[]` = the CDN URLs above.
- **Entry** `assets/entries/`: `illustration-art-deco`, `layout:"gallery"`, `placement:["Art Gallery"]`, `product:["Digital Art Collection","Art Print"]`, `skill:["Illustration","Adobe Creative Cloud","Art Direction"]`, `thumb[]` = the 6 thumbnails, `collections:["animals","motif"]`, `challenge`(="About") + `approach`(="Details") 1–2 short blurbs (draft below), a `project_link` (Part 2M) to `/generative-blog-workflow`.
  - **About** (draft): "Hand-drawn Art Deco illustration from the maximalist turn — the moment minimalism flipped and ornament came roaring back. Fans, palms, tigers, birds, all drawn on iPad and used as the living backdrop of a whole brand."
  - **Details** (draft): "Original Apple Pencil work, no stock and no AI. Recovered from a retired site and re-collected here: animals on one wall, geometric motifs on the other. Page through them."
- **Blog cross-link** `assets/entries/uid-gbw-103.json`: insert a bold `project_link` flow block → `https://generative-horoscopes.august.style/` right after the `"Automating 100+ Weekly Blog Posts"` h5 (`flow[]`, ~`:225`).

### 1F. Homepage Bleed Images Component section (NOT "homepage gallery"; gallery = the entry layout)
- New `<section id="art-gallery">` in `index.html` between `:79` `#featured-tiles` and `:82` `#process` (insert on the blank line `:80`), with extra top/bottom padding (topic shift — breathing room).
- `renderArtGallery(projects, content)` in `assets/js/landing-controller.js`, called in `loadHomepage()` between `renderFeaturedTiles()` (`:37`) and `renderProcess()` (`:38`). Reuse the entry bleed visual (a row or two); pull images across entries that carry the gallery placement; **shuffle each reload**; image click → `/<slug>/` (entry).
- Config block in `homepage-content.json`: `{ "art_gallery": { "heading": "<optional>", "cap": 12, "placement": "Art Gallery" } }`.
- **Tag combo:** the section pulls **only gallery-layout entries that have a bleed component.** `"Art Gallery"` placement already marks them; that is the selector (no new tag needed — confirm in build that every gallery entry carries `placement:["Art Gallery"]`).
- **`renderArtGallery()` shape** (concrete; render-tune the row count/markup on dev): `const cfg = content.art_gallery || {}; const gal = projects.filter(p => (p.placement||[]).includes(cfg.placement || 'Art Gallery')); const imgs = gal.flatMap(p => (p.collection_images || p.thumb || []).map(src => ({src, slug: p.slug}))); shuffle(imgs); const picked = imgs.slice(0, cfg.cap || 12);` → build a `.entry-bleed`-style row(s); each image links to `/${slug}/`. (`shuffle` = Fisher-Yates; if pulling per-collection images isn't readily available on the project object, fall back to the entry `thumb[]`.)

---

# PART 2 — Feedback batch

### 2G. Phase A/B/C narrative-spine copy (kill redundancy, playful human voice, strip em-dashes)
Source: `homepage-content.json` `narrative_spine` (`:15–30`); render: `landing-controller.js renderNarrativeSpine()` (`:125–163`), currently emits `<span class="spine-section__heading-prefix">${label} is</span> <em class="spine-section__heading-accent">${heading}</em>`. The redundancy = small label "Phase A" + heading prefix "Phase A is". **Fix:** keep the small `.spine-section__label` ("Phase A"), and change the render to drop the `"${label} is"` prefix, emitting a **plain lead + script accent** from two new JSON keys (`heading_lead` + `heading_accent`).
- Render change (`:~150`): replace the prefix+accent emission with `<span class="spine-section__heading-prefix">${phase.heading_lead}</span> <em class="spine-section__heading-accent">${phase.heading_accent}</em>` (drop the literal " is").
- JSON rewrite (`narrative_spine`):
  - **phase_a**: `heading_lead:"Talk about a solid"`, `heading_accent:"Foundation"`, body: `"Before AI, I learned the part of the job that doesn't change. A two-person social team at PETA, pioneering the visual-first playbook the industry adopted years later. Then independent, running every part of the work for my own clients. The foundation everything else is built on."`
  - **phase_b**: `heading_lead:"Fixated on creating"`, `heading_accent:"Generative Automations"`, body: `"When the first GPT shipped, I stopped doing almost anything else and learned. The answer turned out to be pipelines: structured data, connective tissue, a writer, an artist, a surface. Then I built one and let it run."`
  - **phase_c**: `heading_lead:"Now we all about"`, `heading_accent:"Custom AI Solutions"` (intentional grammar — keep), body: `"Most companies roll out AI as another tool slotted on top of how they already work. The real value is in rebuilding the work itself: custom pipelines wired into the AI your team is already using. No new tool, no Zapier rats-nest, no new vendor."`
  - (All three bodies now em-dash-free.)
- Update the JSON and `renderNarrativeSpine()` **together** (the render currently reads `phase.heading` + a literal " is"). Confirmed: no other code reads `narrative_spine.*.heading`, and `homepage-content.json` is not schema-validated — so no validator change and no hidden break.
- **Doc impact**: narrative_spine schema gains `heading_lead`/`heading_accent` (replaces `heading`).

### 2H. Footer overhaul (both variants, every page)
For BOTH footer markups (`.footer-icons` in `index.html:131–139`; `.social-links--footer` in `section.html`/`entry.html`/`collection.html`/`media.html`):
- **Behance fix (corrected root cause):** `behance-logo-black.svg` is **NOT referenced anywhere** (grep clean) — a red herring; the footer Behance marks are already inline `<svg>`. The real distortion (see `assets/docs/archive/images/v4-behance-icon-distortion.jpg`): the inline "Bē" wordmark renders cramped/heavier than the clean GitHub/LinkedIn/Email siblings — a wide wordmark crowding its 24×24 square. **Fix:** in BOTH footer variants, on every page, replace the Behance inline `<svg>` with a clean **square-proportioned** 24×24 Behance glyph (standard social-icon-set "Bē", centered with padding so it isn't stretched), matched to the siblings' weight. Verify on dev it reads consistent.
- **Add icons** (square 24×24 inline SVGs): **Instagram** `https://www.instagram.com/seanivore/`, **Threads** `https://www.threads.com/@seanivore`, **X/Twitter** `https://x.com/seanivore`, **Telegram** `https://t.me/seanivore`. (entry.html already has Instagram — dedupe, keep one.) Order: GitHub · LinkedIn · Behance · Instagram · Threads · X · Telegram · Email. Siblings currently mix outline (GitHub/Email) + filled (LinkedIn/Behance) — pick ONE consistent monochrome treatment for the whole row (render-tune on dev).
- **Email unify (ALL pages):** `mailto:horvathaugust@gmail.com` appears in multiple places — the index footer AND interior pages' nav + footer (`entry.html:41` nav + `:181` footer; `section.html:39` nav + `:94` footer; check `collection.html`/`media.html`). Change every one to `mailto:sean@august.style`. Confirm with `grep -rn horvathaugust@gmail.com` → zero hits after.
- **Contact hub:** show the email as **visible, copyable text** in the footer (not just an icon) so it never dead-ends (ties to 2I mailto fallback). A `.footer-email` line with the address + a copy affordance.
- **Spacing:** the `/section` + entry footers have too little gap between the icon row and the © line. Increase it (styles.css `.social-links--footer` — add `margin-bottom`/`gap`). The index footer uses `.footer-icons{margin-bottom:16px}` (landing.css:614) — bump to match the corrected look.
- **Copyright:** `© 2026` → `© 2026-27` in every footer (`index.html:138` `.footer-copy`; `entry.html:188`, `section.html:100`, + `collection.html`/`media.html` `.text-center.text-secondary`). Confirm with `grep -rn '2026 Sean'`.

### 2I. Hero + nav fixes (`index.html` hero `:28–73`, landing.css)
- **`+contact` readability:** the hero scrim (`.hero-cyberpunk__blur`, landing.css:691–702) covers only the **left 50%**; `+contact` (top-right) sits over the bright raw video. Add a `.hero-cyberpunk__scrim` div: `position:absolute; inset:0; background:rgba(0,0,0,0.18); pointer-events:none;` placed **immediately after the `<video>` in the DOM** and ABOVE the video but BELOW the left blur/names/nav (give those higher z-index; the scrim sits at the video's layer, after it). This tints the raw right half so `+contact` reads, WITHOUT darkening the frosted left half (which would muddy the AUGUST/HORVATH contrast). Concrete default 0.18; render-tune on dev — "just a touch", far lighter than mobile's `rgba(37,36,36,0.73)`.
- **`+work` link** (`index.html:38`): `href="#featured-tiles"` → `href="/section.html"`.
- **EXPLORE column reshuffle** (`.hero-cyberpunk__cta-row`, `index.html:62–71`; CSS landing.css:891–933): currently "explore the work →" (`.hero-cyberpunk__cta`) sits left, the 3 social bullets (`.hero-cyberpunk__socials`) right. Sean wants the **3 bullets left-aligned** and **"EXPLORE THE WORK →" at the bottom-right** (≈ where the 50% blur ends). **Reorder the HTML so `.hero-cyberpunk__socials` comes BEFORE `.hero-cyberpunk__cta`** (CSS alone can't reorder; children are vertical flex columns). Then `.hero-cyberpunk__cta-row{display:flex; flex-wrap:nowrap; width:50%; justify-content:space-between; align-items:flex-end;}` → socials pinned left, CTA bottom-right at the blur edge. Concrete default; verify tablet (no wrap) + mobile (stacks) on dev.
- **mailto fallback** (empty-tab on desktop with no mail handler): add one delegated handler (in `landing-controller.js` for home + the shared site script for other pages): `document.addEventListener('click', e => { const a = e.target.closest('a[href^="mailto:"]'); if(!a) return; const email = a.getAttribute('href').replace(/^mailto:/,'').split('?')[0]; if(navigator.clipboard?.writeText){ navigator.clipboard.writeText(email).then(()=>showToast('Email copied: '+email)).catch(()=>{}); } });` plus a tiny `showToast()` (fixed-position div, fade out ~2s) + its CSS. The `mailto:` still fires for users with a handler; those who get an empty tab still leave with the address copied. Guard `navigator.clipboard` (older Safari / non-secure contexts) — if absent, mailto behaves unchanged. (Boring/documented: clipboard API + mailto, no fragile success-detection.)
- **Non-homepage header contact** → point the header "contact" on `section.html`/`entry.html`/etc. to the **homepage footer contact hub** (`/index.html#footer`) instead of a bare mailto, so all contact methods (email + messaging icons) are present.

### 2J. Final homepage CTA copy (de-theme, broaden, kill AI-tells)
Source: `homepage-content.json cta_section` (`:140–145`); render keys unchanged (`renderCTASection()` `:411–439`). Replace values:
- `heading`: `"AI is reshaping creative work. Let's make it work for you."`
- `body`: `"Brand and graphic design, web development, or a custom AI pipeline wired into how your team already works. I help people adapt to a fast-moving landscape and ship work that actually lands."`
- `primary`: `{ "text": "Let's talk", "href": "mailto:sean@august.style" }` (gets the 2I clipboard fallback).
- `secondary`: `{ "text": "See all the work", "href": "/section.html" }` (Phase-C ghost retired per Sean — plenty of other Phase-C buttons exist).
- (No em-dashes; broadened beyond AI so design/dev prospects feel addressed.)

### 2K. Achievements — prune 4 + rewrite for gut-check
`renderAchievements()` (`landing-controller.js:329–390`) pulls EVERY entry's `achievements[]`, unfiltered. Edit these 4 entry JSONs:
- **`uid-frm-102.json`** — REMOVE the achievement objects "Original audience-data-first influencer growth offering" and "Hand-drawn iPad UI as the deliverable". REWRITE remaining headline:
  - "Testimonials page averaged 14 minutes of session time" → **"Visitors averaged 14 minutes on one testimonials page."** (details unchanged)
- **`uid-gbw-103.json`** — REMOVE "Multi-AI script orchestration before NotebookLM" and "Hand-drawn Lottie animations across an AI-content site". REWRITE remaining headlines:
  - "100+ weekly blog posts auto-generated end-to-end" → **"200+ blog posts auto-generated every week, end to end."** (Sean: it's 200)
  - "68 AI-voiced podcast episodes — 800+ listens, 27 hours played" → **"A 68-episode AI-voiced podcast, shipped before NotebookLM existed."** (move "800+ listens, 27 hours played" into details)
  - "Original brand artwork on every page, no stock imagery" → **"Every single page hand-illustrated, zero stock imagery."**
- **`uid-pva-101.json`** — REWRITE all headlines (make the WIN explicit, decode acronyms, keep proof in details):
  - "#1 engagement rate for nonprofits on Facebook (Q3)" → **"Took PETA to #1 for engagement among all nonprofits on Facebook (Q3)."**
  - "Tofucken — 1B+ video views, NTEN Do Gooder Finalist" → **"Tofucken, the cursing vegan grandma, passed 1B+ video views."**
  - "1st Place NTEN Do Gooder 'Funny For Good' Award — Beyond Words" → **"1st place national award for a wordless film that hit 40M+ views."** (NTEN/Beyond Words → details)
  - "4.5M consumer actions from the 'Britches' campaign" → **"A single rescue story drove 4.5 million consumer actions."** (add PRNewsPro coverage to details)
  - "#AskSeaWorld hijack named a culture-defining backfire" → **"Hijacked SeaWorld's own #AskSeaWorld and sank their campaign."**
- **`uid-vin-427.json`** — REWRITE the lone achievement (tie to the new Phase C entry):
  - "End-to-End Freelance Automation" → **"A client payment portal that runs on $0 of infrastructure."** details: "Contract signing, invoicing, split Stripe payments, and document downloads, all from JSON files in Git. No database, no server."
- All rewrites are drafts; Sean reviews on dev. Apply `.agent/EMOTION_DRIVEN_COPYWRITING.md` gut-check lens.

### 2L. Related-post tag-pill width (`styles.css`)
`.tile-tags` (`styles.css:501–507`) is a **sibling** of `.tile-text-area` appended to `.tile` (`tile-renderer.js renderSectionTile()`), so on `.grid-related` (where `.tile-text-area{width:60%}`, `:783–790`) the pills span the full tile and overrun the text column. **Fix:** constrain the related-posts pill row to the text column width while keeping horizontal scroll:
```css
@media (min-width: 48rem) {
  .grid-related .tile-tags { width: 60%; }
}
```
(Concrete default matching `.tile-text-area`'s 60%; render-tune on dev so pills hide on L/R sooner, mirroring `/section`.)

### 2M. `project_link` flow block + button CSS (entry pages)
- `entry-controller.js buildFlowBlock()` switch (`:538`; existing cases h3/h4/h5/p/img/list/chunk_break/embed_html/collection_preview): add `case 'project_link':` → an inline-placeable `<a class="project-link-btn" href="${block.url}">${block.text}</a>`; support a ghost variant via `{"variant":"ghost"}` → `.project-link-btn--ghost`. Shape: `{"type":"project_link","url":"…","text":"…","variant":"<optional 'ghost'>"}`.
- **Author button CSS in `styles.css`** (entry pages load `styles.css`, NOT `landing.css` — `.btn-primary`/`.btn-ghost` do not exist here). Concrete starter (reuses the vars `.project-link-card` already uses — `--color-accent`, `--color-text-primary`, `--color-border`, `--space-*`, `--duration-fast`, `--easing`; confirm a fill/text-contrast token on dev):
```css
.project-link-btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--space-xs);padding:var(--space-sm) var(--space-md);background:var(--color-accent);color:var(--color-bg-tile);font-weight:600;border-radius:0.25rem;text-decoration:none;transition:transform var(--duration-fast) var(--easing),background var(--duration-fast) var(--easing);}
.project-link-btn:hover{transform:translateY(-1px);}
.project-link-btn--ghost{background:transparent;color:var(--color-text-primary);border:0.0625rem solid var(--color-border);}
.project-link-btn--ghost:hover{border-color:var(--color-accent);}
```
Restyle legacy `.project-link-card`/`.github-repo-card` (`styles.css:1644–1665`) to match this fresh aesthetic.

### 2N. `video` flow block (paired desktop/mobile MP4 row) — NEW component
Needed by the freelance-payments entry; no video block exists today.
- `entry-controller.js buildFlowBlock()` (`:538`): add `case 'video':` → a row holding desktop + mobile MP4s, each `<video autoplay muted loop playsinline preload="metadata">` (GIF-like, no controls). Shape: `{"type":"video","desktop":"<cdn url>","mobile":"<cdn url>","caption":"…","alt":"…"}`. Render an optional caption line.
- `styles.css` — concrete (render-tune the equal-height behavior on dev so the wide desktop sits next to the skinny mobile at one row height):
```css
.flow-video-row{display:flex;align-items:stretch;gap:var(--space-sm);margin-block:var(--space-xl);}
.flow-video-row video{height:auto;width:auto;max-height:70vh;display:block;border-radius:0.25rem;}
.flow-video-caption{margin-top:var(--space-xs);color:var(--color-text-secondary);font-size:var(--font-size-sm);}
@media (max-width:44.9375rem){.flow-video-row{flex-direction:column;align-items:center;} .flow-video-row video{width:100%;height:auto;}}
```
- **Accessibility:** the videos are muted/decorative GIF-like loops — keep `playsinline muted loop autoplay` for iOS, but honor `prefers-reduced-motion` (a `@media (prefers-reduced-motion: reduce)` rule, or rely on the site-wide reduced-motion handling if present; do not autoplay if reduced motion is requested).
- **Doc impact**: `AUGUST_STYLE.md` flow-block catalog + `_entry_template.json` flow examples gain `project_link` + `video`.

### 2O. NEW Phase C entry — freelance-payments-platform (PRIORITY)
`assets/entries/uid-vin-427.json` is currently schema 6.1, `layout:"columns"`, slug `freelance-payments-platform`. Convert to the lean flow shape:
- **Media to CDN (old method — videos skip Cloudinary):**
  ```bash
  aws s3 sync assets/.media/freelance-payments-platform/ s3://portfolio/media/freelance-payments-platform/ \
    --endpoint-url https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com --profile r2 \
    --exclude "*.mov" --exclude ".DS_Store"
  ```
  Uploads the 8 step MP4s (`vid-freelance-payment-platform-{1..4}-{1=desktop,2=mobile}.mp4`) + the 6 `thumb-freelance-payments-platform-{1..6}.webp`. Pre-flight each URL with a browser UA (expect `video/mp4` / `image/webp`).
- **Entry edits:** `layout:"flow"`; `placement:["Phase C"]` (this fills the empty Phase C); fix `thumb[]` to the on-disk `https://cdn.august.style/media/freelance-payments-platform/thumb-freelance-payments-platform-{1..6}.webp` (current JSON points at non-existent `thumb-slides-…`).
- **`flow[]`** (lean, visual-first; 4 video step-rows with Sean's captions + minimal framing):
  1. `h4` "A payment portal that runs on no database at all."
  2. `p` (intro, from README hook): "A freelancer sends a client one login link. From there the client signs a contract, reviews an invoice, and pays, while the whole thing runs on JSON files in Git instead of a database or server."
  3. `video` step 1 — caption: "After finalizing contract specifics with the client, the AI automation assembles it in our contract template. When it's ready they're emailed a login keyword they pair with their name to make their first payment." (`desktop`=`…/vid-freelance-payment-platform-1-1.mp4`, `mobile`=`…-1-2.mp4`)
  4. `video` step 2 — caption: "They review the contract and securely sign it on the platform. A copy is emailed when it's complete, and they can download one for their records right away." (`…-2-1.mp4` / `…-2-2.mp4`)
  5. `video` step 3 — caption: "Their invoice loads for review before they continue to pay." (`…-3-1.mp4` / `…-3-2.mp4`)
  6. `video` step 4 — caption: "Payment completes through secure, well-known Stripe." (`…-4-1.mp4` / `…-4-2.mp4`)
  7. `p` (close, Sean): "That's it. When the project is done they get one more email if there's a balance to settle."
  8. `p` (supporting, from README, sparingly): "Under the hood: React, TypeScript, and Vite on the front; Stripe Checkout for payments; PDFs generated from templates; and Vercel serverless plus GitHub Actions doing the back-office work. Treating each job as a single JSON file in Git means version history, an audit trail, and zero database cost."
  9. `project_link` → GitHub: `{"type":"project_link","url":"https://github.com/seanivore/freelance-payments","text":"See the product on GitHub"}`
  10. `project_link` (ghost) → live portal: `{"type":"project_link","url":"https://payments.august.style/","text":"Open the live portal","variant":"ghost"}`
- **AI-assisted framing (resolved):** the established term is **"AI-assisted development"** — explicitly the deliberate, in-control counterpart to "vibe coding." Bake it in once as a short final `p` (after block 8, before the buttons): "Built through AI-assisted development: paired with AI the whole way, with every architectural decision made deliberately, not vibe-coded."
- Keep `achievements[]` = the rewritten 2K headline. Drop the columns-only fields not used by flow (the YouTube `media_url`/`media_embed`, `challenge`/`approach`/`result`, `tiles`, `main_media`, `grids`, `process`, `metric`).

---

# PART 3 — Ship + docs

### 3P. Validate, build, smoke-test, ship
- `python3 generate_manifest.py` → `python3 assets/scripts/validate.py` (clean) → **Claude-in-Chrome** smoke test on the dev preview, **desktop + mobile** (dev SSO is off): Phase C links resolve to the freelance-payments entry (videos loop, desktop+mobile row clean, both buttons work); gallery entry + nested collection pages render in order with the shared lightbox (arrows + keyboard + swipe) on both; homepage bleed section between featured-tiles and process, reshuffles; hero `+contact` readable, mailto copies + toasts, `+work`→/section, EXPLORE column reshuffled; footers show new icons with correct spacing + undistorted Behance + © 2026-27; achievements pruned + punchier; CTA broad + human; related-post pills behave like `/section`; blog post shows the inline `generative-horoscopes` button.
- Commit as work progresses (Sean granted push-to-dev). Sean reviews assembled on dev → ff `dev`→`design-360` + tag `v4.4.x`.

### 3Q. Reference-doc pass (line-by-line audit; code = source of truth)
After ship: line-by-line accuracy audit of `assets/docs/AUGUST_STYLE.md`, `assets/docs/ENTRY_SOP.md`, `README.md` — correct pre-existing drift too, not just the additions. Document: `/api/upload` endpoint (with the **video fallback** — videos still use the manual `aws s3 sync` method until the endpoint handles video); URL-array collections (schema 6.1); `gallery` layout; nested collection URLs; shared lightbox; `project_link` + `video` flow blocks; homepage bleed section. **Also** add Sean's entry writing guidelines to `ENTRY_SOP.md` + project memory (block below), cross-referencing `.agent/EMOTION_DRIVEN_COPYWRITING.md`:
> Don't get lost in the technicals. Speak to the non-technical reader who could be a potential client. Showcase the technical using household-name services as the best-practice proof. Don't fall into AI-hype bias; humbly describe impressive work that speaks for itself. Show numbers visually and show UI flow visually — the things people can't picture on their own. In the end they don't want to read, they want to understand by scrolling and scanning. Hold workflow and method until the end.
> Core aim of this update: recreate entries so the whole portfolio is quickly digestible in one sitting. Visual, little text, scroll scroll scroll.

## Deferred (NOT this batch)
- **v4.5.0** — refresh entry/collection/section aesthetics to match the fresh homepage. Galleries + this batch ship on current templates; the art + content carry the weight.
- Per-phase video/motion-design angle copy + the FEATURED TILES rework — Sean is reworking those himself; draft help only on request.
- Upload endpoint: video support + role-aware thumbnail cropping (future).
