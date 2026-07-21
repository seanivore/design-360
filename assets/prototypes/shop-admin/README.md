# August & Co. — Creator Portal + storefront (portfolio demo)

**Version: v1.3 — 2026-07-21.** Bump this (and the line below it) whenever a packaged copy
leaves this repo, so a deployed folder can always be matched to its source.

- **v1.3** (2026-07-21) — hero ghost-button hover unified with the primary (solid gold, no ring).
- **v1.2** (2026-07-21) — share cards: OG/Twitter meta + CDN thumbnail on all 11 pages;
  verbatim admin pages retitled from Everlastings to August & Co.
- **v1.1** (2026-07-21) — storefront→admin links skip the login (`?enter=1`); admin "DEMO"
  chip/strip became "Visit the storefront" doors; eyeball preview opens same-tab; welcome
  modal retired; brand wordmark tightened; mobile polish (product rows, shop grid, PDP, hero).
- **v1.0** (2026-07-21) — first deploy: admin re-forked to live v4.2.0 + August & Co.
  storefront, mid-century palette, 20% studio sale.

A public, playable demo. Visitors land on the portal **sign-in**, tap **Enter** (no
credentials — nothing here is real), and manage a fictional shop across **Products, Orders,
Sales, Account** — then hit **View Site** to see the **August & Co.** storefront update with
what they did. A pretend checkout writes orders back into the portal's Orders queue.

- **Entry:** `index.html` → `account.html` (Enter) → `products.html`.
- **Two halves, one deploy:** the **admin portal** (`products/orders/sales/account.html`) and
  the spoofed **storefront** (`store/shop/product/cart/checkout/complete.html`).
- **Persistence:** everything lives in `sessionStorage` and **resets** on sign-out / new
  session. No server, no build step, no auth, no Stripe — deliberately faked.
- **Store-wide sale:** ships with a **20% off** sale running, so the struck-price behaviour is
  visible everywhere out of the box.

## How it's built (important)
This is a **fork of the live Everlastings `/admin`** (v4.2.0). The admin JS/HTML/CSS are copied
**verbatim**; all demo behaviour is confined to **`demo.js`** (a client-side mock of `/api/*`
over `sessionStorage`) plus a login fork. **See `DEMO_FORK_CHANGES.md`** for the full change
list and the re-fork runbook. Don't hand-edit the copied admin files except the documented
patches.

## Files
**Admin (verbatim from live + the seam):**
- `products/orders/sales.html` + `-app.js`, `portal.js`, `portal.css` — copied verbatim.
- `account.html` / `account-app.js` — login **forked** (Enter button, demo copy, corner links).
- `demo.js` — the mock backend + `PORTAL.boot/env/siteUrl/authHeader` overrides + session store.
- `data.js` — the seed demo dataset (products, orders, coupons, 20% store-wide sale, activity).

**Storefront (spoof, self-contained):**
- `store.html` (home + hero video), `shop.html`, `product.html`, `cart.html`, `checkout.html`,
  `complete.html`.
- `storefront.css`, `storefront.js`, `cart-view.js`.

**Shell:** `index.html` (→ sign-in), `vercel.json` (clean URLs).

## Assets
- Product media loads from `cdn.august.style/media/shop-admin/<slug>/…` (see `CDN_UPLOAD.md`);
  broken images fall back gracefully.
- Storefront hero: `cdn.august.style/media/shop-admin/prototype-home-hero-admin.mp4` (+ `.webp`
  poster).
- Two archived Everlastings dioramas load from the legacy Everlastings CDN — no upload needed.
