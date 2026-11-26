/* ch5.js: diagnosis. Decision trees and a symptom index across all chapters. */
(function(){
const TREES=[
{id:'t-jockey',t:'충압펌프가 자주 돈다',s:'a',n:{
 a:{q:'몇 초 간격으로 켜졌다 꺼지기를 반복합니까?',y:'r1',n:'b'},
 b:{q:'펌프가 모두 서 있는데 펌프실 압력계(체크밸브 앞쪽)가 배관 압력을 가리킵니까?',y:'r2',n:'c'},
 c:{q:'어느 층 알람밸브의 2차 압력이 떨어지고 있습니까?',y:'r3',n:'d'},
 d:{q:'물올림탱크가 넘치고 있습니까?',y:'r4',n:'r5'},
 r1:{r:'압력챔버의 공기가 없어졌습니다',w:'쿠션이 없어 압력이 순식간에 오르내립니다. 공기 교체 작업으로 해결합니다.',lv:'pro',p:['chamber']},
 r2:{r:'토출 쪽 체크밸브가 샙니다',w:'배관 압력이 펌프 쪽으로 넘어오고 있습니다. 바이패스 밸브가 열려 있지 않은지 먼저 봅니다.',lv:'as',p:['checkvalve','pgauge']},
 r3:{r:'그 층의 2차측에서 물이 샙니다',w:'배수밸브가 덜 잠겼거나 배관, 헤드에서 누수가 있습니다.',lv:'pro',p:['avdrain','alarmvalve','avgauge']},
 r4:{r:'물올림관과 토출 쪽 체크밸브가 함께 샙니다',w:'배관 압력이 물올림탱크로 새어 넘치고 있습니다.',lv:'as',p:['primingpipe','checkvalve']},
 r5:{r:'입상관이나 연결 배관 어딘가에서 압력이 빠집니다',w:'층 제어밸브를 한 층씩 잠가 보며 찾습니다. 송수구와 옥상수조 쪽 체크밸브도 봅니다.',lv:'pro',p:['c2riser','c2fdc','c2roof']}}},
{id:'t-nostart',t:'펌프가 켜지지 않는다',s:'a',n:{
 a:{q:'제어반 선택스위치가 자동에 있습니까?',y:'b',n:'r1'},
 b:{q:'차단기가 올라가 있고 과부하계전기가 작동하지 않았습니까?',y:'c',n:'r2'},
 c:{q:'엔진펌프입니까?',y:'d',n:'e'},
 d:{q:'축전지 충전 표시와 연료량이 정상입니까?',y:'r4',n:'r3'},
 e:{q:'압력을 떨어뜨리면 수신기에 압력스위치 작동 표시가 뜹니까?',y:'r6',n:'r5'},
 r1:{r:'선택스위치를 자동으로 돌립니다',w:'정지나 수동에서는 압력이 떨어져도 켜지지 않습니다. 가장 흔한 원인입니다.',lv:'self',p:['mcc']},
 r2:{r:'전원 쪽 문제입니다',w:'차단기를 올립니다. 과부하계전기가 다시 작동하면 억지로 넣지 말고 수리를 의뢰합니다.',lv:'as',p:['mcc']},
 r3:{r:'축전지나 연료 문제입니다',w:'엔진펌프 시동 불량의 대부분은 축전지 방전입니다.',lv:'self',p:['engine']},
 r4:{r:'엔진의 기동 회로 문제입니다',w:'기동 전동기, 기동용 전자석, 제어반을 점검해야 합니다.',lv:'as',p:['engine']},
 r5:{r:'압력스위치나 그 배선 문제입니다',w:'접점이 붙지 않거나 신호가 제어반까지 가지 않습니다.',lv:'as',p:['pswitch','chamber']},
 r6:{r:'전동기나 기동반 문제입니다',w:'신호는 정상으로 오는데 전동기가 돌지 않습니다. 전기 쪽 수리가 필요합니다.',lv:'as',p:['pump','mcc']}}},
{id:'t-nopress',t:'펌프는 도는데 압력이 안 오른다',s:'a',n:{
 a:{q:'운전 중 연성계 바늘이 0 근처에 있습니까?',y:'b',n:'d'},
 b:{q:'물올림탱크에 물이 차 있습니까?',y:'c',n:'r1'},
 c:{q:'물올림관 밸브를 잠그고 물올림컵을 보면 수위가 내려갑니까?',y:'r2',n:'r3'},
 d:{q:'연성계의 진공이 평소보다 큽니까?',y:'r4',n:'e'},
 e:{q:'릴리프밸브 배출관에서 물이 계속 나옵니까?',y:'r5',n:'f'},
 f:{q:'성능시험배관의 밸브가 열려 있습니까?',y:'r6',n:'r7'},
 r1:{r:'물올림탱크에 물이 없습니다',w:'급수 밸브와 배수밸브 위치를 봅니다. 탱크가 비면 펌프는 공기만 돌립니다.',lv:'self',p:['primingtank']},
 r2:{r:'풋밸브가 샙니다',w:'흡입관의 물이 수조로 빠지고 있습니다. 풋밸브를 끌어올려 청소하거나 교체합니다.',lv:'as',p:['footvalve']},
 r3:{r:'펌프 안에 공기가 차 있습니다',w:'물올림관 밸브가 열려 있는지 보고, 공기를 뺀 뒤 다시 기동합니다.',lv:'self',p:['primingpipe','cgauge']},
 r4:{r:'흡입 쪽이 막혔습니다',w:'스트레이너부터 엽니다. 풋밸브의 망과 흡입 밸브도 봅니다.',lv:'pro',p:['strainer','svalve','footvalve']},
 r5:{r:'릴리프밸브 설정이 너무 낮습니다',w:'정격 운전에서도 열려 물을 버리고 있습니다. 체절압 바로 아래에서 열리도록 다시 맞춥니다.',lv:'pro',p:['relief']},
 r6:{r:'물이 성능시험배관으로 빠지고 있습니다',w:'시험 뒤 밸브를 닫지 않았습니다. 닫습니다.',lv:'self',p:['testline']},
 r7:{r:'펌프 자체의 문제입니다',w:'전동기 역회전이나 임펠러 손상을 의심합니다. 결선을 만진 직후라면 회전 방향을 봅니다.',lv:'as',p:['pump']}}},
{id:'t-overflow',t:'물올림탱크가 넘친다',s:'a',n:{
 a:{q:'급수 밸브를 잠그면 넘침이 멈춥니까?',y:'r1',n:'b'},
 b:{q:'펌프가 돌 때만 넘칩니까?',y:'r2',n:'r3'},
 r1:{r:'볼탑이 닫히지 않습니다',w:'부구가 걸렸거나 시트에 이물질이 끼었습니다. 청소하거나 교체합니다.',lv:'pro',p:['primingtank']},
 r2:{r:'물올림관 체크밸브가 샙니다',w:'펌프 압력이 탱크로 거꾸로 올라갑니다. 풋밸브 문제가 아닙니다.',lv:'as',p:['primingpipe']},
 r3:{r:'물올림관과 토출 쪽 체크밸브가 함께 샙니다',w:'펌프가 서 있어도 배관 압력이 탱크까지 넘어옵니다.',lv:'as',p:['primingpipe','checkvalve']}}},
{id:'t-lowwater',t:'물올림탱크 감수경보가 울린다',s:'a',n:{
 a:{q:'급수 밸브는 열려 있고 배수밸브는 잠겨 있습니까?',y:'b',n:'r1'},
 b:{q:'볼탑에서 물이 계속 들어가고 있습니까?',y:'r2',n:'r3'},
 r1:{r:'밸브 위치가 잘못됐습니다',w:'급수 밸브를 열고 배수밸브를 잠급니다.',lv:'self',p:['primingtank']},
 r2:{r:'풋밸브가 샙니다',w:'들어가는 물보다 빠지는 물이 많습니다. 흡입관의 물이 수조로 새고 있습니다.',lv:'as',p:['footvalve']},
 r3:{r:'볼탑이 열리지 않거나 급수가 끊겼습니다',w:'급수 배관의 물과 볼탑 작동을 확인합니다.',lv:'pro',p:['primingtank']}}},
{id:'t-falsealarm',t:'불이 없는데 스프링클러 경보가 울린다',s:'a',n:{
 a:{q:'그 층 헤드에서 물이 나오고 있습니까?',y:'r1',n:'b'},
 b:{q:'준비작동식 구역입니까?',y:'c',n:'d'},
 c:{q:'수신기에 감지기 작동 표시가 있습니까?',y:'r2',n:'r3'},
 d:{q:'알람밸브의 2차 압력이 떨어져 있습니까?',y:'r4',n:'r5'},
 r1:{r:'헤드가 깨졌습니다',w:'그 층 제어밸브를 잠가 물을 멈춥니다. 헤드를 교체한 뒤 복구합니다.',lv:'as',p:['floorvalve','head']},
 r2:{r:'감지기가 오동작했습니다',w:'먼지, 습기, 배기가스가 원인입니다. 청소하거나 환경에 맞는 종류로 바꿉니다.',lv:'pro',p:['detector']},
 r3:{r:'준비작동식 밸브가 저절로 열렸습니다',w:'중간챔버 압력이 빠졌습니다. 세팅 라인과 전자밸브 누설을 봅니다.',lv:'as',p:['prevalve','solenoid']},
 r4:{r:'2차측에서 물이 샙니다',w:'배수밸브와 말단시험밸브가 잠겼는지 보고, 배관 누수를 찾습니다.',lv:'pro',p:['avdrain','testvalve','piping']},
 r5:{r:'압력 출렁임에 따른 오보입니다',w:'리타딩챔버 오리피스가 막혔는지 봅니다. 펌프가 켜질 때마다 울리면 이쪽입니다.',lv:'pro',p:['retard','alarmvalve']}}},
{id:'t-hydrant',t:'소화전 물줄기가 이상하다',s:'a',n:{
 a:{q:'너무 세서 노즐을 잡기 어렵습니까?',y:'r1',n:'b'},
 b:{q:'다른 층 소화전도 똑같이 약합니까?',y:'c',n:'r3'},
 c:{q:'기동표시등이 켜졌습니까?',y:'r4',n:'r2'},
 r1:{r:'방수압이 0.7 MPa를 넘습니다',w:'아래층일수록 생깁니다. 감압밸브를 달거나 설정을 낮춥니다.',lv:'pro',p:['prv','nozzle']},
 r2:{r:'펌프가 켜지지 않았습니다',w:'펌프실 제어반을 확인합니다. 위의 「펌프가 켜지지 않는다」 순서를 따릅니다.',lv:'as',p:['mcc','runlamp']},
 r3:{r:'그 소화전만의 문제입니다',w:'방수구를 끝까지 열었는지, 호스가 꺾이지 않았는지, 감압밸브가 막히지 않았는지 봅니다.',lv:'self',p:['anglevalve','hose','prv']},
 r4:{r:'펌프는 도는데 성능이 안 나옵니다',w:'위의 「펌프는 도는데 압력이 안 오른다」 순서를 따릅니다.',lv:'as',p:['pump','strainer']}}},
{id:'t-tamper',t:'수신기에 밸브 폐쇄 표시가 떠 있다',s:'a',n:{
 a:{q:'표시된 밸브의 나사봉이 끝까지 올라와 있습니까?',y:'r2',n:'r1'},
 r1:{r:'밸브가 덜 열렸습니다',w:'끝까지 엽니다. 닫힌 밸브는 스프링클러가 실패하는 가장 큰 원인입니다.',lv:'self',p:['floorvalve','dvalve']},
 r2:{r:'탬퍼스위치나 배선 문제입니다',w:'밸브는 열려 있는데 신호만 잘못 가고 있습니다. 스위치 위치를 조정합니다.',lv:'pro',p:['floorvalve','c2panel']}}}
];
SOURCES.push(
 ['U-LEX, 옥내소화전설비의 화재안전성능기준(NFPC 102)','https://www.ulex.co.kr/%EB%B2%95%EB%A5%A0/2100000216123-31179-%EC%98%A5%EB%82%B4%EC%86%8C%ED%99%94%EC%A0%84'],
 ['소방방재청, 옥내소화전설비의 화재안전기준 해설 (2013)','http://cfile209.uf.daum.net/attach/275BF9505294689112DB9F'],
 ['스프링클러설비의 화재안전기준(NFSC 103) 조문','https://fire.gwd.go.kr/egf/bp/board/article/download;jsessionid=39D176316B4F9DA93871726673B4A30E?fileSeq=1205175'],
 ['알람밸브 구조와 세팅 방법 (제조·시공사 설명)','http://www.nofire.co.kr/m/product.html?branduid=156098'],
 ['리타딩챔버와 유수검지장치 설명','http://kunkuk.co.kr/sub3_3.php'],
 ['방수압력과 방수량 표, Q = 0.653·D²·√(10P)','https://www.itachibori.co.jp/wp-content/uploads/2023/05/8b47e77617b41a1bf4b7a6aaed390f7b.pdf']);

const html=`<section class="sec" style="margin-top:8px"><h2>증상에서 원인 찾기</h2><p class="intro">증상을 고르고 예, 아니오로 답하면 가장 가능성 높은 원인까지 좁혀 갑니다. 현장에서 확인하는 순서대로 물었습니다.</p>
<div class="treepick" id="treePick" role="group" aria-label="증상 선택"></div><div class="card tree" id="treeBox" aria-live="polite"></div></section>
<section class="sec" id="symptoms"><h2>증상 전체 찾기</h2><p class="intro">현장에서 들은 말을 그대로 넣어 보세요. 1장에서 4장까지의 모든 증상에서 찾습니다. 부품 이름을 누르면 그 부품의 그림과 설명으로 이동합니다.</p>
<label for="symQ" class="note" style="display:block;margin:0 0 4px">증상 검색</label><input class="search" id="symQ" type="search" placeholder="예: 넘친다, 안 오른다, 자주 돈다, 경보">
<p class="note" id="symCount"></p><div class="tablewrap"><table id="symTable"><thead><tr><th>증상</th><th>흔한 원인</th><th>부품</th><th>대응</th></tr></thead><tbody></tbody></table></div></section>`;
function init(api){
  const $=s=>document.querySelector(s),esc=api.esc;let T=TREES[0],path=[];
  $('#treePick').innerHTML=TREES.map((t,i)=>`<button class="opt" data-t="${i}" aria-pressed="${i===0}">${esc(t.t)}</button>`).join('');
  function draw(){let h=`<h3>${esc(T.t)}</h3><ol class="steps">`,k=T.s;
    path.forEach(a=>{const nd=T.n[k];h+=`<li><span>${esc(nd.q)}</span><b class="ans">${a==='y'?'예':'아니오'}</b></li>`;k=nd[a];});
    const nd=T.n[k];
    if(nd.q)h+=`<li class="now"><span>${esc(nd.q)}</span><span class="yn"><button class="opt" data-a="y">예</button><button class="opt" data-a="n">아니오</button></span></li></ol>`;
    else h+=`</ol><div class="fault lv-${nd.lv}"><span class="pill ${nd.lv}">${esc(LV[nd.lv].t)}</span><strong>${esc(nd.r)}</strong><p style="margin-top:4px">${esc(nd.w)}</p><div class="rel">관련 부품 ${nd.p.map(id=>`<button class="linkbtn" data-goto="${id}" data-far="1">${esc(api.part(id).name)}</button>`).join('')}</div></div>`;
    if(path.length)h+=`<p style="margin-top:12px"><button class="linkbtn" data-reset="1">처음부터 다시</button></p>`;
    $('#treeBox').innerHTML=h;}
  $('#treePick').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;T=TREES[+b.dataset.t];path=[];
    document.querySelectorAll('#treePick .opt').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw();});
  $('#treeBox').addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(a){path.push(a.dataset.a);draw();return;}if(e.target.closest('[data-reset]')){path=[];draw();}});
  draw();
  const rows=[];BOOK.ch.forEach(c=>(c.parts||[]).forEach(p=>p.faults.forEach(f=>rows.push({p:p,f:f,c:c}))));
  function sym(){const q=$('#symQ').value.trim().toLowerCase();const r=rows.filter(o=>!q||(o.f.s+' '+o.f.c+' '+o.p.name).toLowerCase().indexOf(q)>=0);
    $('#symTable tbody').innerHTML=r.map(o=>`<tr><td>${esc(o.f.s)}</td><td>${esc(o.f.c)}</td><td><button class="linkbtn" data-goto="${o.p.id}" data-far="1">${esc(o.p.name)}</button> <span class="note">${o.c.n}장</span></td><td><span class="pill ${o.f.lv}">${esc(LV[o.f.lv].t)}</span></td></tr>`).join('')||'<tr><td colspan="4">맞는 증상이 없습니다. 다른 낱말로 찾아보세요.</td></tr>';
    $('#symCount').textContent='증상 '+rows.length+'건 가운데 '+r.length+'건';}
  $('#symQ').addEventListener('input',sym);sym();
}
BOOK.add({id:'diagnosis',n:5,title:'고장 진단',lede:'앞의 네 장에 흩어져 있는 고장을 증상에서 거꾸로 찾아갑니다. 위쪽은 질문을 따라 좁혀 가는 방식, 아래쪽은 낱말로 바로 찾는 방식입니다.',page:{html:html,init:init},parts:[]});
})();
