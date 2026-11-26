/* figs.js: cutaway figures for the detail card. Each draw(state) returns an <svg> string, viewBox 0 0 340 220. */
const FIG=(function(){
const W='<svg viewBox="0 0 340 220" role="img" aria-label="';
const T=(x,y,t,a)=>`<text class="f-t" x="${x}" y="${y}" text-anchor="${a||'start'}">${t}</text>`;
const L=(x1,y1,x2,y2)=>`<line class="f-l" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const A=(d,c)=>`<path class="f-a ${c||''}" d="${d}" marker-end="url(#fArr${c==='bad'?'B':c==='warn'?'W':''})"/>`;
const defs=`<defs><marker id="fArr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L8 5L1 9" fill="none" stroke="#0b6bd3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></marker><marker id="fArrB" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L8 5L1 9" fill="none" stroke="#c3241b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></marker><marker id="fArrW" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L8 5L1 9" fill="none" stroke="#b86a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`;
const R=(x,y,w,h,c,ex)=>`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"${ex?' '+ex:''}/>`;

const F={};

F.footvalve={states:[['closed','펌프 정지'],['open','흡입 중'],['leak','이물질 낌']],
 cap:{closed:'디스크가 시트에 앉아 흡입관의 물기둥을 받칩니다.',open:'펌프가 빨아들이는 힘으로 디스크가 들리고, 물이 여과망을 지나 올라갑니다.',leak:'시트에 이물질이 끼면 디스크가 덜 닫힙니다. 물기둥이 수조로 새어 내려갑니다.'},
 draw(s){const up=s==='open'?-20:0,lk=s==='leak';
  return W+'풋밸브 단면">'+defs+R(0,0,340,220,'f-bg')+R(0,96,340,124,'f-w2')
  +R(132,0,76,104,'f-m')+R(144,0,52,104,lk?'f-w3':'f-w')
  +`<path class="f-m" d="M118 100H222V150H118Z"/>`+R(144,100,52,50,'f-w')
  +R(130,146,22,7,'f-seat')+R(188,146,22,7,'f-seat')
  +`<g transform="translate(0 ${up})${lk?' rotate(-9 170 142)':''}">`+R(146,137,48,9,'f-disc','rx="3"')+R(167,116,6,22,'f-stem')+`</g>`
  +(lk?`<circle class="f-deb" cx="189" cy="145" r="4.5"/>`:'')
  +`<path class="f-mesh" d="M124 153H216V192Q170 210 124 192Z"/>`
  +(s==='open'?A('M170 205V160')+A('M170 96V30'):'')
  +(lk?A('M196 60V132','warn')+A('M200 150V186','warn'):'')
  +L(222,125,262,110)+T(266,114,'몸체')+L(196,141,262,146)+T(266,150,'디스크')+L(210,150,262,172)+T(266,176,'시트')+L(216,186,262,200)+T(266,204,'여과망')
  +L(132,40,84,40)+T(80,44,'흡입관','end')+T(80,60,lk?'물이 빠짐':'물기둥','end')+T(12,116,'수조 물')+'</svg>';}};

F.checkvalve={states:[['flow','펌프 운전'],['closed','펌프 정지'],['debris','이물질 낌']],
 cap:{flow:'물이 디스크를 밀어 올리고 지나갑니다. 스프링은 눌린 상태입니다.',closed:'흐름이 멈추는 순간 스프링이 디스크를 먼저 닫습니다. 위쪽 배관의 물과 압력이 그대로 남습니다.',debris:'시트에 이물질이 끼면 위쪽 압력이 펌프 쪽으로 새어 내려옵니다.'},
 draw(s){const up=s==='flow'?-26:0,db=s==='debris';
  return W+'스프링식 체크밸브 단면">'+defs+R(0,0,340,220,'f-bg')
  +R(132,0,76,220,'f-m')+R(144,0,52,220,'f-w')
  +`<path class="f-m" d="M112 60H228V160H112Z"/>`+R(128,66,84,88,db||s==='closed'?'f-w':'f-w')
  +R(128,146,26,8,'f-seat')+R(186,146,26,8,'f-seat')
  +`<g transform="translate(0 ${up})${db?' rotate(-8 170 140)':''}">`+R(144,136,52,10,'f-disc','rx="3"')
  +`<path class="f-spr" d="M160 136L180 ${130+up*-0.18} L160 ${122+up*-0.36} L180 ${114+up*-0.54} L160 ${106+up*-0.72} L180 ${98+up*-0.9} L170 ${92-up}"/></g>`
  +R(150,62,40,8,'f-seat')
  +(db?`<circle class="f-deb" cx="191" cy="145" r="4.5"/>`:'')
  +(s==='flow'?A('M170 214V168')+A('M134 132V78')+A('M206 132V78')+A('M170 54V10'):'')
  +(db?A('M202 100V140','bad')+A('M204 160V206','bad'):'')
  +L(228,100,262,84)+T(266,88,'스프링')+L(196,141,262,128)+T(266,132,'디스크')+L(212,150,262,168)+T(266,172,'시트')
  +T(98,24,'2차측','end')+T(98,40,'(배관·각 층)','end')+T(98,196,'1차측','end')+T(98,212,'(펌프)','end')+'</svg>';}};

F.relief={states:[['closed','평상시'],['open','체절운전']],
 cap:{closed:'스프링이 디스크를 눌러 닫고 있습니다. 펌프가 정격으로 물을 보낼 때도 닫혀 있습니다.',open:'물이 나갈 곳이 없어 압력이 체절압 근처로 오르면 디스크가 밀려 열리고, 물이 조금씩 빠져나갑니다.'},
 draw(s){const up=s==='open'?-14:0;
  return W+'릴리프밸브 단면">'+defs+R(0,0,340,220,'f-bg')
  +R(138,150,64,70,'f-m')+R(150,150,40,70,'f-w')
  +`<path class="f-m" d="M110 40H230V156H110Z"/>`+R(124,104,92,46,s==='open'?'f-w':'f-air')+R(124,52,92,52,'f-air')
  +R(216,112,124,34,'f-m')+R(216,120,124,18,s==='open'?'f-w':'f-air')
  +R(138,146,20,8,'f-seat')+R(182,146,20,8,'f-seat')
  +`<g transform="translate(0 ${up})">`+R(152,134,36,12,'f-disc','rx="3"')+`<path class="f-spr" d="M158 134L182 ${124-up*0.15} L158 ${114-up*0.3} L182 ${104-up*0.45} L158 ${94-up*0.6} L182 ${84-up*0.75} L170 ${76-up}"/></g>`
  +R(160,30,20,46,'f-stem')+R(152,22,36,10,'f-seat')
  +(s==='open'?A('M170 212V160')+A('M222 129H326'):'')
  +L(160,26,104,20)+T(100,24,'조정 나사','end')+L(158,104,104,90)+T(100,94,'스프링','end')+L(152,140,104,140)+T(100,144,'디스크','end')
  +T(100,196,'펌프 쪽','end')+T(330,104,'배출','end')+'</svg>';}};

F.chamber={states:[['normal','정상'],['drop','압력 저하'],['noair','공기 소실']],
 cap:{normal:'위는 공기, 아래는 물입니다. 압축된 공기가 쿠션이 되어 압력이 천천히 변합니다.',drop:'배관에서 물이 빠지면 공기가 부풀며 압력이 내려갑니다. 기동점에 닿으면 압력스위치 접점이 붙어 펌프가 켜집니다.',noair:'공기가 물에 녹아 없어지면 쿠션이 사라집니다. 물이 조금만 새도 압력이 뚝 떨어져 펌프가 켜졌다 꺼졌다 합니다.'},
 draw(s){const air=s==='normal'?34:s==='drop'?52:0,on=s==='drop';
  return W+'압력챔버 단면">'+defs+R(0,0,340,220,'f-bg')
  +`<path class="f-m" d="M96 40a52 26 0 0 1 104 0V180a52 26 0 0 1 -104 0Z"/>`
  +`<path class="f-w" d="M106 44a42 20 0 0 1 84 0V178a42 20 0 0 1 -84 0Z"/>`
  +(air?`<path class="f-air" d="M106 44a42 20 0 0 1 84 0V${44+air}H106Z"/>`:'')
  +R(40,150,60,14,'f-m')+R(40,154,66,6,'f-w')
  +R(200,70,40,8,'f-m')+R(240,54,62,40,'f-box','rx="4"')
  +`<circle cx="254" cy="74" r="3.5" class="f-dot"/><circle cx="288" cy="74" r="3.5" class="f-dot"/><path class="f-ct ${on?'on':''}" d="${on?'M254 74H288':'M254 74L284 60'}"/>`
  +R(142,8,12,16,'f-br')+T(160,18,'안전밸브')
  +(air?T(148,air>40?64:58,'공기','middle'):'')+T(148,150,'물','middle')
  +T(271,112,on?'접점 붙음':'접점 떨어짐','middle')+T(271,128,on?'펌프 기동':'펌프 정지','middle')
  +T(36,144,'배관에서')+(on?A('M92 172H46','warn'):'')+(s==='noair'?T(148,96,'쿠션 없음','middle'):'')+'</svg>';}};

F.primingtank={states:[['normal','정상'],['low','수위 저하'],['over','넘침']],
 cap:{normal:'볼탑의 부구가 떠서 급수를 막고 있습니다. 탱크 물이 물올림관으로 내려가 펌프와 흡입관을 채웁니다.',low:'아래에서 물이 새면 수위가 내려갑니다. 부구가 처지며 급수가 열리고, 더 내려가면 감수경보가 울립니다.',over:'볼탑이 안 닫히거나 물올림관으로 물이 거꾸로 올라오면 수위가 오버플로우관 높이까지 차서 넘칩니다.'},
 draw(s){const lv=s==='normal'?70:s==='low'?128:52,fy=lv-4;
  return W+'물올림탱크 단면">'+defs+R(0,0,340,220,'f-bg')
  +R(70,30,180,160,'f-m','rx="4"')+R(78,38,164,144,'f-air')+R(78,lv,164,182-lv,'f-w')
  +R(20,44,62,10,'f-m')+R(20,47,66,4,'f-w')+R(82,42,12,14,'f-br')
  +`<path class="f-arm" d="M94 50L${s==='low'?142:150} ${fy}"/><circle class="f-float" cx="${s==='low'?150:158}" cy="${fy}" r="11"/>`
  +R(242,48,78,12,'f-m')+R(242,51,78,6,s==='over'?'f-w':'f-air')
  +R(150,182,14,38,'f-m')+R(154,182,6,38,'f-w')
  +R(226,112,16,8,'f-seat')+`<circle class="${s==='low'?'f-alarm':'f-dot'}" cx="222" cy="116" r="5"/>`
  +(s==='low'?A('M30 49H74')+A('M157 190V214','warn'):'')+(s==='over'?A('M250 54H316','bad'):'')
  +T(22,36,'급수(볼탑)')+T(318,40,'오버플로우관','end')+T(170,208,'물올림관')+T(252,120,s==='low'?'감수경보':'저수위 스위치')+'</svg>';}};

F.pump={states:[],cap:{_:'물은 가운데(임펠러의 눈)로 들어와 회전하는 날개를 타고 바깥으로 던져집니다. 볼류트가 그 속도를 압력으로 바꿉니다.'},
 draw(){let b='';for(let i=0;i<6;i++){b+=`<path class="f-blade" d="M0 -14Q22 -30 40 -46" transform="rotate(${i*60})"/>`;}
  return W+'원심펌프 단면">'+defs+R(0,0,340,220,'f-bg')
  +R(182,14,46,90,'f-m')+`<circle class="f-m" cx="150" cy="122" r="78"/>`+`<circle class="f-w" cx="150" cy="122" r="66"/>`+R(192,14,26,96,'f-w')
  +`<g transform="translate(150 122)"><g class="f-spin">${b}<circle class="f-seat" r="14"/></g></g>`
  +A('M205 96V28')+T(240,36,'토출')+L(150,122,60,196)+T(56,208,'흡입(눈)','end')+L(186,150,262,176)+T(266,180,'임펠러')+L(214,150,262,150)+T(266,154,'볼류트')+'</svg>';}};

F.testline={states:[['z','유량 0'],['r','정격 100%'],['m','150%']],
 cap:{z:'시험배관 밸브가 닫힌 상태입니다. 부자가 맨 아래에 있습니다.',r:'유량조절밸브를 열어 부자를 정격 눈금에 맞춥니다. 이때 압력계가 정격토출압 이상이어야 합니다.',m:'더 열어 150% 눈금까지 올립니다. 이때 압력이 정격의 65% 이상이면 합격입니다.'},
 draw(s){const y=s==='z'?176:s==='r'?108:68;
  return W+'유량계 읽는 법">'+defs+R(0,0,340,220,'f-bg')
  +`<path class="f-glass" d="M136 30H204L190 190H150Z"/>`+`<path class="f-w" d="M141 34H199L187 186H153Z" opacity=".6"/>`
  +`<path class="f-float2" d="M${170-18} ${y-8}H${170+18}L${170+10} ${y+8}H${170-10}Z"/>`
  +[[176,'0'],[108,'100%'],[68,'150%'],[44,'175%']].map(([yy,t])=>L(206,yy,230,yy)+T(236,yy+4,t)).join('')
  +(s!=='z'?A('M170 214V196')+A('M170 28V8'):'')
  +T(120,112,'부자','end')+L(124,y,150,y)+T(236,200,'눈금은 정격유량 대비')+'</svg>';}};

F.pswitch={states:[['hi','정지점 위'],['mid','두 점 사이'],['lo','기동점 아래']],
 cap:{hi:'압력이 정지점(Range)보다 높습니다. 접점이 떨어져 있습니다.',mid:'기동점과 정지점 사이에서는 직전 상태를 그대로 유지합니다. 이 폭(Diff)이 있어서 펌프가 잦게 켜졌다 꺼지지 않습니다.',lo:'압력이 기동점(Range − Diff) 아래로 내려왔습니다. 접점이 붙어 펌프가 켜집니다.'},
 draw(s){const px=s==='hi'?262:s==='mid'?196:112,on=s==='lo';
  return W+'압력스위치 설정">'+defs+R(0,0,340,220,'f-bg')
  +R(40,96,260,10,'f-air')+R(40,96,px-40,10,'f-w')
  +L(140,70,140,130)+L(240,70,240,130)+T(140,62,'기동점','middle')+T(240,62,'정지점','middle')
  +`<path class="f-brk" d="M140 144V152H240V144"/>`+T(190,170,'Diff','middle')+T(240,46,'Range','middle')
  +`<path class="f-ptr" d="M${px} 92l-7 -14h14Z"/>`+T(px,30,'현재 압력','middle')+L(px,34,px,76)
  +T(40,124,'낮음')+T(300,124,'높음','end')
  +R(120,186,100,26,'f-box','rx="4"')+T(170,204,on?'접점 붙음 · 펌프 기동':s==='mid'?'직전 상태 유지':'접점 떨어짐','middle')+'</svg>';}};

F.dvalve={states:[['open','열림'],['shut','닫힘']],
 cap:{open:'나사봉(스템)이 핸들 위로 솟아 있으면 열린 상태입니다. 멀리서도 보입니다.',shut:'나사봉이 들어가 있으면 닫힌 상태입니다. 탬퍼스위치가 눌려 감시제어반에 폐쇄 신호가 갑니다.'},
 draw(s){const dn=s==='shut'?46:0;
  return W+'개폐표시형 밸브 단면">'+defs+R(0,0,340,220,'f-bg')
  +R(20,150,300,50,'f-m')+R(20,160,300,30,'f-w')
  +`<path class="f-m" d="M130 90H210V204H130Z"/>`+R(142,100,56,96,s==='shut'?'f-air':'f-w')
  +R(150,102+dn,40,48,'f-disc','rx="2"')
  +R(166,20+dn,8,84,'f-stem')+R(140,84,60,8,'f-seat')+R(134,56,6,30,'f-seat')+R(200,56,6,30,'f-seat')+R(134,50,72,8,'f-seat')
  +R(128,40,84,7,'f-hw','rx="3"')
  +R(216,66,34,18,'f-tam','rx="3"')+L(250,75,280,75)
  +(s==='open'?A('M30 175H120')+A('M220 175H310'):'')
  +T(182,26+dn,'나사봉')+T(216,60,'탬퍼스위치')+T(284,79,s==='shut'?'폐쇄 신호':'정상')+T(124,48,'핸들','end')+T(124,130,'게이트','end')+'</svg>';}};
F.svalve=F.dvalve;

F.strainer={states:[['clean','깨끗함'],['clog','막힘']],
 cap:{clean:'물이 원통형 망의 안에서 밖으로 지나가고, 이물질은 망 안에 남습니다.',clog:'망이 막히면 통과 면적이 줄어 흡입 쪽 진공이 커집니다. 연성계 바늘이 평소보다 더 내려갑니다.'},
 draw(s){const c=s==='clog';let d='';if(c){[[176,128],[184,140],[170,146],[190,152],[180,160],[196,166]].forEach(p=>{d+=`<circle class="f-deb" cx="${p[0]}" cy="${p[1]}" r="4"/>`;});}
  return W+'Y형 스트레이너 단면">'+defs+R(0,0,340,220,'f-bg')
  +R(20,56,300,56,'f-m')+R(20,68,300,32,'f-w')
  +`<g transform="rotate(-32 180 100)">`+R(150,96,60,104,'f-m','rx="6"')+R(160,96,40,92,'f-w')+R(166,96,28,84,'f-meshfig')+`</g>`
  +d+A(c?'M34 84H100':'M34 84H140',c?'warn':'')+A(c?'M270 84H300':'M250 84H306',c?'warn':'')
  +T(24,48,'수조에서')+T(316,48,'펌프로','end')+T(250,170,'여과망')+L(246,166,214,150)+T(120,204,'청소 캡','end')+L(124,200,150,186)+'</svg>';}};

function dial(title,ticks,val,unit,note){ /* generic dial: ticks [[angleDeg,label]] val angle */
  let t='';ticks.forEach(([a,l])=>{const r=a*Math.PI/180,x1=170+62*Math.cos(r),y1=128+62*Math.sin(r),x2=170+72*Math.cos(r),y2=128+72*Math.sin(r),x3=170+90*Math.cos(r),y3=128+90*Math.sin(r)+4;
    t+=`<line class="f-tick" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/><text class="f-t" x="${x3.toFixed(1)}" y="${y3.toFixed(1)}" text-anchor="middle">${l}</text>`;});
  const r=val*Math.PI/180;
  return W+title+'">'+defs+R(0,0,340,220,'f-bg')+`<circle class="f-dial" cx="170" cy="128" r="76"/>`+t
   +`<line class="f-ndl" x1="170" y1="128" x2="${(170+56*Math.cos(r)).toFixed(1)}" y2="${(128+56*Math.sin(r)).toFixed(1)}"/><circle class="f-dot" cx="170" cy="128" r="5"/>`
   +T(170,160,unit,'middle')+T(170,26,note,'middle')+'</svg>';
}
F.cgauge={states:[['stop','정지 중'],['run','정상 운전'],['clog','흡입 막힘'],['air','물 없음']],
 cap:{stop:'물올림탱크의 물 높이만큼 약한 정압이 걸립니다. 0보다 조금 위를 가리킵니다.',run:'펌프가 물을 빨아올리므로 진공 쪽을 가리킵니다. 평소 운전값을 적어 두면 기준이 됩니다.',clog:'진공이 평소보다 크면 흡입 쪽이 막힌 것입니다. 스트레이너, 풋밸브 망, 덜 열린 밸브를 봅니다.',air:'운전 중인데 0 근처에 머물면 흡입관에 물이 없는 것입니다. 펌프는 공기만 돌립니다.'},
 draw(s){const tk=[[150,'−0.1'],[195,'−0.05'],[240,'0'],[285,'0.2'],[330,'0.4'],[15,'0.6']];const v={stop:243,run:204,clog:172,air:240}[s];
  return dial('연성계 눈금',tk,v,'MPa',{stop:'정지 중: 약한 정압',run:'운전: 진공 쪽',clog:'진공이 평소보다 큼',air:'운전 중인데 0 근처'}[s]);}};
F.pgauge={states:[['stop','펌프 정지'],['rated','정격 운전'],['churn','체절운전']],
 cap:{stop:'체크밸브 앞쪽이라 펌프가 서면 거의 0으로 내려옵니다. 정지 중인데 배관 압력이 그대로 보이면 체크밸브가 새는 것입니다.',rated:'정격유량으로 물을 보낼 때의 압력입니다. 명판의 정격토출압 이상이어야 합니다.',churn:'토출을 막고 돌릴 때의 압력입니다. 정격의 140%를 넘으면 안 됩니다.'},
 draw(s){const tk=[[150,'0'],[192,'0.4'],[234,'0.8'],[276,'1.2'],[318,'1.6'],[0,'2.0']];const v={stop:152,rated:234,churn:255}[s];
  return dial('압력계 눈금',tk,v,'MPa (예시: 정격 0.8)',{stop:'정지: 거의 0',rated:'정격 0.8 MPa',churn:'체절 1.0 MPa (125%)'}[s]);}};

F.mcc={states:[['auto','자동'],['stop','정지'],['manual','수동']],
 cap:{auto:'평소 위치입니다. 압력스위치 신호가 오면 펌프가 스스로 켜집니다.',stop:'압력이 떨어져도 펌프가 켜지지 않습니다. 점검 뒤 이 위치로 두고 가는 실수가 가장 위험합니다.',manual:'사람이 기동 버튼을 눌러야 돕니다. 화재 때 저절로 켜지지 않는 것은 정지와 같습니다.'},
 draw(s){const a={auto:-45,stop:0,manual:45}[s];
  return W+'제어반 선택스위치">'+defs+R(0,0,340,220,'f-bg')+R(60,24,220,176,'f-box','rx="8"')
  +`<circle class="f-dial" cx="170" cy="124" r="40"/><g transform="rotate(${a} 170 124)">`+R(162,78,16,58,'f-stem','rx="6"')+`</g>`
  +T(110,70,'자동','middle')+T(170,56,'정지','middle')+T(230,70,'수동','middle')
  +`<circle class="${s==='auto'?'f-ok':'f-alarm'}" cx="170" cy="184" r="7"/>`+T(184,188,s==='auto'?'화재 시 자동 기동':'화재 시 기동 안 함')+'</svg>';}};
return F;
})();
if(typeof module!=='undefined'){module.exports={FIG};}
