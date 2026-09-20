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
let pointer={x:.5,y:.5,tx:.5,ty:.5,sx:W/2,sy:H/2};
let hitAreas=[],hovered=null,pinned=null,activeTransform={zoom:1,alpha:1};
let toastTimer=0,audio=null,soundOn=false,introStageShown=false;

STAGES.forEach(function(stage,i){
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
  b.addEventListener("click",function(){jumpTo(i)});
  li.append(b);
  els.nav.append(li);
});

function rand(seed){
  const x=Math.sin(seed*999.91)*43758.5453123;
  return x-Math.floor(x);
}
function clamp(v,a,b){a=a===undefined?0:a;b=b===undefined?1:b;return Math.max(a,Math.min(b,v))}
function lerp(a,b,t){return a+(b-a)*t}
function smooth(t){return t*t*(3-2*t)}
function rgba(hex,a){
  const n=parseInt(hex.slice(1),16);
  return "rgba("+((n>>16)&255)+","+((n>>8)&255)+","+(n&255)+","+a+")";
}
function dot(x,y,r,c,a){
  ctx.fillStyle=rgba(c,a===undefined?1:a);
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
}
function line(x1,y1,x2,y2,c,w,a){
  ctx.strokeStyle=rgba(c,a===undefined?1:a);ctx.lineWidth=w||1;
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
}
function glow(x,y,r,c,a){
  const g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(c,.44*(a===undefined?1:a)));
  g.addColorStop(.20,rgba(c,.15*(a===undefined?1:a)));
  g.addColorStop(1,rgba(c,0));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
}
function label(text,x,y,a){
  ctx.font="8px ui-monospace,SFMono-Regular,Menlo,monospace";
  ctx.fillStyle="rgba(215,235,255,"+(a===undefined ? .5 : a)+")";
  ctx.textAlign="left";ctx.fillText(text,x,y);
}

const STAR_COLORS=["#9cc7ff","#b9d5ff","#e6eeff","#fff8e4","#ffe4b5","#ffbd83","#ff9470"];
const stars=Array.from({length:1250},function(_,i){
  const brightness=Math.pow(rand(i*21.71),3.1);
  const colorIndex=Math.min(STAR_COLORS.length-1,Math.floor(rand(i*16.13)*STAR_COLORS.length));
  return {x:rand(i*3.11),y:rand(i*7.73),z:.14+rand(i*11.41)*.86,r:.25+brightness*2.2,b:brightness,c:STAR_COLORS[colorIndex],tw:rand(i*29.2)*Math.PI*2};
});
const deepGalaxies=Array.from({length:210},function(_,i){
  return {x:rand(i*4.13),y:rand(i*8.21),s:.6+rand(i*2.75)*3.4,a:rand(i*6.42)*Math.PI*2,t:rand(i*19.2),warm:rand(i*31.2)};
});
const webNodes=Array.from({length:76},function(_,i){return{x:.04+rand(i*2.4)*.92,y:.04+rand(i*7.1)*.92,r:1+rand(i*9.8)*3.3}});
const localStars=Array.from({length:290},function(_,i){
  return{x:rand(i*3.8),y:rand(i*9.3),z:.22+rand(i*5.2)*.9,b:rand(i*8.1),c:STAR_COLORS[Math.floor(rand(i*12.7)*STAR_COLORS.length)]};
});

function resize(){
  W=innerWidth;H=innerHeight;
  canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);
  canvas.style.width=W+"px";canvas.style.height=H+"px";
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener("resize",resize,{passive:true});resize();

function registerHit(stage,id,x,y,r){
  if(activeTransform.alpha<.34)return;
  const tx=W/2+(x-W/2)*activeTransform.zoom;
  const ty=H/2+(y-H/2)*activeTransform.zoom;
  const obj=STAGES[stage]&&STAGES[stage].objects.find(function(o){return o.id===id});
  if(obj)hitAreas.push({stage:stage,obj:obj,x:tx,y:ty,r:Math.max(16,r*activeTransform.zoom),alpha:activeTransform.alpha});
}

function getStageMetrics(){
  const spacers=[].slice.call(document.querySelectorAll(".stage-spacer"));
  if(!spacers.length)return;
  const probe=scrollY+H*.47;
  let idx=0;
  for(let i=0;i<spacers.length;i++){if(probe>=spacers[i].offsetTop)idx=i;else break}
  idx=Math.min(idx,STAGES.length-1);
  const start=spacers[idx].offsetTop;
  const end=idx<spacers.length-1?spacers[idx+1].offsetTop:start+spacers[idx].offsetHeight;
  stageIndex=idx;
  localP=clamp((probe-start)/Math.max(1,end-start));
  const first=spacers[0].offsetTop;
  const last=spacers[spacers.length-1].offsetTop+spacers[spacers.length-1].offsetHeight-H*.2;
  journeyP=clamp((probe-first)/Math.max(1,last-first));
  els.railFill.style.height=(journeyP*100)+"%";
}

function showStageToast(auto){
  clearTimeout(toastTimer);
  els.toast.classList.add("visible");els.toast.setAttribute("aria-hidden","false");
  if(auto!==false)toastTimer=setTimeout(hideStageToast,3600);
}
function hideStageToast(){els.toast.classList.remove("visible");els.toast.setAttribute("aria-hidden","true")}

function updateUI(){
  if(stageIndex!==lastStage){
    lastStage=stageIndex;inspect(null);
    const s=STAGES[stageIndex];
    els.num.textContent=String(stageIndex+1).padStart(2,"0")+" / "+String(STAGES.length).padStart(2,"0");
    els.kicker.textContent=s.kicker;els.title.textContent=s.title;els.desc.textContent=s.description;
    els.scale.textContent=s.scale;els.distance.textContent=s.distance;
    [].slice.call(els.nav.querySelectorAll("button")).forEach(function(b,i){b.classList.toggle("active",i===stageIndex)});
    if(journeyP>0){showStageToast(true);introStageShown=true}
  }
  if(!introStageShown&&journeyP>0&&stageIndex===0){showStageToast(true);introStageShown=true}
  const next=STAGES[Math.min(STAGES.length-1,stageIndex+1)];
  const q=smooth(clamp((localP-.48)/.52));
  const exp=lerp(STAGES[stageIndex].exponent,next.exponent,q);
  els.readout.textContent="Scale ~10^"+exp.toFixed(exp%1?1:0)+" m";
  els.journey.textContent=STAGES[stageIndex].title;
}

function drawStar(x,y,s,time,alpha){
  const tw=.83+.17*Math.sin(time*.0011+s.tw);
  const a=alpha*tw*(.22+.78*s.z);
  if(s.b>.72)glow(x,y,9+s.r*5,s.c,.18*a);
  dot(x,y,Math.max(.25,s.r*s.z),s.c,a);
  if(s.b>.90){
    const len=4+s.b*8;
    line(x-len,y,x+len,y,s.c,.5,.18*a);
    line(x,y-len,x,y+len,s.c,.5,.18*a);
  }
}

function drawNebulae(alpha){
  ctx.save();ctx.globalCompositeOperation="screen";
  const clouds=[
    [.17,.33,.26,"#3d276b"],[.76,.22,.23,"#183c68"],[.68,.73,.30,"#44244c"],[.31,.77,.22,"#123b52"]
  ];
  clouds.forEach(function(n,i){
    const x=W*n[0]+(pointer.x-.5)*(i%2?12:-9),y=H*n[1]+(pointer.y-.5)*(i%2?7:-11),r=Math.min(W,H)*n[2];
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,rgba(n[3],.052*alpha));g.addColorStop(.45,rgba(n[3],.018*alpha));g.addColorStop(1,rgba(n[3],0));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  });
  ctx.restore();
}

function drawBackdrop(time,fadeStars){
  fadeStars=fadeStars===undefined?1:fadeStars;
  const bg=ctx.createRadialGradient(W*.50,H*.46,0,W*.50,H*.46,Math.max(W,H)*.88);
  bg.addColorStop(0,"#050914");bg.addColorStop(.52,"#02050c");bg.addColorStop(1,"#000106");
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  drawNebulae(fadeStars);
  const mx=(pointer.x-.5)*27,my=(pointer.y-.5)*21;
  for(let i=0;i<stars.length;i++){
    const s=stars[i],x=s.x*W+mx*s.z,y=s.y*H+my*s.z;
    drawStar(x,y,s,time,fadeStars);
  }
}

function withScene(alpha,zoom,fn){
  const old=activeTransform;activeTransform={alpha:alpha,zoom:zoom};
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H/2);fn();ctx.restore();
  activeTransform=old;
}

function drawSpiralGalaxy(x,y,r,rot,alpha,tilt,seed){
  alpha=alpha===undefined?1:alpha;tilt=tilt===undefined ? .42 : tilt;seed=seed||1;
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(1,tilt);
  const halo=ctx.createRadialGradient(0,0,0,0,0,r*1.1);
  halo.addColorStop(0,"rgba(255,225,176,"+(.26*alpha)+")");
  halo.addColorStop(.16,"rgba(242,214,173,"+(.17*alpha)+")");
  halo.addColorStop(.42,"rgba(118,155,210,"+(.10*alpha)+")");
  halo.addColorStop(1,"rgba(35,67,120,0)");
  ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,r*1.1,0,Math.PI*2);ctx.fill();

  ctx.globalCompositeOperation="screen";
  for(let arm=0;arm<3;arm++){
    for(let i=0;i<240;i++){
      const q=i/240;
      const noise=(rand(seed*73+i*2.7+arm*101)-.5);
      const ang=arm*Math.PI*2/3+q*10.4+noise*.28;
      const rr=(.06+q*.91)*r*(.92+rand(seed*31+i*1.8)*.17);
      const px=Math.cos(ang)*rr,py=Math.sin(ang)*rr;
      const young=q>.35&&rand(seed+i*8.7+arm*4)>.80;
      const col=young?"#94c8ff":(q<.28?"#ffe0aa":"#dce7ff");
      const sz=.35+rand(seed+i*7.1)*1.25*(1-q*.45);
      dot(px,py,sz,col,(.12+.42*(1-q))*alpha);
    }
  }
  ctx.globalCompositeOperation="source-over";

  ctx.strokeStyle="rgba(10,8,12,"+(.30*alpha)+")";
  ctx.lineWidth=Math.max(2,r*.025);
  for(let arm=0;arm<2;arm++){
    ctx.beginPath();
    for(let i=0;i<90;i++){
      const q=i/89,ang=arm*Math.PI+q*7.8+.55,rr=(.18+q*.70)*r;
      const px=Math.cos(ang)*rr,py=Math.sin(ang)*rr;
      if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.stroke();
  }

  const core=ctx.createRadialGradient(-r*.03,-r*.02,0,0,0,r*.24);
  core.addColorStop(0,"rgba(255,247,220,"+(.88*alpha)+")");
  core.addColorStop(.18,"rgba(255,219,164,"+(.55*alpha)+")");
  core.addColorStop(1,"rgba(255,186,110,0)");
  ctx.fillStyle=core;ctx.beginPath();ctx.arc(0,0,r*.25,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawTinyGalaxy(x,y,size,angle,warm,alpha){
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(1,.34+.36*warm);
  const c=warm>.55?"#f1c79e":"#aec8ff";
  const g=ctx.createRadialGradient(0,0,0,0,0,size*4);
  g.addColorStop(0,rgba("#fff7dc",.58*alpha));g.addColorStop(.22,rgba(c,.27*alpha));g.addColorStop(1,rgba(c,0));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,size*4,0,Math.PI*2);ctx.fill();
  dot(0,0,Math.max(.35,size*.32),"#fff7e7",.72*alpha);
  ctx.restore();
}

function drawSun(x,y,r,time){
  ctx.save();ctx.globalCompositeOperation="screen";
  glow(x,y,r*5.5,"#ffb348",.30);glow(x,y,r*2.7,"#ffd17b",.48);
  ctx.restore();
  const g=ctx.createRadialGradient(x-r*.28,y-r*.30,r*.08,x,y,r);
  g.addColorStop(0,"#fffbe0");g.addColorStop(.38,"#ffe58c");g.addColorStop(.78,"#f6a43f");g.addColorStop(1,"#d76b1e");
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.globalAlpha=.18;
  for(let i=0;i<16;i++){
    const a=i*Math.PI*2/16+Math.sin(time*.0002+i)*.035;
    line(x+Math.cos(a)*r*1.04,y+Math.sin(a)*r*1.04,x+Math.cos(a)*r*(1.24+rand(i)*.25),y+Math.sin(a)*r*(1.24+rand(i)*.25),"#ffd88c",.7,.65);
  }
  ctx.restore();
}

function sphereGradient(x,y,r,lightX,lightY,lightColor,darkColor){
  const g=ctx.createRadialGradient(x-r*lightX,y-r*lightY,r*.04,x,y,r*1.10);
  g.addColorStop(0,lightColor);g.addColorStop(.58,darkColor);g.addColorStop(1,"#03050a");
  return g;
}

function drawRockyPlanet(x,y,r,kind,lightSide){
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();
  let light="#d0c4ad",dark="#6b625b";
  if(kind==="venus"){light="#e6c987";dark="#876336"}
  if(kind==="earth"){light="#4aa6db";dark="#0a3355"}
  if(kind==="mars"){light="#d8875b";dark="#6e2d1f"}
  ctx.fillStyle=sphereGradient(x,y,r,.38,-.32,light,dark);ctx.fillRect(x-r,y-r,r*2,r*2);

  if(kind==="mars"){
    ctx.fillStyle="rgba(84,38,27,.35)";
    for(let i=0;i<10;i++){ctx.beginPath();ctx.ellipse(x+(rand(i*4)-.5)*r*1.25,y+(rand(i*7)-.5)*r*1.15,r*(.08+rand(i)*.16),r*(.03+rand(i*3)*.08),rand(i*9)*Math.PI,0,Math.PI*2);ctx.fill()}
    ctx.fillStyle="rgba(245,225,203,.70)";ctx.beginPath();ctx.ellipse(x,y-r*.84,r*.34,r*.11,0,0,Math.PI*2);ctx.fill();
  }else if(kind==="earth"){
    ctx.fillStyle="rgba(74,129,83,.88)";
    ctx.beginPath();ctx.ellipse(x-r*.20,y-r*.10,r*.28,r*.18,-.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(x+r*.18,y+r*.08,r*.30,r*.17,.35,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(244,250,252,.42)";
    ctx.beginPath();ctx.ellipse(x-r*.06,y-r*.34,r*.52,r*.07,-.2,0,Math.PI*2);ctx.fill();
  }else{
    ctx.fillStyle="rgba(85,67,49,.13)";
    for(let i=0;i<7;i++){ctx.beginPath();ctx.arc(x+(rand(i*5)-.5)*r*1.3,y+(rand(i*8)-.5)*r*1.25,r*(.04+rand(i)*.09),0,Math.PI*2);ctx.fill()}
  }
  ctx.restore();
  if(kind==="earth"){ctx.strokeStyle="rgba(125,213,255,.62)";ctx.lineWidth=Math.max(1,r*.08);ctx.beginPath();ctx.arc(x,y,r+1,0,Math.PI*2);ctx.stroke()}
}

function drawJupiter(x,y,r){
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();
  ctx.fillStyle=sphereGradient(x,y,r,.35,-.35,"#f4dfbd","#8c6548");ctx.fillRect(x-r,y-r,r*2,r*2);
  const bands=["#c99d77","#f0dfc1","#a96f54","#e8c8a4","#b98262","#f2dfc5","#9f654d","#dfb48f"];
  for(let i=0;i<bands.length;i++){
    const yy=y-r+i*(r*2/bands.length);
    ctx.fillStyle=rgba(bands[i],.48);
    ctx.fillRect(x-r,yy,r*2,r*2/bands.length+1);
  }
  ctx.fillStyle="rgba(169,76,50,.68)";ctx.beginPath();ctx.ellipse(x+r*.29,y+r*.25,r*.22,r*.09,-.08,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="rgba(255,235,211,.19)";
  for(let i=0;i<11;i++){ctx.fillRect(x-r,y-r+(i+.3)*r*2/11,r*2,r*.025)}
  const shade=ctx.createLinearGradient(x-r,0,x+r,0);shade.addColorStop(0,"rgba(0,0,0,.05)");shade.addColorStop(.65,"rgba(0,0,0,.02)");shade.addColorStop(1,"rgba(0,0,0,.60)");ctx.fillStyle=shade;ctx.fillRect(x-r,y-r,r*2,r*2);
  ctx.restore();
}

function drawSaturn(x,y,r){
  ctx.save();ctx.translate(x,y);ctx.rotate(-.17);
  ctx.strokeStyle="rgba(218,199,158,.42)";ctx.lineWidth=r*.44;ctx.beginPath();ctx.ellipse(0,0,r*2.05,r*.56,0,Math.PI,Math.PI*2);ctx.stroke();
  ctx.strokeStyle="rgba(92,76,56,.30)";ctx.lineWidth=r*.10;ctx.beginPath();ctx.ellipse(0,0,r*1.72,r*.47,0,Math.PI,Math.PI*2);ctx.stroke();
  ctx.restore();

  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();
  ctx.fillStyle=sphereGradient(x,y,r,.34,-.35,"#f1ddb2","#887451");ctx.fillRect(x-r,y-r,r*2,r*2);
  for(let i=0;i<10;i++){ctx.fillStyle=i%2?"rgba(213,188,136,.20)":"rgba(255,236,187,.13)";ctx.fillRect(x-r,y-r+i*r*.2,r*2,r*.10)}
  const shade=ctx.createLinearGradient(x-r,0,x+r,0);shade.addColorStop(0,"rgba(0,0,0,.03)");shade.addColorStop(.64,"rgba(0,0,0,.02)");shade.addColorStop(1,"rgba(0,0,0,.58)");ctx.fillStyle=shade;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();

  ctx.save();ctx.translate(x,y);ctx.rotate(-.17);
  ctx.strokeStyle="rgba(229,214,174,.78)";ctx.lineWidth=r*.35;ctx.beginPath();ctx.ellipse(0,0,r*2.02,r*.55,0,0,Math.PI);ctx.stroke();
  ctx.strokeStyle="rgba(112,92,65,.42)";ctx.lineWidth=r*.08;ctx.beginPath();ctx.ellipse(0,0,r*1.70,r*.46,0,0,Math.PI);ctx.stroke();
  ctx.restore();
}

function drawIceGiant(x,y,r,kind){
  const light=kind==="uranus"?"#b7e1df":"#6c91ef",dark=kind==="uranus"?"#527e82":"#1c377e";
  ctx.fillStyle=sphereGradient(x,y,r,.36,-.34,light,dark);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  if(kind==="neptune"){ctx.fillStyle="rgba(220,235,255,.26)";ctx.beginPath();ctx.ellipse(x-r*.08,y-r*.20,r*.62,r*.035,-.06,0,Math.PI*2);ctx.fill()}
}

function drawHorizon(time,s){
  const cx=W*.5+(pointer.x-.5)*14,cy=H*.49+(pointer.y-.5)*10,R=Math.min(W,H)*.37;
  const haze=ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.6);
  haze.addColorStop(0,"rgba(61,68,110,.10)");haze.addColorStop(.65,"rgba(33,29,64,.05)");haze.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=haze;ctx.beginPath();ctx.arc(cx,cy,R*1.6,0,Math.PI*2);ctx.fill();
  for(let i=0;i<deepGalaxies.length;i++){
    const g=deepGalaxies[i],rr=(.10+g.t*.90)*R,ang=g.a+time*.000003*(g.t-.5);
    drawTinyGalaxy(cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr*.72,g.s,ang,g.warm,.36+.34*(1-g.t));
  }
  ctx.strokeStyle="rgba(180,209,255,.10)";ctx.lineWidth=1;
  for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(cx,cy,R*(1-k*.065),R*.72*(1-k*.065),0,0,Math.PI*2);ctx.stroke()}
  registerHit(s,"horizon",cx,cy-R*.72,27);registerHit(s,"cmb",cx-R*.54,cy-R*.20,31);registerHit(s,"web",cx+R*.50,cy+R*.18,34);
  label("OBSERVABLE UNIVERSE — NOT A PHYSICAL EDGE",cx-R*.49,cy-R*.84,.40);
}

function drawWeb(time,s){
  const mx=(pointer.x-.5)*36,my=(pointer.y-.5)*28;
  for(let i=0;i<webNodes.length;i++){
    const a=webNodes[i],ax=a.x*W+mx*(a.x-.5),ay=a.y*H+my*(a.y-.5);
    for(let j=i+1;j<webNodes.length;j++){
      const b=webNodes[j],dx=(a.x-b.x)*W,dy=(a.y-b.y)*H,d=Math.hypot(dx,dy),lim=Math.min(W,H)*.18;
      if(d<lim){
        const strength=clamp(1-d/lim);
        line(ax,ay,b.x*W+mx*(b.x-.5),b.y*H+my*(b.y-.5),i%3===0?"#9c8dff":"#779dff",.55,.10+strength*.18);
      }
    }
    glow(ax,ay,15+a.r*4,"#9b8bff",.13);dot(ax,ay,a.r,"#c8e5ff",.48);
  }
  const node={x:W*.63,y:H*.44},voidC={x:W*.28,y:H*.66},fil={x:W*.47,y:H*.52};
  glow(node.x,node.y,66,"#9d8cff",.22);
  registerHit(s,"node",node.x,node.y,36);registerHit(s,"void",voidC.x,voidC.y,48);registerHit(s,"filament",fil.x,fil.y,32);
}

function drawLaniakea(time,s){
  const cx=W*.59+(pointer.x-.5)*24,cy=H*.51+(pointer.y-.5)*17;
  glow(cx,cy,180,"#9f82ff",.15);
  for(let i=0;i<210;i++){
    const a=rand(i*4.3)*Math.PI*2,rad=44+rand(i*9.4)*Math.min(W,H)*.54,sx=cx+Math.cos(a)*rad,sy=cy+Math.sin(a)*rad*.72,bend=(rand(i*2.1)-.5)*155;
    ctx.strokeStyle=i%4===0?"rgba(147,205,255,.15)":"rgba(132,113,255,.105)";ctx.lineWidth=.65+rand(i)*.5;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo((sx+cx)/2+bend,(sy+cy)/2-bend*.32,cx+(rand(i)-.5)*38,cy+(rand(i*6)-.5)*25);ctx.stroke();
  }
  glow(cx,cy,48,"#b4eaff",.26);dot(cx,cy,3.5,"#f5fbff",.92);
  registerHit(s,"attractor",cx,cy,40);registerHit(s,"laniakea",W*.42,H*.38,42);label("GALAXY FLOW FIELD",cx+20,cy-18,.43);
}

function drawLocalSheet(time,s){
  const cx=W*.5,cy=H*.52;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.13);ctx.scale(1,.35);glow(0,0,Math.min(W,H)*.5,"#7397d8",.08);ctx.restore();
  const vx=W*.69,vy=H*.35;drawSpiralGalaxy(vx,vy,Math.min(W,H)*.125,.18,.80,.34,17);
  for(let i=0;i<52;i++){const x=.12*W+rand(i*6)*.76*W,y=.29*H+rand(i*9)*.45*H;drawTinyGalaxy(x,y,.5+rand(i*8)*1.6,rand(i*2)*Math.PI,rand(i*7),.36)}
  registerHit(s,"virgo",vx,vy,44);registerHit(s,"local-sheet",W*.46,H*.59,50);
}

function drawLocalGroup(time,s){
  const mw={x:W*.36,y:H*.59},an={x:W*.70,y:H*.37},tr={x:W*.63,y:H*.69};
  drawSpiralGalaxy(mw.x,mw.y,Math.min(W,H)*.235,-.18,1,.40,3);
  drawSpiralGalaxy(an.x,an.y,Math.min(W,H)*.20,.28,.94,.30,11);
  drawSpiralGalaxy(tr.x,tr.y,Math.min(W,H)*.085,.10,.64,.48,23);
  registerHit(s,"milkyway",mw.x,mw.y,48);registerHit(s,"andromeda",an.x,an.y,46);registerHit(s,"triangulum",tr.x,tr.y,31);
  line(mw.x+26,mw.y-12,an.x-28,an.y+18,"#8fe8ff",.5,.12);
  for(let i=0;i<20;i++){const x=rand(i*4)*W,y=rand(i*9)*H;drawTinyGalaxy(x,y,.5+rand(i*2),rand(i*6)*Math.PI,rand(i*4),.28)}
}

function drawMilkyWay(time,s){
  const x=W*.50+(pointer.x-.5)*13,y=H*.49+(pointer.y-.5)*8,r=Math.min(W,H)*.43;
  drawSpiralGalaxy(x,y,r,-.14,1,.38,5);
  ctx.save();ctx.translate(x,y);ctx.rotate(-.14);ctx.scale(1,.38);ctx.strokeStyle="rgba(125,205,255,.26)";ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(0,0,r*.59,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  const ox=Math.cos(.25)*r*.59,oy=Math.sin(.25)*r*.59;glow(ox,oy,30,"#8fe8ff",.42);dot(ox,oy,2.8,"#f2fcff",1);ctx.restore();
  const orionX=x+Math.cos(-.14)*Math.cos(.25)*r*.59-Math.sin(-.14)*Math.sin(.25)*r*.59*.38;
  const orionY=y+Math.sin(-.14)*Math.cos(.25)*r*.59+Math.cos(-.14)*Math.sin(.25)*r*.59*.38;
  registerHit(s,"sgr",x,y,32);registerHit(s,"orion",orionX,orionY,32);registerHit(s,"perseus",x+r*.24,y-r*.10,35);
  label("SUN · ORION SPUR",orionX+14,orionY-12,.60);
}

function drawNeighborhood(time,s){
  const px=(pointer.x-.5)*43,py=(pointer.y-.5)*32;
  for(let i=0;i<localStars.length;i++){
    const st=localStars[i],depth=.25+st.z,x=(st.x-.5)*W*1.17/depth+W*.5+px*depth,y=(st.y-.5)*H*1.17/depth+H*.5+py*depth;
    if(x<0||x>W||y<0||y>H)continue;
    const fake={b:Math.pow(st.b,3),r:.4+st.b*2,z:st.z,c:st.c,tw:i*.7};
    drawStar(x,y,fake,time,.72);
  }
  const sun={x:W*.51,y:H*.52},sirius={x:W*.72,y:H*.32},proxima={x:W*.29,y:H*.66};
  drawSun(sun.x,sun.y,6.5,time);glow(sirius.x,sirius.y,35,"#bce8ff",.34);dot(sirius.x,sirius.y,3.1,"#eefcff",1);glow(proxima.x,proxima.y,24,"#ff8f74",.26);dot(proxima.x,proxima.y,2.5,"#ffac92",1);
  registerHit(s,"sun",sun.x,sun.y,32);registerHit(s,"sirius",sirius.x,sirius.y,28);registerHit(s,"proxima",proxima.x,proxima.y,27);
}

function drawOort(time,s){
  const cx=W*.5,cy=H*.5,R=Math.min(W,H)*.43;drawSun(cx,cy,5.5,time);
  ctx.save();ctx.globalCompositeOperation="screen";
  for(let i=0;i<730;i++){
    const u=rand(i*3.3),a=rand(i*7.1)*Math.PI*2,rr=R*(.50+Math.pow(u,.72)*.50),flatten=.75+rand(i*2)*.24,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*flatten;
    dot(x,y,.3+rand(i)*.7,rand(i*9)>.84?"#9bdcff":"#dbe7f6",.09+rand(i*4)*.25);
  }
  ctx.restore();ctx.strokeStyle="rgba(145,201,255,.08)";ctx.beginPath();ctx.arc(cx,cy,R*.49,0,Math.PI*2);ctx.stroke();
  registerHit(s,"sun",cx,cy,28);registerHit(s,"oort",cx+R*.72,cy-R*.20,43);label("OORT CLOUD · SCHEMATIC",cx+14,cy+22,.37);
}

const outerPlanets=[
  {id:"jupiter",r:.42,size:13,speed:.46,phase:1.5},
  {id:"saturn",r:.57,size:12,speed:.34,phase:3.0},
  {id:"uranus",r:.72,size:8,speed:.24,phase:4.7},
  {id:"neptune",r:.88,size:8,speed:.19,phase:5.6}
];
function drawOuterSolar(time,s){
  const cx=W*.5,cy=H*.5,R=Math.min(W,H)*.47;drawSun(cx,cy,15,time);registerHit(s,"sun",cx,cy,33);
  outerPlanets.forEach(function(p){
    const or=p.r*R;ctx.strokeStyle="rgba(181,207,237,.095)";ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(cx,cy,or,or*.44,-.05,0,Math.PI*2);ctx.stroke();
    const a=p.phase+time*.000018*p.speed,x=cx+Math.cos(a)*or,y=cy+Math.sin(a)*or*.44;
    if(p.id==="jupiter")drawJupiter(x,y,p.size);else if(p.id==="saturn")drawSaturn(x,y,p.size);else drawIceGiant(x,y,p.size,p.id);
    if(["jupiter","saturn","neptune"].indexOf(p.id)>=0)registerHit(s,p.id,x,y,p.size+18);
  });
}

const innerPlanets=[
  {id:"mercury",r:.18,size:5,speed:1.6,phase:4.1},
  {id:"venus",r:.30,size:7,speed:1.2,phase:2.5},
  {id:"earth",r:.44,size:7.5,speed:1,phase:5.5},
  {id:"mars",r:.60,size:6,speed:.8,phase:1.6}
];
function drawInnerSolar(time,s){
  const cx=W*.38,cy=H*.53,R=Math.min(W,H)*.66;drawSun(cx,cy,21,time);
  innerPlanets.forEach(function(p){
    const or=p.r*R;ctx.strokeStyle="rgba(181,207,237,.12)";ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(cx,cy,or,or*.42,-.05,0,Math.PI*2);ctx.stroke();
    const a=p.phase+time*.000023*p.speed,x=cx+Math.cos(a)*or,y=cy+Math.sin(a)*or*.42;
    drawRockyPlanet(x,y,p.size,p.id);
    registerHit(s,p.id,x,y,p.size+19);
    if(p.id==="earth")label("EARTH · DESCENT TARGET",x+12,y-11,.62);
  });
}

const continents=[
  {c:"#477b4e",p:[[-.67,-.21],[-.59,-.39],[-.44,-.47],[-.31,-.37],[-.28,-.20],[-.39,-.09],[-.47,.07],[-.58,.02]]},
  {c:"#568250",p:[[-.34,.08],[-.20,.02],[-.12,.14],[-.10,.34],[-.20,.57],[-.30,.48],[-.35,.29]]},
  {c:"#617f4e",p:[[.00,-.39],[.21,-.49],[.46,-.42],[.66,-.24],[.55,-.07],[.35,-.02],[.19,-.13],[.04,-.12],[-.08,-.25]]},
  {c:"#4e7546",p:[[.02,-.08],[.18,-.03],[.27,.13],[.20,.40],[.06,.55],[-.08,.33],[-.11,.12]]},
  {c:"#6d8554",p:[[.43,.30],[.58,.34],[.62,.49],[.51,.57],[.40,.48]]},
  {c:"#d8e8e7",p:[[-.92,.78],[-.55,.72],[-.17,.76],[.22,.72],[.62,.76],[.90,.70],[.95,.94],[-.95,.94]]}
];
function polygon(cx,cy,R,pts){
  ctx.beginPath();
  pts.forEach(function(p,i){const x=cx+p[0]*R,y=cy+p[1]*R;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
  ctx.closePath();
}
function drawEarthGlobe(cx,cy,R,time,detail){
  detail=detail||1;
  ctx.save();ctx.globalCompositeOperation="screen";glow(cx,cy,R*1.38,"#5cc6ff",.18);ctx.restore();
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();
  const ocean=ctx.createRadialGradient(cx-R*.38,cy-R*.38,R*.04,cx,cy,R*1.12);
  ocean.addColorStop(0,"#4da2cc");ocean.addColorStop(.42,"#17618c");ocean.addColorStop(.82,"#07355c");ocean.addColorStop(1,"#031426");
  ctx.fillStyle=ocean;ctx.fillRect(cx-R,cy-R,R*2,R*2);

  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.07);ctx.translate(-cx,-cy);
  continents.forEach(function(cont){ctx.fillStyle=cont.c;polygon(cx,cy,R,cont.p);ctx.fill()});
  ctx.fillStyle="rgba(176,161,99,.22)";
  for(let i=0;i<13;i++){ctx.beginPath();ctx.ellipse(cx+(rand(i*4)-.5)*R*1.35,cy+(rand(i*8)-.5)*R*1.25,R*(.025+rand(i)*.08),R*(.012+rand(i*3)*.04),rand(i*5)*Math.PI,0,Math.PI*2);ctx.fill()}
  ctx.restore();

  ctx.save();ctx.globalCompositeOperation="screen";
  ctx.fillStyle="rgba(244,250,252,.28)";
  for(let i=0;i<Math.floor(36*detail);i++){
    const a=rand(i*3.2)*Math.PI*2,rr=Math.sqrt(rand(i*7.2))*R*.88,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*.74,w=R*(.04+rand(i)*.20),h=R*(.008+rand(i*8)*.025);
    ctx.beginPath();ctx.ellipse(x,y,w,h,a*.15,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();

  const night=ctx.createLinearGradient(cx-R*.22,0,cx+R,0);
  night.addColorStop(0,"rgba(0,0,0,0)");night.addColorStop(.50,"rgba(0,0,8,.08)");night.addColorStop(.72,"rgba(0,0,10,.45)");night.addColorStop(1,"rgba(0,0,8,.92)");
  ctx.fillStyle=night;ctx.fillRect(cx-R,cy-R,R*2,R*2);

  ctx.save();ctx.globalCompositeOperation="screen";
  for(let i=0;i<54;i++){
    const xx=cx+R*(.18+rand(i*4.3)*.70),yy=cy+R*(-.48+rand(i*7.8)*.94);
    if(Math.hypot(xx-cx,yy-cy)<R*.92)dot(xx,yy,Math.max(.35,R*.004),"#ffc873",.14+rand(i)*.26);
  }
  ctx.restore();
  ctx.restore();

  ctx.strokeStyle="rgba(120,214,255,.70)";ctx.lineWidth=Math.max(1.1,R*.010);ctx.beginPath();ctx.arc(cx,cy,R+1.5,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle="rgba(157,232,255,.25)";ctx.lineWidth=Math.max(1,R*.027);ctx.beginPath();ctx.arc(cx,cy,R+2.2,-2.70,-.36);ctx.stroke();
}
function drawMoon(x,y,R){
  ctx.save();ctx.beginPath();ctx.arc(x,y,R,0,Math.PI*2);ctx.clip();
  ctx.fillStyle=sphereGradient(x,y,R,.38,-.34,"#e6e4df","#5e6269");ctx.fillRect(x-R,y-R,R*2,R*2);
  ctx.fillStyle="rgba(50,52,55,.23)";
  for(let i=0;i<16;i++){ctx.beginPath();ctx.arc(x+(rand(i*5)-.5)*R*1.3,y+(rand(i*8)-.5)*R*1.25,R*(.025+rand(i*2)*.11),0,Math.PI*2);ctx.fill()}
  ctx.restore();
}
function drawEarthMoon(time,s){
  const cx=W*.44+(pointer.x-.5)*10,cy=H*.52+(pointer.y-.5)*7,R=Math.min(W,H)*.16;
  drawEarthGlobe(cx,cy,R,time,1);
  const orbit=R*3.0;ctx.strokeStyle="rgba(180,213,245,.11)";ctx.setLineDash([3,7]);ctx.beginPath();ctx.ellipse(cx,cy,orbit,orbit*.54,-.06,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  const a=2.3+time*.000031,mx=cx+Math.cos(a)*orbit,my=cy+Math.sin(a)*orbit*.54;drawMoon(mx,my,R*.28);
  registerHit(s,"earth",cx,cy,R*.86);registerHit(s,"moon",mx,my,R*.34);
}

function drawEarth(time,s){
  const R=Math.min(W,H)*.385,cx=W*.50+(pointer.x-.5)*14,cy=H*.52+(pointer.y-.5)*9;
  drawEarthGlobe(cx,cy,R,time,1.35);
  registerHit(s,"earth",cx,cy,R*.83);registerHit(s,"atmosphere",cx-R*.72,cy-R*.49,34);registerHit(s,"ocean",cx+R*.18,cy+R*.24,44);
  label("ATMOSPHERIC LIMB",cx-R*.88,cy-R*.58,.46);
}

function drawOrbit(time,s){
  const horizonY=H*.72,R=Math.max(W,H)*1.18,cx=W*.5,cy=horizonY+R*.84;
  const earth=ctx.createRadialGradient(cx,cy-R*.67,R*.04,cx,cy,R);
  earth.addColorStop(0,"#3b8bb0");earth.addColorStop(.50,"#0d4c78");earth.addColorStop(.78,"#062842");earth.addColorStop(1,"#020914");
  ctx.fillStyle=earth;ctx.beginPath();ctx.arc(cx,cy,R,Math.PI,Math.PI*2);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,Math.PI,Math.PI*2);ctx.clip();
  ctx.fillStyle="rgba(237,247,249,.33)";
  for(let i=0;i<24;i++){const x=rand(i*4)*W,y=horizonY+rand(i*7)*(H-horizonY)*.45,w=55+rand(i)*160,h=4+rand(i*5)*20;ctx.beginPath();ctx.ellipse(x,y,w,h,rand(i)*.25,0,Math.PI*2);ctx.fill()}
  ctx.restore();
  ctx.strokeStyle="rgba(116,216,255,.88)";ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(cx,cy,R,Math.PI*1.055,Math.PI*1.945);ctx.stroke();
  ctx.strokeStyle="rgba(110,255,174,.26)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,R+5,Math.PI*1.12,Math.PI*1.48);ctx.stroke();
  glow(W*.80,horizonY-7,90,"#ffd18a",.12);
  registerHit(s,"limb",W*.50,horizonY,54);registerHit(s,"airglow",W*.72,horizonY-18,40);label("LOW EARTH ORBIT",W*.08,H*.80,.47);
}

function drawAtmosphere(time,s){
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#01030a");sky.addColorStop(.18,"#061326");sky.addColorStop(.42,"#154a78");sky.addColorStop(.66,"#4d98c6");sky.addColorStop(.83,"#9ac8df");sky.addColorStop(1,"#dbe9ee");ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  const horizon=H*.77,ground=ctx.createLinearGradient(0,horizon,0,H);ground.addColorStop(0,"#375f6c");ground.addColorStop(1,"#08161d");ctx.fillStyle=ground;ctx.fillRect(0,horizon,W,H-horizon);
  ctx.fillStyle="rgba(248,251,252,.50)";
  for(let i=0;i<28;i++){const x=rand(i*5.2)*W,y=H*(.54+rand(i*7.8)*.23),rw=45+rand(i*2.1)*150,rh=5+rand(i*9.1)*22;ctx.beginPath();ctx.ellipse(x,y,rw,rh,rand(i)*.28,0,Math.PI*2);ctx.fill()}
  const kx=W*.72,ky=H*.27;line(kx-74,ky,kx+74,ky,"#8fe8ff",1,.25);label("100 km · KÁRMÁN LINE (CONVENTION)",kx-70,ky-9,.46);
  registerHit(s,"karman",kx,ky,40);registerHit(s,"troposphere",W*.29,H*.67,52);registerHit(s,"clouds",W*.61,H*.67,52);
}

function drawSurface(time,s){
  const horizon=H*.61,sky=ctx.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,"#0b3b69");sky.addColorStop(.50,"#4b91bc");sky.addColorStop(1,"#d3e5ed");ctx.fillStyle=sky;ctx.fillRect(0,0,W,horizon);
  glow(W*.82,H*.18,110,"#ffe2a0",.23);dot(W*.82,H*.18,18,"#fff4c8",1);
  ctx.fillStyle="rgba(253,254,255,.78)";
  for(let i=0;i<15;i++){const x=rand(i*6)*W,y=H*(.16+rand(i*9)*.27),rw=40+rand(i*2)*125,rh=8+rand(i*11)*23;ctx.beginPath();ctx.ellipse(x,y,rw,rh,0,0,Math.PI*2);ctx.fill()}
  const sea=ctx.createLinearGradient(0,horizon,0,H);sea.addColorStop(0,"#367f99");sea.addColorStop(.26,"#1a6081");sea.addColorStop(1,"#061b2b");ctx.fillStyle=sea;ctx.fillRect(0,horizon,W,H-horizon);
  for(let i=0;i<40;i++){const y=horizon+8+i*(H-horizon)/41;ctx.strokeStyle="rgba(229,247,255,"+(.05+i*.0026)+")";ctx.beginPath();for(let x=0;x<=W;x+=24){const wave=Math.sin(x*.021+i*1.45+time*.00055)*2.7*(i/40);if(x===0)ctx.moveTo(x,y+wave);else ctx.lineTo(x,y+wave)}ctx.stroke()}
  const reflection=ctx.createLinearGradient(W*.72,horizon,W*.90,H);reflection.addColorStop(0,"rgba(255,229,157,.22)");reflection.addColorStop(1,"rgba(255,229,157,0)");ctx.fillStyle=reflection;ctx.beginPath();ctx.moveTo(W*.76,horizon);ctx.lineTo(W*.89,H);ctx.lineTo(W*.70,H);ctx.closePath();ctx.fill();
  registerHit(s,"ocean",W*.36,H*.78,58);registerHit(s,"cloud",W*.52,H*.31,48);registerHit(s,"horizon",W*.52,horizon,56);label("HOME · HUMAN SCALE",W*.06,H*.90,.56);
}

const sceneFns=[drawHorizon,drawWeb,drawLaniakea,drawLocalSheet,drawLocalGroup,drawMilkyWay,drawNeighborhood,drawOort,drawOuterSolar,drawInnerSolar,drawEarthMoon,drawEarth,drawOrbit,drawAtmosphere,drawSurface];

function renderScene(index,time,alpha,zoom){withScene(alpha,zoom,function(){if(sceneFns[index])sceneFns[index](time,index)})}
function drawTargetRings(){
  hitAreas.forEach(function(h){
    const active=(hovered&&hovered.obj===h.obj)||pinned===h.obj;
    ctx.strokeStyle=active?"rgba(199,245,255,.84)":"rgba(169,218,255,.10)";ctx.lineWidth=active?1.25:.65;
    ctx.beginPath();ctx.arc(h.x,h.y,active?h.r+7:h.r,0,Math.PI*2);ctx.stroke();
    if(active){ctx.strokeStyle="rgba(188,236,255,.22)";ctx.beginPath();ctx.arc(h.x,h.y,h.r+14,0,Math.PI*2);ctx.stroke()}
  });
}
function hitTest(){
  let best=null,bestD=Infinity;
  hitAreas.forEach(function(h){const d=Math.hypot(pointer.sx-h.x,pointer.sy-h.y);if(d<h.r+14&&d<bestD){best=h;bestD=d}});
  hovered=best;els.lens.classList.toggle("active",!!best);
  if(best&&!pinned){
    const o=best.obj;els.hint.hidden=false;els.hint.querySelector(".hint-type").textContent=o.type;els.hint.querySelector(".hint-name").textContent=o.name;els.hint.querySelector(".hint-summary").textContent=o.summary;
    const pad=16,tw=230,th=125;let x=pointer.sx+18,y=pointer.sy+18;if(x+tw>W-pad)x=pointer.sx-tw-18;if(y+th>H-pad)y=pointer.sy-th-18;
    els.hint.style.transform="translate("+Math.max(pad,x)+"px,"+Math.max(pad,y)+"px)";
  }else els.hint.hidden=true;
}
function inspect(o){
  pinned=o||null;
  if(!o){els.inspector.classList.remove("open");els.inspector.setAttribute("aria-hidden","true");return}
  els.inspectorType.textContent=o.type;els.inspectorTitle.textContent=o.name;els.inspectorText.textContent=o.text;
  els.inspectorFacts.replaceChildren.apply(els.inspectorFacts,o.facts.map(function(pair){
    const d=document.createElement("div"),dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=pair[0];dd.textContent=pair[1];d.append(dt,dd);return d;
  }));
  els.inspector.classList.add("open");els.inspector.setAttribute("aria-hidden","false");hideStageToast();
}

function frame(time){
  getStageMetrics();updateUI();
  pointer.x=lerp(pointer.x,pointer.tx,reduced?1:.055);pointer.y=lerp(pointer.y,pointer.ty,reduced?1:.055);
  const surfaceFade=stageIndex>=13?clamp(1-(stageIndex-13+localP)*.68):1;
  drawBackdrop(time,surfaceFade);hitAreas=[];
  const q=smooth(clamp((localP-.50)/.50)),next=Math.min(STAGES.length-1,stageIndex+1);
  if(next===stageIndex)renderScene(stageIndex,time,1,1);
  else{
    renderScene(stageIndex,time,1-q,1+q*1.04);
    renderScene(next,time,q,.42+q*.58);
  }
  drawTargetRings();hitTest();requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

addEventListener("pointermove",function(e){
  pointer.sx=e.clientX;pointer.sy=e.clientY;pointer.tx=e.clientX/W;pointer.ty=e.clientY/H;
  els.lens.style.transform="translate("+e.clientX+"px,"+e.clientY+"px)";
  const ra=((pointer.tx*24+24)%24).toFixed(1),dec=((.5-pointer.ty)*180).toFixed(1);
  els.pointer.textContent="RA "+ra+"h / DEC "+dec+"°";
},{passive:true});
addEventListener("pointerleave",function(){els.lens.style.opacity=0});
addEventListener("pointerenter",function(){els.lens.style.opacity=.65});
canvas.addEventListener("click",function(){if(hovered)inspect(hovered.obj)});
els.close.addEventListener("click",function(){inspect(null)});
els.toastClose.addEventListener("click",hideStageToast);
els.stageInfo.addEventListener("click",function(){showStageToast(false)});
els.helpToggle.addEventListener("click",function(){const open=els.help.hidden;els.help.hidden=!open;els.helpToggle.setAttribute("aria-expanded",String(open))});
els.restart.addEventListener("click",function(){scrollTo({top:0,behavior:reduced?"auto":"smooth"})});

function jumpTo(i){
  const el=document.querySelector('.stage-spacer[data-stage="'+i+'"]');
  if(el)scrollTo({top:el.offsetTop-H*.24,behavior:reduced?"auto":"smooth"});
}
addEventListener("keydown",function(e){
  if(e.key==="Escape")inspect(null);
  if(["ArrowDown","PageDown"].indexOf(e.key)>=0){e.preventDefault();jumpTo(Math.min(STAGES.length-1,stageIndex+1))}
  if(["ArrowUp","PageUp"].indexOf(e.key)>=0){e.preventDefault();jumpTo(Math.max(0,stageIndex-1))}
  if(e.key==="Home"){e.preventDefault();scrollTo({top:0,behavior:reduced?"auto":"smooth"})}
  if(e.key==="End"){e.preventDefault();jumpTo(STAGES.length-1)}
});

function initSound(){
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  audio=new AC();const osc=audio.createOscillator(),gain=audio.createGain(),lfo=audio.createOscillator(),lg=audio.createGain();
  osc.type="sine";osc.frequency.value=46;lfo.frequency.value=.05;lg.gain.value=6;gain.gain.value=.0001;
  lfo.connect(lg).connect(osc.frequency);osc.connect(gain).connect(audio.destination);osc.start();lfo.start();audio._gain=gain;
}
els.sound.addEventListener("click",async function(){
  if(!audio)initSound();if(!audio)return;if(audio.state==="suspended")await audio.resume();
  soundOn=!soundOn;audio._gain.gain.cancelScheduledValues(audio.currentTime);audio._gain.gain.linearRampToValueAtTime(soundOn ? .014 : .0001,audio.currentTime+.7);
  els.sound.setAttribute("aria-pressed",String(soundOn));
});
