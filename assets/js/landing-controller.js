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
  }

  function loadHomepage(content, projects) {
    renderHero(content);
    renderNarrativeSpine(content);
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
   * Convert a phase label ("Phase A") to a URL token ("Phase+A").
   */
  function phaseToURLToken(label) {
    if (!label) return '';
    return label.replace(/\s+/g, '+');
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
   * NARRATIVE SPINE — emit Phase A / B / C as full-bleed linked sections.
   * Each phase reads from content.narrative_spine.phase_{a,b,c}.
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
        return (
          `<a href="${href}" class="spine-section">` +
            `<div class="spine-section__label">${phase.label || ''}</div>` +
            `<h2 class="spine-section__heading">${phase.heading || ''}</h2>` +
            `<div class="spine-section__body">${renderParagraphs(phase.body || '')}</div>` +
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
   * PROCESS — rewrite from content.process.steps[].
   * Emits a heading + three linked step cards.
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

    const heading = cfg.heading
      ? `<h2 class="section-heading">${cfg.heading}</h2>`
      : '';

    const stepsHTML = steps
      .map(step => {
        const href = step.href || '/section.html';
        return (
          `<a href="${href}" class="process-step">` +
            `<div class="process-step__word">${step.word || ''}</div>` +
            `<div class="process-step__body">${step.body || ''}</div>` +
          `</a>`
        );
      })
      .join('');

    section.innerHTML = `<div class="container">${heading}<div class="process-steps">${stepsHTML}</div></div>`;
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
   * ACHIEVEMENTS — flat list (no accordion).
   * Flattens achievements[] across all projects; optional limit from JSON.
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
          `<h3 class="ach-title">${a.headline || ''}</h3>` +
          `<div class="ach-body">${a.details || ''}</div>` +
        `</div>`
      ))
      .join('');
  }

  /**
   * CTA SECTION — populate heading, body line, and the two CTA buttons
   * from content.cta_section.
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

    buttons.innerHTML = body + primary + secondary;
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
