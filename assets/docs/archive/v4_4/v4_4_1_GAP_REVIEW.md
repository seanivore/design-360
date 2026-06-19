# v4.4.1 Gap Review — consolidated (A/B/C/D), folded into v4.4.2

Four in-session angle reviewers (Sean-authorized stand-in for the fresh-instance gate on this simpler delta) ran against `v4_4_1_IMPLEMENT.md`. Verdicts: all four NEEDS ANOTHER PASS, no architectural objections — the design is sound; findings were integration/completeness. Below: what was real (folded → v4.4.2) vs dismissed.

## Folded into v4.4.2

**Build-breakers**
- **`VALID_FLOW_TYPES` missing `project_link` + `video`** (C). Validator would reject the freelance entry + blog cross-link. → 1D edit 2.
- **Validator would reject the existing legacy collection** (`uid-col-001.json`, 6.0/`media[]`). Hard-flip to 6.1/`images[]` breaks it + the legacy `collection_preview` path. → 1D now accepts BOTH shapes (conditional required-fields + dual schema_version + gated UID cross-ref).

**Correctness / fidelity**
- **Behance root cause was wrong** (B, D). `behance-logo-black.svg` is not referenced (grep clean); the inline "Bē" wordmark just renders cramped in its square slot. → 2H reframed to the real fix (swap to a clean square-proportioned glyph), no phantom file chase.
- **Email unify + © year span multiple pages** (B, C, D). `horvathaugust@gmail.com` + `© 2026` live in interior-page nav AND footers (entry/section/collection/media), not just index. → 2H lists the specific locations + grep confirmations.
- **Hero scrim z-index** (D). Must sit between video (0) and the left blur (1) so it tints the raw right half without muddying the frosted left. → 2I corrected (`.hero-cyberpunk__scrim`, DOM-ordered after the video).

**Design completeness (concrete defaults pinned)**
- `.project-link-btn` / `--ghost` CSS pinned (A, C, D) using the vars `.project-link-card` already uses. → 2M.
- `.flow-video-row` CSS pinned + `prefers-reduced-motion` honored (D). → 2N.
- EXPLORE reshuffle: HTML reorder (socials before CTA) + `flex-wrap:nowrap;width:50%;space-between;align-items:flex-end` (B, D). → 2I.
- mailto fallback handler pinned (delegated click → clipboard copy + toast, with `navigator.clipboard` guard) (A, D). → 2I.
- `renderArtGallery()` shape stub + shuffle (A). → 1F.
- Narrative-spine: confirmed no other consumer reads `.heading`; JSON+render change together. → 2G.
- Lightbox CSS confirmed shared (both pages load `styles.css`). → 1A.

**Resolved decision**
- AI-build term → **"AI-assisted development"** (web-searched; the intentional counterpart to "vibe coding"). Baked into the freelance entry close. → 2O.

## Dismissed / already covered (not folded)
- "Show the full freelance `flow[]` as literal JSON" (A): the captions + the 2N `video` block shape already make it mechanical; not load-bearing.
- "getCollectionSlug / generate_manifest nested handling missing" (B, C): that IS the planned work in 1B, not a gap.
- "gallery dispatch branch missing" (C, D): planned in 1C.
- "lightbox.js / collection.html markup missing" (C, D): planned in 1A.
- vercel.json rewrite ordering (B couldn't read it): instruction is correct (after the single-segment rule); builder sees the file.
- Render-tune values (scrim opacity, EXPLORE exact placement, video equal-height): concrete defaults given, tuned on dev per DEV_RULES (design = concrete default + render-tune).

## Disposition
~6 real folds incl. 2 build-breakers, all cleanly folded → v4.4.2.

## Breadth pass (on v4.4.2) → v4.4.3
Two breadth reviewers (owner-journey + integration/regression). Most "findings" were the classic in-session-subagent confusion (flagging the plan's own unbuilt work — "VALID_LAYOUTS missing gallery", "lightbox.js doesn't exist", "gallery dispatch missing" — as plan gaps; they're the build itself, already specified in 1A–1F/1D). Genuinely new: (1) my `renderArtGallery` stub referenced a phantom `collection_images` field → cleaned to source from `thumb[]`; (2) renamed `renderArtBleed`/`art_bleed`/`#art-bleed` per Sean's "not gallery" naming. Both polish; zero new build-breakers (the regression check on the v4.4.2 fold came back clean).

**Decision (per Sean's severity×count rule):** the build-breakers were caught + fixed in the A–D pass, and the breadth/regression pass found only polish → "just a few and all polish, don't loop again." **Gate cleared at v4.4.3.** Residual gaps will surface on the dev preview (design render-tune is explicitly dev-tuned). Proceed to build.
