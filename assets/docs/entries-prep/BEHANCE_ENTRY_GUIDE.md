# Behance Entry Procedure 

## Overview 

How to create a JSON from a Behance project URL. The primary need-to-know information is regarding the specific embed code for the project. 

### Resources Provided 

  + UNALTERED EMBED FOR PATTERN 

```html
<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 78.2178%;"><iframe src="https://www.behance.net/embed/project/226118003?ilo0=1" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen allow="clipboard-write *; fullscreen *;"></iframe></div>
```

  + RAW PROJECT URL **Behance Projects to Add**

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

### Procedure 

  1. View the tagged Behance gallery entry page 
  2. Pull the URL
  3. Copy the number in the URL after `gallery/` 
  4. Paste the number into the iFrame pattern above, replacing the number after `project/` before the `?` question mark 
  5. Replace the iFrame code "QUOTATION MARKS" to single 'APOSTROPHES' to function in the JSON  
  6. Paste updated embed code in JSON at `content.media.video_embed` 
  7. Ensure `categorization.placement.section` is always "Digital" 
  8. Ensure `categorization. placement.sub_section` is always "Generative" unless otherwise noted 
  9. Create a short slug for the page URL at `categorization.placement.slug` 
  10. Include all provided values below for `categorization.tagging.technology` unless otherwise noted 
  11. In `categorization.tagging.media` always include "Digital Art, Print, Social Media, Digital Product, NFT" 
  12. Add to `categorization.tagging.media` the Art History Movement Style any anything else notable like "Painting, Still Life" in example 
  13. Ensure `categorization.tagging.role` is always "Graphic Designer" 
  14. In `categorization.tagging.skill` always include "Content Production, Graphic Design, Illustration, Scaling System, Publishing, Marketing, Branding, Product" 
  15. Add to `categorization.tagging.skill` relevant tags from the following: "Fashion Photography, Product Staging, Art History" and any other pertinent keywords 
  16. All value fields with just "" are to be left empty including `content.media.video_filename` and `video_url` 
  17. Detail the content based on context for `content.media.video_alt_text` and `thumb_slideshow_alt_text`
  18. Paste the full actual gallery page URL into `content.assets.project_url` 
  19. Create a simple, easy-to-read version of the URL, as in the example, for `content.assets.project_url_text`
  20. Using the context of the page, prepare the following text copywriting values using the text in example below as directions: 
      - `content.teaser_copy.seo_title`
      - `content.teaser_copy.seo_description` 
      - `content.teaser_copy.page_title`
      - `content.teaser_copy.page_subtitle`
      - `content.teaser_copy.breadcrumb` just a few words to save space on the page 
      - `content.teaser_copy.tile_text` 
  21. Using the context of the page, prepare the following page entry copy using the text in the example below as directions: 
      - `content.page_copy.pattern` 
      - `content.page_copy.action` 
      - `content.page_copy.measured`
  22. Once complete simply provide the objects individually or with a handful in a group 

### JSON Object to Replicate 

```JSON
{
"categorization": {
    "entry_id": "", 
    "placement": {
        "section": "Digital",
        "sub_section": "Generative", 
        "slug": "baroque-de-heem-still-life"
    },
    "tagging":{
        "technology": ["AI, Generative, Adobe Firefly, Photoshop In-Painting"],
        "media": ["Baroque, Painting, Still Life, Digital Art, Print, Social Media, Digital Product, NFT"],
        "role": "Graphic Designer", 
        "skill": ["Content Production, Graphic Design, Illustration, Fashion Photography, Product Staging, Scaling System, Publishing, Marketing, Art History, Branding, Product"]
    }
},

"content": {
    "media": {
        "video_filename": "",
        "video_url": "",
        "video_embed": "<div style='left: 0; width: 100%; height: 0; position: relative; padding-bottom: 78.2178%;'><iframe src='https://www.behance.net/embed/project/226118003?ilo0=1' style='top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;' allowfullscreen allow='clipboard-write *; fullscreen *;'></iframe></div>", 
        "video_alt_text": "A series of polished, professional looking paintings of a fruit still life scene, produced in the style of Jan Davidsz de Heem",
        "thumbnail_images": [""], 
        "thumb_slideshow_alt_text": "A series of polished, professional looking paintings of a fruit still life scene, produced in the style of Jan Davidsz de Heem",
        "page_imagery": [""],
        "page_image_group_alt_text": ""
        },
    "assets": {
        "project_url_text": "behance.net/gallery/Jan-Davidsz-de-Heem-Still-Life",
        "project_url": "https://www.behance.net/gallery/226118003/Still-Life-Baroque-Fruit-Jan-Davidsz-de-Heem-Inspired",
        "github_repository": ""
    },
    "teaser_copy":{
        "seo_title": "Create proper SEO Title using best practices; here used only in page meta data",
        "seo_description": "Create proper SEO Description using best practices; here used only in page meta data", 
        "page_title": "Page title is a short, simple version of the SEO title; displayed only the actual project entry page", 
        "page_subtitle": "Page subtitle is space for the extra context that needed to be pulled to shorten the title, shown under the title", 
        "breadcrumb": "Baroque Fruit Painting",
        "tile_text": [
            "About three or four different lines of text that are teasers to the content", 
            "Help to tell as much of the story of the project entry as possible", 
            "These cycle right on the website content tile"
        ]
    },
    "page_copy":{
        "pattern": "Very short paragraph identifying what visual aesthetic traits the ART HISTORY MOVEMENT AS A WHOLE require",
        "action": "Very short paragraph identifying how it was executed in this entry's case", 
        "measured": "Very short paragraph about results and impact" 
    }
}
}
```