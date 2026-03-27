# Standard Operating Procedure: Creating Project Entry JSON Files

Schema version: 5.0

---

## 1. Create the Entry File

**Option A (recommended):** Run the generator script from the project root:

  ```bash
  python3 assets/scripts/new_project.py
  ```

  This calls the `uid` CLI tool to generate a unique ID (format `uid-xxx-###`), stamps the v5.0 metadata, and writes a new file to `assets/docs/`. You then move the completed file to `assets/entries/`. We also have created a custom command that runs `assets/scripts/project.sh`. 

  ```bash
  project
  # Created project file: assets/docs/uid-std-018.json
  # Entry ID: uid-std-018
  ```

**Option B:** Copy the template manually:

  ```bash
  cp assets/docs/_entry_template.json assets/entries/uid-xxx-###.json
  ```

  Replace `uid-xxx-###` with a unique ID. Update the `"id"` field inside the file to match the filename. We have created a custom command that provides a unique ID if you run the command `uid`. 

  ```bash
  uid
  # Generated UID: uid-ccn-649
  # Mathematical operations: c(52007)=51984 → c(51984)=51961 → n(51961)=649
  ```

---

## 2. Tag Rules -- Check Before You Write

Before filling in `role`, `skill`, `product`, or `company`, open the tag registry:

  ```
  assets/docs/tags.json
  ```

**Rules:**

  - Use only tags that already exist in the registry. Do not invent new tags or create near-duplicates (e.g., do not add "Web Design" when "Web Developer" exists, or "Photoshop CC" when "Photoshop" exists).
  - If a genuinely new tag is needed, add it to `tags.json` first, then reference it in the entry.
  - Tags are case-sensitive and must match the registry exactly.
  - `role`, `skill`, and `product` are arrays -- include at least one value in each.

---

## 3. Writing Guidelines for Copy Fields

### `tiles` (required, array of strings)

2-4 short lines displayed on the project tile/card. Each line should be a standalone point -- no full sentences needed. Think of these as scannable highlights.

  ```json
  "tiles": [
    "All custom artwork drawn by hand for client",
    "Logo and brand elements reflect personal teaching style",
    "No AI content maintains authentic human touch",
    "Webflow platform enables client content management"
  ]
  ```

### `challenge` (required, string)

2-4 sentences describing the problem or opportunity. Frame it around the situation before the work began -- what needed to be solved, what gap existed, or what the client/project demanded. Avoid first person.

### `approach` (required, string)

2-4 sentences describing the method or solution. Explain what was done and why -- tools used, creative decisions, collaboration dynamics. This is the "how."

### `result` (required, string)

2-4 sentences describing the outcome. Focus on what was delivered, the impact it had, and what it demonstrates about capability. Concrete details are better than vague claims.

### `role_headline` (optional, string or null)

A short, impactful headline used in hero rotation on the homepage. Optional but encouraged for entries that should appear in the hero section. Keep it punchy -- this is display text, not a sentence.

### Other optional copy fields

  - `hero_btn_cta`: Custom CTA button text for hero display (string or null).
  - `final_cta_text`: Closing CTA paragraph on the project page (string or null).
  - `final_btn_cta`: Closing CTA button text (string or null).
  - `skill_summary`: Brief summary of skills applied (string, can be empty).

---

## 4. Required Fields Checklist

Every entry must have all of the following fields populated (non-empty, non-null):

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
| `thumb`           | array  | At least one thumbnail path               |
| `thumb_alt`       | string | Alt text for thumbnail slideshow          |
| `img`             | array  | At least one image path                   |
| `img_alt`         | string | Alt text for square images                |
| `tiles`           | array  | 2-4 short display lines                   |
| `challenge`       | string | 2-4 sentences                             |
| `approach`        | string | 2-4 sentences                             |
| `result`          | string | 2-4 sentences                             |

---

## 5. Locked Company Values

The `company` field must be exactly one of these four values:

- `"Freelance"`
- `"Silent Labs"`
- `"SEANIVORE GROUP LLC"`
- `"PETA, Inc."`

The validator will reject any other value.

---

## 6. Image Preparation & Delivery

Each entry needs two types of images stored in a directory named after the slug.

### File Naming Convention

```
assets/media/{slug}/thumb-slides-{slug}-1.webp   (thumbnail slides, 4-6 per entry)
assets/media/{slug}/img-sq-{slug}-1.webp          (square images, 3 per entry)
```

**Thumbnails**: Landscape orientation, consistent aspect ratio, used in tile galleries.
**Square images**: Square crop, used in hero rotation, creative cards, entry page.

### Image Paths in JSON

Images can use **local paths** or **CDN URLs**:

- Local: `assets/media/{slug}/thumb-slides-{slug}-1.webp`
- CDN: `https://cdn.august.style/media/{slug}/thumb-slides-{slug}-1.webp`

The JS renderers handle both formats automatically (CDN URLs starting with `https://` are used as-is; local paths get a `/` prefix).

### Cloudinary Image Processing

Cloud name: `dzrtucxh7`

**Step 1 — Upload source image:**

```bash
curl -X POST https://api.cloudinary.com/v1_1/dzrtucxh7/image/upload \
  -F "file=@/path/to/source-image.png" \
  -F "upload_preset=ml_default"
```

Or use the Cloudinary Media Library UI to upload.

**Step 2 — Apply transformations via URL:**

Build a delivery URL with transformations. Common patterns:

```
# Thumbnail (landscape, 1920x1080, .webp)
https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1920,h_1080,q_auto,f_webp/v1/{public_id}

# Square image (1080x1080, .webp)
https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1080,h_1080,q_auto,f_webp/v1/{public_id}

# Crop with gravity (auto-detect subject)
https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,g_auto,w_1920,h_1080,q_auto,f_webp/v1/{public_id}
```

Key transformation parameters:
- `c_fill` — crop to fill exact dimensions
- `c_fit` — resize to fit within dimensions
- `g_auto` — auto-detect subject for crop gravity
- `w_1920,h_1080` — thumbnail dimensions (landscape)
- `w_1080,h_1080` — square image dimensions
- `q_auto` — automatic quality optimization
- `f_webp` — convert to .webp format

**Step 3 — Download processed image:**

```bash
# Thumbnail
curl -o "assets/media/{slug}/thumb-slides-{slug}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1920,h_1080,q_auto,f_webp/v1/{public_id}"

# Square image
curl -o "assets/media/{slug}/img-sq-slides-{slug}-1.webp" \
  "https://res.cloudinary.com/dzrtucxh7/image/upload/c_fill,w_1080,h_1080,q_auto,f_webp/v1/{public_id}"
```

**Step 4 — Clean up Cloudinary library** after downloading (optional, keeps storage tidy).

Full API reference: `assets/docs/entries-prep/CLOUDINARY_IMAGE_API.md`

### Screenshots as Source Images

For web apps, dashboards, and tools:
- Use browser dev tools to set viewport (1440x900 for desktop, 390x844 for mobile)
- Capture meaningful states (loaded data, active interactions, key features)
- Process through Cloudinary for consistent sizing and .webp conversion

### Cloudflare R2 CDN Upload (Optional)

Bucket: `portfolio` | Endpoint: `https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com/portfolio`
Custom domain: `cdn.august.style`

**Upload via S3-compatible API** (requires R2 API token with Object Read & Write):

```bash
# Using AWS CLI with custom endpoint
aws s3 cp assets/media/{slug}/thumb-slides-{slug}-1.webp \
  s3://portfolio/media/{slug}/thumb-slides-{slug}-1.webp \
  --endpoint-url https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com \
  --content-type image/webp

# Or upload entire slug directory
aws s3 sync assets/media/{slug}/ \
  s3://portfolio/media/{slug}/ \
  --endpoint-url https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com \
  --content-type image/webp
```

After upload, use CDN URL in the JSON entry:
```json
"thumb": ["https://cdn.august.style/media/{slug}/thumb-slides-{slug}-1.webp"]
```

### Behance Entry Pattern

For generative art projects hosted on Behance, use this embed code template (replace `GALLERY_NUMBER` with the number from the Behance URL):

```
<iframe src='https://www.behance.net/embed/project/GALLERY_NUMBER?ilo0=1' width='560' height='438' frameborder='0' allow='clipboard-write; fullscreen' allowfullscreen></iframe>
```

Note: Use single quotes `'` (not double `"`) around attribute values so the embed works inside JSON strings.

Standard v5.0 fields for Behance art entries:
```json
"role": ["Graphic Designer", "Creative Director"],
"skill": ["Generative AI", "Art Direction", "Illustration", "Print Design", "Adobe Creative Cloud"],
"product": ["Digital Art Collection", "Art Print"],
"company": "Freelance"
```

The validator checks that every path listed in `thumb` and `img` actually exists on disk (for local paths). Make sure the files are in place before running validation.

Optional media fields (`mobile_img`, `media_url`, `media_embed`) can be left empty if not applicable.

---

## 7. Optional Structured Fields

These fields default to `null`. Only populate them when the project warrants it.

**`process`** -- Array of exactly 3 steps. Each step requires these 4 values:
```json
{ "word": "...", "summary": "...", "link_text": "...", "link_slug": "..." }
```

**`metric`** -- Single object requiring:
```json
{ "value": "...", "kpi": "...", "context": "..." }
```

**`achievement`** -- Single object requiring:
```json
{ "headline": "...", "details": "..." }
```

---

## 8. Adding an Entry to the Homepage

If the new project should appear on the homepage, edit:

```
assets/js/homepage-content.json
```

Homepage sections use tag-based filters. The entry will appear in a section if its tags match the section's filter criteria. For example, an entry with `role: ["Web Developer"]` and `skill: ["Webflow"]` will automatically appear in the hero (filtered by "Web Developer") and the Webflow showcase tab (filtered by "Web Developer" + "Webflow").

Review the `filter` objects in each section of `homepage-content.json` to understand which tags drive which sections. No manual entry-by-entry listing is needed -- the system is tag-driven.

---

## 9. Validation and Manifest Generation

After creating or updating an entry, run both scripts from the project root:

**Step 1: Validate the entry.**

```
python assets/scripts/validate_v5.py
```

This checks all entries in `assets/entries/` against the v5.0 schema: required fields, tag registry membership, locked company values, image paths on disk, and structural integrity of optional fields. Fix any reported errors before proceeding.

**Step 2: Regenerate the manifest.**

```
python generate_manifest.py
```

This scans `assets/entries/` and rebuilds `assets/js/manifest.json`, which maps slugs to file paths for the frontend. The manifest must be regenerated any time an entry is added, removed, or has its slug changed.

---

## Quick Reference: Full Workflow

1. Run `python assets/scripts/new_project.py` (or copy template).
2. Open `assets/docs/tags.json` and confirm all tags you plan to use exist.
3. Fill in all required fields per the checklist above.
4. Prepare source images (screenshots, Behance exports, etc.).
5. Process through Cloudinary (crop, resize, .webp conversion).
6. Save to `assets/media/{slug}/` and optionally upload to R2 CDN.
7. Update `thumb` and `img` paths in the JSON entry.
8. Move the completed JSON file to `assets/entries/`.
9. Run `python assets/scripts/validate_v5.py` -- fix any errors.
10. Run `python generate_manifest.py` -- confirm the new slug appears.
11. If needed, review `assets/js/homepage-content.json` to ensure tag filters will surface the entry in the right sections.

**Backlog**: See `assets/docs/entries-prep/ENTRY_BACKLOG.md` for projects awaiting entry creation.
