# Feedback for Implementation Plan v4.2.2

**Created**: 2026-05-27
**Updated**: N/A
**Linked to**: `assets/docs/archive/v4_2/v4_2_2_IMPLEMENT.md`
**Version**: Driving -> `v4_2_3_IMPLEMENT.md`
**Status**: Drafting feedback

---

## Homepage Feature Tile Video

### JSON Values

#### **Current `assets/docs/_entry_template.json` Values**

```json 
{
"feature": [
    "Phase A"
  ],
  "feature_video": "https://cdn.august.style/media/{slug}/feature-video-{slug}.mp4",
  "feature_video_alt": "Short description of the feature video content",
}
```

#### **Issue With Current JSON Values**

  - The homepage might not always be organized by "Phase"-type tags
  - "Phase"-type tags may not always result in the entry being featured
  - Slight rephrasing of value for video URL/alt to emphasize the tile placement will ensure any future creation of featured videos in a more formal way doesn't create conflicts
  - Changing the video value to an array will allow for future creation of multiple videos that should randomly be selected on every homepage reload

#### **Updated Snippet For `assets/docs/_entry_template.json` Values**

```json 
{
"placement": [
    "Featured",
    "Phase A"
  ],
  "feature_tile": [
    "https://cdn.august.style/media/{slug}/feature-tile-{slug}-1.mp4"
  ],
  "tile_alt": "Short description of the featured content that can apply to full array if needed",
}
```

#### **Other Important Notes For Syncing This Feedback**

  1. Update values on all `assets/entries/...` JSON files
     - Leave placement array empty for all entries but the three new entries detailed below
  1. Attend to any code or other files that reference the JSON values or the URL of the CDN because of filename change
  2. Ensure that the `assets/js/homepage-content.json` is set up so that it selects JSONs that have: 
     - The 'Featured' placement tag 
     - AND EITHER 'Phase A' OR 'Phase B' OR 'Phase C' tag 
  3. Update controllers to handle 'feature_tile' array with multiple videos 
     - This is common for how we set the behavior for most all of the dynamic homepage elements 
     - On every reload, the display should show a different video from the array to keep things fresh
  4. Ensure controllers handle more than one JSON entry fitting tag parameters in similar way 
     - The same type of logic is applied to controllers for situations where there are more than exact number of JSON entries to fit the exact number of homepage feature tiles in the component 
     - This is also common behavior for the dynamic elements on the homepage
     - At some point there might be 5 JSON entries with "Featured" and "Phase A" placement tags 
     - There might only be one feature tile in the component that is reserved for "Phase A" tagged JSON entries
     - On every reload any of these qualifying JSON entires should be selected at random and displayed in the feature tile 
     

---

## Entries With Placement

  1. `assets/docs/archive/v4_1/PHASE_A1_v4.md` — the first Phase A entry
  2. `assets/docs/archive/v4_1/PHASE_A2_v2.md` — the second Phase A entry 
  3. `assets/docs/archive/v4_1/PHASE_B1_v2.md` — the first Phase B entry 

At the top of the document in the chart's "Attention" column, a new row with "JSON Feature Tile Video" was added. The location of the video file to be uploaded to the CDN before being placed on the entries JSON is in the associated "Details" column for that row. 

---

## Reminders For Homepage Tile HTML

### Video Behavior 

  - **LOOPING**: We want to be sure that the video on the featured tile is set to loop 

  - **AUTO-PLAY**: Not sure we want this, depends on capabilities of alternative options 
    
    - Each tile will have one of these in that component 
    - We want these to function on mobile as well as desktop 
    - It probably makes the most sense to trigger the tile to "FLIP" and show the video when scrolled into view
    - The tiles should play one at a time, with the next tile flipping and playing after the first, and so on 

  - **POSSIBLE FUNCTIONALITY**: Multi-tap purposes 

    - If the tile is tapped once 
      - The animation that moves to the next tile should pause 
      - The tapped tile should stay, looping the video 
    - If the tile is tapped twice 
      - The user should be taken through to the entry for that feature tile
    - If the tile is tapped three times quickly
      - The video in that tile should stop playing 
      - The animation moving from tile to nex tile should continue as before 
    - If the user taps anywhere else on the page 
      - The animation and videos return to default behavior 

### Video HTML

  * **Purely A Suggestion Based On Provided HTML For On-Page Videos**

```html
<div class="feature-tiles">
  <div class="feature-video">
    <video
      src="https://cdn.august.style/media/{slug-a}/feature-tile-{slug-a}-1.mp4"
      autoplay
      loop
      muted
      playsinline
    ></video>
  </div>

  <div class="feature-video">
    <video
      src="https://cdn.august.style/media/{slug-b}/feature-tile-{slug-b}-1.mp4"
      autoplay
      loop
      muted
      playsinline
    ></video>
  </div>
</div>
```

---

## Directly From v4_2_2_IMPLEMENT.md

  - Line 9, "4. All four **feature cards** are video tiles, shuffled at runtime from `feature`-tagged entries." — See note in section above and adjustment of the JSON schema example. This is just to confirm that there are two required tags for any homepage tile to be populated for this update. 
    1. Placement tags must include "Featured" in the placement array
    2. Placement tags must include either "Phase A" or "Phase B" or "Phase C" in the placement array. 
    3. Only "Featured" and no other tag in the Placement array value would not qualify for homepage placement. 
    4. Only "Phase A" (or "B" or "C") and no other tag in the Placement array value would not qualify for homepage placement. 
    5. **NOTE**: When typing, the predictive tab prompt keeps trying to tell me to use "Type" tagged, as in it is pulling from *somewhere* in these files that there is a "type" tag being used in the JSON schema as a value for placement tags. This must be updated to the example at Line 34 "Updated Snippet For `assets/docs/_entry_template.json` Values" above. 

  - Line 12, "7. **`homepage-content.json`** becomes copy-aware (breaks old "tags-only" rule). Copy drafts live in `v4_x_x_HOMEPAGE_COPY_PLANNING.md`; once approved, move into the JSON." -- this is correct but feels important to note that we should be labeling exactly where the copy is placed and that, as of now, it will be used exclusively for one of the sections (that holds the most copy) and associated CTA text lead-ins and button text. There may be more added but this is all that has currently been planned. Though, the hero section about lines of text would also seem to qualify as this being a logical place to store those to be pulled from and rotated through on reload. 

  - Line 14, "9. **`collection_preview`** becomes a `flow` block type for editorial placement inside flow-layout entries" -- it feels pertinent to make sure it is clear that the `collection preview` component would just be replacing a row of media in a flow layout. It is not a flow layout in itself, but it is a component that, for planning purposes at this point, we will make clear that when using this component, the page that is written that it is being placed on should be a flow layout type. This means that the component could be placed before or after any number of lines of text, headings, bullet points, etc. just like our other flow layout entries. 

  - Line 21, "Required reading" -- I just want to be sure that we are providing required reading materials that have been updated and are accurate. We should be creating exclusively executable plans that, to the best of our ability, are only providing correct information to the orchestrating agent, rather then providing them with inaccurate and accurate information that might cause issues. 

  - Line 33, "do not paper over the gap inline somewhere else" -- it is in `.agent/DEV_RULES.md` but they should be creating a build log that specifically addresses any bugs or gaps they find while building as well as details any instances where they deviated from the plan, defining exactly what the deviation was and the logic for this change between the plan and actual implementation. 

  - Line 51, "## 1.5. Priority & Sequencing (Sean's brain order). Confirmed 2026-05-27: **the goal of "today's push" is a presentable state to resume job applications** — cohesive homepage narrative + 3 new showcase entries live + nothing visibly broken. Everything else is "continue forward after." Sean explicitly wants room left to keep iterating on collections and bleed-style polish for non-showcased entries on his own cadence afterward." 
    1. This is a good example of a place where we are not being exclusively executable. 
    2. There is no reason for them to know this information; the significance of this is that we are very strategically managing the context of the orchestrating agent, making sure to leave out all that they need not know and include all that they must know. 
    3. Instead, we should provide what is expected to be completed. 
    4. That said, as we've progressed, I do think that we should be able to create an implementation plan that encompasses the entire build. 
    5. If, after creating an implementation plan that encompasses the entire build, we decide it is excessive even after emphasizing the significance of their using subagents — there are examples of how to approach inclusion of this information in the `.agent/DEV_RULES.md` document — then we would take it upon ourselves to break it up into separate tracks meant to be assigned to separate orchestrating agents who would have completely clean context windows. This can be advantageous if there are tracks that can be built in parallel, but again, is not necessary to plan until we've actually created an implementation plan and decided it's excessive. Notes of this nature should instead be placed in a SESSION report, that is a version of the plan you create during the session but with additional details like this note which are intended for agents who are preparing the implementation plan but not for those who are meant to execute it. 

  - Line 79 and continued: 
    1. It seems like some of this might be reference materials that should instead be placed in the main architecture document, `JSON_ARCHITECTURE.md`, unless they are absolutely necessary to be directly referenced by the orchestrator at time of implementation, because remember, they will have the `JSON_ARCHITECTURE.md` document in their context as well. 
    2. As I continue reading, I feel like there might be more notes like the inclusion of unnecessary information such as the push goal (instead of just creating a plan meant to be completed end to end). 
    3. I also an unable to read most of the charts in this document because wide columns in markdown charts create line wraps that make the chart completely illegible to human eyes. 
    4. I'm going to hold off from this point and provide this feedback for you to take another pass on our end goal of what this document should be. 


  * Please carefully read in full `.agent/DEV_RULES.md` before proceeding. 
  * Please also first has a subagent with no content review the implementation plan and tell you where, with nothing other than a highly curated context, it might encounter confusion or be forced to make decisions. All decisions should have been accounted for. Also any general gaps in understand or, significantly, validation that knowledge that agents presumed to be accurate has been validated with up-to-date information. 
  * It would be a good practice to have an agent do this validation step before the implementation plan is finalized, possibly more than once because different agents identify different things. You can even try giving them subtle directives as to what they should be looking for, or nothing at all. 
  * Then I think we'll want to take the plan and have a fresh instance of Claude Code with the high-level Opus set, like yourself, do the same thing as our subagents, as a final sanity check. 
  
Let me know if you have questions or thought to this approach or to me not continuing further down this extensive document before taking these additional steps. 

One other note for the relationship graph: I would have one more research session where they look for people posting about examples using "Opus 4.7" or "node.js" or whatever those other tools are "three.js" — it feels like I'd have expected to see some recognizable tools in there given the amount of amazing things I see posted to X all the time just by looking for a Claude Code Plugin or Skill. Which, PS, I did install the Plugin/Skill designed for helping you FIND plugins and skills for solutions that might be helpful. Lastly, depending on the scope of this part of the update, perhaps it is one item that we can move to a v5 update. 

Looking forward to your thought on the feedback and our path forward. Thank you! 