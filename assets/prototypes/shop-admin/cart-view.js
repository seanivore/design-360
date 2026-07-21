/* ============================================================================
   cart-view.js — shared cart line + order-summary rendering for the storefront
   (used by cart.html and checkout.html). Depends on AC (storefront.js).
   ============================================================================ */
(function () {
  "use strict";
  const ACView = (window.ACView = window.ACView || {});
  const money = AC.money;

  function lineHTML(l) {
    const pct = AC.salePct();
    const thumb = l.product.thumbnail || (l.product.images && l.product.images[0] && l.product.images[0].url) || "";
    const unitNow = pct ? AC.discountedCents(l.unit) : l.unit;
    const amt = pct
      ? `<span class="was">${money(l.unit * l.qty)}</span>${money(unitNow * l.qty)}`
      : money(l.unit * l.qty);
    return `<div class="lineitem" data-slug="${l.slug}">
      <a class="lineitem__media" href="product.html?slug=${encodeURIComponent(l.slug)}">${thumb ? `<img src="${thumb}" alt="" onerror="this.style.opacity=.15">` : ""}</a>
      <div>
        ${l.product.series ? `<div class="lineitem__series">${l.product.series}</div>` : ""}
        <a class="lineitem__title" href="product.html?slug=${encodeURIComponent(l.slug)}" style="color:inherit;">${l.product.title}</a>
        <div class="mono" style="font-size:.8rem;color:var(--ink-faint);margin-top:4px;">${money(unitNow)} each</div>
        <button class="lineitem__remove" data-remove="${l.slug}">Remove</button>
      </div>
      <div class="lineitem__right">
        <div class="qty qty--sm"><button data-dec="${l.slug}">–</button><input value="${l.qty}" readonly><button data-inc="${l.slug}">+</button></div>
        <div class="lineitem__amt">${amt}</div>
      </div>
    </div>`;
  }

  // The order summary block. opts.editable → show the promo control (cart + checkout).
  ACView.summaryHTML = function (comp, opts) {
    opts = opts || {};
    const applied = comp.kind === "code";
    const promo = applied
      ? `<div class="applied"><span>Code <b>${comp.coupon.code}</b> applied</span><button data-removecode>Remove</button></div>`
      : `<div class="promo"><input id="promoInput" placeholder="Discount code" value="${comp.code && !applied ? comp.code : ""}" autocomplete="off"><button class="btn btn--sm" id="promoApply">Apply</button></div>`;
    const issue = comp.codeIssue ? `<div class="hint" style="color:var(--clay-deep);">${comp.codeIssue}</div>` : "";
    const hintReplace = (!applied && comp.kind === "storewide")
      ? `<div class="hint">A studio sale is on. Have your own code? Enter it above — it replaces the sale.</div>` : "";

    return `
      <div class="sumrow"><span>Subtotal</span><span class="mono">${money(comp.subtotal)}</span></div>
      ${comp.discount > 0 ? `<div class="sumrow sumrow--sale"><span>${comp.label}</span><span class="mono">−${money(comp.discount)}</span></div>` : ""}
      <div class="sumrow"><span>Shipping</span><span class="mono">${comp.subtotal === 0 ? "—" : comp.freeShip ? "Free" : money(comp.shipping)}</span></div>
      <div class="sumrow"><span>Tax (est.)</span><span class="mono">${money(comp.tax)}</span></div>
      <div class="sumrow sumrow--total"><span>Total</span><span class="mono">${money(comp.total)}</span></div>
      ${opts.editable ? promo + issue + hintReplace : ""}`;
  };

  ACView.wireSummary = function (scope) {
    scope = scope || document;
    const apply = () => {
      const v = (scope.querySelector("#promoInput")?.value || "").trim();
      if (v) AC.setCode(v);
    };
    scope.querySelector("#promoApply")?.addEventListener("click", apply);
    scope.querySelector("#promoInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); apply(); } });
    scope.querySelector("[data-removecode]")?.addEventListener("click", () => AC.setCode(null));
  };

  ACView.wireLines = function (scope) {
    scope = scope || document;
    scope.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => AC.removeFromCart(b.dataset.remove)));
    scope.querySelectorAll("[data-inc]").forEach((b) => b.addEventListener("click", () => { const l = AC.cartLines().find((x) => x.slug === b.dataset.inc); AC.setQty(b.dataset.inc, (l ? l.qty : 1) + 1); }));
    scope.querySelectorAll("[data-dec]").forEach((b) => b.addEventListener("click", () => { const l = AC.cartLines().find((x) => x.slug === b.dataset.dec); AC.setQty(b.dataset.dec, (l ? l.qty : 1) - 1); }));
  };

  ACView.renderCart = function (root) {
    const comp = AC.compute();
    if (!comp.lines.length) {
      root.innerHTML = `<div class="empty"><h2>Your cart is empty</h2><p>Nothing in the bag yet.</p><p style="margin-top:20px;"><a class="btn" href="shop.html">Browse the shop</a></p></div>`;
      return;
    }
    root.innerHTML = `<div class="split">
      <div class="cartlines">${comp.lines.map(lineHTML).join("")}</div>
      <aside class="summary">
        <h3>Order summary</h3>
        ${ACView.summaryHTML(comp, { editable: true })}
        <a class="btn btn--clay btn--block" href="checkout.html" style="margin-top:18px;">Checkout</a>
        <a class="btn btn--ghost btn--block" href="shop.html" style="margin-top:10px;">Keep shopping</a>
        <div class="demo-note">Demo — no real payment is taken.</div>
      </aside>
    </div>`;
    ACView.wireLines(root);
    ACView.wireSummary(root);
  };
})();
