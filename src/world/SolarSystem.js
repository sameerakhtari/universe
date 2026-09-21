import * as THREE from 'three';
import { createJupiterTexture, createSaturnTexture, createMarsTexture, createEarthTexture, createSunTexture } from './TextureFactory.js';
import { createGlowTexture } from './Galaxy.js';

function orbitLine(radius, color='#6f8198', opacity=.18) {
  const points=[];for(let i=0;i<=160;i+=1){const a=i/160*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius))}
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity}));
}
function sphere(radius,map,color='#ffffff',roughness=.72){return new THREE.Mesh(new THREE.SphereGeometry(radius,48,32),new THREE.MeshStandardMaterial({map,color,roughness,metalness:0}))}
function flatTexture(base, band='#ffffff') {const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,512,256);for(let i=0;i<9;i+=1){x.fillStyle=`rgba(255,255,255,${i % 2 ? .05 : .02})`;x.fillRect(0,i*28,512,9)}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}

export function createSolarSystem({mode='outer',z=0}={}) {
  const group=new THREE.Group();group.position.z=z;
  const interactives=[];
  const sunMat=new THREE.MeshBasicMaterial({map:createSunTexture(),color:'#fff4c7'});
  const sun=new THREE.Mesh(new THREE.SphereGeometry(mode==='outer'?15:22,64,40),sunMat);sun.name='Sun';group.add(sun);interactives.push({object:sun,id:'sun'});
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:createGlowTexture('#ffc66f'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.7}));const gs=mode==='outer'?105:145;glow.scale.set(gs,gs,1);sun.add(glow);
  const light=new THREE.PointLight('#fff0cb',mode==='outer'?4200:5200,900,1.65);sun.add(light);

  const specs=mode==='outer' ? [
    {id:'jupiter',r:12.5,orbit:88,speed:.26,map:createJupiterTexture(),phase:.3,tilt:.05},
    {id:'saturn',r:11,orbit:132,speed:.19,map:createSaturnTexture(),phase:2.0,ring:true,tilt:.12},
    {id:'uranus',r:7.5,orbit:174,speed:.14,map:flatTexture('#8bc7cf'),phase:4.0,tilt:1.70},
    {id:'neptune',r:7.4,orbit:218,speed:.11,map:flatTexture('#315fd0'),phase:5.2,tilt:.49}
  ] : [
    {id:'mercury',r:4.1,orbit:50,speed:.80,map:flatTexture('#817b73'),phase:1.1,tilt:.01},
    {id:'venus',r:6.5,orbit:78,speed:.60,map:flatTexture('#c79d58'),phase:3.0,tilt:.05},
    {id:'earth-orbit',r:7.0,orbit:112,speed:.48,map:createEarthTexture(),phase:5.1,tilt:.41},
    {id:'mars',r:5.0,orbit:150,speed:.38,map:createMarsTexture(),phase:1.9,tilt:.44}
  ];
  const bodies=[];
  specs.forEach((spec,index)=>{
    const pivot=new THREE.Group();pivot.rotation.y=spec.phase;group.add(pivot);group.add(orbitLine(spec.orbit,'#8391a7',.13));
    const body=sphere(spec.r,spec.map);body.position.x=spec.orbit;body.rotation.z=spec.tilt;body.name=spec.id;pivot.add(body);
    if(spec.ring){
      const ringGeo=new THREE.RingGeometry(spec.r*1.45,spec.r*2.45,128);
      const ringMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`varying vec2 vUv;void main(){float r=length(vUv-vec2(.5))*2.0;float bands=.62+.20*sin(r*94.0)+.10*sin(r*211.0);float cassini=1.0-smoothstep(.018,.045,abs(r-.78));float edge=smoothstep(.58,.63,r)*(1.0-smoothstep(.97,1.0,r));vec3 c=mix(vec3(.49,.42,.31),vec3(.92,.84,.66),bands);float a=edge*(.62+.26*bands)*(1.0-.72*cassini);gl_FragColor=vec4(c,a);}`});
      const ring=new THREE.Mesh(ringGeo,ringMat);ring.rotation.x=Math.PI/2;body.add(ring);
    }
    bodies.push({pivot,body,spec,index});interactives.push({object:body,id:spec.id});
  });
  group.userData.update=(time)=>{bodies.forEach(({pivot,body,spec,index})=>{const rate=mode==='outer' ? .018 : .032;pivot.rotation.y=spec.phase+time*rate*spec.speed;body.rotation.y=time*.055*(1+index*.12)});sun.rotation.y=time*.018};
  return {group,interactives,sun};
}

function createRingTexture(){const c=document.createElement('canvas');c.width=512;c.height=32;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,512,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.10,'rgba(193,175,139,.65)');g.addColorStop(.33,'rgba(238,223,186,.95)');g.addColorStop(.46,'rgba(80,65,48,.25)');g.addColorStop(.57,'rgba(229,214,177,.92)');g.addColorStop(.82,'rgba(160,142,111,.58)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,512,32);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
