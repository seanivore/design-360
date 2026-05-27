/**
 * LANDING CONTROLLER (v4.2.3)
 * Drives the dynamic homepage by loading project data and homepage-content.json,
 * rendering each section, and initializing scroll-driven behaviors.
 *
 * v4.2.3 shape:
 *   hero (static video + random about line)
 *   narrative_spine (Phase A / B / C)
 *   featured_tiles (per-phase random video tile)
 *   process (3 steps)
 *   credentials (preserved verbatim)
 *   achievements (flat list, no accordion)
 *   cta_section
 */

const LandingController = (() => {

  // ──────────────────────────────────────────────
  // ORCHESTRATOR
  // ──────────────────────────────────────────────

  async function init() {
    const [projects, content] = await Promise.all([
      DataLoader.loadAllProjects(),
      DataLoader.loadHomepageContent()
    ]);
    if (!projects.length || !content) return;
    loadHomepage(content, projects);
    initScrollReveal();
    initNavCollapse();
    initAccordion();
  }

  function loadHomepage(content, projects) {
    renderHero(content);
    renderNarrativeSpine(content, projects);
    renderFeaturedTiles(projects, content);
    renderProcess(content);
    renderCredentials(content);
    renderAchievements(projects, content);
    renderCTASection(content);
  }

  // ──────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────

  /**
   * Build a /section.html?tags=... URL for a filter object.
   * Used by renderCredentials and renderProcess (where retained).
   */
  function buildSectionURL(filter, mode) {
    const tags = [];
    if (filter && filter.all) tags.push(...filter.all);
    if (filter && filter.any) tags.push(...filter.any);
    if (!tags.length) return '/section.html';
    const params = tags.map(t => DataLoader.normalizeForURL(t)).join('+');
    let url = `/section.html?tags=${params}`;
    if (mode) url += `&mode=${mode}`;
    return url;
  }

  /**
   * Convert a phase label ("Phase A") to a URL token ("Phase%20A").
   *
   * NOTE: section.html's tag URL parser splits on `+` as the multi-tag
   * delimiter (e.g. `?tags=Web+Developer+Framer` = AND of two tags). So a
   * space in a single tag value MUST encode as `%20`, never `+`, or the
   * tag splits in two ("Phase" AND "A" instead of one tag "Phase A").
   */
  function phaseToURLToken(label) {
    if (!label) return '';
    return label.replace(/\s+/g, '%20');
  }

  /**
   * Render multi-paragraph body text. Splits on \n\n and emits <p> per chunk.
   * Single \n inside a chunk becomes <br>.
   */
  function renderParagraphs(text) {
    if (!text) return '';
    return text
      .split(/\n\n+/)
      .map(chunk => `<p>${chunk.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  // ──────────────────────────────────────────────
  // RENDER FUNCTIONS
  // ──────────────────────────────────────────────

  /**
   * HERO — pick a random line from hero.about_pool and write it to #heroAboutLine.
   * Video, blur, and cutout are CSS-only; the controller does not touch them.
   */
  function renderHero(content) {
    const aboutLine = document.getElementById('heroAboutLine');
    if (!aboutLine) return;

    const pool = (content.hero && content.hero.about_pool) || [];
    if (!pool.length) {
      aboutLine.style.display = 'none';
      return;
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];
    aboutLine.textContent = pick;
  }

  /**
   * NARRATIVE SPINE — motion.ai "About" section pattern.
   *
   * Per v4_1_0_IMPLEMENT § "Next Two Homepage Landing Page Sections" (line 78+):
   * the Prisma template's About section uses WordsPullUpMultiStyle — one
   * flowing heading composed of segments where some are normal sans-serif
   * and one is italic serif (Instrument Serif) for the accent phrase
   * ("I am Marcus Chen, a self-taught director."). Narrow centered column
   * (max-w-3xl), small-caps top label, body paragraph below.
   *
   * Our adaptation: small top label "Phase A", flowing heading "Phase A is
   * <em>Foundation</em>." with the heading phrase italic-serif accent, body
   * paragraphs below. Each section is a clickable <a> so the whole block
   * links to /section.html?tags=Phase%20X.
   */
  function renderNarrativeSpine(content) {
    const section = document.getElementById('narrative-spine');
    if (!section) return;

    const spine = content.narrative_spine;
    if (!spine) {
      section.style.display = 'none';
      return;
    }

    const phases = [spine.phase_a, spine.phase_b, spine.phase_c].filter(Boolean);
    if (!phases.length) {
      section.style.display = 'none';
      return;
    }

    section.innerHTML = phases
      .map(phase => {
        const token = phaseToURLToken(phase.label);
        const href = `/section.html?tags=${token}`;
        const label = phase.label || '';
        const heading = phase.heading || '';
        return (
          `<a class="spine-section" href="${href}">` +
            `<div class="spine-section__inner">` +
              `<div class="spine-section__label">${label}</div>` +
              `<h2 class="spine-section__heading">` +
                `<span class="spine-section__heading-prefix">${label} is</span>` +
                ` ` +
                `<em class="spine-section__heading-accent">${heading}</em>` +
                `<span class="spine-section__heading-period">.</span>` +
              `</h2>` +
              `<div class="spine-section__body">${renderParagraphs(phase.body || '')}</div>` +
            `</div>` +
          `</a>`
        );
      })
      .join('');
  }

  /**
   * FEATURED TILES — one tile per phase. For each tile config:
   *   1. Filter projects by tile.filter.
   *   2. Random-pick one qualifying entry.
   *   3. Random-pick one URL from that entry's feature_tile[].
   *   4. Emit a tile with the video + phase label.
   *
   * Dispatches 'featured-tiles:ready' on document after mount so the
   * featured-tile-controller can attach state-machine behavior.
   */
  function renderFeaturedTiles(projects, content) {
    const section = document.getElementById('featured-tiles');
    if (!section) return;

    const tileConfigs = (content.featured_tiles && content.featured_tiles.tiles) || [];
    if (!tileConfigs.length) {
      section.style.display = 'none';
      return;
    }

    const tilesHTML = [];

    tileConfigs.forEach(tile => {
      const qualifying = DataLoader.resolveFilter(projects, tile.filter)
        .filter(p => Array.isArray(p.feature_tile) && p.feature_tile.length > 0);

      if (!qualifying.length) return;

      const entry = qualifying[Math.floor(Math.random() * qualifying.length)];
      const urls = entry.feature_tile;
      const url = urls[Math.floor(Math.random() * urls.length)];
      if (!url) return;

      const resolved = url.startsWith('http') ? url : '/' + url;
      const slug = entry.slug || '';
      const title = entry.title || '';

      tilesHTML.push(
        `<div class="feature-tile" role="button" tabindex="0" data-slug="${slug}" ` +
          `aria-label="${title} — feature tile, double-tap to view project">` +
          `<video class="feature-tile__video" muted loop playsinline src="${resolved}"></video>` +
          `<div class="feature-tile__phase-label">${tile.phase || ''}</div>` +
        `</div>`
      );
    });

    if (!tilesHTML.length) {
      section.style.display = 'none';
      return;
    }

    section.innerHTML = tilesHTML.join('');

    // Hand off to featured-tile-controller.js once tiles are in the DOM
    const tiles = section.querySelectorAll('.feature-tile');
    document.dispatchEvent(new CustomEvent('featured-tiles:ready', {
      detail: { tiles }
    }));
  }

  /**
   * PROCESS — restored to pre-v4.2.3 layout per v4_1_0_IMPLEMENT
   * "Final Keepers Of Current Homepage Components": 01/02/03 numbered cards
   * in a horizontal scroller. Numbers cycle terra/blue/mauve.
   *
   * Data shape adapted to v4.2.3: reads content.process.steps[] with
   * {word, body, href} (was previously pulled from a project entry).
   */
  function renderProcess(content) {
    const section = document.getElementById('process');
    if (!section) return;

    const cfg = content.process;
    const steps = (cfg && cfg.steps) || [];
    if (!steps.length) {
      section.style.display = 'none';
      return;
    }

    const heading = section.querySelector('#processHeading');
    if (heading && cfg.heading) heading.textContent = cfg.heading;

    const scrollContainer = section.querySelector('#processScroll');
    if (!scrollContainer) return;

    const nums = ['01', '02', '03'];
    scrollContainer.innerHTML = steps
      .slice(0, 3)
      .map((step, i) => {
        const href = step.href || '/section.html';
        return (
          `<a href="${href}" class="process-card">` +
            `<div class="process-num">${nums[i] || ''}</div>` +
            `<div class="process-card-title">${step.word || ''}</div>` +
            `<div class="process-card-body">${step.body || ''}</div>` +
          `</a>`
        );
      })
      .join('');
  }

  /**
   * CREDENTIALS — preserved verbatim from prior version.
   * Reads content.credentials.items[]; emits company / dates / role / tag chips.
   */
  function renderCredentials(content) {
    const section = document.getElementById('credentials');
    if (!section) return;

    const heading = section.querySelector('.section-heading');
    if (heading && content.credentials && content.credentials.heading) {
      heading.textContent = content.credentials.heading;
    }

    const list = section.querySelector('.cred-list');
    if (!list) return;

    const items = (content.credentials && content.credentials.items) || [];
    if (!items.length) {
      section.style.display = 'none';
      return;
    }

    list.innerHTML = items
      .map((item, i) => {
        const delay = i < 4 ? ` sr-d${i + 1}` : '';
        const tags = (item.tags || []).map(t => {
          if (typeof t === 'object' && t.filter) {
            return `<a href="${buildSectionURL(t.filter, 'all')}" class="tag">${t.label}</a>`;
          }
          return `<a href="/section.html?tags=${DataLoader.normalizeForURL(t)}" class="tag">${t}</a>`;
        }).join('');
        const companyHref = buildSectionURL({ any: [item.company] });
        return (
          `<div class="cred-item sr${delay}">` +
            `<div class="cred-top">` +
              `<a href="${companyHref}" class="cred-company">${item.display_name}</a>` +
              `<span class="cred-dates">${item.dates}</span>` +
            `</div>` +
            `<div class="cred-role">${item.title}</div>` +
            `<div class="cred-tags">${tags}</div>` +
          `</div>`
        );
      })
      .join('');
  }

  /**
   * ACHIEVEMENTS — expandable accordion cards, restored from pre-v4.2.3
   * per v4_1_0_IMPLEMENT "Final Keepers Of Current Homepage Components".
   * v4.2.3 adaptation: flattens entry.achievements[] (array) across all
   * projects instead of singleton entry.achievement.
   */
  function renderAchievements(projects, content) {
    const section = document.getElementById('achievements');
    if (!section) return;

    const cfg = content.achievements || {};
    const headingEl = document.getElementById('achievementsHeading');
    if (headingEl && cfg.heading) {
      headingEl.textContent = cfg.heading;
    }

    const list = document.getElementById('achievementsList');
    if (!list) return;

    // Flatten all achievements across all projects.
    const all = [];
    projects.forEach(project => {
      const arr = Array.isArray(project.achievements) ? project.achievements : [];
      arr.forEach(a => {
        if (a && a.headline) all.push(a);
      });
    });

    if (!all.length) {
      section.style.display = 'none';
      return;
    }

    const limit = (cfg.limit && cfg.limit > 0) ? cfg.limit : all.length;
    const items = all.slice(0, limit);

    list.innerHTML = items
      .map(a => (
        `<div class="ach-item">` +
          `<button class="ach-header" type="button">` +
            `<div class="ach-accent trio-sm"><span></span><span></span><span></span></div>` +
            `<span class="ach-title">${a.headline || ''}</span>` +
            `<svg class="ach-icon" viewBox="0 0 24 24" aria-hidden="true">` +
              `<line x1="12" y1="5" x2="12" y2="19"/>` +
              `<line x1="5" y1="12" x2="19" y2="12"/>` +
            `</svg>` +
          `</button>` +
          `<div class="ach-body">` +
            `<div class="ach-body-inner">${a.details || ''}</div>` +
          `</div>` +
        `</div>`
      ))
      .join('');
  }

  /**
   * Toggle .open on .ach-item when its header is clicked.
   * Restored from pre-v4.2.3.
   */
  function initAccordion() {
    document.querySelectorAll('.ach-header').forEach(h => {
      h.addEventListener('click', () => h.parentElement.classList.toggle('open'));
    });
  }

  /**
   * CTA SECTION — heading, body paragraph, and two CTA buttons (primary +
   * secondary) stacked centered with the buttons in a row beneath the body.
   *
   * Markup intentionally wraps body and buttons in separate blocks so the
   * .cta-body sits as its own centered paragraph and the .cta-actions row
   * holds the two .btn anchors side by side (with row → column collapse
   * on mobile via CSS).
   */
  function renderCTASection(content) {
    const section = document.getElementById('ctaSection');
    if (!section) return;

    const cta = content.cta_section;
    if (!cta) {
      section.style.display = 'none';
      return;
    }

    const headingEl = document.getElementById('ctaHeading');
    if (headingEl) headingEl.textContent = cta.heading || '';

    const buttons = document.getElementById('ctaButtons');
    if (!buttons) return;

    const body = cta.body ? `<p class="cta-body">${cta.body}</p>` : '';
    const primary = cta.primary
      ? `<a class="btn btn-primary" href="${cta.primary.href || '#'}">${cta.primary.text || ''}</a>`
      : '';
    const secondary = cta.secondary
      ? `<a class="btn btn-ghost" href="${cta.secondary.href || '#'}">${cta.secondary.text || ''}</a>`
      : '';
    const actions = (primary || secondary)
      ? `<div class="cta-actions">${primary}${secondary}</div>`
      : '';

    buttons.innerHTML = body + actions;
  }

  // ──────────────────────────────────────────────
  // SCROLL / NAV BEHAVIORS
  // ──────────────────────────────────────────────

  /**
   * Scroll-reveal observer for .sr (and .trio, .cta-trio) elements.
   * Adds .vis when the element enters the viewport.
   */
  function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.sr, .trio, .cta-trio').forEach(el => obs.observe(el));
  }

  /**
   * Collapse the main nav on scroll-down and reveal a pill toggle.
   * Pill click restores the full nav.
   */
  function initNavCollapse() {
    const nav = document.getElementById('siteNav');
    const pill = document.getElementById('navPill');
    if (!nav || !pill) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const cur = window.scrollY;
      if (cur > 200 && cur > lastScroll) { nav.classList.add('hide'); pill.classList.add('vis'); }
      else if (cur < lastScroll - 5) { nav.classList.remove('hide'); pill.classList.remove('vis'); }
      lastScroll = cur;
    }, { passive: true });
    pill.addEventListener('click', () => { nav.classList.remove('hide'); pill.classList.remove('vis'); });
  }

  return { init };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', LandingController.init);
} else {
  LandingController.init();
}
