# Creative Generalist Portfolio 
*Generalist roles become more in-demand as organizations flatten*

## Message 

  + **PROBLEM:** downsizing because of economic uncertainty and AI operational integration 
  + **SOLUTION:** I am downsizing-friendly to help managers optimize their workforce for the modern landscape 

### Overview 

  1. One, generalist, portfolio website to rule them all: `august.style`
  2. Design mobile and image first, using stronger job title/job opening description SEO 
  3. Create a UI that makes previewing 50+ projects across fields easy, without many clicks 
  4. Build for longevity and creating more of an ease of maintenance and updating 

### Content 

* **Project content entry management** 

  - Website content is populated and managed using JSON files for each entry 
    + Functionality like tag navigation filtering and image slideshows is dynamic 
    + Creating new entries or making updates is easier than ever 

  1. JSON entry template schema: `/Users/seanivore/Development/360-design/assets/docs/_entry_template.json`
  2. Comprehensive steps for preparing JSON: `/Users/seanivore/Development/360-design/assets/docs/ADD_NEW_PROJECT.md` 

### Design Summary 

  1. Technically simple HTML/CSS/JS build, published to GitHub Pages; *Mini-SPA* loading content dynamically without page refresh
  2. Content tile grid navigation with tag toggle filtering
  3. Tile thumbnail images slide show swipe; UX goal to click less projects
  4. Tile text cross-fade changes when image is swiped to tell full story, metrics results 
  5. Responsive shrink/grow minimal, preserve visuals, snap to fixed desktop, tablet, media/mobile ratio stops
  6. True mobile-first; no hover, apparent smooth page transitions, elements drop/fade in, micro-interactions on click 
  7. Horizontal slide tag filter tiles; slide smoothly into new positions; random order every reload 
  8. All site (imgs, urls, copy, tag nav) content dynamically populated from project entry JSON; vanilla JS, no build 
  9. Highly visual, four 2-4 short sentence section project entry pages; headings **ROLE**, **PATTERN**, **ACTION**, and **MEASURED** 
  10. Homepage tile visual and text is completely random from every entry in that respective section for each tile 
  11. Section pages have "toggle" tags which streamline the navigation to direct users towards specific content 

  **Architecture**
    - ✅ Manifest-based routing (works with any URL depth)
    - ✅ Sticky filters (main filter can't be removed)
    - ✅ Main filter shown as heading (not in tag list)
    - ✅ Tag ordering adapts to page type

  **Design**
    - ✅ Tags are plain text (no pills - timeless!)
    - ✅ Vertical gradient glare (subtle depth)
    - ✅ Magazine aesthetic (just visuals + teaser)
    - ✅ Text cycles with images (cross-fade magic)
    - ✅ Soft layered shadows (CSS realism)

  **UX**
    - ✅ Active tags move to front (DOM reordering)
    - ✅ Random ordering maintained during filtering
    - ✅ 1/8th image bleed hints at swipe
    - ✅ Smooth 300ms transitions everywhere

* **Website macro-structure** 
*Incomplete; example to illustrate structure only*

```
index.html               `august.style/`
│   ├── #about           `.index.html#about` -> `august.style/about` 
│   └── #contact         `.index.html#contact` -> `august.style/contact` 
├── assets/
│   ├── js/
│   │   ├── data-loader.js 
│   │   ├── manifest.json
│   │   ├── filter-controller.js
│   │   ├── section-controller.js
│   │   └── tile-renderer.js 
│   ├── media/
│   ├── docs/
│   │   ├── _entry_template.json
│   │   ├── ADD_NEW_PROJECT.md
│   │   ├── ARCHITECTURE.md
│   │   └── SPEC.md
│   └── entries/
│       ├── uid-dff-987.json
│       ├── uid-eme-689.json
│       ├── uid-fth-565.json
│       ├── uid-hwi-844.json
│       ├── uid-lul-419.json
│       ├── uid-qor-090.json
│       ├── uid-rfr-187.json
│       ├── uid-sgt-851.json
│       ├── uid-srs-009.json
│       ├── uid-tev-176.json
│       ├── uid-unw-889.json
│       ├── uid-wgw-370.json
│       ├── uid-wnw-867.json
│       └── uid-wty-542.json
├── _config.yml
├── CNAME
├── 404.html 
├── generate_manifest.py
├── placement.json
├── section.html
└── styles.css 
```
