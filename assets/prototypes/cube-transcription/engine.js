/*
 * engine.js — THE SEAM (real engine).
 * ===================================
 * The UI only ever talks to `window.CubeEngine.transcribe(opts, callbacks)`.
 * This is the real implementation of that contract: it decodes the dropped
 * file to 16 kHz mono PCM on the main thread (Web Audio, with an ffmpeg.wasm
 * fallback for exotic containers), then runs Whisper in a Web Worker
 * (worker.js -> transformers.js) and streams the result back through the
 * callbacks. Audio never leaves the browser.
 *
 * CODE-OWNED by Claude Code. Originally seeded by Claude Design as a simulated
 * stub; now the real engine. NOT part of the design export set — do not
 * overwrite on a repackage (see HANDOFF.md).
 *
 * CONTRACT (unchanged from the stub)
 * ----------------------------------
 * window.CubeEngine.demo : false  (the UI hides its "DEMO ENGINE" tag)
 * window.CubeEngine.transcribe(opts, callbacks) -> { promise, cancel() }
 *   opts      = { file, model, language, task, fileDuration, demoSeconds }
 *   callbacks = { onStatus(text), onLoadProgress(0..1), onSegment(seg), onProgress(0..1) }
 *   promise resolves -> { text, language, duration, segments:[{id,seek,start,end,text}] }
 *   cancel() -> promise rejects with Error('cancelled')
 */
(function () {
  'use strict';

  // UI model id -> ONNX repo. Every repo is verified to carry the q4 + quantized
  // ONNX files worker.js requests. `large-v3` maps to large-v3-turbo: the
  // browser-appropriate top tier (large-v3 encoder + a distilled decoder), so
  // "most accurate" stays viable to download and run client-side.
  var MODELS = {
    'tiny':     { repo: 'onnx-community/whisper-tiny',           mb: 40  },
    'base':     { repo: 'onnx-community/whisper-base',           mb: 80  },
    'small':    { repo: 'onnx-community/whisper-small',          mb: 240 },
    'medium':   { repo: 'Xenova/whisper-medium',                mb: 500 },
    'large-v3': { repo: 'onnx-community/whisper-large-v3-turbo', mb: 460 }
  };

  // ---- audio decode (main thread) ------------------------------------------

  function makeCtx() {
    var C = window.AudioContext || window.webkitAudioContext;
    return new C();
  }

  // Render any decoded AudioBuffer down to 16 kHz mono Float32 — what Whisper wants.
  function resampleMono16k(audioBuffer) {
    var rate = 16000;
    var dur = audioBuffer.duration;
    var len = Math.max(1, Math.ceil(dur * rate));
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    var off = new OAC(1, len, rate);
    var src = off.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(off.destination);
    src.start(0);
    return off.startRendering().then(function (rendered) {
      return { pcm: rendered.getChannelData(0), duration: dur };
    });
  }

  // Lazily pulled in only when the browser can't natively decode a container
  // (e.g. .caf, .amr, .wma, .3gp). Single-threaded core — no COOP/COEP needed.
  var _ff = null;
  function loadFfmpeg() {
    if (_ff) return Promise.resolve(_ff);
    // The @ffmpeg/ffmpeg glue is vendored same-origin (vendor/ffmpeg/) so
    // `new FFmpeg()` spawns its worker from this origin — a Worker can't be built
    // from a cross-origin URL, and the worker's own relative imports (./const.js)
    // break from a blob: URL. Only the tiny glue is local; the heavy ~30 MB wasm
    // core stays on the CDN, loaded cross-origin by the same-origin worker (CORS).
    var CORE = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm';
    return Promise.all([
      import('./vendor/ffmpeg/index.js'),
      import('https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/esm/index.js')
    ]).then(function (mods) {
      var FFmpeg = mods[0].FFmpeg, fetchFile = mods[1].fetchFile;
      var inst = new FFmpeg();
      return inst.load({
        coreURL: CORE + '/ffmpeg-core.js',
        wasmURL: CORE + '/ffmpeg-core.wasm'
      }).then(function () { _ff = { inst: inst, fetchFile: fetchFile }; return _ff; });
    });
  }

  function ffmpegDecode(file) {
    return loadFfmpeg().then(function (ff) {
      return ff.fetchFile(file)
        .then(function (data) { return ff.inst.writeFile('in', data); })
        .then(function () { return ff.inst.exec(['-i', 'in', '-ar', '16000', '-ac', '1', '-f', 'wav', 'out.wav']); })
        .then(function () { return ff.inst.readFile('out.wav'); })
        .then(function (out) { return makeCtx().decodeAudioData(out.buffer.slice(0)); });
    });
  }

  function decodeToPCM(file, onStatus) {
    return file.arrayBuffer().then(function (buf) {
      var ctx = makeCtx();
      // slice(0) — decodeAudioData detaches the buffer; keep our copy intact.
      return ctx.decodeAudioData(buf.slice(0)).then(
        function (ab) { try { ctx.close(); } catch (e) {} return ab; },
        function () {
          try { ctx.close(); } catch (e) {}
          if (onStatus) onStatus('converting audio format');
          return ffmpegDecode(file);
        }
      );
    }).then(resampleMono16k);
  }

  // ---- result normalization ------------------------------------------------

  // transformers.js -> the whisper-compatible dict formats.js/the UI consume.
  // Note: the browser engine does not surface avg_logprob / compression_ratio /
  // no_speech_prob, so those per-segment stats are omitted here (the .md/.srt/
  // .txt outputs don't use them; only the .json differs from the Python tool).
  function buildResult(raw, opts, duration) {
    raw = raw || {};
    var chunks = raw.chunks || [];
    var segments = [];
    for (var i = 0; i < chunks.length; i++) {
      var ts = chunks[i].timestamp || [];
      var start = (typeof ts[0] === 'number') ? ts[0] : (i ? segments[i - 1].end : 0);
      var end = (typeof ts[1] === 'number') ? ts[1] : (duration || start);
      segments.push({
        id: i,
        seek: 0,
        start: Math.round(start * 1000) / 1000,
        end: Math.round(end * 1000) / 1000,
        text: chunks[i].text || ''
      });
    }
    var text = (raw.text != null ? raw.text : segments.map(function (s) { return s.text; }).join('')).trim();
    return {
      text: text,
      language: (opts.language && opts.language !== 'auto') ? opts.language : 'auto',
      duration: Math.round((duration || 0) * 1000) / 1000,
      segments: segments
    };
  }

  // ---- the seam ------------------------------------------------------------

  function transcribe(opts, cb) {
    opts = opts || {}; cb = cb || {};
    var modelKey = opts.model || 'small';
    var model = MODELS[modelKey] || MODELS['small'];
    var worker = new Worker('worker.js', { type: 'module' });

    var cancelled = false;
    var emitTimer = null;
    var loadFiles = {};   // per-file download fractions, for a smooth ghost outline
    var pcm = null;
    var rejectFn = null;

    function say(t) { if (!cancelled && cb.onStatus) cb.onStatus(t); }
    function loadProg(p) { if (!cancelled && cb.onLoadProgress) cb.onLoadProgress(Math.max(0, Math.min(1, p))); }
    function cleanup() {
      try { worker.terminate(); } catch (e) {}
      if (emitTimer) { clearTimeout(emitTimer); emitTimer = null; }
    }

    var promise = new Promise(function (resolve, reject) {
      rejectFn = reject;

      // Decode the audio while the model downloads — the two run in parallel.
      var decodePromise = opts.file
        ? decodeToPCM(opts.file, say)
        : Promise.reject(new Error('no audio file provided'));
      decodePromise.catch(function () {}); // avoid an unhandled-rejection warning; handled in afterReady

      function afterReady() {
        loadProg(1);
        say('decoding audio');
        decodePromise.then(function (r) {
          if (cancelled) return;
          pcm = r;
          say('listening');
          // Transfer the PCM buffer to the worker (zero-copy).
          worker.postMessage({
            type: 'run',
            audio: r.pcm,
            language: opts.language,
            task: (opts.task === 'translate') ? 'translate' : 'transcribe'
          }, [r.pcm.buffer]);
        }, function (e) {
          cleanup();
          reject(new Error('could not read that audio — ' + ((e && e.message) || 'unsupported file')));
        });
      }

      // On completion, emit segments one-by-one so the cube's blocks lock home
      // and the transcript lines decode in the signature sequence.
      function done(raw) {
        var result = buildResult(raw, opts, pcm ? pcm.duration : opts.fileDuration);
        var segs = result.segments;
        if (!segs.length) { loadProg(1); cleanup(); resolve(result); return; }
        var i = 0;
        var gap = Math.max(60, Math.min(240, Math.round(1600 / segs.length)));
        (function step() {
          if (cancelled) return;
          if (i >= segs.length) { if (cb.onProgress) cb.onProgress(1); cleanup(); resolve(result); return; }
          if (cb.onSegment) cb.onSegment(segs[i]);
          if (cb.onProgress) cb.onProgress((i + 1) / segs.length);
          i++;
          emitTimer = setTimeout(step, gap);
        })();
      }

      worker.onmessage = function (e) {
        if (cancelled) return;
        var msg = e.data || {};
        switch (msg.type) {
          case 'progress': {
            var d = msg.data || {};
            if (d.status === 'progress' && d.file && typeof d.loaded === 'number' && typeof d.total === 'number') {
              loadFiles[d.file] = d.loaded / Math.max(1, d.total);
              var ks = Object.keys(loadFiles), sum = 0;
              for (var j = 0; j < ks.length; j++) sum += loadFiles[ks[j]];
              loadProg(sum / ks.length);
            } else if (d.status === 'initiate') {
              say('first run downloads the ' + modelKey + ' model (~' + model.mb + ' MB)');
            }
            break;
          }
          case 'status': say(msg.data); break;
          case 'ready': afterReady(); break;
          case 'complete': done(msg.data); break;
          case 'error': cleanup(); reject(new Error(msg.data || 'transcription failed')); break;
        }
      };
      worker.onerror = function (err) {
        cleanup();
        reject(new Error((err && err.message) || 'the transcription engine failed to start'));
      };

      say('waking the ' + modelKey + ' model');
      worker.postMessage({ type: 'load', model_id: model.repo });
    });

    return {
      promise: promise,
      cancel: function () {
        if (cancelled) return;
        cancelled = true;
        cleanup();
        if (rejectFn) rejectFn(new Error('cancelled'));
      }
    };
  }

  window.CubeEngine = { demo: false, transcribe: transcribe };
})();
