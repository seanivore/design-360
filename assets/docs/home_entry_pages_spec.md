# Claude Code Agentic Workflow SPEC for Homepage & Entry Pages 

  > 1 - Ingest the information from this file
  > 2 - Implement the Low-Level Tasks
  > 3 - Generate code that will satisfy High and Mid Level Objective
  > 4 - Perform all requested testing and validation 

---

## Objectives

### High-Level

  + Build two core remaining portfolio pages: Homepage (`./index.html`) and Entry Page Template (`./entry.html`)
    - Homepage showcases 4 section tiles with random project selection on each load
    - Entry pages display individual projects with related posts based on tag matching
  + Complete the "Single-JSON Portfolio Architecture" with full dynamic content population

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
        "thumbnail_alt_text": ["Project thumbnail showing..."],
        "page_imagery": ["/assets/media/project/img1.jpg"],
        "page_imagery_alt_text": ["Additional project image showing..."]
    },
    "assets": {
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

## Context

### Starting Context - Files Already Complete (Phase 1)

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

  * **Assets Needed:**
    - Profile picture at `./assets/media/profile-picture-horvath.webp` 
    - Social icons (SVG or icon font)

---

## Low Level Tasks

### PHASE 2: HOMEPAGE

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
     - **Project count badge**: Display "X projects" in top-right corner of each section tile (small, out of way but visible)

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
    imgEl.alt = project.content.media.thumbnail_alt_text[i] || `${section} project image`;
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

#### 5. Test Homepage on Localhost

  * **Action:** MANUAL TEST

  * **Tests to PERFORM:**
      - Visit `http://localhost:5500/` or `http://localhost:5500/index.html`
      - Verify 4 section tiles appear in random order
      - Verify each tile shows random project from that section
      - Reload page - tiles show different projects and different order
      - Test image swipe functionality
      - Verify count badges show correct numbers
      - Test smooth scroll to #about and #contact
      - Verify profile picture displays with stroke and shadow
      - Verify social icon links work
      - Check responsive behavior (resize window)

---

### PHASE 3: ENTRY PAGES

#### 6. Create `entry-controller.js`

  * **Action:** CREATE `./assets/js/entry-controller.js`

  * **Functions to CREATE:**
      - `parseEntryURL()` - Extracts section/sub_section/slug from URL
      - `loadEntry(urlPath)` - Loads project JSON from manifest
      - `calculateTagMatches(project, allProjects)` - Scores projects by tag overlap
      - `selectRelatedPosts(project, allProjects, count=5)` - Picks 5 related projects
      - `getTimeSeed()` - Generates 6-hour-changing seed
      - `seededRandom(seed)` - Deterministic random
      - `renderEntryContent(project)` - Populates page with ALL project data
      - `renderRelatedPosts(relatedProjects)` - Renders 5 related tiles
      - `init()` - Initializes entry page

  * **Details:**

   **Related Posts Logic:**
   1. Calculate tag overlap (count matching tags across technology/media/skill)
   2. Filter to top scorers (ties allowed)
   3. Use 6-hour time seed: `Math.floor(Date.now() / (1000 * 60 * 60 * 6))`
   4. Select 5 projects randomly from top scorers using seededRandom
   5. Every project recommended eventually, order rotates every 6 hours

   **Seeded Random:**
```javascript
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
```

   **Content Population (renderEntryContent must include ALL of these):**
   - SEO meta tags from `seo_title`, `seo_description`
   - Page title and subtitle
   - Breadcrumbs (section › subsection › breadcrumb)
   - All tags as horizontal scrolling ribbon under title (full 100vw)
   - Role heading and content
   - Pattern, Action, Measured sections
   - Thumbnail slideshow with alt text
   - Video embed with alt text (if exists)
   - **page_imagery** section with alt text (if exists)
   - **project_url** embed (prominent with title/description/image - like og:image preview)
   - **github_repository** embed (GitHub's auto-generated card style)
   - Repeat tags before related posts in simple column format

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
    
    <!-- Title & Subtitle -->
    <section class="entry-header">
      <h1 id="entry-title"></h1>
      <h2 id="entry-subtitle"></h2>
    </section>
    
    <!-- Tags Ribbon (full 100vw, horizontal scroll) -->
    <div class="entry-tags-ribbon">
      <div class="entry-tags-scroll">
        <!-- JS populates: section, subsection, role, all contextual tags -->
      </div>
    </div>
    
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
    
    <!-- Tags List (repeated before related posts) -->
    <div class="entry-tags-list">
      <!-- JS populates: simple column format -->
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
      - Breadcrumbs: section › subsection › breadcrumb (clickable)
      - Tags ribbon: Full 100vw horizontal scroll (matches section page pattern)
      - Tags clickable links to section page with that tag as filter
      - Role heading uses actual role from JSON
      - Content sections: 2-column then full-width text wrap
      - Project URL embed: Prominent preview with title/description/image
      - GitHub embed: GitHub's auto-generated card style (from screenshot)
      - Video: Full-width iframe with alt text
      - Page imagery: Additional images with alt text
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

/* Tags Ribbon (full 100vw) */
.entry-tags-ribbon {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: var(--color-surface-dark);
  padding: var(--space-md) 0;
  margin-bottom: var(--space-xl);
}

.entry-tags-scroll {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
  padding: 0 var(--space-lg);
  scrollbar-width: none;
}

.entry-tags-scroll::-webkit-scrollbar {
  display: none;
}

.entry-tags-scroll a {
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
  transition: color 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.entry-tags-scroll a:hover {
  color: var(--color-accent);
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

/* Tags List (before related posts) */
.entry-tags-list {
  margin-bottom: var(--space-xl);
  font-size: 0.875rem;
  line-height: 1.8;
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

#### 10. Test Entry Pages on Localhost

  * **Action:** MANUAL TEST

  * **Tests:**
      - Visit `http://localhost:5500/entry.html?path=web/html-css-js/personalized-fashion-magazine`
      - Verify all content populates (title, subtitle, role, pattern, action, measured)
      - Verify thumbnail slideshow works with alt text
      - Verify video embed displays (if exists) with alt text
      - Verify page_imagery displays (if exists) with alt text
      - Verify project_url embed displays prominently
      - Verify github_repository card displays
      - Verify breadcrumbs correct and clickable
      - Verify tags ribbon scrolls horizontally
      - Verify tags are clickable links
      - Verify 5 related posts appear with proper padding
      - Reload - related posts should be same (6-hour consistency)
      - Check console for related posts scoring logs
      - Test different entry pages

#### 11. Test Production Routing with HTTP-Server

  * **Action:** MANUAL TEST

  * **Commands:**
```bash
npm install -g http-server
http-server -p 8080 -c-1 --proxy http://localhost:8080?
```

  * **Tests:**
      - Visit `http://localhost:8080/web`
      - Visit `http://localhost:8080/web/html-css-js`
      - Visit `http://localhost:8080/web/html-css-js/project-name`
      - Verify all routes work without URL parameters
      - Verify normalization (lowercase web → Web in JSON)

#### 12. Deploy to GitHub Pages

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

#### 13. Polish and Final Tweaks

  * **Action:** UPDATE files as needed

  * **Items to POLISH:**
      - Tile slide transitions
      - Smooth page transitions
      - Loading states
      - Error handling (404s, missing images)
      - Accessibility (alt text, ARIA labels)
      - SEO meta tags (all templates)
      - Performance optimization
      - Keyboard navigation
      - Screen reader compatibility

#### 14. Anti-Hardcoding Audit

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
   + ✅ Mobile responsive  
   + ✅ Design matches Phase 1 aesthetic
   + ✅ Consistent shadow/blend styling across ALL elements
   + ✅ No hardcoded values anywhere (Task #14 verified)

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
*Phase 1 completed in Claude Chat*  
*Phase 2 & 3 ready for Claude Code*