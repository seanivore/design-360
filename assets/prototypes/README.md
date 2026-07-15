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

## Setting up a new one — the exact sequence

The full low-down can be read in `.agents/SHARED_REPO_SITE.md`

---

## Media

Anything heavy (video, posters, large images) goes on the CDN, not in the repo — see `.agents/CDN_GUIDE.md`.

- **Base:** `https://cdn.august.style/media/<name>/…`
- **Images** → `POST https://www.august.style/api/upload` (it optimizes and converts to webp).
- **Video** → straight to R2 with the `aws` CLI; the upload API does not touch video.

Two things that will bite you:

- **`AWS_REQUEST_CHECKSUM_CALCULATION=when_required` is load-bearing.** Newer AWS CLI versions add a CRC32 trailer that R2 rejects.
- **Nothing sets `Cache-Control` for you on the `aws` path** — pass `--cache-control "public, max-age=31536000, immutable"` yourself. And because those objects are then immutable-cached, **an update needs a new versioned key** (`-v2`), never an in-place overwrite.

`<video>` also wants **faststart**: recorders write the MP4 index (`moov`) *after* the video data, which forces a browser to download the whole file before the first frame appears. Fix it losslessly before uploading — this copies the streams and re-encodes nothing:

```sh
ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4
```

Captions (`.vtt`) are the exception to "media goes on the CDN": ship them **inside the site folder**. A cross-origin `<track>` needs CORS headers R2 does not send, and same-origin sidesteps the problem entirely.

---

## Portfolio tile

A standalone can be surfaced on august.style as a regular tile — add an entry with `"layout": "url"` and an `"external_url"`, then regenerate:

```sh
python3 generate_manifest.py
```

See `assets/entries/uid-cpd-101.json` (the shop-admin tile) for the shape. Skip this for anything unlisted — the Everlastings walkthrough is `noindex` and has no tile.
