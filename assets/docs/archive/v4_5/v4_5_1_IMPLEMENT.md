# v4.5.1 — IMPLEMENT (starter)

> **Status: starter / scoping doc**, not a final byte-accurate build guide. It captures the two pieces deferred out of v4.5.0: (1) MP4/video on *every* layout, and (2) expanding the upload endpoint to role-based variants. Expand each section into a full anchored build guide in the next planning pass.

## Context

v4.5.0 made MP4 playback **modular and JSON-driven** for the `flow` and `columns` layouts — the renderer reads settings from the JSON instead of hardcoding them, so future entries just carry the settings. v4.5.1 finishes the job: the *same* model on the remaining layouts (gallery / collection / homepage), plus the upload endpoint that produces the media. Goal throughout: **nothing hardcoded per-entry** — an author hands off an MP4 with instructions ("looping, silent, autoplay" or "play button + sound"), the agent drops the CDN URL + settings into the JSON, and it just works.

---

## 1. MP4 / video on every layout

### 1a. Already shipped in v4.5.0 (the baseline to extend)

In `assets/js/entry-controller.js` there are now three small helpers — the single source of truth for video rendering:

- `isVideoURL(url)` → `/\.mp4(\?|$)/i` (extend here if we add webm/mov).
- `resolveVideoSettings(block)` → reads optional JSON booleans into flags.
- `buildVideoEl(url, settings, alt, className)` → builds the `<video>`, attaches a play-on-scroll IntersectionObserver for ambient clips.

**The MP4 variable set (all optional, JSON-driven):**

| field         | default                                          | effect                                                           |
| ------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| `loop`        | `true`                                           | `<video loop>`                                                   |
| `muted`       | `true`                                           | `<video muted>` — required for autoplay                          |
| `autoplay`    | `true`                                           | autoplays (only effective when muted; sound-autoplay is blocked) |
| `controls`    | `false` (auto-`true` if the clip won't autoplay) | native player chrome (play button, scrubber, volume)             |
| `playsinline` | `true`                                           | inline playback on iOS (no fullscreen takeover)                  |

- **Omit everything → ambient muted loop** (a lighter GIF; play-on-scroll). This is the common case.
- **`muted: false` → a player**: autoplay turns off and `controls` turns on automatically, so the visitor presses play and hears sound. (Set `loop: false` too for a one-shot clip.)

**Where the settings live per layout (the JSON contract):**

- `flow` `video` block: settings inline on the block. Use `src` for a single clip, or `desktop` + `mobile` for an art-directed pair (rendered side by side). ✓ done.
- `columns` `main_media`: an `.mp4` URL in `images[]` renders as `<video>`; the optional per-group `video: {…}` object carries the settings. ✓ done.

### 1b. The remaining work — extend to gallery / collection / homepage

The helpers exist but the collection/bleed image paths still emit `<img>` only, so an MP4 there breaks. Wire `isVideoURL` + `buildVideoEl` into:

1. **Gallery bleed art-walls** — `entry-controller.js › populateGalleryCollections()`. Each collection image becomes `.entry-bleed__link > img`. Branch on `isVideoURL`: emit a `<video>` instead. The justified row sets `flex-grow` from aspect ratio via `img.naturalWidth/Height` on load — for video use `videoWidth/videoHeight` on the `loadedmetadata` event. Decorative wall → ambient settings.
2. **Collection masonry page** — `collection-controller.js › buildImageTile()`. Branch on `isVideoURL` → `<video class="collection-image-tile">` (the CSS already sizes any block child; add a sibling `video` selector to the `.collection-image-tile` rule). Decide lightbox behavior: the shared lightbox is image-only, so **play videos inline in the masonry and skip lightbox registration** for them (recommended) rather than teaching the lightbox to host `<video>`.
3. **Homepage art-bleed** — `landing-controller.js › renderArtBleed()`. Emits `<img>` per pooled collection image; branch on `isVideoURL` → `<video>`. Add a `video` selector beside `.art-bleed__item img` in `landing.css`. Also refactor the existing hardcoded `feature_tile` `<video>` in `renderFeaturedTiles()` onto the shared helper for consistency (it's already ambient — cosmetic).

### 1c. Prerequisite: extract the helpers to a shared module

`resolveVideoSettings` / `buildVideoEl` / `isVideoURL` currently live in `entry-controller.js`, which is **not** loaded on the homepage or collection page. Move them into a shared file loaded by `entry.html`, `collection.html`, AND `index.html` — e.g. a new `assets/js/video-util.js`, or fold into `assets/js/data-loader.js` (already shared everywhere). One implementation, no copies. Do this first; steps 1–3 depend on it.

### 1d. Open question for Sean — settings on collection videos

Collection `images[]` is a flat array of URL strings, so there's no place to hang per-video settings for gallery/collection/homepage videos. Two routes:
- **Option A (recommended): ambient-only for collection videos.** The walls and masonry are decorative; a player-with-sound isn't a "wall" use case. Zero schema change.
- **Option B: allow `{ "src": "…mp4", …settings }` objects mixed into `images[]`.** Full flexibility, but it's a schema change touching the collection template, the validator, `resolveCollectionImages()`, and every consumer (gallery wall, masonry, homepage bleed).

Default to A unless a real "collection clip needs sound" case shows up.

### 1e. Validation + docs (part of this version)

- `validate.py`: a `video` flow block must have `src` OR `desktop`; `loop`/`muted`/`autoplay`/`controls`/`playsinline` must be booleans if present; a `main_media` group's `video` must be an object of those booleans.
- **Rename `ENTRY_SOP.md` → `NEW_CONTENT_SOP.md`** (agent-facing) and document: the full video variable set + per-layout placement; entry AND collection authoring; the upload endpoint contract (§2). This is the SOP rewrite Sean asked for — do it once the video model is final across all layouts.
- **Deprecate GIFs in favor of MP4** in the SOP (MP4 is dramatically smaller for the same loop).

---

## 2. Upload endpoint — role-based variants

Reference implementation: Everlastings' `api/upload.ts` (read in full for v4.5.1 planning). Our `360-design/api/upload.ts` shares its bones (same R2 SDK, signed Cloudinary calls, SSRF guard, Drive-URL rewrite, JSON + multipart intake) but is dumber about *what to do with the file*. The job is to port Everlastings' **role system** so an agent says "this is the thumbnail / hero / a video" and the endpoint produces the right artifact + key, instead of the caller hand-computing the R2 key and size.

### 2a. Current 360-design endpoint (what we have)

Bearer auth (`UPLOAD_API_KEY`); JSON by-URL or multipart; **caller supplies the full R2 key** (must live under `media/`); one uniform Cloudinary transform (cap ~2400×2400, preserve aspect → WebP); `image/svg+xml` passes through; `video/mp4` (and `skip_transform=true`) skip Cloudinary and go straight to R2; 25 MB cap; returns `{ ok, url, key }`.

**Gaps vs. the variant model:** no `role` concept (the caller decides the size + key); one transform for all images; no thumbnail crop; single file only; MP4 only skips Cloudinary if the caller remembers `skip_transform` (should be automatic on a `video/*` mime); GIF not accepted at all (fine — we're going MP4-only anyway).

### 2b. Everlastings model (the spec to mirror)

**Request** — `POST`, Bearer (`PRODUCT_API_KEY`) *or* a Supabase JWT (admin UI). Two intakes:
- JSON by-URL: `{ url, slug, role, skip_transform? }` (the agent/GPT path; `url` is a public https link, Drive share URLs auto-rewritten to direct-download).
- Multipart: `{ file, slug, role, skip_transform? }`.
- Batch (chat-attach): `{ openaiFileIdRefs[], slug, roles? }` — images only; positional default `hero`, then `gallery-0i`.

**Role system (the core idea).** `role` is validated against a fixed pattern, lands in the R2 key, and selects the transform. Everlastings' roles: `hero`, `thumbnail`, `gallery-01…15`, `detail-01…05`, `video-01…05`, `gif-01…05` (retiring), `checkout_image`, `seo_thumbnail`.

| role                                        | aspect | width | format | notes           |
| ------------------------------------------- | ------ | ----- | ------ | --------------- |
| `thumbnail`                                 | 4:5    | 600   | webp   | small portrait  |
| `hero` / `gallery-*` / `detail-*` (default) | 4:5    | 1200  | webp   | portrait        |
| `seo_thumbnail`                             | 1.91:1 | 1200  | webp   | OG/Twitter card |
| `checkout_image`                            | 1:1    | 600   | webp   | square (Stripe) |

Cloudinary transform string: `c_fill,ar_{ar},w_{w},f_webp,q_auto,g_auto` (`g_auto` = smart-crop focal point). Images route: signed Cloudinary upload → fetch the transform URL → download the WebP → put to R2 → destroy from Cloudinary (free-tier cleanup, non-fatal).

**Video / GIF / `skip_transform` → skip Cloudinary entirely**, upload raw bytes to R2 preserving content-type + extension. Detection is mime-based (`file.type.startsWith('video/')`). Limits: 50 MB video / 10 MB image.

**Key + URL:** `products/{slug}/{role}-{slug}.{ext}` (or `test/{slug}/…` when `VERCEL_ENV !== 'production'`); CDN URL = `{R2_PUBLIC_URL}/{key}`. Role in the filename makes every object self-describing.

**Response:** single `{ ok, url, filename }`; batch `{ uploads:[{url,filename,role}], failures:[{index,error}] }` (partial success is success — the agent uses the wins, re-attaches only the failures).

**Guards worth keeping:** SSRF (https-only, reject loopback/private IPs), Drive share→direct rewrite, role-uniqueness within a batch, env-driven `test/` vs `products/` keying, friendly errors when a "share page" returns HTML instead of bytes.

### 2c. The build for 360-design

1. **Define our roles + transforms.** Our media isn't a product catalog — map roles to our actual fields: `thumb` (the 4–7 section-tile slideshow images), `feature` (homepage `feature_tile` video), `main` (columns `main_media`), `flow` (flow images/video), `collection` (gallery `collections[].images[]`), maybe `hero`. Unlike the store, our art is mostly **aspect-preserving** (no fixed crop) — so most roles are "cap width N, `f_webp`, preserve aspect," with `thumb` perhaps a smaller width and the only candidate for a crop. Decide per-role width + whether any role crops. (Open question for Sean — do thumbs want a consistent crop or stay natural?)
2. **Server-compute the key** from `{role}-{slug}` (+ an index for multi, e.g. `thumb-{slug}-3`), instead of trusting a caller-supplied key. Keeps keys consistent and the caller simple.
3. **Auto-skip Cloudinary on `video/*`** (don't require `skip_transform`); preserve `.mp4`; return the URL — so video uploads through the endpoint, retiring hand-run `aws s3 sync`.
4. Keep SSRF + Drive rewrite (already present).
5. **Response:** `{ ok, url, key, role }`; add the batch shape if/when we wire agentic multi-asset entry creation.
6. Bump the per-type caps to match (video 50 MB).

### 2d. Stretch — write the CDN URL straight into the JSON (Sean's idea)

Goal: the agent uploads an asset and the returned URL lands **in the entry/collection JSON it's building**, no hand-copy. Options, simplest first:
- **(a) Agent slots it in.** No endpoint change — the SOP just says "take the returned `url` and put it in field X." Works today; relies on the agent being careful.
- **(b) A small `add_media.py` pipeline helper (recommended).** `add_media.py --json assets/entries/uid-x.json --field flow[3].src --url <cdn>` (or `--field thumb[] --append`) writes the URL into the right field and re-runs the validator. Deterministic, keeps the endpoint **stateless** (good — no repo access in a serverless function), and chains cleanly: `upload → add_media → validate`. This is the clean version of "the endpoint knows where to put it" without coupling the endpoint to the repo.
- **(c) Endpoint writes to the repo.** The function commits/PRs the URL into the JSON. Most "magic," but it couples a stateless upload function to repo write access + git — heavier and riskier; skip unless (b) proves insufficient.

Lands the same outcome Sean described while keeping the upload function pure I/O.

### 2e. Reference files

- `/Users/seanivore/Development/everlastings-website/api/upload.ts` (+ imported `_lib/*` — env, R2 put, Cloudinary sign)
- `/Users/seanivore/Development/everlastings-website/assets/docs/{EVERLASTINGS_STORE,GPT_SETUP,STORE_ADMINISTRATION}.md` (GPT_SETUP has the agent-caller contract)
- Ours: `/Users/seanivore/Development/360-design/api/upload.ts`

---

## 3. Backlog — smaller items (this version or soon after)

1. **Section page: a "Position" filter dropdown.** Add another dropdown to the section filters (`filter-controller.js` / `section-controller.js`) for position. The `company` tag group is currently the only one not exposed as a section dropdown (it's reachable via credential links) — if "Position" means company/employer, this is just adding `company` to the `GROUPS` rendered (it already flows through `getTagsByType`/`getProjectTags`). *Clarify with Sean what "Position" maps to — the company group, the role group surfaced differently, or a new tag.* Likely a 1-dropdown add.

2. **Entry hero slideshow: randomize thumb order each reload.** `entry-controller.js › populateThumbHero()` renders `project.thumb[]` in array order — Fisher-Yates shuffle the array before building the tiles (same shuffle pattern already used in `populateGalleryCollections`). Keeps the first frame fresh on every visit.

3. **Reveal the nav at the bottom of /section and entry pages.** `initNavCollapse()` (duplicated in `entry-controller.js` and `section-controller.js`) hides the nav on scroll-down and restores it on scroll-up — but at the very bottom there's no more up-scroll, so the nav stays hidden. Add: when `window.innerHeight + window.scrollY >= document.body.scrollHeight - <threshold>`, remove `.hide` (show the nav) as if the visitor nudged up. (Consider extracting the shared `initNavCollapse` while here — it's copy-pasted across three controllers.)

4. **Per-collection matte color for the bleed art-walls.** The wall matting is hardcoded `background: var(--terra)` (`.art-bleed__col` in landing.css; `.entry-bleed` in styles.css). Add an optional hex field on the **collection** JSON (e.g. `"matte": "#C9A68A"`):
   - Entry gallery art-wall (`populateGalleryCollections`): set that collection's wall background to `collection.matte || var(--terra)`.
   - Homepage art-bleed (`renderArtBleed`): it pools several collections — **randomly pick one of the pulled collections' `matte` values** for the `.art-bleed__col` background (fallback `--terra`).
   - Add the field to `_collection_template.json` + a hex-format check in `validate.py`. Lets each collection set its own accent, and gives the homepage wall some variety.

## Suggested sequence

Shared video-util extraction (1c) → wire the three layouts (1b) → settings decision (1d) → validation (1e) → upload endpoint (2) → the §3 backlog items (independent, drop in anywhere) → rename + rewrite the SOP (1e) covering the final video model + collection authoring + upload contract. Ship as **v4.5.1**.
