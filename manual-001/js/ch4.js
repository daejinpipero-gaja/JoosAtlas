/* ch4.js: indoor hydrant. viewBox 0 0 1440 760. */
(function(){
const {R,pV,pH,el,part,hit,gauge,flows,badge,labels,flame,txt}=D;
const HOSE='M276 598C276 652 320 650 420 650L880 650C950 650 975 624 1000 598';
function build(){
const o=[];
o.push(R(0,0,1440,660,'url(#gWall)')+R(0,660,1440,30,'url(#pConc)')+R(0,690,1440,70,'#c3cac8')+`<path d="M0 660H1440" stroke="#4f5b64" stroke-width="2"/>`);
/* riser in wall cutaway and branch */
o.push(R(536,0,48,660,'#cfd6d5')+`<path d="M536 0V660M584 0V660" stroke="#8f989b" stroke-width="1.5" stroke-dasharray="6 6"/>`);
o.push(part('prv','감압밸브',hit(498,540,34,44)+R(503,554,24,24,'url(#gBr)','rx="5"')+R(511,540,8,15,'url(#gBr)','rx="2"')+R(507,536,16,5,'#2b3640','rx="2"')));
/* cabinet */
o.push(part('cabinet','옥내소화전함',`<polygon points="210,230 118,252 118,652 210,630" fill="#e9edee" stroke="#c8322b" stroke-width="5"/>`+R(140,420,8,40,'#8f989b','rx="3"')
 +R(204,224,272,412,'#c8322b','rx="6"')+R(216,236,248,388,'#f4f6f6','rx="3"')+R(216,318,248,6,'#c8322b')));
o.push(part('hbranch','입상관·가지배관',pV(560,0,660,14)+pH(300,560,566,9)+el(560,566,14)));
o.push(part('poslamp','위치표시등',`<path d="M246 300a18 22 0 0 1 36 0z" fill="#e0261c" stroke="#7a1a16" stroke-width="1.5"/>`+R(242,300,44,8,'#7a1a16','rx="2"')+`<circle cx="258" cy="286" r="4" fill="#fff" opacity=".5"/>`));
o.push(part('runlamp','기동표시등',R(312,270,36,36,'#2f3b46','rx="5"')+`<circle class="lamp" data-l="run" cx="330" cy="288" r="11"/>`));
o.push(part('callpoint','발신기',R(380,262,56,50,'#c8322b','rx="6"')+`<circle cx="408" cy="287" r="15" fill="#f4f6f6" stroke="#7a1a16" stroke-width="2"/><circle cx="408" cy="287" r="6" fill="#2b3640"/>`));
o.push(part('hose','호스',R(294,340,4,180,'#59646c')+R(434,340,4,180,'#59646c')+[0,1,2,3,4,5,6,7].map(i=>R(298,346+i*21,136,14,'#d9c9a3','rx="7" stroke="#a8956a" stroke-width="1"')).join('')));
o.push(part('nozzle','노즐',`<polygon points="322,530 392,534 414,537 414,545 392,548 322,552" fill="url(#gBr)" stroke="#7a5a12" stroke-width="1"/>`+R(314,528,10,26,'#7a5a12','rx="2"')));
o.push(part('anglevalve','방수구',R(252,548,50,36,'url(#gBr)','rx="6"')+R(262,584,30,14,'url(#gBr)','rx="2"')+R(258,596,38,6,'#7a5a12','rx="2"')+R(273,520,6,28,'url(#gV)')+`<ellipse cx="276" cy="518" rx="20" ry="6" fill="#c8322b" stroke="#7a1a16" stroke-width="1.5"/>`));
/* deployed hose, user, fire */
o.push(`<g class="viz" data-show="laid use over weak kink pitot"><path d="${HOSE}" fill="none" stroke="#a8956a" stroke-width="15" stroke-linecap="round"/><path d="${HOSE}" fill="none" stroke="#d9c9a3" stroke-width="11" stroke-linecap="round"/>`
 +`<polygon points="998,590 1040,584 1052,585 1052,593 1040,594 998,606" fill="url(#gBr)" stroke="#7a5a12" stroke-width="1"/>`
 +`<circle cx="968" cy="508" r="15" fill="#39434b"/><path d="M968 524V596M968 596L950 652M968 596L990 652M968 544L1004 596M968 552L1000 604" fill="none" stroke="#39434b" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g>`);
o.push(`<g class="viz" data-show="kink"><path d="M560 634l22 16l-22 16" fill="none" stroke="#d3241b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>`);
o.push(flame(1310,656,'laid use over weak kink'));
o.push(`<g class="viz" data-show="standby">`+txt(1000,350,'‘사용 중’을 누르면 호스를 편 모습이 나옵니다','nt','middle')+`</g>`);
o.push(`<g class="part viz" data-id="pitot" data-show="pitot" tabindex="-1" role="button" aria-label="피토게이지"><title>피토게이지</title>`+R(1056,585,22,5,'url(#gBr)')+R(1076,560,5,30,'url(#gBr)')+gauge(1078,544,18,-50)+`</g>`);
o.push(flows({hr:'M560 660V0',hb:'M560 566H304',use:'M560 660V566H304',hf:HOSE,jet:'M1054 588C1140 520 1230 540 1296 630',jetw:'M1054 588C1090 584 1118 612 1132 650',jetp:'M1054 588C1160 540 1260 560 1330 640'}));
o.push('<g class="badges" aria-hidden="true">'+badge(1100,470,'반동이 커서 위험','over','bad')+badge(1090,540,'불까지 닿지 않음','weak','bad')+badge(540,620,'호스 꺾임','kink','bad')+badge(1104,520,'방수압 측정','pitot')+'</g>');
o.push(labels([[340,216,'middle','옥내소화전함','cabinet'],[264,336,'middle','위치표시등','poslamp'],[330,256,'middle','기동표시등','runlamp'],[408,336,'middle','발신기','callpoint'],
 [366,437,'middle','호스','hose','inv2'],[424,546,'start','노즐','nozzle'],[236,612,'end','방수구','anglevalve'],[515,610,'middle','감압밸브','prv'],[596,120,'start','입상관','hbranch'],[1078,514,'middle','피토게이지','pitot','','pitot']]));
return o.join('\n');
}

const PARTS=[
{id:'cabinet',cat:'box',name:'옥내소화전함',en:'Indoor hydrant cabinet',one:'건물 안에 있는 사람이 직접 꺼내 쓰는 소화 장비 상자입니다.',
 easy:['문을 열면 방수구, 호스, 노즐이 들어 있습니다.','소방차를 기다리지 않고 초기에 불을 끄기 위한 설비입니다.','어느 자리에서든 25 m 안에 소화전 하나가 있도록 층마다 배치합니다.'],
 seq:'사람이 문을 열고 호스를 펴는 것으로 시작합니다. 스프링클러와 달리 사람이 움직여야 합니다.',
 faults:[{s:'문 앞에 물건이 쌓여 있다',c:'관리 소홀',a:'문이 끝까지 열리도록 비웁니다. 화재 때 물건을 치울 시간은 없습니다.',lv:'self'},
  {s:'문이 잠겨 있거나 녹슬어 안 열린다',c:'잠금장치, 부식',a:'손으로 바로 열리게 고칩니다.',lv:'pro'},
  {s:'안에 호스나 노즐이 없다',c:'분실, 점검 뒤 미복구',a:'바로 채웁니다.',lv:'self'}],
 deep:['방수구까지의 수평거리는 25 m 이하입니다. 호스 길이로 건물의 모든 곳에 물이 닿게 하려는 것입니다.','함의 재질은 두께 1.5 mm 이상의 강판이나 4 mm 이상의 합성수지입니다.'],
 code:[{c:'NFPC 102 방수구 항',t:'층마다 설치, 수평거리 25 m 이하',v:'v'},{c:'NFSC 102 함 항',t:'강판 1.5 mm 또는 합성수지 4 mm 이상',v:'v'}]},
{id:'anglevalve',cat:'box',name:'방수구',en:'Hydrant valve · 앵글밸브',one:'호스로 물을 내보내는 밸브입니다. 핸들을 돌려 엽니다.',
 easy:['핸들을 왼쪽으로 돌리면 열립니다.','호스를 다 편 다음에 엽니다. 접힌 호스에 물을 넣으면 호스가 꼬여 물이 가지 않습니다.','바닥에서 1.5 m 이하 높이에 답니다.'],
 seq:'이 밸브를 여는 순간 입상관 압력이 떨어져 펌프실의 주펌프가 켜집니다.',
 faults:[{s:'핸들이 안 돌아간다',c:'오래 안 써서 고착',a:'점검 때마다 조금씩 돌려 봅니다. 굳었으면 분해 정비합니다.',lv:'pro'},
  {s:'밸브에서 물이 뚝뚝 샌다',c:'시트 마모, 패킹 노후',a:'교체합니다. 그대로 두면 충압펌프가 자주 돕니다.',lv:'as'},
  {s:'호스 연결부가 안 맞는다',c:'규격이 다른 호스로 교체',a:'맞는 결합금구로 바꿉니다.',lv:'pro'}],
 deep:['호스 구경은 40 mm 이상입니다. 호스릴 방식은 25 mm 이상입니다.','밸브를 급하게 열면 호스가 튑니다. 노즐을 잡은 사람이 준비됐는지 확인하고 천천히 엽니다.'],
 code:[{c:'NFPC 102 방수구 항',t:'바닥에서 1.5 m 이하, 호스 40 mm 이상',v:'v'}]},
{id:'hose',cat:'box',name:'호스',en:'Fire hose',one:'방수구에서 불 앞까지 물을 나르는 납작한 관입니다.',
 easy:['평소에는 접어서 걸어 둡니다.','쓸 때는 꼬이지 않게 끝까지 폅니다.','쓰고 나면 말려서 다시 걸어야 합니다. 젖은 채 두면 삭습니다.'],
 seq:'밸브를 열기 전에 먼저 펴 둡니다.',
 faults:[{s:'물을 넣으니 호스에서 샌다',c:'노후, 접힌 자리의 갈라짐',a:'교체합니다. 점검 때 접힌 자리를 바꿔 다시 접어 둡니다.',lv:'pro'},
  {s:'물이 약하게 나온다',c:'호스가 꺾이거나 문틈에 끼임',a:'꺾인 곳을 폅니다.',lv:'self'}],
 deep:['호스 안의 마찰로도 압력이 줄어듭니다. 펌프 양정을 정할 때 호스 마찰손실을 따로 더하는 이유입니다.','<span class="eq">H = h<sub>1</sub> + h<sub>2</sub> + h<sub>3</sub> + 17 m</span> h<sub>1</sub>은 호스 마찰, h<sub>2</sub>는 배관 마찰, h<sub>3</sub>는 낙차입니다. 17 m는 노즐에서 필요한 0.17 MPa입니다.'],
 code:[{c:'NFSC 102 가압송수장치 항',t:'필요 압력에 호스 마찰손실을 더함',v:'v'}]},
{id:'nozzle',cat:'box',name:'노즐',en:'Nozzle · 관창',one:'물줄기를 가늘고 빠르게 만들어 멀리 보내는 끝부분입니다.',
 easy:['끝의 구멍은 지름 13 mm입니다.','불꽃이 아니라 타고 있는 물건의 아랫부분을 향해 쏩니다.','두 손으로 단단히 잡습니다. 물이 나오면 뒤로 밀리는 힘이 생깁니다.'],
 seq:'밸브가 열리면 물이 나옵니다. 방사형 노즐은 돌려서 물줄기 모양을 바꿉니다.',
 faults:[{s:'물줄기가 퍼지고 멀리 안 간다',c:'노즐 안의 이물질, 변형',a:'청소하거나 교체합니다.',lv:'pro'},
  {s:'노즐을 놓쳐 호스가 날뛰었다',c:'방수압 과다, 한 손 조작',a:'밸브를 먼저 잠급니다. 압력이 0.7 MPa를 넘는지 확인합니다.',lv:'pro'}],
 deep:['<b>방수량.</b> <span class="eq">Q = 0.653·d²·√(10P)</span> Q는 L/min, d는 mm, P는 MPa입니다. 13 mm 노즐에서 0.17 MPa이면 약 144 L/min입니다. 기준인 130 L/min을 넘습니다.','<b>반동력.</b> <span class="eq">R = 1.57·d²·P</span> R은 N입니다. 0.7 MPa이면 1.57 × 169 × 0.7 ≈ 186 N, 약 19 kgf입니다. 방수압 상한을 0.7 MPa로 둔 이유입니다.'],
 code:[{c:'NFPC 102 가압송수장치 항',t:'노즐 방수압 0.17 MPa 이상, 방수량 130 L/min 이상',v:'v'},{c:'계산',t:'방수량 식과 반동력 식',v:'p'}]},
{id:'poslamp',cat:'sign',name:'위치표시등',en:'Location lamp',one:'소화전이 어디 있는지 알려 주는 빨간 등입니다. 늘 켜져 있습니다.',
 easy:['연기 속이나 정전에도 소화전을 찾을 수 있게 합니다.'],
 seq:'평소에도 켜져 있습니다.',
 faults:[{s:'등이 꺼져 있다',c:'램프 수명, 전원 문제',a:'램프를 교체합니다. 여러 개가 함께 꺼졌으면 전원 쪽입니다.',lv:'self'}],
 deep:['표시등은 함의 위쪽에 답니다. 옆에서도 보이도록 튀어나온 모양입니다.'],
 code:[{c:'NFTC 102 표시등 항',t:'함 상부에 위치표시등 설치',v:'c'}]},
{id:'runlamp',cat:'sign',name:'기동표시등',en:'Pump running lamp',one:'펌프가 돌고 있음을 알려 주는 등입니다.',
 easy:['밸브를 열고 잠시 뒤 이 등이 켜지면 펌프가 켜진 것입니다.','물이 약한데 이 등이 꺼져 있으면 펌프가 안 돈 것입니다.'],
 seq:'주펌프가 켜지면 건물 안 모든 소화전함의 기동표시등이 함께 켜집니다.',
 faults:[{s:'물을 쓰는데 등이 안 켜진다',c:'펌프 미기동, 램프 고장',a:'물줄기가 정상이면 램프, 약하면 펌프실 제어반을 확인합니다.',lv:'as'}],
 deep:['사용자가 펌프실에 가 보지 않고도 펌프 상태를 알 수 있는 유일한 표시입니다.'],
 code:[{c:'NFTC 102 표시등 항',t:'가압송수장치 기동 표시등',v:'c'}]},
{id:'callpoint',cat:'sign',name:'발신기',en:'Manual call point',one:'불이 났음을 건물 전체에 알리는 누름 단추입니다.',
 easy:['소화전을 쓰기 전에 먼저 누릅니다. 경종이 울려 다른 사람들이 대피합니다.','소화전함 위쪽에 경종, 표시등과 함께 붙어 있는 경우가 많습니다.'],
 seq:'사람이 화재를 가장 먼저 알리는 수단입니다.',
 faults:[{s:'눌러도 경종이 안 울린다',c:'수신기에서 경종 정지, 배선 문제',a:'수신기의 경종 스위치를 확인합니다.',lv:'self'},
  {s:'장난으로 자주 눌린다',c:'보호판 없음',a:'보호판을 달고 안내 표지를 붙입니다.',lv:'self'}],
 deep:['발신기는 자동화재탐지설비에 속합니다. 수계소화설비와 따로 움직이지만 현장에서는 한 상자에 모여 있습니다.'],
 code:[{c:'공학적 설명',t:'경보 설비와의 관계',v:'p'}]},
{id:'prv',cat:'pipe',name:'감압밸브',en:'Pressure reducing valve',one:'압력이 너무 높은 층에서 방수구 압력을 낮춰 주는 장치입니다.',
 easy:['아래층은 위쪽 물의 무게까지 더해져 압력이 높습니다.','노즐 압력이 0.7 MPa를 넘으면 사람이 호스를 다루기 어렵습니다. 그 층에는 감압밸브를 답니다.'],
 seq:'물이 흐르는 동안 일합니다. 설정한 압력까지만 통과시킵니다.',
 faults:[{s:'아래층인데도 물이 약하다',c:'감압밸브 이물질 막힘, 설정이 너무 낮음',a:'청소하고 설정을 다시 맞춥니다.',lv:'pro'},
  {s:'감압밸브를 달았는데도 너무 세다',c:'설정 불량, 층에 맞지 않는 제품',a:'방수압을 재서 층별로 맞춥니다.',lv:'pro'}],
 deep:['감압장치는 호스 접결구의 들어오는 쪽에 답니다.','방수구에 끼우는 오리피스 방식도 있습니다. 구멍 크기가 고정이라 층마다 맞는 것을 써야 합니다.'],
 code:[{c:'NFPC 102 가압송수장치 항',t:'노즐 방수압 0.7 MPa 초과 시 호스접결구 인입 측에 감압장치',v:'v'}]},
{id:'hbranch',cat:'pipe',name:'입상관·가지배관',en:'Riser and branch',one:'펌프실에서 올라온 물을 방수구까지 데려오는 배관입니다.',
 easy:['벽 속 세로 배관이 입상관, 거기서 소화전함으로 들어오는 가로 배관이 가지배관입니다.','평소에도 물과 압력으로 차 있습니다.'],
 seq:'방수구가 열리면 여기 압력이 떨어지고, 그 변화가 펌프실까지 전해집니다.',
 faults:[{s:'소화전함 안이 젖어 있다',c:'가지배관 이음부나 방수구 누수',a:'새는 곳을 찾아 수리합니다.',lv:'as'}],
 deep:['수직배관은 50 mm 이상, 가지배관은 40 mm 이상입니다.','층별 압력은 2장의 입상관 항목에 계산이 있습니다.'],
 code:[{c:'NFTC 102 2.3.5',t:'수직배관 50 mm, 가지배관 40 mm 이상',v:'v'}]},
{id:'pitot',cat:'pipe',name:'피토게이지',en:'Pitot gauge · 방수압 측정',one:'노즐에서 나오는 물줄기에 대어 방수압을 재는 계기입니다.',
 easy:['점검 때 씁니다. 물줄기 한가운데에 대고 압력을 읽습니다.','가장 높은 층과 가장 낮은 층에서 잽니다. 위는 모자라지 않은지, 아래는 넘치지 않는지 봅니다.'],
 seq:'화재 때는 쓰지 않습니다.',
 faults:[{s:'잴 때마다 값이 다르다',c:'물줄기 가장자리에 댐, 노즐에서 너무 멂',a:'노즐 지름의 절반쯤 떨어진 자리에서 물줄기 중심에 댑니다.',lv:'pro'}],
 deep:['읽은 압력을 노즐 항목의 식에 넣으면 방수량이 나옵니다. 압력 0.17 MPa 이상, 0.7 MPa 이하가 합격 범위입니다.'],
 code:[{c:'측정 방법',t:'Q = 0.653·d²·√(10P)',v:'v'}]}
];
const H={hr:'held',hb:'held'};
const M=o=>Object.assign({},H,o);
const MODES={
standby:{g:'run',n:'평상시',t:'문은 닫혀 있고 배관은 압력을 품고 있습니다',d:['위치표시등만 켜져 있습니다.','방수구 바로 앞까지 물이 와 있습니다.'],read:['위치표시등 점등','기동표시등 소등'],fl:M({}),lamp:[],rel:['cabinet','poslamp']},
use:{g:'run',n:'사용 중',t:'호스를 펴고 밸브를 열어 물을 쏩니다',d:['밸브를 열면 압력이 떨어져 펌프가 켜지고 기동표시등이 들어옵니다.','불꽃이 아니라 타는 물건의 아랫부분을 향합니다.'],read:['방수압 0.17~0.7 MPa','방수량 130 L/min 이상'],fl:M({use:'on',hf:'on',jet:'on',hb:undefined}),lamp:['run'],rel:['anglevalve','nozzle','runlamp']},
pitot:{g:'run',n:'방수압 측정',t:'물줄기에 피토게이지를 대고 압력을 읽습니다',d:['점검 때 가장 높은 층과 가장 낮은 층에서 잽니다.','읽은 압력으로 방수량까지 계산합니다.'],read:['합격 범위 0.17~0.7 MPa'],fl:M({use:'on',hf:'on',jetp:'on',hb:undefined}),lamp:['run'],rel:['pitot','nozzle']},
over:{g:'fault',n:'압력 과다',t:'물줄기가 너무 세서 노즐을 잡기 어렵습니다',d:['방수압이 0.7 MPa를 넘었습니다. 주로 아래층에서 생깁니다.','노즐을 놓치면 호스가 날뛰어 사람이 다칩니다.'],read:['0.7 MPa 초과','반동력 19 kgf 이상'],fl:M({use:'bad',hf:'bad',jet:'bad',hb:undefined}),lamp:['run'],rel:['prv','nozzle']},
weak:{g:'fault',n:'압력 부족',t:'물이 불까지 닿지 않습니다',d:['방수압이 0.17 MPa에 못 미칩니다.','기동표시등이 꺼져 있으면 펌프가 안 켜진 것입니다. 켜져 있으면 밸브나 배관 쪽입니다.'],read:['0.17 MPa 미만','기동표시등 확인'],fl:M({use:'weak',hf:'weak',jetw:'weak',hb:undefined}),lamp:[],rel:['runlamp','anglevalve','prv']},
kink:{g:'fault',n:'호스 꺾임',t:'호스가 접혀 물이 막혔습니다',d:['호스를 다 펴지 않고 밸브를 열었습니다. 접힌 자리에서 물이 막힙니다.','밸브를 잠그고 호스를 편 뒤 다시 엽니다.'],read:['펌프는 정상','노즐에서만 약함'],fl:M({use:'on',jetw:'weak',hb:undefined}),lamp:['run'],rel:['hose','anglevalve']},
laid:{g:'step',n:'',t:'',d:[],read:[],fl:M({}),lamp:[],rel:['hose']}
};
const SEQS=[{id:'use',n:'소화전 쓰는 순서',steps:[
 {t:'발신기를 누르고 문을 엽니다',d:'먼저 불이 났음을 알립니다. 그다음 소화전함 문을 끝까지 엽니다.',mode:'standby',run:'없음',hl:['callpoint','cabinet']},
 {t:'호스를 끝까지 폅니다',d:'노즐을 잡고 불 쪽으로 가면서 호스를 꼬이지 않게 폅니다. 두 사람이면 한 사람은 밸브 옆에 남습니다.',mode:'laid',run:'없음',hl:['hose','nozzle']},
 {t:'방수구 밸브를 엽니다',d:'핸들을 왼쪽으로 돌립니다. 압력이 떨어져 펌프가 켜지고 기동표시등이 들어옵니다.',mode:'use',run:'주펌프',hl:['anglevalve','runlamp']},
 {t:'타는 물건의 아랫부분에 쏩니다',d:'두 손으로 노즐을 잡고 빗자루로 쓸듯이 움직입니다. 불이 커져 감당이 안 되면 놓고 대피합니다.',mode:'use',run:'주펌프',hl:['nozzle']},
 {t:'밸브를 잠그고 정리합니다',d:'불이 꺼지면 밸브를 잠급니다. 펌프는 제어반에서 사람이 멈춥니다. 호스는 말려서 다시 걸어 둡니다.',mode:'standby',run:'없음',hl:['anglevalve','hose']}]}];
const tool={html:`<section class="sec"><h2>방수량·반동력 계산기</h2><p class="intro">피토게이지로 읽은 압력을 넣으면 방수량과 노즐이 뒤로 미는 힘이 나옵니다.</p>
<div class="cols"><div class="card"><form class="form" id="nForm">
<label for="nD">노즐 구경 <span class="unit">mm</span></label><input id="nD" type="number" step="1" min="1" value="13" inputmode="decimal">
<label for="nP">방수압 <span class="unit">MPa</span></label><input id="nP" type="number" step="0.01" min="0" value="0.35" inputmode="decimal">
</form><p class="note">옥내소화전의 노즐 구경은 13 mm입니다.</p></div><div class="card" id="nOut"></div></div></section>`,
 init(){const $=s=>document.querySelector(s);function run(){const d=parseFloat($('#nD').value),P=parseFloat($('#nP').value),o=$('#nOut');
   if(!(d>0)||!(P>=0)){o.innerHTML='<p style="color:var(--crit)">구경은 0보다 큰 숫자, 압력은 0 이상으로 넣어 주세요.</p>';return;}
   const q=0.653*d*d*Math.sqrt(10*P),r=1.57*d*d*P,okP=P>=0.17&&P<=0.7,okQ=q>=130;
   o.innerHTML=`<table><tbody><tr><th>방수량</th><td class="num">${q.toFixed(0)} L/min</td><td><span class="vd ${okQ?'ok':'ng'}">${okQ?'✓ 130 이상':'✕ 130 미만'}</span></td></tr>`
    +`<tr><th>방수압</th><td class="num">${P.toFixed(2)} MPa</td><td><span class="vd ${okP?'ok':'ng'}">${okP?'✓ 범위 안':P<0.17?'✕ 0.17 미만':'✕ 0.7 초과'}</span></td></tr>`
    +`<tr><th>반동력</th><td class="num">${r.toFixed(0)} N</td><td>약 ${(r/9.81).toFixed(1)} kgf</td></tr></tbody></table>`
    +`<p class="note">Q = 0.653·d²·√(10P), R = 1.57·d²·P. 반동력이 20 kgf에 가까워지면 한 사람이 다루기 어렵습니다.</p>`;}
  $('#nForm').addEventListener('input',run);$('#nForm').addEventListener('submit',e=>e.preventDefault());run();}};
BOOK.add({id:'hydrant',n:4,title:'옥내소화전',vb:'0 0 1440 760',minw:940,build:build,
 lede:'소화전함 문을 열었을 때의 모습입니다. 스프링클러는 스스로 움직이지만 소화전은 사람이 써야 합니다. 그래서 이 장은 부품과 함께 쓰는 순서를 다룹니다.',
 cats:[['box','함 안'],['sign','표시·경보'],['pipe','배관·측정']],parts:PARTS,modes:MODES,def:{run:'standby',fault:'over'},seqs:SEQS,tool:tool});
})();
