import * as THREE from 'three';
import { createStarField } from './StarField.js';
import { createSpiralGalaxy, createGlowTexture } from './Galaxy.js';
import { createCosmicWeb } from './CosmicWeb.js';
import { createSolarSystem } from './SolarSystem.js';
import { createEarthSystem } from './EarthSystem.js';
import { createAtmosphereScene } from './AtmosphereScene.js';
import { createSurfaceScene } from './SurfaceScene.js';

function rand(seed){const x=Math.sin(seed*87.31)*43758.5453;return x-Math.floor(x)}
function proxy(radius=15){return new THREE.Mesh(new THREE.SphereGeometry(radius,16,12),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}))}

export class UniverseWorld {
  constructor(scene, quality, stages) {
    this.scene=scene;this.quality=quality;this.stages=stages;this.interactives=[];this.updatables=[];
  }

  build() {
    this.scene.background=new THREE.Color('#010205');
    this.scene.fog=new THREE.FogExp2('#010205',0.000115);
    this.scene.add(new THREE.AmbientLight('#5e7190',.10));

    const starField=createStarField(this.quality.stars);this.scene.add(starField);this.updatables.push(starField);
    this._buildObservable();this._buildWeb();this._buildLaniakea();this._buildLocalSheet();this._buildLocalGroup();this._buildMilkyWay();this._buildNeighborhood();this._buildOort();this._buildSolarSystems();this._buildEarth();this._buildAtmosphere();this._buildSurface();
  }

  _stageObject(stageId, objectId) {
    return this.stages.find(s=>s.id===stageId)?.objects.find(o=>o.id===objectId);
  }
  _register(object,stageId,objectId) {
    const data=this._stageObject(stageId,objectId);if(data)this.interactives.push({object,data:{...data,stageId}});
  }

  _buildObservable() {
    const g=new THREE.Group();g.position.z=-100;
    const tex=createGlowTexture('#c2d3ff');
    for(let i=0;i<240;i+=1){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.08+rand(i*3)*.19,color:rand(i*7)>.68?'#ffd3a0':'#a9c4ff'}));const r=80+Math.pow(rand(i*5),.55)*420,a=rand(i*9)*Math.PI*2,b=(rand(i*11)-.5)*Math.PI;s.position.set(Math.cos(a)*Math.cos(b)*r,Math.sin(b)*r*.62,Math.sin(a)*Math.cos(b)*r);const z=3+rand(i*13)*12;s.scale.set(z*2.2,z,1);g.add(s)}
    const horizon=proxy(30);horizon.position.set(0,45,-155);g.add(horizon);this._register(horizon,'observable','cosmic-horizon');
    const cmb=proxy(26);cmb.position.set(-92,-18,-110);g.add(cmb);this._register(cmb,'observable','cmb');
    this.scene.add(g);
  }

  _buildWeb() {
    const web=createCosmicWeb({count:this.quality.webNodes,span:380,seed:4});web.position.z=-900;this.scene.add(web);
    const node=proxy(24);node.position.set(60,18,-900);this.scene.add(node);this._register(node,'web','web-node');
    const voidHit=proxy(38);voidHit.position.set(-95,-38,-930);this.scene.add(voidHit);this._register(voidHit,'web','cosmic-void');
  }
  _buildLaniakea(){const w=createCosmicWeb({count:this.quality.webNodes+20,span:470,seed:9,color:'#8b75ff'});w.position.set(18,0,-1780);w.scale.set(1.2,.75,1.05);this.scene.add(w);const h=proxy(30);h.position.set(12,-4,-1780);this.scene.add(h);this._register(h,'laniakea','great-attractor')}
  _buildLocalSheet(){const g=new THREE.Group();g.position.z=-2600;for(let i=0;i<34;i+=1){const gal=createSpiralGalaxy({radius:4+rand(i*3)*10,count:500,arms:2+(i%2),seed:i+20,flatten:.2+rand(i)*.35,rotation:rand(i*8)*Math.PI});gal.position.set((rand(i*5)-.5)*360,(rand(i*7)-.5)*80,(rand(i*9)-.5)*290);gal.scale.setScalar(.75+rand(i*11)*.8);g.add(gal)}const virgo=createSpiralGalaxy({radius:46,count:4200,arms:3,seed:77,flatten:.28,rotation:.4});virgo.position.set(105,25,-35);g.add(virgo);const hit=proxy(42);hit.position.copy(virgo.position);g.add(hit);this._register(hit,'local-sheet','virgo');this.scene.add(g)}
  _buildLocalGroup(){const g=new THREE.Group();g.position.z=-3420;const mw=createSpiralGalaxy({radius:105,count:this.quality.galaxyStars,arms:4,seed:12,flatten:.25,rotation:-.2});mw.position.set(-70,-8,0);g.add(mw);const and=createSpiralGalaxy({radius:95,count:Math.round(this.quality.galaxyStars*.8),arms:3,seed:32,flatten:.22,rotation:.35});and.position.set(105,24,-55);g.add(and);const tri=createSpiralGalaxy({radius:44,count:3500,arms:2,seed:51,flatten:.32,rotation:-.5});tri.position.set(50,-52,30);g.add(tri);[['milky-way',mw,55],['andromeda',and,50],['triangulum',tri,28]].forEach(([id,gal,r])=>{const h=proxy(r);h.position.copy(gal.position);g.add(h);this._register(h,'local-group',id)});this.scene.add(g)}
  _buildMilkyWay(){const g=createSpiralGalaxy({radius:260,count:this.quality.galaxyStars*2,arms:4,seed:101,flatten:.18,rotation:-.25});g.position.z=-4320;g.rotation.x=.14;this.scene.add(g);const core=proxy(28);core.position.set(0,0,-4320);this.scene.add(core);this._register(core,'milky-way','sagittarius-a');const orion=proxy(22);orion.position.set(118,7,-4240);this.scene.add(orion);this._register(orion,'milky-way','orion-spur')}
  _buildNeighborhood(){const g=new THREE.Group();g.position.z=-5200;const count=this.quality.neighborhoodStars;const positions=new Float32Array(count*3),colors=new Float32Array(count*3);const palette=['#9fc4ff','#d8e5ff','#fff3d7','#ffd39a','#ff9d7f'];for(let i=0;i<count;i+=1){positions[i*3]=(rand(i*3)-.5)*520;positions[i*3+1]=(rand(i*5)-.5)*300;positions[i*3+2]=(rand(i*7)-.5)*520;const c=new THREE.Color(palette[Math.floor(rand(i*11)*palette.length)]);colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));g.add(new THREE.Points(geo,new THREE.PointsMaterial({size:1.6,vertexColors:true,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false})));const sun=new THREE.Mesh(new THREE.SphereGeometry(8,32,24),new THREE.MeshBasicMaterial({color:'#fff0b5'}));sun.position.set(0,0,0);g.add(sun);const sg=new THREE.Sprite(new THREE.SpriteMaterial({map:createGlowTexture('#ffd070'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.8}));sg.scale.set(80,80,1);sun.add(sg);this._register(sun,'neighborhood','sun-neighborhood');const sirius=proxy(10);sirius.position.set(130,55,-70);g.add(sirius);this._register(sirius,'neighborhood','sirius');this.scene.add(g)}
  _buildOort(){const g=new THREE.Group();g.position.z=-6040;const count=this.quality.reduced?1800:3200,positions=new Float32Array(count*3);for(let i=0;i<count;i+=1){const r=135+Math.pow(rand(i*3),.62)*180,a=rand(i*5)*Math.PI*2,p=Math.acos(2*rand(i*7)-1);positions[i*3]=Math.sin(p)*Math.cos(a)*r;positions[i*3+1]=Math.cos(p)*r;positions[i*3+2]=Math.sin(p)*Math.sin(a)*r}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));g.add(new THREE.Points(geo,new THREE.PointsMaterial({color:'#d8e9ff',size:.75,transparent:true,opacity:.36,depthWrite:false})));const sun=new THREE.Mesh(new THREE.SphereGeometry(5,24,16),new THREE.MeshBasicMaterial({color:'#fff2bd'}));g.add(sun);const h=proxy(42);h.position.set(190,35,-15);g.add(h);this._register(h,'oort','oort-cloud');this.scene.add(g)}
  _buildSolarSystems(){const outer=createSolarSystem({mode:'outer',z:-6680});this.scene.add(outer.group);this.updatables.push(outer.group);outer.interactives.forEach(({object,id})=>this._register(object,'outer-solar',id));const inner=createSolarSystem({mode:'inner',z:-7340});this.scene.add(inner.group);this.updatables.push(inner.group);inner.interactives.forEach(({object,id})=>this._register(object,'inner-solar',id))}
  _buildEarth(){const em=createEarthSystem({z:-7910,radius:38,withMoon:true,moonDistance:132});this.scene.add(em.group);this.updatables.push(em.group);em.interactives.forEach(({object,id})=>this._register(object,'earth-moon',id));const earth=createEarthSystem({z:-8330,radius:72,withMoon:false});this.scene.add(earth.group);this.updatables.push(earth.group);earth.interactives.forEach(({object,id})=>this._register(object,'earth',id));const atmosphereHit=proxy(16);atmosphereHit.position.set(-66,42,-8330);this.scene.add(atmosphereHit);this._register(atmosphereHit,'earth','atmosphere');const orbitHit=proxy(72);orbitHit.position.set(0,0,-8330);this.scene.add(orbitHit);this._register(orbitHit,'orbit','earth-limb')}
  _buildAtmosphere(){const atm=createAtmosphereScene(-9060);this.scene.add(atm.group);atm.interactives.forEach(({object,id})=>this._register(object,'atmosphere',id))}
  _buildSurface(){const s=createSurfaceScene(-9730);this.scene.add(s.group);this.updatables.push(s.group);s.interactives.forEach(({object,id})=>this._register(object,'surface',id))}

  update(time){this.updatables.forEach(object=>object.userData.update?.(time));}
}
