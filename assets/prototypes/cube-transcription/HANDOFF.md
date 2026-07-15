# HANDOFF — The Cube (transcription UI → real engine)

> **STATUS: engine is WIRED and verified.** The simulated stub is gone —
> `engine.js` now runs real in-browser Whisper (transformers.js v3, WebGPU with
> a CPU/WASM fallback) via `worker.js`, decoding audio on the main thread (Web
> Audio, with an ffmpeg.wasm fallback for exotic containers like `.caf`).
> `window.CubeEngine.demo === false`. Verified end-to-end: native-decode + the
> ffmpeg path both transcribe, byte-parity `.md`/`.srt`/`.txt`/`.json` output,
> WebGPU inference, real timestamps. Deploy per the standalone/prototype pattern
> (own Vercel project rooted at this folder, `dev` = production branch, domain
> cube.august.style — it stays a **static/buildless** deploy: everything loads
> as ESM from a CDN, no bundler).

## ⚠ Ownership — what survives a design repackage

The design project only regenerates the **UI**. These are now **code-owned** and
must NOT be overwritten when you repackage:

- **`engine.js`** — the real engine (was the CD stub; now owns the seam).
- **`worker.js`** — the transformers.js Whisper worker (new; not a CD file).
- **`vendor/ffmpeg/`** — the tiny same-origin ffmpeg ESM glue (the ~30 MB wasm
  core stays on the CDN; only this ~15 KB glue is vendored so its worker is
  same-origin — a Worker can't be built from a cross-origin URL).
- **`formats.js`** — the byte-parity port of `app/formats.py`; keep the two in sync.

Only **`index.html`** + **`support.js`** get refreshed from the Claude project.

## ⚠ index.html post-copy patch (re-apply after every repackage)

The engine needs the real `File`, which the generated `index.html` drops. Two
one-line edits (grep `POST-COPY PATCH`) restore it:
- in `_take(f)`: add `this._rawFile = f;`
- in `start()`: `file: null` → `file: this._rawFile`
Cleanest long-term: fold these into the Claude Design source so repackages keep
them. Until then, re-apply after any regeneration.

Read `README.md` first for what the UI does and the file map.

## The one integration point

`window.CubeEngine.transcribe(opts, callbacks) -> { promise, cancel }`

- Full parameter/callback/result shapes: header comment of `engine.js`.
  Keep the contract, replace the internals, set `window.CubeEngine.demo =
  false` (the UI shows a "DEMO ENGINE" tag in the result meta while true).
- Result dict is whisper-JSON-compatible — the same shape
  `backend-ref/formats.py` consumes; `formats.js` in this folder is the
  byte-parity JS port (keep the two in sync forever).
- UI mapping: `onLoadProgress` → the dashed ghost outline brightens (model
  download); `onProgress` → the 27 blocks lock home (bottom-up, hue flash);
  `onSegment` → glyph-decode transcript lines; `onStatus` → the red-ticked
  mono status line (send human-readable strings, they render verbatim).
- Recommended: `@huggingface/transformers` ASR pipeline in a **Web Worker**
  (`onnx-community/whisper-{tiny|base|small|…}`, distil variants where
  available). Decode audio via `AudioContext.decodeAudioData` → 16kHz mono
  Float32; fall back to ffmpeg.wasm for exotic containers (.caf, .amr, .wmv,
  .3gp…).
- `task: 'subtitles'` === `'transcribe'` engine-side (it only preselects the
  `.srt` output in the UI). `'translate'` = whisper translate task.

## Known gaps / decisions for you

> Status: **#3, #4, #5, #8, #9, #10 handled** by the engine wiring. **#1** is
> partly handled (status line announces the first-run model download + size);
> the Cache API caching is automatic via transformers.js. **Still open (polish,
> optional): #2 (self-host the IBM Plex Mono fonts) and #7 (wire the `<head>`
> title / favicon / OG meta)** — both live in the generated `index.html`, so do
> them as post-copy patches or fold them into the Claude Design source.
> One accepted difference (item C): the browser `.json` omits the per-segment
> `avg_logprob` / `compression_ratio` / `no_speech_prob` stats the Python tool
> emits (transformers.js doesn't surface them); `.md`/`.srt`/`.txt` are identical.

1. **Model download UX.** First visit pulls tens of MB per model. The UI
   already surfaces `onLoadProgress` + `onStatus`; cache via the Cache API
   and send a status like "first run downloads the small model (~40 MB)".
2. **Fonts are on the Google Fonts CDN** (IBM Plex Mono — see the `<link>`
   tags in `index.html` `<head>`). Brief requires self-hosting: download the
   woff2s, add `@font-face`, verify. The only external dependency left.
3. **Runtime.** `index.html` is a Design Component page and needs
   `support.js` (React-based runtime) served alongside — it runs from any
   static server as-is. Ship-as-is is the low-risk path; a pure-vanilla port
   is possible but is a rewrite, not a cleanup.
4. **`AUDIO_EXTS` parity.** The accepted-extension list in `index.html`
   (`this.EXTS`, 27 entries) mirrors `backend-ref/transcribe.py`. Keep in
   sync.
5. **Filename conventions** match the Python tool: `{stem}.md` (clean,
   stable), `{stem}_{YYYYMMDD_HHMMSS}.{srt,txt,json}`.
6. **Long files.** Consider a soft `onStatus` warning when
   `fileDuration > ~20 min` and model ≥ medium — in-browser decode is slow.
7. **SEO/head.** Assets are provided — `favicon.svg` and `og.png` (1200×630)
   sit in this folder; wire the `<link rel="icon">` + og/twitter meta tags.
   Title/description are not set.
   Suggested title: "The Cube — free private transcription, in your browser";
   canonical https://cube.august.style.
   No analytics that could touch transcript text — the privacy claim is
   architectural and must stay true.
8. **Reduced motion** is handled (no scatter, no sway). Don't break it.
9. **No demo mode ships.** The canned reel in `engine.js` is dev scaffolding
   only — replace it wholesale; do not keep a sample path. A visitor seeing
   it work on their own file IS the demo.
10. **Repackaging loop.** Design edits happen in the Claude project; this
   folder is refreshed by copying `The Cube.dc.html → index.html` +
   `support.js`/`engine.js`/`formats.js`. Treat `index.html` as generated —
   don't hand-edit it here or edits will be lost on the next repackage. If
   you must patch (e.g. adding `<head>` meta), do it as a documented
   post-copy step or ask the design side to fold it in.

## Testing checklist

- Drop + picker (tap the blue ↑ block) both accept the 27 extensions and
  reject others with the inline vermilion error.
- Layer taps and ‹ › chips advance dials; choosing "Subtitles" force-enables
  `.srt`.
- Run with 0 outputs selected is blocked (button disabled state).
- Cancel path: `new file` mid-run calls `cancel()` — promise must reject
  with `Error('cancelled')` and the UI ignores it.
- Downloads match the Python outputs byte-for-byte for the same result dict.
- Reset returns every colored block to its home seat (layer angles unwind).
- `prefers-reduced-motion`: blocks stay seated during processing; lines
  brighten as progress instead.
