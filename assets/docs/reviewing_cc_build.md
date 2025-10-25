# Website Feedback for Claude Code Build 

## Fix Updates Made *2025-10-25 & 22* 

  1. All loading but not rendering issues fixed across all three templates 
  2. Functioning of filter UI on section pages adjusted 
  3. Homepage tile design updated 
  4. Tag logic and debugging; toggle-tag partial word matching 
  5. Eliminated the special sub_section section pages that breadcrumbs had 
  6. Back button fix ✅ (code is correct, awaiting cache)
    - Callback triggers on init when hash present
    - Checks BEFORE adding sticky filter to avoid false positives
    - The only remaining test failure is the back button, which is due to GitHub Pages CDN cache
    - Fix is in the code (commit d013c0c) and will work once the cache clears

## Issues *Updated 2025-10-25*

### **PENDING, BUT ALSO ADDED 2 ISSUES** Weird URL Behavior When Using "GO BACK" from Entry Page Selected With Tag Applied  

  * **Sticking on the same URL example, but go to an entry page, then go back, nothing shows on same URL**

    + When no tag is applied, accurate: `august.style/web`
      - All entries with 'web' under their `active_tags.placement_tags.section` list 
    + When tag is clicked: `august.style/web#tags=web+product`
    + When I click an entry result, then 'Go Back' from the entry to the Web Section page 
      - The URL is still `august.style/web#tags=web+product` (which is good )
      - But the URL shows NO ENTRIES  
      - Even SHIFT-COMMAND-R refresh doesn't show any entries 
      - BUT if you click PRODUCT again while on this URL, the URL stays the same, but entries DO show up (?) 
    + Proper behavior is just that when you go back, it should show the filtered Product tagged entries with a Web section tag 

  * **The same strange behavior happens for any** 

    + `toggle_tag` keywords in the navigation filter
    + `section` tags in the filter 

  * **ADDITIONAL TAG ISSUE: The HTML/CSS/JS sub_section tag is strangely missing** 

   + Both the Webflow and Framer `active_tags.placement_tags.sub_section` tags are working 
   + The breadcrumb on HTML/CSS/JS sub_section entries 
     - Go to `august.style/web#tags=web+html-css-js` 
     - No tags show probably because it is not showing as a filtering option 

  * **Missing ideal tag functionality logic** 

    + When a user clicks through ANY tag in the tag box of a project entry 
      - Remove the section-type tag on the section page so that project from more than just "web" surface (when we have them) 
      - Obviously the tag the user clicked through should be applied when the page loads (for the entire site's projects)
    + Show the follow tag types in a random order other than making the clicked-through tag first and selected already 
      - For all tags that exist on all active JSON that come up for the clicked-through tag 
      - Actually, even better UX would be if the clicked-through tag was not able to be unselected 
      - Then instead of "Web" it would say that tag 
      - All of the projects' `categorization.tagging` tags 
      - This would include `technology`, `media`, `role`, and `skill` 

### 1. Section Page Counter 

  * **On the section page it shows the number of entries for the section but should be updating with the filters** 

    + "15 web projects" on `august.style/web/` is great 
    + When filters are applied it should update the count to help UX when there are many projects 
      - Example this page august.style/web#tags=web+framer only has 1 result 
      - Should say 1 project 

  * **Let's remove "web" to make more sense for filtered results, and will make template simpler across sections** 

### 2. Section Page Filter Tag Navigation Design 

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

### 3. Updating Homepage Tile Design 

  * **Further improving thumbnail slideshow UI** 

    +  Add previous thumbnail image similarly to how the next thumbnail class `homepage-tile__next-preview` was added 
      - Create more space on R and L of thumbnail image by making tile wider 
      - Of course, when at the first or last picture, the main image should still be fully R / L aligned  

    + Make the slideshow more visibly obvious 
      - Inset entire thumbnail slideshow elements by putting 2-5 px padding inside class `homepage-tile__images-area`
      - Give `homepage-tile__images-area` class an off white/light gray slid background 
      - Make `homepage-tile__next-preview` and previous preview width and height both 80% instead of 90% 
      - The smaller next and previous image will just make the entire situation easier to see that it is a slideshow 

  * **Adjusting text for better thumbnail visibility** 

    + Move class `section-name` and `project-count` down 
      - Put them into the tile-text area class `homepage-tile__text-area` 
      - Put them both at the bottom left corner of that area 
      - Adjust each font down a bit 
    
    + Make the size of the font for class `data-text-index` smaller 
      - It currently has a few slides where the line goes into two line WHICH IS OKAY 
      - But when it does, it makes the entire class `homepage-tile` taller 
      - Let's make the font smaller so it doesn't even bother the height 
      - But also make the height fixed to be safe and make sure all of the tiles look the same 
    
    + Move class `homepage-tile__dots` to be at the top of the class `homepage-tile__text-area`
      - We can also make them smaller 
      - Give top padding if needed 
      - Visually, would be nice to have the gap above the tile text wider than below 

### 4. Updating Section Page Tile Design 

  * **Improve the overall aesthetic of the tile for clear slide usability** 

    + Make many of the same updates that we made for the thumbnail slideshow on the homepage tiles 
      - Make sure we're showing the full 12:9 ratio main tail 
      - Place it in an inset window with extra space on L and R sides and a gray background / off white background 
      - Organize the previous and next thumbnail images just like on home page but show more of each because the tile is wider
      - Remove all radius corner to make the sharp right angles 

    + Give class `tile-grid-section` a L and R padding 
      - Make the wide tile slightly less wide 
      - Create distinction in width between class `container` elements class `tag-filters-container` and class `page-header` 
    
    + Adjust the on-tile text 
      - Make the font smaller
      - Allow for a 2 line wrap 
      - Make sure tile size is fixed and doesn't change with length of tile text 

### 5. Full Site and Start Design Review Loop 

  * **Entry page design perfecting** 

    + I will let you have creative control for the entry page perfecting before I start providing details 

  * **Review all design on all device sizes** 

    + Start design perfecting loop tweaking as needed 
    + It seemed like the font sizes can all be downsized proportionately for mobile 
    + Class `site-header` `site-nav` should align with the bottom of the class `container` area 

  * **Swap site background color with lighter tile color** 

    + I think we should make the background the lighter charcoal and tiles darker 
      - Because I'd like to also have realistic, sharp shadows
      - This would allow for blending that would give the page depth and a bit of lighting 