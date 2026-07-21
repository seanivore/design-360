/* ============================================================================
   August & Co. — storefront.js  (DEMO storefront, self-contained)

   Reads the SAME session store the admin writes (augCoDemo.v1), so a product
   you create / edit / discount in the portal shows up here immediately. Falls
   back to the shipped seed (PORTAL_DATA in data.js). Cart lives in its own
   sessionStorage key and resets each session. No server, no Stripe — the
   checkout is a faithful pretend flow that demonstrates the store-wide sale
   auto-applying and a coupon code replacing it.
   ============================================================================ */
(function () {
  "use strict";
  const AC = (window.AC = window.AC || {});
  const D = window.PORTAL_DATA || {};
  const money = D.money || ((c) => "$" + (c / 100).toFixed(2));
  AC.money = money;

  /* ---- read the admin's session store (products / sale / coupons) ---- */
  function demoState() { try { return JSON.parse(sessionStorage.getItem("augCoDemo.v1") || "{}"); } catch (e) { return {}; } }
  AC.allProducts = function () { const s = demoState(); return (s.products || D.products || []); };
  AC.storeWide = function () { const s = demoState(); return (s.storeWide !== undefined ? s.storeWide : (D.storeWideSale || null)); };
  AC.codeCoupons = function () { const s = demoState(); return (s.coupons || D.coupons || []); };
  /* shopper-visible catalog: published, not archived */
  AC.shopProducts = function () { return AC.allProducts().filter((p) => p.is_published && !p.archived_at); };
  AC.bySlug = function (slug) { return AC.allProducts().find((p) => p.slug === slug) || null; };
  AC.inStock = function (p) { return (p.quantity == null ? true : p.quantity > 0) && p.available !== false; };
  AC.effective = function (p) { // live view merges nothing (drafts are admin-only); return as-is
    return p;
  };

  /* ---- store-wide sale helpers ---- */
  AC.salePct = function () { const sw = AC.storeWide(); return (sw && sw.active && sw.type === "percent") ? sw.value : 0; };
  AC.saleActive = function () { return AC.salePct() > 0; };
  AC.discountedCents = function (cents) { const p = AC.salePct(); return p ? Math.round(cents * (100 - p) / 100) : cents; };

  /* ---- cart (own session key) ---- */
  const CART_KEY = "augCoCart.v1";
  function readCart() { try { const c = JSON.parse(sessionStorage.getItem(CART_KEY) || "{}"); return { items: c.items || [], code: c.code || null }; } catch (e) { return { items: [], code: null }; } }
  function writeCart(c) { try { sessionStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} document.dispatchEvent(new CustomEvent("ac:cart")); }
  AC.cart = readCart;
  AC.cartCount = function () { return readCart().items.reduce((n, i) => n + i.qty, 0); };
  AC.addToCart = function (slug, qty) {
    const c = readCart(); qty = qty || 1;
    const ex = c.items.find((i) => i.slug === slug);
    if (ex) ex.qty += qty; else c.items.push({ slug, qty });
    writeCart(c);
  };
  AC.setQty = function (slug, qty) { const c = readCart(); const it = c.items.find((i) => i.slug === slug); if (it) { it.qty = Math.max(1, qty); } writeCart(c); };
  AC.removeFromCart = function (slug) { const c = readCart(); c.items = c.items.filter((i) => i.slug !== slug); writeCart(c); };
  AC.setCode = function (code) { const c = readCart(); c.code = code || null; writeCart(c); };
  AC.clearCart = function () { writeCart({ items: [], code: null }); };

  /* cart lines resolved against the live catalog */
  AC.cartLines = function () {
    return readCart().items.map((i) => {
      const p = AC.bySlug(i.slug);
      if (!p) return null;
      return { slug: i.slug, qty: i.qty, product: p, unit: p.price, lineBase: p.price * i.qty };
    }).filter(Boolean);
  };

  /* ---- coupon validation (code path) ---- */
  AC.findCoupon = function (code) {
    if (!code) return null;
    return AC.codeCoupons().find((c) => (c.code || "").toUpperCase() === code.toUpperCase()) || null;
  };

  /* ---- the money math shared by cart / checkout / complete ----
     Precedence mirrors the real store: a valid entered CODE replaces the
     automatic store-wide sale; otherwise the store-wide % applies to everything. */
  AC.compute = function () {
    const lines = AC.cartLines();
    const subtotal = lines.reduce((s, l) => s + l.lineBase, 0);
    const c = readCart();
    const coupon = AC.findCoupon(c.code);
    let discount = 0, label = null, kind = null, codeIssue = null;

    if (coupon) {
      // is it eligible? (min order + product scope)
      const scopeIds = coupon.product_ids;
      const eligibleBase = (!scopeIds || !scopeIds.length)
        ? subtotal
        : lines.filter((l) => scopeIds.includes(l.product.stripe_product_id) || scopeIds.includes("prod_" + l.product.slug)).reduce((s, l) => s + l.lineBase, 0);
      const meetsMin = !coupon.min_amount || subtotal >= coupon.min_amount;
      if (meetsMin && eligibleBase > 0) {
        if (coupon.percent_off != null) discount = Math.round(eligibleBase * coupon.percent_off / 100);
        else if (coupon.amount_off != null) discount = Math.min(coupon.amount_off, eligibleBase);
        label = "Code " + coupon.code; kind = "code";
      } else {
        // code present but not eligible → note it, fall back to store-wide
        codeIssue = (coupon.min_amount && subtotal < coupon.min_amount)
          ? "Code " + coupon.code + " needs a " + money(coupon.min_amount) + " minimum \u2014 showing the studio sale instead."
          : "Code " + coupon.code + " only applies to certain pieces \u2014 showing the studio sale instead.";
      }
    }
    if (!discount && AC.saleActive()) {
      discount = subtotal - lines.reduce((s, l) => s + AC.discountedCents(l.unit) * l.qty, 0);
      label = "Studio sale \u00b7 " + AC.salePct() + "% off"; kind = "storewide";
    }
    const shipping = subtotal === 0 ? 0 : (subtotal - discount >= 15000 ? 0 : 900);
    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.0725);
    const total = taxable + shipping + tax;
    return { lines, subtotal, discount, label, kind, codeIssue, coupon, code: c.code, shipping, tax, total, freeShip: shipping === 0 && subtotal > 0 };
  };

  /* ============================ CHROME ============================ */
  const ICON = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M2 3h3l2.2 12.2a1.5 1.5 0 0 0 1.5 1.2h8.5a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  };
  AC.ICON = ICON;

  const NAV = [["store.html", "Home"], ["shop.html", "Shop"], ["shop.html?type=print", "Prints"], ["shop.html?type=apparel", "Apparel"], ["shop.html?type=merch", "Goods"]];

  AC.mountChrome = function (active) {
    // sale utility bar
    const sw = AC.storeWide();
    const saleHTML = (sw && sw.active)
      ? `<div class="salebar">Studio sale \u2014 <b>${sw.value}% off everything</b>, already applied at checkout.</div>` : "";

    const cartN = AC.cartCount();
    const navLinks = NAV.map(([href, label]) => {
      const cur = (active === "home" && href === "store.html") || (active === "shop" && href === "shop.html");
      return `<a href="${href}" ${cur ? 'aria-current="page"' : ""}>${label}</a>`;
    }).join("");

    const hdr = `${saleHTML}
      <header class="hdr" id="hdr"><div class="wrap hdr__in">
        <a class="brand" href="store.html">August<span class="brand__amp">&amp;</span>Co.<span class="brand__co">Est. Demo</span></a>
        <nav class="nav">${navLinks}</nav>
        <span class="hdr__sp"></span>
        <div class="hdr__actions">
          <a class="admin-pill" href="products.html" title="Back to the admin demo">\u2190 <span class="admin-pill__l">Manage store</span><span class="admin-pill__s">Admin</span></a>
          <a class="iconbtn" href="cart.html" aria-label="Cart">${ICON.cart}<span class="cartcount" ${cartN ? "" : "hidden"}>${cartN}</span></a>
          <button class="iconbtn navtoggle" id="navToggle" aria-label="Menu">${ICON.menu}</button>
        </div>
      </div></header>
      <div class="msheet" id="msheet">
        <div class="msheet__top"><a class="brand" href="store.html">August<span class="brand__amp">&amp;</span>Co.</a><button class="iconbtn" id="msheetClose" aria-label="Close">${ICON.close}</button></div>
        ${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}
        <a href="products.html" style="color:var(--ink-soft);font-size:1.2rem;margin-top:20px;">\u2190 Manage store (admin demo)</a>
      </div>`;

    const host = document.getElementById("chrome");
    if (host) host.innerHTML = hdr;

    // scroll state
    const hEl = document.getElementById("hdr");
    const onScroll = () => { if (hEl) hEl.classList.toggle("is-stuck", window.scrollY > 12); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

    // mobile sheet
    const sheet = document.getElementById("msheet");
    document.getElementById("navToggle")?.addEventListener("click", () => sheet.classList.add("is-on"));
    document.getElementById("msheetClose")?.addEventListener("click", () => sheet.classList.remove("is-on"));

    // keep cart count fresh
    document.addEventListener("ac:cart", () => {
      const el = document.querySelector(".cartcount"); if (!el) return;
      const n = AC.cartCount(); el.textContent = n; el.hidden = !n;
    });
  };

  AC.mountFooter = function () {
    const host = document.getElementById("foot"); if (!host) return;
    host.innerHTML = `<footer class="foot"><div class="wrap">
      <div class="foot__grid">
        <div>
          <div class="foot__brand">August<span class="brand__amp">&amp;</span>Co.</div>
          <p style="margin-top:12px;max-width:34ch;">Prints, apparel, and objects for people who notice the details. A portfolio demo store \u2014 every piece is fictional, nothing ships.</p>
        </div>
        <div><h4>Shop</h4><ul><li><a href="shop.html">All pieces</a></li><li><a href="shop.html?type=print">Prints</a></li><li><a href="shop.html?type=apparel">Apparel</a></li><li><a href="shop.html?type=merch">Goods</a></li></ul></div>
        <div><h4>Studio</h4><ul><li><a href="https://august.style" target="_blank" rel="noopener">august.style</a></li><li><a href="https://everlastings.august.style/" target="_blank" rel="noopener">How it works (video)</a></li><li><a href="products.html">Manage store (admin)</a></li></ul></div>
        <div><h4>Note</h4><ul><li style="color:#b6ada1;font-size:.86rem;line-height:1.5;">This storefront is a live demo of a store-management system. Run a sale in the admin and watch it apply here.</li></ul></div>
      </div>
      <div class="foot__bar"><span>\u00A9 <span id="yr"></span> August &amp; Co. \u2014 a demo by <a href="https://august.style" target="_blank" rel="noopener">Sean August Horvath</a></span><span class="mono">Demo \u00b7 no real checkout</span></div>
    </div></footer>`;
    const y = document.getElementById("yr"); if (y) y.textContent = new Date().getFullYear();
  };

  /* tile markup shared by home + shop */
  AC.tileHTML = function (p) {
    const pct = AC.salePct();
    const out = AC.inStock(p);
    const thumb = p.thumbnail || (p.images && p.images[0] && p.images[0].url) || "";
    const badges = [];
    if (!out) badges.push('<span class="badge badge--soldout">Sold out</span>');
    else if (pct) badges.push(`<span class="badge badge--sale">${pct}% off</span>`);
    else if (p.featured) badges.push('<span class="badge">Featured</span>');
    const price = (pct && out)
      ? `<span class="was">${money(p.price)}</span><span class="now is-sale">${money(AC.discountedCents(p.price))}</span>`
      : `<span class="now">${money(p.price)}</span>`;
    return `<article class="tile"><a href="product.html?slug=${encodeURIComponent(p.slug)}">
      <div class="tile__media">
        ${thumb ? `<img src="${thumb}" alt="${(p.thumbnail_alt || p.title || "").replace(/"/g, "&quot;")}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="tile__ph" style="display:none">${p.title || "Piece"}</span>` : `<span class="tile__ph">${p.title || "Piece"}</span>`}
        <div class="tile__badges">${badges.join("")}</div>
      </div>
      <div class="tile__body">
        ${p.series ? `<span class="tile__series">${p.series}</span>` : ""}
        <span class="tile__title">${p.title || "Untitled"}</span>
        <span class="tile__price">${price}</span>
      </div></a></article>`;
  };
})();
