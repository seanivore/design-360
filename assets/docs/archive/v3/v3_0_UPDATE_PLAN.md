# v3.0 Update Plan: Entry Page Media Redesign, Data Fixes, Section Tile Tags

## Context

v2.7 completed with 70 entries, SEO pre-rendering via `_pages/`, and a tested agentic creation pipeline. An agentic batch run created many new entries, but some have wrong images (agent uploaded inaccurate screenshots). Additionally, new media types (GIFs, mobile screenshots, deck slides) need display components that don't exist yet in `entry-controller.js`. The entry page also needs a layout restructure to better showcase project work. Finally, section page tiles need contextual tag pills so hiring managers can quickly differentiate projects.

---

## Phase 1: Entry JSON Data Fixes + CDN Uploads

**Why first:** New media components (Phase 2) need real data to test against. Pure data work, no code changes.

### 1A. Replace wrong images on CDN (5 entries)

For each: upload correct local files from `assets/images/{slug}/` to CDN, update JSON arrays.

| Entry | JSON File | Thumbs | Img-sq | Other |
|-------|-----------|--------|--------|-------|
| advanced-animation-system | uid-cap-258.json | 4 | 3 | Add 5 GIFs to `gif` array |
| illustrated-poetry-book | uid-cop-802.json | 5 | 3 | -- |
| influencer-growth-strategy | uid-ccp-818.json | 5 (3 currently) | 3 | Rename `deck-` to `slide-` on CDN, add as `slideshows` group |
| public-health-response-platform | uid-cpp-781.json | 6 | 3 | -- |
| viral-campaign-strategy | uid-mrt-136.json | 5 | 3 | Add YouTube embed + 2 GIFs |

**CDN upload command pattern:**
```bash
aws s3 sync assets/images/{slug}/ s3://cdn-august-style/media/{slug}/ --profile r2
```

**viral-campaign-strategy YouTube embed** (from feedback doc):
```json
"media_url": "https://www.youtube.com/watch?v=j5QAjcbvbDg",
"media_embed": "<iframe width='560' height='315' src='https://www.youtube.com/embed/j5QAjcbvbDg?si=p2mq6L5OP-GURp4l&amp;controls=0' title='Viral Campaign Strategy Video' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>",
"media_alt": "Video of viral campaign strategy and results"
```

### 1B. Fix mobile image paths + migrate to `slideshows` schema (3 entries)

These entries have `mobile_img` arrays pointing to `assets/media/` (nonexistent). Upload images to CDN, then migrate from deprecated `mobile_img` field to new `slideshows` array with `type: "mobile"`.

| Entry | JSON File | Fix |
|-------|-----------|-----|
| animated-cms-weekly-blogs | uid-fth-565.json | Fix typo ("animaged" -> "animated"), upload 2 images, convert to `slideshows` group |
| automated-e-commerce-shop-lookbook | uid-dff-987.json | Upload 6 images, convert to `slideshows` group |
| training-yoga-sales | uid-unw-889.json | Upload 3 images, fix naming mismatch, convert to `slideshows` group |

### 1C. embeddings-art-curation (uid-chp-854.json) -- SEPARATE SESSION

Complex case with 6 groups of ~9 artworks each (54 total images). Needs creative assessment: review all 6 GROUP preview images, read the original portfolio post, and decide on naming/framing that emphasizes interior design staging alongside glitch art narrative. **Handle as dedicated creative session after core v3.0 components ship**, since it requires the multi-slideshow architecture to be in place first.

### 1D. Schema migration: add `slideshows` field to all 70 entries

Add empty `"slideshows": []` to all entry JSONs that lack it. For the 3 entries with `mobile_img` data, convert to `slideshows` groups (covered in 1B). The `mobile_img` field stays in the template for documentation but the controller will prefer `slideshows` when present.

Also add empty `"gif": []`, `"gif_alt": ""`, `"grid": []`, `"grid_alt": ""` to entries missing them (script-assisted batch update).

### 1E. Create entry review tracking list

Compile list of all entry URLs NOT updated in this document, so Sean can continue reviewing. Output to `assets/docs/archive/v3/entries-pending-review.md`.

---

## Phase 2: Entry Page Media Component Redesign

**Files to modify:**
- `entry.html` -- restructure media sections
- `assets/js/entry-controller.js` -- rewrite media rendering functions
- `styles.css` -- new component styles, remove deprecated styles

### New Layout (top to bottom)

Per the hand-drawn diagram at `assets/docs/archive/v2/IMG/diagram-entry-page-components.jpeg`:

```
TAGS
TITLE / SUBTITLE
ROLE

1. HERO: Video embed (priority) OR random single thumbnail
2. THUMBNAILS: Two-column compact grid, click-to-expand lightbox
   |- Challenge  |  [thumb] [thumb]  |
   |- Approach   |  [thumb] [thumb]  |
   |- Result     |  [thumb] [thumb]  |
3. GIFS: Single column, any aspect ratio, comfortable spacing
4. IMAGE GRID: 3x3 square images (1080px, 1:1 ratio)
5. SLIDESHOW: Main image + thumbnail nav strip + arrows + counter
```

### 2A. Restructure entry.html

**Remove:**
- `.entry-main-content` two-column wrapper (lines 71-98)
- `#entry-thumbnail-images-grid` section (lines 100-103)
- `#entry-page-imagery` section (lines 105-108)

**Add (in order after role section):**
1. `<section id="entry-hero">` -- hero embed or thumbnail
2. `<div class="entry-content-media">` -- two-column: text left, compact thumbnails right
3. `<section id="entry-gifs">` -- GIF display area
4. `<section id="entry-image-grid">` -- square image grid
5. `<section id="entry-slideshow">` -- redesigned slideshow
6. `<div id="lightbox-overlay">` -- fullscreen lightbox (at end of main)

### 2B. Rewrite entry-controller.js media functions

**Remove:** `populateThumbnailImages()`, `populatePageImagery()`, `addPageImagerySwipe()`

**Add:**

1. **`populateHero(project)`**
   - If `project.media_embed` exists: render video container (existing logic)
   - Else: pick random thumbnail, display as hero image

2. **`populateThumbGrid(project)`**
   - Render ALL `project.thumb` images in 2-column compact grid
   - Each image gets `cursor: zoom-in` and click handler for lightbox
   - Shuffle on load (existing pattern)

3. **`populateGifs(project)`**
   - If `project.gif` array has items, render in single column
   - No forced aspect ratio, `loading="lazy"`, comfortable margin between
   - Show section only when data exists

4. **`populateImageGrid(project)`**
   - If `project.grid` array has items, render 3-across grid
   - Force 1:1 aspect ratio via CSS, `object-fit: cover`
   - Show section only when data exists

5. **`populateSlideshows(project)`** -- MULTI-SLIDESHOW ARCHITECTURE
   - Reads `project.slideshows` array (new schema, see below)
   - Each slideshow group renders as its own independent slideshow instance
   - Per the reference design (`assets/docs/archive/v2/IMG/slide-show-example.jpg`):
     - Group title/heading above each slideshow
     - Large main display area
     - Thumbnail navigation strip below (scrollable for 21+ slides)
     - Left/right arrow buttons
     - Slide counter ("1 / 12")
   - `type: "mobile"` -- display 2-3 tall/narrow images side by side per slide
   - `type: "slide"` -- display one image per slide (default)
   - Keyboard (left/right arrows) and swipe support per instance
   - Legacy: if `project.mobile_img` exists but no `slideshows`, auto-create a single slideshow group from it for backward compatibility

   **New `slideshows` JSON schema:**
   ```json
   "slideshows": [
     {
       "title": "Wave Gradient Pixel Sorting",
       "type": "slide",
       "images": [
         "https://cdn.august.style/media/{slug}/slide-{slug}-1.webp"
       ],
       "alt": "Alt text for this slideshow group"
     },
     {
       "title": "Mobile Screenshots",
       "type": "mobile",
       "images": [
         "https://cdn.august.style/media/{slug}/img-mobile-{slug}-1.webp"
       ],
       "alt": "Alt text for mobile screenshots"
     }
   ]
   ```
   
   This replaces the flat `slideshow` / `slideshow_alt` fields. The `mobile_img` / `mobile_img_alt` fields are deprecated in favor of a slideshow group with `type: "mobile"`.
   
   **Why:** Entries like embeddings-art-curation (6 art technique groups), future lookbooks, and mixed slide+mobile content all need grouped slideshows. A single flat array would make these entries confusing and unnavigable.

6. **`initLightbox()`**
   - Full-viewport overlay with dark backdrop
   - Close button, prev/next navigation
   - Triggered by clicking any compact thumbnail
   - Keyboard (Escape to close, arrows to navigate)

### 2C. CSS additions

**New styles:**
- `.entry-hero` -- full-width, max-height constrained, centered
- `.entry-thumb-grid` -- 2-column CSS grid, gap, compact thumbnails with hover scale
- `.entry-gifs` -- single column, margin between items
- `.entry-image-grid` -- 3-column CSS grid, 1:1 aspect ratio cells (responsive: 2-col tablet, 1-col mobile)
- `.entry-slideshow-group` -- container for each slideshow with heading
- `.entry-slideshow` -- main display, thumbnail strip, arrows, counter (reusable per group)
- `.lightbox-overlay` -- fixed position, z-index 1000, backdrop blur

**Remove:**
- `.entry-main-content` grid styles
- `.entry-thumbnail-images-column` styles
- `.entry-page-imagery` and related swipe styles

---

## Phase 3: Section Tile Tag Pills

**Files to modify:**
- `assets/js/tile-renderer.js` -- add tag pill row to tiles
- `assets/js/section-controller.js` -- pass active filter tags to renderer
- `styles.css` -- tile tag pill styles

### 3A. tile-renderer.js changes

Update `renderSectionTile(project, activeTags = [])`:
- After text area, create `.tile-tags` div
- Collect all project tags (role + skill + product)
- Filter out any matching `activeTags` (normalized comparison)
- Shuffle remaining tags
- Render as small `.tile-tag` spans
- Container: horizontal flex, `overflow-x: auto`, hidden scrollbar

Update `renderSectionTiles(projects, container, activeTags = [])` to pass through.

### 3B. section-controller.js changes

In `renderView()`, pass current `activeTags` array:
```js
TileRenderer.renderSectionTiles(filteredProjects, tileGrid, activeTags);
```

### 3C. CSS for tile tag pills

```css
.tile-tags {
  display: flex;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  overflow-x: auto;
  scrollbar-width: none;
}
.tile-tag {
  font-size: 0.625rem;
  padding: 2px 8px;
  background: rgba(201,166,138,.08);
  color: rgba(201,166,138,.6);
  border-radius: 2px;
  white-space: nowrap;
  flex-shrink: 0;
}
```

---

## Phase 4: Documentation + Cleanup

- Update `assets/docs/JSON_ARCHITECTURE.md` with new media fields and component descriptions
- Update `assets/docs/_entry_template.json` -- replace `slideshow`/`slideshow_alt`/`mobile_img`/`mobile_img_alt` with new `slideshows` array schema
- Update `assets/docs/ENTRY_SOP.md` with new media component guidelines
- Run `python3 generate_manifest.py` to regenerate entry HTML pages
- Compile `entries-pending-review.md` list

---

## Resolved Decisions

- **Layout:** Two-column (text left, compact lightbox thumbnails right)
- **Deck slide naming:** Rename `deck-` to `slide-` on CDN for convention consistency
- **Embeddings art curation:** Separate creative session after v3.0 core ships; needs multi-slideshow architecture first
- **Tile tag pill colors:** Neutral monochrome
- **Slideshow architecture:** Multiple slideshows per entry via `slideshows` array of group objects (replaces flat `slideshow` field)

---

## Verification Plan

### After Phase 1 (data fixes):
- `curl -I` each new CDN URL to confirm HTTP 200
- Validate each updated JSON with `python3 assets/scripts/validate_v5.py`
- Load each entry page locally to verify images display

### After Phase 2 (entry page redesign):
- Test with entries that have: video only, thumbnails only, GIFs, grid images, slideshow, mobile images, all media types
- Test lightbox on desktop (click, keyboard nav, escape)
- Test slideshow navigation (arrows, swipe, thumbnail click)
- Test mobile responsive behavior at 768px and 375px breakpoints
- Verify no layout shifts or broken images

### After Phase 3 (tile tags):
- Test with no filters applied (all tags show on tiles)
- Test with 1 filter (that tag excluded from tile pills)
- Test with multiple filters (all excluded)
- Verify related posts tiles on entry pages still work (no activeTags = all tags show)
- Check mobile tile rendering
