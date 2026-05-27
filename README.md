# august.style

Portfolio site for Sean August Horvath. JSON-driven architecture — every page (homepage, entry, collection, item) is rendered from a structured JSON file, hydrated by vanilla JS, and served via GitHub Pages with media on Cloudflare R2.

**Live**: [august.style](https://august.style)

---

## Architecture

- **33 project entries** (`assets/entries/uid-*.json`) at schema v6.1.
- **Media Collections subsystem** (v4.2.3): curated `collections` and individual `items` under `assets/collections/` and `assets/items/` at schema v6.0.
- **Tag-based filtering** across six groups: role, skill, product, company, placement, item.
- **Configurable homepage** via `assets/js/homepage-content.json` — three-phase narrative spine, sequenced feature tiles (Featured + Phase A/B/C), process steps, achievements rolled up from entries.
- **Media on CDN** at `cdn.august.style` (Cloudflare R2 bucket `portfolio`, AWS CLI profile `r2`).
- **Pre-rendered SEO** — `generate_manifest.py` outputs `_pages/{slug}.html` (entries), `_pages/collection-{slug}.html` (collections), `_pages/media-{slug}.html` (items) with baked-in meta tags for social sharing.
- **Agentic entry creation** — AI agents can author new entries, collections, and items end-to-end via the standard operating procedure in `assets/docs/ENTRY_SOP.md`.

See `assets/docs/AUGUST_STYLE.md` for the full architecture reference (schemas, controllers, data flow, URL routing, file structure). See `assets/docs/ENTRY_SOP.md` for the content-authoring pipeline. Brand copy iteration: `assets/docs/BRAND_COPY_STRATEGY.md`.

## Key Files

| File | Purpose |
| ---- | ------- |
| `index.html` | Homepage (cyberpunk hero → narrative spine → featured tiles → process → credentials → achievements → CTA) |
| `entry.html` | Entry-page template (`layout: "columns"` or `"flow"`) |
| `section.html` | Universal tag/filter page |
| `collection.html` | Collection-page template (v4.2.3) |
| `media.html` | Item-page template (v4.2.3) |
| `generate_manifest.py` | Manifest builder + per-slug HTML page generator with SEO meta |
| `assets/js/homepage-content.json` | Homepage configuration + copy strings |
| `assets/js/data-loader.js` | Fetching, caching, filtering, tag helpers, collection/item resolvers |
| `assets/js/landing-controller.js` | Homepage rendering |
| `assets/js/entry-controller.js` | Entry-page rendering, flow layout, unified lightbox pool |
| `assets/js/featured-tile-controller.js` | Sequenced auto-play + tap-state machine for homepage feature tiles |
| `assets/js/collection-controller.js` | Collection-page rendering |
| `assets/js/media-controller.js` | Item-page rendering |
| `assets/scripts/validate.py` | Schema validator (entries v6.1 + collections v6.0 + items v6.0) |
| `assets/scripts/new_project.py` | Skeleton generator (`--type {entry,collection,item}`) |
| `assets/scripts/cdn_cleanup.py` | R2 orphan-detection report (no deletion) |
| `assets/docs/AUGUST_STYLE.md` | Living architecture / schema reference |
| `assets/docs/ENTRY_SOP.md` | Content-authoring SOP |
| `assets/docs/BRAND_COPY_STRATEGY.md` | Brand copy iteration surface |
| `assets/docs/tags.json` | Tag registry (six groups) |

## Local Development

```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

Entry / collection / item pages use `?path=` parameter locally; production uses pretty-slug routing (`/{slug}/`, `/collection/{slug}/`, `/media/{slug}/`).

```
http://localhost:5500/                                                # Homepage
http://localhost:5500/section.html?tags=Web+Developer                 # Section
http://localhost:5500/entry.html?path=saas-product-sale-features      # Entry
http://localhost:5500/collection.html?path=stub-collection            # Collection
http://localhost:5500/media.html?path=saas-conversion-funnel-thumb    # Item
```

## Adding New Content

See `assets/docs/ENTRY_SOP.md` for the full procedure. Quick reference:

1. `python3 assets/scripts/new_project.py --type {entry|collection|item}` — generate skeleton.
2. Source + process images via Cloudinary; upload via `aws s3 sync` against R2 with the `r2` profile.
3. Fill out JSON fields using CDN URLs.
4. Move file to destination directory; validate: `python3 assets/scripts/validate.py`.
5. Regenerate manifest: `python3 generate_manifest.py`.

## Generating Manifest + Per-Slug HTML

```bash
python3 generate_manifest.py
```

Outputs:
- `assets/js/manifest.json` — slug-to-file map with three keys: `entries`, `collections`, `items`.
- `_pages/{slug}.html` (entries) / `_pages/collection-{slug}.html` / `_pages/media-{slug}.html` — each with pre-rendered SEO meta tags (Jekyll collection format).

Stale `_pages/*.html` files for slugs no longer in the manifest are cleaned up automatically.
