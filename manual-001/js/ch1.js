/* ch1.js: registers chapter 1 (scene.js, figs.js, data.js) and holds its two tools. */
(function(){
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>Array.from((r||document).querySelectorAll(s));
function interp(pts,t){if(!pts.length||t<pts[0][0]||t>pts[pts.length-1][0])return null;
  for(let i=1;i<pts.length;i++){if(t<=pts[i][0]){const a=pts[i-1],b=pts[i];return b[0]===a[0]?b[1]:a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0]);}}return null;}
function seqChart(box,legend,seqI){
  const W=470,H=230,ml=40,mr=128,mt=12,mb=30,T=85,pmax=1.04,pmin=0.78;
  const x=t=>ml+(W-ml-mr)*t/T,y=p=>mt+(H-mt-mb)*(pmax-p)/(pmax-pmin);
  let main=[];SEQ.forEach((s,i)=>{if(i<=seqI&&s.tr)main=main.concat(s.tr);});
  const alt=seqI>=5?SEQ[5].alt:[];
  const pl=a=>a.map(p=>x(p[0]).toFixed(1)+','+y(p[1]).toFixed(1)).join(' ');
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="기동 순서에 따른 배관 압력 변화 그래프. 예시 설정값 기준.">`;
  [0.80,0.90,1.00].forEach(v=>{s+=`<line class="c-grid" x1="${ml}" x2="${W-mr}" y1="${y(v)}" y2="${y(v)}"/><text class="c-ts" x="${ml-6}" y="${y(v)+4}" text-anchor="end">${v.toFixed(2)}</text>`;});
  s+=`<line class="c-axis" x1="${ml}" x2="${W-mr}" y1="${H-mb}" y2="${H-mb}"/><text class="c-ts" x="${ml}" y="${H-9}">시간 (눈금 없음)</text><text class="c-ts" x="${ml-6}" y="${mt+2}" text-anchor="end">MPa</text>`;
  SETPOINTS.forEach(sp=>{s+=`<line class="c-ref" x1="${ml}" x2="${W-mr}" y1="${y(sp.v)}" y2="${y(sp.v)}"/><text class="c-t" x="${W-mr+6}" y="${y(sp.v)+4}">${sp.l}</text>`;});
  if(alt.length)s+=`<polyline class="c-line2" points="${pl(alt)}"/><text class="c-t" x="${x(45)}" y="${y(0.80)+16}">정전 시</text>`;
  s+=`<polyline class="c-line" points="${pl(main)}"/>`;
  const endp=(seqI===5?alt:main),e=endp[endp.length-1];
  s+=`<circle class="c-pt" cx="${x(e[0])}" cy="${y(e[1])}" r="5"/><line class="c-cross" y1="${mt}" y2="${H-mb}"/><rect class="c-hit" x="${ml}" y="${mt}" width="${W-ml-mr}" height="${H-mt-mb}" fill="transparent"/></svg><div class="tip"></div>`;
  box.innerHTML=s;
  legend.innerHTML=alt.length?'<span><i></i>정상(주펌프 기동)</span><span><i class="s2"></i>정전(엔진펌프 기동)</span>':'';
  const hitr=$('.c-hit',box),tip=$('.tip',box),cross=$('.c-cross',box),sv=$('svg',box);
  function leave(){tip.style.display='none';cross.style.display='none';}
  hitr.addEventListener('pointermove',ev=>{const r=sv.getBoundingClientRect(),sx=(ev.clientX-r.left)*W/r.width,t=(sx-ml)*T/(W-ml-mr),a=interp(main,t),b=interp(alt,t);
    if(a===null&&b===null){leave();return;}
    cross.setAttribute('x1',sx);cross.setAttribute('x2',sx);cross.style.display='block';
    tip.innerHTML=(a!==null?'<b>'+a.toFixed(2)+'</b> MPa'+(alt.length?' 정상':''):'')+(b!==null?(a!==null?'<br>':'')+'<b>'+b.toFixed(2)+'</b> MPa 정전':'');
    tip.style.display='block';tip.style.left=(ev.clientX-r.left)+'px';tip.style.top=((y(a!==null?a:b))*r.height/H)+'px';});
  hitr.addEventListener('pointerleave',leave);
}
const tool={html:`<section class="sec" id="perf"><h2>성능시험 판정기</h2>
<p class="intro">명판의 정격값과 시험에서 읽은 압력 세 개를 넣으면 기준에 맞는지 바로 판정합니다. 기준은 체절운전에서 정격의 140% 이하, 정격유량의 150%에서 정격의 65% 이상입니다.</p>
<div class="cols"><div class="card"><form class="form" id="perfForm">
<label for="pRated">정격토출압 <span class="unit">MPa</span></label><input id="pRated" type="number" step="0.01" min="0.1" value="0.80" inputmode="decimal">
<label for="qRated">정격토출량 <span class="unit">L/min</span></label><input id="qRated" type="number" step="10" min="10" value="1200" inputmode="decimal">
<label for="pChurn">체절운전 압력 <span class="unit">MPa</span></label><input id="pChurn" type="number" step="0.01" min="0" value="1.02" inputmode="decimal">
<label for="p100">정격유량에서 압력 <span class="unit">MPa</span></label><input id="p100" type="number" step="0.01" min="0" value="0.81" inputmode="decimal">
<label for="p150">150% 유량에서 압력 <span class="unit">MPa</span></label><input id="p150" type="number" step="0.01" min="0" value="0.58" inputmode="decimal">
</form><div class="verdicts" id="perfOut"></div><p class="note">입력값은 예시입니다. 유량은 정격의 0%, 100%, 150% 세 점에서 읽은 것으로 봅니다.</p></div>
<div class="card"><div class="chart" id="perfChart"></div><p class="note">곡선은 세 측정점을 이은 근사입니다. 실제 펌프 곡선은 제조사 성능곡선을 따릅니다.</p></div></div></section>`,
init(){
 function perf(){
  const g=id=>parseFloat($('#'+id).value);
  const P=g('pRated'),Q=g('qRated'),a=g('pChurn'),b=g('p100'),c=g('p150'),out=$('#perfOut'),ch=$('#perfChart');
  if(!(P>0)||!(Q>0)||[a,b,c].some(v=>!(v>=0))){out.innerHTML='<p style="color:var(--crit)">정격토출압과 정격토출량은 0보다 큰 숫자, 측정 압력은 0 이상의 숫자로 넣어 주세요.</p>';ch.innerHTML='';return;}
  const ra=a/P*100,rb=b/P*100,rc=c/P*100,okA=ra<=140,okB=rb>=100,okC=rc>=65,all=okA&&okB&&okC;
  const vd=o=>`<span class="vd ${o?'ok':'ng'}">${o?'✓ 적합':'✕ 부적합'}</span>`;
  out.innerHTML=`<table><thead><tr><th>시험</th><th class="num">측정</th><th class="num">정격 대비</th><th>기준</th><th>판정</th></tr></thead><tbody>`
   +`<tr><td>체절 (유량 0)</td><td class="num">${a.toFixed(2)}</td><td class="num">${ra.toFixed(0)}%</td><td>140% 이하 (${(P*1.4).toFixed(2)} MPa)</td><td>${vd(okA)}</td></tr>`
   +`<tr><td>정격 (${Q.toFixed(0)} L/min)</td><td class="num">${b.toFixed(2)}</td><td class="num">${rb.toFixed(0)}%</td><td>100% 이상 (${P.toFixed(2)} MPa)</td><td>${vd(okB)}</td></tr>`
   +`<tr><td>150% (${(Q*1.5).toFixed(0)} L/min)</td><td class="num">${c.toFixed(2)}</td><td class="num">${rc.toFixed(0)}%</td><td>65% 이상 (${(P*0.65).toFixed(2)} MPa)</td><td>${vd(okC)}</td></tr>`
   +`</tbody></table><p style="margin-top:10px;font-weight:600">${all?'세 점 모두 기준 안에 있습니다.':'기준을 벗어난 점이 있습니다. 흡입 쪽 상태와 계기를 먼저 확인한 뒤 다시 잽니다.'}</p>`
   +`<p class="note">이 펌프의 유량계는 ${(Q*1.75).toFixed(0)} L/min(정격의 175%) 이상까지 잴 수 있어야 합니다.</p>`;
  const W=560,H=300,ml=46,mr=16,mt=16,mb=44,X=175,Y=160;
  const x=v=>ml+(W-ml-mr)*v/X,y=v=>mt+(H-mt-mb)*(Y-Math.max(0,Math.min(Y,v)))/Y;
  const f=v=>ra*(v-100)*(v-150)/15000+rb*v*(v-150)/(-5000)+rc*v*(v-100)/7500;
  let pts=[];for(let v=0;v<=160;v+=4)pts.push(x(v).toFixed(1)+','+y(f(v)).toFixed(1));
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="펌프 성능 곡선과 기준. 세 측정점의 정격 대비 압력.">`;
  [0,65,100,140].forEach(v=>{s+=`<line class="c-grid" x1="${ml}" x2="${W-mr}" y1="${y(v)}" y2="${y(v)}"/><text class="c-ts" x="${ml-6}" y="${y(v)+4}" text-anchor="end">${v}%</text>`;});
  [[0,'0'],[100,'100% ('+Q.toFixed(0)+')'],[150,'150% ('+(Q*1.5).toFixed(0)+')']].forEach(t=>{s+=`<line class="c-grid" x1="${x(t[0])}" x2="${x(t[0])}" y1="${mt}" y2="${H-mb}"/><text class="c-ts" x="${x(t[0])}" y="${H-mb+16}" text-anchor="${t[0]===0?'start':'middle'}">${t[1]}</text>`;});
  s+=`<line class="c-axis" x1="${ml}" x2="${W-mr}" y1="${H-mb}" y2="${H-mb}"/><text class="c-ts" x="${W-mr}" y="${H-8}" text-anchor="end">유량, 정격 대비 (L/min)</text><text class="c-ts" x="${ml}" y="${mt-4}">압력, 정격 대비</text>`;
  s+=`<rect class="c-zone" x="${x(0)}" y="${y(160)}" width="${x(14)-x(0)}" height="${y(140)-y(160)}"/><line class="c-lim" x1="${x(0)}" x2="${x(14)}" y1="${y(140)}" y2="${y(140)}"/><text class="c-t" x="${x(0)+4}" y="${y(140)-8}">140% 이하</text>`;
  s+=`<rect class="c-zone" x="${x(93)}" y="${y(100)}" width="${x(107)-x(93)}" height="${y(0)-y(100)}"/><line class="c-lim" x1="${x(93)}" x2="${x(107)}" y1="${y(100)}" y2="${y(100)}"/><text class="c-t" x="${x(100)}" y="${y(0)-6}" text-anchor="middle">100% 이상</text>`;
  s+=`<rect class="c-zone" x="${x(143)}" y="${y(65)}" width="${x(157)-x(143)}" height="${y(0)-y(65)}"/><line class="c-lim" x1="${x(143)}" x2="${x(157)}" y1="${y(65)}" y2="${y(65)}"/><text class="c-t" x="${x(150)}" y="${y(0)-6}" text-anchor="middle">65% 이상</text>`;
  s+=`<polyline class="c-line" points="${pts.join(' ')}"/>`;
  [[0,ra,a,okA,'체절'],[100,rb,b,okB,'정격'],[150,rc,c,okC,'150%']].forEach(p=>{
    s+=`<circle class="c-pt" cx="${x(p[0])}" cy="${y(p[1])}" r="5"/><text class="c-t" x="${x(p[0])+9}" y="${y(p[1])-9}">${p[1].toFixed(0)}% ${p[3]?'✓':'✕'}</text>`
     +`<circle class="pt-hit" cx="${x(p[0])}" cy="${y(p[1])}" r="16" fill="transparent" tabindex="0" data-tip="${p[4]}: ${p[2].toFixed(2)} MPa, 정격의 ${p[1].toFixed(0)}%"/>`;});
  s+=`</svg><div class="tip"></div>`;
  ch.innerHTML=s;
  const tip=$('.tip',ch),sv=$('svg',ch);
  $$('.pt-hit',ch).forEach(h=>{const show=()=>{const r=sv.getBoundingClientRect();tip.textContent=h.dataset.tip;tip.style.display='block';tip.style.left=(+h.getAttribute('cx')*r.width/W)+'px';tip.style.top=(+h.getAttribute('cy')*r.height/H)+'px';};
    const hide=()=>{tip.style.display='none';};h.addEventListener('pointerenter',show);h.addEventListener('pointerleave',hide);h.addEventListener('focus',show);h.addEventListener('blur',hide);});
 }
 $('#perfForm').addEventListener('input',perf);$('#perfForm').addEventListener('submit',e=>e.preventDefault());perf();
}};
const LVL={n:[190,64.5],low:[232,22.5],over:[166,88.5]};
BOOK.add({id:'pump-room',n:1,title:'펌프실',vb:'0 0 1440 880',minw:940,build:buildScene,first:'pump',
 lede:'그림에서 부품을 누르면 용도, 고장 증상, 조치가 열립니다. 위쪽 단추로 평상시와 화재, 고장 상태를 바꾸면 물이 어디로 흐르는지 볼 수 있습니다. 기준 건물은 지하 2층, 지상 10층이고 수조가 펌프보다 아래에 있습니다.',
 cats:CATS,parts:PARTS,modes:MODES,def:{run:'standby',fault:'footleak'},
 seqs:[{id:'fire',n:'화재 한 건의 시간표',steps:SEQ,chart:seqChart,note:'예시 설정값입니다. 정격 0.8 MPa, 체절압 1.0 MPa인 펌프에 NFPA 20 부속서의 권고 순서를 적용했습니다.',
   table:()=>`<table><thead><tr><th>단계</th><th class="num">끝 압력</th><th>도는 펌프</th></tr></thead><tbody>${SEQ.map((s,i)=>{const a=s.tr||s.alt;return `<tr><td>${i+1}. ${s.t}</td><td class="num">${a[a.length-1][1].toFixed(2)}</td><td>${s.run}</td></tr>`;}).join('')}</tbody></table>`}],
 onMode(m,svg){const l=LVL[m.lvl||'n'],lv=svg.querySelector('#lvlM');if(lv){lv.setAttribute('y',l[0]);lv.setAttribute('height',l[1]);}},
 posToggle:true,tool:tool});
})();
