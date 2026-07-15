# everlastings-walkthrough — deploy record

A twelve-part video walkthrough handing the Everlastings by Emaline store to its owner.
**Live at https://everlastings.august.style.**

## ✅ Already deployed & wired (set up 2026-07-14)

Fully set up. To ship an update: **change the files, commit, push to `dev`** — it auto-redeploys. No Vercel or DNS reconfiguration is ever needed again.

|                       |                                                                                   |
| --------------------- | --------------------------------------------------------------------------------- |
| Vercel project        | `everlastings-walkthrough` — `prj_cAw9pB8Ek17KVR0wp3xudIYLDkHM`                   |
| Git                   | `seanivore/design-360`                                                            |
| Root Directory        | `assets/standalone/everlastings-walkthrough`                                      |
| Framework             | Other — pure static, no build step, no `package.json`                             |
| **Production branch** | **`dev`** (moved off the `design-360` default)                                    |
| Domain                | `everlastings.august.style`                                                       |
| DNS                   | Cloudflare `CNAME everlastings → cname.vercel-dns.com`, **DNS-only / grey cloud** |

The project name is `everlastings-walkthrough` rather than `everlastings` because the client's store already owns that name on the account. The subdomain is still plain `everlastings`.

The exact API calls used are in [`../README.md`](../README.md). The one worth remembering: the production branch can **only** be moved with `PATCH /v1/projects/{id}/branch` — `PATCH /v9/projects/{id}` rejects both `productionBranch` and `link` as unknown properties.

---

## Media

Video and posters live on the CDN; captions live **in this folder** (a cross-origin `<track>` needs CORS headers R2 does not send).

```
https://cdn.august.style/media/everlastings-walkthrough/using-your-website-01.mp4 … -12.mp4
https://cdn.august.style/media/everlastings-walkthrough/poster-01.webp            … -12.webp
```

Twelve films, 1920×1080, ~1.5 Mbps, **173.6 MB total** — R2 charges nothing for egress, so playback bandwidth is free.

### How they were uploaded

Sources staged in the *everlastings* repo at `assets/.cdn-media/walkthrough-videos/` (gitignored). Every file was **faststart-remuxed first** — as recorded, all 12 had the MP4 index (`moov`) written *after* the video data, which forces a browser to download the entire file before showing frame one:

```sh
ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4     # lossless, copies streams
```

Then straight to R2 with credentials from `360-design/.env`:

```sh
export AWS_ACCESS_KEY_ID=$R2_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$R2_SECRET_ACCESS_KEY \
       AWS_DEFAULT_REGION=auto AWS_REQUEST_CHECKSUM_CALCULATION=when_required

aws s3 cp using-your-website-01.mp4 \
  s3://portfolio/media/everlastings-walkthrough/using-your-website-01.mp4 \
  --endpoint-url "https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com" \
  --content-type video/mp4 --cache-control "public, max-age=31536000, immutable"
```

`AWS_REQUEST_CHECKSUM_CALCULATION=when_required` is load-bearing — the newer AWS CLI otherwise adds a CRC32 trailer R2 rejects. Posters are the same call with `--content-type image/webp`.

**Objects are immutable-cached for a year.** To replace a film, upload under a **new versioned key** (`using-your-website-01-v2.mp4`) and point `videos.js` at it. An in-place overwrite will keep serving the old bytes.

### Captions

Source `.srt` files converted to WebVTT — prepend `WEBVTT`, and swap the `,` decimal separator for a `.`:

```
00:00:00,000 --> 00:00:06,240      →      00:00:00.000 --> 00:00:06.240
```

Vercel serves them as `text/vtt`, which `<track>` requires.

---

## The files

| File              | What it does                                                                           |
| ----------------- | -------------------------------------------------------------------------------------- |
| `index.html`      | Masthead → dark plum theater band → the spoken line → twelve episode rows in four arcs |
| `walkthrough.css` | Everlastings palette + Cormorant Garamond. The theater is the page's only dark surface |
| `walkthrough.js`  | VTT parsing, cue lookup, click-to-seek transcript, `#n` deep links, per-film resume    |
| `videos.js`       | The manifest — titles, blurbs, CDN URLs, ffprobe-exact durations                       |
| `captions/`       | Twelve `.vtt` tracks, same-origin on purpose                                           |
| `vercel.json`     | `cleanUrls`, `trailingSlash` — the only deploy-relevant file in the folder             |

### Two things that were subtly wrong and are worth not re-introducing

- **Cue `end` times parsed as `NaN`.** Splitting `00:00:00.000 --> 00:00:06.240` on the arrow leaves a *leading space* on the right half, so `split(/\s+/)[0]` was the empty string. With `end` as `NaN`, every `t >= cue.end` comparison was false and the caption lookup returned the wrong line. Trim before splitting.
- **The active cue is the last one that has *started*, not the one whose span contains `t`.** These are auto-transcribed, so consecutive cues have sub-second gaps; honouring `end` strictly blinks the line away between her breaths.

### Adding or reordering films

Edit `videos.js` only. Titles, blurbs, section grouping, order and durations all come from there; the page builds itself off it. Get `duration` from `ffprobe` rather than eyeballing it — the resume/watched logic reads it.
