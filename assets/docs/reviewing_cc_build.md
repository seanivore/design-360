# Website Feedback for Claude Code Build 

## Fix Updates Made *10-22-2025* 

  1. Section page SEO title - Now shows "Web Projects | Sean August Horvath" instead of HTML comment
     + Check fix and confirm it is dynamic still 
       - If it is, then look into what exactly the fix was 
       - Many elements (see issue list below) are 'loaded' but not rendering 
  2. Section page loading - All 15 tiles load correctly on first try (was showing 0-11 randomly)
     + This is still an issue; to clarify 
       - The projects that should be loading are loading according to the Console 
       - Not all are rendering (see issues list below for finer details )
  3. Tag filtering - Single-select only, empty tags hidden, no more reordering 
  4. Entry pages - Already working! (You might just need hard refresh: Cmd+Shift+R) 
     + Same issue still present; same clarification as noted above for section page 

## Issues *Updated 2025-10-25* 

### 1. Load Versus Rendering Issue  

  * **Homepage appears to always load and render fine** 

    +  Console paged below
      - Mostly curious if it is intentional to have two updates for 'no projects found' 
      - Might be a place where the code is *almost* duplicate or unnecessarily complex 

```
✅ Successfully loaded 15/15 projects data-loader.js:111 
📊 After filtering: 15 projects data-loader.js:112 
✅ Loaded 15 total projects homepage-controller.js:112 
🔀 Shuffled section order: (4) ['Video', 'Print', 'Digital', 'Web']
⚠️ No projects found for section: Video homepage-controller.js:22 
⚠️ Skipping Video - no projects found homepage-controller.js:126 
⚠️ No projects found for section: Print homepage-controller.js:22 
⚠️ Skipping Print - no projects found homepage-controller.js:126 
⚠️ No projects found for section: Digital homepage-controller.js:22 
⚠️ Skipping Digital - no projects found homepage-controller.js:126 
🎲 Selected random project for Web: uid-sgt-851 homepage-controller.js:30 
✅ Rendered 1 homepage tiles homepage-controller.js:152 
```

  * **Section (Web) page always loads all projects, never renders 15, sometimes renders 0**

    + Console pasted below 
      - I see the above has a 'rendered' confirmation that comes from `homepage-controller.js`
      - Should this `assets/js/section-controller.js` be working like it does on homepage? 
      - The errors with `tile-renderer.js` looks to always have those same issues on this (Web) section page 
    + The most I can get on reload is 13 but it always say "Loading projects..." at bottom of page 
      - Can this UI notification be made accurate? Only show when there is something still loading? 
      - The User would be less likely to know the site had an error ... 
    + Note that I cannot yet check tag click-through section pages (contextual on-page tags)

```
✅ Loaded: assets/entries/uid-qor-090.json data-loader.js:65 
✅ Successfully loaded 15/15 projects data-loader.js:111 
📊 After filtering: 15 projects data-loader.js:112 
Uncaught TypeError: Cannot read properties of undefined (reading 'tile_text') tile-renderer.js:29 
    at renderSectionTile (tile-renderer.js:29:39)
    at tile-renderer.js:391:30
    at Array.forEach (<anonymous>)
    at tile-renderer.js:390:22
```

  * **Entry pages never render any visible elements** 

    + Console pasted below 
      - I can see from browser tab the the SEO title is indeed not showing 
      - Instead the SEO just says <-!- Populated by JS -!-> 
    + Literally nothing on page is showing other than 
      - PATTERN, ACTION, MEASURED headings 
      - A block for the thumb slideshow location 
      - Horizontal line and smaller block for tags (breadcrumbs and contextual tags missing)
      - Heading Related Posts showing but no posts 
    + No matter how many refreshes or 'hard refreshes' nothing loads 

```
GET https://www.august.style/web/html-css-js/personalized-fashion-magazine 404 (Not Found) personalized-fashion-magazine:1 
📄 Loading entry page template personalized-fashion-magazine:42 
🚀 Initializing entry page... entry-controller.js:424 
📍 Entry path: web/html-css-js/personalized-fashion-magazine entry-controller.js:429 
🔍 Fetching: /assets/entries/uid-hwi-844.json data-loader.js:58 
✅ Loaded: assets/entries/uid-hwi-844.json data-loader.js:65 
✅ Project loaded: uid-hwi-844 entry-controller.js:441 
❌ Error initializing entry page: TypeError: Cannot read properties of undefined (reading 'seo_title') entry-controller.js:453 
    at populateMetadata (entry-controller.js:63:38)
    at Object.init (entry-controller.js:444:13)
```

### 2. Homepage Tile Design 

  * **Adjust the thumbnail slide layout** 
  
    + Make the 16:9 thumbnail 90% width across tile 
      - Too many of them don't look interesting when cropped in square 
      - Place the top of the image at the top of the tile 
      - Below the image, black 

  * **Slideshow UI tricks** 

    + Left of the image, in the last 10% of the tile, the next thumbnail image should be visible 
      - Make that next image slightly downsized to 90% 
      - Center it in the same upper space the prominent current thumbnail slide takes up 
      - Lave 5% above and 5% below in that upper space 
    + Which side should the next thumbnail be on? 
      - Answering this question is how we'll answer which side of the tile the current slide should be aligned to L or R 
      - Start with current slide aligned to L 
      - Current slide stays L aligned as long as User is moving toward the last image 
      - Once the last image is reached, it should be R aligned making the next image peeking on the L 
      - Keep the next image peeking on the L and current thumbnail aligned R for as long as User is moving toward 1st image 
      - Next current image tile aligns to L or R according to if the User was moving forward or backwards through the images 
    + Next thumbnail that is smaller and at edge 10% 
      - Have 5-10% of the image under the current thumbnail 
      - Place a shadow visible from the current thumbnail down onto the next image thumbnail 
    + Make the image moving from next thumbnail to current thumbnail animated motion 
      - When clicked or swiped to be new current thumbnail, it should visually grow to intended size 
      - As it moves and grows the shadow/shading on it should lighten until normal 
    + Very faint transparent white dots at middle top of the lower text black bar section 
      - Let's add these since we're going to have space at the top of the black text bar area 
      - The number should represent the number of tiles thumbnails in the slideshow 
      - The dot representing the current thumbnail should be much whiter/less transparent 
      - When moving from image to image, give the dots a transition from light/transparent to white 

  * **Text placement and click through regions** 

    + Increase the size of the on-tile text 
      - Fill that new bottom area so that it looks comfortable, no squished, not tiny 
      - Bottom-left aligned 
      - Large enough font size on tile so that the text creates 2 lines, wrapping once 
    + Move section name to top-left 
      - The tile's entry count look nice and clean 
      - Let's do the same for the section name 
      - Make it much bigger so that people tend to want to tap/click there 
    + Click-through/tap-through regions 
      - Tapping/clicking the section tag's entire square should click through 
      - Tapping/clicking the entire lower black tile-text region should click through 
  * **Ensure that the above guidelines hold true across all breakpoints**

### 3. Section Page Filter Tag Navigation Design 

  * **Update the design of the horizontal row and tags**

    + Let's put the scrolling tags in a rectangle container 
      - Either side with more tags to scroll too should have black gradient shadow 
      - This will make it clear there are more tags to scroll too 
      - Because there will virtually always be a tag on one of the edges that is half covered in shadow 
      - If scrolled all the way to the right or left, there should be no shadow over the end of the tag list 
      - This will make it clear visually that User is at the end 
    + Update the color of the different tag types to be distinct from each other 
      - `sub_section` tags 
      - `toggle_tags` 
      - `role` tags 
