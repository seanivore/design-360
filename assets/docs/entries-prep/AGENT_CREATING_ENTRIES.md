# Create Project Portfolio Entries 

## Overview 

I have many portfolio project entries across different web assets that we need to recreate in our new project entry JSON format. Note that **ALL WEB DEVELOPMENT PROJECTS ARE ALREADY DONE** — but that does not mean a project should be skipped. It is more likely that the project just needs to be framed based on the content specifically. This is the case for many of my original portfolio entries where the creation of a website was combined with the content that the entry is also talking about. For this new JSON entry portfolio these must be separated for UX purposes. 

  * **Use the project resources provided to produce a project JSON** 
    
    1. Review all the resources 
    2. Fill in the values of our JSON project entry schema 
   
  * **Update and improve this document as you go for future agent instances** 

### Before Starting 

  **MUST REVIEW** 
  
  1. About this website architecture: `assets/docs/JSON_ARCHITECTURE.md`
  2. Fully understand the project JSON template: `assets/docs/_entry_template.json` 
  3. Examine live example entry if needed: `assets/entries/uid-bsj-738.json` 

### Project Entry Procedure 

  3. Go to next project URL
     - You will need to come up with a proper slug to use for project assets and JSON 
     - You'll need details for the categorization section of the JSON 
     - You'll need details for the content section of the JSON 
     - You'll need images to prepare for the project JSON thumbnails  
  4. Scrape if needed 
     - Please first create a specific scrape directory and hide entire directory from GIT 
     - Please use the scrape directory for all project JSONs you prepare and scrape 
  5. Run bash command `project` and new project JSON will be created 
     - It is initially placed in `assets/docs/...`
     - It will have a unique ID as the filename 
     - The same filename will already be accurately placed on the JSON at `data.categorization.entry_id` 
     - The rest of the JSON values will need to be filled in 
     - JSON values being skipped, that can be skipped, should have contents deleted and left empty 
  6. Create a new directory for the project assets at `assets/media/<project-slug>` 
  7. Prepare necessary images for the project JSON 
     - Use original project URL images 
     - Follow [Project Slide Images](#project-slide-images) details 
     - Add finished image relative paths to `data.content.media.thumbnail_images` array
     - If it is a Behance project URL, create the embed code using this guide: `assets/docs/entries-prep/BEHANCE_ENTRY_GUIDE.md`
  8. Complete rest of project JSON values necessary to create a valid entry 
     - Flag the entry if there is any missing values that are required 
     - Flag the entry if there needs to be a video either created or uploaded to Youtube 
  9.  Move completed JSON files to `assets/entries/`
     - If images or other values are missing, please leave the project JSON where it is 
  10. Add entry to [Projects Created](#projects-created) section below 
  11. Remove the project from list, if applicable (Behance), or just note completion on the document 
  12. Every 5-10 new project JSONs finished and added to `assets/entries/`, please simply use bash command `git push` 
  13. Keep this document updated and adjust anything that will make it easier for future agent instances 

### Project Slide Images  

**Cloudinary Image Manipulation** 

  + Cloud name: dzrtucxh7 
  + Environment variable is set up in `.env`
  + Environment variable includes the cloud name so you might not need that 
  
  1. Place scraped image either in a temp folder, downloads, or a new directory in this repository 
  2. Upload image to Cloudinary and remember asset ID for final step 
  3. Make the necessary cropping and resizing 
  4. Adjust to proper format: .webp and, if offered, compress image 
  5. Get completed image from Cloudinary provided URL 
     - Place into `assets/media/<project-slug>/thumb-slide-<project-slug>-1.webp`
     - Increase the number for each slide image 
  6. Add to the project's JSON `slides` array according to the template directions: `assets/docs/_entry_template.json` 
  7. Delete the image you uploaded from the Cloudinary library 

**First Use** 

  + Research and figure out how to use Cloudinary API 
    - Search online 
    - Reference docs here: `assets/docs/entries-prep/CLOUDINARY_IMAGE_API.md` 
  + After figuring it out, please create a guide for agents and add it to this document 

* **NOTE**: No other images need to be created for a project JSON file, only slideshow images are required 

---

## Project Entry Resources 

**REMEMBER**: Skip entries if they are exclusively web design/development and the rest of the content can't be framed for a different section. 

1. All entries added to old portfolio 
2. More Behance entries 
3. Any projects from this small portfolio: `assets/docs/entries-prep/PROJECTS_PORTFOLIO.md`

---

### Getting Into All Of The Old Portfolio Posts 

All from here: `assets/docs/entries-prep/ORIGINAL_PORTFOLIO.md` 

   + Also have some specific ideas on framing
     - Something super simple, to the point, visual, about custom animations made in adobe apps and lottie `https://developer-technologist.august.style/advanced-animation-system`
     - High level complex decision making with many variables creating a matrix for in depth pros and cons wtih research `https://developer-technologist.august.style/thought-chaining-early-analysis`
     - This one is so pretty and could be powerful `https://developer-technologist.august.style/embeddings-art-curation`
     - App development working with agency from in-house, consulting, approving, etc. -- powerful metrics to lead with `https://developer-technologist.august.style/ux-ui-ios-marketing`
     - This could be presented in a way that makes it more all-purpose and not just for planning outfit designs; it would be really innovative "content production" project to have `https://developer-technologist.august.style/agentic-fashion-designer` -- another one for this post `https://developer-technologist.august.style/ai-fashion-strategy` 
     - Automations updating Webflow Store front and paired with various written articles; lead with diagrams to draw eyeballs in `https://developer-technologist.august.style/full-stack-automated-ecommerce` oh back and and etsy here too -- wow lots of different ones in here this should be separate posts in the new portfolio
     - Digital art, branding, motion design, gifs, memes `https://developer-technologist.august.style/product-marketing-branding` oh and here is even more design for branding `https://developer-technologist.august.style/web3-strategy-branding` oh and here are more `https://developer-technologist.august.style/technical-defi-content-simplification`
     - Influencer growth pitch deck for freelancers; might be interesting to pull out all copy and see what NotebookLM makes for additional presentation decks `https://developer-technologist.august.style/influencer-growth-strategy`
   + Wooahhh wait omg NotebookLM could create pitch decks for all of these, i'd just ask them to pretent it was framework for an MVP procuct and that it would be pitched to investors
   + **IMPORTANT** -- we need to investigate how the extra images display, how it handlees gifs, and more because these posts are far more visual and dynamic than the current planing on the JSON was build for 
   + More framing
     - Very important viral video products, it was a team but i was the only one writing 5 page long emails of feedback with tiny specifics to chagne to optimize for video shorts; which basically i was making video shorts 10 years ago; there are multiple videos and uploas that we need to make separate video section posts for `https://developer-technologist.august.style/viral-campaign-strategy`
     - More very important award winning viral social media posts, cutting edge, using the consumer tech adoption curve as a means of advantage for strategy in content `https://developer-technologist.august.style/realtime-social-system` -- another `https://developer-technologist.august.style/content-strategy-framework`
     - Very important social advertising project `https://developer-technologist.august.style/social-advertising-strategy`
     - Hm, we don't have this web design posted, but it is visual and also waa made in a day for COVID assistance `https://developer-technologist.august.style/public-health-response-platform`
     - Could be broken down or left as very in depth process; i like the review round parts -- the research itteration with helpful output sort of like notebooklm but marketed better could be a product to build on its own `https://developer-technologist.august.style/agentic-marketing-department` -- ah and here is one more specifically on that idea `https://developer-technologist.august.style/scalable-augmented-generative-podcasts` (another `assets/docs/entries-prep/ASTROFLUENCED_PODCAST.md`) and here's one on automated video short production over API (i begged this company to build this platform lol) `https://developer-technologist.august.style/api-automate-video-production` 
     - This is really perhaps about how AI can help you manage projects bigger than you ever imagined cause that was what happened here for the first time `https://developer-technologist.august.style/ai-virtual-photoshoot-design` to strengthen a modern content production section
     - More modern content production important ones; the emphasis should be that it is good to experiment and understand what options there are for innovations but that there is no subsitute for humans becasue thats what they want to hear `https://developer-technologist.august.style/agentic-social-manager`
     - For a print section addition `https://developer-technologist.august.style/illustrated-poetry-book`
     - Hand drawn digital NFT series `https://developer-technologist.august.style/vector-nft-art` 

---

### Behance Projects to Add

  + `https://www.behance.net/gallery/189957541/Designing-contemporary-art-nouveau-for-a-brand` 
  + `https://www.behance.net/gallery/191705387/Burning-desire-to-distain-back`
  + `https://www.behance.net/gallery/193452985/Mid-Century-Modern-Art-Deco-Geometric-Abstract` 
  + `https://www.behance.net/gallery/215001851/Instagram-Superbloom-Photoshoot-Male-Models`
  + `https://www.behance.net/gallery/215001693/Tripping-Animated-AI-Generated-Artwork`
  + `https://www.behance.net/gallery/215001371/Neo-Expressionism-Oil-Painting-Abstract-Cyberpunk`
  + `https://www.behance.net/gallery/215001149/Art-Nouveau-Female-Model-Iconic-Camera-Pose-Make-up` 
  + `https://www.behance.net/gallery/215000891/Psychedelic-Desert-Drive-to-Alien-Vegas` 
  + `https://www.behance.net/gallery/184561511/Degradation-of-pride` 
  + `https://www.behance.net/gallery/184259979/Transmutations-of-a-Conscious-Hyperobject`
  + `https://www.behance.net/gallery/183958871/All-that-glitters-might-be-dangerous-aliens` 
  + `https://www.behance.net/gallery/183961255/My-robot-commune-life` 

#### Procedure  

  1. Copy the number in the URL after `gallery/` 
  2. Paste the number into the iFrame pattern above, replacing the number after `project/` before the `?` question mark 
  3. Replace the iFrame code "QUOTATION MARKS" to single 'APOSTROPHES' to function in the JSON  
  4. Paste updated embed code in JSON at `content.media.video_embed` 
  5. Ensure `categorization.placement.section` is always "Digital" 
  6. Ensure `categorization. placement.sub_section` is always "Generative" unless otherwise noted 
  7. Create a short slug for the page URL at `categorization.placement.slug` 
  8.  In `categorization.tagging.media` always include "Digital Art, Print, Social Media, Digital Product, NFT" 
  9.  Add to `categorization.tagging.media` the Art History Movement Style any anything else notable like "Painting, Still Life" in example 
  10. Ensure `categorization.tagging.role` is always "Graphic Designer" 
  11. In `categorization.tagging.skill` always include "Content Production, Graphic Design, Illustration, Scaling System, Publishing, Marketing, Branding, Product" 
  12. Add to `categorization.tagging.skill` relevant tags from the following: "Fashion Photography, Product Staging, Art History" and any other pertinent keywords 
  13. All value fields with just "" are to be left empty including `content.media.video_filename` and `video_url` 
  14. Detail the content based on context for `content.media.video_alt_text` and `thumb_slideshow_alt_text`
  15.  Paste the full actual gallery page URL into `content.assets.project_url` 
  16.  Create a simple, easy-to-read version of the URL, as in the example, for `content.assets.project_url_text`
  17. Using the context of the page, prepare the following text copywriting values using the text in example below as directions: 
  18. Using the context of the page, prepare the following page entry copy using the text in the example below as directions: 

### Unaltered Embed for Pattern  

```html
<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 78.2178%;"><iframe src="https://www.behance.net/embed/project/226118003?ilo0=1" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen allow="clipboard-write *; fullscreen *;"></iframe></div>
```

---

## Projects Created 

---

**Date**: Date that you are creating this project JSON entry  
**PROJECT JSON**: [assets/entries/<data.categorization.entry_id>.json](/assets/entries/<data.categorization.entry_id>.json)
**NEW URL**: `https://august.style/<data.categorization.placement.section>/<data.categorization.placement.sub_section>/<data.categorization.placement.slug>`
**ORIGINAL ASSET**: URL if available or path to whatever was provided to create the entry 

---