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

  1. Technically simple HTML/CSS/JS build, published to Github Pages
     + Completed `./_config.yml` 
     + Added `./CNAME` file 
     + Create separate CSS here `./assets/css/...` and JS here `./assets/js/...`
  2. Content tile grids on homepage and section pages 
     + Large homepage tiles go to sections; short and wide section tiles go to project entries 
     + Text and swipe-thumbnail images on tile tells full story to minimize necessary click-through's 
     + Tile responsiveness snaps to fixed desktop, tablet, media/mobile aspect ratio stop points 
     + Shrink/grow responsiveness is there, but very minimally, preserving visual content on tile 
  3. Page UI/UX is REAL mobile first 
     + Micro-interactions on click, NO USING HOVER; be more creative than that 
     + Extra-apparent, smooth page transitions where elements drop or fade in sequentially 
     + Highly visual layout with page sections containing 2-4 short sentences; no use of bullet points 
     + Clear ROLE heading, and sections with headings PATTERN, ACTION, and MEASUREMENT; nothing more 
       1. **Role:** Context of involvement, relationship to project 
       2. **Pattern:** Opportunity identified, content and strategy logic 
       3. **Action:** Resulting moves, execution, procedure, resources committed 
       4. **Measured:** Metrics, the results, thoughts for next time 
  4. Project entries are all on JSON files 
     + `./assets/docs/entry_template.json` -- no template changes without asking permission 
     + Used to dynamically populate tiles and tags on homepage and section pages, maybe on project entries  
     + Find the proposed HTML filename on the JSON file; JSON filename created using `uid` bash command 
  5. Swipe UI on tile thumbnail images helps prevent click-through needs 
     + 3 to 6 compressed webp image files; all 1920 px by 1080 px; UI encouraged by showing 1/8th of the next thumbnail
     + Write simple alt. text on the fly from context of project text and image's filename 
     + TBD amount and lines of text on tile; could potentially cross-fade text changes triggered by thumbnail swipe 
  6. Filter tags on section pages use horizontal scroll UI going off page, visually mirroring the UI of the tile image UX 
     + Tapping a filter to turn it ON moves it to the front (far left) and changes it to more prominent color; tap again to turn off 
     + Tiles load in random order on every reload; order maintained on filtering with tiles visually present sliding smoothly into new placement 
  7. Macro-website structure has a simple, user-expected organization 
     + Clicking filter tags or jumping to a section of a page should add #tag-name to the URL
     + In the case of the homepage's sections, the #tagged URL should be redirected `august.style/about` and `august.style/contact` 
     + The section directories, like `/web/` and `/print/` direct to URL `august.style/web/...` etc.  

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
     - (2) `TECHNOLOGY`, (3) `MEDIA`, (4) SKILL 
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

- First section are to be paired with *...one of second section* 
- E.g. Creative Director, Art Director, etc. 

  + Creative, Art *...Director*
  + Social, Video, Email, SMS, Viral, Content *...Producer*
  + Digital, Print, Illustration, System, Generative AI, UI/UX *...Designer*
  + Innovations, Marketing, Digital *...Manager, Strategist*
  + Copy, UI/UX *...Writer*
  + Web, Front-End, App *...Developer*
  + Advertising, Process Optimization, Automation, AI Integration *...Specialist*
  + Remote/Team, Client/Account, Project *...Manager*
  + Digital, Business, Branding *...Consultant*

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

## Tile UI/UX 

### Inspo Examples 

  1. `./assets/docs/tile_visual_inspo/1_homepage_tile.jpg`
     - For UI functionality example of tiles on homepage 
     - Large because there are small number of main sections 
  2. `./assets/docs/tile_visual_inspo/2_section_tile.jpg` 
     - For UI functionality example of tiles on section pages 
     - Short and wide because large number of entries in sections 
  3. `./assets/docs/tile_visual_inspo/3_tag_filters.jpg`
     - For UI functionality example; horizontal scrolling of tag filters 
     - Simpler, word must bleed off to prompt user to swipe 
     - When tapped, tag stays 'ON', moves to left, turns different color, tap again off 

### Visual Design Specifics 

  + Light mode VS dark mode background 
    - Simple off-white VS black/charcoal 
    - Ornate SVG repeating pattern in SLIGHTLY different shade for texture 
    - Solid behind SVG pattern has gradient looks like glare down vertical of page 
  + Light mode VS dark mode tile color 
    - Colored similarly to background 
    - Realistic, subtle shading 
    - Sharp look and corners 
  + Mobile and Tablet 
    - One tile column 
    - Short and wide for section, squarish for homepage 
  + Desktop 
    - Still one column for section pages; tile just bigger, more visual 
    - UI of section page tile type would be strange if it was in 2 columns 
    - Two columns should be okay for homepage tiles 
  + Section color coding 
    - Only on the homepage tiles 
    - 2-3 px thick horizontal bar 
  + Entry list is randomized every reload or toggle change

### Macro Website Structure 
*Example only; not all entries are listed*

```
`august.style/`                   `.index.html`
├── projects/                     `.index.html#projects`
├── about/                        `.index.html#about`
├── contact/                      `.index.html#contact`
├── web/                          `web.html`
│   ├── framer/                   *Redirect to 'framer' filtered web section*
│   │   └── _uid-tev-176.json     *HTML filename found in JSON file* 
│   ├── html-css-js/              *Redirect to 'HTML/CSS/JS' filtered web section*
│   │   ├── _uid-eme-689.json
│   │   ├── _uid-hwi-844.json
│   │   ├── _uid-lul-419.json
│   │   ├── _uid-qor-090.json
│   │   ├── _uid-rfr-187.json
│   │   ├── _uid-sgt-851.json
│   │   ├── _uid-srs-009.json
│   │   ├── _uid-wgw-370.json
│   │   └── _uid-wnw-867.json
│   └── webflow/                  *Redirect to 'webflow' filtered web section*
│       ├── _uid-dff-987.json
│       ├── _uid-fth-565.json
│       ├── _uid-unw-889.json
│       └── _uid-wty-542.json
├── print/                        `print.html`
├── digital/                      `digital.html`
├── motion-graphic/               `motion-graphic.html`
└── video/                        `video.html`
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

## Web `august.style/web/` **all JSON files placed**

* **On-section page** 

   + Toggle on/off each of the three sub-section categories 
   + Only other tags that show are "toggle tags" if they exist on any of the JSON project entry files 
   +  

* **Regarding web project pages** 

   + Each has one (or two) YouTube iFrame HTML embeds 
   + Resource if needed: `https://developers.google.com/youtube/iframe_api_reference`

## Print `august.style/print/`
## Digital `august.style/digital/`
## Motion Graphic `august.style/motion-graphic/`
## Video `august.style/video/`
