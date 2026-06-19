# Entry SOP — Authoring Entries, Collections, and Items

**Aligned with**: v4.4.x shipped state
**Last updated**: 2026-06-19
**Schema versions** (verify before authoring): entry 6.1, collection 6.1 (legacy 6.0 still accepted), item 6.0 — see `AUGUST_STYLE.md` § *Schema Version Alignment Check*.

This document is the single procedural reference for authoring the three JSON content types that drive the august.style portfolio: **entries** (project pages), **collections** (curated media sets), and **items** (single media pieces). The agent receives a brief (often a markdown file with prose + media references, sometimes just links and notes) and runs this pipeline end-to-end, including CDN handoff.

For schema definitions and field-by-field reference, see `AUGUST_STYLE.md`. This doc covers *process*, not *schema*.

---

## 1. Overview

The pipeline:

```
Brief (markdown, links, or both)
  -> Choose type (entry / collection / item)
  -> Generate JSON skeleton
  -> Source + process media (Cloudinary)
  -> Upload to R2 CDN
  -> Fill JSON (schema-bound fields)
  -> Validate
  -> Regenerate manifest
  -> Local smoke test
```

All three types share the same shape. Type-specific notes are called out per step.

### Type selection

- **Entry** — a project case study with hero, copy, media. Belongs in `assets/entries/`. One of three layouts: `layout: "columns"` (two-column case study), `layout: "flow"` (typed-block long-form storytelling), or `layout: "gallery"` (two-blurb intro + per-collection bleed preview rows). See § 7 "Authoring each layout" for the per-layout field beats.
- **Collection** — a curated set of media. Belongs in `assets/collections/`. Two shapes: a **6.1 gallery collection** (ordered `images[]` CDN URLs + an `entry` field, browsed at the nested `/<entry>/<coll>` URL — this is what a gallery entry's `collections[]` resolves against) OR a **legacy 6.0 collection** (`media[]` item UIDs, browsed at `/collection/<slug>`). Both validate.
- **Item** — a single media piece (image or short video) referenced by a 6.0 collection's `media[]`. Belongs in `assets/items/`. Free-form tags from `tags.json` `item` group. (6.1 gallery collections do NOT use item files — their imagery is plain CDN URLs.)

If unclear, default to entry. Collections and items are for the Media Collections subsystem and are used when a brief describes a curated set of standalone media pieces rather than a project case study.

### Entry writing guidelines

Before authoring any copy, read these — they set the bar for every entry. Cross-reference `.agent/EMOTION_DRIVEN_COPYWRITING.md` for the deeper craft.

> Don't get lost in the technicals. Speak to the non-technical reader who could be a potential client. Showcase the technical using household-name services as the best-practice proof. Don't fall into AI-hype bias; humbly describe impressive work that speaks for itself. Show numbers visually and show UI flow visually — the things people can't picture on their own. In the end they don't want to read, they want to understand by scrolling and scanning. Hold workflow and method until the end.
>
> Core aim: recreate entries so the whole portfolio is quickly digestible in one sitting. Visual, little text, scroll scroll scroll.

---

## 2. Generate JSON Skeleton

Run the generator from the project root:

```bash
python3 assets/scripts/new_project.py --type entry
python3 assets/scripts/new_project.py --type collection
python3 assets/scripts/new_project.py --type item
```

The script generates a UID (`uid-xxx-###`), stamps the appropriate `_metadata` block, and writes a skeleton to `assets/docs/uid-xxx-###.json`. Move to the correct directory at the end of the pipeline.

The legacy `project` shell command alias is equivalent to `--type entry` for backward compatibility.

Choose a slug (URL-safe, lowercase, hyphenated) and set `"slug"` in the JSON before anything else — the slug is used for the media directory name and CDN paths throughout the pipeline.

---

## 3. Tag the Document

Open `assets/docs/tags.json` and verify the tag values you intend to use exist in the correct group. The six groups are documented in `AUGUST_STYLE.md` § 6.

- **Entries**: set `role`, `skill`, `product`, `company`, `placement` (placement is `[]` unless the entry is a featured-tile candidate).
- **Collections**: set `role`, `skill`, `product`, `company`. No `placement`.
- **Items**: set `tags[]` — this is the only group that is free-form. Add new tag values to `tags.json` `item` array if your brief introduces new ones, but reuse existing values where possible.

Rules:
- Tag values are case-sensitive and must match the registry exactly.
- For pre-locked groups (role, skill, product, company, placement), do not invent values without adding them to `tags.json` first.
- `company` is a single string, not an array.

---

## 4. Source Media

Where the media comes from depends on the brief:

### Brief includes media references at known paths

The brief points to source files at `assets/.media/{slug}/...` (Sean staged them ahead of time). Skip to § 5 — Cloudinary processing.

### Brief includes external sources to capture

The brief lists URLs to screenshot, project pages to download from, or describes assets to compose. Use one of:

- **Browser screenshots** — set viewport before capturing:
  - Desktop: 1440×900
  - Mobile: 390×844
  - Capture meaningful states (loaded data, active interactions, key features)
- **Asset downloads** — pull existing exports from Behance, the live project, or another hosted location
- **Authenticated/gated apps** — log in first or use demo/test credentials. Avoid capturing real PII; use test data or redact. Note access requirements in the entry's `notes` field

Save raw source images to `assets/.media/{slug}/` (gitignored) before processing. Sean's convention is to keep `.media/` as both staging AND personal archive — files persist after CDN upload.

### Brief includes prose only, media TBD

Surface to Sean. The orchestrator does NOT compose media from imagination.

---

## 5. Process Media with Cloudinary

Cloudinary handles resizing, cropping, and format conversion to WebP.

**Cloud name**: `dzrtucxh7`
**Authentication**: API key + secret are in `.env` as `CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@dzrtucxh7`. All API calls use `-u "API_KEY:API_SECRET"` for HTTP basic auth.
**Full API reference**: `assets/docs/entries-prep/CLOUDINARY_IMAGE_API.md`.

For each raw source image:

### Upload

```bash
curl -X POST https://api.cloudinary.com/v1_1/dzrtucxh7/image/upload \
  -u "API_KEY:API_SECRET" \
  -F "file=@/path/to/source.png"
```

The response JSON contains a `public_id` field used in the next step.

### Download transformed versions

Standard transforms by purpose:

```bash
# Thumbnail — landscape 1920×1080 .webp
curl -o "assets/.media/{slug}/thumb-{slug}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1920,h_1080,q_auto,f_webp/v1/{public_id}"

# Square page image — 1080×1080 .webp
curl -o "assets/.media/{slug}/img-sq-{slug}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1080,h_1080,q_auto,f_webp/v1/{public_id}"

# Grid image — 1080×1080 .webp (same as square)
curl -o "assets/.media/{slug}/grid-1-{slug}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1080,h_1080,q_auto,f_webp/v1/{public_id}"

# Bleed image — landscape 2400×1200 .webp
curl -o "assets/.media/{slug}/bleed-1-{slug}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_2400,h_1200,q_auto,f_webp/v1/{public_id}"

# Flow image — flexible, default 1600×1200 .webp
curl -o "assets/.media/{slug}/flow-{slug}-NN.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1600,h_1200,q_auto,f_webp/v1/{public_id}"
```

If the subject crops poorly, add `g_auto` to the transformation chain (`c_fill,g_auto,w_1920,h_1080,q_auto,f_webp`).

### Filename conventions

The numbering scheme used in `assets/.media/{slug}/` mirrors the CDN path. The pattern:

| Purpose                     | Filename                                      | Notes                                                  |
| --------------------------- | --------------------------------------------- | ------------------------------------------------------ |
| Thumbnail                   | `thumb-{slug}-N.webp`                         | N starts at 1                                          |
| Square image                | `img-sq-{slug}-N.webp`                        | N starts at 1                                          |
| Grid group K, image M       | `grid-K-{slug}-M.webp`                        | both 1-indexed                                         |
| Bleed group K, image M      | `bleed-K-{slug}-M.webp`                       | both 1-indexed                                         |
| Bleed slides image N        | `bleed-slide-{slug}-N.webp`                   | single group                                           |
| Main media group K, image M | `main-K-{slug}-M.webp`                        | both 1-indexed                                         |
| Flow asset NN               | `flow-{slug}-NN.webp`                         | two-digit zero-padded, matches phase-draft conventions |
| Feature tile N              | `feature-tile-{slug}-N.mp4`                   | mp4 only                                               |
| Flow video N (desktop/mobile)| `vid-{slug}-N-1.mp4` / `vid-{slug}-N-2.mp4`  | `-1` desktop-wide, `-2` mobile-skinny; mp4 only        |
| Gallery collection image N  | `media/{entry}/{coll}/{coll}-N.webp`          | 6.1 nested under parent entry                          |
| Gallery collection thumb N  | `media/{entry}/{coll}/thumb-{coll}-N.webp`    | 6.1 nested under parent entry                          |
| Legacy collection thumb N   | `media/collection/{slug}/thumb-{slug}-N.webp` | 6.0 standalone collection                              |
| Item source                 | `media/item/{slug}.webp` (or `.mp4`)          | 6.0 item                                               |

For videos (mp4): do not go through Cloudinary. Place at `assets/.media/{slug}/...mp4` directly and proceed to § 6 upload.

### Delete from Cloudinary

After downloading all processed images, delete each source from Cloudinary to stay on the free plan:

```bash
curl -X POST https://api.cloudinary.com/v1_1/dzrtucxh7/image/destroy \
  -u "API_KEY:API_SECRET" \
  -F "public_id={public_id}"
```

---

## 6. Upload to R2 CDN

All processed media must live on the CDN before the JSON references it. Local paths in JSON are never acceptable in committed entries.

There are two upload paths. **Images** go through the `/api/upload` endpoint (which folds in the Cloudinary resize + R2 put + Cloudinary cleanup in one call). **Video** still uses the manual `aws s3 sync` method below — the endpoint accepts mp4 but does NOT transform it, and the manual sync is the established video path.

### Images — `/api/upload` endpoint (preferred)

The endpoint (`api/upload.ts`) takes a source image (by multipart file OR by public URL), shrinks it to fit a 2400×2400 box and converts to WebP via Cloudinary (`c_limit,w_2400,h_2400,f_webp,q_auto` — original aspect ratio preserved, only downsized when larger), PUTs it to R2 at the key you supply, deletes the Cloudinary copy (free-tier hygiene), and returns the public `https://cdn.august.style/<key>` URL.

- **Auth**: `Authorization: Bearer ${UPLOAD_API_KEY}`.
- **Key**: must be a safe relative path under `media/` (e.g. `media/{slug}/bleed-1-{slug}-1.webp`). The endpoint rejects keys outside `media/`, with `..`, `//`, or non-`[a-zA-Z0-9._/-]` characters. After a WebP transform the key's extension is rewritten to `.webp`.
- **Size cap**: 25 MB.
- **Preview deploys** (`isTest`): keys are re-rooted under `media/_preview/` so dev uploads never overwrite production CDN objects.
- **`skip_transform`**: set `true` to bypass Cloudinary and upload the bytes byte-for-byte — use for pre-cropped images you do NOT want resized (e.g. already-sized thumbnails, or transparent PNGs you must keep exact). gif/svg/mp4 pass through byte-for-byte regardless.

Multipart form (local file):

```bash
curl -X POST https://www.august.style/api/upload \
  -H "Authorization: Bearer $UPLOAD_API_KEY" \
  -F "file=@assets/.media/{slug}/bleed-1-{slug}-1.png" \
  -F "key=media/{slug}/bleed-1-{slug}-1.webp"
# -> { "ok": true, "url": "https://cdn.august.style/media/{slug}/bleed-1-{slug}-1.webp", "key": "..." }
```

JSON body (by public https URL — handy when the source is already hosted):

```bash
curl -X POST https://www.august.style/api/upload \
  -H "Authorization: Bearer $UPLOAD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/source.png","key":"media/{slug}/img-sq-{slug}-1.webp"}'
```

Add `"skip_transform": true` (JSON) or `-F "skip_transform=true"` (multipart) to upload without the Cloudinary resize.

For a 6.1 gallery collection, the key is nested under the parent entry: `media/{entry}/{coll}/{coll}-N.webp`.

### Video — manual `aws s3 sync` (the endpoint can't transform video yet)

**R2 endpoint**: `https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com`
**AWS CLI profile**: `r2`

Place mp4 files at `assets/.media/{slug}/...` (skip Cloudinary entirely), then sync the slug directory:

```bash
aws s3 sync assets/.media/{slug}/ s3://portfolio/media/{slug}/ \
  --endpoint-url https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com \
  --profile r2
```

`aws s3 sync` is also the fallback for any bulk image upload if the endpoint is unavailable. For legacy 6.0 collections, use `s3://portfolio/media/collection/{slug}/`; for items, `s3://portfolio/media/item/`; for 6.1 gallery collection imagery, `s3://portfolio/media/{entry}/{coll}/`.

### Pre-flight verify

For every CDN URL the JSON will reference, confirm the URL returns HTTP 200 with the right content-type:

```bash
curl -I https://cdn.august.style/media/{slug}/thumb-{slug}-1.webp
# Expect: HTTP/2 200, content-type: image/webp

curl -I https://cdn.august.style/media/{slug}/feature-tile-{slug}-1.mp4
# Expect: HTTP/2 200, content-type: video/mp4
```

If any URL 404s after upload: the sync failed for that file. Re-run the sync. If still 404, surface to Sean.

---

## 7. Fill JSON

Reference `AUGUST_STYLE.md` § 2 (entries), § 3 (collections), § 4 (items) for the full field list. Highlights:

### All types

- `id`: matches filename (format `uid-xxx-###`).
- `slug`: URL-safe, lowercase, hyphenated.
- `title`, `subtitle`: display text.
- `seo_title` (50–60 chars), `seo_description` (150–160 chars).
- `thumb[]`: CDN URLs (full `https://cdn.august.style/...`).
- `thumb_alt`: alt text.

### Entries — type-specific

- `role`, `skill`, `product`, `company`: per § 3 of this doc.
- `placement`: `[]` by default. For homepage-featured entries: `["Featured", "Phase A" or "Phase B" or "Phase C"]`.
- `feature_tile`: `[]` by default. For featured entries: `["https://cdn.august.style/media/{slug}/feature-tile-{slug}-1.mp4"]`.
- `tile_alt`: alt text for the feature-tile video.
- `layout`: `"columns"`, `"flow"`, or `"gallery"`.
- `achievements[]`: array of `{ headline, details }` objects. Optional; populates the homepage Achievements section if non-empty.

### Entries — columns layout

Use when the brief describes a single project with traditional case-study sections. Fields:

- `img[]`, `img_alt`: square page images (3 typical).
- `main_media[]`: array of grouped media blocks (each block has `title`, `images[]`, `alt`).
- `grids[]`: array of 3-across grid blocks.
- `bleed[]`, `bleed_slides`: full-bleed components.
- `challenge`, `approach`, `result`: 2–4 sentences each.
- `tiles[]`: short scannable lines for the section page tile.

### Entries — flow layout

Use when the brief is long-form storytelling with mixed media types. The freelance-payments-platform entry (`assets/entries/uid-vin-427.json`) is a good worked example — it chains four `video` blocks and two `project_link` blocks. Fields:

- `flow[]`: typed-block array (see `AUGUST_STYLE.md` § 2a for the full block-type catalog).
- All optional case-study fields (challenge/approach/result/tiles) are skipped — the flow handles narrative pacing.

Convert markdown briefs to flow blocks:

| Brief form                                    | Flow block                                                                                                                             |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `### Heading`                                 | `{ "type": "h3", "text": "Heading" }`                                                                                                  |
| `#### Heading`                                | `{ "type": "h4", ... }`                                                                                                                |
| `##### Heading`                               | `{ "type": "h5", ... }`                                                                                                                |
| Paragraph                                     | `{ "type": "p", "text": "..." }`                                                                                                       |
| Image (one or more)                           | `{ "type": "img", "images": [...], "alt": "..." }`                                                                                     |
| Bulleted list                                 | `{ "type": "list", "items": [...], "style": "bluepoints" }`                                                                            |
| HTML block (tweet / YouTube / Behance iframe) | `{ "type": "embed_html", "html": "...", "alt": "..." }` — copy HTML verbatim, escape double quotes for JSON, preserve `&amp;` entities |
| `**chunk_break**` marker                      | `{ "type": "chunk_break", "button_text": "Continue reading" }`                                                                         |
| Collection preview                            | `{ "type": "collection_preview", "collection": "collection-slug" }` (resolves a legacy 6.0 collection)                                 |
| CTA / link button                             | `{ "type": "project_link", "url": "...", "text": "...", "variant": "ghost" }` — right-aligned stacked button; omit `variant` for filled, `"ghost"` for outline; external URLs open in a new tab |
| Paired desktop+mobile video                   | `{ "type": "video", "desktop": "<cdn mp4>", "mobile": "<cdn mp4>", "caption": "...", "alt": "..." }` — GIF-style muted/looping/autoplay row; either url may be omitted; `caption`/`alt` optional |

### Entries — gallery layout

Use for an image-forward art/collection showcase: a short intro plus walls of pictures grouped into collections. The illustration-art-deco entry (`assets/entries/uid-iad-101.json`) is the worked example. Fields:

- `challenge`: the gallery's intro paragraph — rendered under an **"About"** label.
- `approach`: the medium / process note — rendered under a **"Details"** label.
- `result`: leave **empty** — the gallery layout hides it.
- `collections[]`: bare collection slugs (e.g. `["animals", "motif"]`). Each renders one bleed-style preview row (first 8 images) linking to the nested `/<entry>/<coll>` URL. Each slug must have a matching 6.1 gallery collection file whose `entry` field equals this entry's slug.
- `origin_url` / `origin_url_text`: optional "see where this lived" link.
- A gallery entry may carry `main_media` / `grids` / `bleed` / `bleed_slides` (the columns shell renders them), but its `flow[]` is NOT rendered in gallery layout.
- Set `placement: ["Art Gallery"]` to also feed this entry's imagery into the homepage art-bleed wall.

### Collections — type-specific

**6.1 gallery collection** (nested under a parent entry — the common case for new galleries):
- `entry`: the parent entry's slug. Drives the nested `/<entry>/<coll>` URL and the manifest key.
- `images[]`: ordered CDN URLs (NOT item UIDs). No item files needed.

**Legacy 6.0 collection** (standalone, UID-referenced):
- `media[]`: array of item UIDs (strings like `"uid-itm-001"`). Items must exist in `assets/items/` first; the validator cross-references.

### Items — type-specific

- `media_type`: `"image"` or `"video"`.
- `src`: full CDN URL to the single media piece.
- `tags[]`: free-form values; add to `tags.json` `item` group as you go.

### Authoring each layout — don't-miss beats

A quick checklist so a layout never ships half-formed:

- **columns** — fill `challenge` + `approach` + `result` (2–4 sentences each); add media via `main_media` / `grids` / `bleed` / `bleed_slides`; `tiles[]` for the section-tile lines; tags live in the sticky right column (top/bottom tag cards auto-hide).
- **flow** — author the whole story as `flow[]` blocks; skip challenge/approach/result/tiles. Use `video` blocks (paired desktop/mobile mp4) to show UI in motion and `project_link` blocks for CTAs. Lead visual, land the workflow/method last. Tags render as top + bottom cards.
- **gallery** — put the intro in `challenge` (shows as "About") and the medium note in `approach` (shows as "Details"); leave `result` empty; list collections in `collections[]`; create one 6.1 gallery collection file per slug with `entry` set to this entry's slug; add `placement: ["Art Gallery"]` to feed the homepage art wall.

### YouTube / Behance embeds (columns or flow)

For projects with a YouTube walkthrough or Behance gallery in the columns layout, set:

```json
"media_url": "https://youtu.be/VIDEO_ID",
"media_embed": "<iframe width='560' height='315' src='https://www.youtube.com/embed/VIDEO_ID?si=SHARE_TOKEN&amp;controls=0' title='Descriptive title' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>",
"media_alt": "Description of what the video shows"
```

Rules:
- Single quotes for HTML attributes (JSON string requirement).
- Keep `&amp;` entity encoding; never raw `&`.
- `title` attribute is descriptive, not "YouTube video player".
- For Behance: `src` is `https://www.behance.net/embed/project/GALLERY_NUMBER?ilo0=1`.

In flow layouts, embed iframes go in an `embed_html` flow block, not `media_embed`.

### Locked company values

The `company` field must be one of:

- `"Freelance"`
- `"Silent Labs"`
- `"SEANIVORE GROUP LLC"`
- `"PETA, Inc."`

---

## 8. Validate

Move the JSON from `assets/docs/` to its destination directory:

```bash
mv assets/docs/uid-xxx-###.json assets/entries/      # for entries
mv assets/docs/uid-xxx-###.json assets/collections/  # for collections
mv assets/docs/uid-xxx-###.json assets/items/        # for items
```

Run the validator:

```bash
python3 assets/scripts/validate.py
```

The validator checks:
- Required fields present and non-empty (entries: includes `layout`; collections: `media[]` for 6.0 / `images[]` for 6.1).
- `schema_version` correctness — entry must be `6.1`, collection `6.0` OR `6.1`, item `6.0`.
- `layout` is one of `columns` / `flow` / `gallery`.
- Tag values (role / skill / product / placement) exist in `tags.json` (except `item` tags, which are free-form).
- Locked `company` value.
- Every `flow[]` block's `type` is a known block type (h3/h4/h5/p/img/list/chunk_break/embed_html/collection_preview/project_link/video).
- Structural shape of `grids[]` / `achievements[]` / `metric` / `process[]` where present.
- Cross-references for 6.0 collections (every UID in `media[]` exists in `assets/items/`).
- Cross-references for entries (every collection slug referenced in a `collection_preview` flow block exists in `assets/collections/`).
- No duplicate slugs across entries, collections, and items.

(Note: it does NOT validate CDN URL format — pre-flight those manually per § 6.)

Fix every reported error before proceeding. The validator's job is to ensure orchestrators downstream see only consistent data.

---

## 9. Regenerate Manifest

```bash
python3 generate_manifest.py
```

This:
- Updates `assets/js/manifest.json` with the new slug → JSON path mapping. 6.1 gallery collections (those with an `entry` field) are keyed by the nested path `<entry>/<coll>`; legacy 6.0 collections and everything else are keyed by bare slug.
- Generates the per-slug HTML at `_pages/{slug}.html` (entry), `_pages/{entry}/{coll}.html` (6.1 gallery collection) or `_pages/collection-{slug}.html` (legacy 6.0 collection), or `_pages/media-{slug}.html` (item) — with SEO meta tags baked in from the JSON's `seo_title` / `seo_description` / `thumb[0]` (or `src` for items).

Confirm the new slug appears in the manifest output.

---

## 10. Local Smoke Test

Start the local dev server:

```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

Visit the new content:

```
Entry:      http://localhost:5500/entry.html?path={slug}
Collection: http://localhost:5500/collection.html?path={slug}     (6.1 gallery: ?path={entry}/{coll})
Item:       http://localhost:5500/media.html?path={slug}
```

Verify:
- Page renders without console errors.
- All media loads (no broken images / videos — including flow `video` blocks autoplaying muted).
- Tags link correctly to section pages.
- Lightbox opens on click (entries).
- Layout shape is correct (columns / flow / gallery for entries).
- Gallery layout: copy column shows "About" + "Details" (no result); each `collections[]` row renders and links to `/{entry}/{coll}`.
- Flow `project_link` buttons point to the right URLs (external ones open in a new tab).

If anything fails, fix locally before opening a PR.

---

## Quick reference checklist

1. Generate skeleton: `python3 assets/scripts/new_project.py --type {entry|collection|item}`.
2. Choose slug; set in JSON.
3. Tag the document per `tags.json`.
4. Stage source media at `assets/.media/{slug}/` (entries) or `assets/.media/collection/{slug}/` (collections) or `assets/.media/item/` (items).
5. Process media via Cloudinary (resize, crop, webp) — § 5.
6. Upload to R2 — images via `POST /api/upload` (Cloudinary→R2 in one call), video via `aws s3 sync` with profile `r2` — § 6.
7. Pre-flight every CDN URL the JSON will reference (HTTP 200 + correct content-type).
8. Fill JSON — § 7.
9. Move to destination directory; validate: `python3 assets/scripts/validate.py`.
10. Regenerate manifest: `python3 generate_manifest.py`.
11. Local smoke test at `localhost:5500`.
12. Commit.

**Backlog**: `assets/docs/entries-prep/ENTRY_BACKLOG.md` (if present) tracks projects awaiting entry creation.
