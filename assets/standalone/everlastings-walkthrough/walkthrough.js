/* Using your website — player, captions, transcript.
   Reads VIDEOS + SECTIONS from videos.js. No dependencies, no build. */

(() => {
  'use strict';

  const video = document.getElementById('player');
  const capEl = document.querySelector('[data-caption]');
  const nowN = document.querySelector('[data-now-n]');
  const nowTitle = document.querySelector('[data-now-title]');
  const listEl = document.querySelector('[data-episodes]');
  const trEl = document.querySelector('[data-transcript]');
  const trList = document.querySelector('[data-transcript-list]');
  const trToggle = document.querySelector('[data-transcript-toggle]');
  const trLabel = document.querySelector('[data-transcript-label]');

  const STORE = 'everlastings.walkthrough.progress';
  const RESUME_FLOOR = 5;   // don't bother resuming the first few seconds
  const RESUME_TAIL = 10;   // finished-ish: start it over rather than resume the credits

  let current = null;       // the loaded video object
  let cues = [];            // parsed cues for the loaded video
  let cueIdx = -1;          // index of the cue currently on screen

  // ── persistence ───────────────────────────────────────────────────────

  const readProgress = () => {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
  };
  const writeProgress = (id, seconds) => {
    try {
      const all = readProgress();
      all[id] = seconds;
      localStorage.setItem(STORE, JSON.stringify(all));
    } catch { /* private mode — progress just won't persist */ }
  };

  // ── formatting ────────────────────────────────────────────────────────

  const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // ── WebVTT ────────────────────────────────────────────────────────────

  const stamp = (t) => {
    // HH:MM:SS.mmm or MM:SS.mmm
    const p = t.trim().split(':').map(parseFloat);
    return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1];
  };

  const parseVTT = (text) => {
    const out = [];
    for (const block of text.replace(/\r/g, '').split(/\n\n+/)) {
      const lines = block.split('\n').filter(Boolean);
      const tl = lines.findIndex((l) => l.includes('-->'));
      if (tl === -1) continue;
      const [a, b] = lines[tl].split('-->');
      const body = lines.slice(tl + 1).join(' ').trim();
      if (!body) continue;
      // b keeps the space after the arrow, so trim BEFORE splitting — otherwise the first
      // field is the empty string and every end time parses as NaN.
      out.push({ start: stamp(a), end: stamp(b.trim().split(/\s+/)[0]), text: body });
    }
    return out.sort((x, y) => x.start - y.start);
  };

  // The line on screen is the last one she has started saying. Deliberately NOT
  // "the cue whose span contains t" — these are auto-transcribed, so consecutive cues
  // have sub-second gaps, and honouring them would blink the line away between breaths.
  // Holding the last line until the next one begins is what reading along actually wants.
  const cueAt = (t) => {
    if (!cues.length || t < cues[0].start) return -1;
    let lo = 0, hi = cues.length - 1, found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (cues[mid].start <= t) { found = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return found;
  };

  // ── caption line ──────────────────────────────────────────────────────

  const paintCaption = (i) => {
    if (i === cueIdx) return;
    cueIdx = i;

    const next = i === -1 ? '' : cues[i].text;
    capEl.dataset.fading = '1';
    setTimeout(() => {
      capEl.textContent = '';
      if (next) {
        capEl.textContent = next;
      } else {
        const rest = document.createElement('span');
        rest.className = 'spoken__rest';
        rest.textContent = cues.length ? '…' : 'No transcript for this one.';
        capEl.appendChild(rest);
      }
      capEl.dataset.fading = '0';
    }, 140);

    // mirror into the transcript
    trList.querySelectorAll('.cue[aria-current="true"]').forEach((el) => el.removeAttribute('aria-current'));
    if (i === -1) return;
    const row = trList.children[i]?.firstElementChild;
    if (!row) return;
    row.setAttribute('aria-current', 'true');
    if (!trEl.hidden) {
      const rTop = row.offsetTop, rBot = rTop + row.offsetHeight;
      if (rTop < trEl.scrollTop || rBot > trEl.scrollTop + trEl.clientHeight) {
        trEl.scrollTo({ top: rTop - trEl.clientHeight / 2 + row.offsetHeight / 2, behavior: 'smooth' });
      }
    }
  };

  const paintTranscript = () => {
    trList.textContent = '';
    for (const c of cues) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cue';
      b.innerHTML = `<span class="cue__t">${clock(c.start)}</span><span class="cue__x"></span>`;
      b.querySelector('.cue__x').textContent = c.text;
      b.addEventListener('click', () => {
        video.currentTime = c.start + 0.01;
        video.play().catch(() => {});
      });
      li.appendChild(b);
      trList.appendChild(li);
    }
    trToggle.hidden = cues.length === 0;
  };

  // ── episode rows ──────────────────────────────────────────────────────

  const rowFor = (id) => listEl.querySelector(`.row[data-id="${id}"]`);

  const buildList = () => {
    const progress = readProgress();
    for (const sec of SECTIONS) {
      const films = VIDEOS.filter((v) => v.section === sec.id);
      if (!films.length) continue;

      const arc = document.createElement('section');
      arc.className = 'arc';

      const head = document.createElement('div');
      head.className = 'arc__head';
      const h = document.createElement('h2');
      h.className = 'arc__label';
      h.textContent = sec.label;
      const note = document.createElement('p');
      note.className = 'arc__note';
      note.textContent = sec.note;
      head.append(h, note);
      arc.appendChild(head);

      for (const v of films) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'row';
        btn.dataset.id = v.id;
        btn.innerHTML = `
          <span class="row__n mono">${v.id}</span>
          <span class="row__body">
            <span class="row__title"></span>
            <span class="row__blurb"></span>
          </span>
          <span class="row__meta">
            <span class="eq" aria-hidden="true"><span></span><span></span><span></span></span>
            <span class="row__dur mono">${clock(v.duration)}</span>
          </span>
          <span class="row__progress"></span>`;
        btn.querySelector('.row__title').textContent = v.title;
        btn.querySelector('.row__blurb').textContent = v.blurb;

        const seen = progress[v.id] || 0;
        if (seen > RESUME_FLOOR) {
          btn.querySelector('.row__progress').style.width = `${Math.min(100, (seen / v.duration) * 100)}%`;
          if (seen >= v.duration - RESUME_TAIL) btn.querySelector('.row__n').dataset.watched = '1';
        }

        btn.addEventListener('click', () => load(v, { autoplay: true }));
        arc.appendChild(btn);
      }
      listEl.appendChild(arc);
    }
  };

  // ── load a film ───────────────────────────────────────────────────────

  async function load(v, { autoplay = false } = {}) {
    if (current && current.id === v.id) {
      video.play().catch(() => {});
      return;
    }
    current = v;

    // reset caption state before the new cues land
    cues = [];
    cueIdx = -2;
    capEl.textContent = '';

    video.pause();
    video.poster = v.poster;
    video.src = v.src;

    // The track exists so the browser's own CC button is there for anyone who wants
    // captions burned on the video — but it is NOT default-on, because the whole point
    // of this page is that her words are read UNDER the film, not over it.
    video.querySelectorAll('track').forEach((t) => t.remove());
    const track = document.createElement('track');
    track.kind = 'captions';
    track.label = 'English';
    track.srclang = 'en';
    track.src = v.captions;
    video.appendChild(track);

    nowN.textContent = v.id;
    nowTitle.textContent = v.title;

    listEl.querySelectorAll('.row').forEach((r) => {
      r.removeAttribute('aria-current');
      r.dataset.playing = '0';
    });
    rowFor(v.id)?.setAttribute('aria-current', 'true');

    if (history.replaceState) history.replaceState(null, '', `#${v.n}`);

    // captions
    try {
      const res = await fetch(v.captions);
      if (!res.ok) throw new Error(String(res.status));
      cues = parseVTT(await res.text());
    } catch {
      cues = [];
    }
    if (current !== v) return;            // a newer load won the race
    paintTranscript();
    cueIdx = -2;
    paintCaption(-1);

    // resume where they left off
    const seen = readProgress()[v.id] || 0;
    const resume = seen > RESUME_FLOOR && seen < v.duration - RESUME_TAIL ? seen : 0;
    const start = () => { if (resume) video.currentTime = resume; };
    if (video.readyState >= 1) start();
    else video.addEventListener('loadedmetadata', start, { once: true });

    if (autoplay) video.play().catch(() => {});
  }

  // ── player events ─────────────────────────────────────────────────────

  let lastSave = 0;
  video.addEventListener('timeupdate', () => {
    if (!current) return;
    paintCaption(cueAt(video.currentTime));

    const row = rowFor(current.id);
    if (row) {
      row.querySelector('.row__progress').style.width =
        `${Math.min(100, (video.currentTime / current.duration) * 100)}%`;
    }
    if (video.currentTime - lastSave > 4 || lastSave > video.currentTime) {
      lastSave = video.currentTime;
      writeProgress(current.id, video.currentTime);
    }
  });

  video.addEventListener('play', () => {
    if (current) { const r = rowFor(current.id); if (r) r.dataset.playing = '1'; }
  });
  const stopEq = () => {
    if (current) { const r = rowFor(current.id); if (r) r.dataset.playing = '0'; }
  };
  video.addEventListener('pause', stopEq);

  video.addEventListener('ended', () => {
    stopEq();
    if (!current) return;
    writeProgress(current.id, current.duration);
    rowFor(current.id)?.querySelector('.row__n')?.setAttribute('data-watched', '1');
    const next = VIDEOS[VIDEOS.indexOf(current) + 1];
    if (next) load(next, { autoplay: true });
  });

  // ── transcript toggle ─────────────────────────────────────────────────

  trToggle.addEventListener('click', () => {
    const open = trEl.hidden;
    trEl.hidden = !open;
    trToggle.setAttribute('aria-expanded', String(open));
    trLabel.textContent = open ? 'Hide transcript' : 'Full transcript';
    if (open && cueIdx >= 0) {
      const row = trList.children[cueIdx]?.firstElementChild;
      if (row) trEl.scrollTop = row.offsetTop - trEl.clientHeight / 2 + row.offsetHeight / 2;
    }
  });

  // ── boot ──────────────────────────────────────────────────────────────

  buildList();

  const total = VIDEOS.reduce((n, v) => n + v.duration, 0);
  const totalEl = document.querySelector('[data-total-runtime]');
  if (totalEl) totalEl.textContent = String(Math.round(total / 60));

  const fromHash = () => {
    const n = parseInt(location.hash.replace('#', ''), 10);
    return VIDEOS.find((v) => v.n === n);
  };

  const first = fromHash() || VIDEOS[0];
  load(first, { autoplay: false });

  window.addEventListener('hashchange', () => {
    const v = fromHash();
    if (v && (!current || v.id !== current.id)) load(v, { autoplay: true });
  });
})();
