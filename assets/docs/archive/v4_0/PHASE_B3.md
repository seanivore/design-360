# **ENTRY TITLE**: ART HISTORY — An Art-Print Business That Runs Itself

  - PHASE: B
  - SLUG: automated-art-print-business
  - LAYOUT: Flow
  - PLACEMENT: Images, headings, and lists are placed to reflect their flow placement; this should be evident reading straight down the page.
  - HYPERFRAME: The embeddings curation step has real data-viz (CLIP/PCA clusters) — a HyperFrames moment could animate artworks settling into clusters. Place it in the curation section.

> DRAFT NOTE (for Sean): Built from `uid-chp-854` (embeddings-art-curation), `uid-wnw-867`
> (minimalist-web-store-product), `uid-scz-944` (full-stack-automated-ecommerce), `uid-dff-987`
> (automated-e-commerce-shop-lookbook — art-history facet), `uid-sez-023`
> (social-advertising-strategy) + `PROJECTS_PORTFOLIO.md` §5.1 + `more_entries.md`. This is the
> "start it now" version — **B4** (managing the mass volume of prints) appends later once that
> layout exists. FLAG: the `social-advertising-strategy` entry's current copy reads advocacy-
> generic; its metrics are the print-shop campaigns — re-point that copy to the shop on revision.
> The `automated-e-commerce-shop-lookbook` page is shared with B2; B3 needs **new visuals** of its
> art-history section so the two entries don't show the same lookbook.

## The Art-History Print Business

This started as a realization, not a business plan. Because of generative AI, for the first time in
human history you could learn art history through pure visual immersion — see a movement rendered
hundreds of ways instead of through the handful of works that happened to survive.

So I built a business on it: an art-print shop where every print taught a movement, and the whole
operation — curation, listing, copy, sales — was designed to run without me.

### **Learning Art History By Making It**

The catalog began with a brand built around studying the greats by recreating them.

IMAGE: `flow-automated-art-print-business-1.webp`
NEW MEDIA: a grid showing one movement (e.g. Bauhaus) rendered many ways — the "visual immersion"
idea in one image.

  + The Print Catalog
    - Around 30 historic art movements, each studied through a multi-part article series
    - Hundreds of prints rendered movement-accurate — researched detailing, faithful to the
      aesthetics that made each style iconic
    - Generative AI meant every print could be sold as a single-edition piece across Etsy, social,
      and the store

### **Curation That Scales**

A catalog that large breaks the traditional model immediately — no curator can hand-sort hundreds of
artworks into coherent collections. So I let the images sort themselves.

IMAGE: `flow-automated-art-print-business-2.webp`
NEW MEDIA: the CLIP/PCA cluster visualization from the live page — artworks plotted in reduced
embedding space, visible clusters. This chart already exists; capture it cleanly.

  + Embeddings-Based Art Curation
    - CLIP neural embeddings captured the visual character of every piece
    - PCA reduced those embeddings so visual relationships became plottable and clusterable
    - Artworks a human curator would intuitively group appeared as natural clusters automatically
    - It turned curation into something quantitative — and something that scales to a catalog of
      any size

## The Storefront

Curation feeds a store. I built that store twice over, each version proving a different point.

### **A Timeless Gallery**

IMAGE: `flow-automated-art-print-business-3.webp`
SOURCE: YouTube `https://youtu.be/9qVi5_zoNaM`.

  + Timeless E-Commerce Gallery for Art Prints
    - Deliberate design restraint — the prints are the visual art, so the interface stays quiet
    - A 500+ item catalog with browsing that doesn't fatigue
    - Historically accurate descriptions, AI-optimized for search
    - A timeless aesthetic on purpose — art commerce runs on trust, and trust shouldn't look dated

### **A Store That Runs Itself**

IMAGE: `flow-automated-art-print-business-4.webp`
NEW MEDIA: a pipeline diagram — museum API → AI curation → AI copy/SEO → listing → fulfillment.

  + AI-Maintained Historic Art Print Shop
    - Museum collection APIs fed a pipeline with millions of public-domain works to draw from
    - LLMs wrote descriptions, titles, and SEO for each artwork
    - Make.com orchestrated curation, listing, and fulfillment — zero daily human intervention
    - It made the unit economics work: historic prints are high-volume and low-margin, and the
      business only survives if the labor per print is near zero

### **One Store, Two Worlds**

IMAGE: `flow-automated-art-print-business-5.webp`
NEW MEDIA: capture the art-history section of `august.style/automated-e-commerce-shop-lookbook` —
distinct visuals from the fashion lookbook shown in B2.

  + The 800-Product Automated Store
    - An 800+ product Webflow store run by a Make.com + Notion pipeline
    - Notion is the single source of truth — one editor's edits publish themselves
    - LLM calls generate product copy, categories, and SEO across the catalog
    - The store carries two worlds — a fashion lookbook and this art-history print collection — and
      this entry tells the art-history side

## Selling the Prints

A store that runs itself still needs buyers. The paid-social engine behind the prints hit numbers an
order of magnitude past industry norms.

IMAGE: `flow-automated-art-print-business-6.webp`

  + Paid Social for the Print Shop
    - $0.003 cost per engagement and $0.31 cost per follower — roughly 10x below typical benchmarks
    - 9,200+ Instagram shop views per campaign cycle
    - The efficiency came from relentless creative testing and precise targeting, not bigger budgets

A catalog that curates itself, a storefront that lists and fulfills itself, and advertising that
converts at a fraction of market cost. The piece still ahead — managing the full mass of prints —
becomes its own entry once the showcase layout for it exists.
