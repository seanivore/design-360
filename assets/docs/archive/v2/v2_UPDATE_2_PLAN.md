# v2.0 Portfolio Update — Implementation Plan

> **Goal**: A modular, JSON-driven portfolio where every landing page component is populated by tags. Swap the tags → the whole site reshapes for a different job application. The homepage *feels* like it was made for the hiring manager reading it.

---

## Design Decisions (Settled)

- **Two tag groups**: `role` (job titles) and `skill` (capabilities/tools, no overlap with role names)
- **No industry tags** — avoids pigeonholing
- **Flat URLs**: `/{slug}` instead of `/{section}/{sub_section}/{slug}` — breaks old URLs
- **`homepage-content.json`**: tags only — each key is a component, each value is tag array(s)
- **Landing page layout**: hardcoded in HTML (like [section.html](/section.html)), populated dynamically by tags
- **Entry schema**: extended with new copy fields discovered through prototyping (see Phase 2)
- **Prototype-first**: build a standalone wireframe HTML with real data, iterate, then template-ize

---

## Phase 1: Tag System & Foundation

Everything depends on the new tag structure. Do this first.

### New Tag Groups

**Roles** (job titles — drive showcase tabs):

| Role                      | Covers                                           |
| ------------------------- | ------------------------------------------------ |
| Web Developer             | HTML/CSS/JS builds, full-stack, SPA architecture |
| Graphic Designer          | Digital art, print, brand assets, generative     |
| Social Media Manager      | Campaigns, content calendars, paid social        |
| Video Editor              | Production, editing, motion, viral content       |
| Art Director              | Vision, team leadership, multi-channel           |
| Content Strategist        | Editorial, copywriting, SEO, content systems     |
| UX/UI Designer            | App design, wireframes, prototyping, flows       |
| Brand Designer            | Identity systems, style guides, brand voice      |
| Digital Marketing Manager | Ads, analytics, conversion, campaigns            |
| Account Manager           | Client relations, project coordination           |
| Automation Engineer       | APIs, workflows, agentic systems, scripting      |

**Skills** ~~(never restate a role name)~~:

Tools: HTML/CSS/JS, Python, JavaScript, React, Webflow, Framer, Figma, After Effects, Photoshop, Illustrator, Lightroom, Creative Cloud, DaVinci Resolve, CapCut, Lottie, Make.com, Notion, GitHub Pages, Jekyll, Git, Midjourney, Claude/Cursor, Generative AI, Adobe Firefly

Techniques: Illustration, Animation, Motion Graphics, Typography, Print Layout, Photography, Product Staging, Copywriting, SEO, Analytics, A/B Testing, Responsive Design, CSS Animation, Landing Page Design, Data Visualization, Dashboard Design, Voice Interface, E-Commerce, CMS Management, No-Code, Automation, API Integration, Scaling Systems, Art Direction, Editorial Design, Lookbook Design, Video Production, Content Production, Publishing

### Schema Migration (v3.2 → v4.0)

```diff
 "categorization": {
-    "placement": { "section": "Web", "sub_section": "HTML/CSS/JS", "slug": "..." },
-    "tagging": { "technology": [...], "media": [...], "role": "...", "skill": [...] }
+    "slug": "saas-product-sale-features",
+    "tags": {
+      "role": ["Web Developer", "Content Strategist"],
+      "skill": ["HTML/CSS/JS", "CSS Animation", "Copywriting"]
+    }
 }
```

### Files Changed in Phase 1

| Action | File                                                      | What                                |
| ------ | --------------------------------------------------------- | ----------------------------------- |
| MODIFY | All 36 `assets/entries/uid-*.json`                        | Migrate tags via Python script      |
| MODIFY | [_entry_template.json](/assets/docs/_entry_template.json) | New v4.0 schema                     |
| MODIFY | [data-loader.js](/assets/js/data-loader.js)               | New filtering functions             |
| MODIFY | [generate_manifest.py](/generate_manifest.py)             | Flat slug keys                      |
| MODIFY | [manifest.json](/assets/js/manifest.json)                 | Regenerate with flat slugs          |
| MODIFY | [404.html](/404.html)                                     | New routing for flat URLs           |
| MODIFY | [section.html](/section.html)                             | Universal tag page                  |
| MODIFY | [section-controller.js](/assets/js/section-controller.js) | Remove section/subsection logic     |
| MODIFY | [filter-controller.js](/assets/js/filter-controller.js)   | Simplified tag toggling             |
| MODIFY | [entry.html](/entry.html)                                 | Remove breadcrumbs, add tag pills   |
| MODIFY | [entry-controller.js](/assets/js/entry-controller.js)     | New tag display, flat path handling |
| MODIFY | [tile-renderer.js](/assets/js/tile-renderer.js)           | Flat slug URLs                      |
| MODIFY | [styles.css](/styles.css)                                 | Tag pill styles, remove breadcrumbs |
| DELETE | [placement.json](/assets/js/placement.json)               | Replaced by tags-only system        |

---

## Phase 2: Landing Page Prototype

Build a standalone wireframe with real project data to **discover the exact entry schema additions** needed.

### Process

1. **Create [landing-prototype.html](file:///Users/seanivore/Development/360-design/landing-prototype.html)** — standalone page, viewable at `localhost:5500/landing-prototype.html`
2. **Hardcode real projects** into each component section — pick strong examples for each
3. **Iterate on layout** — review in browser, adjust, repeat
4. **Note every copy field** each component needs from a project entry
5. **User reviews** the prototype in browser before proceeding

### Component Sections (hardcoded layout, dynamic content)

Each maps to the *psychological purpose* from the SaaS anatomy:

| #   | Component           | SaaS Equivalent & Purpose                              |
| --- | ------------------- | ------------------------------------------------------ |
| 1   | **Navbar**          | Navbar, to navigate and CTA a button                   |
| 2   | **Hero**            | Hero; for instant credibility of stats and visuals     |
| 3   | **Showcase**        | Benefits; core content with tabbed grids, tag filtered |
| 4   | **Credentials**     | Partners/Trust; work history, org names and roles      |
| 5   | **Process**         | How It Works; 3-step 'how I work' verbs tag discovered |
| 6   | **Career Timeline** | Pricing Tiers; 3 era cards in price-column visual      |
| 7   | **Metrics**         | Testimonials; quantified project outcome stats         |
| 8   | **FAQ**             | FAQ; kill objections like why a generalist             |
| 9   | **CTA + Contact**   | CTA + Footer to close the deal                         |

### What the Prototype Discovers

As we build each component with real data, we'll find out exactly what the entry schema needs. Expected additions to `page_copy` (but the prototype will confirm):

```json
"page_copy": {
  "challenge": { "word": "...", "headline": "...", "body": "..." },
  "approach": { "word": "...", "headline": "...", "body": "..." },
  "outcome":  { "word": "...", "headline": "...", "body": "..." }
}
```

Three acts × three zoom levels. The prototype will validate whether this covers all components or if we need more fields.

---

## Phase 3: Template-ize & Wire Up

After prototype approval:

1. **Finalize entry schema** — add discovered copy fields to [_entry_template.json](/assets/docs/_entry_template.json)
2. **Update all 36 entries** — fill in new copy fields
3. **Create [homepage-content.json](/assets/js/homepage-content.json)** — tags only:
   ```json
   {
     "hero": ["Web Developer", "Graphic Designer", "Video Editor"],
     "showcase": [
       ["Web Developer"],
       ["Graphic Designer"],
       ["Video Editor"],
       ["Content Strategist"]
     ],
     "outcome_grid": ["Web Developer"],
     "approach_cards": ["Web Developer"]
   }
   ```
4. **Convert prototype → [index.html](/index.html)** — replace hardcoded data with JS that reads `homepage-content.json` tags and pulls from entry JSONs
5. **Create [landing-controller.js](/assets/js/landing-controller.js)** — drives all landing page components
6. **Delete [homepage-controller.js](/assets/js/homepage-controller.js)**
7. **Update [styles.css](/styles.css)** — landing page component styles
8. **Delete prototype** — `landing-prototype.html` no longer needed

---

## Phase 4: Verification

### Automated
- JSON validation script (all entries have slug, role[], skill[], no old keys)
- Manifest regeneration check (all slugs unique, flat)

### Manual (Local)
- Landing page: all components render, tabs switch, responsive at 375px
- Tag page: `?tags=Web+Developer` shows correct projects, pills filter
- Entry page: tag pills render, no breadcrumbs, content loads

### Live (GitHub Pages)
- `august.style/slug` → entry loads via 404 routing
- Old URLs → graceful fallback
- Mobile device test

---

## Execution Order Summary

```
Phase 1: Tag migration → data-loader → manifest → 404 → section page → entry page
Phase 2: landing-prototype.html → iterate with real data → user review
Phase 3: Finalize schema → update entries → homepage-content.json → template-ize index.html
Phase 4: Validate → test locally → push live
```
