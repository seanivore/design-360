# v2.1 Session Plan — Mobile-First Prototype Rebuild

> **Scope**: Build a new [landing-prototype.html](file:///Users/seanivore/Development/360-design/landing-prototype.html) from scratch. Mobile-first, hardcoded content, all CSS inlined. No dynamic wiring, no schema changes. After review, we'll produce a list of new JSON values needed.

---

## Design System

I've reviewed all reference images. Here's the aesthetic spec:

### Palette — Full Cereal, Balanced

```css
/* Backgrounds */
--color-bg-primary: #1f1f1f;
--color-bg-secondary: #2a2a2a;
--color-bg-card: #303030;

/* Text */
--color-text-primary: #EBEBEB;
--color-text-secondary: #D7CDCC;

/* Cereal Accents — used in BALANCED groups, never one alone */
--color-accent-terracotta: #C9A68A;
--color-accent-blue: #8FA9B3;
--color-accent-mauve: #C99CAD;
```

### Signature Element — Stacked Trio Lines

Inverted pyramid of three lines (longest on top, shortest on bottom), one per cereal color. Used for:
- Section breaks (between major sections)
- Heading emphasis
- Button accents (lines under/beside CTA)

*Ref: AESTHETIC-STACKED-TRIO-1.jpg, AESTHETIC-STACKED-TRIO-2.jpg*

### Style Rules

|                 | Do                                                                               | Don't                                |
| --------------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| **Primary**     | Flat surfaces, solid fills, sharp edges                                          | Gradients of any kind                |
| **Neumorphism** | ONLY on hero stat tiles — super simplified, subtle shadows                       | Rounded puffy buttons or heavy depth |
| **Glass**       | ONLY on collapsed navbar — minimal frosted, no gradient behind                   | Frosted cards, glass everywhere      |
| **Motion**      | CSS animations for mobile-first (flip-clock, scroll transitions, expand-to-page) | ~~Hover states~~ — removed entirely  |
| **Colors**      | Groups of all 3 cereal colors together                                           | Monochrome mauve dominance           |

*Ref: AESTHETIC-FLAT-UI.jpg, AESTHETIC-SUBTLE-NEUMORPHISM-1/2, AESTHETIC-FLAT-MINIMAL-GLASS-1/2.jpg*

### Mobile-First Viewport

Per [.agent/2026_MOBILE_DESIGN_SPECS.md](file:///Users/seanivore/Development/360-design/.agent/2026_MOBILE_DESIGN_SPECS.md):
- **Base**: 393×852 CSS px
- **Margins**: 16px left/right
- **Default**: single column, portrait-first
- **Breakpoints**: 768px (tablet), 1024px (desktop) — designed AFTER mobile is solid

---

## Section-by-Section Specs

### §1 — Navbar (homepage-only variant)

**Layout (mobile)**:
- Work · Process · About links (left)
- Contact button (right)
- No "Sean August Horvath" name in nav

**Animation — Smart Collapse**:
- Loads as full flat bar
- Scroll down → shrinks to small corner icon (flat glass style, semi-transparent)
- Scroll up OR tap icon → morphs back to full bar
- Fixed position throughout
- CSS `position: fixed` + `transform` transitions — no JS scroll events, use `IntersectionObserver` or scroll-linked animation

### §2 — Hero (4 sub-components)

**§2.1 Stats** `.hero-stats`
- Three neumorphic tiles in a row: `36 Projects · 11 Roles · ~50 Skills`
- Subtle inset shadow (neumorphism) — but still dark mode, so reversed: lighter shadow top-left, darker bottom-right on dark bg
- Tap → expand animation (tile fills screen as page transition to [section.html](file:///Users/seanivore/Development/360-design/section.html))
- Hardcoded values for now

**§2.2 Title** `.hero-title`
- Large stacked text: **Sean** / **August** / **Horvath** (each on own line)
- Left-aligned, bold
- Layered over image strip — text sits on top of the images with a subtle shadow/overlay for legibility

**§2.3 Subtitle** `.hero-subtitle`
- Rotating text, hardcoded 4-5 subtitle options
- **Flip-clock animation**: each letter flips down like a split-flap departure board
  - Slight downward DIP (~4px) before changing
  - Letters cascade across L→R revealing new text
  - Comes back up into position after cascade completes
- ~20s interval between changes
- Pure CSS + minimal JS for timing

**§2.4 CTA** `.hero-cta-row`
- Primary button: hardcoded text (e.g., "See Web Projects")
- Secondary button: "All Projects"
- Flat design, solid fill with cereal accent color
- Stacked trio accent lines near buttons

**§2.5 Image Strip** `.hero-img-strip`
- Large 1080×1080 square images from `img-sq-*` files
- Fill right column on desktop, full-width background on mobile
- CSS filter overlay to unify color temperature (desaturate slightly + tint toward cereal palette)
- Dark shadow/gradient overlay for text legibility
- Purely decorative — not interactive
- Auto-rotating / subtle parallax scroll on mobile

### §3 — Showcase (tabbed project grid)

- Heading: e.g., "Web Development"
- Tabs below heading: e.g., Webflow · Framer · React · HTML/CSS/JS
- Number of tabs is flexible (more or fewer depending on configuration)
- Cards: project thumbnail + title + skill tags
- Cards link to entry pages
- Stacked trio lines above section as divider

### §4 — Credentials (resume jobs)

- Job entries from resume (company, title, dates)
- Each lists relevant tags underneath
- Clean flat card or list layout

### §5 — Process (3-step visual)

- Keep the 3-step visual structure
- Focus: AI & Automation Implementation process
- Steps like: Assess → Implement → Iterate
- Each step has a blurb from a project
- Blurbs hyperlink to source entry

### §6 — Creative Production (replaces Career Timeline)

- 3-column/card layout
- Categories: Digital Art · Motion & Video · Brand Assets (or similar)
- Each category shows representative thumbnail(s)
- Category title is a tag that links to section page with that filter

### §7 — Advertising Impact (replaces Metrics)

- Focus on advertising/marketing project metrics
- Charts or graphs where possible (CSS-only bar charts, etc.)
- Lead with real numbers (press hits, viral reach, engagement)

### §8 — Achievements (replaces FAQ)

- Accordion layout
- Headline: accomplishment, press hit, or impressive metric
- Expand: context, details, how it was accomplished
- No "FAQ" framing

### §9 — CTA + Contact

- Primary CTA: "Interested in [role] projects?" (hardcoded)
- Secondary: "Or explore my entire portfolio"
- Contact info or form below

---

## Animation Priority

Since flat design keeps visuals intentionally simple, **motion is the wow factor**:

1. **Flip-clock subtitle** — the signature animation, immediately memorable
2. **Navbar morph** — scroll down collapses, scroll up/tap re-expands
3. **Stat tile expand** — tap a tile, it fills the screen (page transition feel)
4. **Section scroll-in** — content fades/slides up as it enters viewport
5. **Stacked trio lines** — subtle draw-in animation on first appearance

All CSS-only where possible, mobile touch triggers, zero hover states.

---

## Deliverables

1. **New [landing-prototype.html](file:///Users/seanivore/Development/360-design/landing-prototype.html)** — standalone, all CSS inlined, mobile-first
2. **List of new JSON values** — every field the prototype needs that doesn't exist yet in [_entry_template.json](file:///Users/seanivore/Development/360-design/assets/docs/_entry_template.json)
3. **Draft `homepage-content.json`** structure — so you can compare it against the JSON value list

---

## What's NOT In This Round

- No schema changes to [_entry_template.json](file:///Users/seanivore/Development/360-design/assets/docs/_entry_template.json)
- No updates to existing JSON entries
- No `landing-controller.js` or dynamic wiring
- No [data-loader.js](file:///Users/seanivore/Development/360-design/assets/js/data-loader.js) AND/OR filtering
- No resumes, LinkedIn copy, or new entries
- No fixing the broken build (noted for later)
