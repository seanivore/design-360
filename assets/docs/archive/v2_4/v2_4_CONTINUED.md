
# Process To Do List 
  
  1. We need to first, process through the old entries creating the missing values for all of them, and then setting up their images as CDN instead of being hosted in our repository.
  2. We then need to clean up our agentic entry creation tool, using directions from our first step to perfect the CDN part of the process. Agent should then do one end-to-end to ensure the directions are as accurate and detailed as need be. 
  3. Then we can look at the feedback I have about the homepage at #3 below. And we'll set an agent set up to process through the pending entries that need to be created. 

**Notes**: 
  - It says "Optionally upload to R2 CDN at `cdn.august.style`" in some spots but this is NOT optional at all. 
  - Then in the Cloudinary section it says things like "Or use the Cloudinary Media Library UI to upload." which doesn't seem applicable to agents.
  - In Cloudinary directions it say "Build a delivery URL with transformations. Common patterns:" even though we know exactly what is needed so there is no reason to provide common patterns instead of just literal actual directions to be followed.
  - Also "Clean up Cloudinary library after downloading" is also NOT optional; this is how we keep on the free plan: By keeping our storage on the site basically non existent
  - The directions in generally seem very out of order — I see notes about screen shots at the end of the cloudinary directions. The should be an image sourcing section after the subdirectory creation section, then cloudinary transforming details, then CDN details, then adding those CDN links to the JSON after testing them, then filling out every other field on the JSON. 

## Other CDN R2 Details 

**Account API Token**: portfolio-upload
**Permissions**: Object Read & Write 
**Buckets**: portfolio

I was provided another key that was not needed in the AWS CLI setup. It was labeled as "Use this token for authenticating against Cloudflare API" However the `ACCESS_KEY_ID` and the `ACCESS_KEY_SECRET` were added, as well as the endpoint `https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com`; note that after 'https://' and before '.r2.cloud...' is the `ACCOUNT_ID` should it be needed separately. I won't provide the token for authenticating against Cloudflare API here, since it was implied we didn't need anything else and because it probably would go into .env if we actually did need it; just let me know. 

---

# 1. Previous Entries Update 

## New JSON Values Missing 

  - Part of the plan we've been working from included converting the current JSON entries to the new Schema. 
  - This process should have also included creating the new fields. 
  - This was planned because agent and I specifically talked about how if we were changing the three section headings on the entry pages, then they would need to be rewritten to be more general and less quirky. 

## Creating New Image Directory 

  - I've moved the previous `/assets/media/...` directory slightly so that I could hide it from git.
  - For each entry being processed, they must create a new subdirectory using the slug for that entry and place it in the new location `assets/images/...` which is already also hidden from git
  - They can then find the thumbnail images and square images in the old subdirectory organized by slug, now here, hidden from git `assets/.media/...`
  - Then they can use those path locations to upload the the CDN and get that URL for the JSON
  - Images moved from the `assets/.media/...` directory should be removed from that directory, but anything else in those subdirectories should be left there as a way for us to review what other assets exist 
  - This will ensure that we are being consistent across the board with our methodology for image hosting, as well as getting us better organized, as this will also identify for me what images there are in the old media folder that never got made into an entry yet 

---

# 2. Agentic Entry Creation 

`assets/docs/ENTRY_SOP.md`

## Needs More Cleanup 

This should be written for agents to be able to add entries end-to-end, but it should still be usable by a human in case it is needed in the future. 

## Points To Cover 

**Slug will need to come first because 

  - Review the project
  - Create slug
  - Create `assets/media/{slug}/` directory 

---

# 3. Homepage Issues Feedback 

## Section Page  

When clicking through from ANY tag, no matter where it is on the site, there must always be a `&mode=` applied to either ALL or ANY. 

### Filtering Issues 

This is mentioned in the upper section but seems to be an issue in every instance. When User starts with a clear, no filter applied, section page, then applies any, it defaults to "matching: All" which is fine except that when you click the toggle to switch, the URL does not change. 

It just always says, when toggling between all and any on video for example: `https://www.august.style/section.html#tags=video&mode=all` 

Constantly when you click the "ANY" toggle it remains set to "ALL"

It should say the mode in the URL even if there is only one tag applied, for consistency. 

### Clear or Clear All Button 

When more than one tag is applied the "Clear All" button shows up next to the tags applied. 

This needs to show up even when only one tag is applied. It is fine just to always say "Clear" and nothing more. 

## Hero Homepage Section Stats 

  + While each has more than one issue, the both use "all" instead of "any" 

### Hero Stat 'ROLES' 

  + Click 'ROLES' metric and it loads to nothing
    - Should load to all roles selected with 'matching: any'
    - Loads with only "AI" tag applied which is a skill... Not sure why this is applied — oh, it removed the `-&` from `ai-&-automation` which needs to be looked into because the tag should not be applying anything but plain characters, not ampersands
    - Inaccurate current `https://www.august.style/section.html?tags=ai-&-automation-strategist+brand-designer+content-strategist+creative-director+graphic-designer+growth-strategist+product-designer+social-media-manager+video-editor+web-developer&mode=all`
    - Then changed "all" to "any"
    - Note that when you change the toggle in the filter UI from all to any, it doesn't change the URL like it should 
    - Accurate `https://www.august.style/section.html?tags=ai-automation-strategist+brand-designer+content-strategist+creative-director+graphic-designer+growth-strategist+product-designer+social-media-manager+video-editor+web-developer&mode=any`

### Hero Stat 'SKILLS' 

  + Click 'SKILLS' metric and it loads to 0 projects
    - Should load to all skills selected (they are) but with 'matching: any'
    - Changed "all" at end of URL to "any"
    - Again, not that when you change the toggle manually, it doesn't change the URL but it should for this screen and for any section screen 
    - Inaccurate current `https://www.august.style/section.html?tags=a-b-testing+adobe-creative-cloud+adobe-firefly+after-effects+analytics+animation+art-direction+automation+cms-management+capcut+content-production+copywriting+creative-cloud+davinci-resolve+data-visualization+e-commerce+editorial-design+framer+generative-ai+git+github-pages+html-css-js+illustration+jekyll+landing-page-design+lightroom+lookbook-design+lottie+make.com+motion-graphics+no-code+notion+photography+photoshop+print-design+product-staging+publishing+python+responsive-design+scaling-systems+typography+video-production+voice-interface+webflow&mode=all`
    - Accurate `https://www.august.style/section.html?tags=a-b-testing+adobe-creative-cloud+adobe-firefly+after-effects+analytics+animation+art-direction+automation+cms-management+capcut+content-production+copywriting+creative-cloud+davinci-resolve+data-visualization+e-commerce+editorial-design+framer+generative-ai+git+github-pages+html-css-js+illustration+jekyll+landing-page-design+lightroom+lookbook-design+lottie+make.com+motion-graphics+no-code+notion+photography+photoshop+print-design+product-staging+publishing+python+responsive-design+scaling-systems+typography+video-production+voice-interface+webflow&mode=any`

## Hero Visual And Content 

You can tell that on refresh, even a hard refresh, it is *NOT ACTUALLY* selecting 2 images randomly from 3 of 5 randomly selected entries out of all that fit the hero filtering. 

I would like to know what kind of shortcut the agent decided to apply without discussing it with me. That kind of updates and fixes are unacceptable because they are literally only creating more work of someone else by being laze for no reason at all. 

It is obvious because every refresh, it is the same handful of entries, even though there are over 11 entries it should be pulling from. And then of those that it keeps reusing, it is also very obviously reusing the exact same two images of the three square images. Because every single refresh it is the same content. 

## Showcase Homepage Section 

Nothing coming up from clicking React tab 

## Credentials Homepage Section 

Nothing come up when clicking the following tags: 
  - AI Integration
  - Web3 --> I saw 
  - Social Media
  - Marketing
  - Kajabi
  - Viral Content
  - 3.2 Billion Impressions (which is a fucking weird tag...)
  - App UX/UI
  - Global

## Creative Homepage Section 

These three sections should all but only using a product tag applied. 

The **first** is currently `https://www.august.style/section.html?tags=graphic-designer`

And it should be loading as `https://www.august.style/section.html#tags=digital-art-collection&mode=any` 

The **second** is currently `https://www.august.style/section.html?tags=motion-graphics+video-production`

And it should be loading as `https://www.august.style/section.html#tags=video&mode=any`

The **third** is currently `https://www.august.style/section.html?tags=brand-designer`

The 7 projects that show up for brand designer should also be showing up for what it should be loading as which is `https://www.august.style/section.html#tags=brand-identity&mode=any` 

