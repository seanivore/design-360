# v2.2 Session Plan — Prototype Refinement

> **Scope**: Refine [landing-prototype.html](file:///Users/seanivore/Development/360-design/landing-prototype.html) based on v2.1 feedback. Still hardcoded, still mobile-first prototype. Focus: pure flat design, amplified animation, true mobile-first thinking.

---

## Design System Changes

### Pure Flat — No Neumorphism

v2 tried to blend neumorphic shadows on stat tiles with flat everything else. It clashed. v2.2 goes **pure flat** everywhere.

**Flat 2.0 Card Rules** (from research):
- **NO** lighter-gray stroke borders on cards — that's depth/curve thinking, wrong for flat
- **YES** elevation via background color steps: page `#1f1f1f` → card `#272727` → elevated `#2f2f2f`  
- Cards are distinguished by bg color shift alone, no borders, no shadows
- If a card contains interactive content, a subtle color shift on `:active` state

### Stacked Trio — Wider, Purposeful

Current trio is too narrow (72/54/36px) and overused as section break.

**New approach**:
- Lines much wider: **40–60% of container width** (inverted pyramid)
- Used **sparingly** as section dividers — maybe 2–3 times total, not between every section
- Also used as **emphasis accents** (e.g., beside achievements, under CTA)
- Form follows function: each use should have a purpose, not just decoration

### Animation — Loud and Integral

v2 animations were too subtle and fast. In flat design, **motion IS the visual richness** since surfaces are intentionally plain.

**Amplification plan**:

| Element           | v2                                 | v2.2                                                         |
| ----------------- | ---------------------------------- | ------------------------------------------------------------ |
| Scroll reveal     | 0.6s fade+slide, barely noticeable | 0.8s with staggered children, visible slide distance (40px)  |
| Stacked trio      | 0.6s draw, too fast                | 1.2s draw with easing, staggered 0.2s per line               |
| Subtitle rotation | CSS keyframe, no dip visible       | JS-driven letter-by-letter cascade with visible 6px dip      |
| Hero images       | Static grid                        | CSS parallax scroll, images shift at different rates         |
| Showcase cards    | opacity reveal                     | Slide up from below with stagger per card (0.15s delay each) |
| Process steps     | No animation                       | Horizontal scroll snap with momentum, step counter ticks up  |
| Stat tiles        | Scale on :active only              | Number count-up animation on first view (0→36 etc.)          |
| Credentials tags  | Static                             | Horizontal auto-scroll marquee per card                      |
| Accordion         | max-height toggle                  | Smooth expand with content fade-in                           |
| Nav collapse      | translateY                         | Scale+blur transition, more organic feel                     |

### Width Handling

User flagged breakage at 309px (responsive default). Need:
- Min-width handling: stat tiles stack at <340px, nav items abbreviate or stack
- Subtitle must never wrap to 2 lines — truncate with `...` or reduce font size
- Nav: at very narrow widths, abbreviate "About" → icon, "Contact" → icon
- Test at 309px, 375px, 393px, 414px, 768px, 1024px

---

## Section-by-Section Changes

### §1 — Navbar

- **Remove hamburger icon** from nav pill — use a custom abstract icon (e.g., three dots in triangle, or the stacked trio itself as a mini icon)
- Add **icon-based** footer nav links (GitHub, LinkedIn, etc. should use SVG icons)
- The pill icon should communicate "tap to re-expand nav" without looking like a hamburger menu

### §2 — Hero

**The biggest rethink.** Current hero is "desktop layout crammed into mobile" — big dead space below CTAs.

Per mobile design specs §3: *"do not use 'below the fold' principle and instead create a vertical scrollable experience"*

**New hero flow** (mobile, scrollable story):
1. **Stats** — positioned above hero, visually separate, no flat card borders. Just the numbers with labels. Pure flat.
2. **Images** — full-screen immersive, not a 3×3 grid. Maybe a single large featured image or a **horizontal scroll strip** of squares. The image should sync with the subtitle.
3. **Title** — large, overlaid on or interleaved with images  
4. **Subtitle** — bigger font size, animation needs to be visible and impressive. Letter-by-letter flip with a clear 6px dip. Synced to image changes if possible.
5. **CTAs** — placed where they feel natural in the scroll flow, not crammed under everything

**Key principle**: as you scroll down the hero, elements should animate and transform — the scroll IS the story. No dead whitespace.

**`~50 Skills` → `50+ Skills`** — use `+` suffix, round down to nearest 5.

### §3 — Showcase

- Remove section subtext ("Filter by the hat I was wearing")
- **Tabs**: don't let them scroll off — either wrap to 2 rows, or shrink font to fit all 4 on screen
- **Cards**: try 2-column layout or 80% width right-aligned for white space interest
- Add spacing between `.project-card-title` and `.project-card-tags`
- No card borders — flat bg color shift only

### §4 — Credentials

- Remove subtext ("14 years of design...")
- **Drastically reduce vertical space** — these cards are way too tall  
- Make cards narrower than full width for white space
- Tags should **horizontally scroll** (overflow-x with scrollbar hidden) — this IS good mobile UX
- Consider: company name + role on one line, dates inline, tags scrolling below. Much more compact.

### §5 — Process

- Remove subtext
- **Horizontal scroll snap** instead of stacked cards — this IS mobile-first thinking
- No filled cards — maybe outlines only, or no containers at all, just content with step numbers
- Step counter visible and counts as you swipe
- This is where we show we understand mobile as a medium

### §6 — Creative Production

- Remove subtext
- Try **2-column grid** instead of full-width stacked cards
- Design for dynamic population (content from tags like "Graphic Designer" + "Product" filter)

### §7 — Advertising Impact

- Remove subtext
- No card containers — or at minimum, no borders. Just flat bg elevation.
- Plan for dynamic population (needs JSON structure)

### §8 — Achievements

- Remove subtext
- Use stacked trio as **emphasis accent** next to each achievement (not as section divider above)
- This is the section where the trio gets a new, purposeful role
- Accordion animation should be smoother — content fades in as it expands

### §9 — CTA + Contact

- Remove subtext ("Or explore my entire portfolio")
- **Copy needs to be cohesive**: heading + primary button + secondary button should read as one thought
- Plan for JSON values:
  1. `footer_cta_heading`: "Interested in [Web Design]?"
  2. `footer_cta_primary_text`: "See All [Web Design] Projects"  
  3. `footer_cta_secondary_text`: "Explore rest of the portfolio"
- Footer social links: **replace text with SVG icons**

---

## Stacked Trio Usage Map

Instead of between every section (currently 6+ instances), use purposefully:

| Location                  | Purpose                          | Style                                            |
| ------------------------- | -------------------------------- | ------------------------------------------------ |
| Between Hero and Showcase | One major section break          | Full width inverted pyramid, slow draw animation |
| Achievements items        | Emphasis accent beside each item | Small horizontal variant, left-aligned           |
| Above footer CTA          | Final cap before closing         | Centered, medium width                           |

All other section transitions: use **whitespace + scroll animation** to differentiate, not dividers.

---

## New JSON Values Identified

For when we wire up dynamic content:

```
footer_cta_heading
footer_cta_primary_text
footer_cta_secondary_text
```

(Hero subtitle, hero images, process blurbs were already identified in v2.0 plan)

---

## What's NOT In This Round

- No schema changes
- No dynamic wiring  
- No new JSON entries
- Still hardcoded prototype
- Still mobile-first only (desktop refinement after mobile is locked)
