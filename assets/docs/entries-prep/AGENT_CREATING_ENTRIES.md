# Create Project Portfolio Entries (v5.0)

## Quick Start

You are creating v5.0 JSON entries for a portfolio site. 36 entries already exist in `assets/entries/`. This document lists projects still to be added.

**Before touching any code, read these three files:**

1. `assets/docs/ENTRY_SOP.md` — Step-by-step procedure and field writing guidelines
2. `assets/docs/_entry_template.json` — The v5.0 schema with all fields
3. `assets/docs/tags.json` — Tag registry (use existing tags, never invent near-duplicates)

**Existing examples:** Any file in `assets/entries/` (e.g. `uid-bsj-738.json`, `uid-rfr-187.json`)

---

## Entry Creation Workflow

1. Choose a project from the lists below
2. Research the project (read docs, visit URLs, gather context)
3. Create a slug (lowercase, hyphenated, descriptive)
4. Create media directory: `assets/media/<slug>/`
5. Prepare images (see [Image Preparation](#image-preparation))
6. Create the JSON entry:
   - Option A: Run `python assets/scripts/new_project.py` (auto-generates UID)
   - Option B: Copy `assets/docs/_entry_template.json` to `assets/entries/uid-xxx-###.json`
7. Fill in all required fields per `ENTRY_SOP.md`
8. Move completed JSON to `assets/entries/` if not already there
9. Validate: `python assets/scripts/validate_v5.py`
10. Regenerate manifest: `python generate_manifest.py`
11. Mark the project as complete in this document

**Every 5-10 entries:** Run `git add .` on the new files and push.

---

## Image Preparation

Each entry needs two types of images:

**Thumbnail slides** (required, 4-6 per entry):
- Filename: `assets/media/<slug>/thumb-slides-<slug>-1.webp`
- Format: .webp, landscape orientation, consistent aspect ratio
- Used in: tile galleries on section/homepage

**Square images** (required, 3 per entry):
- Filename: `assets/media/<slug>/img-sq-<slug>-1.webp`
- Format: .webp, square crop
- Used in: hero rotation, creative cards, entry page side column

### Cloudinary Image Processing

Cloud name: `dzrtucxh7` (env var set in `.env`)

1. Upload source image to Cloudinary
2. Crop/resize as needed
3. Convert to .webp format with compression
4. Download processed image to `assets/media/<slug>/`
5. Delete from Cloudinary library after download

Full API reference: `assets/docs/entries-prep/CLOUDINARY_IMAGE_API.md`

### Screenshots as Source Images

For web apps, dashboards, and tools — take screenshots at key states:
- Use browser dev tools to set viewport (1440x900 for desktop, 390x844 for mobile)
- Capture meaningful states (loaded data, active interactions, key features)
- Process through Cloudinary for consistent sizing and .webp format

---

## Behance Entry Pattern

For generative art projects hosted on Behance:

**Embed code template** — replace `GALLERY_NUMBER` with the number from the Behance URL:

```
<iframe src='https://www.behance.net/embed/project/GALLERY_NUMBER?ilo0=1' width='560' height='438' frameborder='0' allow='clipboard-write; fullscreen' allowfullscreen></iframe>
```

Note: Use single quotes `'` (not double `"`) around attribute values so the embed works inside JSON strings.

**Standard v5.0 fields for Behance art entries:**

```json
"role": ["Graphic Designer", "Creative Director"],
"skill": ["Generative AI", "Art Direction", "Illustration", "Print Design", "Adobe Creative Cloud"],
"product": ["Digital Art Collection", "Art Print"],
"company": "Freelance",
"media_embed": "<iframe src='https://www.behance.net/embed/project/GALLERY_NUMBER?ilo0=1' ...",
"origin_url": "https://www.behance.net/gallery/GALLERY_NUMBER/Slug-Title",
"origin_url_text": "behance.net/gallery/Short-Title"
```

Add additional skill tags as relevant: `"Photography"`, `"Product Staging"`, `"Typography"`.

---

## Priority 1: New Projects (Need Media)

These are active projects with full documentation available. They'll fill content gaps in the homepage.

### Freelance Payments Platform (fills React showcase tab)

- **Docs:** `/Users/seanivore/Development/freelance-payments/assets/docs/PAYMENTS_PLATFORM.md`
- **Live:** `payments.august.style`
- **Repo:** `github.com/seanivore/freelance-payments` (or wherever hosted)
- **Tech:** React 18 + TypeScript + Vite, Vercel serverless, Stripe integration, PDF generation
- **Suggested slug:** `freelance-payments-platform`
- **Suggested role tags:** `["Web Developer", "AI & Automation Strategist"]`
- **Suggested skill tags:** `["HTML/CSS/JS", "React", "Git", "Automation", "E-Commerce"]` -- add "React" to `tags.json` first
- **Suggested product tags:** `["Web Application"]`
- **Framing:** Focus on the hybrid architecture (static + serverless), automated contract/invoice generation, JSON-as-database approach. This is a real production tool used daily.
- **Status:** NEEDS MEDIA (Sean grabbing visuals)

### Thot Markdown Scratchpad PWA

- **Docs:** `/Users/seanivore/Development/thot/docs/THOT_APP.md`
- **Live:** `thots.august.style`
- **Tech:** CodeMirror 6 + TypeScript + Vite, PWA with offline support, custom Lezer syntax highlighting
- **Suggested slug:** `thot-markdown-scratchpad`
- **Suggested role tags:** `["Product Designer", "Web Developer"]`
- **Suggested skill tags:** `["HTML/CSS/JS", "Responsive Design", "Typography"]` -- could add "TypeScript" to `tags.json`
- **Suggested product tags:** `["Web Application"]`
- **Framing:** A personal tool built from frustration with existing markdown editors. Highlight the custom syntax highlighting engine (100+ color rules), the PWA architecture, and the fact that it's used daily. The v1→v2 rewrite story (SwiftUI to web) is interesting.
- **Status:** NEEDS MEDIA

---

## Priority 2: Old Portfolio Projects

Source: `assets/docs/entries-prep/ORIGINAL_PORTFOLIO.md`

All from the old developer-technologist.august.style portfolio. Each URL below has existing content that can be scraped for context.

### High-Impact Projects (should be entries)

**Viral Campaign Strategy** (PETA)
- URL: `https://developer-technologist.august.style/viral-campaign-strategy`
- Multiple videos, team leadership, video shorts before they were mainstream
- Company: `"PETA, Inc."`
- Potential role: `"Creative Director"`, `"Video Editor"`, `"Social Media Manager"`
- Could yield metric/achievement data for Impact section

**Real-Time Social System** (PETA)
- URL: `https://developer-technologist.august.style/realtime-social-system`
- Award-winning viral social media, consumer tech adoption curve strategy
- Company: `"PETA, Inc."`
- Potential achievement data

**Social Advertising Strategy** (PETA)
- URL: `https://developer-technologist.august.style/social-advertising-strategy`
- Company: `"PETA, Inc."`
- Would populate the "Advertising" tag and fill the Impact section

**Content Strategy Framework** (PETA)
- URL: `https://developer-technologist.august.style/content-strategy-framework`
- Company: `"PETA, Inc."`

**UX/UI iOS Marketing App** (PETA)
- URL: `https://developer-technologist.august.style/ux-ui-ios-marketing`
- App development, working with agency, powerful metrics
- Company: `"PETA, Inc."`
- Role: `"Product Designer"`

### Web3 / Silent Labs Projects

**Product Marketing Branding**
- URL: `https://developer-technologist.august.style/product-marketing-branding`
- Digital art, branding, motion design, gifs, memes
- Company: `"Silent Labs"`

**Web3 Strategy Branding**
- URL: `https://developer-technologist.august.style/web3-strategy-branding`
- Company: `"Silent Labs"`

**Technical DeFi Content Simplification**
- URL: `https://developer-technologist.august.style/technical-defi-content-simplification`
- Company: `"Silent Labs"`

### AI & Automation Projects

**Agentic Fashion Designer**
- URL: `https://developer-technologist.august.style/agentic-fashion-designer`
- Could be framed as innovative content production, not just fashion
- Also: `https://developer-technologist.august.style/ai-fashion-strategy`

**Full-Stack Automated E-Commerce**
- URL: `https://developer-technologist.august.style/full-stack-automated-ecommerce`
- Automations updating Webflow storefront, paired with articles, diagrams
- Multiple sub-projects (Etsy integration, etc.) — could be separate entries

**Agentic Marketing Department**
- URL: `https://developer-technologist.august.style/agentic-marketing-department`
- Research iteration process, could be a product concept

**Scalable Augmented Generative Podcasts**
- URL: `https://developer-technologist.august.style/scalable-augmented-generative-podcasts`
- Also: `assets/docs/entries-prep/ASTROFLUENCED_PODCAST.md`

**API Automated Video Production**
- URL: `https://developer-technologist.august.style/api-automate-video-production`

**AI Virtual Photoshoot Design**
- URL: `https://developer-technologist.august.style/ai-virtual-photoshoot-design`

**Agentic Social Manager**
- URL: `https://developer-technologist.august.style/agentic-social-manager`

### Creative / Print

**Advanced Animation System** (Lottie)
- URL: `https://developer-technologist.august.style/advanced-animation-system`
- Simple, visual, about custom animations made in Adobe apps and Lottie

**Embeddings Art Curation**
- URL: `https://developer-technologist.august.style/embeddings-art-curation`

**Illustrated Poetry Book**
- URL: `https://developer-technologist.august.style/illustrated-poetry-book`
- Print section addition

**Vector NFT Art**
- URL: `https://developer-technologist.august.style/vector-nft-art`
- Hand drawn digital NFT series

**Influencer Growth Strategy**
- URL: `https://developer-technologist.august.style/influencer-growth-strategy`
- Pitch deck for freelancers

**Thought-Chaining Early Analysis**
- URL: `https://developer-technologist.august.style/thought-chaining-early-analysis`
- High level complex decision making, matrix analysis

**Public Health Response Platform**
- URL: `https://developer-technologist.august.style/public-health-response-platform`
- COVID assistance website, built in a day

---

## Priority 3: Behance Projects to Add

All are generative art entries. Follow the [Behance Entry Pattern](#behance-entry-pattern) above.

- [ ] `https://www.behance.net/gallery/189957541/Designing-contemporary-art-nouveau-for-a-brand`
- [ ] `https://www.behance.net/gallery/191705387/Burning-desire-to-distain-back`
- [ ] `https://www.behance.net/gallery/193452985/Mid-Century-Modern-Art-Deco-Geometric-Abstract`
- [ ] `https://www.behance.net/gallery/215001851/Instagram-Superbloom-Photoshoot-Male-Models`
- [ ] `https://www.behance.net/gallery/215001693/Tripping-Animated-AI-Generated-Artwork`
- [ ] `https://www.behance.net/gallery/215001371/Neo-Expressionism-Oil-Painting-Abstract-Cyberpunk`
- [ ] `https://www.behance.net/gallery/215001149/Art-Nouveau-Female-Model-Iconic-Camera-Pose-Make-up`
- [ ] `https://www.behance.net/gallery/215000891/Psychedelic-Desert-Drive-to-Alien-Vegas`
- [ ] `https://www.behance.net/gallery/184561511/Degradation-of-pride`
- [ ] `https://www.behance.net/gallery/184259979/Transmutations-of-a-Conscious-Hyperobject`
- [ ] `https://www.behance.net/gallery/183958871/All-that-glitters-might-be-dangerous-aliens`
- [ ] `https://www.behance.net/gallery/183961255/My-robot-commune-life`

---

## Priority 4: More from Visual Portfolio

Source: `assets/docs/entries-prep/more_entries.md`

These are older projects from `visual-producer.august.style` covering print, digital art, motion graphics, video, and product design. Many are Web3/Silent Labs era. See the source document for full URLs and Dropbox asset paths.

Key categories:
- **Print:** Web3 comic book, illustrated products
- **Motion Graphics:** Animated social content, Lottie animations, GIF NFTs
- **Video:** Viral campaigns, 3D FX, brand videos
- **Product:** Tarot deck, printed merch
- **Interactive:** 3D VR gallery

---

## Projects Created (Tracking)

Use this format when completing an entry:

```
### <slug>
- **Date:** YYYY-MM-DD
- **UID:** uid-xxx-###
- **Source:** URL or doc path
- **Notes:** Any flags or missing items
```

(No entries logged yet for this session — 36 entries from v5.0 migration are already in `assets/entries/`.)
