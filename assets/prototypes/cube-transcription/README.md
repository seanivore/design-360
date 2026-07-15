# The Cube — private, in-browser transcription

A single-page transcription tool built as a portfolio object for
**cube.august.style**. You drop an audio or video file onto a wireframe
3×3×3 cube; the cube's layers are the controls; the wait animation IS the
progress meter; the transcript lifts off at the end. Whisper runs in the
visitor's browser (WASM) — nothing is ever uploaded.

**Status: LIVE ENGINE — wired and verified.** `engine.js` runs real in-browser
Whisper (transformers.js v3, WebGPU with a CPU/WASM fallback) via `worker.js`;
audio is decoded on-device (Web Audio, with an ffmpeg.wasm fallback for exotic
containers). Nothing is uploaded. See `HANDOFF.md` for the seam, the
code-vs-design ownership rules, and the remaining polish (self-hosting the
fonts + wiring the `<head>` meta).

---

## The concept

A blueprint-style drafting drawing come alive: charcoal `#212123`, off-white
line work, IBM Plex Mono annotations, faint grid — the same visual system as
the `workflow.august.style` beat mockups. The cube is the entire interface:

1. **Drop / Upload (idle)** — the page is one annotated diagram. Colored
   blocks are the buttons (the rule everywhere: **colored = tappable**):
   - `↑ · UPLOAD` (blue, front-center) — tap to open the file picker, or drop
     a file anywhere on the page
   - `i · ABOUT` (vermilion, top-left) — privacy/about card
   - `? · FORMATS` (chartreuse, bottom-left) — accepted-format card
   - `↻` markers (teal/amber/green, right column) — preview where the three
     dials live
   - Plain blocks fade with depth (front row crisp, core/back columns faint)
     so the shape reads without competing with the buttons.
2. **Options** — one weighted quarter-turn. Each horizontal layer is a dial:
   top = accuracy (`tiny → large-v3`), middle = task
   (transcribe / subtitles / translate), bottom = language (auto default).
   Tap a layer to turn it 90° and advance the value, or use the ‹ › leader
   chips that pull out from the right-edge blocks (≥880px; narrow screens get
   a stacked panel). Below the cube: the file chip, output checkboxes
   (`.md` `.srt` `.txt` `.json`), and the run button.
3. **Processing** — the centerpiece. The 27 blocks scatter while a dashed
   blue ghost outline holds the shape; blocks click home bottom-up (layer-hue
   flash) as passages resolve, quickening near the end. There is no progress
   bar: the cube reassembling is the progress. Live transcript lines decode
   from glyphs (◇⊕∴…) into words beneath.
4. **Result** — final quarter-turn (one full revolution per file). Meta line
   (language · duration · model · segments), scrollable timestamped
   transcript, copy + per-format download chips, `new file` reset. Reset
   unwinds any layer turns so the colored blocks return to their seats.

Extras: full drag-and-drop with hover response, tap-nudge physics on every
interactive block, a shuffle-and-reseat transition between phases,
`prefers-reduced-motion` support (no scatter, no sway), 44px touch targets.

## Files

| File | Role |
|---|---|
| `index.html` | The whole UI (a self-contained Design Component page). |
| `support.js` | Component runtime — required by `index.html`, do not edit. |
| `engine.js` | **THE SEAM (real).** Decodes audio on-device + drives the Whisper worker; returns whisper-shaped output. Code-owned — don't overwrite on repackage. |
| `worker.js` | Whisper in a Web Worker (transformers.js v3, WebGPU → WASM fallback). Code-owned. |
| `vendor/ffmpeg/` | Tiny same-origin ffmpeg ESM glue for exotic-container decode (`.caf`, `.amr`…). The ~30 MB wasm core loads from CDN, not here. |
| `formats.js` | JS port of the Python `formats.py` — byte-parity `.md`/`.srt`/`.txt`/`.json` builders + filename stamp. |
| `favicon.svg` / `og.png` | Brand assets in the cube’s language — wire the head tags at integration. |
| `vercel.json` | `cleanUrls`/`trailingSlash` per the standalone/prototype deploy pattern. Static only, no build step. |
| `HANDOFF.md` | Integration notes for Claude Code: engine contract, gaps, decisions. |

## Design tokens (quick reference)

- Ground `#212123` · ink `#F6F6F6` (alpha steps .88/.72/.38/.28) · hairline `rgba(246,246,246,.13)`
- Blue `#2A7B9B` = structure (ghost, dimension line, timestamps, run button);
  red `#C70039` = the one moving mark (processing status ticks)
- Layer hues: accuracy teal `#00BAAD` · task amber `#FFC300` · language green `#56C785`
- Block buttons: upload blue (edges `#0F4A6B`) · about vermilion `#FF5733` · formats chartreuse `#ADD45D`
- Type: system-ui for prose, IBM Plex Mono for annotations/data (Google Fonts
  CDN for now — **self-host before ship**, see HANDOFF)

## Editing / repackaging

The living copy is edited in the Claude design project (`The Cube.dc.html` at
the project root — this folder's `index.html` is a byte-identical copy).
After any edit session, repackaging = re-copying four files into this folder:
`The Cube.dc.html → index.html`, plus `support.js`, `engine.js`,
`formats.js`. Just ask Claude to "repackage the cube directory."

Tweakable props (host Tweaks panel): `ambientMotion` (idle sway on/off),
`demoSeconds` (simulated engine pacing — dead code once the real engine
lands).

## Deploy

Drop this folder at `assets/prototypes/cube-transcription/` and follow the
standalone pattern: own Vercel project rooted here, `dev` as production
branch, domain **cube.august.style** (account-side, Cloudflare DNS). Static only — the in-browser engine is the whole
point. Suggested tab title (set in `<head>` at integration):
"The Cube — free private transcription, in your browser" · canonical
https://cube.august.style.
