# v2.6 — Polish, SEO, SOP Test, Documentation & Product Packaging

## Context

**Where we are**: v2.5 is complete — all 36 entries have populated fields (`role_headline`, `hero_btn_cta`, `final_cta_text`, `final_btn_cta`), images migrated to CDN, SOP rewritten, and 8+ homepage bugs fixed (filter toggle URL, ampersand in tags, hero randomization, stats deep-links, clear button, credential tags, creative filters, React tab). The homepage is functional.

**What remains**: Seven items spanning polish, SEO, testing, documentation, and product planning. Grouped below by dependency and effort.

---

## Item 1: Unicode Escapes in `homepage-content.json`

**Problem**: `\u2013` (en dash –) and `\u2192` (right arrow →) appear in the JSON source for credential dates and titles. They render correctly in the browser — this is standard JSON encoding.

**Fix**: Replace with literal UTF-8 characters for readability:
- `"2019\u20132020"` → `"2019–2020"`
- `"2011\u20132018"` → `"2011–2018"`
- `"Marketing Innovations \u2192 Senior Strategist"` → `"Marketing Innovations → Senior Strategist"`

**File**: `assets/js/homepage-content.json` — 3 replacements in the `credentials.items` array

---

## Item 2: Dynamic Field Audit & Hero Button Fix

**Problem**: Hero CTA buttons are `<button>` with `onclick="window.location.href='...'"` instead of proper `<a>` elements. The primary hero button also has a hardcoded fallback `'See Web Projects'`. Need to audit that ALL homepage dynamic fields are wired to JSON, not hardcoded.

### 2A. Convert Hero Buttons to `<a>` Tags

**File**: `index.html` (lines 65-68)

Current:
```html
<button class="btn btn-primary">See Web Projects</button>
<button class="btn btn-ghost">All Projects</button>
```

Replace with:
```html
<a class="btn btn-primary" href="/section.html"><!-- JS --></a>
<a class="btn btn-ghost" href="/section.html"><!-- JS --></a>
```

**File**: `assets/js/landing-controller.js` (lines 101-117)

Update `renderHero()` to set `href` instead of `onclick`:
```javascript
const primaryBtn = document.querySelector('.hero-cta .btn-primary');
if (primaryBtn) {
  primaryBtn.textContent = (selectedHeroEntry && selectedHeroEntry.hero_btn_cta) || config.hero.cta_primary_text || 'See Web Projects';
  primaryBtn.href = buildSectionURL(config.hero.filter);
}

const ghostBtn = document.querySelector('.hero-cta .btn-ghost');
if (ghostBtn && config.hero.cta_secondary) {
  ghostBtn.textContent = config.hero.cta_secondary.text;
  ghostBtn.href = config.hero.cta_secondary.filter
    ? buildSectionURL(config.hero.cta_secondary.filter)
    : '/section.html';
}
```

### 2B. Full Dynamic Field Audit

Walk through every section rendered by `landing-controller.js` and confirm each text/link pulls from JSON:

| Section | Field | Source | Status |
|---------|-------|--------|--------|
| Hero flip headlines | `role_headline` | entry JSON | ✅ Dynamic |
| Hero primary CTA text | `hero_btn_cta` | entry JSON via `selectedHeroEntry` | ⚠️ Has hardcoded fallback `'See Web Projects'` — add a config-level fallback to `homepage-content.json` instead |
| Hero secondary CTA text | `cta_secondary.text` | homepage-content.json | ✅ Dynamic |
| Hero stats | count/roles/skills | computed from projects | ✅ Dynamic |
| Showcase heading | `showcase.heading` | homepage-content.json | ✅ Dynamic |
| Showcase tabs | `showcase.tabs[].label` | homepage-content.json | ✅ Dynamic |
| Credential heading | `credentials.heading` | homepage-content.json | ✅ Dynamic |
| Credential items | `credentials.items[]` | homepage-content.json | ✅ Dynamic |
| Process heading | `process.heading` | homepage-content.json | ✅ Dynamic |
| Creative heading | `creative.heading` | homepage-content.json | ✅ Dynamic |
| Creative cards | `creative.cards[]` | homepage-content.json | ✅ Dynamic |
| Impact heading | `impact.heading` | homepage-content.json | ✅ Dynamic |
| Achievements heading | `achievements.heading` | homepage-content.json | ✅ Dynamic |
| Bottom CTA heading | `final_cta_text` | entry JSON via `selectedHeroEntry` | ✅ Dynamic (with config fallback) |
| Bottom CTA primary btn | `final_btn_cta` | entry JSON via `selectedHeroEntry` | ✅ Dynamic (with config fallback) |
| Bottom CTA secondary btn | `cta_section.secondary.text` | homepage-content.json | ✅ Dynamic |

**Action**: Add `"cta_primary_text": "See Web Projects"` to `homepage-content.json` under `hero` so the fallback comes from config, not hardcoded JS.

---

## Item 3: SEO Meta Tags for Entry Pages

**Problem**: `entry-controller.js` sets `og:title`, `og:description`, `og:image` via JavaScript (lines 57-88). Social media crawlers (Facebook, iMessage, Twitter) do NOT execute JavaScript, so they see empty meta tags.

**Root cause**: The site uses a GitHub Pages SPA routing trick — `404.html` catches entry URLs, loads `entry.html` as a template via `fetch()`, and hydrates it with JS. Crawlers hit the 404.html and see only "Loading..." with no meta tags.

### Solution: Build-Step Pre-rendering

Generate a static HTML file per entry during `generate_manifest.py`. Each file lives at `/{slug}/index.html` with correct meta tags baked in, eliminating the 404.html redirect for entry pages entirely.

**Approach**:

1. **Extend `generate_manifest.py`** to also generate entry HTML files:
   - Read `entry.html` as a template
   - For each entry in the manifest, produce `/{slug}/index.html` with:
     - `<title>` set to `seo_title`
     - `<meta name="description">` set to `seo_description`
     - `<meta property="og:title">` set to `seo_title`
     - `<meta property="og:description">` set to `seo_description`
     - `<meta property="og:image">` set to `thumb[0]` (CDN URL, already 1920×1080 — fine for social cards)
     - `<meta property="og:image:alt">` set to `thumb_alt`
     - Add `<meta name="twitter:card" content="summary_large_image">`
     - Add `<meta property="og:type" content="article">`
     - Add `<meta property="og:url">` with canonical URL
   - The rest of the page (body, scripts) stays identical — JS still hydrates content

2. **Image decision**: Use `thumb[0]` as `og:image`. At 1920×1080 it's larger than the recommended 1200×630 but social platforms resize/crop it. No need for a separate `seo_thumb` field — that would add complexity to the SOP for minimal gain.

3. **Update `entry-controller.js`**: `populateMetadata()` can remain for the `<title>` tag (browser tab updates), but the meta tags are now baked in and don't need JS updates.

4. **Update `404.html`**: Entry URLs now resolve to real files, so 404.html only needs to handle section routes and true 404s.

**Files**:
- `generate_manifest.py` — add HTML generation step
- `entry.html` — add `twitter:card` and `og:type` and `og:url` placeholder tags
- `404.html` — simplify (entry routing no longer needed)
- `/{slug}/index.html` (36 generated files) — add to `.gitignore`? Or commit them for GitHub Pages.

**Trade-off note**: Generated files should be committed (GitHub Pages serves static files). Add a comment in `generate_manifest.py` noting these are auto-generated. Could also add them to a `_generated/` tracking comment in the script.

---

## Item 4: SEO Meta Tags for Homepage & Section Pages

### 4A. Homepage (`index.html`)

**Current state**: Static meta tags with `og:image` pointing to non-existent `/assets/media/og-homepage.jpg`.

**Fix** (static, no JS needed):
- Upload a general portfolio og:image to CDN (or use a representative entry thumbnail)
- Update `index.html` meta tags:
  ```html
  <meta property="og:title" content="Sean August Horvath — Design, Development & Automation">
  <meta property="og:description" content="Portfolio showcasing expertise across web, design, automation, and creative projects.">
  <meta property="og:image" content="https://cdn.august.style/media/og-homepage.webp">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://august.style">
  <meta name="twitter:card" content="summary_large_image">
  ```

**Note on Sean's proposal** (dynamic og:title from `hero_btn_cta`): Social meta tags must be static HTML for crawlers. Since the homepage og:image and og:title need to be in the HTML source, they can't change per-refresh. Use a fixed, general-purpose title and image. The dynamic hero CTA text is great for the live visitor experience but can't drive social sharing metadata.

### 4B. Section Page (`section.html`)

**Same JS limitation**: Section pages are loaded via 404.html routing, so crawlers see nothing.

**Pragmatic approach**: Section URLs are functional/filtering URLs (e.g., `section.html?tags=web-developer`), not canonical content pages. They're unlikely to be shared socially in the same way entries are.

**Minimal fix**:
- Add reasonable defaults to `section.html`'s static meta tags:
  ```html
  <meta property="og:title" content="Projects | Sean August Horvath">
  <meta property="og:description" content="Browse portfolio projects by role, skill, or product.">
  <meta property="og:image" content="https://cdn.august.style/media/og-homepage.webp">
  <meta name="twitter:card" content="summary_large_image">
  ```
- `section-controller.js` `updatePageHeader()` already updates `document.title` and `meta[name="description"]` — that's fine for browser tabs and Google (which does execute JS). Social crawlers will see the static defaults, which is acceptable.

### 4C. Create Homepage OG Image

Need to either:
- Create a designed 1200×630 og:image for the homepage and upload to CDN
- Or use an existing entry thumbnail as a placeholder

Simplest: pick a visually representative entry thumbnail, upload to CDN as `og-homepage.webp`.

---

## Item 5: SOP End-to-End Test

**Goal**: Launch an agent to create one real entry from the backlog using only `ENTRY_SOP.md`. Any gaps discovered get fed back as SOP improvements.

### Pre-test Checklist
- [ ] Confirm `ENTRY_SOP.md` is the current, restructured version
- [ ] Confirm `assets/docs/tags.json` is up to date
- [ ] Confirm `assets/docs/_entry_template.json` matches v5.0 schema
- [ ] Pick a backlog entry to test with (the React freelance payments entry `payments.august.style` is ideal — it would populate the React showcase tab)

### Test Procedure
1. Launch agent with instructions to follow `ENTRY_SOP.md` exactly
2. Agent creates the entry end-to-end: slug, images (Cloudinary → CDN), JSON, validate, manifest
3. Review: Did the agent get stuck? Miss steps? Need clarification?
4. Fix any SOP gaps discovered

**File**: `assets/docs/entries-prep/ENTRY_BACKLOG.md` — check for the best candidate entry

---

## Item 6: Documentation Updates

### 6A. Update `assets/docs/JSON_ARCHITECTURE.md`

Currently documents v5.0 schema but needs updates for:
- `thumb` and `img` paths now use CDN URLs (not relative paths) — update field descriptions
- `role_headline`, `hero_btn_cta`, `final_cta_text`, `final_btn_cta` — currently listed as optional, document their purpose and usage in hero
- Document `homepage-content.json` credential tag structure (label+filter objects)
- Document `homepage-content.json` creative card filter structure
- Add note about `generate_manifest.py` now generating entry HTML files (after Item 3)

### 6B. Update `README.md`

Review and update:
- Project description (should reflect v2.5+ state)
- File structure (CDN URLs, generated entry HTML files)
- Quick-start / development instructions

### 6C. Review v2.x Plans for Missed Items

Scan all plan documents for items marked as planned but not implemented:

| Document | Key Findings |
|----------|-------------|
| `v2_0_UPDATE_PLAN.md` | Core architecture — all implemented |
| `v2_1_UPDATE_PLAN.md` | Tag system + filter — implemented |
| `v2_2_UPDATE_PLAN.md` | Section page + tile renderer — implemented |
| `v2_3_UPDATE_PLAN.md` | Entry page redesign — implemented |
| `v2_4_UPDATE_PLAN.md` | Dynamic homepage — implemented. **Phase 8 (Portfolio-as-Product)** — NOT implemented, becomes Item 7 |
| `v2_4_CONTINUED.md` | Entry processing + SOP + bug fixes — implemented in v2.5 |
| `v2_4_REGROUPING.md` | Task reprioritization — implemented |
| `v2_5_UPDATE_PLAN.md` | Previous plan (entry completion, SOP rewrite, homepage polish) — all implemented |

**The one thing Sean mentioned we'd find**: Phase 8 from `v2_4_UPDATE_PLAN.md` — the "Portfolio-as-Product Package" concept. That's Item 7.

---

## Item 7: Packaged Reusable Template Product Plan

**Source**: `v2_4_UPDATE_PLAN.md` Phase 8 (lines 977-1054) outlined the initial concept.

**Goal**: Create a comprehensive plan document that a fresh AI agent can use to turn this portfolio into a client-onboardable product. The plan should be detailed enough to be its own session — the agent needs to think big picture about how the entire flow works.

### What the plan document should cover:

1. **Product concept**: JSON-driven portfolio with AI-powered entry creation pipeline
2. **What makes it unique**: Not just a template — includes an agentic content pipeline that autonomously creates portfolio entries from project docs/repos
3. **Repository setup**: New repo structure, what to copy vs. generate, what to genericize
4. **Client onboarding flow**:
   - Fork/clone starter repo
   - Run setup script (prompts for name, domain, CDN config, Cloudinary credentials)
   - Configure `homepage-content.json` with their sections, credentials, skills
   - Point the agent at their project docs → auto-creates entries
   - Deploy to GitHub Pages (or Vercel/Netlify)
5. **Files to package**:
   - Core JS (data-loader, landing-controller, section-controller, entry-controller, filter-controller, tile-renderer) — these are already generic
   - CSS with design tokens / CSS variables for easy theming
   - HTML templates with placeholder text
   - Pipeline scripts: `validate_v5.py`, `generate_manifest.py`, `new_project.py`
   - SOP docs: `ENTRY_SOP.md`, `_entry_template.json`, `tags.json` (empty starter)
   - Cloudinary + R2 CDN integration guides
6. **Gaps to identify and fill**:
   - Theming system (CSS variables for colors, fonts, spacing)
   - Setup/config script
   - Simplified `homepage-content.json` template with documentation
   - Client-facing README / getting-started guide
   - Any hardcoded references to "Sean August Horvath" or specific content
7. **Testing the product**: How to validate the template works end-to-end for a new user

### Deliverable

Write this as `assets/docs/PRODUCT_PACKAGE_PLAN.md` — a standalone brief that a new AI agent session can consume and execute against. It should reference specific files, existing patterns, and the Phase 8 concept from `v2_4_UPDATE_PLAN.md`.

---

## Execution Order

| Step | Item | Effort | Dependencies |
|------|------|--------|-------------|
| 1 | Item 1: Unicode fixes | ~2 min | None |
| 2 | Item 2: Hero button fix + dynamic audit | ~15 min | None |
| 3 | Item 4A: Homepage og:image fix | ~10 min | Need to create/upload og image |
| 4 | Item 4B: Section page static meta | ~5 min | None |
| 5 | Item 3: Entry page SEO (build step) | ~45 min | Extends generate_manifest.py |
| 6 | Item 5: SOP end-to-end test | ~30 min | Items 1-4 done (clean state) |
| 7 | Item 6: Documentation updates | ~30 min | Items 1-5 done |
| 8 | Item 7: Product package plan | ~45 min | Items 1-6 done (full picture) |

---

## Critical Files

| File | Items | Changes |
|------|-------|---------|
| `assets/js/homepage-content.json` | 1, 2 | Unicode fixes, add `cta_primary_text` fallback |
| `index.html` | 2, 4A | Hero buttons → `<a>` tags, fix og:image URL |
| `assets/js/landing-controller.js` | 2 | Use `href` instead of `onclick`, use config fallback |
| `entry.html` | 3 | Add twitter:card, og:type, og:url placeholders |
| `generate_manifest.py` | 3 | Add per-entry HTML generation |
| `404.html` | 3 | Remove entry routing (entries get real files) |
| `section.html` | 4B | Add static og meta defaults |
| `assets/js/section-controller.js` | 4B | Minor: update og tags in `updatePageHeader()` |
| `assets/docs/JSON_ARCHITECTURE.md` | 6 | Update for CDN URLs, new fields, credential structure |
| `README.md` | 6 | General update |
| `assets/docs/PRODUCT_PACKAGE_PLAN.md` | 7 | New file — comprehensive product plan |

---

## Verification

### After Items 1-2
- [ ] No `\u` escapes visible in `homepage-content.json` credential dates/titles
- [ ] Hero buttons are `<a>` elements with `href`, not `<button>` with `onclick`
- [ ] Primary hero CTA shows text from `selectedHeroEntry.hero_btn_cta`
- [ ] All homepage text is driven by JSON (no hardcoded display text in JS)

### After Items 3-4
- [ ] Share an entry URL on Facebook/iMessage — og:title, og:description, og:image appear
- [ ] Share homepage URL — og card shows with correct image
- [ ] Share section URL — og card shows with generic defaults
- [ ] `python3 generate_manifest.py` creates `/{slug}/index.html` for all entries
- [ ] Entry pages still load and function correctly via the generated HTML

### After Item 5
- [ ] New entry created from backlog, validated, in manifest
- [ ] SOP gaps (if any) documented and fixed

### After Items 6-7
- [ ] `JSON_ARCHITECTURE.md` reflects current state (CDN URLs, credential label+filter, etc.)
- [ ] `README.md` is current
- [ ] No missed items found in v2.x plan review
- [ ] `PRODUCT_PACKAGE_PLAN.md` is comprehensive and actionable
