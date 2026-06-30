# Feedback Fixing v4.4.3 Build 

## Preface & Overview

Last session, though we used a battle tested workflow, there were countless mistakes that, given the past month+ of development in Claude Code were frankly very beneath the current models. As I prepare these notes it only becomes more and more apparent, as discussed details were completely neglected, rather than the standard hyper vigilant Claude 4.8 xhigh effort 1M context on my Max plan has ever been. The core reason we were able to craft the battle tested workflow we have is because I had been able to stop policing models making sure that details were not falling through the cracks. We implemented gap reviews which had resulted in many, very complex builds, with orchestrators following build guides of over 100k tokens in size, resulting in, at times, completely bug free results. The 90% planning and 10% building balance of effort had been greatly paying off. The difference with the last session, of which I'm still trying here to clean up, was that even after all that planning, with byte accurate and anchored exclusively executable guides, the model still skipped steps, didn't finish many steps, and as I put this list together, I'm finding, just generally either cut corners or neglected due diligence or any kind of efficient cleanup as they worked. 

I explain this in part so that you know where this session of work is coming from, but also because, even after a long discussion with the model about the performance, in which they acknowledged that it was clear to them during the session that performance was an issue, we've yet to land on any clear way to understand how to avoid this in the future. It has turned what was a few hours of work into a few days as this point. I have learned over the years that often the "slow internet" version of UX when it comes to LLMs is not actually anything about perceived speed but quality of output. For this reason I suspect it was something to do with Anthropic. Regardless, there is no way to know for sure and, though that model seemed to say that there was no way for them to have known beforehand what performance would be like, their description of the experience from their side seemed to suggest otherwise. 

And so, for the time being, at least until it is obvious that normal expected performance as returned, it seems like the only thing I can do is express this at the start of a session. If any agent is questioning their ability to maintain the level of attention to details and truly admirable pragmatic workflow nature, keeping documents up to date without even having to be directed to, for example, then I can only hope that offering an out for that instance might result in a better outcome than if that agent tries to power through only to leave everything a mess to clean up for days to come. It all feels very much like working with LLM-pair development tools of two years ago. My MO for human employees would be the same for LLMs, in that if you're not experiencing the clarity of mind and organizational nature that seems so natural when at full functioning, then bow out. If you're not able to do the best work, then you do not need to work right now. We only need to be working when we are very 'all systems green' ready to go and manage many moving pieces at once in the way that has been so impressive the latest LLM models, even as we've started to expect it and adapt our working process around that expectation. 

---

## Clarifications

These are specifics about new features that we must ensure resonate through the important documentation including the main architecture and agent primer technical documentation that is `assets/docs/AUGUST_STYLE.md` and the needs-to-be-updated guide for future agents creating new collections and entry JSONs found in the `assets/docs/ENTRY_SOP.md` file. 

  1. Information about the three different layouts that entry pages can now have (and some fixes that they require for this session)
  2. How tagging works and its implications (which this session will also require some fixes in certain areas)
  3. Literally just explaining about collections in general in the SOP and how to use them
  4. Details on how collections and entries relate, how collections are displayed (which is where one UI bug remains to fix this session)

---

## Entry Page Layout Types

### Similarities & Needed Fixes

This is not currently consistent across layout types and must be fixed. The fact that this is not consistent across layout types implies that these new layouts were very likely not setup in the most efficient way possible. As such, when preparing the plan and researching for this session, we will need to identify specifics about how these layouts are being displayed and how we can, using our full understanding of the intended simplicity of the design expressed here, update the system so that things are not only consistent across layouts as intended, but hopefully will result in much cleaner and simpler code; perhaps there was code complexity in the past that resulted in some of the issues encountered later in these builds. 

* **IMAGE SHOWING THE FOLLOWING ACCURATE FLOW IN RED, FOLLOWED BY ITEMS TO BE FIXED IN BLUE**:
`assets/docs/archive/images/v4-entry-page-top-of-all-layouts-should-be.jpg`

  1. `.entry-tags-layout` "Tag Pills" (hidden)
     - These are not shown because they are marked `.display: None`
     - The tags are moved below the hero image slideshow with the copy
     - This is not currently done on all layouts but **SHOULD BE**
     - The screenshot used to illustrate here is the **LAYOUT: GALLERY**
     - These changes were initially made to the **LAYOUT: COLUMNS**
     - This must be fixed for the **LAYOUT: FLOW**
  2. `.entry-header` "Page Title & Subtitle"
     - Every ENTRY from JSON should start with `data.title`
     - Then in the same header, next to that horizontal line, is the `data.subtitle`
  3. `.entry-role` should simply show the tag for the entry at `data.role`
  4. `.entry-hero` is now functional as should be, like this, on all layout types
  5. The next area is where the layout types diverge
     - Our original layout has two columns which we adjusted in the last update.
     - The divergence that occurred that we should have better handled is that the COLUMN and new GALLERY layout maintained the two columns, but because the FLOW layout has only one column of content, we neglected the consistency, in that we should have moved the tag pill container shown next to the blue circled 5 in the image to this location for ALL THREE LAYOUT TYPES and for the FLOW layout that has only one column, we should have simply had the text go around this container.
     - This is how we **WANT TO FIX THE FLOW LAYOUT** so that it appears consistent with the other layouts. The current state of the FLOW LAYOUT will be described beflow.
  6. Here is, for GALLERY, and COLUMNS layout, the left column; but for the fix needed, we want the text for the FLOW layout type to start here as well, even though there is only one column. 

* **ANNOTATED IMAGE ABOVE WAS GALLERY LAYOUT; BUT HERE ARE EXAMPLES FOR EACH**

  - The original COLUMNS is structure accurately as in this example:
   `https://design-360-git-dev-seanivore.vercel.app/illustrated-poetry-book`
  - The newly re-purposed but still two column structure was accurately maintained in this GALLERY layout example:
   `https://design-360-git-dev-seanivore.vercel.app/illustration-art-deco`
  - The single content column layout type FLOW can be seen in this example, addressed specifically in the next section below here:
   `https://design-360-git-dev-seanivore.vercel.app/awards-viral-social`

* **IMAGE SHOWING THE INACCURATE, NEEDS TO BE FIXED, FLOW LAYOUT TYPE WITH MISPLACED TAG PILL CONTAINER**:
  `assets/docs/archive/images/v4-layout-current-state-flow-type.jpg`

  - This is the final of the three layout types finishing the "examples for each" from above section; this is the **LAYOUT: FLOW** type. Because it has only one column of text.
  - The other main difference is that, in the two layout types with two columns, this container is sticky, following the user as they scroll. For our one column layout type, flow, we obviously do not need or want this behavior, it would not do anything.

    1. the tag pill container was neglected, left at the top of the page, differentiating it unnecessarily from the other layout types — when it should have been moved down to the same location, albeit, set up differently to accommodate the single column of content nature of the FLOW layout page
    2. We need to adjust this single column of text to simply wrap itself around the tag pill container, just like text in a magazine article with an image might be placed in the column of text 

* **BOTTOM TAGS SECTION ONLY ON FLOW LAYOUT**
  `assets/docs/archive/images/v4-flow-layout-bottom-tag-pill-container-okay.jpg`

  - This block of pills used exist on the first original layout
  - When making the new layout types, it got removed from the COLUMNS and from the GALLERY
  - It still remains on the FLOW layout type
  - **TO FIX**: We should still keep this at the bottom of all entry regardless of layout type. 

---

## Collection JSON vs. Entry JSON

  + Collections initially were to contain a number of "ITEM" JSONs
    - That is no longer the case
    - We should delete `assets/docs/_item_template.json`
    - Make sure there is no mention of using them anywhere
    - Instead, the actual CDN URLs that a collection contains are filled in as an array on the JSON where previously the `assets/docs/_collection_template.json` called for an array of ITEM JSON ID numbers
  + Collection must have one Entry; an Entry can have any number of Collections
    - Collections ALWAYS have one entry JSON, that is where the story is told
    - An entry JSON can have more than one COLLECTION
    - E.g. An entry on Art Nouveau Art Gallery Design can have more than one collection, in which each collection is showcasing a different style of art from the Art Nouveau art movement
  + Displaying a COLLECTION on the ENTRY page uses BLEED IMAGE COMPONENT SECTIONS
    - For every COLLECTION on an ENTRY page there should be one BLEED IMAGE COMPONENT
    - If there are 3 collections, the entry page should have 3 separate bleed image components 

### JSON File Tags & Site Behavior

  + For some reason the first created COLLECTION JSON did not have any tags
    - We want them so that we can in the future drill down when necessary
    - This will require a few major changes that had been neglected thus far
    - Each of these will be addressed with specifics in the sections that follow 

      1. Update of the `assets/docs/tags.json` tags being used to identify new content right now is not future safe and must be fixed 
      2. The `/section` page must also pull in collections, but this needs to be handled by updating tags as alluded to in #1, and adjusting the values available on `assets/docs/_collection_template.json` to make sure that a content tile can be produced from a collection in the same way that they are created for entry JSONs
      3. The `assets/js/homepage-content.json` and thus the functioning of the homepage component sections will need to be adjusted to accommodate the tag changes mentioned above that will make these components easier to use for multiple purpose in the future rather than specifically for the purposes we needed in this update 

### Collection Related Tags

As mentioned, we'll want to be sure we are filling in the tag section on the Collection JSON files. These might be used lightly on the Entry JSON that the collection is associated with, but more deeply on the actual Collection JSON file. 

  + **ART MOVEMENT, AESTHETIC STYLE TAGS**
    - These can go under the "SKILL" section
    - The idea being that I acquired skill in learning these aesthetics
    - Bauhaus, glitch art, and other art movements or aesthetics will be helpful to drill down in the future. They should go in that Skills tag category

We will also want a new tag for the ENTRY JSON files that indicates if it contains 

  + **ART COLLECTION TAG FOR ENTRY JSON PRODUCT**
    - Under the "PRODUCT" tag section, and on the ENTRY JSON (not collection)
    - We will put the tag "Art Collection"
    - This indicates that the PROJECT ENTRY contains at least one associated collection
  + When we might need to pull JSON from *only* collection JSON or only entry JSON we should use:
    - On the top of the ENTRY JSON schema: "template_type": "project_entry"
    - On the top of the COLLECTION JSON schema: "template_type": "media_collection"

### Section Page Tag Filtering

One implication of these tags being used on COLLECTION JSON files as well as ENTRY JSON files is that, on our section pages, the values should show up for users to filter through both project ENTRY content as well as art COLLECTION content. To do this we will need to make some small adjustments to the COLLECTION JSON schema and possibly the section page filtering system. 

#### 1. Change Section Filter UI

Because of the increase in number of tags that will result from these changes, pushing an already high number of tags even higher, I'd like to propose we change the filter layout on the section page: 

  1. Separate each tag group to its own dropdown selector
     - Otherwise use the same dropdown that we currently have perfected
     - The current perfected dropdown shows a selector for AND/OR
     - Current dropdown also has checkboxes to select easily any number of tags
     - As they're selected they show above the UI showing what filtering is applied
  2. Add one new UI for selecting to show project entry JSON or collection JSON
     - This doesn't necessarily need to be a dropdown
     - But it should allow users to select one of either or both
     - Both should always be applied by default
     - These tiles will look basically the same otherwise, as described in next section 

#### 2. Collection JSON Content Tiles

Since the section page will be pulling from tags on ENTRY JSON and COLLECTION JSON, we need to adapt the COLLECTION JSON schema just slightly to provide the additional values needed to create the content tile that is already created for the ENTRY JSON projects. 

  - Which is a **NOTE** that we should make sure that this is how it will work 
  - Pulling from `assets/entries/...` and `assets/collections/...`

Changes needed for the `assets/docs/_collection_template.json` schema. 

  1. There should be at least 4 and at most 7 `data.thumb` CDN URLs in that array
  2. We need a few one liners like entry JSONs use for `data.tile_text` which get rotated through
  3. The content tile uses `data.title` which should be fine, just keep it concise 

#### 3. Breadcrumb UI Added To Collection Pages 

Since the entry might show up with the same search parameters, we want to make sure that if they click a collection content tile, it goes to the collection. This will require on slight UI change to help improve UX. 

  - Put a breadcrumb at the top and bottom of the collection pages
  - Then if user navigated through collection tile but wanted the larger project
  - User can easily navigate to the gallery post without having to go back to section search and finding it

---

## Clean Up 

Some of the following and earlier details in this document are just clarification of changes that have occurred over the past few builds that don't seem to have been fully integrated. I'm confirming them so that the documentation can accurately reflect this, and so that we can clean up schemas and other lingering artifacts from previous builds before these changes. 

---

## New Layout Change Implications

When introducing the FLOW layout and now the new GALLERY layout we retired a large number of very specific entry page media components creating sections that no longer make sense. 

### Removals

  1. **Bleed slides**
     - I have no idea what this actually was and don't see it discussed anywhere when I searched the project directory for the term
     - It it now removed from our `assets/docs/_entry_template.json` 
  2. **Single MEDIA component type**
     - Media type is no longer segregated and can all be mixed in any order
     - It is "main_media" on the schema and can include a "title"
  2. **Removed element section types**
     - *GRID* is no longer to be used anywhere, no legacy functionality  
     - *GIFs* is no longer to be used as a separate element section of just GIFs
     - *SLIDESHOW* was removed, it looked bad just not helpful 
     - These are now removed from our `assets/docs/_entry_template.json` 

### Simplified Reality

  1. **LAYOUT: COLUMN**
     - Uses `data.challenge`, `data.approach`, `data.result` groups in the left column copy 
     - Gets any number of `data.main_media` components with titles
     - These media components displays any image, GIF, or MP4 that can be set to playback any way
     - These start after the end of the two columns
  2. **LAYOUT: GALLERY**
     - Uses `data.about` and `data.details` groups in left column copy
     - Gets a `data.bleed` component for every collection associated with the entry
  3. **LAYOUT: FLOW**
     - Uses only `data.flow` section for all copy and media
     - This section on the JSON can be rewritten and organized
     - It should reflect the order of what should appear on the page
     - It should use the same formatting rules that all other flow already use, which should be recorded somewhere, according to the last agent 

### Lingering Questions & Fixes

  1. Where are the formatting guidelines the previous agent put together for FLOW layouts? 
  2. The previous agent wrote a gallery entry `assets/entries/uid-iad-101.json` and did not know what they were doing. We need to confirm that these best practices being defined in this document were applied. In looking quickly I see that they have information listed next to the `data.flow` value in the JSON and that makes no sense at all, I don't know what that would be for and, thankfully, it doesn't show on the page anywhere.
  3. The changes that were made to the main schema `assets/docs/_entry_template.json` should be made sure to be applied on all other entry JSON to prevent any confusion in the future. Looking at the same gallery entry linked above I see all the old values "grid" and "img"
  4. The newly added `data.about` and `data.details` don't seem to have been properly integrated into the system by the last agent. Instead, on this same entry `assets/entries/uid-iad-101.json`, you can see the text that is showing on the page next two ABOUT and DETAILS at rendered `https://design-360-git-dev-seanivore.vercel.app/illustration-art-deco` is on the JSON entry next to `data.challenge` and `data.approach` — this is a perfect example of why this document started with a huge preface about not understanding how that agents work quality was far below anything I've experienced since Sonnet 3.5. Probably not even because most Claude models were great and these mistakes make so little sense. I'm assuming this means that "ABOUT" and "DETAILS" are hardcoded on the page or something which is obviously problematic for the entire idea of this build architecture. 
  5. How are we handling collections have GIFs, some have MP4; MP4 will need a way for us to adjust HTML video tag settings for things like LOOP | AUTOPLAY | NO SOUND | NO CONTROLS — I don't know the specific commands just what they do
  6. We should investigate the Everlastings project; the only differences are that their UPLOAD endpoint already is set up to understand roles like "crop in X for 'THUMB'" and "Skip Cloudinary for MP4s", and that their details go directly into Supabase instead of JSON files
  7. But they have a smart and clean method for being able to integrate the necessary MP4 playback commands to go with the CDN URL so that it gets placed into the product.html page properly
  8. Some starting points to spawn explore subagents for, otherwise it will be in the code, but we did just update those documents so they should be good. 
     - `/Users/seanivore/Development/everlastings-website/assets/docs/EVERLASTINGS_STORE.md` 
     - `/Users/seanivore/Development/everlastings-website/assets/docs/GPT_SETUP.md`
     - `/Users/seanivore/Development/everlastings-website/assets/docs/STORE_ADMINISTRATION.md`
  9. Entry page new button duo
     - We like them right aligned on desktop
     - Here you can see on mobile it just looks off
     - Let's center them on mobile
     - CURRENT PAGE PLACEMENT: `https://design-360-git-dev-seanivore.vercel.app/freelance-payments-platform` (will be used on other entry pages)
     - IMAGE: `assets/docs/archive/images/v4-button-duo-entry-page-alignment.jpg`
  10. Every footer, icon layout
      - The are find on desktop
      - On mobile they need to be in two stacks of four
      - The homepage set too, and for some reason they aren't as bright but maybe that is intentional 
      - IMAGE: `assets/docs/archive/images/v4-footer-icon-stack-entry.jpg`
  11. Homepage FEATURE tiles with MP4
      - Most looping gifs we have just autoplay even on mobile
      - This one is click to play
      - We want to change it to autoplay
      - IMAGE: `assets/docs/archive/images/v4-homepage-feature-tiles-video-tile-autoplay.jpg`
  12. Unfinished page `https://design-360-git-dev-seanivore.vercel.app/illustration-art-deco` 
      - `assets/docs/archive/images/v4-bleed-component-section-good-entry-page.png`
      - `assets/docs/archive/images/v4-bleed-component-section-good-homepage.png`
      - `assets/docs/archive/images/v4-entry-inconsistent-tag-pill-blocks-1.png`
      - `assets/docs/archive/images/v4-entry-inconsistent-tag-pill-blocks-2.png`
      - `assets/docs/archive/images/v4-footer-icon-stack-homepage.png`

---

## Needed Fixes

### Bleed Image Component Styling

This was defined clearly to the previous agent. They were able to make it work beautifully on the homepage, but for some reason could not get it right on the entry page. I think we will need to completely remove the entry page version and add the new one. 

* **Homepage Desktop & Entry Page Component Details**

  - Images in component are randomly selected every page reload 
  - Each row gets a random number of images every reload of 3, 4, or 5 
  - There are always 3 rows on entry pages
  - There should be 4 rows on the Homepage component *MUST FIX, CURRENTLY 3*

* **Homepage Mobile & Entry Page Component Adaptation**

  - Limit mobile to 2, 3, or 4 images per row only
  - Homepage should get 5 rows total
  - Entry pages should get 4 rows total
  - This makes them both more narrow but taller on mobile 

* **Styling For Each Image, Row, Column of Entire Component Are Conceptually The Same**

  1. Individual images are the only place that a very subtle, clean dropshadow can be applied
     - They also should get a very small few pixel padding at TOP and BOTTOM
     - This small few pixel padding will be replicated in other places to make the entire piece cohesive so you will be reusing the same number 
  3. Individual images each go in a div
     - These divs get 100% height which will make them all the same height in next div
     - Those divs all allow the width to be natural to fit the aspect ratio
  4. Then those 100% H divs each images is in are placed in a div flexbox row
     - This is where the number of images in the row changes each reload from 3, 4, 5 on desktop and 2, 3, 4 on mobile
     - The background of this div is the accent color
     - Give the gap between children a few pixels
     - Apply padding to only the bottom of this div flexbox row, at same size to match the gap between children
     - Make this div flexbox row 100% width and make sure the height isn't constrained so that it changes naturally based on the images inside that are naturally synced in height from earlier styling
  5. For each row in the entire component you duplicate this original div flexbox row
     - It requires slight padding changes based on where it will be in the collection of rows in the overall component
     - It gets 3 rows on a desktop entry page, 4 on mobile entry page
     - It gets 4 rows on a homepage desktop, and 5 on homepage mobile
     - That original padding only on the bottom of the first div flexbox row will now only go on the top of one of these rows, as they will all be placed in a new div where gap settings will handle the rest of the spacing
  6. Place all duplicated div flexbox rows into one div flexbox column
     - This flexbox should give the gap between children the same spacing as the padding that the bottom row of the bunch gets, which is the same padding the the row on the top of these children get; the gap added here would also match the gap that was given to the children inside of the first div flexbox row
     - Again, the height of this div flexbox column must be unconstrained so that it changes based on the contents which change every refresh
     - The width of the div flexbox column should now be 100% or whatever metric, PLUS the negative metric to get it outside the page margin, creating the bleed effect 

* **See The Homepage Bleed Image Component**

  - This one is executed perfectly
  - Only change is that it needs to have +1 row on the desktop version (make sure to account for where the padding is on the rows inside so that only the outer top and outer bottom of them)
  - And then the mobile version must be ensure to be setup accurately according to the stipulations provided above

* **Delete the Entry Page Attempt And Replace It With Homepage Component**

  - This seems like the cleanest way to fix that mess on the entry page currently
  - After copies, it will need to be saved as its own component because of the differences between the homepage version of the component and the entry page version of the component
  - There is just one fewer row (actually this is exactly what the current homepage component looks like that the entry page should look like)
  - Then the mobile version must be adjusted according to the stipulations mentioned above (basically the potential images in the row are moved down one and the number of rows are increased one)
                                         
### Clean Up Remaining Tag Situation

Earlier we asserted that every gallery entry post should get a PRODUCT tag of 'Art Collection'. Between that and a few other changes defined here, we will be able to fix up the sort of rigged setup of `assets/js/homepage-content.json` which was done to make things work NOW but will not allow for easily changing things in the future which defeats the entire purpose of the tag-controlled homepage components. Note that there are some components that are special because of our new storytelling narrative on the homepage with different phases, however even there, some updates should be made, as explained here. 

You'll find the on `assets/docs/tags.json` and in our two `assets/docs/_entry_template.json` and `assets/docs/_collection_template.json` schemas, there was a tag category called "PLACEMENT" added. This is not helpful in the long run and can easily be removed. 

  1. **ADD 'FEATURED' BOOLEAN VALUE TO SCHEMAS**
     - Instead of this being a tag, we should add it as a boolean to our entry and collection schemas
     - Turn it on for any JSON that have `data.placement: Featured`
     - Make it false for any JSON that don't have that Featured tag
     - Might be best to do this by running a script to add it to all live entries `assets/entries/...` and collections `assets/collections/...` listed then make our new `data.feature` boolean set to true, otherwise leave it as false.
  2. **ELIMINATE OTHER PLACEMENT TAGS BY ADDING ALTERNATIVES**
     - I've already done this: any entry JSON that was a PHASE A/B/C placement tag holders was now given a different unique `data.skill` tags to use
       - Any entry that had PHASE A placement tag, now also has a `data.skill: Foundation Building` tag
       - Any entry that had a PHASE B placement tag, now also has a `data.product: Generative Automation` tag
       - Any entry that had a PHACE C placement tag, now also has a `data.product: Custom AI Solution` tag

The only placement tags used, according to `assets/docs/tags.json` have no all been handled differently. 

  1. No more "Art Gallery" placement tag, instead opting for a "Art Collection" product tag.
  2. No more "Featured" placement tag, instead option for a boolean 'Featured' value on every entry and collection JSON schema.
  3. No more "Phase A/B/C" placement tag, opting instead for more helpful, descriptive wording that actually relates to what these phases were, as in Phase A = `data.skill: Foundation Building`, Phase B = `data.product: Generative Automation`, and Phase C = `data.product: Custom AI Solution`

Next, the method of how we're filling in content on the compage components through the use of our `assets/js/homepage-content.json` file needs to be thoroughly reevaluated. Before it was sort of either neglected completely, by hardcoding things like a PHASE-A into an HREF URL, whereas you can see that that is not necessary based on the way the CREDENTIALS section works. In other places there needs just to be added a better drill down of what tags to add. Or a shift to using the boolean like in the instance of "`data.featured_tiles.video_card.filter.any: Featured`". 

Once those are updated, and you'll be able to see that it is indeed functional since the entries were updated first, then we want to deleted the old. The homepage-content.json is good, and all the entry JSONs both types, are good. Delete the placement section from the tags.json, too.

---

## Post Dev Testing 

After these changes are complete, and the testing is done, I'd like to make sure all the documentation reflects that this version we push to production should be v4.5.0. Your plan for this session can reflect that as well. Right now this document is the only thing in that new subdirectory. 

For this session, it seems best that perhaps the creation of the plan be where the research heavy lifting takes place. That would result in a plan that you could then execute to make the fixes above. I know sometimes we separate the planning and the execution but I worry that if we do that here we might loose a bit in translation and end up needing to go through a bunch of gap reviews that would otherwise be unnecessary. 