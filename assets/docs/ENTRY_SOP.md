# Standard Operating Procedure: Creating Project Entry JSON Files

Schema version: 5.0

---

## 1. Create the Entry File

**Option A (recommended):** Run the generator script from the project root:

```
python assets/scripts/new_project.py
```

This calls the `uid` CLI tool to generate a unique ID (format `uid-xxx-###`), stamps the v5.0 metadata, and writes a new file to `assets/docs/`. You then move the completed file to `assets/entries/`.

**Option B:** Copy the template manually:

```
cp assets/docs/_entry_template.json assets/entries/uid-xxx-###.json
```

Replace `uid-xxx-###` with a unique ID. Update the `"id"` field inside the file to match the filename.

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

| Field | Type | Notes |
|---|---|---|
| `id` | string | Format: `uid-xxx-###` |
| `slug` | string | URL-safe, lowercase, hyphenated |
| `title` | string | Display title for the project |
| `subtitle` | string | One-line tagline |
| `seo_title` | string | 50-60 characters |
| `seo_description` | string | 150-160 characters |
| `role` | array | At least one value from `tags.json` |
| `skill` | array | At least one value from `tags.json` |
| `product` | array | At least one value from `tags.json` |
| `company` | string | One of the four locked values (see below) |
| `thumb` | array | At least one thumbnail path |
| `thumb_alt` | string | Alt text for thumbnail slideshow |
| `img` | array | At least one image path |
| `img_alt` | string | Alt text for square images |
| `tiles` | array | 2-4 short display lines |
| `challenge` | string | 2-4 sentences |
| `approach` | string | 2-4 sentences |
| `result` | string | 2-4 sentences |

---

## 5. Locked Company Values

The `company` field must be exactly one of these four values:

- `"Freelance"`
- `"Silent Labs"`
- `"SEANIVORE GROUP LLC"`
- `"PETA, Inc."`

The validator will reject any other value.

---

## 6. Image and Media File Paths

Thumbnail and image files go in a directory named after the slug:

```
assets/media/{slug}/thumb-slides-{slug}-1.webp
assets/media/{slug}/img-sq-slides-{slug}-1.webp
```

The validator checks that every path listed in `thumb` and `img` actually exists on disk. Make sure the files are in place before running validation.

Optional media fields (`mobile_img`, `media_url`, `media_embed`) can be left empty if not applicable.

---

## 7. Optional Structured Fields

These fields default to `null`. Only populate them when the project warrants it.

**`process`** -- Array of exactly 3 steps. Each step requires:
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
4. Prepare media files in `assets/media/{slug}/`.
5. Move the completed JSON file to `assets/entries/`.
6. Run `python assets/scripts/validate_v5.py` -- fix any errors.
7. Run `python generate_manifest.py` -- confirm the new slug appears.
8. If needed, review `assets/js/homepage-content.json` to ensure tag filters will surface the entry in the right sections.
