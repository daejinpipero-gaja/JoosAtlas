/* scene.js: pump room illustration. Pure string builder. viewBox 0 0 1440 880, floor at y=650. */
const SCENE_DEFS = `<defs>
<linearGradient id="gV" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#5b6872"/><stop offset=".32" stop-color="#e6ebee"/><stop offset=".62" stop-color="#a7b2b9"/><stop offset="1" stop-color="#525e67"/></linearGradient>
<linearGradient id="gH" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5b6872"/><stop offset=".32" stop-color="#e6ebee"/><stop offset=".62" stop-color="#a7b2b9"/><stop offset="1" stop-color="#525e67"/></linearGradient>
<radialGradient id="gJ" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#e6ebee"/><stop offset=".6" stop-color="#a0abb2"/><stop offset="1" stop-color="#525e67"/></radialGradient>
<linearGradient id="gCv" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#93300f"/><stop offset=".35" stop-color="#f5916a"/><stop offset="1" stop-color="#a23a16"/></linearGradient>
<linearGradient id="gCh" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#93300f"/><stop offset=".35" stop-color="#f5916a"/><stop offset="1" stop-color="#a23a16"/></linearGradient>
<linearGradient id="gRv" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#8a1e19"/><stop offset=".32" stop-color="#ef6a60"/><stop offset=".65" stop-color="#c8322b"/><stop offset="1" stop-color="#7d1a16"/></linearGradient>
<linearGradient id="gRh" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8a1e19"/><stop offset=".32" stop-color="#ef6a60"/><stop offset=".65" stop-color="#c8322b"/><stop offset="1" stop-color="#7d1a16"/></linearGradient>
<radialGradient id="gRr" cx=".36" cy=".32" r=".8"><stop offset="0" stop-color="#f2776d"/><stop offset=".55" stop-color="#c8322b"/><stop offset="1" stop-color="#7d1a16"/></radialGradient>
<linearGradient id="gTankF" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#d9433b"/><stop offset="1" stop-color="#b52a24"/></linearGradient>
<linearGradient id="gDk" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#252d34"/><stop offset=".35" stop-color="#77828a"/><stop offset="1" stop-color="#20272d"/></linearGradient>
<linearGradient id="gDkH" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#252d34"/><stop offset=".35" stop-color="#77828a"/><stop offset="1" stop-color="#20272d"/></linearGradient>
<linearGradient id="gMh" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2b4460"/><stop offset=".3" stop-color="#8fb0cf"/><stop offset=".65" stop-color="#3f6288"/><stop offset="1" stop-color="#1f3348"/></linearGradient>
<linearGradient id="gEng" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5a6670"/><stop offset=".25" stop-color="#3d4a55"/><stop offset="1" stop-color="#232c33"/></linearGradient>
<linearGradient id="gBr" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#7a5a12"/><stop offset=".35" stop-color="#f1d58a"/><stop offset="1" stop-color="#8a6516"/></linearGradient>
<linearGradient id="gSs" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6f7a82"/><stop offset=".4" stop-color="#f4f6f7"/><stop offset="1" stop-color="#6a757d"/></linearGradient>
<linearGradient id="gWater" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6db5ec" stop-opacity=".85"/><stop offset="1" stop-color="#2a7cc0" stop-opacity=".9"/></linearGradient>
<linearGradient id="gWall" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e7ecec"/><stop offset="1" stop-color="#d6dddc"/></linearGradient>
<pattern id="pConc" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#a9b1b3"/><path d="M0 14L14 0" stroke="#8f989b" stroke-width="1.2"/><circle cx="4" cy="4" r="1" fill="#8a9396"/><circle cx="11" cy="9" r=".8" fill="#c3cacb"/></pattern>
<pattern id="pMesh" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#59646c"/><path d="M0 0L5 5M5 0L0 5" stroke="#c9d0d4" stroke-width=".7"/></pattern>
</defs>`;

function buildScene(){
const o=[];
const R=(x,y,w,h,f,ex)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${ex?' '+ex:''}/>`;
const pV=(x,y1,y2,d)=>R(x-d/2,Math.min(y1,y2),d,Math.abs(y2-y1),'url(#gV)');
const pH=(x1,x2,y,d)=>R(Math.min(x1,x2),y-d/2,Math.abs(x2-x1),d,'url(#gH)');
const el=(x,y,d)=>`<circle cx="${x}" cy="${y}" r="${d/2+1.5}" fill="url(#gJ)"/>`;
const cV=(x,y,d)=>R(x-d/2-3,y-4,d+6,8,'url(#gCv)','rx="2"');
const cH=(x,y,d)=>R(x-4,y-d/2-3,8,d+6,'url(#gCh)','rx="2"');
const part=(id,label,inner,tab)=>`<g class="part" data-id="${id}" tabindex="${tab===false?-1:0}" role="button" aria-label="${label}"><title>${label}</title>${inner}</g>`;
const hit=(x,y,w,h)=>R(x,y,w,h,'transparent');

function gateV(x,y,d,side){const bw=d+12;
  return R(x-bw/2,y-16,bw,32,'url(#gRv)','rx="5"')+R(x-bw/2-2,y-20,bw+4,5,'#7a1a16','rx="2"')+R(x-bw/2-2,y+15,bw+4,5,'#7a1a16','rx="2"')
  +R(side>0?x+bw/2:x-bw/2-24,y-3,24,6,'url(#gH)')
  +`<ellipse cx="${x+side*(bw/2+26)}" cy="${y}" rx="4.5" ry="15" fill="#2b3640" stroke="#10171c" stroke-width="1.2"/>`;}
function gateH(x,y,d){const bh=d+12;
  return R(x-16,y-bh/2,32,bh,'url(#gRh)','rx="5"')+R(x-20,y-bh/2-2,5,bh+4,'#7a1a16','rx="2"')+R(x+15,y-bh/2-2,5,bh+4,'#7a1a16','rx="2"')
  +R(x-3,y-bh/2-24,6,24,'url(#gV)')
  +`<ellipse cx="${x}" cy="${y-bh/2-26}" rx="15" ry="4.5" fill="#2b3640" stroke="#10171c" stroke-width="1.2"/>`;}
function checkV(x,y,d){const w=d/2;
  return `<path d="M${x-w-2} ${y+20}L${x-w-9} ${y+8}V${y-8}L${x-w-2} ${y-20}H${x+w+2}L${x+w+9} ${y-8}V${y+8}L${x+w+2} ${y+20}Z" fill="url(#gDk)"/>`
  +`<path d="M${x} ${y+9}V${y-8}M${x-5} ${y-2}L${x} ${y-9}L${x+5} ${y-2}" stroke="#f3d9a0" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;}
function checkH(x,y,d){const w=d/2; /* flow toward -x */
  return `<path d="M${x+18} ${y-w-2}L${x+7} ${y-w-8}H${x-7}L${x-18} ${y-w-2}V${y+w+2}L${x-7} ${y+w+8}H${x+7}L${x+18} ${y+w+2}Z" fill="url(#gDkH)"/>`
  +`<path d="M${x+8} ${y}H${x-7}M${x-2} ${y-4}L${x-8} ${y}L${x-2} ${y+4}" stroke="#f3d9a0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;}
function gauge(x,y,rr,ang){const a=ang*Math.PI/180;
  return `<circle cx="${x}" cy="${y}" r="${rr}" fill="#fbfcfc" stroke="#353f47" stroke-width="2.6"/>`
  +`<path d="M${x-rr+4.5} ${y+4}A${rr-4.5} ${rr-4.5} 0 1 1 ${x+rr-4.5} ${y+4}" fill="none" stroke="#9aa5ac" stroke-width="1.4"/>`
  +`<line x1="${x}" y1="${y}" x2="${(x+(rr-4)*Math.cos(a)).toFixed(1)}" y2="${(y+(rr-4)*Math.sin(a)).toFixed(1)}" stroke="#c8322b" stroke-width="2" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="2" fill="#353f47"/>`;}
function strainerH(x,y,d){
  return R(x-20,y-d/2-4,40,d+8,'url(#gDkH)','rx="4"')+R(x-24,y-d/2-5,5,d+10,'#161c21','rx="2"')+R(x+19,y-d/2-5,5,d+10,'#161c21','rx="2"')
  +`<g transform="rotate(-32 ${x} ${y+d/2})">`+R(x-8,y+d/2-2,16,28,'url(#gDk)','rx="3"')+R(x-10,y+d/2+24,20,6,'#161c21','rx="2"')+`</g>`;}
function flexV(x,y1,y2,d){let s='';let i=0;for(let y=y1;y<y2;y+=3,i++){const w=i%2?d+6:d+1;s+=R(x-w/2,y,w,3,'url(#gSs)');}return s;}
function motor(x,y,w,h){let s=R(x-9,y+4,12,h-8,'#263b52','rx="4"')+R(x,y,w,h,'url(#gMh)','rx="7"');
  for(let i=1;i<7;i++)s+=`<line x1="${x+8}" y1="${(y+i*h/7).toFixed(1)}" x2="${x+w-10}" y2="${(y+i*h/7).toFixed(1)}" stroke="#12202e" stroke-opacity=".3" stroke-width="1.4"/>`;
  s+=R(x+w*0.32,y-9,w*0.34,11,'#2a425b','rx="2"')+R(x+8,y+h,14,7,'#222c34')+R(x+w-24,y+h,14,7,'#222c34');return s;}
function volute(cx,cy,rr){let s=`<circle cx="${cx}" cy="${cy}" r="${rr}" fill="url(#gRr)" stroke="#6f1713" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${(rr*0.44).toFixed(1)}" fill="#8c1f1a" stroke="#f3a199" stroke-opacity=".55" stroke-width="1.5"/>`;
  for(let i=0;i<8;i++){const a=i*Math.PI/4+0.3;s+=`<circle cx="${(cx+rr*0.76*Math.cos(a)).toFixed(1)}" cy="${(cy+rr*0.76*Math.sin(a)).toFixed(1)}" r="1.8" fill="#5e120f"/>`;}return s;}
function box3d(x,y,w,h,dx,dy,cf,ct,cs){return `<polygon points="${x},${y} ${x+dx},${y+dy} ${x+w+dx},${y+dy} ${x+w},${y}" fill="${ct}"/><polygon points="${x+w},${y} ${x+w+dx},${y+dy} ${x+w+dx},${y+h+dy} ${x+w},${y+h}" fill="${cs}"/>`+R(x,y,w,h,cf);}
function footV(x,y,d){return R(x-d/2-5,y-12,d+10,20,'url(#gDk)','rx="4"')+R(x-d/2-8,y+8,d+16,24,'url(#pMesh)','rx="5"')+R(x-d/2-8,y+8,d+16,24,'none','rx="5" stroke="#161c21" stroke-width="1.5"');}
function funnel(x){return `<path d="M${x-9} 642h18l-5 8h-8z" fill="#59646c"/>`;}

/* room */
o.push(R(0,0,1440,650,'url(#gWall)'));
o.push(`<path d="M0 220H1440M0 440H1440" stroke="#c9d1d0" stroke-width="1"/>`);
o.push(R(0,650,1440,26,'url(#pConc)')+`<path d="M0 650H1440" stroke="#4f5b64" stroke-width="2"/>`);
o.push(R(0,676,1440,204,'#c3cac8'));

/* water tank */
o.push(part('tank','수조',R(40,676,1130,186,'url(#pConc)')+R(54,676,1102,172,'#edf1f2')+R(54,706,1102,142,'url(#gWater)')+`<path d="M54 706H1156" stroke="#1d6fb5" stroke-width="2" stroke-opacity=".7"/>`));

/* discharge piping and header */
let hd=pH(268,1436,100,18)+`<path d="M1420 86l14 14l-14 14" fill="none" stroke="#14212b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
 +pV(268,100,552,16)+pV(850,100,556,16)+pV(1098,100,606,12)+el(268,100,18)+el(850,100,18)+el(1098,100,16)
 +cV(268,160,16)+cV(268,300,16)+cV(268,372,16)+cV(850,170,16)+cV(850,340,16)+cH(560,100,18)+cH(980,100,18)+cH(1300,100,18);
o.push(part('header','토출 배관·헤더',hd));

/* priming tank (main) with supply, overflow, drain */
let pt=pH(524,584,186,10)+el(584,186,10)+pV(584,186,644,10)+funnel(584)
 +pV(492,266,292,6)+pH(492,584,292,6)+R(485,272,14,10,'url(#gBr)','rx="2"')
 +pH(356,418,128,8)+el(418,128,8)+pV(418,128,146,8)
 +box3d(392,150,120,116,14,-10,'url(#gTankF)','#e88078','#8f211c')
 +R(402,162,9,94,'#f4f6f6','rx="2" stroke="#6f1713" stroke-width="1"')+`<rect class="lvl" id="lvlM" x="403.5" y="190" width="6" height="64.5" fill="#2f86c9"/>`;
o.push(part('primingtank','물올림탱크',pt));

/* priming pipe (main) */
o.push(part('primingpipe','물올림관',pV(452,266,466,10)+el(452,466,10)+pH(276,452,466,10)+gateH(420,466,10)+checkH(372,466,10)));

/* performance test line */
let tl=pH(76,268,340,12)+el(76,340,12)+pV(76,340,760,12)+cH(196,340,12)+gateH(226,340,12)+gateH(110,340,12)
 +R(152,330,28,20,'url(#gBr)','rx="3"')+R(161,300,10,32,'#f7f9f9','rx="2" stroke="#7a5a12" stroke-width="1.4"')
 +`<path d="M163 306h6M163 314h6M163 322h6" stroke="#7a5a12" stroke-width="1"/>`+R(162.5,311,7,6,'#c8322b','rx="1"');
o.push(part('testline','성능시험배관',tl));

/* relief valve and circulation pipe */
o.push(part('relief','릴리프밸브·순환배관',hit(200,470,36,60)+pH(216,268,500,8)+pV(216,512,644,8)+funnel(216)+R(207,488,18,26,'url(#gBr)','rx="3"')+R(210,474,12,15,'url(#gBr)','rx="2"')+R(212,468,8,7,'#2b3640','rx="1.5"')));

/* water hammer arrestor */
o.push(part('arrestor','수격방지기',pV(268,76,100,10)+R(255,40,26,38,'url(#gRv)','rx="13"')+R(259,72,18,5,'#7a1a16','rx="2"')));

/* discharge valve with tamper switch */
o.push(part('dvalve','개폐표시형 밸브',gateV(268,250,16,1)+R(292,262,20,12,'#f2c230','rx="2" stroke="#8a6b00" stroke-width="1"')+`<path d="M312 268h10v40" fill="none" stroke="#39434b" stroke-width="1.5"/>`));

/* check valve with bypass */
o.push(part('checkvalve','체크밸브',`<path d="M280 402h16v32h-16" fill="none" stroke="#a9781f" stroke-width="4"/><circle cx="296" cy="418" r="5.5" fill="url(#gBr)" stroke="#5c430d" stroke-width="1"/>`+checkV(268,418,16)));

/* pressure gauge */
o.push(part('pgauge','압력계',hit(286,500,36,40)+R(276,532,30,4,'url(#gBr)')+R(304,526,4,8,'url(#gBr)')+gauge(306,514,13,-40)));

/* flexible joint */
o.push(part('flex','플렉시블 조인트',hit(254,550,28,22)+flexV(268,552,570,16)));

/* suction pipe (main) */
o.push(part('suction','흡입배관',pH(306,560,604,16)+el(560,604,16)+pV(560,604,790,16)+cH(392,604,16)+cH(540,604,16)+cV(560,690,16)));
o.push(part('cgauge','연성계',hit(314,552,32,48)+R(328,582,4,14,'url(#gBr)')+gauge(330,569,13,-150)));
o.push(part('strainer','스트레이너',strainerH(450,604,16)));
o.push(part('svalve','흡입측 개폐밸브',gateH(515,604,16)));
o.push(part('footvalve','풋밸브',footV(560,800,16)));

/* main pump unit */
let pm=R(88,641,226,9,'#343f48','rx="2"')+motor(100,574,96,60)+R(196,590,36,30,'#e0a800','rx="3"')+`<path d="M200 596h28M200 604h28M200 612h28" stroke="#9a7400" stroke-width="1.2"/>`
 +R(230,592,10,26,'#7a1a16','rx="2"')+volute(268,604,32)+R(258,568,20,8,'#7a1a16','rx="2"')+R(298,593,8,22,'#7a1a16','rx="2"')
 +`<circle class="lamp" data-l="M" id="lampM" cx="148" cy="560" r="5"/>`;
o.push(part('pump','주펌프',pm));

/* engine pump unit */
let en=R(640,618,16,32,'#27323b','rx="2"')+R(660,618,16,32,'#27323b','rx="2"')+R(644,613,4,6,'#c8322b')+R(664,613,4,6,'#1d1d1d')
 +pH(640,770,372,10)+el(770,372,10)+pV(770,372,540,10)+R(762,412,16,58,'#59636b','rx="8"')+`<path d="M654 364l-12 8l12 8" fill="none" stroke="#14212b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`
 +R(664,442,80,40,'url(#gCh)','rx="20"')+R(686,482,5,58,'#7a5a12')+R(716,482,5,58,'#7a5a12')+pV(704,482,540,5)
 +R(678,641,160,9,'#343f48','rx="2"')+R(694,540,94,18,'#46535e','rx="3"')+R(686,556,110,84,'url(#gEng)','rx="6"')
 +`<path d="M700 548h8M716 548h8M732 548h8M748 548h8M764 548h8" stroke="#e0a800" stroke-width="3" stroke-linecap="round"/>`
 +R(796,590,26,30,'#e0a800','rx="3"')+R(820,592,8,26,'#7a1a16','rx="2"')+volute(850,604,30)+R(840,570,20,8,'#7a1a16','rx="2"')+R(878,594,8,20,'#7a1a16','rx="2"')
 +`<circle class="lamp" data-l="E" id="lampE" cx="741" cy="570" r="5"/>`+flexV(850,556,570,16);
o.push(part('engine','엔진펌프(예비펌프)',en));

/* engine line: valves, suction, priming */
o.push(part('dvalve','개폐표시형 밸브',gateV(850,250,16,-1),false));
o.push(part('checkvalve','체크밸브',checkV(850,418,16),false));
let pt2=pH(1002,1014,196,8)+el(1014,196,8)+pV(1014,196,644,8)+funnel(1014)+box3d(900,170,90,80,12,-8,'url(#gTankF)','#e88078','#8f211c')
 +R(908,180,8,62,'#f4f6f6','rx="2" stroke="#6f1713" stroke-width="1"')+`<rect class="lvl" id="lvlE" x="909.5" y="198" width="5" height="43" fill="#2f86c9"/>`;
o.push(part('primingtank','물올림탱크',pt2,false));
o.push(part('primingpipe','물올림관',pV(945,250,466,8)+el(945,466,8)+pH(858,945,466,8)+checkH(900,466,8),false));
o.push(part('suction','흡입배관',pH(886,990,604,14)+el(990,604,14)+pV(990,604,790,14),false));
o.push(part('strainer','스트레이너',`<g transform="translate(182 121) scale(.8)">${strainerH(906,604,16)}</g>`,false));
o.push(part('svalve','흡입측 개폐밸브',gateH(957,604,14),false));
o.push(part('footvalve','풋밸브',footV(990,800,14),false));

/* jockey pump */
let jk=R(1024,641,96,9,'#343f48','rx="2"')+motor(1034,606,48,34)+R(1082,612,8,18,'#7a1a16','rx="2"')+volute(1100,622,15)
 +`<circle class="lamp" data-l="J" id="lampJ" cx="1058" cy="598" r="4.5"/>`+checkV(1098,470,12)+gateV(1098,330,12,-1)
 +pH(1114,1146,622,10)+el(1146,622,10)+pV(1146,622,792,10)+footV(1146,800,10);
o.push(part('jockey','충압펌프',jk));

/* pressure chamber */
let ch=pV(1180,100,548,10)+el(1180,548,10)+pH(1180,1208,548,10)+el(1180,100,12)+gateV(1180,300,10,-1)
 +R(1210,588,6,62,'#6f1713')+R(1252,588,6,62,'#6f1713')
 +`<path d="M1206 424a28 16 0 0 1 56 0V572a28 16 0 0 1 -56 0Z" fill="url(#gRv)"/><ellipse cx="1234" cy="424" rx="28" ry="9" fill="#f08a80" fill-opacity=".45"/>`
 +R(1228,384,12,26,'url(#gBr)','rx="2"')+R(1225,378,18,8,'url(#gBr)','rx="2"')
 +R(1230,586,8,20,'url(#gV)')+R(1226,596,16,10,'url(#gBr)','rx="2"')+pV(1234,606,644,6)+funnel(1234);
o.push(part('chamber','압력챔버',ch));

/* pressure switches */
let ps='';[[430,'주'],[462,'예'],[494,'충']].forEach(([y,t])=>{ps+=R(1262,y+10,12,4,'url(#gBr)')+R(1272,y,38,26,'#2f3b46','rx="3"')+R(1276,y+4,13,18,'#e9edee','rx="2"')+`<text x="1300" y="${y+18}" class="ps-t" text-anchor="middle">${t}</text>`;});
o.push(part('pswitch','압력스위치',ps));

/* control panel */
let mc=box3d(1368,300,60,350,8,-7,'#dfe4e6','#f2f5f5','#aab3b8')+R(1374,308,48,96,'#f7f9f9','rx="2" stroke="#9aa5ac" stroke-width="1"')
 +`<circle cx="1386" cy="324" r="5" fill="#d3241b"/><circle cx="1410" cy="324" r="5" fill="#2ecc71"/><circle cx="1386" cy="346" r="5" fill="#d3241b"/><circle cx="1410" cy="346" r="5" fill="#2ecc71"/>`
 +`<circle cx="1386" cy="378" r="9" fill="#2b3640"/><path d="M1386 378l-6 -7" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="1410" cy="378" r="9" fill="#2b3640"/><path d="M1410 378l-6 -7" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`
 +R(1374,416,48,30,'#eef1f2','rx="2" stroke="#9aa5ac" stroke-width="1"')+`<path d="M1380 438q18 -22 36 0" fill="none" stroke="#39434b" stroke-width="1.5"/><path d="M1398 440l8 -14" stroke="#c8322b" stroke-width="1.6"/>`
 +`<path d="M1374 470h48M1374 560h48" stroke="#9aa5ac" stroke-width="1"/>`+R(1414,500,5,22,'#39434b','rx="2"');
o.push(part('mcc','제어반',mc));

/* flows */
const F={sM:'M560 800V604H300',dMa:'M268 572V340',dMb:'M268 340V100',hM:'M268 100H1432',test:'M268 340H76V760',rel:'M268 572V500H216V646',
 prime:'M452 266V466H268V572',primeBack:'M268 572V466H452V266',sMrev:'M300 604H560V800',supply:'M356 128H418V160',ovf:'M524 186H584V646',
 sE:'M990 800V604H880',dE:'M850 574V100',hE:'M850 100H1432',sJ:'M1146 800V622H1114',dJ:'M1098 606V100',hJ:'M1098 100H1432',
 heldM:'M268 418V100',heldE:'M850 418V100',heldJ:'M1098 470V100',heldH:'M268 100H1432',heldC:'M1180 100V548H1208'};
o.push('<g class="flows" aria-hidden="true">'+Object.keys(F).map(k=>`<path class="flow" data-f="${k}" d="${F[k]}"/>`).join('')+'</g>');

/* mode badges */
const badge=(x,y,t,show,k)=>`<g class="badge ${k||''}" data-show="${show}"><rect x="${x}" y="${y-17}" width="${t.length*15+18}" height="24" rx="12"/><text x="${x+9}" y="${y}">${t}</text></g>`;
o.push('<g class="badges" aria-hidden="true">'
 +badge(296,214,'닫힘','test churn')
 +badge(118,410,'시험 중','test')
 +badge(110,470,'방출 중','churn')
 +badge(530,150,'감수경보','footleak','bad')
 +badge(600,640,'넘침','balltap primeback','bad')
 +badge(410,646,'막힘','clog','bad')
 +badge(1196,672,'공기 없음','airloss','bad')
 +badge(1016,672,'켜짐·꺼짐 반복','airloss','bad')
 +'</g>');

/* labels */
const LB=[[290,62,'start','수격방지기','arrestor'],[238,246,'end','개폐표시형 밸브','dvalve'],[238,424,'end','체크밸브','checkvalve'],
 [166,380,'middle','성능시험배관','testline'],[166,292,'middle','유량계','testline'],[198,497,'end','릴리프밸브','relief'],
 [326,519,'start','압력계','pgauge'],[350,574,'start','연성계','cgauge'],[450,572,'middle','스트레이너','strainer'],[515,548,'middle','개폐밸브','svalve'],
 [452,216,'middle','물올림탱크','primingtank','inv'],[350,133,'end','급수배관','primingtank'],[596,330,'start','오버플로우관','primingtank'],[664,358,'start','배기','engine'],
 [412,499,'middle','물올림관','primingpipe'],[582,812,'start','풋밸브','footvalve'],[582,724,'start','흡입배관','suction'],
 [150,612,'middle','주펌프','pump','inv'],[741,606,'middle','엔진펌프','engine','inv'],[704,434,'middle','연료탱크','engine'],[658,606,'middle','축전지','engine'],
 [1056,594,'middle','충압펌프','jockey'],[1234,366,'middle','압력챔버','chamber'],[1270,420,'start','압력스위치','pswitch'],
 [1398,286,'middle','제어반','mcc'],[640,84,'middle','토출 헤더','header'],[1412,78,'end','각 층으로','header'],[240,756,'start','수조 (펌프보다 낮은 위치)','tank']];
o.push('<g class="labels">'+LB.map(l=>`<text class="lb${l[5]?' '+l[5]:''}" data-id="${l[4]}" x="${l[0]}" y="${l[1]}" text-anchor="${l[2]}">${l[3]}</text>`).join('')+'</g>');
return o.join('\n');
}
if(typeof module!=='undefined'){module.exports={buildScene,SCENE_DEFS};}
