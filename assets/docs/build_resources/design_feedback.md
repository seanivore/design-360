# Web Design Updates 

## Homepage Content Tiles 

  * **Must see Figma mock-up** 

    + What they currently look like 

      - Homepage tile desktop 
        `/Users/seanivore/Development/360-design/assets/docs/feedback_screenshots/homepage-tile-desktop.jpg`
      - Homepage tile mobile
        `/Users/seanivore/Development/360-design/assets/docs/feedback_screenshots/homepage-tile-mobile.jpg`
      - Section page tile desktop
        `/Users/seanivore/Development/360-design/assets/docs/feedback_screenshots/section-page-tile-thumbnail.jpg`
      - Section page tile mobile
        `/Users/seanivore/Development/360-design/assets/docs/feedback_screenshots/section-page-tile-mobile.jpg`

    + Mock-up to redesign the tiles to look like 
    
      - Homepage L, section page R 
      - Should look the same on all devices 
        `/Users/seanivore/Development/360-design/assets/docs/feedback_screenshots/tile-update-examples.jpeg` 

  * **Details for tile redesign** 

    + Thumbnail image is kept at its full 16:9 ratio 

      - Delete the previous and next thumbnail image entirely, don't need the class or HTML 
      - Image has very thin, bright white 1-2 px wide stroke 
    
    + Thumbnail images scroll across horizontal space with everything outside hidden 

      - The idea here is to create the same kind of UI with smooth scrolling just like the tags 
      - Then instead of clicking to next or playing with the (not working) special swipe gesture, it will just be SIMPLE 
      - Obviously I can easily swipe the horizontal scrolling tags -- let's just use same treatment on thumbs 

    + Note that the "tile" is narrower than the thumbnail image 

      - This is to emphasize the feeling of it being so visual-first
      - There is a bit of the tile out the top, above the thumbnail 
      - Compact the padding and margins to be tight 

  * **Mobile and Desktop should look basically identical on screen** 

    + The spacing shown is meant to work well for both devices 
    + But on mobile make the THUMBNAIL 100 VW at 100% wide 
    
    + This should make a lot of space to enlarge the font 

      - Create enough space for the font so that it could go into two lines 
      - Then let's make the size fixed for all tiles 

## Section Page Content Tiles 

  * **See the Homepage Content Tile & Figma mockup** 

    + This is exactly the same except no need to put the section name ("WEB") 
    + And we can remove the counter 
    + Then make the bottom less H since we don't have that text 

## Project Entry Page Layout Update 

  * **Move `YOUTUBE EMBED` below `ROLE`** 

    + Keep these upper items in their current order 

      - Breadcrumb path 
      - Tag keyword cloud 
      - Title and subtitle 
      - Role 

    + Then the **YOUTUBE EMBED** next 

      - MOBILE give it 100 vw 
      - DESKTOP give it max width ~800 px 

  * **Separate thumbnail images from slideshow to display in full** 

    + Keep them at their full 19:6 ratio 
    + Ensure the logic allows 3 to 8 images 
    + Have them shuffle their order every reload 

    + On DESKTOP 

      - Maintain the two columns
      - On the left are the three blocks of text; leave these and their headers exactly as they are 
      - On the right stack 3 of the thumbnail images 
      - Then return to single column below and place the rest of them with 4 in a row 

    + On MOBILE 

      - Maintain just one column
      - Place 1 between the `pattern` and the `action` blocks of text 
      - Place 1 between the `action` and `measured` blocks of text 
      - Make sure these two images are 100 vw just like the YouTube embed was 
      - After `measured`, no matter how many images are left, place them below this last text block
      - But this time put 2 per row and keep their combined width a bit less wider than the text blocks 