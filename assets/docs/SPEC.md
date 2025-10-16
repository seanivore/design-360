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
  
  - **SIGNIFICANTLY**, please read `last_message.md`; we were abruptly cut off from each other from a context window and it was *right* after AI created some files (as of now the only COMPLETE and accurate files are the Web section project entry JSON files). I didn't realize they were creating files already as I was typing a response that blocked my view of the chat thread, and my feedback resulted in needing to change some of the files AI just created. *RIGHT* when it started to make the updates necessary, we lost connection, meaning this context is pivotal to helping pick up where we left off. I managed to updated my message to AI right before the cutoff, allowing them to start again from that point, and critically, start off with a Memory Project State Update. But, due to the crunch we want to review all the materials to ensure nothing is lost or misunderstood. This seems someone pertinent because it took me about 3 or four push-backs to show AI how the modular architecture could extend a lot further than they were initially thinking, to include things like the URL structure, all of the generation of entry pages on the fly, the images and text on all of the content entry tiles in sections, and even the different section pages and the toggle filters that are populated. Basically making everything wildly simpler and avoiding creating new pages for any new entries, ever. An ever lasting portfolio! New groupings just would entail adding a new term to one of the tags on a JSON and dropping that JSON into the main entry folder. After sorting out that this was possible, AI detailed specifics on how this could work. 
    `/Users/seanivore/Development/360-design/assets/docs/last_message.md`

  * **Add project state updates** 

  - Add entry milestones that maintain context even if suddenly disconnected
  - About to start a series of tasks, record what you're about to do
  - Also record the next steps in case connection is interrupted during first tasks
  - Add updates throughout completing the tasks, particularly anything notable or necessary for next steps
  - Update after completion of those tasks; add what is next or reference having mentioned it if nothing has changed

### 2. Confirm Content Population Specifics 

  * **AFTER we have full understanding of the websites planned functionality, I have some additional notes to consider.**

  - Re: On-project-entry-page tags and "sub sections" like types of web design (webflow, framer, etc.)
    + When any content tag is clicked through, from any section or type of media, it should go to a section page filtered for that tag globally
    + This is important particularly for skill tags that would be applied to digital projects, web projects, and more 
    + When, for example, "copywriting" is clicked through, the *section page* that loads should show ALL ENTRIES that have the copywriting tag, not just 

    *Section page has become a relative term for any website page that populates based on tag filters, NOT NECESSARILY specifically a section, like web design, of content only as was originally planned. Yes, there will  be four main section pages that serve as four main website sections, but they are filtered just like any other tag-filtered collection of content on a section page.* 

  * **To create the logic for this, we can use the labeling of the different groupings on the JSON files**

  - The main tags on the JSON are in four groups. These groups are merely for ease of filling out the JSON objects to ensure that all tag types are covered. There will be no UI on the website that differentiates them **EXCEPT** in the case of **ROLE** because that is one of the main page content sections. 
    + technology
    + media 
    + role (only gets one answer)
    + skill 

  - However we will treat the "section" and "sub_section" fields on the JSON entries as tags just the same. 
    + section example: "Web" 
    + sub_section example "Webflow" 

  - LOGIC PROPOSED 

    1. When a section page loads with the tag "section" selected to filter contents (as when clicking through one of the four main tiles from the homepage)
       + It should make the "sub_section" tags available first in the tag nav with a different color text 
       + "role" will be the second listed tags available in the horizontally scrolling nav 
       + The rest of the tags should come from a specific **FEATURED** JSON object, TO BE CREATED 
    2. If on a section pages filtered by "section", the "section" tag will ALWAYS be applied 
       + As far as it seems right now, the only place where users can land on these pages is when clicking through from the homepage 
       + This ensures that when they're on the section page with "web" filtered, any additional filtering WILL NOT pull in any content without a "web" section tag 
    3. The only other way to get to a section page filtered with any tag is by clicking through a tag from a project entry page 
       + The "section" like web or print, will not be an available tag to click 
       + In these cases, when you click through a tag, it will either be a sub_section, role, or a contextual tag 
       + In this case, if any contextual tags are listed on the FEATURED file as toggle tags, it does not matter 
       + On these section page displays, the clicked-through tag must retain its filtering, even as any other tags are turned on and off 
       + In the horizontally scrolling tag nav there will be 
         - section 
         - sub_section 
         - role 
         - contextual tags (as populated from the relevant JSON files based on the tag that was clicked through)
       + This means if I clicked through "Copywriting" I would 
         - See all different sectioned tagged content (print, digital, etc.) 
         - Only the tags that are on any JSON files with the tag "copywriting" AT THAT MOMENT will show up in the listed tags in the nav 

  * **FEATURED JSON file** 

  1. This is one master file we need to create that allows the user to set some predefined tags to specifically highlight content or direct users 
  2. On a section page's horizontal scrolling tag nav, these are the third and final tags listed on section pages defined in the above logic 
  3. These have been called "toggle tags" on our `ADD_NEW_PROJECT.md` document `assets/docs/ADD_NEW_PROJECT.md` 
  4. Toggle tags must exist on a Project somewhere, in one of the "contextual" tag groupings on the project entry JSON 
     - That is to say that, other than section, sub_section, and role, ALL OTHER TAGS ARE CONTEXTUAL TAGS 
     - A contextual tag only becomes a toggle tag if manually added to the FEATURED file list of toggle tags 
  5. According to the logic above, a section page loads with the tag "section" selected to filter content; its tags include, in this order: 
     - sub_section 
     - role
     - (any tag present on the FEATURED toggle tag list)
  * *Using these toggle tags not only give the designer a bit more control over user flow, but also will minimize the number of tags loading into the horizontally scrolling tag nav bar on section pages*

* **In summary, notably, this means** 

  - Not all tag hyperlinks on entry pages exist as tag nav filters on the main "section" filtered section pages 
    + This is sort of irrelevant because toggle tags only show up on the main "section" filtered section pages 
    + In every other instance, primarily clicking through a tag from an entry, featured toggle tags are ignored and all contextual tags are shown 
    + If this "all contextual tags" makes for any performance lag from too many entries, we could limit contextual tags that show in the navigation to only those tags that are on 3 or more JSON files (or any other count)

  - Ideal UX is a "section page" template that has memory as to which tag click through its main filter is  
      1. Click through to a "website section" from the home page and it would be one of the four "section" tags  
      2. Click through from a random tag on any entry and it is that random tag only that is retained throughout all use of that page 
    + Otherwise there is no real difference between section pages 
    + Except that on section pages filtered by "section", toggle tags are shown from the FEATURED file, but no other contextual tags 
    + And on section pages filtered by any tag from a entry page click through, no toggle tags are present, and only all contextual tags relevant are shown 

    + Both cases would use the same predefined tile component 
    + The top tag nav filter buttons would populate dynamically based on JSON files included according to higher level filter tag 

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

  + Create a JSON schema for populating the homepage's section tiles 
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

### Section Pages 

* **Four website content sections** 

  1. `august.style/web` and `./web.html`
  2. `august.style/print` and `./print.html`
  3. `august.style/digital` and `./digital.html` 
  4. `august.style/video` and `./web.html` 

  + Entry tiles sit in a single column 
    - Use large padding on desktop, keeping it in just one column 
    - Use less padding, still keeping them in one column for mobile and tablet 

  + Every reload these tiles should display in a fully reshuffled order 
    - When a filter is clicked, the tiles stay in the same order as they were 
    - The unrelated tiles fade away 
    - The related tiles smoothly slide up to be in place 

### Project Page `august.style/<SECTION>/<SUBSECTION>/<HTML-FILE-NAME-IN-JSON>` 

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

## Prepared JSON Project Entry Files 

```
august.style/web/
├── framer/
│   └── _uid-tev-176.json
├── html-css-js/
│   ├── _uid-eme-689.json
│   ├── _uid-hwi-844.json
│   ├── _uid-lul-419.json
│   ├── _uid-qor-090.json
│   ├── _uid-rfr-187.json
│   ├── _uid-sgt-851.json
│   ├── _uid-srs-009.json
│   ├── _uid-wgw-370.json
│   └── _uid-wnw-867.json
└── webflow/
    ├── _uid-dff-987.json
    ├── _uid-fth-565.json
    ├── _uid-unw-889.json
    └── _uid-wty-542.json
```