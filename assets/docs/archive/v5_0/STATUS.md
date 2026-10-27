# Status — start here

**As of 2026-10-27.** Live at **v4.6.5**. Read this first when coming back to the portfolio.

---

## Where things stand

- **Live:** v4.6.5, on production branch `design-360`. `dev` and production are in sync.
- **Shipping:** the exact steps are in `assets/docs/ENTRY_SOP.md` § 11:
  - push `dev` and check the preview
  - fast-forward `design-360` and push
  - add an annotated tag
  - switch back to `dev`
- **Tagging:** every push to production gets a tag:
  - patch for content and small fixes
  - minor for features
  - major for redesigns
- **On hold:** portfolio work waits until the resume and LinkedIn materials are finished.

## What's next

### 1. Job-project work order

`UPDATES_FROM_JOB_PROJECT.md` (this folder) has a progress check at the top. Done items are struck through.

- **Entry fixes:** 7 of 8 are open:
  - amorphous-gradient copy
  - css-animated-micro-interactions reframe
  - freelance-payments-platform still links the dead `payments.august.style`
  - fashion entries merge, plus removing the false Google Lens claim
  - notes-app-thot should point at `dev.thots`
  - minimalist-web-store cross-link
  - Creative Director → Art Director on `technical-defi-content-simplification`
- **Missing entries:** the 4 Style Spectrum / Astrofluenced entries, and the `portfolio/CONVENTIONS.md` migration.
- **DNS:** nothing deleted yet. The zone is at 59 records. The work order lists the 17 records to delete.
- **Other repos:** the `portfolio/README.md` scoring-algorithm claim is still there.

### 2. v5.0 — homepage and new entries (`UPDATE.md`, this folder)

- **Homepage reframe:** drop the contractor-only feel, so full-time and part-time roles aren't turned away.
- **Narrative spine:** each section is one viewport tall, with Phase A/B/C reworded.
- **Homepage access:** skill/trade buttons (Graphic Design and others), big-thumbnail category tiles, and a prototypes row.
- **New entries:**
  - DAO branding, illustration, and motion (`assets/drafts/WRITTEN_PHASE/BRANDING_DIGITAL_ILLUSTRATION.md`; media in `assets/.media/art-director`)
  - CKHeals full case study (materials in the RIJ project)
  - Vivaldi UX psychology (`ENTRY_VIVALDI_UX_PSYCHOLOGY.md`, this folder)
  - shop-admin prototype tile
- **Subdomains:** move prototypes from subdomains to `august.style/<slug>` paths.
- **Already done:** the subdomain-policy research. `GIT_AND_DEPLOY.md` was updated 2026-08-26.

### 3. v4.7 — planned, not built (`archive/v4_7/v4_7_0_IMPLEMENT.md`)

- MP4 video on every layout (gallery walls, collection pages, homepage art wall).
- Smarter `/api/upload`: role-based sizes, automatic video handling.
- Small backlog: Position filter, shuffled hero thumbs, nav reveal at page bottom, per-collection matte color.
- Fold into v5.0 or ship separately, whichever comes first.

## Separate future session: infrastructure accounts

- **Portfolio data:** stays on JSON-in-git. Databases are for the apps with users (RIJ, Thot, contract-payments).
- **Per-project logins:** only Supabase needs them, because of its free-project cap. I believe the cap is 2 active projects; check their pricing page.
- **One login is enough for:** Vercel, Cloudflare, Cloudinary, Stripe, and Resend.
- **To decide then:**
  - the email scheme (check whether services accept Proton `+alias` addresses)
  - which Cloudflare free services fit: D1, KV, Workers, Turnstile, Email Routing
