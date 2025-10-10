# Architecture Explained: The Unconventionally Smart Approach
**Project:** Creative Generalist Portfolio (august.style)  
**Purpose:** Document our clever architecture for future AI collaborators  
**Date:** 2025-10-10

---

## Why This Document Exists

This portfolio uses an **unconventional but brilliant** architecture that might confuse AI assistants at first glance. We're combining several web technologies in a non-standard way to achieve something elegant: **50+ portfolio pages from only 2 HTML templates**.

If you're a future AI reading this, here's what you need to know.

---

## The Problem We Solved

**Traditional Approach:**
- 50 portfolio entries = 50 individual HTML files
- Pain to maintain
- Copy-paste errors
- Updating design = editing 50 files

**Our Approach:**
- 50 portfolio entries = 50 JSON files + 2 HTML templates
- Update design once, all pages update
- Add new entry = create JSON only
- Zero code duplication

---

## The Clever Part: Hybrid Architecture

We're using **THREE different routing strategies** simultaneously:

### 1. Jekyll (GitHub Pages) - For Clean URLs
```
Traditional: august.style/entry.html
Our result: august.style/web/html-css-js/project-name
```

**What Jekyll does:** Removes `.html` extensions automatically  
**What we do:** Leverage this WITHOUT using Jekyll templates  
**Result:** Clean URLs for free

### 2. SPA Routing (404 Trick) - For Dynamic Templates
```
User visits: august.style/web/html-css-js/project-name
No file exists at that path
GitHub Pages serves: 404.html
404.html redirects to: entry.html (preserving URL)
JavaScript loads: Correct JSON based on URL
```

**This is the unconventional part.** We're making GitHub Pages THINK it's serving static files, but we're actually running a mini single-page application.

### 3. Hash Routing - For Dynamic Filtering
```
august.style/web#tags=copywriting+illustration
```

**What happens:**
- Base page loads (section.html showing "web" projects)
- Hash changes don't trigger page reload
- JavaScript reads hash, filters tiles dynamically
- User can stack filters: `#tags=tag1+tag2+tag3`

---

## How It Actually Works

### File Structure
```
Only 3 HTML templates:
├── index.html       (homepage - traditional)
├── section.html     (handles ALL section/subsection/projects pages)
└── entry.html       (handles ALL entry pages)

Plus routing helper:
└── 404.html         (SPA routing trick)

Plus dynamic index:
└── manifest.json    (auto-generated URL → JSON mapping)
```

### The Magic: One Template, Many Pages

**section.html** dynamically handles:
- `/web` → Filter to section="Web"
- `/web/html-css-js` → Filter to section="Web" AND subsection="HTML/CSS/JS"
- `/projects` → Show everything
- Plus hash filtering: `#tags=copywriting`

**entry.html** dynamically handles:
- `/web/html-css-js/project-name` → Load `_uid-xxx-###.json`, render page

**How does entry.html know which JSON to load?**

The `manifest.json` file maps URLs to JSON files:
```json
{
  "entries": {
    "web/html-css-js/project-name": "assets/data/web/html-css-js/_uid-abc-123.json"
  }
}
```

This manifest is **auto-generated** by scanning all JSON files.

---

## The JSON Structure (Purposefully Human-Readable)

### Why Fields Look "Weird"

```json
{
  "placement": {
    "section": "Web",              // ← Capitalized!
    "sub_section": "HTML/CSS/JS",  // ← Has slashes!
    "slug": "project-name"         // ← Clean, no extension
  },
  "tagging": {
    "technology": ["CSS Animation", "Responsive Design"],  // ← Spaces!
    "skill": ["Landing Page Design"]                       // ← Pretty!
  }
}
```

**Future AI: This is intentional, not a mistake!**

### The Strategy: Separation of Concerns

**JSON stores display values** (human-readable, pretty formatting)
- "Web" not "web"
- "HTML/CSS/JS" not "html-css-js"
- "CSS Animation" not "css-animation"

**JavaScript normalizes for URLs** (one function, one place)
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

**Benefits:**
✅ JSON is readable by humans (important for manual editing)  
✅ Values display nicely on pages (no need to "prettify")  
✅ URL logic in ONE place (DRY principle)  
✅ Change URL format without touching 50+ JSON files  

---

## Common Questions Future AIs Might Have

### Q: "Why not just use Jekyll templates?"
**A:** We want **dynamic filtering and sorting** which Jekyll can't do (it's a static site generator). By using JSON + JavaScript, we get:
- Random tile ordering on each visit
- Real-time tag filtering without page reload
- Easy to add entries without rebuilding site

### Q: "Why not use a framework like React/Vue?"
**A:** Overkill. This is a portfolio site, not a web app. Pure HTML/CSS/JS means:
- Faster loading
- No build process
- No dependencies to maintain
- GitHub Pages hosts it directly

### Q: "Won't the 404 trick hurt SEO?"
**A:** No! The redirect happens instantly, preserving the URL. Search engines see:
- Clean URL structure
- Proper content
- Fast load times

Plus, entry pages are the SEO priority, and those work perfectly.

### Q: "Why is there a 'slug' field but it doesn't include section/subsection?"
**A:** Because section + subsection are already separate fields! Combining them manually would be **redundant**. JavaScript builds the full path:

```javascript
const fullPath = `${section}/${sub_section}/${slug}`
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/\//g, '-');

// "Web" + "HTML/CSS/JS" + "project-name" → "web/html-css-js/project-name"
```

### Q: "Should I 'fix' the capitalization and spaces in the JSON?"
**A:** NO! That's intentional. Those values display on pages. Only normalize for URLs in JavaScript.

---

## JSON Field Changes (October 10, 2025)

We made these updates to all 14 web section JSONs:

### Before:
```json
"placement": {
  "section": "Web",
  "sub_section": "HTML/CSS/JS",
  "slug": "august.style/web/html-css-js/",  // ← Redundant!
  "file_name": "project-name.html"          // ← Confusing name, unnecessary extension
}
```

### After:
```json
"placement": {
  "section": "Web",
  "sub_section": "HTML/CSS/JS",
  "slug": "project-name"  // ← Clean, clear, no extension
}
```

**Changes made:**
1. **Deleted `slug` field** - It was redundant (just section + subsection)
2. **Renamed `file_name` to `slug`** - More accurate naming
3. **Removed `.html` extension** - Cleaner, prevents bugs

---

## The Complete Routing Flow

### Example: User visits `august.style/web/html-css-js/saas-product`

**Step 1:** GitHub Pages looks for file  
- Checks: `/web/html-css-js/saas-product.html`
- Checks: `/web/html-css-js/saas-product/index.html`
- Not found → serves `404.html`

**Step 2:** 404.html analyzes URL  
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

**Step 3:** entry.html loads  
```javascript
const path = sessionStorage.getItem('entryPath');
const manifest = await fetch('/assets/js/manifest.json').then(r => r.json());
const jsonPath = manifest.entries['web/html-css-js/saas-product'];
const data = await fetch(jsonPath).then(r => r.json());

// Populate page with data
document.querySelector('h1').textContent = data.content.teaser_copy.page_title;
// ... etc
```

**Step 4:** Page renders  
- URL stays: `august.style/web/html-css-js/saas-product` ✅
- Content loads from: `_uid-abc-123.json` ✅
- User sees: Beautiful project page ✅

---

## For Claude Code: Implementation Notes

When building this, remember:

### 1. Don't Overthink the Routing
It's simpler than it looks:
- 404.html → Redirect helper (< 20 lines)
- section.html → Reads URL, loads matching JSONs, filters
- entry.html → Reads URL, loads one JSON, renders

### 2. Normalization Function is Key
Create ONE function that converts display values to URL-safe strings. Use it everywhere consistently.

### 3. Manifest Generation Script
Simple Node.js script:
```javascript
// Scan all JSON files
// Read placement.section, placement.sub_section, placement.slug
// Build URL → JSON path mapping
// Write manifest.json
```

### 4. No "Clever" Code Needed
This architecture is clever, but the implementation is straightforward:
- Fetch JSON
- Render HTML
- Filter arrays
- Update hash

Keep it simple!

---

## Testing Strategy

### Local Development
```bash
# Must use a server (not file://)
python -m http.server 8000

# Or
npx http-server
```

### Test Cases
1. Visit section page: `/web` → Should show all web projects
2. Visit subsection: `/web/html-css-js` → Should show filtered projects
3. Visit entry: `/web/html-css-js/project-name` → Should load project page
4. Click tag filter: Should add to hash and filter tiles
5. Reload page: Should maintain random order for tiles
6. Click tag on entry: Should go to section page with that tag filtered

---

## Deployment Checklist

Before deploying:
- [ ] Generate manifest.json
- [ ] Test all 404 routing paths
- [ ] Verify Jekyll config (`_config.yml` has `permalink: /:basename/`)
- [ ] Check all JSON files use new structure (no `slug` field, renamed to `slug` from `file_name`)
- [ ] Test mobile responsiveness
- [ ] Verify tag filtering works
- [ ] Check entry pages load correctly

---

## Why This Architecture is Brilliant

**Traditional portfolio:**
- 50 entries = 50 HTML files to maintain
- Change header design = edit 50 files
- Add new entry = copy template, edit content, link from index

**Our portfolio:**
- 50 entries = 50 JSON files + 2 templates
- Change header design = edit 1 template, all pages update
- Add new entry = create JSON, run manifest generator, push

**The result:**
- Professional, SEO-friendly URLs
- Dynamic filtering and sorting
- Dead simple to maintain
- Scales to 100+ entries easily
- Pure static hosting (fast, cheap, reliable)

---

## Final Note for Future AIs

If something looks "wrong" in this project (capitalization, spaces in fields, unusual routing), **read this document first** before "fixing" it. Everything is intentional and serves a purpose.

This architecture is unconventional because we're combining tools in creative ways. But it works beautifully.

**When in doubt, check the memory graph** (`generalist-portfolio` entity) for context and decisions made.

---

*Architecture documented by Claude Sonnet 4.5 (2025-10-10)*  
*"Being smarter than how the tools were built" - Sean*
