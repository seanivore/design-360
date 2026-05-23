# **ENTRY TITLE**: Database Powered Generative Content Engine

**Planning**: 
  - PHASE: B
  - Group: 1
**JSON Details**:
  - SLUG: generative-blog-workflow
  - LAYOUT: Flow
  - THUMBS: 
  - ACHIEVEMENT: []
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

I quickly recognized that even the earliest GPT release had extensive understanding of astrological archetypes, and it kept telling me it was created to understand human behavior. Putting the two together seemed like a logical next step given I had studied astrology extensively years earlier. I also had just learned the magic that was creating automations in Make.com, and just discovered the power of Notion. After some brainstorming I came up with: "Astrofluenced",a blog and social media and podcast network that used astrology to create self-help and personal development content. 

#### I Love Creating Process 

Long before I had ever heard the terms 'system design' or 'solutions architect' I was at PETA, coming up with new strategy and building the system needed to scale it up for a global organization. There's something magical about finding the simplest form of a logical system, and the idea of creating one that was fully automated sort of blew my mind. 

  + The building blocks:
    - Somewhere to gather the initial data 
    - A setup to structure that data 
    - Another structure to fit the desired end result of the data
    - A pipeline that pulled the data in and returned the output it produced with it
    - A way to integrate this amazing new tool "ChatGPT" into this pipeline 

  + Showcasing the work:
    - Content coming from the building blocks needed somewhere to be displayed
    - It needed to integrate with the same pipeline 
    - It should be a tool I had used and could quickly iterate upon 
    - This needed a cohesive brand 
    - The core content would need visuals

**MEDIA: One row with two images, both are already 675px hight; place `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-01.webp` first and then `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-02.webp` on the right.**

  + Tools for the job:
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

**MEDIA: One row with three images, both are already 675px hight; place `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-03.webp` first, `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-04.webp` in the middle, and `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-05.webp` on the right.**

#### [Human Art Covering An AI Blog](https://generative-horoscopes.august.style/)

  + Hand drawn digital art:
    - I had already decided on Webflow but needed to build the Astrofluenced website
    - Since the site was going to host a lot of AI generated content, I needed to balance that with human touches
    - All of the visuals on the website that were not updated as part of a blog I created by hand 
    - This was a period in time when the decades long minimalism obsession had very suddenly shifted to maximalism
    - On my own I had been drawing a lot of art deco and jungle core just for fun
    - Looking through that work, it was clear it could be perfect, so I polished it up and created some new pieces
    - I drew a big, ornate, gold frame for the homepage hero section
    - There are flamingos, tigers, geometric palms, as well as other birds and geometric scenes 
    - This work provided every page of the website with a different background 

  + Hand drawn animations
    - Then I wanted to create some kind of UI that made it fun for users to scroll 
    - I found a bunch of line drawing that fit the background art 
    - These were vines of ivy, leaves, rainbow arches, and ornate crown-like page headers 
    - Drawn digitally in white, I then put them into Adobe After Effects 
    - In After Effects I animated the stroke of the line for a "being drawn right now" appearance 
    - I then exported these animations as 'Lottie' files
    - When adding these to the site they were integrated with the user's scrolling interaction
    - As a user scrolled down they would see a pretty flowered ivy growing across the screen
    - The user could scroll up and watch the same visual 'un-draw' itself 
    - When looking at the website's analytics the time on page was always high because they were just plain fun to watch
    - Other than that, I created custom dropdown menu and other navigation 

**MEDIA: This is a video of the website; it is 16:9 ratio and just 720 px wide. Just like in `assets/docs/archive/v4_1/PHASE_A2_v2.md` we want to make sure that it isn't over-powering by being too wide as the only media in the row. And on mobile we need to add a negative styling to create a "bleed" effect that gets through the padding or margins in the parent elements. See PHASE_A2_v2.md IF YOU NEED TO REFERENCE THE SUGGESTED CSS STYLING.**

**SINGLE ROW: `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-06.mp4`**

```html
<div class="portfolio-grid">
  <div class="portfolio-video">
    <video
      src="https://cdn.august.style/media/generative-blog-workflow/flow-generative-blog-workflow-06.mp4"
      autoplay
      loop
      muted
      playsinline
    ></video>
  </div>
</div>
```

#### Automating Creation & Posting 100+ Weekly Blogs  

  + The written content 
    - This massive blog website had a collection of 5 different types of horoscopes for all 12 zodiac signs 
    - It had a weekly reading that helped you identify catalysts for change interpersonally, internally, and integrating the two 
    - Daily chart reading that "translated" the planet positions and major aspects 
    - Weekly planner that provided activity ideas based on the energy for the weekday and weekend

**MEDIA: Two images in one row, both are 650 px height; place `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-07.webp` first on the left and then `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-08.webp` second on the right.**

  + The artwork 
    - Every single post included a freshly created brand artwork
    - These were generated using key words found in each reading 
    - Keywords were placed into Adobe Firefly along with some basic aesthetic guides that fit the mood of the keywords 
    - A hundred or so images were generated for the week 

**MEDIA: Two images in one row, both are 1080 px wide, place `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-09.webp` first on the left, then `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-10.webp` on the right.**

  + Curation and publication
    - Out of a hundred or so images I would select the best 20 or so that fit the mood
    - Adobe Lightroom makes it super easy to do this very quickly 
    - Put the images in Dropbox and they can be picked up by the automation and placed in Notion where they belonged 
    - This same collection of automations facilitated pushing the content out across social media as well 

**MEDIA: Two images in one row, both are 1080 px wide, place `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-11.webp` first on the left, then `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-12.webp` on the right.**

#### Social Media And Podcast Pipelines 

**MEDIA: Two images in one row, both are 650 px height, place `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-13.webp` first on the left, then `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-14.webp` on the right.**

  + Generating social assets: 
    - All of the content that was created for the blogs on the website had a third purpose beyond inspiring images
    - A large number of automations were created that used this copy to produce promotional assets 
    - These automations could feed a horoscope to ChatGPT and have them write up a Tweet or Instagram post 
    - Visuals were viewed in the pipeline by ChatGPT so that copy could be written for automated video short production 
    - Automated Instagram stories were posted with copy and images 
    - Standard updates of the planets and their translated archetypal energies were published to Facebook
    - Weekly horoscope updates were posted to Facebook 
    - It only occurred to me when building the automations that it was not typical to post hundreds of updates on social every week 

**MEDIA: Two images in one row, both are 650 px height, place `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-15.webp` first on the left, then `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-16.webp` on the right.**

  + The final product 
    - The final and most popular product was the Astrofluenced Podcast
    - We created specific characters who hosted every week
    - They had carefully crafted personalities: Theodore was the optimist and Stella liked to give the hard truths in the reading
    - Every episode got special cover art based on the mood of the reading 
    - This pipeline was much more intricate than the others because it bounced drafts back and forth between different AI instances

**MEDIA: Two images in one row, both are 1080 px height, place `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-17.webp` first on the left, then `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-18.webp` on the right.**

  + Podcast episode generation flow
    - First the AI came up with the overall story for the podcast from the weekly astrology aspects and planet positions 
    - Another AI instance would review this for accuracy to minimize need for human-in-the-loop moments 
    - This was passed to an AI instance that broke the reading into scripts for two characters 
    - The profile for the personality of the characters was carefully crafted and highly detailed 
    - These character profiles were fed into yet another AI along with their scripts to be edited 
    - The edited scripts went into a Text-To-Voice AI tool 
    - The final clips were then neatly placed in a Dropbox folder for each episode 

**MEDIA: Two images in one row, both are 1080 px wide, place `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-19.webp` first on the left, then `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-20.webp` on the right.**

#### Humanity Has A Place

  + This is when I had to do some work  
    - This is when I stepped in to reap the benefits
    - I had an Adobe Audition template prepared along with a folder for perfect transition music selections
    - I dropped the clips into the template and exported the final audio 
    - This audio then went into Adobe After Effects and along with the weekly cover art 
    - The VFX tool created a waveform following the speaking of the characters and transition music 
    - I output this and finalized it in Adobe Premiere Pro where subtitles were generated and then edited for accuracy 
    - That final output was then uploaded and scheduled for publication to [Spotify](https://open.spotify.com/show/2jAzcMOS5hDmH9EsuXsFX4?si=6dc4f71d187a401c) and [YouTube](https://youtube.com/playlist?list=PLmiHTLtKjrdyt4XBw2NlE_qvJRnHrkDTy&si=7Lzyn6xYa4nbdQWH)

**MEDIA: These are two short clips of the podcasts; they should both sit in the same row and both are 16:9 ratio at 720 px wide. I removed "autoplay", "loop", "muted", and "playsinline" from the HTML but I'm not sure what to replace it with because these DO have audio and should be clicked to be played.**

**TWO IN THE ROW: `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-21.mp4` and then `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-22.mp4`**

```html
<div class="portfolio-grid">
  <div class="portfolio-video">
    <video
      src="https://cdn.august.style/media/generative-blog-workflow/flow-generative-blog-workflow-21.mp4"
    ></video>
  </div>

  <div class="portfolio-video">
    <video
      src="https://cdn.august.style/media/generative-blog-workflow/flow-generative-blog-workflow-22.mp4"
    ></video>
  </div>
</div>
```

  + Performance metrics
    - These Podcasts were before the magic that is Google's NotebookLM was released so it got a bit of traction 
    - Over 800 listens, totaling 27 hours played, for 68 total episodes posted 

**MEDIA: Two images in one row, both are 1080 px wide, place `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-23.webp` first on the left, then `assets/.media/generative-blog-workflow/flow-generative-blog-workflow-24.webp` on the right. Then please adjust the HTML of the iframe below to match the same style we used to use for Youtube and Behance embeds; this should still be on pages but in the update that goes with this new content we are removing those from the hero so there aren't many embeds but we want this to use those same settings because it made it look nice.**

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?si=md3dpfueA1iJoe4-&amp;list=PLmiHTLtKjrdyt4XBw2NlE_qvJRnHrkDTy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
```
---