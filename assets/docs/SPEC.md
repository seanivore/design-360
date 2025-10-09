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

  - Entries of this website are managed using JSON object files 
    + `/Users/seanivore/Development/360-design/assets/docs/_entry_template.json`
  - These populate various parts of the site and allow for functionality 
  - Comprehensive steps for preparing a project entry JSON file are prepared here 
    + `/Users/seanivore/Development/360-design/assets/docs/ADD_NEW_PROJECT.md` 

* **Website macro-structure** 
*Incomplete example only*

```
`august.style/`        `.index.html`
├── projects/          `.index.html#projects`
├── about/             `.index.html#about`
├── contact/           `.index.html#contact`
├── web/               `web.html`
│   ├── framer/        *Redirect to 'framer' filtered web section*
│   ├── html-css-js/   *Redirect to 'HTML/CSS/JS' filtered web section*
│   └── webflow/       *Redirect to 'webflow' filtered web section*
├── print/             `print.html`
├── digital/           `digital.html`
├── motion-graphic/    `motion-graphic.html`
└── video/             `video.html`
    ├── social/        *Redirect to 'framer' filtered web section*
    ├── gif/           *Redirect to 'HTML/CSS/JS' filtered web section*
    └── standard/      *Redirect to 'webflow' filtered web section*
```

### Design Summary 

  1. Technically simple HTML/CSS/JS build, published to GitHub Pages 
     + No HTML, CSS, or JS created yet; directories exist: `./assets/css/...`, `./assets/js/...`
     + The `./_config.yml` and `./CNAME` files are complete  
  2. Content tile grid navigation with tag toggle filtering on the section pages 
     + Larger, almost square homepage tiles link out to the four website sections 
     + Wide, shorter/narrow section page tiles link out to entries 
  3. Thumbnail images on tiles swipe like slide show 
     + This is to help prevent the need to click through many projects  
     + One image must bleed, extend beyond viewport to encourage user to swipe 
  4. Text on images couple with images to tell the full story, metrics, results 
     + There are ~4 teaser lines of text for front of the tile 
     + These change with cross-fade that triggers when an image is swiped to the next 
  5. Responsive design is strictly mobile FIRST 
     + Tile responsiveness snaps to fixed desktop, tablet, media/mobile aspect ratio stop points
     + Shrink/grow responsiveness is there, but very minimally, preserving visual content on tile
     + Micro-interactions on click; NO HOVER, be more creative than that
     + Extra-apparent, smooth page transitions; elements drop or fade in sequentially 
  6. Filter tags on section pages use horizontal scroll UI, bleed out of viewport, mirroring UI of thumbnails 
     + Tapping a filter to turn it ON moves it to the front (far left) and changes it to more prominent color; tap again to turn off
     + Tiles load in random order on every reload; order maintained on filtering with tiles visually present sliding smoothly into new placement
     + Clicking filter tags or jumping to a section of a page should add #tag-name to the URL
     + In the case of the homepage's sections, the #tagged URL should be redirected `august.style/about` and `august.style/contact` 
     + The section directories, like `/web/` and `/print/` direct to URL `august.style/web/...` etc. 
  7. Project tiles, tag filters, and other info is populated dynamically, pulling from JSON file for every project 
     + All entries use the same template JSON object schema: `./assets/docs/entry_template.json` 
     + JSON files are perfectly structured for vanilla JS consumption; no build process needed 
     + Necessary for tags and filtering on section pages, as well pas populating the actual tiles, their text, their images 
     + On entry page, just some elements are made dynamic, like the list of tags for each page at top right 
     + If it is easier we can/should dynamically fill in as much of the entry details on page as possible 
  8. Project entry pages are highly visual with 4 clear section headings 
     + Sections include **ROLE**, **PATTERN**, **ACTION**, and **MEASURED** 
     + Each section has 2-4 short sentences; except "ROLE" as that is populated like the tags are 
     + Find proposed HTML filename on JSON file; JSON filename created using `uid` bash command 
     + Any images have their alt. text written on the fly pulling from context of project text and image's filename 

---

## Work Flow for Next Tasks 

### Project State & Context Priming 

  * **Minimize LLM limitations** 

  - Use native `think` tool if you are able to multi task between thoughts with tools 
  - Otherwise use the `sequential_thinking` Model Context Protocol server to think while hou review the following 
  - Maintain project state via updates for across AI instance flow
  
  * **Check project state** 

  - Start the `memory` MCP tool 
  - Search exact entity term `generalist-portfolio` 
  - The `read_file` for whatever entry file you are going to be creating a page for 

  * **Add project state updates** 

  - Add entry milestones that maintain context even if suddenly disconnected
  - About to start a series of tasks, record what you're about to do
  - Also record the next steps in case connection is interrupted during first tasks
  - Add updates throughout completing the tasks, particularly anything notable or necessary for next steps
  - Update after completion of those tasks; add what is next or reference having mentioned it if nothing has changed


---

## UI/UX Website Specifics 

### Project Entry Pages 

* **Page headings** 

| Class | JSON Variable                  | Styling Guide     | 
| ----- | ------------------------------ | ----------------- | 
| H1    | `page_title`                   | Large, heavy      | 
| H2    | `page_subtitle`                | Smaller than H3   | 
| H3    | `role` & `page_copy` headings  | Main sections     |
| H4    | `media`, `technology`, `skill` | Page content tags | 
| H5    | `breadcrumb`                   | Similar to H4     | 

## Tile UI/UX Design Details 

### Must See Visual Inspo 

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

### Tile Design Specifics 

* **Include light mode and dark mode options with dark mode defaulted** 

  + Background 
    - Use simple off-wite versus black/charcoal 
    - Ornate SVG could bring in very faded color 
    - Gradient effect as in example above to give depth 
  + Tile component 
    - Colored similarly to background 
    - Realistic and subtle shading 
    - Sharp look, sharp corners; Apple killed the radial corner trend hard 
  + Device responsiveness 
    - Mobile and Tablet have one tile column sized as described in inspo above 
    - Desktop still has one column for section pages, but tile is bigger, more visual; two columns for homepage tiles 
  + Randomized tile order 
    - Every time the page is reloaded the tiles should be in a new random order 
    - When a filter is selected, that random order is maintained, non-tagged tiles fade away, then tagged content slide into place 

### Macro Website Structure 


---

## Home `august.style`

  - Three sections of the page are section navigation, about, and contact 
  - Create URL that jumps to each of the three and forward that to actual URL 

### Projects `august.style/projects`

  + Section Tile Navigation

### About `august.style/about`

   **Sean August Horvath, Creative Generalist**

   > 14 years hopping borders between art, product, and growth. Clean lines, maximal ideas. Sketches brands by hand, ships AI pipelines by night. Pattern recognition is my superpower; making it teachable is my craft. 

### Contact `august.style/contact` 

   - [github.com/seanivore](https://github.com/seanivore)
   - [linkedin.com/in/seanivore/](https://www.linkedin.com/in/seanivore/)
   - [instagram.com/seanivore/](https://www.instagram.com/seanivore/)
   - [horvathaugust@gmail.com](mailto:horvathaugust@gmail.com)


--- 

 ## Implementation of Dynamic UI 

* **Current status and general plan** 

   - 

* **Must have functionality** 

  1. Get section pages fully dynamic with tile grids 
  2. Tiles should use tag filtering 

* **Dynamic features to implement** 

  1. Homepage tiles from section categorization 
  2. Section page tiles with filtering by tagging arrays 
  3. Random tile ordering on load with smooth transitions during filtering 
  4. Optional: dynamic entry page content population 

* **Technical approach** 

  1. Fetch JSON files 
  2. Parse categories for routing, use tagging arrays for real-time filtering 
  3. Use `thumbnail_images` array for tile swipe UI 
  4. The `tile_text` array use with cross-fading text triggered on image swipes 
