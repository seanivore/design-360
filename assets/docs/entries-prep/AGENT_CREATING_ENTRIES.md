# Create Project Portfolio Entries (v5.0)

## Quick Start

You are creating v5.0 JSON entries for a portfolio site. 36 entries already exist in `assets/entries/`.

**Before touching any code, read these files:**

1. `assets/docs/ENTRY_SOP.md` — Full procedure, field writing guidelines, Cloudinary processing, R2 CDN upload
2. `assets/docs/_entry_template.json` — The v5.0 schema with all fields
3. `assets/docs/tags.json` — Tag registry (use existing tags, never invent near-duplicates)
4. `assets/docs/entries-prep/ENTRY_BACKLOG.md` — Project tracking lists (Priority 1-4)

**Existing examples:** Any file in `assets/entries/` (e.g. `uid-bsj-738.json`, `uid-rfr-187.json`)

## Workflow Summary

1. Pick a project from `ENTRY_BACKLOG.md`
2. Research the project (read docs, visit URLs, gather context)
3. Create media directory: `assets/media/<slug>/`
4. Process images through Cloudinary (see SOP Section 6)
5. Optionally upload to R2 CDN at `cdn.august.style`
6. Create and fill in the JSON entry (see SOP Sections 1-5)
7. Validate: `python assets/scripts/validate_v5.py`
8. Regenerate manifest: `python generate_manifest.py`
9. Mark the project as complete in `ENTRY_BACKLOG.md`

**Every 5-10 entries:** Run `git add .` on the new files and push.
