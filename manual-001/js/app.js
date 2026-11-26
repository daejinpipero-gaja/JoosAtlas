/* app.js: chapter framework. Renders the chapter picked by the hash; parts are global across chapters. */
(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wide=()=>window.matchMedia('(min-width:1500px)').matches;
const smooth=()=>window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth';
const glow=(id,col)=>`<filter id="${id}" filterUnits="userSpaceOnUse" x="-30" y="-30" width="1500" height="1000"><feMorphology in="SourceAlpha" operator="dilate" radius="2.5" result="d"/><feGaussianBlur in="d" stdDeviation="2.5" result="b"/><feFlood flood-color="${col}" flood-opacity=".95"/><feComposite in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
document.body.insertAdjacentHTML('afterbegin','<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">'+SCENE_DEFS.replace('</defs>',glow('fSel','#e0261c')+glow('fHov','#257de0')+'</defs>')+'</svg>');

const partById={},homeOf={};
BOOK.ch.forEach(c=>(c.parts||[]).forEach(p=>{partById[p.id]=p;homeOf[p.id]=c;}));
const stName={v:'조문 확인',c:'대조 필요',p:'실무·계산'};
let C=null,svg=null,cur=null,mode=null,tab='run',seqSel=0,seqI=0,pos=false,lastRun=null,lastFault=null;
const figState={};
function setHash(h){try{history.replaceState(null,'','#'+h);}catch(e){}}

/* ---------- detail card ---------- */
function faultCard(f){return `<div class="fault lv-${f.lv}"><span class="pill ${f.lv}" title="${esc(LV[f.lv].d)}">${esc(LV[f.lv].t)}</span><strong>${esc(f.s)}</strong><dl><dt>원인</dt><dd>${esc(f.c)}</dd><dt>조치</dt><dd>${esc(f.a)}</dd></dl></div>`;}
function figBlock(p){const f=FIG[p.fig];const st=f.states.length?(figState[p.id]||f.states[0][0]):'_';
  const btns=f.states.map(s=>`<button class="opt" data-st="${s[0]}" aria-pressed="${s[0]===st}">${esc(s[1])}</button>`).join('');
  return `<figure class="d-fig">${btns?`<div class="states" role="group" aria-label="그림 상태 선택">${btns}</div>`:''}<div id="figSvg">${f.draw(st)}</div><figcaption id="figCap">${esc(f.cap[st])}</figcaption></figure>`;}
function renderDetail(p){
  const hc=homeOf[p.id];
  let h=`<button class="linkbtn backtop" data-back="1">그림으로 돌아가기</button>`;
  h+=`<p class="d-cat">${hc.n}장 ${esc(hc.title)}</p><h2>${esc(p.name)}</h2><p class="d-en">${esc(p.en)}</p><p class="d-one">${esc(p.one)}</p>`;
  if(p.lift)h+=`<span class="d-lift">${p.id==='cgauge'?'수조가 펌프보다 높은 건물에서는 생략할 수 있습니다':'수조가 펌프보다 높은 건물에는 없습니다'}</span>`;
  if(hc!==C)h+=`<p class="d-home">이 부품은 <button class="linkbtn" data-ch="${hc.id}" data-part="${p.id}">${hc.n}장 ${esc(hc.title)}</button>의 그림에 자세히 나옵니다.</p>`;
  if(p.fig&&FIG[p.fig])h+=figBlock(p);
  h+=`<div class="d-sec"><h3>쉽게</h3>${p.easy.map(x=>`<p>${esc(x)}</p>`).join('')}</div>`;
  h+=`<div class="d-sec"><h3>작동할 때</h3><p>${esc(p.seq)}</p></div>`;
  h+=`<div class="d-sec"><h3>고장과 조치</h3>${p.faults.map(faultCard).join('')}</div>`;
  h+=`<details class="deep"><summary>깊이 보기 · 원리와 기준</summary><div class="in"><ul>${p.deep.map(x=>`<li>${x}</li>`).join('')}</ul>`
    +`<table><thead><tr><th>근거</th><th>내용</th><th>상태</th></tr></thead><tbody>${p.code.map(c=>`<tr><td>${esc(c.c)}</td><td>${esc(c.t)}</td><td><span class="st ${c.v}">${stName[c.v]}</span></td></tr>`).join('')}</tbody></table></div></details>`;
  $('#detail').innerHTML=h;
}
function select(id,scrollTo){
  const p=partById[id];if(!p)return;
  if(!svg||!$('.part[data-id="'+id+'"]',svg)){openChapter(homeOf[id],id);window.scrollTo(0,0);return;}
  cur=id;
  $$('.part.sel,.lb.sel',svg).forEach(e=>e.classList.remove('sel'));
  $$('.part[data-id="'+id+'"],.lb[data-id="'+id+'"]',svg).forEach(e=>e.classList.add('sel'));
  $$('.chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.id===id)));
  renderDetail(p);setHash(id);
  if(scrollTo==='detail'&&!wide())$('#detail').scrollIntoView({behavior:smooth(),block:'start'});
  if(scrollTo==='room')(wide()?$('#room'):$('#detail')).scrollIntoView({behavior:smooth(),block:'start'});
}

/* ---------- modes, captions, sequences ---------- */
function mark(ids){const g=$('.marks',svg);if(!g)return;let h='';
  (ids||[]).forEach(id=>{const e=$('.part[data-id="'+id+'"]',svg);if(!e)return;let b;try{b=e.getBBox();}catch(x){return;}
    if(!b.width&&!b.height)return;const r=Math.min(64,Math.max(b.width,b.height)/2+10);h+=`<circle class="mark" cx="${(b.x+b.width/2).toFixed(1)}" cy="${(b.y+b.height/2).toFixed(1)}" r="${r.toFixed(1)}"/>`;});
  g.innerHTML=h;}
function applyMode(k,hl){
  mode=k;const m=C.modes[k];
  $$('.flow',svg).forEach(f=>{const c=m.fl[f.dataset.f];f.setAttribute('class','flow'+(c?' '+c:''));});
  $$('.lamp[data-l]',svg).forEach(l=>l.classList.toggle('run',m.lamp.indexOf(l.dataset.l)>=0));
  $$('[data-show]',svg).forEach(b=>b.classList.toggle('show',b.dataset.show.split(' ').indexOf(k)>=0));
  if(C.onMode)C.onMode(m,svg);
  $$('#optsRun .opt,#optsFault .opt').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===k&&tab!=='seq')));
  mark(hl);renderCap();
}
function renderCap(){
  const m=C.modes[mode],c=$('#cap');let h='<div>',sq=null,st=null;
  if(tab==='seq'){sq=C.seqs[seqSel];st=sq.steps[seqI];
    h+=`<p class="kind">${esc(sq.n)} · ${seqI+1} / ${sq.steps.length}</p><h2>${esc(st.t)}</h2><ul><li>${esc(st.d)}</li></ul><div class="reads"><span class="read">도는 펌프: ${esc(st.run)}</span></div>`;
  }else{
    h+=`<p class="kind">${m.g==='fault'?'고장 보기':'운전 상태'} · ${esc(m.n)}</p><h2>${esc(m.t)}</h2><ul>${m.d.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="reads">${m.read.map(x=>`<span class="read">${esc(x)}</span>`).join('')}</div>`;
  }
  const rel=(st&&st.hl)||m.rel;
  h+=`<div class="rel">관련 부품 ${rel.map(id=>`<button class="linkbtn" data-goto="${id}">${esc(partById[id].name)}</button>`).join('')}</div>`;
  if(pos)h+=`<p class="posnote">수조가 펌프보다 높은 건물에서는 흐리게 표시된 풋밸브, 물올림탱크, 물올림관이 없습니다. 물이 제 무게로 펌프까지 들어오기 때문입니다. 연성계도 생략할 수 있습니다.</p>`;
  h+='</div>';
  const chart=sq&&sq.chart;
  if(chart)h+=`<div><div class="chart" id="seqChart"></div><div class="legend" id="seqLegend"></div><p class="note">${esc(sq.note||'')}</p>${sq.table?`<details class="note"><summary>표로 보기</summary>${sq.table()}</details>`:''}</div>`;
  c.className='cap'+(m.g==='fault'&&tab!=='seq'?' fault':'')+(chart?' withchart':'');
  c.innerHTML=h;
  if(chart)sq.chart($('#seqChart'),$('#seqLegend'),seqI);
}
function setSeq(i){const sq=C.seqs[seqSel];seqI=Math.max(0,Math.min(sq.steps.length-1,i));
  $('#seqDots').innerHTML=sq.steps.map((s,j)=>`<li><button data-i="${j}" aria-label="${j+1}단계 ${esc(s.t)}"${j===seqI?' aria-current="step"':''}>${j+1}</button></li>`).join('');
  $$('#seqPick .opt').forEach((b,j)=>b.setAttribute('aria-pressed',String(j===seqSel)));
  $('#seqPrev').disabled=seqI===0;$('#seqNext').disabled=seqI===sq.steps.length-1;
  const st=sq.steps[seqI];applyMode(st.mode,st.hl);}
function setTab(t){
  tab=t;
  $$('.tab').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===t)));
  $('#optsRun').hidden=t!=='run';$('#optsFault').hidden=t!=='fault';$('#optsSeq').hidden=t!=='seq';
  if(t==='run')applyMode(lastRun);else if(t==='fault')applyMode(lastFault);else setSeq(seqI);
}

/* ---------- chapter ---------- */
function stageHtml(c){
  const hasF=Object.keys(c.modes).some(k=>c.modes[k].g==='fault');
  const btn=g=>Object.keys(c.modes).filter(k=>c.modes[k].g===g).map(k=>`<button class="opt" data-mode="${k}" aria-pressed="false">${esc(c.modes[k].n)}</button>`).join('');
  let chips=c.cats.map(ct=>`<span class="chipgroup"><b>${ct[1]}</b>${c.parts.filter(p=>p.cat===ct[0]).map(p=>`<button class="chip" data-id="${p.id}" aria-pressed="false">${esc(p.name)}</button>`).join('')}</span>`).join('');
  if(c.extra)chips+=`<span class="chipgroup"><b>다른 장의 부품</b>${c.extra.map(id=>`<button class="chip" data-id="${id}" aria-pressed="false">${esc(partById[id].name)}</button>`).join('')}</span>`;
  return `<div class="stage" id="room"><div class="left">
  <div class="tabs" role="tablist" aria-label="그림 보기 방식"><button class="tab" role="tab" data-tab="run" aria-selected="true">운전 상태</button>${c.seqs?'<button class="tab" role="tab" data-tab="seq" aria-selected="false">순서 보기</button>':''}${hasF?'<button class="tab" role="tab" data-tab="fault" aria-selected="false">고장 보기</button>':''}
  <span class="spacer"></span><label class="tog"><input type="checkbox" id="togLabel" checked> 이름표</label>${c.posToggle?'<label class="tog"><input type="checkbox" id="togPos"> 수조가 펌프보다 높다면</label>':''}</div>
  <div id="optsRun" class="opts">${btn('run')}</div><div id="optsFault" class="opts fault" hidden>${btn('fault')}</div>
  <div id="optsSeq" hidden>${c.seqs&&c.seqs.length>1?`<div class="opts seqpick" id="seqPick">${c.seqs.map((s,i)=>`<button class="opt" data-seq="${i}" aria-pressed="false">${esc(s.n)}</button>`).join('')}</div>`:'<div id="seqPick"></div>'}<div class="stepper"><button class="opt" id="seqPrev">이전</button><ol class="dots" id="seqDots"></ol><button class="opt" id="seqNext">다음</button></div></div>
  <div class="scenewrap"><svg id="scene" role="group" aria-label="${esc(c.title)} 그림. 부품을 선택하면 설명이 열립니다."></svg></div>
  <div class="cap" id="cap" aria-live="polite"></div><div class="chips" id="chips" aria-label="부품 목록">${chips}</div></div><aside id="detail" aria-live="polite"></aside></div>`;
}
function openChapter(c,partId){
  C=c;cur=null;tab='run';seqSel=0;seqI=0;pos=false;
  $$('#chapNav .ch').forEach(b=>{const on=b.dataset.ch===c.id;b.classList.toggle('on',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  $('#chapTitle').textContent=c.n+'장. '+c.title;
  $('#main').innerHTML=`<p class="lede">${esc(c.lede)}</p>`+(c.build?stageHtml(c):c.page.html)+(c.tool?c.tool.html:'');
  if(c.build){
    svg=$('#scene');svg.setAttribute('viewBox',c.vb);svg.style.minWidth=(c.minw||940)+'px';
    svg.innerHTML=c.build()+'<g class="marks" aria-hidden="true"></g>';
    lastRun=c.def.run;lastFault=c.def.fault;setTab('run');
    select(partId&&$('.part[data-id="'+partId+'"]',svg)?partId:(c.first||c.parts[0].id));
  }else{svg=null;c.page.init({esc:esc,part:id=>partById[id]});setHash(c.id);}
  if(c.tool)c.tool.init();
  const rows=(c.parts||[]).map(p=>p.code.map(k=>`<tr><td>${esc(k.c)}</td><td>${esc(k.t)}</td><td><button class="linkbtn" data-goto="${p.id}" data-far="1">${esc(p.name)}</button></td><td><span class="st ${k.v}">${stName[k.v]}</span></td></tr>`).join('')).join('');
  $('#codeWrap').hidden=!rows;$('#codeTable tbody').innerHTML=rows;
  if(partId&&c.build)setHash(partId);else setHash(c.id);
}
function route(){
  const h=(location.hash||'').slice(1),c=BOOK.ch.find(x=>x.id===h);
  if(c){if(c!==C){openChapter(c);window.scrollTo(0,0);}return;}
  if(partById[h]){if(h!==cur){const hc=homeOf[h];if(svg&&$('.part[data-id="'+h+'"]',svg))select(h);else openChapter(hc,h);}return;}
  if(!C)openChapter(BOOK.ch[0]);
}

/* ---------- events (delegated; the chapter body is re-rendered) ---------- */
document.addEventListener('click',e=>{
  const t=e.target;let x;
  if((x=t.closest('#chapNav .ch'))){const c=BOOK.ch.find(k=>k.id===x.dataset.ch);if(c&&c!==C){openChapter(c);window.scrollTo(0,0);}return;}
  if((x=t.closest('[data-ch]'))){const c=BOOK.ch.find(k=>k.id===x.dataset.ch);if(c){openChapter(c,x.dataset.part);window.scrollTo(0,0);}return;}
  if((x=t.closest('.tab'))){setTab(x.dataset.tab);return;}
  if((x=t.closest('#optsRun [data-mode]'))){lastRun=x.dataset.mode;applyMode(lastRun);return;}
  if((x=t.closest('#optsFault [data-mode]'))){lastFault=x.dataset.mode;applyMode(lastFault);return;}
  if((x=t.closest('[data-seq]'))){seqSel=+x.dataset.seq;setSeq(0);return;}
  if(t.closest('#seqPrev')){setSeq(seqI-1);return;}
  if(t.closest('#seqNext')){setSeq(seqI+1);return;}
  if((x=t.closest('#seqDots button'))){setSeq(+x.dataset.i);return;}
  if((x=t.closest('.chip'))){select(x.dataset.id,'detail');return;}
  if((x=t.closest('[data-st]'))){const p=partById[cur],f=FIG[p.fig];figState[cur]=x.dataset.st;$('#figSvg').innerHTML=f.draw(x.dataset.st);$('#figCap').textContent=f.cap[x.dataset.st];
    $$('[data-st]',$('#detail')).forEach(b=>b.setAttribute('aria-pressed',String(b===x)));return;}
  if(t.closest('[data-back]')){$('.scenewrap').scrollIntoView({behavior:smooth(),block:'center'});return;}
  if((x=t.closest('[data-goto]'))){select(x.dataset.goto,x.dataset.far?'room':'detail');return;}
  if(svg&&(x=t.closest('#scene [data-id]'))){select(x.dataset.id,'detail');}
});
document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const x=e.target.closest&&e.target.closest('#scene .part');if(x){e.preventDefault();select(x.dataset.id,'detail');}});
document.addEventListener('change',e=>{
  if(e.target.id==='togLabel')svg.classList.toggle('nolabel',!e.target.checked);
  if(e.target.id==='togPos'){pos=e.target.checked;svg.classList.toggle('pos',pos);renderCap();}
});

/* ---------- init ---------- */
$('#chapNav').innerHTML=BOOK.ch.map(c=>`<li><button class="ch" data-ch="${c.id}">${c.n} ${esc(c.title)}</button></li>`).join('');
$('#srcList').innerHTML=SOURCES.map(s=>`<li>${esc(s[0])}<br><a href="${s[1]}" rel="noopener">${esc(s[1].length>80?s[1].slice(0,78)+'…':s[1])}</a></li>`).join('');
route();if(!C)openChapter(BOOK.ch[0]);
window.addEventListener('hashchange',route);
})();
