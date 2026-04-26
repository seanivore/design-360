# v2.4 Implementation Guide — Dynamic Landing Page Homepage

**Created**: 2026-03-16
**Version**: 2.4.0
**Status**: In progress

## Context

  * **Problem**: The portfolio site (august.style) has a polished landing page prototype (`landing-prototype.html`) with 9 sections of hardcoded content. The current `index.html` uses an old tile-grid approach with a broken controller. We need to convert the prototype into a dynamic, JSON-driven homepage where changing tags in a single config file reshapes all homepage content to match a target job opening.

  * **What prompted this**: 4 rounds of prototype iteration (v2.0–v2.3) locked design, animations, and content. Now we need the engineering to make it real.

  * **Intended outcome**: A working `index.html` where every section pulls from project entry JSONs via tag-based filtering controlled by `homepage-content.json`. The existing section and entry pages also updated for the new flat schema.

---

## Phase 0: Schema Finalization

  * **Goal**: Lock the v5.0 entry schema and `homepage-content.json` format before touching any code.

### 0A. v5.0 Entry Schema

Flatten the nested v4.0 structure. Every field is top-level except grouped objects.

  * **Key changes from v4.0**:

    - `categorization.entry_id` → `id`
    - `categorization.slug` → `slug`
    - `categorization.tags.role` → `role`
    - `categorization.tags.skill` → `skill`
    - All `content.media.*` → flat (`thumb`, `img`, `media_embed`, etc.)
    - All `content.teaser_copy.*` → flat (`title`, `subtitle`, `seo_title`, etc.)
    - `content.page_copy.measured` → `result` (rename)
    - New fields: `product[]`, `company`, `process[]`, `metric{}`, `achievement{}`, `role_headline`, `skill_summary`, `hero_btn_cta`, `final_cta_text`, `final_btn_cta`

  * **Complete v5.0 schema** (clean JSON, no comments):

    ```json
    {
      "_metadata": {
        "schema_version": "5.0",
        "template_type": "project_entry"
      },
      "id": "uid-xxx-###",
      "slug": "project-name",
      "title": "Display Title",
      "subtitle": "One-line tagline",
      "seo_title": "SEO Title (50-60 chars)",
      "seo_description": "SEO description (150-160 chars)",

      "role": ["Web Developer"],
      "skill": ["HTML/CSS/JS", "React"],
      "product": ["Website"],
      "company": "Freelance",

      "thumb": ["assets/media/slug/thumb-slides-slug-1.webp"],
      "thumb_alt": "Alt text for thumbnail slideshow",
      "img": ["assets/media/slug/img-sq-slides-slug-1.webp"],
      "img_alt": "Alt text for square images",
      "mobile_img": [],
      "mobile_img_alt": "",
      "media_url": "",
      "media_embed": "",
      "media_alt": "",

      "origin_url": "",
      "origin_url_text": "",
      "repository": "",

      "tiles": ["Tile text 1", "Tile text 2"],
      "challenge": "Problem statement (2-4 sentences)",
      "approach": "Approach taken (2-4 sentences)",
      "result": "Outcome achieved (2-4 sentences)",

      "role_headline": null,
      "hero_btn_cta": null,
      "final_cta_text": null,
      "final_btn_cta": null,
      "skill_summary": "",

      "process": null,
      "metric": null,
      "achievement": null,

      "notes": []
    }
    ```

  * **`process` structure** (when populated — see Decision D1 below):

    ```json
    "process": [
      {
        "word": "Assess",
        "summary": "Audit existing workflows...",
        "link_text": "800-Product AI Storefront",
        "link_slug": "automated-e-commerce-shop-lookbook"
      },
      { "word": "Implement", "summary": "...", "link_text": "...", "link_slug": "..." },
      { "word": "Iterate", "summary": "...", "link_text": "...", "link_slug": "..." }
    ]
    ```

  * **`metric` structure** (when populated):

    ```json
    "metric": { "value": "3.2B", "kpi": "Page Impressions", "context": "Facebook page impressions, 2016" }
    ```

  * **`achievement` structure** (when populated):

    ```json
    "achievement": { "headline": "PR News Pro — Instagram Engagement Feature", "details": "Featured for innovative..." }
    ```

  * **Optional fields** (can be `null` or empty):
    `media_url`, `media_embed`, `media_alt`, `mobile_img`, `mobile_img_alt`, `origin_url`, `origin_url_text`, `repository`, `process`, `metric`, `achievement`

  * **Best-of fields** (optional but every entry SHOULD have quality values — especially `role_headline` since it's the hero headline that rotates on the homepage. The more entries with good values, the better the rotation works):
    `role_headline`, `hero_btn_cta`, `final_cta_text`, `final_btn_cta`

  * **Required fields** (must be non-empty):
    `id`, `slug`, `title`, `subtitle`, `seo_title`, `seo_description`, `role[]`, `skill[]`, `product[]`, `company`, `thumb[]`, `thumb_alt`, `img[]`, `img_alt`, `tiles[]`, `challenge`, `approach`, `result`

  * **Removed from schema** (was in earlier draft):
    `workplace` object — no longer needed. Career credentials (title, dates) are curated in `homepage-content.json`. Only `company` (flat string) stays on entries to associate projects with a workplace.

  * **Locked company values**: `"Freelance"`, `"Silent Labs"`, `"SEANIVORE GROUP LLC"`, `"PETA, Inc."`

### 0B. `homepage-content.json` Format

File: `/assets/js/homepage-content.json`

This is the tag controller. Each section defines what entries to show and how.

  * **Filter system**:

    - `filter.any: ["tag1", "tag2"]` — OR logic, entry must have at least one tag (across all 4 groups)
    - `filter.all: ["tag1", "tag2"]` — AND logic, entry must have all tags
    - Empty `any`/`all` arrays = no filter (all entries)
    - All tag matching is **exact string match** by default (see Decision D2)
    - **No limits** — all matching entries are available. Components handle display (rotation, random pick, show all, etc.)
    - **No slug references** — everything is tag-driven. The whole point is that changing tags in this file reshapes the homepage. Slugs would create hard dependencies.

    ```json
    {
      "_metadata": {
        "version": "1.0",
        "description": "Controls which entries appear in each homepage section. Change tags to reshape the entire homepage for a specific job target."
      },

      "hero": {
        "filter": { "any": ["Web Developer"] },
        "cta_secondary": { "text": "All Projects", "href": "/section.html" }
      },

      "showcase": {
        "heading": "Web Development",
        "tabs": [
          { "id": "webflow", "label": "Webflow", "filter": { "all": ["Web Developer", "Webflow"] } },
          { "id": "framer", "label": "Framer", "filter": { "all": ["Web Developer", "Framer"] } },
          { "id": "react", "label": "React", "filter": { "all": ["Web Developer", "React"] } },
          { "id": "htmlcssjs", "label": "HTML/CSS/JS", "filter": { "all": ["Web Developer", "HTML/CSS/JS"] } }
        ]
      },

      "credentials": {
        "heading": "Experience",
        "note": "Only 'tags' should change frequently — the rest (name, title, dates) are career facts.",
        "items": [
          {
            "display_name": "FREELANCE",
            "company": "Freelance",
            "title": "Creative Consultant & Digital Contractor",
            "dates": "2024–Present",
            "tags": ["Webflow", "E-Commerce", "AI Integration", "Automation"]
          },
          {
            "display_name": "SILENT LABS",
            "company": "Silent Labs",
            "title": "Art Director",
            "dates": "2020–2023",
            "tags": ["Brand Identity", "Motion Graphics", "Illustration", "Web3"]
          },
          {
            "display_name": "SEANIVORE GROUP",
            "company": "SEANIVORE GROUP LLC",
            "title": "SBO Digital Consultant",
            "dates": "2019–2020",
            "tags": ["Copywriting", "Social Media", "Marketing", "Kajabi"]
          },
          {
            "display_name": "PETA",
            "company": "PETA, Inc.",
            "title": "Marketing Innovations → Senior Strategist",
            "dates": "2011–2018",
            "tags": ["Viral Content", "3.2B Impressions", "App UI/UX", "Global"]
          }
        ]
      },

      "process": {
        "heading": "AI & Automation Process",
        "filter": { "any": ["Automation"] }
      },

      "creative": {
        "heading": "Creative Production",
        "cards": [
          { "label": "Digital Art", "title": "15+ Collections", "filter": { "any": ["Graphic Designer"] }, "href": "/section.html?tags=Graphic+Designer" },
          { "label": "Motion & Video", "title": "Social & Brand", "filter": { "any": ["Motion Graphics", "Video Production"] }, "href": "/section.html?tags=Motion+Graphics" },
          { "label": "Brand Assets", "title": "Identity & Print", "filter": { "any": ["Brand Designer"] }, "href": "/section.html?tags=Brand+Designer" }
        ]
      },

      "impact": {
        "heading": "Advertising Impact",
        "filter": { "any": ["Advertising"] }
      },

      "achievements": {
        "heading": "Achievements",
        "filter": { "any": [] }
      },

      "cta_section": {
        "heading": "Interested in web development?",
        "primary": { "text": "See All Web Projects", "href": "/section.html?tags=Web+Developer" },
        "secondary": { "text": "Explore Full Portfolio", "href": "/section.html" }
      }
    }
    ```

### 0C. `tags.json` Tracking File

File: `/assets/docs/tags.json` — running registry of all tags used across entries.

  ```json
  {
    "role": [],
    "skill": [],
    "product": [],
    "company": ["Freelance", "Silent Labs", "SEANIVORE GROUP LLC", "PETA, Inc."]
  }
  ```

Populated during entry migration/creation. Prevents duplicate concepts with different wording.

---

## Decisions Needing Confirmation

### D1. Process Data: Array vs Numbered Keys

  * **Sean's original**: `"1_word": "assess", "1_summary": "...", "1_click": "→ 800-Product AI Storefront"`

  * **My recommendation**: Array of step objects with explicit link slugs:
  ```json
  "process": [
    { "word": "Assess", "summary": "...", "link_text": "800-Product AI Storefront", "link_slug": "automated-e-commerce-shop-lookbook" }
  ]
  ```

  * **Why**: The numbered keys (`1_word`, `2_word`) require the controller to manually construct keys with string concatenation. An array iterates cleanly. Also, `1_click` only stores display text — the prototype renders it as `<a href="/automated-e-commerce-shop-lookbook">→ 800-Product AI Storefront</a>`, so we need both the text AND the slug.

### D2. Tag Matching: Exact vs Partial

  * **Sean's original**: "Default to ANY PART of the tag"

  * **My recommendation**: Exact matching by default. Partial matching is opt-in with a `*` prefix.

  * **Why**: "Web" partial-matching would hit both "Web Developer" and "Webflow" — likely unintended. With exact matching: `"all": ["Web Developer"]` only matches entries tagged "Web Developer". For the rare case where partial is needed: `"all": ["*Web"]` matches any tag containing "Web". This gives control without surprises.

### D3. Credentials: Curated vs Entry-Derived

  * **My recommendation**: Curated in `homepage-content.json` (shown above).

  * **Why**: The prototype's credential tags include items like "3.2B Impressions" and "Global" — these are curated highlights, not standard skill tags from entries. Career credentials are about the person, not individual projects. Storing them in the homepage controller keeps them editable alongside other homepage content. Only `company` (flat string) stays on entries for project↔workplace association.

### D4. Entry Migration → **Recreate from Scratch** (confirmed)

Recreate all 36 entries fresh in v5.0 format. Reasons:

  1. **Copy reframing**: The old "pattern/action/measured" sections need storytelling adjustment, not just structural migration. Some "pattern" copy doesn't work well.
  2. **Tag quality**: Old tags had overlap and clunkiness. Fresh tagging should be intentional, SEO-conscious, and sleek.
  3. **Consistency**: Agent writes all entries in the same voice with the same quality bar.

### D5. Entry Page Section Labels — Rename

The old labels "Pattern / Action / Measured" are quirky rather than evergreen. New names:

| Old        | New         | Why                                                                      |
| ---------- | ----------- | ------------------------------------------------------------------------ |
| `pattern`  | `challenge` | Straightforward, describes the problem. "Pattern" was confusing.         |
| `action`   | `approach`  | Slightly more professional than "action". Or keep `action` if preferred. |
| `measured` | `result`    | Already agreed. Clear and direct.                                        |

Schema fields: `challenge`, `approach`, `result` (replaces `challenge`, `approach`, `result`)

### D6. Role Tag Philosophy — FastCompany Mentality

Apply the principle: *"Does my title reflect the actual value I deliver?"*

Role tags should communicate impact, not generic titles. Rethink before entry creation:

| Possibly Retire             | Possible Replacement                          | Rationale                                         |
| --------------------------- | --------------------------------------------- | ------------------------------------------------- |
| `UX/UI Designer`            | `Product Designer` or `Interaction Designer`  | FastCompany specifically rejects "UX/UI Designer" |
| `Digital Marketing Manager` | `Growth Strategist` or `Marketing Strategist` | Communicates strategic value                      |
| `Account Manager`           | May drop entirely                             | Not impact-oriented                               |
| `Automation Engineer`       | `AI & Automation Strategist`                  | Reflects consulting/strategy angle                |

Keep: `Web Developer`, `Graphic Designer`, `Video Editor`, `Content Strategist`, `Brand Designer`, `Creative Director`, `Social Media Manager` — these are clear and commonly searched.

Final role list to be decided during entry creation phase. Agent should research SEO-optimal role titles via web search before committing.

### D7. Hero Scroll Animation — Bugs + Intended Behavior

  * **Known bugs in current prototype:**

    1. Headline/byline words don't move up properly during Phase 2
    2. Top nav is slightly too wide
    3. Expand nav icon (sticky pill) is mostly covered up / invisible when it appears

  * **Sean's intended scroll experience** (from v2_2_FEEDBACK.md):

The current 4-phase implementation in prototype lines 1548-1624 deviates from the intent. Here's what needs to change:

  * **Phase 1** (stats exit, image grows): Currently ✓ mostly correct.
    - Image extends DOWN to fill viewport
    - Stats scroll off the top
    - Headline/byline/CTA stay pinned at bottom of viewport

  * **Phase 2** (image recedes, content follows): Currently ✗ needs rework.
    - Image hides from BOTTOM, moving UP with scroll
    - Headline/byline STAY PUT while image starts receding
    - When image reaches ~halfway hidden, THEN headline/byline start to follow
    - Key animation detail: vertical spacing between headline elements EXPANDS first, then CONDENSES back to normal as they move up
    - Current bug: content just lifts and fades uniformly instead of the expand→condense spacing dance

  * **Phase 3** (trio bridge enters): Currently ✗ needs rework.
    - Three bars should enter ONE AT A TIME (not all at once)
    - Top bar first (longest), then middle, then bottom
    - Each starts before the previous reaches final position (staggered, overlapping)
    - Spacing between bars: expanded initially, then shrinks to final position
    - Mirrors the expand→condense rhythm from Phase 2

  * **Phase 4** (content appears): Currently ✗ needs addition.
    - "Web Development" section heading appears below trio
    - Spacing between trio and heading closes/compresses
    - By the time trio lines start exiting the top of the screen, the content below has reached normal spacing
    - Normal scroll resumes

  * **Core principle**: "All elements moving at their own speeds, meeting at the right time — like an AI-orchestrated freeway where every car is doing its own thing but aware of the others."

Implementation: Rework `heroScroll()` function in `landing-controller.js` → `initHeroScroll()`. Use sub-phase progress values with independent easing curves per element to achieve the orchestrated-but-independent feel.

---

## Phase 1: Entry Recreation + Schema Tools

  * **Depends on**: Phase 0 confirmed
  * **Blocks**: Phases 2–4 (for live data), but JS/HTML work can start in parallel using schema interface only

### 1A. Finalize Role Tags (Research-Driven)

Before creating any entries, research SEO-optimal role titles via web search. Apply FastCompany mentality: titles that communicate value delivered, not generic labels.

  * **Process**:
    1. Web search for most-searched design/dev job titles in 2025-2026
    2. Cross-reference with Sean's actual capabilities
    3. Finalize list of ~8-11 role tags (retiring overlap, dropping non-impact titles)
    4. Sean reviews and approves final role list

  * **Starting list to evaluate** (see Decision D6 for rationale):
    - Web Developer ✓
    - Graphic Designer ✓
    - Video Editor ✓
    - Content Strategist ✓
    - Brand Designer ✓
    - Creative Director ✓
    - Social Media Manager ✓
    - Product Designer (replaces UX/UI Designer?)
    - AI & Automation Strategist (replaces Automation Engineer?)
    - Growth Strategist (replaces Digital Marketing Manager?)

### 1B. Recreate All 36 Entries in v5.0 Schema

Agent rewrites each entry fresh, using the old entry as reference material (not template). For each entry:

  1. **Read old v4.0 file** — extract: slug, media paths, origin URLs, repository links, video embeds. These are factual data that must be preserved exactly.
  2. **Preserve media references** — `thumb[]`, `img[]`, `media_embed`, `media_url`, etc. are file paths / URLs that don't change.
  3. **Rewrite copy** — `challenge`, `approach`, `result` rewritten with evergreen, straightforward storytelling. No quirky framing.
  4. **Rewrite tags** — Apply finalized role list. Select skills intentionally (no overlap). Infer `product[]` tags. Assign `company`.
  5. **Fill new fields** — `skill_summary`, and best-of fields (`role_headline`, `hero_btn_cta`, `final_cta_text`, `final_btn_cta` — fill on as many entries as possible). Null-able fields (`process`, `metric`, `achievement`) only where relevant.
  6. **Maintain `tags.json`** — running registry updated with every new tag used.

  * **Entry creation order**: Start with the ~8 entries referenced in the prototype (these need the most new data), then remaining 28.

  * **Prototype-referenced entries** (need `process`, `metric`, `achievement`, `role_headline`, or CTA fields):
    - `saas-product-sale-features` — hero flip headline, process step 2 link, showcase
    - `automated-e-commerce-shop-lookbook` — process step 1 link, showcase
    - `data-visualization-dashboard` — process step 3 link, showcase
    - `css-animated-micro-interactions` — hero flip headline, showcase
    - `baroque-de-heem-still-life` — hero flip headline, creative card
    - `modular-portfolio-build` — showcase
    - `training-yoga-sales` — showcase
    - `blog-lookbook-print-gallery` — showcase
    - `personalized-fashion-magazine` — showcase
    - `surreal-constructivism` — hero images, creative card
    - `clockwork-splendor` — hero images, creative card
    - `gradient-bauhaus` — hero images
    - Plus entries that will carry `metric` and `achievement` data (TBD based on which projects have the best stats)

  * **Quality gates per entry**:
    - All required fields populated
    - `thumb[]` and `img[]` paths verified on disk
    - No tag duplicates (check against `tags.json`)
    - `company` is one of 4 locked values
    - Copy is evergreen and professional (no "pattern/measured" quirky framing)

### 1C. Write Validation Script

File: `assets/scripts/validate_v5.py`

  * Checks (run after all entries created):
    1. All entries: `schema_version == "5.0"`
    2. Required fields non-empty
    3. All `thumb[]` paths exist on disk
    4. All `img[]` paths exist on disk
    5. `company` is one of 4 locked values
    6. No duplicate slugs
    7. `product[]` has at least one value
    8. If `process` is not null, it's an array of 3 objects with all required keys
    9. If `metric` is not null, it has `value`, `kpi`, `context`
    10. If `achievement` is not null, it has `headline`, `details`
    11. All tags used exist in `tags.json`

### 1D. Update `_entry_template.json`

  File: `/assets/docs/_entry_template.json`
  Replace with v5.0 flat schema template (full field documentation with writing guidelines for each copy field).

### 1E. Update `generate_manifest.py`

  File: `/generate_manifest.py`
  Change: Read `slug` from root level instead of `categorization.slug`.

### 1F. Update `new_project.py`

  File: `assets/scripts/new_project.py`
  Generate v5.0 template instead of v4.0.

### 1G. Populate `tags.json`

  Built incrementally during 1B. Final validation scan after all entries complete.

---

## Phase 2: JavaScript Layer

  * **Depends on**: Phase 0 confirmed (needs schema field names, not actual data)
  * **Parallel**: 2A blocks 2B. 2C–2F can run parallel with each other once 2A is done.

### 2A. Rewrite `data-loader.js`

  File: `/assets/js/data-loader.js`

  All path references change from nested v4.0 to flat v5.0. New functions added.

  * **Functions to modify**:

    `getProjectTags(project)` — was: `project.categorization?.tags` → now: combine `project.role`, `project.skill`, `project.product`, `[project.company]`

    `getTagsByType(projects)` — was: returns `{role, skill}` → now: returns `{role, skill, product, company}`

    `getTagType(projects, tagName)` — search all 4 groups

  * **New functions**:

    `filterByExactSlugs(projects, slugs)` — returns entries matching slug list, preserving order

    `resolveFilter(projects, filterObj)` — universal resolver for `{all, any, slugs}` pattern:
    ```
    if filterObj.slugs → filterByExactSlugs
    if filterObj.all → filterByAllTags
    if filterObj.any → filterByAnyTag
    chain: all first, then any on the result
    ```

    `loadHomepageContent()` — fetches+caches `/assets/js/homepage-content.json`

  * **Cache update**: Add `homepageContent: null` to cache object.

### 2B. Write `landing-controller.js` (NEW)

  File: `/assets/js/landing-controller.js`

  Replaces `homepage-controller.js`. Structure:

    ```
    LandingController (IIFE)
    ├── init()                          // entry point, called on page load
    ├── loadHomepage()                  // orchestrator: loads data, calls all renderers
    │
    ├── renderHero(config, projects)
    │   ├── renderStats(projects)       // count projects, unique roles, unique skills
    │   ├── renderHeroImages(config)    // pick img[0] from shuffled entries, duplicate for loop
    │   ├── renderFlipHeadlines(config) // load entries by slug, read role_headline
    │   └── renderHeroCTA(config)       // set button text + href from config
    │
    ├── renderShowcase(config, projects)
    │   └── for each tab: resolveFilter → render project cards (thumb[0], title, tags)
    │
    ├── renderCredentials(config)       // pure render from config items (curated data)
    │
    ├── renderProcess(config, projects) // load entry by slug, read process array
    │
    ├── renderCreative(config, projects)
    │   └── for each card: resolveFilter → pick random entry → show img[0]
    │
    ├── renderImpact(config, projects)  // load entries by slug, read metric objects
    │
    ├── renderAchievements(config, projects) // load entries by slug, read achievement objects
    │
    ├── renderCTA(config)               // pure render from config
    │
    └── initScrollBehaviors()           // all 7 behaviors from prototype <script>
        ├── initNavCollapse()           // prototype lines 1537-1546
        ├── initHeroScroll()            // prototype lines 1548-1647 (4-phase animation)
        ├── initFlipClock()             // prototype lines 1649-1664
        ├── initTabs()                  // prototype lines 1667-1674
        ├── initAccordion()             // prototype lines 1677-1679
        ├── initScrollReveal()          // prototype lines 1681-1685
        └── initStatCountUp()           // prototype lines 1687-1704
    ```

  * **Rendering approach**: Each `render*` function populates the already-present HTML skeleton (from `index.html`). Dynamic containers have `id` attributes. The HTML stays hardcoded for structural elements; JS inserts data into designated slots.

  * **Fallback behavior**: All renderers skip null/empty data. If a section has no matching entries, it hides the section. If `metric` is null on a filtered entry, skip it. This implements Sean's "field intelligence" concept.

  * **Hero — Synced Content Rotation**:
    1. Filter entries by hero `filter` tags → get all matching entries
    2. From those, keep only entries that have a non-null `role_headline`
    3. On page load: randomly pick ONE entry
    4. Display that entry's `img[]` (all 3 square images) in the image strip, plus images from other filtered entries to fill out the drift animation
    5. Display that entry's `role_headline` as the current flip headline
    6. Display that entry's `hero_btn_cta` as the primary CTA button text (href links to section page filtered by the hero filter tags)
    7. Flip clock rotates to the NEXT random entry's `role_headline` every 5s, synced with a subtle image transition
    8. On page refresh: new random starting entry
    9. Secondary CTA button comes from `cta_secondary` in config (static "All Projects")

  * **Stat count-up**: Dynamically set `data-count` attributes. Projects = total entry count, Roles = unique role tags count, Skills = unique skill tags count (with "+" suffix).

  * **Showcase — No Limits**:
    All matching entries per tab are shown. No cap. If "Webflow" tab has 12 projects, show all 12.

  * **Process — Tag Filtered**:
    Filter entries by process `filter` tags. From results, find entries with non-null `process` array. Pick one (or show the first found). Heading comes from config.

  * **Impact — Tag Filtered**:
    Filter entries by impact `filter` tags. From results, show all entries that have non-null `metric` objects. No slug references.

  * **Achievements — Tag Filtered**:
    Filter entries by achievements `filter` tags. From results, show all entries with non-null `achievement` objects.

### 2C. Update `entry-controller.js`

  File: `/assets/js/entry-controller.js`

  Path changes (all `content.media.X` → `project.X`, etc.):

| Old                                      | New                                        |
| ---------------------------------------- | ------------------------------------------ |
| `project.categorization.entry_id`        | `project.id`                               |
| `project.categorization.slug`            | `project.slug`                             |
| `project.categorization.tags.role`       | `project.role`                             |
| `project.categorization.tags.skill`      | `project.skill`                            |
| `content.teaser_copy.seo_title`          | `project.seo_title`                        |
| `content.teaser_copy.page_title`         | `project.title`                            |
| `content.teaser_copy.page_subtitle`      | `project.subtitle`                         |
| `content.media.thumbnail_images`         | `project.thumb`                            |
| `content.media.thumb_slideshow_alt_text` | `project.thumb_alt`                        |
| `content.media.video_embed`              | `project.media_embed`                      |
| `content.media.page_imagery`             | `project.img` (or keep separate if needed) |
| `content.assets.project_url`             | `project.origin_url`                       |
| `content.assets.github_repository`       | `project.repository`                       |
| `content.page_copy.pattern`              | `project.challenge`                        |
| `content.page_copy.action`               | `project.approach`                         |
| `content.page_copy.measured`             | `project.result`                           |  |

  Also add `product` tag pills alongside role and skill in `populateTagsCards()`.

  * **Entry page "Role" section**: Display `role` tags as functional link pills (linking to `/section.html?tags=Role+Name`). Followed by a "Skills" section showing `skill` and `product` tags. Keep visually less prominent than the 3 main content sections (pattern/action/result).

### 2D. Update `tile-renderer.js`

  File: `/assets/js/tile-renderer.js`

  - `categorization.slug` → `project.slug`
  - `categorization.entry_id` → `project.id`
  - `content.media.thumbnail_images` → `project.thumb`
  - `content.media.thumb_slideshow_alt_text` → `project.thumb_alt`
  - `content.teaser_copy.tile_text` → `project.tiles`
  - URLs: `/${project.slug}` (already flat, no change needed)

### 2E. Update `section-controller.js`

  File: `/assets/js/section-controller.js`

  - Remove all section/subsection logic
  - Tags now come from 4 groups: role, skill, product, company
  - `getTagsForDisplay()` returns tags from all 4 groups
  - Page now works purely as a tag-filtered project listing
  - Section heading: when a single tag is active, show tag name + count as heading (e.g., "Web Developer (14)"); when multiple, show "Projects" + count
  - Nav should be: Home + Contact only — no homepage section anchors. The section page UX is entirely about filtering.

### 2F. Rewrite `filter-controller.js` — Shadcn-Style Multi-Select

  File: `/assets/js/filter-controller.js`

  * **Complete UI overhaul**: Replace the horizontal scrolling tag bar with a shadcn-style multi-select dropdown filter system.

    Reference: `assets/docs/archive/v2/IMG/shadcn-multi-select-dropdown-checkbox-ui-example.jpg` (circled: multi-select with selected pills + checkboxes)
    Replace: `assets/docs/archive/v2/IMG/current-section-page-filter-tag-ui.jpg` (huge horizontal scroll bar)

  * **New filter UI spec**:
    + Dropdown trigger button showing "Filter" or selected tag count
    + Selected tags shown as removable pills above/beside the dropdown (with X buttons)
    + Dropdown panel with:
      - Search field to find tags
      - "Select All" / "Clear All" option
      - Checkboxes grouped by tag type (Role, Skill, Product, Company)
      - **Project count next to each tag** BEFORE applying (e.g., "Webflow (8)", "React (3)")
      - Cancel / Apply buttons
    + Count updates live as filters change
    + Multiple tags can be selected simultaneously (true multi-select, no single-select restriction)
    + URL hash updates with selected tags
    + When navigating from homepage tag link, that tag is pre-selected and immediately active

### 2G. Delete `homepage-controller.js`

  File: `/assets/js/homepage-controller.js` — DELETE. Replaced by `landing-controller.js`.

---

## Phase 3: HTML Templates

  * **Depends on**: Phase 0 confirmed (needs section structure)
  * **Parallel**: Can run alongside Phase 2. 3A is the main work.

### 3A. Convert prototype → `index.html`

  Source: `landing-prototype.html` (lines 1141-1534 for body, lines 13-1138 for CSS)

  * **What stays hardcoded in HTML** (structural, never changes):
    + Nav markup (`.site-nav`, `.nav-pill`, links, Contact button)
    + Hero byline ("by **Sean August Horvath**")
    + Trio bridge `<div>` (decorative)
    + All `<section>` containers with their class names
    + All decorative trio elements
    + Footer social links + copyright
    + CTA trio decorative element

  * **What becomes dynamic containers** (empty shells with IDs, populated by JS):
    + `#heroStats` — children cleared, rebuilt with dynamic counts
    + `.hero-img-scroll` — children cleared, rebuilt with dynamic images
    + `.flip-track` — children cleared, rebuilt with dynamic headlines
    + `.hero-cta` — button text/href set by JS
    + `.showcase-tabs` — tab buttons built from config
    + All `.showcase-panel` divs — project cards built by JS
    + `.cred-list` — credential items built by JS
    + `.process-scroll` — process cards built by JS
    + `.creative-grid` — creative cards built by JS
    + `.impact-grid` — impact stat boxes built by JS
    + `.achievements .container` (below heading) — accordion items built by JS
    + `.cta-heading` — text set by JS
    + `.cta-buttons` — button text/href set by JS

  * **Section headings**: Set by JS from `homepage-content.json` (`config.heading` values).

  * **Scripts at bottom**:
    ```html
    <script src="/assets/js/data-loader.js"></script>
    <script src="/assets/js/landing-controller.js"></script>
    ```

### 3B. Update `section.html`

  + Nav: **Home + Contact only** — no homepage section anchors. Section page UX is about filtering.
  + Footer matches new design (social icons from prototype)
  + Tag filter system: completely new shadcn-style multi-select UI (see 2F)
  + Filter dropdown replaces the horizontal scroll bar

### 3C. Update `entry.html`

  - Remove breadcrumbs (`.entry-breadcrumb` or similar)
  - Add tag pills display for all 4 groups (role, skill, product — company shown in entry header or role section)
  - Nav and footer match new homepage
  - Entry page "Role" section: `role` tags as link pills
  - Separate "Skills & Tools" section: `skill` + `product` tags

### 3D. Update `404.html`

  - Ensure it loads the v5.0-compatible `data-loader.js`
  - Core routing logic unchanged (already handles flat slugs via manifest)
  - Update any references to old controller scripts

---

## Phase 4: CSS Integration

  * **Depends on**: Phase 0
  * **Parallel**: Can run alongside Phases 2-3

### 4A. Create `landing.css`

  Extract prototype `<style>` block (lines 13-1138) into `/landing.css`.

  * **Keep separate from `styles.css`**. Reasons:
    - Different variable naming (`--bg` vs `--color-bg-primary`, `--terra` vs `--color-accent-terracotta`)
    - Same color values but different design philosophy (prototype is flat-first, existing is more structured)
    - Avoids merge conflicts and maintenance burden
    - Prototype styles are self-contained and tested

### 4B. Wire CSS in `index.html`

  ```html
  <link rel="stylesheet" href="/landing.css">
  ```

  `index.html` does NOT load `styles.css` — the landing page is fully independent.

### 4C. Responsive Verification

  Prototype already handles breakpoints:
  - Default (mobile-first): < 768px
  - Tablet: `@media (min-width: 768px)` (line ~1105)
  - Desktop: `@media (min-width: 1024px)` (line ~1133)

  Verify at: 375px (iPhone SE), 393px (Pixel 7), 768px (iPad), 1024px (desktop).

---

## Phase 5: Build Tools + Final Wiring

  * **Depends on**: Phase 1 (entries exist), Phases 2-4 (code ready)

### 5A. Regenerate Manifest

  Run updated `generate_manifest.py` to rebuild `assets/js/manifest.json` from all 36 v5.0 entries.

### 5B. Run Validation

  Run `validate_v5.py` across all entries. Fix any failures.

### 5C. Finalize `homepage-content.json`

  Write the final file at `/assets/js/homepage-content.json` with real tag values, slug references for process/impact/achievements, and verified filter configs. This can only be finalized after entries exist with their actual tags.

### 5D. Hero Scroll Animation Rework

  Rework `initHeroScroll()` in `landing-controller.js` against Sean's intended behavior (see Decision D7). This is separate from the basic controller build (Phase 2B) because it requires careful visual tuning.

  * **Specific fixes**:
    1. Phase 2: Content stays pinned while image recedes. Content movement starts at image ~50% hidden. Spacing expand→condense animation on headline/byline/CTA elements.
    2. Phase 3: Trio bars enter sequentially (staggered, not simultaneous). Each bar has its own expand→condense spacing.
    3. Phase 4: "Web Development" heading appears below trio, spacing closes as trio exits.
    4. Nav pill: fix z-index / size so it's not covered up.
    5. Nav width: audit and fix the ~16px overwidth issue.

---

## Phase 6: Documentation

  * **Depends on**: Phases 1-5 (content exists, code works)

### 6A. Update `JSON_ARCHITECTURE.md`

  File: `/assets/docs/JSON_ARCHITECTURE.md`

  * Complete rewrite reflecting v5.0 reality:
    - v5.0 flat schema with all field definitions
    - `homepage-content.json` format and how to change it
    - Tag system: 4 groups (role, skill, product, company)
    - URL routing (flat slugs via 404.html)
    - File structure map
    - Data flow: config → data-loader → controllers → HTML

### 6B. Create Entry Creation SOP

  File: `/assets/docs/ENTRY_SOP.md`

  * Protocol for agents (or humans) creating new project entry JSON files:
    1. Run `project` command (or `new_project.py`) to generate blank v5.0 template
    2. **Always check `/assets/docs/tags.json`** before creating any tag — use existing tags, don't create near-duplicates
    3. Writing guidelines for each copy field (`challenge`, `approach`, `result`, `role_headline`, etc.)
    4. Quality checklist (required fields, file path verification, tag registry update)
    5. How to add the entry to `homepage-content.json` if it should appear on the homepage
    6. Run `validate_v5.py` after creating the entry
    7. Run `generate_manifest.py` to update the manifest

### 6C. Create `README.md`

  File: `/README.md`

  * Project overview for the repository:
    - What this is (modular JSON-driven portfolio)
    - How to run locally
    - How to add/edit project entries (link to SOP)
    - How to change homepage content (edit `homepage-content.json`)
    - Architecture overview (link to `JSON_ARCHITECTURE.md`)
    - Deployment (GitHub Pages)

### 6D. Create Portfolio Entry for This Website

  Create a v5.0 entry JSON for this portfolio website itself (the modular system we're building). This is a legitimate project showcasing: HTML/CSS/JS, GitHub Pages, Jekyll, JSON architecture, dynamic content, responsive design, scroll-driven animation.

---

## Phase 7: Manual Testing (was Phase 6)

  * **Depends on**: ALL above

### Local (`python3 -m http.server 5500`)

  * **Homepage `/`**:
    - [ ] Stats count up correctly (dynamic counts from entries)
    - [ ] Hero images scroll with drift animation (9 images from entries, looped to 18)
    - [ ] Flip headlines rotate every 5s (5 `role_headline` values)
    - [ ] CTA buttons link correctly
    - [ ] Showcase tabs switch, each shows correct filtered projects
    - [ ] Credential cards show 4 companies in correct order
    - [ ] Process cards scroll horizontally, links work
    - [ ] Creative cards show images, link to tag-filtered section pages
    - [ ] Impact stats display 4 metrics from entries
    - [ ] Achievement accordion expands/collapses
    - [ ] Final CTA buttons link correctly
    - [ ] Scroll reveal animations fire
    - [ ] Nav hides/shows on scroll direction
    - [ ] Nav pill appears/disappears correctly
    - [ ] Trio bridge animates during hero scroll transition
    - [ ] 4-phase hero scroll animation works smoothly

  * **Section page `/section.html?tags=Web+Developer`**:
    - [ ] Projects filter correctly
    - [ ] Tag pills show all 4 groups (role, skill, product, company)
    - [ ] Multi-select filtering works
    - [ ] URL updates with hash on tag change
    - [ ] Removing all tags shows all projects

  * **Entry page `/{slug}`**:
    - [ ] All content loads from v5.0 flat paths
    - [ ] Role, skill, product tags appear as link pills
    - [ ] Related posts render correctly
    - [ ] No breadcrumbs visible

  * **Mobile (375px)**:
    - [ ] All homepage sections stack correctly
    - [ ] Touch scroll works on process cards
    - [ ] Credential tag scrolling works
    - [ ] Hero scroll animation works on mobile

  * **404 routing**:
    - [ ] `/saas-product-sale-features` loads entry page
    - [ ] Invalid slug shows 404 message

---

## Dependency Graph + Agent Parallelization

  ```
  PHASE 0 (Schema Lock) ──── MUST COMPLETE FIRST
          │
          ├── PHASE 1 (Entry Recreation)
          │   sequential: 1A (role research) → Sean approves → 1B (write all 36 entries) → 1C-G
          │
          ├── PHASE 2 (JS Layer) ── can start with schema interface, no data needed
          │   2A (data-loader) → 2B (landing-controller)
          │                    → 2C-2F (entry/tile/section/filter controllers, parallel)
          │                    → 2G (delete old controller)
          │
          ├── PHASE 3 (HTML) ── parallel with Phase 2
          │   3A (index.html) + 3B-D (section, entry, 404)
          │
          ├── PHASE 4 (CSS) ── parallel with Phase 2-3
          │   4A (landing.css) → 4B (wire up)
          │
          ├── PHASE 5 (Build + Wiring) ── after Phases 1-4
          │   5A (manifest) → 5B (validation) → 5C (homepage-content.json) → 5D (scroll animation polish)
          │
          ├── PHASE 6 (Documentation) ── after Phases 1-5
          │   6A (JSON_ARCHITECTURE.md) + 6B (ENTRY_SOP.md) + 6C (README.md) + 6D (portfolio entry)
          │
          ├── PHASE 7 (Testing) ── after ALL above
          │
          └── PHASE 8 (Portfolio-as-Product) ── optional final phase
  ```

  * **Agent Workstreams** (can run in parallel once Phase 0 locks):

| Agent                 | Scope              | Files                                                               |
| --------------------- | ------------------ | ------------------------------------------------------------------- |
| **A: Entry Creation** | 1A-1G, 5A, 5B      | `validate_v5.py`, `_entry_template.json`, `generate_manifest.py`,   |
|                       |                    | `new_project.py`, all 36 `uid-*.json`, `tags.json`                  |
| --------------------- | ------------------ | ------------------------------------------------------------------- |
| **B: Core JS**        | 2A, 2B             | `data-loader.js`, `landing-controller.js` (sequential: 2A then 2B)  |
| --------------------- | ------------------ | ------------------------------------------------------------------- |
| **C: Secondary JS**   | 2C, 2D, 2E, 2F, 2G | `entry-controller.js`, `tile-renderer.js`, `section-controller.js`, |
|                       |                    | `filter-controller.js` (rewrite), delete `homepage-controller.js`   |
| --------------------- | ------------------ | ------------------------------------------------------------------- |
| **D: HTML + CSS**     | 3A-3D, 4A-4B       | `index.html`, `section.html`, `entry.html`,                         |
|                       |                    | `404.html`, `landing.css`                                           |
| --------------------- | ------------------ | ------------------------------------------------------------------- |
| **E: Documentation**  | 6A-6D              | `JSON_ARCHITECTURE.md`, `ENTRY_SOP.md`,                             |
|                       |                    | `README.md`, portfolio entry JSON                                   |
| --------------------- | ------------------ | ------------------------------------------------------------------- |

  * **Phase 1A** (role tag research) should happen first so Agent A has the finalized tag list before creating entries. Sean reviews the proposed role list before Agent A begins writing entries.

  * **Note**: `generate_manifest.py` currently fails (likely due to deleted `placement.json` + schema mismatch). Will be fixed as part of Phase 1E when it's updated for v5.0 root-level `slug`.

---

## Files Summary

### Create

| File                              | Purpose                                             |
| --------------------------------- | --------------------------------------------------- |
| `assets/js/landing-controller.js` | New homepage controller                             |
| `assets/js/homepage-content.json` | Tag-based homepage section config                   |
| `assets/docs/tags.json`           | Running tag registry                                |
| `assets/docs/ENTRY_SOP.md`        | Agent protocol for creating entries                 |
| `assets/scripts/validate_v5.py`   | Entry validation script                             |
| `landing.css`                     | Homepage-specific styles (extracted from prototype) |
| `README.md`                       | Project README                                      |

### Rewrite (full recreation)

| File                                 | Change                                                             |
| ------------------------------------ | ------------------------------------------------------------------ |
| `assets/entries/uid-*.json` (all 36) | Recreated in v5.0 schema with rewritten copy, new tags, new fields |

### Modify

| File                               | Change                                                           |
| ---------------------------------- | ---------------------------------------------------------------- |
| `index.html`                       | Replace with dynamized prototype                                 |
| `assets/js/data-loader.js`         | v5.0 paths + new filter functions                                |
| `assets/js/entry-controller.js`    | v5.0 paths + tag display, `challenge`/`approach`/`result` labels |
| `assets/js/tile-renderer.js`       | v5.0 paths                                                       |
| `assets/js/section-controller.js`  | Remove section logic, 4 tag groups                               |
| `assets/js/filter-controller.js`   | Shadcn-style multi-select dropdown with counters                 |
| `section.html`                     | Nav/footer update                                                |
| `entry.html`                       | Remove breadcrumbs, add tag pills, rename section labels         |
| `404.html`                         | Script references                                                |
| `assets/docs/_entry_template.json` | v5.0 schema with writing guidelines                              |
| `generate_manifest.py`             | v5.0 slug path                                                   |
| `assets/scripts/new_project.py`    | v5.0 template                                                    |
| `assets/docs/JSON_ARCHITECTURE.md` | Full rewrite for v5.0 architecture                               |

### Delete

| File                               | Reason                              |
| ---------------------------------- | ----------------------------------- |
| `assets/js/homepage-controller.js` | Replaced by `landing-controller.js` |

### Archive

| File                     | Destination               |
| ------------------------ | ------------------------- |
| `landing-prototype.html` | `assets/docs/archive/v2/` |

---

## Phase 8: Portfolio-as-Product Package (Final, Optional)

  * **Depends on**: All above complete and working

  * **Goal**: Package this modular JSON-driven portfolio concept so it could be offered to others as a starter kit / template.

### 8A. Sean: Create New Directory + GitHub Repository

  * Manual setup steps for Sean:
    1. Create new project directory (e.g., `~/Development/portfolio-starter`)
    2. Initialize git repo
    3. Create GitHub repository
    4. Push initial commit

### 8B. Agentic Entry Creation Pipeline (Key Differentiator)

  * **The upsell:** Users don't just get a portfolio template — they get an AI-powered content pipeline that can autonomously create new portfolio entries from project documentation.

  * **What the pipeline does end-to-end:**
    1. Agent reads project docs (README, internal docs, external URLs)
    2. Researches the project via web scraping if needed (old portfolio pages, live sites)
    3. Writes all v5.0 entry fields: copy (`challenge`/`approach`/`result`), tags (checked against `tags.json` to prevent duplicates), SEO fields, tile text, `role_headline`, CTAs
    4. Takes screenshots of live sites/apps using browser automation tools
    5. Processes images through Cloudinary API (crop, resize, convert to .webp) — see `CLOUDINARY_IMAGE_API.md`
    6. Creates media directory + downloads processed images with correct naming convention
    7. Writes the JSON entry file with auto-generated UID
    8. Runs `validate_v5.py` to verify schema compliance
    9. Runs `generate_manifest.py` to register the new entry
    10. Updates `tags.json` with any new tags
    11. Optionally updates `homepage-content.json` to feature the new entry

  * **Key files that enable this:**
    - `ENTRY_SOP.md` — Step-by-step procedure the agent follows
    - `_entry_template.json` — v5.0 schema template
    - `tags.json` — Tag registry prevents duplicates
    - `CLOUDINARY_IMAGE_API.md` — Full API reference for image processing
    - `AGENT_CREATING_ENTRIES.md` — Project list with context for batch creation
    - `validate_v5.py` — Automated quality gate
    - `generate_manifest.py` — Automatic registration
    - `new_project.py` — UID generation + template scaffolding

  * **Packaging for the starter kit:**
    - Include all pipeline scripts and docs
    - Provide a `.env.example` with `CLOUDINARY_CLOUD_NAME` placeholder
    - Include the `AGENT_CREATING_ENTRIES.md` template (blank project list format)
    - Write a "Getting Started with Agentic Entry Creation" section in the implementation guide
    - The pipeline works with any AI coding agent (Claude Code, Cursor, Copilot Workspace, etc.)

  * **Why this is compelling:** Most portfolio templates require manual content creation. This one lets you point an agent at a GitHub repo or project doc and get a polished, validated, image-ready portfolio entry in minutes. For someone with 20+ projects, that's hours of work eliminated.

### 8C. Create Implementation Guide

  File: `IMPLEMENTATION_GUIDE.md` in the new repo

  * An "exclusively executable" guide that takes someone from zero to a working portfolio:
    1. Repository setup and file structure
    2. How the JSON-driven architecture works
    3. Creating the first project entry (with the SOP)
    4. **Agentic entry creation** — how to use AI agents to batch-create entries from project docs
    5. Configuring the homepage via `homepage-content.json`
    6. Customizing the design system (colors, fonts, trio element)
    7. Deploying to GitHub Pages
    8. How to "tailor" the homepage for different job applications

  This guide benefits from being written AFTER implementation — the agent writing it will have full context of every file, every decision, every pattern. That context produces a far better guide than writing it speculatively.

### 8D. Create Starter Template Files

  * Strip Sean's personal content from copies of the core files:
    - Blank `homepage-content.json` with placeholder structure
    - Empty `_entry_template.json` with field documentation
    - Core JS files (data-loader, landing-controller, etc.) — these are generic
    - CSS files with customizable variables
    - HTML templates with generic placeholder text
    - Example entry JSON with dummy data
    - All pipeline scripts (`validate_v5.py`, `generate_manifest.py`, `new_project.py`)
    - Cloudinary image processing guide (generalized)
    - Blank `AGENT_CREATING_ENTRIES.md` template
