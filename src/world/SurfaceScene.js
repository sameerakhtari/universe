import * as THREE from 'three';
import { createGlowTexture } from './Galaxy.js';
function rand(seed){const x=Math.sin(seed*52.7)*43758.5453;return x-Math.floor(x)}
export function createSurfaceScene(z=-9730){
  const group=new THREE.Group();group.position.z=z;
  const sky=new THREE.Mesh(new THREE.SphereGeometry(520,48,32),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color('#0b477a')},bottom:{value:new THREE.Color('#c5e2ef')}},vertexShader:`varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`varying float h;uniform vec3 top;uniform vec3 bottom;void main(){float t=smoothstep(-.18,.85,h);gl_FragColor=vec4(mix(bottom,top,t),1.0);}`}));group.add(sky);
  const oceanMat=new THREE.ShaderMaterial({transparent:false,uniforms:{uTime:{value:0},uDeep:{value:new THREE.Color('#05263a')},uShallow:{value:new THREE.Color('#2e7f9a')}},vertexShader:`uniform float uTime;varying float vWave;varying vec3 vPos;void main(){vec3 p=position;float w=sin(p.x*.035+uTime*.9)*1.15+sin(p.y*.051-uTime*.65)*.75;p.z+=w;vWave=w;vPos=p;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,fragmentShader:`varying float vWave;varying vec3 vPos;uniform vec3 uDeep;uniform vec3 uShallow;void main(){float f=.5+.5*sin(vWave*.7);vec3 c=mix(uDeep,uShallow,.22+f*.23);float glint=pow(max(0.0,1.0-abs(vWave)*.35),8.0)*.14;gl_FragColor=vec4(c+glint,1.0);}`});
  const ocean=new THREE.Mesh(new THREE.PlaneGeometry(900,900,150,150),oceanMat);ocean.rotation.x=-Math.PI/2;ocean.position.y=-20;group.add(ocean);
  const sun=new THREE.Sprite(new THREE.SpriteMaterial({map:createGlowTexture('#fff0b0'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.9}));sun.position.set(190,150,-260);sun.scale.set(82,82,1);group.add(sun);
  const cloudTex=createGlowTexture('#ffffff');for(let i=0;i<28;i+=1){const c=new THREE.Sprite(new THREE.SpriteMaterial({map:cloudTex,transparent:true,opacity:.15+rand(i)*.18,depthWrite:false}));c.position.set((rand(i*3)-.5)*620,75+rand(i*5)*95,-80-rand(i*9)*520);const size=35+rand(i*7)*75;c.scale.set(size*2.2,size*.45,1);group.add(c)}
  const horizon=new THREE.Mesh(new THREE.SphereGeometry(15,16,12),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));horizon.position.set(0,8,-240);group.add(horizon);
  ocean.userData.interactiveHit=true;
  group.userData.update=(time)=>{oceanMat.uniforms.uTime.value=time};
  return {group,interactives:[{object:ocean,id:'ocean-surface'},{object:horizon,id:'horizon'}]};
}
