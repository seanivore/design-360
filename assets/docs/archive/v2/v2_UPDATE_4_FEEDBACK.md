# Creating Portfolio Landing Page Prototype 

**Created**: 2026-03-10 
**Version**: v2.0 
**Status**: Initial prototype feedback 
**Prototype**: `file:///Users/seanivore/Development/360-design/landing-prototype.html`

## Feedback Overview

Anything on the homepage, particularly text, must either be general enough to apply to any project or be dynamic from a value added to every JSON. 

Right now there are too many sections that are implied to be hardcoded but are specific, and focus too heavily on my entire career or selling myself as a generalist, when the intention of this dynamic redesign is to allow us to specifically focus on the roles and skills that are most relevant to the job we're applying for — this is why it can update dynamically. 

Though we are looking to create the feeling of a SaaS landing page, the current version is far too literal. We need to think more abstractly and focus more on the goal of showcasing exactly the projects we want, and think less about trying to be selling a SaaS. 

### Intended Changes 

  + Removing special tags that created hardcoded sectioning and sub-sectioning 
  + Making all tags created equal 
    - Any tag can populate the `section.html` template
    - Any tag or group of tags will populate the homepage components 
  + Homepage components are populated dynamically based on the tags defined in `assets/js/homepage-content.json` 
  + There will be new values to add to `assets/docs/_entry_template.json` 
    - Every current `assets/entries/...` will need to be updated 
    - Code will need to be updated to handle the new values 

### Documentation 

This process is carefully defined in the **Agent development plan** and where we left off is easily identified by the **Agent task list**: 

| Purpose                         | Document                                         |
| ------------------------------- | ------------------------------------------------ |
| Landing page pitch              | `assets/docs/archive/v2/v2_UPDATE_1_PITCH.md`    |
| **Agent dev plan**              | `assets/docs/archive/v2/v2_UPDATE_2_PLAN.md`     |
| **Agent task list**             | `assets/docs/archive/v2/v2_UPDATE_3_TASKS.md`    |
| Mockup feedback (this doc)      | `assets/docs/archive/v2/v2_UPDATE_4_FEEDBACK.md` |
| Portfolio summaries for content | `assets/docs/archive/v2/PORTFOLIO_DETAILS.md`    |
| Resumes details for content     | `assets/docs/archive/v2/RESUME_DETAILS.md`       |

---

## Job Title Discovery  

**FastCompany Article rejects `UX/UI Designer` title** 

Replace "I’m a UX/UI Designer" with language that communicates impact: 
*"I design digital health platforms for clinical teams. I lead research, define interaction architecture, and partner with engineering to ship experiences that reduce cognitive load at the point of care."*

Coming up with better job titles should provide deliberate answer to the question 
*"Does my title reflect the actual value I deliver?"*

**Quality design titles they reference**: 

  - Product Designer
  - Design Strategist
  - Interaction Designer
  - Design Systems Engineer

**Examples they provided**: 

  - Shape end-to-end product experiences across a platform = *Product Designer*
  - Conducting research, synthesizing behavioral insights, and informing product strategy = *UX Researcher or UX Strategist*
  - Architect interaction systems and design component libraries at scale = *Design Systems Lead*

  > We should apply this mentality to the job titles we use. 

---

## Controlling Component Content 

### Tag Categories 

We should expand one additional tag group so that things like "website" or "video short" can be easily located and grouped if needed for freelance work or where a job title is less essential. 

  1. Roles — identified based on targets and FastCompany article advice 
  2. Skills — skills that make up various roles with necessary crossover 
  3. Products — categorical grouping of work I've done 

  + Looking at "Phase 1: Tag System & Foundation" > "New Tag Groups"
    - On `assets/docs/archive/v2/v2_UPDATE_2_PLAN.md` 
    - Next to **Skills** it says "never restate a role" 
    - But it seems like we'll need to 
    - For example we do have "Brand Designer" as well as "Brand Assets" 
    - Similarly we'll want to tag social media content as such, but I wasn't necessarily the Social Media Manager for all of the social media content I produced 

  + Looking at the chart under "New Tag Groups": 
    - Good to plan out tags 
    - Make sure Roles have appropriate corresponding skills that it "Covers" 
    - But don't let the chart feel like it implies forced grouping or hierarchy
    - Any of those roles might be associated with any of those skills 
    - **All tags should be "free agents"** 
    - We do want to try and consolidate as much as possible 
    - In the end a project could have any number of roles tagged and any skills that make sense 

### "And" "Or" Statements for Adaptability 

Homepage components can be modified by applying tags on `assets/js/homepage-content.json` that populate: 

  1. All entries that have a **SINGLE TAG**
  2. Entries that have **EITHER TAG-A *OR* TAG-B**
  3. Only entries that have **BOTH TAG-A *AND* TAG-B** 

Or any combination thereof. This functionality is to be the same on the our `section.html` pages, where we'll need to modernize the UI for filtering.  

### What To Showcase 

Some combination of these items are both the strongest of the experience I can illustrate and talk about from my work history, and the most relevant for my two immediate use cases (which are that my mom, who is a SBO who connected me to other SBO to build websites for them, wants to post something about what I can offer; and that I want to be able to apply to jobs using this). You'll see ideas for how to group and present this content in components in the [Landing Page Section Feedback](#section-feedback) section below. Consider this list very loose — I put more thought into what will actually work in the actual landing page section details. 

  1. Web Development
     - Webflow 
     - Framer 
     - React/TypeScript 
     - HTML/CSS/JS 
  2. Social Media Designer 
     - Digital Art 
     - Brand Assets 
     - Motion Graphics 
     - Typography 
  3. Advertising Impact
     - Lead with metrics we have 
     - Perhaps graphs of them 
  4. AI & Automation Implementation
     - Storefront 
     - Store backend 
     - Content production 
     - Engagement helper 
  5. Marketing Manager 
     - Press hits 
     - Background and experience 
     - Viral deets 

---

## Design Notes 

### 1. Start from scratch with FULL mobile first  

  + Use these 2026 **MOBILE BEST PRACTICES** in this design spec 
    `.agent/2026_MOBILE_DESIGN_SPECS.md`

To do this well, I want you to start from the ground up so that you're only thinking mobile-first. This will be easier than trying to pick and choose what needs to be adjusted. Instead, every component and the layout will be optimized for mobile first 
  
  + Things like "hover" are pretty, but we are only speaking to a small percent of viewers 
    - The current prototype isn't responsive  
    - In this day and age, it needs to be even smarter than the desktop design, because desktop is easy 

  + As I go through the sections in the second half of this document, I'll be sure to describe things in a mobile first way 

### 2. Amp Up Cereal Palette 

When creating the v2 prototype, we lost my favorite part of the aesthetic: The full cereal palette. Please see the images linked below or ask Sean to message them — they are very important and show how we had kept enough of the terracotta along with the mauve and blue. 

  + Apply balanced use of palette colors through out in groups, right now it is just a whole lot of pink/mauve. 

  ```CSS
    --color-accent-mauve: #C99CAD;
    --color-accent-blue: #8FA9B3;
    --color-accent-terracotta: #C9A68A;
  ```
  
  + Groups example with *stacked trio* of lines making an *upside down pyramid*; longer line at the top and smallest at the bottom  
    - Section breaks or heading emphasis 
      `assets/docs/archive/v2/IMG/AESTHETIC-STACKED-TRIO-1.jpg`
    - Really tangible textured button emphasis 
      `assets/docs/archive/v2/IMG/AESTHETIC-STACKED-TRIO-2.jpg`

### 3. Shift Our Design Concept 

  **Flat with some Sean flare** 

  + We already are fairly flat; let's lean further into the it using our palette 
  + Eliminate current *TRITE* design trends 
    - Because of AI's help, design trends are moving faster than ever 
    - People know what "AI created" design looks like very easily 
    - For example: *Eliminate all uses of gradient* 
    - Any other similar "trends" 

  **We have a good eye — I make trends, not follow them!** 

  + **PRIMARY**: Flat design (but not this palette)
    `assets/docs/archive/v2/IMG/AESTHETIC-FLAT-UI.jpg`

  + **ACCENT USED SPARINGLY**: minimalistic neumorphism 
    - Mix it in very occasionally and SUPER simplified 
    - Button example, but I was thinking maybe tiles, like for the metrics at the top of the page 
      `assets/docs/archive/v2/IMG/AESTHETIC-SUBTLE-NEUMORPHISM-1.jpg` 
    - More simple neumorphism examples 
      `assets/docs/archive/v2/IMG/AESTHETIC-SUBTLE-NEUMORPHISM-2.jpeg`

  + **ACCENT USED SPARINGLY**: minimalist, flat, glass 
    - Again, only to be used occasionally and SUPER simplified
    - Still, NO gradients behind or on the glass; it doesn't have to be this frosted
      `assets/docs/archive/v2/IMG/AESTHETIC-FLAT-MINIMAL-GLASS-1.jpg`
    - See how sharp this UI kept things 
      `assets/docs/archive/v2/IMG/AESTHETIC-FLAT-MINIMAL-GLASS-2.jpg` 

  + **POSSIBLE ACCENT INSPO**: flat block letters 
    - We wouldn't do this more than once 
    - And it is not necessarily suggesting we do the same lettering and angle 
    - This is more like inspiration for something else we could do that brings intrigue to standard flat design 
      `assets/docs/archive/v2/IMG/AESTHETIC-FLAT-BLOCKS.jpg`

---

## Section Feedback 

Numbering corresponds with the component numbering in the "Component Sections (hardcoded layout, dynamic content)" section of the [Update Plan](/assets/docs/archive/v2/v2_UPDATE_2_PLAN.md) document. 

### 1.1-Navbar: `.site-header` Update On **Homepage only**

Clean this up so that we can use my name as the title. 

  + Move the hyperlinks for "Work", "Process", and "About" to the left, replacing "Sean August Horvath" 
    - Remove the name completely only on the homepage navigation 
    - Instead of "Resume" let's have a "Contact" button 

And let's add a bit of an animation to it that feels "smart" in how it shrinks but doesn't disappear completely when the user scrolls down, but then morphs back into a full nav bar as soon as they scroll up. Still fixed the whole time. 

  + Loads with full nav bar showing with classic flat design 
  + User scrolls down and bar transforms 
    - Shifts to our 'minimalist, flat, glass' 
    - Shrinks in size so that it isn't a focus, but just there if someone looks for it 
    - Depending on the animation capabilities, maybe it even glides into a circle that is mostly off the page at the top right or left corner with just an icon on it — sort of like a hamburger menu, but more fun, bringing movement, and still minimalistic in either view 
  + User scrolls up and bar transforms back to normal 
  + User mouses up to minimized icon and it transforms back into normal bar 

### 2.1-Hero: `.hero-stats` Fully Dynamic & Visual Design Update 

These are great, as long as they become clickable and update dynamically. 

  + Clicking should take you to a `section.html` page 
    - Filtered for just the roles 
    - Filtered for just the skills 
    - Or unfiltered showing 'all projects'
  + Updates should happen any time a new JSON is added 
  + Let's add a ~ to the skills count though since there is more overlap there, approximate makes sense 

  •  36 Projects  •  11 Roles  •  ~50 Skills  •

And then this is where I imagined our initial use of minimalistic neumorphism. No hover states. Instead what if when clicked, it was animated to seem like the box tile EXPANDS taking up the whole screen, but really it was justs a transition to the `section.html` page. 

  + Super simplified neumorphism 
    - They can seem like tiles 
    - But should still fit the flat design 
  + Animated, no hover state, but expands when clicked, tasks up screen, acting as page transition 

### 2.2-Hero: `.hero-title` Made Simpler & Static  

Here's where we can put my name instead. 

  > Sean
   > August 
  > Horvath 

  + I'm going to propose a different aspect ratio of images for the `.hero-thumbnail-strip` below 
    - So that it can be two columns but with overlap 
    - Images going under and name (subtitle, buttons) on top 

### 2.3-Hero: `.hero-subtitle` Dynamic & Animated 

Let's make this a value on the project entry JSON. It can rotate through whatever tag or tags are added to the `assets/js/homepage-content.json` document for the `.hero-subtitle` component. And then we'll want to give the animation transition between them special attention. 

  + Animation can't be too simple and smooth moving between subtitles
    - Viewers should know it happens 
    - Make it a bit more fun to watch 
  + Picturing letters that fold/drop down 
    - Like those old time-y alarm clocks 
    - Before they had digital led lighting but wanted to show non-analog time format 
  + Give it a little **DIP** before changing 
    - Pushes down just a handful of pixels before changing 
    - Then comes back up into the line where it started 
    - When it lands where it was before, it can seem like that dip triggered the letters to cascade across showing the new tagline 
  + Pacing can be moderate-slow
    - Let each subtitle stay put for a while since there are so many of them, to feel less chaotic 
    - We don't want user to sit there and try to watch them all 
    - But we also don't want user to try to watch them and it be so long that they get frustrated just trying to watch a few  
    - Maybe we try like 20 seconds or whatever you think 

### 2.4-Hero: `.hero-cta-row` Dynamic Primary Button 

Here's another value to add to the project JSON, let's make the primary button dynamic to show what we want. 

  + For `.btn-primary` 
    - Define what tag(s) to pull from 
    - Put "primary_button_tag" on JSON so that it always makes sense 
    - Put "primary_button_text" on the JSON for total control 

Set what tag(s) should populate the button on the `assets/js/homepage-content.json` document. 

  + For `.btn-secondary`
    - Make this one just "All projects" 
    - Takes the user to the `section.html` page with no filters applied 

### 2.5-Hero: `.hero-thumbnail-strip` -> `.hero-img-strip` Dynamic Engaging Update 

I've added a set of 3 new .webp image files for every single current project entry JSON to their `assets/media/...` directory. We might want to rename the class to eliminate any confusion by using "thumbnail" — we can just call them `.hero-image-strip` 

  + Every project JSON entry is required to have exactly THREE 
  + They are all square 1x1 at 1080px x 1080px 

I think we want it to feel more immersive and engaging. Please see the screenshot of it now. It is important you see the current state to understand why it is a drab problem so that you can help me formulate a new layout. 

  + Current state: `assets/docs/archive/v2/IMG/2.5-SECTION-HERO-IMG-STRIP.jpg` 

I'm imagining tha now they can be large, and take up more than half of the hero. We could add a filter to tone down the fact that they're all different colors — since the users don't click these, it means they are purely for aesthetics, meaning it just needs to give the top of the page a FEELING a MOOD, rather than be functional. 

  + Square images in right column 
    - Over extended into the left column as much as needed 
    - Hero text and buttons layer over top 
  + Images have a filter and shadow layer 
    - Filter just to make them all feel the same color 
    - Shadow layer to ensure tha the flat design hero text and button are legible 

Set what tag(s) should populate the slides on the `assets/js/homepage-content.json` document. 

### 3.1-Showcase: `.showcase .container` Dynamic Featured Product

I'd like this one to be crafted, at least initially 

**CURRENT STATE**: `assets/docs/archive/v2/IMG/3.1-SECTION-SHOWCASE-FEATURED-PRODUCT.jpg`

  + First tag selection for `.showcase .container .landing-heading` can display the tag text, e.g. Web Developer or Website Development 
  + Then now where we have "Web Developer, Graphic Designer, Automation Engineer, Video & Creative" — we'll instead have something like "Webflow, Framer, React/TypeScript, HTML/CSS/JS" so that they toggle through those type of web dev projects 

### 4.1-Credentials:
  + Jobs from Resume
  + But list tags that fit under each 

**CURRENT STATE**: `assets/docs/archive/v2/IMG/4.1-SECTION-CREDENTIALS.jpg`

### 5.1-Process:

**CURRENT STATE**: `assets/docs/archive/v2/IMG/5.1-SECTION-PROCESS.jpg` 

  + I do love the visual that we currently have 
  + I'm struggling to think of how to make dynamic for all JSON projects 
  + But I sort of think we just do it and then in the future when I change it to different tags, I'll just have to make sure whatever those JSON values are that dynamically show in this section are updated to work 
  + What if for now we zoomed in on AI and Automation Implementation, and broke down the process of like assessing needs and creating a plan, implementing it, iterating, etc. 
  + The key being that we'll just have to identify the project JSON entries that are AI and automation related, and then create three copy values on the JSON, and answer all of them different but very similar 
  + This way it can change on every refresh still, but we'll fill things in so that it always works 
  + Actually, ideally it would be cool if, say the first section is idk "assess needs" — and it showed the answer from a handful of different project JSON entries that have AI and automation type tags 
  + The challenge would just be making sure it isn't repetitive by accident 
  + And again, just like almost all the other sections, we'll want to make sure that the blurbs are hyperlinked from the project they came from; so not tags for this one but the actual content going to the actual entry page 

### 6.1-Career Timeline:

**CURRENT STATE**: `assets/docs/archive/v2/IMG/6.1-SECTION-CURRENTLY-CAREER-THREE-PARTER.jpg`

  + Let's keep the "three sections" layout but not do career timeline 
  + Instead, is there a way we can group creative production work into three categories so that I can be showing off lots of social media design, and motion graphics, videos, etc. 
  + And like other sections, we will want to use the actual tags so that each one can be hyperlinked to the section page with that tag applied  

### 7.1-Metrics: 

**CURRENT STATE**: `assets/docs/archive/v2/IMG/7.1-SECTION-METRICS.jpg`

  + Advertising projects 
  + Use metrics, graphs, and charts to show 

### 8.1-FAQ:

**CURRENT STATE**: `assets/docs/archive/v2/IMG/8.1-SECTION-CURRENTLY-FAQ-ACCORDION-DETAILS.jpg`

  + An accomplishment, press hit, or impressive metric instead of a question 
  + Expand the accordion to get the details; context and how it was accomplished 

### 9.1-CTA & Contact: 

  + Probably should add a "Primary CTA Text" on JSON and value for adding tags 
  + And then the second one can be general to all projects 
  + So it could end up something like, "Interested in the projects discussed above?" "Or check out my entire portfolio" 

---

## New JSON Values 

**I only started this list, it is not complete**

  1. Hero Subtitles 
     - This is #3 above 
     - Animation rotates through subtitles in the `.hero-subtitle` class element 
  2. Primary Hero CTA Button Tag 
  3. Primary Hero CTA Button Text 
     - These two are both from #4 above 
     - I think we'll want to keep tabs on the tag and the button text that we use on JSON entries so that we can try to keep consistent as much as possible 
     - Otherwise I'm thinking that this can change on every reload 
     - If we keep tabs and plan them right, most reloads should be the same 
     - Example: If we're featuring "Web Design" work 
  4. Hero Image 1 
     - This and all the Hero Images are all exactly 1080px x 1080px square 
     - Their naming structure mirrors the `thumb-<slug>-#.webp` 
     - Find first at `img-sq-<slug>-1.webp`
  5. Hero Image 1 Alt Text 
  6. Hero Image 2 
     - Find first at `img-sq-<slug>-2.webp`
  7. Hero Image 2 Alt Text 
  8. Hero Image 3 
     - Find first at `img-sq-<slug>-3.webp`
  9. Hero Image 3 Alt Text 


  + ~3-7 `img-mobile-<slug>.webp` no required and not all the exact same size or ratio; need new on-page space for them
  + Optional space for any number of any aspect ratio images; space on page needed 

---

## Testing & Validation 

### Adding More Projects 

  + To really be able to test that all of these new tags work, we need to expand the content. The first and primary collection already entered is web dev projects and then I added all of my Behance entries. 
  + I prepared a guide for having an agent work through a bulk of them. Check it out and let me know if you think it is doable for me to be able to delegate this off: `assets/docs/entries-prep/AGENT_CREATING_ENTRIES.md` 

---