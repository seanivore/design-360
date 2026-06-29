/* ============================================================================
   Content Creator Portal — portal.js
   Shared, framework-free helpers used by every surface. Attach once per page
   after data.js. Everything is namespaced on window.PORTAL.
   ============================================================================ */
(function () {
  "use strict";
  const P = (window.PORTAL = window.PORTAL || {});

  /* ============================ DEMO BUILD ===================================
     This is the public portfolio demo fork. It persists every change for the
     visitor's SESSION (sessionStorage) so create/edit/delete stick and carry
     across surfaces, and resets to the seed on sign-out / new session. ======= */
  P.DEMO = true;

  P.store = (function () {
    const KEY = "shopAdminDemo.v1";
    let cache = null;
    const live = {}; // key -> the live reference handed to a surface
    function load() {
      if (cache) return cache;
      try { const raw = sessionStorage.getItem(KEY); cache = raw ? JSON.parse(raw) : {}; } catch (e) { cache = {}; }
      return cache;
    }
    return {
      // return the session value for key, or a deep clone of the default (and seed it)
      use(key, def) {
        const s = load();
        const val = (s[key] !== undefined) ? s[key] : JSON.parse(JSON.stringify(def == null ? null : def));
        s[key] = val; live[key] = val; return val;
      },
      get(key) { return live[key]; },
      set(key, val) { const s = load(); s[key] = val; live[key] = val; return val; },
      commit() { try { const s = load(); for (const k in live) s[k] = live[k]; sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} },
      reset() { try { sessionStorage.removeItem(KEY); } catch (e) {} cache = null; for (const k in live) delete live[k]; },
    };
  })();
  // flush in-page changes before leaving so they survive navigation between surfaces / reload
  ["pagehide", "beforeunload"].forEach((ev) => window.addEventListener(ev, () => P.store.commit()));
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") P.store.commit(); });

  // append an entry to the live activity log (demo: every mutating action records one)
  P.logActivity = function (action, summary) {
    const data = window.PORTAL_DATA || {};
    const log = P.store.use("activityLog", data.activityLog || []);
    const acct = P.store.get("account");
    log.unshift({ at: new Date().toISOString(), actor: (acct && acct.email) || "admin@design.shop", action, summary });
    P.store.commit();
  };

  // one-time-per-session welcome: “you can’t break this”
  P.maybeWelcome = function () {
    if (!P.DEMO) return;
    if (!P.store.use("signedIn", false)) return;
    if (P.store.use("welcomed", false)) return;
    P.store.set("welcomed", true); P.store.commit();
    const ov = document.createElement("div");
    ov.style.cssText = "position:fixed; inset:0; z-index:120; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(22,24,30,.5); -webkit-backdrop-filter:blur(5px); backdrop-filter:blur(5px); opacity:0; transition:opacity .2s;";
    ov.innerHTML = '<div role="dialog" aria-modal="true" style="max-width:440px; width:100%; background:var(--surface); border-radius:var(--r-lg); box-shadow:var(--sh-2); padding:28px;">'
      + '<h2 style="margin:0 0 8px; font-size:var(--t-xl); font-weight:600; letter-spacing:-.01em;">You can’t break this.</h2>'
      + '<p style="margin:0 0 20px; color:var(--ink-muted); font-size:var(--t-base); line-height:1.55;">This is a fully interactive demo. Create products, edit anything, run sales, process refunds — go wild. Nothing here is real, and nothing you do can break it. Everything resets when you sign out or come back later.</p>'
      + '<button type="button" class="btn btn--block" id="welcomeGo">Start exploring</button></div>';
    document.body.appendChild(ov);
    requestAnimationFrame(() => { ov.style.opacity = "1"; });
    const close = () => { ov.style.opacity = "0"; setTimeout(() => ov.remove(), 200); };
    ov.querySelector("#welcomeGo").addEventListener("click", close);
    ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
  };

  /* ---- environment chip: derived from the hostname, never hardcoded --------
     *.vercel.app / localhost / file:// → TEST ; everlastingsbyemaline.com → Live
     (Integration: this is exactly window.location.hostname — see INTEGRATION.md) */
  P.env = function () {
    const h = (location.hostname || "").toLowerCase();
    const isProd = /everlastingsbyemaline\.com$/.test(h);
    const isTest = !isProd; // vercel.app previews, localhost, file:// all read as test
    return { isTest, label: isTest ? "Test" : "Live" };
  };
  P.applyEnvChip = function (el) {
    if (!el) return;
    const e = P.env();
    el.textContent = P.DEMO ? "Demo" : e.label;
    el.classList.toggle("test-chip--live", !e.isTest);
    el.title = P.DEMO ? "This is an interactive demo — nothing here is real and nothing can break." : (e.isTest ? "You're viewing test data (preview environment)" : "You're on the live shop");
  };
  /* demo: “store home” always points at the real site that was built (the whole point of the showcase) */
  P.siteUrl = function () { return "https://everlastingsbyemaline.com"; };
  /* demo: link back to the portfolio apex */
  P.portfolioUrl = function () { return "https://august.style"; };

  /* ---- icons reused across helpers ---- */
  const SVG = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  };

  /* ---- toast: top-right (desktop) / top-center (mobile); tap or swipe to dismiss fast ---- */
  P.toast = function (msg, opts) {
    opts = opts || {};
    let wrap = document.getElementById("toasts");
    if (!wrap) { wrap = document.createElement("div"); wrap.id = "toasts"; wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    const el = document.createElement("div");
    el.className = "toast" + (opts.kind ? " toast--" + opts.kind : "");
    el.setAttribute("role", "status");
    el.innerHTML = (opts.kind === "live" ? SVG.check : "") + "<span>" + msg + "</span>";
    if (opts.undo) {
      const b = document.createElement("button");
      b.className = "toast__undo"; b.type = "button"; b.textContent = "Undo";
      b.addEventListener("click", (e) => { e.stopPropagation(); opts.undo(); dismiss(); });
      el.appendChild(b);
    }
    wrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add("is-on"));
    let hideT = setTimeout(dismiss, opts.undo ? 5000 : 2600);
    function dismiss() { clearTimeout(hideT); el.classList.remove("is-on"); setTimeout(() => el.remove(), 240); }
    // tap to dismiss
    el.addEventListener("click", dismiss);
    // swipe to dismiss (up, or horizontal)
    let sx = 0, sy = 0, dragging = false;
    el.addEventListener("touchstart", (e) => { dragging = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; el.style.transition = "none"; }, { passive: true });
    el.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      const dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
      el.style.transform = `translate(${dx}px, ${Math.min(dy, 0)}px)`;
      el.style.opacity = String(Math.max(0, 1 - (Math.abs(dx) + Math.abs(Math.min(dy, 0))) / 120));
    }, { passive: true });
    el.addEventListener("touchend", (e) => {
      dragging = false; el.style.transition = "";
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 60 || dy < -40) dismiss(); else { el.style.transform = ""; el.style.opacity = ""; }
    });
    return dismiss;
  };

  /* ---- auto-growing textarea: starts ~2 lines taller, grows to fit, never scrolls ---- */
  P.autoGrow = function (el) {
    if (!el) return;
    const grow = () => { el.style.height = "auto"; el.style.height = Math.max(el.scrollHeight, parseInt(getComputedStyle(el).minHeight) || 0) + "px"; };
    el.addEventListener("input", grow);
    // run after layout so scrollHeight is correct
    requestAnimationFrame(grow);
    el.__grow = grow;
  };
  P.wireAutoGrow = function (scope) {
    (scope || document).querySelectorAll("textarea[data-autogrow]").forEach(P.autoGrow);
  };

  /* ---- live character counter: shows characters REMAINING vs the recommended length;
         turns red when ≤10 left and stays red once negative (over). ---- */
  P.wireCharCount = function (scope) {
    (scope || document).querySelectorAll("[data-rec]").forEach((field) => {
      const input = field.querySelector("input, textarea");
      const out = field.querySelector("[data-count-out]");
      if (!input || !out) return;
      const rec = parseInt(field.getAttribute("data-rec"), 10);
      const upd = () => {
        const remaining = rec - (input.value || "").length;
        out.textContent = remaining;
        out.classList.toggle("is-over", remaining <= 10);
      };
      input.addEventListener("input", upd);
      upd();
    });
  };

  /* ---- tap/click tooltips (the small "i" and lock chips) — hover works via CSS; this adds tap ---- */
  P.wireTips = function (scope) {
    (scope || document).querySelectorAll(".tip__btn").forEach((b) => {
      if (b.__wired) return; b.__wired = true;
      b.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        const tip = b.closest(".tip");
        const open = tip.classList.contains("is-open");
        document.querySelectorAll(".tip.is-open").forEach((t) => t.classList.remove("is-open"));
        if (!open) tip.classList.add("is-open");
      });
    });
    if (!P.__tipDoc) {
      P.__tipDoc = true;
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".tip")) document.querySelectorAll(".tip.is-open").forEach((t) => t.classList.remove("is-open"));
      });
    }
  };

  /* ---- escape HTML ---- */
  P.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  };

  /* ---- run all auto-wirers within a scope (call after injecting editor HTML) ---- */
  P.enhance = function (scope) {
    P.wireAutoGrow(scope); P.wireCharCount(scope); P.wireTips(scope);
  };

  /* ---- shared shell: rail + mobile tabbar + env + collapse — call once per surface page ---- */
  // demo: live count of unfulfilled orders (groups with a paid-but-unshipped line), from the session store
  P.unfulfilledCount = function () {
    const data = window.PORTAL_DATA || {};
    const orders = (P.store && P.store.use) ? P.store.use("orders", data.orders || []) : (data.orders || []);
    const byPi = {};
    orders.forEach((o) => { const k = o.stripe_payment_intent || o.id; (byPi[k] = byPi[k] || []).push(o); });
    return Object.values(byPi).filter((ls) => ls.some((l) => l.status === "completed" && !l.shipped_at)).length;
  };
  // recompute + repaint the Orders badge/blink on rail + tab bar (call after shipping/refunding)
  P.refreshOrdersBadge = function () {
    const n = P.unfulfilledCount();
    ["rail__item", "tabbar__item"].forEach((cls) => {
      const a = document.querySelector("." + cls + '[href="orders.html"]'); if (!a) return;
      if (n) a.setAttribute("data-alert", ""); else a.removeAttribute("data-alert");
      let b = a.querySelector(".badge");
      if (n) { if (!b) { b = document.createElement("span"); b.className = "badge"; a.appendChild(b); } b.textContent = n; }
      else if (b) { b.remove(); }
    });
  };

  P.mountShell = function (active, opts) {
    opts = opts || {};
    // demo: enforce login-first — any non-login surface bounces to the login if not signed in
    if (P.DEMO && active !== "account" && !P.store.use("signedIn", false)) { window.location.replace("account.html"); return; }
    const badge = P.unfulfilledCount(); // live count, not a hardcoded number
    const I = {
      products: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
      orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7"/><path d="m12 11v10"/></svg>',
      sales: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.6-1.4V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.4 7.4a2 2 0 0 1 0 2.4Z"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>',
      account: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>',
      view: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M21 3 10 14"/><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/></svg>',
      collapse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/></svg>',
    };
    const NAV = [["products", "Products"], ["orders", "Orders"], ["sales", "Sales"], ["account", "Account"]];
    const app = document.querySelector(".app");
    const railItem = (k, l) => `<a class="rail__item" href="${k}.html" ${k === active ? 'aria-current="page"' : ""} data-label="${l}" ${k === "orders" && badge ? "data-alert" : ""}>${I[k]}<span class="lbl">${l}</span>${k === "orders" && badge ? `<span class="badge">${badge}</span>` : ""}</a>`;
    const rail = document.createElement("nav"); rail.className = "rail"; rail.setAttribute("aria-label", "Portal sections");
    rail.innerHTML = `<button class="rail__toggle" id="railToggle" aria-label="Collapse menu" title="Collapse menu">${I.collapse}</button>`
      + NAV.map(([k, l]) => railItem(k, l)).join("")
      + `<span class="rail__sep" aria-hidden="true"></span><a class="rail__item rail__foot" href="${P.siteUrl()}" target="_blank" rel="noopener" data-label="View Site">${I.view}<span class="lbl">View Site</span></a>`;
    app.insertBefore(rail, app.firstChild);
    const tb = document.createElement("nav"); tb.className = "tabbar"; tb.setAttribute("aria-label", "Portal sections");
    tb.innerHTML = NAV.map(([k, l]) => `<a class="tabbar__item" href="${k}.html" ${k === active ? 'aria-current="page"' : ""} ${k === "orders" && badge ? "data-alert" : ""}>${I[k]}${l}${k === "orders" && badge ? `<span class="badge">${badge}</span>` : ""}</a>`).join("");
    document.body.appendChild(tb);
    const strip = document.createElement("div"); strip.className = "envstrip"; strip.id = "envStrip";
    document.body.insertBefore(strip, document.body.firstChild);
    const env = P.env(), chip = document.getElementById("envChip");
    if (env.isTest) { P.applyEnvChip(chip); P.applyEnvChip(strip); } else { if (chip) chip.style.display = "none"; strip.style.display = "none"; }
    if (localStorage.getItem("portalRailCollapsed") === "1") app.classList.add("rail-collapsed");
    const rt = document.getElementById("railToggle");
    rt.addEventListener("click", () => { const c = app.classList.toggle("rail-collapsed"); localStorage.setItem("portalRailCollapsed", c ? "1" : "0"); rt.setAttribute("aria-label", c ? "Expand menu" : "Collapse menu"); rt.title = c ? "Expand menu" : "Collapse menu"; });
    P.maybeWelcome();
  };
})();
