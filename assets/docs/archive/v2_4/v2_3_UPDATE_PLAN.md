# v2.3 Session Plan — Final Refinement + Scroll Experience

> **Scope**: Fix bugs, apply design tweaks, and build the scroll-driven hero animation. Still hardcoded prototype.

---

## Bug Fixes

1. **Nav width mismatch** — nav container is 446px while content is ~430px. Fix: ensure nav `.container` has same padding as body content
2. **Nav pill icon** — still looks like hamburger lines. Fix: make the 3 lines clearly different widths + colors (the trio signature), AND fix the hiding behavior so pill appears properly on scroll
3. **Nav pill hiding** — pill disappears when it shouldn't. Fix: verify scroll threshold logic

## Design Tweaks

### Stat "Circles" Instead of Tiles
Replace square `.stat-tile` bg with a **circle accent** behind the number — diameter roughly equal to the number width, like a subtle halo. Still tappable, but artsy/fresh, fewer containers.

### Subtitle ↔ Name Flip
- **Subtitle text becomes the headline** (large, prominent, animated)
- **"Sean August Horvath" drops to a byline** (smaller, below)
- Subtitle animation: **CSS flip-clock** — each word folds in half vertically (top half rotates down, revealing next word's top half) in sequence, left-to-right domino cascade

### Hero Drift Speed
Change `hero-drift` from `30s` to `60s`.

### Credentials Cleanup
- Tags: `white-space: nowrap` — no wrapping inside tag containers
- Card padding: ~3× L/R padding (e.g. `48px` instead of `16px`)

### Process Scroll Indicator
Below the 3 process cards, add a horizontal trio-bar indicator:
- Longest bar (terra) reaches full-left, shorter bars (blue, mauve) start further right
- At ~75% width, all 3 lines converge and run together to the end
- Communicates "swipe left/right" visually

---

## Hero Scroll-Driven Animation (The Big One)

JS-driven, using `scroll` event with `requestAnimationFrame`. All values calculated from `scrollY` relative to viewport height.

### Phase 1: Image Expansion (scroll 0 → ~1vh)
- **Start**: Hero images don't fully reach bottom of viewport. Stats above, title/CTA at bottom.
- **As user scrolls**: Instead of page moving, the hero image area **expands downward** — filling the gap to the viewport bottom
- **Stats scroll off top** as image grows
- **Title/subtitle/CTA stay pinned** at bottom of viewport
- **End**: Image fills 100vw × 100vh behind everything

### Phase 2: Image Recession (scroll ~1vh → ~2vh)
- Image begins **hiding from the bottom upward** (a clip-path or transform moving up with scroll)
- Title/subtitle/CTA stay briefly, then start moving up — but with **expanded spacing** between elements that stretches out then compresses back to normal

### Phase 3: Trio Bridge (scroll ~2vh → ~2.5vh)
- Three lines enter one at a time (terra first, then blue, then mauve)
- Each enters with spaced-out vertical spacing that **condenses as it reaches position**
- Lines settle at ~¾ up screen, then scroll up normally

### Phase 4: Content Arrival (scroll ~2.5vh → ~3vh)
- "Web Development" heading appears below the trio
- Spacing between trio and heading **compresses to final** as trio approaches top of viewport
- Normal scroll resumes

**Implementation**: `position: sticky` on the hero section, with JS calculating `transform` and `clip-path` values based on scroll progress through a tall spacer div.

---

## Final CTA Trio Animation

The trio above the CTA section: lines enter **spaced out vertically in sequence**, then converge as CTA heading appears. Same orchestrated timing as the hero transition but smaller scale. Uses `IntersectionObserver` + CSS transitions.

---

## Technical Approach

The hero scroll experience uses a **scroll-jacking** pattern:
1. Hero section is `position: sticky; top: 0` inside a tall wrapper (`height: 300vh`)
2. JS reads `scrollY` and calculates progress `0→1` through the wrapper
3. At each progress milestone, apply transforms/clips to child elements
4. After wrapper scrolls past, normal page flow resumes

This is the same technique used by Apple product pages, Stripe, etc.
