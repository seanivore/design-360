# Creative Generalist Portfolio 

## Overview 

  1. One website to rule them all 
  2. Stronger, image-first design 
  3. Job title/description SEO 
  4. Mobile first i.e. hover isn't creative enough 
  5. UI for easy UX to preview 50+ project entries 

    + The message is to solve the **PROBLEM** of downsizing, economic uncertainty, and AI operational integration 
    + Present as being a downsizing-friendly **SOLUTION** for managers to optimize their workforce for modern landscape  

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

## Content UI and UX 

### Project Entry JSON `assets/docs/entry_template.json` 

  - For every project 
  - Make no schema changes without approval; 
    need POA to list outdated files 

### Macro Website Structure 

```
`august.style/` 
├── web/
│   ├── framer/
│   │   └── uid-tev-176.json (HTML filename in JSON)
│   ├── html-css-js/
│   │   ├── uid-eme-689.json
│   │   ├── uid-hwi-844.json
│   │   ├── uid-lul-419.json
│   │   ├── uid-qor-090.json
│   │   ├── uid-rfr-187.json
│   │   ├── uid-sgt-851.json
│   │   ├── uid-srs-009.json
│   │   ├── uid-wgw-370.json
│   │   └── uid-wnw-867.json
│   └── webflow/
│       ├── uid-dff-987.json
│       ├── uid-fth-565.json
│       ├── uid-unw-889.json
│       └── uid-wty-542.json
├── print/
├── digital/
├── motion-graphic/
└── video/
```

### Project Copy Structure 

  - Highly visual on page content without using bullet points 
  - ~ > 3 sentences max for each of the four sections 
  - Call-out each 'Role', 'Pattern', 'Action', 'Measured' on every project page 
  - Design so that the pages are recognizable based on the structure 

  1. **Role:** Context of involvement or relationship to project 
  2. **Pattern:** What opportunity was identified, by what content and strategy logic 
  3. **Action:** The moves that resulted, the execution, procedure, and resources committed 
  4. **Measured:** Metrics i/a, the results, maybe thoughts on doing things differently next time 

### Visual Details 

  - Visual-centric grid tiles 
    + 2-columns and nearly square 
    + Simple off-white or black/charcoal background
    + Similarly colored tiles with realistic, sharp, subtle shading, angles 

  - Define and standardize 
    + Keep them all the same shrink-responsive aspect ratio 
    + Tiles on homepage and on section pages look the same 

* **Uniform interactivity**

  - See visual inspo images 

  - Micro-interactions 
    + Only on click and on page change 
    + No hover effects because we are designing 100% mobile first 

  - Toggle tag navigation 
    + On section pages only 
    + No need on homepage because there are only five major sections 
    + On mobile, one horizontal row that scrolls L/R much 
    + Scroll L/R is like Google page search results sort options for Images, Shopping, etc. 
    + Filtering toggle tags written strategically ensuring half of one word is part out of viewport so UI knows to swipe L then R 

* **Tile strategy** 

  - Combat large amount of content by providing a 'get it without clicking' experience 
    + Strong GIF/WebM thumbnails 
    + Overview highlights from 1-4 project page structure copy 
    + Consider text that changes on the tiles, slowly changing to display a different highlight 

* **Project tile location**

  - Homepage tiles are created for the section  
  - Tiles in sections are created specifically for each project 

* **On-tile image and text** 

   + Video or GIF projects use GIF/WebM thumbnails 
   + Other projects, create image slideshow for GIF/WebM thumbnails 

---

## Sectioning & Tagging 

### Three Tag Types 

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

### Section & Toggle Tags 

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

### Relevant Skill-Based Job Titles **WORK INTO COPY & CONTEXTUAL TAGS**
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

### Example Contextual Tags 

#### Framer AI In-Painted Archetypal Fashion Lookbook 
  + *Web Designer + Framer + AI Writing + AI Image Creation + AI Photo Editing + Fashion Design + System Design + Product*

#### Framer Education Art History Immersion Print Shop 
  + *Web Designer + Framer + AI Image Creation + AI Creative Planning + AI Photo Editing + Art History + E-Commerce + Back-end Store Automation* 

#### Webflow 200+ Weekly AI Generated Blog 
  + *Web Designer + Webflow + Local Rebuild + GitHub Pages + AI Writing + API Publishing API + Database Management + Workflow Automation + AI Image Creation + Branding + Hand Drawn + Digital Art + Illustration + Adobe Creative Cloud + Photoshop + After Effects + Adobe Illustrator + Apple Pen + Apple iPad Pro + Adobe Fresco + Vector Art + Custom Animation + Lottie Files*

#### Webflow Hand-Drawn Illustrated Service Sales Website 
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
