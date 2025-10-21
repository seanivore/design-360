# Creative Generalist Portfolio 

* **Below you will find**

  1. Steps on how to add a new project to the portfolio 
  2. Tag creation guidance and usage on the site 

## Creating Project Entries 

  1. Create a JSON object for the entry 
     + Use the template making no changes without permission 
       `/Users/seanivore/Development/360-design/assets/docs/_entry_template.json`
     + Follow instructions described below 
  2. Save the completed JSON object in the `.assets/entries/...` directory 

### JSON Entry Writing  

* **Process flow builds on itself to fill out all copywriting in JSON**

  1. Get an `entry_id` by running bash command `uid` then adding an underscore to front of ID 
  2. Add `section`, applicable `sub_section`, then `slug` is the would-be HTML file name (but we don't have HTML files for each page)
     - `section` options = Print, Digital, Web, or Video 
     - `sub_section` is created based on need while building the collection of project entries
       * Reference existing sub_sections in placement.json before creating new ones
       * New sub_sections should ideally represent more than one project entry
     - `slug` field entry example = 'automated-e-commerce-shop-lookbook' (NO .html extension) 

* **After preparing above basics, human completes the following or works with AI to do so** 

  3. Complete two from the `content` > `media` section 
     - Write an `seo_title` 
       + Find two 'hooks' fitting generalist appeal; 'Sell the click' by fitting our Message of creating this site 
       + Example: "Framer CMS Shop Gallery, Lookbook, & AI Podcast Blog" 
     - Compose `seo_description` 
       + Give context to hooks by complimenting, expanding on the title conceptually 
       + Example: "Bauhaus inspired custom Framer website design with engaging interactive component shapes." 
  4. Now you can create the `categorization` > `placement` > `file_name` by simplifying the `seo_title` 
     - This is the rest of the project entry URL so remove stop words, prepositions, determiners from `seo_title` 
     - Replace spaces with hyphens and make everything lowercase 
     - Example: 'blog-lookbook-print-gallery.html' 
  5. Finally, add all `media` > `assets` (schema v3.1 fields)
     - The `video_filename` which is collected for possible future needs  
     - If available, add any `video_url` so it can be linked throughout the post a few times 
     - If there was a video, grab and slightly edit the `video_embed` to place it on the page 
       + Have the double quotes changed to single 
       + Replace 'YouTube Video Player' with the project entry's `seo_title`
       + **NEW:** Add `video_alt_text` describing the video for accessibility
     - Gather `thumbnail_images` and prepare them accordingly  
       + Select ~ 6 images to become gesture-swiped collection of content tile thumbnails 
       + Crop and resize thumbnail images to 1920 px by 1080 px
       + **NEW:** Add `thumb_slideshow_alt_text` describing the slideshow for accessibility 
     - Then add `page_imagery` to the array if available 
       + Use video stills, images from old portfolio posts, or at least the actual thumbnails from the tile placement 
       + They must be converted and compressed in the same way the `thumbnail_images` were
       + **NEW:** Add `page_image_group_alt_text` describing the additional images for accessibility
     - Most projects will have a `project_url` to link to; i.e. websites designed or developed, social media posts, etc. 
       + This will display as prominent embed card on entry page
     - Then add the `github_repository` if available, to be placed on the project entry page
       + This will display as GitHub-style repo card 
  6. Add `notes` to aid AI in filling out rest of JSON 
     - Look through the old portfolio entries, most can be found in applying-to-jobs directory 
     - Include summaries from those documents and also add any URL to previous portfolio entry posts 
  7. Be sure to fill out any alt. text as you go 

* **AI should now use all resources available to complete JSON for Sean to review afterwards** 

  8. Create `page_title` and `page_subtitle` 
     - Simplify the `seo_title` into concise and direct `page_title` 
     - Fit the rest of the messaging from the `seo_title` into the `page_subtitle` 
     - Example `page_title`: "Framer CMS Site Built Using AI & Notion" 
     - Example `page_subtitle`: "With micro-interactive bauhaus-inspired design" 
  9. Choose a `breadcrumb` 
     - Choose a few words within the theme of the titles, filename, etc. 
     - For example using the `seo_title` 'Framer CMS Web Design Shop, Gallery, AI Blog'
     - Example: "Automated Design Blog CMS" 
  10. Compose handful of `tile_text` lines 
     - Use all the concepts and drafted text for ideation, capitalizing on what best fits website message and intention 
     - These should tell the story, the highlights about the project, even impressive KPI metrics 
     - Combined with thumbnails, we're creating a UI that has a UX where hiring managers don't have to click into many projects 
     - Examples: 
       + "AI generated blogs examine Podcast concepts"
       + "Automated build using Notion to CMS integration" 
       + "1 component + Notion database = 81 image fashion magazine" 
       + "Build an entire web store in minutes with CMS and Notion" 

* **Copy above as a resource, AI can write 2-4 sentences for the `page_copy` items and a single `tagging` item** 

  11. These 4 will be headers and page sections mirrored on every project entry page 
      - (1) In the `tagging` section add **ONE** `role` for the project (schema v3.1: role is STRING not array)
        + **CRITICAL:** Choose ONLY ONE role from placement.json > contextual_tags > role
        + This is displayed as H3 heading on entry page, NOT in tags hover card
        + Still hyperlinked to filtered section page
        + Context of involvement, relationship to project 
        + If there are other roles that you wanted to add, PUT THEM IN SKILLS  
      - (2) Write `pattern` section  
        + This should humbly, indirectly highlight my innate pattern spotting ability
        + Frame this as the logic behind why the project was an opportunity to take on 
        + This likely shows the content of and strategy logic behind taking on the opportunity as a project 
      - (3) Write `action` section 
        + This would be the resulting moves, execution, procedure, and resources committed
        + Frame this as how the opportunity was capitalized on
      - (4) Write `measured` section 
        + This should show or define how to tell project was a success 
        + Frame this as metrics like KPIs, generally speaking, the results, or at least some thoughts for next time 

* **Lastly, AI fills in section `tagging` which are used for content tile filtering and contextual information** 

  12. Populate JSON tag lists for context tag types using placement.json as reference
      - **ALWAYS** reference placement.json > active_tags > contextual_tags before adding tags
      - `technology` tags - List all temporally relevant or topical technology used
      - `media` tags - Where this project lived; the place technology and skill met
      - `skill` tags - Remaining terminology hiring managers want to know
      - Try to use existing tags before creating new ones
      - If creating new tag, ensure it doesn't duplicate existing concepts 

### Tag Creation Protocol Guidance 

* **Our three types of tags** 

  1. Section tags 
     + These define placement of project entries into actual website sections 
       - They are the names of our homepage tiles 
       - They informs which tiles should populate based on section-type tag selected 
  2. Toggle tags *THESE ARE ON FEATURED DOCUMENT TO BE CREATED AND MUST PULL FROM USED CONTEXTUAL TAGS* 
     + Select tags listed at top of section pages to navigate by filtering down project tiles 
     + Each project page will include tags in out-of-way top-right region; click through goes to section page sorted to see only that content 
  3. Contextual tag  
     + These are meant to be very comprehensive, capitalizing on words used on job openings and on resumes 
     + The will also be placed on the project entry page top-right as toggle tag point describes above 

  + **ALWAYS reference placement.json for current tag lists**
    - Location: `/Users/seanivore/Development/360-design/assets/js/placement.json`
    - Schema 2.0 includes comprehensive tag catalog with usage notes
    - Check active_tags > contextual_tags for all approved tags
  + Rather than new or one long tag 
    - Try to use combination of small shorter tags 
    - This makes them all more versatile 
    - It keeps the overall number of tags down while creating more overlap
  + **Entry Page Display:**
    - Tags hover card (top right + bottom right) shows: technology, media, skill ONLY
    - Role is displayed as H3 heading, NOT in tags card
    - Section and sub_section shown in breadcrumbs, NOT in tags
    - All tags clickable links to filtered section page 