# GitHub-as-Origin + Free Proxy CDN Guide

Use GitHub as the origin; deliver via a free GitHub-proxy CDN. GitHub is storage, CDN is global cache.

## Why this works
- Public GitHub files are fetchable.
- Proxy CDNs cache them at the edge.
- You get fast, free delivery with versioned assets.

## Folder strategy (repo(s) dedicated to media)
- repos: `design-360-media-web`, `design-360-media-print`, etc.
- path: `assets/media/{section}/{subsection}/{slug}/`
- commit only optimized WebP/AVIF; keep JPEG fallbacks if needed.

## URL strategy
- Store CDN-proxy URLs in your manifest/JSON.
- Example shape:
  - `https://cdn-proxy.example.com/seanivore/design-360-media-web/refs/heads/main/assets/media/web/html-css-js/slug/hero@1440.avif`
- Treat filenames as immutable (new filename = new version).

## Rendering pattern
- Use `<picture>` with AVIF → WebP → JPEG fallback.
- Add `srcset` (480w, 960w, 1440w, 1920w) + `sizes` tuned to your CSS grid.
- Add `loading="lazy"` (except first hero), `decoding="async"`.
- For slideshows: prefetch the next image’s smallest variant.

## Controller integration (fits your hybrid routing)
- `data-loader.js`: read image arrays from manifest (CDN URLs).
- `tile-renderer.js` / `entry-controller.js`: build `<picture>` from provided variants; do not compute URLs on the fly if you can avoid it.
- Keep alt text populated (`thumb_slideshow_alt_text`, `page_image_group_alt_text`).

## Performance guardrails
- Thumbs: ~60–150 KB. Detail: ~200–400 KB.
- Hard cap per file: ~600 KB.
- Precommit/CI check: fail on oversize.
- No query-string cache busting; use new filenames.

## Repo hygiene
- Media in separate repos from your Pages code.
- Avoid Git LFS for public web assets.
- Batch adds via scripts; keep histories shallow (no RAWs).

## Optional provenance (web3, no marketplaces)
- Upload identical files to IPFS/Arweave; record URIs + hashes.
- Mint Solana compressed NFTs (cheap) from the same metadata.
- Add `provenance` to manifest: mint address + storage URI.
- Display a small “Provenance” badge linking to a neutral explorer.

## Migration steps (quick)
1. Create media repos; mirror your section/subsection/slug structure.
2. Batch-convert to AVIF/WebP; emit 480/960/1440/1920 variants.
3. Push; copy CDN-proxy URLs.
4. Update manifest `thumbnail_images` and `page_imagery`.
5. Deploy; verify tiles and entry pages in your existing SPA flow.

## Troubleshooting
- 404s: check exact paths and branch refs.
- Mixed content: ensure HTTPS everywhere.
- CORS: use a proxy that sets permissive CORS for public assets.
- Stale cache: change filenames; don’t rely on CDN purges.

## When to outgrow free
- Too many assets or rate limits → move heavy collections to Backblaze B2 or Cloudflare Images/R2. Keep manifest structure; swap base URLs.