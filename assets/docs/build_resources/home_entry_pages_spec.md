# Claude Code Agentic Workflow SPEC for Complete Site Testing & Implementation

  > 1 - Context PRIME `/Users/seanivore/Development/360-design/.claude/commands/prime.md`
  > 2 - Ingest the information from this file
  > 3 - Implement the Low-Level Tasks
  > 4 - Generate code that will satisfy High and Mid Level Objectives 
  > 5 - Perform all requested testing and validation, including visual spot-checking
  > 6 - Test complete site navigation flow across all three page types

---

## Objectives

### High-Level

  + Build two core remaining portfolio pages: Homepage (`./index.html`) and Entry Page Template (`./entry.html`)
    - Homepage showcases 4 section tiles with random project selection on each load
    - Entry pages display individual projects with related posts based on tag matching
  + Complete the "Single-JSON Portfolio Architecture" with full dynamic content population
  + Validate complete site navigation flow across all three page types: Homepage → Section Pages → Entry Pages

### Mid-Level

  + Create `./index.html` with three sections: Projects, About, Contact
  + Implement homepage tiles that randomly select `thumbnail_images` and `tile_text` from project JSON files in each section
  + Build `./entry.html` template that dynamically populates from JSON based on URL
  + Create `./assets/js/entry-controller.js` to handle URL parsing, JSON loading, and related posts logic
  + Implement time-seeded related posts algorithm (6-hour rotation) for consistent-but-changing recommendations
  + Ensure all pages work with both localhost testing (URL params) and production (404 routing)
  + Match existing design system from `./section.html` (dark mode, sharp corners, gradient background)

### Implementation Notes

  * **Dependencies:**

    + All Phase 1 files are complete, working, tested (`section.html`, all controllers, `data-loader.js`, etc.)
    + 15 JSON project entries exist in `./assets/entries/...`
    + `./assets/js/manifest.json` is current and complete
    + `./assets/js/placement.json` defines toggle tags, SEO metadata, and tag catalog

  * **Architecture Context:**

    + Read for full system understanding:
      - `/Users/seanivore/Development/360-design/assets/docs/ARCHITECTURE.md`
      - `/Users/seanivore/Development/360-design/assets/docs/SPEC.md` 
    + See JSON structure for dynamic population: 
      - `/Users/seanivore/Development/360-design/assets/docs/_entry_template.json` 
      - (example) `/Users/seanivore/Development/360-design/assets/entries/uid-eme-689.json` 
    + This is a "mini-SPA" using 404 routing trick for clean URLs on GitHub Pages
      - Localhost testing uses URL parameters (`?section=Web`) as workaround
      - All content dynamically populated from JSON
      - **ABSOLUTELY NO HARDCODING** - Task #14 includes anti-hardcoding audit

  * **Design Standards:** 

    + Strict mobile-first only 
      - E.g., no hover interactions because they don't work on mobile 
      - Smooth transitions @ 300ms cubic-bezier; sequential element fade in 
    + Dark mode only (light mode deferred; no need to set up for future light mode)
      - Charcoal background with a vertical gradient "glare" effect down the body background 
      - White text with consistent simple, timeless shadow/blend styling across ALL elements
    + Tiles for navigation
      - Sharp corners (no border-radius)
      - Realistic shading/shadow/blend again, timeless and simple; subtle layered shadows
    + Magazine feel via tile content and presentation 
      - Tiles are designed visual-first and have concise, direct, but enticing text 
      - User understands project entry without excessive clicking (HR doesn't have time for so many projects)

  * **Consistent Shadow Pattern:**
  
    + As mentioned for text blending, use site-wide consistent shadow/blend styling:
      - Soft layered shadows (like `0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05)`)
      - Applied to tiles, profile picture, text, and all visual elements
      - Creates clean, classic, timeless look 
      - A quickly aging out of trend aesthetic doesn't make sense for this kind of portfolio that is so easily updated 

  * **SEO Metadata Implementation:**

    + **Homepage SEO** (add to index.html head):
      ```html
      <title>Sean August Horvath | Creative Innovations Generalist</title>
      <meta name="description" content="Creative generalist portfolio spanning web development, print design, digital products, and video production. 14 years bridging art, product, and growth.">
      <meta property="og:title" content="Sean August Horvath | Creative Innovations Generalist">
      <meta property="og:description" content="Portfolio showcasing expertise across web, print, digital, and video projects.">
      <meta property="og:image" content="/assets/media/og-homepage.jpg">
      <meta property="og:image:alt" content="Sean August Horvath creative portfolio homepage">
      ```

    + **Entry Page SEO** (populate dynamically from JSON):
      ```javascript
      document.title = project.content.teaser_copy.seo_title;
      document.querySelector('meta[name="description"]').content = project.content.teaser_copy.seo_description;
      document.querySelector('meta[property="og:title"]').content = project.content.teaser_copy.seo_title;
      document.querySelector('meta[property="og:description"]').content = project.content.teaser_copy.seo_description;
      ```

    + **Section Page SEO** (dynamic from placement.json):
      - Pull from `placement.json > seo_metadata`
      - Replace `[Tag]` placeholder with actual tag name
      - Randomly select one thumbnail from matching projects for og:image

  * **JSON Structure Reference:**

```json
{
  "categorization": {
    "entry_id": "uid-iqi-479", 
    "placement": {
        "section": "Web",
        "sub_section": "Application", 
        "slug": "dynamic-modular-portfolio-architecture"
    },
    "tagging":{
        "technology": ["JavaScript", "JSON", "GitHub Pages"],
        "media": ["Portfolio Website", "Single-Page Application"],
        "role": "Systems Designer",
        "skill": ["Information Architecture", "Modular Design"]
    }
  },
  "content": {
    "media": {
        "video_embed": "", 
        "video_alt_text": "",
        "thumbnail_images": ["/assets/media/project/thumb1.jpg"], 
        "thumb_slideshow_alt_text": ["Project thumbnail showing..."],
        "page_imagery": ["/assets/media/project/img1.jpg"],
        "page_image_group_alt_text": ["Additional project image showing..."]
    },
    "assets": {
        "project_url_text": "",
        "project_url": "https://august.style",
        "github_repository": "https://github.com/seanivore/design-360"
    },
    "teaser_copy":{
        "seo_title": "Rapid Scaling Portfolio Pages Update Without Refresh",
        "seo_description": "Technically simple build using innovative concepts...", 
        "page_title": "Single-JSON Portfolio Architecture", 
        "page_subtitle": "50+ pages from 2 templates", 
        "breadcrumb": "Website Dynamic App",
        "tile_text": [
            "Real-time page updates without refreshing", 
            "Modular design - drop in one file to create entries"
        ]
    },
    "page_copy":{
        "pattern": "Traditional portfolios require maintaining 50+ HTML files...",
        "action": "Designed hybrid SPA architecture using 404 routing trick...", 
        "measured": "Result: Add new entries by creating one JSON file..." 
    }
  }
}
```

  * **Coding Standards:**
  
    + Use ES6+ (async/await, arrow functions, template literals)
    + All JavaScript in IIFE modules (avoid global scope pollution)
    + Extensive console logging with emoji prefixes (📂, ✅, ❌, 🔍, 📊)
    + Follow existing naming conventions from Phase 1 controllers
    + Comments explain WHY not WHAT (self-documenting code)

---

## Design Iteration Philosophy: Everything Is Fair Game

**CRITICAL: Phase 1 elements are starting points, NOT untouchable artifacts.**

### The "WORKING ✅" Label Doesn't Mean "Leave It Alone"

  * **Phase 1 was built for FUNCTIONALITY, not DESIGN PERFECTION**
    + Section pages work correctly - but may need visual refinement
    + Tag filtering functions - but typography/spacing might need adjustment
    + Headers/footers exist - but could benefit from polish
    + The goal is pixel-perfect design across ALL pages, not preserving existing code

### What You Should Actively Refine:

  * **Section Page Design (section.html):**
    + Tag filtering UI: spacing, sizing, typography, responsive behavior
    + Section tiles: ensure 16:9 aspect ratio looks perfect at all breakpoints
    + Magazine aesthetic: verify NO title/subtitle on section tiles, just visuals + text
    + Main filter heading: positioning, hierarchy, visual prominence
    + Toggle tags visibility: ensure only on section-type pages, hidden on click-through

  * **Navigation Elements:**
    + Headers: refine typography, spacing, responsive layout
    + Footers: perfect social icon sizing, alignment, shadow consistency
    + Breadcrumbs: typography hierarchy, clickability cues, spacing

  * **Site-Wide Consistency:**
    + Shadow pattern: MUST be identical across homepage, section, entry pages
    + Typography: H1/H2/H3/body scales should harmonize across all three page types
    + Spacing: tile grid gaps, section padding, margins - rhythmic across site
    + Colors: accent blue, text contrast, background gradients - consistent everywhere

### Visual Perfection Workflow:

  1. **Screenshot ALL page types during Playwright reviews:**
     + Homepage at 3 breakpoints
     + Section pages (both section-type AND click-through) at 3 breakpoints
     + Entry pages at 3 breakpoints

  2. **Compare section tiles to homepage tiles:**
     + Section: 16:9 landscape, magazine aesthetic, NO overlays
     + Homepage: 1:1 square, section name overlay, count badge
     + Both should have sharp corners, consistent shadows, perfect spacing

  3. **Iterate freely on Phase 1 CSS:**
     + Tag filtering not quite right? Adjust padding, font sizes, margins
     + Section tile spacing awkward? Change grid gaps, max-widths
     + Headers feel heavy? Lighten font weights, adjust line heights
     + Shadows inconsistent? Update to match new pages

  4. **Use Task 11 (Section Page Testing) as design refinement opportunity:**
     + This isn't just validation - it's your chance to perfect section.html
     + Take screenshots, review design, make improvements
     + Loop through screenshot → review → CSS adjustments → screenshot again

### The Bottom Line:

  * **Don't hold back just because an element was "already created"**
  * **Visual consistency and perfection trump preserving Phase 1 code as-is**
  * **Use Playwright to review the ENTIRE site, not just new pages**
  * **Make section.html, tag filtering, headers, footers look as polished as entry/homepage**
  * **The "WORKING ✅" label means functional - NOT visually perfect**

---

## Context

### Starting Context - Files Already Functional (Phase 1)

  * **Core Pages:**
    - `./section.html` (WORKING ✅)
    - `./404.html` (WORKING ✅)
    - `./styles.css` (WORKING ✅)

  * **JavaScript Modules:**
    - `./assets/js/data-loader.js` (WORKING ✅)
    - `./assets/js/tile-renderer.js` (WORKING ✅)
    - `./assets/js/filter-controller.js` (WORKING ✅)
    - `./assets/js/section-controller.js` (WORKING ✅)

  * **Data Files:**
    - `./assets/js/manifest.json` (WORKING ✅)
    - `./assets/js/placement.json` (WORKING ✅)
    - `./assets/entries/*.json` (15 entries - WORKING ✅)

  * **Documentation:**
    - `./assets/docs/ARCHITECTURE.md`
    - `./assets/docs/SPEC.md`
    - `./assets/docs/_entry_template.json`

### Context at Completion

  * **Create New Pages:**
    - `index.html` (homepage)
    - `entry.html` (entry page template)

  * **Create New JavaScript:**
    - `/assets/js/entry-controller.js`
    - `/assets/js/homepage-controller.js`

  * **Polish the Design of Two Content Tile Types & All Other Website Pages & Elements:** 
    - Homepage tile (links out to site section)
    - Section page tiles (filtered by tags, for site section and beyond)
    - `section.html`
    - `./styles.css`

  * **Assets Needed:**
    - Profile picture at `./assets/media/profile-picture-horvath.webp` 
    - Social icons (SVG or icon font)

---

## Browser Automation & Visual Design Testing

### CRITICAL: Playwright Browser Automation Workflow

  * **Installed Skill:** Playwright Browser Automation at `~/.claude/plugins/marketplaces/playwright-skill/`
    + **Purpose:** Automated testing AND iterative visual design perfection
    + **Key Capability:** Take screenshots at multiple viewports to review and refine UI design

  * **MANDATORY: Use Headless Mode for Screenshot Loops**
    + Always use `headless: true` when taking screenshots for design review
    + Prevents browser windows from popping up on screen during iterative loops
    + Only use `headless: false` (visible browser) for interactive debugging

  * **Visual Design Perfection Workflow:**

    1. **Auto-detect dev server:**
       ```bash
       cd ~/.claude/plugins/marketplaces/playwright-skill/skills/playwright-skill && node -e "require('./lib/helpers').detectDevServers().then(servers => console.log(JSON.stringify(servers)))"
       ```

    2. **Take screenshots at all breakpoints (HEADLESS MODE):**
       + Mobile: 375x667px
       + Tablet: 768x1024px  
       + Desktop: 1920x1080px
       + Full-page screenshots to see complete layout

    3. **Review screenshots for design perfection:**
       + Typography: Font sizes, weights, line heights, letter spacing
       + Spacing: Padding, margins, gaps between elements
       + Sizing: Element dimensions, aspect ratios, proportions
       + Shadows: Consistent soft layered shadows across ALL elements
       + Corners: Sharp corners (no border-radius) on tiles
       + Colors: Accent colors, text contrast, background gradients
       + Alignment: Elements lined up properly, consistent grid
       + Magazine aesthetic: Minimal text, visual-first, clean classic look

    4. **Make CSS adjustments based on screenshot review**

    5. **REPEAT: Screenshot → Review → Adjust → Screenshot again**
       + This is an AGENTIC process - keep looping until design is perfect
       + Don't stop after one screenshot - iterate multiple times
       + Each viewport should look polished and professional
       + Pay attention to small details: 2px spacing matters!

  * **Example Playwright Script Pattern (Headless Mode):**

    ```javascript
    // /tmp/playwright-test-responsive.js
    const { chromium } = require('playwright');
    
    const TARGET_URL = 'http://localhost:5500'; // Auto-detected
    
    (async () => {
      const browser = await chromium.launch({ headless: true }); // ← HEADLESS!
      const page = await browser.newPage();
      
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(TARGET_URL);
        await page.waitForTimeout(1000); // Let animations settle
        
        await page.screenshot({
          path: `/tmp/${viewport.name}.png`,
          fullPage: true
        });
        
        console.log(`📸 Screenshot saved: /tmp/${viewport.name}.png`);
      }
      
      await browser.close();
    })();
    ```

  * **Execution Pattern:**
    ```bash
    # Write script to /tmp
    # Then execute from skill directory:
    cd ~/.claude/plugins/marketplaces/playwright-skill/skills/playwright-skill && node run.js /tmp/playwright-test-responsive.js
    ```

---

## Low Level Tasks

### PHASE 2: HOMEPAGE

  * **TILE TYPE REFERENCE:**
    - **For complete tile specifications, see ARCHITECTURE.md "Implementation Notes" section**
    - **Homepage Tiles:** Square (1:1 aspect ratio), show section name overlay with 5% black layer beneath text, display project count badge (top-right), link to section pages, use swipe to cycle through ONE project's images/text per section
    - **Section Page Tiles:** 16:9 aspect ratio, magazine aesthetic (NO title/subtitle on tile), show teaser text that cycles with images, link to individual entry pages, already built in Phase 1 ✅

#### 1. Create `homepage-controller.js`

  * **Action:** CREATE `./assets/js/homepage-controller.js`

  * **Functions to CREATE:**
     - `selectRandomProjectFromSection(section)` - Picks random project from section
     - `loadHomepageTiles()` - Loads 4 section tiles (Web, Print, Digital, Video)
     - `renderHomepageTile(project, section)` - Renders single homepage tile
     - `shuffleSectionOrder()` - Randomizes 4 section tiles order on reload 
     - `updateProjectCounts()` - Updates count badges on each section tile
     - `init()` - Initializes homepage

  * **Details:**
     - Use `DataLoader.loadAllProjects()` to get all entries
     - Filter by section: Web, Print, Digital, Video
     - Randomly select ONE project per section for that section's tile 
     - Use project's `thumbnail_images` and `tile_text` arrays
     - Section tiles randomize order on every reload
     - Selected project for section's tile changes on every reload 
     - **Project count badge** 
       + Display "X projects" in top-right corner of each section tile (small, out of way but visible)
       + Represents number of JSON entries that have that `section` tag type applied 

#### 2. Create `index.html` Structure

  * **Action:** CREATE `./index.html`

  * **Structure:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sean August Horvath | Creative Innovations Generalist</title>
  <meta name="description" content="Creative generalist portfolio spanning web development, print design, digital products, and video production. 14 years bridging art, product, and growth.">
  <meta property="og:title" content="Sean August Horvath | Creative Innovations Generalist">
  <meta property="og:description" content="Portfolio showcasing expertise across web, print, digital, and video projects.">
  <meta property="og:image" content="/assets/media/og-homepage.jpg">
  <meta property="og:image:alt" content="Sean August Horvath creative portfolio homepage">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <!-- Header (match section.html exactly) -->
  <header>
    <!-- Simple minimal header -->
  </header>
  
  <!-- Projects Section -->
  <section id="projects">
    <h1 class="section-heading">Projects</h1>
    <div id="homepage-tile-grid" class="homepage-tile-grid">
      <!-- 4 section tiles inserted by JS -->
    </div>
  </section>
  
  <!-- About Section -->
  <section id="about">
    <h2 class="visually-hidden">About</h2>
    <img src="/assets/media/profile-picture-horvath.webp" alt="Sean August Horvath" class="profile-pic">
    <div class="about-content">
      <h3 class="about-title">Sean August Horvath, Creative Innovations Generalist</h3>
      <p>14 years hopping borders between art, product, and growth. Clean lines, maximal ideas. Sketches brands by hand, ships AI pipelines by night. Pattern recognition is my superpower; making it teachable is my craft.</p>
    </div>
  </section>
  
  <!-- Contact Section -->
  <section id="contact">
    <h2 class="section-heading">Contact</h2>
    <div class="social-links">
      <a href="https://github.com/seanivore" aria-label="GitHub Profile" title="GitHub">
        <svg><!-- GitHub icon --></svg>
      </a>
      <a href="https://linkedin.com/in/seanivore/" aria-label="LinkedIn Profile" title="LinkedIn">
        <svg><!-- LinkedIn icon --></svg>
      </a>
      <a href="https://instagram.com/seanivore/" aria-label="Instagram Profile" title="Instagram">
        <svg><!-- Instagram icon --></svg>
      </a>
      <a href="mailto:horvathaugust@gmail.com" aria-label="Email" title="Email">
        <svg><!-- Email icon --></svg>
      </a>
    </div>
  </section>
  
  <!-- Footer (match section.html) -->
  <footer>
    <p>&copy; 2025 Sean August Horvath</p>
    <!-- Same social icons repeated -->
  </footer>
  
  <script src="/assets/js/data-loader.js"></script>
  <script src="/assets/js/tile-renderer.js"></script>
  <script src="/assets/js/homepage-controller.js"></script>
</body>
</html>
```

  * **Details:**
      - Use `#projects`, `#about`, `#contact` for anchor linking
      - Profile picture: circle-cropped with 5px white stroke + subtle layered shadow
      - Social links: Icons only (48x48px centered) with aria-labels and titles
      - Match header/footer from `section.html`
      - Smooth scroll behavior for anchors
      - Note: "Projects" uses custom `.section-heading` class (different from entry page H1)

#### 3. Add Homepage Styles to `styles.css`

  * **Action:** UPDATE `/Users/seanivore/Development/360-design/styles.css`

  * **Styles to ADD:**

```css
/* Homepage Section Heading (different from entry H1) */
.section-heading {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-lg);
  text-align: center;
}

/* Visually Hidden (accessibility) */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Homepage Tiles */
.homepage-tile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-xl);
}

@media (min-width: 768px) {
  .homepage-tile-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.homepage-tile {
  position: relative;
  aspect-ratio: 1 / 1;
  background: var(--color-surface);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.homepage-tile:hover {
  transform: translateY(-2px);
}

.homepage-tile__count-badge {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  background: rgba(0, 0, 0, 0.7);
  color: var(--color-text);
  padding: var(--space-xs) var(--space-sm);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 10;
}

/* About Section */
.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid var(--color-text);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05);
  object-fit: cover;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
}

/* Contact Section */
.social-links {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  align-items: center;
}

.social-links a {
  display: inline-flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.social-links a:hover {
  transform: scale(1.1);
}

.social-links svg {
  width: 32px;
  height: 32px;
}

/* Smooth Scroll */
html {
  scroll-behavior: smooth;
}
```

  * **Details:**
    - Homepage tiles: Square (1:1), larger than section tiles
    - Count badge: Small, top-right corner, semi-transparent background
    - Profile pic: 5px white stroke with consistent shadow pattern
    - Social icons: 48x48px containers, 32x32px icons, no text
    - Responsive: 1 column mobile, 2 columns desktop
    - Consistent shadow pattern across all elements

#### 4. Update `tile-renderer.js` for Homepage Tiles

  * **Action:** UPDATE `./assets/js/tile-renderer.js`

  * **CONTEXT: Existing Section Tile Implementation (Phase 1)**
    
    Section tiles are already built and working. Here's the current structure for reference:

    ```javascript
    // EXISTING: renderSectionTile() - Already implemented in Phase 1
    function renderSectionTile(project) {
      const tile = document.createElement('a');
      tile.href = entryURL;
      tile.className = 'tile-section fade-in-item';
      
      // HTML Structure:
      tile.innerHTML = `
        <div class="tile-section__content">
          <!-- Multiple <p> elements for tile_text array -->
          <!-- First text visible, others hidden -->
        </div>
        <div class="tile-section__images">
          <div class="tile-section__image-container">
            <!-- Multiple <img> elements for thumbnail_images -->
            <!-- First image has .active class -->
          </div>
        </div>
      `;
      
      // Swipe cycles both images AND text
      // Text cycles: textIndex = currentIndex % textCount
      return tile;
    }
    ```

    **Key Points:**
    - 16:9 aspect ratio (set in CSS)
    - Magazine aesthetic: NO title/subtitle, just teaser text + images
    - Text cycles with images (cross-fade)
    - Links to entry pages
    - Already has swipe functionality

  * **VISUAL DISTINCTION FROM SECTION TILES:**
    - Homepage tiles: **1:1 aspect ratio** (square)
    - Section tiles: **16:9 aspect ratio** (landscape) ← EXISTING
    - Homepage tiles: **Section name overlay** with semi-transparent black layer
    - Section tiles: **NO overlays**, magazine aesthetic with cycling teaser text ← EXISTING
    - Homepage tiles: **Project count badge** in top-right corner
    - Section tiles: **NO badges**, clean visual-first presentation ← EXISTING
    - Homepage tiles: **Link to section pages** (/web, /print, etc.)
    - Section tiles: **Link to entry pages** (/web/html-css-js/project-name) ← EXISTING

  * **Function to ADD:**

```javascript
/**
 * Render homepage tile with section overlay
 * @param {Object} project - Project data
 * @param {String} section - Section name (Web, Print, Digital, Video)
 * @param {Number} projectCount - Total projects in section
 */
function renderHomepageTile(project, section, projectCount) {
  const tile = document.createElement('a');
  tile.href = `/${DataLoader.normalizeForURL(section)}`;
  tile.className = 'homepage-tile';
  
  // Count badge
  const badge = document.createElement('div');
  badge.className = 'homepage-tile__count-badge';
  badge.textContent = `${projectCount} project${projectCount !== 1 ? 's' : ''}`;
  tile.appendChild(badge);
  
  // Section overlay (with 5% black layer)
  const overlay = document.createElement('div');
  overlay.className = 'homepage-tile__overlay';
  overlay.innerHTML = `<span class="section-name">${section.toUpperCase()}</span>`;
  tile.appendChild(overlay);
  
  // Image swiper container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'homepage-tile__images';
  
  project.content.media.thumbnail_images.forEach((img, i) => {
    const imgEl = document.createElement('img');
    imgEl.src = img;
    imgEl.alt = project.content.media.thumb_slideshow_alt_text[i] || `${section} project image`;
    imgEl.className = i === 0 ? 'active' : '';
    imageContainer.appendChild(imgEl);
  });
  
  tile.appendChild(imageContainer);
  
  // Text cycler
  const textContainer = document.createElement('div');
  textContainer.className = 'homepage-tile__text';
  
  project.content.teaser_copy.tile_text.forEach((text, i) => {
    const p = document.createElement('p');
    p.textContent = text;
    p.className = i === 0 ? 'active' : '';
    textContainer.appendChild(p);
  });
  
  tile.appendChild(textContainer);
  
  // Add swipe functionality
  addHomepageTileSwipe(tile, project.content.media.thumbnail_images.length);
  
  return tile;
}
```

  * **Details:**
    - Similar to `renderSectionTile()` but square (1:1)
    - Section name overlay with 5% black layer beneath text
    - Swipe functionality cycles images AND text
    - Count badge shows in top-right corner
    - Links to section page (e.g., /web)

#### 5. Test Homepage with Playwright Browser Automation

  * **Action:** AUTOMATED TESTING + VISUAL DESIGN REVIEW (Playwright)

  * **Step 1: Auto-detect dev server**
    ```bash
    cd ~/.claude/plugins/marketplaces/playwright-skill/skills/playwright-skill && node -e "require('./lib/helpers').detectDevServers().then(servers => console.log(JSON.stringify(servers)))"
    ```

  * **Step 2: Functional Testing (Headless Mode)**

    + Create `/tmp/playwright-test-homepage-functional.js` with:
      - Navigate to homepage (detected URL or http://localhost:5500)
      - Verify 4 section tiles present (check `.homepage-tile` count)
      - Verify count badges display (check `.homepage-tile__count-badge`)
      - Test tile clicks navigate to correct URLs
      - **Broken Link Check:** Test all navigation links on homepage (section tiles, social links, breadcrumbs) return 200 responses
      - Verify profile picture loads (check `img.profile-pic`)
      - Verify social links present (check `.social-links a`)
      - Test smooth scroll to #about and #contact anchors
      - Console log all test results

    + Execute with `headless: true` mode

    + **Playwright Broken Link Pattern** (from SKILL.md):
      ```javascript
      const links = await page.locator('a[href^="http"]').all();
      const results = { working: 0, broken: [] };
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        try {
          const response = await page.request.head(href);
          if (response.ok()) {
            results.working++;
          } else {
            results.broken.push({ url: href, status: response.status() });
          }
        } catch (e) {
          results.broken.push({ url: href, error: e.message });
        }
      }
      ```

  * **Step 3: Visual Design Review (ITERATIVE - Headless Mode)**

    + Create `/tmp/playwright-test-homepage-visual.js` with:
      - Take full-page screenshots at Mobile (375x667), Tablet (768x1024), Desktop (1920x1080)
      - Use `headless: true` to prevent browser pop-ups
      - Save to `/tmp/homepage-mobile.png`, `/tmp/homepage-tablet.png`, `/tmp/homepage-desktop.png`

    + **REVIEW Screenshots for:**
      - **Section Tiles:** Square aspect ratio (1:1), sharp corners, consistent spacing
      - **Typography:** H1.section-heading size/weight, about-title hierarchy  
      - **Spacing:** Tile grid gap, section padding, margins between Projects/About/Contact
      - **Profile Picture:** Circular with 5px white stroke, soft shadow
      - **Social Icons:** 48x48px containers, 32x32px icons, proper spacing
      - **Count Badges:** Top-right placement, readable text, semi-transparent background
      - **Mobile Layout:** Single column, proper padding, no horizontal overflow
      - **Desktop Layout:** 2-column grid, centered max-width, balanced whitespace
      - **Shadows:** Consistent soft layered shadows on tiles, profile pic, all elements
      - **Magazine Aesthetic:** Visual-first, minimal text, clean and timeless

    + **ITERATE: Make CSS adjustments → Screenshot again → Compare → Refine**
      - This is NOT a one-shot process
      - Keep looping until design looks perfect at ALL breakpoints
      - Pay attention to pixel-perfect spacing (2-4px adjustments matter!)
      - Ensure smooth responsive behavior (no awkward in-between states)

  * **Step 4: Random Order Validation (Multiple Runs)**

    + Run functional test script 3-5 times
    + Verify tile order changes each time
    + Verify different projects selected for each section
    + Document that randomization works correctly

  * **Step 5: Image Swipe Interaction (Visible Browser)**

    + Create `/tmp/playwright-test-homepage-swipe.js` with `headless: false`
    + Manually verify image swipe functionality on tiles
    + Test text cross-fade syncs with image changes
    + Verify 1/8th image bleed is visible

  * **Success Criteria:**
    ✅ All functional tests pass  
    ✅ Design looks perfect at mobile, tablet, desktop  
    ✅ Typography hierarchy is clear  
    ✅ Spacing is consistent and balanced  
    ✅ Shadows are subtle and layered  
    ✅ Tiles have sharp corners  
    ✅ Random order works correctly  
    ✅ Profile picture has stroke and shadow  
    ✅ Social icons are properly sized  

  * **Note:** If dev server not running, start with:
    ```bash
    python3 -m http.server 5500 --bind 127.0.0.1
    ```

---

### PHASE 3: ENTRY PAGES & FULL WEBSITE POLISH & TESTING 

#### 6. Create `entry-controller.js`

  * **Action:** CREATE `./assets/js/entry-controller.js`

  * **Functions to CREATE:**
      - `parseEntryURL()` - Extracts `section`/`sub_section`/`slug` from URL
      - `loadEntry(urlPath)` - Loads project JSON from manifest
      - `calculateTagMatches(project, allProjects)` - Scores projects by tag overlap
      - `selectRelatedPosts(project, allProjects, count=5)` - Picks 5 related projects
      - `getTimeSeed()` - Generates 6-hour-changing seed
      - `seededRandom(seed)` - Deterministic random
      - `renderEntryContent(project)` - Populates page with ALL project data
      - `renderRelatedPosts(relatedProjects)` - Renders 5 related tiles
      - `init()` - Initializes entry page

  * **Details:**

   + **Related Posts Logic:**
     1. Calculate tag overlap (count matching tags across technology/media/skill)
     2. Filter to top scorers (ties allowed)
     3. Use 6-hour time seed: `Math.floor(Date.now() / (1000 * 60 * 60 * 6))`
     4. Select 5 projects randomly from top scorers using seededRandom
     5. Every project recommended eventually, order rotates every 6 hours

   + **Seeded Random:**

```javascript
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
```

   * **Content Population (renderEntryContent must include ALL of these):**

     + SEO meta tags from `seo_title`, `seo_description`
     + **Top Layout:** Breadcrumbs (top left) + Tags hover card (top right)
       - Breadcrumbs: section › subsection › breadcrumb (clickable links)
       - Tags card: ONLY technology/media/skill tags, comma or bullet separated
       - Hover card with micro-interaction (subtle lift on hover)
     + Page title and subtitle
     + Role heading and content (role is NOT in tags card, used as H3 heading)
     + Pattern, Action, Measured sections
     + Thumbnail slideshow with alt text
     + Video embed with alt text (if exists)
     + **page_imagery** section with alt text (if exists)
     + **project_url** embed (prominent with title/description/image - like og:image preview)
     + **github_repository** embed (GitHub's auto-generated card style)
     + **Bottom Layout:** Breadcrumbs (bottom left) + Tags card (bottom right) - REPEATED

#### 7. Create `entry.html` Template

  * **Action:** CREATE `./entry.html`

  * **Structure:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- Populated by JS --></title>
  <meta name="description" content="">
  <meta property="og:title" content="">
  <meta property="og:description" content="">
  <meta property="og:image" content="">
  <meta property="og:image:alt" content="">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header class="entry-header-nav">
    <!-- Fixed header, follows scroll -->
  </header>
  
  <main class="entry-page">
    <!-- Breadcrumbs (top left) -->
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <!-- JS populates: Web › HTML/CSS/JS › Project Name -->
    </nav>
    
    <!-- Top Layout: Breadcrumbs (left) + Tags Hover Card (right) -->
    <div class="entry-top-layout">
      <!-- Breadcrumbs (top left) -->
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <!-- JS populates: Web › HTML/CSS/JS › Project Name -->
      </nav>
      
      <!-- Tags Hover Card (top right) -->
      <div class="entry-tags-card">
        <!-- JS populates: comma/bullet separated technology, media, skill tags -->
        <!-- Hover card with micro-interaction -->
      </div>
    </div>
    
    <!-- Title & Subtitle -->
    <section class="entry-header">
      <h1 id="entry-title"></h1>
      <h2 id="entry-subtitle"></h2>
    </section>
    
    <!-- Main Content (4 sections: Role, Pattern, Action, Measured) -->
    <section class="entry-content">
      <!-- Each section: 2-col (images + text), then text extends full-width below -->
      <div class="content-section" id="role-section">
        <div class="content-images">
          <!-- Thumbnail slideshow -->
        </div>
        <div class="content-text">
          <h3 id="role-heading"></h3>
          <div id="role-content"></div>
        </div>
      </div>
      
      <div class="content-section">
        <div class="content-images"></div>
        <div class="content-text">
          <h3>Pattern</h3>
          <p id="pattern-text"></p>
        </div>
      </div>
      
      <div class="content-section">
        <div class="content-images"></div>
        <div class="content-text">
          <h3>Action</h3>
          <p id="action-text"></p>
        </div>
      </div>
      
      <div class="content-section">
        <div class="content-images"></div>
        <div class="content-text">
          <h3>Measured</h3>
          <p id="measured-text"></p>
        </div>
      </div>
    </section>
    
    <!-- Project URL Embed (if exists) -->
    <section id="project-url-embed" class="embed-section">
      <!-- JS creates prominent link preview card -->
    </section>
    
    <!-- GitHub Repository Embed (if exists) -->
    <section id="github-embed" class="embed-section">
      <!-- JS creates GitHub-style repo card -->
    </section>
    
    <!-- Video Embed (if exists) -->
    <section id="video-section" class="video-container">
      <!-- JS populates iframe with alt text -->
    </section>
    
    <!-- Additional Page Images (if exist) -->
    <section id="page-imagery-section" class="additional-images">
      <!-- JS populates page_imagery with alt text -->
    </section>
    
    <!-- Divider -->
    <hr class="content-divider">
    
    <!-- Bottom Layout: Breadcrumbs (left) + Tags (right) - Repeated -->
    <div class="entry-bottom-layout">
      <!-- Breadcrumbs (bottom left) -->
      <nav class="breadcrumbs breadcrumbs--bottom" aria-label="Breadcrumb">
        <!-- JS populates: Web › HTML/CSS/JS › Project Name -->
      </nav>
      
      <!-- Tags (bottom right) -->
      <div class="entry-tags-card entry-tags-card--bottom">
        <!-- JS populates: comma/bullet separated technology, media, skill tags -->
      </div>
    </div>
    
    <!-- Related Posts -->
    <section class="related-posts">
      <h3>Related Projects</h3>
      <div id="related-posts-grid">
        <!-- 5 related tiles with proper padding -->
      </div>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2025 Sean August Horvath</p>
    <!-- Social icons -->
  </footer>
  
  <script src="/assets/js/data-loader.js"></script>
  <script src="/assets/js/tile-renderer.js"></script>
  <script src="/assets/js/entry-controller.js"></script>
</body>
</html>
```

  * **Details:**
    - **Layout Pattern:** Breadcrumbs (left) + Tags Card (right) at top AND bottom
    - Breadcrumbs: section › subsection › breadcrumb (clickable links to filter section page)
    - Tags card: ONLY technology/media/skill (NOT section/subsection/role)
    - Tags: Comma or bullet (•) separated, clickable links to filtered section page
    - Hover card: Subtle lift animation on hover, max-width 400px
    - Role heading: Uses actual role from JSON as H3 (NOT in tags card)
    - Content sections: 2-column desktop, 1-column mobile, text extends full-width
    - Project URL embed: Prominent preview card with title/description/image
    - GitHub embed: GitHub's auto-generated card style (repo stats, description)
    - Video: Full-width iframe with alt text (if exists)
    - Page imagery: Grid layout with alt text (if exists)
    - Related posts: 5 tiles with proper L/R padding

#### 8. Add Entry Page Styles to `styles.css`

  * **Action:** UPDATE `./styles.css`

  * **Styles to ADD:**

```css
/* Entry Page Layout */
.entry-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl);
}

/* Breadcrumbs */
.breadcrumbs {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

/* Entry Header */
.entry-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.entry-header h2 {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-lg);
}

/* Entry Top/Bottom Layout (breadcrumbs + tags) */
.entry-top-layout,
.entry-bottom-layout {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
  gap: var(--space-lg);
}

.entry-bottom-layout {
  margin-top: var(--space-lg);
  margin-bottom: var(--space-xl);
}

@media (max-width: 768px) {
  .entry-top-layout,
  .entry-bottom-layout {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Tags Hover Card (top right / bottom right) */
.entry-tags-card {
  position: relative;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface);
  border-radius: 4px;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 400px;
}

.entry-tags-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.1);
}

.entry-tags-card a {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.entry-tags-card a:hover {
  color: var(--color-accent);
}

.entry-tags-card a:not(:last-child)::after {
  content: ' • ';
  margin: 0 var(--space-xs);
  color: var(--color-text-secondary);
  opacity: 0.5;
}

/* Content Sections */
.content-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.content-text h3 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
}

@media (max-width: 768px) {
  .content-section {
    grid-template-columns: 1fr;
  }
}

/* Embeds */
.embed-section {
  margin: var(--space-xl) 0;
  padding: var(--space-lg);
  background: var(--color-surface);
  border-radius: 8px;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05);
}

/* Video Container */
.video-container {
  margin: var(--space-xl) 0;
}

.video-container iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
}

/* Additional Images */
.additional-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-md);
  margin: var(--space-xl) 0;
}

.additional-images img {
  width: 100%;
  height: auto;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05);
}

/* Content Divider */
.content-divider {
  margin: var(--space-xl) 0;
  border: none;
  border-top: 1px solid var(--color-border);
}



/* Related Posts */
.related-posts {
  margin-top: var(--space-xl);
  padding: 0 var(--space-lg);
}

.related-posts h3 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: var(--space-lg);
  text-align: center;
}

#related-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
  max-width: 1400px;
  margin: 0 auto;
}
```

  * **Details:**
    - H1 = page_title (large, 3rem, heavy)
    - H2 = page_subtitle (smaller than H3, 1.5rem)
    - H3 = section headings (1.75rem)
    - H4 = tags (0.875rem, uppercase, heavy)
    - H5 = breadcrumbs (0.875rem, uppercase)
    - Tags ribbon: Full 100vw with horizontal scroll
    - Content: 2-column desktop, 1-column mobile
    - Related posts: Proper L/R padding, centered grid
    - Consistent shadow pattern throughout

#### 9. Verify `404.html` Entry Routing

  * **Action:** UPDATE `./404.html` (if needed)

  * **Logic to VERIFY:**
    - Checks `manifest.entries` for path existence
    - If path in manifest → `entry.html`
    - If 1-2 segments → `section.html`
    - Sets `sessionStorage.entryPath` properly

#### 10. Test Entry Pages with Playwright Browser Automation

  * **Action:** AUTOMATED TESTING + VISUAL DESIGN REVIEW (Playwright)

  * **Step 1: Auto-detect dev server** (same as Task 5)

  * **Step 2: Functional Testing (Headless Mode)**

    + Create `/tmp/playwright-test-entry-functional.js` with:
      - Navigate to entry page: `http://localhost:5500/entry.html?path=web/html-css-js/slug`
      - Verify ALL content populates from JSON:
        * Check H1 (`#entry-title`) displays page_title
        * Check H2 (`#entry-subtitle`) displays page_subtitle
        * Check H3 role heading displays role (NOT in tags card)
        * Check pattern/action/measured sections populate
        * Verify thumbnail slideshow images load with alt text
        * Verify video embed (if exists) with video_alt_text
        * Verify page_imagery (if exists) with page_image_group_alt_text
        * Verify project_url embed displays prominently
        * Verify github_repository card displays
      - Verify breadcrumbs structure: section › subsection › breadcrumb
      - Verify tags hover card (top right + bottom right):
        * Contains ONLY technology/media/skill tags
        * Does NOT contain section/subsection/role
        * Tags are clickable links
      - **Broken Link Check:** Test all clickable links on entry page (breadcrumbs, tags, related posts, project_url, github_repository) for valid responses
      - Verify 5 related posts render (not 3)
      - Reload 3 times - related posts should stay same (6-hour consistency)
      - Check console logs for related posts scoring algorithm
      - Test 2-3 different entry pages
      - Console log all validation results

    + Execute with `headless: true` mode

  * **Step 3: Visual Design Review (ITERATIVE - Headless Mode)**

    + Create `/tmp/playwright-test-entry-visual.js` with:
      - Take full-page screenshots at Mobile (375x667), Tablet (768x1024), Desktop (1920x1080)
      - Test 2-3 different entry pages to ensure consistency
      - Use `headless: true` to prevent browser pop-ups
      - Save to `/tmp/entry-[page]-[viewport].png` pattern

    + **REVIEW Screenshots for:**
      - **Top Layout:** Breadcrumbs (left) + Tags hover card (right) properly positioned
      - **Typography:** H1 (3rem, 700), H2 (1.5rem, 400), H3 (1.75rem, 600) hierarchy clear
      - **Tags Hover Card:** Max-width 400px, bullet/comma separated, hover lift effect
      - **Content Sections:** 2-column desktop, 1-column mobile, proper image/text balance
      - **Embeds:** project_url prominent with title/description/image, github card styled
      - **Video:** Full-width iframe, 16:9 aspect ratio, proper spacing
      - **Page Imagery:** Grid layout, consistent image sizing, proper alt text
      - **Bottom Layout:** Breadcrumbs + Tags repeated symmetrically
      - **Related Posts:** 5 tiles (not 3!), proper L/R padding, centered grid
      - **Spacing:** Consistent var(--space-*) usage, balanced whitespace
      - **Shadows:** Soft layered shadows on cards, embeds, images
      - **Mobile:** Single column, no horizontal scroll, proper touch targets
      - **Tablet:** Proper breakpoint behavior, no awkward layouts
      - **Desktop:** Max-width 1200px, centered, generous padding
      - **Magazine Aesthetic:** Clean, minimal, visual-first, timeless

    + **ITERATE: CSS Refinement Loop**
      - Adjust typography scales for better hierarchy
      - Fine-tune spacing between sections (4-8px adjustments)
      - Perfect shadow layering for depth without heaviness
      - Ensure tags hover card lift is subtle but noticeable
      - Verify embed cards stand out but don't dominate
      - Check related posts grid balances properly
      - **KEEP LOOPING** until every breakpoint looks polished

  * **Step 4: Content Population Validation**

    + Test entries with different content combinations:
      - Entry with video_embed + page_imagery
      - Entry with project_url but no github_repository
      - Entry with github_repository but no video
      - Entry with minimal content (no optional fields)
    + Verify layout adapts gracefully to missing content
    + Ensure no broken images or empty sections

  * **Step 5: Related Posts Algorithm Validation**

    + Run test at different times to verify 6-hour rotation
    + Check console logs for tag matching scores
    + Verify seededRandom produces consistent results
    + Document that same 5 posts appear within 6-hour window
    + Verify different posts appear after 6-hour window passes

  * **Step 6: Interactive Testing (Visible Browser)**

    + Create `/tmp/playwright-test-entry-interaction.js` with `headless: false`
    + Test thumbnail slideshow swipe functionality
    + Test breadcrumb link navigation
    + Test tag link navigation (should go to filtered section page)
    + Test related post tile clicks
    + Verify smooth transitions and animations

  * **Success Criteria:**
    ✅ All content populates correctly from JSON  
    ✅ Layout pattern correct: Breadcrumbs (left) + Tags (right) at top AND bottom  
    ✅ Tags card contains ONLY technology/media/skill (role is H3 heading)  
    ✅ Typography hierarchy is clear and consistent  
    ✅ Embeds display prominently and professionally  
    ✅ Related posts shows 5 tiles (not 3) with proper padding  
    ✅ 6-hour rotation works correctly  
    ✅ Design looks perfect at all breakpoints  
    ✅ Spacing is balanced and generous  
    ✅ Shadows are consistent and subtle  
    ✅ Magazine aesthetic maintained throughout

#### 11. Test Section Pages & Complete Site Navigation Flow with Playwright 

  * **Action:** COMPREHENSIVE SITE-WIDE NAVIGATION VALIDATION (Playwright)

  * **Purpose:** Validate that section.html (already built in Phase 1) works correctly with new homepage/entry pages, and test complete user journey across all three page types

  * **Step 1: Auto-detect dev server** (same as previous tasks)

  * **Step 2: Section Page Functional Testing (Headless Mode)**

    + Create `/tmp/playwright-test-section-functional.js` with:
      - Navigate to section pages: `/web`, `/print`, `/digital`, `/video`
      - Verify section tiles render correctly (check `.tile-section` count)
      - Verify tag filters display horizontally scrolling
      - Test main filter heading displays (not in tag list)
      - Verify sticky filter behavior (main filter can't be removed)
      - **Broken Link Check:** Test ALL navigation links on section pages:
        * Section tile links (to entry pages)
        * Tag filter links (to filtered section pages)
        * Breadcrumb links (back to homepage)
        * Header navigation links
        * Footer social links
      - Test subsection URLs: `/web/html-css-js`, `/web/webflow`, etc.
      - Verify toggle tags appear ONLY on section-type pages (not click-through)
      - Test tag activation (click tag → filters apply → tiles filter)
      - Verify tiles maintain random order when filtering
      - Test multiple active tags simultaneously
      - Reload 3 times - verify tile order reshuffles each time
      - Console log all test results

    + Execute with `headless: true` mode

  * **Step 3: Complete Navigation Flow Testing (End-to-End)**

    + Create `/tmp/playwright-test-complete-flow.js` with:
      - **Journey 1: Homepage → Section → Entry → Related Post**
        * Start at `/` (homepage)
        * Click Web section tile → verify lands on `/web`
        * Verify section tiles load and tag filters display
        * Click first project tile → verify lands on entry page
        * Verify entry content populates from JSON
        * Click related post tile → verify lands on different entry
        * Click breadcrumb → verify returns to section page
      - **Journey 2: Tag Click-Through Navigation**
        * Navigate to entry page
        * Click tag in tags hover card → verify lands on filtered section page
        * Verify sticky filter = clicked tag
        * Verify toggle tags do NOT appear (click-through page)
        * Verify all contextual tags from matching projects display
        * Test clicking section tag → verify filters to that section
      - **Journey 3: Breadcrumb Navigation**
        * Navigate to `/web/html-css-js/project-slug`
        * Click "HTML/CSS/JS" in breadcrumb → verify lands on `/web/html-css-js`
        * Click "Web" in breadcrumb → verify lands on `/web`
        * Click site logo → verify returns to homepage
      - **Journey 4: Header/Footer Navigation**
        * Test all header nav links from each page type
        * Test all footer social links from each page type
        * Verify smooth anchor scrolling on homepage (#about, #contact)
      - Console log success/failure for each journey step

    + Use `headless: true` mode
    + Document any broken navigation paths

  * **Step 4: Visual Design Review - Section Pages (ITERATIVE - Headless Mode)**

    + Create `/tmp/playwright-test-section-visual.js` with:
      - Take full-page screenshots at Mobile (375x667), Tablet (768x1024), Desktop (1920x1080)
      - Test section page: `/web`
      - Test subsection page: `/web/html-css-js`
      - Test click-through filtered page: navigate via tag click, screenshot result
      - Use `headless: true` to prevent browser pop-ups
      - Save to `/tmp/section-[type]-[viewport].png` pattern

    + **REVIEW Screenshots for:**
      - **Section Tiles:** 16:9 aspect ratio (NOT 1:1 like homepage)
      - **Magazine Aesthetic:** NO title/subtitle on tiles, just visuals + teaser text
      - **Tag Filters:** Horizontal scroll, main filter as heading (not in list)
      - **Typography:** Consistent with homepage/entry pages
      - **Spacing:** Proper tile grid gaps, filter navigation spacing
      - **Sticky Filter Behavior:** Main filter heading visible and clear
      - **Toggle Tags:** Visible on section-type pages, hidden on click-through
      - **Shadows:** Consistent soft layered shadows on tiles
      - **Mobile:** Single column layout, horizontal scroll for tags
      - **Desktop:** Large padding, centered tiles, proper spacing

    + **ITERATE:** Screenshot → Review → CSS Adjustments → Screenshot again
      - Ensure section tiles visually distinct from homepage tiles
      - Verify magazine aesthetic (visual-first, minimal text)
      - Perfect responsive behavior at all breakpoints

  * **Step 5: Tag Filter Interaction Testing (Visible Browser)**

    + Create `/tmp/playwright-test-tag-interaction.js` with `headless: false`
    + Test tag activation:
      - Click tag → verify active state (color change, moves left)
      - Click again → verify deactivates and returns to original position
      - Test multiple tags active simultaneously
      - Verify main filter cannot be clicked off
    + Test tile filtering:
      - Activate tag → verify unrelated tiles fade out
      - Verify related tiles slide into new positions
      - Deactivate tag → verify all tiles return smoothly
    + Test tag reordering:
      - Active tags should physically move to left in DOM
      - Verify smooth transition animations (300ms)

  * **Success Criteria:**
    ✅ Section pages render correctly with all Phase 1 functionality intact  
    ✅ All navigation links work (homepage ↔ section ↔ entry)  
    ✅ Broken link checks pass for all page types  
    ✅ Complete user journeys work end-to-end  
    ✅ Tag filtering works correctly on section pages  
    ✅ Sticky filters behave properly  
    ✅ Toggle tags appear only on section-type pages  
    ✅ Section tiles visually distinct from homepage tiles (16:9 vs 1:1)  
    ✅ Magazine aesthetic maintained (no title/subtitle on section tiles)  
    ✅ Design consistency across all three page types  
    ✅ Responsive behavior perfect at all breakpoints  

#### 12. Test Production Routing with Playwright Browser Automation

  * **Action:** AUTOMATED ROUTING VALIDATION (Playwright)

  * **Prerequisites:**
    ```bash
    npm install -g http-server
    http-server -p 8080 -c-1 --proxy http://localhost:8080?
    ```

  * **Step 1: Create Routing Validation Script (Headless Mode)**

    + Create `/tmp/playwright-test-routing.js` with:
      - Test section URLs: `/web`, `/print`, `/digital`, `/video`
      - Test subsection URLs: `/web/html-css-js`, `/web/webflow`, `/web/framer`
      - Test entry URLs: `/web/html-css-js/slug-project-name`
      - For each URL:
        * Navigate to clean URL (no parameters)
        * Verify correct page loads (check page title, H1, unique content)
        * Verify no 404 errors
        * Verify JavaScript executes properly
        * Console log success/failure for each route
      - Test case normalization: `/web` → loads projects with section="Web"
      - Use `headless: true` mode

  * **Step 2: 404 Routing Flow Validation**

    + Verify routing logic:
      - URL with 3+ segments → entry.html
      - URL with 1-2 segments → section.html
      - manifest.json lookup works correctly
      - sessionStorage values set properly

  * **Step 3: Visual Verification (Quick Screenshots)**

    + Take screenshot of each page type:
      - Section page (`/web`)
      - Subsection page (`/web/html-css-js`)
      - Entry page (`/web/html-css-js/slug`)
    + Verify pages render identically to localhost testing
    + Use `headless: true` mode

  * **Success Criteria:**
    ✅ All clean URLs load without errors  
    ✅ 404 routing redirects work correctly  
    ✅ Case normalization functions properly  
    ✅ Content loads dynamically from JSON  
    ✅ No URL parameters needed in production  
    ✅ Pages render identically to localhost

#### 13. Deploy to GitHub Pages

  * **Action:** MANUAL DEPLOYMENT

  * **Steps:**

```bash
# Create new branch
git checkout -b generalist-portfolio-v1
git add .
git commit -m "Phase 2 & 3: Homepage and entry pages complete"
git push origin generalist-portfolio-v1

# GitHub Pages auto-deploys
# Wait 1-2 minutes
```

  * **Tests:**
    - Visit `www.august.style`
    - Click section tiles → `/web`, `/print`, etc.
    - Click project tiles → `/web/html-css-js/project-name`
    - Test tag filtering
    - Test related posts
    - Test breadcrumbs and navigation
    - Verify all images/videos load
    - Test on mobile device
    - Test responsive breakpoints

#### 14. Polish and Final Tweaks with Iterative Visual Design Perfection

  * **Action:** ITERATIVE REFINEMENT using Playwright screenshot loops (Headless Mode)

  * **CRITICAL: This is an AGENTIC visual design perfection process**
    + Use Playwright to take screenshots, review, adjust CSS, screenshot again
    + Keep looping until design is pixel-perfect at ALL breakpoints
    + Don't stop after one pass - iterate 3-5+ times if needed
    + Pay attention to tiny details: 2px can make or break visual balance

  * **Step 1: Comprehensive Visual Audit (Headless Mode)**

    + Create `/tmp/playwright-test-comprehensive-visual.js` with:
      - Screenshot ALL page types at ALL breakpoints:
        * Homepage: Mobile (375x667), Tablet (768x1024), Desktop (1920x1080)
        * Section page: Same 3 viewports
        * Entry page: Same 3 viewports (test 2-3 different entries)
      - Save organized: `/tmp/audit-[page]-[viewport].png`
      - Use `headless: true` mode

    + **REVIEW ALL Screenshots for:**
      - **Typography Hierarchy:**
        * H1: Large, bold, commanding presence
        * H2: Clearly subordinate to H1, but distinct from H3
        * H3: Section heading weight, readable at all sizes
        * Body: Legible, proper line height (1.5-1.6), balanced spacing
        * Tags: Small but readable, consistent weight
      - **Spacing Consistency:**
        * Tile grid gaps: Equal and balanced
        * Section padding: Generous but not excessive
        * Element margins: Rhythmic vertical spacing
        * Content padding: Breathing room around text
        * Related posts: Proper L/R padding, not cramped
      - **Element Sizing:**
        * Tiles: Proper aspect ratios (1:1 homepage, 16:9 section)
        * Images: Sharp, not pixelated or stretched
        * Buttons/links: Adequate touch targets (44x44px minimum)
        * Profile picture: Perfectly circular, proper size
        * Count badges: Visible but not overwhelming
      - **Shadow Consistency:**
        * ALL elements use same soft layered shadow pattern
        * Shadows: `0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05)`
        * No heavy or harsh shadows anywhere
        * Consistent depth perception across site
      - **Corner Treatment:**
        * Tiles: Sharp corners (border-radius: 0)
        * Tags card: Subtle radius (4px) for hover card
        * Profile picture: Perfect circle (50%)
        * No inconsistent rounding
      - **Color Balance:**
        * Background: Charcoal with subtle gradient glare
        * Text: White with proper contrast
        * Accent: Blue (#4a9eff) used consistently
        * Shadows: Black with low opacity, layered
      - **Magazine Aesthetic:**
        * Visual-first: Images dominate, text minimal
        * Clean: No clutter, generous whitespace
        * Timeless: Classic layout, no trendy effects
        * Professional: Polished, high-quality feel

  * **Step 2: CSS Refinement Iterations (LOOP 3-5+ times)**

    + For EACH issue found in screenshots:
      1. Make targeted CSS adjustment
      2. Re-run screenshot script
      3. Compare new vs. old screenshot
      4. Document improvement or iterate further
      5. Repeat until perfect

    + **Common Adjustments:**
      - Typography: Adjust font-size by 0.125-0.25rem increments
      - Spacing: Adjust padding/margin by 2-4px increments
      - Shadows: Fine-tune opacity by 0.01-0.02 increments
      - Colors: Adjust accent shades for better contrast
      - Grid gaps: Balance tile spacing for visual harmony
      - Breakpoints: Smooth transitions between viewport sizes

  * **Step 3: Responsive Behavior Validation**

    + Create `/tmp/playwright-test-responsive-transitions.js` with:
      - Test intermediate viewport sizes:
        * 480px, 640px, 960px, 1280px, 1440px
      - Verify no awkward layout shifts
      - Ensure smooth responsive behavior
      - Check for horizontal overflow
      - Use `headless: true` mode

    + **Fix any issues:**
      - Add media queries for problematic sizes
      - Adjust max-widths and breakpoints
      - Ensure single-column mobile, 2-column desktop
      - Test edge cases (very wide screens, very narrow)

  * **Step 4: Animation and Transition Polish**

    + Review all transitions:
      - Tile hover effects: Subtle translateY(-2px)
      - Tags hover card: Gentle lift with shadow increase
      - Smooth 300ms cubic-bezier(0.4, 0, 0.2, 1)
      - Image cross-fades: Opacity transitions
      - Tag activation: Color change smooth

    + Use visible browser (`headless: false`) for timing verification
    + Ensure animations feel natural, not robotic

  * **Step 5: Functional Polish**

    + Error handling:
      - Missing images: Fallback or graceful hide
      - Failed JSON load: User-friendly error message
      - 404 routing: Smooth redirect without flash
    + Loading states:
      - Skeleton screens or subtle loaders
      - No jarring content shifts
    + Accessibility:
      - All images have alt text (from JSON)
      - ARIA labels on interactive elements
      - Keyboard navigation works smoothly
      - Screen reader compatible
    + SEO:
      - Meta tags populate dynamically
      - og:image from JSON thumbnails
      - Proper heading hierarchy
    + Performance:
      - Images optimized (WebP, proper sizes)
      - CSS minified for production
      - JavaScript efficient
      - No unnecessary re-renders

  * **Step 6: Final Comprehensive Screenshot Review**

    + Take final full-site screenshots at all breakpoints
    + Compare side-by-side with initial audit screenshots
    + Document all improvements made
    + Verify every issue from initial audit is resolved
    + Get final sign-off that design is pixel-perfect

  * **Success Criteria:**
    ✅ Typography hierarchy is perfect at all breakpoints  
    ✅ Spacing is rhythmic and balanced throughout  
    ✅ Shadows are consistent and subtle on ALL elements  
    ✅ Corners treated correctly (sharp tiles, rounded cards)  
    ✅ Colors balanced with proper contrast  
    ✅ Magazine aesthetic maintained everywhere  
    ✅ Responsive behavior smooth with no awkward states  
    ✅ Animations feel natural and polished  
    ✅ All functional requirements met  
    ✅ Accessibility fully implemented  
    ✅ SEO optimized  
    ✅ Performance optimized  
    ✅ Design looks professional and timeless  
    ✅ Ready for production deployment

#### 15. Anti-Hardcoding Audit

  * **Action:** MANUAL CODE REVIEW

  * **Files to CHECK:**
    - `homepage-controller.js`
    - `entry-controller.js`
    - `index.html`
    - `entry.html`

  * **Items to VERIFY:**
    - No hardcoded project lists
    - No hardcoded tag lists
    - No hardcoded section names (pull from manifest/JSON)
    - All content from JSON or data files
    - All URLs constructed dynamically

  * **Search For:**
    - Array literals with project data
    - String literals with tag names
    - Hardcoded section names outside of config

  * **Fix:** Replace any hardcoded values with dynamic loading

---

## Success Criteria

### Functional Requirements:

   + ✅ Homepage loads with 4 randomized section tiles  
   + ✅ Section tiles show random projects on each reload  
   + ✅ Entry pages load from clean URLs  
   + ✅ Entry pages populate ALL content from JSON (including project_url, github, page_imagery)
   + ✅ Related posts show 5 relevant projects (not 3)
   + ✅ Related posts rotate every 6 hours (not daily)
   + ✅ All pages work on localhost with URL params  
   + ✅ All pages work on GitHub Pages with clean URLs  
   + ✅ Tag filtering works on section pages  
   + ✅ Sticky filters work correctly  
   + ✅ No hardcoded values anywhere (Task #14 verified)

### Visual Design Requirements (Playwright-Verified):

   + ✅ **Typography:** Hierarchy perfect at all breakpoints (H1 > H2 > H3 > body)
   + ✅ **Spacing:** Rhythmic, balanced, generous whitespace throughout
   + ✅ **Shadows:** Consistent soft layered pattern on ALL elements
   + ✅ **Corners:** Sharp on tiles (0), subtle on cards (4px), circular profile (50%)
   + ✅ **Colors:** Accent blue (#4a9eff) consistent, proper text contrast
   + ✅ **Magazine Aesthetic:** Visual-first, minimal text, clean, timeless
   + ✅ **Mobile (375px):** Single column, no overflow, proper touch targets
   + ✅ **Tablet (768px):** Smooth breakpoint transition, balanced layout
   + ✅ **Desktop (1920px):** 2-column grids, max-width centering, generous padding
   + ✅ **Responsive:** No awkward intermediate states, smooth viewport transitions
   + ✅ **Animations:** 300ms cubic-bezier, natural feel, subtle hover effects
   + ✅ **Design matches Phase 1 aesthetic:** Consistent with section.html styling
   + ✅ **Pixel-Perfect:** Iteratively refined through 3-5+ screenshot review cycles

---

## Notes for Claude Code

  * **Read First:**
    - `/Users/seanivore/Development/360-design/assets/docs/ARCHITECTURE.md`
    - `/Users/seanivore/Development/360-design/assets/docs/SPEC.md`

  * **Testing Strategy:**
    - Localhost: URL parameters (?section=Web, ?path=web/html-css-js/project)
    - Production: Clean URLs via 404 routing

  * **Common Pitfalls:**
    - Don't hardcode - use manifest.json and placement.json
    - Capitalization matters on localhost (section=Web not section=web)
    - Related posts: 6-hour seed, 5 tiles (not 3)
    - Role is now STRING not ARRAY (schema v3.1)
    - Tag links preserve clicked tag as sticky filter

  * **Debugging:**
    - Console logs: emoji prefixes (📂, ✅, ❌, 🔍, 📊)
    - Log related posts scoring
    - Log URL parsing

  * **Reference Implementation:**
    - `section-controller.js` for controller patterns
    - `tile-renderer.js` for tile rendering
    - `data-loader.js` for data fetching
    - `filter-controller.js` for filtering

---

*Spec created: 2025-10-16* 
*Spec updated: 2025-10-18 (Session 05 - All decisions finalized)* 
*Spec updated: 2025-10-21 (Session 07 - Integration of finalized decisions confirmed)*
*Spec updated: 2025-10-21 (Session 08 - Integration of agentic testing and design review tools)*
*Phase 1 prepared in Claude Chat* 
*Phase 2 & 3 ready for Claude Code*