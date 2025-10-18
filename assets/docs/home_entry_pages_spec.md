# Claude Code Agentic Workflow SPEC for Homepage & Entry Pages 

  > 1.Ingest the information from this file
  > 2.Implement the Low-Level Tasks
  > 3.Generate code that will satisfy High and Mid Level Objective
  > 4.Perform all requested testing and validation 

---

## Objectives

### High-Level

  + Build two core remaining portfolio pages: Homepage (`./index.html`) and an Entry Page Template (`./entry.html`)
    - Homepage showcases 4 section tiles with random project selection on each load
    - Entry pages display individual projects with related posts based on tag matching
  + Complete the "Single-JSON Portfolio Architecture" with full dynamic content population

### Mid-Level

  + Create `./index.html` with three sections: Projects, About, Contact
  + Implement homepage tiles that randomly select `thumbnail_images` and `tile_text` from project JSON files in each section
  + Build `./entry.html` template that dynamically populates from JSON based on URL
  + Create `./assets/js/entry-controller.js` to handle URL parsing, JSON loading, and related posts provided logic
  + Implement time-seeded related posts algorithm for consistent-but-changing recommendations
  + Ensure all pages work with both localhost testing (URL params) and production (404 routing)
  + Match existing design system from `./section.html` (dark mode, sharp corners, gradient background)

### Implementation Notes

  * **Dependencies:**

    + All Phase 1 (current) files are complete, working, tested (`section.html`, all controllers, `data-loader.js`, etc.)
    + 15 JSON project entries exist in `./assets/entries/...`
    + `./assets/js/manifest.json` is current and complete
    + `./assets/js/placement.json` defines 'toggle' tags

  * **Architecture Context:**

    + Read for full system understanding
      - `/Users/seanivore/Development/360-design/assets/docs/ARCHITECTURE.md`
      - `/Users/seanivore/Development/360-design/assets/docs/SPEC.md` 
    + See and understand JSON contents for dynamic population 
      - `/Users/seanivore/Development/360-design/assets/docs/_entry_template.json` 
      - (example) `/Users/seanivore/Development/360-design/assets/entries/uid-eme-689.json` 
      - No need to read the entire collection located in `./assets/entries/...`
    + This is a "mini-SPA" using a 404 routing trick for clean URLs on GitHub Pages
      - Localhost testing uses URL parameters (?section=Web) as workaround
      - All content dynamically populated from JSON; **ABSOLUTELY NO HARDCODING** 

  * **Design Standards:** 

    + Strict mobile-first only 
      - E.g., no hover interactions anywhere because they don't work on mobile 
      - Create smooth transitions @ ~300ms cubic-bezier 
    + Dark mode default and only option for now 
      - Charcoal background 
      - Vertical gradient "glare" effect on body background
      - White text with clean, simple, natural shadow blending 
    + Tiles to access all (4) section categories and all entries 
      - Sharp corners 
      - No border-radius 
      - Realism with shading, boarder highlights etc. simple, timeless 
    + Magazine aesthetic 
      - Visual-first planning is essential 
      - Minimal text on tiles 
      - User should get understanding of most entries and not need to click through many 

  * **JSON Structure Reference:**

    + `/Users/seanivore/Development/360-design/assets/docs/_entry_template.json` 
    + example: `/Users/seanivore/Development/360-design/assets/entries/uid-rfr-187.json`

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
        "technology": ["JavaScript", "JSON", "GitHub Pages", "CSS", "Python", "HTML", "Dynamic Updates", "Agentic AI Systems"],
        "media": ["Scalable System Design", "Portfolio Website", "Single-Page Application"],
        "role": ["Systems Designer"], 
        "skill": ["Information Architecture", "Modular Design", "DRY Principles", "Agentic Coding", "Creative Direction", "User Design"]
    }
},
"content": {
    "media": {
        "video_filename": "",
        "video_url": "",
        "video_embed": "", 
        "video_alt_text": "",
        "thumbnail_images": [], 
        "thumbnail_alt_text": [],
        "page_imagery": [],
        "page_imagery_alt_text": []
        },
    "assets": {
        "project_url": "https://august.style",
        "github_repository": "https://github.com/seanivore/design-360"
    },
    "teaser_copy":{
        "seo_title": "Rapid Scaling Portfolio Pages Update Without Refresh",
        "seo_description": "This technically simple build used some innovative concepts to turn creating 50+ or more unique website pages by creating just two HTML files.", 
        "page_title": "Single-JSON Portfolio Architecture", 
        "page_subtitle": "50+ pages from 2 templates", 
        "breadcrumb": "Website Dynamic App",
        "tile_text": [
            "Real-time page updates without refreshing pages", 
            "Modular design means drop in one file to create entries, sections, more", 
            "Find a faster portfolio to scale up than this one, we'll wait"
        ]
    },
    "page_copy":{
        "pattern": "Traditional portfolios require maintaining 50+ HTML files. Updates mean editing each file individually. Adding entries means copying templates and linking manually.",
        "action": "Designed hybrid SPA architecture using 404 routing trick + JSON content system. Two HTML templates dynamically populate from entry files. Manifest generation automates URL mapping.", 
        "measured": "Result: Add new entries by creating one JSON file. Update design once, all pages update. Infinite scalability with zero code duplication." 
    }
  }
}
```

  * **Coding Standards:**
  
    + Use ES6+ features (async/await, arrow functions, template literals)
    + All JavaScript in IIFE modules to avoid global scope pollution
    + Extensive console logging for debugging (with emoji prefixes for visual scanning)
    + Follow existing naming conventions from Phase 1 controllers
    + Comments should explain WHY not WHAT (code should be self-documenting)

---

## Context

### Starting Context - Files Already Complete (all of Phase 1)

  * **Core Pages:**

    - `./section.html` (section page template - WORKING ✅)
    - `./404.html` (routing helper - WORKING ✅)
    - `./styles.css` (complete design system - WORKING ✅)

  * **JavaScript Modules:**

    - `./assets/js/data-loader.js` (JSON fetching, filtering, caching - WORKING ✅)
    - `./assets/js/tile-renderer.js` (section tile rendering - WORKING ✅)
    - `./assets/js/filter-controller.js` (tag filtering, sticky filters - WORKING ✅)
    - `./assets/js/section-controller.js` (section page orchestration - WORKING ✅)

  * **Data Files:**

    - `./assets/js/manifest.json` (URL→JSON mapping - WORKING ✅)
    - `./assets/js/placement.json` (toggle tags config - WORKING ✅)
    - `./assets/entries/*.json` (15 complete project entries - WORKING ✅)

  * **Documentation:**
    
    - `./assets/docs/ARCHITECTURE.md` (system design doc)
    - `./assets/docs/SPEC.md` (project overview)
    - `./assets/docs/_entry_template.json` (JSON schema)

### Context at Completion & New Files to Create

  * **Create New Pages:**

    - `index.html` (homepage with Projects/About/Contact sections)
    - `entry.html` (entry page template for individual projects)

  * **Create New JavaScript:**

    - `/assets/js/entry-controller.js` (entry page orchestration)
    - `/assets/js/homepage-controller.js` (homepage tile logic)

  * **Use or Produce Assets Needed:**

    - Profile picture at `./assets/media/profile-picture-horvath.webp` 
    - Social icons (use simple SVG or icon font) 

---

## Low Level Tasks

  > Ordered from start to finish
  > Complete these to finish Phases 2 & 3

### PHASE 2: HOMEPAGE

#### 1. Create `homepage-controller.js`

  * **Prompt:** Create the homepage controller that handles random section tile selection

  * **Action:** CREATE `./assets/js/homepage-controller.js`

  * **Functions to CREATE:**

     - `selectRandomProjectFromSection(section)` - Picks one random project from a section
     - `loadHomepageTiles()` - Loads 4 section tiles (Web, Print, Digital, Video)
     - `renderHomepageTile(project, section)` - Renders a single homepage tile
     - `shuffleSectionOrder()` - Randomizes the order of the 4 section tiles on every reload 
     - `init()` - Initializes the homepage

  * **Details:**

     - Use `DataLoader.loadAllProjects()` to get all entries
     - Filter by section: Web, Print, Digital, Video
     - Randomly select ONE project from each section's entries for each section's section tile 
     - Use that project's `thumbnail_images` and `tile_text` arrays
     - On page reload, different projects should be selected
     - Section tiles should be in random order (not always Web→Print→Digital→Video) on reload 
     - Include project count badge located out of the way but visible, changing with filter use (e.g. "15 projects")

#### 2. Create `index.html` Structure

  * **Prompt:** Create the homepage HTML with Projects, About, and Contact sections

  * **Action:** CREATE `./index.html`

  * **Structure to CREATE:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Standard meta tags, title, styles.css link -->
  <!-- Match section.html head structure exactly -->
</head>
<body>
  <!-- Header (same as section.html) -->
  
  <!-- Projects Section -->
  <section id="projects">
    <h1>Projects</h1>
    <div id="homepage-tile-grid" class="homepage-tile-grid">
      <!-- 4 section tiles inserted here by JS -->
    </div>
  </section>
  
  <!-- About Section -->
  <section id="about">
    <img src="/assets/media/profile.jpg" alt="Sean August Horvath" class="profile-pic">
    <div class="about-content">
      <h2>Sean August Horvath, Creative Innovation Generalist</h2>
      <p>14 years hopping borders between art, product, and growth. Clean lines, maximal ideas. Sketches brands by hand, ships AI pipelines by night. Pattern recognition is my superpower; making it teachable is my craft.</p>
    </div>
  </section>
  
  <!-- Contact Section -->
  <section id="contact">
    <h2>Contact</h2>
    <div class="social-links">
      <a href="https://github.com/seanivore">GitHub</a>
      <a href="https://linkedin.com/in/seanivore/">LinkedIn</a>
      <a href="https://instagram.com/seanivore/">Instagram</a>
      <a href="mailto:horvathaugust@gmail.com">Email</a>
    </div>
  </section>
  
  <!-- Footer (same as section.html) -->
  
  <!-- Scripts -->
  <script src="/assets/js/data-loader.js"></script>
  <script src="/assets/js/tile-renderer.js"></script>
  <script src="/assets/js/homepage-controller.js"></script>
</body>
</html>
```

  * **Details:**

      - Use #projects, #about, #contact IDs for anchor linking
      - Profile picture should be circle-cropped via CSS with ~5 px wide white stroke 
      - Social links should be simple icons, no text needed 
      - Match header/footer from `section.html` exactly
      - Smooth scroll behavior for anchor links

#### 3. Add Homepage Specific Styles to `styles.css`

  * **Prompt:** Add CSS for homepage tiles and About/Contact sections

  * **Action:** UPDATE `/Users/seanivore/Development/360-design/styles.css`

  * **Styles to ADD:**

```css
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
  /* Larger, squarer tiles */
  aspect-ratio: 1 / 1;
  /* Match section tile styling but bigger */
}

/* About Section */
.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.about-content {
  /* Layout for text beside profile pic */
}

/* Contact Section */
.social-links {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
}

.social-links a {
  /* Simple link styling */
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
```

  * **Details:**

      - Homepage tiles should be larger and square compared to section tiles
      - Use existing CSS variables and design tokens
      - Ensure responsive behavior (1 column mobile, 2 column desktop) *C: it would be nice for them to shrink/grow a tiny bit but not a lot, between each device fixed size point* 
      - Profile picture should be circle-cropped with white stroke around *C: should we mention things like shadow and blending per items like here, or somewhere more larger and general to be clear it would apply to basically everything from text to tiles* 
      - Maintain consistent spacing using existing variables

#### 4. Update `tile-renderer.js` for homepage tiles

  * **Prompt:** Add homepage tile rendering function to `tile-renderer.js`

  * **Action:** UPDATE `./assets/js/tile-renderer.js`

  * **Function to ADD:**

      - `renderHomepageTile(project, section, container)` - Renders homepage tile with image swipe, gesture on mobile

  * **Details:**

      + Similar to `renderSectionTile()` but:
        - Larger aspect ratio (1:1 square)
        - Shows section name as overlay (e.g., "WEB") *C: since this is unlike section tiles, maybe we be more detailed; perhaps the image section has a very slight 5% black layer, to place it on the image but not covering it all* 
      + Links to /web (or /print, /digital, /video)
        - Includes swipe functionality for `thumbnail_images` 
      + Text from `tile_text` array cycles with images
        - Should return the created tile element
        - Use existing swipe logic from section tiles 

#### 5. Test Homepage on localhost

  * **Prompt:** Manual testing step - load homepage and verify functionality

  * **Action:** MANUAL TEST

  * **Tests to PERFORM:**

      - Visit `http://localhost:3000/` or `http://localhost:3000/index.html`
      - Verify 4 section tiles appear in random order
      - Verify each tile shows images from a random project in that section with text defining section 
      - Reload page - tiles should show different projects and be in a different order
      - Test swipe functionality on tiles
      - Test smooth scroll to #about and #contact
      - Verify profile picture displays
      - Verify social links work
      - Verify sizing, spacing, etc. of all elements follows best practice norms 
      - Check responsive behavior (resize window)

### PHASE 3: ENTRY PAGES

#### 6. Create `entry-controller.js`

  * **Prompt:** Create the entry page controller with related posts logic

  * **Action:** CREATE `./assets/js/entry-controller.js`

  * **Functions to CREATE:**

      - `parseEntryURL()` - Extracts `section`/`sub_section`/`slug` from URL
      - `loadEntry(urlPath)` - Loads project JSON based on URL
      - `calculateTagMatches(project, allProjects)` - Scores projects by tag overlap
      - `selectRelatedPosts(project, allProjects, count=3)` - Picks related projects
      - `getTimeSeed()` - Generates daily-changing seed for consistent randomization
      - `seededRandom(seed)` - Deterministic random based on seed
      - `renderEntryContent(project)` - Populates page with project data
      - `renderRelatedPosts(relatedProjects)` - Renders related post tiles
      - `init()` - Initializes entry page

  * **Details:**

   - Use `./assets/js/manifest.json` to map URL path to JSON file 
   - Related posts logic:

      1. Calculate tag overlap for all other projects (count matching tags) 
      2. Filter to top scorers (ties allowed)
      3. Use time-based seed (changes daily) for consistent-but-rotating selection 
      4. Select 3 projects randomly from top scorers using seeded random 
      5. Every project gets recommended, but order rotates daily

   - Time seed should use: `Math.floor(Date.now() / (1000 * 60 * 60 * 24))` for daily rotation

   - Seeded random implementation:

```javascript
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
```
   - Log related posts selection for debugging

#### 7. Create `entry.html` template

  * **Prompt:** Create the entry page HTML template

  * **Action:** CREATE `./entry.html`

  * **Structure to CREATE:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Match section.html head -->
</head>
<body>
  <!-- Header (fixed, follows scroll) -->
  
  <main class="entry-page">
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs">
      <!-- Dynamically populated -->
    </nav>
    
    <!-- Tag List (right-aligned) -->
    <div class="entry-tags">
      <!-- Dynamically populated -->
    </div>
    
    <!-- Title & Subtitle -->
    <section class="entry-header">
      <h1 id="entry-title"></h1>
      <h2 id="entry-subtitle"></h2>
    </section>
    
    <!-- Main Content (4 sections) -->
    <section class="entry-content">
      <!-- Role Section -->
      <div class="content-section">
        <div class="content-images">
          <!-- Image slideshow -->
        </div>
        <div class="content-text">
          <h3 id="role-heading"></h3>
          <div id="role-content"></div>
        </div>
      </div>
      
      <!-- Pattern Section -->
      <div class="content-section">
        <div class="content-images">
          <!-- Image slideshow -->
        </div>
        <div class="content-text">
          <h3>Pattern</h3>
          <p id="pattern-text"></p>
        </div>
      </div>
      
      <!-- Action Section -->
      <div class="content-section">
        <div class="content-images">
          <!-- Image slideshow -->
        </div>
        <div class="content-text">
          <h3>Action</h3>
          <p id="action-text"></p>
        </div>
      </div>
      
      <!-- Measured Section -->
      <div class="content-section">
        <div class="content-images">
          <!-- Image slideshow -->
        </div>
        <div class="content-text">
          <h3>Measured</h3>
          <p id="measured-text"></p>
        </div>
      </div>
    </section>
    
    <!-- Video Embed (if exists) -->
    <section id="video-section" class="video-container">
      <!-- Dynamically populated -->
    </section>
    
    <!-- Divider with breadcrumbs + tags repeat -->
    <hr class="content-divider">
    
    <!-- Related Posts -->
    <section class="related-posts">
      <h3>Related Projects</h3>
      <div id="related-posts-grid">
        <!-- 3 related tiles -->
      </div>
    </section>
  </main>
  
  <!-- Footer -->
  
  <!-- Scripts -->
  <script src="/assets/js/data-loader.js"></script>
  <script src="/assets/js/tile-renderer.js"></script>
  <script src="/assets/js/entry-controller.js"></script>
</body>
</html>
```

  * **Details:**
      
      - Breadcrumbs format: Web › HTML/CSS/JS › Project Name where 'Project Name' is `breadcrumb` from JSON 
      - Tags should be clickable links to `section.html` with that tag filtered
      - Role heading uses the actual role from JSON (e.g., "Web Developer") 
      - Image slideshows use `thumbnail_images` array
      - Content sections start 2-column (image slideshow + text) then expand full-width below images
      - Video embed should be full-width iframe 
      - Related posts use same tile rendering as section page 

#### 8. Add entry page styles to `styles.css`

  * **Prompt:** Add CSS for entry pages via existing file update 

  * **Action:** UPDATE `./styles.css`

**Styles to ADD:**
```css
/* Entry Page Layout */
.entry-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl);
}

/* Breadcrumbs */
.breadcrumbs {
  /* Small, uppercase, gray */
}

/* Entry Tags */
.entry-tags {
  /* Right-aligned, wrapped tags */
}

/* Entry Header */
.entry-header h1 {
  /* Large, bold title */
}

.entry-header h2 {
  /* Smaller subtitle */
}

/* Content Sections */
.content-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.content-images {
  /* Image slideshow container */
}

.content-text {
  /* Text content */
}

@media (max-width: 768px) {
  .content-section {
    grid-template-columns: 1fr;
  }
}

/* Video Container */
.video-container {
  margin: var(--space-xl) 0;
}

.video-container iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
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
}

#related-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}
```

  * **Details:**

      - Match heading hierarchy from `SPEC.md`
      - H1 = `page_title` (large, heavy)
      - H2 = `page_subtitle` (smaller than H3)
      - H3 = entry page's section headings (Pattern, Action, etc. from `page_copy` plus Role from `tagging`)
      - H4 = tags on page (pulled from any JSON `tagging` category) sans `role` 
      - H5 = `breadcrumbs` (make almost identical to tags on the page)
      - Two-column layout for content sections (image + text)
      - Text wraps to full width below images
      - Responsive: single column on mobile; swipe gesture image slideshow 

#### 9. Update `404.html` to handle entry routing

  * **Prompt:** Ensure and verify `404.html` correctly routes entry page URLs

  * **Action:** UPDATE `./404.html`

  * **Logic to VERIFY:**

```javascript
// Already implemented, just verify:
// If URL path exists in manifest.entries → redirect to entry.html
// If URL path is 1-2 segments → redirect to section.html
// Store path in sessionStorage for controller to read
```

  * **Details:**

      - `404.html` should already have this logic from completed Phase 1
      - Just verify it's checking `manifest.entries` properly
      - Entry paths are 3 segments: /web/html-css-js/"project name" (this is `breadcrumb` on JSON)
      - Should set `sessionStorage.entryPath` and redirect to `/entry.html`

#### 10. Test entry pages on localhost

  * **Prompt:** Manual testing step - perform test of entry page loading and page's related posts

  * **Action:** MANUAL TEST with URL parameter workaround

  * **Tests to PERFORM:**

      - Create test URL: `http://localhost:3000/entry.html?path=web/html-css-js/personalized-fashion-magazine`
      - Verify page loads correct project data
      - Verify all content sections populate (`title`, `subtitle`, `role`, `pattern`, `action`, `measured`, etc.)
      - Verify images display and slideshow works
      - Verify video embed displays (if present)
      - Verify `breadcrumb` list is correct and formatted nicely
      - Verify tags are clickable and link to section page with only that tag locked as section page filter
      - Verify related posts appear
      - Reload page - related posts should be the same (time-seeded consistency)
      - Test different entry pages for all of the same above verifications 
      - Check console for related posts scoring logs

*Q: Mentioned before but maybe we should check if browser design use is a skill to add to Claude Code, a feature I have not had time to explore yet, but I assume it is and probably preferred to an MCP; and then since we'd be using that, we should be sure that it considers things from a design layout standpoint and makes adjustments that ensure an aesthetically pleasing page, which is the main use for other AI browser preview tools; I think that might actually just take screen shots when the screen opens, I don't actually mean the browser use tool. Perhaps please research skills and this specifically for us?* 

#### 11. Test Full Production Routing Locally With HTTP-Server 

  * **Prompt:** Set up better local server manual test 404 routing

  * **Action:** MANUAL SETUP & TEST

  * **Commands to RUN:**

```bash
# Install http-server if not present
npm install -g http-server

# Run with 404 support
http-server -p 8080 -c-1 --proxy http://localhost:8080?

# Or use Python with custom handler
# (See `ARCHITECTURE.md` for details)
```

  * **Tests to PERFORM:**

      - Visit `http://localhost:8080/web` (should work like production)
      - Visit `http://localhost:8080/web/html-css-js`
      - Visit `http://localhost:8080/web/html-css-js/project-name`
      - Verify all routes work without URL parameters
      - Verify normalization (lowercase web → Web in JSON)

#### 12. Deploy to GitHub Pages for Full Testing 

  * **Prompt:** Push to GitHub Pages and test production URLs

  * **Action:** MANUAL DEPLOYMENT 

  * **Steps to PERFORM:**  *Q: lets push to a new branch, in git and github call it `generalist-portfolio-v1`*
```bash
# Ensure all files committed
git add .
git commit -m "Claude Code SPEC creation and testing of homepage and entry pages with features"
git push 

# GitHub Pages should auto-deploy from main branch
# Wait 1-2 minutes for deployment
```

  * **Tests to PERFORM:** 
      
      - Visit `www.august.style` (homepage)
      - Click all four section tiles → should go to `www.august.style/web`, /print, etc.
      - Click project tiles → should go to `www.august.style/web/html-css-js/project-name` ('project-name' being `breadcrumb` on JSON)
      - Test tag filtering on section pages
      - Test related posts on entry pages
      - Test breadcrumbs and navigation
      - Verify all images and videos load
      - Test on mobile device
      - Test on atypical in-between mobile/tablet/desktop sizes to see if nothing looks awkward 

#### 13. Polish and final tweaks *C: the mention of testing keyboard navigation felt random compared to other testing steps which makes me curious if, by the end here, we're losing the necessary detailed specificity needed by Claude Code*  

  * **Prompt:** Address any remaining design/UX issues

  * **Action:** UPDATE `./styles.css` and controllers as needed

  * **Items to POLISH:**

      - Tile slide transitions (mentioned earlier)
      - Smooth page transitions
      - Loading states
      - Error handling (404s, missing images)
      - Accessibility (alt text, ARIA labels)
      - SEO meta tags *C: I mentioned above adding these to the template HTML FYI* 
      - Performance optimization

 *  **Details:** 

      - Review `SPEC.md` and `ARCHITECTURE.md` for micro-interactions notes 
      - Ensure all animations are smooth (300ms)
      - Test keyboard navigation
      - Verify screen reader compatibility
      - Add meta descriptions to all pages
      - Optimize image loading

---

## Success Criteria

   + ✅ Homepage loads with 4 randomized section tiles  
   + ✅ Section tiles show random projects on each reload  
   + ✅ Entry pages load from clean URLs  
   + ✅ Entry pages populate all content from JSON  
   + ✅ Related posts show 3 relevant projects  
   + ✅ Related posts rotate daily (time-seeded)  
   + ✅ All pages work on localhost with URL params  
   + ✅ All pages work on GitHub Pages with clean URLs  
   + ✅ Tag filtering works on section pages  
   + ✅ Sticky filters work correctly  
   + ✅ Mobile responsive  
   + ✅ Design matches Phase 1 aesthetic  

---

## Notes for Claude Code

  * **Read First:**

      - `/Users/seanivore/Development/360-design/assets/docs/ARCHITECTURE.md` (full system design)
      - `/Users/seanivore/Development/360-design/assets/docs/SPEC.md` (project overview)

  * **Testing Strategy:**

      - Localhost: Use URL parameters (?section=Web, ?path=web/html-css-js/project)
      - Production: Clean URLs work via 404 routing

  * **Common Pitfalls:**

      - Don't hardcode project lists - always use manifest.json
      - Capitalization matters on localhost (section=Web not section=web)
      - Related posts should use time-seeded random, not pure random
      - Tag links from entry pages should preserve the clicked tag as sticky filter

  * **Debugging:**

      - Console logs should use emoji prefixes (📂, ✅, ❌, 🔍, 📊)
      - Log related posts scoring to verify algorithm
      - Log URL parsing to verify routing

  * **Reference Implementation:**

      - Look at `section-controller.js` for controller patterns
      - Look at `tile-renderer.js` for tile rendering patterns
      - Look at `data-loader.js` for data fetching patterns
      - Look at `filter-controller.js` for filtering patterns

---

*Spec created: 2025-10-16* 
*Spec updated: 2025-10-18* 
*Phase 1 completed in Claude Chat*  
*Phase 2 & 3 ready for Claude Code* 