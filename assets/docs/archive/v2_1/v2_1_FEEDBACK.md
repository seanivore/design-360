# Landing Page Prototype v2 Feedback 

## Overview 

### Must View Images 

  **Please review or ask Sean to message images into chat before trying to understand feedback**
  
  `assets/docs/archive/v2/IMG/v2-review-mobile-1.jpg` 
  `assets/docs/archive/v2/IMG/v2-review-mobile-2.jpg` 
  `assets/docs/archive/v2/IMG/v2-review-mobile-3.jpg` 
  `assets/docs/archive/v2/IMG/v2-review-mobile-4.jpg` 
  `assets/docs/archive/v2/IMG/v2-review-mobile-5.jpg` 
  `assets/docs/archive/v2/IMG/v2-review-mobile-6.jpg` 
  `assets/docs/archive/v2/IMG/v2-review-mobile-7.jpg`
  `assets/docs/archive/v2/IMG/v2-review-mobile-8.jpg`

### Summary 

  1. Simplification of overall design
  2. Amplification of animation
  3. NEED TO EMBRACE FORM FOLLOWS FUNCTION and think more about the design and how it is helping the user or how it is doing ... Nothing 

## General Feedback 

### Overall Design

  + The entire thing felt surprisingly underwhelming. 
  
    - Attempting to add neumorphic and other designs into flat is just too nuanced to jump into.
    - I think we need just back up and make it all straight up flat design.
    - Please reconsider all of the visual elements when implementing this feedback.
  
  + Like, should cards have the kind of stroke that is slightly lighter gray than the background like they do now?
    - All over, but the showcase is a good example specifically
    - I thought that kind of blending was for creating depths and highlighting of curves, etc.
    - Doesn't seem appropriate for flat design
    - BUT I'm new to flat design so please don't just remove it and do nothing
    - I'm not sure what to do we should research it please
  
  + Please research flat design best practices in general for the v3 prototype design — now that we have content we want this to look really polished and professionally done

  + Do we actually want so many cards? Like I feel like part of what made it before, what makes the landing page, is the differentiation of the sections visually, and somehow when we moved to mobile-first, we got sort of ... Boring first, but I'm not sure why. I think the point of mobile-first thinking is to force the design to treat mobile like we treat desktop and here we're just throwing everything into containers and making them VW it is very boring but not at all necessary

  + I think by the end you'll probably agree that we should use fewer of the section break tri-stack so that we can use that accent tool in different ways — most notably in the 'Achievements' section mentioned below 

#### Design Guidelines iOS macOS iPadOS, etc.

  **WIDTH** 
  
  + See image: `assets/docs/archive/v2/IMG/v2-review-mobile-width.jpg`
  + What is the absolute min width set to? I remember editing the text from the article and it discussing making sure that there was room for things to get a lot narrower than expected and then similar for wider but like not much should shift around until a certain point getting wider. 
  + I ask because when I switched the viewer to "responsive" and it defaulted to 309px wide you can see it was not well designed to handle that. We need to fix the prototype for sure but I'm curious if we need to fix the design sheet as well or not. 
  + Actually as I make it wider it appears that the subtitle just doesn't work if it has to be two lines which we'll need to fix for. It also didn't handle the header nav narrowing well, as the right and left buttons ran into each other (ABOUT and CONTACT).

  **ABOVE/BELOW FOLD, MOBILE DESIGN MENTALITY** 

  + There's a big section in the document about how to handle heading images in a dynamic way that is very different than how things "above" or "below" the fold are handled on desktop because of the UI of mobile
    - Making the whole thing more of an interesting scrollable experience
    - Need to find and review these notes again and then try to improve the hero
    - Instead of being interesting is looks like it just adds a bunch of space below and that is all, that's our entire solution currently
    - I think it involves animation and such because the whole idea of "below the fold" isn't relevant on mobile because of the experience of scrolling with our thumbs
    - Instead, we're supposed to make the scrolling part of the story
  + This type of design is basically a huge red flag for anyone hiring good mobile designers
    - It's what shows they understand the medium and how to story tell on it
    - Once it is confirmed we understand the issue and how to fix it for the heading, we need animation improvements and amplification everywhere 

#### Animations

  + All of the animations that were discussed in the previous feedback document look like they were either ignored, skipped, or just are too underwhelming to matter
  + I do like the way that the stacked trio flows in, but it seems like almost all the elements could do more of this
  + Actually I do see some kind of animation applied in the styling of showcase cards and such, but there is no actual user experience from these — it appears like there is zero animation except for the dividers which are SUPER fast and could be slowed down as well
  + We want animation to be loud to make up for the feeling of the flat design 

#### Stacted Trio Divider

  **IMAGE FROM BEFORE THAT IS RELEVANT** 
    `assets/docs/archive/v2/IMG/v2-review-mobile-2.jpg`
    `assets/docs/archive/v2/IMG/v2-review-mobile-3.jpg`
    `assets/docs/archive/v2/IMG/v2-review-mobile-8.jpg`

  + These should be much wide, the feel strange 
  + Class in inspector listed as: `.stacked-trio scroll-reveal visible animate`

## By Section Feedback 

### Hero Section

  **IMAGE FROM BEFORE THAT IS RELEVANT** 
  `assets/docs/archive/v2/IMG/v2-review-mobile-1.jpg` 

  + Hero Section
    - It looks like there isn't any padding
  + Hero Stats
    - Big part of what flagged that we can't jump into mixing other designs with flat
    - Let's keep this above, visually separate from the hero rather than complicating part of it
    - For skills, can we switch it back to + after instead of ~ before? Just looks weird
    - To account for accuracy using the + sign, can we just have it always round down to the nearest 5 so always ending in 0 or 5?
  + We need to figure out the images
    - I don't mind the filtering
    - But the grid is cheap feeling
    - How can we make this immersive
  + Where are we pulling the Subtitle from?
    - If every entry has 3 square then we could sync the most visible of the images and the subtitle.
    - Then maybe it cycles through the three images, it can change the subtitle afterwards
  + Title versus Subtitle sizing
    - It feels like we should make the subtitle more part of the visual story
    - The animation, in part because of the size of the characters, is really cheap 

### Showcase Section

  **IMAGE FROM BEFORE THAT IS RELEVANT** 
  `assets/docs/archive/v2/IMG/v2-review-mobile-2.jpg`

  + No need for a subheading right now; it would need to be dynamic and we have too many other things to get right
  + How can we better handle the tabs since there are only four and it currently scrolls off the screen?
  + Do we maybe want to make these tiles either 80% width and right aligned to give the design some white space? Or, if it isn't too small, would two columns be doable?
  + The spacing on the tile between the `.project-card-title` and `.project-card-tags` is missing 

### Credentials Section 

  **IMAGE FROM BEFORE THAT IS RELEVANT** 
  `assets/docs/archive/v2/IMG/v2-review-mobile-3.jpg`

  + No subtext here either
    - It just creates the need for more dynamic content that we don't want to figure out right now
    - Less is more vibes
  + Padding around the entries looks excessive
  + Feels like this whole section could use white space
    - Maybe they're all narrower than the full width of the mobile device
    - I also think we could really strive to make these way more short
    - Actually, here **IS** a more interesting place for us to have the tags scroll because it gives interesting UI UX
    - This section just shouldn't take up so much real estate and there are many ways to make the cards more narrow 

### Process Section 

  **IMAGE FROM BEFORE THAT IS RELEVANT** 
  `assets/docs/archive/v2/IMG/v2-review-mobile-4.jpg` 

  + This is another space where we lost the interegue when going to mobile
  + This isn't "mobile first" design, this is converting desktop design into generic "one size fits all" mobile design, meaning, there was not any consideration put into the design of the mobile view as an independent medium — which is the opposite of mobile-first design
  + Maybe scrolling off horizontally works here?
  + And no cards? Or maybe outlines of cards but no actual card? If that is even needed maybe it isn't 

### Creative Section 

  **IMAGE FROM BEFORE THAT IS RELEVANT** 
  `assets/docs/archive/v2/IMG/v2-review-mobile-5.jpg` 

  + Again, no subtext
  + Again, the generic mobile one-size-fits-all containers
    - Maybe instead two columns?
  + Also we should be designing it so that we can dynamically populate the section either with whatever our one tag for "Producer" is or if needed a combo of "Content Production" and "Design" etc.
    - And then be able to tell it to display tags that that content use
    - So maybe it would be just having it display the "Product" tags
    - Or maybe we manually add all the tags that we want to display
    - Either way it needs to be dynamic and right now it looks very much specially created for the content too much 

### Impact Section 

  **IMAGE FROM BEFORE THAT IS RELEVANT** 
  `assets/docs/archive/v2/IMG/v2-review-mobile-6.jpg` 

  + Again, no subtext
  + Again, in cards... Just feels very "didn't try" for a mobile first design at this point, but now that we have the content figured out hopefully we can better focus on design 
  + We need to make sure that this is dynamic
    - Planning what the layout here means
    - What needs to be added to the JSON to make this work

### Achievements Section 

  **IMAGE FROM BEFORE THAT IS RELEVANT** 
  `assets/docs/archive/v2/IMG/v2-review-mobile-7.jpg`

  + No subtext
  + This is where it becomes really apparent that we need other ways to break up content and lines.

  **See image from old homepage that highlighted a button**
  `assets/docs/archive/v2/IMG/AESTHETIC-STACKED-TRIO-2.jpg`

  + I think we could do something similar here
    - Not with the black button
    - But in that the stack is used in a different way to emphasize instead of just breaking up sections
  + But obviously we can't use the stack for between all sections AND in other ways
    - We should consider using it sparingly for a section divider
    - And then find other ways to use it with purpose
    - FORM FOLLOWS FUNCTION vibes needed 

### CTA Section 

  **IMAGE FROM BEFORE THAT IS RELEVANT** 
  `assets/docs/archive/v2/IMG/v2-review-mobile-8.jpg`

  + Once again probably don't need subtext
  + All of the copy on in this section needs to be better written to make sense with the buttons

   1. Seems like we'll need a Footer CTA Header Text JSON value, and we'll need to consciously make them all the same for things like Web Design entries; that way we can have more than one CTA by featuring more than one tag — like given the content above we might want to use graphic design, and we might want to use social media advertising, or any of those — and then we want it to change every single refresh, but since we try to make them mostly the same for groups like web design, it won't be too jarring 
   2. Then Footer CTA Primary Button Text — should be a value 
   3. And Footer CTA Secondary Button Text — should be a value 

  + Then the three should be written together when filling out JSON
    - CTA TEXT: Interested in [Web Design]?
    - CTA BUTTON: See All [Web Design] Projects
    - SECONDARY BUTTON: Explore rest of the portfolio projects

### Header And Footer Navigation  

  - Not a fan of the fact that we lost the visual icons
  - We shouldn't be making less visuals replacing text, we should be replacing more text with visuals because MOBILE
  - I also didn't really want the icon for the truncated header nav to be an ACTUAL hamburger menu icon because that's really misleading for the UX — it should just be something unique but obvious that it will POP the heading nav back for them

---
