# Website Feedback for Claude Code Build 
*10-22-2025* 

## 1. Homepage Tile Design 

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

## 2. Section Page SEO Title & Tile Loading Issues  

  * **SEO Title** 

    + Starting at the very top, the SEO title is showing wrong text
      - This is very present on the browser tab 
      - It says <-!--Populated by JS from Placement.JSON --!->

  * **Project loading reliability** 

    + Most times I click through none of the project are loaded 
      - Only when I refresh does it load the projects 
      - I can tell they're loaded because it will then say 15 projects 
    + When refreshed and projects load they still down show on page 
      - Usually the first reload none show up 
      - Each reload more (or less) will show up 
      - You almost never get all 15 
    + The "loading project..." text is always present 
      - If the loading is problematic this UI just gives it away faster 
      - Perhaps an actual "load more" button would be more effective 

## 3. Section Page Filter Tag Navigation  

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

  * **UI of filter tags**
    
    + Lets turn off the movement of the tag to the front when it is on 
      - The actual UX of using it with them moving to the front is actually very confusing 
      - Additionally, there are very few tags when multiple tags are applied 
      - Removing this functionality will make people less apt to apply more than one tag at a time 

  * **Functionality and tag content issues** 

    + Currently there are many tags that filter and show no content 
      - `toggle_tags` should only be present if there are projects using those tags 
      - Based on the tagging functionality logic, every tag should have project tiles when applied alone 
      - Any tags that don't have entries just shouldn't be in the list 
    + Update tag logic so that ONLY ONE TAG FILTER can be applied at a time 
      - When a new tag is clicked, it should turn off the current tag applied, if there is one 
      - And then apply itself immediately 
      - This means the only way to turn off any tags applied is to click/tap the tag applied 
    + None of this is relevant for the section tag that is always applied no matter what
      - The same would be true for any contextual click-through tag 
      - Either clicked through from homepage (section tag applied) or from an entry page (contextual tag) they are locked and not in the list

      