# Standard Operating Procedure: Creating Project Entry JSON Files

**Updated**: 2026-03-29
**JSON Schema**: v5.0

---

## 1. Determine Slug and Create Entry File

Run the generator script from the project root:

```bash
python3 assets/scripts/new_project.py
```

This generates a unique ID (format `uid-xxx-###`), stamps v5.0 metadata, and writes a new file to `assets/docs/`. You will move the completed file to `assets/entries/` at the end.

The custom `project` command does the same thing:

```bash
project
# Created project file: assets/docs/uid-std-018.json
# Entry ID: uid-std-018
```

Choose a slug for the project (URL-safe, lowercase, hyphenated). Set the `"slug"` field in the JSON.

---

## 2. Create Image Directory

Create the image working directory using the slug:

```bash
mkdir -p assets/images/{slug}
```

This directory is gitignored. All processed images go here before CDN upload.

---

## 3. Source Images

Every entry needs:
- **4-6 thumbnails** (landscape, 1920x1080px)
- **3 square images** (1080x1080px)

### Where to get source images

**From project pages**: Download screenshots or exports from the live project, Behance gallery, or other hosted location.

**From screenshots**: Use browser dev tools or browser automation to set viewport before capturing:
- Desktop: 1440x900
- Mobile: 390x844
- Capture meaningful states (loaded data, active interactions, key features)

**Authenticated or gated apps**: If the project requires login (payment portals, admin dashboards, etc.), log in first or use demo/test credentials. Avoid capturing real PII — use test data or redact sensitive content. Note any access requirements in the entry's `notes` field.

Save raw source images anywhere temporarily. They will be processed through Cloudinary in the next step.

---

## 4. Process Images with Cloudinary

Cloud name: `dzrtucxh7`

### Authentication

Cloudinary API calls require authentication. Credentials are in the project `.env` file as `CLOUDINARY_URL`:

```
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@dzrtucxh7
```

Extract the API key and secret from this URL. All upload and destroy calls must use `-u "API_KEY:API_SECRET"` for HTTP basic auth.

### Step 1 — Upload source image

```bash
curl -X POST https://api.cloudinary.com/v1_1/dzrtucxh7/image/upload \
  -u "API_KEY:API_SECRET" \
  -F "file=@/path/to/source-image.png"
```

The response JSON contains a `public_id` field. Use this in the next step.

### Step 2 — Download transformed image

For each source image, download the processed version directly:

```bash
# Thumbnail (1920x1080 landscape .webp)
curl -o "assets/images/{slug}/thumb-slides-{slug}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1920,h_1080,q_auto,f_webp/v1/{public_id}"

# Square image (1080x1080 .webp)
curl -o "assets/images/{slug}/img-sq-slides-{slug}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1080,h_1080,q_auto,f_webp/v1/{public_id}"
```

If the subject gets cropped poorly, add gravity detection:

```bash
curl -o "assets/images/{slug}/thumb-slides-{slug}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,g_auto,w_1920,h_1080,q_auto,f_webp/v1/{public_id}"
```

Increment the number suffix for each image: `-1.webp`, `-2.webp`, `-3.webp`, etc.

### Step 3 — Delete from Cloudinary

After downloading all processed images, delete the source from Cloudinary. This is required to stay on the free plan.

```bash
curl -X POST https://api.cloudinary.com/v1_1/dzrtucxh7/image/destroy \
  -u "API_KEY:API_SECRET" \
  -F "public_id={public_id}"
```

Repeat steps 1-3 for every source image until all thumbnails and square images are ready.

Full API reference: `assets/docs/entries-prep/CLOUDINARY_IMAGE_API.md`

---

## 5. Upload to R2 CDN

All images must be hosted on the CDN. Local paths are not acceptable.

### Upload the slug directory

```bash
aws s3 sync assets/images/{slug}/ s3://portfolio/media/{slug}/ \
  --endpoint-url https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com \
  --profile r2
```

### Verify the URLs load

Test at least one thumbnail and one square image in a browser:

```
https://cdn.august.style/media/{slug}/thumb-slides-{slug}-1.webp
https://cdn.august.style/media/{slug}/img-sq-slides-{slug}-1.webp
```

Both should return HTTP 200 with `content-type: image/webp`.

---

## 6. Check Tags

Before filling in `role`, `skill`, `product`, or `company`, open the tag registry:

```
assets/docs/tags.json
```

**Rules:**
- Use only tags that already exist in the registry. Do not invent new tags or create near-duplicates (e.g., do not add "Web Design" when "Web Developer" exists).
- If a genuinely new tag is needed, add it to `tags.json` first, then reference it.
- Tags are case-sensitive and must match exactly.
- `role`, `skill`, and `product` are arrays — include at least one value in each.

---

## 7. Fill Out JSON Entry

### Image paths — use CDN URLs

```json
"thumb": [
  "https://cdn.august.style/media/{slug}/thumb-slides-{slug}-1.webp",
  "https://cdn.august.style/media/{slug}/thumb-slides-{slug}-2.webp",
  "https://cdn.august.style/media/{slug}/thumb-slides-{slug}-3.webp",
  "https://cdn.august.style/media/{slug}/thumb-slides-{slug}-4.webp"
],
"img": [
  "https://cdn.august.style/media/{slug}/img-sq-slides-{slug}-1.webp",
  "https://cdn.august.style/media/{slug}/img-sq-slides-{slug}-2.webp",
  "https://cdn.august.style/media/{slug}/img-sq-slides-{slug}-3.webp"
]
```

### Required fields checklist

| Field             | Type   | Notes                                     |
| ----------------- | ------ | ----------------------------------------- |
| `id`              | string | Format: `uid-xxx-###`                     |
| `slug`            | string | URL-safe, lowercase, hyphenated           |
| `title`           | string | Display title for the project             |
| `subtitle`        | string | One-line tagline                          |
| `seo_title`       | string | 50-60 characters                          |
| `seo_description` | string | 150-160 characters                        |
| `role`            | array  | At least one value from `tags.json`       |
| `skill`           | array  | At least one value from `tags.json`       |
| `product`         | array  | At least one value from `tags.json`       |
| `company`         | string | One of the four locked values (see below) |
| `thumb`           | array  | 4-6 CDN URLs (landscape thumbnails)       |
| `thumb_alt`       | string | Alt text for thumbnail slideshow          |
| `img`             | array  | Exactly 3 CDN URLs (square images)        |
| `img_alt`         | string | Alt text for square images                |
| `tiles`           | array  | 2-4 short display lines                   |
| `challenge`       | string | 2-4 sentences                             |
| `approach`        | string | 2-4 sentences                             |
| `result`          | string | 2-4 sentences                             |

### Locked company values

The `company` field must be exactly one of:

- `"Freelance"`
- `"Silent Labs"`
- `"SEANIVORE GROUP LLC"`
- `"PETA, Inc."`

### Copy field guidelines

**`tiles`** — 2-4 short lines displayed on the project card. Each line is a standalone point, not a full sentence. Think scannable highlights.

**`challenge`** — 2-4 sentences describing the problem or opportunity before work began. No first person.

**`approach`** — 2-4 sentences describing the method or solution. Explain what was done and why.

**`result`** — 2-4 sentences describing the outcome. Focus on what was delivered and its impact. Concrete details over vague claims.

**`role_headline`** — A short role-based headline for the hero flip clock (e.g., "Web Developer", "Creative Director"). Should reflect the entry's primary role.

**`hero_btn_cta`** — CTA button text for hero display (e.g., "See Web Projects").

**`final_cta_text`** — Bottom CTA section heading (e.g., "Interested in web development?").

**`final_btn_cta`** — Bottom CTA primary button text (e.g., "See All Web Projects").

### Optional structured fields

These default to `null`. Only populate when the project warrants it.

**`process`** — Array of exactly 3 steps. `link_text` and `link_slug` are optional (use empty strings if no related entry exists):
```json
{ "word": "Research", "summary": "Analyzed competitor approaches...", "link_text": "See the analysis", "link_slug": "related-entry-slug" }
```

**`metric`** — Single object:
```json
{ "value": "...", "kpi": "...", "context": "..." }
```

**`achievement`** — Single object:
```json
{ "headline": "...", "details": "..." }
```

### Behance entry pattern

For generative art projects hosted on Behance, set `media_embed` to the iframe (use single quotes for attribute values):

```json
"media_embed": "<iframe src='https://www.behance.net/embed/project/GALLERY_NUMBER?ilo0=1' width='560' height='438' frameborder='0' allow='clipboard-write; fullscreen' allowfullscreen></iframe>"
```

Standard tags for Behance art entries:
```json
"role": ["Graphic Designer", "Creative Director"],
"skill": ["Generative AI", "Art Direction", "Illustration", "Print Design", "Adobe Creative Cloud"],
"product": ["Digital Art Collection", "Art Print"],
"company": "Freelance"
```

---

## 8. Validate and Generate Manifest

### Step 1 — Move to entries directory

```bash
mv assets/docs/uid-xxx-###.json assets/entries/
```

### Step 2 — Validate

```bash
python3 assets/scripts/validate_v5.py
```

Fix any reported errors before proceeding. The validator checks: required fields, tag registry membership, locked company values, CDN URL format, and structural integrity of optional fields.

### Step 3 — Regenerate manifest

```bash
python3 generate_manifest.py
```

Confirm the new slug appears in the output.

---

## Quick Reference

1. Run `project` (or `python3 assets/scripts/new_project.py`)
2. Choose slug, set in JSON
3. `mkdir -p assets/images/{slug}`
4. Source images (download or screenshot)
5. Upload to Cloudinary, download transformed, delete from Cloudinary
6. Upload `assets/images/{slug}/` to R2 CDN, verify URLs
7. Check `assets/docs/tags.json` for valid tags
8. Fill out all JSON fields using CDN URLs for images
9. `mv` JSON to `assets/entries/`
10. `python3 assets/scripts/validate_v5.py` — fix errors
11. `python3 generate_manifest.py` — confirm slug appears

**Backlog**: See `assets/docs/entries-prep/ENTRY_BACKLOG.md` for projects awaiting entry creation.
