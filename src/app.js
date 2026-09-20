import {STAGES,PALETTE} from "./universe-data.js";

const canvas=document.querySelector("#universe");
const ctx=canvas.getContext("2d",{alpha:false,desynchronized:true});
const els={
  sections:document.querySelector("#stageSections"),nav:document.querySelector("#stageNav"),railFill:document.querySelector("#railFill"),
  toast:document.querySelector("#stageToast"),toastClose:document.querySelector("#stageToastClose"),stageInfo:document.querySelector("#stageInfoToggle"),
  num:document.querySelector("#stageNumber"),kicker:document.querySelector("#stageKicker"),title:document.querySelector("#stageTitle"),desc:document.querySelector("#stageDescription"),scale:document.querySelector("#stageScale"),distance:document.querySelector("#stageDistance"),
  readout:document.querySelector("#scaleReadout"),journey:document.querySelector("#journeyReadout"),pointer:document.querySelector("#pointerReadout"),lens:document.querySelector("#cursorLens"),
  hint:document.querySelector("#targetHint"),inspector:document.querySelector("#inspector"),inspectorType:document.querySelector("#inspectorType"),inspectorTitle:document.querySelector("#inspectorTitle"),inspectorText:document.querySelector("#inspectorText"),inspectorFacts:document.querySelector("#inspectorFacts"),close:document.querySelector("#inspectorClose"),
  restart:document.querySelector("#restartButton"),helpToggle:document.querySelector("#helpToggle"),help:document.querySelector("#helpPanel"),sound:document.querySelector("#soundToggle")
};

const DPR=Math.min(devicePixelRatio||1,2);
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
let W=innerWidth,H=innerHeight,stageIndex=0,localP=0,lastStage=-1,journeyP=0;
let pointer={x:.5,y:.5,tx:.5,ty:.5,sx:W/2,sy:H/2,inside:false};
let hitAreas=[],hovered=null,pinned=null,activeTransform={zoom:1,alpha:1};
let toastTimer=0,audio=null,soundOn=false,introStageShown=false;

STAGES.forEach((stage,i)=>{
  const spacer=document.createElement("section");
  spacer.className="stage-spacer";
  spacer.dataset.stage=i;
  if(stage.hold)spacer.dataset.hold=stage.hold;
  els.sections.append(spacer);

  const li=document.createElement("li");
  const b=document.createElement("button");
  b.type="button";
  b.innerHTML="<span>"+stage.title+"</span>";
  b.setAttribute("aria-label","Go to "+stage.title);
  b.addEventListener("click",()=>jumpTo(i));
  li.append(b);els.nav.append(li);
});

function rand(seed){const x=Math.sin(seed*999.91)*43758.5453;return x-Math.floor(x)}
const stars=Array.from({length:1000},(_,i)=>({x:rand(i*3.11),y:rand(i*7.73),z:.16+rand(i*11.41)*.84,r:.2+rand(i*17.83)*1.55,h:rand(i*21.71)}));
const galaxies=Array.from({length:175},(_,i)=>({x:rand(i*4.13),y:rand(i*8.21),s:.8+rand(i*2.75)*3.4,a:rand(i*6.42)*Math.PI*2,t:rand(i*19.2)}));
const webNodes=Array.from({length:72},(_,i)=>({x:.04+rand(i*2.4)*.92,y:.04+rand(i*7.1)*.92,r:1+rand(i*9.8)*3.3}));
const localStars=Array.from({length:235},(_,i)=>({x:rand(i*3.8),y:rand(i*9.3),z:.22+rand(i*5.2)*.9,b:rand(i*8.1)}));

function resize(){
  W=innerWidth;H=innerHeight;canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);canvas.style.width=W+"px";canvas.style.height=H+"px";ctx.setTransform(DPR,0,0,DPR,0,0)
}
addEventListener("resize",resize,{passive:true});resize();

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
function rgba(hex,a){const n=parseInt(hex.slice(1),16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`}
function dot(x,y,r,c,a=1){ctx.fillStyle=rgba(c,a);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function line(x1,y1,x2,y2,c,w=1,a=1){ctx.strokeStyle=rgba(c,a);ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function glow(x,y,r,c,a=1){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(c,.52*a));g.addColorStop(.22,rgba(c,.18*a));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function label(text,x,y,a=.5){ctx.font="8px ui-monospace,SFMono-Regular,Menlo,monospace";ctx.fillStyle=`rgba(213,232,255,${a})`;ctx.textAlign="left";ctx.fillText(text,x,y)}

function registerHit(stage,id,x,y,r){
  if(activeTransform.alpha<.36)return;
  const tx=W/2+(x-W/2)*activeTransform.zoom;
  const ty=H/2+(y-H/2)*activeTransform.zoom;
  const obj=STAGES[stage]?.objects.find(o=>o.id===id);
  if(obj)hitAreas.push({stage,obj,x:tx,y:ty,r:Math.max(15,r*activeTransform.zoom),alpha:activeTransform.alpha});
}

function getStageMetrics(){
  const spacers=[...document.querySelectorAll(".stage-spacer")];
  if(!spacers.length)return;
  const probe=scrollY+H*.47;
  let idx=0;
  for(let i=0;i<spacers.length;i++){if(probe>=spacers[i].offsetTop)idx=i;else break}
  idx=Math.min(idx,STAGES.length-1);
  const start=spacers[idx].offsetTop;
  const end=idx<spacers.length-1?spacers[idx+1].offsetTop:start+spacers[idx].offsetHeight;
  stageIndex=idx;
  localP=clamp((probe-start)/Math.max(1,end-start));
  const first=spacers[0].offsetTop,last=spacers.at(-1).offsetTop+spacers.at(-1).offsetHeight-H*.2;
  journeyP=clamp((probe-first)/Math.max(1,last-first));
  els.railFill.style.height=(journeyP*100)+"%";
}

function showStageToast(auto=true){
  clearTimeout(toastTimer);els.toast.classList.add("visible");els.toast.setAttribute("aria-hidden","false");
  if(auto)toastTimer=setTimeout(()=>hideStageToast(),4300);
}
function hideStageToast(){els.toast.classList.remove("visible");els.toast.setAttribute("aria-hidden","true")}

function updateUI(){
  if(stageIndex!==lastStage){
    lastStage=stageIndex;pinned=null;inspect(null);
    const s=STAGES[stageIndex];
    els.num.textContent=String(stageIndex+1).padStart(2,"0")+" / "+String(STAGES.length).padStart(2,"0");
    els.kicker.textContent=s.kicker;els.title.textContent=s.title;els.desc.textContent=s.description;els.scale.textContent=s.scale;els.distance.textContent=s.distance;
    [...els.nav.querySelectorAll("button")].forEach((b,i)=>b.classList.toggle("active",i===stageIndex));
    if(journeyP>0){showStageToast(true);introStageShown=true;}
  }
  if(!introStageShown&&journeyP>0&&stageIndex===0){showStageToast(true);introStageShown=true;}
  const next=STAGES[Math.min(STAGES.length-1,stageIndex+1)];
  const q=smooth(clamp((localP-.48)/.52));
  const exp=lerp(STAGES[stageIndex].exponent,next.exponent,q);
  els.readout.textContent="Scale ~10^"+exp.toFixed(exp%1?.1:0)+" m";
  els.journey.textContent=STAGES[stageIndex].title;
}

function drawBackdrop(time,fadeStars=1){
  ctx.fillStyle="#01030a";ctx.fillRect(0,0,W,H);
  const mx=(pointer.x-.5)*26,my=(pointer.y-.5)*20;
  for(const s of stars){
    const tw=.57+.3*Math.sin(time*.0014+s.h*21),x=s.x*W+mx*s.z,y=s.y*H+my*s.z;
    dot(x,y,s.r*s.z,s.h>.87?PALETTE.cyan:PALETTE.ink,(.11+.43*s.z)*tw*fadeStars);
  }
  const g=ctx.createRadialGradient(W*.5,H*.48,0,W*.5,H*.48,Math.max(W,H)*.72);g.addColorStop(0,"rgba(35,54,95,.07)");g.addColorStop(.72,"rgba(8,12,28,.018)");g.addColorStop(1,"rgba(0,0,0,.4)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H)
}

function withScene(alpha,zoom,fn){
  const old=activeTransform;activeTransform={alpha,zoom};ctx.save();ctx.globalAlpha=alpha;ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H/2);fn();ctx.restore();activeTransform=old
}

function galaxy(x,y,r,rot,alpha=1,blue=PALETTE.blue){
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(1,.38);glow(0,0,r*.72,blue,.42*alpha);glow(0,0,r*.21,PALETTE.gold,.52*alpha);ctx.globalCompositeOperation="screen";
  for(let arm=0;arm<2;arm++)for(let i=0;i<190;i++){const q=i/190,ang=arm*Math.PI+q*9.2+(rand(i+arm*401)-.5)*.38,rr=q*r*(.78+rand(i*2.7)*.34);dot(Math.cos(ang)*rr,Math.sin(ang)*rr,.35+rand(i*7)*1.25,rand(i*5)>.84?PALETTE.cyan:PALETTE.ink,(1-q)*.47*alpha)}
  ctx.globalCompositeOperation="source-over";ctx.restore()
}

function drawHorizon(time,s){
  const cx=W*.5+(pointer.x-.5)*14,cy=H*.49+(pointer.y-.5)*10,R=Math.min(W,H)*.36;glow(cx,cy,R*1.55,PALETTE.violet,.2);
  ctx.save();ctx.translate(cx,cy);
  for(const g of galaxies){const rr=(.12+g.t*.88)*R,ang=g.a+time*.000006*(g.t-.5),x=Math.cos(ang)*rr,y=Math.sin(ang)*rr*.72;ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(1,.35+.4*g.t);glow(0,0,10*g.s,g.t>.7?PALETTE.violet:PALETTE.blue,.34);dot(0,0,.42*g.s,PALETTE.ink,.65);ctx.restore()}
  for(let k=0;k<5;k++){ctx.strokeStyle=`rgba(170,209,255,${.12-k*.012})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,R*(1-k*.07),R*.72*(1-k*.07),0,0,Math.PI*2);ctx.stroke()}ctx.restore();
  const hx=cx,hy=cy-R*.72;registerHit(s,"horizon",hx,hy,26);registerHit(s,"cmb",cx-R*.55,cy-R*.22,30);registerHit(s,"web",cx+R*.48,cy+R*.18,34);label("COSMIC HORIZON — OBSERVABLE LIMIT",cx-R*.42,cy-R*.82,.42)
}

function drawWeb(time,s){
  const mx=(pointer.x-.5)*34,my=(pointer.y-.5)*28;
  for(let i=0;i<webNodes.length;i++){
    const a=webNodes[i],ax=a.x*W+mx*(a.x-.5),ay=a.y*H+my*(a.y-.5);
    for(let j=i+1;j<webNodes.length;j++){const b=webNodes[j],dx=(a.x-b.x)*W,dy=(a.y-b.y)*H,d=Math.hypot(dx,dy),lim=Math.min(W,H)*.17;if(d<lim)line(ax,ay,b.x*W+mx*(b.x-.5),b.y*H+my*(b.y-.5),PALETTE.blue,.55,clamp(1-d/lim)*.28)}
    glow(ax,ay,16+a.r*4,PALETTE.violet,.16);dot(ax,ay,a.r,PALETTE.cyan,.48)
  }
  const node={x:W*.63,y:H*.44},voidC={x:W*.28,y:H*.66},fil={x:W*.47,y:H*.52};glow(node.x,node.y,62,PALETTE.violet,.28);registerHit(s,"node",node.x,node.y,34);registerHit(s,"void",voidC.x,voidC.y,48);registerHit(s,"filament",fil.x,fil.y,30)
}

function drawLaniakea(time,s){
  const cx=W*.59+(pointer.x-.5)*24,cy=H*.51+(pointer.y-.5)*17;glow(cx,cy,170,PALETTE.violet,.2);
  for(let i=0;i<190;i++){const a=rand(i*4.3)*Math.PI*2,rad=46+rand(i*9.4)*Math.min(W,H)*.52,sx=cx+Math.cos(a)*rad,sy=cy+Math.sin(a)*rad*.72,bend=(rand(i*2.1)-.5)*150;ctx.strokeStyle=rgba(i%3?PALETTE.blue:PALETTE.cyan,.055+rand(i*8.8)*.13);ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo((sx+cx)/2+bend,(sy+cy)/2-bend*.33,cx+(rand(i)-.5)*36,cy+(rand(i*6)-.5)*24);ctx.stroke()}
  dot(cx,cy,4,PALETTE.ink,.9);glow(cx,cy,46,PALETTE.cyan,.3);registerHit(s,"attractor",cx,cy,40);registerHit(s,"laniakea",W*.42,H*.38,42);label("GALAXY FLOW",cx+20,cy-18,.45)
}

function drawLocalSheet(time,s){
  const cx=W*.5,cy=H*.52;ctx.save();ctx.translate(cx,cy);ctx.rotate(-.13);ctx.scale(1,.35);glow(0,0,Math.min(W,H)*.48,PALETTE.blue,.08);ctx.strokeStyle="rgba(133,191,255,.12)";ctx.lineWidth=1;for(let r=70;r<Math.min(W,H)*.46;r+=55){ctx.beginPath();ctx.ellipse(0,0,r,r*.95,0,0,Math.PI*2);ctx.stroke()}ctx.restore();
  const vx=W*.69,vy=H*.35;galaxy(vx,vy,Math.min(W,H)*.12,.2,.75,PALETTE.violet);glow(vx,vy,75,PALETTE.violet,.16);registerHit(s,"virgo",vx,vy,42);registerHit(s,"local-sheet",W*.46,H*.59,50);for(let i=0;i<40;i++){const x=.2*W+rand(i*6)*.6*W,y=.36*H+rand(i*9)*.35*H;dot(x,y,1+rand(i)*1.5,PALETTE.ink,.42)}
}

function drawLocalGroup(time,s){
  const mw={x:W*.37,y:H*.59},an={x:W*.70,y:H*.37},tr={x:W*.62,y:H*.68};galaxy(mw.x,mw.y,Math.min(W,H)*.23,-.18,1);galaxy(an.x,an.y,Math.min(W,H)*.19,.29,.88,PALETTE.violet);galaxy(tr.x,tr.y,Math.min(W,H)*.085,.12,.55,PALETTE.blue);
  registerHit(s,"milkyway",mw.x,mw.y,46);registerHit(s,"andromeda",an.x,an.y,44);registerHit(s,"triangulum",tr.x,tr.y,30);line(mw.x+25,mw.y-12,an.x-26,an.y+18,PALETTE.cyan,.6,.14);
  for(let i=0;i<24;i++){const x=rand(i*4)*W,y=rand(i*9)*H;glow(x,y,8+rand(i)*15,PALETTE.blue,.12);dot(x,y,1,PALETTE.ink,.45)}
}

function drawMilkyWay(time,s){
  const x=W*.50+(pointer.x-.5)*13,y=H*.49+(pointer.y-.5)*8,r=Math.min(W,H)*.42;galaxy(x,y,r,-.14,1);
  ctx.save();ctx.translate(x,y);ctx.rotate(-.14);ctx.scale(1,.38);ctx.strokeStyle="rgba(125,190,255,.22)";ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(0,0,r*.58,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);const ox=Math.cos(.25)*r*.58,oy=Math.sin(.25)*r*.58;glow(ox,oy,31,PALETTE.cyan,.52);dot(ox,oy,3,PALETTE.ink,1);ctx.restore();
  const orionX=x+Math.cos(-.14)*Math.cos(.25)*r*.58-Math.sin(-.14)*Math.sin(.25)*r*.58*.38;const orionY=y+Math.sin(-.14)*Math.cos(.25)*r*.58+Math.cos(-.14)*Math.sin(.25)*r*.58*.38;
  registerHit(s,"sgr",x,y,31);registerHit(s,"orion",orionX,orionY,32);registerHit(s,"perseus",x+r*.24,y-r*.10,34);label("YOU ARE HERE",orionX+13,orionY-12,.58)
}

function drawNeighborhood(time,s){
  const px=(pointer.x-.5)*40,py=(pointer.y-.5)*30;
  for(let i=0;i<localStars.length;i++){const st=localStars[i],depth=.28+st.z, x=(st.x-.5)*W*1.15/depth+W*.5+px*depth,y=(st.y-.5)*H*1.15/depth+H*.5+py*depth;if(x<0||x>W||y<0||y>H)continue;const bright=st.b>.91;glow(x,y,(bright?16:6)*st.z,bright?PALETTE.cyan:PALETTE.blue,.14);dot(x,y,(bright?2:1)*st.z,bright?PALETTE.cyan:PALETTE.ink,.45+.35*st.z)}
  const sun={x:W*.51,y:H*.52},sirius={x:W*.72,y:H*.32},proxima={x:W*.29,y:H*.66};glow(sun.x,sun.y,58,PALETTE.gold,.46);dot(sun.x,sun.y,5.8,"#fff2bf",1);glow(sirius.x,sirius.y,32,PALETTE.cyan,.36);dot(sirius.x,sirius.y,3.2,"#e9fbff",1);glow(proxima.x,proxima.y,24,PALETTE.red,.30);dot(proxima.x,proxima.y,2.6,"#ffac95",1);registerHit(s,"sun",sun.x,sun.y,31);registerHit(s,"sirius",sirius.x,sirius.y,27);registerHit(s,"proxima",proxima.x,proxima.y,27)
}

function drawOort(time,s){
  const cx=W*.5,cy=H*.5,R=Math.min(W,H)*.42;glow(cx,cy,70,PALETTE.gold,.35);dot(cx,cy,5,"#fff2bf",1);
  for(let i=0;i<620;i++){const u=rand(i*3.3),a=rand(i*7.1)*Math.PI*2,rr=R*(.52+u*.48),flatten=.78+rand(i*2)*.2,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*flatten;dot(x,y,.35+rand(i)*.8,rand(i*9)>.8?PALETTE.cyan:PALETTE.ink,.12+rand(i*4)*.28)}
  ctx.strokeStyle="rgba(145,201,255,.10)";ctx.beginPath();ctx.arc(cx,cy,R*.50,0,Math.PI*2);ctx.stroke();registerHit(s,"sun",cx,cy,27);registerHit(s,"oort",cx+R*.72,cy-R*.20,42);label("PLANETS ARE STILL TINY HERE",cx+15,cy+22,.38)
}

const outerPlanets=[
  {id:"jupiter",name:"Jupiter",r:.42,size:10.8,c:"#d2aa80",speed:.46,phase:1.5},
  {id:"saturn",name:"Saturn",r:.57,size:9.5,c:"#e5ca8d",speed:.34,phase:3.0},
  {id:"uranus",name:"Uranus",r:.72,size:6.8,c:"#9ad8df",speed:.24,phase:4.7},
  {id:"neptune",name:"Neptune",r:.88,size:6.5,c:"#5a7bdc",speed:.19,phase:5.6}
];
function drawOuterSolar(time,s){
  const cx=W*.5,cy=H*.5,R=Math.min(W,H)*.47;glow(cx,cy,92,PALETTE.gold,.5);dot(cx,cy,13,"#fff2ba",1);registerHit(s,"sun",cx,cy,31);
  outerPlanets.forEach((p,i)=>{const or=p.r*R;ctx.strokeStyle="rgba(181,207,237,.10)";ctx.beginPath();ctx.ellipse(cx,cy,or,or*.44,-.05,0,Math.PI*2);ctx.stroke();const a=p.phase+time*.00002*p.speed,x=cx+Math.cos(a)*or,y=cy+Math.sin(a)*or*.44;glow(x,y,p.size*3,p.c,.23);dot(x,y,p.size,p.c,1);if(p.id==="saturn"){ctx.strokeStyle="rgba(245,225,181,.65)";ctx.beginPath();ctx.ellipse(x,y,p.size*1.8,p.size*.58,-.25,0,Math.PI*2);ctx.stroke()}if(["jupiter","saturn","neptune"].includes(p.id))registerHit(s,p.id,x,y,p.size+17)});
}

const innerPlanets=[
  {id:"mercury",r:.19,size:4,c:"#b9b2a7",speed:1.6,phase:4.1},
  {id:"venus",r:.31,size:6,c:"#d9b67b",speed:1.2,phase:2.5},
  {id:"earth",r:.44,size:6.6,c:"#5fa8ff",speed:1,phase:5.5},
  {id:"mars",r:.59,size:5,c:"#c97253",speed:.8,phase:1.6}
];
function drawInnerSolar(time,s){
  const cx=W*.39,cy=H*.53,R=Math.min(W,H)*.66;glow(cx,cy,120,PALETTE.gold,.58);dot(cx,cy,19,"#fff1b6",1);
  innerPlanets.forEach(p=>{const or=p.r*R;ctx.strokeStyle="rgba(181,207,237,.13)";ctx.beginPath();ctx.ellipse(cx,cy,or,or*.42,-.05,0,Math.PI*2);ctx.stroke();const a=p.phase+time*.000025*p.speed,x=cx+Math.cos(a)*or,y=cy+Math.sin(a)*or*.42;glow(x,y,p.size*3.2,p.c,.25);dot(x,y,p.size,p.c,1);registerHit(s,p.id,x,y,p.size+18);if(p.id==="earth")label("EARTH — DESCENT TARGET",x+11,y-10,.62)});
}

function drawEarthMoon(time,s){
  const cx=W*.44+(pointer.x-.5)*10,cy=H*.52+(pointer.y-.5)*7,R=Math.min(W,H)*.15;drawEarthGlobe(cx,cy,R,time,.95);const orbit=R*3.05;ctx.strokeStyle="rgba(180,213,245,.13)";ctx.setLineDash([3,7]);ctx.beginPath();ctx.ellipse(cx,cy,orbit,orbit*.54,-.06,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);const a=2.3+time*.000035,mx=cx+Math.cos(a)*orbit,my=cy+Math.sin(a)*orbit*.54;glow(mx,my,24,"#d8dde5",.20);drawMoon(mx,my,R*.27);registerHit(s,"earth",cx,cy,R*.85);registerHit(s,"moon",mx,my,R*.32)
}

function drawEarthGlobe(cx,cy,R,time,detail=1){
  glow(cx,cy,R*1.32,PALETTE.blue,.28);ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();const ocean=ctx.createRadialGradient(cx-R*.35,cy-R*.35,R*.05,cx,cy,R*1.22);ocean.addColorStop(0,"#5aa4d4");ocean.addColorStop(.44,"#165782");ocean.addColorStop(1,"#061a35");ctx.fillStyle=ocean;ctx.fillRect(cx-R,cy-R,R*2,R*2);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.08);ctx.fillStyle="rgba(74,124,86,.95)";const phase=Math.sin(time*.00001)*.025;const land=[[-.42+phase,-.28,.28,.16,-.35],[-.18+phase,.02,.20,.31,.12],[.16+phase,-.23,.34,.18,-.18],[.31+phase,.08,.27,.22,.22],[.36+phase,.33,.13,.08,.1]];for(const c of land){ctx.beginPath();ctx.ellipse(c[0]*R,c[1]*R,c[2]*R,c[3]*R,c[4],0,Math.PI*2);ctx.fill()}ctx.fillStyle="rgba(230,240,241,.19)";for(let i=0;i<26*detail;i++){const a=rand(i*3)*Math.PI*2,rr=rand(i*7)*R*.86;ctx.beginPath();ctx.ellipse(Math.cos(a)*rr,Math.sin(a)*rr*.72,8+rand(i)*R*.18,2+rand(i*8)*R*.04,a,0,Math.PI*2);ctx.fill()}ctx.restore();
  const night=ctx.createLinearGradient(cx-R*.2,0,cx+R*.95,0);night.addColorStop(0,"rgba(0,0,0,0)");night.addColorStop(.58,"rgba(0,0,8,.18)");night.addColorStop(1,"rgba(0,0,7,.90)");ctx.fillStyle=night;ctx.fillRect(cx-R,cy-R,R*2,R*2);ctx.restore();ctx.strokeStyle="rgba(151,223,255,.72)";ctx.lineWidth=Math.max(1.2,R*.012);ctx.beginPath();ctx.arc(cx,cy,R+1.5,0,Math.PI*2);ctx.stroke();glow(cx-R*.18,cy-R*.22,R*.72,PALETTE.cyan,.07)
}
function drawMoon(x,y,R){const g=ctx.createRadialGradient(x-R*.35,y-R*.35,1,x,y,R);g.addColorStop(0,"#eceff1");g.addColorStop(.65,"#aeb4ba");g.addColorStop(1,"#666d75");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(65,70,76,.24)";for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(x+(rand(i*5)-.5)*R*1.2,y+(rand(i*8)-.5)*R*1.2,R*(.05+rand(i*2)*.12),0,Math.PI*2);ctx.fill()}}

function drawEarth(time,s){
  const R=Math.min(W,H)*.36,cx=W*.5+(pointer.x-.5)*15,cy=H*.51+(pointer.y-.5)*10;drawEarthGlobe(cx,cy,R,time,1.25);registerHit(s,"earth",cx,cy,R*.82);registerHit(s,"atmosphere",cx-R*.70,cy-R*.46,32);registerHit(s,"ocean",cx+R*.20,cy+R*.24,42);label("ATMOSPHERIC LIMB",cx-R*.88,cy-R*.55,.47)
}

function drawOrbit(time,s){
  const horizonY=H*.73,R=Math.max(W,H)*1.15,cx=W*.5,cy=horizonY+R*.83;const g=ctx.createRadialGradient(cx,cy-R*.66,R*.05,cx,cy,R);g.addColorStop(0,"#2f75a3");g.addColorStop(.56,"#0b3b65");g.addColorStop(1,"#03101f");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,Math.PI,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(124,214,255,.82)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,R,Math.PI*1.06,Math.PI*1.94);ctx.stroke();glow(W*.5,horizonY-6,W*.75,PALETTE.cyan,.08);registerHit(s,"limb",W*.50,horizonY,52);registerHit(s,"airglow",W*.72,horizonY-20,38);label("LOW EARTH ORBIT",W*.08,H*.80,.5)
}

function drawAtmosphere(time,s){
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#020915");sky.addColorStop(.30,"#071a32");sky.addColorStop(.58,"#1e5e91");sky.addColorStop(.78,"#78b6d7");sky.addColorStop(1,"#d6e6ed");ctx.globalAlpha=.96;ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;
  const horizon=H*.77;const earth=ctx.createLinearGradient(0,horizon,0,H);earth.addColorStop(0,"#315b6e");earth.addColorStop(1,"#07141c");ctx.fillStyle=earth;ctx.fillRect(0,horizon,W,H-horizon);
  ctx.fillStyle="rgba(239,247,250,.55)";for(let i=0;i<24;i++){const x=rand(i*5.2)*W,y=H*(.57+rand(i*7.8)*.22),rw=40+rand(i*2.1)*130,rh=5+rand(i*9.1)*22;ctx.beginPath();ctx.ellipse(x,y,rw,rh,rand(i)*.3,0,Math.PI*2);ctx.fill()}
  const kx=W*.72,ky=H*.28;line(kx-70,ky,kx+70,ky,PALETTE.cyan,1,.28);label("100 km — KÁRMÁN LINE (CONVENTION)",kx-66,ky-9,.46);registerHit(s,"karman",kx,ky,38);registerHit(s,"troposphere",W*.29,H*.67,50);registerHit(s,"clouds",W*.61,H*.67,50)
}

function drawSurface(time,s){
  const sky=ctx.createLinearGradient(0,0,0,H*.66);sky.addColorStop(0,"#0e4a78");sky.addColorStop(.62,"#67a8ce");sky.addColorStop(1,"#d6e8ef");ctx.fillStyle=sky;ctx.fillRect(0,0,W,H*.69);const horizon=H*.62;
  const sea=ctx.createLinearGradient(0,horizon,0,H);sea.addColorStop(0,"#2d7693");sea.addColorStop(.35,"#13506f");sea.addColorStop(1,"#061b2b");ctx.fillStyle=sea;ctx.fillRect(0,horizon,W,H-horizon);
  ctx.strokeStyle="rgba(235,250,255,.22)";for(let i=0;i<34;i++){const y=horizon+12+i*(H-horizon)/35;ctx.beginPath();for(let x=0;x<=W;x+=28){const wave=Math.sin(x*.018+i*1.6+time*.0005)*2.5*(i/34);ctx.lineTo(x,y+wave)}ctx.stroke()}
  ctx.fillStyle="rgba(250,252,255,.82)";for(let i=0;i<12;i++){const x=rand(i*6)*W,y=H*(.18+rand(i*9)*.28),rw=35+rand(i*2)*110,rh=8+rand(i*11)*22;ctx.beginPath();ctx.ellipse(x,y,rw,rh,0,0,Math.PI*2);ctx.fill()}
  glow(W*.83,H*.19,70,PALETTE.gold,.35);dot(W*.83,H*.19,18,"#fff4c3",1);registerHit(s,"ocean",W*.36,H*.78,56);registerHit(s,"cloud",W*.53,H*.32,46);registerHit(s,"horizon",W*.52,horizon,54);label("HOME — HUMAN SCALE",W*.06,H*.90,.56)
}

const sceneFns=[drawHorizon,drawWeb,drawLaniakea,drawLocalSheet,drawLocalGroup,drawMilkyWay,drawNeighborhood,drawOort,drawOuterSolar,drawInnerSolar,drawEarthMoon,drawEarth,drawOrbit,drawAtmosphere,drawSurface];

function renderScene(index,time,alpha,zoom){withScene(alpha,zoom,()=>sceneFns[index]?.(time,index))}

function drawTargetRings(){
  for(const h of hitAreas){const active=(hovered?.obj===h.obj)||(pinned===h.obj);ctx.strokeStyle=active?"rgba(198,244,255,.88)":"rgba(166,214,255,.13)";ctx.lineWidth=active?1.35:.75;ctx.beginPath();ctx.arc(h.x,h.y,active?h.r+7:h.r,0,Math.PI*2);ctx.stroke();if(active){ctx.strokeStyle="rgba(188,236,255,.28)";ctx.beginPath();ctx.arc(h.x,h.y,h.r+14,0,Math.PI*2);ctx.stroke()}}
}

function hitTest(){
  let best=null,bestD=Infinity;
  for(const h of hitAreas){const d=Math.hypot(pointer.sx-h.x,pointer.sy-h.y);if(d<h.r+14&&d<bestD){best=h;bestD=d}}
  hovered=best;canvas.style.cursor=best?"pointer":"default";els.lens.classList.toggle("active",!!best);
  if(best&&!pinned){const o=best.obj;els.hint.hidden=false;els.hint.querySelector(".hint-type").textContent=o.type;els.hint.querySelector(".hint-name").textContent=o.name;els.hint.querySelector(".hint-summary").textContent=o.summary;const pad=16,tw=230,th=125;let x=pointer.sx+18,y=pointer.sy+18;if(x+tw>W-pad)x=pointer.sx-tw-18;if(y+th>H-pad)y=pointer.sy-th-18;els.hint.style.transform=`translate(${Math.max(pad,x)}px,${Math.max(pad,y)}px)`}else els.hint.hidden=true
}

function inspect(o){
  pinned=o||null;
  if(!o){els.inspector.classList.remove("open");els.inspector.setAttribute("aria-hidden","true");return}
  els.inspectorType.textContent=o.type;els.inspectorTitle.textContent=o.name;els.inspectorText.textContent=o.text;
  els.inspectorFacts.replaceChildren(...o.facts.map(([k,v])=>{const d=document.createElement("div"),dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=k;dd.textContent=v;d.append(dt,dd);return d}));
  els.inspector.classList.add("open");els.inspector.setAttribute("aria-hidden","false");hideStageToast()
}

function frame(time){
  getStageMetrics();updateUI();pointer.x=lerp(pointer.x,pointer.tx,reduced?1:.055);pointer.y=lerp(pointer.y,pointer.ty,reduced?1:.055);
  const surfaceFade=stageIndex>=13?clamp(1-(stageIndex-13+localP)*.65):1;drawBackdrop(time,surfaceFade);hitAreas=[];
  const q=smooth(clamp((localP-.50)/.50));const next=Math.min(STAGES.length-1,stageIndex+1);
  if(next===stageIndex){renderScene(stageIndex,time,1,1)}else{renderScene(stageIndex,time,1-q,1+q*.92);renderScene(next,time,q,.46+q*.54)}
  drawTargetRings();hitTest();requestAnimationFrame(frame)
}
requestAnimationFrame(frame);

addEventListener("pointermove",e=>{
  pointer.sx=e.clientX;pointer.sy=e.clientY;pointer.tx=e.clientX/W;pointer.ty=e.clientY/H;pointer.inside=true;els.lens.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;
  const ra=((pointer.tx*24+24)%24).toFixed(1),dec=((.5-pointer.ty)*180).toFixed(1);els.pointer.textContent=`RA ${ra}h / DEC ${dec}°`
},{passive:true});
addEventListener("pointerleave",()=>{pointer.inside=false;els.lens.style.opacity=0});addEventListener("pointerenter",()=>{els.lens.style.opacity=.7});
canvas.addEventListener("click",()=>{if(hovered)inspect(hovered.obj)});
els.close.addEventListener("click",()=>inspect(null));els.toastClose.addEventListener("click",hideStageToast);els.stageInfo.addEventListener("click",()=>showStageToast(false));
els.helpToggle.addEventListener("click",()=>{const open=els.help.hidden;els.help.hidden=!open;els.helpToggle.setAttribute("aria-expanded",String(open))});
els.restart.addEventListener("click",()=>scrollTo({top:0,behavior:reduced?"auto":"smooth"}));

function jumpTo(i){const el=document.querySelector(`.stage-spacer[data-stage="${i}"]`);if(el)scrollTo({top:el.offsetTop-H*.24,behavior:reduced?"auto":"smooth"})}
addEventListener("keydown",e=>{
  if(e.key==="Escape")inspect(null);
  if(["ArrowDown","PageDown"].includes(e.key)){e.preventDefault();jumpTo(Math.min(STAGES.length-1,stageIndex+1))}
  if(["ArrowUp","PageUp"].includes(e.key)){e.preventDefault();jumpTo(Math.max(0,stageIndex-1))}
  if(e.key==="Home"){e.preventDefault();scrollTo({top:0,behavior:reduced?"auto":"smooth"})}
  if(e.key==="End"){e.preventDefault();jumpTo(STAGES.length-1)}
});

function initSound(){
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audio=new AC();const osc=audio.createOscillator(),gain=audio.createGain(),lfo=audio.createOscillator(),lg=audio.createGain();osc.type="sine";osc.frequency.value=48;lfo.frequency.value=.055;lg.gain.value=7;gain.gain.value=.0001;lfo.connect(lg).connect(osc.frequency);osc.connect(gain).connect(audio.destination);osc.start();lfo.start();audio._gain=gain
}
els.sound.addEventListener("click",async()=>{if(!audio)initSound();if(!audio)return;if(audio.state==="suspended")await audio.resume();soundOn=!soundOn;audio._gain.gain.cancelScheduledValues(audio.currentTime);audio._gain.gain.linearRampToValueAtTime(soundOn ? .015 : .0001,audio.currentTime+.7);els.sound.setAttribute("aria-pressed",String(soundOn))});
