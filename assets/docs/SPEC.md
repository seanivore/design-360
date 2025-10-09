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

### Design Summary 

  1. Technically simple HTML/CSS/JS build, published to GitHub Pages 
     + No HTML, CSS, or JS pages have been created yet in directories `./assets/css/...`, `./assets/js/...`
     + Necessary `./_config.yml` and `./CNAME` are ready 
  2. Content tile grid navigation with tag toggle filtering on the section pages 
     + ~4 homepage tiles link out to sections; tiles are larger, almost square 
     + Section tiles link out to entries; are wide and short/narrow 
  3. Thumbnail images on tiles swipe like slide show 
     + This is to help prevent the need to click through many projects  
     + Thumbnails are already compressed and 1920 px X 1080 px, with 3 to 6 for each tile 
     + One image must bleed, extend beyond viewport to encourage user to swipe 
  4. Text on images couple with images to tell the full story 
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
  8. Project entry page is highly visual with 4 clear section headings 
     + Each section has 2-4 short sentences; except "ROLE" as that is populated like the tags are 
       1. **Role:** Context of involvement, relationship to project 
       2. **Pattern:** Opportunity identified, content and strategy logic 
       3. **Action:** Resulting moves, execution, procedure, resources committed 
       4. **Measured:** Metrics, the results, thoughts for next time 
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

## Project Entry 

### Writing JSON Variables 

* **Process flow builds on itself to fill out all copywriting in JSON**

  1. Get an `entry_id` by running bash command `uid` then adding an underscore to front of ID 
  2. Add `section` and `sub_section` then fill in `slug` with domain 
     - Section = Print, Digital, Web, or Video 
     - Sub-sections = Created as tags based on need while building project collection 
     - Slug example: 'august.style/web/framer/' 
  3. Add all `media` and `assets`
     - 'video_filename' for future reference 
     - 'video_url' will be linked in the post a few times 
     - 'video_embed' has all double quotes changed to single 
     - Replace 'YouTube Video Player' with the SEO title 
     - Gather ~6 images, crop, resize to 1920x1080px, convert, compress .webp file 
     - Add any 'page_imagery' using the same conversion and compression files 
     - Add 'project_url' if original project has associated URL, i.e. in web design 
     - Add link for 'github_repository' as this will be featured prominently 

* **After adding above basics, begin copywriting with SEO** 

  4. Write `seo_title` 
     - Find two 'hooks' that fit the generalist appeal, then 'Sell the click' in a way that fits our [Message](#message)
     - Example: "Framer CMS Shop Gallery, Lookbook, & AI Podcast Blog" 
  5. Compose `seo_description` 
     - Give context to the hooks in the title, complimenting or expanding on the title conceptually 
     - Example: "Bauhaus inspired custom Framer website design with engaging interactive component shapes." 
  6. Create `file_name` 
     - Remove stop words, prepositions, determiners; replace spaces with hyphens, make all lowercase 
     - Example: 'blog-lookbook-print-gallery.html' 
  7. Create `page_title` and `page_subtitle` 
     - Simplify the 'seo_title' into concise and direct 'page_title' 
     - Fit the rest of the messaging from the 'seo_title' into the 'page_subtitle' 
     - Example page_title: "Framer CMS Site Built Using AI & Notion" 
     - Example page_subtitle: "With micro-interactive bauhaus-inspired design" 
  8. Choose a `breadcrumb` 
     - Choose a few words within the theme of the titles, filename, etc. 
     - For example 'seo_titled' 'Framer CMS Web Design Shop, Gallery, AI Blog'
     - Example: "Automated Design Blog CMS" 
  9. Compose handful of `tile_text` lines 
     - Use all the concepts and drafted text for ideation, capitalizing on what best fits website message and intention 
     - Examples: 
       + "AI generated blogs examine Podcast concepts"
       + "Automated build using Notion to CMS integration" 
       + "1 component + Notion database = 81 image fashion magazine" 
       + "Build an entire web store in minutes with CMS and Notion" 

* **After all the bits of copy are complete, compose `page_copy` sections** 

  10. Write `pattern` on logic of opportunity 
  11. Write `action` on how opportunity was capitalized on 
  12. Write `measured` about how to tell project was a success 
  13. Include any necessary `notes` for when the entry page is created 

### Page Headings 

| Class | JSON Variable                  | Styling Guide     | 
| ----- | ------------------------------ | ----------------- | 
| H1    | `page_title`                   | Large, heavy      | 
| H2    | `page_subtitle`                | Smaller than H3   | 
| H3    | `role` & `page_copy` headings  | Main sections     |
| H4    | `media`, `technology`, `skill` | Page content tags | 
| H5    | `breadcrumb`                   | Similar to H4     | 

### Project Tagging Types 

  1. Section tag = define actual website sections, only tiles on homepage; informs which section page tiles to populate 
  2. Toggle tag = top of section page; only the top "see only" type tags; 
  3. Contextual tag = **comprehensive**, see examples started below to be completed by AI right on JSON files; four types 
     - (1) `ROLE` has **JUST ONE** and is designed onto page as one of the sections 
     - (2) `TECHNOLOGY`, (3) `MEDIA`, (4) `SKILL` 
     - Tags on page in group at top right; click-through to see-only content tiles with same tag  

| Tag             | Type         |
| --------------- | ------------ |
| **Web**         | Section tag  |
| **Print**       | Section tag  |
| **Digital**     | Section tag  |
| **Video**       | Section tag  |
| Generative AI   | Toggle tag   |
| Product         | Toggle tag   |
| Copywriting     | Toggle tag   |
| Interactive     | Toggle tag   |
| Team Manager    | Toggle tag   |
| Consulting      | Toggle tag   |

#### Relevant Skill-Based Job Titles **WORK INTO COPY & CONTEXTUAL TAGS**

  + (Creative, Art) Director 
  + (Social, Video, Email, SMS, Viral, Content) Producer
  + (Digital, Print, Illustration, System, Generative AI, UI/UX) Designer 
  + (Innovations, Marketing, Digital) Manager, Strategist 
  + (Copy, UI/UX) Writer 
  + (Web, Front-End, App) Developer 
  + (Advertising, Process Optimization, Automation, AI Integration) Specialist 
  + (Remote/Team, Client/Account, Project) Manager 
  + (Digital, Business, Branding) Consultant 

#### Example Contextual Tags 

* **Framer AI In-Painted Archetypal Fashion Lookbook**
  + *Web Designer + Framer + AI Writing + AI Image Creation + AI Photo Editing + Fashion Design + System Design + Product*

* **Framer Education Art History Immersion Print Shop**
  + *Web Designer + Framer + AI Image Creation + AI Creative Planning + AI Photo Editing + Art History + E-Commerce + Back-end Store Automation* 

* **Webflow 200+ Weekly AI Generated Blog**
  + *Web Designer + Webflow + Local Rebuild + GitHub Pages + AI Writing + API Publishing API + Database Management + Workflow Automation + AI Image Creation + Branding + Hand Drawn + Digital Art + Illustration + Adobe Creative Cloud + Photoshop + After Effects + Adobe Illustrator + Apple Pen + Apple iPad Pro + Adobe Fresco + Vector Art + Custom Animation + Lottie Files*

* **Webflow Hand-Drawn Illustrated Service Sales Website**
  + *Account Management + Web Designer + Business Development Consultant + Webflow + Local Rebuild + GitHub Pages + Branding + Hand Drawn + Digital Art + Illustration + Adobe Creative Cloud + Photoshop + After Effects + Adobe Illustrator + Apple Pen + Apple iPad Pro + Adobe Fresco + Vector Art + Full Stack Management + Email Marketing + Subject Matter Expert + Social Media Advertising + Print Design + Organic Social Media Consulting*

---

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
*Example only; not all entries are listed*

```
`august.style/`                   `.index.html`
├── projects/                     `.index.html#projects`
├── about/                        `.index.html#about`
├── contact/                      `.index.html#contact`
├── web/                          `web.html`
│   ├── framer/                   *Redirect to 'framer' filtered web section*
│   ├── html-css-js/              *Redirect to 'HTML/CSS/JS' filtered web section*
│   └── webflow/                  *Redirect to 'webflow' filtered web section*
├── print/                        `print.html`
├── digital/                      `digital.html`
├── motion-graphic/               `motion-graphic.html`
└── video/                        `video.html`
    ├── social-optimizaed/                   *Redirect to 'framer' filtered web section*
    ├── gif-motion-graphic/              *Redirect to 'HTML/CSS/JS' filtered web section*
    └── standard/                  *Redirect to 'webflow' filtered web section*
```

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
