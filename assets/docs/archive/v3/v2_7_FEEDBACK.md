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

## Entry Page Media 

### The New Components 

  + We need to implement a light box type behavior for the thumbnails so that they're smaller and compact, but click-to-expand 
  + We need to redesign the slideshow currently on the pages 
    - Should look like old portfolio slideshow `assets/docs/archive/v2/IMG/slide-show-example.jpg`
    - Class `.slideshow-container .presentation-style` from modular build `/Users/seanivore/Development/portfolio/CONVENTIONS.md`
  + The current slideshow has unknown image source, probably just thumbnails again; this should be changed according to below 

### All Media Components 

  1. Single hero embed OR randomized thumbnail image (if no embed) 
  2. Smaller, click-to-expand light box behavior compact two-column thumbnails 
  3. GIF images of any ratio with decent spacing in single column below main copy and thumbnails 
  4. Image Grid with 1x1 aspect ratio images, 3 across and 3 down, below GIFs if applicable 
  5. Slideshow update with new slideshow design, filled with mobile images or slide images defined below  

### Diagram Layout Of Components 

**MUST SEE VISUAL GUIDE**: `assets/docs/archive/v2/IMG/diagram-entry-page-components.jpeg`

  1. RED "embed" 
     - Video embed takes first priority 
     - If no video, then randomized thumbnail  
  2. GREEN "thumb" 
     - Make this column two columns 
     - Thumbnails get smaller, but click-to-expand 
     - All thumbnails displayed in this section, none after the body text 
  3. YELLOW "gif" 
     - First priority directly below the body text blocks and thumbnail grid 
     - These can be any aspect ratio and should have comfortable spacing and size 
     - There can be anywhere from 1 to ~6 to display in a single column 
  4. BLUE "grid" 
     - Second priority directly below the body text blocks and thumbnail grid, as well as GIFs if those exist for the project
     - These should be 1x1 aspect ratio and 1080 px square images; 3 across and 3 down, etc.
     - These are **NOT** the `data.img`, i.e. `img-sq-{slug}-1.webp` as those are simply differently cropped thumbnails for the homepage hero 
     - THese are only image at `data.grid`, i.e. `img-grid-{slug}-1.webp`
  5. PURPLE "slideshow" 
     - Last priority below the body text blocks, thumbnail grid, and, if applicable, the GIFs and image grid 
     - If there are not any GIFs or any grid images for the project, then this would be directly below the body text blocks and thumbnail grid columns 
     - These **CAN BE MOBILE IMAGES** from `data.mobile_img`, i.e. `img-mobile-{slug}-1.webp`
     - These also could any images provided as `slide-{slug}-1.webp`, at `data.slideshow` 
     - The slideshow can contain either mobile or slideshow images, or both 
     - None of the images, neither mobile nor slide, need to be any specific ratio; they'll be downsized and mobile will attempt to be consistent per project
     - The idea with putting the mobile images in the slideshow is that they will be tall and narrow so more than one could display at a time 
     - This logic should be applied so that if it is displaying a `img-mobile-{slug}-1.webp` then it should show more than one of them at a time 
     - If it is showing `slide-{slug}-1.webp` then it should behave normally showing one image at a time 

### Expanded JSON Schema 

**SEE UPDATE**: `assets/docs/_entry_template.json`

```JSON 
  "thumb": [
    "https://cdn.august.style/media/{slug}/thumb-{slug}-1.webp"
  ],
  "thumb_alt": "Alt text for thumbnail slideshow",
  "img": [
    "https://cdn.august.style/media/{slug}/img-sq-{slug}-1.webp"
  ],
  "img_alt": "Alt text for square images",
  "mobile_img": [
    "https://cdn.august.style/media/{slug}/img-mobile-{slug}-1.webp"
  ],
  "mobile_img_alt": "Alt text for mobile images",
  "grid": [
    "https://cdn.august.style/media/{slug}/img-grid-{slug}-1.webp"
  ],
  "grid_alt": "Alt text for grid images",
  "slideshow": [
    "https://cdn.august.style/media/{slug}/slide-{slug}-1.webp"
  ],
  "slideshow_alt": "Alt text for slideshow images",
  "gif": [
    "https://cdn.august.style/media/{slug}/gif-{slug}-1.webp"
  ],
  "gif_alt": "Alt text for gif images",
```

---

## Media Fixes And Additions 

  **FIXING WRONG IMAGES**
  1. Agent uploaded inaccurate screenshot to CDN
  2. Accurate image saved locally using same filename
  3. Delete old from CDN and upload new
  4. Or rename and upload new, and fix JSON
  5. All other information is accurate, only images are wrong

  **ADDING MISSING VIDEO EMBEDS**
  1. Add provided YouTube video to newly created portfolio entries
  2. Adjust iFrame according to ENTRY_SOP.md guidelines

  **ADDING MISSING MEDIA LIKE GIFS OR MOBILE IMAGES**
  1. Add missing media to entry
  2. Adjust JSON to include new media

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

### 7. Add Mobile Images To Entry: **animated-cms-weekly-blogs**
  https://www.august.style/animated-cms-weekly-blogs/
  + MOBILE IMG 
    - `assets/images/animated-cms-weekly-blogs/img-mobile-animated-cms-weekly-blog-1.webp`
    - `assets/images/animated-cms-weekly-blogs/img-mobile-animated-cms-weekly-blog-2.webp`

### 8. Add Mobile Images To Entry: **automated-e-commerce-shop-lookbook** 
  https://www.august.style/automated-e-commerce-shop-lookbook/
  + MOBILE IMG 
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-1.webp`
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-2.webp`
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-3.webp`
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-4.webp`
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-5.webp`
    - `assets/images/automated-e-commerce-shop-lookbook/img-mobile-automated-e-commerce-shop-lookbook-6.webp`

### 9. Add Mobile Images To Entry: **training-yoga-sales**
  https://www.august.style/training-yoga-sales/
  + MOBILE IMG 
    - `assets/images/training-yoga-sales/img-mobile-training-yoga-sales-1.webp`
    - `assets/images/training-yoga-sales/img-mobile-training-yoga-sales-2.webp`
    - `assets/images/training-yoga-sales/img-mobile-training-yoga-sales-3.webp`

---

## Complete Reassessment Of Project Framing 

### 1. Storytelling Adjustments And Fixing Wrong Images: **embeddings-art-curation**
  https://www.august.style/embeddings-art-curation/
  https://developer-technologist.august.style/embeddings-art-curation (original post) 

Beyond currently having the wrong images, this one really has SO MUCH powerful artwork I would like to consider breaking it into multiple entries.
We should review the post and decide how to sort these up. I've not yet created `thumb-` and `img-sq-` sets. They do sort of make sense in this order and in the following groups. Perhaps the naming / labeling could be even better than they had originally been labeled, which just came from the prompts used when creating the images. 

  **PREVIEW** 
  + GROUP_1 `assets/images/embeddings-art-curation/GROUP_1.webp`
  + GROUP_2 `assets/images/embeddings-art-curation/GROUP_2.webp`
  + GROUP_3 `assets/images/embeddings-art-curation/GROUP_3.webp`
  + GROUP_4 `assets/images/embeddings-art-curation/GROUP_4.webp`
  + GROUP_5 `assets/images/embeddings-art-curation/GROUP_5.webp`
  + GROUP_6 `assets/images/embeddings-art-curation/GROUP_6.webp`

  + **GROUP_1**: wave-gradient-pixel-sorting & wave-pixel-sorting
    - `assets/images/embeddings-art-curation/GROUP_1/wave-gradient-pixel-sorting-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/GROUP_1/wave-gradient-pixel-sorting-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/GROUP_1/wave-gradient-pixel-sorting-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/GROUP_1/wave-gradient-pixel-sorting-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/GROUP_1/wave-gradient-pixel-sorting-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/GROUP_1/wave-pixel-sorting-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/GROUP_1/wave-pixel-sorting-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/GROUP_1/wave-pixel-sorting-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/GROUP_1/wave-pixel-sorting-embeddings-art-curation-4.webp`
  + **GROUP_2**: datamoshing
    - `assets/images/embeddings-art-curation/GROUP_2/datamoshing-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/GROUP_2/datamoshing-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/GROUP_2/datamoshing-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/GROUP_2/datamoshing-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/GROUP_2/datamoshing-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/GROUP_2/datamoshing-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/GROUP_2/datamoshing-embeddings-art-curation-7.webp`
    - `assets/images/embeddings-art-curation/GROUP_2/datamoshing-embeddings-art-curation-8.webp`
    - `assets/images/embeddings-art-curation/GROUP_2/datamoshing-embeddings-art-curation-9.webp`
  + **GROUP_3**: traditional-pixel-sorting
    - `assets/images/embeddings-art-curation/GROUP_3/pixel-sorting-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/GROUP_3/pixel-sorting-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/GROUP_3/pixel-sorting-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/GROUP_3/pixel-sorting-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/GROUP_3/pixel-sorting-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/GROUP_3/pixel-sorting-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/GROUP_3/pixel-sorting-embeddings-art-curation-7.webp`
    - `assets/images/embeddings-art-curation/GROUP_3/pixel-sorting-embeddings-art-curation-8.webp`
    - `assets/images/embeddings-art-curation/GROUP_3/pixel-sorting-embeddings-art-curation-9.webp`
  + **GROUP_4**: compression-artifacts-sorting
    - `assets/images/embeddings-art-curation/GROUP_4/compression-artifacts-sorting-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/GROUP_4/compression-artifacts-sorting-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/GROUP_4/compression-artifacts-sorting-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/GROUP_4/compression-artifacts-sorting-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/GROUP_4/compression-artifacts-sorting-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/GROUP_4/compression-artifacts-sorting-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/GROUP_4/compression-artifacts-sorting-embeddings-art-curation-7.webp`
    - `assets/images/embeddings-art-curation/GROUP_4/compression-artifacts-sorting-embeddings-art-curation-8.webp`
    - `assets/images/embeddings-art-curation/GROUP_4/compression-artifacts-sorting-embeddings-art-curation-9.webp`
  + **GROUP_5**: distortion-pixel-sorting & software-glitching
    - `assets/images/embeddings-art-curation/GROUP_5/distortion-pixel-sorting-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/GROUP_5/distortion-pixel-sorting-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/GROUP_5/distortion-pixel-sorting-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/GROUP_5/distortion-pixel-sorting-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/GROUP_5/distortion-pixel-sorting-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/GROUP_5/distortion-pixel-sorting-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/GROUP_5/software-glitching-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/GROUP_5/software-glitching-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/GROUP_5/software-glitching-embeddings-art-curation-3.webp`
  + **GROUP_6**: digital-entropy
    - `assets/images/embeddings-art-curation/GROUP_6/digital-entropy-embeddings-art-curation-1.webp`
    - `assets/images/embeddings-art-curation/GROUP_6/digital-entropy-embeddings-art-curation-2.webp`
    - `assets/images/embeddings-art-curation/GROUP_6/digital-entropy-embeddings-art-curation-3.webp`
    - `assets/images/embeddings-art-curation/GROUP_6/digital-entropy-embeddings-art-curation-4.webp`
    - `assets/images/embeddings-art-curation/GROUP_6/digital-entropy-embeddings-art-curation-5.webp`
    - `assets/images/embeddings-art-curation/GROUP_6/digital-entropy-embeddings-art-curation-6.webp`
    - `assets/images/embeddings-art-curation/GROUP_6/digital-entropy-embeddings-art-curation-7.webp`
    - `assets/images/embeddings-art-curation/GROUP_6/digital-entropy-embeddings-art-curation-8.webp`
    - `assets/images/embeddings-art-curation/GROUP_6/digital-entropy-embeddings-art-curation-9.webp`
