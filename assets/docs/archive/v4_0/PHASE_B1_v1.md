# **ENTRY TITLE**: Database Powered Generative Content Engine

**Planning**: 
  - PHASE: B
  - Group: 1
**JSON Details**:
  - SLUG: generative-blog-workflow
  - LAYOUT: Flow
**Needed To Post**:
  - PLACEMENT: Images, headings, and lists are placed to reflect their flow placement; this should be evident reading straight down the page.
  - Anything with **Bold** notation is notation about the placement and not actually meant to be published on the page. This often is followed by bullet points adding notation that isn't to be published verbatim.
  - We should consider centering H4 headings if it can be consistent and look good on all posts with the same type of 'flow' layout.
  - Any URLs added within page copy should be hyperlinked in the same way in the published version
  - HYPERFRAME: Something animated that in engages and encourages the user to scroll and enjoy scrolling up and down. The pipeline (database → art → posts → social → video) is a natural moment to animate building one stage at a time.
**Created**: 2026-05-20
**Updated**: 2026-05-23
**Update Details**: Consolidated to Sean's full-body rewrite. The earlier agent draft has been removed. Its seven MEDIA callouts were moved into Sean's body at the points where they support what he's describing, with the slug corrected from `astro-generative-content-engine` to the real slug `generative-blog-workflow`. The Structure block now reflects Sean's actual body. Two FLAGs left inline for Sean's review (Lottie image placement and post-volume figure).
**Original**: N/A
**Status**: Drafting
**Built from**: 
  - Frame URL — `developer-technologist.august.style/scaling-ai-brand`
  - `assets/entries/uid-fth-565.json` *Animated CMS Weekly Blogs*
  - `assets/entries/uid-sjz-330.json` *Agentic Marketing Department*
  - `assets/entries/uid-skz-743.json` *Agentic Social Manager*
  - `assets/entries/uid-sxz-424.json` *API Automate Video Production*
  - `assets/entries/uid-cap-258.json` *Advanced Animation System — NOT AI, hand-drawn Lottie*
**Must do**: 
  - `MEDIA` callouts need producing
  - Cross-link out to B7 (ASD podcast) at the close
  - Confirm exact post-volume figure — currently "200+ a week"
**Structure**: 
  - Database Powered Generative Content Engine
    - **Content Systems Architect**
      - *Fully Automated Astrological Readings*
        - I Love Creating Process
          - The building blocks
          - The showcase
          - Tools for the job
        - Publishing 200 Blogs Weekly
          - The written content
          - The artwork
          - Curation and publication
        - Social Media And Podcast Pipelines
          - Types of promotional content
          - The final product
          - Podcast episode generation flow
        - Humanity Has A Place
          - This is when I had to do some work
          - Performance metrics

---

## Content Systems Architect

The arrival of artificial intelligence happened fast and that pace only increased, but it was instantly clear to me that I had to understand how to integrate the tools into my work. For a time, this took complete priority over everything else in my life. Lessons from grade school about industrial revolutions kept replaying in my head. I was determined to embrace the technology and be early to the party. Discovering this was an opportunity to merge my eye for design and technical fluency was nothing but exciting.

### Fully Automated Astrological Readings

I quickly recognized that even the earliest GPT release had extensive understanding of astrological archetypes, and it kept telling me it was created to understand human behavior. Putting the two together seemed like a logical next step given I had studied astrology extensively years earlier. I also had just learned the magic that was creating automations in Make.com, and just discovered the power of Notion. After some brainstorming I came up with: [Astrofluenced](https://generative-horoscopes.august.style/), a blog and social media and podcast network that used astrology to create self-help and personal development content. 

#### I Love Creating Process 

Long before I had ever heard the terms 'system design' or 'solutions architect' I was at PETA, coming up with new strategy and building the system needed to scale it up for a global organization. There's something magical about finding the simplest form of a logical system, and the idea of creating one that was fully automated sort of blew my mind. 

  + The building blocks  
    - Somewhere to gather the initial data 
    - A setup to structure that data 
    - Another structure to fit the desired end result of the data
    - A pipeline that pulled the data in and returned the output it produced with it
    - A way to integrate this amazing new tool "ChatGPT" into this pipeline 

  + The showcase
    - Content coming from the building blocks needed somewhere to be displayed
    - It needed to integrate with the same pipeline 
    - It should be a tool I had used and could quickly iterate upon 
    - This needed a cohesive brand 
    - The core content would need visuals

  + Tools for the job 
    - I spent an hour a week pulling the planets by hand from [AstroSeek](https://horoscopes.astro-seek.com)
    - The chart from AstroSeek for each day was saved as well 
    - These assets were placed in a Notion database 
    - Make.com integrated with all of the databases, intermediary tools, and publishing platforms
    - The Make automation would trigger and pull the planets and hand them to ChatGPT
    - The AI would interpret them and write all the necessary website copy
    - Make would put this copy back into Notion databases 
    - Make would trigger to pull those assets and publish them to the Webflow CMS for Astrofluenced's website 
    - Make did the same for images needing text, having AI create it if necessary, then sending it to a design API tool 
    - The exact same flow worked for producing video shorts as well 
    - And finally, all of these promotional assets were pushed by Make when it was time for them to go live 

**MEDIA: Single row, one image — a clean screenshot of the Notion source-of-truth database, rows of daily aspects and planetary positions. `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-01.webp`**

#### [Publishing 200 Blogs Weekly](https://www.august.style/animated-cms-weekly-blogs/)

  + The written content 
    - This massive blog website had a collection of 5 different types of horoscopes for all 12 zodiac signs 
    - It had a weekly reading that helped you identify catalysts for change interpersonally, internally, and integrating the two 
    - Daily chart reading that "translated" the planet positions and major aspects 
    - Weekly planner that provided activity ideas based on the energy for the weekday and weekend

  + The artwork 
    - Every single post included a freshly created brand artwork
    - These were generated using key words found in each reading 
    - Keywords were placed into Adobe Firefly along with some basic aesthetic guides that fit the mood of the keywords 
    - A hundred or so images were generated for the week 

**MEDIA: Single row, one image — a batch grid of the daily Firefly artwork showing the visual range across one week's keyword sets. `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-02.webp`**

  + Curation and publication
    - Out of a hundred or so images I would select the best 20 or so that fit the mood
    - Adobe Lightroom makes it super easy to do this very quickly 
    - Put the images in Dropbox and they can be picked up by the automation and placed in Notion where they belonged 
    - This same collection of automations facilitated pushing the content out across social media as well 

**MEDIA: Single row, one video — the live horoscope site scrolling, showing the hand-drawn backgrounds the AI artwork sits on top of. Source `assets/.media/vid-animated-cms-weekly-blogs.mp4`; YouTube `https://youtu.be/LakcBI95rfU`. `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-03.webp`**

**FLAG (Sean to confirm placement or remove): the hand-drawn [Lottie animation system](https://www.august.style/advanced-animation-system/) for the site is its own project (`uid-cap-258.json`) — entirely hand-drawn, no AI. The agent draft staged a GIF of it here as the craft counterweight to the automated pipeline. Your current body doesn't call it out specifically; keep, move, or remove this image at your discretion.**

**MEDIA: Single row, one GIF of the hand-drawn Lottie animation in motion. `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-04.webp`**

#### Social Media And Podcast Pipelines 

  + Types of promotional content published 
    - All of the content that was created for the blogs on the website had a third purpose beyond inspiring images
    - A large number of automations were created that used this copy to produce promotional assets 
    - These automations could feed a horoscope to ChatGPT and have them write up a Tweet or Instagram post 
    - Visuals were viewed in the pipeline by ChatGPT so that copy could be written for automated video short production 
    - Automated Instagram stories were posted with copy and images 
    - Standard updates of the planets and their translated archetypal energies were published to Facebook
    - Weekly horoscope updates were posted to Facebook 
    - It only occurred to me when building the automations that it was not typical to post hundreds of updates on social every week 

**MEDIA: Single row, one image — examples of the social posts in their final form, both text-only and image with overlaid text. Built by the [agentic social manager](https://www.august.style/agentic-social-manager/) running on top of the [agentic marketing department](https://www.august.style/agentic-marketing-department/). `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-05.webp`**

**MEDIA: Single row, one image — 2–3 example [API-automated video shorts](https://www.august.style/api-automate-video-production/) as a small grid, showing the cross-platform output of the same day's content. `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-06.webp`**

  + The final product 
    - The final and most popular product was the Astrofluenced Podcast
    - This was [published on Spotify](https://open.spotify.com/show/2jAzcMOS5hDmH9EsuXsFX4?si=c076cee19b0342b8) 
    - Every episode got special cover art based on the mood of the reading 
    - This pipeline was much more intricate than the others because it bounced drafts back and forth between different AI instances

**MEDIA: Single row, one image — the Astrofluenced podcast on Spotify, showing the per-episode cover art generated from each weekly reading's mood. `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-07.webp`**

  + Podcast episode generation flow
    - First the AI came up with the overall story for the podcast from the weekly astrology aspects and planet positions 
    - Another AI instance would review this for accuracy to minimize need for human-in-the-loop moments 
    - This was passed to an AI instance that broke the reading into scripts for two characters 
    - The profile for the personality of the characters was carefully crafted and highly detailed 
    - These character profiles were fed into yet another AI along with their scripts to be edited 
    - The edited scripts went into a Text-To-Voice AI tool 
    - The final clips were then neatly placed in a Dropbox folder for each episode 

#### Humanity Has A Place

  + This is when I had to do some work  
    - This is when I stepped in to reap the benefits
    - I had an Adobe Audition template prepared along with a folder for perfect transition music selections
    - I dropped the clips into the template and exported the final audio 
    - This audio then went into Adobe After Effects and along with the weekly cover art 
    - The VFX tool created a waveform following the speaking of the characters and transition music 
    - I output this and finalized it in Adobe Premiere Pro where subtitles were generated and then edited for accuracy 
    - That final output was then uploaded and scheduled for publication to Spotify and [YouTube](https://youtu.be/tdon1UFwULs?si=sM7oJBJpFalXK8Mw)

  + Performance metrics
    - These Podcasts were before the magic that is Google's NotebookLM was released so it got a bit of traction 
    - Over 800 listens, totaling 27 hours played, for 68 total episodes posted 

*This first podcast became the proof of concept for a far more robust system — the ASD podcast network. (Cross-link out to the B7 podcast entry here.)*
