# August & Co. — Creator Portal + storefront (portfolio demo)

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
