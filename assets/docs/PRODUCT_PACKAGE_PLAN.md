# Portfolio-as-Product Package Plan

Comprehensive plan for turning the august.style portfolio into a reusable, client-onboardable product. This document is designed to be consumed by a fresh AI agent session that will execute the packaging work.

**Source concept**: `assets/docs/archive/v2/v2_4_UPDATE_PLAN.md` Phase 8 (lines 977-1054)

---

## 1. Product Concept

A JSON-driven portfolio template with an AI-powered entry creation pipeline. Not just a static template — it includes tooling that lets an AI agent autonomously create portfolio entries from project documentation, screenshots, and live sites.

### What makes it unique

Most portfolio templates require manual content creation for every project. This one:
- Uses a **structured JSON schema** where each project is a single file with all content, tags, images, SEO data
- Has a **configurable homepage** that reshapes entirely by changing tag filters in one JSON file
- Includes an **agentic SOP** that AI coding agents (Claude Code, Cursor, etc.) can follow to create entries end-to-end: write copy, take screenshots, process images, upload to CDN, validate, register
- Pre-renders **SEO meta tags** per entry for social sharing
- Supports **tag-based filtering** across roles, skills, products, and companies

### Target users

Developers, designers, and creative professionals with 10+ projects who want a polished portfolio without manually writing content for each one. Especially compelling for anyone already using AI coding tools.

---

## 2. Repository Structure

### New repo: `portfolio-starter`

Create a new GitHub repository. Copy and genericize files from `360-design`. The structure:

```
portfolio-starter/
+-- index.html                     Homepage (landing page) — genericized
+-- entry.html                     Entry page template — genericized
+-- section.html                   Section/filter page — genericized
+-- 404.html                       SPA routing for section pages
+-- landing.css                    Homepage styles — CSS variables for theming
+-- styles.css                     Entry + section page styles — CSS variables
+-- generate_manifest.py           Manifest + entry HTML generator
+-- setup.py                       NEW: Interactive setup script
|
+-- assets/
|   +-- js/
|   |   +-- data-loader.js        Generic (no personal content)
|   |   +-- landing-controller.js  Generic
|   |   +-- section-controller.js  Needs owner name extracted to config
|   |   +-- entry-controller.js    Generic
|   |   +-- tile-renderer.js       Generic
|   |   +-- filter-controller.js   Generic
|   |   +-- homepage-content.json  Starter template with placeholder content
|   |
|   +-- entries/
|   |   +-- uid-example-001.json   Example entry with dummy data
|   |
|   +-- docs/
|   |   +-- ENTRY_SOP.md           Entry creation procedure (genericized)
|   |   +-- _entry_template.json   Blank v5.0 entry template
|   |   +-- tags.json              Starter tag registry (minimal defaults)
|   |   +-- JSON_ARCHITECTURE.md   Architecture reference
|   |   +-- CLOUDINARY_SETUP.md    NEW: How to set up Cloudinary free account
|   |   +-- CDN_SETUP.md           NEW: How to set up Cloudflare R2
|   |
|   +-- scripts/
|       +-- new_project.py         UID generator + template scaffolding
|       +-- validate_v5.py         Entry schema validator
|
+-- .env.example                   Template: CLOUDINARY_URL, CDN endpoint, site domain
+-- .github/workflows/manifest.yml Auto-generate manifest on push
+-- IMPLEMENTATION_GUIDE.md        Full getting-started guide
+-- README.md                      Project overview + quick start
```

---

## 3. Files to Copy vs. Genericize vs. Create New

### Copy directly (already generic)

These files contain no personal content and work as-is:

| File | Notes |
|------|-------|
| `assets/js/data-loader.js` | Pure utility — filtering, caching, normalization |
| `assets/js/landing-controller.js` | Renders homepage from config, no hardcoded content |
| `assets/js/entry-controller.js` | Populates entry from JSON, no personal refs |
| `assets/js/tile-renderer.js` | DOM construction, fully generic |
| `assets/js/filter-controller.js` | Filter UI, fully generic |
| `assets/scripts/new_project.py` | UID generator |
| `assets/scripts/validate_v5.py` | Schema validator |
| `generate_manifest.py` | Manifest + HTML generator |
| `assets/docs/_entry_template.json` | Blank template |
| `assets/docs/JSON_ARCHITECTURE.md` | Architecture reference (update file paths) |
| `.github/workflows/manifest.yml` | Auto-manifest on push |

### Genericize (replace personal content)

| File | What to change |
|------|----------------|
| `index.html` | Replace "Sean August Horvath" with placeholder, update meta tags, remove specific nav links |
| `entry.html` | Replace footer name/links, remove specific social URLs |
| `section.html` | Replace meta tag defaults with placeholders |
| `404.html` | No personal content, but review |
| `landing.css` | Keep as-is — CSS variables already enable theming |
| `styles.css` | Keep as-is |
| `assets/js/section-controller.js` | Lines 96-103: Replace hardcoded "Sean August Horvath" with a config value. Add `site_config.json` or read from `homepage-content.json._metadata.owner_name` |
| `assets/js/homepage-content.json` | Replace with starter template (see Section 5) |

### Create new

| File | Purpose |
|------|---------|
| `setup.py` | Interactive setup script (prompts for name, domain, CDN config) |
| `.env.example` | Template for credentials |
| `assets/docs/CLOUDINARY_SETUP.md` | Step-by-step Cloudinary free account setup |
| `assets/docs/CDN_SETUP.md` | Step-by-step Cloudflare R2 setup with custom domain |
| `IMPLEMENTATION_GUIDE.md` | Complete getting-started guide |
| `assets/entries/uid-example-001.json` | Example entry with realistic dummy data |

---

## 4. Hardcoded References to Find and Extract

Strings that reference Sean specifically and must be genericized:

| Location | Current Value | Solution |
|----------|--------------|----------|
| `index.html` nav | "Sean August Horvath" | Read from config |
| `index.html` meta tags | og:title, og:description with name | Populated by setup script |
| `entry.html` footer | "Sean August Horvath", social links | Read from config |
| `section.html` meta | "Sean August Horvath" | Read from config |
| `section-controller.js:96-103` | Hardcoded name in title/description | Read from `homepage-content.json._metadata.owner_name` |
| `entry-controller.js` og:url | `august.style` domain | Read from config or `.env` |
| `generate_manifest.py` | `august.style` in canonical URL | Read from `.env` or `site_config.json` |
| `ENTRY_SOP.md` | Cloudinary cloud name, R2 endpoint, CDN domain | Reference `.env` |
| Various social links | GitHub/LinkedIn/Instagram URLs | Configurable in `homepage-content.json` or HTML |

### Recommended config approach

Add a `_metadata` block to `homepage-content.json`:

```json
{
  "_metadata": {
    "version": "1.0",
    "owner_name": "Your Name",
    "site_domain": "yourdomain.com",
    "description": "Controls which entries appear in each homepage section."
  }
}
```

Or create a separate `site_config.json`:

```json
{
  "owner_name": "Your Name",
  "site_domain": "yourdomain.com",
  "site_title": "Your Name — Your Tagline",
  "site_description": "Portfolio of Your Name.",
  "social_links": {
    "github": "",
    "linkedin": "",
    "instagram": "",
    "email": ""
  }
}
```

The separate file approach is cleaner — it keeps identity separate from content configuration. All controllers that currently hardcode the name would read from this config instead.

---

## 5. Starter `homepage-content.json`

Replace Sean's content with a well-documented starter template:

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Controls which entries appear in each homepage section. Change tags to reshape the entire homepage for a specific job target."
  },
  "hero": {
    "filter": { "any": ["Your Primary Role"] },
    "cta_primary_text": "See Projects",
    "cta_secondary": {
      "text": "All Projects",
      "filter": { "any": [] }
    }
  },
  "showcase": {
    "heading": "Featured Work",
    "tabs": [
      {
        "id": "tab1",
        "label": "All",
        "filter": { "any": ["Your Primary Role"] }
      }
    ]
  },
  "credentials": {
    "heading": "Experience",
    "items": []
  },
  "process": {
    "heading": "Process",
    "filter": { "any": [] }
  },
  "creative": {
    "heading": "Creative Work",
    "cards": []
  },
  "impact": {
    "heading": "Impact",
    "filter": { "any": [] }
  },
  "achievements": {
    "heading": "Achievements",
    "filter": { "any": [] }
  },
  "cta_section": {
    "heading": "Interested in working together?",
    "primary": { "text": "See All Projects", "filter": { "any": [] } },
    "secondary": { "text": "Get in Touch", "href": "mailto:" }
  }
}
```

---

## 6. Starter `tags.json`

Minimal defaults that work out of the box:

```json
{
  "role": ["Developer", "Designer"],
  "skill": ["HTML/CSS/JS"],
  "product": ["Website"],
  "company": ["Freelance"]
}
```

Users expand this as they add entries. The SOP instructs checking existing tags before creating new ones.

---

## 7. Setup Script (`setup.py`)

Interactive Python script that runs on first clone:

```
$ python3 setup.py

Portfolio Starter Kit Setup
===========================

Your name: Jane Smith
Site domain (e.g., janesmith.com): janesmith.com
Cloudinary cloud name (from cloudinary.com/console): abc123xyz
R2 bucket name: portfolio
R2 account ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2 custom domain (e.g., cdn.janesmith.com): cdn.janesmith.com

Email for contact link: jane@example.com
GitHub username (optional):
LinkedIn URL (optional):

Writing .env...
Updating site_config.json...
Updating index.html...
Updating entry.html...
Updating section.html...
Updating ENTRY_SOP.md...

Done! Next steps:
1. Run `python3 -m http.server 5500` to preview locally
2. Read IMPLEMENTATION_GUIDE.md for the full walkthrough
3. Create your first entry with `python3 assets/scripts/new_project.py`
```

The script:
1. Prompts for all configurable values
2. Writes `.env` from `.env.example`
3. Creates/updates `site_config.json`
4. Does find-and-replace in HTML files (name, social links, meta tags)
5. Updates `ENTRY_SOP.md` with the user's Cloudinary cloud name and R2 endpoint
6. Updates `generate_manifest.py` canonical URL domain

---

## 8. Theming System

The CSS already uses CSS custom properties in `:root`. Document these as the theming API:

```css
:root {
  /* Background hierarchy */
  --bg: #1f1f1f;       /* Page background */
  --bg2: #272727;       /* Card/section background */
  --bg3: #2f2f2f;       /* Elevated surface */

  /* Text hierarchy */
  --text: #EBEBEB;      /* Primary text */
  --text2: #D7CDCC;     /* Secondary text */
  --muted: #9a9590;     /* Muted/label text */

  /* Accent colors */
  --terra: #C9A68A;     /* Primary accent (buttons, highlights) */
  --blue: #8FA9B3;      /* Secondary accent */
  --mauve: #C99CAD;     /* Tertiary accent */

  /* Layout tokens */
  --r: 6px;             /* Border radius */
  --g: 16px;            /* Grid gap */
  --f: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;  /* Font stack */
}
```

To theme: override these variables. For a light theme, swap `--bg` and `--text` values and adjust accents. The entire design system responds.

Add a `THEMING.md` doc or section in the implementation guide explaining:
- Which variables control what
- How to swap to a light theme
- How to change the font (swap `--f` and the Google Fonts link in `index.html`)
- The "trio" bridge element between hero and content — explain how it works visually

---

## 9. Implementation Guide Outline

`IMPLEMENTATION_GUIDE.md` — the primary document users read after cloning:

### 1. Quick Start
- Clone repo, run `setup.py`, preview locally
- Deploy to GitHub Pages (Settings > Pages > main branch)

### 2. How It Works
- JSON-driven architecture: entries, tags, homepage config
- How the homepage reshapes via filter objects
- URL routing: entry pages (pre-rendered), section pages (404.html)

### 3. Your First Entry
- Walk through creating one entry manually following ENTRY_SOP.md
- Explain each JSON field with real examples
- Show the result in the browser

### 4. Agentic Entry Creation
- How to point an AI agent at the SOP
- Example prompt for Claude Code / Cursor
- What the agent does end-to-end
- Batch creation: providing a project list

### 5. Configuring the Homepage
- Explain each section in `homepage-content.json`
- How to add/remove tabs, credentials, creative cards
- How to pivot for different job applications (change hero filter, update CTAs)

### 6. Customizing the Design
- CSS variable reference
- Changing colors, fonts, border radius
- Light theme example
- Modifying the trio bridge element

### 7. Image Pipeline
- Cloudinary setup (free plan)
- R2 CDN setup (free tier)
- Processing workflow: upload, transform, download, delete, upload to CDN
- Naming conventions

### 8. Deployment
- GitHub Pages (default)
- Vercel / Netlify alternatives
- Custom domain setup
- CDN domain setup (Cloudflare R2 custom domain)

### 9. Tailoring for Job Applications
- Change `homepage-content.json` filters to highlight relevant work
- Update hero CTA text, showcase tabs, credential items
- Example: pivoting from "Web Developer" to "Brand Designer" focus

---

## 10. Testing the Product

Before releasing, validate the full user journey:

### Test 1: Fresh clone setup
1. Clone the starter repo to a new directory
2. Run `setup.py` with test values
3. Verify all files are updated correctly
4. Preview locally — homepage should render with empty/example content

### Test 2: Manual entry creation
1. Follow ENTRY_SOP.md to create one entry from scratch
2. Validate, generate manifest
3. Verify entry appears on homepage and section page
4. Verify entry page loads with correct meta tags

### Test 3: Agentic entry creation
1. Give an AI agent only the SOP and a project description
2. Verify it can complete the full workflow without human intervention
3. Note any steps where it gets stuck

### Test 4: Homepage customization
1. Modify `homepage-content.json` filters
2. Verify sections show/hide correctly
3. Verify tag-based filtering still works on section page

### Test 5: Theming
1. Change CSS variables in `:root`
2. Verify the entire design updates consistently
3. Test a light theme inversion

### Test 6: Deployment
1. Push to GitHub Pages
2. Verify entry pages resolve to `/{slug}/` with correct meta tags
3. Test social sharing (Facebook debugger, LinkedIn inspector)

---

## 11. Gaps to Fill Before Packaging

| Gap | Priority | Effort | Notes |
|-----|----------|--------|-------|
| `site_config.json` system | High | ~2 hrs | Create config file, update all controllers to read from it instead of hardcoding name/domain |
| `setup.py` interactive script | High | ~2 hrs | Prompts for values, writes config, updates HTML |
| `IMPLEMENTATION_GUIDE.md` | High | ~3 hrs | Full walkthrough (see outline above) |
| `CLOUDINARY_SETUP.md` | Medium | ~30 min | Step-by-step free account setup with screenshots |
| `CDN_SETUP.md` | Medium | ~30 min | R2 bucket creation, custom domain, API token |
| `THEMING.md` or section | Medium | ~30 min | CSS variable reference, light theme example |
| Example entry with dummy data | Medium | ~30 min | Realistic but fictional project entry |
| Genericize social links in HTML | Low | ~15 min | Move to `site_config.json`, render via JS |
| `section-controller.js` name extraction | Low | ~15 min | Read owner name from config instead of hardcoding |
| `generate_manifest.py` domain extraction | Low | ~15 min | Read domain from `.env` or config |
| Test suite for setup flow | Low | ~1 hr | Automated test that setup.py works correctly |

### Execution order

1. Create `site_config.json` + update controllers (foundation for everything else)
2. Write `setup.py` (uses `site_config.json`)
3. Genericize HTML files (use `site_config.json` values)
4. Create example entry
5. Write `CLOUDINARY_SETUP.md` and `CDN_SETUP.md`
6. Write `IMPLEMENTATION_GUIDE.md` (can reference all above)
7. Test full user journey
8. Create GitHub repo, push, test fresh clone

---

## 12. Existing Files Reference

These files in the current `360-design` repo contain the patterns and implementations to copy/adapt:

| File | Path | Relevance |
|------|------|-----------|
| Homepage controller | `assets/js/landing-controller.js` | Renders all homepage sections from config |
| Data loader | `assets/js/data-loader.js` | All filtering, caching, tag matching logic |
| Entry SOP | `assets/docs/ENTRY_SOP.md` | The agentic entry creation procedure |
| Architecture ref | `assets/docs/JSON_ARCHITECTURE.md` | Full technical documentation |
| Entry template | `assets/docs/_entry_template.json` | v5.0 schema template |
| Tag registry | `assets/docs/tags.json` | Current tag structure |
| Homepage config | `assets/js/homepage-content.json` | Current homepage configuration (basis for starter template) |
| CSS design tokens | `landing.css` lines 9-22 | `:root` CSS custom properties |
| Phase 8 concept | `assets/docs/archive/v2/v2_4_UPDATE_PLAN.md` lines 977-1054 | Original product packaging vision |
| Manifest generator | `generate_manifest.py` | Entry HTML generation + manifest |
| Schema validator | `assets/scripts/validate_v5.py` | Entry validation |
| UID generator | `assets/scripts/new_project.py` | New entry scaffolding |
