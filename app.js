const menuBtn = document.querySelector('#menuBtn');
const siteNav = document.querySelector('#siteNav');
menuBtn.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  siteNav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { siteNav.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); }
});

const lensStage = document.querySelector('#lensStage');
const auditLens = document.querySelector('#auditLens');
function moveLens(clientX, clientY){
  const r = lensStage.getBoundingClientRect();
  const x = Math.max(0, Math.min(r.width, clientX - r.left));
  const y = Math.max(0, Math.min(r.height, clientY - r.top));
  auditLens.style.left = `${x}px`;
  auditLens.style.top = `${y}px`;
  const img = auditLens.querySelector('img');
  img.style.width = `${r.width}px`;
  img.style.height = `${r.height}px`;
  img.style.left = `${-x + auditLens.offsetWidth/2}px`;
  img.style.top = `${-y + auditLens.offsetHeight/2}px`;
}
lensStage.addEventListener('pointermove', e => moveLens(e.clientX,e.clientY));
lensStage.addEventListener('pointerdown', e => moveLens(e.clientX,e.clientY));
window.addEventListener('load', () => {
  const r = lensStage.getBoundingClientRect();
  moveLens(r.left+r.width*.62, r.top+r.height*.48);
});
window.addEventListener('resize', () => {
  const r = lensStage.getBoundingClientRect();
  moveLens(r.left+r.width*.62, r.top+r.height*.48);
});

const custodyData = {
  datum:{index:'01 / DATUM',title:'The field comes first.',body:'A boundary must originate from a physical reference before any image can evaluate it.',graphic:'assets/custody-datum.svg',alt:'Diagram representing the physical datum role.'},
  image:{index:'02 / IMAGE',title:'The camera observes. It does not certify.',body:'The image contributes a response, but it cannot create its own independent truth.',graphic:'assets/custody-image.svg',alt:'Diagram representing the image observation role.'},
  reference:{index:'03 / REFERENCE',title:'The answer must be challenged.',body:'Independent evidence is preserved outside the result-producing path.',graphic:'assets/custody-reference.svg',alt:'Diagram representing an independent reference role.'},
  audit:{index:'04 / AUDIT',title:'The claim is decided last.',body:'Only after the roles remain separate can the final spatial claim be accepted or refused.',graphic:'assets/custody-audit.svg',alt:'Diagram representing the final audit role.'}
};
document.querySelectorAll('.custody-card').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.custody-card').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const d = custodyData[btn.dataset.role];
    const graphic = document.querySelector('#custodyGraphic');
    document.querySelector('#custodyIndex').textContent = d.index;
    document.querySelector('#custodyTitle').textContent = d.title;
    document.querySelector('#custodyBody').textContent = d.body;
    graphic.src = d.graphic; graphic.alt = d.alt;
  });
});

const gateState = {observable:false,consistent:false,terminal:false};
const gateMessage = document.querySelector('#gateMessage');
const claimNode = document.querySelector('#claimNode');
const gateBeam = document.querySelector('.gate-beam');
document.querySelectorAll('.gate-switch').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.gate;
    gateState[key] = !gateState[key];
    btn.classList.toggle('active', gateState[key]);
    btn.setAttribute('aria-pressed', String(gateState[key]));
    const count = Object.values(gateState).filter(Boolean).length;
    const permitted = count === 3;
    gateMessage.textContent = permitted ? 'CLAIM PERMITTED — 3 / 3 CONDITIONS MET' : `MEASUREMENT WITHHELD — ${count} / 3 CONDITIONS MET`;
    gateMessage.classList.toggle('permitted', permitted);
    claimNode.textContent = permitted ? 'PERMITTED' : 'WITHHELD';
    claimNode.classList.toggle('permitted', permitted);
    gateBeam.classList.toggle('permitted', permitted);
  });
});

const failureData = {
  resolution:{code:'FAILURE 01',title:'The feature exists. The image cannot support it.',body:'When the visible structure falls below reliable observation, the correct output is not a number. It is a refusal.',quote:'Unverified is not zero.',graphic:'assets/failure-resolution.svg',alt:'A feature becoming too small to support a reliable observation.'},
  consistency:{code:'FAILURE 02',title:'A strong response can still contradict geometry.',body:'Visibility and signal strength are not substitutes for geometric agreement.',quote:'Visibility is not validity.',graphic:'assets/failure-consistency.svg',alt:'Two strong boundaries that visibly disagree in geometry.'},
  terminal:{code:'FAILURE 03',title:'A plausible local fit can bias the final boundary.',body:'Intermediate agreement does not guarantee that the terminal spatial quantity remains correct.',quote:'Local fit is not terminal validity.',graphic:'assets/failure-terminal.svg',alt:'A small local fit propagating into a larger terminal boundary bias.'}
};
document.querySelectorAll('.failure-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.failure-tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    btn.classList.add('active'); btn.setAttribute('aria-selected','true');
    const d = failureData[btn.dataset.failure];
    const graphic = document.querySelector('#failureGraphic');
    document.querySelector('#failureCode').textContent = d.code;
    document.querySelector('#failureTitle').textContent = d.title;
    document.querySelector('#failureBody').textContent = d.body;
    document.querySelector('#failureQuote').textContent = d.quote;
    graphic.src = d.graphic; graphic.alt = d.alt;
  });
});
