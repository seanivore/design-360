# v2.5 Continued — Entry Completion, SOP Rewrite, Homepage Polish

## Context

**Where we are**: v2.4 dynamic homepage is live at august.style. Most Part A bug fixes from the previous plan are done (contact button, Behance SVG, hero sync redesign, credential tags clickable, URL generation foundation, scroll gap tuning). However, browser testing revealed additional bugs (filter toggle, hero randomization not actually working, broken credential/creative links, stat deep-links using wrong mode).

**Sean's revised priority order** (from `v2_4_CONTINUED.md`):
  1. **First** — Process all 36 existing entries: populate missing JSON fields + migrate images to CDN
  2. **Second** — Rewrite the agentic entry creation SOP using lessons from step 1, then test end-to-end
  3. **Third** — Fix remaining homepage bugs + launch agent to create backlog entries

This reorder makes sense because the entry field population (especially `role_headline`) is needed for the hero sync to work, and the CDN migration needs to happen before more entries are created so the SOP is proven.

---

## Phase 1: Process Existing Entries (36 entries)

### 1A. Populate Missing JSON Fields

Every entry currently has `null` for: `role_headline`, `hero_btn_cta`, `final_cta_text`, `final_btn_cta`

For each of the 36 entries in `assets/entries/`:
  - **`role_headline`** — A short role-based headline for the hero flip clock (e.g., "Web Developer", "Creative Director", "Brand Designer"). Should reflect the entry's primary role.
  - **`hero_btn_cta`** — CTA button text for when this entry is selected in the hero (e.g., "See Web Projects", "View Brand Work")
  - **`final_cta_text`** — Bottom CTA section heading (e.g., "Interested in web development?")
  - **`final_btn_cta`** — Bottom CTA primary button text (e.g., "See All Web Projects")

Also review/update the three entry-page section headings that were flagged as "too quirky and need to be more general."

**Key files:**
  - All 36 files in `assets/entries/*.json`
  - `assets/docs/_entry_template.json` (reference schema)
  - `assets/docs/tags.json` (tag registry)

### 1B. Image CDN Migration

**Current state:** Images are at `assets/.media/{slug}/` (gitignored, moved from old `assets/media/`). JSON paths still reference `assets/media/{slug}/...`. `assets/images/` exists but is empty.

**Per-entry workflow:**
  1. Create `assets/images/{slug}/` directory
  2. Copy `thumb-*.webp` and `img-sq-*.webp` from `assets/.media/{slug}/` into `assets/images/{slug}/`
  3. Upload to R2 CDN:
    ```bash
    aws s3 sync assets/images/{slug}/ s3://portfolio/media/{slug}/ \
      --endpoint-url https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com \
      --profile r2
    ```
  4. Verify CDN URLs work: `https://cdn.august.style/media/{slug}/thumb-{slug}-1.webp`
  5. Update JSON entry: all `thumb` and `img` array values → CDN URLs
  6. Remove copied images from `assets/.media/{slug}/` (leave other files like source PSDs for review)

**R2 credentials:** AWS CLI profile `r2` already configured with endpoint, access key, secret key.

**Validation script update needed:** `assets/scripts/validate_v5.py` (lines 61-73) checks that `thumb` and `img` paths exist on disk. CDN URLs will fail this check. Update the script to skip path-on-disk validation when the path starts with `http`.

---

## Phase 2: Rewrite Agentic Entry Creation SOP

### 2A. Restructure `assets/docs/ENTRY_SOP.md`

Sean's feedback on current SOP issues:
  - "Optional" language for mandatory steps (CDN upload, Cloudinary cleanup)
  - Cloudinary UI instructions irrelevant to agents ("Or use the Cloudinary Media Library UI")
  - Generic patterns instead of literal directions
  - Sections out of order (screenshots at end instead of beginning)
  - Image dimensions already corrected (1920×1080 thumbnails, 1080×1080 squares)

**New section order should be:**
  1. Determine slug
  2. Create `assets/images/{slug}/` directory
  3. **Image sourcing** — download from project page or take screenshots
  4. **Cloudinary processing** — upload → transform (literal URLs, not patterns) → download → **mandatory cleanup**
  5. **CDN upload** — mandatory R2 upload with exact commands, verify URLs
  6. **JSON creation** — add CDN URLs to thumb/img arrays, fill all other fields
  7. Validate with `validate_v5.py`, regenerate manifest

**Key changes:**
  - Remove ALL "optional" language around CDN and Cloudinary cleanup
  - Remove Cloudinary UI references
  - Replace "Common patterns" with exact transformation URLs
  - Move screenshot guidance into the image sourcing section

### 2B. Slim Down `assets/docs/entries-prep/AGENT_CREATING_ENTRIES.md`

Already slimmed in previous session. Review that it points to the right references:
  - `ENTRY_SOP.md` for full procedure
  - `_entry_template.json` for schema
  - `tags.json` for tag registry
  - `ENTRY_BACKLOG.md` for what to build next

### 2C. Agent End-to-End Test

Launch an agent to create one entry from the backlog using only the SOP. Any gaps or confusing directions discovered during this process get fed back into SOP improvements.

---

## Phase 3: Homepage Bug Fixes

### 3A. Hero Randomization Fix (CRITICAL)
**File:** `assets/js/landing-controller.js` — `renderHero()`

**Problem:** Current code requires `role_headline` to be non-null for synced mode, but ALL entries have `role_headline: null`. Falls back to a simpler pattern that doesn't match the agreed-upon 5×2 design.

**Fix:** After Phase 1 populates `role_headline`, the synced mode will activate naturally. But as a defensive measure, also add a fallback: if `role_headline` is null, use `title` for the flip clock. Image selection should always use the 5×2 pattern regardless of `role_headline`:
```
const headlinePool = filtered.filter(p => p.img && p.img.length >= 2);
// ...pick 5, use 2 images each...
// For flip clock: entry.role_headline || entry.title
```

### 3B. Filter Mode Toggle Not Updating URL
**File:** `assets/js/filter-controller.js` — `setMatchMode()` (line 112)

**Problem:** Toggling between "any" and "all" changes internal state but never calls `updateHash()`, so URL doesn't update.

**Fix:** Add `updateHash()` call in `setMatchMode()`:
```javascript
function setMatchMode(mode, btnAny, btnAll) {
    matchMode = mode;
    btnAny.classList.toggle('active', mode === 'any');
    btnAll.classList.toggle('active', mode === 'all');
    updateHash();  // ← ADD THIS
    if (onFilterChange && activeTags.length > 0) {
        onFilterChange(activeTags, matchMode);
    }
}
```

Also update `updateHash()` to always include `&mode=` (not just for "all"):
```javascript
const modeParam = `&mode=${matchMode}`;
```

### 3C. Ampersand in Tag Names Breaks URLs
**File:** `assets/js/data-loader.js` — `normalizeForURL()` (line 19)

**Problem:** "AI & Automation Strategist" → `ai-&-automation-strategist` — the `&` is interpreted as a query param separator, breaking URL parsing.

**Fix:**
```javascript
function normalizeForURL(str) {
    return str
      .toLowerCase()
      .replace(/&/g, '')
      .replace(/\s+/g, '-')
      .replace(/\//g, '-')
      .replace(/-{2,}/g, '-')  // collapse double hyphens
      .trim();
}
```
Result: "AI & Automation Strategist" → `ai-automation-strategist`

### 3D. Hero Stats Deep-Links Use Wrong Mode
**File:** `assets/js/landing-controller.js` — `renderHero()` (lines 134-135)

**Problem:** Stats link with `mode=all` (AND logic), so clicking "Roles" with 10 tags shows 0 results (no entry has ALL 10 roles). User wants `mode=any`.

**Fix:**
```javascript
if (statRoles) statRoles.href = buildSectionURL({ any: tagsByType.role }, 'any');
if (statSkills) statSkills.href = buildSectionURL({ any: tagsByType.skill }, 'any');
```

### 3E. "Clear" Button for Single Tag
**File:** `assets/js/filter-controller.js` (line 171)

**Problem:** `activeTags.length > 1` — button only shows when 2+ tags active. User wants it for 1+ tags.

**Fix:** Change to `activeTags.length > 0`, rename text to `'Clear'`.

### 3F. Credential Tags Restructure
**Files:** `assets/js/homepage-content.json`, `assets/js/landing-controller.js` — `renderCredentials()`

**Problem:** Many credential tags don't exist in `tags.json` and show 0 results. Also, clicking a tag under a specific job shows ALL entries with that tag, not scoped to the company — confusing when you clicked from a specific job.

**Sean's decision:** Restructure credential tags like creative cards with `label` + `filter`. Each tag click should combine the highlighted tag AND the company tag so results are scoped to that job. The company name itself should also be clickable (section page with just the company filter).

**Good news:** `getProjectTags()` in data-loader.js already includes `company` in tag matching, so filtering by company already works.

**Implementation:**

1. Restructure `homepage-content.json` credential tags from strings to objects:
```json
{
  "display_name": "FREELANCE",
  "company": "Freelance",
  "title": "Creative Consultant & Digital Contractor",
  "dates": "2024–Present",
  "tags": [
    { "label": "Webflow", "filter": { "all": ["Webflow", "Freelance"] } },
    { "label": "E-Commerce", "filter": { "all": ["E-Commerce", "Freelance"] } },
    { "label": "AI + Automation", "filter": { "all": ["Automation", "Freelance"] } },
    { "label": "Generative AI", "filter": { "all": ["Generative AI", "Freelance"] } }
  ]
}
```
Each label is a display-friendly name; each filter uses real tags scoped to the company.

2. Update `renderCredentials()` to use `buildSectionURL(tag.filter, 'all')` for tag links.

3. Make company name clickable: wrap `cred-company` in `<a>` linking to `buildSectionURL({ any: [item.company] })`.

4. All other credential items (Silent Labs, SEANIVORE GROUP, PETA) get the same treatment — replace display-only strings with label+filter objects using real tags from the registry.

**Tag mapping needed** (replace non-existent tags with real ones):
   - "AI Integration" → "Automation" or "Generative AI"
   - "Web3" → needs adding to tags.json if we want it, or map to closest existing
   - "Social Media" → "Social Media Manager" (role)
   - "Marketing" → "Growth Strategist" (role)
   - "Kajabi" → needs adding to tags.json or drop
   - "Viral Content" → "Content Production" (skill)
   - "3.2B Impressions" → drop (not a tag, it's a metric)
   - "App UI/UX" → "Product Designer" (role)
   - "Global" → drop (not meaningful as a filter)

### 3G. Creative Section Using Wrong Filters
**File:** `assets/js/homepage-content.json` — `creative.cards[]`

**Current → Correct:**
| Card           | Current filter                                            | Should be                                      |
| -------------- | --------------------------------------------------------- | ---------------------------------------------- |
| Digital Art    | `{"any":["Graphic Designer"]}` (role)                     | `{"any":["Digital Art Collection"]}` (product) |
| Motion & Video | `{"any":["Motion Graphics","Video Production"]}` (skills) | `{"any":["Video"]}` (product)                  |
| Brand Assets   | `{"any":["Brand Designer"]}` (role)                       | `{"any":["Brand Identity"]}` (product)         |

### 3H. Showcase React Tab — Keep, Add Tag
**Files:** `assets/docs/tags.json`, `assets/js/homepage-content.json`

**Problem:** "React" is not in `tags.json` so the tab shows nothing.

**Sean's decision:** Keep the tab. Add "React" to tags.json as a skill. The freelance payments entry (Priority 1 in backlog: `payments.august.style`) is React content and will populate the tab once created. Ensure the payments entry gets prioritized in the backlog agent run.

---

## Critical Files Summary

| File                                                 | Phase | Changes                                                     |
| ---------------------------------------------------- | ----- | ----------------------------------------------------------- |
| `assets/entries/*.json` (36 files)                   | 1     | Populate missing fields, update image paths to CDN URLs     |
| `assets/scripts/validate_v5.py`                      | 1     | Skip disk-path check for CDN URLs (lines 61-73)             |
| `assets/docs/ENTRY_SOP.md`                           | 2     | Full restructure per Sean's feedback                        |
| `assets/docs/entries-prep/AGENT_CREATING_ENTRIES.md` | 2     | Review slim-down                                            |
| `assets/js/landing-controller.js`                    | 3     | Hero randomization fallback (3A), stat deep-links (3D)      |
| `assets/js/filter-controller.js`                     | 3     | Toggle URL update (3B), clear button (3E)                   |
| `assets/js/data-loader.js`                           | 3     | Ampersand fix in normalizeForURL (3C)                       |
| `assets/js/homepage-content.json`                    | 3     | Creative filters (3G), credential tags (3F), React tab (3H) |

---

## Verification

### After Phase 1
   - [ ] All 36 entries have non-null `role_headline`, `hero_btn_cta`, `final_cta_text`, `final_btn_cta`
   - [ ] All image URLs in JSON are CDN URLs (`https://cdn.august.style/media/...`)
   - [ ] CDN URLs load correctly in browser
   - [ ] `validate_v5.py` passes for all entries
   - [ ] Manifest regenerated

### After Phase 2
   - [ ] SOP reads as literal step-by-step (no "optional", no "common patterns")
   - [ ] Agent test entry created successfully using only SOP
   - [ ] Any SOP gaps found during test are fixed

### After Phase 3 (browser test at localhost:5500)
   - [ ] Hero shows 5 random entries × 2 images, different on each refresh
   - [ ] Hero flip clock headlines match the image entries
   - [ ] Filter toggle updates URL between `mode=any` and `mode=all`
   - [ ] "AI & Automation Strategist" tag links work (no broken `&`)
   - [ ] Hero "Roles" stat → section page with all roles, mode=any, shows results
   - [ ] Hero "Skills" stat → section page with all skills, mode=any, shows results
   - [ ] "Clear" button shows when 1 tag is active
   - [ ] Creative cards link to product tags (Digital Art Collection, Video, Brand Identity)
