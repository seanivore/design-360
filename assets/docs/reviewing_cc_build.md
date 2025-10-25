# Website Feedback for Claude Code Build 

## Fix Updates Made *2025-10-25 & 22* 

  1. All loading but not rendering issues fixed across all three templates 
  2. Functioning of filter UI on section pages adjusted 
  3. Homepage tile design updated 

## Issues *Updated 2025-10-25*

### 1. Tag Logic 

#### `placement.json` Toggle-Tag Keywords on Section Page 

  * **`toggle_tag` is search query; show all `contextual_tags` with partial word match** 

    + Featured content is coordinated using tags listed here at `placement.json` `active_tags.toggle_tags` 
    + Project entry JSONs do **NOT** have `toggle_tags` listed, only `contextual_tags` to be featured 
    + Use provided `toggle_tag` as search terms that find any tags from the follow on `placement.json`; match even just one word 
      - `categorization.tagging.technology` results 
      - `categorization.tagging.media` results 
      - `categorization.tagging.skill` results 

  * **Example of what to show in the tag filter list along with their entries** 

    + Feature those search result tags by placing them in the section-type section pages 
      - For example, right now the tags one `august.style/web/` say "AI, Copywriting, Marketing, Product"  
    + But take 'Product' for example, when tag is clicked: `august.style/web#tags=web+product`
      - All entries with 'product' listed under their `active_tags.placement_tags.contextual_tags.skill` show (fine) 
      - It **SHOULD** also include 'Digital Product' `active_tags.placement_tags.contextual_tags.media`
      - It **SHOULD** also include 'Product Staging' from `active_tags.placement_tags.contextual_tags.skill`
    + The same logic should apply for any tags from those three groups that have 'AI' in them, etc. for all the toggle_tag keywords

#### Weird URL Behavior When Using "GO BACK" from Entry Page Selected With Tag Applied  

  * **Sticking on the same URL example, but go to an entry page, then go back, nothing shows on same URL**

    + When no tag is applied, accurate: `august.style/web`
      - All entries with 'web' under their `active_tags.placement_tags.section` list 
    + When tag is clicked: `august.style/web#tags=web+product`
    + When I click an entry result, then 'Go Back' from the entry to the Web Section page 
      - The URL is still `august.style/web#tags=web+product` (which is good )
      - But the URL shows NO ENTRIES  
      - Even SHIFT-COMMAND-R refresh doesn't show any entries 
      - BUT if you click PRODUCT again while on this URL, the URL stays the same, but entries DO show up (?) 
    + Proper behavior is just that when you go back, it should show the filtered Product tagged entries with a Web section tag 

  * **The same strange behavior happens for any** 

    + `toggle_tag` keywords in the navigation filter
    + `section` tags in the filter 

#### Missing the role Tags on the Section Page Nav Filters 

  * **In the horizontal row of tags we should have the following** 

    + First are any tags listed under `active_tags.placement_tags.sub_section.web` 
    + Second are listed any keywords from `active_tags.toggle_tags` **THAT DO HAVE AN ENTRY, NO EMPTY TAGS SHOULD LIST** 
    + Third and missing tags are the `active_tags.placement_tags.contextual_tags.role` 
      - Again though, only show tags that have 'web' under `active_tags.placement_tags.section`
      - **AND** have that `role` tag 
      - As in, don't list empty `role` tags 

#### Clicking a Contextual Tag on an Entry Page's Tag List 

  * **When on an entry page and a contextual tag is clicked, the section page URL is accurate, but it isn't filtering** 

    + For example if you're on this entry page `august.style/web/webflow/automated-e-commerce-shop-lookbook`
      - Then you click 'CMS' from the tags on the page 
      - You are taken to `august.style/web#tag=cms` which is accurate 
      - But it shows all 15 project tiles 

#### We Do **NOT** Want **Special** sub_section Section Pages 

  * **When you click the `sub_section` in an entry's `breadcrumb` it goes to a special page and shouldn't**

    + For example if you're on this entry page 
      - If you click the 'Webflow' breadcrumb it goes to this page `august.style/web/webflow` **don't want**
      - But when you click 'Webflow' from the list of tags on the page it goes to `august.style/web#tag=webflow` **ACCURATE URL** 
      - (And as mentioned in note above this one, all 15 projects are listed on that URL which is **NOT ACCURATE**)

    + We don't want the special page because it makes the UX more complex than it needs to be 

  * **Treat the sub_section tags the same as other tags in all places**

### 2. Homepage Tile Design 

  * **More design adjustments coming...**

### 3. Section Page Filter Tag Navigation Design 

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
