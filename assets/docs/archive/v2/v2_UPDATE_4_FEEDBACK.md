# Portfolio Landing Page Mock-Up 

**Created**: 2026-03-10 
**Version**: v0.1 

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

| Purpose                    | Document                                         |
| -------------------------- | ------------------------------------------------ |
| Landing page pitch         | `assets/docs/archive/v2/v2_UPDATE_1_PITCH.md`    |
| **Agent dev plan**         | `assets/docs/archive/v2/v2_UPDATE_2_PLAN.md`     |
| **Agent task list**        | `assets/docs/archive/v2/v2_UPDATE_3_TASKS.md`    |
| Mockup feedback (this doc) | `assets/docs/archive/v2/v2_UPDATE_4_FEEDBACK.md` |

---

## Tag Categories 

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

  > We should apply this mentality to the job titles we use. 

---

## Landing Page Content 

Homepage components can be modified by applying tags on `assets/js/homepage-content.json` that populate: 

  1. All entries that have a **SINGLE TAG**
  2. All entries that have **EITHER TAG-A *OR* TAG-B**
  3. All entries that have **BOTH TAG-A *AND* TAG-B** 

Or any combination thereof. This functionality is to be the same on the our `section.html` pages, where we'll need to modernize the UI for filtering. Ideas for how to present content in components will be included in the [Landing Page Sections](#landing-page-sections) below. 

### What To Showcase 

  1. Building Websites
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

### New JSON Values 

  + 3 `img-sq-<slug>.webp` 1:1 @ 1080px required, used for front page component display 
  + ~3-7 `img-mobile-<slug>.webp` no required and not all the exact same size or ratio; need new on-page space for them
  + Optional space for any number of any aspect ratio images; space on page needed 

---

## Landing Page Sections 

### 0. `.site-header`: Update nav on **Homepage only**

Clean this up so that we can use my name as the title. 

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

  + For `.btn-primary` 
    - Define what tag(s) to pull from 
  + For `.btn-secondary`

  + Projects
  + Resume 
