# v2.4.0: Dynamic Homepage Review Feedback

**Created**: 2026-03-26
**Version**: 2.4.0
**Status**: Drafting
**Project**: `~/Development/360-design`
**Domain**: `https://august.style`
**Update**: `assets/docs/archive/v2/v2_4_UPDATE_PLAN.md`

---

## Review To Do 

  - [x] Use homepage on desktop 
  - [x] Use homepage on mobile 
  - [ ] Get video and images of payments system project for new entry
  - [ ] Get video and images of this portfolio project for new entry
  - [ ] Get video and images of Thot app project for new entry
  - [ ] **RUN AUTOMATION** for entry creation, but looks like Cloudinary specifics were removed? `assets/docs/entries-prep/AGENT_CREATING_ENTRIES.md`
  - [ ] Review planning `v2_4_UPDATE_PLAN.md` and identify remaining steps 

---

## Review Feedback

### **Hero Stats Not Functional**

  When we click through the hero stats can we have Skills load to all of the skill tags applied with the AND filter, and then the same but for Roles tags. 

### **Dynamic Display Not Randomized Every Refresh**

  Every time I refresh the page it is the same headline and the same images that start in background. Can we make sure every refresh picks 1 of any of the entries that fall within the tag parameters for that section? It's important to feel like it is always fresh. 

### **Multi-Scroll Delay Before Bridge** 

  When you get past the actual headline/title/subtext/CTA buttons (they pass out of top viewport) the `.hero-visual` and `.hero-content` keep going so the user scrolls too much before the `.hero-trio-bridge` starts. We should have it start basically immediately after the above text/image pass out of frame. 

  The same deal with when the bridge is finished and faded away. This finishes and then the user has one big scroll before the `.showcase` section passes into the bottom of the viewport. We should have it start to be visible immediately after the bridge ends. 
  
  Close the UX gaps! 

### **Credential Section Tags Not Clickable** 

  The tags under each `.cred-item`, inside `.cred-tags`, each `.tag` should be clickable, taking the user through to the section page with that tag applied. 

### **Component Tag Application Logic Error** 

  * *Collection Section Tiles*

  When you click through any of the tiles in the collection section, it takes you to the section page with the tag applied, but it does not filter the results to only that tag. 

  This is how component's tags are defined on `assets/js/homepage-content.json`: 
  ```json 
  "any": ["Graphic Designer"]
  "any": ["Motion Graphics", "Video Production"]
  "any": ["Brand Designer"]
  ```

  When you click through each of those takes user to this URL which has no content and does not include all tags. 

  ```URL
  https://www.august.style/section.html?tags=Graphic+Designer
  https://www.august.style/section.html?tags=Motion+Graphics
  https://www.august.style/section.html?tags=Brand+Designer
  ```

  The accurate URL that should be created and applied is the following. 

  ```URL 
  https://www.august.style/section.html?tags=Graphic-Designer
  https://www.august.style/section.html#tags=motion-graphics+video-production
  https://www.august.style/section.html?tags=Brand-Designer
  ``` 

  We should make sure that this is not happening for other components. It might be a logic issue for all the the tags pulled from `assets/js/homepage-content.json`. 

  Actually it appears that the + and the - should determine the setting in the filter for `Matching: ANY | ALL` and does not appear to work. 

  * *CTA Buttons*

  We have the same issue with the `.cta-buttons` `.btn-primary`. Here is the components defined tags, followed by the current URL that the button takes the user to, and then the accurate URL that the button should be creating. 

  Actually, the `assets/js/homepage-content.json` file does not have a proper tag field. The **ONLY** thing that the admin should ever have to change on the `homepage-content.json` file to update the homepage is the tags listed for each component section. It should not be using a prepped href like the following which is copied from the file. 

  * *Homepage component page should not use URL, only tags*

  ```json
    "cta_section": {
    "heading": "Interested in web development?",
    "primary": {
      "text": "See All Web Projects",
      "href": "/section.html?tags=Web+Developer"
    },
    "secondary": {
      "text": "Explore Full Portfolio",
      "href": "/section.html"
    }
  }
  ```

  The `href` field should be dynamically generated based on a missing `tags` field. 

  We have the same issue with the secondary hero cta button. We need the logic to know that **ANY** component that has **no** listed tags automatically takes the user to the section page with no applied tags (`https://www.august.style/section`). 

  ```json
      },
    "cta_secondary": {
      "text": "All Projects",
      "href": "/section.html"
    }
    ```

### **Footer Behance Logo Button Distorted "e"**

  I thought we had fixed this but it is still distorted. 

### **Header Nav Contact Button Broken**

  Right now it has this: `onclick="window.location.href='mailto:horvathaugust@gmail.com'"` which causes the web browser to create a popup that says `"www.august.style" wants to open "Dia" — "Always open Dia"`. Obviously this doesn't make any sense to the user, but regardless, when you click it a new tab is opened with nothing in it and nothing else happens. It should probably just take the user to the footer just like the other header nav buttons that use anchor links. 

---
*Along with these fixes, anything remaining on the `v2_4_UPDATE_PLAN.md` should be addressed as well.*