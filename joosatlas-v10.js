/* ============================================================
   JoosAtlas v10 — interaction & visualization layer
   No dependencies. Works from file:// and GitHub Pages.
   ============================================================ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------
   0. LANGUAGE  (English ⇄ Korean, persisted)
   Every visible string is translated from joosatlas-i18n.js.
   Strings the dictionary does not contain — numbers, units,
   symbols, proper nouns — are shown identically in both.
   ------------------------------------------------------------ */

const LANG_KEY = 'joosatlas-lang';
const DICT = (window.JOOS_I18N || { ko:{}, koAttr:{}, koRuntime:{} });
const I18N_ATTRS = ['alt', 'placeholder', 'aria-label', 'title'];
let LANG = 'en';

function storedLang(){ try { return localStorage.getItem(LANG_KEY); } catch { return null; } }

/* Translate a runtime string produced by the chart/lab code. */
const t = s => (LANG === 'ko' && DICT.koRuntime[s]) ? DICT.koRuntime[s] : s;

/* Cache the English original on first sight so switching back is lossless. */
const textCache = new WeakMap();
const attrCache = new WeakMap();

function translateTree(root = document.body){
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n){
      const p = n.parentNode;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.nodeName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'MATH' ||
          p.closest?.('math, noscript, .no-i18n')) return NodeFilter.FILTER_REJECT;
      return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);

  nodes.forEach(n => {
    if (!textCache.has(n)) textCache.set(n, n.nodeValue);
    const en = textCache.get(n);
    if (LANG === 'en'){ if (n.nodeValue !== en) n.nodeValue = en; return; }
    const key = en.trim();
    const ko = DICT.ko[key];
    if (!ko) return;
    const lead = en.match(/^\s*/)[0], tail = en.match(/\s*$/)[0];
    n.nodeValue = lead + ko + tail;
  });

  const scope = root === document.body ? document : root;
  scope.querySelectorAll('[alt],[placeholder],[aria-label],[title]').forEach(el => {
    let store = attrCache.get(el);
    if (!store){ store = {}; attrCache.set(el, store); }
    I18N_ATTRS.forEach(a => {
      if (!el.hasAttribute(a)) return;
      if (!(a in store)) store[a] = el.getAttribute(a);
      const en = store[a];
      if (LANG === 'en'){ el.setAttribute(a, en); return; }
      const ko = DICT.koAttr[en.trim()] || DICT.ko[en.trim()];
      if (ko) el.setAttribute(a, ko);
    });
  });
}

let headCache = null;
function applyLang(mode){
  LANG = (mode === 'ko') ? 'ko' : 'en';
  document.documentElement.setAttribute('lang', LANG);
  if (!headCache){
    const d = document.querySelector('meta[name="description"]');
    const o = document.querySelector('meta[property="og:description"]');
    const ot = document.querySelector('meta[property="og:title"]');
    headCache = { title:document.title, desc:d?.content, ogd:o?.content, ogt:ot?.content, d, o, ot };
  }
  const pick = s => s == null ? s : (LANG === 'ko' ? (DICT.koAttr[s] || DICT.ko[s] || s) : s);
  document.title = pick(headCache.title);
  if (headCache.d) headCache.d.content = pick(headCache.desc);
  if (headCache.o) headCache.o.content = pick(headCache.ogd);
  if (headCache.ot) headCache.ot.content = pick(headCache.ogt);
  translateTree();
  document.dispatchEvent(new CustomEvent('joos:lang', { detail:{ lang:LANG } }));
}
function cycleLang(){
  const next = LANG === 'ko' ? 'en' : 'ko';
  try { localStorage.setItem(LANG_KEY, next); } catch {}
  applyLang(next);
  return next;
}


/* ------------------------------------------------------------
   DATA — mirrors assets/data/ts_summary.json and the disclosed
   local inverse-Jacobian scales of Case 001.
   ------------------------------------------------------------ */

const TS = [
  { id:'C3', name:'Central', tone:'--s1',
    rmse:3.757080299514259, mean:-0.41996795048739616, max:6.57450506948809, n:17,
    camN:8.197333915541657,  camE:-4.284912561912283,
    farN:-0.8862279933970888, farE:0.4632493321305162,
    points:'TS0038–TS0054', origins:'TS0035, TS0036, TS0037',
    note:'Central placement with the densest selected boundary support among the three examples.' },
  { id:'R3', name:'Lateral', tone:'--s2',
    rmse:7.510047164180431, mean:-0.36382528760148247, max:17.034009593930755, n:16,
    camN:2.195764889217235,  camE:-8.335419266306792,
    farN:-0.2547356230576631, farE:0.9670107353827176,
    points:'TS0091–TS0106', origins:'TS0051, TS0089, TS0090',
    note:'Lateral placement with broad angular coverage and intermediate radial fit among the selected examples.' },
  { id:'D3', name:'Depth', tone:'--s3',
    rmse:14.024801031215576, mean:-2.830255620771549, max:19.78591949375197, n:8,
    camN:-1.2803938361162135, camE:-4.996720932734111,
    farN:0.2482267906370277,  farE:0.9687019461165758,
    points:'TS0051–TS0058', origins:'TS0091, TS0092, TS0093',
    note:'Depth placement with fewer selected boundary references and the largest RMSE of the three examples.' }
];

const RANGES = [
  { m:7,  scale:27.815, tone:'--r1' },
  { m:9,  scale:41.079, tone:'--r2' },
  { m:12, scale:61.782, tone:'--r3' }
];

const LIMIT_CM = 5;
const R_PRIMITIVE = 1.5;
const R_BOUNDARY  = 5.5;

const fmt = (v, d = 2) => v.toFixed(d);
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const groundCm = (px, scale) => px * scale / 10;
const pxLimit  = scale => LIMIT_CM * 10 / scale;

/* ------------------------------------------------------------
   1. THEME  (auto → light → dark, persisted)
   ------------------------------------------------------------ */

const THEME_KEY = 'joosatlas-theme';
const root = document.documentElement;

function storedTheme(){
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}
function applyTheme(mode){
  if (mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode);
  else root.removeAttribute('data-theme');
  const dark = mode === 'dark' ||
    (mode !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#0a1620' : '#faf7ef');
  document.dispatchEvent(new CustomEvent('joos:theme'));
}
function currentTheme(){ return root.getAttribute('data-theme') || 'auto'; }
function cycleTheme(){
  const isDark = currentTheme() === 'dark' ||
    (currentTheme() === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const next = isDark ? 'light' : 'dark';
  try { localStorage.setItem(THEME_KEY, next); } catch {}
  applyTheme(next);
  return next;
}
applyTheme(storedTheme() || 'auto');
applyLang(storedLang() || ((navigator.language || '').toLowerCase().startsWith('ko') ? 'ko' : 'en'));
$$('.lang-btn').forEach(b => b.addEventListener('click', () => {
  const m = cycleLang();
  toast(m === 'ko' ? '언어: 한국어' : 'Language: English');
}));
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!storedTheme()) applyTheme('auto');
});
$$('.theme-btn').forEach(b => b.addEventListener('click', () => cycleTheme()));

/* ------------------------------------------------------------
   2. HEADER, NAV, PROGRESS, SECTION TRACKING
   ------------------------------------------------------------ */

const hdr  = $('.hdr');
const nav  = $('.nav');
const menu = $('.menu-btn');
const bar  = $('.progress i');

if (menu && nav){
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
  }));
}

let ticking = false;
function onScroll(){
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0) + '%';
    if (hdr) hdr.classList.toggle('is-solid', window.scrollY > 24 || hdr.dataset.solid === 'always');
    ticking = false;
  });
}
onScroll();
window.addEventListener('scroll', onScroll, { passive:true });
window.addEventListener('resize', onScroll);

/* header tone follows the section under it */
const toned = $$('[data-tone]');
if (hdr && toned.length && 'IntersectionObserver' in window){
  const io = new IntersectionObserver(entries => {
    const seen = entries.filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!seen) return;
    hdr.classList.toggle('on-dark', seen.target.dataset.tone === 'dark');
  }, { rootMargin:'-2% 0px -92% 0px', threshold:[0,.02,.2,.6] });
  toned.forEach(s => io.observe(s));
}

/* nav highlights the section in view */
const navLinks = $$('.nav a[href^="#"]');
const targets  = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
if (targets.length && 'IntersectionObserver' in window){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin:'-45% 0px -50% 0px' });
  targets.forEach(t => io.observe(t));
}

/* reveal on scroll */
const reveals = $$('.rv');
if ('IntersectionObserver' in window && !reduceMotion){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } });
  }, { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('on'));
}

/* hero parallax */
const heroImg = $('.hero-media img');
if (heroImg && !reduceMotion){
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, window.innerHeight);
    heroImg.style.transform = `scale(${1.04 + y / 26000}) translate3d(0,${y * .05}px,0)`;
  }, { passive:true });
}

/* ------------------------------------------------------------
   3. COMMAND PALETTE  (⌘K / Ctrl-K)
   ------------------------------------------------------------ */

const HERE = (location.pathname.split('/').pop() || 'index.html');
const P = (file, hash) => (file === HERE ? (hash || '#main') : file + (hash || ''));

const NAVIGATE = [
  ['Home — JoosAtlas',            'Research that survives contact with the field', 'index.html',    '',            'home start overview atlas'],
  ['Premise',                     'An image may not certify its own interpretation','index.html',   '#premise',    'principle refusal ethics observe reference decide'],
  ['60-second experiment',        'Two pixels are not two centimetres',            'index.html',    '#quick-lab',  'pixel lab quick try sensitivity'],
  ['Case 001 — overview',         'From a surveyed primitive to an auditable boundary','index.html','#work',      'selected work case study'],
  ['Who is writing this',         'Yonghoe JOO — a short introduction',            'index.html',    '#person',     'about joo 주용회 profile person bio name'],
  ['Three worlds',                'Yonsei · Daejin Pipe · ACERS',                  'index.html',    '#worlds',     'research industry community affiliation'],
  ['Current coordinates',         'The atlas index and its maturity labels',       'index.html',    '#coordinates','index roadmap status planned'],
  ['Case 001 — the question',     'A projected boundary may look correct and still fail','case-001.html','#question','visual agreement metric'],
  ['Case 001 — theory',           'The traceable five-stage chain',                'case-001.html', '#theory',     'survey generate project return audit equations method'],
  ['Case 001 — equations',        'Symbols, definitions and sign convention',      'case-001.html', '#equations',  'math glossary argmin projection back-projection delta'],
  ['Case 001 — field realization','The geometry existed before it became a figure','case-001.html', '#field',      'installation total station camera stations'],
  ['Sensitivity lab',             'Find the largest displacement under 5 cm',      'case-001.html', '#pixel-lab',  'pixel ground effect slider interactive mm/px jacobian'],
  ['Sensitivity curves',          'Ground effect against image displacement',      'case-001.html', '#curves',     'chart graph plot line threshold'],
  ['Observation geometry',        'Plan view of the three camera placements',      'case-001.html', '#geometry',   'chart plan north east azimuth camera range'],
  ['Selected evidence',           'C3, R3 and D3 object-space checks',             'case-001.html', '#evidence',   'rmse residual explorer figures placement'],
  ['Residual profile',            'Bias, dispersion and observed bound',           'case-001.html', '#residuals',  'chart rmse mean max error bar'],
  ['Claim boundary',              'What is supported and what is not claimed',     'case-001.html', '#claim',      'limits disclosure withheld scope'],
  ['Release ledger',              'What is public now and what waits for the paper','case-001.html','#release',    'status under review withheld'],
  ['About Yonghoe JOO',           'I work between a laboratory and an industrial yard','about.html','',            'profile biography 주용회 person who name joo'],
  ['Research — Yonsei University','I start from something physical',               'about.html',    '#research',   'phd civil environmental engineering lab gis remote sensing'],
  ['Workshop — hands-on practice','The welding photograph is me',                  'about.html',    '#operator',   'welding operator industrial workshop'],
  ['Company — Daejin Pipe',       'Where a method meets its consequence',          'about.html',    '#industry',   'steel pipe fire protection yard logistics inventory president'],
  ['Community — ACERS',           'Most of what I know arrived through other people','about.html',  '#community',  'alumni resilience safety yonsei graduate school'],
  ['How I try to work',           'Observe · Measure · Build · Refuse',            'about.html',    '#method',     'four verbs discipline principle'],
  ['Contact',                     'daejinpipero@yonsei.ac.kr · daejinpipero@gmail.com','about.html','#contact',    'email write mail reach address get in touch']
];

const items = NAVIGATE.map(([title, sub, file, hash, keys]) => ({
  title, sub, keys, kind:'Go to', icon:'→',
  run(){ location.href = P(file, hash); }
}));

items.push(
  { title:'Switch language — 한국어 / English', sub:'Every page, including the charts and the lab', keys:'korean hangul 한국어 language translate 번역 언어', kind:'Display', icon:'文',
    run(){ const m = cycleLang(); toast(m === 'ko' ? '언어: 한국어' : 'Language: English'); } },
  { title:'Toggle light / dark theme', sub:'Switch the whole site between paper and field-night', keys:'dark light mode night theme colour color', kind:'Display', icon:'◐',
    run(){ const m = cycleTheme(); toast('Theme: ' + m); } },
  { title:'Copy link to this section', sub:'Share the exact place you are reading', keys:'share url copy permalink anchor', kind:'Action', icon:'⧉',
    run(){
      const active = $('.nav a.is-current');
      const url = location.origin + location.pathname + (active ? active.getAttribute('href') : location.hash);
      navigator.clipboard?.writeText(url).then(() => toast(t('Link copied')), () => toast(t('Copy blocked by the browser')));
    } },
  { title:'Print or save as PDF', sub:'A clean print stylesheet is built in', keys:'pdf print export paper', kind:'Action', icon:'⎙',
    run(){ window.print(); } },
  { title:'Back to top', sub:'Return to the start of this page', keys:'top scroll up start', kind:'Action', icon:'↑',
    run(){ window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' }); } },
  { title:'Email — Yonsei address', sub:'daejinpipero@yonsei.ac.kr', keys:'contact write mail academic university reach', kind:'Contact', icon:'✉',
    run(){ location.href = 'mailto:daejinpipero@yonsei.ac.kr'; } },
  { title:'Email — general address', sub:'daejinpipero@gmail.com', keys:'contact write mail personal reach', kind:'Contact', icon:'✉',
    run(){ location.href = 'mailto:daejinpipero@gmail.com'; } },
  { title:'GitHub repository', sub:'github.com/daejinpipero-gaja/JoosAtlas', keys:'source code repo git deploy', kind:'External', icon:'↗',
    run(){ window.open('https://github.com/daejinpipero-gaja/JoosAtlas', '_blank', 'noopener'); } },
  { title:'Public disclosure boundary', sub:'What the site includes and excludes', keys:'docs disclosure limits withheld raw data', kind:'External', icon:'↗',
    run(){ window.open('https://github.com/daejinpipero-gaja/JoosAtlas/blob/main/docs/PUBLIC_DISCLOSURE.md', '_blank', 'noopener'); } }
);

/* subsequence scorer with match positions */
function score(query, text){
  const q = query.toLowerCase(), t = text.toLowerCase();
  if (!q) return { s:0, hits:[] };
  let qi = 0, prev = -2, s = 0; const hits = [];
  for (let i = 0; i < t.length && qi < q.length; i++){
    if (t[i] !== q[qi]) continue;
    let gain = 12;
    if (i === prev + 1) gain += 16;
    if (i === 0 || /[\s—·–\-/(]/.test(t[i-1])) gain += 14;
    s += gain; hits.push(i); prev = i; qi++;
  }
  if (qi < q.length) return null;
  s -= Math.max(0, t.length - q.length) * .18;
  return { s, hits };
}
function mark(text, hits){
  const frag = document.createDocumentFragment();
  const set = new Set(hits);
  let buf = '', open = false;
  const flush = () => {
    if (!buf) return;
    if (open){ const m = document.createElement('mark'); m.textContent = buf; frag.appendChild(m); }
    else frag.appendChild(document.createTextNode(buf));
    buf = '';
  };
  for (let i = 0; i < text.length; i++){
    const on = set.has(i);
    if (on !== open){ flush(); open = on; }
    buf += text[i];
  }
  flush();
  return frag;
}

const cmdk   = $('.cmdk');
const cInput = $('.cmdk-field input');
const cList  = $('.cmdk-list');
let cRows = [], cIdx = 0, lastFocus = null;

function renderCmdk(q){
  cList.textContent = '';
  cRows = [];
  cInput.removeAttribute('aria-activedescendant');
  const scored = [];
  for (const it of items){
    const a = score(q, it.title);
    const b = score(q, it.sub);
    const c = score(q, it.keys);
    if (!a && !b && !c) continue;
    const best = a ? { s:a.s + 70, hits:a.hits, onTitle:true }
      : { s:Math.max(b ? b.s : -1e9, c ? c.s + 24 : -1e9), hits:[], onTitle:false };
    scored.push({ it, ...best });
  }
  if (!q) scored.sort((x,y) => items.indexOf(x.it) - items.indexOf(y.it));
  else scored.sort((x,y) => y.s - x.s);

  if (!scored.length){
    const e = document.createElement('div');
    e.className = 'cmdk-empty';
    e.textContent = 'Nothing matches “' + q + '”.';
    cList.appendChild(e);
    return;
  }

  let group = '';
  scored.slice(0, 40).forEach(({ it, hits, onTitle }) => {
    if (it.kind !== group){
      group = it.kind;
      const g = document.createElement('div');
      g.className = 'cmdk-group';
      g.textContent = group;
      cList.appendChild(g);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cmdk-item';
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    btn.id = 'cmdk-opt-' + cRows.length;
    btn.innerHTML = '<span class="cmdk-ico"></span><span class="cmdk-txt"><b></b><span></span></span><span class="cmdk-meta"></span>';
    btn.querySelector('.cmdk-ico').textContent = it.icon;
    const b = btn.querySelector('.cmdk-txt b');
    const koT = LANG === 'ko' ? DICT.ko[it.title] : null;
    if (koT) b.textContent = koT;
    else if (onTitle && hits.length) b.appendChild(mark(it.title, hits));
    else b.textContent = it.title;
    btn.querySelector('.cmdk-txt span').textContent =
      (LANG === 'ko' && DICT.ko[it.sub]) ? DICT.ko[it.sub] : it.sub;
    btn.querySelector('.cmdk-meta').textContent = it.kind === 'Go to' ? 'Enter' : '';
    btn.addEventListener('click', () => { closeCmdk(); it.run(); });
    btn.addEventListener('mousemove', () => setActive(cRows.indexOf(btn)));
    cList.appendChild(btn);
    cRows.push(btn);
  });
  setActive(0);
}
function setActive(i){
  if (!cRows.length) return;
  cIdx = (i + cRows.length) % cRows.length;
  cRows.forEach((r, n) => {
    const on = n === cIdx;
    r.classList.toggle('is-active', on);
    r.setAttribute('aria-selected', String(on));
  });
  cInput.setAttribute('aria-activedescendant', cRows[cIdx].id);
  cRows[cIdx].scrollIntoView({ block:'nearest' });
}
function openCmdk(){
  if (!cmdk) return;
  lastFocus = document.activeElement;
  cmdk.classList.add('is-open');
  document.body.classList.add('is-locked');
  cInput.value = '';
  renderCmdk('');
  cInput.focus();
}
function closeCmdk(){
  if (!cmdk) return;
  cmdk.classList.remove('is-open');
  document.body.classList.remove('is-locked');
  lastFocus?.focus?.();
}
if (cmdk){
  $$('.cmdk-open').forEach(b => b.addEventListener('click', openCmdk));
  $('.cmdk-veil').addEventListener('click', closeCmdk);
  cInput.addEventListener('input', () => renderCmdk(cInput.value.trim()));
  cmdk.addEventListener('keydown', e => {
    if (e.key === 'Escape'){ e.preventDefault(); closeCmdk(); }
    else if (e.key === 'ArrowDown'){ e.preventDefault(); setActive(cIdx + 1); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); setActive(cIdx - 1); }
    else if (e.key === 'Enter'){ e.preventDefault(); cRows[cIdx]?.click(); }
    else if (e.key === 'Tab'){ e.preventDefault(); setActive(cIdx + (e.shiftKey ? -1 : 1)); }
  });
}
document.addEventListener('keydown', e => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
    e.preventDefault();
    cmdk?.classList.contains('is-open') ? closeCmdk() : openCmdk();
  } else if (e.key === '/' && !typing && !cmdk?.classList.contains('is-open')){
    e.preventDefault(); openCmdk();
  } else if (e.key.toLowerCase() === 't' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey){
    cycleTheme();
  } else if (e.key.toLowerCase() === 'l' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey){
    const m = cycleLang();
    toast(m === 'ko' ? '언어: 한국어' : 'Language: English');
  }
});

/* toast */
let toastEl;
function toast(msg){
  if (!toastEl){
    toastEl = document.createElement('div');
    Object.assign(toastEl.style, {
      position:'fixed', left:'50%', bottom:'28px', transform:'translateX(-50%)',
      zIndex:'320', padding:'11px 18px', borderRadius:'10px', opacity:'0',
      transition:'opacity .22s, transform .22s', pointerEvents:'none',
      fontFamily:'var(--mono)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase',
      background:'var(--ink)', color:'var(--bg)', boxShadow:'var(--shadow-1)'
    });
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.style.opacity = '1';
  toastEl.style.transform = 'translateX(-50%) translateY(-6px)';
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateX(-50%)';
  }, 1700);
}

/* ------------------------------------------------------------
   4. METHOD EXPLORER
   ------------------------------------------------------------ */

const exp = $('[data-explorer]');
if (exp){
  const tabs   = $$('[data-step]', exp);
  const panels = $$('[data-panel]', exp);
  const show = n => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.step === n)));
    panels.forEach(p => { p.hidden = p.dataset.panel !== n; });
  };
  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.step)));
  exp.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft')  n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End')  n = tabs.length - 1;
    if (n === null) return;
    e.preventDefault(); tabs[n].focus(); show(tabs[n].dataset.step);
  });
}

/* ------------------------------------------------------------
   5. SENSITIVITY LAB
   ------------------------------------------------------------ */

const lab = $('[data-lab]');
let labState = { range:RANGES[0], px:1.5 };

if (lab){
  const slider  = $('#px-slider', lab);
  const out     = $('#px-out', lab);
  const rangeBtns = $$('[data-range]', lab);
  const imgFill = $('#img-fill', lab);
  const gndFill = $('#gnd-fill', lab);
  const gndLimit= $('#gnd-limit', lab);
  const imgRead = $('#img-read', lab);
  const gndRead = $('#gnd-read', lab);
  const scaleRead = $('#scale-read', lab);
  const rangeRead = $('#range-read', lab);
  const rScale  = $('#r-scale', lab);
  const rTol    = $('#r-tol', lab);
  const rEffect = $('#r-effect', lab);
  const verdict = $('#verdict', lab);
  const PX_MAX = 4, CM_MAX = 25;

  function draw(){
    const { range, px } = labState;
    const cm = groundCm(px, range.scale);
    const tol = pxLimit(range.scale);
    const ok = cm <= LIMIT_CM + 1e-9;

    slider.value = px;
    slider.style.setProperty('--fill', (px / PX_MAX * 100) + '%');
    out.value = fmt(px) + ' px';
    imgRead.textContent = fmt(px) + ' px';
    gndRead.textContent = fmt(cm) + ' cm';
    imgFill.style.setProperty('--v', (px / PX_MAX * 100) + '%');
    gndFill.style.setProperty('--v', Math.min(100, cm / CM_MAX * 100) + '%');
    gndLimit.style.setProperty('--l', (LIMIT_CM / CM_MAX * 100) + '%');
    scaleRead.textContent = fmt(range.scale, 3) + ' mm/px';
    rangeRead.textContent = t('at') + ' ' + range.m + ' m';
    rScale.textContent = fmt(range.scale, 3) + ' mm/px';
    rTol.textContent = fmt(tol, 3) + ' px';
    rEffect.textContent = fmt(cm) + ' cm';
    verdict.className = 'verdict ' + (ok ? 'pass' : 'fail');
    verdict.querySelector('strong').textContent = ok ? '✓  ' + t('WITHIN 5 CM') : '✕  ' + t('OVER 5 CM');
    verdict.querySelector('p').textContent =
      fmt(px) + ' px × ' + fmt(range.scale, 3) + ' mm/px = ' + fmt(px * range.scale) + ' mm';
    rangeBtns.forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.range === range.m)));
    document.dispatchEvent(new CustomEvent('joos:lab', { detail:{ px, range } }));
  }

  document.addEventListener('joos:lang', draw);
  slider.addEventListener('input', () => { labState.px = +slider.value; draw(); });
  rangeBtns.forEach(b => b.addEventListener('click', () => {
    labState.range = RANGES.find(r => r.m === +b.dataset.range);
    draw();
  }));
  $('#lab-snap', lab)?.addEventListener('click', () => {
    labState.px = Math.floor(pxLimit(labState.range.scale) * 100) / 100;
    draw(); toast(t('Set to the 5 cm limit'));
  });
  $('#lab-reset', lab)?.addEventListener('click', () => {
    labState = { range:RANGES[0], px:1.5 }; draw();
  });
  draw();
}

/* ------------------------------------------------------------
   6. EVIDENCE EXPLORER
   ------------------------------------------------------------ */

const ev = $('[data-evidence]');
if (ev){
  const IMG = {
    C3:{ plan:'assets/images/c3-plan.webp', '3d':'assets/images/c3-3d.webp' },
    R3:{ plan:'assets/images/r3-plan.webp', '3d':'assets/images/r3-3d.webp' },
    D3:{ plan:'assets/images/d3-plan.webp', '3d':'assets/images/d3-3d.webp' }
  };
  let pick = 'C3', view = 'plan';
  const img = $('#ev-img', ev);
  const draw = () => {
    const c = TS.find(t => t.id === pick);
    img.src = IMG[pick][view];
    img.alt = `${pick} ${view === 'plan' ? 'plan-view' : 'three-dimensional'} TS boundary validation.`;
    $('#ev-name span', ev).textContent = `${c.id} · ${t(c.name)}`;
    $('#ev-name i', ev).style.background = `var(${c.tone})`;
    $('#ev-note', ev).textContent = (LANG === 'ko' && DICT.ko[c.note]) ? DICT.ko[c.note] : c.note;
    $('#ev-rmse', ev).textContent = fmt(c.rmse, 1) + ' mm';
    $('#ev-mean', ev).textContent = (c.mean < 0 ? '−' : '') + fmt(Math.abs(c.mean), 1) + ' mm';
    $('#ev-max', ev).textContent  = fmt(c.max, 1) + ' mm';
    $('#ev-n', ev).textContent    = String(c.n);
    $('#ev-pts', ev).textContent  = c.points;
    $$('[data-place]', ev).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.place === pick)));
    $$('[data-view]', ev).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  };
  document.addEventListener('joos:lang', draw);
  $$('[data-place]', ev).forEach(b => b.addEventListener('click', () => { pick = b.dataset.place; draw(); }));
  $$('[data-view]', ev).forEach(b => b.addEventListener('click', () => { view = b.dataset.view; draw(); }));
  draw();
}

/* ------------------------------------------------------------
   7. LIGHTBOX
   ------------------------------------------------------------ */

const box = $('.lightbox');
if (box){
  const bImg = $('img', box);
  const open = src => {
    bImg.src = src;
    box.classList.add('is-open');
    document.body.classList.add('is-locked');
    $('.lightbox-x', box).focus();
  };
  const close = () => { box.classList.remove('is-open'); document.body.classList.remove('is-locked'); };
  $$('[data-zoom]').forEach(b => b.addEventListener('click', () => {
    const t = $('#' + b.dataset.zoom);
    if (t) open(t.currentSrc || t.src);
  }));
  $('.lightbox-x', box).addEventListener('click', close);
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) close(); });
}

/* ------------------------------------------------------------
   8. CHART TOOLKIT
   ------------------------------------------------------------ */

const NS = 'http://www.w3.org/2000/svg';
/* Give a hit target a keyboard identity so its values are reachable
   without a pointer — the table view is the fallback, not the only route. */
function makeHit(node, label, show, hide){
  node.setAttribute('tabindex', '0');
  node.setAttribute('role', 'img');
  node.setAttribute('aria-label', label);
  node.addEventListener('focus', show);
  node.addEventListener('blur', hide);
  return node;
}

const el = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};
const txt = (s, attrs = {}) => { const n = el('text', attrs); n.textContent = s; return n; };

function makeTip(host){
  const t = document.createElement('div');
  t.className = 'tip';
  host.appendChild(t);
  return {
    node:t,
    show(x, y, title, rows){
      t.textContent = '';
      const h = document.createElement('h4'); h.textContent = title; t.appendChild(h);
      rows.forEach(r => {
        const d = document.createElement('div'); d.className = 'tip-row';
        if (r.tone){ const i = document.createElement('i'); i.style.background = `var(${r.tone})`; d.appendChild(i); }
        const b = document.createElement('b'); b.textContent = r.value; d.appendChild(b);
        const s = document.createElement('span'); s.textContent = r.label; d.appendChild(s);
        t.appendChild(d);
      });
      t.classList.add('on');
      const hw = host.clientWidth, th = t.offsetHeight, tw = t.offsetWidth;
      const below = y - th - 10 < 0;
      t.style.transform = below ? 'translate(-50%,14px)' : 'translate(-50%,-115%)';
      t.style.left = Math.max(tw / 2 + 4, Math.min(hw - tw / 2 - 4, x)) + 'px';
      t.style.top  = y + 'px';
    },
    hide(){ t.classList.remove('on'); }
  };
}

/* map SVG user units (drawn 1:1 with CSS pixels) to host-relative pixels */
function toHost(host, svg, x, y){
  const a = svg.getBoundingClientRect(), b = host.getBoundingClientRect();
  const s = a.width ? a.width / (svg.viewBox.baseVal.width || a.width) : 1;
  return [x * s + (a.left - b.left), y * s + (a.top - b.top)];
}

/* responsive re-render harness */
function responsive(host, render){
  let w = 0;
  const run = () => {
    const nw = host.clientWidth;
    if (!nw) return;
    w = nw;
    host.querySelectorAll('svg').forEach(s => s.remove());
    render(host, nw);
  };
  run();
  if ('ResizeObserver' in window){
    let t;
    new ResizeObserver(() => {
      if (Math.abs(host.clientWidth - w) < 12) return;
      clearTimeout(t); t = setTimeout(run, 90);
    }).observe(host);
  }
  document.addEventListener('joos:theme', () => setTimeout(run, 30));
  document.addEventListener('joos:lang',  () => setTimeout(run, 30));
  return run;
}

/* ---- 8a. SENSITIVITY CURVES ---------------------------------- */

const curveHost = $('#chart-curves');
if (curveHost){
  const tip = makeTip(curveHost);
  let marker = null;

  const redraw = responsive(curveHost, (host, W) => {
    const H = Math.max(260, Math.min(400, Math.round(W * 0.52)));
    const m = { t:18, r:W < 520 ? 20 : 62, b:44, l:W < 520 ? 40 : 52 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const PX_MAX = 4, CM_MAX = 25;
    const X = p => m.l + p / PX_MAX * iw;
    const Y = c => m.t + ih - c / CM_MAX * ih;

    const svg = el('svg', { viewBox:`0 0 ${W} ${H}`, width:W, height:H, role:'img',
      'aria-label':'Local ground effect against image displacement for the three selected ranges, with the 5 cm limit.' });

    for (let c = 0; c <= CM_MAX; c += 5){
      svg.appendChild(el('line', { class:'ax-grid', x1:m.l, x2:m.l + iw, y1:Y(c), y2:Y(c) }));
      svg.appendChild(txt(c, { class:'ax-txt', x:m.l - 9, y:Y(c) + 4, 'text-anchor':'end' }));
    }
    for (let p = 0; p <= PX_MAX; p += 1){
      svg.appendChild(txt(p, { class:'ax-txt', x:X(p), y:m.t + ih + 20, 'text-anchor':'middle' }));
    }
    svg.appendChild(el('line', { class:'ax-line', x1:m.l, x2:m.l + iw, y1:Y(0), y2:Y(0) }));
    svg.appendChild(txt(t('IMAGE DISPLACEMENT (PX)'), { class:'ax-title', x:m.l + iw / 2, y:H - 6, 'text-anchor':'middle' }));
    svg.appendChild(txt(t('GROUND EFFECT (CM)'), { class:'ax-title', x:m.l - 6, y:m.t - 6, 'text-anchor':'start' }));

    /* 5 cm limit */
    svg.appendChild(el('line', { class:'mk-limit', x1:m.l, x2:m.l + iw, y1:Y(5), y2:Y(5) }));
    svg.appendChild(txt(t('5 CM LIMIT'), { class:'mk-limit-txt', x:m.l + iw - 2, y:Y(5) - 7, 'text-anchor':'end' }));

    RANGES.forEach(r => {
      const cmAt4 = groundCm(PX_MAX, r.scale);
      const pEnd = cmAt4 > CM_MAX ? CM_MAX * 10 / r.scale : PX_MAX;
      const col = `var(${r.tone})`;
      svg.appendChild(el('line', { class:'mk-line', stroke:col, x1:X(0), y1:Y(0), x2:X(pEnd), y2:Y(groundCm(pEnd, r.scale)) }));
      /* crossing tick */
      const xc = pxLimit(r.scale);
      svg.appendChild(el('line', { class:'ax-line', stroke:col, 'stroke-width':1.4, x1:X(xc), x2:X(xc), y1:Y(5), y2:Y(0) }));
      svg.appendChild(el('circle', { class:'mk-dot', fill:col, cx:X(xc), cy:Y(5), r:4.5 }));
      if (W >= 520){
        svg.appendChild(txt(r.m + ' m', { class:'mk-label', x:X(pEnd) + 8, y:Y(groundCm(pEnd, r.scale)) + 4 }));
      }
    });

    const cross = el('line', { class:'mk-crosshair', y1:m.t, y2:m.t + ih });
    svg.appendChild(cross);
    const live = el('g');
    svg.appendChild(live);
    marker = { live, X, Y, PX_MAX, CM_MAX };

    const hit = el('rect', { class:'mk-hit', x:m.l, y:m.t, width:iw, height:ih });
    svg.appendChild(hit);
    const move = e => {
      const box = svg.getBoundingClientRect();
      const cx = (e.clientX - box.left) * (W / box.width);
      const p = Math.max(0, Math.min(PX_MAX, (cx - m.l) / iw * PX_MAX));
      cross.setAttribute('x1', X(p)); cross.setAttribute('x2', X(p));
      cross.classList.add('on');
      const [tx, ty] = toHost(host, svg, X(p), Y(groundCm(p, RANGES[1].scale)) - 10);
      tip.show(tx, ty, fmt(p) + ' ' + t('px displacement'),
        RANGES.map(r => ({ tone:r.tone, value:fmt(groundCm(p, r.scale)) + ' cm', label:r.m + ' m' })));
    };
    hit.addEventListener('pointermove', move);
    hit.addEventListener('pointerleave', () => { cross.classList.remove('on'); tip.hide(); });

    host.appendChild(svg);
    paintLive();
  });

  function paintLive(){
    if (!marker) return;
    const { live, X, Y } = marker;
    live.textContent = '';
    const { px, range } = labState;
    const cm = groundCm(px, range.scale);
    if (cm > marker.CM_MAX) return;
    live.appendChild(el('line', { class:'ax-line', stroke:'var(--accent-bright)', 'stroke-width':1.6,
      x1:X(px), x2:X(px), y1:Y(0), y2:Y(cm) }));
    live.appendChild(el('circle', { cx:X(px), cy:Y(cm), r:7, fill:'var(--accent-bright)',
      stroke:'var(--surface)', 'stroke-width':2.5 }));
    live.appendChild(txt(t('LAB'), { class:'mk-limit-txt', fill:'var(--accent)', x:X(px), y:Y(cm) - 14, 'text-anchor':'middle' }));
  }
  document.addEventListener('joos:lab', paintLive);
}

/* ---- 8b. RESIDUAL PROFILE ------------------------------------ */

const resHost = $('#chart-residual');
if (resHost){
  const tip = makeTip(resHost);
  responsive(resHost, (host, W) => {
    const rowH = 74;
    const m = { t:26, r:W < 560 ? 16 : 92, b:42, l:W < 560 ? 44 : 62 };
    const H = m.t + rowH * TS.length + m.b;
    const iw = W - m.l - m.r;
    const LIM = 22;
    const X = v => m.l + (v + LIM) / (2 * LIM) * iw;

    const svg = el('svg', { viewBox:`0 0 ${W} ${H}`, width:W, height:H, role:'img',
      'aria-label':'Signed radial residual profile for C3, R3 and D3: mean error, RMSE dispersion and observed bound.' });

    for (let v = -20; v <= 20; v += 10){
      svg.appendChild(el('line', { class:'ax-grid', x1:X(v), x2:X(v), y1:m.t - 8, y2:m.t + rowH * TS.length }));
      svg.appendChild(txt(v === 0 ? '0' : (v < 0 ? '−' : '+') + Math.abs(v),
        { class:'ax-txt', x:X(v), y:m.t + rowH * TS.length + 20, 'text-anchor':'middle' }));
    }
    svg.appendChild(el('line', { class:'ax-line', 'stroke-width':1.4, x1:X(0), x2:X(0), y1:m.t - 8, y2:m.t + rowH * TS.length }));
    svg.appendChild(txt(t('RADIAL RESIDUAL (MM)'), { class:'ax-title', x:m.l + iw / 2, y:H - 8, 'text-anchor':'middle' }));

    TS.forEach((c, i) => {
      const y = m.t + rowH * i + rowH / 2 - 6;
      const col = `var(${c.tone})`;
      const g = el('g');

      svg.appendChild(txt(c.id, { class:'mk-label', x:m.l - 12, y:y + 4, 'text-anchor':'end' }));
      /* observed bound whisker */
      g.appendChild(el('line', { stroke:col, 'stroke-width':1.5, opacity:.5, x1:X(-c.max), x2:X(c.max), y1:y, y2:y }));
      [-c.max, c.max].forEach(v =>
        g.appendChild(el('line', { stroke:col, 'stroke-width':1.5, opacity:.5, x1:X(v), x2:X(v), y1:y - 8, y2:y + 8 })));
      /* rmse band */
      g.appendChild(el('rect', { x:X(-c.rmse), y:y - 11, width:X(c.rmse) - X(-c.rmse), height:22, rx:4,
        fill:col, 'fill-opacity':.16, stroke:col, 'stroke-width':1.5 }));
      /* mean */
      g.appendChild(el('circle', { class:'mk-dot', cx:X(c.mean), cy:y, r:5.5, fill:col }));

      if (W >= 560){
        g.appendChild(txt('RMSE ' + fmt(c.rmse, 1) + ' mm', { class:'mk-label', x:X(c.max) + 12, y:y - 1 }));
        g.appendChild(txt(c.n + ' ' + t('pts'), { class:'ax-txt', x:X(c.max) + 12, y:y + 14 }));
      } else {
        g.appendChild(txt(fmt(c.rmse, 1), { class:'mk-label', x:X(c.max) + 8, y:y + 4 }));
      }

      const hit = el('rect', { class:'mk-hit', x:m.l, y:y - rowH / 2, width:iw, height:rowH });
      const resShow = e => {
        const box = svg.getBoundingClientRect();
        const ux = (e.clientX - box.left) * (W / (box.width || W));
        const [tx, ty] = toHost(host, svg, ux, y - 16);
        tip.show(tx, ty, c.id + ' · ' + c.name, [
            { tone:c.tone, value:fmt(c.rmse, 2) + ' mm', label:'RMSE' },
            { tone:c.tone, value:(c.mean < 0 ? '−' : '') + fmt(Math.abs(c.mean), 2) + ' mm', label:t('mean') },
            { tone:c.tone, value:fmt(c.max, 2) + ' mm', label:'max |e|' },
            { tone:c.tone, value:String(c.n), label:t('points') }
          ]);
      };
      hit.addEventListener('pointerenter', resShow);
      hit.addEventListener('pointerleave', () => tip.hide());
      makeHit(hit, `${c.id} ${c.name}: RMSE ${fmt(c.rmse,2)} mm, mean ${fmt(c.mean,2)} mm, max ${fmt(c.max,2)} mm, ${c.n} points`,
              () => resShow({ clientX: (svg.getBoundingClientRect().left + X(0)) }), () => tip.hide());
      g.appendChild(hit);
      svg.appendChild(g);
    });
    host.appendChild(svg);
  });
}

/* ---- 8c. OBSERVATION GEOMETRY (plan view) --------------------- */

const geoHost = $('#chart-geometry');
if (geoHost){
  const tip = makeTip(geoHost);
  responsive(geoHost, (host, W) => {
    const S = Math.max(300, Math.min(560, W));
    const H = S;
    const pad = 34;
    const EXT = 10.6;                            /* metres shown each way */
    const cx = W / 2, cy = H / 2;
    const k = (Math.min(S, H) / 2 - pad) / EXT;  /* px per metre */
    const PX = (n, e) => [cx + e * k, cy - n * k];

    const svg = el('svg', { viewBox:`0 0 ${W} ${H}`, width:W, height:H, role:'img',
      'aria-label':'Plan view of the surveyed primitive, the generated boundary and the three disclosed camera vectors.' });

    /* polar grid */
    const diag = Math.SQRT1_2;
    [5, 10].forEach(r => {
      svg.appendChild(el('circle', { class:'ax-grid', cx, cy, r:r * k }));
      svg.appendChild(txt(r + ' m', { class:'ax-txt', x:cx + r * k * diag + 5, y:cy + r * k * diag + 13 }));
    });
    for (let a = 0; a < 360; a += 45){
      const rad = a * Math.PI / 180;
      const [x2, y2] = PX(Math.cos(rad) * EXT, Math.sin(rad) * EXT);
      svg.appendChild(el('line', { class:'ax-grid', x1:cx, y1:cy, x2, y2, opacity:.55 }));
    }
    svg.appendChild(txt('N', { class:'ax-title', x:cx, y:cy - EXT * k - 6, 'text-anchor':'middle' }));
    svg.appendChild(txt('E', { class:'ax-title', x:cx + EXT * k + 6, y:cy + 4 }));

    /* generated boundary + primitive */
    svg.appendChild(el('circle', { cx, cy, r:R_BOUNDARY * k, fill:'none', stroke:'var(--accent-bright)', 'stroke-width':2 }));
    svg.appendChild(el('circle', { cx, cy, r:R_PRIMITIVE * k, fill:'none', stroke:'var(--ink-3)', 'stroke-width':1.6 }));
    svg.appendChild(el('path', { class:'dg-cross', d:`M${cx - 9} ${cy}H${cx + 9}M${cx} ${cy - 9}V${cy + 9}` }));
    if (W >= 420){
      svg.appendChild(txt(t('5.5 m GENERATED BOUNDARY'), { class:'ax-title', fill:'var(--accent)', x:cx, y:cy + R_BOUNDARY * k + 18, 'text-anchor':'middle' }));
      svg.appendChild(txt(t('1.5 m PRIMITIVE'), { class:'ax-txt', x:cx + R_PRIMITIVE * k + 8, y:cy - R_PRIMITIVE * k - 4 }));
    }

    TS.forEach(c => {
      const col = `var(${c.tone})`;
      const [x, y] = PX(c.camN, c.camE);
      const rng = Math.hypot(c.camN, c.camE);
      const az = ((Math.atan2(c.camE, c.camN) * 180 / Math.PI) + 360) % 360;
      const g = el('g');

      /* view cone toward the origin */
      const half = 15 * Math.PI / 180;
      const base = Math.atan2(-c.camE, -c.camN);
      const L = rng * 1.02;
      const p1 = PX(c.camN + Math.cos(base - half) * L, c.camE + Math.sin(base - half) * L);
      const p2 = PX(c.camN + Math.cos(base + half) * L, c.camE + Math.sin(base + half) * L);
      g.appendChild(el('path', { d:`M${x} ${y}L${p1[0]} ${p1[1]}L${p2[0]} ${p2[1]}Z`, fill:col, 'fill-opacity':.1 }));
      g.appendChild(el('line', { stroke:col, 'stroke-width':1.4, 'stroke-dasharray':'4 4', opacity:.75, x1:x, y1:y, x2:cx, y2:cy }));
      g.appendChild(el('circle', { class:'mk-dot', cx:x, cy:y, r:6.5, fill:col }));
      g.appendChild(txt(c.id, { class:'mk-label', x:x + (c.camE < 0 ? -11 : 11), y:y - 9,
        'text-anchor':c.camE < 0 ? 'end' : 'start' }));
      g.appendChild(txt(fmt(rng, 2) + ' m', { class:'ax-txt', x:x + (c.camE < 0 ? -11 : 11), y:y + 6,
        'text-anchor':c.camE < 0 ? 'end' : 'start' }));

      const hit = el('circle', { class:'mk-hit', cx:x, cy:y, r:22 });
      const geoShow = () => {
        const [tx, ty] = toHost(host, svg, x, y - 10);
        tip.show(tx, ty, c.id + ' · ' + c.name + ' ' + t('placement'), [
          { tone:c.tone, value:fmt(rng, 2) + ' m', label:t('local camera vector') },
          { tone:c.tone, value:fmt(az, 1) + '°', label:t('azimuth from N') },
          { tone:c.tone, value:fmt(c.rmse, 1) + ' mm', label:t('TS boundary RMSE') },
          { tone:c.tone, value:String(c.n), label:t('boundary points') }
        ]);
      };
      hit.addEventListener('pointerenter', geoShow);
      hit.addEventListener('pointerleave', () => tip.hide());
      makeHit(hit, `${c.id} ${c.name}: ${fmt(rng,2)} m, ${fmt(az,1)}°, RMSE ${fmt(c.rmse,1)} mm, ${c.n} pts`,
              geoShow, () => tip.hide());
      g.appendChild(hit);
      svg.appendChild(g);
    });
    host.appendChild(svg);
  });
}

/* ---- 8d. HOME COMPARISON BARS -------------------------------- */

const barHost = $('#chart-bars');
if (barHost){
  const tip = makeTip(barHost);
  responsive(barHost, (host, W) => {
    const H = 210, m = { t:16, r:16, b:34, l:16 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const maxCm = groundCm(2, RANGES[2].scale) * 1.16;
    const slot = iw / RANGES.length;
    const bw = Math.min(56, slot - 24);

    const svg = el('svg', { viewBox:`0 0 ${W} ${H}`, width:W, height:H, role:'img',
      'aria-label':'Ground effect of a fixed 2.0 pixel displacement at 7, 9 and 12 metres.' });
    svg.appendChild(el('line', { class:'ax-line', x1:m.l, x2:m.l + iw, y1:m.t + ih, y2:m.t + ih }));

    /* 5 cm limit reference */
    const yLim = m.t + ih - 5 / maxCm * ih;
    svg.appendChild(el('line', { class:'mk-limit', x1:m.l, x2:m.l + iw, y1:yLim, y2:yLim }));
    svg.appendChild(txt(t('5 CM'), { class:'mk-limit-txt', x:m.l + iw, y:yLim - 6, 'text-anchor':'end' }));

    RANGES.forEach((r, i) => {
      const cm = groundCm(2, r.scale);
      const h = cm / maxCm * ih;
      const x = m.l + slot * i + (slot - bw) / 2;
      const y = m.t + ih - h;
      const col = `var(${r.tone})`;
      svg.appendChild(el('path', {
        d:`M${x} ${m.t + ih}V${y + 4}a4 4 0 0 1 4 -4h${bw - 8}a4 4 0 0 1 4 4V${m.t + ih}Z`, fill:col }));
      svg.appendChild(txt(fmt(cm) + ' cm', { class:'mk-label', x:x + bw / 2, y:y - 9, 'text-anchor':'middle' }));
      svg.appendChild(txt(r.m + ' m', { class:'ax-txt', x:x + bw / 2, y:m.t + ih + 19, 'text-anchor':'middle' }));

      const hit = el('rect', { class:'mk-hit', x:m.l + slot * i, y:m.t, width:slot, height:ih });
      const barShow = () => {
        const [tx, ty] = toHost(host, svg, x + bw / 2, y - 22);
        tip.show(tx, ty, r.m + ' ' + t('m viewing range'), [
          { tone:r.tone, value:fmt(cm) + ' cm', label:t('at 2.0 px') },
          { tone:r.tone, value:fmt(r.scale, 3) + ' mm/px', label:t('local scale') },
          { tone:r.tone, value:fmt(pxLimit(r.scale), 3) + ' px', label:t('5 cm limit') }
        ]);
      };
      hit.addEventListener('pointerenter', barShow);
      hit.addEventListener('pointerleave', () => tip.hide());
      makeHit(hit, `${r.m} m: ${fmt(cm)} cm at 2.0 px, ${fmt(r.scale,3)} mm/px, 5 cm limit ${fmt(pxLimit(r.scale),3)} px`,
              barShow, () => tip.hide());
      svg.appendChild(hit);
    });
    host.appendChild(svg);
  });
}

/* ------------------------------------------------------------
   8e. TELEMETRY CLOCK — the strip stays alive without being loud
   ------------------------------------------------------------ */

const clock = $('[data-utc]');
if (clock){
  const tick = () => {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    clock.textContent = `UTC ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
  };
  tick();
  setInterval(tick, 1000);
}

/* ------------------------------------------------------------
   9. TABLE VIEW TOGGLES
   ------------------------------------------------------------ */

$$('[data-table-for]').forEach(btn => {
  const table = $('#' + btn.dataset.tableFor);
  if (!table) return;
  btn.addEventListener('click', () => {
    const show = table.hasAttribute('hidden');
    table.toggleAttribute('hidden', !show);
    btn.textContent = show ? t('Hide data table') : t('Show data table');
    btn.setAttribute('aria-expanded', String(show));
  });
});

/* ------------------------------------------------------------
   10. FOOTER YEAR + BUILD STAMP
   ------------------------------------------------------------ */

$$('[data-year]').forEach(n => { n.textContent = String(new Date().getFullYear()); });

})();
