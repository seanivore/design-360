# Creator Portal — interactive demo (portfolio)

A public, playable demo fork of the Creator Portal admin design. Visitors land on the
sign-in screen, sign in with **any** email/password, get a "you can't break this" welcome,
then create / edit / delete across Products, Orders, Sales, and Account.

- **Entry:** `index.html` → `account.html` (the sign-in). Sign in → lands on Products.
- **Persistence:** all changes are kept in `sessionStorage` for the visit and **reset** on
  sign-out or a new session (see `PORTAL.store` in `portal.js`).
- **Pure static** — no server, no build step. `vercel.json` enables clean URLs.
- **Store-home / View Site** links point at the real site (`everlastingsbyemaline.com`);
  a back-link returns to `august.style`.
- **Demo, not the handoff.** This is a separate fork from `design-handoff/out/` (the
  unwired design package). It deliberately fakes auth, hardcodes URLs, and ships demo data.

## Files
- `index.html` — redirect to the sign-in.
- `account.html` / `account-app.js` — sign-in + account (activity log, reset).
- `products.html`, `orders.html`, `sales.html` (+ `-app.js`) — the three other surfaces.
- `portal.css` — design system. `portal.js` — shared shell, helpers, session store.
- `data.js` — the seed demo dataset (products, orders, coupons, activity log).
- `vercel.json` — `cleanUrls` static config.

## Assets
Product images load from `cdn.august.style/media/shop-admin/<slug>/…`. Until those are
uploaded, broken images fall back gracefully (no layout break).
