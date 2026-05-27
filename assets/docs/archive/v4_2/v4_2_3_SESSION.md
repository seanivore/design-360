**Driving**: `v4_2_2_IMPLEMENT.md` → `v4_2_3_IMPLEMENT.md`
**Type**: Planning (folding `v4_2_2_FEEDBACK.md` + DEV_RULES v3.5.0 re-read + Sean's structural locks + parallel subagent passes)
**Date**: 2026-05-27

---

## What this session did

- [x] Read `v4_2_2_FEEDBACK.md` in full. Distilled 12+ structural locks (schema renames, featured-tile interaction model, versioning corrections, structural overhaul of IMPLEMENT, etc.).
- [x] Read `.agent/DEV_RULES.md` v3.5.0 in full. Surfaced four protocol divergences in v4_2_2 (file naming, IMPLEMENT template, reference-doc placement, required-reading mixed-truth violations).
- [x] Surfaced versioning concept clarifications to Sean (versioning is internal-coordination not user-facing; symbiotic docs carry "Aligned with" header; per-template schema versions evolve on their own cadence).
- [x] Surfaced DEV_RULES alignment forks + hero-stats permission block to Sean. Locks: keep version-bound SESSION naming; rename `JSON_ARCHITECTURE.md` → `AUGUST_STYLE.md`; no BUILD packets (IMPLEMENT is the executable doc); WS-5 collapses to "move 12 entries to /drafts/"; hero stats deferred to v5.
- [x] Surfaced phase/track over-commitment in initial plan. Sean's correction: don't break work into phases or tracks until the plan is exclusively executable. Adopted: v4_2_3 uses logical groupings as section headings, not pre-assigned orchestrator paths.
- [x] Granted WebSearch + WebFetch globally in `~/.claude/settings.json` (was Sean's recurring permission ask).
- [x] Background subagent — `BRAND_COPY_STRATEGY.md` consolidation. Created at `assets/docs/BRAND_COPY_STRATEGY.md` with 7 sections, best-judgment picks per section, three flagged for Sean review (em-dash style in Phase B; FOUNDATION vs GROUND in process step 1; CTA mailto placeholder).
- [x] Background subagent — hero stats viz research (after permission grant). Returned: ECharts actual size is 361 KB gz (not the 234 KB cited in v4_x_x_HERO_STATS_SPEC.md); top alternatives include hand-rolled d3-force at 10–15 KB gz and vasturiano/force-graph at 56 KB gz. Sean's call: defer to v5.x.
- [x] Background subagent — validation pass on `v4_2_2_IMPLEMENT.md`. Returned punch list of 21 decision-forcing points, 7 wide-column tables, 10+ schema-name inconsistencies with the live `_entry_template.json`, omitted build-log instructions, plus several gaps the FEEDBACK doc hadn't enumerated (PHASE_C.md missing, duplicate § WS-2 scope block, § 4 numbering jump, wrong filename in § 7 verification, sidecar planning docs as required reading violating No Mixed Truth).
- [x] Updated `_entry_template.json`: renamed `feature` → `placement`, `feature_video` → `feature_tile[]`, `feature_video_alt` → `tile_alt`; bumped schema_version to "6.1".
- [x] Updated `tags.json`: renamed group `feature` → `placement`.
- [x] Renamed `JSON_ARCHITECTURE.md` → `AUGUST_STYLE.md` via `git mv` (preserves history). Rewrote contents for v4.2.3 alignment: removed v5.1 fields (mobile_img, gif, flat grid, singleton achievement), added v6.1 fields (placement, feature_tile, tile_alt, layout, flow, main_media, bleed, bleed_slides, achievements[]), added Collection (v6.0) and Item (v6.0) schemas, added 6th tag group `item` documentation, added collection.html / media.html routing, updated file structure, added codebase grounding section with controller responsibilities (no file:line — grep at execution time).
- [x] Moved 12 entries to `assets/drafts/` per Sean's triage: uid-bsj-738, uid-cap-258, uid-dff-987, uid-fth-565, uid-hxp-812, uid-kts-582, uid-sdz-155, uid-sjz-330, uid-skz-743, uid-svz-258, uid-sxz-424, uid-xuk-296.
- [x] Wrote `v4_2_3_IMPLEMENT.md` end-to-end. Exclusively-executable, zero decision points, no Wave 1/Wave 2, no TRACK pre-splits, no plan-author meta-strategy, narrow tables only. Required reading pared to AUGUST_STYLE.md + README.md + DEV_RULES.md + ENTRY_SOP.md (4 items, all current).
- [x] Spawned validation subagent on `v4_2_3_IMPLEMENT.md`. Returned 10-item punch list: § 1 restated BUILD_REPORT instead of referencing, § 4.1 "adjust to taste" reopened locked font choice, § 4.6 had orchestrator running aws s3 cp from `.media/` (conflicting with § 8.4 "orchestrator does not touch"), `<account>` placeholder in inline AWS endpoint, CDN-404 response contradiction between § 4.1 (surface) and § 6 (fallback), inconsistent counts (4–8 vs 8 vs 6–8 across § 5.1 / § 5.4 / § 5.5), `collection_preview` double-defined in `AUGUST_STYLE.md` (top-level entry field AND flow block), `ENTRY_SOP.md` listed in required reading while § 7.1 said to update it (mixed truth), `section.html?tags=phase_a` casing inconsistent with `Phase+A` convention, subagent-context guidance missing per DEV_RULES § 7.
- [x] Asked Sean to lock three BRAND_COPY picks: Phase B em-dash (swapped to colons), Process step 1 (FOUNDATION), CTA href (mailto for v4.2.3). Inlined into `homepage-content.json` spec in `v4_2_3_IMPLEMENT.md` § 4.2. Zero placeholders remaining.
- [x] Folded all 10 validation findings into v4_2_3 and AUGUST_STYLE.md. Specifically: § 1 collapsed to one-line pointer (acknowledging DEV_RULES BUILD override — see Session Notes below). § 4.1 "adjust to taste" removed. § 4.6 rewrote as orchestrator-pre-flights-CDN-URL; if 404, follow ENTRY_SOP upload pattern. Inline AWS endpoint removed in favor of ENTRY_SOP reference. § 4.1 vs § 6 CDN-404 contract clarified (hero = hard-required pause; entry media = upload-from-source via SOP). § 5.1 / § 5.5 locked to "8". `collection_preview` removed from `AUGUST_STYLE.md` top-level entry-field list (kept as flow block in § 2a). § 6 rewrote per-entry process to point at ENTRY_SOP.md as canonical pipeline + spelled out the top-of-doc-attention-table convention for finding JSON values (including feature-tile MP4 source path). § 8.4 rewrote .media/ access rules: orchestrator READS during entry pipeline, does NOT delete. § 2 added per-subagent context column. Added § 10 Rollback. Fixed `phase_a` → `Phase+A` casing in BRAND_COPY_STRATEGY.md throughout.
- [x] Rewrote `ENTRY_SOP.md` end-to-end. New version covers entries (columns + flow) + collections + items + agent-handled Cloudinary processing + agent-handled R2 upload + the brief-to-JSON pipeline. Aligned with v4.2.3.

## Session Notes

### DEV_RULES BUILD-vs-IMPLEMENT override

DEV_RULES § *BUILD.md and the BUILD_REPORT* says the orchestrator reads a BUILD packet, not IMPLEMENT, during execution. Sean overrode for this project: "Because we are working towards an implement.md that is fully executable, we will not need build.md document." v4_2_3_IMPLEMENT.md serves as the executable doc directly. `BUILD_REPORT_v4_2_3.md` is produced at session close, paired with the IMPLEMENT version. This override is intentional and project-specific — projects that reach exclusively-executable in one round don't need the BUILD extraction step. Worth formalizing in DEV_RULES later (a small protocol amendment).

### Why we did/didn't split into tracks

DEV_RULES § *Two Operating Modes* names initiative-mode work and patch-mode work. This is initiative-mode (new features, multiple subsystems touched). DEV_RULES § *Smart Session Track Creation* says tracks emerge from a complete plan, not before. The plan is now complete-as-instructions; whether it splits into multiple orchestrator sessions is determined at hand-off, not in the plan itself. The orchestrator may choose to use subagents for parallel work within one session, or Sean may decide to extract `v4_2_3_TRACK_A_BUILD.md` etc. if the workload is too large for one orchestrator session. The plan is sized to be possible-in-one-session if the orchestrator delegates aggressively.

### Why ECharts spec from v4_2_2 was wrong

The v4_x_x_HERO_STATS_SPEC.md cited 234 KB gzipped for ECharts 6.1.0. Actual: 361 KB. The spec underestimated by ~54%. Plus the spec made the case for ECharts based on "force-directed graph series" recognition, when the verified Claude Code ecosystem signal points to D3 (Anthropic ships an official D3 Visualization skill; ECharts has none). The whole spec was a research gap that the WebSearch-permission block in the first agent attempt actually saved us from — we caught it during the second pass after granting permissions.

### Why AUGUST_STYLE.md is now the master doc

Per DEV_RULES § *Master Documents*, every project has a `docs/PROJECT_NAME.md` — the living architecture/state doc updated each session. august.style was using `JSON_ARCHITECTURE.md` as that effective doc, but the name implied schema-only scope. Renamed to `AUGUST_STYLE.md` (project-named, scope-agnostic). Per Sean's direction, the file is updated every planning session to reflect current target state and carries an "Aligned with" header so readers can spot stale vs current. Schema versions live in this doc's alignment-check table; templates carry `_metadata.schema_version` but that's not propagated elsewhere.

### Versioning concept clarifications

Three things settled this session:

1. Version numbers are internal-coordination artifacts. They are NOT user-facing changelog tracking.
2. Implementation version (v4.2.x) and per-template schema versions (entry/collection/item) evolve on independent cadences. Each template tracks its own.
3. Symbiotic docs (AUGUST_STYLE.md, ENTRY_SOP.md, BRAND_COPY_STRATEGY.md) carry "Aligned with v4.X.Y_IMPLEMENT.md" headers, updated each planning round. Readers see currency at a glance.

## Picked Up From / Stopped At

**State**: `v4_2_3_IMPLEMENT.md` is the candidate-final exclusively-executable plan. All validation findings folded. Zero `[From BRAND_COPY...]` placeholders remain — all locked copy inlined. Working tree carries: `JSON_ARCHITECTURE.md` → `AUGUST_STYLE.md` rename + 12 drafts moves + `_entry_template.json` schema bumps + `tags.json` group rename + new `BRAND_COPY_STRATEGY.md` + rewritten `AUGUST_STYLE.md` + rewritten `ENTRY_SOP.md` + `v4_2_3_IMPLEMENT.md` + this `v4_2_3_SESSION.md`. Nothing committed since `11fa097` (the prior v4.2.2 planning commit).

**Next step before BUILD**:

1. Sean creates + uploads any feature-tile MP4s that aren't yet at the CDN URLs declared in the three phase drafts (the orchestrator pre-flights and uploads from `.media/` source per ENTRY_SOP, but Sean's check is faster). MP4 source paths are listed at the top of each phase draft in the attention table row "JSON Feature Tile Video".
2. Sean uploads `assets/.media/home-anim/hero-cyberpunk-FINAL.mp4` to CDN at `media/home-anim/hero-cyberpunk-FINAL.mp4` (or confirms it's already there). Orchestrator pre-flights this URL before front-end work on the hero.
3. (Optional) Sean runs a fresh-Opus Claude Code instance in a new session to do a final independent sanity read on `v4_2_3_IMPLEMENT.md`.
4. BUILD: orchestrator reads `v4_2_3_IMPLEMENT.md` and executes end-to-end. Returns `BUILD_REPORT_v4_2_3.md` at session close.

## Open Threads For Next Session

### Hero Stats Revamp — v5.x backlog

Deferred from v4.2.3. Sean's notes captured here so the v5 planner has the material:

**Stack direction**: Vite + React + react-force-graph.

**Sean's Dia web-search prompt** (use as the v5 starting point):

> "Generate a minimal Vite + React project that renders an interactive network graph of my data. Use react-force-graph. I want: force-directed layout, zoom & pan, hover tooltip with node label and type, clicking a node highlights its neighbors and shows full metadata in a right-hand panel. Let's use TypeScript, keep the graph data in a separate JSON file, and include instructions in the README for `npm install`, `npm run dev`, and how to replace the sample data with my own nodes/edges."

**Dia's follow-up** (worth running when v5 opens):

> "Then once it gives you that, you feed it your real graph JSON and refine. If you tell me whether this is for: a personal PKM map, a portfolio / client-facing viz, or an internal 'agentic' system, I can sketch the exact stack + file layout and give you a ready-to-paste graph JSON shape."

**Recognizable library options surfaced this session** (in case v5 wants alternatives):

- react-force-graph (Vite + React + TS): the recognizable "I've seen this on portfolios" choice. Built on vasturiano/force-graph (Canvas 2D). Mobile-friendly. Strong defaults.
- Hand-rolled d3-force + SVG (10–15 KB gz total): smallest footprint; SVG inherits site CSS theme; D3 has Anthropic-ecosystem recognition; ~200–400 lines of renderer code.
- Cytoscape.js (133 KB gz): industry-recognized, best built-in layout algorithms. Enterprise/scientific reputation more than portfolio.
- ECharts (361 KB gz, NOT 234): the original v4 spec's choice but verified-wrong on weight. Don't carry this assumption into v5.

**Why deferring made sense**: Sean's instinct lined up with the "it makes more sense to do after the other new entries and layout types of old entries are fixed up." Portfolio relationship-graph is a "wow" feature, not a "comprehension" feature. The v4.2.3 push prioritizes the entries + new homepage shape. v5 opens fresh with a proper research phase and the Vite+React+react-force-graph direction already scoped.

### BRAND_COPY_STRATEGY.md picks

Three flags awaiting Sean's review (in `assets/docs/BRAND_COPY_STRATEGY.md`):

- Phase B spine: em-dash style vs. the doc's own rule.
- Process step 1 word: FOUNDATION vs. GROUND.
- CTA: heading variant pick + mailto placeholder.

Locked picks propagate to `homepage-content.json` during BUILD. The orchestrator does NOT make these picks — if a `[From BRAND_COPY_STRATEGY.md § N]` placeholder is still in place when the orchestrator starts, the orchestrator pauses and surfaces.

### Validation pass on v4_2_3_IMPLEMENT.md

Per DEV_RULES § *Gap-Finding Loop*, spawn a curated-context subagent on `v4_2_3_IMPLEMENT.md` before BUILD. Same shape as the v4_2_2 validation pass — look for decision-forcing points, schema mismatches against `AUGUST_STYLE.md`, meta-strategy bleed, table legibility, omitted build-log instructions, gaps not captured by FEEDBACK.

### Asset pipeline pre-flights

- `assets/.media/home-anim/hero-cyberpunk-FINAL.mp4` → CDN `media/home-anim/hero-cyberpunk-FINAL.mp4` (Sean uploads).
- Three Leonardo.ai 4:5 feature-tile videos at 1080×1350 (Sean creates + uploads as `media/{slug}/feature-tile-{slug}-1.mp4`).
- Each new entry's referenced flow-block + main_media imagery (Sean stages + uploads per ENTRY_SOP).

### `assets/drafts/` cleanup decision

12 entries moved this session. Of those, 4 (uid-bsj-738, uid-hxp-812, uid-kts-582, uid-xuk-296) are slated for re-creation as collections in a future round. The other 8 (uid-cap-258, uid-dff-987, uid-fth-565, uid-sdz-155, uid-sjz-330, uid-skz-743, uid-svz-258, uid-sxz-424) have their content integrated into the three new showcase entries — they're now redundant. Long-term: Sean decides if the redundant 8 should remain in drafts/ as historical record or be deleted entirely. Out of v4.2.3 scope.

### `.gitignore` audit

Both `assets/.media/` and `assets/images/` are gitignored working directories. v4_2_2 made an unverified claim about this. Pre-BUILD pre-flight: confirm `.gitignore` actually excludes both. (Cheap to verify with one grep.)
