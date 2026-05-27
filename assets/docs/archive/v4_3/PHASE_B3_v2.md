# **ENTRY TITLE**: ART HISTORY — An Art-Print Business That Runs Itself

**Planning**: 
  - PHASE: B
  - Group: 3
**JSON Details**:
  - SLUG: automated-art-print-business
  - LAYOUT: Flow
  - THUMBS: 
  - ACHIEVEMENT: []
**Needed To Post**:
  - PLACEMENT: Images, headings, and lists are placed to reflect their flow placement; this should be evident reading straight down the page.
  - Anything with **Bold** notation is notation about the placement and not actually meant to be published on the page. This often is followed by bullet points adding notation that isn't to be published verbatim.
  - We should consider centering H4 headings if it can be consistent and look good on all posts with the same type of 'flow' layout.
  - Any URLs added within page copy should be hyperlinked in the same way in the published version
  - HYPERFRAME: Something animated that in engages and encourages the user to scroll and enjoy scrolling up and down. The embeddings step has real data-viz — artworks settling into clusters is a natural moment to animate.
**Created**: 2026-05-20
**Updated**: 2026-05-23
**Update Details**: Reformatted to match B1's paragraph-first style — each project opens with a real explanation of what it is and why it's interesting before the bullet detail kicks in. Substance pulled from the source JSONs (chp-854 embeddings, wnw-867 timeless storefront, scz-944 full-stack automation, dff-987 800-product store, sez-023 paid social) so a non-technical reader can actually follow what I did. Headings preserved.
**Original**: N/A
**Status**: Drafting
**Built from**: 
  - `assets/drafts/uid-chp-854.json` *Embeddings Art Curation*
  - `assets/entries/uid-wnw-867.json` *Minimalist Web Store Product*
  - `assets/drafts/uid-scz-944.json` *Full-Stack Automated E-Commerce*
  - `assets/entries/uid-dff-987.json` *Automated E-Commerce Shop Lookbook — art-history facet*
  - `assets/entries/uid-sez-023.json` *Social Advertising Strategy*
**Must do**: 
  - `MEDIA` callouts need producing
  - B4 (managing the mass volume of prints) appends to this entry later, once that layout exists
  - FLAG: the `social-advertising-strategy` entry's copy currently reads advocacy-generic — re-point it to the print shop
  - FLAG: `automated-e-commerce-shop-lookbook` is shared with B2 — needs distinct art-history visuals here
**Structure**: 
  - ART HISTORY — An Art-Print Business That Runs Itself
    - **Systems Architect**
      - *Learning Art History By Making It*
        - The Print Catalog
          - What the catalog held
          - Why generative AI changed what was possible
      - *Curation That Scales*
        - Embeddings-Based Art Curation
          - What the problem actually was
          - How the system worked
          - What it returned
    - **E-Commerce Developer**
      - *Building The Storefront*
        - Timeless Gallery For Art Prints
          - The brief
          - The build
        - A Store That Runs Itself
          - The brief
          - The build
        - The 800-Product Automated Store
          - The brief
          - The build
    - **Growth Marketer**
      - *Selling The Prints*
        - Paid Social At $0.003 Per Engagement
          - What the numbers actually mean
          - How I got there

---

## Systems Architect

The [fashion work in B2](https://www.august.style/agentic-fashion-designer/) pointed the narrative method at a single discipline — design. ART HISTORY is what happens when the same systems thinking runs an entire business.

It started as a realization, not a business plan. Because of generative AI, for the first time in human history you could learn an art movement through pure visual immersion — see Bauhaus rendered five hundred different ways, instead of through the handful of works that happened to survive in the textbook. So I built a business on it: an art-print shop where every print taught a movement, and the whole operation — curation, listing, copy, fulfillment, sales — was designed to run without me.

### Learning Art History By Making It

The catalog began with a brand built around studying the greats by recreating them. The "studying" came from the act of producing the prints themselves: you cannot render Impressionism a hundred different ways without learning what makes it Impressionism. That's the part that doesn't show up in any art history class.

#### The Print Catalog

**MEDIA: Single row, one image — a grid showing one movement (e.g. Bauhaus) rendered many ways; the "visual immersion" idea in one image. `assets/.media/automated-art-print-business/flow-automated-art-print-business-01.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + What the catalog held:
    - Around 30 historic art movements, each studied through a multi-part article series alongside the prints
    - Hundreds of prints rendered movement-accurate — researched detailing, faithful to the aesthetics that made each style iconic
    - Each print sat alongside the writing that explained the movement it came from — the catalog and the curriculum are the same object

  + Why generative AI changed what was possible:
    - Before AI, you study art history through a textbook's chosen examples — a tiny slice of what was ever made
    - With AI, you can render a movement through its actual visual logic, hundreds of times, until you understand what makes it itself
    - And each print could be sold as a single-edition piece across Etsy, social, and the store — so the catalog could be as large as the research justified

### Curation That Scales

A catalog this size breaks the traditional curation model immediately — no human can hand-sort hundreds of artworks into coherent collections that actually share visual DNA. So I let the images sort themselves, using the same kind of neural model behind image search.

#### [Embeddings-Based Art Curation](https://www.august.style/embeddings-art-curation/)

This is the part of the project where the system started genuinely surprising me. "Embeddings" are a way of turning images into numbers that capture what they *look like* — not what they're labeled as. CLIP, the model I used, was trained on hundreds of millions of image-text pairs, so its sense of visual similarity tracks human intuition fairly well. PCA is a math trick that lets you take those high-dimensional numbers and squash them down to two or three so you can actually plot them. When you do, related artworks fall into visible clusters — automatically.

**MEDIA: Single row, one image — the CLIP/PCA cluster visualization: artworks plotted in reduced embedding space, visible clusters. This chart already exists on the live page; capture it cleanly. `assets/.media/automated-art-print-business/flow-automated-art-print-business-02.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + What the problem actually was:
    - Curation is traditionally a deeply subjective process — curators spend years developing visual intuition
    - That doesn't scale to a catalog of hundreds of pieces, and certainly not to one growing every week
    - I wanted curation to be quantitative without losing the thing that makes good curation good

  + How the system worked:
    - OpenAI's CLIP model generated high-dimensional embeddings for every artwork — capturing the visual character, not the file name
    - PCA reduced those embeddings to a small number of dimensions so the relationships became plottable
    - Clusters fell out naturally — artworks a human curator would intuitively group together appeared as visible neighborhoods on the chart

  + What it returned:
    - A quantitative foundation for curation that scales to any catalog size
    - Surprising non-obvious connections — pieces grouped by composition, palette, or subject matter rather than by tag or title
    - A reusable template I could point at any other large visual catalog

---

## E-Commerce Developer

Curation feeds a store. I built the storefront three different ways, each one proving a different point about what e-commerce can look like when most of the work is automated.

### Building The Storefront

#### [Timeless Gallery For Art Prints](https://www.august.style/minimalist-web-store-product/)

The first storefront made one argument: when the product is visual art, the website should get out of the way. Art commerce runs on trust, and trust does not look like a busy interface. So the design choice was restraint — large product photography, generous white space, restrained typography, and a clean two-column layout where the print is on one side and the essentials sit quietly on the other.

**MEDIA: Single row, one image — the timeless gallery storefront in motion, ideally showing both the gallery browse and a product detail page. YouTube `https://youtu.be/9qVi5_zoNaM`. `assets/.media/automated-art-print-business/flow-automated-art-print-business-03.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + The brief:
    - 500+ item catalog with browsing that doesn't fatigue the visitor
    - Visual restraint — the prints are the visual art, so the interface stays quiet
    - A timeless aesthetic on purpose; art commerce runs on trust, and trust shouldn't look dated

  + The build:
    - Webflow store, custom design — minimalist gallery prioritizing the photography
    - Clean category filtering that handles a large catalog without overwhelming
    - Staging photography showing prints in realistic home settings, so customers can visualize scale without the staging dominating the product itself
    - Historically accurate descriptions, AI-optimized for search

#### [A Store That Runs Itself](https://developer-technologist.august.style/full-stack-automated-ecommerce)

The second storefront tested the harder question — could the whole business actually be autonomous? Historic art prints are a high-volume, low-margin category: there are millions of public-domain works through museum APIs, but the per-item profit cannot pay for a human writing descriptions, choosing collections, and optimizing SEO. A traditional art print shop either stays tiny (a hundred curated pieces) or bleeds money trying to scale. The architecture had to make the unit economics work by pushing the per-SKU labor close to zero.

**MEDIA: Single row, one image — a pipeline diagram: museum API → AI curation → AI copy/SEO → listing → fulfillment. `assets/.media/automated-art-print-business/flow-automated-art-print-business-04.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + The brief:
    - Make a low-margin, high-volume category genuinely profitable by removing per-item labor
    - Treat curation, listing, copy, SEO, and fulfillment as one pipeline rather than five jobs
    - Architect it as a template — so it transfers to any niche where inventory is abundant but per-item effort is the blocker

  + The build:
    - Make.com (a visual automation tool that chains services together) pulls new artwork metadata from museum collection APIs
    - An LLM chain writes a compelling description, generates an SEO-ready title, and assigns the piece to thematic collections
    - The finished record is pushed into Shopify; print-on-demand fulfillment is wired into the same flow, so orders trigger production without a human touching them
    - Pricing and inventory rotation are policy-driven inside the automation — set once, run forever

#### The 800-Product Automated Store

The third storefront stress-tested the pattern at scale and across two product categories — fashion (covered in B2) and art history (covered here). One Notion database, one Make.com pipeline, two visually distinct sections of one store, run end to end by one editor doing data entry.

**MEDIA: Single row, one image — the art-history section of the 800-product store. Capture from `august.style/automated-e-commerce-shop-lookbook`, using visuals distinct from the fashion lookbook shown in B2. `assets/.media/automated-art-print-business/flow-automated-art-print-business-05.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + The brief:
    - 800+ products across two distinct content worlds (fashion lookbook + art-history print collection) in a single store
    - One editor's workflow has to be the entire content team
    - Categorization, cross-linking, copy, SEO — all of it has to handle itself across the catalog

  + The build:
    - Webflow front end, Notion as the single source of truth — one editor's edits publish themselves
    - LLM calls generate product copy, categories, and SEO across the catalog
    - Make.com orchestrates the pipeline, so updates to Notion flow through enrichment and out to the live site automatically
    - This entry tells the art-history side; the fashion side lives in B2

---

## Growth Marketer

A store that runs itself still needs buyers. The paid-social engine behind the prints hit numbers an order of magnitude past industry norms — not because the budget was bigger, but because the testing discipline was tighter.

### Selling The Prints

#### [Paid Social At $0.003 Per Engagement](https://www.august.style/social-advertising-strategy/)

Cost-per-engagement and cost-per-follower are the metrics that tell you whether a paid social strategy is actually working. Industry averages have been climbing year over year as the platforms mature. The print shop campaigns came in at roughly one-tenth of those averages — which is the kind of number that only happens when the creative testing loop is the whole strategy.

**MEDIA: Single row, one image — paid-social campaign results for the print shop, ideally showing both the metric numbers and the creative variations that produced them. `assets/.media/automated-art-print-business/flow-automated-art-print-business-06.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + What the numbers actually mean:
    - $0.003 cost per engagement — roughly 10x below typical industry benchmarks
    - $0.31 cost per follower — same order-of-magnitude advantage
    - 9,200+ Instagram shop views per campaign cycle
    - These rates set internal benchmarks for how the work was approached going forward

  + How I got there:
    - Each campaign ran iterative creative A/B testing — visual formats, copy variations, audience segments — testing all the way through, not just at the start
    - The lookbook-style creative assets were designed specifically for social consumption, with visual hooks built to stop scrolling
    - Sophisticated audience targeting paired with the creative tests — neither one alone gets there
    - The efficiency came from relentless testing and precise targeting, not from increasing the budget

A catalog that curates itself, a storefront that lists and fulfills itself, and advertising that converts at a fraction of market cost. The piece still ahead — managing the full mass of prints, now grown well past the original catalog — becomes its own entry once the showcase layout for it exists. *(That entry is B4.)*
