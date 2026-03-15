# Update v2.x Landing Page Style Portfolio 
*https://august.style* 

**Created**: 2026-03-15
**Version**: v2.4
**Status**: Prototype Complete

---

## Overview

We need to REGROUP. The prototype is solid. We have had a handful of planning documents. Things need to be consolidated and organized into a single, executable implementation guide. This document is the starting orchestration of that effort.

## Update Summary

This update requires building a landing page style homepage for our modular, JSON-driven, dynamically populated portfolio that gives control to each component's content via tags. 

### Update Vision

Change the tags listed for each component based on the job opening the same way a resume is tailored to a specific job. The homepage will *feel* like it was made for the hiring manager reading it. 

### Architecture Changes

[Website architecture before update](/assets/docs/JSON_ARCHITECTURE.md)

  + **New tags**: grouping is for admin organization only; all tags are treated equally in the build
    - `role` (job titles)
    - `skill` (capabilities, tools)
    - `product` (what was produced for the job or client)
    - No industry tags to avoid pigeonholing 
  + **Change URLs to be flat**: `/{slug}` instead of `/{section}/{sub_section}/{slug}` — breaks old URLs
  + **Control homepage content via tags on `homepage-content.json`**: tags only — each key is a component, each value is tag array(s)
  + **Landing page layout**: components are hardcoded in HTML 
    - Populated dynamically by tags
    - Just like [section.html](/section.html) 
    - Just like [entry.html](/entry.html)
  + **JSON schema update**: extended with new copy fields discovered through prototyping, updating [_entry_template.json](/assets/docs/_entry_template.json)

### Our Prototype-First Process

  1. Build a standalone wireframe HTML with real data 
  2. Iterate and perfect the design and content 
  3. "Template-ize" or identify new JSON entry values required 
  4. Update JSON entries 
     - New tags 
     - Additional values 
  5. Create `homepage-content.json` listing components and each value is a tag array
  6. Build new landing page with components 
  7. Wire them up to the JSON object values 
  8. Push new entries for manifest update and dynamic functionality just like the rest of the site already works 

---

## Current State

The prototype is built and has gone through a few rounds of revisions. The current version requires some fixes with the animation and timing that will best be addressed during this assessment planning session.

  + [Land page prototype file](/landing-prototype.html)
  + Browser View: file:///Users/seanivore/Development/360-design/landing-prototype.html

### Basic Next Steps

  1. Review previous planning session and feedback files  
  2. Create consolidated implementation guide `v2_4_IMPL_GUIDE.md`
  3. Ensure implementation guide is exclusively executable 
  4. Handoff guide to agent for implementation 

| Purpose               | File                                         |
| --------------------- | -------------------------------------------- |
| Session v2.0 planning | `assets/docs/archive/v2/v2_0_UPDATE_PLAN.md` |
| Feedback round        | `assets/docs/archive/v2/v2_0_FEEDBACK.md`    |
| Session v2.1 planning | `assets/docs/archive/v2/v2_1_UPDATE_PLAN.md` |
| Feedback round        | `assets/docs/archive/v2/v2_1_FEEDBACK.md`    |
| Session v2.2 planning | `assets/docs/archive/v2/v2_2_UPDATE_PLAN.md` |
| Feedback round        | `assets/docs/archive/v2/v2_2_FEEDBACK.md`    |
| Session v2.3 planning | `assets/docs/archive/v2/v2_3_UPDATE_PLAN.md` |
| **This document**     | `assets/docs/archive/v2/v2_4_REGROUPING.md`  |

  + Session v2.0 — overview of changes needed; prototype v1 created 
  + Session v2.1 — implemented design changes; finalized component content 
  + Session v2.2 — cleaned up design system; implemented animations 
  + Session v2.3 — cleaned up animations; fixed breaking bugs 

In review, the *v2_0_ document* will illustrate full scope of the update, *v2_1_* identifies component content, *v2_2_* cleans up a new design system, and *v2_3_* breaks down the mostly-polished animation system. 

### Didn't Complete During Prototype Reviews

  - No schema changes to [_entry_template.json](/assets/docs/_entry_template.json)
  - No updates to existing JSON entries
  - No `landing-controller.js` or dynamic wiring
  - No [data-loader.js](/assets/js/data-loader.js) AND/OR filtering
  - No resumes, LinkedIn copy, or new entries
  - No fixing the broken build (noted for later)

### File "Updates" Needing Review

**Files listed as updated in "Phase 1: Tag System & Foundation" needs thorough review** 

This was done before prototype and before we even settled on the final types of tags to use. I tried to list the updates specifically made here myself, but it just made me really confused as to what the checklist was actually for. 

I added in the sub-bullet points, things to check or changes that have yet to be made when confirming if initial changes were accurately made. 

**We shouldn't assume any proper updates have been done or have been done accurately**

  + Migrate old tags using Python script: `assets/entries/uid-*.json`
    - These tags from before will then need to be reviewed for quality 
    - We also probably need to simplify and remove overlap 
    - Previously we used so many tags that it was almost less helpful in some places 
  + Needs final updates: [_entry_template.json](/assets/docs/_entry_template.json)
  + Needs new filtering functions: [data-loader.js](/assets/js/data-loader.js)
  + Need to regenerate the flat slug keys: [manifest.json](/assets/js/manifest.json)
  + Must route new flat URLs: [404.html](/404.html)
  + Should populate for ANY tag: [section.html](/section.html)
    - We need to modernize the tag filtering 
    - Use something recognizable from shadcn 
    - Type of functionality people expect from navigating Shopify stores 
    - They should be able to easily apply and remove as many tags as they want 
    - When clicking through to this page from any tag, it should be immediately obvious that that tag is applied 
    - When clicking through to this page from a tag anywhere, they should be able to remove that tag 
    - This is the same page that should load for "all projects" which is just no tags applied 
    - Future consideration: Quick grouping button that creates tabs for the most used tags of any content, for example if the user had clicked through from Web Development and it was a bunch of web development tagged projects, they could hit a button that says "Top Groups" or "Organize" and they'd instantly be able to explore the group of projects tagged with Webflow, or VanillaJS, or React, etc.
    - OH, we also need a forth tag group so that every project can be directly attributed to a workplace 
  + Should have section/subsection logic removed: [section-controller.js](/assets/js/section-controller.js)
  + Needs to have simplified tag toggling: [filter-controller.js](/assets/js/filter-controller.js)
    - See notes under the "section.html" file above 
  + Must remove breadcrumbs and add tag pills: [entry.html](/entry.html)
    - There is also a "Role" section on the page laid out just like the other major page sections talking about the project that must be handled 
    - I'm thinking this can just be a list of functional tags to Roles the project is tagged with 
    - And then we'll just design it so that, visually, it isn't as prominent as the three main page sections 
    - Would make sense to then have a "skills and more" section, that is near roles, and then the "Product" is probably just "other tags" or maybe we think of a heading so that they can be grouped in with Skills; and hell, if that doesn't work then we'll just have all the tags in one cloud and won't differentiate type since we originally said that was for backend planning only, but when said what was actually meant was just that, functionally, they would be all treated the exact same; because grouping for user might be helpful — particularly considering we'll be adding a "workplace" tag group so that resume experience entries and be directly tied to projects because that feels hugely important 
  + Add tag display and flat path handling: [entry-controller.js](/assets/js/entry-controller.js)
  + Needs to now use the flat slugs: [tile-renderer.js](/assets/js/tile-renderer.js)
    - FYI these currently display on the "section" pages (now just tag pages or "all projects") 
    - They also are what is used on the bottom of entries for the related content 
    - They were used on the homepage but obviously are not any more 
  + Should have tag pills styles and removed breadcrumbs, more to come: [styles.css](/styles.css)
    - Unless it creates a mess and we end up wanting to keep the styles for the homepage separate like they are in the prototype 
    - Not ideal but right now presentable is the primary goal 
  + DELETED old tag content featuring tool: [placement.json](/assets/js/placement.json)
    - This is how we used to feature content using tags 
    - Now we'll do it in the homepage components using `homepage-content.json`

### Files To Update 

**We will now be preparing the actual schema update having finished the prototype; to avoid confusion we will call it v5.0 Schema**

| Change                         | File                                                        |
| ------------------------------ | ----------------------------------------------------------- |
| Add discovered fields          | [_entry_template.json](/assets/docs/_entry_template.json)   |
| Fill in new tags & fields      | `assets/entries/uid-*.json`                                 |
| Create for dynamic control     | [homepage-content.json](/assets/js/homepage-content.json)   |
| **Convert** prototype to index | [index.html](/index.html)                                   |
| Create to drive new components | [landing-controller.js](/assets/js/landing-controller.js)   |
| Delete old controller          | [homepage-controller.js](/assets/js/homepage-controller.js) |
| Update styles                  | [styles.css](/styles.css)                                   |
| Put in v2 archive              | `landing-prototype.html`                                    |


+ Create for dynamic control: `homepage-content.json`
  - Should resemble this but with the actual tags we decide to use, and we need a method to identify "TAG_A AND TAG_B" versus "TAG_A OR TAG_B" etc. as well as secondary layers of tags, like how the tabs "HTML" and "Webflow" are used in the showcase of "Websites". 

   ```json
   {
     "hero": ["Web Developer", "Graphic Designer", "Video Editor"],
     "showcase": [
       ["Web Developer"],
       ["Graphic Designer"],
       ["Video Editor"],
       ["Content Strategist"]
     ],
     "outcome_grid": ["Web Developer"],
     "approach_cards": ["Web Developer"]
   }

+ Convert prototype to index: `index.html`
  - Replace hardcoded data with JS that reads `homepage-content.json` tags and pulls from entry JSONs

### Verification After Update

#### Automated

  - JSON validation script (all entries have slug, role[], skill[], no old keys)
  - Manifest regeneration check (all slugs unique, flat)

#### Manual (Local)

  - Landing page: all components render, tabs switch, responsive at 375px
  - Tag page: `?tags=Web+Developer` shows correct projects, pills filter
  - Entry page: tag pills render, no breadcrumbs, content loads

#### Live (GitHub Pages)

  - `august.style/slug` → entry loads via 404 routing
  - Old URLs → graceful fallback
  - All device tests

--- 

## Prototype Discovery 

As prototype was built with real data, it has identified exactly what our JSON entry schema needs. 

### New Fields Discovered

