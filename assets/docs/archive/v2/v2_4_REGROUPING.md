# Update v2.x Landing Page Style Portfolio 
*https://august.style* 

**Created**: 2026-03-16
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
  + Browser View: `file:///Users/seanivore/Development/360-design/landing-prototype.html`

### Basic Next Steps

  1. Review previous planning session and feedback files  
  2. Create consolidated implementation guide `v2_4_IMPL_GUIDE.md`
  3. Ensure implementation guide is exclusively executable 
  4. Update `assets/docs/JSON_ARCHITECTURE.md` for this update 
  5. Handoff guide to agent for implementation 

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
     "credentials": ["Web Developer"],
     "creative": ["Web Developer"],
     "impact": ["Web Developer"]
   }

+ Convert prototype to index: `index.html`
  - Replace hardcoded data with JS that reads `homepage-content.json` tags and pulls from entry JSONs

--- 

## New Field Usage

**Prototype Discovery**: As prototype was built with real data, it has identified exactly what our JSON entry schema needs. The following are the endpoints for the new values being added. I've included an image of that part of the home landing page for reference so that we can create a really strong SOP for future agents filling out the schema. 

  `data.role_headline`: this is the main homepage rotating title
  `data.hero_button_cta`: hero CTA button text 

  `data.skill_summary`: not currently used, but 15-25 words on how skills were used in this project is smart to collect now
  `data.workplace`: only four accurate values: "Freelance", "Silent Labs", "SEANIVORE GROUP", "PETA"
  `data.workplace_title`: irrespective of role tags, this is formal title when employed 
  `data.workplace_dates`: YYYY–YYYY

  `data.process.1_word`: these next few are in the 3-step process section 
  `data.process.1_summary`
  `data.process.1_click`
  `data.process.2_word`
  `data.process.2_summary`
  `data.process.2_click`
  `data.process.3_word`
  `data.process.3_summary`
  `data.process.3_click`

  `data.metric.value`
  `data.metric.kpi`
  `data.metric.context`

  `data.achievement.headline`
  `data.achievement.details`
  
  `data.final_cta_text`: final CTA text 
  `data.final_button_cta`: final CTA button text 

### Field Intelligence 

I was just adding the `data.achievement.headline` and `data.achievement.details` and was going to include it with the handful that aren't required. If we did, but then say someday that project entry's tag was used to populate the "Achievement Section" on the homepage, we can just setup fallbacks right? Like, skip any that are empty or null. And then if there aren't any at all, well we'd want to know so that we can change what tags are used for that section, or maybe less tags need to be used. 

If that makes sense, we might want to do the same for the metrics. That way it is like we're cutting out noise for more signal. Everything will look better because there isn't anything added just to fill in gaps. 

Seems like we should be okay with the `data.process` values but hey, maybe all of them it would be smart to have a fallback setup for — CTA button text included. 

### Tagging Intelligence 

When applying tags to populate landing page components, default to the value accepting **ANY PART** of the tag. For example, if we have a tag of "Web Developer" and we want to populate the "Web" section, we should be able to use "Web" as the value. 

However, we should be able to indicate if we want **EXACTLY** a tag by including that "exactly" modifier. Taking into account the formatting of the JSON text and how it needs to be rendered for the frontend, of course. 

### Fields Needing Update

See how I have simplified the tags: `assets/entries/uid-gcp-491.json` 

I've also flattened and shortened a lot of the keys. In every case I listed the old mapped key value in the comments with an arrow to what it has been changed to. Then pasted directly below this schema is the previous version. If this is over-complicating things then NBD we can just add the new values. I just remember when putting this together the agent very frequently assumes things are at the base when they weren't, and they had quite a few levels before, but since we know the use purpose it is probably fine not to do that if we don't want to — correct me if I'm wrong! 

I also left off the "required" value, but these are the only values that can be skipped, and only out of necessity: 

| Not *Required* JSON Value   | Why can it be skipped?                          |
| --------------------------- | ----------------------------------------------- |
| `data.media_url`            | Video or other URL; maybe NFT for example       |
| `data.media_embed`          | Any URL inclusion should always have an embed   |
| `data.media_alt`            | We have alt text for every media type           |
| `data.mobile_img`           | Only apps or websites with strong mobile images |
| `data.mobile_img_alt`       | Skipped if there are no mobile images           |
| `data.origin_url`           | Should ALMOST ALWAYS find SOMETHING to link to  |
| `data.origin_url_text`      | Pretty URL instead of scrambled characters      |
| `data.repository`           | Link to a repository if it exists               |
| `data.achievement.headline` | Only the best for good noise to signal ratio    |
| `data.achievement.details`  | Must be included with headline                  |

#### New Schema

```json 
{
  "_metadata": {
    "template": "project_entry",
    "version": "v5.0",
    "changed": "2026-03-15T16:18:00.000000Z",
    "update": "landing page update, added values, updated tags and grouping, removed sectioning"
  },
  "id": "uid-gcp-491", # `data.categorization.entry_id` -> `data.id`
  "slug": "fashion-ai-video", # `data.categorization.slug` -> `data.slug`
  "hero_btn_cta": "See Web Projects", # new field -> `data.hero_btn_cta`
  "final_cta_text": "Interested in web development?",
  "final_btn_cta": "See All Web Projects", # new field -> `data.final_btn_cta`
  "role_headline": "", # new field -> `data.role_headline`
  "role": [
    "Brand Designer",
    "Content Strategist",
    "Social Media Manager",
    "Video Editor"
  ], # `data.categorization.tags.role` -> `data.role`
  "skill": [
    "Adobe",
    "After Effects",
    "Art Direction",
    "Content Production",
    "DaVinci Resolve",
    "Editorial Design",
    "Generative AI",
    "Illustration",
    "Layout Design",
    "Motion Graphics",
    "System Design",
    "Scaling",
    "Video Production"
  ], # `data.categorization.tags.skill` -> `data.skill`
  "skill_summary": "", # new field -> `data.skill_summary`
  "product": [
    "Video Short",
    "Digital Art",
    "Social Content"
  ], # new value -> `data.product`
  "workplace": {
    "company": "Freelance", # new value -> `data.workplace.company`
    "title": "", # new value -> `data.workplace.title`
    "dates": "" # new value -> `data.workplace.dates`
  },
  "media_url": "", # `data.content.media.video_url` -> `data.media_url`
  "media_embed": "", # `data.content.media.video_embed` -> `data.media_embed`
  "media_alt": "", # `data.content.media.video_alt_text` -> `data.media_alt`
  "thumb": [], # `data.content.media.thumbnail_images` -> `data.thumb`
  "thumb_alt": "", # `data.content.media.thumb_slideshow_alt_text` -> `data.thumb_alt`
  "img": [], # `data.content.media.page_imagery` -> `data.img`
  "img_alt": "", # `data.content.media.page_image_group_alt_text` -> `data.img_alt`
  "mobile_img": [], # new field -> `data.mobile_img`
  "mobile_img_alt": "", # new field -> `data.mobile_img_alt`
  "origin_url": "", # `data.content.assets.project_url` -> `data.origin_url`
  "origin_url_text": "", # `data.content.assets.project_url_text` -> `data.origin_url_text`
  "repository": "", # `data.content.assets.github_repository` -> `data.repository`
  "seo_title":, # `data.content.teaser_copy.seo_title` -> `data.seo_title`
  "seo_description":, # `data.content.teaser_copy.seo_description` -> `data.seo_description`
  "title":, # `data.content.teaser_copy.page_title` -> `data.title`
  "subtitle":, # `data.content.teaser_copy.page_subtitle` -> `data.subtitle`
  "tiles": [], # `data.content.teaser_copy.tile_text` -> `data.tiles`
  "pattern":, # `data.content.page_copy.pattern` -> `data.pattern` ... this feels like it should be rewritten as problem [statement]
  "action":, # `data.content.page_copy.action` -> `data.action` ... solution or action I don't mind here, but content of pattern needs rewriting 
  "result":, # `data.content.page_copy.measured` -> `data.result` ... measured was just confusing 
  "process": {
    "1_word": "access",
    "1_summary": "Audit existing workflows, identify manual bottlenecks, and map where AI tooling or custom automation will deliver the highest leverage.",
    "1_click": "→ 800-Product AI Storefront",
    "2_word": "implement",
    "2_summary": "Build iteratively — custom scripts, AI-generated SERP descriptions, Webflow storefronts connected to inventory APIs. Ship early, validate with real traffic.",
    "2_click": "→ SaaS Conversion Flow",
    "3_word": "iterate",
    "3_summary": "Monitor performance, A/B test conversion paths, continuously refine. The goal: a system that runs autonomously, not a one-time build.",
    "3_click": "→ Data Dashboard"
  },
  "metric": {
    "value": "$0.003",
    "kpi": "Cost Per Engagement",
    "context": "Social ad campaign with custom art"
  },
  "achievement": {
    "headline": "What What It — What Was Impressive",
    "details": "It was this because this. We did created a thing by combining these two smart things."
  }
}
```

#### Old Schema

Please see the actual template here for directions and explanation on all the original values: `assets/docs/_entry_template.json`

```json
{
  "_metadata": {
    "last_updated": "2026-03-15T16:18:00.000000Z",
    "required_fields": true,
    "template_type": "portfolio_entry",
    "schema_version": "5.0",
    "schema_update": "Revamp for landing page update, added values, updated tags and grouping, removed sectioning"
  },
  "categorization": {
    "entry_id": "uid-gcp-491",
    "slug": "fashion-ai-video",
    "tags": {
      "role": [
        "Brand Designer",
        "Content Strategist",
        "Social Media Manager",
        "Video Editor"
      ],
      "skill": [
        "Adobe Firefly",
        "After Effects",
        "Art Direction",
        "CapCut",
        "Content Production",
        "DaVinci Resolve",
        "Editorial Design",
        "Generative AI",
        "Illustration",
        "Lightroom",
        "Lookbook Design",
        "Motion Graphics",
        "Photography",
        "Photoshop",
        "Publishing",
        "Scaling Systems",
        "Video Production"
      ]
    }
  },
  "content": {
    "media": {
      "video_filename": "",
      "video_url": "",
      "video_embed": "<iframe src='https://www.behance.net/embed/project/215002031?ilo0=1' width='560' height='438' frameborder='0' allow='clipboard-write; fullscreen' allowfullscreen></iframe>",
      "video_alt_text": "Avant garde fashion lookbook clips where still images are transformed into moving sequences: editorial poses, surreal desert palettes, and animated camera moves.",
      "thumbnail_images": [
        "assets/media/fashion-ai-video/thumb-fashion-ai-video-1.webp",
        "assets/media/fashion-ai-video/thumb-fashion-ai-video-2.webp",
        "assets/media/fashion-ai-video/thumb-fashion-ai-video-3.webp",
        "assets/media/fashion-ai-video/thumb-fashion-ai-video-4.webp",
        "assets/media/fashion-ai-video/thumb-fashion-ai-video-5.webp",
        "assets/media/fashion-ai-video/thumb-fashion-ai-video-6.webp"
      ],
      "thumb_slideshow_alt_text": "Editorial fashion stills with surreal desert vibes, animated into motion with parallax, camera moves, and subtle effects.",
      "page_imagery": [],
      "page_image_group_alt_text": ""
    },
    "assets": {
      "project_url_text": "behance.net/gallery/Video-Fashion",
      "project_url": "https://www.behance.net/gallery/215002031/Curated-Avant-Garde-Fashion-Lookbook",
      "github_repository": ""
    },
    "teaser_copy": {
      "seo_title": "Surrealism Avant Garde Fashion Lookbook: Editorial Stills Transformed Into Motion",
      "seo_description": "A generative fashion lookbook that turns editorial stills into moving images with surreal desert palettes, parallax, and cinematic camera moves for platform ready clips.",
      "page_title": "Curated Avant Garde Fashion Lookbook",
      "page_subtitle": "Editorial fashion stills animated into motion with surreal desert vibes.",
      "tile_text": [
        "Editorial stills reimagined as motion",
        "Surreal desert palettes and cinematic flow",
        "Platform ready clips for social and launch"
      ]
    },
    "page_copy": {
      "pattern": "Surreal fashion editorial embraces bold styling, color forward palettes, and atmospheric settings that carry through both still and motion formats.",
      "action": "Selected hero stills were animated into motion with parallax, camera moves, and subtle effect passes, then cut to platform native formats with clean pacing and rhythm.",
      "measured": "Delivers scroll stopping clips and cohesive lookbook sequences suitable for social, launch campaigns, and provenance linked digital editions."
    }
  }
}
```

### Mapping Fields

Well, the chart below started out making sense. I think it still does, it is just excessively granular, covering classes that you would obviously know which JSON entry to pull from because of the initial component tag filtering (if applicable), though in some cases you would need to know exactly which text or image to pull off of the JSON entry. So perhaps it is just the "Tag Filtering" column that makes it seem more confusing than it actually is — but I guess you'll just have to pause if it doesn't make any sense. We do need ot take it from here and simplify for the [homepage content identifier file](/assets/js/homepage-content.json). 

#### JSON Value Per Component Class 

| Component Class                                | Mapped JSON Value                         | Tag Filtering                                   |
| ---------------------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| `.hero-stats .stat-number` above "Projects"    | Count `data.id` values                    | None                                            |
| `.hero-stats .stat-number` above "Roles"       | Count `data.role` values                  | None                                            |
| `.hero-stats .stat-number` above "Skills"      | Count `data.skill` values                 | None                                            |
| Top-level of `.hero-scroll-wrapper` section    | `data.x` filtered by tag                  | Yes, user identified X tag                      |
| `.hero-visual .hero-img-scroll` image sources  | `data.img` value                          | Yes, one value of `.hero-scroll-wrapper` filter |
| `.hero-img-scroll alt` text                    | `data.img_alt` value                      | Yes, sync with `.hero-visual`                   |
| `.flip-headline .flip-item` text value         | `data.role_headline` values               | Yes, sync with `.hero-visual`                   |
| `.hero-cta .btn-primary` text value            | `data.hero_btn_cta` value                 | Yes, sync with `.hero-visual`                   |
| Top-level of `.showcase` section               | `data.x` filtered by value                | Yes, user identified X tag                      |
| `.showcase .section-heading` H2 text           | `data.x` value of tag                     | Yes, sync with `.showcase`                      |
| `.showcase-tabs tablist` `.tab-btn data-tab`   | `data.x` value of tag(s)                  | Yes, applied 'AND' `.showcase`                  |
| `.project-card img` image sources              | `data.thumb` values                       | Yes, one value of `.showcase-tabs` filter       |
| `.project-card img alt` text                   | `data.thumb_alt` values                   | Yes, sync with `.project-card` results          |
| `.project-card-title` text value               | `data.title` values                       | Yes, sync with `.project-card` results          |
| `.project-card-tags tag` text values           | `data.x` value of tag(s)                  | Yes, identify beside `.project-card`            |
| Top-level of `.credentials` section            | No filter, show all                       | None                                            |
| `.credentials .cred-company` text value        | `data.workplace.company` value            | Yes, one value of `.credentials` filter         |
| `.credentials .cred-dates` text value          | `data.workplace.dates` value              | Yes, sync with `.cred-company`                  |
| `.credentials .cred-role` text value           | `data.workplace.title` value              | Yes, sync with `.cred-company`                  |
| `.credentials .cred-tags tag` text value       | `data.x` value of tag(s)                  | Yes, identify beside `.cred-company`            |
| Top-level of `.process` section                | `data.x` filtered by value                | Yes, user identified X tag                      |
| `.process .section-heading` H2 text            | `data.x` value of tag                     | Yes, one value of `.process` filter             |
| `.process-num` "01" `.process-card-title` text | `data.process.1_word` value               | Yes, sync with `.process .section-heading`      |
| `.process-num` "01" `.process-card-body` text  | `data.process.1_summary` value            | Yes, sync with `.process .section-heading`      |
| `.process-num` "01" `.process-source` text     | `data.process.1_click` value              | Yes, sync with `.process .section-heading`      |
| `.process-num` "02" `.process-card-title` text | `data.process.2_word` value               | Yes, sync with `.process .section-heading`      |
| `.process-num` "02" `.process-card-body` text  | `data.process.2_summary` value            | Yes, sync with `.process .section-heading`      |
| `.process-num` "02" `.process-source` text     | `data.process.2_click` value              | Yes, sync with `.process .section-heading`      |
| `.process-num` "03" `.process-card-title` text | `data.process.3_word` value               | Yes, sync with `.process .section-heading`      |
| `.process-num` "03" `.process-card-body` text  | `data.process.3_summary` value            | Yes, sync with `.process .section-heading`      |
| `.process-num` "03" `.process-source` text     | `data.process.3_click` value              | Yes, sync with `.process .section-heading`      |
| Top-level of `.creative` section               | `data.product` filtered by value          | Yes, `production`                               |
| `.creative .section-heading` H2 text           | `data.product` `production` value         | Yes, sync with `.creative`                      |
| `.creative-card .sr-d1` href                   | `/section.html?tags=` `data.x` tag        | Yes, identify beside `.creative`                |
| `creative-card sr sr-d1 vis` image source      | `data.img` value                          | Yes, sync with `.creative-card .sr-d1`          |
| `creative-card sr sr-d1 vis alt` text          | `data.img_alt` value                      | Yes, sync with `.creative-card .sr-d1`          |
| `.creative-card .sr-d2` href                   | `/section.html?tags=` `data.x` tag        | Yes, identify beside `.creative`                |
| `creative-card sr sr-d2 vis` image source      | `data.img` value                          | Yes, sync with `.creative-card .sr-d2`          |
| `creative-card sr sr-d2 vis alt` text          | `data.img_alt` value                      | Yes, sync with `.creative-card .sr-d2`          |
| `.creative-card .sr-d3` href                   | `/section.html?tags=` `data.x` tag        | Yes, identify beside `.creative`                |
| `creative-card sr sr-d3 vis` image source      | `data.img` value                          | Yes, sync with `.creative-card .sr-d3`          |
| `creative-card sr sr-d3 vis alt` text          | `data.img_alt` value                      | Yes, sync with `.creative-card .sr-d3`          |
| `.creative-card .sr-d(n)` href                 | `/section.html?tags=` `data.x` tag        | Yes, identify beside `.creative`                |
| `creative-card sr sr-d(n) vis` image source    | `data.img` value                          | Yes, sync with `.creative-card .sr-d(n)`        |
| `creative-card sr sr-d(n) vis alt` text        | `data.img_alt` value                      | Yes, sync with `.creative-card .sr-d(n)`        |
| `.creative-label` text                         | `data.product` value                      | Yes, sync with `.creative-card .sr-d(n)`        |
| `.creative-card-title` text                    | `data.skill` value                        | Yes, sync with `.creative-card .sr-d(n)`        |
| Top-level of `.impact` section                 | `data.skill` filtered by value            | Yes, `advertising`                              |
| `.impact .section-heading` H2 text             | `data.skill` `advertising` "Impact" value | Yes, sync with `.impact`                        |
| `impact-stat sr sr-d(n) vis` values            | `data.skill` `advertising` values         | Yes, sync with `.impact`                        |
| `.impact-num` text value                       | `data.metric.value` value                 | Yes, sync with `.impact-stat sr sr-d(n) vis`    |
| `.impact-label` text value                     | `data.metric.kpi` value                   | Yes, sync with `.impact-stat sr sr-d(n) vis`    |
| `.impact-detail` text value                    | `data.metric.context` value               | Yes, sync with `.impact-stat sr sr-d(n) vis`    |
| Top-level of `.achievements` section           | `data.skill` filtered by value            | Yes                                             |
| `.achievements .section-heading` H2 text       | `data.skill` `data.x` text "Achievements" | Yes, sync with `.achievements`                  |
| `.ach-title` text value                        | `data.achievement.headline` text          | Yes, one value after `.achievements` filter     |
| `.ach-body` text value                         | `data.achievement.details` text           | Yes, sync with `.ach-title`                     |
| Top-level of `.cta-section` section            | `data.x` filtered by tag                  | Yes                                             |
| `.cta-heading` text                            | `data.final_cta_text` value               | Yes, sync with `.cta-section`                   |
| `.cta-btns .btn-primary` text                  | `data.final_button_cta` value             | Yes, sync with `.cta-section`                   |

#### Homepage Content By Tag

**Tag controller `assets/js/homepage-content.json` document** 

I didn't finish thinking though mine. I think that this is the kind of task that would make sense for you to share yours before seeing mind so that we can better evaluate the best system. Mine is sort of clunky but direct. Only after providing yours, then you may read the following path. 

Then whichever we choose, or combination we create, we'll have to make sure that it is not missing anything, and then is perfectly implemented in the homepage controller. 

MINE: `assets/docs/archive/v2/draft.json`

---

## Project Entry JSON Files

Updating the old and creating new portfolio entries. 

### Update Process 

**There are already ~35 entries in the directory: `assets/entries/...`**

Because so much time has passed and agents have gotten much better at writing, I think the cleanest way for us to do this would be to just have an agent create new files for all the currently existing JSON project entries. They could then continue on the list of other projects to create entries for. 
  
  1. Keep us consistent 
  2. Create a collection of used tags as they go to avoid plural duplicates
  3. Use the same simplicity and logic when creating tags 

I don't think we did amazingly with the tag creation in the original entries so this would give us the opportunity to not only improve on that, but make sure that at least these initial entries will all perfectly fit all the necessary placements. 

### 1. Create New Entry File

```bash
project
# Created project file: assets/docs/uid-jcw-174.json
# Entry ID: uid-jcw-174
```

There are full directions here as well, but I just checked and it works on my system: `assets/docs/JSON_ARCHITECTURE.md`

It might need to be installed again because it is supposed to pull directly from `assets/docs/_entry_template.json` but I just used the command and it says the wrong version schema at the top. 

### 2. Create New JSON Entry 

Pull the next of the 36 current project entry JSON files. Write it in the new schema by creating an entirely new JSON document and filling in the schema. 

### 3. Record Tag Usage 

As you go, keep a running list of all tags used in the `assets/docs/tags.json` file. This will help us keep track of all the tags that are being used and make sure that we are not using the same conceptual tag but differently worded tag. No additional "company" tags may be created. 

```json 
{
  "role": [],
  "skill": [], 
  "product": [], 
  "company": [
    "Freelance", 
    "Silent Labs",
    "SEANIVORE GROUP LLC",
    "PETA, Inc."
  ]
}
```

### 4. **SEAN DID NOT COMPLETE**

---

## Verification After Update

### Automated

  - JSON validation script (all entries have slug, role[], skill[], no old keys)
  - Manifest regeneration check (all slugs unique, flat)

### Manual (Local)

  - Landing page: all components render, tabs switch, responsive at 375px
  - Tag page: `?tags=Web+Developer` shows correct projects, pills filter
  - Entry page: tag pills render, no breadcrumbs, content loads

### Live (GitHub Pages)

  - `august.style/slug` → entry loads via 404 routing
  - Old URLs → graceful fallback
  - All device tests

---
*This document is intended to provide a starting place for many of the specifics. Be sure that we address every specific and push our thinking far enough to create our 'exclusively executable implementation guide' by creating plans for me to review thoroughly before proceeding. 2026-03-15*