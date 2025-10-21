# Single-JSON Portfolio Architecture
*Add entries, scale sections, update navigation—all by dropping in one file.*

* **Project:** Creative Innovations Generalist Portfolio (august.style)  
  + **Purpose:** Document our clever architecture for future AI collaborators  
    - **Date Created:** 2025-10-10
    - **Date Updated:** 2025-10-21 

---

## Why This Document Exists

  + This portfolio uses an **unconventional but brilliant** architecture that might confuse AI assistants at first glance. 
    - We're combining several web technologies in a non-standard way to achieve something elegant: 
    - **50+ portfolio pages from only 2 HTML templates**.

  + If you're a future AI reading this, here's what you need to know.

---

## The Problem We Solved

  * **Traditional Approach:**

    + 50 portfolio entries = 50 individual HTML files
      - Pain to maintain
      - Copy-paste errors
    + Updating design = editing 50 files

  * **Our Approach:**

    + 50 portfolio entries = 50 JSON files + 2 HTML templates
      - Update design once, all pages update
      - Add new entry = create JSON only
    + Zero code duplication

---

## The Clever Part: Hybrid Architecture

  + We're using THREE different routing strategies simultaneously 

### 1. Jekyll (GitHub Pages) - For Clean URLs

    ```
    Traditional: august.style/entry.html
    Our result: august.style/web/html-css-js/slug-project-name
    ```

  * **What Jekyll does:** Removes `.html` extensions automatically  
  * **What we do:** Leverage this WITHOUT using Jekyll templates  
  * **Result:** Clean URLs for free

### 2. SPA Routing (404 Trick) - For Dynamic Templates

    ```
    User visits: `august.style/web/html-css-js/slug`
    No file exists at that path
    GitHub Pages serves: `404.html`
    `404.html` redirects to: `entry.html` (preserving URL)
    JavaScript loads: Correct JSON based on URL
    ```

  * **This is the unconventional part.** 
  
    + We're making GitHub Pages THINK it's serving static files 
      - But we're actually running a mini single-page application 

### 3. Hash Routing for Dynamic Filtering

    ```
    `august.style/web#tags=copywriting+illustration`
    ```

  * **What happens:**

    + Base page loads (`section.html` showing "web" projects)
      - Hash changes don't trigger page reload
      - JavaScript reads hash, filters tiles dynamically
    + User can stack filters: `#tags=tag1+tag2+tag3`

---

## How It Actually Works

### File Structure

    ```
    Only 3 HTML templates:
    ├── `index.html`       (homepage - traditional)
    ├── `section.html`     (handles ALL section/subsection/projects pages)
    └── `entry.html`       (handles ALL entry pages)

    Plus routing helper:
    └── `404.html`         (SPA routing trick)

    Plus dynamic index:
    └── `manifest.json`    (auto-generated URL → JSON mapping)
    ```

### The Magic: One Template, Many Pages

  * **`section.html` dynamically handles:**

    + `/web` → Filter to section="Web"
    + `/web/html-css-js` → Filter to section="Web" AND subsection="HTML/CSS/JS"
    + `/projects` → Show everything
    + Plus hash filtering: `#tags=copywriting`
    + Tiles shuffled every reload, but any active filters must remain applied

  * **`entry.html` dynamically handles:**

    + `/web/html-css-js/slug-project-name` → Load `uid-xxx-###.json`, render page

  * **How does entry.html know which JSON to load?**

    + The `manifest.json` file maps URLs to JSON files 
      - This manifest is **auto-generated** by scanning all JSON files 

    ```json
    {
    "entries": {
        "web/html-css-js/slug-project-name": "assets/data/web/html-css-js/uid-abc-123.json"
    }
    }
    ```

---

## The JSON Structure (Purposefully Human-Readable)

### Why Fields Look "Weird"

```json
{
  "categorization": {
    "entry_id": "uid-abc-123",
    "placement": {
      "section": "Web",              // ← Capitalized!
      "sub_section": "HTML/CSS/JS",  // ← Has slashes!
      "slug": "project-name"         // ← Clean, no extension
    },
    "tagging": {
      "technology": ["CSS Animation", "Responsive Design"],  // ← Spaces!
      "media": ["Portfolio Website"],
      "role": "Creative Technologist",  // ← STRING not array (v3.1)
      "skill": ["Landing Page Design"]   // ← Pretty!
    }
  },
  "content": {
    "media": {
      "video_embed": "https://...",
      "video_alt_text": "Screen recording showing website interaction",  // ← v3.1
      "thumbnail_images": ["/assets/media/thumb1.jpg"],
      "thumb_slideshow_alt_text": "Project thumbnail showcasing design",  // ← v3.1
      "page_imagery": ["/assets/media/page1.jpg"],  // ← v3.1
      "page_image_group_alt_text": "Additional project images"  // ← v3.1
    },
    "assets": {
      "project_url": "https://example.com",  // ← v3.1
      "github_repository": "https://github.com/user/repo"  // ← v3.1
    },
    "teaser_copy": {
      "seo_title": "Project Name | Portfolio",
      "seo_description": "Brief project description...",
      "page_title": "Project Display Title",
      "page_subtitle": "Project Subtitle",
      "breadcrumb": "Short Name",
      "tile_text": ["Teaser line 1", "Teaser line 2"]
    },
    "page_copy": {
      "pattern": "The challenge or context...",
      "action": "What was done...",
      "measured": "Results and impact..."
    }
  }
}
```

  * **Future AI: This is intentional, not a mistake!**

### The Strategy: Separation of Concerns

  * **JSON stores display values** 
    
    + Human-readable, pretty formatting
      - "Web" not "web"
      - "HTML/CSS/JS" not "html-css-js"
      - "CSS Animation" not "css-animation"

  * **JavaScript normalizes for URLs**  
  
    + One function, one place 

    ```javascript
    function normalizeForURL(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\//g, '-');
    }

    // "HTML/CSS/JS" → "html-css-js"
    // "CSS Animation" → "css-animation"
    // "Web Design" → "web-design"
    ```

  * **Benefits:**

    + JSON is readable by humans (important for manual editing)  
    + Values display nicely on pages (no need to "prettify")  
    + URL logic in ONE place (DRY principle)  
    + Change URL format without touching 50+ JSON files  

---

## Common Questions Future AIs Might Have

### Q: "Why not just use Jekyll templates?"

  * **A:** We want **dynamic filtering and sorting** which Jekyll can't do (it's a static site generator) 
  
    + By using JSON + JavaScript, we get
      - Random tile ordering on each visit
      - Real-time tag filtering without page reload
      - Easy to add entries without rebuilding site

### Q: "Why not use a framework like React/Vue?"

  * **A:** Overkill. This is a portfolio site, not a web app 
  
    + Pure HTML/CSS/JS means 
      - Faster loading
      - No build process
      - No dependencies to maintain
      - GitHub Pages hosts it directly

### Q: "Won't the 404 trick hurt SEO?"

  * **A:** No! The redirect happens instantly, preserving the URL
  
    + Search engines see 
      - Clean URL structure
      - Proper content
      - Fast load times
    + Plus, entry pages are the SEO priority, and those work perfectly 

### Q: "Why is there a 'slug' field but it doesn't include section/subsection?"

  * **A:** Because section + subsection are already separate fields! 
  
    + Combining them manually would be **redundant** 
      - JavaScript builds the full path 

    ```javascript
    const fullPath = `${section}/${sub_section}/${slug}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\//g, '-');

    // "Web" + "HTML/CSS/JS" + "slug-project-name" → "web/html-css-js/slug-project-name"
    ```

### Q: "Should I 'fix' the capitalization and spaces in the JSON?"

  * **A:** NO! That's intentional. 
  
    + Those values display on pages 
      - Only normalize for URLs in JavaScript 

---

## Central Configuration: `placement.json`

  * **Purpose:** Single source of truth for site-wide configuration
    + **Location:** `/assets/js/placement.json`
    + **Schema Version:** 2.0 (October 18, 2025)

### What It Contains:

  1. **Toggle Tags** (`active_tags.toggle_tags`)
     + Strategic tags shown ONLY on section-type pages 
       - E.g. /web, /print, /digital, /video...
     + Used to guide users toward key portfolio content
       - Must exist as actual tags in project entries
       - Examples: AI, Creative, Social Media, Strategy, Design

  2. **Tag Catalog** (`active_tags.contextual_tags`)
     + Comprehensive list of all approved tags
     + Four categories: 
       - technology 
       - media 
       - role 
       - skill
     + Prevents tag inconsistencies 
       - Plurals 
       - Tense issues, etc. 
     + Reference when adding new entries

  3. **Section SEO Metadata** (`seo_metadata`)
     + Dynamic templates for section page meta tags
       - Format: "<Tag> Projects by Sean August Horvath"
     + Includes portfolio keyword and generalist positioning
     + Images randomly selected from matching project thumbnails

### Toggle Tags Logic:

  * **Display Rules:**
    
    + Appear ONLY on section-type filtered pages 
      - E.g. /web, /print, /digital, /video... 
    + Do NOT appear on click-through tag-filtered pages
      - I.e. the cloud of tag hyperlinks on each project entry page 
    + Partial string matching 
      - I.e. "Design" matches "Graphic Design", "Print Design", etc. 
      - Match only `technology`/`media`/`skill` tags 
      - NEVER pull matches with `section`/`sub_section`/`role` tags 
    + Ordered in filter navigation: toggle_tags → section → sub_section → role 


  * **Why This Works:**
  
    + Section pages show curated navigation with toggle tags
    + Click-through pages show organic contextual tags from matching projects
    + Prevents redundant filtering 
      - Toggle tags wouldn't add value on click-through pages 

---

## JSON Field Changes (October 10, 2025)

  + We made the following updates to all 15 project entry JSONs 

### Before:

    ```json
    "placement": {
    "section": "Web",
    "sub_section": "HTML/CSS/JS",
    "slug": "august.style/web/html-css-js/",  // ← Redundant!
    "file_name": "slug-project-name.html"          // ← Confusing name, unnecessary extension
    }
    ```

### After:

    ```json
    "placement": {
    "section": "Web",
    "sub_section": "HTML/CSS/JS",
    "slug": "slug-project-name"  // ← Clean, clear, no extension
    }
    ```

  * **Schema v1.0 → v2.1 Changes (October 10, 2025):**
    
    1. **Deleted `slug` field** - It was redundant (just section + subsection)
    2. **Renamed `file_name` to `slug`** - More accurate naming
    3. **Removed `.html` extension** - Cleaner, prevents bugs

  * **Schema v2.1 → v3.1 Changes (October 18, 2025):**
  
    1. **Changed `role` from array to string** - Single role per project
    2. **Added `video_alt_text`** - Accessibility for video embeds
    3. **Changed `thumbnail_alt_text` to `thumb_slideshow_alt_text`** - Clarity
    4. **Added `page_imagery` array** - Additional on-page images
    5. **Added `page_image_group_alt_text`** - Accessibility for page images
    6. **Added `project_url`** - External project links
    7. **Added `github_repository`** - GitHub repo links

---

## The Complete Routing Flow

### Example: User visits `august.style/web/html-css-js/saas-product`

  * **Step 1:** GitHub Pages looks for file 
    
    + Checks: `/web/html-css-js/saas-product.html`
    + Checks: `/web/html-css-js/saas-product/index.html`
    + Not found → serves `404.html`

  * **Step 2:** `404.html` analyzes URL 

    ```javascript
    const path = window.location.pathname; // "/web/html-css-js/saas-product"
    const segments = path.split('/').filter(Boolean);

    if (segments.length >= 3) {
    // This is an entry page
    sessionStorage.setItem('entryPath', path);
    window.location.replace('/entry.html');
    } else {
    // This is a section page
    sessionStorage.setItem('sectionPath', path);
    window.location.replace('/section.html');
    }
    ```

  * **Step 3:** `entry.html` loads 

    ```javascript
    const path = sessionStorage.getItem('entryPath');
    const manifest = await fetch('/assets/js/manifest.json').then(r => r.json());
    const jsonPath = manifest.entries['web/html-css-js/saas-product'];
    const data = await fetch(jsonPath).then(r => r.json());

    // Populate page with data
    document.querySelector('h1').textContent = data.content.teaser_copy.page_title;
    // ... etc
    ```

  * **Step 4:** Page renders 
    
    + URL stays: `august.style/web/html-css-js/saas-product` ✅
    + Content loads from: `uid-abc-123.json` ✅
    + User sees: Beautiful project page ✅

---

## Entry Page Layout Pattern

  + **Design Decision:** Symmetrical layout with breadcrumbs + tags at top AND bottom

### Layout Structure:

  * **Top of Page:**

    + Breadcrumbs 
      - Top left 
      - `section` › `sub_section` › `breadcrumb`
    + Tags hover card 
      - Top right 
      - `technology`, `media`, `skill` tags only

  * **Page Content:**
    
    + H1: `page_title`
    + H2: `page_subtitle`  
    + H3: `role` (from JSON - NOT in tags card)
    + Four content sections 
      - 1st = (`role`) 
      - 2nd = `pattern` 
      - 3rd = `action` 
      - 4th = `measured`
    + Optional 
      - `video_embed` 
      - `page_imagery` 
      - `project_url` 
      - `github_repository`

  * **Bottom of Page:**
    
    + Breadcrumbs 
      - Bottom left 
      - Repeated for UX flow 
    + Tags hover card 
      - Bottom right 
      - Repeated for UX flow 
    + Related posts section

### Tags Card Specifications:

  * **Content:** 
  
    + ONLY `technology`/`media`/`skill` tags  
    + Comma or bullet • separated 

  * **Excludes:** 
    
    + `section` 
    + `sub_section` 
    + `role` 
      - Only ever one per project entry 
      - It is used as the first content section 

  * **Style:** 
  
    + Hover card with micro-interaction 
      - Subtle lift that looks like it is hovering over the page 
      - Visual "PRESS DOWN" effect when clicked 

  * **Size:** 
  
    + Max-width 400px
      - Fixed on desktop 
      - Part of single column on mobile 
      - Smaller if necessary on table to maintain desktop appearance 

  * **Clickable:** 
  
    + Each tag links to section page with the clicked tag applied as the filter 
    + Pulls from all website "sections" that have the same tag 
      - E.g. click through a /web project's tag "copywriting" 
      - The section page loads with "copywriting" filter applied 
      - Entries with "copywriting" tag are from /web section, /print section, /video section etc.  

### Role Field Treatment:

  * **Schema v3.1 Change:** 
  
    + `role` is now STRING 
      - Always a SINGLE VALUE 
      - Never more than one; not an array 
      
    + Displayed as H3 heading in content section
      - Still hyperlinked to filtered section page
      - NOT included in tags hover card
      - Represents the primary role for that specific project

### Why This Layout:

  + **Symmetry:** Top and bottom elements create balanced page structure  
  + **Accessibility:** Breadcrumbs available at entry and exit points  
  + **Context:** Tags always visible for related navigation  
  + **Clarity:** Role as H3 makes it content, not just metadata  
  + **Mobile-friendly:** Hover cards adapt to touch interactions  

---

## Implementation Notes

  + When building this, remember the following 

### 1. Don't Overthink the Routing

  * **It's simpler than it looks:** 
  
    + `404.html` → Redirect helper (< 20 lines)
    + `section.html` → Reads URL, loads matching JSONs, filters
    + `entry.html` → Reads URL, loads one JSON, renders

### 2. Normalization Function is Key

  * **Create ONE function**
    
    + That converts display values to URL-safe strings
    + Use it everywhere consistently 

### 3. Manifest Generation Script

  * **Simple Node.js script:**

    ```javascript
    // Scan all JSON files
    // Read placement.section, placement.sub_section, placement.slug
    // Build URL → JSON path mapping
    // Write manifest.json
    ```

### 4. No "Clever" Code Needed

  * **This architecture is clever, BUT** 
  
    + The implementation is straightforward 
      - Fetch JSON
      - Render HTML
      - Filter arrays
      - Update hash

  * **Keep it simple!**

---

## Testing Strategy

### Local Development

    ```bash
    # Must use a server (not file://)

    python3 -m http.server 8080 --bind 127.0.0.1
    # View: http://127.0.0.1:8080/section.html

    python3 -m http.server 3000 --bind 127.0.0.1
    # View: http://localhost:3000/section.html

    python3 -m http.server 5500 --bind 127.0.0.1
    # View: http://localhost:5500/section.html
    ```

### Test Cases

  1. Visit section page: `/web` → Should show all web projects
  2. Visit subsection: `/web/html-css-js` → Should show filtered projects
  3. Visit entry: `/web/html-css-js/slug-project-name` → Should load project page
  4. Click tag filter: Should add to hash and filter tiles
  5. Reload page: Should maintain random order for tiles
  6. Click tag on entry: Should go to section page with that tag filtered

---

## Deployment Checklist

  * **Before deploying:** 
  
    + [ ] Generate manifest.json
    + [ ] Test all 404 routing paths
    + [ ] Verify Jekyll config (`_config.yml` has `permalink: /:basename/`)
    + [ ] Check all JSON files use new structure (no `slug` field, renamed to `slug` from `file_name`)
    + [ ] Test mobile responsiveness
    + [ ] Verify tag filtering works
    + [ ] Check entry pages load correctly

---

## Why This Architecture is Legit

  * **Traditional portfolio:**

    + 50 entries = 50 HTML files to maintain
      - Change header design = edit 50 files
      - Add new entry = copy template, edit content, link from index

  * **Our portfolio:**
  
    + 50 entries = 50 JSON files + 2 templates
      - Change header design = edit 1 template, all pages update
      - Add new entry = create JSON, run manifest generator, push

  * **The result:**
    
    + Professional, SEO-friendly URLs
    + Dynamic filtering and sorting
    + Dead simple to maintain
    + Scales to 100+ entries easily
    + Pure static hosting (fast, cheap, reliable)

---

## Final Note for Future AIs

  + If something looks "wrong" in this project (capitalization, spaces in fields, unusual routing) 
    - **Read this document first** before "fixing" it 
    - Everything is intentional and serves a purpose

  + This architecture is unconventional 
    - We're combining tools in creative ways 
    - But works beautifully 

  * **When in doubt, check the memory graph** 
  
    + Search for `memory` Model Context Protocol server entity `generalist-portfolio` 
      - Read context and decisions made 

---

*Architecture documented by Claude Sonnet 4.5 (2025-10-10)*  
*"Being smarter than how the tools were built" - Sean*
*Updated 2025-10-21*