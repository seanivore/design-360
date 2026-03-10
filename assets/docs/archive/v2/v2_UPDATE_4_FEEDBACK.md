# Portfolio Landing Page Mock-Up 

## Overview 

The overhaul simplifies the website structure by removing special tags that created hard sectioning and sub-sectioning. In the update, all tags are created equal so that we have complete dynamic flexibility to populate front page components with whatever tag or combination of tags we choose. Now, the `section.html` template will simply populate with any tag selected by the user. 

### Strategy 

We're looking to create the feeling of SaaS landing pages that people know so well, using the layout and structure to instead display whatever content is needed for my job searching needs at the time. 

### Planning 

The final website architecture does not allow us to preview changes using a local host because of the 404-redirect. As a workaround, we've created a homepage prototype to perfect our planned changes before implementation. 

Using the prototype, we need define exactly what the components in each section of the homepage will look like. 

Every part of the homepage should be dynamic, pulling from whatever JSON files are defined by tags defined in `assets/js/homepage-content.json` to populate that section. This means we need to carefully plan out what type of copy should display where so that we can place the exact same prompt on every single project JSON. 

Once we have that planned, we'll have an updated `assets/docs/_entry_template.json` schema. The final phase will require recreating all the current `assets/entries/...` with the new tag collection, any new JSON values, and then implementing the changes to the homepage to work dynamically. 

### Documentation 

This process is carefully defined in the **Agent development plan** and where we left off is easily identified by the **Agent task list**: 

| Document                                         | Purpose                    |
| ------------------------------------------------ | -------------------------- |
| `assets/docs/archive/v2/v2_UPDATE_1_PITCH.md`    | Landing page pitch         |
| `assets/docs/archive/v2/v2_UPDATE_2_PLAN.md`     | **Agent dev plan**         |
| `assets/docs/archive/v2/v2_UPDATE_3_TASKS.md`    | **Agent task list**        |
| `assets/docs/archive/v2/v2_UPDATE_4_FEEDBACK.md` | Mockup feedback (this doc) |

---

## Status 

The current build is far too heavily about my roles as a whole. Wording like "You do... everything?" in the FAQs is inappropriate and frankly kind of condescending. As pretty as sections like "By the numbers" is, I think we need to be more specifically speaking to groupings of roles. 

We need to be more abstract and less literal — we don't need actual FAQs to use the format of an FAQ section to convey information in a valuable way. 

There is also a need for some visual differentiation in imagery so I've created 3 square 1080px images for every single current `assets/entries/...` JSON in the directory. The file names all start with "img-sq-..." and are located in the `assets/media/...` directory beside each JSON entry's thumbnail slide images. 

### Tag Categories 

We should expand one additional tag group so that things like "website" or "video short" can be easily located and grouped if needed for freelance work or where a job title is less essential. 

  1. Roles — identified based on targets and FastCompany article advice 
  2. Skills — skills that make up various roles with necessary crossover 
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

### Design 

While planning the components, we can consider the current homepage mock-up to be inspirational placeholders, because the next build will be done with intention based on the content we need to display, and must be build mobile first according to best practices. It is easy to make a desktop website look proper, meaning our focus must be on mobile, because its unacceptable to not have that better polished these days. I would skip a candidate if I was hiring someone and their website didn't have great UI/UX on mobile. This first mockup looks straight-up horrible on mobile so we should build our actual components from scratch with this in mind. 

**USE MOBILE BEST PRACTICES**: `/Users/seanivore/Development/360-design/.agent/2026_MOBILE_DESIGN_SPECS.md`

### Job Title Discovery  

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

### My Core Roles 

We need to identify the initial roles that will be displayed to figure out how to create the homepage content sections. I'm going to outline what I most need to have displayed for applying to jobs and getting freelance work, but we should research to find what the actual most commonly used job title terms for right now in time. 

├── Website (product tag)
│   ├── Webflow (skill tag tabs that filter projects)
│   ├── Framer 
│   ├── React/TypeScript 
│   └── HTML/CSS/JS 
├── Graphic Designer (role tag)
│   ├── Digital art  
│   ├── Brand assets
│   ├── Motion graphics 
│   └── Typography  
├── assets
│   ├── docs
│   └── scripts
│       ├── migrate_tags_v4.py
│       ├── new_project.py
│       └── project.sh
├── CNAME
├── entry.html
├── generate_manifest.py
├── index.html


  - Website design and development
  - Digital storefront automations
  - Social media advertising
  - Graphic design solutions 



+ 3 `img-sq-<slug>.webp` 1:1 @ 1080px required, used for front page component display 
+ ~3-7 `img-mobile-<slug>.webp` no required and not all the exact same size or ratio; need new on-page space for them
+ Optional space for any number of any aspect ratio images; space on page needed 

---

+ brand assets, memes, illustration, digital art 


---

### Process 

  1. Identify exactly what to showcase for mom's friends
  2. Identify exactly what jobs I'll be applying for

**Nuance is in the job title, work is in identifying and then gather what best projects to showcase are** 

  3. Write new copy and sections for homepage mockup accordingly
     - These should consist of modular copywriting values
     - Every single project JSON entry should be able to have the same value that the copy comes from



---



## Landing Page Sections 

### 0. `.site-header` — Update nav on **Homepage only**

I want to clean this up so that we can use my name as the title. 

  + Move the hyperlinks for "Work", "Process", and "About" to the left, replacing "Sean August Horvath" 
  + Remove the name completely only on the homepage navigation 
  + Instead of "Resume" let's have a "Contact" button 

### 1. `.hero-stats`

These are great, as long as they become clickable and update dynamically. Clicking should take you to see all that they reference. Updates should happen any time a new JSON is added. 

  •  36 Projects  •  11 Roles  •  50+ Skills  •

### 2. `.hero-title` becomes simpler and static

Here's where we can put my name instead. I'm going to propose a different aspect ratio of images for the `.hero-thumbnail-strip` below, which should make it so that there are sort of two columns in the hero. 

  > Sean
  > August 
  > Horvath 

### 3. `.hero-subtitle` become animated and dynamic pulling from JSON 

What if we make this a value on the project entry JSON and then create an animation that rotates through whatever tag or tags are added to the `assets/js/homepage-content.json` document for the `.hero-subtitle` component. 

The only thing is it needs to not been too simple and smooth moving between them. The viewers should sort of know it happens, and so it should be a bit more fun to watch. I keep picturing letters that fold/drop down sort of like those old time-y alarm clocks that would show digital time but before they had the led lights to show that non-analog time format. 

And maybe before it changes the whole line has a bit of a bounce — or dip rather — down then when it hits back up to the line where it started it seems like that triggered the letters to cascade across to show a new tagline. 

And the pacing can be slow, as in, let them stay put for a while since there are so many of them; we don't really want them to sit there and try to watch them all, but we also don't want it to be so long that if they want to see more than one or a few, they don't get frustrated that it is taking so long. Maybe we try like 20 seconds? Wdyt? 

### 4. `.hero-cta-row`

These can be targeted by categories on JSON. 

  + Projects
  + Resume 
