/* ============================================================
   JoosAtlas — library registry  (v12 "Library")
   ------------------------------------------------------------
   ONE ENTRY IN `items` = ONE THING ON THE SITE.

   Add a block here and it appears, in both languages, in
     · the home index            (index.html  → Current coordinates)
     · the library shelf         (library.html)
     · the ⌘K command palette    (every page)
   Set `home:true` to hang it as a plate on the home page as well.

   Field guide
     id       unique slug, also the folder / file name
     kind     research | manual | film | lab | tool
     code     the short label shown in the index
     href     where it opens; leave it out while the entry is not public
     state    open | review | building | planned   (colour of the label)
     status   the label itself, written in full, both languages
     date     first public date, YYYY-MM-DD
     title, line, meta, content   { en, ko }
     thumb    4:3 image for the shelf     cover   wide image for a plate
     poster / video / duration            film only

   새 자료를 올릴 때는 docs/CONTENT_GUIDE_KR.md 를 보십시오.
   ============================================================ */
(() => {
'use strict';

const LIB = window.JOOS_LIBRARY = {
  updated: '2026-11-26',

  kinds: {
    research: { en:'Research',     ko:'연구' },
    manual:   { en:'Field manual', ko:'현장 교재' },
    film:     { en:'Film',         ko:'영상' },
    lab:      { en:'Lab',          ko:'실험' },
    tool:     { en:'Tool',         ko:'도구' }
  },

  /* what each label is allowed to mean — shown on library.html */
  states: {
    open:     { en:'Open',           ko:'공개' },
    review:   { en:'Under review',   ko:'심사 중' },
    building: { en:'In development', ko:'개발 중' },
    planned:  { en:'Planned',        ko:'계획' }
  },

  items: [
    {
      id:'case-001', kind:'research', code:'001', href:'case-001.html',
      state:'review', date:'2026-08-07',
      title:  { en:'Spatial Evidence', ko:'공간 증거' },
      line:   { en:'Can one fixed, oblique camera hold a fire-watch line where the ground says it is? A surveyed ring, a boundary generated from it, and check targets that take no part in the fit.',
                ko:'고정된 경사 카메라 한 대가 그은 화재감시선은 지상의 그 자리에 있는가. 측량한 링, 거기서 생성한 경계, 그리고 맞춤에 쓰지 않은 확인 표적.' },
      status: { en:'Paper under review', ko:'논문 심사 중' },
      meta:   { en:'Theory · sensitivity lab · selected evidence · claim boundary', ko:'이론 · 감도 실험실 · 선별 증거 · 주장 경계' },
      content:{ en:'English · Korean', ko:'영어 · 한국어' },
      thumb:'assets/images/field-layout-800.webp',
      alt:    { en:'Field geometry, camera placements and overhead photographs of Case 001.', ko:'Case 001의 현장 기하, 카메라 배치, 상공 사진.' },
      keys:'case study survey photogrammetry boundary audit fire-watch line hot work check target 공간 증거 연구 논문 화재감시선 확인 표적'
    },
    {
      id:'thesis-2023', kind:'research', code:'MSc', href:'thesis-2023.html',
      state:'open', date:'2026-11-26',
      title:  { en:'Detection of Fire Hazard Factors on Construction Sites using YOLOv5', ko:'YOLOv5를 활용한 건설현장 화재위험요소의 탐지에 대한 연구' },
      line:   { en:'My master\'s thesis, read in plain language: a camera that tells a welding spark from a fire, what went wrong with the first labels, and what the numbers do and do not show.',
                ko:'석사논문을 풀어서 읽습니다. 용접 불꽃과 화재를 구분하는 카메라, 처음 라벨에서 틀렸던 것, 그리고 숫자가 말하는 것과 말하지 않는 것.' },
      status: { en:'Master\'s thesis · 2023', ko:'석사학위논문 · 2023' },
      meta:   { en:'Yonsei University · three classes · 18,\u2060000 training images · eight models compared', ko:'연세대학교 · 클래스 3개 · 학습 이미지 18,\u2060000장 · 모델 8종 비교' },
      content:{ en:'English · Korean', ko:'영어 · 한국어' },
      thumb:'assets/images/welding-wide-800.webp',
      alt:    { en:'Yonghoe JOO welding in an industrial workshop.', ko:'작업장에서 용접하는 주용회.' },
      keys:'thesis master yolo yolov5 fire welding spark detection construction deep learning focal loss mAP 석사 논문 학위논문 화재 탐지 용접 불꽃 건설현장 딥러닝'
    },
    {
      id:'manual-001', kind:'manual', code:'M·001', href:'manual-001/',
      state:'open', date:'2026-11-26', home:true,
      title:  { en:'Water-Based Fire Protection, Illustrated', ko:'수계소화설비 도해 교재' },
      line:   { en:'From the pump room to the sprinkler head. Press any part of the drawing to read what it is for, how it runs, how it fails and when to call for service.',
                ko:'펌프실에서 스프링클러 헤드까지. 그림의 부품을 누르면 용도, 작동, 고장, 조치, 원리가 열립니다.' },
      status: { en:'Open · unchecked clauses marked', ko:'공개 · 미대조 조문 표시' },
      meta:   { en:'5 chapters · 53 parts · 114 symptoms · 8 decision paths', ko:'5장 · 부품 53 · 증상 114 · 판단 흐름 8' },
      content:{ en:'Korean only', ko:'한국어' },
      thumb:'assets/images/manual-001-cover-800.webp',
      cover:'assets/images/manual-001-cover.webp',
      alt:    { en:'Drawing of a fire pump room: main, engine and jockey pumps, priming tank, pressure chamber and the water path during a fire.', ko:'소방 펌프실 도해. 주펌프, 엔진펌프, 충압펌프, 물올림탱크, 압력챔버와 화재 때의 물길.' },
      cta:    { en:'Open the manual', ko:'교재 열기' },
      keys:'fire pump sprinkler hydrant alarm valve preaction textbook manual 소방 펌프실 스프링클러 소화전 알람밸브 준비작동식 교재 도해 수계소화설비'
    },
    {
      id:'film-001', kind:'film', code:'F·001', href:'thesis-2023.html#film',
      state:'open', date:'2026-11-26',
      title:  { en:'Sparks — 3 mm, a few seconds, 1,\u2060600 °C', ko:'불티 — 3 mm, 몇 초, 1,\u2060600 ℃' },
      line:   { en:'The two-minute film that opens the thesis page: how hot-work sparks become construction-site fires, and the three rules that follow.',
                ko:'석사논문 페이지를 여는 2분 영상. 화기작업의 불티가 공사장 화재가 되는 과정과, 거기서 나오는 규칙 세 가지.' },
      status: { en:'Open · figures set against sources', ko:'공개 · 수치별 근거 대조' },
      meta:   { en:'2 min 03 s · vertical 9:16 · AI-generated', ko:'2분 3초 · 세로 9:16 · AI 제작' },
      content:{ en:'Korean, captioned', ko:'한국어 · 자막' },
      thumb:'media/film-001/thumb.webp',
      poster:'media/film-001/poster.jpg',
      video:'media/film-001/film-001.mp4',
      duration:'2:03',
      alt:    { en:'Close view of a glowing spark with its size marked as 0.3 to 3 mm.', ko:'달아오른 불티의 근접 화면. 크기 0.3~3 mm 표시.' },
      keys:'video film spark welding hot work urethane foam cyanide fire watch 불티 용접 화기작업 우레탄 시안화수소 화재감시자 영상'
    },
    {
      id:'case-002', kind:'research', code:'002',
      state:'building',
      title:  { en:'Fixed-Camera Metrology', ko:'고정 카메라 계측' },
      status: { en:'In development', ko:'개발 중' }
    },
    {
      id:'lab-twin', kind:'lab', code:'LAB',
      state:'planned',
      title:  { en:'Industrial Digital Twin', ko:'산업 디지털 트윈' },
      status: { en:'Exploratory', ko:'탐색 중' }
    },
    {
      id:'tools', kind:'tool', code:'TOOLS',
      state:'planned',
      title:  { en:'Interactive Measurement', ko:'인터랙티브 계측' },
      status: { en:'Planned', ko:'계획' }
    }
  ]
};

/* ------------------------------------------------------------
   Rendering.  Each node carries both languages; switching the
   language repaints text in place, so a playing film is never
   torn down and rebuilt.
   ------------------------------------------------------------ */

const L = () => (document.documentElement.getAttribute('lang') === 'ko' ? 'ko' : 'en');

function el(tag, cls, pair){
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (pair){ n.dataset.en = pair.en; n.dataset.ko = pair.ko; }
  return n;
}
/* Page copy can be bilingual in place: write the English as the element's text
   and the Korean beside it —  <p data-ko="한국어 문장">English sentence</p>.
   Same for alt (data-alt-ko) and aria-label (data-label-ko). Put the class
   `no-i18n` on a wrapper so the dictionary translator leaves the block alone. */
function paint(root = document){
  const l = L();
  root.querySelectorAll('[data-ko]').forEach(n => {
    if (n.dataset.en === undefined) n.dataset.en = n.textContent;
    n.textContent = n.dataset[l];
  });
  root.querySelectorAll('[data-alt-ko]').forEach(n => {
    if (n.dataset.altEn === undefined) n.dataset.altEn = n.getAttribute('alt') || '';
    n.setAttribute('alt', l === 'ko' ? n.dataset.altKo : n.dataset.altEn);
  });
  root.querySelectorAll('[data-label-ko]').forEach(n => {
    if (n.dataset.labelEn === undefined) n.dataset.labelEn = n.getAttribute('aria-label') || '';
    n.setAttribute('aria-label', l === 'ko' ? n.dataset.labelKo : n.dataset.labelEn);
  });
}
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function datePair(iso){
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return { en:`${d} ${MONTHS[m - 1]} ${y}`, ko:`${y}. ${m}. ${d}.` };
}
const kindOf = it => LIB.kinds[it.kind] || { en:it.kind, ko:it.kind };
function img(src, it, lazy = true){
  const i = document.createElement('img');
  i.src = src;
  if (lazy) i.loading = 'lazy';
  i.decoding = 'async';
  i.dataset.altEn = it.alt ? it.alt.en : '';
  i.dataset.altKo = it.alt ? it.alt.ko : '';
  i.alt = '';
  return i;
}
function statusChip(it, tag = 'em'){
  const s = el(tag, 'st st-' + it.state, it.status);
  return s;
}

/* A film sits in its frame as a real <video> with preload="none": nothing is
   fetched until someone presses play. The ring is only an invitation. */
function wirePlayer(box){
  const v = box.querySelector('video');
  if (!v) return null;
  let ring = box.querySelector('.play');
  if (!ring){
    ring = el('button', 'play'); ring.type = 'button';
    ring.dataset.labelEn = 'Play the film'; ring.dataset.labelKo = '영상 재생';
    ring.innerHTML = '<i aria-hidden="true"></i>';
    if (v.dataset.duration){ const d = el('span', 'play-time'); d.textContent = v.dataset.duration; ring.appendChild(d); }
    box.appendChild(ring);
  }
  /* native controls stay hidden behind the ring until the film is started,
     so a phone does not draw its own play glyph on top of ours */
  const live = () => { v.controls = true; box.classList.add('is-playing'); };
  v.controls = false;
  ring.addEventListener('click', () => { live(); const p = v.play(); if (p && p.catch) p.catch(() => {}); v.focus({ preventScroll:true }); });
  v.addEventListener('play', live);
  v.addEventListener('seeking', live);
  return v;
}
function playerBox(it){
  const box = el('div', 'plate-media');
  const v = document.createElement('video');
  v.controls = true; v.preload = 'none'; v.poster = it.poster;
  v.setAttribute('playsinline', '');
  v.dataset.labelEn = it.title.en; v.dataset.labelKo = it.title.ko;
  const s = document.createElement('source'); s.src = it.video; s.type = 'video/mp4';
  v.appendChild(s);
  box.appendChild(v);
  v.dataset.duration = it.duration;
  wirePlayer(box);
  return box;
}

/* --- home: plates ------------------------------------------- */
function renderPlates(host){
  host.textContent = '';
  const hung = LIB.items.filter(it => it.home && it.href);
  /* a wide plate and a 9:16 plate reach the same height at about 2.9 : 1 */
  host.classList.toggle('is-single', hung.length === 1);
  host.style.gridTemplateColumns = hung.length === 1 ? '' :
    hung.map(it => it.kind === 'film' ? 'minmax(0,1fr)' : 'minmax(0,2.9fr)').join(' ');
  hung.forEach((it, n) => {
    const tall = it.kind === 'film';
    const plate = el('article', 'plate ' + (tall ? 'plate-tall' : 'plate-wide'));
    plate.style.setProperty('--c', String(n + 1));

    const mat = el('div', 'plate-mat');
    if (tall && it.video){
      mat.appendChild(playerBox(it));
    } else {
      const a = el('a', 'plate-media');
      a.href = it.href;
      a.dataset.labelEn = `${kindOf(it).en} ${it.code} — ${it.title.en}`;
      a.dataset.labelKo = `${kindOf(it).ko} ${it.code} — ${it.title.ko}`;
      a.appendChild(img(it.cover || it.thumb, it));
      mat.appendChild(a);
    }
    plate.appendChild(mat);

    const cap = el('div', 'plate-cap');
    const code = el('p', 'plate-code');
    const b = el('b'); b.textContent = it.code; code.appendChild(b);
    code.appendChild(el('span', '', kindOf(it)));
    if (it.content) code.appendChild(el('span', '', it.content));
    cap.appendChild(code);
    cap.appendChild(el('h3', '', it.title));
    cap.appendChild(el('p', 'plate-line', it.line));
    if (it.meta) cap.appendChild(el('p', 'plate-meta', it.meta));
    const foot = el('div', 'plate-foot');
    const go = el('a', 'btn btn-line'); go.href = it.href;
    go.appendChild(el('span', '', it.cta || { en:'Open', ko:'열기' }));
    const arrow = el('span'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗';
    go.appendChild(arrow);
    foot.appendChild(go);
    foot.appendChild(statusChip(it));
    cap.appendChild(foot);
    plate.appendChild(cap);

    host.appendChild(plate);
  });
  paint(host);
}

/* --- home: index list --------------------------------------- */
function renderIndex(host){
  host.textContent = '';
  LIB.items.forEach(it => {
    const row = el(it.href ? 'a' : 'div');
    if (it.href) row.href = it.href;
    const c = el('span'); c.textContent = it.code; row.appendChild(c);
    row.appendChild(el('strong', '', it.title));
    row.appendChild(statusChip(it));
    const b = el('b'); b.textContent = it.href ? '↗' : ''; row.appendChild(b);
    host.appendChild(row);
  });
  paint(host);
}

/* --- library: shelf ----------------------------------------- */
function renderShelf(host){
  host.textContent = '';
  LIB.items.forEach(it => {
    const row = el(it.href ? 'a' : 'div', 'shelf-row' + (it.href ? '' : ' is-closed'));
    if (it.href) row.href = it.href;
    row.dataset.kind = it.kind;

    const c = el('span', 'shelf-code'); c.textContent = it.code; row.appendChild(c);

    const th = el('span', 'shelf-thumb' + (it.thumb ? '' : ' is-empty') + (it.kind === 'film' ? ' is-film' : ''));
    if (it.thumb) th.appendChild(img(it.thumb, it));
    if (it.duration){ const t = el('i', 'shelf-time'); t.textContent = '▶ ' + it.duration; th.appendChild(t); }
    row.appendChild(th);

    const body = el('span', 'shelf-body');
    const k = el('span', 'shelf-kind');
    k.appendChild(el('span', '', kindOf(it)));
    if (it.content) k.appendChild(el('span', '', it.content));
    body.appendChild(k);
    body.appendChild(el('strong', '', it.title));
    if (it.line) body.appendChild(el('span', 'shelf-line', it.line));
    if (it.meta) body.appendChild(el('span', 'shelf-meta', it.meta));
    row.appendChild(body);

    const side = el('span', 'shelf-side');
    side.appendChild(statusChip(it, 'em'));
    const d = datePair(it.date);
    if (d) side.appendChild(el('span', 'shelf-date', d));
    if (it.href){ const a = el('b'); a.textContent = '↗'; a.setAttribute('aria-hidden', 'true'); side.appendChild(a); }
    row.appendChild(side);

    host.appendChild(row);
  });
  paint(host);
}

/* --- library: filter chips and tally ------------------------ */
function renderFilters(host, shelf){
  host.textContent = '';
  const present = [...new Set(LIB.items.map(i => i.kind))];
  const defs = [['all', { en:'Everything', ko:'전체' }]].concat(present.map(k => [k, LIB.kinds[k]]));
  defs.forEach(([key, pair], n) => {
    const b = el('button', 'chip-btn' + (n === 0 ? ' is-on' : ''));
    b.type = 'button'; b.dataset.filter = key;
    b.setAttribute('aria-pressed', String(n === 0));
    b.appendChild(el('span', '', pair));
    const cnt = el('span', 'chip-n');
    cnt.textContent = key === 'all' ? LIB.items.length : LIB.items.filter(i => i.kind === key).length;
    b.appendChild(cnt);
    b.addEventListener('click', () => {
      host.querySelectorAll('.chip-btn').forEach(x => {
        const on = x === b;
        x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on));
      });
      shelf.querySelectorAll('.shelf-row').forEach(r => { r.hidden = !(key === 'all' || r.dataset.kind === key); });
    });
    host.appendChild(b);
  });
  paint(host);
}
function renderTally(host){
  host.textContent = '';
  const open = LIB.items.filter(i => i.href);
  const cell = (label, value) => {
    const d = el('div');
    d.appendChild(el('span', '', label));
    const s = el('strong');
    if (typeof value === 'object'){ s.dataset.en = value.en; s.dataset.ko = value.ko; } else s.textContent = value;
    d.appendChild(s);
    host.appendChild(d);
  };
  cell({ en:'Open to read', ko:'공개' }, { en:`${open.length} of ${LIB.items.length} entries`, ko:`${LIB.items.length}개 중 ${open.length}개` });
  cell({ en:'Field manuals', ko:'현장 교재' }, String(open.filter(i => i.kind === 'manual').length).padStart(2, '0'));
  cell({ en:'Films', ko:'영상' }, String(open.filter(i => i.kind === 'film').length).padStart(2, '0'));
  cell({ en:'Last added', ko:'최근 추가' }, datePair(LIB.updated));
  paint(host);
}

/* --- film page: scene list drives the player ----------------- */
function wireFilm(stage){
  const box = stage.querySelector('.plate-media') || stage;
  const video = wirePlayer(box);
  if (!video) return;
  const marks = [...document.querySelectorAll('.scene-list [data-seek]')];
  const go = at => {
    const seek = () => { try { video.currentTime = at; } catch (e) {} const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    if (video.readyState >= 1) seek();
    else { video.addEventListener('loadedmetadata', seek, { once:true }); video.preload = 'metadata'; video.load(); }
  };
  document.querySelectorAll('[data-seek]').forEach(b => b.addEventListener('click', () => {
    go(+b.dataset.seek);
    const r = stage.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) stage.scrollIntoView({ block:'center', behavior:'smooth' });
  }));
  video.addEventListener('timeupdate', () => {
    const t = video.currentTime;
    let cur = null;
    marks.forEach(b => { if (+b.dataset.seek <= t + .05) cur = b; });
    marks.forEach(b => { const on = b === cur; b.classList.toggle('is-now', on); if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  });
}

function run(){
  document.querySelectorAll('[data-lib="plates"]').forEach(renderPlates);
  document.querySelectorAll('[data-lib="index"]').forEach(renderIndex);
  const shelf = document.querySelector('[data-lib="shelf"]');
  if (shelf){
    renderShelf(shelf);
    const f = document.querySelector('[data-lib="filters"]');
    if (f) renderFilters(f, shelf);
  }
  document.querySelectorAll('[data-lib="tally"]').forEach(renderTally);
  document.querySelectorAll('[data-film]').forEach(wireFilm);
  paint(document);
}
run();
document.addEventListener('joos:lang', () => paint(document));

/* used by the command palette in joosatlas-v10.js */
LIB.paletteItems = () => LIB.items.filter(i => i.href).map(i => ({
  title: `${kindOf(i).en} ${i.code} — ${i.title.en}`,
  sub: i.line ? i.line.en : i.status.en,
  ko: { title: `${kindOf(i).ko} ${i.code} — ${i.title.ko}`, sub: i.line ? i.line.ko : i.status.ko },
  href: i.href,
  keys: (i.keys || '') + ' library ' + i.kind
}));

})();
