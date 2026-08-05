
const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('#main-nav');
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));}


const evidenceData={
 C3:{placement:'Central placement',rmse:'3.8',mean:'−0.4',max:'6.6',n:'17',plan:'assets/images/c3-plan.webp',three:'assets/images/c3-3d.webp',note:'Among the three selected sessions, C3 provides the densest shown boundary check and the smallest radial RMSE.'},
 R3:{placement:'Lateral placement',rmse:'7.5',mean:'−0.4',max:'17.0',n:'16',plan:'assets/images/r3-plan.webp',three:'assets/images/r3-3d.webp',note:'R3 preserves a broad angular spread of selected checks while showing a larger maximum radial departure than C3.'},
 D3:{placement:'Depth placement',rmse:'14.0',mean:'−2.8',max:'19.8',n:'8',plan:'assets/images/d3-plan.webp',three:'assets/images/d3-3d.webp',note:'D3 contains fewer selected boundary checks and the largest radial RMSE among the three examples shown.'}
};
const explorer=document.querySelector('.evidence-explorer');
if(explorer){
 const image=document.querySelector('#evidence-image'),caption=document.querySelector('#evidence-caption');
 const fields={condition:document.querySelector('#metric-condition'),placement:document.querySelector('#metric-placement'),rmse:document.querySelector('#metric-rmse'),mean:document.querySelector('#metric-mean'),max:document.querySelector('#metric-max'),n:document.querySelector('#metric-n'),note:document.querySelector('#metric-note')};
 function update(){const c=explorer.dataset.condition,v=explorer.dataset.view,d=evidenceData[c];image.src=v==='plan'?d.plan:d.three;image.alt=`${c} ${v==='plan'?'plan-view':'3D'} total-station boundary verification.`;caption.textContent=`${c} ${v==='plan'?'plan view — GoPro-view-aligned metric frame.':'corrected 3D reconstruction — GoPro-view-aligned, not mirrored.'}`;fields.condition.textContent=c;fields.placement.textContent=d.placement;fields.rmse.textContent=d.rmse;fields.mean.textContent=d.mean;fields.max.textContent=d.max;fields.n.textContent=d.n;fields.note.textContent=d.note;}
 document.querySelectorAll('.condition-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.condition-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');explorer.dataset.condition=btn.dataset.condition;update();}));
 document.querySelectorAll('.view-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.view-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');explorer.dataset.view=btn.dataset.view;update();}));
}
