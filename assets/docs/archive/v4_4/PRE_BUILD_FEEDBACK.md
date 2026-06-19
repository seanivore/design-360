# Build Guide v4.4.x Feedback 

## Overview 

Please bake these into your build guide `assets/docs/archive/v4_4/v4_4_0_IMPLEMENT.md` driving it to v4.4.1. You'll see directions in `.agent/DEV_RULES.md` about IMPLEMENT build guide gap reviews. This project is a bit simpler and not something we often have bugs with for the kind of changes we're planning today, so we'll alter it a bit. 

After you fold in these notes, please just spawn subagents and have them do a gap review for the same lenses we would have had clean context new instance agents do. When you see what they come back with you can validate their findings and then fold in their changes. 

After any changes are folded in we do another two subagents that are described in DEV_RULES for breadth and something else. After their finished and you integrate anything they find, you have to decide if it needs another subagent pass for the initial gap review types. You can ping me if you want, but it'll be decided based on the severity of the findings, if they would have broken the build or if they were just polish, and how many they find; six with a couple serious would get another loop. Just a few and all polish, don't loop again. Each loop top the three main gap reviewers, when you fold in their changes, drive the version patch number up a notch, please. 

That's it. Check out the list and let me know if you have questions. 

---

## Build Session 

### **Goal**

The goal of this build that we are continue was to be able to update our entries / add more in a way that shifted the portfolio more towards something that someone could actually review in a sitting. Before it had like 50 entries and they were all the same and had too many details. 

### Process

  1. Please commit as you go! 
     - Keep the git history easy to reflect on and understand the session looking back 
     - You have my permission commit and push to dev as you see fit 
  2. The Vercel dev SSO is not on.
     - So when you are ready to start checking the work and testing, you can launch Claude-in-Chrome 
     - See how things look and make sure everything is functional on desktop and mobile 
     - This sweep helps keep our process efficient. 
  3. We just setup an UPLOAD end point. For now it only takes images, makes sure they're below a certain size, then converts them to .webp before sending the media directly to the CDN and cleaning the Cloudinary of the media so we stay on the free tier, then sends you back the CDN URL to use. 
     - Normally, eventually, we can make this respect roles and then crop our thumbnails too 
     - right now it is set up to images for anywhere can go through it and I already handled the cropping myself 
     - Also eventually, we'll also add a way for it to take videos, see that it is a video and bypass Cloudinary and just get it on the CDN 
     - For now, the videos you'll have to use our old method: `assets/docs/ENTRY_SOP.md` 
     - NOTE: We will want to update that document to reflect the UPLOAD endpoint 
     - But will need to make sure we have those fallback details since it can't do everything yet 

### Plan Feedback 

  1. Re: "two shuffled collection-preview rows" — these gallery posts (or any post layout) will use the new bleed images component. 
     - There is one of those components per collection associated with the gallery post. 
     - It might have two rows in it, might have three I seem to recall, but we haven't seen it post build yet so it is open to whatever looks best. 
     - If you want, you can look back and you'll find docs that describe the UI/UX of that new component along with other updates from the start of this build that we're continuing. 

  2. When you reach the point of creating a Bleed Images Component Section for the homepage: 
     - Copy and adapt the bleed images component from the entry page; I'm imagining another row or two
     - It should be filled with any combo of tags using the FEATURED JSON `assets/js/homepage-content.json` 
     - You'll need a new tag that fits in well with the current tag groups; maybe a combination of 'Graphic Design' and 'Art Gallery' 
     - They key is basically just that the combo you use should pull in just Gallery layout entries with Bleed Images Components 

  3. Let's refer to the homepage section as the "Homepage Bleed Images Component" section 
     - Rather than "homepage gallery" section; "Gallery" is just the new, third type of entry.html layout 
 
  4. Gallery layout creation for entry.html pages 
     - Follow the same model as the previous build setup to implement `data.layout:flow` 
     - The only difference between gallery layout and `data.layout: Columns` is the groups of copy 
     - Instead of `data.challenge`, `data.approach`, and `data.result`sections, we just need one or two sections 
     - These sections should convey what the graphic design was, how it was done, what it was used for
     - Answer the questions someone would have if they were thinking of hiring me for that work 
     - It is up to you how you end up actually structuring and labeling the sections, but please see the images of the homepage for design 
     - The new copy value(s) will need to be added to `assets/docs/_entry_template.json` 
     - The one or two sections should be no more than a couple sentences max, each, just for context

---

## General Feedback

### Related Post Content Tile Pills

One thing that was on the previous build, meaning you can find it better detailed in these documents `assets/docs/archive/v4_3`, was about the layout of the "Related Posts" content tile's scrolling tags width. In the feedback I compare it to how the pill tags are responsive in their placement container div's width when you look at them on the content tiles in the /section page. Those tiles are basically the same, just not as wide. Please find that and update it. 

  - View the image of the issue: `assets/docs/archive/images/v4-related-post-tag-pill-width.jpg`

Found an image of the section page tile where, when wide (or more narrow) the pills just don't extend past the edges of the text's container above. But what is key is that I can still scroll the pills left or right and they just hide on L and R sooner to be more narrow. 

  - Section tile example: `assets/docs/archive/images/v4-section-content-tile-tag-pill-width-proper.jpg`

### Mysterious Behance Icon Distortion

This is an ongoing mystery regarding the Behance icon in the homepage footer. 

  - View the image of what is happening: `assets/docs/archive/images/v4-behance-icon-distortion.jpg`

The wild thing is that I looked at the file. This is it and you can see it is not distorted. So I'm pretty sure the previous agent's fix was just to replace this file and that didn't help. 

  - Current Behance icon visual: `assets/docs/archive/images/v4-behance-icon-that-is-live.jpg`
  - Behance icon source: `assets/favicon/behance-logo-black.svg`

Can you investigate deeper? Its weird for sure! 

While down there, let's get the Instagram and Threads SVG icons and set both of those up, too, please.

  - `https://www.threads.com/@seanivore`
  - `https://www.instagram.com/seanivore/`

I guess I wouldn't be a modern developer if I didn't provide Twitter. Yes, we call it Twitter still. I sort of want to find the bird icon but I guess there's no way I can think to do that so that people would know it was intentional, lol. 

  - `https://x.com/seanivore`

Ah, just seeing that this is on EVERY PAGE'S footer. Please see the /section and the entry.html footers though because it doesn't look like there is enough of a gap between the first line of icons and the lower line of © 2026 etc. Maybe we should even just add 2026-27 while down there? Up to you. 

For contact in the header nav on pages other than homepage, maybe we should just drive them to the bottom of the homepage so that the email icon is there, but now there will be all the other ways to contact me. 

ONE MORE -- please also add Telegram to those feet. Thanks! 

  - `https://t.me/seanivore`

### Homepage Header Nav Links 

First please see this image of the whole hero because it contains multiple items to address. 

  - Homepage hero animation and navigation: `assets/docs/archive/images/v4-homepage-hero.jpg`

  1. Please see how hard it is to read the `+contact` link at the top right
     - This bums me out because a drop shadow would look weird. 
     - I think we might need to increase the darkness of the transparent black layer over the entire image a bit 
     - Or add one if there is not one there yet — we did this on mobile but it is way darker than desktop needs 
     - But just a touch and on the whole image so people don't even know the difference 
  2. While there, please look at the email that is hyperlinked **NOTE: this seems to be my machine; see the "Final Homepage CTA Copy" section below for more details on how we might handle this.**
     - I SEE "mailto:<email>" when I hover with my mouse in the browser
     - But I just copied the URL in it and only "sean@august.style" came out
     - When I click it it opens a new tab that is empty and that is it. Not okay!!!
  3. Swap out the hyperlink behind `+work` towards the middle on the left of the three
     - Old URL is `https://www.august.style/#featured-tiles`
     - Let's send them directly to all project using this: `https://www.august.style/section`
  4. Now look to the confusing bottom, in the left column, for the EXPLORE THE WORK --> and links 
     - It is confusing that right now because work points at my GITHUB, LINKEDIN, BEHANCE links 
     - But the words and arrow EXPLORE THE WORK --> link to `/section` page 
     - Please left align the three bullet point links
     - Then please move EXPLORE THE WORK --> to be bottom right corner of that column 
     - Right where the blur layer ends in the middle of the background animation 

### 3 Consecutive "PHASE A, B, C" Sections

  1. In the first 'NARRATIVE SPINE' section there are three tiles that need copy updates 
     - I'd like your help with perfecting the suggestions
     - They all say PHASE X in small text and then 'PHASE X IS' right below, which is ust weird redundant 
     - I like the combination of plain text and script in the headings
     - I like to play into the text below it and I think we should use a playful voice; I'm all about adding quirkiness that people would be like "oh he def wrote this, not AI" since that is an annoying critique, I kind of have to lean further in to avoid it.  
     - Playful, but serious because I did "change the world" said the VP, and turned that fading traditional media built empire into a digital household name that the younger generations actually knew. Maybe: "Talk about building solid *foundation*" or "Now that's a solid...", "Talk about solid...", "A legit solid...", "Honestly such a solid...", "Sweat & tears for that solid..." -- wdyt?
     - B continuing the fun voice: "Briefly addicted to *generative automations*", "I couldn't stop making...", "Fixated on creating..." <-- I think the last one? 
     - C as "Today I'm building *custom AI solutions*", "Now we all about..." (intentional grammar choice), "The best yet is...". Hmm last is kind of corny. I sort of like the intentional grammar oddity because its like a thing, let's them know I'm hip and again, screams HUMAN WROTE THIS.
     - Oh and please remove all m-dashes from the text below the headings. I MADE the m-dash back when I was at PETA, and hate that people still flag it as OH THAT AI DUR DUR DUR. 
  2. Phase C link update(s)
     - This is empty now 
     - At the end I have a entry I put together that will make sure it has at least one entry for now. 
  3. I'm going to change the content in the FEATURED TILES section next 
     - Because this is just too many sections that all talk about the same things, but not in enough of a way that is helpful 
     - I think I have things together to make a post or two about videos and motion design 
     - Oh actually, I think we could find a way to talk about video and motion design but for each phase! 
     - Maybe you could help just by drafting text for this for now. There are already PETA videos in the post phase A links to, but better yet will be the more artsy stuff I drew and animated for Silent Labs the DAO 
     - And then for phase B I have API created video shorts created from wild automations in Make, tapping in LLMs and filling out Notion for producing copy for videos on the fly 
     - I'll have to think about video related custom AI solutions... let me know if you have any ideas. I mean I did actually work with you to use HyperFrame skill to edit the hero animation. It was literally graphic design still image! That could be the start to an entry that is about the portfolio build itself, which the previous build agent left notes about here: assets/docs/archive/v4_3/PHASE_C.md (I did the same thing for everlastings which just went live)
  4. Placement of the new Bleed Images Component Section 
     - This will go right after the FEATURED TILES 
     - And right before the PROCESS section 
     - With some padding above and below for breathing room since it is jumping topics now instead of staying on phase phase phase 

### Updating The Achievement Section 

We add these to the JSON for any entry that has a strong highlight, a `data.achievements.headline` and `data.achievements.details`. Right now this section pulls them from any entry, it isn't filtered down by any tags, which is kind of how I like strategically surfacing other content. But we need to prune things and improve the original drafted AI copywriting. I have tips for you to try it out. 

  - First please read this file: `.agent/EMOTION_DRIVEN_COPYWRITING.md`

  1. Please find the JSON `assets/entries/` for each of the following (you can search this actual text) and remove it from their JSON so they don't show up here. 
     - Original audience-data-first influencer growth offering
     - Hand-drawn iPad UI as the deliverable
     - Multi-AI script orchestration before NotebookLM
     - Hand-drawn Lottie animations across an AI-content site
  
  2. This one needs to be written in a way that makes more sense. It should "GUT CHECK" when they read it. Shouldn't take more than a second for them to understand it and makes them go 'OH' out loud. 
     - Testimonials page averaged 14 minutes of session time (*could be punchier and where are they saying this happened?*)
     - 100+ weekly blog posts auto-generated end-to-end (*also it is 200*)
     - 68 AI-voiced podcast episodes — 800+ listens, 27 hours played (*maybe mentioning the upload frequency would help*)
     - Original brand artwork on every page, no stock imagery (*stronger please*)
     - #1 engagement rate for nonprofits on Facebook (Q3) (*write to make it clear WE WON*)
     - Tofucken — 1B+ video views, NTEN Do Gooder Finalist (*more punch*)
     - 1st Place NTEN Do Gooder 'Funny For Good' Award — Beyond Words (*just like the one above this, tall the letters "NTEN" and weird words hard hard to decipher and you don't understand instantly; what is written for all of them should resonate instantly*)
     - 4.5M consumer actions from the 'Britches' campaign (*and PRNewsPro covered it hello*)
     - #AskSeaWorld hijack named a culture-defining backfire (*sounds weak currently, we destroyed their entire campaign*)
     - End-to-End Freelance Automation (*huh? Click why? actually let's update this in the section below*)

### Final Homepage CTA Copy

Agent draft leaned a bit too hard into the PHASE theme update. I'd like for this to make sense to people in a broader way, too. Right now it feels limiting like, they might like other work, but why contact if the contact button is about AI pipelines and that isn't exactly what they want, maybe they really like the graphic design or web development, etc. It is also very "AI", e.g. "ground-up job!" isn't something humans actually say, heh. 

Damn this mailto link doesn't work for me either. They used to so, regarding my note about the hero nav contact button above, seems like it might just be my machine. Probably works on mobile, but I wish there was a way for it to fallback if it does what it did for me on desktop (opens an empty tab). Is that possible somehow?

For the rewrite, I think we want to take away the THEME of the phase transitions, and maybe emphasize helping people adjust for the changing technological and creative design/development landscape. I'll let you take a stab at it based on that. Here is some inspiration: `assets/docs/archive/v4_2/v4_x_x_HOMEPAGE_COPY_PLANNING.md` -- we'll need new button text as well as the heading and body. And we have plenty of buttons going to PHASE C, so we can nix that for the ghost button. Looking forward to see what you come up with. No need to get me to sign off on these things first. I'll review everything together once it is up on dev. 

`cta-heading` 
  - Rebuilding around AI is a ground-up job.
`cta-body` 
  - If your company is trying to do real work with AI — not seminars, not pilots, not another tool slotted on top of the old process — that's the kind of thing I build.
`btn btn-primary` 
  - "mailto:sean@august.style?subject=Custom%20AI%20Pipeline" 
  - Start a custom pipeline 
`btn btn-ghost`
  - /section.html?tags=Phase%20C 
  - See how Phase C works

--- 

## New Entry 

### Writing Guidelines

Could you then save these entry writing guidelines in `assets/docs/ENTRY_SOP.md` and maybe the memory too: 

  > Don't get lost in the technicals. Speak to the non-technical reader that could be potential clients. Showcase the technical using market share household names of services known as best practice. Don't fall into AI hype bias lens; humbly describe impressive work that can speak for itself. Visually show numbers and visually showcase UI flow, these things people can't picture on their own. In the end, they don't want to read, they want to understand by only needing to scroll and scan. Hold off on workflow and method until the end.
  
  > OH, and the core aim of this update is good to remember: Recreating entries to make the whole portfolio easier to quickly digest in one sitting. Visual, not much text, scroll scroll scroll. 

Maybe add a mention to that `.agent/EMOTION_DRIVEN_COPYWRITING.md` doc if you found it helpful in the last section, too. 

### First Phase C Entry

I just realized that this could go under the PHASE C tagging so that those links aren't empty like they are now. We want to make it clear that it was a fully AI-pair development build (maybe web search for the best term for that though... NOT vibe code. I build with intention, not vibes): `https://www.august.style/freelance-payments-platform`

We'll revamp with some very simple changes, just placing media with short text. Please start by updating this JSON entry file to the new schema: `assets/entries/uid-vin-427.json` and then it will need tags that get it showing for PHASE C. Change it to a FLOW layout type. Below are videos of how using the platform looks like. They are clipped short to put them in the HTML with a video tag, set to behave like smaller file GIF. 

I'll add some basic text to ground the structure, and then if you could please pull from the original text on the JSON, or the README.md I added below. 

  - We can include some of this after the visuals, but not a lot: `/Users/seanivore/Development/freelance-payments/README.md`
  - We need a new button that better fits the front page design instead of this (OLD LINK BUTTON ON ENTRY PAGES), and link at the end to SEE THE PRODUCT ON GITHUB: `https://github.com/seanivore/freelance-payments`
  - Another button for THE LIVE PORTAL LOGIN just because it is pretty: `https://payments.august.style/`
  - Thumbnails are here: `assets/.media/freelance-payments-platform/thumb-freelance-payments-platform-{1-6}.webp`

All videos: 

  - MP4, loop, no controls
  - Place the desktop and mobile in the same row (when viewed on desktop) and match the MP4 height to the row height so they look clean and it will be wide next to skinny at the same height
  - Simple step between each, added details below. 

After finalizing contract specifics with the client, the AI automation puts it together in our contract template. When their contract is ready, they're sent an email with a login keyword that they pair with their name so they can make their first payment. 

  - DESKTOP: `assets/.media/freelance-payments-platform/vid-freelance-payment-platform-1-1.mp4`
  - MOBILE: `assets/.media/freelance-payments-platform/vid-freelance-payment-platform-1-2.mp4`

They can review the contract and securely sign it on the platform. They'll get an emailed copy once it is complete, but can download one for their records now if they want. 

  - DESKTOP: `assets/.media/freelance-payments-platform/vid-freelance-payment-platform-2-1.mp4`
  - MOBILE: `assets/.media/freelance-payments-platform/vid-freelance-payment-platform-2-2.mp4`

Their payment invoice loads for them to review before proceeding to make a payment. 

  - DESKTOP: `assets/.media/freelance-payments-platform/vid-freelance-payment-platform-3-1.mp4`
  - MOBILE: `assets/.media/freelance-payments-platform/vid-freelance-payment-platform-3-2.mp4`

Payments are completed thanks to secure and well-known Stripe integration. 

  - DESKTOP: `assets/.media/freelance-payments-platform/vid-freelance-payment-platform-4-1.mp4`
  - MOBILE: `assets/.media/freelance-payments-platform/vid-freelance-payment-platform-4-2.mp4`

That's it. When their project is complete they'll get another email if they have a balance to pay off. 

Then we'll want to have other details about the project below. 

---