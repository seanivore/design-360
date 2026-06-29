# shop-admin — deploy handoff

A self-contained static demo of the Creator Portal admin, for the portfolio. Goal:
live at **`shop-admin.august.style`**, linked from a portfolio tile. No build step,
no server, no env vars.

## What this is
- Plain static files: `*.html`, `*.js`, `portal.css`, `data.js`, `vercel.json`.
- Entry: `index.html` → `account.html` (sign-in). Any email/password signs in;
  state lives in `sessionStorage` and resets each session (see `PORTAL.store` in
  `portal.js`). Nothing real, nothing can break — that's intended.
- All product media is already live on `cdn.august.style` (see `CDN_URLS.md` /
  `CDN_UPLOAD.md`). Two archived dioramas load from the Everlastings dev CDN.
- Background/context: see `README.md` here, and the design handoff in
  `design-handoff/` (the unwired source package this demo was forked from).

## Deploy options (pick one)
**A — subfolder of the portfolio repo (matches how we've shipped little HTML things before):**
1. Place this folder at `assets/prototypes/shop-admin/` in the portfolio repo.
2. Map `shop-admin.august.style` to serve that folder — either a Vercel rewrite/route
   in the portfolio project, or a small dedicated Vercel project rooted at this folder.
3. `vercel.json` here already sets `cleanUrls: true`, `trailingSlash: false`, so
   `/products`, `/orders`, `/sales`, `/account` resolve and `/` → sign-in.

**B — standalone Vercel project:** point a new project at this folder as its root,
add the `shop-admin.august.style` domain. Nothing else to configure.

## Portfolio tile
Add an entry that links straight to `https://shop-admin.august.style`. Copy angle:
an interactive, playable admin-panel redesign — visitors can create, edit, sell,
refund, run sales; everything resets. (A separate post covers the real client site
and its Custom-GPT management flow.)

## Verify after deploy
- `/` shows the ribbon sign-in; any credentials → welcome modal → Products.
- Product thumbnails + the 3 videos load (they're on the live CDN).
- Tabs read Live 7 · Drafts 1 · Sold 1 · Archived 2 · All 11; Orders badge = 2.
- Sign out → returns to sign-in and resets.

## Do NOT
- Wire a real backend, auth, or Stripe — this is a demo fork, deliberately faked.
  The real integration path is the `design-handoff/` package + its gap-review loop,
  which is entirely separate from this folder.
