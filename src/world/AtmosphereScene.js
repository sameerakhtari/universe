import * as THREE from 'three';
import { createGlowTexture } from './Galaxy.js';
function rand(seed){const x=Math.sin(seed*41.73)*43758.5453;return x-Math.floor(x)}

export function createAtmosphereScene(z=-9060){
  const group=new THREE.Group();group.position.z=z;
  const dome=new THREE.Mesh(new THREE.SphereGeometry(430,48,32),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color('#020611')},mid:{value:new THREE.Color('#1f6fa5')},bottom:{value:new THREE.Color('#b4d7e7')}},vertexShader:`varying float h;void main(){vec4 w=modelMatrix*vec4(position,1.0);h=normalize(position).y;gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`varying float h;uniform vec3 top;uniform vec3 mid;uniform vec3 bottom;void main(){float t=clamp(h*.5+.5,0.0,1.0);vec3 c=mix(bottom,mid,smoothstep(.10,.62,t));c=mix(c,top,smoothstep(.62,1.0,t));gl_FragColor=vec4(c,1.0);}`}));group.add(dome);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(760,520,1,1),new THREE.MeshStandardMaterial({color:'#19333d',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-42;ground.position.z=-120;group.add(ground);
  const cloudTex=createGlowTexture('#ffffff');for(let i=0;i<44;i+=1){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:cloudTex,transparent:true,opacity:.10+rand(i*3)*.16,depthWrite:false}));s.position.set((rand(i*5)-.5)*620,-5+rand(i*7)*75,-80-rand(i*9)*460);const scale=40+rand(i*11)*95;s.scale.set(scale*2.4,scale*.42,1);group.add(s)}
  const karman=new THREE.Mesh(new THREE.SphereGeometry(7,16,12),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));karman.position.set(115,105,-120);group.add(karman);
  const troposphere=new THREE.Mesh(new THREE.SphereGeometry(14,16,12),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));troposphere.position.set(-110,12,-170);group.add(troposphere);
  return {group,interactives:[{object:karman,id:'karman'},{object:troposphere,id:'troposphere'}]};
}
