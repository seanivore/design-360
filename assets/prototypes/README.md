# Prototypes Directory

## Purpose

Space for self-contained prototypes that demonstrate to portfolio visitors the ability to use, interact with, and really feel the user design and thought that goes into developing features and functionality for various digital platforms; its hands-on value. 

**Sibling directory:** [`assets/standalone/`](../standalone/README.md) — one-off sites that simply *live on their own subdomain* (a client walkthrough, a handoff page, a microsite) rather than being something a visitor plays with. **Both use the identical deploy mechanism**, written out below.

## Current Prototypes

  1. Creator Portal
  -> `assets/prototypes/shop-admin/` 
  
  - Our first entry that triggered prototype directory creation
  - Adding some minimal use of the Thot app would be interesting 
  - LLM chat control of online store management 
  - Future home for retired or resurrected websites 

---

## 1. Creator Portal

The `assets/prototypes/shop-admin/` directory houses a completely self-contained version of an online shop's administration pages. It is completely gated so that visitors and play around, create whatever they want without having to clean up or worry about breaking anything. 

  - Design was ideated using a swarm of sub-agents assigned research and review roles 
  - Best work was chosen by passing gates down through the design "funnel" 

Created initially for a client website, `everlastingsbyemaline.com`, where majority of the extensive functionality and design polish was done specifically to create a portfolio item showcasing the use of new AI technologies. 

  - Planning, building, and testing took **one day** using Claude Design
  - It was built to specification using real data from the live site
  - Implementation can take many days of robust reviews to identify bugs before build execution

Preparing the portal as a demo prototype took just a few additional hours in Claude Design, then deployed by Claude Code, before being added as a tile in the portfolio at `august.style`. 

Live at **[shop-admin.august.style](https://shop-admin.august.style)**; its own deploy record is in [`shop-admin/DEPLOY.md`](shop-admin/DEPLOY.md).

---

## How these get deployed

**Its own Vercel project, rooted at this subdirectory of the portfolio repo, with `dev` as its production branch.**

That last part is the trick, and it is easy to miss. Pushing to `dev` gives the *main site* a preview deploy and each *prototype* a production deploy, at the same time. The one-off ships from the integration branch on purpose — so you never have to merge to `design-360` just to update a demo.

- **To ship an update: change the files, commit, `git push origin dev`.** Nothing else, ever.
- The folder holds a `vercel.json` (`cleanUrls`, `trailingSlash`) and **nothing else deploy-related** — no `package.json`, no `.vercel/`, no lockfile. Project, root directory, branch and domain all live account-side, not in the repo.

**The full step-by-step for setting up a new one — the actual API calls — lives in [`../standalone/README.md`](../standalone/README.md).** It applies verbatim here; just use `assets/prototypes/<name>` as the root directory instead of `assets/standalone/<name>`. It had to be reconstructed once, because shop-admin was created over the Vercel REST API and the commands were never written down. Don't repeat that.

The one step that is genuinely non-obvious: **moving the production branch to `dev`.** `PATCH /v9/projects/{id}` rejects both `productionBranch` and `link` as unknown properties. The endpoint that works is:

```sh
curl -s -X PATCH "https://api.vercel.com/v1/projects/<prj_id>/branch" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"branch":"dev"}'
```

And in Cloudflare the CNAME must be **DNS-only (grey cloud)** — proxying in front of Vercel breaks certificate issuance.

## Media

Heavy assets go on the CDN at `https://cdn.august.style/media/<name>/…`, never in the repo. Images through `POST https://www.august.style/api/upload`; video straight to R2 with the `aws` CLI. See `.agents/CDN_GUIDE.md`, the worked example in [`shop-admin/CDN_UPLOAD.md`](shop-admin/CDN_UPLOAD.md), and the gotchas collected in the standalone README (the checksum env var, `Cache-Control`, immutable keys, and MP4 faststart).

---
*Prototype demos available since 2026-06-29 · standalone siblings since 2026-07-14*
