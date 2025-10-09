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

## Project Entries 

### JSON Entry Writing Process 

* **Process flow builds on itself to fill out all copywriting in JSON**

  1. Get an `entry_id` by running bash command `uid` then adding an underscore to front of ID 
  2. Add `section` and `sub_section` then fill in `slug` with domain 
     - `section` options = Print, Digital, Web, or Video 
     - `sub_section` is created as context tags based on need while build the collection of project entries 
     - `slug` field entry example = 'august.style/web/framer/' 

* **After preparing above basics, human completes the following or works with AI to do so** 

  3. Complete two from the `content` > `media` section 
     - Write an `seo_title` 
       + Find two 'hooks' fitting generalist appeal; 'Sell the click' by fitting our Message of creating this site 
       + Example: "Framer CMS Shop Gallery, Lookbook, & AI Podcast Blog" 
     - Compose `seo_description` 
       + Give context to hooks by complimenting, expanding on the title conceptually 
       + Example: "Bauhaus inspired custom Framer website design with engaging interactive component shapes." 
  4. Now you can create the `categorization` > `placement` > `file_name` by simplifying the `seo_title` 
     - This is the rest of the project entry URL so remove stop words, prepositions, determiners from `seo_title` 
     - Replace spaces with hyphens and make everything lowercase 
     - Example: 'blog-lookbook-print-gallery.html' 
  5. Finally, add all `media` > `assets`
     - The `video_filename` which is collected for possible future needs  
     - If available, add any `video_url` so it can be linked throughout the post a few times 
     - If there was a video, grab and slightly edit the `video_embed` to place it on the page 
       + Have the double quotes changed to single 
       + Replace 'YouTube Video Player' with the project entry's `seo_title`
     - Gather `thumbnail_images` and prepare them accordingly  
       + Select ~ 6 images to become gesture-swiped collection of content tile thumbnails 
       + Crop and resize thumbnail images to 1920 px by 1080 px 
     - Then add `page_imagery` to the array if available 
       + Use video stills, images from old portfolio posts, or at least the actual thumbnails from the tile placement 
       + They must be converted and compressed in the same way the `thumbnail_images` were
     - Most projects will hav a `project_url` to link to; i.e. websites designed or developed, social media posts, etc. 
     - Then add the `github_repository` if possible, to be placed on the project entry page 
  6. Add `notes` to aid AI in filling out rest of JSON 
     - Look through the old portfolio entries, most can be found in applying-to-jobs directory 
     - Include summaries from those documents and also add any URL to previous portfolio entry posts 

* **AI should now use all resources available to complete JSON for Sean to review afterwards** 

  7. Create `page_title` and `page_subtitle` 
     - Simplify the `seo_title` into concise and direct `page_title` 
     - Fit the rest of the messaging from the `seo_title` into the `page_subtitle` 
     - Example `page_title`: "Framer CMS Site Built Using AI & Notion" 
     - Example `page_subtitle`: "With micro-interactive bauhaus-inspired design" 
  8. Choose a `breadcrumb` 
     - Choose a few words within the theme of the titles, filename, etc. 
     - For example using the `seo_title` 'Framer CMS Web Design Shop, Gallery, AI Blog'
     - Example: "Automated Design Blog CMS" 
  9. Compose handful of `tile_text` lines 
     - Use all the concepts and drafted text for ideation, capitalizing on what best fits website message and intention 
     - These should tell the story, the highlights about the project, even impressive KPI metrics 
     - Combined with thumbnails, we're creating a UI that has a UX where hiring managers don't have to click into many projects 
     - Examples: 
       + "AI generated blogs examine Podcast concepts"
       + "Automated build using Notion to CMS integration" 
       + "1 component + Notion database = 81 image fashion magazine" 
       + "Build an entire web store in minutes with CMS and Notion" 

* **Copy above as a resource, AI can write 2-4 sentences for the `page_copy` items and a single `tagging` item** 

  10. These 4 will be headers and page sections mirrored on every project entry page 
      - (1) In the `tagging` section add a `role` for the project 
        + This is placed prominently unlike other tags  
        + This is ideally one role, possibly a job title; for complex cases Sean will need to help or update after 
        + In other-words this is the context of involvement, relationship to project 
      - (2) Write `pattern` section  
        + This should humbly, indirectly highlight my innate pattern spotting ability
        + Frame this as the logic behind why the project was an opportunity to take on 
        + This likely shows the content of and strategy logic behind taking on the opportunity as a project 
      - (3) Write `action` section 
        + This would be the resulting moves, execution, procedure, and resources committed
        + Frame this as how the opportunity was capitalized on
      - (4) Write `measured` section 
        + This should show or define how to tell project was a success 
        + Frame this as metrics like KPIs, generally speaking, the results, or at least some thoughts for next time 

* **Lastly, AI fills in section `tagging` which are used for content tile filtering and contextual information** 

  11. Populate JSON tag lists for context tag types using the guidance on tagging creation section below 
      - `technology` tags 
      - `media` tags 
      - `skill` tags 

### Tag Creation Protocol Guidance  

* **Our three types of tags** 

  1. Section tags 
     + These define placement of project entries into actual website sections 
       - They are the names of our homepage tiles 
       - They informs which section page the tiles should populate on 
  2. Toggle tags 
     + Select tags listed at top of section pages to navigate by filtering down project tiles 
     + Each project page will include tags in out-of-way top-right region; click through goes to section page sorted to see only that content 
  3. Contextual tag  
     + These are meant to be very comprehensive, capitalizing on words used on job openings and on resumes 
     + The will also be placed on the project entry page top-right as toggle tag point describes above 

* **Must include section tags for content filtering** 

| Tag             | Type         |
| --------------- | ------------ |
| **Web**         | Section tag  |
| **Print**       | Section tag  |
| **Digital**     | Section tag  |
| **Video**       | Section tag  |
| Generative AI   | Toggle tag   |    # The toggle tags are open to be changed,
| Product         | Toggle tag   |      as the goal is to show off exactly what 
| Copywriting     | Toggle tag   |      the hiring managers are likely looking to 
| Interactive     | Toggle tag   |      isolate or filter down to just that content 
| Team Manager    | Toggle tag   |
| Consulting      | Toggle tag   |

* **Skill-based job titles to work into copy and contextual tags** 

  + (Creative, Art) Director 
  + (Social, Video, Email, SMS, Viral, Content) Producer
  + (Digital, Print, Illustration, System, Generative AI, UI/UX) Designer 
  + (Innovations, Marketing, Digital) Manager, Strategist 
  + (Copy, UI/UX) Writer 
  + (Web, Front-End, App) Developer 
  + (Advertising, Process Optimization, Automation, AI Integration) Specialist 
  + (Remote/Team, Client/Account, Project) Manager 
  + (Digital, Business, Branding) Consultant 

* **Tag examples illustrating depth and comprehensiveness** 

*Web Designer + Account Management + Business Development Consultant + Framer + Webflow + Local Rebuild + GitHub Pages + AI Writing + API Publishing API + Database Management + Workflow Automation + AI Writing + AI Image Creation + AI Creative Planning + AI Photo Editing + Art History + E-Commerce + Back-end Store Automation + Fashion Design + System Design + Product + Branding + Hand Drawn + Digital Art + Illustration + Adobe Creative Cloud + Photoshop + After Effects + Adobe Illustrator + Apple Pen + Apple iPad Pro + Adobe Fresco + Vector Art + Custom Animation + Lottie Files + Full Stack Management + Email Marketing + Subject Matter Expert + Social Media Advertising + Print Design + Organic Social Media Consulting*


### Page Headings 




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
