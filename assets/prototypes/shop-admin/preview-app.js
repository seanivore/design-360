/* ============================================================================
   Storefront product PREVIEW — reads a product from data.js by ?id= or ?slug=
   and renders the customer-facing page (gallery + media, sale price, details).
   Opened from the admin's Preview (eye) button. No login, no cart — it's a peek.
   ============================================================================ */
(function () {
  "use strict";
  const D = window.PORTAL_DATA, money = D.money;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const root = document.getElementById("pdp");

  const qs = new URLSearchParams(location.search);
  const key = qs.get("id") || qs.get("slug");
  const p = (D.products || []).find((x) => x.id === key || x.slug === key) || (D.products || [])[0];

  if (!p) {
    root.innerHTML = '<div class="missing"><h1>Nothing to preview</h1><p>Open this from a product\u2019s Preview button.</p></div>';
    return;
  }

  // effective (draft overlay) values — Preview shows what publishing would show
  const eff = (k) => (p.draft && p.draft[k] != null ? p.draft[k] : p[k]);
  const list = (k) => (Array.isArray(eff(k)) ? eff(k) : []).filter((x) => String(x).trim());

  /* ---- admin review bar — PORTED VERBATIM from the live site (assets/js/product.js
     mountPreviewBanner). Same markup, colors, copy, fields, image crops. Only the publish
     action differs: live site POSTs /api/products/publish; here it posts a message to the
     admin (embedded) or updates the demo session store (standalone tab). ---- */
  function mountPreviewBanner(product) {
    const state = product.archived_at ? "archived" : (!product.is_published ? "draft" : (product.draft ? "edits" : ((!product.available || product.quantity === 0) ? "sold" : "live")));
    const canPublish = state === "draft" || state === "edits";
    const bar = document.createElement("div");
    bar.setAttribute("role", "status");
    bar.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:9999;font-family:var(--font-body,sans-serif);box-shadow:0 2px 10px rgba(0,0,0,0.25);";

    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;padding:10px 16px;background:var(--accent-primary,#4A1942);color:var(--text-inverse,#FFF8E7);font-size:14px;";
    const label = document.createElement("span");
    label.textContent = canPublish
      ? "Draft preview — not yet live. This is how shoppers will see it."
      : (state === "sold" ? "Sold out — this is how shoppers see it." : "Live — this is how shoppers see it.");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = state === "edits" ? "Publish changes" : "Publish";
    btn.style.cssText = "padding:6px 18px;border:0;border-radius:6px;background:var(--accent-gold,#D4AF7A);color:var(--color-ink,#1A1A1A);font:inherit;font-weight:600;cursor:pointer;";
    if (!canPublish) btn.style.display = "none";
    btn.addEventListener("click", () => {
      btn.disabled = true; btn.textContent = "Publishing…";
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "portal-publish", id: product.id }, "*");
      } else {
        product.is_published = true; product.draft = null;
        if (window.PORTAL && window.PORTAL.store) window.PORTAL.store.commit && window.PORTAL.store.commit();
        label.textContent = "Published — live now."; btn.style.display = "none";
      }
    });
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = "Hide draft details";
    toggle.style.cssText = "padding:6px 12px;border:1px solid rgba(255,255,255,0.4);border-radius:6px;background:transparent;color:inherit;font:inherit;font-size:13px;cursor:pointer;";
    row.append(label, btn, toggle);

    const panel = document.createElement("div");
    panel.style.cssText = "display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start;padding:12px 18px;background:#FFF8E7;color:var(--color-ink,#1A1A1A);border-top:1px solid rgba(0,0,0,0.12);font-size:13px;";
    const syncPad = () => { document.body.style.paddingTop = bar.offsetHeight + "px"; };

    function textCell(labelTxt, value) {
      const cell = document.createElement("div");
      cell.style.cssText = "flex:1 1 240px;min-width:200px;max-width:380px;";
      const head = document.createElement("div");
      head.style.cssText = "display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:3px;";
      const lab = document.createElement("span");
      lab.textContent = labelTxt;
      lab.style.cssText = "font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#8a7a55;";
      head.appendChild(lab);
      if (value) {
        const copy = document.createElement("button");
        copy.type = "button"; copy.textContent = "Copy";
        copy.style.cssText = "font-size:10px;border:1px solid #cbb990;border-radius:4px;background:#fff;color:#4A1942;padding:1px 7px;cursor:pointer;";
        copy.addEventListener("click", () => { navigator.clipboard && navigator.clipboard.writeText(value); copy.textContent = "Copied"; setTimeout(() => (copy.textContent = "Copy"), 1200); });
        head.appendChild(copy);
      }
      const val = document.createElement("div");
      val.textContent = value || "(not set — falls back to the page copy)";
      val.style.cssText = "line-height:1.4;user-select:text;" + (value ? "" : "color:#a08;opacity:.6;font-style:italic;");
      cell.append(head, val);
      return cell;
    }
    function imgCell(labelTxt, src, ratio) {
      const cell = document.createElement("div");
      cell.style.cssText = "flex:0 0 auto;";
      const lab = document.createElement("div");
      lab.textContent = labelTxt;
      lab.style.cssText = "font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#8a7a55;margin-bottom:3px;";
      cell.appendChild(lab);
      if (src) {
        const img = document.createElement("img");
        img.src = src; img.alt = labelTxt; img.loading = "lazy";
        img.style.cssText = "height:74px;aspect-ratio:" + ratio + ";object-fit:cover;border:1px solid rgba(0,0,0,0.18);border-radius:4px;background:#fff;display:block;";
        img.onerror = () => img.remove();
        cell.appendChild(img);
      } else {
        const none = document.createElement("div");
        none.textContent = "(not set)";
        none.style.cssText = "color:#a08;opacity:.6;font-style:italic;font-size:11px;";
        cell.appendChild(none);
      }
      return cell;
    }
    const heroUrl = (product.images && product.images[0]) ? product.images[0].url : "";
    panel.append(
      textCell("SEO title", product.seo_title),
      textCell("SEO description", product.seo_description),
      textCell("Checkout name", product.checkout_name),
      textCell("Checkout line", product.checkout_description),
      imgCell("Thumbnail (4:5)", product.thumbnail || heroUrl, "4 / 5"),
      imgCell("OG image (1.91:1)", product.seo_thumbnail || heroUrl, "1.91 / 1"),
      imgCell("Checkout image (1:1)", product.checkout_image || heroUrl, "1 / 1"),
    );

    let open = true;
    toggle.addEventListener("click", () => { open = !open; panel.style.display = open ? "flex" : "none"; toggle.textContent = open ? "Hide draft details" : "Show draft details"; syncPad(); });

    bar.append(row, panel);
    document.body.appendChild(bar);
    syncPad();
    window.addEventListener("resize", syncPad);
  }
  mountPreviewBanner(p);


  /* ---- media: hero + gallery images, then any videos / youtube ---- */
  const media = [];
  (p.images || []).forEach((im, i) => media.push({ kind: "image", url: im.url, alt: im.alt || p.thumbnail_alt || "", label: i === 0 ? "Hero" : "Photo" }));
  (p.media || []).forEach((m) => media.push(Object.assign({ kind: m.type }, m)));

  /* ---- price (apply store-wide sale for the storefront view) ---- */
  const sale = D.storeWideSale;
  let priceNow = p.price, priceWas = null, saleChip = null;
  if (sale && sale.active && !p.archived_at && p.price > 0) {
    if (sale.type === "percent") priceNow = Math.round(p.price * (1 - sale.value / 100));
    else priceNow = Math.max(0, p.price - sale.value);
    if (priceNow < p.price) { priceWas = p.price; saleChip = sale.amount_display || (sale.type === "percent" ? sale.value + "% off" : "Sale"); }
  }
  const soldOut = (p.is_published && !p.available) || p.quantity === 0;
  const archived = !!p.archived_at;

  /* ---- specs ---- */
  const specs = [];
  if (eff("dimensions")) specs.push(["Dimensions", eff("dimensions")]);
  if (eff("weight")) specs.push(["Weight", eff("weight")]);
  if (p.series && !/no collection|no series/i.test(p.series)) specs.push(["Collection", p.series]);
  if (p.sku) specs.push(["SKU", p.sku]);

  const sectionList = (title, items) => items.length ? `<div class="sec"><h3>${title}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : "";

  root.innerHTML = `<div class="pdp">
    <div class="gallery">
      <div class="stage" id="stage"></div>
      <div class="thumbs" id="thumbs">${media.map((m, i) => thumb(m, i)).join("")}</div>
    </div>
    <div class="info">
      ${p.series && !/no collection|no series/i.test(p.series) ? `<div class="info__series">${esc(p.series)}</div>` : ""}
      <h1>${esc(eff("title") || "Untitled")}</h1>
      ${eff("headline") ? `<div class="info__headline">${esc(eff("headline"))}</div>` : ""}
      ${archived ? `<div class="soldout">Archived \u2014 not currently in the shop</div>`
        : soldOut ? `<div class="soldout">Sold out</div>`
        : `<div class="price"><span class="price__now">${money(priceNow)}</span>${priceWas ? `<span class="price__was">${money(priceWas)}</span><span class="price__chip">${esc(saleChip)}</span>` : ""}</div>`}
      <div class="buy">
        <button class="btn btn--primary" id="buyBtn"${archived || soldOut ? " disabled" : ""}>${archived ? "Unavailable" : soldOut ? "Sold out" : "Add to cart"}</button>
        ${!archived && !soldOut && p.quantity > 0 && p.quantity <= 5 ? `<span class="stock">Only ${p.quantity} left</span>` : ""}
      </div>
      ${eff("story_card") ? `<div class="story">${esc(eff("story_card"))}</div>` : ""}
      ${eff("description") ? `<div class="desc">${esc(eff("description"))}</div>` : ""}
      ${sectionList("Features", list("features"))}
      ${sectionList("Materials", list("materials"))}
      ${specs.length ? `<div class="sec"><h3>Details</h3><dl class="specs">${specs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl></div>` : ""}
      ${sectionList("Care", list("care_instructions"))}
      ${sectionList("Shipping", list("shipping_details"))}
      ${eff("artist_note") ? `<div class="sec"><h3>Artist note</h3><div class="note">${esc(eff("artist_note"))}</div></div>` : ""}
    </div>
  </div>`;

  function thumb(m, i) {
    if (m.kind === "image") return `<button class="thumb" data-i="${i}"><img src="${m.url}" alt="" loading="lazy" onerror="this.closest('.thumb').style.display='none'"></button>`;
    if (m.kind === "video") return `<button class="thumb" data-i="${i}">${m.poster ? `<img src="${m.poster}" alt="" onerror="this.style.display='none'">` : ""}<span class="thumb__play">\u25B6</span><span class="thumb__badge">Video</span></button>`;
    return `<button class="thumb" data-i="${i}"><span class="thumb__play">\u25B6</span><span class="thumb__badge">YouTube</span></button>`;
  }

  const stage = document.getElementById("stage");
  function showMedia(i) {
    const m = media[i]; if (!m) return;
    document.querySelectorAll("#thumbs .thumb").forEach((t, j) => t.classList.toggle("is-active", j === i));
    if (m.kind === "image") {
      stage.innerHTML = `<img src="${esc(m.url)}" alt="${esc(m.alt)}">`;
    } else if (m.kind === "video") {
      // honor the admin's media flags so the loop/autoplay/controls behavior is visible
      const attrs = ["playsinline"];
      if (m.loop) attrs.push("loop");
      if (m.controls) attrs.push("controls");
      if (m.autoplay) attrs.push("autoplay", "muted"); // autoplay requires muted
      stage.innerHTML = `<video src="${esc(m.url)}" ${attrs.join(" ")} ${m.poster ? `poster="${esc(m.poster)}"` : ""}></video>`;
      const v = stage.querySelector("video"); if (v && m.autoplay) { v.muted = true; v.play().catch(() => {}); }
    } else {
      const id = (m.url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/) || [])[1];
      stage.innerHTML = id ? `<iframe src="https://www.youtube.com/embed/${id}" allow="autoplay; encrypted-media" allowfullscreen></iframe>` : `<div class="note" style="padding:20px">Video preview</div>`;
    }
  }
  document.querySelectorAll("#thumbs .thumb").forEach((t) => t.addEventListener("click", () => showMedia(+t.dataset.i)));
  showMedia(0);

  /* ---- playful buy popup (no real cart in the demo) ---- */
  const LINES = [
    { t: "Not in this demo, honey \uD83D\uDC85", s: "These pieces aren\u2019t really for sale \u2014 this is a portfolio demo of the shop admin. But the button works, doesn\u2019t it?" },
    { t: "Oh, you wish \u2728", s: "There\u2019s no real checkout here \u2014 it\u2019s a demo. The admin behind it, though? Very real." },
    { t: "Window shopping only \uD83E\uDE9F", s: "This is a demo storefront. Nothing actually ships \u2014 but everything you see was built to." },
  ];
  function buyPopup(kind) {
    const NAV = [
      { t: "Just a peek 👀", s: "The rest of the storefront isn’t wired up — this is a demo of the shop admin, and the product page is the part worth showing off." },
      { t: "Dead end, darling 💃", s: "That link goes nowhere in the demo. Hit ‘Back to admin’ up top to keep poking around the real thing." },
    ];
    const set = kind === "nav" ? NAV : LINES;
    const pick = set[Math.floor(Math.random() * set.length)];
    const ov = document.createElement("div");
    ov.style.cssText = "position:fixed; inset:0; z-index:120; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(22,24,30,.5); -webkit-backdrop-filter:blur(5px); backdrop-filter:blur(5px); opacity:0; transition:opacity .2s;";
    ov.innerHTML = `<div role="dialog" aria-modal="true" style="max-width:400px; width:100%; background:var(--surface); border-radius:var(--r-lg); box-shadow:var(--sh-2); padding:26px; text-align:center;">
      <h2 style="margin:0 0 8px; font-size:var(--t-xl); font-weight:600;">${pick.t}</h2>
      <p style="margin:0 0 20px; color:var(--ink-muted); font-size:var(--t-base); line-height:1.55;">${pick.s}</p>
      <button class="btn btn--primary btn--block" id="buyClose">${kind === "nav" ? "Got it" : "Aw, okay"}</button></div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => { ov.style.opacity = "1"; });
    const close = () => { ov.style.opacity = "0"; setTimeout(() => ov.remove(), 200); };
    ov.querySelector("#buyClose").addEventListener("click", close);
    ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
  }
  const buy = document.getElementById("buyBtn");
  if (buy && !buy.disabled) buy.addEventListener("click", () => buyPopup("buy"));
  document.querySelectorAll("[data-nono]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); buyPopup("nav"); }));
})();
