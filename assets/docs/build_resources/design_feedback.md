# Tile Design Update 

## Mobile Optimization Tile Feedback 

  * **This is our inspiration for the following reasons** 
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/1-example-tile.jpg`

    - Simpler, more compact, legible filter tag navigation horizontal scroll bar 
    - Image bleed as example of how much space is normal versus what we used 
    - Move text below and give space to much of screen to tell full tile's story 
    - Dog heading versus Animal subheading showing horizontal spacing and font size 
    - As a whole, look at how much content is being shown compared to what we're showing 

  * **This is our current homepage tile** 
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/2-current-mobile-home.jpg`

    + Generally speaking, I think we can let the photos bleed the edge of the screen, allowing them their full aspect ratio, while still letting the next image peek in from the side as well as the previous. But the top of the tile container and bottom, broken and separated by the bleed image, don't touch the image by a few pixels maybe ~0.25 rem and then they should also have a left and right very small space between the edge of the viewport and the edge of the tile box edges, again maybe ~0.25 rem or whatever looks closer to the liberty that the example screenshot on mobile google search gave. So the tile in the end will appear separated upon close inspection because of the bleed image; this will make it look sort of like the images are laying on top and across of the tile as a separate element laid perpendicular 

      - (2) Give these three links smaller gap; less passing is theme for everything on mobile for actual norms 
      - (2) Let's then align them to just below horizontal midline of that container it shares with Sean August Horvath 
      - (1) Give 'Sean August Horvath' a bit of breathing room 
      - (3) We should really get as wide as we can just like in the Google Screenshot  
      - (4) Give these dots less space and make them smaller; the are secondary to everything else, not prominent 
      - (5) Similarly to the width of the whole tile, we don't want this much padding for the text container either 
      - (6) Then we need to make sure the rest of the text is not falling off the tile; we'll have much more space after other adjustments 

  * **This is our current section page tile, image 1 is annotated and image 2 is clean**
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/3-current-mobile-section.jpg`
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/4-current-mobile-section.jpg` 

     + Hopefully you can already see the issues! The image doesn't fit in the tile and the text is all squished. This is particularly awkward because we have SO MUCH SPACE on mobile. We want to use up that real estate like the example screen shot did. I think the main different, perhaps only difference, compared to the homepage tile on the section tile would be that we just need the tile text here and nothing else so it can be adjusted to fit that well. 

       - (1) Same header updates here as homepage and across entire site 
       - (2) For the filter nav, the background of it needs to differentiate from the site background, then we can have it literally bleed because of the UI
       - (3) At the same time I think we can push these tags closer together, maybe even bigger a bit, and have the first one nicely aligned left 
       - (4, 5, 6) We can honestly just do something almost the same as the homepage tile and you can ignore the excess of boxes here 
       - (7) Appropriate space for this being short, concise tile text 

## Desktop Tile Feedback 

  * **This is our current view of a homepage tile** 
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/5-current-desktop-home.jpg` 

    + We don't need as much help on desktop on the homepage tile, but I think we can improve this. Let's move away from forced 1:1 full tile shape so that the middle image can be the full 16:9 and then the left and right next/previous thumbnail images can be smaller but come out wider showing more of the image, the idea here being to make it even more obvious that it is a stack of images in a carousel. We can bleed the thumbnail images for the tile container. It might make sense to change the color behind the thumbnail images to make them pop more. 

  * **The section tile on desktop needs a lot of help** 
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/6-current-desktop-section.jpg` 

    + Again, like on mobile, it seems there isn't equal padding below the image as on the sides and top which is strange. Also we have so much width here, we should definitely be showing the full thumbnail which we can make much larger and I think have it even poke a few pixels beyond the tile boarder on the top and bottom; this would mimic the same effect we wanted on mobile with the image bleeding to the edge of the viewport on mobile view wider than the tile. We can probably keep the text and thumbnail slideshow at the same row, but just like the other slideshow feedback, we can make the left and right images much smaller but come out wider to show maybe even half of each image if there is space; these L/R images would be within the top and bottom edges of the tile for sure. 

  * **Other section page feedback** 

    + Like mentioned in the example image, we have exceptionally large padding between elements. We can also simplify and compact the horizontal scrolling tag filter navigation. There are so many tags that I think smaller should help; there are 22 showing on this /web section page, so only being able to always see ~6 tags at any one time seems unhelpful. 

## General Website Design Thoughts 

  * **Color palette** 

    + We have something clean but we're missing the hipster vibe; I'm digging this palette I made, wdyt? 
      `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/7-color-palette.jpg` 

      - "Jet" is the dark charcoal color = #363635 
      - "Ebony" is a gray-green = #595A4A 
      - "Timberwolf" is cream = #D7CDCC 
      - "Anti-Flash White" is our white = #EBEBEB 
      - "Plum" is a purple accent color = #9C528B 

    + I *hate* and have always hated that color blue we currently have used because it is the same blue that hyperlinks have used on the internet since I was in middle school at the library being taught how to use a search engine called "Dog Pile", It is just trite and not hipster. I like the plum to replace it in most places however I could see a few more brights. I could see an accent used like under section H1 and on page that is three rectangles all idk 8 px tall, but then the top one being like 300 px long, the one below it with a nice gap being 250 px long, and then after an equally sized second gap the final third one being 200 px long. Take the estimated lengths with a grain of salt and go for the vibe I'm trying to express if my measurements are way wrong.  

      - The tri-color fade/muted accent horizontal bars, but with a bigger gap between each and they'd be solid
      - Very hipster, very classic looking for color on a charcoal color 

            [                                                      ]
            [                                    ]
            [                  ]
    
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/8-color-palette.jpg`

      - The first color is the same "Jet" charcoal that I just wanted to pair with other accent colors 
      - "Thulian Pink" = #D56AA0, though we could probably go more faded
      - "Air Superiority Blue" = #759AAB, though could probably go darker and more faded 
      - The last two are "Desert Sand" (#F3D3BD) and "Ivory" (#F5F9E9) which are nice for secondary if needed or to replace the other white 

  * **The © Copyrights footer text should be way smaller text**

    + Smaller font at least the same as the header nav link text size or smaller probably 
    + Smaller on the entry page too, though keep the contact icons as we currently have on the entry page footer 
    + Any ideas for other wording for "Single-JSON Architecture" ? 
      - Something that would be more obvious for anyone to understand what make the build so rad? 
      - Or Single Page Application hmm but gets long then to add dynamic content display 
      - Though the dynamic nature is probably the buzz-word and most important aspect 

  * **Do we really need the word "Contact" below my information on the Homepage? Feels redundant** 

## Entry Page Feedback 

  * **Current mobile view screenshots going down page** 

    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/9-mobile-entry-page.jpg`
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/10-mobile-entry-page.jpg`
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/11-mobile-entry-page.jpg`
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/12-mobile-entry-page.jpg`

  * **Current desktop view screenshots going down page** 

    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/13-entry-page.jpg`
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/14-entry-page.jpg`
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/15-entry-page.jpg`
    `/Users/seanivore/Development/360-design/assets/docs/tile_visual_inspo/16-entry-page.jpg`

  * **Order of information and media for all devices view** 

    + (Keeping the breadcrumb path and tag cloud as they are ordered but smaller text size just slightly especially on mobile) 
    + We want to keep the Title and Subtitle as they are but then the sequence could go more like what follows here: 

      - Keep the ROLE next 
      - Then the YOUTUBE (which will not exist on every entry) 
    
    + Then for desktop, along the side of the three text blocks we should separate out the thumbnail images and stack them 
    + On mobile it can be one column 

      - Shuffle the order of the thumbnails every reload 
      - IMPORTANT - make sure it knows there are varying numbers of thumbnails for different project entries 
      - Put one between the first text block (pattern) and the second (action) 
      - Put another between the second text block (action) and the last (measured) 
      - Then no matter how many images are left, place them below the last text block 
      - But this time put 2 or 3 in one row and as many rows as needed until they are done 
      - Note that all project entries *WILL* always have some number of thumbnails
      - Make sure the logic could deal with there just being as few as 3 

    + We need to make sure that there is space in the HTML template for pages that DO have 'on page' images 

      - Not all project entries will have these 
      - When a page does, we can just put them at the bottom after the rest of the thumbnails after the measured text block 
      - Let's make them like 4 or 5 in a row and as many rows as needed to place them all 
      - Can we make them a light box though so that if people click them they will be able to see the image larger in a modal 
    
    + The rest of the information order is okay 

      - Link to project is next 
      - Then GitHub link follows 

    + We need to make sure there is logic in the template to handle project entries where there are many more links 

      - And let's have the links cleaned up to remove the visibility of the "https://" and the "www." 
    
    + We want to maintain that the contact icons are listed 

  * **Related posts**

    + Is is possible to have the tags that make these related listed below the heading? 
    + And then these tiles can still be the same as the section page tiles but maybe smaller but less padding L/R 