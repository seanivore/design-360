# Entry SOP — Authoring Entries, Collections, and Items

**Aligned with**: v4.2.3_IMPLEMENT.md
**Last updated**: 2026-05-27
**Schema versions** (verify before authoring): entry 6.1, collection 6.0, item 6.0 — see `AUGUST_STYLE.md` § *Schema Version Alignment Check*.

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

- **Entry** — a project case study with hero, copy, media. Belongs in `assets/entries/`. Has either `layout: "columns"` (traditional two-column case study) or `layout: "flow"` (typed-block long-form storytelling).
- **Collection** — a curated set of media items (e.g., "Logo Marks 2026", "Generative Portraits"). Belongs in `assets/collections/`. References item UIDs in its `media[]` array.
- **Item** — a single media piece (image or short video) that belongs to one or more collections. Belongs in `assets/items/`. Free-form tags from `tags.json` `item` group.

If unclear, default to entry. Collections and items are for the Media Collections subsystem and are used when a brief describes a curated set of standalone media pieces rather than a project case study.

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
| Collection thumb N          | `media/collection/{slug}/thumb-{slug}-N.webp` | different prefix                                       |
| Item source                 | `media/item/{slug}.webp` (or `.mp4`)          | different prefix                                       |

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

**R2 endpoint**: `https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com`
**AWS CLI profile**: `r2`

### Sync the slug directory

```bash
aws s3 sync assets/.media/{slug}/ s3://portfolio/media/{slug}/ \
  --endpoint-url https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com \
  --profile r2
```

For collections, use `s3://portfolio/media/collection/{slug}/`. For items, use `s3://portfolio/media/item/`.

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
- `layout`: `"columns"` or `"flow"`.
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

Use when the brief is long-form storytelling with mixed media types (the three new v4.2.3 showcase entries are examples). Fields:

- `flow[]`: typed-block array (see `AUGUST_STYLE.md` § 2a for the full block-type catalog: h3/h4/h5/p/img/list/chunk_break/embed_html/collection_preview).
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
| Collection preview                            | `{ "type": "collection_preview", "collection": "collection-slug" }`                                                                    |

### Collections — type-specific

- `media[]`: array of item UIDs (strings like `"uid-itm-001"`). Items must exist in `assets/items/` first; the validator cross-references.

### Items — type-specific

- `media_type`: `"image"` or `"video"`.
- `src`: full CDN URL to the single media piece.
- `tags[]`: free-form values; add to `tags.json` `item` group as you go.

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
- Required fields present.
- Tag values exist in `tags.json` (except `item` tags, which are free-form).
- Locked `company` value.
- CDN URL format and `schema_version` correctness.
- Cross-references for collections (every UID in `media[]` exists in `assets/items/`).
- Cross-references for entries (every collection slug referenced in `collection_preview` flow blocks exists in `assets/collections/`).

Fix every reported error before proceeding. The validator's job is to ensure orchestrators downstream see only consistent data.

---

## 9. Regenerate Manifest

```bash
python3 generate_manifest.py
```

This:
- Updates `assets/js/manifest.json` with the new slug → JSON path mapping.
- Generates the per-slug HTML at `_pages/{slug}.html` (entry), `_pages/collection-{slug}.html` (collection), or `_pages/media-{slug}.html` (item) — with SEO meta tags baked in from the JSON's `seo_title` / `seo_description` / `thumb[0]` (or `src` for items).

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
Collection: http://localhost:5500/collection.html?path={slug}
Item:       http://localhost:5500/media.html?path={slug}
```

Verify:
- Page renders without console errors.
- All media loads (no broken images / videos).
- Tags link correctly to section pages.
- Lightbox opens on click (entries).
- Layout shape is correct (columns vs flow for entries).

If anything fails, fix locally before opening a PR.

---

## Quick reference checklist

1. Generate skeleton: `python3 assets/scripts/new_project.py --type {entry|collection|item}`.
2. Choose slug; set in JSON.
3. Tag the document per `tags.json`.
4. Stage source media at `assets/.media/{slug}/` (entries) or `assets/.media/collection/{slug}/` (collections) or `assets/.media/item/` (items).
5. Process media via Cloudinary (resize, crop, webp) — § 5.
6. Upload to R2: `aws s3 sync` against the project endpoint with profile `r2` — § 6.
7. Pre-flight every CDN URL the JSON will reference (HTTP 200 + correct content-type).
8. Fill JSON — § 7.
9. Move to destination directory; validate: `python3 assets/scripts/validate.py`.
10. Regenerate manifest: `python3 generate_manifest.py`.
11. Local smoke test at `localhost:5500`.
12. Commit.

**Backlog**: `assets/docs/entries-prep/ENTRY_BACKLOG.md` (if present) tracks projects awaiting entry creation.
