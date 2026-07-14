# shop-admin — deploy handoff

A self-contained static demo of the Creator Portal admin, for the portfolio.
**Live at https://shop-admin.august.style.**

## ✅ Already deployed & wired (set up 2026-06-29)
This is fully set up. To ship an update you just **replace this folder's contents, commit, and
push to `dev`** — it auto-redeploys. No Vercel or DNS reconfiguration is ever needed again.

- **Own Vercel project** `shop-admin` (`prj_m7AxxGKn9qx789SYhtHF4J4xRIkp`, team `seanivore`) —
  separate from the main august.style site.
- **Git-connected** to `seanivore/design-360`, **Root Directory** = `assets/prototypes/shop-admin`,
  framework **Other** (pure static, no build step). Lives as a subdirectory of the portfolio repo.
- **Production branch = `dev`** → pushing to `dev` auto-deploys to the live domain. The main
  site project (`design-360`) is untouched.
- **Domain** `shop-admin.august.style` attached + TLS auto-provisioned. DNS is a Cloudflare
  CNAME `shop-admin → cname.vercel-dns.com` (proxy = DNS-only). New records on this Cloudflare
  zone can take a few minutes to propagate — that's normal, not a misconfig.
- **The one deploy-critical file is `vercel.json`** (`cleanUrls: true`, `trailingSlash: false`).
  Keep it in every export — it's what makes `/products`, `/orders`, `/sales`, `/account` resolve
  and `/` → sign-in. **No other config files are required** (the project, root directory, branch,
  domain, and cert are all account-side settings, already done).

## What this is
- Plain static files: `*.html`, `*.js`, `portal.css`, `data.js`, `vercel.json`.
- Entry: `index.html` → `account.html` (sign-in). Any email/password signs in; state lives in
  `sessionStorage` and resets each session (see `PORTAL.store` in `portal.js`). Nothing real,
  nothing can break — that's intended.
- Product media loads from `cdn.august.style/media/shop-admin/…`. Two archived dioramas load
  from the Everlastings dev CDN.
- Surfaces: Products, Orders, Sales, Account, and Preview (`preview.html`).

## Portfolio tile (still TODO — on the main site, not this folder)
Add an entry on august.style that links straight to `https://shop-admin.august.style` — an
interactive, playable admin-panel redesign (create, edit, refund, run sales; everything resets).
This lands in the main site (deploys from `design-360`), so it's tracked separately from here.

## Verify after deploy
- `/` shows the ribbon sign-in; any credentials → "you can't break this" modal → Products.
- Product thumbnails + videos load (live CDN).
- Tabs read **Live 8 · Drafts 1 · Archived 2 · All 11** — there is **no "Sold" tab**; sold-out
  items appear under **Live** with a "Sold out" pill (buy disabled). **Orders badge = 2**.
- Sign out → returns to sign-in and resets.

## Do NOT
- Wire a real backend, auth, or Stripe — this is a demo fork, deliberately faked. The real
  integration path is a separate design-handoff package + its gap-review loop, entirely
  separate from this folder.
