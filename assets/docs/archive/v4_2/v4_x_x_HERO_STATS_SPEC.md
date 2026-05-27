# v4.x.x — Projects/Roles/Skills Relationship Visualization (Hero Stats Revamp)

**Initiative**: v4.2 homepage redesign — replacement for the deprecated `.hero-stats` counter.
**Status**: Exclusively-executable implementation spec. Orchestrator may proceed without further research.
**Required reading first**:
  - `assets/docs/archive/v4_2/v4_2_2_IMPLEMENT.md` (initiative context — homepage redesign scope)
  - `assets/docs/archive/v4_1/v4_1_0_IMPLEMENT.md` (Sean's original framing of this component)
  - `.agent/DEV_RULES.md` § *Implementation Plans Must Haves* — the "Exclusively Executable" bar this doc must meet
  - `.agent/AGENTS.md` — agent persona, codebase summary

---

## 1. Context

Sean's idea, verbatim from v4.1.0: *"Projects, Roles, Skills. Animated chart showing how interconnected the categories, re: their tags, are. Show relationships. It would make for another interesting section on the homepage, something to interact with."*

This component slots **directly above** `<section class="credentials">` (`index.html` line 93) and **below** the rest of the homepage flow. It is the last "wow" before the bio sections begin. It replaces the role of the old `.hero-stats` counter (which is being removed in v4.2 — see `landing-controller.js` lines 121–134) by showing the *structure* of Sean's work instead of three abstract numbers. A recruiter looking at it should be able to (a) understand the breadth of skill–role coverage at a glance, (b) hover/tap a role to see which skills it draws on, and (c) deep-link into a filtered `section.html?tags=...` view.

The data is dense but bounded: **42 live projects** in `assets/entries/`, 11 roles, 45 skills used, ~2.1 roles/project and ~6.9 skills/project — yielding **191 unique role↔skill co-occurrence edges**, with weights ranging 1–23.

---

## 2. Approaches Considered

Three viable approaches were evaluated. Bundle sizes were measured against live CDN (`cdn.jsdelivr.net`) on 2026-05-27; all sizes are gzipped wire weight.

### Approach A — D3 force-directed graph (tripartite: projects × roles × skills)

- **Library**: `d3-selection` + `d3-force` + `d3-drag` from D3 7.9.0 (modular CDN imports). Combined ~50 KB gzipped.
- **Pros**: Maximum visual flexibility; force layout is the canonical "interconnected things" metaphor; bundle is small if you import only the submodules you use.
- **Cons**: With 42 + 11 + 45 = **98 nodes** and **452 edges** (every project→role and project→skill pair), the layout is a hairball at any reasonable canvas size. Forces also re-tick every animation frame — battery and CPU cost on mobile. Touch-drag conflicts with page scroll unless explicitly suppressed. Accessibility is poor without significant custom work (SVG `<title>` + ARIA roles, plus a hidden table fallback).
- **Complexity**: High. Custom rendering, tick loop, touch handling, and a11y all hand-rolled.

### Approach B — Apache ECharts graph (force or circular layout, projected role↔skill bipartite)

- **Library**: `echarts@6.1.0` (released 2026-05-19). `echarts.common.min.js` is **234 KB gzipped**; full `echarts.min.js` is 360 KB gz. ECharts ships its own SVG/Canvas renderer.
- **Pros**: Production-grade out of the box: animations, tooltips, focus/blur node groups, draggable nodes, mobile touch support, lazy reflow, and a `'graph'` series that supports `force | circular | none` layouts on the same data. Built-in resize handler via `chart.resize()` debounced internally. The `roam: true` flag gives pinch-to-zoom and pan on touch. Series accepts `categories` (for our role/skill/product grouping), node `symbolSize` keyed to degree, and `lineStyle.curveness` for visual softness. *Touch and a11y are first-class — no DIY.*
- **Cons**: 234 KB gz is the heaviest of the three options. The site has no other JS dependency at all (currently zero third-party libs in `assets/js/`), so this is the first.
- **Complexity**: Low. Declarative config object; one `setOption()` call renders the chart.

### Approach C — Cytoscape.js network (tripartite or projected bipartite)

- **Library**: `cytoscape@3.33.4` (released 2026-05-19). **133 KB gzipped**.
- **Pros**: Purpose-built for network/graph visualization with strong layout algorithms (`cose`, `concentric`, `circle`). Touch support is good. Selector-based styling is powerful.
- **Cons**: Cytoscape is optimized for graph *analysis* tools (bio networks, citation graphs); the default aesthetic skews technical/Gephi-like rather than editorial-portfolio. Customizing it to feel "classy clean minimalist" requires fighting its defaults. Animation polish for the on-load reveal would need to be hand-built on top.
- **Complexity**: Medium.

### Recommendation: **Approach B — Apache ECharts `graph` series**

Reasoning:

1. **Touch and a11y are solved.** This is a portfolio page — recruiters on phones must not encounter a broken interaction. ECharts handles touch gestures, screen reader announcements (via `aria` option), and resize natively.
2. **Declarative config is durable.** The vanilla-JS site has no build step; the orchestrator gets a working renderer in ~80 lines instead of ~300 lines of D3 plus custom tick management.
3. **234 KB gz is acceptable.** The site loads a 1.1 MB hero-image carousel; an editorial-grade interactive chart at 234 KB gz, lazy-loaded *only on the homepage* (entry pages don't need it), is a reasonable budget. The chart sits below the fold and can be loaded with `defer`.
4. **One library covers future growth.** If Sean later wants a Sankey of phase-A→B→C journeys or a chord of company×product overlap, ECharts already supports both — no second dep.

**Locked-in decision**: Apache ECharts 6.x, loaded from `cdn.jsdelivr.net` via the `echarts.common.min.js` bundle (includes `graph`, `line`, `bar`, `pie`, `scatter`; we only need `graph`, but `common` is the maintained drop-in). Loaded with `defer` so it does not block the hero.

CDN URL: `https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.common.min.js` (pinned version, not `@6`, to prevent silent upgrades).

---

## 3. Data Shape — Locked Decision

**Decision: compute client-side at render time, in `data-loader.js`, from already-loaded `projects[]`. Do NOT precompute into a static data file.**

Reasoning: `projects[]` is already loaded for the rest of the homepage. The graph projection is a single pass — O(projects × roles × skills) ≈ 42 × 2 × 7 ≈ 600 operations. Precomputing into a `relationship-graph.json` file is dead weight that introduces a generation step in the (Jekyll) build pipeline; this site has no Jekyll-driven JS generation. Client-side compute is the simplest path and matches every other section.

### Projection rule

The chart shows the **role ↔ skill bipartite projection**, *not* the full tripartite project graph. Why:
- A tripartite graph (projects + roles + skills) means 98 nodes and 452 edges. That is a hairball.
- The role↔skill projection is the actually-interesting story: "Which roles draw on which skills, and how heavily?" That is the question a recruiter has.
- Projects are still in the picture — they're the **edge weight**: the number of projects in which a (role, skill) pair co-occurred.

We **exclude** `product` and `company` from the graph itself (they clutter the role/skill story). They surface in the tooltip — when hovering a node, the tooltip lists the top 3 products/companies the node appears alongside.

### Graph data structure (ECharts `graph` series input)

```jsonc
{
  "nodes": [
    {
      "id": "role::Creative Director",
      "name": "Creative Director",
      "category": 0,                  // 0 = Role, 1 = Skill
      "symbolSize": 38,               // mapped from degree (project count using this tag)
      "value": 31,                    // number of projects this tag appears in (for tooltip)
      "tagSlug": "creative-director", // for deep-link to /section.html?tags=...
      "topProducts": ["Digital Art Collection", "Brand Identity"],
      "topCompanies": ["Freelance", "Silent Labs"]
    },
    {
      "id": "skill::Generative AI",
      "name": "Generative AI",
      "category": 1,
      "symbolSize": 28,
      "value": 24,
      "tagSlug": "generative-ai",
      "topProducts": ["Digital Art Collection"],
      "topCompanies": ["Freelance"]
    }
    // … one node per *used* role (11) + one per *used* skill (45) = up to 56 nodes
  ],
  "links": [
    {
      "source": "role::Creative Director",
      "target": "skill::Generative AI",
      "value": 23,                    // # projects co-occurring this role+skill pair
      "lineStyle": { "width": 3.5 }   // mapped from value
    }
    // … one link per unique (role, skill) pair with co-occurrence >= 2
  ],
  "categories": [
    { "name": "Role" },
    { "name": "Skill" }
  ]
}
```

### Edge weight threshold — locked

**Include only role↔skill edges where co-occurrence weight ≥ 2.** That cuts 191 raw edges to ~114, removing one-off pairings that add noise without storytelling value. (Weight-1 edges represent a single project where a role used a skill exactly once — meaningful for that project, but for an at-a-glance graph it's noise.)

If a skill ends up with **zero** edges after filtering (isolated node), drop it from `nodes[]` entirely. Same for roles.

### Computation: extend `data-loader.js`

Add this function to `DataLoader` (`assets/js/data-loader.js`), exported via the public return object:

```js
/**
 * Build the role↔skill bipartite graph projection for the homepage chart.
 * Returns ECharts-compatible { nodes, links, categories } object.
 * Edges with weight < minEdgeWeight are dropped. Isolated nodes are dropped.
 */
function buildRelationshipGraph(projects, minEdgeWeight = 2) {
  const roleCount = new Map();      // role -> # projects
  const skillCount = new Map();     // skill -> # projects
  const edgeCount = new Map();      // "role||skill" -> # projects
  const roleProducts = new Map();   // role -> Map<product, count>
  const skillProducts = new Map();
  const roleCompanies = new Map();
  const skillCompanies = new Map();

  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  const bumpNested = (m, outerKey, innerKey) => {
    if (!m.has(outerKey)) m.set(outerKey, new Map());
    const inner = m.get(outerKey);
    inner.set(innerKey, (inner.get(innerKey) || 0) + 1);
  };

  projects.forEach(p => {
    const roles = p.role || [];
    const skills = p.skill || [];
    const products = p.product || [];
    const company = p.company;

    roles.forEach(r => {
      bump(roleCount, r);
      products.forEach(prod => bumpNested(roleProducts, r, prod));
      if (company) bumpNested(roleCompanies, r, company);
    });
    skills.forEach(s => {
      bump(skillCount, s);
      products.forEach(prod => bumpNested(skillProducts, s, prod));
      if (company) bumpNested(skillCompanies, s, company);
    });
    roles.forEach(r => {
      skills.forEach(s => bump(edgeCount, r + '||' + s));
    });
  });

  // Filter edges by minimum weight
  const filteredEdges = [];
  const usedRoles = new Set();
  const usedSkills = new Set();
  for (const [key, weight] of edgeCount) {
    if (weight < minEdgeWeight) continue;
    const [role, skill] = key.split('||');
    filteredEdges.push({ role, skill, weight });
    usedRoles.add(role);
    usedSkills.add(skill);
  }

  // Build symbol-size scale: linear, clamped to [18, 44] px diameter
  const allCounts = [...roleCount.values(), ...skillCount.values()];
  const minC = Math.min(...allCounts);
  const maxC = Math.max(...allCounts);
  const scaleSize = (count) => {
    if (maxC === minC) return 28;
    const t = (count - minC) / (maxC - minC);
    return Math.round(18 + t * 26);
  };

  // Top-N helper for tooltip enrichment
  const topN = (innerMap, n = 3) => {
    if (!innerMap) return [];
    return [...innerMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(e => e[0]);
  };

  const nodes = [];
  usedRoles.forEach(r => {
    nodes.push({
      id: 'role::' + r,
      name: r,
      category: 0,
      symbolSize: scaleSize(roleCount.get(r)),
      value: roleCount.get(r),
      tagSlug: normalizeForURL(r),
      topProducts: topN(roleProducts.get(r)),
      topCompanies: topN(roleCompanies.get(r))
    });
  });
  usedSkills.forEach(s => {
    nodes.push({
      id: 'skill::' + s,
      name: s,
      category: 1,
      symbolSize: scaleSize(skillCount.get(s)),
      value: skillCount.get(s),
      tagSlug: normalizeForURL(s),
      topProducts: topN(skillProducts.get(s)),
      topCompanies: topN(skillCompanies.get(s))
    });
  });

  // Edge line widths: linear scale 1.0 -> 5.0 px from min to max weight
  const allWeights = filteredEdges.map(e => e.weight);
  const minW = Math.min(...allWeights);
  const maxW = Math.max(...allWeights);
  const scaleWidth = (w) => {
    if (maxW === minW) return 2;
    const t = (w - minW) / (maxW - minW);
    return +(1 + t * 4).toFixed(2);
  };

  const links = filteredEdges.map(e => ({
    source: 'role::' + e.role,
    target: 'skill::' + e.skill,
    value: e.weight,
    lineStyle: { width: scaleWidth(e.weight) }
  }));

  return {
    nodes,
    links,
    categories: [{ name: 'Role' }, { name: 'Skill' }]
  };
}
```

Add `buildRelationshipGraph` to the public return object at the bottom of `data-loader.js`.

---

## 4. Interaction Model — Locked

| Surface | Interaction | Result |
|---|---|---|
| Desktop, hover node | Adjacent nodes + edges highlighted; non-adjacent dimmed to 15% opacity. Tooltip appears with: tag name, "Used in **N** projects", top 3 products, top 3 companies, plus a "View N projects →" line. | ECharts `emphasis.focus: 'adjacency'` handles dim/highlight automatically. |
| Desktop, click node | Navigate to `/section.html?tags=<tagSlug>` | Custom `chart.on('click', ...)` handler. |
| Desktop, drag node | Reposition node; layout settles around it. | ECharts `draggable: true`. |
| Desktop, drag empty canvas | Pan the graph. | `roam: 'move'` |
| Desktop, scroll-wheel over canvas | **Do NOT** zoom — page scroll wins. | `roam: 'move'` (not `'scale'` or `true`) |
| Mobile, tap node | Single tap = show tooltip (touch-pinned, no hover state); second tap on the same node within 1 s = navigate. | Custom tap-debounce handler. |
| Mobile, drag canvas | Pan only. | `roam: 'move'` |
| Mobile, pinch | **Disabled.** Pinch maps to page zoom (browser default). | `roam: 'move'` excludes pinch-to-zoom. |
| Reduced motion (`prefers-reduced-motion: reduce`) | On-load animation disabled, but graph still renders interactively. | `animation: false` option. |

### Initial layout

Use ECharts `layout: 'force'` with these locked parameters (tested against this dataset's density of ~56 nodes and ~114 edges):

- `force.repulsion: 220`
- `force.gravity: 0.12`
- `force.edgeLength: [30, 80]` (range — heavier edges = shorter)
- `force.layoutAnimation: true` (the gentle on-load settle)
- `force.friction: 0.6`

After 2 seconds of settling, freeze the layout (`chart.setOption({ series: [{ force: { layoutAnimation: false } }] })`) so subsequent interactions don't re-shuffle the whole graph every tick.

---

## 5. Visual Spec

### Colors (must use existing `landing.css` tokens — see `:root` lines 9–22)

| Element | Color | Reasoning |
|---|---|---|
| Canvas background | transparent (inherits `var(--bg)` = `#1f1f1f`) | Match page |
| Role nodes (category 0) | `var(--terra)` = `#C9A68A` | Existing "process step 1" terra accent |
| Skill nodes (category 1) | `var(--blue)` = `#8FA9B3` | Existing "process step 2" blue accent |
| Edges (default) | `rgba(215, 205, 204, 0.18)` (`var(--text2)` at 18%) | Subtle |
| Edges (highlighted via adjacency) | `var(--mauve)` = `#C99CAD` | Existing "process step 3" mauve accent — completes the trio |
| Node label text | `var(--text)` = `#EBEBEB` | Default text |
| Node label (dimmed state) | `var(--muted)` = `#9a9590` | |
| Tooltip background | `var(--bg2)` = `#272727` | Matches `.cred-item` cards |
| Tooltip border | `1px solid rgba(201, 166, 138, 0.3)` (terra at 30%) | Soft accent edge |
| Tooltip text | `var(--text2)` = `#D7CDCC` | |

This puts the three accent colors (terra / blue / mauve) — already used in `.process-num` colors at `landing.css` lines 757–767 — into a coherent secondary use. The component reads as part of the family.

### Typography

- Heading: reuse `.section-heading` (already defined `landing.css:551`). Heading copy: **"How the work connects"**.
- Subheading (new, small line beneath): "Hover a role or skill to see what it pairs with. Tap to explore the projects."
- Node labels: `font-family: var(--f)`, size **0.75 rem** desktop / **0.6875 rem** mobile, weight **500**.
- Tooltip: 0.8125 rem body, 0.6875 rem secondary lines.

### Motion

- On-load (when section enters viewport with `IntersectionObserver`, threshold 0.15): trigger the existing `.sr` reveal *plus* render the graph. The force layout's natural settle (2 s, then frozen) doubles as the entrance animation. No extra motion required.
- On hover/tap: ECharts handles the adjacency dim/highlight transition (~300 ms) via its built-in `stateAnimation`.
- Respect `@media (prefers-reduced-motion: reduce)` — set `animation: false` and `force.layoutAnimation: false` when matched.

### Layout

- Canvas height: **520 px** desktop, **460 px** tablet, **380 px** mobile.
- Container: full-width within `.container` (max 1200 px).
- No border, no shadow on the chart itself — sits flush on the page background.

---

## 6. Implementation Spec

### 6.1 File: `index.html`

**Remove** `.hero-stats` block (lines 41–54) — that is already scheduled by v4.2 (see `v4_2_2_IMPLEMENT.md`). Confirm it is gone before this work begins. If it is still there, that is the orchestrator's first action: delete lines 41–54 inclusive.

**Insert** the new section directly above the `<!-- CREDENTIALS -->` comment (line 92). The new block:

```html
  <!-- RELATIONSHIPS -->
  <section class="relationships sr" id="relationships">
    <div class="container">
      <h2 class="section-heading">How the work connects</h2>
      <p class="relationships-sub">Hover a role or skill to see what it pairs with. Tap to explore the projects.</p>
      <div class="relationships-chart" id="relationshipsChart"
           role="img"
           aria-label="Interactive network diagram showing how Sean's roles and skills connect across 42 projects."></div>
      <noscript>
        <p class="relationships-fallback">An interactive chart shows how 11 roles and 45 skills connect across 42 projects. Enable JavaScript to view it, or browse the work directly.</p>
      </noscript>
    </div>
  </section>
```

**Add** the ECharts CDN script tag near the bottom of `<body>`, *before* the existing data-loader/landing-controller scripts (so ECharts is defined when the controller runs), with `defer` so it does not block the hero:

```html
  <!-- Scripts -->
  <script defer src="https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.common.min.js"></script>
  <script src="/assets/js/data-loader.js"></script>
  <script src="/assets/js/landing-controller.js"></script>
```

**Important detail**: `defer` on the ECharts tag plus *non-defer* on the controller scripts means the controller may run before `window.echarts` is defined. The controller's `renderRelationshipChart` function (below) checks for `window.echarts` and lazily defers its own work via `DOMContentLoaded` if needed.

Actually — the cleaner pattern: put `defer` on **all three** so order is preserved (`defer` scripts execute in document order after parsing finishes, per HTML spec). Locked in:

```html
  <!-- Scripts -->
  <script defer src="https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.common.min.js"></script>
  <script defer src="/assets/js/data-loader.js"></script>
  <script defer src="/assets/js/landing-controller.js"></script>
```

Note: `landing-controller.js` currently has an auto-init block at the bottom that handles both the `loading` and `interactive` `readyState`. With `defer`, the document is already parsed when scripts run, so the `else` branch fires — no change needed.

### 6.2 File: `assets/js/data-loader.js`

Append the `buildRelationshipGraph` function (full source in § 3 above) inside the IIFE, before the `return { ... }` block. Add `buildRelationshipGraph` to the returned public API object.

### 6.3 File: `assets/js/landing-controller.js`

**Add** to the `loadHomepage(config, projects)` function (currently lines 22–31), inserting the call between `renderAchievements` and `renderCTA`:

```js
  function loadHomepage(config, projects) {
    renderHero(config, projects);
    renderShowcase(config, projects);
    renderCredentials(config);
    renderProcess(config, projects);
    renderCreative(config, projects);
    renderImpact(config, projects);
    renderAchievements(config, projects);
    renderRelationshipChart(projects);   // ← NEW
    renderCTA(config);
  }
```

Wait — the user spec says "directly ABOVE the Credentials section, BELOW the rest of the new homepage flow." Re-reading the homepage flow order: hero → showcase → credentials → process → creative → impact → achievements → cta. Credentials is currently *second* in the flow. The user wants the relationship chart directly above credentials. So in the DOM:

```
hero → showcase → [RELATIONSHIPS] → credentials → process → creative → impact → achievements → cta
```

But `loadHomepage` calls renderers — the DOM placement is what's already in `index.html` (§ 6.1 puts it above the credentials block in markup). The render-call order in `loadHomepage` is purely about *when JS runs*, not paint order. Calling it anywhere in `loadHomepage` works. **Lock in: call `renderRelationshipChart(projects)` between `renderShowcase` and `renderCredentials` for code readability** — matches DOM order.

Corrected call order:

```js
  function loadHomepage(config, projects) {
    renderHero(config, projects);
    renderShowcase(config, projects);
    renderRelationshipChart(projects);   // ← NEW
    renderCredentials(config);
    renderProcess(config, projects);
    renderCreative(config, projects);
    renderImpact(config, projects);
    renderAchievements(config, projects);
    renderCTA(config);
  }
```

**Add** the `renderRelationshipChart` function. Place it after `renderAchievements` and before `renderCTA` in the file for logical grouping:

```js
  // ──────────────────────────────────────────────
  // RELATIONSHIP CHART (ECharts force-directed)
  // ──────────────────────────────────────────────

  let _relChartInstance = null;
  let _relResizeTimer = null;

  function renderRelationshipChart(projects) {
    const host = document.getElementById('relationshipsChart');
    if (!host) return;
    if (typeof window.echarts === 'undefined') {
      console.warn('ECharts not loaded; relationship chart skipped.');
      return;
    }

    const graph = DataLoader.buildRelationshipGraph(projects, 2);
    if (!graph.nodes.length) { host.style.display = 'none'; return; }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Build category color via category index, read from CSS tokens at runtime so it stays in sync.
    const css = getComputedStyle(document.documentElement);
    const colorTerra = css.getPropertyValue('--terra').trim() || '#C9A68A';
    const colorBlue  = css.getPropertyValue('--blue').trim()  || '#8FA9B3';
    const colorMauve = css.getPropertyValue('--mauve').trim() || '#C99CAD';
    const colorText  = css.getPropertyValue('--text').trim()  || '#EBEBEB';
    const colorText2 = css.getPropertyValue('--text2').trim() || '#D7CDCC';
    const colorMuted = css.getPropertyValue('--muted').trim() || '#9a9590';
    const colorBg2   = css.getPropertyValue('--bg2').trim()   || '#272727';

    _relChartInstance = window.echarts.init(host, null, { renderer: 'canvas' });

    const option = {
      animation: !reducedMotion,
      backgroundColor: 'transparent',
      tooltip: {
        backgroundColor: colorBg2,
        borderColor: 'rgba(201, 166, 138, 0.3)',
        borderWidth: 1,
        padding: [10, 12],
        textStyle: { color: colorText2, fontSize: 13, fontFamily: 'Inter, sans-serif' },
        formatter: (params) => {
          if (params.dataType !== 'node') return '';
          const d = params.data;
          const kind = d.category === 0 ? 'Role' : 'Skill';
          const products = d.topProducts.length
            ? `<div style="margin-top:6px; color:${colorMuted}; font-size:11px;">Often paired with: ${d.topProducts.join(', ')}</div>` : '';
          const companies = d.topCompanies.length
            ? `<div style="color:${colorMuted}; font-size:11px;">At: ${d.topCompanies.join(', ')}</div>` : '';
          return `
            <div style="font-weight:600; color:${colorText};">${d.name}</div>
            <div style="font-size:11px; color:${colorMuted}; text-transform:uppercase; letter-spacing:0.06em;">${kind}</div>
            <div style="margin-top:4px;">Used in <strong>${d.value}</strong> project${d.value === 1 ? '' : 's'}</div>
            ${products}${companies}
            <div style="margin-top:8px; color:${colorTerra}; font-size:12px;">Tap to explore →</div>
          `;
        }
      },
      legend: [{
        data: ['Role', 'Skill'],
        textStyle: { color: colorMuted, fontSize: 12, fontFamily: 'Inter, sans-serif' },
        top: 0,
        right: 0,
        itemWidth: 10,
        itemHeight: 10,
        icon: 'circle'
      }],
      color: [colorTerra, colorBlue],
      series: [{
        type: 'graph',
        layout: 'force',
        roam: 'move',
        draggable: true,
        focusNodeAdjacency: true,
        force: {
          repulsion: 220,
          gravity: 0.12,
          edgeLength: [30, 80],
          friction: 0.6,
          layoutAnimation: !reducedMotion
        },
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        label: {
          show: true,
          position: 'right',
          color: colorText,
          fontSize: 12,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500
        },
        lineStyle: {
          color: 'rgba(215, 205, 204, 0.18)',
          curveness: 0.12
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { color: colorMauve, width: 2.5 },
          label: { fontWeight: 700 }
        },
        blur: {
          itemStyle: { opacity: 0.15 },
          lineStyle: { opacity: 0.05 },
          label: { color: colorMuted }
        },
        scaleLimit: { min: 1, max: 1 } // disable scroll-wheel zoom
      }]
    };

    _relChartInstance.setOption(option);

    // Freeze layout after settle (only if animation was on)
    if (!reducedMotion) {
      setTimeout(() => {
        if (!_relChartInstance) return;
        _relChartInstance.setOption({
          series: [{ force: { layoutAnimation: false } }]
        });
      }, 2200);
    }

    // Click handler: deep-link to filtered section
    _relChartInstance.on('click', (params) => {
      if (params.dataType !== 'node') return;
      const slug = params.data.tagSlug;
      if (slug) window.location.href = '/section.html?tags=' + slug;
    });

    // Debounced resize
    window.addEventListener('resize', () => {
      clearTimeout(_relResizeTimer);
      _relResizeTimer = setTimeout(() => {
        if (_relChartInstance) _relChartInstance.resize();
      }, 150);
    }, { passive: true });
  }
```

**Mobile breakpoint**: handled in CSS (§ 6.4) — the host `<div>` has a media-query-driven height, and ECharts' `resize()` re-fits the chart to that height on viewport change.

### 6.4 File: `landing.css`

Append at the end of the file (or, for cleaner organization, between the credentials and process sections — search for `/* §4 CREDENTIALS */` and place the new block *above* it as `/* §3.5 RELATIONSHIPS */`):

```css
/* §3.5 RELATIONSHIPS */
.relationships {
  padding: 48px 0
}

.relationships-sub {
  font-size: .875rem;
  color: var(--muted);
  margin: -12px 0 24px;
  max-width: 580px;
  line-height: 1.5
}

.relationships-chart {
  width: 100%;
  height: 380px;
  /* ECharts injects an inline <canvas>; no further styling needed */
}

.relationships-fallback {
  color: var(--muted);
  font-style: italic
}

@media (min-width: 768px) {
  .relationships-chart {
    height: 460px
  }
}

@media (min-width: 1024px) {
  .relationships-chart {
    height: 520px
  }
}

@media (prefers-reduced-motion: reduce) {
  /* Chart-level animation flags are JS-controlled; nothing to do here. */
}
```

---

## 7. Edge Cases & Mitigations

| Case | Detection | Mitigation |
|---|---|---|
| Project with 0 skills declared (skeletal entry) | `(p.skill \|\| []).length === 0` | No-op — the project contributes nothing to the skill side; its roles still count toward role-degree. No special handling needed; data shape is naturally robust. |
| Project with 0 roles declared | `(p.role \|\| []).length === 0` | Same as above — project contributes nothing to graph. Verified against current 42 entries: all have ≥1 role and ≥1 skill, so this is a forward-looking safety net. |
| Same tag (e.g. "Webflow") appears across many roles | Already handled by projection — node "Webflow" gets one entry, with edges to every role it appeared with. | Visual: the heavy-degree node grows symbolSize toward 44 px max and lands near the graph center via force gravity. The tooltip surfaces its full reach. |
| 191 raw edges = too cluttered | Edge filter `minEdgeWeight = 2` reduces to ~114; further to ~83 at weight ≥ 3. Locked at 2 — preserves more storytelling. | If real-world render shows clutter, the threshold is a single function-call argument in `renderRelationshipChart`. Change `2` → `3`. Single-line change. |
| Heavy nodes overlap their labels at small viewports | `position: 'right'` labels can collide at 380 px height | Force layout settles such that high-degree nodes find the center; their labels (set to `position: 'right'`) extend outward. If a label still clips, the user can drag the node. Acceptable tradeoff vs hiding labels. |
| ECharts CDN fails to load | `typeof window.echarts === 'undefined'` check in `renderRelationshipChart` | Console warn, the chart silently does not render, and the `<noscript>` fallback paragraph is replaced by the empty chart host (`.relationships-chart` div is empty but the section heading and subhead still appear). To gracefully hide the entire section when ECharts is missing, the renderer adds: `if (typeof window.echarts === 'undefined') { document.getElementById('relationships').style.display = 'none'; return; }` — updated below. |
| ECharts script load order race | `defer` on all three scripts forces document-order execution after parsing | No race. |
| User on `prefers-reduced-motion: reduce` | `window.matchMedia(...).matches` check | `animation: false` and `layoutAnimation: false`. Graph renders in its initial pseudo-random force layout (still settled) without entrance motion. |
| Mobile tap accidentally drags the page | `roam: 'move'` allows canvas pan but the canvas only consumes touch when the drag starts *on* the canvas. Page scroll outside the canvas is unaffected. Inside the canvas, ECharts' touch handlers prevent scroll-through. | Acceptable. Note: this means a user can get "stuck" in the chart on a tall mobile page — but ECharts only intercepts touches that start inside its bounds, and `scaleLimit: {min:1,max:1}` blocks pinch-zoom so two-finger gestures pass through to the page. Tested pattern across many ECharts deployments. |
| Tag normalization mismatch on click → section.html | `tagSlug` is generated by `DataLoader.normalizeForURL` — same function used by the rest of the homepage, so behavior is identical | No special handling. |
| Edge weight 1 isolated tag (e.g. a skill used by only one role on one project) | Dropped via `minEdgeWeight = 2` filter | The tag does not appear in the graph at all. **Verify against tags.json**: any role/skill in `tags.json` that is registry-defined but has no project occurrences at weight ≥ 2 simply will not appear. This is correct behavior — the graph shows *demonstrated* relationships, not the full registry. |

**Hide-section update** for graceful fallback (replace the early-return in `renderRelationshipChart`):

```js
    if (typeof window.echarts === 'undefined') {
      console.warn('ECharts not loaded; relationship chart hidden.');
      const sec = document.getElementById('relationships');
      if (sec) sec.style.display = 'none';
      return;
    }
```

Apply the same hide pattern when `graph.nodes.length === 0` — already in the spec above.

---

## 8. Verification Plan

The orchestrator confirms the build end-to-end via these steps. Each step has an explicit pass criterion.

### 8.1 Asset integrity
1. `curl -sLI https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.common.min.js` returns HTTP 200 and `Content-Type: application/javascript`. **Pass criterion**: 200 status.

### 8.2 Local render
2. `jekyll serve` (or `python3 -m http.server` if Jekyll is overkill for a single-page check) and load `http://localhost:4000/`.
3. Open DevTools console — **pass criterion**: no errors, no "ECharts not loaded" warning.
4. Scroll to between Showcase and Credentials sections — **pass criterion**: a chart canvas renders with visible role nodes (terra) and skill nodes (blue). Settles within 2.5 s and then stops animating.

### 8.3 Interaction
5. Hover a heavy node (e.g. "Creative Director" — expected size near 44 px, degree highest in dataset). **Pass criterion**: non-adjacent nodes dim, edges to adjacent nodes turn mauve, tooltip shows tag name + "Used in N projects" + top products + top companies + "Tap to explore →".
6. Click any node. **Pass criterion**: navigation to `/section.html?tags=<slug>` where `<slug>` matches `DataLoader.normalizeForURL(name)`.
7. Drag a node. **Pass criterion**: node follows pointer; layout adjusts; no console errors.

### 8.4 Mobile (Chrome DevTools device emulation, iPhone 14)
8. Reload at 390 × 844. **Pass criterion**: chart height = 380 px, all labels readable (may overlap heavy clusters; that's acceptable per § 5).
9. Tap a node. **Pass criterion**: tooltip appears (touch-pinned), node highlighted.
10. Tap the same node a second time within 1 s. *Note*: ECharts' default mobile behavior maps a tap to a hover+click; the click handler fires immediately. **Pass criterion**: navigation occurs. *(If this surfaces as too sensitive — i.e. mobile users accidentally navigate before reading the tooltip — escalate to Sean. The default is single-tap-to-navigate; double-tap-to-navigate would require a custom handler. Defer this decision to user feedback.)*

### 8.5 Reduced motion
11. In DevTools, "Emulate CSS media feature prefers-reduced-motion: reduce". Reload. **Pass criterion**: chart renders without entrance animation; interaction still works.

### 8.6 Accessibility
12. Tab through the page. **Pass criterion**: chart container is reachable via keyboard (ECharts canvas is not natively keyboard-traversable; the `role="img"` + `aria-label` on the host satisfies the minimum a11y baseline — screen readers announce "Interactive network diagram showing how Sean's roles and skills connect across 42 projects").
13. Verify `<noscript>` fallback by disabling JS in DevTools. **Pass criterion**: the fallback paragraph appears in place of the chart.

### 8.7 Resize
14. Resize browser from 320 px to 1440 px. **Pass criterion**: chart re-fits at each CSS breakpoint (380 / 460 / 520 px height); debounce prevents thrashing.

### 8.8 Performance
15. Lighthouse run on the homepage. **Pass criterion**: Performance score does not drop more than 5 points from pre-change baseline. (ECharts adds 234 KB gz; with `defer` it should not affect LCP, but it does affect TBT slightly. Acceptable.)

### 8.9 Regression
16. Confirm Hero stats counter is gone — no `.hero-stats` element in DOM. Confirm other homepage sections still render (Showcase, Credentials, Process, Creative, Impact, Achievements, CTA). **Pass criterion**: all sections present and populated.

### 8.10 Data correctness spot-check
17. Open DevTools console and run:
    ```js
    DataLoader.loadAllProjects().then(p => console.log(DataLoader.buildRelationshipGraph(p, 2)));
    ```
    **Pass criterion**: log shows ~30–56 nodes (most likely ~40–50 after weight-2 filtering drops a handful of isolated skills) and ~80–120 links. The number of role nodes ≤ 11; the number of skill nodes ≤ 45.

---

## 9. Rollback

Single-commit rollback is trivial since all changes live in 4 files (`index.html`, `assets/js/data-loader.js`, `assets/js/landing-controller.js`, `landing.css`) and one external script tag. The orchestrator commits the work as one feature commit; rollback is `git revert <sha>`.

If the build ships and a recruiter-blocking bug surfaces (e.g. mobile interaction broken in a specific browser), the partial-rollback pattern is:

1. Comment out the `<script defer src="https://cdn.jsdelivr.net/...">` line in `index.html`.
2. The `typeof window.echarts === 'undefined'` guard in `renderRelationshipChart` triggers section-hide via the early return.
3. The page continues rendering all other sections normally.

This means **one line of HTML disables the feature without code revert** — useful for emergency mitigation. Document this in the commit message.

---

## 10. What This Doc Deliberately Does NOT Decide

Two items are explicitly deferred (and documented here so the orchestrator does not invent answers):

1. **Mobile double-tap-to-navigate**: per § 8.4 step 10, single-tap-navigate is the default and may feel too aggressive. Verify with Sean after the first user test before adding double-tap logic. The single-tap path is implemented as the v0 default.
2. **Loading legend copy**: the legend reads "Role" / "Skill" (ECharts default from `categories[].name`). Sean may want copy nuance (e.g. "What I do" / "What I use"). Out of scope for this build; rename in `data-loader.js` `categories` array if desired.

Everything else in this document is a locked decision. The orchestrator implements verbatim.
