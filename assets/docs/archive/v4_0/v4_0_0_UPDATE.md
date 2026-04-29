# Content Strategy Update 

**Created**: 2026-04-27 17:12
**Updated**: 2026-04-29 03:03
**Version**: v3.1.0 -> v4.0.0
**Features**: Focused skill targeting; media and component layout upgrades 
**Status**: Drafting 

## Overview

I started writing the v4.0.0 update the other day. Then decided I should "jump start" things by just focusing on the entries that I want to highlight specifically for the three main focuses of the homepage I'm preparing to propose everything is framed around, turning a 50+ project UX into a 3-perfect-projects for each of 3 skill focuses. 

I went through all of the entries. Collected different groupings. Made sure all of the entries that needed new images but weren't too relevant or too strong were moved to the new `/docs/drafts/...` directory and no longer published. 

Then the more I contemplated how to present these thee focuses and very selective projects that each need to be polished and work together for the narrative, I ended up realizing that all of the updates I wanted for v4.0.0 are the tools to make this happen. And so now I present to you the proposal for a really strong refocusing that should help making the overall story of my skills more compelling by being better focused and digestible, without the sprinkling of mediocre projects in between everything, staring with the lead-in I wrote all those days ago. 

---

## Summary 

This is an update that will create three skill-based focus areas on the homepage that are each backed by top 1% project entries optimized for a consistent skill set narrative. 

### Objective 

Create updated homepage components designed to better highlight the story of carefully selected skill sets beside innovative new directions for my current digital services and products. Homepage focuses will be backed up by directing viewers toward deep examples of these in-demand skills. This will require a combination of some projects into new entries and introduce variable project entry layouts that will enable a more visual and narrative style of storytelling. 

### Strategy 

Isolate three in-demand workplace skills in the homepage components. Illustrate them with a few, highly selective projects with a clear, focused objective. Included projects are top 1% in quality. They should perfectly continue to tell the story that the homepage skill groupings focus on to encapsulate visitors. 

Exploring project media naturally moves viewers into those premium work examples, with the narrative continuing on down the page where they're met with the other projects that expressly define the same skill or trade from that homepage section.

The experience around these newly updated project and three focus areas will intentionally keep visitors relatively gated within those topics. We don't need recruiters, hiring managers, or potential clients coming to the site and getting overly distracted by the huge 50+ entry collection of wildly generalist projects. They should maintain focused attention on the specific type of work they clicked to see examples of. 

### Homepage Focuses 

With a "custom AI pipeline solution" as an overarching theme, the homepage will be focused on three main areas of focus: 

  1. Website design/development
  2. Graphic/motion design
  3. Social design/strategy

### New Copy Bites 

  - Building modern systems and processes by opening up systems to increase speed and productivity. 

  - Answering: What does it mean to rebuild ourselves to use AI, everything from how our teams are structured to how our data works? 

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

The different updates, additions, and changes below may influence each other. Please read and understand in full before making any implementation plans.

### Simple Updates 

  1. **Eliminate Slideshow Component** 

Pages that currently have slideshows will be changing to another method of displaying the images. The slideshows don't do the content justice, make the images hard to read, and just feel like an out-of-style display component. 

After introducing th rest of the `entry.html` component or layout changes below, each page will be assess and include details on how it should be altered to replace the slideshow. 

  1. **Lightbox Images Everywhere**

Expand the use of the Lightbox click-to-expand effect. It would be helpful in the grid images, and then the other component layouts, even when the image is already on the larger size, seem like there's no reason why we shouldn't stay consistent and give them the same lightbox effect as well. It might be useful for viewers with giant monitors. 

### Thumbnail Slideshow Hero

This update should create a UX that is almost exactly the same as how users engage with the thumbnails on the actual content tiles seen in `section.html` and at the bottom of the `entry.html` page in the related projects section. This is an intentional, artistic choice. It tells the visitor that they can engage with the images like they did in the content tiles and related thumbnails they just saw. 

Since the thumbnails are currently on the right column of `.entry-content-media`, they will need to be removed and the [plan for the replacement will be detailed below](#tag-and-media-embed-column).

There will also be a [new page layout option described below](#alternate-layout-options); this updated hero will be the same no matter what layout style the rest of the entry page is set to. 

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

### Alternate Layout Options

The hero update shall remain consistent regardless of the rest of the page's layout or components. 

I'm assuming that the cleanest way to update this will be to add a JSON entry value to specifies the layout for that project, and then when loading the project it uses a different dynamic layout. The other consideration was having the project load route to an entirely new `entry-alt.html` instead of `entry.html`, but I'm assuming that that would be an unnecessarily complicated way to make this update. 

As of right now there is only one other proposed layout that would replace just the upper section, the `.entry-content-media` which has two column. I'm seeing "Two-column: Text + Compact Thumbnail Grid with Lightbox" in the browser dev inspector tools. 

In case we come up with future layout options, I'd propose this kind of JSON adjustment rather than something boolean. Obviously, please use whatever consistent term for each layout type for the value. The "id" value is only provided to give context. 

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

  - Can be static .webp images, .gif animations, or a mix of both
  - The flow group number at the front of the filename denotes the order down the page, from 1 to X 
  - Visual media and text alternates down the page through the flow 
  - There is no specific number of flow groups; the page narrative ends when there are no more groups provided 
  - The alt tag will be the same for each visual media element in the same flow group 

**Text row details** 

  - The flow narrative always starts with text, as this would be placed just below the hero image
  - This allows for a more dynamic storytelling experience that the slideshows and other projects were lacking
  - Text in the flow should be around 1-3 sentences long
  - The text rows in a flow narrative should be much larger than the standard paragraph font selection currently used

**Image row details** 

  - Images are either 16:9 at 1920 px wide, or 1:1 at 1080 px wide
  - Flows are numbered in order, with 1 being first 
  - Each flow's images should be full page width and centered
  - Flows will have varying numbers of images to place in that one, page width, centered row 
  - Groups of images will be selected thoughtfully, pairing for example three square images, or at most two 16:9 images 
  - Other projects, like those with text-heavy screenshots of an AI pipeline process, will have just one 16:9 image
  - Even these single images should be made full width and centered so that the image content is easily legible 

**Image filename details** 

  - They largely follow the same pattern as other image types 
  - The filename starts with the flow group number 
  - If there is only one image in the flow group, there might not be a number before .ext or it will just be a 1
  - If the flow is a group of photos, they will be numbered at the end of the filename before the .ext

**JSON Schema Update** 

  - Below is simply a suggestion for how these components might be handled in the JSON 
  - The "copy" field, as seen below, is the the text row that sits between images 
  - The "copy" field, on the last flow row, is optional, as this means the narrative is meant to end with a visual 
  - No other "copy" field is optional 
  - Because of the intention of creating this type of layout, it is unlikely that there will be only 3 rows as in the example below
  - Many of the slideshows that we want to turn into scrollytelling narratives have 10 or more slide images, though these might end up in groups 
  - You'll note that I separated out the grouping here — I'm not sure if it makes more sense than how I presented the other schema examples, but please use your best judgement and alter accordingly and be consistent 

```json
{
  "flow_1": {
    "copy": "This is the first line of flow storytelling text. This blurb of text has a lot more to say about what is happening with the project and what is being shown in the images before and then after this message. Even with its length, it should still be able to be larger than the standard paragraph style font size. The text and then image flow should be like a full visual, longer scroll, experience. It is possible the first text row in a narrative might be longer than others to set the tone and provide a more complete overview of the project.",
    "img": [
      "https://cdn.august.style/media/{slug}/flow-1-{slug}-1.webp"
    ]
    "alt": ""
  },
  "flow_2": {
    "copy": "This is a line of flow text, the second. It is not that long.",
    "img": [
      "https://cdn.august.style/media/{slug}/flow-2-{slug}-1.gif",
      "https://cdn.august.style/media/{slug}/flow-2-{slug}-2.gif"
    ],
    "alt": ""
  },
  "flow_3": {
    "copy": null,
    "img": [
      "https://cdn.august.style/media/{slug}/flow-3-{slug}-1.webp"
    ],
    "alt": ""
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

## Homepage Adjustments

### Featuring Content

This is regarding the `assets/docs/tags.json` file and the new components, given they are intended to show only about 3 of our absolute best project entries. Because of the limited number of posts to be associated with the focused homepage components for display, and because we're not going to have time to spend updating and perfecting the actual contents of more than these select project entry pages, it is unlikely that any combination of the normal tagging will suffice to get a component to display exactly which projects are desired. 

However, we also do not want to break the standard of there *only* being tags on the `assets/docs/tags.json` file when adjusting what get displayed on the homepage components. 

For this reason, I'd like to propose creating a new tag that is just **FEATURED**. It doesn't need its own category. It does not need to be shown on the entry page tag group, or below the content tiles on section pages or else where, and it doesn't need to be a filtering option on the section page. This tag will exclusively be used to tell each component section that we add to the homepage `assets/docs/tags.json` document which of our projects have been adjusted to properly tell the exact narrative that is desired for that component's skill focus. 

### Homepage Bleed Image Component

This component should be very similar to the entry page bleed image component. Some important distinctions and reiterations. 

  - Instead of a lightbox expansion, clicking an image should lead the viewer to that image's project entry page
  - The images displayed should consist of *any* `bleed-1-{slug}-1.webp` image, no matter the bleed-number or image count number 
  - The images displayed should come from *any* of the projects tagged with **featured** 
  - The images displayed must be shuffled randomly from all project with that tag 
  - The images must be re-shuffled and randomly displayed on *every single page refresh* — this is essential for the UX 
  - The component will, like the entry component, have no space between rows, between images in a row 
  - The image rows must bleed to the edge of the screen no matter the size of the device 
  - The height of every image in a row should be the same, with the width of adjusted images changed not to distort the image 
  - The height of every row should not be the same as the other rows 
  - Pull the height of each row from the height produced when all images in the row are the same height and reach from edge to edge of the page 
  - On desktop, the shuffling should choose 3 or 5 images per row, alternating the number of images displayed per row
  - On desktop, the shuffling should create 4 or 6 rows depending on the total number of images across all the **featured** tagged pages 
  - On mobile, the layout should not shift to a single image per row column 
  - Instead, the mobile version should just simplify to 2 to 4 images per row, alternating the number of images displayed per row
  - And on mobile, simplify to 3 or 4 rows depending on the total number of images across all the **featured** tagged pages 

### Remaining Homepage Sections 

I came across something we should explore and understand called 'HyperFrames' where the specifically created a Claude Code skill plugin. The examples on Twitter were really impressive. It was described as "Claude can design .md to .mp4. and I found this GitHub repo with the code: `https://github.com/heygen-com/hyperframes` — please explore that repository and let me know what might be possible; it calls out this command `npx skills add heygen-com/hyperframes` but it failed on my first try; hopefully you know something I don't so we can get it working. 

For now I'd like to use this to consider the hero/masthead because it still feels a bit janky and given there will be two other sections, and some text with all three, I'm wondering if maybe we don't actually want the kind of slideshow animated visual masthead and could instead do something that is simpler but more impressive, clean, modern, unique. Something that seems like it took a bit more effort to get really polished, whereas the current masthead slideshow just looks like simple vanilla HTML/CSS. 

As I'm going through the entry pages and grouping them for these changes, I'll think of how we want to present the other two focus areas, as well as what copy we want to pair with all of them, including the bleed image component already added above. It seemed like a good idea to hand this over to get started first though. Perhaps you can help with the copy drafts to get me started based on the details given so far, particularly at the top of this document. 

---

## Project Entry Review 

  + Worth of keeping published? 
  + Worth having on homepage? 
  + Quality slug? 
  + Status of visuals? 
  + Status of layout? 
  + Does it fit a main focus? 
  + Any other adjustments? 

### Pages 

  - [x] /constructivist-profiles/
  - [x] /illustrated-poetry-book/
  - [x] /advanced-animation-system/
  - [x] /gradient-bauhaus/
  - [x] /ai-design-fashion-lookbook/
  - [x] /data-visualization-dashboard/
  - [x] /agentic-marketing-department/
  - [x] /constructi-haus/
  - [x] /constructi-landscapes/
  - [x] /all-that-glitters/
  - [x] /surreal-constructivism-perception/
  - [x] /flowering-symmetric-asymmetry/
  - [x] /psychedelic-impressi/
  - [x] /saas-product-sale-features/
  - [X] /animated-cms-weekly-blogs/
  - [X] /viral-campaign-strategy/
  - [x] /bau-noir-haus/
  - [x] bohemian-abstractions
  - [x] influencer-growth-strategy
  - [x] visual-artist-process-portfolio
  - [x] blog-lookbook-print-gallery
  - [X] pie-claesz-modern-vibes
  - [X] flat-bauhaus
  - [X] pie-claesz
  - [X] css-animated-micro-interactions
  - [X] api-automate-video-production
  - [X] training-yoga-sales
  - [X] automated-e-commerce-shop-lookbook
  - [X] personalized-fashion-magazine
  - [X] social-advertising-strategy
  - [X] ai-virtual-photoshoot-design
  - [X] agentic-social-manager
  - [X] baroque-de-heem-still-life
  - [X] public-health-response-platform
  - [x] minimalism-bauhaus
  - [X] technical-defi-content-simplification
  - [X] humanistic-exploration
  - [X] minimalist-web-store-product
  - [X] agentic-fashion-designer
  - [X] neo-expresi-cyber
  - [X] surreal-heads
  - [X] art-nouveau-brand-design
  - [X] surreal-constructivism
  - [X] modular-portfolio-build
  - [X] notes-app-thot
  - [X] amorphous-gradient-css-animation
  - [X] fashion-ai-video
  - [X] ai-meditation-mobile-app
  - [X] freelance-payments-platform

---

## Page Updates 

### Unpublish 

**No action, just unpublish** 

  - all-that-glitters

**Action then unpublish**

  - visual-artist-process-portfolio
    - Find branding and character development web3 content to post 
    - Find motion graphic videos from web3 content to post 
    - *FOUND* technical-defi-content-simplification

### Art History 

  - Describe flow on a main page: Research, Describe, Create pipeline, Generate, Prune, Curate. 
  - The page titles shouldn't be the name of the collection. URLs are not SEO friendly either for this reason. 

| Group                      | Page                              |
| -------------------------- | --------------------------------- |
| **Geometric Abstractions** | -                                 |
|                            | constructivist-profiles           |
|                            | constructi-landscapes             |
|                            | surreal-constructivism-perception |
|                            | humanistic-exploration            |
|                            | surreal-constructivism            |
| **Bauhaus Variations**     | -                                 |
|                            | gradient-bauhaus                  |
|                            | constructi-haus                   |
|                            | bau-noir-haus                     |
|                            | bohemian-abstractions             |
|                            | flat-bauhaus                      |
|                            | minimalism-bauhaus                |
| **Art Nouveau**            | -                                 |
|                            | flowering-symmetric-asymmetry     |
|                            | art-nouveau-brand-design          |
| **Imp. Psych.**            | -                                 |
|                            | psychedelic-impressi              |
|                            | neo-expresi-cyber                 |
|                            | surreal-heads                     |
| **Baroque**                | -                                 |
|                            | pie-claesz-modern-vibes           |
|                            | pie-claesz                        |
|                            | baroque-de-heem-still-life        |

#### Generative Design 

 - Design swarm websites and apps 
 - ai-virtual-photoshoot-design *project management, image generation*
 - fashion-ai-video *image to video*

---

## Featured Focus 

### Graphic/Motion Design 

| Project/Page                 | Automation | Agentic | Generative | Group | Flow |
| ---------------------------- | ---------- | ------- | ---------- | ----- | ---- |
| *all art history pages*      | x          |         | x          | x     | x    |
| ai-virtual-photoshoot-design |            | x       | x          |       | x    |
| advanced-animation-system    |            |         |            |       |      |
| illustrated-poetry-book      |            |         |            |       |      |

**Branding & Character Development**

### Website Design/Development 

| Page                               | Automation | Agentic | Generative | Group | Flow |
| ---------------------------------- | ---------- | ------- | ---------- | ----- | ---- |
| **Fashion Production**             |            |         |            |       |      |
| ai-design-fashion-lookbook         | x          | x       | x          | x     | x    |
| personalized-fashion-magazine      | x          | x       | x          | x     | x    |
| automated-e-commerce-shop-lookbook | x          |         |            |       | x    |
| agentic-fashion-designer           | x          | x       | x          | x     | x    |
| **Design Swarms**                  |            |         |            |       |      |
| ai-meditation-mobile-app           |            | x       | x          | x     | x    |
| data-visualization-dashboard       |            | x       | x          | x     | x    |
| saas-product-sale-features         |            | x       | x          | x     | x    |
| **AI Production Pipeline**         |            |         |            |       |      |
| animated-cms-weekly-blogs          | x          |         | x          |       | x    |
| blog-lookbook-print-gallery        | x          |         |            |       |      |
| css-animated-micro-interactions    | x          | x       |            |       | x    |
| minimalist-web-store-product       |            | x       |            |       | x    |
| modular-portfolio-build            |            | x       |            |       | x    |
| notes-app-thot                     |            | x       |            |       | x    |
| amorphous-gradient-css-animation   |            | x       |            |       | x    |
| freelance-payments-platform        |            | x       |            |       |      |
| **Client Webflow/Framer Work**     |            |         |            |       |      |
| public-health-response-platform    |            |         |            |       |      |
| training-yoga-sales                |            |         |            |       | x    |

### Social Design/Strategy 

| Project                               | AI Pipeline | Video | Image | Strategy | Group | Flow |
| ------------------------------------- | ----------- | ----- | ----- | -------- | ----- | ---- |
| api-automate-video-production         | x           | x     |       |          | x     | x    |
| viral-campaign-strategy               |             | x     | x     | x        |       | x    |
| influencer-growth-strategy            |             |       |       | x        |       | x    |
| social-advertising-strategy           |             | x     | x     | x        | x     | x    |
| agentic-social-manager                | x           | x     | x     | x        | x     | x    |
| technical-defi-content-simplification |             | x     | x     | x        | x     | x    |
| fashion-ai-video                      |             | x     |       |          | x     | x    |
| agentic-marketing-department          | x           | x     | x     |          | x     | x    |

---

## Top Entries 

### AI Art Pipeline 

  1. Art Education Curation 
     + `assets/drafts/uid-chp-854.json` 
       - https://www.august.style/embeddings-art-curation/
       - https://developer-technologist.august.style/embeddings-art-curation

  2. Personality-Based Fashion Design 
     + `assets/entries/uid-svz-258.json` 
       - https://www.august.style/agentic-fashion-designer/
       - https://print-shop-fashion.august.style/fashion/lookbook/summer-2024-cover
       - https://www.august.style/personalized-fashion-magazine
       - https://www.august.style/ai-design-fashion-lookbook

  3. Content Production Video Shorts
     + `assets/entries/uid-sxz-424.json`
       - https://www.august.style/api-automate-video-production/
       - https://developer-technologist.august.style/api-automate-video-production

### Graphic/Motion Design 

  1. Production & Branding 
     + `assets/entries/uid-wty-542.json`
       - https://www.august.style/visual-artist-process-portfolio/
       - https://visual-producer.august.style/

  2. Digital Illustration for Print 
     + `assets/entries/uid-cop-802.json`
       - https://www.august.style/illustrated-poetry-book/
       - https://developer-technologist.august.style/illustrated-poetry-book

  3. VFX 3D Perspective Infinite Grid Tunnel 
    + After Effects
    + Background video content design asset
    + `assets/.media/3d/vfx-after-effects/vfx-3d-perspective-video-grid-tunnel-animation-after-effects-motion-design.png`
    + GET YOUTUBE AND MAKE GIFs 
 
  4. 3D Spinning Reflective Glass Logo
    + Blender 
    + Branding social design asset 
      + `assets/.media/3d/glass-logo/3d-vfx-animation-glass-logo-spinning-motion-1.png`
      + `assets/.media/3d/glass-logo/3d-vfx-animation-glass-logo-spinning-motion-2.png`
      + `assets/.media/3d/glass-logo/3d-vfx-animation-glass-logo-spinning-motion-3.png`
    + GET YOUTUBE AND MAKE GIFs 

### Social Design/Strategy

  1. Coworkers Anime Avatars 
    + Drawn by hand with iPad and Apple Pencil 
    + Adobe Fresco, Illustrator, Photoshop 
    + Created for the CEO's favorite tv show 
    + Requested as method for encouraging global remote web3 privacy app development team's bonding 
    + Silent Protocol (Silent Labs)
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-charlotte-1.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-charlotte-2.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-finral-1.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-finral-2.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-julius-1.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-julius-2.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-klaus-1.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-klaus-2.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-licht-1.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-licht-2.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-yami-1.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-yami-2.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-yuno-1.png` 
      + `assets/.media/anime-coworker-avatars/profile-picture-full-size/anime-stylized-coworkers-yuno-2.png`
    + Art versions for fun 
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-01-a.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-01-b.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-02-a.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-02-b.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-03-a.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-03-b.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-04-a.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-04-b.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-04-c.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-05-a.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-05-b.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-06-a.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-06-b.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-06-c.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-07-a.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-07-b.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-07-c.png`
      + `assets/.media/anime-coworker-avatars/layering-detail-art-process/opacity-layering-process-08.png`

  2. web3 Privacy App Branding Character Design 
    + Silent Protocol
    + Concept art for character 
    + Requested from client/CEO to create storytelling the importance of privacy as a civil right 
    + All drawn by hand with iPad Pro and Apple Pencil
    + Lots of pattern composites for creating scenery like rugs and background  
    + Used to create motion design social video content 
    + Secret Agent 
      + `assets/.media/branding-character-design/secret-agent/secret-agent-branding-web3-character-design-social-content-animated-video-1.png` 
      + `assets/.media/branding-character-design/secret-agent/secret-agent-branding-web3-character-design-social-content-animated-video-2.png` 
      + `assets/.media/branding-character-design/secret-agent/secret-agent-branding-web3-character-design-social-content-animated-video-3.png` 
      + `assets/.media/branding-character-design/secret-agent/secret-agent-branding-web3-character-design-social-content-animated-video-4.png` 
      + `assets/.media/branding-character-design/secret-agent/secret-agent-branding-web3-character-design-social-content-animated-video-5.png` 
      + `assets/.media/branding-character-design/secret-agent/secret-agent-branding-web3-character-design-social-content-animated-video-6.png` 
      + `assets/.media/branding-character-design/secret-agent/secret-agent-branding-web3-character-design-social-content-animated-video-7.png`
      + GET YOUTUBE VIDEO EMBED 
      + CREATE GIF FROM VIDEO 
    + Eventually turned into a Marketing Product Education print comic book 
    + Printed 3,000 copies that were handed out at global web3/Crypto conferences 
    + Supporting Cast 
      + `assets/.media/branding-character-design/comic-book-supporting-characters/compliance-staff-supporting-character-design-branding-web3-privacy-1.png`
      + `assets/.media/branding-character-design/comic-book-supporting-characters/compliance-staff-supporting-character-design-branding-web3-privacy-2.png`
      + `assets/.media/branding-character-design/comic-book-supporting-characters/compliance-staff-supporting-character-design-branding-web3-privacy-3.png`
      + `assets/.media/branding-character-design/comic-book-supporting-characters/compliance-staff-supporting-character-design-branding-web3-privacy-4.png`
      + `assets/.media/branding-character-design/comic-book-supporting-characters/compliance-staff-supporting-character-design-branding-web3-privacy-5.png`
      + `assets/.media/branding-character-design/comic-book-supporting-characters/compliance-staff-supporting-character-design-branding-web3-privacy-6.png`


---

## Draft Posts 

### Need New Images 

Create new images for the drafts listed below. List the local path to them below each entry in the list below. Agent should then add the images, which have been finalized, to CDN to get URL and update the `asset/docs/drafts/...` JSON entry, and then move the JSON to `assets/entries/...` where it will then automatically be published. 

**NEW IMAGE LIST**

  + https://www.august.style/scalable-augmented-generative-podcasts/
    - `assets/docs/drafts/uid-sqz-852.json`
  + https://www.august.style/burning-desire-distain/
    - `assets/docs/drafts/uid-xbk-777.json`
  + https://www.august.style/transmutations-hyperobject/
    - `assets/docs/drafts/uid-yel-369.json`
  + https://www.august.style/realtime-social-system/
    - `assets/docs/drafts/uid-sxz-828.json`
  + https://www.august.style/ux-ui-ios-marketing/
    - `assets/docs/drafts/uid-ssz-402.json`
  + https://developer-technologist.august.style/web3-strategy-branding/
    - `assets/docs/drafts/uid-rcy-132.json`
  + https://www.august.style/full-stack-automated-ecommerce/
    - `assets/docs/drafts/uid-scz-944.json`
  + https://developer-technologist.august.style/product-marketing-branding/
    - `assets/docs/drafts/uid-rvy-322.json`
  + https://www.august.style/content-strategy-framework/
    - `assets/docs/drafts/uid-slz-942.json`

**ALL DRAFTS TO SORT THROUGH** 

  - `assets/docs/drafts/uid-cvp-436.json`
  - `assets/docs/drafts/uid-dbr-368.json`
  - `assets/docs/drafts/uid-pzy-452.json`
  - `assets/docs/drafts/uid-vue-009.json`
  - `assets/docs/drafts/uid-xik-222.json`
  - `assets/docs/drafts/uid-xlk-592.json`
  - `assets/docs/drafts/uid-xpk-444.json`
  - `assets/docs/drafts/uid-ysl-128.json`
  - `assets/docs/drafts/uid-yvg-990.json`
  - `assets/docs/drafts/uid-yxl-432.json`

**FINALIZED READY FOR AGENT**

  + `assets/docs/uid-sqz-852.json` — slug: scalable-augmented-generative-podcasts

---

### Illustration 

**Print paperback art**

  + https://www.august.style/illustrated-poetry-book/
    - Need STORE LINK url card https://www.barnesandnoble.com/w/pantone-3537-up-sean-august-horvath/1129908743

**Animation and motion design** 

  + https://www.august.style/advanced-animation-system/

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