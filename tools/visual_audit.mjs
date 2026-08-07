/* ============================================================
   JoosAtlas visual audit
   Renders every page, screenshots each portrait element, then
   hands the rendered pixels to a face + emblem detector.
   Fails if a head is cropped or a symbol is lost.
   ============================================================ */
import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import fs from 'fs';

const BASE = 'http://127.0.0.1:8899/';
const OUT  = 'audit';
fs.rmSync(OUT, { recursive:true, force:true });
fs.mkdirSync(OUT, { recursive:true });

const VIEWPORTS = [
  { name:'desktop', width:1440, height:950,  scale:1 },
  { name:'laptop',  width:1180, height:800,  scale:1 },
  { name:'tablet',  width:834,  height:1100, scale:1 },
  { name:'mobile',  width:390,  height:844,  scale:2 }
];
const PAGES = ['index.html', 'about.html', 'case-001.html', '404.html'];

const shots = [];
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
const errors = [];

for (const vp of VIEWPORTS){
  const ctx = await browser.newContext({
    viewport:{ width:vp.width, height:vp.height },
    deviceScaleFactor:vp.scale,
    isMobile:vp.name === 'mobile',
    hasTouch:vp.name === 'mobile'
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${vp.name}: ${e.message}`));

  for (const file of PAGES){
    await page.goto(BASE + file, { waitUntil:'networkidle' });
    await page.addStyleTag({ content:'.rv{opacity:1!important;transform:none!important;transition:none!important}' });
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; });
      await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    });
    await page.waitForTimeout(350);

    const marks = await page.$$('[data-portrait]');
    for (let i = 0; i < marks.length; i++){
      const kind = await marks[i].getAttribute('data-portrait');
      const box  = await marks[i].boundingBox();
      if (!box || box.width < 40) continue;
      /* the exact source region this crop keeps — same math the browser uses for object-fit:cover */
      const crop = await marks[i].evaluate(node => {
        const img = node.tagName === 'IMG' ? node : node.querySelector('img');
        if (!img || !img.naturalWidth) return null;
        const r = img.getBoundingClientRect();
        const cs = getComputedStyle(img);
        const nw = img.naturalWidth, nh = img.naturalHeight;
        const fit = cs.objectFit;
        const sc = fit === 'contain' ? Math.min(r.width / nw, r.height / nh)
                                     : Math.max(r.width / nw, r.height / nh);
        const dw = nw * sc, dh = nh * sc;
        const ox = Math.max(0, dw - r.width), oy = Math.max(0, dh - r.height);
        const pos = cs.objectPosition.split(' ');
        const pct = (v, span) => v.endsWith('%') ? parseFloat(v) / 100
                  : v === 'left' || v === 'top' ? 0 : v === 'right' || v === 'bottom' ? 1
                  : v === 'center' ? .5 : (parseFloat(v) || 0) / (span || 1);
        const px = pct(pos[0] || '50%'), py = pct(pos[1] || pos[0] || '50%');
        return { fit,
          x0:(ox * px) / dw, x1:(ox * px + Math.min(r.width, dw)) / dw,
          y0:(oy * py) / dh, y1:(oy * py + Math.min(r.height, dh)) / dh };
      });
      const name = `${file.replace('.html','')}__${kind}__${vp.name}_${i}`;
      await marks[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      await marks[i].screenshot({ path:`${OUT}/${name}.png` });
      shots.push({ file:`${OUT}/${name}.png`, kind, page:file, viewport:vp.name, crop,
                   w:Math.round(box.width), h:Math.round(box.height) });
    }

    /* whole-viewport capture of the first screen, for composition review */
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.screenshot({ path:`${OUT}/fold__${file.replace('.html','')}__${vp.name}.png` });
  }
  await ctx.close();
}
await browser.close();

fs.writeFileSync(`${OUT}/shots.json`, JSON.stringify(shots, null, 1));
if (errors.length) console.log('PAGE ERRORS:\n' + errors.join('\n'));

const report = execFileSync('python3', ['detect_audit.py', `${OUT}/shots.json`], { encoding:'utf8' });
console.log(report);
const failed = /\bFAIL\b/.test(report);
process.exit(failed ? 1 : 0);
