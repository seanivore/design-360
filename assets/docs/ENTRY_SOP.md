# Entry SOP — Authoring Entries and Collections

> **Proposed rename**: this doc now covers BOTH entries and collections — consider renaming it `CONTENT_SOP.md` (pending the owner's confirmation; file not renamed yet).

**Aligned with**: v4.5.0 shipped state
**Last updated**: 2026-06-22
**Schema versions** (verify before authoring): entry 6.1, collection 6.1 (legacy 6.0 still resolves at runtime). The item subsystem is RETIRED for authoring — see `AUGUST_STYLE.md` § *Schema Version Alignment Check* and § 4.

This document is the single procedural reference for authoring the two JSON content types that drive the august.style portfolio: **entries** (project pages) and **collections** (per-gallery image sets). The agent receives a brief (often a markdown file with prose + media references, sometimes just links and notes) and runs this pipeline end-to-end, including CDN handoff.

For schema definitions and field-by-field reference, see `AUGUST_STYLE.md`. This doc covers *process*, not *schema*.

---

## 1. Overview

The pipeline:

```
Brief (markdown, links, or both)
  -> Choose type (entry / collection)
  -> Generate JSON skeleton
  -> Source + process media (Cloudinary)
  -> Upload to R2 CDN
  -> Fill JSON (schema-bound fields)
  -> Validate
  -> Regenerate manifest
  -> Local smoke test
```

Both types share the same shape. Type-specific notes are called out per step.

### Type selection

- **Entry** — a project case study with hero, copy, media. Belongs in `assets/entries/`. One of four layouts: `layout: "columns"` (case study), `layout: "flow"` (typed-block long-form storytelling), `layout: "gallery"` (about/details intro + one full-bleed art-wall per collection), or `layout: "url"` (a redirect tile — renders as a normal tag-driven tile but the click goes straight to `external_url` in a new tab; **no internal entry page** is rendered). The three case-study layouts share one top zone + one tag model — see § 7 "Authoring each layout" for the per-layout field beats.
- **Collection** — an ordered set of images that belongs to exactly ONE entry (its gallery). An entry can have MANY collections. Belongs in `assets/collections/`. A **6.1 gallery collection** has ordered `images[]` CDN URLs + an `entry` field, is browsed at the nested `/<entry>/<coll>` URL, and — new in v4.5.0 — is also a first-class tile on `/section.html`. See § "Collections" below. (Legacy `media[]`-UID 6.0 collections still resolve at runtime, but are not authored anymore.)

If unclear, default to entry. Author a collection when a gallery entry needs one or more walls of images grouped under it.

> **Items are retired.** Do not create items. `_item_template.json` is deleted and `new_project.py` has no `item` type. 6.1 collections reference imagery directly as CDN URLs in `images[]` — there are no item UID references. (A dormant legacy 6.0 item runtime path still resolves old data.)

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
```

The script generates a UID (`uid-xxx-###`), stamps the appropriate `_metadata` block, and writes a skeleton to `assets/docs/uid-xxx-###.json`. Move to the correct directory at the end of the pipeline.

The legacy `project` shell command alias is equivalent to `--type entry` for backward compatibility.

Choose a slug (URL-safe, lowercase, hyphenated) and set `"slug"` in the JSON before anything else — the slug is used for the media directory name and CDN paths throughout the pipeline.

---

## 3. Tag the Document

Open `assets/docs/tags.json` and verify the tag values you intend to use exist in the correct group. The four groups (`role`, `skill`, `product`, `company`) are documented in `AUGUST_STYLE.md` § 6. (The `placement` and `item` groups were retired in v4.5.0.)

- **Entries**: set `role`, `skill`, `product`, `company`. Set the boolean `featured: true` ONLY if the entry has a `feature_tile[]` you want eligible for the homepage video tile (otherwise `false`). If the entry is an art gallery (has `collections[]`), include the `Art Collection` product tag — it marks the entry as containing collections AND feeds the homepage art-bleed.
- **Collections**: set `role`, `skill`, `product`, `company`, plus `featured` (parity with entries). Collections carry DIFFERENTIATED per-collection Skill tags — see the collection-tagging rule under § "Collections" below.

Rules:
- Tag values are case-sensitive and must match the registry exactly.
- For the pre-locked groups (role, skill, product, company), do not invent values without adding them to `tags.json` first.
- `company` is a single string, not an array.
- The Phase A/B/C concept is now expressed with descriptive tags, not a placement tag: Phase A → skill `Foundation Building`; Phase B → product `Generative Automation`; Phase C → product `Custom AI Solution`.

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

> **Upload mechanics moved to `.agent/CDN_MEDIA_UPLOAD.md`** (cross-project, synced via `filemgmt`): the `/api/upload` endpoint, the direct `aws s3` video path, key rules, and the bot-protection verify. This section keeps only the entry/collection-specific processing — the per-purpose Cloudinary transform sizes and the filename conventions below.

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

# Main media image — 1080×1080 .webp (columns layout)
curl -o "assets/.media/{slug}/main-1-{slug}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1080,h_1080,q_auto,f_webp/v1/{public_id}"

# Flow image — flexible, default 1600×1200 .webp
curl -o "assets/.media/{slug}/flow-{slug}-NN.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1600,h_1200,q_auto,f_webp/v1/{public_id}"

# Gallery collection image — keep the source aspect ratio; the art-wall
# justifies by aspect, so do NOT crop to a fixed box. Use c_limit, not c_fill.
curl -o "assets/.media/{entry}/{coll}/{coll}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_limit,w_2400,h_2400,q_auto,f_webp/v1/{public_id}"
```

If the subject crops poorly, add `g_auto` to the transformation chain (`c_fill,g_auto,w_1920,h_1080,q_auto,f_webp`).

### Filename conventions

The numbering scheme used in `assets/.media/{slug}/` mirrors the CDN path. The pattern:

| Purpose                       | Filename                                    | Notes                                                  |
| ----------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| Thumbnail                     | `thumb-{slug}-N.webp`                       | N starts at 1                                          |
| Main media group K, image M   | `main-K-{slug}-M.webp`                      | both 1-indexed (columns layout)                        |
| Flow asset NN                 | `flow-{slug}-NN.webp`                       | two-digit zero-padded, matches phase-draft conventions |
| Feature tile N                | `feature-tile-{slug}-N.mp4`                 | mp4 only                                               |
| Flow video N (desktop/mobile) | `vid-{slug}-N-1.mp4` / `vid-{slug}-N-2.mp4` | `-1` desktop-wide, `-2` mobile-skinny; mp4 only        |
| Gallery collection image N    | `media/{entry}/{coll}/{coll}-N.webp`        | 6.1 nested under parent entry                          |
| Gallery collection thumb N    | `media/{entry}/{coll}/thumb-{coll}-N.webp`  | 6.1 nested under parent entry                          |

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

All processed media must live on the CDN before the JSON references it — local paths in JSON are never acceptable in committed entries.

**The upload mechanics live in `.agent/CDN_MEDIA_UPLOAD.md`** (cross-project, synced via `filemgmt`): images via `POST /api/upload` (Cloudinary→R2 in one call, output WebP, key extension rewritten to `.webp`), video via `aws s3 cp`/`sync` with profile `r2`, the 25 MB cap, key rules, `skip_transform`, preview re-rooting, and the browser-User-Agent pre-flight verify. Read that doc for the exact commands. Only the entry/collection-specific bits stay here:

### Entry/collection key paths

- **Entry media**: `media/{slug}/{name}.webp` — e.g. `media/{slug}/main-1-{slug}-1.webp`, `media/{slug}/thumb-{slug}-1.webp`.
- **Feature-tile / flow video** (mp4, no transform): `media/{slug}/feature-tile-{slug}-1.mp4`, `media/{slug}/vid-{slug}-N-1.mp4`.
- **6.1 gallery collection** (nested under the parent entry): `media/{entry}/{coll}/{coll}-N.webp` and `media/{entry}/{coll}/thumb-{coll}-N.webp`. `aws s3 sync` of the finished collection folder is the handy bulk path here.

### Pre-flight verify

For every CDN URL the JSON will reference, confirm HTTP 200 + correct content-type — using a **browser User-Agent** (a header-less `curl -I` returns 403 even for valid objects on `cdn.august.style`; see the `.agent/` doc for the exact command). If a URL 404s after upload the put failed: re-upload that key; if it still 404s, surface to Sean.

> **Future:** the `/api/upload` endpoint will likely be upgraded — often from this repo — to handle all media types and transform variables (including video), as a client project on the same architecture already does. When that lands, `.agent/CDN_MEDIA_UPLOAD.md` is the source of truth — update this pointer.

---

## 7. Fill JSON

Reference `AUGUST_STYLE.md` § 2 (entries) and § 3 (collections) for the full field list. Highlights:

### All types

- `id`: matches filename (format `uid-xxx-###`).
- `slug`: URL-safe, lowercase, hyphenated.
- `title`, `subtitle`: display text.
- `seo_title` (50–60 chars), `seo_description` (150–160 chars).
- `thumb[]`: CDN URLs (full `https://cdn.august.style/...`).
- `thumb_alt`: alt text.

### Entries — type-specific

- `role`, `skill`, `product`, `company`: per § 3 of this doc.
- `featured`: boolean. `true` ONLY if the entry has a `feature_tile[]` you want eligible for the homepage video tile; otherwise `false`.
- `feature_tile`: `[]` by default. For featured entries: `["https://cdn.august.style/media/{slug}/feature-tile-{slug}-1.mp4"]`.
- `tile_alt`: alt text for the feature-tile video.
- `layout`: `"columns"`, `"flow"`, `"gallery"`, or `"url"`.
- `external_url`: required for `layout: "url"` only — the absolute URL the tile/image links open (new tab). Ignored by the other layouts.
- `achievements[]`: array of `{ headline, details }` objects. Optional; populates the homepage Achievements section if non-empty.

### Entries — columns layout

Use when the brief describes a single project with traditional case-study sections. Fields:

- `main_media[]`: array of grouped media blocks (each block has `title`, `images[]`, `alt`). This is the columns layout's only on-page media field — the old `img` / `grids` / `bleed` / `bleed_slides` / `slideshows` fields were removed in v4.5.0.
- `challenge`, `approach`, `result`: 2–4 sentences each.
- `tiles[]`: short scannable lines for the section page tile.

### Entries — flow layout

Use when the brief is long-form storytelling with mixed media types. The freelance-payments-platform entry (`assets/entries/uid-vin-427.json`) is a good worked example — it chains four `video` blocks and two `project_link` blocks. Fields:

- `flow[]`: typed-block array (see `AUGUST_STYLE.md` § 2a for the full block-type catalog).
- All optional case-study fields (challenge/approach/result/tiles) are skipped — the flow handles narrative pacing.

Convert markdown briefs to flow blocks:

| Brief form                                    | Flow block                                                                                                                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `### Heading`                                 | `{ "type": "h3", "text": "Heading" }`                                                                                                                                                            |
| `#### Heading`                                | `{ "type": "h4", ... }`                                                                                                                                                                          |
| `##### Heading`                               | `{ "type": "h5", ... }`                                                                                                                                                                          |
| Paragraph                                     | `{ "type": "p", "text": "..." }`                                                                                                                                                                 |
| Image (one or more)                           | `{ "type": "img", "images": [...], "alt": "..." }`                                                                                                                                               |
| Bulleted list                                 | `{ "type": "list", "items": [...], "style": "bluepoints" }`                                                                                                                                      |
| HTML block (tweet / YouTube / Behance iframe) | `{ "type": "embed_html", "html": "...", "alt": "..." }` — copy HTML verbatim, escape double quotes for JSON, preserve `&amp;` entities                                                           |
| `**chunk_break**` marker                      | `{ "type": "chunk_break", "button_text": "Continue reading" }`                                                                                                                                   |
| Collection preview                            | `{ "type": "collection_preview", "collection": "collection-slug" }` (resolves a legacy 6.0 collection)                                                                                           |
| CTA / link button                             | `{ "type": "project_link", "url": "...", "text": "...", "variant": "ghost" }` — right-aligned stacked button; omit `variant` for filled, `"ghost"` for outline; external URLs open in a new tab  |
| Paired desktop+mobile video                   | `{ "type": "video", "desktop": "<cdn mp4>", "mobile": "<cdn mp4>", "caption": "...", "alt": "..." }` — GIF-style muted/looping/autoplay row; either url may be omitted; `caption`/`alt` optional |

### Entries — gallery layout

Use for an image-forward art showcase: a short intro plus walls of pictures grouped into collections. The illustration-art-deco entry (`assets/entries/uid-iad-101.json`) is the worked example. Fields:

- `about`: the gallery's intro (1–2 sentences) — rendered under an **"About"** label. (Driven by the dedicated `about` field, NOT `challenge`.)
- `details`: the medium / process note (1–2 sentences) — rendered under a **"Details"** label. (Driven by the dedicated `details` field, NOT `approach`.)
- `collections[]`: bare collection slugs (e.g. `["animals", "motif"]`). EACH renders one full-bleed art-wall — N collections produce N stacked walls — and click-throughs to the nested `/<entry>/<coll>` URL. Each slug must have a matching 6.1 collection file whose `entry` field equals this entry's slug.
- Add the `Art Collection` product tag: it marks the entry as containing collections AND feeds the homepage art-bleed wall.
- `origin_url` / `origin_url_text`: optional "see where this lived" link.
- A gallery entry's `flow[]` is NOT rendered in gallery layout.

### Collections — type-specific

Author a **6.1 collection** (the only authored shape). One collection belongs to exactly one entry; an entry may have many.
- `entry`: the parent entry's slug. Drives the nested `/<entry>/<coll>` URL and the manifest key.
- `images[]`: ordered CDN URLs (NOT item UIDs). No item files needed.
- `role` / `skill` / `product`: per-collection filter tags (see § "Collections" for the differentiated-tag rule).
- `featured`: boolean (parity with entries).
- `thumb[]`: 4–7 representative images that drive the section tile's rotating slideshow.
- `tiles[]`: rotating one-liner labels for the tile.

(Legacy 6.0 `media[]`-UID collections still resolve at runtime, but are not authored.)

### Authoring each layout — don't-miss beats

A quick checklist so a layout never ships half-formed. All three layouts share one top zone (thumb-row hero + title/subtitle + role) and one tag model (role/skill/product pills in the content zone + a bottom "all tags" block).

- **columns** — fill `challenge` + `approach` + `result` (2–4 sentences each); add media via `main_media`; `tiles[]` for the section-tile lines. Tags render in the sticky right column.
- **flow** — author the whole story as `flow[]` blocks; skip challenge/approach/result. Use `video` blocks (paired desktop/mobile mp4) to show UI in motion and `project_link` blocks for CTAs. Lead visual, land the workflow/method last. Tags float as a magazine inset at the top of the reading column.
- **gallery** — put the intro in `about` (shows as "About") and the medium note in `details` (shows as "Details"); list collections in `collections[]`; create one 6.1 collection file per slug with `entry` set to this entry's slug; add the `Art Collection` product tag to feed the homepage art wall. Tags render in the sticky right column.

### YouTube / Behance embeds (columns or flow)

For projects with a YouTube walkthrough or Behance gallery in the columns layout, set:

```json
"media_embed": "<iframe width='560' height='315' src='https://www.youtube.com/embed/VIDEO_ID?si=SHARE_TOKEN&amp;controls=0' title='Descriptive title' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>",
"media_alt": "Description of what the video shows"
```

(`media_url` was removed from the schema in v4.5.0 — use `media_embed` + `media_alt` only.)

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

## 7a. Collections

A **collection** is an ordered set of images that belongs to exactly ONE entry — its parent gallery. An entry can have MANY collections; a collection can belong to only one entry. Worked example: `assets/collections/uid-col-002.json` (the `animals` collection under `illustration-art-deco`).

### What a collection drives

- **The gallery entry's art-walls.** The parent entry lists its collections by bare slug in `collections[]`. EACH collection renders as its own continuous full-bleed art-wall on the entry page (rows of images justified by aspect ratio), and the wall click-throughs to the collection's own page. The wall's images come from the collection's `images[]`.
- **Its own nested page** at `/<entry>/<slug>`, with a breadcrumb (top + bottom) linking back to the parent entry.
- **A first-class tile on `/section.html`** (new in v4.5.0). Collection tiles render identically to entry tiles via the shared tile renderer, and link to `/<entry>/<slug>`.

### The one-entry rule

Set the collection's `entry` field to the parent entry's slug. `generate_manifest.py` keys the collection by the nested path `<entry>/<slug>` and writes its page to `_pages/<entry>/<slug>.html`. The parent entry's `collections[]` carries only bare slugs (e.g. `["animals", "motif"]`); the controller prefixes the entry slug when loading.

### Section-tile fields

Because a collection is now a section tile, give it the same tile-driving fields an entry uses:

- `thumb[]`: 4–7 representative images — these rotate as the tile's slideshow. Pick a spread that reads the collection at a glance.
- `tiles[]`: a few rotating one-liner labels.
- `featured`: boolean (parity with entries).

### Tagging a collection for filtering

Collections carry **DIFFERENTIATED, per-collection Skill tags** — art movements (Art Deco, Bauhaus…) plus cross-movement aesthetic descriptors (Geometric Abstraction, Maximalism, Otherworldly…). They are **NOT** just a copy of the parent entry's tags:

- The **entry's** tags describe the gallery broadly.
- Each **collection** drills down differently, so section-page filtering stays useful as collections scale (a visitor filtering `Geometric Abstraction` should land on the right walls, not the whole gallery).

When the brief doesn't supply collection tags, **review a few of the collection's actual images and propose aesthetic / Skill tags** from `tags.json` (this is a good subagent task). Add any genuinely new descriptor to the `skill` group in `tags.json` first. The `animals` worked example tags `["Art Deco", "Illustration", "Maximalism", "Character Design"]`.

---

## 7b. Flow formatting reference

The `flow[]` array (flow-layout entries; see `AUGUST_STYLE.md` § 2a for the runtime detail) is a typed-block sequence. The renderer walks the array, emits DOM per block type, and skips unknown types with a console warning. Block catalog:

- **`h3` / `h4` / `h5`** — `{ "type": "h3", "text": "…" }`. Heading tiers: `h3` chapter (large bold sans), `h4` section (medium bold sans), `h5` leaf (italic Instrument Serif in terracotta — distinct family so it reads at small size). Map `###` → h3, `####` → h4, `#####` → h5.
- **`p`** — `{ "type": "p", "text": "…" }`. Paragraph, centered, max-width 56rem.
- **`img`** — `{ "type": "img", "images": [...], "alt": "…" }`. Single-image rows constrain to ~60% width; multi-image rows fill. Flow images register into the lightbox pool.
- **`list`** — `{ "type": "list", "items": [...], "style": "bluepoints" }`. Items can be plain strings (leaf bullets) OR nested `{ "text": "Topic", "items": [...] }` for topic-with-sub-bullets. Depth-0 = topic-tier (bolder, terracotta dot, narrower); depth-1 = leaf-tier (smaller, bluepoint sub-bullets). Use the nested shape — don't pack sub-points into a `"Topic — a; b; c"` string.
- **`chunk_break`** — `{ "type": "chunk_break", "button_text": "Continue reading" }`. Progressive-disclosure marker. Reveals on scroll via IntersectionObserver OR on click; when the first one fires, ALL hidden siblings reveal and every chunk-break wrapper is removed (no laddering).
- **`embed_html`** — `{ "type": "embed_html", "html": "<blockquote>…</blockquote>", "alt": "…" }`. Raw HTML embed, centered. Copy the HTML verbatim, escape double quotes for JSON, preserve `&amp;` entities. Twitter `.twitter-tweet` blockquotes auto-load the widgets script; use `data-theme='light'` so they read on the dark site. (Iframes go here in flow layouts — NOT in `media_embed`.)
- **`project_link`** — `{ "type": "project_link", "url": "…", "text": "…", "variant": "ghost" }`. Right-aligned stacked link button. Omit `variant` for the filled style, `"ghost"` for the outline style. Consecutive `project_link` blocks stack and right-align. URLs starting with `http(s)://` open in a new tab; internal `/slug` paths open in place.
- **`video`** — `{ "type": "video", "desktop": "<cdn mp4>", "mobile": "<cdn mp4>", "caption": "…", "alt": "…" }`. A paired desktop-wide + mobile-skinny MP4 row, rendered GIF-style: `muted` / `loop` / `playsinline` / `autoplay`, no controls. `caption` and `alt` optional. Honors `prefers-reduced-motion` (swaps autoplay for `controls`). Either `desktop` or `mobile` may be omitted. These are videos, NOT lightbox images.
- **`collection_preview`** — `{ "type": "collection_preview", "collection": "slug" }`. Horizontal-scroll preview of a legacy 6.0 collection + a "View Full Collection" link. (Legacy support — 6.1 galleries use the `gallery` layout's `collections[]` art-walls instead.)

Conventions:
- Lead visual, hold the workflow/method until the end (per the entry writing guidelines above).
- The freelance-payments-platform entry (`assets/entries/uid-vin-427.json`) chains four `video` blocks + two `project_link` blocks — a good worked example.

---

## 8. Validate

Move the JSON from `assets/docs/` to its destination directory:

```bash
mv assets/docs/uid-xxx-###.json assets/entries/      # for entries
mv assets/docs/uid-xxx-###.json assets/collections/  # for collections
```

Run the validator:

```bash
python3 assets/scripts/validate.py
```

The validator checks:
- Required fields present and non-empty (entries: includes `layout`; collections: `images[]` for 6.1 / `media[]` for legacy 6.0).
- `schema_version` correctness — entry must be `6.1`, collection `6.0` OR `6.1`.
- Entries must NOT carry the fields retired in v4.5.0 (`placement`, `img`, `grids`, `bleed`, `bleed_slides`, `slideshows`, and the dead editorial fields).
- `featured` is a boolean when present.
- `layout` is one of `columns` / `flow` / `gallery`.
- Tag values (role / skill / product) exist in `tags.json`.
- Locked `company` value.
- Every `flow[]` block's `type` is a known block type (h3/h4/h5/p/img/list/chunk_break/embed_html/collection_preview/project_link/video).
- Structural shape of `achievements[]` where present (each `{ headline, details }`).
- Cross-references for legacy 6.0 collections (every UID in `media[]` exists in `assets/items/`).
- Cross-references for entries (every collection slug referenced in a `collection_preview` flow block exists in `assets/collections/`).
- No duplicate slugs across entries and collections.

(Note: it does NOT validate CDN URL format — pre-flight those manually per § 6.)

Fix every reported error before proceeding. The validator's job is to ensure orchestrators downstream see only consistent data.

---

## 9. Regenerate Manifest

```bash
python3 generate_manifest.py
```

This:
- Updates `assets/js/manifest.json` with the new slug → JSON path mapping. 6.1 collections (those with an `entry` field) are keyed by the nested path `<entry>/<coll>`; everything else is keyed by bare slug.
- Generates the per-slug HTML at `_pages/{slug}.html` (entry) or `_pages/{entry}/{coll}.html` (6.1 collection) — with SEO meta tags baked in from the JSON's `seo_title` / `seo_description` / `thumb[0]`. (Legacy 6.0 collection / item pages are still generated for old data.)

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
Collection: http://localhost:5500/collection.html?path={entry}/{coll}
Section:    http://localhost:5500/section.html?type=collection   (collections-only tile pool)
```

Verify:
- Page renders without console errors.
- All media loads (no broken images / videos — including flow `video` blocks autoplaying muted).
- Tags link correctly to section pages; tag pills appear in the right place per layout (sticky column for columns/gallery, magazine inset for flow) plus the bottom "all tags" block.
- Lightbox opens on click (entries; gallery art-wall images are click-through links, not lightbox tiles).
- Layout shape is correct (columns / flow / gallery for entries).
- Gallery layout: copy column shows "About" (`about`) + "Details" (`details`), no result; each `collections[]` slug renders ONE full-bleed art-wall and click-throughs to `/{entry}/{coll}`.
- Collection page: renders its images + a breadcrumb (top + bottom) back to the parent entry.
- Section page: the collection appears as a tile (with its rotating thumbs), and the Projects/Collections content-type selector filters the pool.
- Flow `project_link` buttons point to the right URLs (external ones open in a new tab).

If anything fails, fix locally before opening a PR.

---

## Quick reference checklist

1. Generate skeleton: `python3 assets/scripts/new_project.py --type {entry|collection}`.
2. Choose slug; set in JSON.
3. Tag the document per `tags.json` (role/skill/product/company + `featured` boolean; collections carry differentiated per-collection Skill tags — § 7a).
4. Stage source media at `assets/.media/{slug}/` (entries) or `assets/.media/{entry}/{coll}/` (gallery collections).
5. Process media via Cloudinary (resize, crop, webp) — § 5.
6. Upload to R2 — images via `POST /api/upload` (Cloudinary→R2 in one call), video via `aws s3 sync` with profile `r2` — § 6.
7. Pre-flight every CDN URL the JSON will reference (HTTP 200 + correct content-type).
8. Fill JSON — § 7 (entry/collection fields), § 7a (collections), § 7b (flow blocks).
9. Move to destination directory; validate: `python3 assets/scripts/validate.py`.
10. Regenerate manifest: `python3 generate_manifest.py`.
11. Local smoke test at `localhost:5500`.
12. Commit.

**Backlog**: `assets/docs/entries-prep/ENTRY_BACKLOG.md` (if present) tracks projects awaiting entry creation.
