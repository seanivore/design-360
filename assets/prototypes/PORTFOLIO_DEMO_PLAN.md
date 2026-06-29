# Portfolio Demo — Plan of Attack (DECIDED)

A public, playable fork of the finished portal, for the portfolio. Visitors land on the
ribbon login, sign in with anything, get a friendly "you can't break this" welcome, then
browse + create + edit + delete across all four surfaces. Changes **stick for their
session**; signing out (or a new session) **resets to a polished seed**.

- **Deploy:** static files → `design-360 → assets/prototypes/shop-admin/` → Vercel →
  **`shop-admin.august.style`**. Portfolio tile links straight there.
- **Separate fork.** Nothing here touches `design-handoff/out/` (that stays the pure,
  unwired handoff). The demo is free to cheat: always-succeed login, hardcoded URLs, fake
  data, persistence.
- **Delivered as a zip** to unzip into `prototypes/shop-admin/`, same as the handoff.

---

## Entry flow

1. `index.html` → **`account.html`** signed-out → the ribbon login is the first thing seen.
2. Email pre-filled (`admin@design.shop`); **any** password (even empty) **always** signs in.
3. On sign-in → a **welcome modal**: "This is a live demo — do anything. Create, edit,
   delete, refund. Nothing here is real and nothing can break. Everything resets when you
   sign out or come back later." → dismiss → land on **Products**.
4. Changes persist for the session; **sign out resets** (and a new session starts fresh).

---

## What changes vs. the handoff (all decided)

1. **Session persistence layer** — a small store in `portal.js`: seed `sessionStorage` from
   `PORTAL_DATA` on first load; all four surfaces read/write through it so changes survive
   reload *and* carry between pages. sessionStorage (not local) = fresh each new session.
2. **Always-succeed login** — pre-filled `admin@design.shop`; any/empty password signs in;
   persists `signedIn`; lands on Products.
3. **Welcome / disclaimer modal** after sign-in (the "can't break anything, resets" message).
   Because the disclaimer carries the demo framing, the email stays branded (`@design.shop`).
4. **"DEMO" marker** — the env chip (top-right pill) + top strip relabel to **DEMO** (calm
   amber). It's the same component that said TEST in the handoff.
5. **Store-home links → real site** — the login home button + "View Site" (rail + Account
   card) → hardcoded `https://everlastingsbyemaline.com` (the live site you built, open in
   new tab). Drops the env-aware `siteUrl()` in the demo build.
6. **"↩ august.style" back-link** — a subtle link (login screen + Account) back to your
   portfolio apex.
7. **Reset = sign out** — the Account sign-out clears the session and returns to login; a
   small note reads "Signing out resets the demo." Natural session expiry resets too.
8. **Live activity log** — seed it fuller (grouped Today / Yesterday / dated), and **append a
   real entry on every demo action** (publish, stage edits, create/end sale, refund, mark
   shipped, archive) so a visitor sees their own actions recorded. Polished rows (action
   icon + account identicon + clean relative time).
9. **`vercel.json`** — `{ "cleanUrls": true, "trailingSlash": false }` (mirrors the
   design-360 pattern, minus the portfolio `_pages` rewrites). `/products`, `/orders`, etc.
   resolve clean; `/` → login. Stays pure static — no server, no build step.

---

## Product lineup (replaces the miniatures entirely)

**9 products across 3 types**, leaning on assets that already exist or are quick to make:

| #   | Type      | Product (working)         | Assets                                                            |
| --- | --------- | ------------------------- | ----------------------------------------------------------------- |
| 1   | `print`   | Art Nouveau poster        | your art-history collection (staged shots ready)                  |
| 2   | `print`   | Art Deco poster           | ready                                                             |
| 3   | `print`   | Bauhaus poster            | ready                                                             |
| 4   | `print`   | Ukiyo-e woodblock print   | ready                                                             |
| 5   | `apparel` | Graphic tee 01            | band-tee *style*, **new** design (not the DAO logo), model-staged |
| 6   | `apparel` | Graphic tee 02            | new, model-staged                                                 |
| 7   | `apparel` | Graphic tee 03            | new, model-staged                                                 |
| 8   | `merch`   | Canvas backpack (or tote) | new                                                               |
| 9   | `merch`   | Snapback cap              | new                                                               |

- **Drafts to show the publish gate:** seed **2 as drafts** — one `apparel` (e.g. tee 03,
  intentionally missing a required field) and one `print` (e.g. the woodblock, with only 3
  gallery images so the **≥5 gallery** red-ring shows). The rest seed **live/published**.
- The admin only models **one variant per product** (no sizes) — same as the real site — so
  apparel/merch are single-SKU here. That's fine for a visual demo.

**Orders — 6** (tripled): one multi-piece (a tee + a print), one with a partial refund
already done, two shipped/fulfilled, one unfulfilled (needs shipping → drives the Orders
blink), one just-paid. Anonymized fake customers + fake addresses (the one real address is
scrubbed).

**Sales:** keep a store-wide automatic sale + ~3 coupons (one percent, one $-off, one
piece-scoped to a couple products).

**Activity log:** ~8–10 seeded entries referencing the new products/orders, then live-appends.

---

## Assets & CDN

- Images live on **`cdn.august.style`** (R2). You generate → upload via the
  `POST https://www.august.style/api/upload` endpoint (file or URL + a `media/...` key →
  returns the CDN URL), per `design-360/assets/docs/ENTRY_SOP.md` §6.
- **Key convention** (so your uploads match the URLs baked into `data.js`):
  `media/shop-admin/<slug>/hero-<slug>.webp`, `…/gallery-<slug>-1.webp` … `-5.webp`,
  optional `…/share-<slug>.webp` and `…/vid-<slug>.mp4`.
- I bake those exact URLs into the demo `data.js` with placeholders; once you upload, they
  resolve live. Until then they show the graceful broken-image fallback (no layout break).

## Content split

- **Now:** I draft **`DEMO_PRODUCTS_ASSETS.md`** — *image/asset ideas + shot list + exact
  upload keys per product* (no marketing copy yet — you'll write/adjust copy once the images
  exist, since that's the easy part and follows whatever you actually make).
- **Later (you):** generate + upload the assets; tweak product copy. I wire everything in.

---

## Sequence

1. ✅ Lineup decided (above).
2. **I draft `DEMO_PRODUCTS_ASSETS.md`** (asset ideas + shot list + keys) → you start making
   + uploading assets.
3. **In parallel I build the fork:** persistence layer → login + welcome modal → URLs/DEMO
   chip/back-link → data rebuild (9 products incl. 2 drafts, 6 orders, coupons, log) →
   live-append activity log → `index.html` + `vercel.json`.
4. You drop assets in (CDN keys already wired); I verify all four surfaces + persistence +
   reset, then zip it.
5. You unzip into `prototypes/shop-admin/`, deploy to `shop-admin.august.style`, add the tile.
