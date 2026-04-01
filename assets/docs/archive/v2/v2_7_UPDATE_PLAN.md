# v2.7 — Final Polish: Entry Update, _pages Migration, Page Imagery Fix

## Context

v2.6 is complete — 37 entries (including new freelance-payments-platform), SEO pre-rendering via `generate_manifest.py`, homepage polish, SOP tested and improved, documentation updated, product package plan written.

**Three remaining items** before agentic entry creation can begin at scale:

1. The `freelance-payments-platform` entry needs updated images (client PII in current ones) and a YouTube video embed
2. The 37 generated `/{slug}/index.html` directories clutter the project root — need to move them into `_pages/` using Jekyll collections (already configured in `_config.yml`)
3. Entry page "Page Imagery" slideshow has broken images due to a CDN URL path bug

---

## Item 1: Update `freelance-payments-platform` Entry

### 1A. Upload New Images to CDN

**Source**: `assets/.media/freelance-payments-platform/` contains:
- 5 thumbnails: `thumb-slides-freelance-payments-platform-{1-5}.webp`
- 3 square images: `img-sq-slides-freelance-payments-platform-{1-3}.webp`

**Steps**:
1. Copy images to `assets/images/freelance-payments-platform/` (the CDN staging directory)
2. `aws s3 sync` to R2 CDN (overwrites existing images with the new PII-free versions)
3. Verify CDN URLs return HTTP 200

### 1B. Add YouTube Video Embed

**Source**: `assets/.media/freelance-payments-platform/freelance-payments-playform-video-link-and-embed.txt`

YouTube URL: `https://youtu.be/84RtKT3dfDk`

Raw embed from YouTube:
```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/84RtKT3dfDk?si=74w7Yz6IGe98gy52&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
```

**Conversion to site format** (match existing pattern from `uid-dff-987.json`):
- Replace double quotes with single quotes on attribute values
- Keep `&amp;` entity encoding
- Update `title` attribute to describe this specific project

Result for JSON:
```json
"media_url": "https://youtu.be/84RtKT3dfDk",
"media_embed": "<iframe width='560' height='315' src='https://www.youtube.com/embed/84RtKT3dfDk?si=74w7Yz6IGe98gy52&amp;controls=0' title='Freelance Payments Platform Walkthrough' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>",
"media_alt": "Video walkthrough of the freelance payments platform showing the client login, contract signing, and Stripe checkout flow"
```

### 1C. Update Entry JSON

**File**: `assets/entries/uid-vin-427.json`

Changes:
- Update `thumb` array to include 5 URLs (currently 4)
- Update `media_url` from `https://payments.august.style` to `https://youtu.be/84RtKT3dfDk`
- Set `media_embed` to the converted embed code
- Set `media_alt` to descriptive text
- Move the live site URL to `origin_url` and `origin_url_text`

### 1D. Add YouTube Embed Pattern to ENTRY_SOP

**File**: `assets/docs/ENTRY_SOP.md`

Add a new subsection near the existing Behance embed pattern (around line 254). Document:
- The single-quote conversion rule (JSON requires this since the field value uses double quotes)
- The `title` attribute should describe the specific project (not "YouTube video player")
- The `media_alt` field should describe what the video shows
- The `media_url` field gets the YouTube share URL
- Example with the exact format

### Existing Behance Pattern

Already documented at `ENTRY_SOP.md:254-268`. The Behance embed also uses single quotes. The key difference from raw Behance embed: the `src` URL format uses `/embed/project/GALLERY_NUMBER?ilo0=1`. No additional edits needed for the Behance pattern — it's correctly documented.

---

## Item 2: Move Generated HTML to `_pages/` Directory

### Problem

`generate_manifest.py` currently outputs 37 directories at the project root (`/{slug}/index.html`), cluttering the repo. This will only grow as entries are added.

### Solution: Jekyll Collections

The repo's `_config.yml` already configures Jekyll collections:

```yaml
collections:
  pages:
    output: true
    permalink: /:basename/
```

This means files in `_pages/` with Jekyll front matter will be output at `/{basename}/` — exactly the clean URLs we need. GitHub Pages runs Jekyll on this repo (no `.nojekyll` file).

### Implementation

**1. Update `generate_manifest.py`**

Change `generate_entry_html()`:
- Output to `_pages/{slug}.html` instead of `{slug}/index.html`
- Add minimal Jekyll front matter (`---\n---\n`) at the very top of each file
- Update the auto-generated comment
- Remove `clean_stale_entry_dirs()` — replace with `clean_stale_pages()` that manages `_pages/*.html`

Key code change in `generate_entry_html()`:
```python
# Before:
out_dir = project_root / slug
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / 'index.html'

# After:
pages_dir = project_root / '_pages'
pages_dir.mkdir(parents=True, exist_ok=True)
out_file = pages_dir / f'{slug}.html'
```

Front matter addition:
```python
# Add Jekyll front matter before the HTML
page_html = f'---\n---\n{page_html}'
```

Jekyll will:
- See the `_pages` collection with `output: true`
- Process each file with front matter
- Apply `permalink: /:basename/` → output `_site/{slug}/index.html`
- Serve at `https://august.style/{slug}/`

**2. Clean up `clean_stale_entry_dirs()`**

Replace with `clean_stale_pages()`:
```python
def clean_stale_pages(manifest, project_root):
    """Remove _pages/*.html files for slugs no longer in manifest."""
    pages_dir = project_root / '_pages'
    if not pages_dir.exists():
        return 0
    active_slugs = set(manifest.get('entries', {}).keys())
    removed = 0
    for html_file in pages_dir.glob('*.html'):
        slug = html_file.stem
        if slug not in active_slugs:
            html_file.unlink()
            removed += 1
    return removed
```

**3. Delete root-level slug directories**

Remove all 37 `/{slug}/` directories from the project root. These are auto-generated and untracked in git.

**4. Update `.github/workflows/manifest.yml`**

Change `git add */index.html` to `git add _pages/`.

**5. Update `404.html`**

Entry pages are now served by Jekyll from `_pages/`, so 404.html continues to only handle section routes (no changes needed — it was already simplified in v2.6).

**6. Update `entry-controller.js` `getEntryPath()`**

The entry path resolution already strips leading/trailing slashes, so `/freelance-payments-platform/` → `freelance-payments-platform`. This should still work because the entry-controller gets the slug from the URL path, not from the file system. No change needed.

**7. Update documentation**

- `assets/docs/JSON_ARCHITECTURE.md` — update file structure diagram and routing section
- `README.md` — update manifest generation output description
- `ENTRY_SOP.md` — the SOP references `generate_manifest.py` at step 8, no path changes needed

### Files to modify

| File | Change |
|------|--------|
| `generate_manifest.py` | Output to `_pages/`, add front matter, update cleanup |
| `.github/workflows/manifest.yml` | `git add _pages/` instead of `*/index.html` |
| `assets/docs/JSON_ARCHITECTURE.md` | Update file structure + routing docs |
| `README.md` | Update manifest output description |

---

## Item 3: Fix Entry Page Imagery Slideshow

### Bug

**File**: `assets/js/entry-controller.js` line 269

```javascript
src="/${img}"
```

This unconditionally prepends `/` to all image URLs. Since images now use CDN URLs (`https://cdn.august.style/...`), the result is `//https://cdn.august.style/...` — a broken path.

### Fix

Use the same CDN-aware pattern used everywhere else in the codebase:

```javascript
src="${img.startsWith('http') ? img : '/' + img}"
```

### What this component is

A touch-swipeable image slideshow driven by the entry's `img` array (the 3 square images). CSS uses absolute positioning + opacity transitions. Shows "swipe" hint on hover. Touch detection with 50px threshold advances slides.

### File

`assets/js/entry-controller.js` line 269 — single line change.

---

## Execution Order

| Step | Item | Effort | Notes |
|------|------|--------|-------|
| 1 | Item 3: Fix page imagery bug | ~1 min | Single line fix |
| 2 | Item 1A-C: Update entry images + embed | ~10 min | CDN upload + JSON edit |
| 3 | Item 1D: Add YouTube embed pattern to SOP | ~5 min | Documentation |
| 4 | Item 2: Migrate to `_pages/` | ~20 min | Script update + cleanup + docs |

---

## Verification

### After Item 1
- [ ] `curl -I` on new CDN thumb URLs → HTTP 200
- [ ] `uid-vin-427.json` has 5 thumbs, 3 imgs, media_embed with YouTube
- [ ] Regenerate manifest → new entry HTML has updated meta tags

### After Item 2
- [ ] `python3 generate_manifest.py` outputs files to `_pages/` (not root)
- [ ] `_pages/` contains 37 `.html` files with Jekyll front matter
- [ ] No `/{slug}/` directories at project root
- [ ] After deploy: `august.style/{slug}` resolves correctly
- [ ] Entry pages still load and function correctly

### After Item 3
- [ ] Entry page imagery slideshow shows images (no broken icons)
- [ ] Swipe gesture works on mobile
- [ ] Images load from CDN URLs
