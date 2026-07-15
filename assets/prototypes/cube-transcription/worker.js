// worker.js — real in-browser Whisper transcription (transformers.js v3).
// ---------------------------------------------------------------------------
// Runs off the main thread so the cube animation never stutters. The main
// thread (engine.js) decodes the audio to 16 kHz mono PCM and hands it here;
// this worker loads the ONNX Whisper model and returns whisper-shaped output.
//
// CODE-OWNED by Claude Code. This file is NOT part of the Claude Design export
// set — do not overwrite it on a design repackage (see HANDOFF.md).
// ---------------------------------------------------------------------------
// jsdelivr's /+esm endpoint flattens the dependency graph (resolves the bare
// onnxruntime-common/onnxruntime-web specifiers) so this loads buildless — no
// bundler required. The pre-bundled dist/*.web.js files do NOT (they externalize
// ort for a bundler), so don't "simplify" this back to a dist path.
import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.1/+esm";

// Per-device quantization. Every model in engine.js's ladder has been verified
// to ship these exact ONNX files (encoder_model_q4 + decoder_model_merged_q4,
// and the *_quantized fallbacks), so neither config 404s at runtime.
const CFG = {
  webgpu: { device: "webgpu", dtype: { encoder_model: "q4", decoder_model_merged: "q4" } },
  wasm:   { device: "wasm",   dtype: "q8" }
};

let pipe = null;

async function build(model_id, device) {
  pipe = await pipeline("automatic-speech-recognition", model_id, {
    ...CFG[device],
    progress_callback: (x) => self.postMessage({ type: "progress", data: x })
  });
}

async function load({ model_id }) {
  // WebGPU when the browser has it (fast, needs no COOP/COEP headers), else
  // CPU/WASM single-threaded. If WebGPU init throws, fall back to WASM.
  let device = (typeof navigator !== "undefined" && navigator.gpu) ? "webgpu" : "wasm";
  try {
    await build(model_id, device);
  } catch (err) {
    if (device === "webgpu") {
      self.postMessage({ type: "status", data: "WebGPU unavailable — using CPU (slower)" });
      device = "wasm";
      try {
        await build(model_id, device);
      } catch (e2) {
        self.postMessage({ type: "error", data: String((e2 && e2.message) || e2) });
        return;
      }
    } else {
      self.postMessage({ type: "error", data: String((err && err.message) || err) });
      return;
    }
  }

  if (device === "webgpu") {
    // Compile shaders / warm the graph on silence so the first real run is snappy.
    self.postMessage({ type: "status", data: "warming up the model" });
    try { await pipe(new Float32Array(16000), { language: "en" }); } catch (e) { /* non-fatal */ }
  }

  self.postMessage({ type: "ready", device });
}

async function run({ audio, language, task }) {
  try {
    // return_timestamps: true -> segment-level chunks [{ timestamp:[s,e], text }].
    const opts = { return_timestamps: true, chunk_length_s: 30, task: task || "transcribe" };
    if (language && language !== "auto") opts.language = language; // omit => Whisper auto-detects
    const result = await pipe(audio, opts);
    self.postMessage({ type: "complete", data: result });
  } catch (err) {
    self.postMessage({ type: "error", data: String((err && err.message) || err) });
  }
}

self.addEventListener("message", (e) => {
  const m = e.data || {};
  if (m.type === "load") load(m);
  else if (m.type === "run") run(m);
});
