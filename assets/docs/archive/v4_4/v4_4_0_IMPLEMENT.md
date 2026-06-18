# v4.4.0 Implementation Plan — Astrofluenced Art-Deco gallery

**Initiative**: Surface Sean's recovered hand-drawn Art-Deco illustrations as a portfolio gallery — two collections, one gallery entry that showcases both, and a homepage shuffle component. First of several planned art-gallery posts; this establishes the reusable pattern.
**Revision driven by**: initial draft
**Required reading first**: `assets/docs/AUGUST_STYLE.md` · `assets/docs/ENTRY_SOP.md`
**Branch**: `dev` → Preview; ff to `design-360` + tag `v4.4.0` after sign-off.

---

## v4.3.0 note (folded here — no separate v4_3 doc; infra only, no site-content change)

- **Hosting**: GitHub Pages (Jekyll) → **Vercel** (project `design-360`, SEANIVORE account), live on www.august.style. Jekyll permalink routing replicated by `vercel.json` (`cleanUrls` + fallback rewrite `/:slug → /_pages/:slug`; verified URL-for-URL).
- **Two-branch deploy flow**: `dev` → Preview, `design-360` (default/production branch) → Production. Native Vercel git integration, no Actions.
- **New `/api/upload` endpoint** (adapted from everlastings `api/upload.ts`, Supabase auth dropped): source image (by URL or multipart) → Cloudinary `c_limit,w_2400,h_2400,f_webp,q_auto` (preserve size/aspect, only shrink >2400px) → R2 (`@aws-sdk/client-s3`, bucket `portfolio`, public `cdn.august.style`) → signed Cloudinary destroy. Single `UPLOAD_API_KEY` bearer; preview keys namespaced under `media/_preview/`. Files: `api/upload.ts`, `api/_lib/{env,cors}.ts`, `package.json`, `vercel.json`.
- **Env** (7, Production + Preview:dev): `R2_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CLOUDINARY_URL`, `UPLOAD_API_KEY`. Mirrored in gitignored `.env`.
- Reference-doc updates for the endpoint are **bundled into the v4.4.0 doc pass** so AUGUST_STYLE/ENTRY_SOP/README update once.

---

## Source material (staged by Sean)

`assets/.media/illustration-art-deco/` (gitignored), two subdirs = two collections:
- **`animals/`** — 26 pieces, `illustration-art-deco-collection-animals-1.webp` … `-26.webp` (6 are >2400px tall → endpoint downsizes).
- **`motif/`** — 7 pieces, `illustration-art-deco-collection-motif-1.webp` … `-7.webp`.

Filename `1→N` numbering is **intentional layout order** for the collection pages.

## Decisions (proposed — Sean confirms slugs/titles on review)

- **Collections** (slug · title): `art-deco-animals` · "Animals" (26) and `art-deco-motif` · "Motif" (7). `media[]` authored in filename `1→N` order.
- **Entry**: `illustration-art-deco` (flow layout) — the umbrella gallery, featuring BOTH collections via **two bleed components** (one per collection) + **two `collection_preview` blocks**.
- **Items**: `art-deco-animals-1..26`, `art-deco-motif-1..7`. `src` = R2 CDN url. Each gets a **short subject title** (read from the image: e.g. "Mirrored Toucans", "Stalking Tigers", "Deconstructed Parrot") + alt — image-forward, no filler.
- **Tag**: add **"Art Gallery"** to `tags.json` `placement` group; set on the entry. Keep product `"Digital Art Collection"`.
- **Ordering rule (Sean's)**: the full collection PAGE renders `media[]` in filename order (intentional). The entry `collection_preview` strip and the homepage component **shuffle on every reload**.
- **CDN keys** (ENTRY_SOP convention): items → `media/item/<item-slug>.webp`; collection thumbs → `media/collection/<coll-slug>/thumb-<coll-slug>-N.webp`. Upload via `/api/upload` (dogfood the endpoint).

## Build slices

1. **Upload → R2** via `/api/upload` (animals 26 + motif 7; 6 oversized auto-downsized). Pre-flight each CDN url returns 200/image-webp.
2. **`tags.json`**: + `"Art Gallery"` (placement group).
3. **Items**: 33 JSONs from `assets/docs/_item_template.json` (scripted skeletons; titles from image review).
4. **Collections**: 2 JSONs from `_collection_template.json`; `media[]` = item UIDs in numbered order.
5. **Entry**: `illustration-art-deco` flow — short story (the maximalism-moment + the recovery) + 2 `bleed` blocks + 2 `collection_preview` blocks + tags.
6. **Shuffle**: in the `collection_preview` resolve path (`entry-controller.js resolveCollectionPreview()` / `data-loader.js resolveCollectionMedia()`) shuffle the strip on load; homepage component shuffles too. **Do NOT** shuffle `collection-controller.js renderGrid()` (collection page stays ordered).
7. **Homepage component**: new `<section id="art-gallery">` in `index.html` **between `:79` `#featured-tiles` and `:81` `#process`**; new section block in `homepage-content.json`; `renderArtGallery()` in `landing-controller.js` called **between `renderFeaturedTiles()` and `renderProcess()`**. Reuses the `.entry-bleed` visual; pulls images across all `"Art Gallery"`-tagged entries, shuffles each reload, click → `/entry?path=<slug>` (navigate, not lightbox).
8. **Manifest + validate + preview**: `python3 generate_manifest.py` → `python3 assets/scripts/validate.py` → smoke-test on the `dev` Vercel preview.

## Verification (on the dev preview)

- `validate.py` clean; `generate_manifest.py` lists the new entry/collections/items.
- `/collection/art-deco-animals` + `/collection/art-deco-motif` render the grid **in filename order**; tiles click → `/media?path=<item>`.
- `/illustration-art-deco` entry shows both bleed rows + both collection previews (previews **reshuffle** on reload); lightbox works.
- Homepage shows the new gallery section in position; **reshuffles** on reload; clicking an image lands on the correct entry; existing featured-tiles + process unaffected; no console errors.

## Doc updates (deferred — single pass after v4.4.0 ships; task #11)

One bundled update covering BOTH releases:
- **AUGUST_STYLE.md**: `/api/upload` endpoint; "Art Gallery" placement tag; homepage gallery section; collection/gallery page-type as used here.
- **ENTRY_SOP.md**: the `/api/upload` upload path alongside the existing `aws s3 sync` flow.
- **README.md**: Vercel hosting + two-branch flow + the upload endpoint.
- Bump those docs once; update project memory (task #12).
