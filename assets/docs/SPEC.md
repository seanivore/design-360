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
  8. All site (IMGs, URLs, copy, tag nav) content dynamically populated from project entry JSON; vanilla JS, no build 
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

* **Website structure** 
*Incomplete; example to illustrate structure only*

```
/Users/seanivore/Development/360-design...

index.html              `august.style/`
│   ├── #about          `.index.html#about` -> `august.style/about` 
│   └── #contact        `.index.html#contact` -> `august.style/contact` 
├── assets/
│   ├── js/
│   │   ├── data-loader.js 
│   │   ├── placement.json
│   │   ├── filter-controller.js 
│   │   ├── manifest.json
│   │   ├── section-controller.js
│   │   └── tile-renderer.js 
│   ├── media/
│   ├── favicon/
│   ├── docs/
│   │   ├── _entry_template.json 
│   │   ├── home_entry_pages_spec.md 
│   │   ├── ADD_NEW_PROJECT.md
│   │   ├── ARCHITECTURE.md
│   │   └── SPEC.md
│   └── entries/
│       └── uid-wty-542.json   # and many more 
├── _config.yml
├── CNAME
├── README.md 
├── 404.html 
├── generate_manifest.py
├── section.html
└── styles.css 
```

---

## Session Tasks 

### Project State Context Priming 

  * **Minimize LLM limitations** 

  - Use native `think` tool if you are able to multi task between thoughts with tools 
  - Otherwise use the `sequential_thinking` Model Context Protocol server to think while hou review the following 
  - Maintain project state via updates for across AI instance flow
  
  * **Check project state** 

  - Start the `memory` MCP tool 
  - Search exact entity term `generalist-portfolio` 

  * **Read important files using the `read_file` tool if you want to keep the information in your context the whole time** 

  - Read this architecture document written by AI for AI to continue the work: `/Users/seanivore/Development/360-design/assets/docs/ARCHITECTURE.md`
  
  - Understand the JSON entry file by viewing: 
    + The template `/Users/seanivore/Development/360-design/assets/docs/_entry_template.json` 
    + One of the entries `/Users/seanivore/Development/360-design/assets/entries/uid-dff-987.json` 

  * **Adding project state updates** 

  - Add entry milestones that maintain context even if suddenly disconnected
  - About to start a series of tasks, record what you're about to do
  - Also record the next steps in case connection is interrupted during first tasks
  - Add updates throughout completing the tasks, particularly anything notable or necessary for next steps
  - Update after completion of those tasks; add what is next or reference having mentioned it if nothing has changed

---

```bash
python3 -m http.server 5500 --bind 127.0.0.1
> http://localhost:5500/section.html
 ```

### Preparations for Next Phase 

#### 1. **COMPLETE** Created `placement.json` to Replace `featured.json` and Updated Files 
   + All code and documents have been updated 
   + On `section-controller.js` specifically we changed 
     - OLD: `return data.toggle_tags || [];`
     - NEW: `return data.active_tags?.toggle_tags || [];`

#### 2. **COMPLETE** `_entry_template.json` Template Updated 
   + Now enforces single ROLE choice 
   + Directs to `placement.json` document when picking tags 

#### 3. Tag Strategy, Cleanup, and Logic *WE ARE HERE*

  * **Logic notes to implement for toggle tags** 

    1. Pull any tag that contains the toggle tag word 
       - They should work for any tag that contains even part of the toggle tag 
       - E.g., "Design" should pull up "Graphic Design" and "Print Design" 
    2. Only pull from `technology`, `media`, and `skill` 
       - Toggle tags should not filter to show any matches with `role` tags 
       - This will prevent overly redundant tags surfacing as options to filter by 

  * **Tag clean-up process required for all 15 JSON objects** 

    1. **COMPLETE** Copy over all tags from the JSON to `placement.md` 
    2. **COMPLETE** Delete the tags from the project entry JSON for now 
    3. **COMPLETE** When all JSONs have be cleaned out, review and simplify tags on `placement.md`
    4. **SEAN REVIEW COMPLETE** After Sean reviews full `placement.md` tag list 
       + Add appropriate tags to each JSON 
         - Use on page text, image filenames, etc. for insight 
         - Opt for more, rather than less, without being redundant or stretching reality  
    5. While in the JSON there are some updates to make 
       + v3.1 has the "Enforced single role value, added placement.json reference for tag consistency" 
       + We also need to add alt.text 
         - For the thumbnail slideshow 
         - For the video embed 
         - For any on-page images, if present
       + Q: For assets > project URL and GitHub Repository 
         - When pasted on social or in a doc it populates the thumbnail and title/description 
         - Do we need to pull those and have them places separately in the JSON for them to be used in the same way on the page? 

  * **All JSON files to process for above steps**

    1. `/Users/seanivore/Development/360-design/assets/entries/uid-iqi-479.json`
    2. `/Users/seanivore/Development/360-design/assets/entries/uid-lul-419.json`
    3. `/Users/seanivore/Development/360-design/assets/entries/uid-qor-090.json`
    4. `/Users/seanivore/Development/360-design/assets/entries/uid-rfr-187.json`
    5. `/Users/seanivore/Development/360-design/assets/entries/uid-sgt-851.json`
    6. `/Users/seanivore/Development/360-design/assets/entries/uid-srs-009.json`
    7. `/Users/seanivore/Development/360-design/assets/entries/uid-tev-176.json`
    8. `/Users/seanivore/Development/360-design/assets/entries/uid-unw-889.json`
    9. `/Users/seanivore/Development/360-design/assets/entries/uid-wgw-370.json` 
    10. `/Users/seanivore/Development/360-design/assets/entries/uid-wnw-867.json`
    11. `/Users/seanivore/Development/360-design/assets/entries/uid-wty-542.json`
    12. `/Users/seanivore/Development/360-design/assets/entries/uid-dff-987.json`
    13. `/Users/seanivore/Development/360-design/assets/entries/uid-eme-689.json`
    14. `/Users/seanivore/Development/360-design/assets/entries/uid-fth-565.json`
    15. `/Users/seanivore/Development/360-design/assets/entries/uid-hwi-844.json` 

#### 4. Does the `home_entry_pages_spec.md` SPEC Need Another Update 
  
  + I added `page_imagery` to two entires so we need to make sure that is in the HTML proposed for entry 
  + Add any **toggle logic** details necessary to be ready to hand off to Claude Code 

#### 5. Review, Bring Up To Date Resource Docs Claude Code Needs 

  * **Changes for you to please address** 

   + Changes necessary to reflect our evolving plan in the two important resources we direct them to 
     - This very document `/Users/seanivore/Development/360-design/assets/docs/SPEC.md` 
     - The ARCHITECTURE document `/Users/seanivore/Development/360-design/assets/docs/ARCHITECTURE.md` 
     - And then please update the adding a new entry help document while everything is in context: 
       `/Users/seanivore/Development/360-design/assets/docs/ADD_NEW_PROJECT.md`

---

### *Phase 2:* Homepage 
  + Create homepage tiles, and section page tiles 
  + Create `index.html` with Projects, About, Contact 
  + Tiles that randomly select images and associated tile text from section entries 
  + Social icons, profile picture 
  + Use UX/UI design section details below, memory, and architecture.md 

### *Phase 3:* Entry Pages 
  + Create `entry.html` template 
  + Create `entry-controller.js`
  + Related post logic 
    - Select of all JSON entries with matching tags, select the top four based on number of matching tags 
    - When there is a tie between JSON objects, choose completely randomly 
    - *ACTUALLY* is there a way to do this that maybe has math incorporate the 00:00:00 time so that the selection of which JSONs with matching tags is always different -- because that would be rad 
  + Use UX/UI design section details below, memory, and architecture.md 

### *Phase 4:* Test Tag Filtering Logic 

  * **Section page's "main" filter** 

  - The filter you clicked through, section-type or contextual, must be sticky while all other tags and be turned on and off 
  - Reload of a section page at any time should do nothing to the filters (must be tapped off just like on) 
  - But every single reload should always shuffle the available tiles as a UX helper 
  - Main filter's tag shouldn't be in active tag list but given a small heading for User context/UX understanding of site location 

  * **Section page's "main filter" key difference** 

  - User clicked through from homepage to a 'section'-type tag filtered section page 
    + Will ONLY show tiles from that section
    + Has no available tag to change that 
  - User clicked through from project entry page contextual or sub_section or role tag 
    + Will see ALL tiles from any tag category or section tag; e.g. print, digital, web "copywriting" 
    + The section-type tags are available tag filters 
    + Only tags that are on any JSON with the tag "copywriting" AT THAT MOMENT will show up in the listed nav filter tag options 

#### The Tag Types & Their Placement on Section Pages 

  1. On every JSON under 'tagging' are **CONTEXTUAL** tags 
     + UI on page highlights with a heading the ROLE tag  
     + UI separation of other contextual tags is just for backend comprehensiveness assurance purposes 
       - technology 
       - media 
       - skill 
  2. On every JSON the 'section' and 'sub_section are **PLACEMENT** tags 
     + There are just four sections: Web, Print, Video, Digital 
     + Subsections (like Webflow) are created as needed 
  3. placement.json identifies handful of contextual tags to be **TOGGLE** tags 
     + Selected to give content some prominence or guide the user a certain way 
     + These are only shown on the PLACEMENT 'section-type' tag filtered section page 
     + Clicking through an on-page tag will never show toggle tags; instead will 
       - Also never lead to a PLACEMENT 'section-type' tag filtered section page 
       - Will always show all contextual tags that every JSON fitting the main tag contain AT THAT MOMENT 

#### Order of Tag Display in Section Page's Horizontally Scrolling Filter Navigation 
  
  1. If the main tag is a PLACEMENT tag ('section'-type), ordered from left to right 
     - `sub_section` first with different color 
     - `role`(s) next in another color 
     - The rest are just toggle tags only tags 
  2. Main tag is CONTEXTUAL (click-through from entry page tag), ordered from left to right 
     - `section` 
     - `sub_section` 
     - `role` 
     - contextual tags (as populated from the relevant JSON files based on the tag that was clicked through)

### *Phase 4:* Polish 
  + Test all functionality 
  + Tweak, level up animations 
  + Deploy to GitHub Pages 

---

## Website UI/UX Design Specifics 

* **Project Page headings** 

| Class | JSON Variable                  | Styling Guide              | 
| ----- | ------------------------------ | -------------------------- | 
| H1    | `page_title`                   | Large, heavy               | 
| H2    | `page_subtitle`                | Smaller than H3            | 
| H3    | `role` & `page_copy` headings  | Main sections              |
| H4    | `media`, `technology`, `skill` | Not category, tags on page | 
| H5    | `breadcrumb`                   | Similar to H4              | 


* **Include light mode and dark mode options with dark mode defaulted** 

  + Background 
    - Use simple off-wite versus black/charcoal 
    - Ornate SVG could bring in very faded color 
    - Gradient effect as in example above to give depth 
  + Tile component 
    - Colored similarly to background 
    - Realistic and subtle shading 
    - Sharp look, sharp corners; Apple killed the radial corner trend hard 

* **Mobile-first micro-interactions means no interactions that don't work on mobile** 

  + Focus more heavily on how the pages transition between each other 
    - Smooth changes between pages 
    - Elements on the page should fall or fade into place sequentially for engaging experience 
  + Focus as well on how the tiles relocate when filtered and unfiltered 
  + Ensure the same high production value (simple is more) smooth motion of tag filters whe selected and unselected 

### Homepage `august.style` 

* **Three sections of the page with URL that jumps to each which is also forwarded to actual URL** 

  1. **PROJECTS** section navigation 
  2. **ABOUT** brief bio 
  3. **CONTACT** with simple, minimal options 

#### Projects `august.style#projects` -> `august.style/projects` 

  + The four section tiles sit here 
    - Please them as one column on mobile 
    - Use two columns on desktop and tablet 
    -  Every reload these four should be randomized in order they're displayed 
    - Use randomly selected collection of thumbnail images in slides pulling from from each entry 
    - Match up the text on the tile with the appropriate slides 
    - The JSON will also need variables for static on-tile heading text 
    - Perhaps include a dynamic counter of number of entries within that section category; number placed neatly out of way on tile 

#### About `august.style#about` -> `august.style/about` 

  + Use a social media circle style profile picture to the left of a right column with the two blocks of text below 

   > Sean August Horvath, Creative Generalist 

   > 14 years hopping borders between art, product, and growth. Clean lines, maximal ideas. Sketches brands by hand, ships AI pipelines by night. Pattern recognition is my superpower; making it teachable is my craft. 

#### Contact `august.style#contact` -> `august.style/contact`

  + Use very simple, classic looking icons for each laid in horizontal, centered line of single column below the about information 

   - [github.com/seanivore](https://github.com/seanivore)
   - [linkedin.com/in/seanivore/](https://www.linkedin.com/in/seanivore/)
   - [instagram.com/seanivore/](https://www.instagram.com/seanivore/)
   - [horvathaugust@gmail.com](mailto:horvathaugust@gmail.com)

### Section Page Template 
  
  + Sticky click-through tag 
    - POSITION section-type tag filtered section page shows sub_section tags, roles tags, then toggle tags 
    - CONTEXTUAL tag filtered section page shows section tags, sub_section tags, role tags, then contextual tags 

  + Entry tiles sit in a single column 
    - Use large padding on desktop, keeping it in just one column 
    - Use less padding, still keeping them in one column for mobile and tablet 

  + Every reload these tiles should display in a fully reshuffled order 
    - When a filter is clicked, the tiles stay in the same order as they were 
    - The unrelated tiles fade away 
    - The related tiles smoothly slide up to be in place 

### Project Entry Page Template `august.style/<SECTION>/<SUBSECTION>/<SLUG>` 

  + Page elements listed from top to bottom 
    - Extremely simple header, very short/narrow, much like one used as header nav on homepage here: `https://developer-technologist.august.style/` 
    - Breadcrumbs at top left of page 
    - Right aligned column of top right justified tag list for project 
    - Single column for page title and subtitle 
    - Four page sections start as two columns with slideshow using thumbnail images in right column with text extending below wrapping across full width instead of staying one column 
    - Video embed(s) if applicable and/or any other page images 
    - Horizontal line page break with breadcrumbs again, below and left justified; same with right alighted and justified tag list 
    - Populate ~3 related posts based on random selecting entries that share tags; these randomize making them different on every page reload 
    - Extremely simple footer, very short/narrow, with only copyright and then icons for each contact method; this presumes the heading nav is fixed and follows scroll down 

*For more details, please see `ARCHITECTURE.md`* 

---

* **Visual inspo** *HAS BEEN INTEGRATED INTO MEMORY AND ARCHITECTURE.md*

  1. **Homepage Tile Image Swipe UI Functionality** `./assets/docs/tile_visual_inspo/1_homepage_tile.jpg`
     - Larger, squarer for the ~4 website sections 
     - No text above image, and text below doesn't scroll or expand for more downwards 
     - We could possibly have the text change when images are swiped to the next 
  2. **Section Tile Swipe UI Functionality** `./assets/docs/tile_visual_inspo/2_section_tile.jpg` 
     - These fill section pages in larger quantity, and include sub-sections, along with other tag filtering options  
     - The short/narrow but wide rectangle with smaller images to the side allows for fitting more of them on the screen 
     - Again, of course the images swipe, but the text might as well if we like  
  3. **Tag Filter's Scroll Horizontally**`./assets/docs/tile_visual_inspo/3_tag_filters.jpg`
     - Google uses this UI frequently, shown via plain-text Search Options, and Ovals with small image for Sorting Search Results 
     - Just like images, text must be sized so a tag bleeds off out of the viewport, prompting users to scroll 
     - When tapped, tag stays 'ON', moves to left, turns more prominent color; tap again for off 
  4. **Background Texture and Gradient**`./assets/docs/tile_visual_inspo/4_background_texture.jpg` 
     - For background design
     - First see the gradient vertical highlight making a 'glare' down the page; technically produced much like creating realist button edges 
     - Then see the ornate, faded background pattern; we would use almost the same color as background to be way more subtle and just create texture 
     - Use infinitely repeating SVG pattern for small filesize 
  5. **Mid-Page FAQ** `./assets/docs/tile_visual_inspo/5_mid_page_faq.jpg` 
     - For mid-page FAQ functionality UI  
     - Seems like a great idea but haven't thought further than that 
