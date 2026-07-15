# Standalone Directory

## Purpose

One-off sites that are **not** part of august.style and are **not** interactive prototypes — a client walkthrough, a handoff page, a microsite, a landing page for a single thing. Each gets its own subdomain and ships on its own.

The distinction from `assets/prototypes/`: a **prototype** is something a portfolio visitor *plays with* (the shop-admin Creator Portal demo). A **standalone** is something that simply *exists on its own domain* — you send someone a link, and it does its job. Both use the identical deploy mechanism described below.

## Current standalones

| Folder                      | Domain                                                         | What it is                                                                                                                                                                                         |
| --------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `everlastings-walkthrough/` | [everlastings.august.style](https://everlastings.august.style) | Twelve-part video walkthrough handing the Everlastings by Emaline store to its owner. Custom player: the spoken line renders under the video at pull-quote scale, with a click-to-seek transcript. |

---

## The pattern

**Its own Vercel project, rooted at a subdirectory of this repo, with `dev` as its production branch.**

That last part is the trick. Pushing to `dev` gives the *main site* a preview deploy and each *standalone* a production deploy, at the same time. The one-off ships from the integration branch on purpose — you never have to merge to `design-360` just to update a walkthrough page.

Consequences worth knowing:

- **To ship an update: change the files, commit, `git push origin dev`.** Nothing else, ever. No Vercel or DNS reconfiguration after the first setup.
- Each standalone folder holds a `vercel.json` (`cleanUrls`, `trailingSlash`) and **nothing else deploy-related** — no `package.json`, no `.vercel/`, no lockfile. Project, root directory, branch and domain all live account-side, not in the repo.
- A standalone is **static only**. If it needs a server, it doesn't belong here.

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

See `assets/entries/uid-cpd-101.json` (the shop-admin tile) for the shape.
