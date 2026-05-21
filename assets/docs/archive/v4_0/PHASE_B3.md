# **ENTRY TITLE**: ART HISTORY — An Art-Print Business That Runs Itself

**Planning**: 
  - PHASE: B
  - Group: 3
**JSON Details**:
  - SLUG: automated-art-print-business
  - LAYOUT: Flow
**Needed To Post**:
  - PLACEMENT: Images, headings, and lists are placed to reflect their flow placement; this should be evident reading straight down the page.
  - Anything with **Bold** notation is notation about the placement and not actually meant to be published on the page. This often is followed by bullet points adding notation that isn't to be published verbatim.
  - We should consider centering H4 headings if it can be consistent and look good on all posts with the same type of 'flow' layout.
  - Any URLs added within page copy should be hyperlinked in the same way in the published version
  - HYPERFRAME: Something animated that in engages and encourages the user to scroll and enjoy scrolling up and down. The embeddings step has real data-viz — artworks settling into clusters is a natural moment to animate.
**Created**: 2026-05-20
**Updated**: 2026-05-21
**Update Details**: Reframed and restructured to the A1_v2 format — opens from the B2 fashion chapter, H2s set as job-title-type roles. Needs review/edit by Sean.
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
      - *Curation That Scales*
        - Embeddings-Based Art Curation
    - **E-Commerce Developer**
      - *Building The Storefront*
        - Timeless Gallery For Art Prints
        - A Store That Runs Itself
        - The 800-Product Automated Store
    - **Growth Marketer**
      - *Selling The Prints*
        - Paid Social At $0.003 Per Engagement

---

## Systems Architect

The fashion work pointed the narrative method at a single discipline — design. ART HISTORY is what happens when the same systems thinking runs an entire business.

It started as a realization, not a business plan. Because of generative AI, for the first time in human history you could learn art history through pure visual immersion — see a movement rendered hundreds of ways, instead of through the handful of works that happened to survive. So I built a business on it: an art-print shop where every print taught a movement, and the whole operation — curation, listing, copy, sales — was designed to run without me.

### Learning Art History By Making It

The catalog began with a brand built around studying the greats by recreating them.

#### The Print Catalog

**MEDIA: Single row, one image — a grid showing one movement (e.g. Bauhaus) rendered many ways; the "visual immersion" idea in one image. `assets/.media/automated-art-print-business/flow-automated-art-print-business-01.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + What the catalog held:
    - Around 30 historic art movements, each studied through a multi-part article series
    - Hundreds of prints rendered movement-accurate — researched detailing, faithful to the aesthetics that made each style iconic
    - Generative AI meant every print could be sold as a single-edition piece across Etsy, social, and the store

### Curation That Scales

A catalog that large breaks the traditional model immediately — no curator can hand-sort hundreds of artworks into coherent collections. So I let the images sort themselves.

#### [Embeddings-Based Art Curation](https://www.august.style/embeddings-art-curation/)

**MEDIA: Single row, one image — the CLIP/PCA cluster visualization: artworks plotted in reduced embedding space, visible clusters. This chart already exists on the live page; capture it cleanly. `assets/.media/automated-art-print-business/flow-automated-art-print-business-02.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + How it worked:
    - CLIP neural embeddings captured the visual character of every piece
    - PCA reduced those embeddings so visual relationships became plottable and clusterable
    - Artworks a human curator would intuitively group appeared as natural clusters, automatically
    - It turned curation into something quantitative — and something that scales to a catalog of any size

---

## E-Commerce Developer

Curation feeds a store. I built the storefront three different ways, each one proving a different point.

### Building The Storefront

#### [Timeless Gallery For Art Prints](https://www.august.style/minimalist-web-store-product/)

**MEDIA: Single row, one image — the timeless gallery storefront. YouTube `https://youtu.be/9qVi5_zoNaM`. `assets/.media/automated-art-print-business/flow-automated-art-print-business-03.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + The build:
    - Deliberate design restraint — the prints are the visual art, so the interface stays quiet
    - A 500+ item catalog with browsing that doesn't fatigue
    - Historically accurate descriptions, AI-optimized for search
    - A timeless aesthetic on purpose — art commerce runs on trust, and trust shouldn't look dated

#### [A Store That Runs Itself](https://developer-technologist.august.style/full-stack-automated-ecommerce)

**MEDIA: Single row, one image — a pipeline diagram: museum API → AI curation → AI copy/SEO → listing → fulfillment. `assets/.media/automated-art-print-business/flow-automated-art-print-business-04.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + The build:
    - Museum collection APIs fed a pipeline with millions of public-domain works to draw from
    - LLMs wrote descriptions, titles, and SEO for each artwork
    - Make.com orchestrated curation, listing, and fulfillment — zero daily human intervention
    - It made the unit economics work: historic prints are high-volume and low-margin, and the business only survives if the labor per print is near zero

#### The 800-Product Automated Store

**MEDIA: Single row, one image — the art-history section of the 800-product store. Capture from `august.style/automated-e-commerce-shop-lookbook`, using visuals distinct from the fashion lookbook shown in B2. `assets/.media/automated-art-print-business/flow-automated-art-print-business-05.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + The build:
    - An 800+ product Webflow store run by a Make.com and Notion pipeline
    - Notion is the single source of truth — one editor's edits publish themselves
    - LLM calls generate product copy, categories, and SEO across the catalog
    - The store carries two worlds — a fashion lookbook and this art-history print collection — and this entry tells the art-history side

---

## Growth Marketer

A store that runs itself still needs buyers. The paid-social engine behind the prints hit numbers an order of magnitude past industry norms.

### Selling The Prints

#### [Paid Social At $0.003 Per Engagement](https://www.august.style/social-advertising-strategy/)

**MEDIA: Single row, one image — paid-social campaign results for the print shop. `assets/.media/automated-art-print-business/flow-automated-art-print-business-06.webp`**

**BULLETED LIST WITH INDENTED SUB-LISTS**
  + The results:
    - $0.003 cost per engagement and $0.31 cost per follower — roughly 10x below typical benchmarks
    - 9,200+ Instagram shop views per campaign cycle
    - The efficiency came from relentless creative testing and precise targeting, not bigger budgets

A catalog that curates itself, a storefront that lists and fulfills itself, and advertising that converts at a fraction of market cost. The piece still ahead — managing the full mass of prints, now grown well past the original catalog — becomes its own entry once the showcase layout for it exists. *(That entry is B4.)*
