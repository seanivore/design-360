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

* **Website macro-structure** 
*Incomplete; example to illustrate structure only*

```
`august.style/`         `.index.html`
│   ├── about           `.index.html#about` -> `august.style/about` 
│   └── contact         `.index.html#contact` -> `august.style/contact` 
├── assets/
│   ├── js/
│   │   ├── data-loader.js
│   │   ├── filter-controller.js
│   │   ├── section-controller.js
│   │   └── tile-renderer.js
│   ├── media/
│   ├── docs/
│   │   ├── _entry_template.json
│   │   ├── ADD_NEW_PROJECT.md
│   │   ├── ARCHITECTURE.md
│   │   ├── manifest.json
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
├── index.html
├── section.html
└── styles.css
```

### Design Summary 

  1. Technically simple HTML/CSS/JS build, published to GitHub Pages 
  2. Content tile grid navigation with tag toggle filtering
  3. Tile thumbnail images slide show swipe; UX goal to click less projects
  4. Tile text cross-fade changes when image is swiped to tell full story, metrics results 
  5. Responsive shrink/grow minimal, preserve visuals, snap to fixed desktop, tablet, media/mobile ratio stops
  6. True mobile-first; no hover, apparent smooth page transitions, elements drop/fade in, micro-interactions on click 
  7. Horizontal slide tag filter tiles; slide smoothly into new positions; random order every reload 
  8. All site (imgs, urls, copy, tag nav) content dynamically populated from project entry JSON; vanilla JS, no build 
  9. Highly visual, four 2-4 short sentence section project entry pages; headings **ROLE**, **PATTERN**, **ACTION**, and **MEASURED** 

---

## Next Task Work Flow 

### 1. Project State Context Priming 

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
  
  - **IMPORTANT:** Please read `last_message.md`; we were abruptly context window cut off *right* after AI created some files. As of now the only COMPLETE and accurate files are the Web section project entry JSON files. I was writing a response, unaware that AI made the first files. When I was done they needed to update the files according to the feedback, but when starting they got cut off. I managed to simplify an earlier message so that they could try to get in a memory project state update. Due to the crunch, we want to review all materials to ensure nothing is lost or misunderstood. Confirming understanding is particularly important because it took me about three push-backs to show AI how the modular architecture could extend much further than they thought, getting us to a point where all that is needed is a template "section" page and a template "project entry" page; even the URL is pulled from the JSON files. An ever lasting portfolio! `/Users/seanivore/Development/360-design/assets/docs/last_message.md`

  * **Adding project state updates** 

  - Add entry milestones that maintain context even if suddenly disconnected
  - About to start a series of tasks, record what you're about to do
  - Also record the next steps in case connection is interrupted during first tasks
  - Add updates throughout completing the tasks, particularly anything notable or necessary for next steps
  - Update after completion of those tasks; add what is next or reference having mentioned it if nothing has changed

### 2. Confirm Content Population Specifics, Integrate Details & Logic  

  * **After we have full understanding of the websites planned functionality, I have some additional notes to consider**

  1. Be aware that *section page* is now a relative term for any content tile populating page with filtering tag navigation 

  * **Section page's "main" filter is always a must and cannot be removed** 

  2. Click-through filter must be "sticky" or "stuck" and cannot be turned off like other tags 
     - Click-through from homepage onto section page with "section"-type tag, that section-type tag will ALWAYS be applied 
     - Similarly, clicking through any contextual tag on a project page, the clicked-through tag cannot be turned off 
     + Ensures section page with section-type tag "Web" filtered, nothing, no other filtering, can remove "web" and no non-web content will be shown 
  3. This "main filter" of any loaded section page shouldn't have that tag listed in the nav, and instead place it as a smaller heading for context 

  * **Behavior holds to that simple logic regarding what tiles *DO* show**

  4. User clicks through on-page contextual tag, all tile results on section page must be from every section 
     - This is regardless of what section the project page entry User clicks a contextual tag hyperlink on  
     + If you're on entry in Web section and click through "copywriting" 
       - The section page will show different section tagged content (print, digital, etc.) 
       - Only the tags that are on any JSON files with the tag "copywriting" AT THAT MOMENT will show up in the listed tags in the nav

  * **The full extent of different tag groups** 
  
  5. There are tags on the JSON under "tagging" 
     + The main tags on the JSON are in four groups merely for ease of JSON completion; no site UI differentiates them **EXCEPT** for **ROLE** 
       - role (only gets one answer; one supplied tag)
       - technology 
       - media 
       - skill 
     + These tags, except "Role", we will call **CONTEXTUAL** tags 

  6. Then "section" and "sub_section" fields on the JSON entries as tags just the same
     + section example: "Web" 
     + sub_section example "Webflow" 

  7. "Toggle" tags are listed on a specific **FEATURED** JSON object, to be created 
     + These are contextual tags, on actual JSON objects, that we want to give prominence or guide the user towards 
     + "Featured" file to create allows us to set up predefined tags to specifically show on section-type tag filtered section pages 
     + Toggle tags *ONLY* show on section-type tag filtered section pages for clarity 
     + Clicking through an entry's contextual tag will list all contextual tags populated from all JSON object with that tag clicked through 
       (no toggle group)

  * **Inclusion and ordering of tags in the horizontal scrolling filter based on section page situation** 

  8. If the section page has a section-type tag, from left to right the horizontal scrolling tag nav should include 
     - `sub_section` first with different color 
     - `role`(s) next in another color 
     - The rest are just toggle tags only tags 

  9. Clicking through a tag from a project entry page, left to right the horizontal scrolling tag nav should include 
     - `section` 
     - `sub_section` 
     - `role` 
     - contextual tags (as populated from the relevant JSON files based on the tag that was clicked through)

### 3. Action Steps 

* **Where to start** 

  1. Finish primary file creation
     + Review all CONTEXT PRIMING and make any necessary changes to created files based on the logic above and from the `last_message.md` 
     + We DO have all web section **JSON** entry files completed 
  2. Create tiles based on described design below 
     + See differences between homepage and section page tiles 
     + Confirm if we will be creating actual files for every entry that just pull info from JSON 
     + Or if we will have one that replicates as needed based on entries that fit page filter parameters 
     + Let's ideally choose the less technically complex solution with the goal of having the web section sharable quickly 
     + This should include identifying style guide and starting class definitions in CSS file 
  3. Based on below action steps  
     + Build out the planned next steps 
     + Ensure clear specificity 
     + Consider preparation of SPEC document that would allow Claude Code to build the website 

* **Dynamic UI Implementation Technical Approach**

  1. Fetch JSON files 
  2. Parse categories for routing, use tagging arrays for real-time filtering 
  3. Use `thumbnail_images` array for tile swipe UI 
  4. The `tile_text` array use with cross-fading text triggered on image swipes 

* **Must have functionality** 

  1. Get section pages fully dynamic with tile grids 
  2. Tiles should use tag filtering 

* **Dynamic features to implement** 

  1. Homepage tiles from section categorization 
  2. Section page tiles with filtering by tagging arrays 
  3. Random tile ordering on load with smooth transitions during filtering 
  4. Optional: dynamic entry page content population 

---

## Website UI/UX Design Specifics 

* **Project Page headings** 

| Class | JSON Variable                  | Styling Guide     | 
| ----- | ------------------------------ | ----------------- | 
| H1    | `page_title`                   | Large, heavy      | 
| H2    | `page_subtitle`                | Smaller than H3   | 
| H3    | `role` & `page_copy` headings  | Main sections     |
| H4    | `media`, `technology`, `skill` | Page content tags | 
| H5    | `breadcrumb`                   | Similar to H4     | 

* **Must see visual inspo** 

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

* **These pages "exist" but are not created unless being loaded, then they are populated dynamically; read more in `ARCHITECTURE.md`**

  + Four are "section"-type tag filtered, serving as website sections 
    1. `august.style/web` 
    2. `august.style/print` 
    3. `august.style/digital` 
    4. `august.style/video` 
  + All other tag filtered section pages created come from clicking through any tag via a project entry page 

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