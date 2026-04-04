# FEEDBACK: v2.7.0 Final Updates & New Entries 

**Created**: 2026-04-01
**Version**: 2.7.0
**Status**: Final Review Fixes 
**Project**: `~/Development/360-design`
**Domain**: `https://august.style`
**Update**: `assets/docs/archive/v2/v2_7_UPDATE_PLAN.md`
**This file**: `assets/docs/archive/v3/v2_7_FEEDBACK.md`

---

## Overview 

Agentically created entries need image corrections. Other projects have new types of media that need to be displayed on the entry page. We'll assess the layout and logic of `entry.html` to accommodate the changes which are identified below. 

This is also a good opportunity to improve the UX/UI of the project entry tiles on `section.html` pages to make them more helpful to users; making each tile easier to understand what the project is about at a glance and if the hiring manager would want to click through. 

As the fixes are completed, we should create a list of entries that have not been fixed yet during this update so that I can finish reviewing all entries. And then of course all documentation should be updated to reflect any changes made. Since we'll be making some layout improvements along with the entry page fixes, we'll consider this to be our v3.0.0 update. 

---

## New Entry Page Components 

  1. Multiple Media Embeds
  2. GIF Images
  3. Image Grid
  4. Slideshow update 
  5. Mobile Images 

### 1. Entries With Optional Multiple Embeds 

Adjust the `entry.html` so that a project JSON could have more than one video embed. We would need to also update the JSON schema `assets/docs/_entry_template.json` to accommodate this. Additional videos should stack under the other videos in the same column. 

### 2. Project Entry GIFs 

GIFs should come secondary on the page if they exist for that project, just below video embed(s) if those exist for the project. 
Better than multiple videos, though it would be nice to have both options, would be to have space to have GIF images; let's edit `entry.html` to allow for this as well as the `assets/docs/_entry_template.json` JSON schema. The page should allow anywhere between 1 to 10 GIFs and display them on the page with decent white space so they're not cramped, and please allow for them to be any aspect ratio. 

### 3. Square Simple Image Grid 

Simple grid of any number of 1x1 aspect ratio and 1080 px square images; 3 across and 3 down, etc. 

### 4. Improve Current Slideshow (improved and selective with what images are in it)

There is currently a slideshow of some sort on entry pages and it seems to be filled with images already displayed. We should improve it 

From the old portfolio; it is large and bold: `assets/docs/archive/v2/IMG/slide-show-example.jpg`

Class `.slideshow-container .presentation-style` from our modular Portfolio build `/Users/seanivore/Development/portfolio/CONVENTIONS.md`

### 5. Narrow Tall Row of Mobile Images 

Perhaps this is also a form of slide show? Because it would be nice if they were all the same aspect ratio and size, all tall and narrow, all in only one row. If there are too many for the page width, then the user can hit button to see more of them. 

---

## Media Fixes 

  **FIXING WRONG IMAGES**
  1. Agent uploaded inaccurate screenshot to CDN
  2. Accurate image saved locally using same filename
  3. Delete old from CDN and upload new
  4. Or rename and upload new, and fix JSON
  5. All other information is accurate, only images are wrong

  **ADDING MISSING VIDEO EMBEDS**
  1. Add provided YouTube video to newly created portfolio entries
  2. Adjust iFrame according to ENTRY_SOP.md guidelines

### 1. Add GIFs To Entry: **advanced-animation-system**
  https://www.august.style/advanced-animation-system/
  + GIFs
    - `assets/images/advanced-animation-system/gif-advanced-animation-system-1.gif`
    - `assets/images/advanced-animation-system/gif-advanced-animation-system-2.gif`
    - `assets/images/advanced-animation-system/gif-advanced-animation-system-3.gif`
    - `assets/images/advanced-animation-system/gif-advanced-animation-system-4.gif`
    - `assets/images/advanced-animation-system/gif-advanced-animation-system-5.gif`

### 2. Fix Wrong Images: **advanced-animation-system**
  https://www.august.style/advanced-animation-system/
  + THUMBS
    - `assets/images/advanced-animation-system/thumb-advanced-animation-system-1.webp`
    - `assets/images/advanced-animation-system/thumb-advanced-animation-system-2.webp`
    - `assets/images/advanced-animation-system/thumb-advanced-animation-system-3.webp`
    - `assets/images/advanced-animation-system/thumb-advanced-animation-system-4.webp`
  + SQUARE
    - `assets/images/advanced-animation-system/img-sq-advanced-animation-system-1.webp`
    - `assets/images/advanced-animation-system/img-sq-advanced-animation-system-2.webp`
    - `assets/images/advanced-animation-system/img-sq-advanced-animation-system-3.webp`

### 3. Fix Wrong Images: **illustrated-poetry-book**
  https://www.august.style/illustrated-poetry-book/
  + SQUARE
    - `assets/images/illustrated-poetry-book/img-sq-illustrated-poetry-book-1.webp`
    - `assets/images/illustrated-poetry-book/img-sq-illustrated-poetry-book-2.webp`
    - `assets/images/illustrated-poetry-book/img-sq-illustrated-poetry-book-3.webp`
  + THUMBS
    - `assets/images/illustrated-poetry-book/thumb-illustrated-poetry-book-1.webp`
    - `assets/images/illustrated-poetry-book/thumb-illustrated-poetry-book-2.webp`
    - `assets/images/illustrated-poetry-book/thumb-illustrated-poetry-book-3.webp`
    - `assets/images/illustrated-poetry-book/thumb-illustrated-poetry-book-4.webp`
    - `assets/images/illustrated-poetry-book/thumb-illustrated-poetry-book-5.webp`

### 4. Fix Wrong Images & Add Slideshow: **influencer-growth-strategy**
  https://www.august.style/influencer-growth-strategy/
  + SQUARE
    - `assets/images/influencer-growth-strategy/img-sq-influencer-growth-strategy-1.webp`
    - `assets/images/influencer-growth-strategy/img-sq-influencer-growth-strategy-2.webp`
    - `assets/images/influencer-growth-strategy/img-sq-influencer-growth-strategy-3.webp`
  + THUMBS
    - `assets/images/influencer-growth-strategy/thumb-influencer-growth-strategy-1.webp`
    - `assets/images/influencer-growth-strategy/thumb-influencer-growth-strategy-2.webp`
    - `assets/images/influencer-growth-strategy/thumb-influencer-growth-strategy-3.webp`
    - `assets/images/influencer-growth-strategy/thumb-influencer-growth-strategy-4.webp`
    - `assets/images/influencer-growth-strategy/thumb-influencer-growth-strategy-5.webp`
  +SLIDESHOW DECK
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-1.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-2.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-3.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-4.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-5.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-6.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-7.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-8.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-9.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-10.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-11.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-12.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-13.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-14.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-15.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-16.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-17.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-18.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-19.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-20.webp`
    - `assets/images/influencer-growth-strategy/deck-influencer-growth-strategy-21.webp`

### 5. Fix Wrong Images: **public-health-response-platform**
  https://www.august.style/public-health-response-platform/
  + SQUARE
    - `assets/images/public-health-response-platform/img-sq-public-health-response-platform-1.webp`
    - `assets/images/public-health-response-platform/img-sq-public-health-response-platform-2.webp`
    - `assets/images/public-health-response-platform/img-sq-public-health-response-platform-3.webp`
  + THUMBS
    - `assets/images/public-health-response-platform/thumb-public-health-response-platform-1.webp`
    - `assets/images/public-health-response-platform/thumb-public-health-response-platform-2.webp`
    - `assets/images/public-health-response-platform/thumb-public-health-response-platform-3.webp`
    - `assets/images/public-health-response-platform/thumb-public-health-response-platform-4.webp`
    - `assets/images/public-health-response-platform/thumb-public-health-response-platform-5.webp`
    - `assets/images/public-health-response-platform/thumb-public-health-response-platform-6.webp`

### 6. Add Video Embed, GIFs, And Replace Images: **viral-campaign-strategy**
  https://www.august.style/viral-campaign-strategy/
  + VIDEO EMBED
    - `https://www.youtube.com/watch?v=j5QAjcbvbDg`
    ```html
    <iframe width="560" height="315" src="https://www.youtube.com/embed/j5QAjcbvbDg?si=p2mq6L5OP-GURp4l&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    ```
  + SQUARE
    - `assets/images/viral-campaign-strategy/img-sq-viral-campaign-strategy-1.webp`
    - `assets/images/viral-campaign-strategy/img-sq-viral-campaign-strategy-2.webp`
    - `assets/images/viral-campaign-strategy/img-sq-viral-campaign-strategy-3.webp`
  + THUMBS
    - `assets/images/viral-campaign-strategy/thumb-viral-campaign-strategy-1.webp`
    - `assets/images/viral-campaign-strategy/thumb-viral-campaign-strategy-2.webp`
    - `assets/images/viral-campaign-strategy/thumb-viral-campaign-strategy-3.webp`
    - `assets/images/viral-campaign-strategy/thumb-viral-campaign-strategy-4.webp`
    - `assets/images/viral-campaign-strategy/thumb-viral-campaign-strategy-5.webp`
  + GIFS 
    - `assets/images/viral-campaign-strategy/img-gif-viral-campaign-strategy-1.gif`
    - `assets/images/viral-campaign-strategy/img-gif-viral-campaign-strategy-2.gif`



---


  + **embeddings-art-curation** [https://www.august.style/embeddings-art-curation/]

Beyond currently having the wrong images, this one really has SO MUCH powerful artwork I would like to consider breaking it into multiple entries. [https://developer-technologist.august.style/embeddings-art-curation]

We should review the post and decide how to sort these up. I've not yet created `thumb-` and `img-sq-` sets. 
  
  *WAVE PIXEL SORTING*
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-7.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-8.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-9.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-10.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-11.webp`
    - `assets/images/embeddings-art-curation/wave-pixel-sorting-embeddings-art-curation-12.webp`
  
  *WAVE GRADIENT PIXEL SORTING*
    - `assets/images/embeddings-art-curation/wave-gradient-pixel-sorting-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/wave-gradient-pixel-sorting-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/wave-gradient-pixel-sorting-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/wave-gradient-pixel-sorting-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/wave-gradient-pixel-sorting-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/wave-gradient-pixel-sorting-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/wave-gradient-pixel-sorting-embeddings-art-curation-7.webp`
    - `assets/images/embeddings-art-curation/wave-gradient-pixel-sorting-embeddings-art-curation-8.webp`
    - `assets/images/embeddings-art-curation/wave-gradient-pixel-sorting-embeddings-art-curation-9.webp`
    - `assets/images/embeddings-art-curation/wave-gradient-pixel-sorting-embeddings-art-curation-10.webp`
  
  *SOFTWARE GLITCHING EMBEDDINGS*
    - `assets/images/embeddings-art-curation/software-glitching-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/software-glitching-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/software-glitching-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/software-glitching-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/software-glitching-embeddings-art-curation-5.webp`
  
  *TRADITIONAL PIXEL SORTING*
    - `assets/images/embeddings-art-curation/pixel-sorting-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/pixel-sorting-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/pixel-sorting-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/pixel-sorting-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/pixel-sorting-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/pixel-sorting-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/pixel-sorting-embeddings-art-curation-7.webp`
    - `assets/images/embeddings-art-curation/pixel-sorting-embeddings-art-curation-8.webp`
    - `assets/images/embeddings-art-curation/pixel-sorting-embeddings-art-curation-9.webp`
    - `assets/images/embeddings-art-curation/pixel-sorting-embeddings-art-curation-10.webp`
  
  *DISTORTION PIXEL SORTING*
    - `assets/images/embeddings-art-curation/distortion-pixel-sorting-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/distortion-pixel-sorting-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/distortion-pixel-sorting-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/distortion-pixel-sorting-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/distortion-pixel-sorting-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/distortion-pixel-sorting-embeddings-art-curation-6.webp`
  
  *DIGITAL ENTROPY*
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-7.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-8.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-9.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-10.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-11.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-12.webp`
    - `assets/images/embeddings-art-curation/digital-entropy-embeddings-art-curation-13.webp`

  *DATA MOSHING*
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-7.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-8.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-9.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-10.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-11.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-12.webp`
    - `assets/images/embeddings-art-curation/datamoshing-embeddings-art-curation-13.webp`
  
  *COMPRESSION ARTIFACTS SORTING*
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-7.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-8.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-9.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-10.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-11.webp`
    - `assets/images/embeddings-art-curation/compression-artifacts-sorting-embeddings-art-curation-12.webp`






## Mobile Images Not On Entry Pages 

  1. Make them all the same aspect ratio and size 
  2. Ensure there is a component that can handle them on entry pages 
  4. Add to these pages, and add to ENTRY_SOP for `img-mobile-{slug}-1.webp`

  + **animated-cms-weekly-blogs** [https://www.august.style/animated-cms-weekly-blogs/]
    - `assets/images/animated-cms-weekly-blogs/img-mobile-animated-cms-weekly-blog-1.webp`
    - `assets/images/animated-cms-weekly-blogs/img-mobile-animated-cms-weekly-blog-2.webp`

  + **automated-e-commerce-shop-lookbook**
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-1.webp`
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-2.webp`
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-3.webp`
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-4.webp`
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-5.webp`
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-6.webp`

  + **training-yoga-sales**
    - `assets/images/training-yoga-sales/img-mobile-training-yoga-sales-1.webp`
    - `assets/images/training-yoga-sales/img-mobile-training-yoga-sales-2.webp`
    - `assets/images/training-yoga-sales/img-mobile-training-yoga-sales-3.webp`
