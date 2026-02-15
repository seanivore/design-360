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

1. All entries added to old portfolio here: `assets/docs/entries-prep/ORIGINAL_PORTFOLIO.md` 
2. More Behance entries from: `assets/docs/entries-prep/BEHANCE_ENTRY_GUIDE.md` 
3. Podcast Channel Entry: `assets/docs/entries-prep/ASTROFLUENCED_PODCAST.md` 
4. Any projects from this small portfolio: `assets/docs/entries-prep/PROJECTS_PORTFOLIO.md`



---

## Projects Created 

---

**Date**: Date that you are creating this project JSON entry  
**PROJECT JSON**: [assets/entries/<data.categorization.entry_id>.json](/assets/entries/<data.categorization.entry_id>.json)
**NEW URL**: `https://august.style/<data.categorization.placement.section>/<data.categorization.placement.sub_section>/<data.categorization.placement.slug>`
**ORIGINAL ASSET**: URL if available or path to whatever was provided to create the entry 

---