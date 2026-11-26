/* draw.js: shared drawing primitives for chapters 2 to 4. Gradients live in SCENE_DEFS (scene.js). */
const D=(function(){
const R=(x,y,w,h,f,ex)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${ex?' '+ex:''}/>`;
const pV=(x,y1,y2,d)=>R(x-d/2,Math.min(y1,y2),d,Math.abs(y2-y1),'url(#gV)');
const pH=(x1,x2,y,d)=>R(Math.min(x1,x2),y-d/2,Math.abs(x2-x1),d,'url(#gH)');
const el=(x,y,d)=>`<circle cx="${x}" cy="${y}" r="${d/2+1.5}" fill="url(#gJ)"/>`;
const cV=(x,y,d)=>R(x-d/2-3,y-4,d+6,8,'url(#gCv)','rx="2"');
const cH=(x,y,d)=>R(x-4,y-d/2-3,8,d+6,'url(#gCh)','rx="2"');
const part=(id,label,inner,tab)=>`<g class="part" data-id="${id}" tabindex="${tab===false?-1:0}" role="button" aria-label="${label}"><title>${label}</title>${inner}</g>`;
const hit=(x,y,w,h)=>R(x,y,w,h,'transparent');
function gateV(x,y,d,side){const bw=d+12;return R(x-bw/2,y-16,bw,32,'url(#gRv)','rx="5"')+R(x-bw/2-2,y-20,bw+4,5,'#7a1a16','rx="2"')+R(x-bw/2-2,y+15,bw+4,5,'#7a1a16','rx="2"')+R(side>0?x+bw/2:x-bw/2-24,y-3,24,6,'url(#gH)')+`<ellipse cx="${x+side*(bw/2+26)}" cy="${y}" rx="4.5" ry="15" fill="#2b3640" stroke="#10171c" stroke-width="1.2"/>`;}
function gateH(x,y,d){const bh=d+12;return R(x-16,y-bh/2,32,bh,'url(#gRh)','rx="5"')+R(x-20,y-bh/2-2,5,bh+4,'#7a1a16','rx="2"')+R(x+15,y-bh/2-2,5,bh+4,'#7a1a16','rx="2"')+R(x-3,y-bh/2-24,6,24,'url(#gV)')+`<ellipse cx="${x}" cy="${y-bh/2-26}" rx="15" ry="4.5" fill="#2b3640" stroke="#10171c" stroke-width="1.2"/>`;}
function miniH(x,y,d,c){return R(x-9,y-d/2-4,18,d+8,c||'url(#gRh)','rx="3"')+R(x-2,y-d/2-13,4,10,'url(#gV)')+R(x-8,y-d/2-16,16,4,'#2b3640','rx="2"');}
function miniV(x,y,d,side,c){return R(x-d/2-4,y-9,d+8,18,c||'url(#gRv)','rx="3"')+R(side>0?x+d/2+3:x-d/2-13,y-2,10,4,'url(#gH)')+R(side>0?x+d/2+12:x-d/2-16,y-8,4,16,'#2b3640','rx="2"');}
function checkV(x,y,d){const w=d/2;return `<path d="M${x-w-2} ${y+20}L${x-w-9} ${y+8}V${y-8}L${x-w-2} ${y-20}H${x+w+2}L${x+w+9} ${y-8}V${y+8}L${x+w+2} ${y+20}Z" fill="url(#gDk)"/><path d="M${x} ${y+9}V${y-8}M${x-5} ${y-2}L${x} ${y-9}L${x+5} ${y-2}" stroke="#f3d9a0" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;}
function gauge(x,y,rr,ang){const a=ang*Math.PI/180;return `<circle cx="${x}" cy="${y}" r="${rr}" fill="#fbfcfc" stroke="#353f47" stroke-width="2.6"/><path d="M${x-rr+4.5} ${y+4}A${rr-4.5} ${rr-4.5} 0 1 1 ${x+rr-4.5} ${y+4}" fill="none" stroke="#9aa5ac" stroke-width="1.4"/><line x1="${x}" y1="${y}" x2="${(x+(rr-4)*Math.cos(a)).toFixed(1)}" y2="${(y+(rr-4)*Math.sin(a)).toFixed(1)}" stroke="#c8322b" stroke-width="2" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="2" fill="#353f47"/>`;}
function box3d(x,y,w,h,dx,dy,cf,ct,cs){return `<polygon points="${x},${y} ${x+dx},${y+dy} ${x+w+dx},${y+dy} ${x+w},${y}" fill="${ct}"/><polygon points="${x+w},${y} ${x+w+dx},${y+dy} ${x+w+dx},${y+h+dy} ${x+w},${y+h}" fill="${cs}"/>`+R(x,y,w,h,cf);}
function funnel(x,y){return `<path d="M${x-9} ${y-8}h18l-5 8h-8z" fill="#59646c"/>`;}
function head(x,y){return R(x-3,y,6,12,'url(#gBr)')+R(x-6,y+12,12,5,'url(#gBr)','rx="1"')+R(x-1.6,y+17,3.2,9,'#d3241b','rx="1.6"')+`<path d="M${x-6} ${y+17}L${x-8} ${y+27}M${x+6} ${y+17}L${x+8} ${y+27}" stroke="#8a6516" stroke-width="1.5"/><path d="M${x-10} ${y+28}h20" stroke="#8a6516" stroke-width="3" stroke-linecap="round"/>`;}
function spray(x,y,show,h){let s='';h=h||74;for(let i=-4;i<=4;i++){s+=`<path d="M${x} ${y}L${x+i*(h/4.6)} ${y+h}"/>`;}return `<g class="viz spray" data-show="${show}">${s}</g>`;}
function flame(x,y,show){return `<g class="viz" data-show="${show}"><path d="M${x} ${y}c-20 -18 -9 -36 0 -54c4 15 22 24 15 45c-2 8 -9 11 -15 9z" fill="#f47230"/><path d="M${x+2} ${y-2}c-9 -8 -4 -17 0 -26c2 8 10 11 7 21c-1 4 -5 6 -7 5z" fill="#ffd166"/></g>`;}
function detector(x,y,l){return `<path d="M${x-15} ${y}h30l-5 10h-20z" fill="#f4f6f6" stroke="#59636b" stroke-width="1.2"/><circle class="lamp" data-l="${l}" cx="${x}" cy="${y+14}" r="4"/>`;}
function bell(x,y,l){return `<circle cx="${x}" cy="${y}" r="11" fill="#c8322b" stroke="#7a1a16" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="3" fill="#f1d58a"/><circle class="lamp" data-l="${l}" cx="${x+14}" cy="${y-12}" r="4"/>`;}
const flows=F=>'<g class="flows" aria-hidden="true">'+Object.keys(F).map(k=>`<path class="flow" data-f="${k}" d="${F[k]}"/>`).join('')+'</g>';
const badge=(x,y,t,show,k)=>`<g class="badge ${k||''}" data-show="${show}"><rect x="${x}" y="${y-17}" width="${t.length*14+18}" height="24" rx="12"/><text x="${x+9}" y="${y}">${t}</text></g>`;
const labels=LB=>'<g class="labels">'+LB.map(l=>`<text class="lb${l[5]?' '+l[5]:''}${l[6]?' viz':''}"${l[6]?` data-show="${l[6]}"`:''} data-id="${l[4]}" x="${l[0]}" y="${l[1]}" text-anchor="${l[2]}">${l[3]}</text>`).join('')+'</g>';
const txt=(x,y,t,c,a)=>`<text class="${c||'nt'}" x="${x}" y="${y}" text-anchor="${a||'start'}">${t}</text>`;
return {R,pV,pH,el,cV,cH,part,hit,gateV,gateH,miniH,miniV,checkV,gauge,box3d,funnel,head,spray,flame,detector,bell,flows,badge,labels,txt};
})();
