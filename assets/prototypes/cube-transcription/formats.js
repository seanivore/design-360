/*
 * formats.js — JS port of backend-ref/formats.py
 * Output parity contract: the .md / .srt / .txt / .json produced here must
 * match the Python tool byte-for-byte (timestamp formats, layouts, trailing
 * newlines). Any change here must be mirrored in app/formats.py and vice versa.
 *
 * Input shape everywhere: a whisper-compatible result dict —
 *   { text, language, duration, segments: [{ id, seek, start, end, text, ... }] }
 */
(function () {
  'use strict';

  /** Seconds -> human-readable HH:MM:SS (rounded to the nearest second). */
  function hms(seconds) {
    var total = Math.round(Number(seconds));
    var h = Math.floor(total / 3600);
    var rem = total % 3600;
    var m = Math.floor(rem / 60);
    var s = rem % 60;
    return pad2(h) + ':' + pad2(m) + ':' + pad2(s);
  }

  /** Seconds -> SRT timestamp HH:MM:SS,mmm */
  function srtTime(seconds) {
    var totalMs = Math.round(Number(seconds) * 1000);
    var ms = totalMs % 1000;
    var totalS = Math.floor(totalMs / 1000);
    var s = totalS % 60;
    var totalM = Math.floor(totalS / 60);
    var m = totalM % 60;
    var h = Math.floor(totalM / 60);
    return pad2(h) + ':' + pad2(m) + ':' + pad2(s) + ',' + pad3(ms);
  }

  function pad2(n) { return String(n).padStart(2, '0'); }
  function pad3(n) { return String(n).padStart(3, '0'); }

  /** Human-readable timestamped transcript: `[HH:MM:SS – HH:MM:SS] text` per segment. */
  function toMarkdown(result, title) {
    var out = '# ' + title + '\n\n';
    (result.segments || []).forEach(function (seg) {
      out += '[' + hms(seg.start) + ' \u2013 ' + hms(seg.end) + '] ' + seg.text.trim() + '\n\n';
    });
    return out;
  }

  /** Standard SubRip (.srt) subtitles. */
  function toSRT(result) {
    var blocks = (result.segments || []).map(function (seg, i) {
      return (i + 1) + '\n' + srtTime(seg.start) + ' --> ' + srtTime(seg.end) + '\n' + seg.text.trim() + '\n';
    });
    return blocks.join('\n');
  }

  /** Plain-text lump (the full transcript). */
  function toText(result) {
    return (result.text || '').trim() + '\n';
  }

  /** Full result as JSON (whisper-compatible schema). */
  function toJSON(result) {
    return JSON.stringify(result, null, 2);
  }

  /** Timestamp used in output filenames, matching Python: YYYYMMDD_HHMMSS */
  function stamp(date) {
    var d = date || new Date();
    return '' + d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) +
      '_' + pad2(d.getHours()) + pad2(d.getMinutes()) + pad2(d.getSeconds());
  }

  window.CubeFormats = {
    hms: hms,
    srtTime: srtTime,
    toMarkdown: toMarkdown,
    toSRT: toSRT,
    toText: toText,
    toJSON: toJSON,
    stamp: stamp
  };
})();
