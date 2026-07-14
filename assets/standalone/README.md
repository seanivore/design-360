# Standalone Directory

## Purpose

One-off sites that are **not** part of august.style and are **not** interactive prototypes — a client walkthrough, a handoff page, a microsite, a landing page for a single thing. Each gets its own subdomain and ships on its own.

The distinction from `assets/prototypes/`: a **prototype** is something a portfolio visitor *plays with* (the shop-admin Creator Portal demo). A **standalone** is something that simply *exists on its own domain* — you send someone a link, and it does its job. Both use the identical deploy mechanism described below.

## Current standalones

| Folder | Domain | What it is |
|---|---|---|
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

The shop-admin prototype was set up over the Vercel REST API in June 2026 and **the commands were never written down**, so this had to be reconstructed from the resulting settings. Don't let that happen again: if you deviate from this, update this file.

Substitute `<name>` throughout (e.g. `everlastings-walkthrough`). The Vercel **project name must be unique across the account** — if a client project already owns the obvious name, suffix it (the store is `everlastings`, so the walkthrough is `everlastings-walkthrough`). The **subdomain does not have to match the project name.**

### 0 · The files

```
assets/standalone/<name>/
  index.html
  vercel.json        →  { "cleanUrls": true, "trailingSlash": false }
  … everything else, static
```

### 1 · Token

The Vercel CLI already stores one; there's no need to mint another.

```sh
TOKEN=$(jq -r '.token' "$HOME/Library/Application Support/com.vercel.cli/auth.json")
```

Cloudflare's token is already exported in your shell as `$CLOUDFLARE_API_TOKEN` (see `~/.zshrc`).

### 2 · Create the project, git-linked and rooted at the subdirectory

`rootDirectory` and the git link both have to go in at **create** time — this is the one call that matters.

```sh
curl -s -X POST "https://api.vercel.com/v11/projects" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
    "name": "<name>",
    "framework": null,
    "rootDirectory": "assets/standalone/<name>",
    "gitRepository": { "type": "github", "repo": "seanivore/design-360" }
  }' | jq '{id, rootDirectory, productionBranch: .link.productionBranch}'
```

Keep the returned `id` (`prj_…`) for the next two calls.

### 3 · Move the production branch to `dev`

It defaults to `design-360` (the repo's default branch). **This is the step with a non-obvious endpoint** — `PATCH /v9/projects/{id}` rejects both `productionBranch` and `link` as unknown properties. The one that works:

```sh
curl -s -X PATCH "https://api.vercel.com/v1/projects/<prj_id>/branch" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"branch":"dev"}'
```

Confirm: `curl -s -H "Authorization: Bearer $TOKEN" "https://api.vercel.com/v9/projects/<prj_id>" | jq -r '.link.productionBranch'` → `dev`.

### 4 · Attach the domain

```sh
curl -s -X POST "https://api.vercel.com/v10/projects/<prj_id>/domains" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"<sub>.august.style"}' | jq '{name, verified}'
```

`august.style` is already on the Vercel account, so this comes back `verified: true` immediately. TLS provisions itself once DNS resolves.

### 5 · DNS — Cloudflare, **DNS-only**

The grey cloud is not optional. Proxying through Cloudflare in front of Vercel breaks certificate issuance.

```sh
ZONE=$(curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones?name=august.style" | jq -r '.result[0].id')

curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"type":"CNAME","name":"<sub>","content":"cname.vercel-dns.com","proxied":false,"ttl":1,
       "comment":"<name> standalone (Vercel)"}' | jq '.success, .result.name'
```

### 6 · Ship it

```sh
git add assets/standalone/<name> && git commit && git push origin dev
```

### 7 · Verify

```sh
dig +short <sub>.august.style          # → cname.vercel-dns.com. + two A records
curl -sI https://<sub>.august.style | head -1
```

Propagation is usually under a minute. If the domain 404s but the deployment is green, the production branch is still `design-360` — go back to step 3.

---

## Media

Anything heavy (video, posters, large images) goes on the CDN, not in the repo — see `.agents/CDN_GUIDE.md` and the worked example in `assets/prototypes/shop-admin/CDN_UPLOAD.md`.

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

## Portfolio tile (optional)

A standalone can be surfaced on august.style as a regular tile — add an entry with `"layout": "url"` and an `"external_url"`, then regenerate:

```sh
python3 generate_manifest.py
```

See `assets/entries/uid-cpd-101.json` (the shop-admin tile) for the shape. Skip this for anything unlisted — the Everlastings walkthrough is `noindex` and has no tile.
