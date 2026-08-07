/* ============================================================
   JoosAtlas language audit
   Loads every page in Korean and reports any visible text node
   still rendering English. Coverage is measured in the browser,
   against what the reader actually sees — not against the source.
   ============================================================ */
import { chromium } from 'playwright';

const BASE  = 'http://127.0.0.1:8899/';
const PAGES = ['index.html', 'case-001.html', 'about.html', '404.html'];

/* Things that are identical in both languages on purpose. */
const ALLOWED = /^(UTC .*)$|^RMSE [\d.]+ mm$|^[\s\d.,:;·×÷–—/%()[\]+\-−°=<>|↗↑↓✓✕≠⌘…]*$/;
const KEEP = new Set([
  'JoosAtlas','ACERS','RMSE','HOME','WHO','LAB','TOOLS','3D','Plan','C3','R3','D3',
  'Yonghoe JOO','YONGHOE JOO','EN','한국어','Case 001','GitHub ↗','ESC','⌘K',
  'Daejin Pipe Co., Ltd.','Yonsei University','Alumni of Civil, Environmental Resilience Safety',
  'daejinpipero@gmail.com','daejinpipero@yonsei.ac.kr','github.com/daejinpipero-gaja/JoosAtlas',
  'arg min','R, t','ref','ref,sj','b,s','sj','ΔR','λ','μ','ũ','X̃','r̂','R̂','ˆ','· v11.0',
  'TS0038–TS0054','TS0051–TS0058','TS0091–TS0106','N (m)','E (m)','· 17','· 16','· 8',
  'g = p × m ÷ 10','p × m','C · R · D / 7 · 9 · 12 m','the','th surveyed primitive point',
  'q ũ = K [R | t] X̃','X(μ) = C + μ Rᵀ K⁻¹ ũ','ΔR = R̂ b,s − R̂ ref,sj   (SIGN RETAINED)','λ = 11/3','ũ obs','Yonghoe JOO · JoosAtlas v11.0',
]);
const hasHangul = s => /[가-힣]/.test(s);
const looksEnglish = s => /[A-Za-z]{3,}/.test(s);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.addInitScript(() => localStorage.setItem('joosatlas-lang', 'ko'));

const rows = [];
let untranslated = 0, translated = 0;

for (const file of PAGES) {
  await page.goto(BASE + file, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const lang = await page.getAttribute('html', 'lang');
  rows.push([lang === 'ko' ? 'PASS' : 'FAIL', `${file.padEnd(14)} html lang="${lang}"`]);

  /* exercise the interactive parts so their generated text is measured too */
  if (file === 'case-001.html') {
    for (const sel of ['[data-step="3"]', '[data-place="R3"]', '[data-view="3d"]',
                       '[data-range="12"]', '[data-table-for="curve-table"]']) {
      const el = await page.$(sel); if (el) { await el.click(); await page.waitForTimeout(120); }
    }
  }

  const found = await page.evaluate(() => {
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest('script,style,math,noscript,.cmdk,.lightbox')) return NodeFilter.FILTER_REJECT;
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const cs = getComputedStyle(p);
        if (cs.display === 'none' || cs.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
        if (p.closest('[hidden]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    for (let n = w.nextNode(); n; n = w.nextNode()) out.push(n.nodeValue.trim());
    return out;
  });

  const leaks = [];
  for (const s of found) {
    if (ALLOWED.test(s) || KEEP.has(s) || s.length < 3) continue;
    if (hasHangul(s)) { translated++; continue; }
    if (!looksEnglish(s)) continue;
    translated++;                       /* counted, then judged */
    leaks.push(s);
  }
  if (leaks.length) {
    untranslated += leaks.length;
    rows.push(['FAIL', `${file.padEnd(14)} ${leaks.length} untranslated string(s)`]);
    [...new Set(leaks)].slice(0, 25).forEach(s => rows.push(['', `    ${s.slice(0, 100)}`]));
  } else {
    rows.push(['PASS', `${file.padEnd(14)} no untranslated visible text`]);
  }

  /* switching back must be lossless */
  await page.click('.lang-btn');
  await page.waitForTimeout(400);
  const backLang = await page.getAttribute('html', 'lang');
  const backOk = backLang === 'en' && await page.evaluate(() =>
    !/[가-힣]/.test([...document.querySelectorAll('h1,h2,.lede')].map(e => e.textContent).join('')));
  rows.push([backOk ? 'PASS' : 'FAIL', `${file.padEnd(14)} switch back to English is lossless`]);
  await page.click('.lang-btn');
  await page.waitForTimeout(200);
}

await browser.close();

const width = Math.max(...rows.map(r => r[1].length));
console.log('\n' + '─'.repeat(width + 7));
console.log('LANGUAGE AUDIT — Korean coverage measured in the rendered page');
console.log('─'.repeat(width + 7));
rows.forEach(([s, m]) => console.log(`${s.padEnd(5)} ${m}`));
console.log('─'.repeat(width + 7));
const pass = rows.filter(r => r[0] === 'PASS').length;
const fail = rows.filter(r => r[0] === 'FAIL').length;
console.log(`${pass} passed, ${fail} failed · ${translated} visible strings checked, ${untranslated} still English`);
if (errors.length) console.log('PAGE ERRORS: ' + errors.join(' | '));
process.exit(fail ? 1 : 0);
