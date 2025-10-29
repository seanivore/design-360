# Web Design Updates 

## Content Tile Issue Context 

  * **Content tiles are perfect on desktop**

    + Homepage and Section Page tiles are almost identical 

      - Both have extra-wide thumbnail image extending wider than tile 
      - Both have the tile-teaser text 
      - Just homepage tile has project count and section tag 

    + Updated simple scrolling thumbnail effect 

      - Thumbnail is a row of thumbnail images 
      - A wrapper is placed on top and then set to hide-overflow but have scrolling bar 
      - So instead of some annoying swipe or click code it is as simple as the tag navigation bar scroll 

  * **I got it working but AI had trouble getting it right** 

    + AI couldn't figure out how to structure things to just show one thumbnail at a time
     
      - I explained a few times, they did a few rounds 
      - I sort of think issues started because they didn't fully read the CSS and missed classes 

    + Eventually I just fixed it on my own 

      - I sort of just clicked layers in Insights and added/removed styling 
      - I knew what I needed but not where so kept trying until it worked properly 

    + The scrolling and one thumbnail showing is working 

      - Across devices the tile itself looks right 
      - But I'm having an issue on mobile that I'll describe in next section 

  * **Mentioning context because CSS might be a mess** 

    + Which isn't a huge deal  

      - If it looks okay on live site then, meh 
      - But might be helpful to know to help trouble-shoot the issue I'm having 

## Content Tile Issue on Mobile 

  * **First here's how they look on desktop** 

    + They are perfected here, no need to alter these styles for desktop 
    
      - I scrolled the thumb a bit to show how works 
      - Section Page Tile 
        `/Users/seanivore/Development/360-design/assets/docs/feedback_screenshots/annoying-vw-mobile-thumb-issue-4.jpg` 
      - Homepage Tile 
        `/Users/seanivore/Development/360-design/assets/docs/feedback_screenshots/annoying-vw-mobile-thumb-issue-5.jpg`

  * **On MOBILE the thumbnail is supposed to be 100 vw right up to the L/R screen edges** 

    + Padding from `.container` messing it up I think 

      - So I looked at the YouTube embed to see how that works nicely without nested padding issues 
      - YouTube Embed on Entry Page for Mobile 
        `/Users/seanivore/Development/360-design/assets/docs/feedback_screenshots/annoying-vw-mobile-thumb-issue-1.jpg`

    + Homepage, Section Page, and Entry because of Related Projects are all experiencing the issue 

      - The padding is making the tile extend out of the viewport to the right
      - The viewport is allowing a scroll horizontal on entire page 
      - Homepage Mobile 
        `/Users/seanivore/Development/360-design/assets/docs/feedback_screenshots/annoying-vw-mobile-thumb-issue-3.jpg`
      - Related Posts on Entry Page 
        `/Users/seanivore/Development/360-design/assets/docs/feedback_screenshots/annoying-vw-mobile-thumb-issue-2.jpg`

  * **Turning off the padding on `.container` messes everything else up** 

    + My last resort was going to be to just add padding to all mobile elements and remove from `.container` 
      
      - Before doing something that drastic I wanted to check in with you 
      - Also because the CSS is just getting messier 
      - I'm having trouble keeping things straight in my head, re: Classes, Mobile, Etc. 

## Our Task 

  * **Can you please help me by...** 

    + After reviewing all of the above, and the images, and `AI_CONTEXT_PRIMER.md` please 

      - Check out the CSS and see what is going on 
      - Help me make sense of things 
      - And basically help me get the tile laid out on mobile properly with thumbnail 100 vw 