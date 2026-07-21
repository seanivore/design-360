# DEMO_FORK_CHANGES.md

**What this is:** the record of every change that turns the *live* Everlastings Content
Creator Portal (`github.com/seanivore/everlastings` → `/admin`, currently **v4.2.0**) into
this public, playable **August & Co.** portfolio demo — plus a runbook for re-forking when
the live admin advances again.

**Guiding principle — one seam.** The live admin's JS / HTML / CSS are copied **verbatim**.
All demo behaviour lives in **one added file, `demo.js`**, plus a small login fork. That keeps
the demo faithful (true feature parity) and makes the *next* re-fork a copy-paste job.

**Two session stores (both `sessionStorage`, reset each visit):**
- `augCoDemo.v1` — the admin's world (products, orders, coupons, store-wide sale, sign-in).
  Written by `demo.js` (admin) **and** by the storefront checkout.
- `augCoCart.v1` — the shopper's cart + entered code.

---

## A. Admin re-fork (live `/admin` → demo)

| # | Change | Why | Files |
|---|--------|-----|-------|
| A1 | **Client-side mock backend + boot/env/siteUrl/authHeader overrides** | No server, Supabase, Stripe or real auth in a static demo | **`demo.js`** (new). Intercepts `fetch("/api/*")` and answers from `augCoDemo.v1`, matching the live request/response shapes. Overrides `PORTAL.boot` (session from the store; gate → `account.html`), `PORTAL.env`→`Demo`, `PORTAL.siteUrl`→`store.html`, `PORTAL.authHeader`→`{}`. Adds `PORTAL.store` and `.logActivity`. *(The one-time welcome modal was retired once the login screen took over its message.)* |
| A2 | **Script load order** | Insert the seam; drop the Supabase CDN | Every admin `*.html`: removed `<script src="…supabase-js@2">`; load is now `data.js → portal.js → **demo.js** → <surface>-app.js`. |
| A3 | **Login page fork** | No credentials — one obvious ENTER button; corner links | `account.html` + `account-app.js`. Signed-out view: removed email/password, added ENTER button + demo copy, **august.style** (top-left) + **Visit the store** (bottom-left) corner links. Sign-out → `PORTAL.store.reset()`. **Ribbon-canvas FX, signed-in view, spec card, activity log kept verbatim from live.** |
| A4 | **Removed the "Sold" tab** | Demo sells *restockable* goods (posters, tees, caps — qty can be many); a sold-out piece is a temporary stock state, not a lifecycle bucket. It stays under **Live**, labelled "Sold out." *(Everlastings' one-of-a-kind dioramas legitimately keep the Sold tab in live `/admin`.)* | `products-app.js` — `TABS` minus `sold`; `inTab("live")` folds the `sold` state in. Search the file for `DEMO FORK: no "Sold" tab`. |
| A5 | **Demo dataset** | Portfolio-relevant catalog, not the client's dioramas | `data.js` — art prints / apparel / goods, fake orders + coupons, `storeWideSale` **active 20%** by default, `config.siteUrl → shop-admin.august.style`. Two archived Everlastings dioramas kept as examples (legacy CDN). *This file is intentionally demo-only; live loads from Supabase.* |
| A6 | **"View Site" → the spoofed storefront** | Let visitors go see what they made | `PORTAL.siteUrl()` returns `store.html` (A1). The rail + Account both use it; `demo.js` wraps `mountShell` to strip `target="_blank"` so it navigates **in-tab** (the storefront's "Manage store" pill returns). |
| A7 | **Storefront routes are query-param + previews open same-tab** | Live builds `siteUrl()/product/<slug>` URLs in a new tab; the demo routes by `product.html?slug=` and sandboxed previews block `window.open` | `products-app.js` — `openPreviewTab` (same-tab, query-param) + copy-link. Search for `DEMO FORK`. |

## B. Storefront spoof (new — no live equivalent runs statically)

The live storefront is Supabase + Stripe driven, so it can't run as static files. The demo
storefront **reuses the visual language** but is a lean, self-contained spoof.

| # | Item | Files |
|---|------|-------|
| B1 | Editorial **August & Co.** design system (cream / charcoal / rust, Instrument Serif + Hanken Grotesk + Space Mono) | `storefront.css` |
| B2 | Data layer + chrome + cart + sale/coupon math | `storefront.js` — reads the **same `augCoDemo.v1`** the admin writes (create/edit/discount in the admin → shows here), falls back to `data.js` seed. |
| B3 | Shared cart-line + order-summary rendering | `cart-view.js` |
| B4 | Pages | `store.html` (home + hero video), `shop.html` (grid + type filters), `product.html` (gallery + buy panel + admin **preview→publish** banner), `cart.html`, `checkout.html`, `complete.html` |
| B5 | **Sale demo** | Store-wide % **auto-applies** (struck prices sitewide + a top utility bar, no code). A shopper's entered code **replaces** the sale; ineligible codes (min-order / product-scope) explain themselves and fall back to the sale. |
| B6 | **Pretend checkout writes back** | On "Pay", `checkout.html` writes per-piece order rows (real discounted amounts) into `augCoDemo.v1` → the order appears in the admin **Orders** queue and bumps the nav badge. No Stripe, no charge. |
| B7 | **Hero media (CDN)** | `store.html` → `https://cdn.august.style/media/shop-admin/mid-century-modern-hero-anim-slow.mp4` (+ `mid-century-modern-hero-anim-poster.webp` poster, 900×720 / 5:4). |
| B8 | **Palette** | Sampled from the mid-century hero footage: warm cream ground, cool charcoal ink, **burnt ember `#C2703F`** primary (links, brand “&”, prices), **slate blue `#46586A`** secondary (salebar, hero lede, ghost hover, coupon chip), **goldenrod `#D5A021`** highlight (button hover, sale badges, rules, footer caps). |

## C. Entry flow
`index.html` → `account.html` (login) → **Enter** → `products.html`. From the admin, **View
Site** → `store.html`; from the storefront, **Manage store** → `products.html`.

---

## Re-fork runbook (when live `/admin` advances)

1. **Copy verbatim** from `everlastings@main`: `admin/products.html`, `products-app.js`,
   `orders.html`, `orders-app.js`, `sales.html`, `sales-app.js`, `portal.js`, `portal.css`.
2. In each copied `*.html`: delete the `@supabase/supabase-js` `<script>` and insert
   `<script src="demo.js"></script>` immediately after `portal.js` (see A2).
3. Re-apply **A4** (Sold-tab patch) to `products-app.js`.
4. Re-fork the login (**A3**) — diff `account-app.js` against the new live version, keep the
   signed-out block + sign-out override, take everything else from live.
5. **Audit `demo.js` coverage:** `grep 'fetch("/api' admin app JS` in the new live code and
   confirm every endpoint + response field the app consumes is handled by the mock router in
   `demo.js`. Add any new ones.
6. Keep `data.js`, `demo.js`, `storefront.css/js`, `cart-view.js`, and the storefront `*.html`
   as-is (only touch `data.js` to add/adjust demo products).
7. Bump `PORTAL.BUILD.version` note if you want the Account page to show the new version.

**Endpoints the mock currently implements** (`demo.js`): `GET/POST/PUT /api/products`,
`?_action=publish|discard|archive|unarchive|activity|coupon|coupon_deactivate`,
`/api/products/archive|unarchive` (path form), `GET /api/orders` (+ `?status=needs_shipping`,
`?payment_intent=`, `?_action=seen`), `PATCH /api/orders/:id`, `POST /api/orders/:id/refund`,
`/api/orders/:id/cancel_shipment`, `GET/POST /api/upload`, `GET /api/config`.
