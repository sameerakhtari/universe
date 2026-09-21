import * as THREE from 'three';

function seeded(seed) {
  let x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function canvasTexture(width = 1024, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  return { canvas, ctx: canvas.getContext('2d') };
}

function finish(canvas, colorSpace = THREE.SRGBColorSpace) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function noiseDots(ctx, width, height, color, count, minR, maxR, alpha = 1) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  for (let i = 0; i < count; i += 1) {
    const x = seeded(i * 3.17) * width;
    const y = seeded(i * 7.31) * height;
    const r = minR + seeded(i * 11.9) * (maxR - minR);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export function createEarthTexture() {
  const { canvas, ctx } = canvasTexture(1600, 800);
  const ocean = ctx.createLinearGradient(0, 0, 0, 800);
  ocean.addColorStop(0, '#205c7d'); ocean.addColorStop(.45, '#0f5077'); ocean.addColorStop(1, '#073853');
  ctx.fillStyle = ocean; ctx.fillRect(0, 0, 1600, 800);

  const continents = [
    [[135,180],[190,125],[285,92],[360,125],[408,195],[378,245],[325,260],[293,320],[245,348],[206,315],[170,260]],
    [[340,335],[390,350],[420,405],[412,475],[386,550],[365,635],[325,680],[305,610],[315,530],[292,465],[302,395]],
    [[410,75],[465,55],[500,95],[470,145],[430,140]],
    [[690,155],[760,105],[865,90],[950,105],[1040,120],[1135,158],[1238,168],[1335,210],[1385,260],[1340,304],[1255,312],[1188,278],[1105,300],[1030,274],[950,250],[885,270],[820,236],[765,246],[710,220],[662,205]],
    [[735,260],[812,245],[882,285],[900,360],[870,445],[818,535],[760,522],[725,445],[706,360]],
    [[900,300],[958,315],[985,355],[1020,344],[1065,365],[1092,420],[1140,430],[1190,470],[1160,495],[1105,478],[1062,446],[1010,432],[958,392]],
    [[1210,515],[1290,490],[1368,528],[1396,590],[1362,640],[1280,655],[1208,610]],
    [[0,705],[150,690],[300,706],[460,690],[620,705],[800,694],[980,707],[1160,689],[1340,703],[1600,688],[1600,800],[0,800]]
  ];
  continents.forEach((points, index) => {
    const fill = index === continents.length - 1 ? '#dce7e5' : ['#456f42','#4e7748','#c8d7cf','#5f7443','#52733e','#6d7947','#7a8055'][index % 7];
    ctx.fillStyle = fill;
    ctx.beginPath();
    points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath(); ctx.fill();
  });

  ctx.fillStyle = 'rgba(184,147,87,.58)';
  [[775,315,85,48],[980,220,125,38],[1310,565,70,38],[285,220,48,28]].forEach(([x,y,rx,ry]) => { ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill(); });
  noiseDots(ctx,1600,800,'#bfd0b7',1800,.3,1.6,.11);
  noiseDots(ctx,1600,800,'#051d29',1400,.25,1.1,.11);

  const north = ctx.createLinearGradient(0,0,0,115); north.addColorStop(0,'rgba(245,250,249,.96)');north.addColorStop(1,'rgba(230,244,244,0)');ctx.fillStyle=north;ctx.fillRect(0,0,1600,130);
  return finish(canvas);
}

export function createCloudTexture() {
  const { canvas, ctx } = canvasTexture(1200, 600);
  ctx.clearRect(0,0,1200,600);
  ctx.fillStyle = 'rgba(255,255,255,.52)';
  for (let i=0;i<520;i+=1) {
    const lat = seeded(i*6.7);
    const y = 55 + lat * 490;
    const x = seeded(i*9.2) * 1200;
    const w = 12 + seeded(i*3.9)*55;
    const h = 2 + seeded(i*11.4)*10;
    ctx.beginPath();ctx.ellipse(x,y,w,h,seeded(i*5.1)*.35,0,Math.PI*2);ctx.fill();
  }
  return finish(canvas);
}

export function createJupiterTexture() {
  const {canvas,ctx}=canvasTexture(1024,512);
  const bands=['#d2ad88','#f0ddbd','#a97558','#e9caa7','#b78063','#f4dfbe','#93624e','#d9ad86','#f0d7b1','#a46a52','#ead0a8','#c69271'];
  bands.forEach((color,i)=>{ctx.fillStyle=color;ctx.fillRect(0,i*512/bands.length,1024,512/bands.length+1)});
  ctx.fillStyle='rgba(255,244,218,.22)';for(let i=0;i<120;i+=1){ctx.fillRect(seeded(i*3)*1024,seeded(i*7)*512,20+seeded(i*9)*80,1+seeded(i*4)*2)}
  ctx.fillStyle='#a34f38';ctx.beginPath();ctx.ellipse(720,335,75,27,-.08,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(236,178,143,.75)';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(720,335,86,35,-.08,0,Math.PI*2);ctx.stroke();
  return finish(canvas);
}

export function createSaturnTexture() {
  const {canvas,ctx}=canvasTexture(1024,512);ctx.fillStyle='#d8c69d';ctx.fillRect(0,0,1024,512);
  for(let i=0;i<18;i+=1){ctx.fillStyle=i%3===0?'rgba(137,112,74,.14)':'rgba(255,244,211,.12)';ctx.fillRect(0,i*512/18,1024,512/30)}
  return finish(canvas);
}

export function createMarsTexture() {
  const {canvas,ctx}=canvasTexture(1024,512);ctx.fillStyle='#a94e32';ctx.fillRect(0,0,1024,512);
  noiseDots(ctx,1024,512,'#6f291f',540,2,18,.35);noiseDots(ctx,1024,512,'#d38253',410,1,12,.24);
  ctx.fillStyle='rgba(241,227,207,.84)';ctx.fillRect(0,0,1024,18);ctx.fillRect(0,494,1024,18);
  return finish(canvas);
}

export function createMoonTexture() {
  const {canvas,ctx}=canvasTexture(1024,512);ctx.fillStyle='#9b9b98';ctx.fillRect(0,0,1024,512);
  noiseDots(ctx,1024,512,'#5f5f60',450,2,18,.22);noiseDots(ctx,1024,512,'#c7c6c1',350,1,9,.16);
  return finish(canvas);
}

export function createSunTexture() {
  const {canvas,ctx}=canvasTexture(1024,512);const g=ctx.createLinearGradient(0,0,0,512);g.addColorStop(0,'#f7b33f');g.addColorStop(.5,'#ffd36a');g.addColorStop(1,'#e98a26');ctx.fillStyle=g;ctx.fillRect(0,0,1024,512);
  noiseDots(ctx,1024,512,'#fff0a0',2200,.3,2,.18);noiseDots(ctx,1024,512,'#c86a20',1200,.3,1.8,.12);
  return finish(canvas);
}
