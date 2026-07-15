/*
 * engine.js — THE SEAM.
 * =====================
 * This file is the single integration point for the real in-browser Whisper
 * engine (transformers.js / whisper.cpp WASM). The UI only ever talks to
 * `window.CubeEngine.transcribe(...)`. Replace this file's internals, keep the
 * contract below, and the whole UI works against real transcription.
 *
 * CONTRACT
 * --------
 * window.CubeEngine.demo : boolean — true while this simulated engine is live.
 *
 * window.CubeEngine.transcribe(opts, callbacks) -> { promise, cancel() }
 *
 *   opts = {
 *     file:         File | null   // the user's actual file (unused by the demo)
 *     model:        'tiny'|'base'|'small'|'medium'|'large-v3'
 *     language:     'auto'|'en'|'es'|...   // BCP-ish code; 'auto' = detect
 *     task:         'transcribe'|'subtitles'|'translate'
 *     fileDuration: number|null   // seconds, probed from media metadata
 *     demoSeconds:  number        // demo pacing only — remove in real impl
 *   }
 *
 *   callbacks = {
 *     onStatus(text)        // human-readable stage: loading model, listening…
 *     onLoadProgress(p)     // 0..1 model download/warmup progress
 *     onSegment(seg)        // one whisper segment as soon as it's final:
 *                           //   { id, seek, start, end, text,
 *                           //     avg_logprob, compression_ratio, no_speech_prob }
 *     onProgress(p)         // 0..1 overall transcription progress
 *   }
 *
 *   promise resolves with the whisper-compatible result dict (the same shape
 *   backend-ref/formats.py consumes):
 *     { text, language, duration, segments: [...] }
 *
 *   cancel() aborts; the promise then rejects with Error('cancelled').
 *
 * REAL IMPLEMENTATION NOTES (for Claude Code)
 * -------------------------------------------
 * - transformers.js: pipeline('automatic-speech-recognition',
 *   'onnx-community/whisper-<model>'), chunk_length_s + stride, and map its
 *   chunk callbacks onto onSegment/onProgress. Run in a Web Worker.
 *   `onnx-community/whisper-base` etc.; distil models for speed.
 * - Decode audio to 16kHz mono PCM via AudioContext.decodeAudioData;
 *   fall back to ffmpeg.wasm for exotic containers (.caf, .amr, .wmv …).
 * - onLoadProgress should be wired to the model download (first visit is
 *   tens of MB) — the UI shows it on the ghost outline.
 * - 'subtitles' task === 'transcribe'; it only changes which outputs the UI
 *   preselects. 'translate' maps to whisper's translate task (to English).
 */
(function () {
  'use strict';

  // A demo reel that explains itself. Timestamps are scaled to the dropped
  // file's real duration when we know it.
  var DEMO = [
    [0, 6, "This is a demonstration reel — a stand-in voice while the real engine is wired in."],
    [6, 13, "When The Cube ships, the words settling here will be your own, pulled straight from the file you dropped in."],
    [13, 20, "Everything happens on your machine. The audio never leaves this page, and nothing is uploaded anywhere."],
    [20, 26, "No accounts, no queue, no server. A small model wakes up inside your browser and just listens."],
    [26, 33, "Accuracy is a dial, not a promise. Small models are quick; the big ones take their time and catch more."],
    [33, 40, "Subtitles come out as standard SRT. Transcripts come out as timestamped Markdown, like the lines you are reading."],
    [40, 46, "There is plain text if you want a clean block, and raw JSON if you want every number the model produced."],
    [46, 53, "While it works, the cube comes apart and finds itself again — each block clicking home as another passage resolves."],
    [53, 59, "There is nothing to count and no bar to watch. When the shape is whole, the work is done."],
    [59, 64, "You will know before you have read a word."],
    [64, 71, "Drop another file whenever you like. The Cube keeps nothing, because it never sends anything."],
    [71, 76, "Until then, this loop keeps the seat warm. Thanks for listening to a cube talk about itself."]
  ];
  var DEMO_TOTAL = 76;

  function transcribe(opts, cb) {
    cb = cb || {};
    var cancelled = false;
    var timers = [];
    var promiseRejecter = null;
    var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };

    var scale = (opts && opts.fileDuration && opts.fileDuration > 1)
      ? opts.fileDuration / DEMO_TOTAL : 1;

    var segments = DEMO.map(function (row, i) {
      return {
        id: i,
        seek: 0,
        start: Math.round(row[0] * scale * 1000) / 1000,
        end: Math.round(row[1] * scale * 1000) / 1000,
        text: ' ' + row[2],
        avg_logprob: -0.21,
        compression_ratio: 1.31,
        no_speech_prob: 0.012
      };
    });

    var result = {
      text: segments.map(function (s) { return s.text; }).join('').trim(),
      language: (opts && opts.language && opts.language !== 'auto') ? opts.language : 'en',
      duration: Math.round(DEMO_TOTAL * scale * 1000) / 1000,
      segments: segments
    };

    var promise = new Promise(function (resolve, reject) {
      var T = Math.max(4, (opts && opts.demoSeconds) || 14) * 1000;
      var LOAD = Math.min(2200, T * 0.18);
      var N = segments.length;

      if (cb.onStatus) cb.onStatus('waking the ' + ((opts && opts.model) || 'small') + ' model');

      // Simulated model warmup.
      var loadSteps = 6;
      for (var li = 1; li <= loadSteps; li++) {
        (function (li) {
          later(function () {
            if (cancelled) return;
            if (cb.onLoadProgress) cb.onLoadProgress(li / loadSteps);
            if (li === loadSteps && cb.onStatus) cb.onStatus('listening');
          }, (LOAD * li) / loadSteps);
        })(li);
      }

      // Segments arrive on an easing curve — the gaps shrink toward the end,
      // so the lock-in clicks naturally quicken.
      for (var i = 0; i < N; i++) {
        (function (i) {
          var at = LOAD + (T - LOAD) * Math.pow((i + 1) / N, 0.8);
          later(function () {
            if (cancelled) return;
            if (cb.onSegment) cb.onSegment(segments[i]);
            if (cb.onProgress) cb.onProgress((i + 1) / N);
            if (i === N - 1) resolve(result);
          }, at);
        })(i);
      }

      promiseRejecter = reject;
    });

    return {
      promise: promise,
      cancel: function () {
        cancelled = true;
        timers.forEach(clearTimeout);
        if (promiseRejecter) promiseRejecter(new Error('cancelled'));
      }
    };
  }

  window.CubeEngine = { demo: true, transcribe: transcribe };
})();
