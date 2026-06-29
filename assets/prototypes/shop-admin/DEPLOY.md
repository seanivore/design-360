# shop-admin — deploy handoff

A self-contained static demo of the Creator Portal admin, for the portfolio. Goal:
live at **`shop-admin.august.style`**, linked from a portfolio tile. No build step,
no server, no env vars.

## ✅ DEPLOYED — 2026-06-29
Live at **https://shop-admin.august.style** (waiting only on Cloudflare DNS propagation for the new record — Vercel side fully verified).

- **Vercel project:** `shop-admin` (`prj_m7AxxGKn9qx789SYhtHF4J4xRIkp`), team `seanivore`. Separate project from the main site.
- **Kept as a subdirectory** of `seanivore/design-360` (no fresh repo). Git-connected, **Root Directory** = `assets/prototypes/shop-admin`, framework **Other** (pure static, no build). Uses Vercel's documented Root-Directory mechanism; there is no nested-git/submodule issue here.
- **Production branch = `dev`** (Sean's default local branch). Push to `dev` → auto-deploys to the live domain. The main site project (`design-360`) is untouched (still prod-branch `design-360`).
- Created via the Vercel REST API (Root Directory isn't a plain CLI flag): `POST /v11/projects` (gitRepository + rootDirectory) → `PATCH /v9/projects/{id}/branch {"branch":"dev"}`. First production deploy READY + aliased to the domain.
- **DNS:** `august.style` is on Cloudflare nameservers and Vercel does NOT write through, so a CNAME `shop-admin → cname.vercel-dns.com` (proxy = DNS-only) was added directly in Cloudflare (zone `0d373063745d7f1265798c64b830f4fe`). New records on this zone are slow to propagate (Cloudflare-side, known for a few months); the record is correct and will go live shortly.
- **Verified Vercel-side via `curl --resolve` (bypassing DNS):** `/`, `/account`, `/products`, `/orders`, `/sales` → 200; `/index.html` → 308 (clean URLs working); bogus path → 404. `data.js` carries 11 products (matches "All 11"). Full visual/interactive pass (tab counts, Orders badge, CDN media, sign-in → reset) runs on the live domain once DNS resolves.
- Deployment protection = "all_except_custom_domains": the public custom domain is open; `*.vercel.app` previews are SSO-gated.

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

**SEAN INTERJECTION** 

  A necessary correction on both A and B options. Both of the subfolders that were deployed were standalone Vercel projects, however, that method does not work for our use case. 

  ### Subdirectory HTML Vercel Deployments 

  These projects do not indicate to me whether or not Subdirectory Vercel Deployments are a viable option for our prototype demo build. In fact, it might be that they weren't actually deployed from a subdirectory at all. Both projects seem to have been setup and deployed directly on Vercel by uploading code files but never connecting Git or a Github repository. Our prototype demo requires Git or Github repository deployment because of frequent debugging of functionality build iterations created in part to support the Everlastings website.

  **Job Specific Portfolio**
  The one-page site design is okay, but the content was superb for a job application by directly connecting each requirement to experience, one at a time, in a digestible way. 
  `https://vercel.com/seanivore/portfolio`
  `~/Development/get-paid/hunt/jesse_michels/portfolio/index.html`
  *Git is treating the directory as a submodule or a nested Git repository, rather than a normal folder.*

  **Merch Store Optimization Data & Assets**
  This one-page site design is beautiful and the content was just a creative, data-backed insight gift. 
  `https://vercel.com/seanivore/for-jesse`
  `~/Development/get-paid/hunt/jesse_michels/for-jesse/index.html`
  *For whatever reason, this one was not set up to be treated differently by Git.*

**END SEAN INTERJECTION** 

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

**SEAN ADDITION**

  This all just means that it is up to us from what directory the prototype demo is deployed from. I'd be curious if we can leave it as a sub-directory, but am wondering if Git treating it as a submodule or nested repository will influence this decision. If not we can always just create a fresh directory and repository -- if everything really is self-contained then I'm thinking that just moving this `prototypes` directory or even just the `shop-admin` directory, might actually be the simplest option, particularly since we can do any testing we want through Claude Design instead of having separate branches for this one. Curious what you think. Anyway, some additional information below. 

  1. Vercel CLI is logged and and updated. Please web search for the most up to date usage information and then use it as much as you can to set things up. Note that the MCP is typically not functional. 

  2. Vercel has access to the `august.style` domain. Subdomains are easily added as Vercel updates the DNS records on Cloudflare. 

  3. After deploying we will need to discuss how to add the URL to the main portfolio `/360-design/`; I'm imagining we need to add a value that creates an entry JSON sub-type where a click through of a content tile just redirects to `shop-admin.august.style` while allowing us to associate the URL with essentials for content tile display in /section, related project, and adding tagging allowing for homepage component placement.