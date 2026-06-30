# august.style

Portfolio site for Sean August Horvath — and a deliberately dependency-free, JSON-driven architecture for fast, agent-authorable portfolio and showcase sites.

Every page (homepage, project entry, art collection, tag/filter view) renders from a structured JSON file, hydrated by a few hundred lines of vanilla JS. No framework, no bundler, no build step beyond a single Python manifest script. Deployed on Vercel, with media on Cloudflare R2.

**Live**: [august.style](https://august.style)

---

## Why it's built this way

- **No framework, no dependencies.** Vanilla HTML/CSS/JS, plus one `@aws-sdk/client-s3` import behind the upload endpoint. It loads instantly and will still run, unchanged, years from now.
- **Content is data, not code.** A project is one JSON file. Adding work never touches the rendering layer — drop a file in `assets/entries/`, run one script, and it's live with SEO meta baked in.
- **Agents can author it end-to-end.** The schemas plus a single SOP (`assets/docs/ENTRY_SOP.md`) are explicit enough that an AI agent can source media, upload it to the CDN, write the JSON, validate, and ship — no human in the rendering loop.
- **Cheap and durable to run.** Static files on Vercel + images on Cloudflare R2 (no egress fees). A full portfolio costs next to nothing to host and has almost nothing to break.

If you build sites for clients, it's a clean base to fork: a small content model, legible rendering, and an agent-authoring pipeline that lets the client keep their own site current. The architecture reference below is the whole thing — nothing hidden behind a build.

---

## Architecture

- **34 project entries** (`assets/entries/uid-*.json`, schema v6.1) in four layouts — `columns` (two-column case study), `flow` (typed-block long-form), `gallery` (image-forward art showcase), and `url` (a redirect tile that renders normally but links straight to an external site/demo, with no entry page). The three case-study layouts share one top zone (hero thumbnail row + title/subtitle + role) and one tag model; they differ only in the content zone below.
- **Art collections** (`assets/collections/uid-col-*.json`, schema v6.1) — ordered `images[]` of CDN URLs, each belonging to exactly one parent entry (an entry can have many). On a gallery entry they render as one full-bleed, accent-matted "art-wall" per collection; on the filter page they appear as first-class tiles; each collection page links back to its parent with a breadcrumb.
- **Tag-based filtering** across four groups — role, skill, product, company — plus a `featured` boolean. The filter page gives each group its own dropdown (with an any/all toggle and searchable checkboxes) and a Projects / Collections content-type selector.
- **Configurable homepage** via `assets/js/homepage-content.json` — a three-phase narrative spine, a four-card featured-tiles grid (one auto-playing video tile driven by the `featured` boolean + three phase cards), a full-bleed art wall pulled across the collections of entries tagged `Art Collection`, process steps, and achievements rolled up from entries.
- **Media on CDN** at `cdn.august.style` (Cloudflare R2 bucket `portfolio`, AWS CLI profile `r2`). Images upload through the `/api/upload` endpoint (Cloudinary resize → WebP → R2); video uploads via `aws s3 sync`.
- **Pre-rendered SEO** — `generate_manifest.py` writes `_pages/{slug}.html` (entries) and `_pages/{entry}/{coll}.html` (collections) with baked-in meta tags for social sharing.
- **Agentic content creation** — AI agents can author new entries and collections end-to-end via the standard operating procedure in `assets/docs/ENTRY_SOP.md`.

See `assets/docs/AUGUST_STYLE.md` for the full architecture reference (schemas, controllers, data flow, URL routing, file structure) and `assets/docs/ENTRY_SOP.md` for the content-authoring pipeline.

## Key Files

| File                                    | Purpose                                                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `index.html`                            | Homepage (hero → narrative spine → featured tiles → art wall → process → credentials → achievements → CTA) |
| `entry.html`                            | Entry-page template (`layout: "columns"`, `"flow"`, or `"gallery"`)                                       |
| `section.html`                          | Universal tag/filter page (per-group dropdowns + content-type selector)                                   |
| `collection.html`                       | Collection-page template (gallery art-walls, breadcrumb to parent entry)                                  |
| `generate_manifest.py`                  | Manifest builder + per-slug HTML page generator with SEO meta                                             |
| `api/upload.ts`                         | Image-upload endpoint — Cloudinary resize-to-2400 + WebP → R2 (Bearer-auth, single caller)                |
| `assets/js/homepage-content.json`       | Homepage configuration + copy strings                                                                     |
| `assets/js/data-loader.js`              | Fetching, caching, filtering, tag helpers, collection resolvers                                           |
| `assets/js/landing-controller.js`       | Homepage rendering (incl. `renderArtBleed` art wall)                                                      |
| `assets/js/entry-controller.js`         | Entry-page rendering — columns / flow / gallery layouts, per-collection art-walls, unified lightbox pool  |
| `assets/js/filter-controller.js`        | Section-page filter UI — per-group dropdowns, any/all, content-type selector                              |
| `assets/js/section-controller.js`       | Section-page pool loading + structured filtering (entries + collections as tiles)                         |
| `assets/js/collection-controller.js`    | Collection-page rendering + breadcrumb                                                                    |
| `assets/scripts/validate.py`            | Schema validator (entries v6.1 + collections v6.1; flags retired fields)                                  |
| `assets/scripts/new_project.py`         | Skeleton generator (`--type {entry,collection}`)                                                          |
| `assets/scripts/cdn_cleanup.py`         | R2 orphan-detection report (no deletion)                                                                  |
| `assets/docs/AUGUST_STYLE.md`           | Living architecture / schema reference                                                                    |
| `assets/docs/ENTRY_SOP.md`              | Content-authoring SOP (entries + collections)                                                             |
| `assets/docs/tags.json`                 | Tag registry (role / skill / product / company)                                                           |

## Development & review

The canonical preview surface is the **Vercel dev deploy** (the `dev` branch, at `design-360-git-dev-…vercel.app`) — it reproduces production routing, rewrites, and headers. Review there: commit → push `dev` → open the dev URL.

A local static server works for quick checks, but its routing differs from Vercel (no pretty-slug rewrites), so treat it as a rough preview, not the source of truth:

```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

Locally, entry and collection pages take a `?path=` parameter; production uses pretty-slug routing (`/{slug}/` for entries, `/{entry}/{coll}/` for collections):

```
http://localhost:5500/                                                    # Homepage
http://localhost:5500/section.html?tags=web-developer                     # Section / filter
http://localhost:5500/entry.html?path=illustration-art-deco               # Entry (gallery layout)
http://localhost:5500/collection.html?path=illustration-art-deco/animals  # Collection (nested)
```

## Adding new content

See `assets/docs/ENTRY_SOP.md` for the full procedure. Quick reference:

1. `python3 assets/scripts/new_project.py --type {entry|collection}` — generate a skeleton.
2. Upload media — images via `POST /api/upload` (Cloudinary resize → R2), video via `aws s3 sync` against R2 with the `r2` profile.
3. Fill out the JSON fields using CDN URLs.
4. Move the file to its directory and validate: `python3 assets/scripts/validate.py`.
5. Regenerate the manifest: `python3 generate_manifest.py`.

## Generating the manifest + per-slug HTML

```bash
python3 generate_manifest.py
```

Outputs:
- `assets/js/manifest.json` — a slug-to-file map (`entries`, `collections`). Collections are keyed by their nested path `<entry>/<coll>`.
- `_pages/{slug}.html` (entries) and `_pages/{entry}/{coll}.html` (collections) — each with pre-rendered SEO meta tags.

Stale `_pages/*.html` files for slugs no longer in the manifest are cleaned up automatically.
