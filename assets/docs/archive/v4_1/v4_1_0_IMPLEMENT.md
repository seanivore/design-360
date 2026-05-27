# Strategic Design & Content Update 

**Created**: 2026-04-27
**Updated**: 2026-05-27
**Version**: v3.1.0 -> v4.0.0 -> v4.1.0
**Features**: Media and component layout upgrades; refocusing showcased entries
**Status**: Draft is ready for pushing toward exclusively executable plan, create new v4.2.0 IMPLEMENT document. 

## Summary

This update will make some broad entry-page layout component changes to improve project entries across the board. We will also introduce an entry-page layout that creates a more visual storytelling experience. Using these adjustments and by creating a more curated collection of polished project entries, we will craft a cohesive narrative arc that illustrates my growth across three distinct phases that emphasize my growth as a designer, marketer, and developer. Finally, these efforts will be brought together by updating the homepage components to better match the larger strategic intention behind making these changes. 

## The Strategy 

The in-demand skill that my experience can illustrate my aptitude for is "Building Custom AI Pipelines". 

  - **Our opportunity**: Companies are looking to build modern processes and open up their systems in order to increase speed and productivity. 
  - **They want to know**: What does it mean to rebuild ourselves to use AI? 

We can answer their question by illustrating how I personally adapted to use AI in my own work.

### Chronological Timeline Structure 

  1. **Phase A: Foundation (Pre-AI)** — These entries showcase the basis of my experience and building of my current expertise, information that is essential to anchor in where I can best help bring AI into businesses, and provides space to showcase accolades and highlights from this era.
  2. **Phase B: Generative Automations (Early AI)** — These entries showcase my initial dive into applying the power of AI to my skill set at that time; these are important because they highlight the lower barrier to entry solutions that involve no-code tools connecting generative power of LLMs to automate the tasks that this industry requires; this adds legitimacy to my work in the next phase by illustrating the pace of my personal development as well as the fluency with which I adopted new tools and strategies.
  3. **Phase C: Custom AI Solutions (Modern AI)** — These entries showcase modern efforts where I'm using agentic tools to create digital products that businesses need, but then taking things a step further by creating a custom solution that allows the company/client to engage with their current favorite AI model in chat to facilitate the tasks needed to use the digital product that they came to me to create; the goal here is to remove all of the friction and includes things like updating a website or maintaining a social media presence for their growing brand.

---

## Homepage 

The overall goal of the homepage will be to showcase the specific, new project entries that I've put together, that illustrate the above phases. We want to use the homepage to draw them in with a compelling, animated hero section, and then draw them in further with a showcase of the specific projects I've chosen to feature on the homepage. We should use copywriting from that section below to inform the copy on the homepage.

### Design

I pulled together the relevant assets as illustrated from a tutorial video I watched about using Claude Design to create websites with compelling, animated homepage hero sections. The steps from the tutorial I had broken down here: `.agent/CLAUDE_DESIGN_ANIM_SITE.md`

#### Hero Section

I am looking to recreate the effect of this homepage hero section example. You can see the animated visual in the background and half of the hero is covered with a blurred layer. The right half of the hero section is covered by the blurred background visual, while the left half leaves the video exposed. 

The background video is more about novelty and ornamental aesthetics than it is about conveying any important information. 

On the left top of the hero, the blurred side, you can see half of the website's name. The text's font chosen is intentionally extremely heavy bold because through those letters the blurred background is missing, and the video is exposed. THIS is the key visual element that is intended to make this hero look aesthetically impressive. It is like the lettering creates a little window to see the video behind it. 

The rest of the website's name is on the bottom right of the hero, in white, using the same font. And then, also in white text, on the lower half of the left side, on the rest of the blurred layer, there is an ABOUT bit of website copy, as well as some navigational links at the top of the blurred half section and at the bottom.

Here I have taken still images while the animation was player to illustrate the progression of the video behind the static hero text and blur layer, simply to clearly show the intended effect this layout is meant to create. 

SEE ALL IMAGES: 
  - `assets/.media/home-anim/bg-anim-stills/bg-anim-stills-1.jpg`
  - `assets/.media/home-anim/bg-anim-stills/bg-anim-stills-2.jpg` 
  - `assets/.media/home-anim/bg-anim-stills/bg-anim-stills-3.jpg`
  - `assets/.media/home-anim/bg-anim-stills/bg-anim-stills-4.jpg`
  - `assets/.media/home-anim/bg-anim-stills/bg-anim-stills-5.jpg`
  - `assets/.media/home-anim/bg-anim-stills/bg-anim-stills-6.jpg`

The animation created is was intentionally left in an atypical aspect ratio where it is almost square but the height is a bit taller. This should help the hero effect look better across devices than it would if we used a standard 19:6 aspect ratio video. 

VIDEO FILE: `assets/.media/home-anim/hero-cyberpunk-FINAL.mp4` (Needs to be uploaded to CDN to be used)

The name of the website should just be my name with SEAN over the blurred layer and HORVATH in the lower right. We must find a font that resembles the still image examples. We might decide we want to add AUGUST in the same format just below SEAN depending on how much space we have in the design. 

In the text on the lower half of the blurred layer it says ABOUT in small caps and then below it says "We shape striking digital identities through bold contrasts and meaningful motion. Our design process transforms the primal into the powerful." 

We should find a collection of copy like this that we can rotate through. The first two bullet points in the [My AI Focused "Sell"](#my-ai-focused-sell) section below are good examples of this kind of copy. The navigation links we should just replace with those we currently use and need for the website. 

#### Next Two Homepage "Landing Page" Sections 

In this example, provided with code to hand off to Claude Design from the website meant to facilitate creators to build these kind of visually powerful websites, we see that there is a hero with video followed by two sections. The second section is a large quote from the creator of the website portfolio, and then there are UI components that link out to different projects. 

The hero video provided with this example should be ignored, as well the rest of that first hero section. We will be replacing it with the design described above. This is simply to give you an idea of how the rest of the homepage could be structured. We can either start with the aesthetics that the provided text use, or craft them to better fit the hero section. 

SEE EXAMPLE IMAGE: `assets/.media/home-anim/INSPO/sections-below-hero.png`

And here is the code provided by the `motion.ai` website. It may need to be adjusted based on our needs but should provide a nice head start. I don't love React, but if it is not a lot of it then it should be fine. Basically we'll just want to keep the current architecture of the site in mind and adjust this accordingly, using whatever is helpful. 

```plaintext 
Create a React + Vite + TypeScript + Tailwind CSS landing page for a creative studio called "Prisma". The page has 3 sections: Hero, About, and Features. Use framer-motion for animations and lucide-react for icons. The design is dark, moody, and cinematic with a warm cream color palette.

FONTS

Load two Google Fonts in index.html:

Almarai (weights: 300, 400, 700, 800) -- used as the global default font
Instrument Serif (italic only) -- used for italic accent text in the About section
In index.css, set the global font family:


* { font-family: 'Almarai', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
In tailwind.config.js, extend:

colors.primary: #DEDBC8 (warm cream, used for all primary text and accents)
fontFamily.serif: ['"Instrument Serif"', 'serif']
COLOR SYSTEM

Background: black (#000000) globally, #101010 for the About card, #212121 for Features cards
Primary text color: #E1E0CC (applied via inline style, slightly different from Tailwind primary)
Tailwind primary: #DEDBC8 (used for utility classes like text-primary, text-primary/70)
Gray text: text-gray-400, text-gray-500
Navbar link color: rgba(225, 224, 204, 0.8) with hover: #E1E0CC
CUSTOM CSS UTILITIES (index.css)

Two SVG noise texture utilities:

.noise-overlay: fractal noise (baseFrequency: 0.85, numOctaves: 3) used as overlay on hero video
.bg-noise: fractal noise (baseFrequency: 0.9, numOctaves: 4) used as subtle background in Features section
Both use inline SVG data URIs with feTurbulence filter.

SECTION 1: HERO

Full viewport height (h-screen). The entire section has p-4 md:p-6 padding creating an inset effect. Inside is a container with rounded-2xl md:rounded-[2rem] and overflow-hidden.

Background video:

URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4
autoPlay loop muted playsInline, object-cover, fills entire container
Noise overlay on top: .noise-overlay with opacity-[0.7] mix-blend-overlay pointer-events-none
Gradient overlay: bg-gradient-to-b from-black/30 via-transparent to-black/60
Navbar:

Absolutely positioned at top center
Black background pill that hangs from top edge: bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8
5 nav items: "Our story", "Collective", "Workshops", "Programs", "Inquiries"
Text size: text-[10px] sm:text-xs md:text-sm
Gap between items: gap-3 sm:gap-6 md:gap-12 lg:gap-14
Link color: rgba(225, 224, 204, 0.8), hover: #E1E0CC (inline styles)
Hero Content (bottom-aligned):

Absolutely positioned at bottom: absolute bottom-0 left-0 right-0
12-column grid: left 8 columns for heading, right 4 columns for text + button
Giant heading "Prisma" using WordsPullUp component:
Responsive sizes: text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]
font-medium leading-[0.85] tracking-[-0.07em]
Color: #E1E0CC
Has a superscript asterisk (*) on the final "a" of "Prisma": positioned with absolute top-[0.65em] -right-[0.3em] text-[0.31em]
Pull-up animation: each word slides up from y:20 with staggered delay of 0.08s, triggered by useInView
Description paragraph (right column):
"Prisma is a worldwide network of visual artists, filmmakers and storytellers bound not by place, status or labels but by passion and hunger to unlock potential through our unique perspectives."
text-primary/70 text-xs sm:text-sm md:text-base, line-height: 1.2
Framer motion: fade up from y:20, delay 0.5s, custom ease [0.16, 1, 0.3, 1]
CTA Button "Join the lab":
Pill shape: bg-primary rounded-full
Black text, font-medium, text-sm sm:text-base
Right side has a black circle (bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10) containing a white/cream ArrowRight icon
Hover: gap increases (hover:gap-3), circle scales up (group-hover:scale-110)
Framer motion: fade up from y:20, delay 0.7s, same custom ease
SECTION 2: ABOUT

bg-black, padded section with centered content
Inner card: bg-[#101010], centered text, max-w-6xl
Top: small label "Visual arts" in text-primary, text-[10px] sm:text-xs
Main heading uses WordsPullUpMultiStyle component with 3 segments:
"I am Marcus Chen," -- font-normal (Almarai)
"a self-taught director." -- italic font-serif (Instrument Serif italic)
"I have skills in color grading, visual effects, and narrative design." -- font-normal
Container: text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9]
Each word animates in with pull-up effect (y:20 to y:0), staggered at 0.08s delay
Body paragraph below with scroll-linked character opacity animation:
Text: "Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals."
text-[#DEDBC8], text-xs sm:text-sm md:text-base
Each character is individually wrapped in an AnimatedLetter component
Uses useScroll with target offset ['start 0.8', 'end 0.2']
Each character's opacity transitions from 0.2 to 1 based on scroll position, creating a progressive text reveal effect
Character staggering: charProgress = index / totalChars, range [charProgress - 0.1, charProgress + 0.05]
SECTION 3: FEATURES

min-h-screen bg-black, with subtle .bg-noise overlay at opacity-[0.15]
Header text uses WordsPullUpMultiStyle:
Line 1: "Studio-grade workflows for visionary creators." in cream
Line 2: "Built for pure vision. Powered by art." in text-gray-500
Both: text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal
4-column card grid (lg:h-[480px], gap-3 sm:gap-2 md:gap-1):

Each card has staggered entrance animation: scale from 0.95 + fade in, triggered by useInView (once, margin "-100px"), staggered at 0.15s intervals with ease [0.22, 1, 0.36, 1].

Card 1 - Video card: Full video background (URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4), autoPlay loop muted playsInline, object-cover. Bottom text: "Your creative canvas." in #E1E0CC.

Card 2 - "Project Storyboard." (01): bg-[#212121], small image icon at top (https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85, 10x10 sm:12x12 rounded), title with number, 4 checklist items with green Check icons, "Learn more" link with rotated arrow (-45deg).

Card 3 - "Smart Critiques." (02): Same layout as Card 2. Icon: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85. 3 checklist items about AI analysis, creative notes, tool integrations.

Card 4 - "Immersion Capsule." (03): Same layout. Icon: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85. 3 checklist items about notification silencing, ambient soundscapes, schedule syncing.

All feature card checklist items use Check icon from lucide-react in text-primary color, with text-gray-400 description text. "Learn more" buttons use ArrowRight rotated -45deg.

SHARED ANIMATION COMPONENTS

WordsPullUp: Splits text by spaces, each word is a motion.span that slides up (y:20 to 0) with staggered delay. Uses useInView (once: true). Supports showAsterisk prop that adds a superscript * after the last character "a" of the final word.

WordsPullUpMultiStyle: Takes an array of {text, className} segments, splits all into individual words preserving per-word className. Same pull-up animation. Words are wrapped in inline-flex flex-wrap justify-center.

RESPONSIVE BREAKPOINTS

The page is fully responsive across mobile, tablet, and desktop. Cards in Features switch from 1-col (mobile) to 2-col (md) to 4-col (lg). Hero text scales from 26vw down to 19vw. Navbar items compress with smaller gaps on mobile. All padding, font sizes, and spacing use Tailwind responsive prefixes (sm/md/lg/xl/2xl).

TECH STACK

Vite + React 18 + TypeScript
Tailwind CSS 3
framer-motion (for all animations: pull-up text, fade-in, scroll-linked opacity, card entrances)
lucide-react (ArrowRight, Check icons)
```

#### Third Homepage Section 

Here we'll want to pull up and keep the **PROCESS** component, but instead of the current 1, 2, and 3 we should replace them with details about our new chronological structure described in the initial sections at the top of this document. 

And then below we can go into a bit more detail about each of the three. There will be about three entries for each of these sections once complete, but right now it is 2 for Phase A, one for Phase B, and then a written bit of information about Phase C projects. 

**From final drafts that need final once-over**
  - `assets/docs/archive/v4_1/PHASE_A1_v4.md`
  - `assets/docs/archive/v4_1/PHASE_A2_v2.md`
  - `assets/docs/archive/v4_1/PHASE_B1_v2.md`
  - `assets/docs/archive/v4_1/PHASE_C.md`

#### Hero Stats Revamp 

I'm wondering if we might be able to pull the hero stats from their current placement and instead create an interactive chart mapping their connections. 

  - Projects, Roles, Skills
  - Animated chart showing how interconnected the categories, re: their tags, are?
  - Show relationships

It would make for another interesting section on the homepage, something to interact with, that would fit nicely under the third homepage section.

#### Final Keepers Of Current Homepage Components

**CREDENTIALS** and **ACHIEVEMENTS** 

Both of these can be the last on the page. The new project entries being created will be able to have a handful of achievements created for each of them so this section will be more populous. 

**HERO TRIO BRIDGE**

We can eliminate this visual effect since we have a new visual effect hero. This is hopefully obvious but that goes as well for the current hero slideshow and dynamic text and CTA button text — it can all be removed. 

### Copywriting

The projects will work hard to showcase the most specific, tangible aspects of my skill set, however there is a more nuanced, psychological aspect that can be leveraged as well. 

#### Challenges Companies Are Encountering

Many companies are finding it incredibly difficult to implement AI because they're trying to do it in the same way they've rolled out most any new technology. They have someone come in to run a seminar, for which they select individuals from each department across the organization to attend. These employees become the leaders of AI integration initiatives and are expected to bring back what they learned and be the go-to "AI guy" on the team who integrates the new tools into everyone's workflow. 

The problem is that AI isn't like other tools, it doesn't work like that. Instead of an organization looking outward for answers, they'd be better off looking inward. Instead of looking to a single person to lead the charge, the organization should be looking to itself to create an AI-driven workflow, because AI is best used when you're using it in a personal context. This implies a more ground-up approach that completely updates old processes. Thankfully I have experience doing this. 

#### My AI Focused "Sell"

The tools are out there. The real value comes from knowing how, and where, to apply them. This requires learning quickly and thinking in systems rather than outputs.

  - Building modern systems and processes by opening up systems to increase speed and productivity. 
  - Answering: What does it mean to rebuild ourselves to use AI, everything from how our teams are structured to how our data works? 

**EXAMPLE**: 

Custom GPT that walks user through what is needed to update the website store with a new product. The AI then uses a pipeline I created to edit the images, add them to the content network, add all the text it helped you finished to the database, then pushing the site to update.

##### Offering AI-Assisted Services in Automation, Prompting, Systems

  - As companies implement AI in practical, outcome-driven ways. Not necessarily more tools but how to use them. 
  - I work to close the gap between access and application, ensuring that teams use new tools effectively in real business contexts.
  - This involves creating workflows that reduce manual effort and improve speed, for example, building automations, designing content systems.
  - Sometimes that means connecting tools like Zapier and Notion, building custom solutions that replace Zapier and Notion, more often it mean providing custom solutions with lower or zero overhead maintenance cost, built to be future-proof. 

##### Recommending How to Best Use AI

  - It should become a tool that is used to facilitate constant learning 
  - Don't ask for something outright, instead, stay in the driver's seat
  - Focus on building metacognitive habits

**Adjust what you're asking the AI for.**

  - "What's another way of looking at this?"

**Don't give away your role by asking it 'Create Marketing Plan'**

  - Instead try: "I've created a marketing plan that needs refining. It needs to reach mid-career professionals between 28-45 years old. I could use help ensuring that I'm not missing anything stemming from unconscious bias around the topic. I'm not necessarily looking for specific suggestions, but rather, help thinking through various options for improving the plan."

---

## Current Site UX/UI Fixes 

### Tile Tag Layout Inconsistency 

**Desktop**

  - On section pages, there is a layout difference because we use two columns of tiles, but you can see the tags were placed neatly  
    - SEE IMAGE: `assets/docs/archive/images/v4_0_0_content-tag-full-width-section-tile.jpg`
  - On entry pages, the related posts tiles are intentionally in a single, wider layout, column, but you can see the tags were not placed neatly as they should say within the width of the black text container above, and rather they extend past its edges, to the left. 
    - SEE IMAGE: `assets/docs/archive/images/v4_0_0_content-tag-full-width-related-posts.jpg`

**Tablet** 

  - On section pages, at tablet width the switch to a similar one wide column layout, and you can see that the tags were only given the width of the tile and anything beyond is hidden and the user can scroll left to see more 
    - SEE IMAGE: `assets/docs/archive/images/v4_0_0_content-tags-tablet-section-tile.jpg`
  - On entry pages, the related posts tiles when at tablet width actually have two issues; for some reason the right margin/padding is HUGE; and then you can see what makes the layout look problematic in comparison this time is that the black text container lengthened with the slideshow on the section page content tiles, but it stayed far too narrow on the entry page related post tiles, which makes the shorter list of tags here look very lopsided 
    - SEE IMAGE: `assets/docs/archive/images/v4_0_0_content-tags-tablet-related-posts.jpg`

**Mobile** 

  - Both the section page content tiles at mobile width, and the entry page related post tiles at mobile width, have been handled nicely
    - SEE IMAGE: `assets/docs/archive/images/v4_0_0_content-tags-mobile-section-tile.jpg`
    - SEE IMAGE: `assets/docs/archive/images/v4_0_0_content-tags-mobile-related-posts.jpg`

**How To Fix** 

  1. On entry pages at desktop view, make the width of the container the tags are within only as wide as the black text container above it, and then set it to allow but hide the overflow for the posts with lots of tags so that users can scroll through them. 

  2. On entry pages at tablet view, the right page margin must mirror the left margin (or whatever padding that is), and then the black text component should be made wider to be just slightly shorter on both sides than the image slideshow; the tags look like the might already be set up properly to accommodate this in the same way they're accommodated in the section tile tags. 

---

## Entry Page Adjustments 

The different updates, additions, and changes below may influence each other. Please read and understand in full before making any implementation plans. After changes, we'll no longer need to have constraints like keeping mobile images as a separate group, or separating media types like GIFs from images. 

In the end you'll find that there will only be three types of image filename needs for placement in the main body of the entries -- "flow", "bleed" and "main" -- any removal of old types of components are changed into "main" components, defined below, unless otherwise noted. 

### Simple Updates 

  1. **Eliminate Slideshow Component** 

Pages that currently have slideshows will be changing to another method of displaying the images. The slideshows don't do the content justice, make the images hard to read, and just feel like an out-of-style display component. 

After introducing th rest of the `entry.html` component or layout changes below, each page will be assess and include details on how it should be altered to replace the slideshow. 

  2. **Eliminate separation of any GIF or MOBILE sections, or MOBILE slide show**

All the remaining, updated, or upcoming in this document components describe how the UI should manage any media. Mostly I don't want to end up with the random 2 mobile images after the URLs on an entry page before the related entries. Its awkward looking and in retrospect I suppose it is sort of very, idk 2015 to separate media types into their own components. The only exception will be the bleed image component, which will be introduced below and requires a specific aspect ratio image. And possibly the GRID if we keep it because that currently is supposed to be only 1:1 aspect ratio images, so similar annoyance. 

  3. **Lightbox Images Everywhere**

Expand the use of the Lightbox click-to-expand effect. It would be helpful in the grid images, and then the other component layouts, even when the image is already on the larger size, seem like there's no reason why we shouldn't stay consistent and give them the same lightbox effect as well. It might be useful for viewers with giant monitors. 

  4. **Media Reshuffle** 

Where needed, some entries might need to have previously labeled and placed images put into new components. I'll address those pages at the end. 

### Thumbnail Slideshow Hero

This update should create a UX that is almost exactly the same as how users engage with the thumbnails on the actual content tiles seen in `section.html` and at the bottom of the `entry.html` page in the related projects section. This is an intentional, artistic choice. It tells the visitor that they can engage with the images like they did in the content tiles and related thumbnails they just saw. 

Since the thumbnails are currently on the right column of `.entry-content-media`, they will need to be removed and the [plan for the replacement will be detailed below](#tag-and-media-embed-column).

There will also be a [new page layout option described below](#alternate-layout-option); this updated hero will be the same no matter what layout style the rest of the entry page is set to. 

Other than making sure we show thumbnail full height, we will also need the row of images, spaced, that go off page. We'll make the images full page width with a bleed effect, just like we already use on the content tile on section pages and the related content tiles at the bottom of the entry page. There is a new component proposed below that will also be utilizing the 'bleed image' visual effect, and we'll be doing something similar for a component on the homepage. 

Below find the breakdown of two groups of styling information that should help make this change.

  + We'll need the details of the hero that we're changing and the thumbnail media we're removing from that page section. 
  + We'll also need the details about the content tiles, how the slideshow styling works, what adjustments allow their mobile view to have bleed images, and any other details you notice. 

  1. Details on the current placement of the entry page thumbnail images 
     - These will be removed for now and replaced with new media defined in a lower second in this document 
     - `.container .entry-container` — contains our `.entry-hero` and also `.entry-content-media`
     - The `.entry-content-media` has a left column `.entry-text-column`
     - The right column has `.entry-thumb-grid` > `.entry-thumb`
     - There is an `.entry-thumb` for each thumbnail, arrange in the grid 

  2. Simple to identify the hero styling that needs to be updated 
     - On `entry.html`, the `.entry-hero` is currently using `.entry-hero-image` 
     - It currently only displays a single JSON `data.thumb` image using `.tile-image` styling

  3. In the related posts section of our entry pages, find the styling using the drill down of their classes: 
     - `.related-posts-section` > `.related-posts-grid .grid-related` > `.tile .fade-in-item` > `.tile-gallery` > `.tile-image`
     - There is a `.tile-image` for each of the JSON's `data.thumb` 
     - Pay special attention to the width REM at different viewport sizes to understand the "peeking" next image coming from off page 
     - Also will need to identify which div is the one that is actually super wide; hopefully easier than the nothing coming to my mind right now 

  4. You will find similar styling on the content tiles on the section pages:
     - `.tile-grid .grid-section` > `.tile .fade-in-item` > `.tile-gallery` > `.tile-image`
     - Again, there is a `.tile-image` for each of the JSON's `data.thumb` 
     - You should find very similar styling across viewport sizes and for the wide row of images with hide overflow 

  5. Look closely at the media styling because when VW hits < 48 REM the content tiles images bleed to the edge of the device screen: 
     - `width: 100%;` is replaced by `width: 100vw;`
     - `max-width: 25rem;` is replaced by `max-width: 100vw;`
     - Original styles `margin-right: auto;` and `margin-left: auto;` are wiped out 
     - New styles add are edited to compensate and expand *OVER* the pages padding or margins 
     - Added styles `margin-left: calc(-1 * var(--space-md));` and `margin-right: calc(+1 * var(--space-md));`

  ```css
  @media (max-width: 47.9375rem) {
  .tile {
      width: 100vw;
      max-width: 100vw;
      margin-left: calc(-1 * var(--space-md));
      margin-right: calc(+1 * var(--space-md));
    }
  }

  .tile {
      ~~width: 100%;~~
      ~~max-width: 25rem;~~
      ~~margin: 0 auto var(--space-md);~~
      display: flex;
      flex-direction: column;
  }
  ```

   5. It appears this is how the images width being only partial so that the UI creates that UX need with next image peeking in is created: 
      - The only one that is necessarily that helpful to us is the mobile one because it has a single column image like or hero 
      - So the `.tile-image` is set to `width: 90vw;` allowing the next image to peek in from off page 

  ```css 
  @media (min-width: 64rem) {
      .tile-image {
          width: 21.875rem;
      }
  }

  @media (min-width: 48rem) and (max-width: 63.9375rem) {
      .tile-image {
          width: 18.75rem;
      }
  }

  @media (max-width: 47.9375rem) {
      .tile-image {
          width: 90vw;
      }
  }
  ```

#### Tag And Media Embed Column

**This should replace thumbnails for all posts using the 2-column layout**

Right now the two columns are both 50% of the width of the page. We can make the left column larger for the text, and then might the right one more narrow to around 60% / 40%. 

Then remove the `.entry-tags-layout` > `.entry-tags-card` from the very top of the page. Render it as a narrow column instead of row, and place is in the 40% right column at the top of the column in the tag groupings like now, but with wrapping. 

Then, for any entry pages that have a Behance or Youtube embed in the hero, place that below the tag section. The responsiveness of these embeds looks really pretty as they get more and more narrow. If the user wants, they can click to expand or click through. 

Last thought is that this container of tags and media embed could be sticky and stay with the viewer as they scroll down past the three blocks of copy in the left column, until the bottom of the two columns. So it would be subtle — not far, but far enough to be intriguing. 

Note: When adjusting the Youtube embeds, we need to look into if there is a reason that the thumbnail loads INCREDIBLY blurry when the page first loads because it looks very embarrassingly bad. 
  - SEE IMAGE: `assets/docs/archive/v3/IMG/youtube-blurry-embed.jpg`

If it helps to figure it out, when you refresh or return to the page, the thumbnail looks crisp and proper. 
  - SEE IMAGE: `assets/docs/archive/v3/IMG/youtube-second-visit.jpg`

### Alternate Layout Option

The hero update shall remain consistent regardless of the rest of the page's layout or components. There is one primary new layout, for which we'll probably just want a new JSON entry value that specifies the layout for that project, when desired. In the proposed below, the current, though newly updated in the above section, layout has two columns. Of course, call it what ever makes the most sense. The new layout described in the next section is a visual storytelling flow layout, that jumps between images and text continuously, flowing through a narrative until conclusion. So I called it "flow". This would allow for possible future layouts going beyond just the two.

```json
{
  "id": "uid-xxx-###",
  "layout": "columns | flow"
}
```

#### 'Flow' Storytelling Layout

**This would be the alternate layout option, replacing the two column layout**

In short, the idea is that this would be more like a "Buzzfeed Listicle" page, in that it would alternate between a text row and then a visual media row all the way down the page. They'd naturally be on the longer side and use as an engaging way to tell a story. 

**General layout notes** 

I initially had defined in this section a massive list of specifics and rules for creating flow layouts. Now that I've created three of them, I don't really feel like providing any of them is that helpful. I think once you see the first three flow entries you'll understand the variety in how this layout can be used, as well as the things that stay consistent, so that you could come up with a JSON schema layout that would accommodate all of what is needed in the current flow entries.

I'll leave the small snippet of JSON below for inspiration, but please don't feel locked in. Just set up the new JSON schema needs in whatever format will help us best achieve the visual concept and the hierarchy of headings and bullet point lists and images being shared in the first few flow entries, and then we can go from there.

```json
{
  "flow_1": {[
    "copy": {
      "text": "Social Strategy & Production",
      "format": "h3"
    },
    "copy": {
      "text": "My career started in social media. Initially we had a two person team: My mentor and myself. Helena taught me copywriting excellence and I brought the visual storytelling to our efforts. We were a great team, pioneering a number of strategies that eventually became industry standards.",
      "format": "paragraph"
    },
    "copy": {
      "text": "Creating Our First Viral Moments",
      "format": "h4",
      "style": "bold"
    },
    "copy": {
      "text": "At the time, we were the first brand adding our messaging as text on images to create a narrative. We birthed some the original memes like EXPECTATION VS REALITY primarily because we were graphic designing on the fly.",
      "format": "paragraph"
    },
    "img": [
      "assets/.media/awards-viral-social/flow-02-awards-viral-social-1.webp"
    ],
    "alt": "YahooNews Article, UGGs and Their 'UGGly' Reputation",
    "copy": {
      "text": "Viral UGGs Image Published in YahooNews",
      "format": "h5"
    },
    "copy": {
      "list": [
          "- Our first major public success was also when I learned what 'earned media' meant",
          "- Together we put together posts thinking visual-first, with intentionally 'Sharable' taglines and a punchy one-sentence caption",
          "- The resulting message resonated so widely that it was picked up and featured in an entire YahooNews article about our campaign.",
          "- Polished and culturally relevant, this was just the first of many outlets piggybacking on our reach over the years."
      ],
      "format": "bluepoints"
    },
  ]
  }
}
```

### New Bleed Images Component 

**This is a new component used for an aesthetically focused section**

For prints and some other images where a grid is too cropped in and the slideshows are too compact or small and non-visual, I want to be able to share images that are of any aspect ratio, laid out on the page just below the layout section. 

There will be no gaps between images. They will be flush against each other and flush against the left and right edges of the page, thus "bleed" images. On the JSON they will be grouped and numbered which represents the rows of images in the bleed section. There should also be no space between the rows so that above and below the images are flush against each other, too. We do want to make sure that there is padding above and below the component as a whole, by whatever means the page styling currently distributes sections. 

These images will come in a a few different aspect ratios. They should be displayed so that they are all the same height, downsizing where needed so they have varying widths and don't distort the images, but still are able to be displayed on the same row with a bleed on the page edges. Thought will be put into the grouping of these images and their rows so that this should look decent. Though these images are larger already, we should still apply the lightbox click-to-expand feature for them.

**JSON Schema Example** 

  - Don't hesitate to adjust the actual JSON schema layout 
  - As long as it meets the needs 
  - As long as it is done in a way that will create the least confusion 
  - Note that there could be any number of rows provided 
  - Note that each row has no given set number of images to be provided in 

```json
{
  "bleed": {
    "row_1": [
      "https://cdn.august.style/media/{slug}/bleed-1-{slug}-1.webp",
      "https://cdn.august.style/media/{slug}/bleed-1-{slug}-2.webp",
      "https://cdn.august.style/media/{slug}/bleed-1-{slug}-3.webp"
    ],
    "alt_1": "",
    "row_2": [
      "https://cdn.august.style/media/{slug}/bleed-2-{slug}-1.webp",
      "https://cdn.august.style/media/{slug}/bleed-2-{slug}-2.webp"
    ],
    "alt_2": "",
    "row_3": [
      "https://cdn.august.style/media/{slug}/bleed-3-{slug}-1.webp",
      "https://cdn.august.style/media/{slug}/bleed-3-{slug}-2.webp",
      "https://cdn.august.style/media/{slug}/bleed-3-{slug}-3.webp",
      "https://cdn.august.style/media/{slug}/bleed-3-{slug}-4.webp"
    ],
    "alt_3": ""
  }
}
``` 

### New Bleed Image Slides Component 

This is very similar to the bleed image component. The difference is that there would only be one row, and it is expected that they will extend off the page to the right. This is the same overflow method that we used on content tiles and related page tiles, and that we're updating the hero to accommodate. 

In this case, the images can again be different aspect ratios. The sizing will have been planned before the images are grouped and provided to be uploaded to CDN and added to a JSON file. Just like the bleed component, there shouldn't be any space between the images on the left and right. There will only ever be one row per section. 

```json
{
  "bleed_slides": {
    "img": [
      "https://cdn.august.style/media/{slug}/bleed-slides-{slug}-1.webp",
      "https://cdn.august.style/media/{slug}/bleed-slides-{slug}-2.webp",
      "https://cdn.august.style/media/{slug}/bleed-slides-{slug}-3.webp",
      "https://cdn.august.style/media/{slug}/bleed-slides-{slug}-4.webp",
      "https://cdn.august.style/media/{slug}/bleed-slides-{slug}-5.webp",
      "https://cdn.august.style/media/{slug}/bleed-slides-{slug}-6.webp",
      "https://cdn.august.style/media/{slug}/bleed-slides-{slug}-7.webp",
      "https://cdn.august.style/media/{slug}/bleed-slides-{slug}-8.webp"
    ],
    "alt": ""
  }
}
``` 

### New Main Media Component

There are some posts that have a collection of images that need prominent placement, but aren't a good fit for the more artsy "bleed images" section, and that already don't look great in a slideshow. When we created the component for GIFs, we ensured that they were nicely spaced and on the larger side. This is what we'll want to do for the images on these kind of projects. Additionally, in part because mosts of the current mobile images are in a slideshow, we should also use this component for mobile images. This component will replace the GIF and the MOBILE_IMG components; see below for more details. 

#### Details

**Media included and component naming**

  - Current class is `.entry-gifs` with `<-- Optional: GIFs -->` in the code
  - Just to recap, on the JSON we have 'THUMB', 'IMG', 'MOBILE_IMG', 'GIF', 'GRID' and 'SLIDESHOW' image types 
  - We should add a new image type to the JSON called 'MAIN_IMG'
  - Then this class can be called `.entry-main-media` with `<-- Optional: Main Media -->` in the code

**When to use a MAIN MEDIA component** 

  - The "main media" component is still optional
  - This section component will be necessary any time the 'MOBILE_IMG', 'GIF', and/or 'MAIN_IMG' value arrays contain URLs
  - It will almost never be used with a "flow storytelling layout" but we shouldn't make that a hard rule 
  - For either layout, this component should always directly follow the layout section 
  - Grid components would always follow this main media component 

**Updating pages that have a GIF and/or MOBILE_IMG component**

  - In all cases any GIF specific or MOBILE_IMG specific components should now just use a MAIN_MEDIA component
  - There might be a desire to keep media types separate, so there can be multiple 'MAIN_MEDIA' sections 
  - But this component should always use the same styling
  - The only thing that would differentiate these from each other is the ordering of the images (which is already set by the JSON array order)
  - For example, if a project has both 'GIF' and 'MOBILE_IMG' values in its JSON, we could represent those as two separate 'MAIN_MEDIA' components, or we could combine them into one large 'MAIN_MEDIA' component
  - The important thing is that we're not duplicating images across components if we don't have to
  - We can handle this the same way we were handling slideshows and will handle new bleed image rows 

#### JSON Schema & Filenames 

**Below is a JSON schema example**

  - There can be as many main_media sections as we want 
  - Each main_media can have any number of images or GIFs 
  - A single main_media group can have a mix of types, or just one type 
  - It's just an arbitrary grouping of the main images 
  - They should always be placed in the order provided on the JSON file
  - As usual, this is just an example and you are welcome to adjust based on what will work best, given you understand the needs — I don't know if it makes more sense to nest them all in the same "main_media" since it is one section, or to separate out and place the numbering "_1", "_2", etc on "main_media" instead of "img" and "alt" — I defer to you. I pulled this layout after seeing how the agent handled the project entry that had multiple slideshows. But those might have been treated as separate sections, idk. 

```json
{
  "main_media": {
    "img_1": [
      "https://cdn.august.style/media/{slug}/main-1-{slug}-gif-1.webp",
      "https://cdn.august.style/media/{slug}/main-1-{slug}-gif-2.webp",
      "https://cdn.august.style/media/{slug}/main-1-{slug}-gif-3.webp"
    ],
    "alt_1": "Alt text for this main media section",
    "img_2": [
      "https://cdn.august.style/media/{slug}/main-2-{slug}-mobile-1.gif",
      "https://cdn.august.style/media/{slug}/main-2-{slug}-mobile-2.gif"
    ],
    "alt_2": "Alt text for this main media section",
    "img_3": [
      "https://cdn.august.style/media/{slug}/main-3-{slug}-img-1.webp",
      "https://cdn.august.style/media/{slug}/main-3-{slug}-img-2.webp",
      "https://cdn.august.style/media/{slug}/main-3-{slug}-img-3.webp"
    ],
    "alt_3": "Alt text for this main media section",
    "img_4": [
      "https://cdn.august.style/media/{slug}/main-4-{slug}-img-1.webp",
      "https://cdn.august.style/media/{slug}/main-4-{slug}-img-2.webp",
      "https://cdn.august.style/media/{slug}/main-4-{slug}-gif-3.webp",
      "https://cdn.august.style/media/{slug}/main-4-{slug}-mobile-4.webp",
      "https://cdn.august.style/media/{slug}/main-4-{slug}-gif-5.webp",
      "https://cdn.august.style/media/{slug}/main-4-{slug}-img-6.webp"
    ],
    "alt_4": "Alt text for this main media section"
  }
}
``` 

**Main media section filenames**

  - As you can see in the example, they are denoted by starting with "main"
  - The group number is indicated by the number following "main" 
  - The placement in the group is denoted by the number at the end of the filename before the .ext 
  - When updating pages that have MOBILE or GIF media the filenames will need to be updated 
  - Other than just staying consistent, this is necessary because it informs where to place the media in the group
  - For "https://cdn.august.style/media/{slug}/img-mobile-{slug}-1.webp" we can just assume the conversion to main media 
  - For "https://cdn.august.style/media/{slug}/gif-{slug}-1.gif" we can just assume the conversion to main media 
  - But, any "https://cdn.august.style/media/{slug}/slide-{slug}-1.webp" will be specifically handled by page below 

#### Layout & Image Specifics 

  - The component should handle any aspect ratio 
  - Just because media is in a group, doesn't mean they must fit in a row 
  - Component row can have 1-3 images/gifs 
  - The height of the images should be consistent across each row 
  - Images downsized in height for a row can still have varying widths so as not to distort the image 
  - Assess the size of the images when selecting how many to put in each row 
  - Space between rows should match the gap between images in a row 

---

## Media Collections 

I think we need a subpage type. I'm getting into a lot of posts that I'd like to be able to feature more of the media I created for the project than makes sense to be able to display explicitly on the main `entry.html` page. Let's call these pages `collection.html` pages. And we will have a "collection preview component" that is used primarily on `entry.html` pages, but could also be added to the home page if desired. 

Below I'll first describe how to architecture the organization of the content and metadata needed for these page types and the UI they require on the actual `collection.html` page and in their `collection preview components`; this would define the contents of the collection page, and inform what is needed for the ability of the user to filter and manage what content is being displayed so they can navigate the media. Then below that I'll describe the UI for each of these elements/pages. 

### Media Collection Structure 

Our design described in the next two sections has modular intentions. 

  - By design, the media content that is displayed exclusively through media collections is not anchored to any singular collection.
  - This modular structure allows for flexibility in how we display the contents of collections through the `collection preview component`.

This structure is more about creating future flexibility while maintaining consistent architecture, than it as about immediate needs. Examples of the flexibility will be provided below. 

#### Creating A Collection

Any media collection will be defined using a JSON entry type for collections just like we have for project entries. We have the template for this JSON laid out here: `assets/docs/_collection_template.json`, will be saved as files using the same "uid-xxx-000.json" unique identifier format as used in project entries, and placed in this directory: `assets/collections/...`.

This allows for a `collection.html` page type to be populated simply by pulling from the defined contents of that JSON file, all in keeping with the norm we have created for project entry content populating entry pages. 

This allows the collection page to have it's own predefined SEO information, and it can use the same tagging grouping that we use for the entry pages, though in the schema we've indented things to `data.collection.role/skill/etc.`. It is intended that these tags are to be passed down to all of the media items in the collection, serving as a way to easily distribute tags to a group that can all be given the same tags. 

There is an array on the JSON at `data.collection.media` where we would then list media items for this collection by individual `uid-xxx-000.json` unique filenames given to each single piece of media; more about this in the next section. 

#### Creating A Collection Item

Staying consistent with our structural pattern, media items intended for one or any number of collections, are defined using a JSON entry type, but for media items, We have a template for this JSON laid out here: `assets/docs/_item_template.json`. As mentioned, each entry will again be given a "uid-xxx-000.json" unique identifier format. These JSON files will be placed in this directory: `assets/items/...`. 

There are several reasons for this architecture. Most importantly we will be able to give each piece of media specific tags, currently at `data.media.tags`, that only apply to that media file. 

Without needing to move away from our consistent system, this will also allow us to create a `media.html` page with ease, allowing us to create a user experience for clicking into more robust details than a lightbox expanded image alone provides, while providing better optimized SEO for each piece of media. 

### Dynamic Modularity

Using this setup we can achieve the above as well as the following without having to reinvent a new architecture. 

  1. When displaying a collection through a `collection preview component`, we will be able to define the UID of any collection.
  2. Since the contents of collections are defined on the Collection JSON using an array full of UID of individual media entries, we can create collections that have overlapping content based on our needs.
  3. This overlapping content can be further utilized by defining that the `collection preview component` display collections "UID" and "UID" but only any `data.collection.media` that are in both collections, or excluding media that is found in both collections.

In this light, I'm sure you can extrapolate the flexibility and deeper complexity that this modular architecture would provide for should one decide to include any larger number of collection UID and define the specifics of what contents to display. 

There would also be opportunity to use the vast collection of `data.media.tags` from all the entries in any one `data.collection.id` to find similarities or overlaps that the admin might want to display specifically. 

These possible combinations are endless, and though there is not necessarily a specific use-case already planned, we wanted to define the potential at this point so that the option is there for us as the portfolio grows and changes over the years. 

### More Specifics & Ideas 

I'd like this subpage to be sort of like the navigational experience of a well designed Shopify 'all products' page, in that whatever the batch of content being presented is, it can be very easily managed to show only the kinds of entries the user wants to see. 
  1. This means they would need tagging that would group and represent different things depending on the specific group of media being presented.
  2. Maximize the amount of visual space given to the piece of media on the media tile

And then I'd like for us to create a specific component for showcasing the batch of media in any one subpage on the `entry.html` page. 
  - It should span the page width and have UI that allow the user to scroll the collection in the element left or right without opening the element
  - Clicking an element in the collection's `entry.html` preview component should take take the user to 
  - The styling should use a negative value for it to create a "bleed" effect on the left and right of the element reaching the very edge of the browser window on desktop or device on mobile
  - The number of rows that the element preview 

---

## Finalize 

### File Updates 

  - We will need to create a more comprehensive version of this file that fits the new reality of content and entries being added including 'projects' as well as 'media collections' for projects, and the 'media items' that would fill various of those media collections. REGARDING: `assets/docs/ENTRY_SOP.md`

  - Our primary all-in-one architecture, technical documentation, and agent primer document will need to be brought up to speed. REGARDING: `assets/docs/JSON_ARCHITECTURE.md`

  - And of course: `README.md`

### JSON SCHEMA EXAMPLE CLEANUP

  - Please make sure that our `assets/docs/_entry_template.json` is up to date.
  - We've updated, removed, and created new entry page components a bunch for this update
  - In preparing for this update, I noticed that though we had entries that were functioning and displaying a component properly, the actual `_entry_template.json` file had not been updated to accurately reflect that, previously new, page component layout; I am intentionally not going to get specific as to what is or isn't present right now because we are changing so much about entry page components: e.g. Removing the slideshows, removing separation of types of media, etc. 

### New Planning & Creating 

  - New collection JSON template: `assets/docs/_collection_template.json`
  - New collection item JSON template: `assets/docs/_item_template.json`
  - `collection.html` planning and creation 
  - Create `collection preview component` UI/UX

### New Content To Finalize & Publish 

  1. `assets/docs/archive/v4_1/PHASE_A1_v4.md`
  2. `assets/docs/archive/v4_1/PHASE_A2_v2.md`
  3. `assets/docs/archive/v4_1/PHASE_B1_v2.md`
  4. `assets/docs/archive/v4_1/PHASE_C.md`

### SCRIPT TO CLEANUP CDN UPLOADS

  - Probably should run a script that can identify all of the CDN links we still have in use on the website, via the JSON files in `assets/entries/...`, so that we can clean up the actual bucket of media we have uploaded to the CDN to keep it as small as possible and therefore hopefully more likely to stay on the free tier, even as we upload new media in the form of larger file GIFs and MP4s for the entries that I'm preparing now.
  - There is a number of media to be removed because I've been taking down entries by moving them into a `assets/drafts/...` directory so that I can either combine that content into a new entry or just hold it to be fixed in an update of that entry.
  - In either case we don't want to keep the media of any of the actual CDN URLs in the drafts directory uploaded because the slugs and such will be changing. 

---