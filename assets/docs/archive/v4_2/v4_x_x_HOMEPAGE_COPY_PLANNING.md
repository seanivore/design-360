# Homepage Copy Planning — Workshop Doc

**Initiative**: v4.2 portfolio update
**Status**: Source material + section skeleton — initial copy drafts to be written by a focused subagent pass; Sean iterates from there.
**Updated**: 2026-05-27

This is the working doc for **all homepage narrative copy** across the v4.2 redesign. Old `homepage-content.json` was tag-filter-only; v4.2 makes it copy-aware (per Sean's call: "breaking the old rule that it was for tags only but that experiment led to this update because more targeted language was needed"). Drafts live here first; once a section is happy, the copy moves into `assets/js/homepage-content.json` under the appropriate field.

The voice goal: punchy, narrative, evolution-of-career arc. The selling point: **custom AI solutions for companies/clients** — Sean adapted to AI personally, then built tooling that removes friction from how people work with AI.

---

## Component inventory (v4.2 homepage)

In page order, top → bottom:

1. **Hero** — full-viewport animated video bg + asymmetric blur. Cutout-letter wordmark (SEAN / HORVATH). Rotating **ABOUT block** with small-caps label + 1–2 sentence body. Nav links. (Source video already locally staged at `assets/.media/home-anim/hero-cyberpunk-FINAL.mp4`.)
2. **Narrative Spine** (NEW v4.2 component) — three sections, no tab buttons. Each section has narrative copy + the headlines of the entries in that phase (linkable). Phase A and B reference real entries; Phase C is copy-only for now. Modeled loosely on the SHOWCASE component vibe but without the tab interaction.
3. **Process** section — three steps for Phase A / B / C. Copy is **static** (locked v4.2 — not data-driven). Each step is clickable → routes to `section.html?tags=phase_a` (or phase_b / phase_c). Phase C section will be empty until more entries get authored.
4. **Feature cards (4-card grid)** — all four are video tiles. Tagged via `feature_video` URL field on entry JSON. Homepage shuffles the pool filtered by `featured` + phase tag. Video dimensions: **4:5 vertical (1080×1350)** — see v4_2_2 IMPLEMENT for rationale.
5. **Hero Stats Revamp** — interactive Projects / Roles / Skills relationship chart (location: above Credentials). Subagent research + spec pending.
6. **Credentials**
7. **Achievements** — shows ALL achievements from ALL entries for v4.2 (no tag filter applied). Tag-filter slot kept empty in `homepage-content.json` so it can be constrained later.
8. **CTA section (bottom)** — refresh copy from generic web-developer pitch to v4.2's career-evolution + custom-AI-solutions theme.

---

## Source material for the agent

The copy drafter reads everything below + the 3 phase drafts + `v4_0_0_UPDATE.md` (extra runway).

### A. Strategy framing (verbatim from v4_1_0_IMPLEMENT.md § The Strategy)

The in-demand skill this portfolio illustrates aptitude for is **Building Custom AI Pipelines**.

- **Our opportunity**: Companies are looking to build modern processes and open up their systems in order to increase speed and productivity.
- **They want to know**: What does it mean to rebuild ourselves to use AI?

We answer their question by illustrating how Sean personally adapted to use AI in his own work.

### B. Chronological phase framing (verbatim from v4_1_0)

1. **Phase A — Foundation (Pre-AI)** — entries that showcase the basis of Sean's experience and the building of his current expertise, information essential to anchor in where he can best help bring AI into businesses, and that provides space to showcase accolades and highlights from this era.
2. **Phase B — Generative Automations (Early AI)** — entries that showcase his initial dive into applying AI to that skill set; highlights the lower-barrier-to-entry solutions that involve no-code tools connecting the generative power of LLMs to automate industry tasks; adds legitimacy by illustrating the pace of personal development and fluency adopting new tools and strategies.
3. **Phase C — Custom AI Solutions (Modern AI)** — entries that showcase modern efforts using agentic tools to create digital products that businesses need, but then taking it further by building custom solutions that let the company/client engage with their favorite AI model in chat to facilitate the tasks needed to use the digital product Sean built for them. Removes friction — updating a website, maintaining social presence for a growing brand, etc.

### C. v4_1_0 Copywriting section (verbatim — Sean's voice, AI-focused sell)

**Challenges companies are encountering**

Many companies are finding it incredibly difficult to implement AI because they're trying to do it in the same way they've rolled out most any new technology. They have someone come in to run a seminar, for which they select individuals from each department across the organization to attend. These employees become the leaders of AI integration initiatives and are expected to bring back what they learned and be the go-to "AI guy" on the team who integrates the new tools into everyone's workflow.

The problem is that AI isn't like other tools, it doesn't work like that. Instead of an organization looking outward for answers, they'd be better off looking inward. Instead of looking to a single person to lead the charge, the organization should be looking to itself to create an AI-driven workflow, because AI is best used when you're using it in a personal context. This implies a more ground-up approach that completely updates old processes. Thankfully Sean has experience doing this.

**The AI-focused "Sell"**

The tools are out there. The real value comes from knowing how, and where, to apply them. This requires learning quickly and thinking in systems rather than outputs.

- Building modern systems and processes by opening up systems to increase speed and productivity.
- Answering: What does it mean to rebuild ourselves to use AI — everything from how our teams are structured to how our data works?

**Example**: Custom GPT that walks the user through what's needed to update the website store with a new product. The AI then uses a pipeline Sean created to edit the images, add them to the content network, add all the text it helped finish to the database, then push the site to update.

**Offering AI-assisted services in automation, prompting, systems**

- As companies implement AI in practical, outcome-driven ways. Not necessarily more tools but how to use them.
- Sean works to close the gap between access and application, ensuring teams use new tools effectively in real business contexts.
- This involves creating workflows that reduce manual effort and improve speed — building automations, designing content systems.
- Sometimes that means connecting tools like Zapier and Notion, building custom solutions that replace Zapier and Notion, more often it means custom solutions with lower or zero overhead maintenance cost, built to be future-proof.

**Recommending how to best use AI**

- It should become a tool used to facilitate constant learning.
- Don't ask for something outright — stay in the driver's seat.
- Focus on building metacognitive habits.

**Adjust what you're asking the AI for** — "What's another way of looking at this?"

**Don't give away your role** by asking it "Create Marketing Plan." Instead try: "I've created a marketing plan that needs refining. It needs to reach mid-career professionals between 28–45 years old. I could use help ensuring I'm not missing anything stemming from unconscious bias around the topic. I'm not necessarily looking for specific suggestions, but rather, help thinking through various options for improving the plan."

### D. Phase entry drafts (source for narrative-spine entry refs + ABOUT line ideas)

- `assets/docs/archive/v4_1/PHASE_A1_v4.md` — PETA Marketing & Social Media Achievements (slug: `awards-viral-social`)
- `assets/docs/archive/v4_1/PHASE_A2_v2.md` — Self-Employed Web Design & Digital Consultancy Highlights (slug: `freelance-marketing-web`)
- `assets/docs/archive/v4_1/PHASE_B1_v2.md` — Database Powered Generative Content Engine (slug: `generative-blog-workflow`)
- `assets/docs/archive/v4_1/PHASE_C.md` — Phase C positioning (no entry; copy-only)
- `assets/docs/archive/v4_0/v4_0_0_UPDATE.md` — extra runway material per Sean

---

## Draft slots (the subagent fills these)

The subagent's job is to populate each block below. Where multiple variants would be useful (e.g. ABOUT rotation pool), draft them. Aim for punchy + narrative-arc. If something is better written by Sean directly, leave a brief note in the slot instead of guessing.

### 1. Hero ABOUT rotating copy pool

Slot for **3–5 short rotation entries**. Each is a small-caps "ABOUT" label + 1–2 sentence body. Voice: confident, specific, evolution-of-career. Reference for cadence: the Prisma sample in v4_1_0 reads *"We shape striking digital identities through bold contrasts and meaningful motion. Our design process transforms the primal into the powerful."* — that length, that punch.

**Rotation pool (5 variants):**

**Variant 1**
> ABOUT
>
> I build the custom AI pipelines companies need to actually adapt to AI. Fifteen years of designing systems for scale, now applied to removing friction between people and the tools they use every day.

**Variant 2**
> ABOUT
>
> I started in social media when "viral" still needed quotation marks, helped a global organization rebuild itself around visual-first thinking, and now design AI pipelines that let companies do the same with their own workflows.

**Variant 3**
> ABOUT
>
> Strategy, design, and code — sharpened across a decade of campaigns measured in billions of impressions, then rebuilt for an era where the real value is knowing how and where to apply AI.

**Variant 4**
> ABOUT
>
> Three phases, one through-line: find the friction, design the system, ship the thing. The tools changed from Photoshop to Make.com to custom agentic pipelines. The instinct didn't.

**Variant 5**
> ABOUT
>
> I learn fast and think in systems rather than outputs. That's how a marketing strategist becomes a content systems architect becomes the person who builds the AI pipeline your team will actually use.

### 2. Narrative Spine — Phase A (Foundation, Pre-AI)

Narrative paragraph (60–120 words) setting up Phase A. Then list of linked entry headlines (with slug refs so they become clickable cards):
- Entry 1: `awards-viral-social` — *"PETA Marketing & Social Media Achievements"*
- Entry 2: `freelance-marketing-web` — *"Self-Employed Web Design & Digital Consultancy Highlights"*

**Paragraph:**

> Before AI, I learned the part of the job that doesn't change. On a two-person social team at PETA, my mentor Helena and I pioneered the rapid, visual-first publishing playbook that the rest of the industry adopted years later — 3.2 billion impressions a year, a #1 engagement rate across nonprofits, viral campaigns that landed in YahooNews, Refinery 29, and a Kanye lyric. Then I went independent and ran every part of that work — strategy, brand, design, build — for clients of my own. This is the foundation the rest of the portfolio is built on: systems thinking, gut-check storytelling, and shipping under real deadlines.

**Featured entries (linked cards):**

- [PETA Marketing & Social Media Achievements](/entry.html?slug=awards-viral-social) — *Our First Viral Moments, Hijacking #AskSeaWorld, and a foul-mouthed vegan grandma with a billion video views.*
- [Self-Employed Web Design & Digital Consultancy Highlights](/entry.html?slug=freelance-marketing-web) — *Carrying one brand across every medium, ten years with a single client, and a hand-drawn website where the human touch was the deliverable.*

### 3. Narrative Spine — Phase B (Generative Automations, Early AI)

Narrative paragraph (60–120 words). Linked entries:
- Entry 1: `generative-blog-workflow` — *"Database Powered Generative Content Engine"*

**Paragraph:**

> When the first GPT release shipped, I stopped doing almost anything else and learned. The question that mattered wasn't whether AI was safe or inevitable — it was how to apply it to every skill I already had. The answer turned out to be pipelines. Notion as the structured data layer, Make.com as the connective tissue, ChatGPT as the writer, Adobe Firefly for the art, Webflow for the surface. Then I built one: Astrofluenced, an astrology-based self-help network publishing 100+ blogs a week, a podcast voiced by two AI characters with distinct personalities, and matching social assets. Mostly hands-off, all of it on-brand.

**Featured entry (linked card):**

- [Database Powered Generative Content Engine](/entry.html?slug=generative-blog-workflow) — *Fully Automated Daily Astrological Readings, 100+ weekly blogs, hand-drawn artwork covering an AI blog, and a podcast with 68 episodes hosted by characters named Theodore and Stella.*

### 4. Narrative Spine — Phase C (Custom AI Solutions, Modern AI)

Narrative paragraph (80–140 words — slightly longer since no entries to link yet; the copy is doing the storytelling alone). Pull material from `PHASE_C.md`: this portfolio build itself, the Everlastings client build, the DataEdger business plan, the Thot App.

**Paragraph:**

> Most companies are trying to roll out AI the way they roll out any new software: pick a few people from each department, send them to a seminar, expect them to come back as the "AI person" on their team. It doesn't work, because AI isn't that kind of tool. The value isn't in adding it on top of how you already work — it's in rebuilding the work itself.
>
> That's what Phase C is. Custom digital products built agentically against ironed-out dev protocols, then taken one step further: the friction that's *still* left after launch — updating a website, onboarding clients, scheduling content, pushing a new product to a storefront — gets absorbed into a custom AI pipeline the client already uses every day. They open the same ChatGPT they were already using. It asks what changed. It edits the images, writes the copy, updates the database, and pushes the site. No new tool to learn, no Zapier rats-nest to maintain, no new vendor. This portfolio is one example. The Everlastings webstore is another. The DataEdger investment plan and the Thot App are next.

### 5. Process Section (static 3-step) — copy + click target

Each step is one short sentence (the step word + a one-line elaboration). Same Phase A/B/C structure as the Narrative Spine but in a different visual shape (process bar). Click target: `section.html?tags=phase_a` etc.

| Step | Word           | One-line copy                                                                                                             | Click target                |
| ---- | -------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1    | **FOUNDATION** | A decade of strategy, design, and storytelling built for scale — measured in billions of impressions, not vanity metrics. | `section.html?tags=phase_a` |
| 2    | **AUTOMATE**   | Generative pipelines that turn one hour of input into a hundred blog posts, a podcast, and a week of social.              | `section.html?tags=phase_b` |
| 3    | **EMBED**      | Custom AI solutions wired into the model your team already uses — no new tool, no friction, no maintenance overhead.      | `section.html?tags=phase_c` |

_Alternate Phase A word if "FOUNDATION" reads too generic to Sean: **GROUND** ("Ground the work in a decade of...") — leaving the call to Sean._

### 6. Feature Cards (4-card grid) — card titles + short body each

Each card pulls from a featured-tagged entry's `feature_video` + headline + 2–3 word checklist items. The subagent doesn't pre-pick cards (they shuffle at runtime) — but DOES draft the visual/copy structure pattern so the renderer knows what to emit per card.

**Card emit pattern** (rendered per shuffled `featured`-tagged entry):

```
┌─────────────────────────────────┐
│  [feature_video, 4:5 vertical]  │
│                                 │
├─────────────────────────────────┤
│  ## 01                          │  ← shuffle position (01–04), not entry ID
│                                 │
│  ### {entry.title}              │  ← from JSON title field
│                                 │
│  ✓ {checklist_item_1}           │  ← 2–4 word checklist items pulled
│  ✓ {checklist_item_2}           │     from entry.feature_checklist[]
│  ✓ {checklist_item_3}           │
│                                 │
│  Learn more →                   │  ← links to /entry.html?slug={slug}
└─────────────────────────────────┘
```

**JSON field shape per entry** (add to entry JSON for featured cards):

```json
{
  "feature_video": "https://cdn.august.style/media/{slug}/feature-{slug}.mp4",
  "feature_checklist": [
    "Pipeline design",
    "Custom AI integration",
    "Zero-friction handoff"
  ]
}
```

**Example checklist items by phase** (so Sean / authors have a pattern to follow when filling in entries):

- Phase A entries: *Strategy & process* / *Brand & visual* / *Measured outcomes*
- Phase B entries: *Generative pipeline* / *Automated publishing* / *On-brand at scale*
- Phase C entries: *Custom AI flow* / *Embedded in ChatGPT* / *No maintenance overhead*

**Copy voice rules per card:**

- Checklist items: 2–4 words, no verbs needed, sentence-case
- Avoid generic words like "Innovation," "Solutions," "Excellence"
- "Learn more" can rotate per card if Sean wants — alternates: *"See the build"*, *"Open the case"*, *"Read the work"*. Default to "Learn more →" for v4.2 launch.

### 7. CTA section (bottom of page) — heading + primary CTA + secondary CTA

Theme: career-evolution + custom-AI-solutions. Drop the generic "Interested in web development?" framing. Make it specifically about building custom AI pipelines for companies that want to genuinely adapt to AI.

**Primary draft:**

> ## Rebuilding around AI is a ground-up job.
>
> If your company is trying to do real work with AI — not seminars, not pilots, not another tool slotted on top of the old process — that's the kind of thing I build.

|               | Text                        | Href                                                      |
| ------------- | --------------------------- | --------------------------------------------------------- |
| Primary CTA   | **Start a custom pipeline** | `mailto:sean@august.style?subject=Custom%20AI%20Pipeline` |
| Secondary CTA | See how Phase C works       | `/section.html?tags=phase_c`                              |

---

**Alternate heading variants** (Sean to pick):

1. *"Rebuilding around AI is a ground-up job."* (primary above — leans on the v4_1_0 framing about looking inward instead of outward)
2. *"The tools are out there. The value is in knowing how to apply them."* (verbatim Sean line from v4_1_0)
3. *"Custom AI pipelines, built into the model your team already uses."* (most direct positioning of the offering)
4. *"Three phases. One through-line. Let's build yours."* (ties back to the narrative spine)

**Note for Sean:** I gave the secondary CTA a soft landing on Phase C because Phase C is the part that sells the offering, but if you'd rather have it route to a contact form, a Calendly, or `mailto:` with a different subject, that's a one-line change. The primary `mailto:` href is a placeholder — swap for whatever intake flow you want (Tally form, Calendly, etc.).

---

## Notes for the subagent

- Prefer Sean's voice as it shows up in the phase drafts and v4_1_0 — first-person, specific, narrative arc. Avoid generic portfolio copy ("Hi I'm a creative" / "Let's build something amazing"). Don't use em-dashes as a stylistic crutch.
- The 3 phase drafts have HEADLINES Sean already wrote (e.g. *"Our First Viral Moments"*, *"Fully Automated Daily Astrological Readings"*) — those are gold for connecting the spine to the entries. Pull the most resonant ones.
- For the ABOUT rotation pool: short. 1–2 sentences each. Each one should make a recruiter pause for a beat.
- Phase C is where the "custom AI solutions" positioning lands hardest — that's the part that sells. Don't be modest there; the portfolio's job is to make this the thing recruiters remember.
- This doc is a workshop. If a section feels weak after your first pass, write a second variant below it and let Sean pick.
