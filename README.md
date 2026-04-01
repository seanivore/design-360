# august.style

Portfolio site for Sean August Horvath. JSON-driven architecture where all content is managed through structured entry files and a configurable homepage.

**Live**: [august.style](https://august.style)

---

## Architecture

- **37 project entries** as individual JSON files (`assets/entries/uid-*.json`)
- **Tag-based filtering** across 4 groups: role, skill, product, company
- **Configurable homepage** via `assets/js/homepage-content.json` — change tags to pivot for different job targets
- **Images on CDN** at `cdn.august.style` (Cloudflare R2)
- **Pre-rendered SEO** — `generate_manifest.py` outputs `/{slug}/index.html` with baked-in meta tags for social sharing
- **Agentic entry creation** — AI agents can create new entries end-to-end using `assets/docs/ENTRY_SOP.md`

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Homepage (landing page) |
| `entry.html` | Entry page template |
| `section.html` | Universal tag/filter page |
| `generate_manifest.py` | Generates manifest + per-entry HTML with SEO meta tags |
| `assets/js/homepage-content.json` | Homepage section configuration |
| `assets/js/data-loader.js` | Data fetching, caching, filtering |
| `assets/js/landing-controller.js` | Homepage rendering |
| `assets/docs/ENTRY_SOP.md` | Entry creation standard operating procedure |
| `assets/docs/JSON_ARCHITECTURE.md` | Full technical architecture reference |
| `assets/docs/tags.json` | Tag registry |

## Local Development

```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

Entry pages use `?path=` parameter locally since `/{slug}/` routing requires GitHub Pages:

```
http://localhost:5500/                                          # Homepage
http://localhost:5500/section.html?tags=Web+Developer           # Section
http://localhost:5500/entry.html?path=saas-product-sale-features # Entry
```

## Adding a New Entry

See `assets/docs/ENTRY_SOP.md` for the full procedure. Quick reference:

1. `python3 assets/scripts/new_project.py` — generate entry file
2. Source + process images via Cloudinary
3. Upload to R2 CDN (`aws s3 sync` with `--profile r2`)
4. Fill out all JSON fields using CDN URLs
5. Move to `assets/entries/`, validate, generate manifest

## Generating Manifest + Entry HTML

```bash
python3 generate_manifest.py
```

This outputs:
- `assets/js/manifest.json` — slug-to-file mapping
- `_pages/{slug}.html` — per-entry HTML with pre-rendered SEO meta tags (Jekyll collection)
