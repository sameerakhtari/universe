import { STAGES, PALETTE } from "./universe-data.js";

const canvas=document.querySelector("#universe");
const ctx=canvas.getContext("2d",{alpha:false});
const els={
  sections:document.querySelector("#stageSections"),
  nav:document.querySelector("#stageNav"),
  railFill:document.querySelector("#railFill"),
  card:document.querySelector("#stageCard"),
  num:document.querySelector("#stageNumber"),
  kicker:document.querySelector("#stageKicker"),
  title:document.querySelector("#stageTitle"),
  desc:document.querySelector("#stageDescription"),
  scale:document.querySelector("#stageScale"),
  distance:document.querySelector("#stageDistance"),
  readout:document.querySelector("#scaleReadout"),
  pointer:document.querySelector("#pointerReadout"),
  hint:document.querySelector("#targetHint"),
  inspector:document.querySelector("#inspector"),
  inspectorType:document.querySelector("#inspectorType"),
  inspectorTitle:document.querySelector("#inspectorTitle"),
  inspectorText:document.querySelector("#inspectorText"),
  inspectorFacts:document.querySelector("#inspectorFacts"),
  close:document.querySelector("#inspectorClose"),
  restart:document.querySelector("#restartButton"),
  helpToggle:document.querySelector("#helpToggle"),
  help:document.querySelector("#helpPanel"),
  sound:document.querySelector("#soundToggle")
};

const DPR=Math.min(devicePixelRatio||1,2);
let W=innerWidth,H=innerHeight,scrollP=0,stageIndex=0,localP=0,lastStage=-1,hovered=null,pinned=null;
let pointer={x:.5,y:.5,sx:innerWidth/2,sy:innerHeight/2,tx:.5,ty:.5};
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
let audio=null,soundOn=false;

for(let i=0;i<STAGES.length;i++){
  const spacer=document.createElement("section");
  spacer.className="stage-spacer";
  spacer.dataset.stage=i;
  els.sections.append(spacer);

  const li=document.createElement("li");
  const b=document.createElement("button");
  b.type="button";
  b.innerHTML="<span>"+STAGES[i].title+"</span>";
  b.setAttribute("aria-label","Go to "+STAGES[i].title);
  b.addEventListener("click",()=>jumpTo(i));
  li.append(b);
  els.nav.append(li);
}

function rand(seed){
  const x=Math.sin(seed*999.91)*43758.5453;
  return x-Math.floor(x);
}
const stars=Array.from({length:760},(_,i)=>({
  x:rand(i*3.1),y:rand(i*7.7),z:.25+rand(i*11.4)*.75,r:.25+rand(i*17.8)*1.6,h:rand(i*21.7)
}));
const galaxies=Array.from({length:120},(_,i)=>({
  x:rand(i*4.13),y:rand(i*8.21),s:1+rand(i*2.75)*3.2,a:rand(i*6.42)*Math.PI,t:rand(i*19.2)
}));
const webNodes=Array.from({length:58},(_,i)=>({
  x:.05+rand(i*2.4)*.9,y:.05+rand(i*7.1)*.9,r:1+rand(i*9.8)*3
}));

function resize(){
  W=innerWidth;H=innerHeight;
  canvas.width=Math.round(W*DPR);
  canvas.height=Math.round(H*DPR);
  canvas.style.width=W+"px";
  canvas.style.height=H+"px";
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener("resize",resize,{passive:true});
resize();

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t*t*(3-2*t);

function rgba(hex,a){
  const n=parseInt(hex.slice(1),16);
  return "rgba("+((n>>16)&255)+","+((n>>8)&255)+","+(n&255)+","+a+")";
}
function glow(x,y,r,c,a=1){
  const g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(c,.5*a));
  g.addColorStop(.25,rgba(c,.18*a));
  g.addColorStop(1,rgba(c,0));
  ctx.fillStyle=g;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
}
function line(x1,y1,x2,y2,c,w=1,a=1){
  ctx.strokeStyle=rgba(c,a);
  ctx.lineWidth=w;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}
function dot(x,y,r,c,a=1){
  ctx.fillStyle=rgba(c,a);
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
}

function currentMetrics(){
  const total=Math.max(1,document.documentElement.scrollHeight-H);
  scrollP=clamp(scrollY/total);
  const journeyStart=.08;
  const journeyEnd=.89;
  const jp=clamp((scrollP-journeyStart)/(journeyEnd-journeyStart));
  const exact=jp*(STAGES.length-1);
  stageIndex=Math.min(STAGES.length-1,Math.floor(exact+.0001));
  localP=exact-stageIndex;
  els.railFill.style.height=(jp*100)+"%";
}

function updateUI(){
  if(stageIndex!==lastStage){
    const s=STAGES[stageIndex];
    lastStage=stageIndex;
    els.num.textContent=String(stageIndex+1).padStart(2,"0");
    els.kicker.textContent=s.kicker;
    els.title.textContent=s.title;
    els.desc.textContent=s.description;
    els.scale.textContent=s.scale;
    els.distance.textContent=s.distance;
    [...els.nav.querySelectorAll("button")].forEach((b,i)=>b.classList.toggle("active",i===stageIndex));
    if(!pinned) els.inspector.classList.remove("open");
  }

  const next=STAGES[Math.min(STAGES.length-1,stageIndex+1)];
  const e=Math.round(lerp(STAGES[stageIndex].exponent,next.exponent,ease(localP)));
  els.readout.textContent="Scale ~10^"+e+" m";

  const fade=scrollP<.07||scrollP>.94?0:1;
  els.card.style.opacity=fade;
  els.card.style.transform="translateY("+((1-fade)*16)+"px)";
}

function drawBackdrop(time){
  ctx.fillStyle="#02040b";
  ctx.fillRect(0,0,W,H);

  const mx=(pointer.x-.5)*22;
  const my=(pointer.y-.5)*18;

  for(const s of stars){
    const tw=.55+.35*Math.sin(time*.0015+s.h*20);
    const x=s.x*W+mx*s.z;
    const y=s.y*H+my*s.z;
    dot(x,y,s.r*s.z,s.h>.84?PALETTE.cyan:PALETTE.ink,(.15+.42*s.z)*tw);
  }

  const g=ctx.createRadialGradient(W*.5,H*.47,0,W*.5,H*.47,Math.max(W,H)*.68);
  g.addColorStop(0,"rgba(34,52,91,.08)");
  g.addColorStop(.7,"rgba(8,12,28,.02)");
  g.addColorStop(1,"rgba(0,0,0,.34)");
  ctx.fillStyle=g;
  ctx.fillRect(0,0,W,H);
}

function withScene(alpha,zoom,fn){
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.translate(W/2,H/2);
  ctx.scale(zoom,zoom);
  ctx.translate(-W/2,-H/2);
  fn();
  ctx.restore();
}

function drawObservable(time){
  const cx=W*.5+(pointer.x-.5)*16;
  const cy=H*.48+(pointer.y-.5)*12;
  const R=Math.min(W,H)*.34;

  glow(cx,cy,R*1.5,PALETTE.violet,.22);

  ctx.save();
  ctx.translate(cx,cy);
  for(const g of galaxies){
    const rr=(.15+g.t*.85)*R;
    const ang=g.a+time*.000008*(g.t-.5);
    const x=Math.cos(ang)*rr;
    const y=Math.sin(ang)*rr*.72;
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(ang);
    ctx.scale(1,.35+.4*g.t);
    glow(0,0,12*g.s,g.t>.72?PALETTE.violet:PALETTE.blue,.34);
    dot(0,0,.45*g.s,PALETTE.ink,.65);
    ctx.restore();
  }

  ctx.strokeStyle="rgba(170,209,255,.13)";
  ctx.lineWidth=1;
  for(let k=0;k<4;k++){
    ctx.beginPath();
    ctx.ellipse(0,0,R*(1-k*.085),R*.72*(1-k*.085),0,0,Math.PI*2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle="rgba(220,240,255,.42)";
  ctx.font="9px ui-monospace,monospace";
  ctx.textAlign="center";
  ctx.fillText("COSMIC HORIZON · NOT A PHYSICAL EDGE",cx,cy-R*.82);
}

function drawWeb(){
  const mx=(pointer.x-.5)*28;
  const my=(pointer.y-.5)*22;

  for(let i=0;i<webNodes.length;i++){
    const a=webNodes[i];
    const ax=a.x*W+mx*(a.x-.5);
    const ay=a.y*H+my*(a.y-.5);

    for(let j=i+1;j<webNodes.length;j++){
      const b=webNodes[j];
      const dx=(a.x-b.x)*W;
      const dy=(a.y-b.y)*H;
      const d=Math.hypot(dx,dy);
      const limit=Math.min(W,H)*.19;

      if(d<limit){
        line(ax,ay,b.x*W+mx*(b.x-.5),b.y*H+my*(b.y-.5),PALETTE.blue,.6,clamp(1-d/limit)*.24);
      }
    }
    glow(ax,ay,18+a.r*4,PALETTE.violet,.18);
    dot(ax,ay,a.r,PALETTE.cyan,.52);
  }

  const x=W*.26,y=H*.65;
  ctx.strokeStyle="rgba(154,190,255,.07)";
  ctx.lineWidth=1;
  for(let r=35;r<Math.min(W,H)*.22;r+=27){
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.stroke();
  }
}

function drawLaniakea(){
  const cx=W*.58+(pointer.x-.5)*22;
  const cy=H*.52+(pointer.y-.5)*18;
  glow(cx,cy,150,PALETTE.violet,.22);

  ctx.lineWidth=1;
  for(let i=0;i<150;i++){
    const a=rand(i*4.3)*Math.PI*2;
    const rad=50+rand(i*9.4)*Math.min(W,H)*.48;
    const sx=cx+Math.cos(a)*rad;
    const sy=cy+Math.sin(a)*rad*.72;
    const bend=(rand(i*2.1)-.5)*130;

    ctx.strokeStyle=rgba(i%3?PALETTE.blue:PALETTE.cyan,.07+rand(i*8.8)*.12);
    ctx.beginPath();
    ctx.moveTo(sx,sy);
    ctx.quadraticCurveTo((sx+cx)/2+bend,(sy+cy)/2-bend*.35,cx+(rand(i)-.5)*34,cy+(rand(i*6)-.5)*22);
    ctx.stroke();
  }

  dot(cx,cy,4,PALETTE.ink,.8);
  glow(cx,cy,40,PALETTE.cyan,.3);
  ctx.font="9px ui-monospace,monospace";
  ctx.fillStyle="rgba(210,232,255,.46)";
  ctx.fillText("FLOW → GREAT ATTRACTOR REGION",cx+17,cy-14);
}

function galaxy(x,y,r,rot,alpha=1,blue=PALETTE.blue){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.scale(1,.38);

  glow(0,0,r*.72,blue,.45*alpha);
  glow(0,0,r*.22,PALETTE.gold,.55*alpha);
  ctx.globalCompositeOperation="screen";

  for(let arm=0;arm<2;arm++){
    for(let i=0;i<160;i++){
      const q=i/160;
      const ang=arm*Math.PI+q*8.8+(rand(i+arm*311)-.5)*.35;
      const rr=q*r*(.82+rand(i*2.7)*.28);
      dot(Math.cos(ang)*rr,Math.sin(ang)*rr,.35+rand(i*7)*1.3,rand(i*5)>.83?PALETTE.cyan:PALETTE.ink,(1-q)*.5*alpha);
    }
  }

  ctx.globalCompositeOperation="source-over";
  ctx.restore();
}

function drawLocal(){
  galaxy(W*.39,H*.58,Math.min(W,H)*.22,-.18,1);
  galaxy(W*.69,H*.38,Math.min(W,H)*.18,.31,.85,PALETTE.violet);

  for(let i=0;i<18;i++){
    const x=rand(i*4)*W;
    const y=rand(i*9)*H;
    glow(x,y,8+rand(i)*14,PALETTE.blue,.16);
    dot(x,y,1,PALETTE.ink,.55);
  }

  line(W*.43,H*.55,W*.64,H*.42,PALETTE.cyan,.5,.2);
}

function drawMilkyWay(){
  const x=W*.5+(pointer.x-.5)*12;
  const y=H*.49+(pointer.y-.5)*8;
  const r=Math.min(W,H)*.39;

  galaxy(x,y,r,-.14,1);

  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(-.14);
  ctx.scale(1,.38);
  ctx.strokeStyle="rgba(125,190,255,.24)";
  ctx.setLineDash([3,5]);
  ctx.beginPath();
  ctx.arc(0,0,r*.58,0,Math.PI*2);
  ctx.stroke();
  ctx.setLineDash([]);

  const sx=Math.cos(.25)*r*.58;
  const sy=Math.sin(.25)*r*.58;
  glow(sx,sy,30,PALETTE.cyan,.5);
  dot(sx,sy,3,PALETTE.ink,1);
  ctx.restore();

  ctx.fillStyle="rgba(206,232,255,.45)";
  ctx.font="9px ui-monospace,monospace";
  ctx.fillText("YOU ARE HERE",x+r*.5,y+r*.11);
}

function drawOrion(){
  const cx=W*.53,cy=H*.52;

  for(const s of stars){
    const depth=.25+s.z*.95;
    const px=(s.x-.5)*W*1.2/depth+W*.5+(pointer.x-.5)*45*depth;
    const py=(s.y-.5)*H*1.2/depth+H*.5+(pointer.y-.5)*36*depth;
    if(px<0||px>W||py<0||py>H) continue;

    const bright=s.h>.92;
    glow(px,py,(bright?18:7)*s.z,bright?PALETTE.cyan:PALETTE.blue,.16);
    dot(px,py,(bright?2.2:1)*s.z,bright?PALETTE.cyan:PALETTE.ink,.55+.35*s.z);
  }

  glow(cx,cy,55,PALETTE.gold,.42);
  dot(cx,cy,5.5,"#fff5cf",1);

  ctx.strokeStyle="rgba(143,232,255,.15)";
  ctx.setLineDash([2,6]);
  ctx.beginPath();
  ctx.arc(cx,cy,84,0,Math.PI*2);
  ctx.stroke();
  ctx.setLineDash([]);
}

const planets=[
  ["Mercury",.13,3.3,"#bbb4a9"],
  ["Venus",.20,5.1,"#d9b87b"],
  ["Earth",.28,5.4,"#61a7ff"],
  ["Mars",.36,4.1,"#c86f50"],
  ["Jupiter",.49,10.5,"#d1aa80"],
  ["Saturn",.61,9.1,"#e4ca8e"],
  ["Uranus",.74,6.5,"#9ad8df"],
  ["Neptune",.88,6.3,"#5a7bdc"]
];

function drawSolar(time){
  const cx=W*.50,cy=H*.50,R=Math.min(W,H)*.45;
  glow(cx,cy,95,PALETTE.gold,.52);
  dot(cx,cy,14,"#fff2bc",1);

  planets.forEach((p,i)=>{
    const or=p[1]*R;
    ctx.strokeStyle="rgba(181,207,237,.10)";
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.ellipse(cx,cy,or,or*.46,-.06,0,Math.PI*2);
    ctx.stroke();

    const a=p[2]+time*.000018/Math.pow(i+1,.65);
    const x=cx+Math.cos(a)*or;
    const y=cy+Math.sin(a)*or*.46;

    glow(x,y,p[3]*3,p[4],.24);
    dot(x,y,p[3],p[4],1);

    if(p[0]==="Saturn"){
      ctx.strokeStyle="rgba(245,225,181,.65)";
      ctx.beginPath();
      ctx.ellipse(x,y,p[3]*1.7,p[3]*.55,-.25,0,Math.PI*2);
      ctx.stroke();
    }
    if(p[0]==="Earth"){
      ctx.fillStyle="rgba(205,234,255,.62)";
      ctx.font="8px ui-monospace,monospace";
      ctx.fillText("EARTH",x+10,y-9);
    }
  });
}

function drawEarth(time){
  const R=Math.min(W,H)*.29;
  const cx=W*.5+(pointer.x-.5)*18;
  const cy=H*.51+(pointer.y-.5)*12;

  glow(cx,cy,R*1.35,PALETTE.blue,.30);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx,cy,R,0,Math.PI*2);
  ctx.clip();

  const ocean=ctx.createRadialGradient(cx-R*.35,cy-R*.32,R*.08,cx,cy,R*1.2);
  ocean.addColorStop(0,"#4f97c9");
  ocean.addColorStop(.45,"#15517f");
  ocean.addColorStop(1,"#061c38");
  ctx.fillStyle=ocean;
  ctx.fillRect(cx-R,cy-R,R*2,R*2);

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(-.08);

  ctx.fillStyle="rgba(75,126,91,.92)";
  const continents=[
    [-.40,-.25,.28,.16,-.35],
    [-.16,.03,.20,.31,.12],
    [.17,-.22,.34,.18,-.18],
    [.32,.08,.27,.22,.22],
    [.36,.33,.13,.08,.1]
  ];
  for(const c of continents){
    ctx.beginPath();
    ctx.ellipse(c[0]*R,c[1]*R,c[2]*R,c[3]*R,c[4],0,Math.PI*2);
    ctx.fill();
  }

  ctx.fillStyle="rgba(212,235,240,.23)";
  for(let i=0;i<20;i++){
    const a=rand(i*3)*Math.PI*2;
    const rr=rand(i*7)*R*.86;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a)*rr,Math.sin(a)*rr*.72,20+rand(i)*45,3+rand(i*8)*9,a,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();

  const night=ctx.createLinearGradient(cx-R*.15,0,cx+R*.9,0);
  night.addColorStop(0,"rgba(0,0,0,0)");
  night.addColorStop(.58,"rgba(0,0,10,.22)");
  night.addColorStop(1,"rgba(0,0,8,.88)");
  ctx.fillStyle=night;
  ctx.fillRect(cx-R,cy-R,R*2,R*2);

  ctx.restore();

  ctx.strokeStyle="rgba(150,220,255,.65)";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.arc(cx,cy,R+2,0,Math.PI*2);
  ctx.stroke();
  glow(cx-R*.2,cy-R*.2,R*.7,PALETTE.cyan,.08);

  const ma=time*.00012;
  const x=cx+Math.cos(ma)*R*1.62;
  const y=cy+Math.sin(ma)*R*.72;
  glow(x,y,18,"#d8dde5",.18);
  dot(x,y,7,"#ccd1d7",1);
}

const sceneFns=[drawObservable,drawWeb,drawLaniakea,drawLocal,drawMilkyWay,drawOrion,drawSolar,drawEarth];

function scene(i,time){
  sceneFns[i](time);
}

function drawTargets(){
  const s=STAGES[stageIndex];

  for(const o of s.objects){
    const x=o.x*W;
    const y=o.y*H;
    const active=hovered?.id===o.id||pinned?.id===o.id;

    ctx.strokeStyle=active?"rgba(190,242,255,.82)":"rgba(164,213,255,.18)";
    ctx.lineWidth=active?1.4:.8;
    ctx.beginPath();
    ctx.arc(x,y,active?o.r+7:o.r,0,Math.PI*2);
    ctx.stroke();

    if(active){
      ctx.strokeStyle="rgba(190,242,255,.32)";
      ctx.beginPath();
      ctx.arc(x,y,o.r+13,0,Math.PI*2);
      ctx.stroke();
    }
  }
}

function hitTest(){
  const objs=STAGES[stageIndex].objects;
  let found=null;
  let best=Infinity;

  for(const o of objs){
    const d=Math.hypot(pointer.sx-o.x*W,pointer.sy-o.y*H);
    if(d<o.r+18&&d<best){
      found=o;
      best=d;
    }
  }

  hovered=found;
  canvas.style.cursor=found?"pointer":"default";

  if(found&&!pinned){
    els.hint.hidden=false;
    els.hint.querySelector("span").textContent=found.type;
    els.hint.querySelector("strong").textContent=found.name;
    const x=Math.min(W-180,pointer.sx+16);
    const y=Math.min(H-90,pointer.sy+16);
    els.hint.style.transform="translate("+x+"px,"+y+"px)";
  }else{
    els.hint.hidden=true;
  }
}

function inspect(o){
  pinned=o;

  if(!o){
    els.inspector.classList.remove("open");
    els.inspector.setAttribute("aria-hidden","true");
    return;
  }

  els.inspectorType.textContent=o.type;
  els.inspectorTitle.textContent=o.name;
  els.inspectorText.textContent=o.text;

  els.inspectorFacts.replaceChildren(...o.facts.map(([k,v])=>{
    const d=document.createElement("div");
    const dt=document.createElement("dt");
    const dd=document.createElement("dd");
    dt.textContent=k;
    dd.textContent=v;
    d.append(dt,dd);
    return d;
  }));

  els.inspector.classList.add("open");
  els.inspector.setAttribute("aria-hidden","false");
}

function frame(time){
  currentMetrics();
  updateUI();

  pointer.x=lerp(pointer.x,pointer.tx,reduced?1:.045);
  pointer.y=lerp(pointer.y,pointer.ty,reduced?1:.045);

  drawBackdrop(time);

  const q=ease(localP);
  const next=Math.min(STAGES.length-1,stageIndex+1);

  if(next===stageIndex){
    withScene(1,1,()=>scene(stageIndex,time));
  }else{
    withScene(1-q,1+q*.68,()=>scene(stageIndex,time));
    withScene(q,.56+q*.44,()=>scene(next,time));
  }

  drawTargets();
  hitTest();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

addEventListener("pointermove",e=>{
  pointer.sx=e.clientX;
  pointer.sy=e.clientY;
  pointer.tx=e.clientX/W;
  pointer.ty=e.clientY/H;

  const ra=((pointer.tx*24+24)%24).toFixed(1);
  const dec=((.5-pointer.ty)*180).toFixed(1);
  els.pointer.textContent="RA "+ra+"h / DEC "+dec+"°";
},{passive:true});

canvas.addEventListener("click",()=>hovered&&inspect(hovered));
els.close.addEventListener("click",()=>inspect(null));

addEventListener("keydown",e=>{
  if(e.key==="Escape") inspect(null);

  if(["ArrowDown","PageDown"].includes(e.key)){
    e.preventDefault();
    jumpTo(Math.min(STAGES.length-1,stageIndex+1));
  }

  if(["ArrowUp","PageUp"].includes(e.key)){
    e.preventDefault();
    jumpTo(Math.max(0,stageIndex-1));
  }

  if(e.key==="Home"){
    e.preventDefault();
    scrollTo({top:0,behavior:reduced?"auto":"smooth"});
  }

  if(e.key==="End"){
    e.preventDefault();
    jumpTo(STAGES.length-1);
  }
});

function jumpTo(i){
  const spacers=[...document.querySelectorAll(".stage-spacer")];
  const el=spacers[i];
  if(el) scrollTo({top:el.offsetTop+H*.38,behavior:reduced?"auto":"smooth"});
}

els.restart.addEventListener("click",()=>scrollTo({top:0,behavior:reduced?"auto":"smooth"}));

els.helpToggle.addEventListener("click",()=>{
  const open=els.help.hidden;
  els.help.hidden=!open;
  els.helpToggle.setAttribute("aria-expanded",String(open));
});

function initSound(){
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC) return;

  audio=new AC();
  const osc=audio.createOscillator();
  const gain=audio.createGain();
  const lfo=audio.createOscillator();
  const lfoGain=audio.createGain();

  osc.type="sine";
  osc.frequency.value=52;
  lfo.frequency.value=.07;
  lfoGain.gain.value=8;
  gain.gain.value=.0001;

  lfo.connect(lfoGain).connect(osc.frequency);
  osc.connect(gain).connect(audio.destination);
  osc.start();
  lfo.start();

  audio._gain=gain;
}

els.sound.addEventListener("click",async()=>{
  if(!audio) initSound();
  if(!audio) return;

  if(audio.state==="suspended") await audio.resume();

  soundOn=!soundOn;
  audio._gain.gain.cancelScheduledValues(audio.currentTime);
  audio._gain.gain.linearRampToValueAtTime(soundOn?.018:.0001,audio.currentTime+.8);
  els.sound.setAttribute("aria-pressed",String(soundOn));
});
