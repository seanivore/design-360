# 360 Design Portfolio v2.0.0 Update 
`www.august.style`

**Updated**: 02-20-2026 
**Version**: v2.0 
**Status**: Planning 

---

## Summary 

The **SaaS "SEAN as a SOLUTION" Landingpage Update** is both a functional and conceptual reorganization of my portfolio's project presentation intended to pull hiring managers, companies, and potential freelance clients directly to the information most meant for them, by creating standard 'landingpage' components that are dynamically populated by multi-tag selections on an easily updated JSON file. 

### Objectives 

  1. Revamp tagging for content placement system 
     - Turn this document into the exclusively executable implementation plan 
     - Plan *EVERY* detail, answer all questions, leave no stone unturned/unplanned 
  2. Create next large batch of project JSONs
  3. Design new landingpage-style homepage, make all other changes 
     - Follow the implementation plan 
     - Get new system set up 
  4. Update documentation 

---

## Using Tags for Content Placement

**Architecture and other important details**: `assets/docs/archive/v1/JSON_ARCHITECTURE.md` 

### Current System 

**An almost modular design that was manipulated for needs**

  - We have "section" tiles on the homepage that ideally should be "anything" tiles 
  - "Projects" is hardcoded to display after 'section' tag on homepage tiles and 'section' page temlates 
  - Confusing differentiation and logic for how tags load differently in the section page template
  - Only the 'project page template' is functionally modular, though needs some design changes

### Improved System 

**Simplified, all-tags-created-equal, fully modular design system**

  1. Project page template breadcrumbs VS *hierarchal tag display* 
     - Present tag display as an alternative solution for breadcrumbs
     - Move grouping hierarchy concept to carefully identified tag types which is looser 

  2. Homepage section tiles VS *landingpage components*
     - Homepage component, or 'landingpage' sections, dynamically populate from selecting any combination of tags
     - Current 'tiles' repurposed into one of handful of landingpage components
     - Component sections created following best practices `assets/docs/archive/v2/anatomy-high-converting-saas-landing-page.jpg`

  3. 'Section pages' VS *all-purpose tag page template*
     - There are no sections or subsections
     - Instead the section page template is identical for **any** tag selected anywhere 

  4. Confusing 'placement' and 'toggle tags' VS *multi-tag, JSON-controlled components*
     - All of the home/landingpage sections are components that you can plug in 1 or any number of tags to dynamically populate
     - Remove confusing `assets/js/placement.json`
     - Create simple, straight-forward `assets/js/homepage-content.json` 

---

## Revamping Tagging System 

### Process  

  1. Pull all tags and tag-types from all `assets/entries/**.json` files
     - Create script `assets/docs/archive/v2/gather-current-tags.sh` or `.py` to do it quickly
     - Place them all in same working directory for v2 `assets/docs/archive/v2/TAG_COLLECTION.md` or `.json` 
     - Schema of all entries should help create script `assets/docs/_entry_template.json`
  2. Compare and review collection of job and resume `assets/docs/archive/v2/RESUME_DETAILS.md` details
     - Pull new tags, organize list as needed
     - Current job focus is on low hanging fruit, most compatible, tested and detailed roles
     - For example: Social Media Designer and Web Designer are two where I have solid experience on paper and visuals in portfolio
     - Important tags; we will have cool shadcn dropdown that changes the collection of projects by selected role or service 
  3. And compare to collection of copywriting from old portfolios `assets/docs/archive/v2/PORTFOLIO_DETAILS.md`
     - Do the same by reviewing all of the portfolio copy content
     - Note the information from these documents because the copy soundbites throughout will be helpful in writing landingpage 
  4. Create sensible list of tags in a number of hierarchal groups to replace old grouping
     - Eliminate confusing overlapping current tag groupings of "TECHNOLOGY", "MEDIA", "ROLE", "SKILL"
     - Eliminate "Section" and Sub-Section" tags; they would just go in a new group
     - Perhaps new tags mirror resume because we DO need to add the **Job Titles** ON the resume so someone could easily see a collection of project for the actual job history on my resume
     - And then **SKILL** or something better worded for heavy skilled trade job history
     - NOTE: There does *NOT* have to be a hierarchy at all unless one naturally surfaces
     - We should consider what kind of tags **we'll need on the landingpage before finalizing the groups and list of tags**; for example maybe "services" or "contracted work" or "client" will be helpful
  5. Once finalized, JSON schema must be updated `assets/docs/_entry_template.json` and `assets/entries/**.json` entries updated
     - Do so with very careful record of changes so that all files are easily updated leaving no dumb mistake bugs
     - Again, before finalizing schema **we'll need to really spell out landingpage plans to make sure we have all necessary assets**
     - For example, right now I'm only sure that the thumbnail images work, and they display on page, but future projects will need to handle any image aspect ratio gracefully 
     - We'll create a list of changes that templates need along with the landingpage planning
  6. Identify all subsequent file and code changes needed
     - For the new tags and also for the template page changes that will be needed
     - To handle all landingpage section components
     - Deleted old files no longer needed like `assets/js/placement.json`
     - Create new files like `assets/js/homepage-content.json` — **again, it might make more sense to mix the page planning and updates into this process list rather than have a separate list like I've started; consider this a very rough overview**

### Make Template Page Changes 

  1. `index.html` 
     - Remember to maintain the current aesthetic which you should visually look at 
       `assets/docs/archive/v2/IMG-SCREENSHOT-AESTHETIC-1.jpg` 
       `assets/docs/archive/v2/IMG-SCREENSHOT-AESTHETIC-2.jpg` 
     - Repurpose current tiles into new landingpage section component, removing all hardcoded titling 
     - Create other landing page components based on the landingpage spec below and the anatomy image 
       `assets/docs/archive/v2/anatomy-high-converting-saas-landing-page.jpg` 
     - Consider the current `assets/docs/_entry_template.json` JSON entry schema and update it so that all entries have what is needed if they were placed in any of the new landingpage section components; what values are required or optional 
  2. `section.html` 
     - Again, maintain aesthetic shown in screenshot images above with the boarder-free images that bleed on mobile, and that easily scroll 
     - Remove any hardcoded titling and make sure it is entirely functional for ANY tag or collection of tags  
     - Adjust any JS files needed accordingly `assets/js` 
     - Ideally there will be far fewer tags overall and therefore the tag navigation will be simpler 
  3. `entry.html` 
     - Remove breadcrumbs 
     - Remove old types of tags 
     - Design smart layout of tags at the top of the page by their group to display for each project 
     - Adjust any JS files needed accordingly `assets/js` 
     - If not added in #2, we'll need more images than just the thumbnail aspect ratio, we need something that handles any ratio gracefully and any number of images from 0 to whatever unless it is a required field, Re: `assets/docs/_entry_template.json` 
     - Peek the plan for creating new entries `assets/docs/entries-prep/AGENT_CREATING_ENTRIES.md` if it helps identify what new values and fields might be needed 

### Perfect Landingpage Design Draft 
*Created over two months ago on 12/12/2025, so some of this may be outdated or no longer relevant and need updating to current expectations; and just generally put all the details into sensible landingpage section components* 

#### Review & Update of Below Information 

**Remember 'SEAN as a SOLUTION' brand voice** 

  1. Identify the target markets (hiring managers, companies, freelance clients)
  2. Identify their "problem" as well as perhaps something timely 
  3. Create the landingpage sections to address those problems by presenting me and my work as the solution 

#### Summary 

  Update the homepage by adding content and structure that uses the layout of a quality landing page diagram template to create spaces that sell myself better to freelance clients looking for specific services, or hiring managers looking for a broader high-level understanding. 

#### Objectives 

  + Update portfolios UX for navigating projects, but now the 'groups' are created based on what is being highlighted in a section on the landing page 
  + Build on this navigation to transform the homepage so that it makes my generalist experience more digestible and bite-sized with groupings
  + Isolate selling points or 'packages', so to speak, that are clearly customizable offerings that could also just be a way to assess skills 
  + Include a larger section that tells about by background more like a resume but with narrative 

#### New Page Structure 

  + Diagram showing the "Anatomy" of a high-converting SaaS landing page to use as a template to follow: 
  `assets/docs/archive/v2/anatomy-high-converting-saas-landing-page.jpg` 

  + Each section should convey: 

    1. The equivalent of what would be valuable in selling my trade(s) 
    2. A conceptual understanding of that section's landing page value

  + Product/service-vibe section 
    - For example, we have been preparing the details of my current client's website architecture build to be packaged 
    - Identify a handful of other loosely defined "packages" that highlight skills 
    + Each should be clearly customizable for those thinking narrowly, like clients looking for a specific service 
    + Each should be broad enough for those thinking more broadly, like hiring managers looking for a generalist 

  + *Think outside the box: What other information do we want for OUR purpose?*
    - Of the answers to that question, fit each with the proper vibe/structure/layout of the template
    - Consider the upcoming sections and how far they end up stretching away from our obvious core essentials 
    - Each section below includes what it says on the diagram, then *thoughts or questions about what we should replace there*

#### Resources 

  * **Consider provided resources before laying out sections** 

    + About Me and Resume details 
    `assets/docs/archive/v2/RESUME_DETAILS.md` 
    + Portfolio copy details 
    `assets/docs/archive/v2/PORTFOLIO_DETAILS.md` 

### Recreating Myself As A High-Converting Landing Page 

#### 1. "Navbar" 

  + Sticky at all times ✓
  + *What are the equivalents for this use case?*
    - Services 
    - How It Works 
    - Testimonials 
    - Pricing 
    - FAQ 
    - CTA 

#### 2. "Hero Area" 

  + Social proof 
    - Show trust and legitimacy through peer approval 
    - *How can we show this other than testimonials?*
  + Title/Heading/Subtitle 
    - Key problem/what we sell 
    - *Clearly understandable simple way to say what we want?*
  + Primary CTA and secondary CTA buttons 
    - Action we want users to take 
    - *If contact is secondary, what is primary?*
  + Product Video or Software Screenshot 
    - Random thumbnail collection from all projects that scrolls 
    - *Distinguish from current homepage tiles or lean into them?* 

#### 3. "Partners Section" 

  + We want to provide additional "social proof" to help build users trust 
  + The example has many circles of "Trusted by employees at..." 
  + *How do we play into this but with our narrative?*

#### 4. "Benefits" 

  + Focus on how it helps user instead of what features it has 
  + Example uses six "bento boxes" 
  + *Not sure if this is our "Products/Services" type section?*

#### 5. How it works? 

  + Example explains how to get started with the product in 3 simple steps 
  + *Creative way for us to use this?*

#### 6. Pricing Section 

  + *Another spot that we might want to get less literal, more conceptual* 
  + Example emphasizes "Why to buy/How it helps" 
    - "Help users choose by showcasing difference in plans, without hiding anything" 
    - Add CTAs to all plans 
    - Highlight the middle plan, guiding users 

#### 7. Testimonials 

  + Placed next to pricing to help with conversions
  + Using emotion of "relieved" to see other people "happy" with their purchase in example 
  + "The more testimonials the better 
  + *Whatever this is, probably testimonials, it might better help define what we would use to tell our story in the pricing section above*

#### 8. Frequently Asked Questions 

  + "Addressing major concerns" 
  + *More importantly, I think, is the line in the example "help people make the final call"*
  + Their examples are refunds, cancellations, related questions, which, while valid FAQs, don't really do their goal justice IMO 

#### 9. CTA Section 

  + Big, "highlight it, make it stand out" 
  + *If not contact, I'm not sure how to be succinct with this, as in, not linking to all the different website project sections*

#### 10. Footer 

  + "Include logo, links, newsletter/email sign-up" 
  + "Copyright, privacy policy/legal, social media icons" 
  + *Maybe our "email sign up" could actually just be a "say hello" stacked two small input fields with one that requires their email and the other requiring their message*

---

## Create Next Large Batch of Project JSON Files 

  - Review so we can delegate to new agent instance: `assets/docs/entries-prep/AGENT_CREATING_ENTRIES.md` 
  - These will give our new design more tag variety for filtering and sorting projects 

---

## Implement the Exclusively Executable Update Plan 

  - New pages, new design, new tag system, new project JSONs, new everything
  - Reviews and feedback 
  - Remember that we have no option but to push to live site for review because of 404.html weirdness 

---

## Update Documentation 

  - Rename `assets/docs/archive/v1/JSON_ARCHITECTURE.md` adding "old" or similar to filename for extra clarity when searching directory 
  - Create new architecture and everything document using template inside this document: `assets/docs/DESIGN_360_PORTFOLIO.md` 
  - Update live `README.md` using template inside this document: `assets/docs/README.md`

---
*This is meant to be a solid starting point for the planning process in creating an exclusively executable update implementation plan for the new design system.*