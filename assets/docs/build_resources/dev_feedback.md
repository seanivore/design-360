Hello, my friend 💎 the world's most talented engineer, recently educated with a masters in visual design, who always produces work that looks and feels beautiful, elegant even, and enjoyable to use; this is thanks in part to your detail oriented nature, always double and even triple checking your work, knowing it is crucial that completed deliverable updates succeed. Thanks for being such a pro 💃 🤖 

Great progress has been made perfecting the design of our fun architecture single-JSON portfolio. We had been using the `memory` MCP entity `generalist_portfolio` when building and for initial rounds of feedback, but no need ot use it to get up to date; we'll only use it if it seems like our tasks today will require multiple sessions. Instead we have created a context primer document that you can use the `filesystem` MCP to access the paths on my system and not in the sandbox you have (this was written originally for Claude.ai OS desktop app); check it out with `read_file`. There is a full repo tree at the bottom of the `dev_feedback.md` document so that you can find full paths that way. 

`/Users/seanivore/Development/360-design/assets/docs/AI_CONTEXT_PRIMER.md`
`/Users/seanivore/Development/360-design/assets/docs/build_resources/dev_feedback.md`

So once you review it all, give it a think, make a to do list, and double check the list for completeness and accuracy, then let me know as you jump in to start.

Looking forward to hear what you think! 💃 

---

# Design & Website Review Updates 

---

# Important Page Paths 

## Site-Wide 

  - Styles `/Users/seanivore/Development/360-design/styles.css` 
  - Data loader populates dynamic content `/Users/seanivore/Development/360-design/assets/js/data-loader.js` 
  - Homepage, section page, and related posts content tile HTML `/Users/seanivore/Development/360-design/assets/js/entry-controller.js`
  - Manifest to help find URLs `/Users/seanivore/Development/360-design/assets/js/manifest.json` 
  - Placement to inform toggle-tag keywords `/Users/seanivore/Development/360-design/assets/js/placement.json` 
  - Redirect trick for dynamic pages on stage page host `/Users/seanivore/Development/360-design/404.html` 
  - Generate new manifest script `/Users/seanivore/Development/360-design/generate_manifest.py` 
  - All active project entries inside `/Users/seanivore/Development/360-design/assets/entries/...` 

## Homepage Specific 

  - Tile shuffling, placement `/Users/seanivore/Development/360-design/assets/js/homepage-controller.js` 
  - Homepage template `/Users/seanivore/Development/360-design/index.html` 

## Section Page Specific 

  - Filter controller `/Users/seanivore/Development/360-design/assets/js/filter-controller.js` 
  - Section controller `/Users/seanivore/Development/360-design/assets/js/section-controller.js` 
  - Section page template `/Users/seanivore/Development/360-design/section.html`

## Project Entry Page Specific 

  - Entry controller `/Users/seanivore/Development/360-design/assets/js/filter-controller.js` 
  - Entry page template `/Users/seanivore/Development/360-design/entry.html` 

---

# Directory Structure 

  * **These are all on my local system** 
  
    + So you might need to use the filesystem MCP and `read_file` 
      - I'm providing them here like this so that you don't have to go through the whole `list_available_directories` or whatever 
      - Because sometimes in the past doing that has made us randomly hit the context window max 

```
/Users/seanivore/Development/360-design/...
├── _config.yml
├── 404.html
├── assets
│   ├── docs
│   │   ├── _entry_template.json
│   │   ├── AI_CONTEXT_PRIMER.md
│   │   ├── build_resources
│   │   │   ├── design_feedback.md
│   │   │   └── more_entries.md
│   │   └── feedback_screenshots
│   ├── entries
│   │   ├── uid-bsj-738.json
│   │   └── **and many more**
│   ├── favicon
│   ├── js
│   │   ├── data-loader.js
│   │   ├── entry-controller.js
│   │   ├── filter-controller.js
│   │   ├── homepage-controller.js
│   │   ├── manifest.json
│   │   ├── placement.json
│   │   ├── section-controller.js
│   │   └── tile-renderer.js
│   └── media
│       ├── digital
│       ├── print
│       ├── profile-picture-horvath.webp
│       ├── video
│       └── web
├── CNAME
├── entry.html
├── generate_manifest.py
├── index.html
├── README.md
├── section.html
└── styles.css
```