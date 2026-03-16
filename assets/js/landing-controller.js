/**
 * LANDING CONTROLLER (v5.0)
 * Drives the dynamic homepage by loading project data and homepage-content.json,
 * rendering each section, and initializing scroll-driven behaviors.
 */

const LandingController = (() => {

  async function init() {
    const [projects, config] = await Promise.all([
      DataLoader.loadAllProjects(),
      DataLoader.loadHomepageContent()
    ]);
    if (!projects.length || !config) return;
    loadHomepage(config, projects);
    initScrollBehaviors();
  }

  function loadHomepage(config, projects) {
    renderHero(config, projects);
    renderShowcase(config, projects);
    renderCredentials(config);
    renderProcess(config, projects);
    renderCreative(config, projects);
    renderImpact(config, projects);
    renderAchievements(config, projects);
    renderCTA(config);
  }

  // ──────────────────────────────────────────────
  // RENDER FUNCTIONS
  // ──────────────────────────────────────────────

  function renderHero(config, projects) {
    const filtered = DataLoader.resolveFilter(projects, config.hero.filter);
    if (!filtered.length) return;

    // Entries with role_headline for the flip clock
    const headlineEntries = filtered.filter(p => p.role_headline);
    // Pick a random entry from those with headlines, or fall back to any filtered
    const pool = headlineEntries.length ? headlineEntries : filtered;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    // Hero images: collect img[0] from filtered entries, duplicate for seamless drift
    const heroImages = filtered
      .filter(p => p.img && p.img.length)
      .map(p => p.img[0]);
    const imgScroll = document.querySelector('.hero-img-scroll');
    if (imgScroll && heroImages.length) {
      const doubled = [...heroImages, ...heroImages];
      imgScroll.innerHTML = doubled
        .map(src => `<img src="/${src}" alt="">`)
        .join('');
    }

    // Flip headlines
    const flipTrack = document.querySelector('.flip-track');
    if (flipTrack && headlineEntries.length) {
      flipTrack.innerHTML = headlineEntries
        .map((entry, i) =>
          `<div class="flip-item ${i === 0 ? 'active' : 'below'}">${entry.role_headline}</div>`
        )
        .join('');
    }

    // Primary CTA
    const primaryBtn = document.querySelector('.hero-cta .btn-primary');
    if (primaryBtn) {
      const ctaText = selected.hero_btn_cta || 'See Web Projects';
      primaryBtn.textContent = ctaText;
      // Build href from hero filter tags
      const filterTags = config.hero.filter.any || config.hero.filter.all || [];
      if (filterTags.length) {
        const tagParams = filterTags.map(t => encodeURIComponent(t)).join('+');
        primaryBtn.setAttribute('onclick', `window.location.href='/section.html?tags=${tagParams}'`);
      }
    }

    // Secondary CTA
    const ghostBtn = document.querySelector('.hero-cta .btn-ghost');
    if (ghostBtn && config.hero.cta_secondary) {
      ghostBtn.textContent = config.hero.cta_secondary.text;
      ghostBtn.setAttribute('onclick', `window.location.href='${config.hero.cta_secondary.href}'`);
    }

    // Stat count-up values
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
      const tagsByType = DataLoader.getTagsByType(projects);
      statNumbers[0].setAttribute('data-count', String(projects.length));
      statNumbers[1].setAttribute('data-count', String(tagsByType.role.length));
      statNumbers[2].setAttribute('data-count', String(tagsByType.skill.length));
      statNumbers[2].setAttribute('data-suffix', '+');
    }

    // Stat links — Projects goes to all, Roles/Skills could deep-link
    const statRoles = document.getElementById('statRoles');
    const statSkills = document.getElementById('statSkills');
    // Keep hrefs simple — all go to section page
    if (statRoles) statRoles.href = '/section.html';
    if (statSkills) statSkills.href = '/section.html';
  }

  function renderShowcase(config, projects) {
    const section = document.getElementById('showcase');
    if (!section) return;

    // Section heading
    const heading = section.querySelector('.section-heading');
    if (heading) heading.textContent = config.showcase.heading;

    // Tab buttons
    const tabContainer = section.querySelector('.showcase-tabs');
    if (!tabContainer) return;

    tabContainer.innerHTML = config.showcase.tabs
      .map((tab, i) =>
        `<button class="tab-btn${i === 0 ? ' active' : ''}" data-tab="${tab.id}">${tab.label}</button>`
      )
      .join('');

    // Clear existing panels and build new ones
    const panelParent = document.getElementById('showcasePanels') || tabContainer.parentElement;
    panelParent.innerHTML = '';

    config.showcase.tabs.forEach((tab, i) => {
      const tabProjects = DataLoader.resolveFilter(projects, tab.filter);
      const panel = document.createElement('div');
      panel.className = `showcase-panel${i === 0 ? ' active' : ''}`;
      panel.id = `panel-${tab.id}`;

      const grid = document.createElement('div');
      grid.className = 'showcase-grid';

      tabProjects.forEach((project, j) => {
        const thumb = (project.thumb && project.thumb.length) ? project.thumb[0] : '';
        const skills = (project.skill || []).slice(0, 3);
        const delay = j < 4 ? ` sr-d${j + 1}` : '';

        const card = document.createElement('a');
        card.href = `/${project.slug}`;
        card.className = `project-card sr${delay}`;
        card.innerHTML =
          (thumb ? `<img src="/${thumb}" alt="${project.thumb_alt || project.title}">` : '') +
          `<div class="project-card-body">` +
            `<div class="project-card-title">${project.title}</div>` +
            `<div class="project-card-tags">${skills.map(s => `<span class="tag">${s}</span>`).join('')}</div>` +
          `</div>`;

        grid.appendChild(card);
      });

      panel.appendChild(grid);
      panelParent.appendChild(panel);
    });

    // Hide section if no tabs produced results
    const hasResults = config.showcase.tabs.some(tab =>
      DataLoader.resolveFilter(projects, tab.filter).length > 0
    );
    if (!hasResults) section.style.display = 'none';
  }

  function renderCredentials(config) {
    const section = document.getElementById('credentials');
    if (!section) return;

    const heading = section.querySelector('.section-heading');
    if (heading && config.credentials.heading) heading.textContent = config.credentials.heading;

    const list = section.querySelector('.cred-list');
    if (!list) return;

    list.innerHTML = config.credentials.items
      .map((item, i) => {
        const delay = i < 4 ? ` sr-d${i + 1}` : '';
        const tags = (item.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
        return (
          `<div class="cred-item sr${delay}">` +
            `<div class="cred-top">` +
              `<span class="cred-company">${item.display_name}</span>` +
              `<span class="cred-dates">${item.dates}</span>` +
            `</div>` +
            `<div class="cred-role">${item.title}</div>` +
            `<div class="cred-tags">${tags}</div>` +
          `</div>`
        );
      })
      .join('');
  }

  function renderProcess(config, projects) {
    const section = document.getElementById('process');
    if (!section) return;

    const heading = section.querySelector('.section-heading');
    if (heading && config.process.heading) heading.textContent = config.process.heading;

    const filtered = DataLoader.resolveFilter(projects, config.process.filter);
    const processEntry = filtered.find(p => p.process && p.process.length);

    if (!processEntry || !processEntry.process.length) {
      section.style.display = 'none';
      return;
    }

    const scrollContainer = section.querySelector('.process-scroll');
    if (!scrollContainer) return;

    const steps = processEntry.process.slice(0, 3);
    const nums = ['01', '02', '03'];

    scrollContainer.innerHTML = steps
      .map((step, i) => {
        const link = step.link_slug
          ? `<a href="/${step.link_slug}" class="process-source">&rarr; ${step.link_text || 'View Project'}</a>`
          : '';
        return (
          `<div class="process-card">` +
            `<div class="process-num">${nums[i]}</div>` +
            `<div class="process-card-title">${step.word}</div>` +
            `<div class="process-card-body">${step.summary}</div>` +
            link +
          `</div>`
        );
      })
      .join('');
  }

  function renderCreative(config, projects) {
    const section = document.querySelector('.creative');
    if (!section) return;

    const heading = section.querySelector('.section-heading');
    if (heading && config.creative.heading) heading.textContent = config.creative.heading;

    const grid = section.querySelector('.creative-grid');
    if (!grid) return;

    let hasContent = false;

    grid.innerHTML = config.creative.cards
      .map((card, i) => {
        const filtered = DataLoader.resolveFilter(projects, card.filter);
        if (!filtered.length) return '';
        hasContent = true;

        const entry = filtered[Math.floor(Math.random() * filtered.length)];
        const bgImg = (entry.img && entry.img.length) ? entry.img[0] : '';
        const delay = i < 4 ? ` sr-d${i + 1}` : '';

        return (
          `<a href="${card.href}" class="creative-card sr${delay}">` +
            (bgImg ? `<img src="/${bgImg}" alt="${card.label}">` : '') +
            `<div class="creative-card-overlay">` +
              `<div class="creative-label">${card.label}</div>` +
              `<div class="creative-card-title">${card.title}</div>` +
            `</div>` +
          `</a>`
        );
      })
      .join('');

    if (!hasContent) section.style.display = 'none';
  }

  function renderImpact(config, projects) {
    const section = document.querySelector('.impact');
    if (!section) return;

    const heading = section.querySelector('.section-heading');
    if (heading && config.impact.heading) heading.textContent = config.impact.heading;

    const filtered = DataLoader.resolveFilter(projects, config.impact.filter);
    const withMetrics = filtered.filter(p => p.metric);

    const grid = section.querySelector('.impact-grid');
    if (!grid) return;

    if (!withMetrics.length) {
      section.style.display = 'none';
      return;
    }

    grid.innerHTML = withMetrics
      .map((entry, i) => {
        const m = entry.metric;
        const delay = i < 4 ? ` sr-d${i + 1}` : '';
        return (
          `<div class="impact-stat sr${delay}">` +
            `<div class="impact-num">${m.value}</div>` +
            `<div class="impact-label">${m.kpi}</div>` +
            `<div class="impact-detail">${m.context}</div>` +
          `</div>`
        );
      })
      .join('');
  }

  function renderAchievements(config, projects) {
    const section = document.querySelector('.achievements');
    if (!section) return;

    const heading = section.querySelector('.section-heading');
    if (heading && config.achievements.heading) heading.textContent = config.achievements.heading;

    const filtered = DataLoader.resolveFilter(projects, config.achievements.filter);
    const withAch = filtered.filter(p => p.achievement);

    const container = section.querySelector('.container');
    if (!container) return;

    // Remove existing accordion items but keep heading
    container.querySelectorAll('.ach-item').forEach(el => el.remove());

    if (!withAch.length) {
      section.style.display = 'none';
      return;
    }

    withAch.forEach(entry => {
      const a = entry.achievement;
      const item = document.createElement('div');
      item.className = 'ach-item';
      item.innerHTML =
        `<button class="ach-header">` +
          `<div class="ach-accent trio-sm"><span></span><span></span><span></span></div>` +
          `<span class="ach-title">${a.headline}</span>` +
          `<svg class="ach-icon" viewBox="0 0 24 24">` +
            `<line x1="12" y1="5" x2="12" y2="19"/>` +
            `<line x1="5" y1="12" x2="19" y2="12"/>` +
          `</svg>` +
        `</button>` +
        `<div class="ach-body">` +
          `<div class="ach-body-inner">${a.details}</div>` +
        `</div>`;
      container.appendChild(item);
    });
  }

  function renderCTA(config) {
    const section = document.querySelector('.cta-section');
    if (!section) return;

    const heading = section.querySelector('.cta-heading');
    if (heading && config.cta_section.heading) heading.textContent = config.cta_section.heading;

    const buttons = section.querySelector('.cta-buttons');
    if (!buttons) return;

    buttons.innerHTML = '';

    if (config.cta_section.primary) {
      const btn = document.createElement('a');
      btn.href = config.cta_section.primary.href;
      btn.className = 'btn btn-primary';
      btn.textContent = config.cta_section.primary.text;
      buttons.appendChild(btn);
    }

    if (config.cta_section.secondary) {
      const btn = document.createElement('a');
      btn.href = config.cta_section.secondary.href;
      btn.className = 'btn btn-ghost';
      btn.textContent = config.cta_section.secondary.text;
      buttons.appendChild(btn);
    }
  }

  // ──────────────────────────────────────────────
  // SCROLL BEHAVIOR FUNCTIONS
  // ──────────────────────────────────────────────

  function initScrollBehaviors() {
    initNavCollapse();
    initHeroScroll();
    initFlipClock();
    initTabs();
    initAccordion();
    initScrollReveal();
    initStatCountUp();
  }

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

  function initHeroScroll() {
    const wrapper = document.getElementById('heroWrapper');
    const heroStats = document.getElementById('heroStats');
    const heroVisual = document.getElementById('heroVisual');
    const heroOverlay = document.getElementById('heroOverlay');
    const heroContent = document.getElementById('heroContent');
    const trioBridge = document.getElementById('trioBridge');
    const flipHeadline = document.getElementById('flipHeadline');
    const heroCTA = document.getElementById('heroCTA');
    const heroByline = heroContent ? heroContent.querySelector('.hero-byline') : null;
    const trioSpans = trioBridge ? Array.from(trioBridge.querySelectorAll('span')) : [];
    if (!wrapper || !heroVisual || !heroContent) return;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    // Helper: reset individual element transforms
    function resetElementTransforms() {
      if (flipHeadline) flipHeadline.style.transform = '';
      if (heroByline) heroByline.style.transform = '';
      if (heroCTA) heroCTA.style.transform = '';
    }

    function heroScroll() {
      const rect = wrapper.getBoundingClientRect();
      const wrapH = wrapper.offsetHeight;
      const viewH = window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (wrapH - viewH)));

      // Phase 1 end height — image fills viewport minus nav and content
      // Must account for actual content height to prevent overflow clipping
      const navH = 56;
      const contentH = heroContent.offsetHeight;
      const fullVisualH = viewH - navH - contentH;

      // Phase 1 (0–0.25): Stats scroll off, image grows from 50vh to fill viewport
      if (progress < 0.25) {
        const p1 = progress / 0.25;
        const ep1 = easeOutCubic(p1);

        if (heroStats) {
          heroStats.style.height = (1 - ep1) * 80 + 'px';
          heroStats.style.opacity = String(1 - ep1);
          heroStats.style.overflow = 'hidden';
        }
        const startH = viewH * 0.5;
        heroVisual.style.height = (startH + (fullVisualH - startH) * ep1) + 'px';
        if (heroOverlay) heroOverlay.style.opacity = String(1 - ep1 * 0.6);

        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
        resetElementTransforms();

        if (trioBridge) {
          trioBridge.style.opacity = '0';
          trioSpans.forEach(span => {
            span.style.transform = 'scaleX(0)';
            span.style.opacity = '0';
            span.style.transition = 'none';
          });
        }
      }
      // Phase 2 (0.25–0.55): Image shrinks height (recedes upward in flex),
      // content stays visible until image is ~halfway gone, then fades up.
      // Expand→condense via transforms on individual elements (no margin changes).
      else if (progress < 0.55) {
        const p2 = (progress - 0.25) / 0.3;

        if (heroStats) { heroStats.style.height = '0px'; heroStats.style.opacity = '0'; }

        // Shrink visual height from full to 0
        const shrinkEased = easeInOutQuad(p2);
        heroVisual.style.height = (fullVisualH * (1 - shrinkEased)) + 'px';
        if (heroOverlay) heroOverlay.style.opacity = String(0.4 + shrinkEased * 0.6);

        if (p2 < 0.5) {
          // Sub-phase A: Content stays visible and in place while image recedes
          heroContent.style.opacity = '1';
          heroContent.style.transform = 'translateY(0)';
          resetElementTransforms();
        } else {
          // Sub-phase B: Image mostly gone — content fades out and moves up
          // Use transforms on individual children for expand→condense visual effect
          const t = (p2 - 0.5) / 0.5; // 0→1
          const easedT = easeOutCubic(t);

          // Container fades and moves up
          heroContent.style.opacity = String(Math.max(0, 1 - easedT * 1.8));
          heroContent.style.transform = `translateY(-${easedT * 50}px)`;

          // Expand→condense: sin curve goes 0→peak→0, creating visual spacing change
          // Headline stays put (reference), byline/CTA drift down then back
          const expandCondense = Math.sin(t * Math.PI) * 14;

          if (flipHeadline) flipHeadline.style.transform = 'translateY(0)';
          if (heroByline) heroByline.style.transform = `translateY(${expandCondense * 0.5}px)`;
          if (heroCTA) heroCTA.style.transform = `translateY(${expandCondense}px)`;
        }

        if (trioBridge) {
          trioBridge.style.opacity = '0';
          trioSpans.forEach(span => {
            span.style.transform = 'scaleX(0)';
            span.style.opacity = '0';
            span.style.transition = 'none';
          });
        }
      }
      // Phase 3 (0.55–0.8): Trio bars enter ONE AT A TIME, gap expand→condense
      else if (progress < 0.8) {
        const p3 = (progress - 0.55) / 0.25;

        if (heroStats) { heroStats.style.height = '0px'; heroStats.style.opacity = '0'; }
        heroVisual.style.height = '0px';
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(-50px)';
        resetElementTransforms();

        if (trioBridge) {
          trioBridge.style.opacity = '1';

          const barStarts = [0, 0.15, 0.30];
          const barDuration = 0.50;

          trioSpans.forEach((span, i) => {
            const barProgress = Math.max(0, Math.min(1, (p3 - barStarts[i]) / barDuration));
            const easedBar = easeOutCubic(barProgress);
            span.style.transform = `scaleX(${easedBar})`;
            span.style.opacity = String(Math.min(1, easedBar * 1.3));
            span.style.transition = 'none';
          });

          const gapStart = 36;
          const gapEnd = 12;
          const gapProgress = easeInOutQuad(Math.min(p3 * 1.4, 1));
          trioBridge.style.gap = (gapStart - (gapStart - gapEnd) * gapProgress) + 'px';

          const trioEnterY = (1 - easeOutQuart(Math.min(p3 * 2, 1))) * 4;
          trioBridge.style.transform = `translateY(${trioEnterY}vh)`;
        }
      }
      // Phase 4 (0.8–1.0): Trio slides up and fades; normal page content emerges
      else {
        const p4 = (progress - 0.8) / 0.2;
        const easedP4 = easeOutCubic(p4);

        if (heroStats) { heroStats.style.height = '0px'; heroStats.style.opacity = '0'; }
        heroVisual.style.height = '0px';
        heroContent.style.opacity = '0';
        resetElementTransforms();

        if (trioBridge) {
          trioBridge.style.transform = `translateY(${-easedP4 * 30}vh)`;
          trioBridge.style.opacity = String(Math.max(0, 1 - easedP4 * 1.5));
          trioBridge.style.gap = '12px';

          trioSpans.forEach(span => {
            span.style.transform = 'scaleX(1)';
            span.style.opacity = '1';
            span.style.transition = 'none';
          });
        }
      }
    }

    function resetHeroVisual() {
      const rect = wrapper.getBoundingClientRect();
      if (rect.top >= 0) {
        heroVisual.style.height = '50vh';
        heroContent.style.opacity = '';
        heroContent.style.transform = '';
        resetElementTransforms();
        if (heroOverlay) heroOverlay.style.opacity = '';
        if (heroStats) {
          heroStats.style.height = '';
          heroStats.style.opacity = '';
          heroStats.style.overflow = '';
        }
        if (trioBridge) {
          trioBridge.style.opacity = '0';
          trioBridge.style.gap = '';
          trioBridge.style.transform = '';
          trioSpans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
            span.style.transition = '';
          });
        }
      }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => { heroScroll(); resetHeroVisual(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
  }

  function initFlipClock() {
    const flipItems = document.querySelectorAll('.flip-item');
    if (!flipItems.length) return;

    let flipIndex = 0;
    setInterval(() => {
      flipItems[flipIndex].classList.remove('active');
      flipItems[flipIndex].classList.add('above');
      flipIndex = (flipIndex + 1) % flipItems.length;
      flipItems[flipIndex].classList.remove('below');
      flipItems[flipIndex].classList.add('active');
      setTimeout(() => {
        const prev = (flipIndex - 1 + flipItems.length) % flipItems.length;
        flipItems[prev].classList.remove('above');
        flipItems[prev].classList.add('below');
      }, 800);
    }, 5000);
  }

  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.showcase-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('panel-' + btn.dataset.tab);
        if (panel) panel.classList.add('active');
      });
    });
  }

  function initAccordion() {
    document.querySelectorAll('.ach-header').forEach(h => {
      h.addEventListener('click', () => h.parentElement.classList.toggle('open'));
    });
  }

  function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.sr, .trio, .cta-trio').forEach(el => obs.observe(el));
  }

  function initStatCountUp() {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 40);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));
  }

  return { init };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', LandingController.init);
} else {
  LandingController.init();
}
