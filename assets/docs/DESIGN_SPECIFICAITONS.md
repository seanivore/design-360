# Creative Generalist Portfolio 

## Overview 

  1. One website to rule them all 
  2. Stronger, image-first design 
  3. Job title/description SEO 
  4. Mobile first i.e. hover isn't creative enough 
  5. UI for easy UX to preview 50+ project entries 

    + The message is to solve the **PROBLEM** of downsizing, economic uncertainty, and AI operational integration 
    + Present as being a downsizing-friendly **SOLUTION** for managers to optimize their workforce for modern landscape 

### Modular Dynamic Updating Design Functionality 

* **Project entry JSON to use for every project**

  + Template: `assets/docs/entry_template.json` 
  + Template changes require approval, POA to list all outdated files to plan and update 
  + Page's HTML filename is in the project's JSON file 

  1. Homepage and section pages have tiles to the content 
  2. Each tile type component is populated from the collections of JSON entries 
  3. Similarly, the filter tags in the sections are populated from the JSON entries 
  4. On-page information doesn't necessarily need to be dynamic, but might be helpful for parts, like tags 

* **JSON filename created using _uid command** 

```bash 
> _uid 
Generated _uid: _uid-enl-043
```

### Steps to Completion 

  1. Gathering content and creating JSON project entry objects 
  2. Plan how homepage and section pages will randomly populate entries 
     - Unlike previous portfolio where we listed 40+ entries on one HTML file 
     - Imagining there must be a better way thanks to the JSON objects, what is that better way 
  3. Each section should be a simple version of the home page, populating appropriate section project entries 
     - The folders in the structure are there to create slugs and proper URL structure 
     - However we still want to have the sections that land on those URLs be working URLs for the section 
     - E.g. `august.style/web/framer` or `august.style/print` etc. 

---

## Content Management, UI, UX 

### Page Guidelines 

  + Highly visual 
    - Use thumbnail slide images if needed 
    - No bullet points, just very short sentences 
    - Only few sentences max per section 
  + Page structure easy to scan 

### Project Copy 

* **Write quality SEO title, then divide it into**
    - H1 "page_title" 
    - H2 "page_subtitle"

* **The page copy should get four clear sections with H3**
    - H3 "Role", "Pattern", "Action", "Measured" 

  1. **Role:** Context of involvement, relationship to project 
  2. **Pattern:** Opportunity identified, content and strategy logic 
  3. **Action:** Resulting moves, execution, procedure, resources committed 
  4. **Measured:** Metrics, the results, thoughts for next time 

* **Similarly sized, and out of the way, at top and bottom of page**
    - H4 "media", "technology", "skill" 
    - H5 breadcrumbs 

### Project Tile Guidelines 

* **Design strategy logic for tiles** 

    - Visuals and tile text should tell whole story 
    - Essentially create overview so no click is needed 
    - User should only click if highly interested 
    - This is to balance out the fact that the portfolio is huge 

* **Define standard component** 

  + For homepage and section tiles 
  + All tiles have fixed aspect ratio 
  + Create for desktop, tablet, and media (mobile)
  + Make width shrink/grow-responsive between main aspect ratios 
  + Good example: `https://developer-technologist.august.style/` 
    - Homepage tiles don't stretch/squeeze at all 
    - Images on page do 

* **Image and "tile_text" UI/UX** 

  + Thumbnail UI coaxes user to know what to do 
    - Show 1/8 of next thumbnail image so user swipes right 
    - Define number and length of tile text needed 
    - Consider tile text sharing image slide change 

  + Thumbnail Slideshow 
    - 1920 px by 1080 px images 
    - At least 3 images, no more than 6 
    - All have proper-seo-and-formatted-filenames 
    - Images in compressed webp format already 
    - Write alt. text on the fly from project + image filename 

* **Uniform interactivity and navigation**

  + Micro-interactions 
    - Only on click and on page change 
    - No hover effects because we are designing 100% mobile first 

  + Toggle tag navigation 
    - Only needed on section pages 
    - Horizontal off-page swipe to scroll  
    - Ensure part of tag is bleed out of view to prompt UI swipe 
    - Tap turn on, moves to front (left), change color; tap again off

### Tile Visual Specifics 

* **Project tile location**

  + Homepage tiles are created to show the section 
    - Larger and squarer; more visual 
    - Two columns when on desktop only 
    - Swipe through collection of images pulled from project thumbnail JSON 
  - Section tiles created to showcase project 
    - Short and wide 
    - Only one column ever, just bigger scale of image, bigger relative to tile text 

* **See visual inspo images** 

  1. 1_homepage_tile.png 
     - For UI functionality example 
     - Large because there are small number of main sections 
  2. 2_section_tile.png 
     - For UI functionality example 
     - Short and wide because large number on section 
  3. 3_tag_filters.png
     - For UI functionality example; horizontal scrolling of tag filters 
     - Simpler, word must bleed off to prompt user to swipe 
     - When tapped, tag stays 'ON', moves to left, turns different color, tap again off 
  4. 4_background_texture.png 
     - For design visual example 
     - But way more subtle, almost same color 
     - Use repeating SVG for small file 
     - Note the gradient down page; create like button boarders 
  5. 5_mid_page_faq.png 
     - For functionality UI and content example 
     - Seems like a great idea but haven't thought further than that 

* **Tile specifics** 

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

### Macro Website Structure 
*Example only; not all entries are listed*

  - Clicking filter tags or jumping to a section of a page should add #tag-name to the URL
  - In the case of the homepage's sections, the #tagged URL should be redirected
  - The section directories, like "web/" and "print/" should have section pages that they direct to 

```
`august.style/`                   `.index.html`
├── about/                        `.index.html`
├── projects/                     `.index.html`
├── contact/                      `.index.html`
├── web/                          `web.html`
│   ├── framer/                   *Redirect to 'framer' filtered web section*
│   │   └── _uid-tev-176.json  
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

### Sectioning & Tagging 

#### Three Tag Types 

  1. Section tag 
     - These define the actual sections of the website 
     - These are the only visible groups from the homepage 
  2. Toggle tag 
     - This list and functionality is TBD, in need of discussion 
     - Imaging they're the most "see only" type tags 
     - These would be located on the section pages with a toggle on/off OR click-through to view only  
  3. Contextual tag 
     - This list is currently just examples below, to be completed with AI help right on the entry JSON files 
     - There are four contextual tag types 
       (1) Role has **JUST ONE** and will be designed onto pages in prominent spot
       (2) Technology, (3) Media, (4) Skill are **COMPREHENSIVE** to be designed on page in word cloud 

#### Section & Toggle Tags 

| Tag                   | Type         |
| --------------------- | ------------ |
| **Web**               | Section tag  |
| **Print**             | Section tag  |
| **Digital**           | Section tag  |
| **Motion Graphics**   | Section tag  |
| **Video**             | Section tag  |
| **Out-of-Home (OOH)** | Section tag  |
| Generative AI         | Toggle tag   |
| Product               | Toggle tag   |
| Copywriting           | Toggle tag   |
| Interactive           | Toggle tag   |
| Team Manager          | Toggle tag   |
| Consulting            | Toggle tag   |

#### Relevant Skill-Based Job Titles **WORK INTO COPY & CONTEXTUAL TAGS**
- First section are to be paired with *...one of second section* 
- E.g. Creative Director, Art Director, etc. 
- These are to be used by working them into the copy naturally, and in contextual tags 
- Include, but not limited to the below 

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
   + Entry list is randomized every reload or toggle change 

* **Regarding web project pages** 

   + Each has one (or two) YouTube iFrame HTML embeds 
   + Resource if needed: `https://developers.google.com/youtube/iframe_api_reference`

### `august.style/web/framer/` **NOT to be made into HTML section page**
### `august.style/web/html-css-js/` **NOT to be made into HTML section page**
### `august.style/web/webflow/` **NOT to be made into HTML section page**

## Print `august.style/print/`
## Digital `august.style/digital/`
## Motion Graphic `august.style/motion-graphic/`
## Video `august.style/video/`
