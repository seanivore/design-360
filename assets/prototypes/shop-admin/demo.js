/* ============================================================================
   demo.js — DEMO FORK ONLY.  (Not in the live /admin.)

   The single seam that turns the verbatim live Content Creator Portal into a
   public, playable, server-free portfolio demo. It:
     1. adds a session store (sessionStorage) so every change sticks for the
        visit and resets on sign-out / new session;
     2. overrides PORTAL.boot / .env / .siteUrl / .authHeader so no Supabase,
        no /api/config, no real auth are needed;
     3. intercepts window.fetch("/api/*") and answers from the store, matching
        the live API's request/response shapes line-for-line.

   Load order (every surface): data.js → portal.js → demo.js → <surface>-app.js
   The live admin JS/HTML/CSS are copied VERBATIM; all fork logic lives here.
   See DEMO_FORK_CHANGES.md.
   ============================================================================ */
(function () {
  "use strict";
  const P = (window.PORTAL = window.PORTAL || {});
  const D = window.PORTAL_DATA || {};
  const { money } = D;
  P.DEMO = true;

  /* ============================ SESSION STORE ============================== */
  P.store = (function () {
    const KEY = "augCoDemo.v1";
    let cache = null;
    const live = {};
    function load() {
      if (cache) return cache;
      try { const raw = sessionStorage.getItem(KEY); cache = raw ? JSON.parse(raw) : {}; } catch (e) { cache = {}; }
      return cache;
    }
    return {
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
  ["pagehide", "beforeunload"].forEach((ev) => window.addEventListener(ev, () => P.store.commit()));
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") P.store.commit(); });

  /* working copies seeded from the shipped dataset (mutated by the mock) */
  const getProducts = () => P.store.use("products", D.products || []);
  const getOrders = () => P.store.use("orders", D.orders || []);
  const getCoupons = () => P.store.use("coupons", D.coupons || []);
  const getStoreWide = () => P.store.use("storeWide", D.storeWideSale || null);
  const getActivity = () => P.store.use("activityLog", D.activityLog || []);

  /* ---- small helpers ------------------------------------------------------ */
  const nowISO = () => new Date().toISOString();
  const rid = (n) => Math.random().toString(36).slice(2, 2 + (n || 8));
  const slugify = (s) => String(s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "piece-" + rid(4);
  const stripeIdOf = (p) => p.stripe_product_id || ("prod_" + (p.slug || p.id));
  function productBySlug(slug) { return getProducts().find((p) => p.slug === slug) || null; }
  function enrichProduct(p) { return Object.assign({ stripe_product_id: stripeIdOf(p) }, p); }
  function enrichOrder(o) { const p = productBySlug(o.products && o.products.slug); return Object.assign({ product_id: p ? p.id : null }, o); }

  /* the demo signed-in identity (any "email" from the login; default provided) */
  P.demoAccount = () => P.store.use("account", { email: "you@august.style" });

  /* activity helper (used by the login FX / sign-out; the mock also logs) */
  P.logActivity = function (action, summary) {
    const log = getActivity();
    log.unshift({ at: nowISO(), actor: (P.demoAccount().email) || "you@august.style", action, summary });
    P.store.commit();
  };

  /* (The one-time "you can't break this" welcome modal was retired — the login screen
     now carries that message. See DEMO_FORK_CHANGES.md.) */

  /* ============================ OVERRIDES ================================== */
  /* Demo environment chip (portal.js reads P.env().label). */
  P.env = function () { return { isTest: true, label: "Demo" }; };
  P.applyEnvChip = function (el) {
    if (!el) return;
    // The mobile top strip is more useful as a door to the storefront than as a "Demo" label
    // (the login already made the demo-ness clear). The desktop topbar chip keeps saying Demo.
    if (el.id === "envStrip") {
      el.innerHTML = '<a href="store.html" title="Open the August & Co. storefront" style="display:flex;align-items:center;justify-content:center;gap:7px;width:100%;color:inherit;text-decoration:none;font:inherit;font-weight:700;">'
        + '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="flex:none;"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>'
        + 'Visit the storefront</a>';
      return;
    }
    el.textContent = "Demo";
    el.classList.remove("test-chip--live");
    el.title = "An interactive demo \u2014 nothing here is real and nothing can break.";
  };
  /* View Site → the spoofed August & Co. storefront (this same deploy). */
  P.siteUrl = function () { return "store.html"; };
  /* No bearer token in the demo. */
  P.authHeader = function () { return {}; };

  /* boot: resolve "session" from the store instead of Supabase; gate protected
     surfaces to the login; fire the welcome once signed in. Same signature as
     the live PORTAL.boot so the verbatim surface apps call it unchanged. */
  P.config = D.config || {};
  P.session = null;
  P.boot = async function (opts) {
    opts = opts || {};
    P.config = D.config || {};
    const signed = P.store.use("signedIn", false);
    P.session = signed ? { access_token: "demo", user: { email: P.demoAccount().email } } : null;
    if (typeof opts.onAuth === "function") { try { opts.onAuth(P.session); } catch (e) {} }
    if (opts.requireSession && !P.session) { location.replace("account.html"); return false; }
    return true;
  };

  /* View Site navigates in-tab in the demo (easier back-and-forth; the storefront's
     "Manage store" pill brings you straight back). portal.js stays verbatim. */
  const _mountShell = P.mountShell;
  P.mountShell = function () {
    const r = _mountShell.apply(this, arguments);
    document.querySelectorAll(".rail__item.rail__foot").forEach((a) => { a.removeAttribute("target"); a.removeAttribute("rel"); });
    return r;
  };

  /* ========================== MOCK API BACKEND ============================ */
  const J = (obj, status) => new Response(JSON.stringify(obj == null ? {} : obj), {
    status: status || 200, headers: { "Content-Type": "application/json" },
  });

  function fmtExpires(dateStr) { // "YYYY-MM-DD" → "Jun 30"
    try { const d = new Date(dateStr + "T00:00:00"); return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); } catch (e) { return null; }
  }

  /* --- coupons: the store-wide auto-sale is surfaced AS an auto_apply coupon --- */
  function couponList() {
    const out = [];
    const sw = getStoreWide();
    if (sw && sw.active) {
      out.push({
        code: "STOREWIDE", promotion_code_id: "promo_auto_storewide",
        percent_off: sw.value, amount_off: null, amount_display: null,
        min_amount: null, min_display: null, times_redeemed: 0, max_redemptions: null,
        expires_at: null, expires_display: sw.expires_display || null,
        store_wide: true, product_ids: null, auto_apply: true,
        created: sw.started_at ? Math.floor(new Date(sw.started_at).getTime() / 1000) : null,
      });
    }
    getCoupons().forEach((c) => out.push(Object.assign({ auto_apply: false }, c)));
    return out;
  }

  /* --- products --- */
  function productsGET(params) {
    if (params.get("_action") === "activity") return J({ activityLog: getActivity().slice(0, 25) });
    if (params.get("_action") === "coupon") return J({ coupons: couponList() });
    const id = params.get("id");
    if (id) { const p = getProducts().find((x) => x.id === id); return p ? J(enrichProduct(p)) : J({ error: "Product not found" }, 404); }
    return J({ products: getProducts().map(enrichProduct) });
  }
  const LIVE_APPLY = { price: 1, quantity: 1, available: 1 };
  function productsPUT(params, body) {
    const id = params.get("id");
    const list = getProducts();
    const p = list.find((x) => x.id === id);
    if (!p) return J({ error: "Product not found" }, 404);
    let changed = false, staged = false;
    const flags = {};
    const patch = body || {};
    for (const k in patch) {
      if (k === "slug" || k === "id" || k === "sku") continue;
      if (LIVE_APPLY[k]) {
        if (p[k] !== patch[k]) { p[k] = patch[k]; changed = true; flags[k + "_updated"] = true; }
      } else if (p.is_published) {
        p.draft = p.draft || {};
        if (p.draft[k] !== patch[k]) { p.draft[k] = patch[k]; changed = true; staged = true; }
      } else {
        if (p[k] !== patch[k]) { p[k] = patch[k]; changed = true; }
      }
    }
    // available derives from quantity for the storefront truth
    if ("quantity" in patch && p.quantity > 0 && p.available === false && !p.archived_at && p.is_published) p.available = true;
    if (staged) p.preview_token = "prev-" + rid(6);
    P.store.commit();
    if (!changed) return J({ success: true, no_changes: true });
    const res = { success: true, product: enrichProduct(p) };
    if (staged) { res.staged = true; res.preview_token = p.preview_token; res.preview_url = "product.html?slug=" + p.slug + "&preview=" + p.preview_token; }
    Object.assign(res, flags);
    if (flags.price_updated) res.price_updated = true;
    return J(res);
  }
  function productsPOSTcreate(body) {
    const list = getProducts();
    const b = body || {};
    const slug = slugify(b.slug || b.title);
    const token = "prev-" + rid(6);
    const p = Object.assign({
      title: "", headline: "", story_card: "", description: "",
      features: [], materials: [], care_instructions: [], shipping_details: [],
      dimensions: "", weight: "", power_supply: null, artist_note: "",
      images: [], media: [], thumbnail: "", thumbnail_alt: "",
      seo_title: "", seo_description: "", seo_thumbnail: "",
      product_type: "print", series: "", featured: false,
      quantity: 0, price: 0, available: false,
    }, b, {
      id: "p-" + rid(12), sku: "AUG-" + rid(6), slug,
      is_published: false, published_at: null, draft: null,
      preview_token: token, archived_at: null, created_at: nowISO(),
    });
    list.unshift(p);
    P.store.commit();
    return J({ success: true, product: enrichProduct(p), preview_token: token, preview_url: "product.html?slug=" + slug + "&preview=" + token });
  }
  function productsActionPOST(action, body) {
    const list = getProducts();
    const b = body || {};
    const p = b.id ? list.find((x) => x.id === b.id)
      : b.token ? list.find((x) => x.preview_token === b.token) : null;
    if (action === "coupon") return couponCreate(b);
    if (action === "coupon_deactivate") return couponDeactivate(b);
    if (!p) return J({ error: "Product not found" }, 404);
    if (action === "publish") {
      if (p.draft) { Object.assign(p, p.draft); }
      p.is_published = true; p.published_at = p.published_at || nowISO(); p.draft = null; p.preview_token = null;
      if (p.quantity > 0 && !p.archived_at) p.available = true;
      P.store.commit();
      return J({ success: true, product: enrichProduct(p), url: "product.html?slug=" + p.slug, stripe_sync: { ok: true } });
    }
    if (action === "discard") { const had = !!p.draft; p.draft = null; p.preview_token = null; P.store.commit(); return J({ success: true, product: enrichProduct(p), discarded: had }); }
    if (action === "archive") { p.archived_at = nowISO(); P.store.commit(); return J({ success: true, product: enrichProduct(p), archived: true }); }
    if (action === "unarchive") { p.archived_at = null; P.store.commit(); return J({ success: true, product: enrichProduct(p), archived: false }); }
    return J({ error: "Unknown action" }, 400);
  }
  /* path-form archive/unarchive used by orders-app (POST /api/products/archive) */
  function productsPathAction(action, body) {
    const b = body || {}; const p = getProducts().find((x) => x.id === b.id);
    if (!p) return J({ error: "Product not found" }, 404);
    p.archived_at = action === "archive" ? nowISO() : null; P.store.commit();
    return J({ success: true, archived: action === "archive" });
  }

  /* --- coupons --- */
  function couponCreate(b) {
    if (b.auto_apply) {
      const sw = getStoreWide() || {};
      P.store.set("storeWide", { active: true, type: "percent", value: b.value, amount_display: b.value + "% off", started_at: nowISO(), expires_display: null });
      P.store.commit();
      P.logActivity("sale.create", "Started a " + b.value + "% store-wide sale");
      return J({ success: true, code: "STOREWIDE", coupon_id: "cpn_" + rid(6), promotion_code_id: "promo_auto_storewide" });
    }
    const code = (b.code || ("SALE" + rid(4))).toUpperCase();
    const list = getCoupons();
    if (list.some((c) => c.code === code)) return J({ error: "That code already exists" }, 409);
    const isPct = b.type === "percent";
    const coupon = {
      code, promotion_code_id: "promo_" + rid(8),
      percent_off: isPct ? b.value : null,
      amount_off: isPct ? null : b.value,
      amount_display: isPct ? null : money(b.value),
      min_amount: b.min_amount || null, min_display: b.min_amount ? money(b.min_amount) : null,
      times_redeemed: 0, max_redemptions: b.max_redemptions || null,
      expires_at: null, expires_display: b.expires_date ? fmtExpires(b.expires_date) : null,
      store_wide: !(b.product_ids && b.product_ids.length), product_ids: b.product_ids || null,
    };
    list.unshift(coupon); P.store.commit();
    P.logActivity("sale.create", "Created code \u201C" + code + "\u201D");
    return J({ success: true, code, coupon_id: "cpn_" + rid(6), promotion_code_id: coupon.promotion_code_id, expires_display: coupon.expires_display });
  }
  function couponDeactivate(b) {
    const sw = getStoreWide();
    if ((b.promotion_code_id === "promo_auto_storewide") || (sw && sw.active && b.code === "STOREWIDE")) {
      if (sw) { sw.active = false; P.store.set("storeWide", sw); P.store.commit(); }
      P.logActivity("sale.end", "Ended the store-wide sale");
      return J({ success: true, active: false });
    }
    const list = getCoupons();
    const i = list.findIndex((c) => (b.promotion_code_id && c.promotion_code_id === b.promotion_code_id) || (b.code && c.code === b.code));
    if (i < 0) return J({ error: "Sale not found" }, 404);
    const [gone] = list.splice(i, 1); P.store.commit();
    P.logActivity("sale.end", "Ended code \u201C" + gone.code + "\u201D");
    return J({ success: true, code: gone.code, active: false });
  }

  /* --- orders --- */
  function needsShipping(o) { return o.status === "completed" && !o.shipped_at; }
  function unseenCount() {
    const seenAt = P.store.use("ordersSeenAt", null);
    return getOrders().filter((o) => needsShipping(o) && (!seenAt || new Date(o.created_at) > new Date(seenAt))).length;
  }
  function ordersGET(params) {
    const orders = getOrders();
    const pi = params.get("payment_intent");
    if (pi) return J({ orders: orders.filter((o) => o.stripe_payment_intent === pi).map(enrichOrder) });
    if (params.get("status") === "needs_shipping") {
      return J({ orders: orders.filter(needsShipping).map(enrichOrder), unseen_count: unseenCount() });
    }
    return J({ orders: orders.map(enrichOrder), last_viewed: P.store.use("ordersSeenAt", null) });
  }
  function ordersLineAction(id, sub, method, body) {
    const o = getOrders().find((x) => x.id === id);
    if (!o) return J({ error: "Order not found" }, 404);
    if (sub === "refund") {
      const b = body || {};
      if (o.status === "refunded") return J({ error: "This piece is already refunded" }, 409);
      const relistIds = b.relist_product_ids || [];
      if (b.amount_cents > 0) o.status = "refunded";
      P.store.commit();
      const relist = relistIds.map((pid) => {
        const p = getProducts().find((x) => x.id === pid);
        return p ? { product_id: pid, slug: p.slug, title: p.title, available: p.available, quantity: p.quantity, archived: !!p.archived_at } : { product_id: pid, archived: false, quantity: 0 };
      });
      if (b.amount_cents > 0) P.logActivity("order.refund", "Refunded " + money(b.amount_cents) + " on \u201C" + (o.products && o.products.title) + "\u201D");
      return J({ ok: true, status: o.status, relist });
    }
    if (sub === "cancel_shipment") {
      o.status = "canceled"; P.store.commit();
      const p = productBySlug(o.products && o.products.slug);
      return J({ product_id: p ? p.id : null });
    }
    // PATCH /api/orders/:id — mark shipped / resend
    if (method === "PATCH") {
      const b = body || {};
      o.tracking_number = b.tracking_number; o.tracking_carrier = b.tracking_carrier;
      o.shipped_at = o.shipped_at || nowISO(); o.status = o.status === "refunded" ? o.status : "shipped";
      o.tracking_email_sent_at = nowISO();
      P.store.commit();
      P.logActivity("order.ship", "Marked \u201C" + (o.products && o.products.title) + "\u201D shipped");
      return J({ ok: true, order: enrichOrder(o), email_sent: true });
    }
    return J({ error: "Unsupported" }, 400);
  }

  /* --- media upload --- */
  function inferKind(url) {
    if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) return "video";
    if (/\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(url)) return "image";
    return "image";
  }
  async function uploadPOST(init) {
    const body = init.body;
    if (body instanceof FormData) {
      const file = body.get("file"), slug = body.get("slug"), role = body.get("role");
      const ext = (file && file.type && file.type.split("/")[1]) || "webp";
      let url = "";
      try { url = URL.createObjectURL(file); } catch (e) { url = ""; }
      return J({ url, filename: role + "-" + slug + "." + ext });
    }
    let b = {}; try { b = JSON.parse(body || "{}"); } catch (e) {}
    return J({ url: b.url, filename: (b.role || "media") + "-" + (b.slug || "piece") });
  }

  /* --- router --- */
  async function mockApi(url, init) {
    const method = (init.method || "GET").toUpperCase();
    let u; try { u = new URL(url, location.origin); } catch (e) { u = { pathname: url, searchParams: new URLSearchParams() }; }
    const path = u.pathname, params = u.searchParams;
    let body = null;
    if (init.body && !(init.body instanceof FormData) && typeof init.body === "string") { try { body = JSON.parse(init.body); } catch (e) { body = null; } }

    // /api/config (only if a surface bypasses our boot override)
    if (path.endsWith("/api/config")) return J(Object.assign({ isTest: true, supabaseUrl: "demo", supabasePublishableKey: "demo" }, D.config || {}));

    // /api/upload
    if (path.endsWith("/api/upload")) {
      if (method === "GET" && params.get("probe")) { const url2 = params.get("probe"); return J({ kind: inferKind(url2), contentType: "image/webp", filename: "linked-media" }); }
      if (method === "POST") return uploadPOST(init);
    }

    // /api/products/archive · /api/products/unarchive (path form)
    if (/\/api\/products\/archive$/.test(path)) return productsPathAction("archive", body);
    if (/\/api\/products\/unarchive$/.test(path)) return productsPathAction("unarchive", body);

    // /api/products (+ ?_action / ?id)
    if (/\/api\/products$/.test(path)) {
      if (method === "GET") return productsGET(params);
      if (method === "PUT") return productsPUT(params, body);
      if (method === "POST") {
        const action = params.get("_action");
        if (action) return productsActionPOST(action, body);
        return productsPOSTcreate(body);
      }
    }

    // /api/orders/:id(/sub)
    const om = path.match(/\/api\/orders\/([^/]+)(?:\/(refund|cancel_shipment))?$/);
    if (om) return ordersLineAction(decodeURIComponent(om[1]), om[2] || null, method, body);

    // /api/orders (+ ?_action=seen / ?status / ?payment_intent)
    if (/\/api\/orders$/.test(path)) {
      if (method === "POST" && params.get("_action") === "seen") { P.store.set("ordersSeenAt", nowISO()); P.store.commit(); return J({ ok: true }); }
      if (method === "GET") return ordersGET(params);
    }

    return J({ error: "Not found (demo mock): " + method + " " + path }, 404);
  }

  const _fetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init) {
    const url = typeof input === "string" ? input : (input && input.url) || "";
    if (/(^|\/)api\//.test(url) || url.indexOf("/api/") === 0) {
      try { return mockApi(url, init || {}); }
      catch (e) { return Promise.resolve(J({ error: String(e && e.message || e) }, 500)); }
    }
    return _fetch ? _fetch(input, init) : Promise.reject(new Error("fetch unavailable"));
  };
})();
