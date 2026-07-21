# shop-admin — deploy handoff

A self-contained static demo: the **August & Co. Creator Portal** (a fork of the live
Everlastings `/admin`) **plus a spoofed August & Co. storefront**. Goal: live at
**`shop-admin.august.style`**, linked from a portfolio tile. No build step, no server, no env
vars, no Supabase, no Stripe.

## What this is
- Plain static files: `*.html`, `*.js`, `*.css`, `data.js`, `vercel.json`.
- Entry: `index.html` → `account.html` (sign-in). **Enter** (no credentials) → `products.html`.
  State lives in `sessionStorage` and resets each session. Nothing real, nothing can break.
- Admin = a **verbatim** copy of the live portal; all demo wiring is in `demo.js`
  (a `sessionStorage`-backed mock of `/api/*`). See `README.md` and `DEMO_FORK_CHANGES.md`.
- Storefront (`store/shop/product/cart/checkout/complete.html`) reads the same session store
  the admin writes; the checkout is a pretend flow that writes orders back into the admin.
- Product media is on `cdn.august.style` (see `CDN_UPLOAD.md`); the hero video/poster too.

## Deploy (matches how we've shipped little HTML things before)
1. Place this folder at `assets/prototypes/shop-admin/` in the design-360 repo.
2. `shop-admin.august.style` serves that folder (a Vercel rewrite/route in the portfolio
   project, or a small dedicated Vercel project rooted here).
3. `vercel.json` sets `cleanUrls`/`trailingSlash:false`, so `/products`, `/store`, `/cart`, …
   resolve and `/` → sign-in.
4. Push to `dev` to publish, same as the current prototype.

## Portfolio tile
Link straight to `https://shop-admin.august.style`. Angle: an interactive, playable
store-management portal redesign — create products, run sales, refund orders, then jump to the
storefront and watch it change. Everything resets.

## Verify after deploy
- `/` shows the ribbon sign-in with the **Enter** button; Enter → Products.
- Products tabs read **Live · Drafts · Archived · All** (no "Sold" tab); the sold-out Art Deco
  Poster sits under Live.
- Sales shows a **20% off** store-wide sale running + two coupon codes.
- **View Site** (rail) → the August & Co. storefront; hero video plays; prices show struck 20%.
- Add to cart → checkout → **Pay** → confirmation; the order then appears in admin **Orders**.
- Sign out → returns to sign-in and resets.

## Do NOT
- Wire a real backend, auth, or Stripe — deliberately faked. The real integration path is the
  separate `design-handoff/` package + its gap-review loop.
- Hand-edit the verbatim admin files beyond the patches documented in `DEMO_FORK_CHANGES.md`.
