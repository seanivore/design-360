/Users/seanivore/Development/get-paid/resume/PORTFOLIO_TASKS.md

---

Pasting current state of path above today, 2026-10-27, below. 

---

# Portfolio & DNS Tasks — brief for the `360-design` agent

*Extracted from `COMPLETE_EXPERIENCE_v2.md` so the career document stops carrying housekeeping. This is a work order, not a reference doc. Run it from `~/Development/360-design/`.*

**Verified 2026-08-25.** DNS pulled live from the Cloudflare API; every URL re-checked with a real HTTP status. Nothing below is assumed.

**Scope rule:** this brief covers portfolio content, README corrections, and DNS *recommendations*. **Do not change DNS.** Produce the change list; Sean applies it.

---

## 1. DNS — the actual state, which is better than expected

`august.style` holds **58 records**, not the 50+ of unmanaged sprawl that was assumed. The breakdown:

| Category                             | Count | Action                   |
| ------------------------------------ | ----- | ------------------------ |
| Live project subdomains              | 22    | Keep                     |
| `www.*` duplicates of subdomains     | 16    | **Candidates to delete** |
| Mail, DKIM, SPF, DMARC, verification | 18    | Keep — infrastructure    |
| Orphaned / broken                    | 2     | **Delete**               |

### Records to delete — orphaned

- **`swarms.august.style`** → `seanivore.github.io`. Returns no response. The `swarm-designing` repo is archived. Remove this and `www.swarms.august.style`.
- **`www.dev.payments.august.style`** → `seanivore.github.io`. Points at a subdomain of a subdomain that has no parent record. Dead on arrival.

### The `payments.august.style` mystery — solved

`payments.august.style` is cited as live in several documents and returns nothing. **The reason is that no A or CNAME record for it exists.** Only `www.payments.august.style` and `www.dev.payments.august.style` exist, both pointing at `seanivore.github.io`.

- Either create the apex record and point it at the real host, or delete both `www.*` records and treat the project as retired in favour of `contract.august.style`.
- **Recommendation: delete.** The project is superseded by the vanilla rebuild at `contract-payments`, which is already live at `contract.august.style` and `dev.contract.august.style`.

### The 16 `www.*` duplicates

`www.ai-generated-content` · `www.ai-philosophy` · `www.design` · `www.developer-technologist` · `www.generative-horoscopes` · `www.online-pt-trainer` · `www.presenting` · `www.print-shop-fashion` · `www.projects` · `www.sfagent` · `www.swarms` · `www.thots` · `www.visual-producer` · `www.payments` · `www.dev.payments` · `www.august.style`

- **Keep `www.august.style`** — the apex needs it.
- **The other 15 serve no purpose.** Nobody types `www.` in front of a project subdomain, and nothing links to them. Deleting them takes the zone from 58 records to 43 and removes a whole class of "which one is canonical" ambiguity.

### Subdomains that were already gone

These are cited as live somewhere in the archive or in a case study and **have no DNS record at all** — nothing to delete, but every reference to them is pointing at nothing:

`art-history` · `art` · `astrofluenced` · `astrofluenced-podcasts` · `automated-podcasts` · `illustration-animation` · `lookbook` · `ckheals` · `ai-blog` · `workflow` · `app` · `ai-print-store` · `portfolio` · `aug.ltd` (separate domain, retired) · `seanivore.com` (never existed)

---

## 2. Move prototypes to apex-domain slugs

*Sean's goal: stop minting a subdomain per project. Give prototypes a home at `august.style/<slug>` or an existing project-site slug, then retire the subdomain.*

- **`visual-producer.august.style`** → an apex slug, tied to the portfolio entry `visual-artist-process-portfolio`
- **`presenting.august.style`** → an apex slug; relates to `github.com/seanivore/presentation-decks`
- **Summer lookbook parts 1–4** → `design.august.style/projects/summer-lookbook-part-{1..4}`
- **Autumn lookbook parts 1–3** → `design.august.style/projects/autumn-lookbook-part-{1..3}`
- **Webflow print series page** → `design.august.style/projects/webflow-print-series`
- **Webflow product page** → `design.august.style/projects/webflow-product-page`
- **ASD Polytechnic Briefings playlist** → `august.style/ai-podcast/polytechnic-briefings`
- **Astrofluenced playlist** → `august.style/ai-podcast/astrofluenced`

**Podcast destination URLs, for the redirects:**

- ASD Polytechnic Briefings — YouTube `youtube.com/playlist?list=PLmiHTLtKjrdxRr4yxx9VoH88KQ9Q5kp-u` · Spotify `podcasters.spotify.com/pod/show/auguststyledaily`
- Astrofluenced — YouTube `youtube.com/playlist?list=PLmiHTLtKjrdyt4XBw2NlE_qvJRnHrkDTy` · Spotify `creators.spotify.com/pod/profile/astrofluenced/`
- Both live on the channel `youtube.com/@style_droid`. Direct URLs may be simpler than maintaining redirects — Sean's call.

---

## 3. Portfolio entries to update

1. **`august.style/amorphous-gradient-css-animation`** — this entry is about the *site's design*, but its body copy describes old projects, much of which has now been harvested into `COMPLETE_EXPERIENCE_v3.md`. Either give it a real UI-content update, or edit the copy down to prototype-worthy placeholder. Do not leave stale project claims in a design showcase.
2. **`august.style/social-advertising-strategy`** — needs a serious update to reflect the actual case study at `developer-technologist.august.style/social-advertising-strategy`. The real numbers: $119.97 total spend, $0.003 cost per engagement across 29,822 Reels impressions, $0.31 per follower, $3.58 CPM.
3. **`august.style/css-animated-micro-interactions`** — reframe as a Phase C AI-researcher-pipeline entry. The live research site currently at `presenting.august.style` should move to an apex slug.
4. **`august.style/freelance-payments-platform`** — update the link (`payments.august.style` is dead) and note the supersession: the project is being rebuilt vanilla as `contract-payments`, live at `contract.august.style`.
5. **`august.style/ai-design-fashion-lookbook`** + **`august.style/personalized-fashion-magazine`** — merge into one substantially larger generative-AI fashion entry. **Note:** the current `ai-design-fashion-lookbook` entry claims a Google Lens integration that does not exist. Remove that claim.
6. **`august.style/notes-app-thot`** — the entry should point at `dev.thots.august.style`. **`thots.august.style` still returns 404** as of 2026-08-25, even though a DNS record for it now exists; the Vercel project is not attached to that domain. "thot" is an internal name — the project has no real name yet.
7. **`august.style/minimalist-web-store-product`** — this is the art-history print shop prototype. Cross-link it to the generative-blog entry.
8. **The site's role taxonomy** carries `Creative Director` as a tag. The Silent Labs title is now settled as **Art Director**, so any DAO-related entry tagged `Creative Director` should be retagged. Leave the tag itself in the taxonomy — self-directed brand work legitimately is creative direction — but it should no longer attach to the Silent Labs entries.

## 4. Portfolio entries missing entirely

**All four belong to one venture: August Style Spectrum & Astrofluenced.** The existing starting point is `august.style/generative-blog-workflow`. Full source material is in `COMPLETE_EXPERIENCE_v3.md` under *august.style, Style Spectrum & Astrofluenced*.

1. **AI generative fashion** — the merged entry from item 5 above, covering both lookbook seasons, the twelve archetypes, and the honest coda about Adobe gutting Firefly's training set.
2. **Webflow e-commerce print shop & fashion lookbook magazine** — the original presentation is live at `print-shop-fashion.august.style`. Worth noting: the custom nav bar got particular focus because of the site's size, and an AI pipeline ran Notion → Make → Webflow to build the bulk of the content during the design phase. The `webflow-store` project README needs updating to match.
3. **Simple rapid-build e-commerce prototype** — one new entry; both pages become slug subpages per the table in §2.
4. **The August Style Spectrum / Astrofluenced umbrella** — the whole generative-automation venture, with the two podcasts described as two distinct shows.

## 5. Projects to remove from every listing

- **`VISION_UI_TETRIS`** — a fork with zero owner commits.
- **`portfolio-system-design`** — retire.
- **`ux-ui-improvements`** — retire.
- **`bing-searches-mcp`** — retire.
- **`claud-coin`** — has no portfolio entry today. Sean's lean is to drop it entirely rather than build one. The Rust entrypoint is a documented stub and the token price is stated two different ways across its own repos, so any entry would need heavy caveats. **Recommendation: drop.**

## 6. README corrections

Rule from Sean, applies everywhere: **rewrite any hardcoded count so no number is stated.** Counts drift; the claim then becomes false without anyone touching it.

- **`360-design/README.md`** — says 34 project entries; there are 36. Rewrite without a number.
- **`portfolio/README.md`** — claims a weighted scoring algorithm with category multipliers for related projects. The shipped `related-projects.js` implements a shuffle plus a first-match tag lookup. The claim is stronger than the code; correct it. This site is being kept primarily for the build design of the site itself.
- **`webflow-store/README.md`** — update per §4 item 2. It also references `ai-print-store.august.style`, which never existed.
- **Sweep every other project README** for the same pattern: a stated count, or a described capability the code does not implement.

## 7. Migrate `portfolio/CONVENTIONS.md`

`~/Development/portfolio/CONVENTIONS.md` is a 20 KB modular content system built explicitly so AI agents produce consistent pages — a three-width content system, a required section order, fixed chart colour tokens, and named reference pages per pattern. It is genuine, citable web-design work and it is currently buried in a predecessor repo.

- Migrate it into a new `august.style` entry at an SEO-appropriate web-design slug.
- The companion thesis from the same README is worth carrying over verbatim: *"This portfolio takes a unique approach to technical content creation by deliberately designing for both human and AI comprehension."*

---

## Appendix — live URL status, 2026-08-25

All 22 project URLs returned **200**: `august.style` · `design` · `projects` · `developer-technologist` · `visual-producer` · `presenting` · `generative-horoscopes` · `print-shop-fashion` · `ai-generated-content` · `ai-philosophy` · `online-pt-trainer` · `everlastings` · `shop-admin` · `cube` · `contract` · `dev.contract` · `dev.thots` · `sfagent` · `townsend` · `for-jesse`, plus `everlastingsbyemaline.com` and `ckheals.com`.

**Not 200:**

- `thots.august.style` — **404**. DNS record exists; the domain is not attached to the Vercel project.
- `swarms.august.style` — no response. DNS record exists; origin is gone.
- `cdn.august.style` — 404 at the root, which is correct behaviour for an R2 public bucket with no index. Not a defect.
- `payments.august.style` · `portfolio.august.style` · `art.august.style` · `workflow.august.style` — no response, and no DNS record exists for any of them.
