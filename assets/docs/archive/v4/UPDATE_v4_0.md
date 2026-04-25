# v4.0.0 Portfolio Update 

## Summary 

One more drilldown setting up a focused homepage that frames only the top 1% of project entries for each of 3 topical and specific groupings. 

### Overview 

Accompany a handful of project entry updates with a very carefully crafted homepage layout grouping our most powerful entries within specific, high skill or trade demand, groupings. This will introduce optional homepage components and improve the visual appeal, directing users to featured projects that have been made to perfectly illustrate highly employable work. Beyond the addition of new entries, and cleanup of others, we'll also make some minor layout adjustments like slideshow width and full VW bleed images. 

### Strategy 

Isolate three in-demand workplace skills in the homepage components. Illustrate them with a few, highly selective projects with a clear, focused objective. Included projects are top 1% in quality. They should perfectly continue to tell the story of that groupings focus to encapsulate visitors. 

Experiencing and exploring project media should move viewers, flowing naturally from homepage and into one of those premium work examples. The narrative must continue down the page where they're met with two other projects that expressly define that same homepage component sections skill or trade. 

Encourage them to remain blissfully unaware of the wildly generalist collection of 60+ projects, instead of getting distracted by visuals and tags on the section pages, they should maintain focused attention on the specific type of work at hand. 

### Homepage Focuses 

> Below each focus are tentatively agent-selected projects that have yet to be reviewed; any final selection will need to be refined and polished. 

  1. Website design/development
     - automated-e-commerce-shop-lookbook
     - animated-cms-weekly-blogs 
     - notes-app-thot 
     - freelance-payments-platform 
     - css-animated-micro-interactions
  2. Graphic/motion design
     - viral-campaign-strategy
     - baroque-de-heem-still-life
     - bau-noir-haus
     - bohemian-abstractions
     - art-nouveau-brand-design 
     - social-advertising-strategy
  3. AI pipeline custom solutions 
     - agentic-marketing-department
     - agentic-social-manager
     - api-automate-video-production
     - full-stack-automated-ecommerce
     - (FYC: automated-e-commerce-shop-lookbook, animated-cms-weekly-blogs also in web section)

### Entry Sorting 

- [x] 1. Review all currently published project entries
- [x] 2. Sort URLs into action items with focus groupings in mind 
- [ ] 3. Subpar or focus goal unrelated projects are moved to a fourth list
- [ ] 4. List four projects that need updates are moved to drafts 
- [ ] 5. Amp up showcase project's visual page layout 
- [ ] 6. Rewrite copy of showcase projects to fit homepage focuses
- [ ] 7. Tell engaging story through page overall
- [ ] 8. Assess count of showcase list projects after all projects are processed
- [ ] 9. Be selective; each focus only needs about 3, at most 5 entries
- [ ] 10. Add specific, well worded tag to all projects in 3 lists 

### Audit Attention 

  * **Titles promise motion/walkthrough/gallery but ship no slideshow/gif/embed; all claim animation in the title but have no motion artifact** 
    - css-animated-micro-interactions 
    - saas-product-sale-features 
    - amorphous-gradient-css-animation 
    - advanced-animation-system 

  * **Abbreviated-template copy with metric/achievement/notes inlined on one line; perhaps never filled in**
    - influencer-growth-strategy 
    - content-strategy-framework 
    - realtime-social-system 
    - illustrated-poetry-book
    - public-health-response-platform

  * **Mobile app entries missing GIF walkthrough** 
    - ai-meditation-mobile-app 
    - notes-app-thot 
    - ux-ui-ios-marketing

---

## New Copy Bites 

Building modern systems and processes by opening up systems to increase speed and productivity. 

Answering: What does it mean to rebuild ourselves to use AI, everything from how our teams are structured to how our data works? 

---

## Component Updates

### Lightroom Use Expansion 

Previously we only had the lightroom click-to-expand effect working for the thumbnail images. We need to expand this to work for virtually all media visuals on an `entry.html` page possible. 

### Entry Page Hero 

We will be implementing one type of hero element for all entries. Hero styles and changes directly below, and details on how to manage entries with media embed heroes below that.

#### Thumbnail Image Slideshow Hero

Entry page hero is currently a static image, randomly selected from the thumbnail images. Let's instead use the same slideshow tactic as our content tiles. Then we can completely remove our thumbnails from the right page content column completely and replace them with better media. 

Other than making sure we show thumbnail full height, we will also need the row of images, spaced, that go off page. However, what will really make this change powerful is that we will make the hero image container slideshow full width, letting the images bleed right to the edges of the page on all devices. 

**Below find the breakdown of two groups of essential styling information**

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

#### Moving Thumbnail Section & Embedding Heroes  

Right now the two columns are both 50% of the width of the page. We can make the left column larger for the text, and then might the right one more narrow to around 60% / 40%. 

Then remove the `.entry-tags-layout` > `.entry-tags-card` from the very top of the page. Render it as a narrow column instead of row, and place is in the 40% right column at the top of the column in the tag groupings like now, but with wrapping. 

Then, for any entry pages that had a Behance or Youtube embed as the hero, place that below the tag section. The responsiveness of these embeds looks really pretty as they get more and more narrow. If the user wants, they can click to expand or click through. 

Last thought is that this container of tags and media embed could be sticky and stay with the viewer as they scroll down, with them moving down along the left column just to the bottom. So it would be subtle — not far, but far enough to be intriguing. 




### **New**: Entry Page Bleed Images Section

For prints and some other images where a grid is too cropped in and the slideshows are too compact or small and non-visual, I want to be able to share images that are of any aspect ratio, laid out on the page just below the last bit of "Result" copy, with decent spacing around the images. This placement is intended to be used when we want images to be shown LARGE. 

I was going to say we could just place images as if they were GIFs, but I'd really like it if we were able to push the visual appeal of these images even further. We'd try to do this by making sure on desktop there are two per row, and mobile or tablet one per row, but importantly these images should BLEED. The right of the right image should meet the actual edge of the right page with no margin or padding, and then the same for the left image's left side. 

Let's call them BLEED in the filename which I'll define below. And this can mean we only ever provide even number of BLEED images. And the the last aspect that sets them apart from the GIF layout, let's apply the lightbox click-to-expand for these images as well. 

All together that will help make sure that if there are BLEED images to include that they get a SUPER visual, engaging presentation that let's them enjoy the piece as much as they want. 

I'm thinking that we'll be adjusting the homepage for an optional BLEED component as well so that I can make sure that my 

### Entry Page Bleed 

### Homepage Bleed 

### Images Treated Like GIF Layout 

### Story Tell Text Image Repeat 

  + https://www.august.style/agentic-fashion-designer/

---

## Fixes 

### Link Card Design 

The "project" and "repository" links look terrible. 
We need more flexibility for things like the store for published book or the website for them to explore. 

### Youtube Embeds 

They all look fuzzy on the page. 
Maybe we make them smaller. Double check if it has a good thumbnail upload in YT Studio. 
Example of issue that is present on every page that has a Youtube: `assets/docs/archive/v3/IMG/youtube-blurry-embed.jpg`
Strangely, when I went back to this one it was clear upon second reload; how?: `assets/docs/archive/v3/IMG/youtube-second-visit.jpg`
Confirmed: On second reload it does get clear. Why? 
Perhaps Youtube just isn't the best option. 

### Drafts Needing New Images 

Create new images  and list the local path to them below each entry in the list below. Agent should then add the images, which have been finalized, to CDN to get URL and update the `asset/docs/...` JSON entry, and then move the JSON to `assets/entries/...` to be published. 

**NEW IMAGE LIST**

  + https://www.august.style/scalable-augmented-generative-podcasts/
    - `assets/docs/uid-sqz-852.json`
  + https://www.august.style/burning-desire-distain/
    - `assets/docs/uid-xbk-777.json`
  + https://www.august.style/transmutations-hyperobject/
    - `assets/docs/uid-yel-369.json`
  + https://www.august.style/realtime-social-system/
    - `assets/docs/uid-sxz-828.json`
  + https://www.august.style/ux-ui-ios-marketing/
    - `assets/docs/uid-ssz-402.json`
  + https://developer-technologist.august.style/web3-strategy-branding/
    - `assets/docs/uid-rcy-132.json`
  + https://www.august.style/full-stack-automated-ecommerce/
    - `assets/docs/uid-scz-944.json`
  + https://developer-technologist.august.style/product-marketing-branding/
    - `assets/docs/uid-rvy-322.json`
  + https://www.august.style/content-strategy-framework/
    - `assets/docs/uid-slz-942.json`

**ALL DRAFTS TO SORT THROUGH** 

  - `assets/docs/uid-cvp-436.json`
  - `assets/docs/uid-dbr-368.json`
  - `assets/docs/uid-pzy-452.json`
  - `assets/docs/uid-vue-009.json`
  - `assets/docs/uid-xik-222.json`
  - `assets/docs/uid-xlk-592.json`
  - `assets/docs/uid-xpk-444.json`
  - `assets/docs/uid-ysl-128.json`
  - `assets/docs/uid-yvg-990.json`
  - `assets/docs/uid-yxl-432.json`

**FINALIZED READY FOR AGENT**

  + `assets/docs/uid-sqz-852.json` — slug: scalable-augmented-generative-podcasts
    - 


### Entry Page Sections 

* **Lightroom added to GRIDS**
  - https://www.august.style/api-automate-video-production/
   
* **Consider removing thumbnail section and replace with better option**
  - https://www.august.style/training-yoga-sales/
   
### Related Post Design 

The newly added contextual tags `.tile-tags` below the `.tile-text-area`. 
This issue might also exist on section pages when not full desktop view, like in tablet. 

`.tile-text-area` uses the following. 

```css
{
  .grid-related .tile-text-area {
    width: 60%;
  }
}
```

Similar adjustment can be added to `.tile-tags` but more adjustments are needed. I added "align-self: center", "flex-wrap: wrap", and then the same "width: 60%".  

```css
}
  .tile-tags {
    display: flex;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    overflow-x: scroll;
    scrollbar-width: none;
    align-self: center;
    flex-wrap: wrap;
    width: 60%;
  }
}
```

Actually, on the section pages, it looks like the layout for `.tile-tags` what handled, possibly in `.tile-grid`. 
`assets/docs/archive/v3/IMG/tile-tags-on-section-page.jpg`


---

## Designer 

**Need BLEED images and section**

## Design Swarms 

  + https://www.august.style/data-visualization-dashboard/
  + https://www.august.style/ai-meditation-mobile-app/

### Illustration 

**Print paperback art**

  + https://www.august.style/illustrated-poetry-book/
    - Need STORE LINK url card https://www.barnesandnoble.com/w/pantone-3537-up-sean-august-horvath/1129908743

**Animation and motion design** 

  + https://www.august.style/advanced-animation-system/

### Art History

Describe flow on a main page: Research, Describe, Create pipeline, Generate, Prune, Curate. 
The page titles shouldn't be the name of the collection. URLs are not SEO friendly either for this reason. 

  + https://www.august.style/surreal-constructivism-perception/
  + https://www.august.style/pie-claesz-modern-vibes/
  + https://www.august.style/baroque-de-heem-still-life/
  + https://www.august.style/flat-bauhaus/
  + https://www.august.style/pie-claesz/
  + https://www.august.style/bau-noir-haus/
  + https://www.august.style/neo-expresi-cyber/
  + https://www.august.style/minimalism-bauhaus/
  + https://www.august.style/humanistic-exploration/
  + https://www.august.style/constructi-landscapes/
  + https://www.august.style/all-that-glitters/
  + https://www.august.style/surreal-constructivism/
  + https://www.august.style/gradient-bauhaus/
  + https://www.august.style/art-nouveau-brand-design/
  + https://www.august.style/constructivist-profiles/
  + https://www.august.style/constructi-haus/
  + https://www.august.style/flowering-symmetric-asymmetry/
  + https://www.august.style/psychedelic-impressi/

### Websites 

Make it clearer that they can click through to see website. 
GIFs would better show the site flow. 
All have horrible looking Youtube embed. 

**Need BLEED images and section** 

  + https://www.august.style/ai-design-fashion-lookbook/
  + https://www.august.style/personalized-fashion-magazine/
  + https://www.august.style/amorphous-gradient-css-animation/
  + https://www.august.style/visual-artist-process-portfolio/
  + https://www.august.style/blog-lookbook-print-gallery/
  + https://www.august.style/automated-e-commerce-shop-lookbook/
  + https://www.august.style/saas-product-sale-features/

Used images in slideshow but didn't work out great; should do BLEED. 

  + https://www.august.style/bohemian-abstractions/

Focus on pipeline of how I automated the research, then what was presented and how. 

  + https://www.august.style/css-animated-micro-interactions/

Pull out the different components and show them one at a time with text, then image, text, then image. 

  + https://www.august.style/modular-portfolio-build/

Urgent fast turnaround focus. 

  + https://www.august.style/public-health-response-platform/

This isn't clear if it is focused on the massive blog creation pipeline or the animations (NOT ANIMATIONS I found that one here https://www.august.style/advanced-animation-system/)

  + https://www.august.style/animated-cms-weekly-blogs/

Better images instead of thumbnail images on page. 

  + https://www.august.style/minimalist-web-store-product/
  + https://www.august.style/freelance-payments-platform/

---

## AI System Operations 

### Generative 

Where are the posts just about pipeline creating the lookbook images. Link to the lookbooks. 

  + https://www.august.style/ai-design-fashion-lookbook/
  + https://www.august.style/personalized-fashion-magazine/

This is framed as being about images and it is about turning images into video. The important thing would be more Marketing Innovations framed; exploring new mediums and tools as soon as they're available. 

  + https://www.august.style/fashion-ai-video/

Huge post with giant AI pipeline. 

  + https://www.august.style/embeddings-art-curation/

### Content Production 

  + https://www.august.style/agentic-marketing-department/
  + https://www.august.style/api-automate-video-production/
  + https://www.august.style/agentic-social-manager/
    - Needs better thumbnail
  + https://www.august.style/ai-virtual-photoshoot-design/
  + https://www.august.style/agentic-fashion-designer/
    - Needs images on page not slides 

---

## App Development 

Needs Youtube fix at least. 

  + https://www.august.style/notes-app-thot/

---

## Marketing & Social Management 

  + https://www.august.style/viral-campaign-strategy/
  + https://www.august.style/influencer-growth-strategy/
  + https://www.august.style/technical-defi-content-simplification/
  + https://developer-technologist.august.style/product-marketing-branding/
  + https://www.august.style/social-advertising-strategy/