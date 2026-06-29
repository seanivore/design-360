# CDN Media Upload Protocol

**Version**: 1.0.0 **Last Updated**: 2026-06-29 **Purpose**: How media gets onto an R2/Cloudflare CDN across projects — an optimize-then-store endpoint for images, direct S3-compatible `cp` for video, and the conventions/gotchas that keep object keys matching the URLs the app references. **Syncing**: One canonical copy, propagated to every project via `filemgmt` (see § *Syncing*).

This is the standalone protocol for the upload mechanics. It was carved out of `assets/docs/ENTRY_SOP.md` §5/§6 so it can travel to every project and not stay buried inside one repo's entry-authoring flow. The entry/collection authoring pipeline still lives in `ENTRY_SOP.md`; this doc owns only "how bytes get to the CDN."

---

## When to use

Any project that serves media from an R2 bucket fronted by a Cloudflare custom domain, using the two-path pattern below: a small upload **endpoint** that optimizes images, plus **direct S3-compatible upload** for everything the endpoint won't transform (video, large files, exact-byte assets). The august.style portfolio is the reference implementation; a client project runs the same architecture against a different bucket/domain.

The one rule that subsumes the rest: **the object key must exactly equal the path the app's code references after the host.** A file at `cdn.example.com/media/foo/bar.webp` must be stored under key `media/foo/bar.webp`. If a referenced asset is blank in the app, 95% of the time the key and the URL disagree — diff the failing URL (devtools Network tab) against the stored key and reconcile one of them.

---

## The model — two upload paths

- **Images → the upload endpoint** (`POST /api/upload`). It folds Cloudinary optimize + R2 put + Cloudinary cleanup into one call and returns the public URL. Use for any raw photo/render that should be downsized and served as WebP.
- **Video / exact-bytes → `aws s3 cp`** (S3-compatible, profile `r2`). The endpoint accepts `mp4` but does NOT transform it, so video uses the direct path. Also the path for anything you must store byte-for-byte or in bulk.

Decision: if it's a jpg/png/webp you want optimized → endpoint. If it's mp4, or bytes you must preserve exactly, or a bulk dump → `aws s3`.

---

## Path 1 — Images via the upload endpoint

The endpoint (`api/upload.ts`, a Vercel function) takes a source image by multipart **file** OR by public **https URL**, sends transformable types through Cloudinary (`c_limit,w_2400,h_2400,f_webp,q_auto` — aspect ratio preserved, only shrunk when larger, output WebP), PUTs the result to R2 at the key you supply, deletes the Cloudinary copy (free-tier hygiene), and returns `{ ok, url, key }`.

- **Auth**: `Authorization: Bearer ${UPLOAD_API_KEY}`.
- **Accepted input**: `multipart/form-data` with fields `file`, `key`, optional `skip_transform`; OR `application/json` `{ "url", "key", "skip_transform"? }`.
- **MIME allow-list**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`, `video/mp4`. Only jpeg/png/webp are sent through Cloudinary; **gif/svg/mp4 pass through byte-for-byte**.
- **Extension rewrite**: after a WebP transform the key's extension is rewritten to `.webp` (so a `.png` source uploaded under a `.png` (or `.webp`) key lands as `.webp`). Pass `.webp` keys explicitly to avoid ambiguity.
- **Key validation**: must start with `media/`; no `..`, no `//`; only `[a-zA-Z0-9._/-]`. Rejected otherwise.
- **Size cap**: 25 MB per file.
- **`skip_transform: true`**: bypass Cloudinary, upload bytes unchanged — for pre-sized images, already-good WebP, or transparent PNGs you must keep exact.
- **Production vs preview**: hit the **production** deployment so keys land where the app reads them. On a non-production (`VERCEL_ENV !== 'production'`) deployment the endpoint re-roots keys under `media/_preview/` so dev uploads never clobber production objects — useful for testing, wrong for a real upload.

Multipart (local file):

```bash
curl -sS -X POST https://www.august.style/api/upload \
  -H "Authorization: Bearer $UPLOAD_API_KEY" \
  -F "file=@/path/to/source.jpg" \
  -F "key=media/<scope>/<name>.webp"
# -> { "ok": true, "url": "https://cdn.august.style/media/<scope>/<name>.webp", "key": "..." }
```

JSON (by public URL — handy when the source is already hosted):

```bash
curl -sS -X POST https://www.august.style/api/upload \
  -H "Authorization: Bearer $UPLOAD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/source.png","key":"media/<scope>/<name>.webp"}'
```

Add `-F "skip_transform=true"` (multipart) or `"skip_transform": true` (JSON) to upload without the resize.

Bulk loop (every image in a folder, key mirrors filename with a `.webp` extension):

```bash
for f in dir/*.jpg dir/*.png; do
  stem="$(basename "${f%.*}")"
  curl -sS -X POST https://www.august.style/api/upload \
    -H "Authorization: Bearer $UPLOAD_API_KEY" \
    -F "file=@$f" -F "key=media/<scope>/$stem.webp"
done
```

---

## Path 2 — Video / exact-bytes via `aws s3`

The `r2` AWS CLI profile is pre-configured (access key + secret + endpoint). Upload **specific files**, not whole directories, when the directory also holds raw sources you do NOT want on the CDN — `aws s3 sync dir/` would push every file in it, including un-optimized jpgs.

```bash
aws s3 cp /path/to/video-<slug>.mp4 \
  s3://portfolio/media/<scope>/video-<slug>.mp4 \
  --endpoint-url https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com \
  --profile r2 --content-type video/mp4
```

`aws s3 sync dir/ s3://portfolio/media/<scope>/ --endpoint-url … --profile r2` is the right tool for a folder that contains ONLY finished assets (e.g. a processed gallery), and the documented fallback for bulk image upload if the endpoint is unavailable. Set `--content-type` for video so the CDN serves the right header.

---

## Conventions

- **Filenames / keys** mirror each other: `<role>-<slug>.<ext>` (e.g. `hero-<slug>.webp`) and `gallery-<slug>-<n>` with **un-padded** `n` (1, 2, … not 01). **No upper limit on gallery count** — upload every shot present.
- **`mp4` ⇒ a poster always exists.** Any video asset ships with a `poster-<slug>` still (the video's poster frame); treat a missing poster as an error, not an option.
- **Key ↔ URL exact match** is the whole game (see *When to use*). Build the key from the filename; let the endpoint's `.webp` rewrite handle the extension.
- **Net-new keys are safe**; re-uploading an existing key overwrites it. There is no destructive delete in the upload path.

---

## Verify

Cloudflare bot protection returns **403 to header-less `curl`/`python` GETs** even for valid objects — a plain `curl -I` will look like a failure when the object is fine. Always pass a browser `User-Agent` for any headless CDN check:

```bash
curl -sI -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36" \
  "https://cdn.august.style/media/<scope>/<name>.webp"
# Expect: HTTP/2 200, content-type image/webp   (or video/mp4 for a video)
```

A real browser serves these fine, so a quick open in the browser is also a valid check. If a URL 404s after upload, the put failed — re-upload that key; if it still 404s, surface it.

`assets/scripts/cdn_cleanup.py` is a **read-only** orphan reporter (lists R2 objects, diffs against URLs in local JSON, emits commented-out `aws s3 rm` lines for manual review) — never deletes on its own. Use it to find stale/extra objects after curation.

---

## Reference — august.style (current implementation)

- **Endpoint**: `https://www.august.style/api/upload` (production).
- **R2 bucket**: `portfolio`. **S3 endpoint**: `https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com`. **AWS CLI profile**: `r2`.
- **Public CDN host**: `https://cdn.august.style` (Cloudflare custom domain on the bucket).
- **Env vars** (in repo-root `.env` + Vercel Production/Preview): `UPLOAD_API_KEY`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `CLOUDINARY_URL` (`VERCEL_ENV` is set by Vercel). Set Vercel env vars foreground (`vercel env add NAME <env> --value X --force --yes`); piping via stdin or in a backgrounded task silently stores empty. CLI defaults to **Sensitive** (unreadable via `env pull`/dashboard) — add `--no-sensitive` if you need them readable.

**What changes per project**: the endpoint host, the bucket name + S3 endpoint, the public CDN host, the key scope prefix, and the env-var values. The mechanics (two paths, key rules, `.webp` rewrite, the bot-protection verify, `mp4 ⇒ poster`) are constant.

---

## Future direction

The upload endpoint will be upgraded — often from this repo, which has the cleanest copy of the architecture — to handle **all media types and transform variables** in one place (video transform, per-call sizing/format options), the way a client project on the same architecture already does. Until then, **video transform lives outside the endpoint** (the direct `aws s3` path), and image transform is fixed at `c_limit,w_2400,h_2400,f_webp,q_auto`. When that upgrade lands, fold Path 2's video step back into the endpoint here and bump this doc.

---

## Syncing

One canonical copy of this protocol; propagate edits to every project via `filemgmt`. Project-specific values (bucket, host, key prefix, env values) are NOT synced — those stay in each project's own `.env` and the *Reference* section is overwritten per project. Only the protocol itself syncs.
