import * as THREE from 'three';
import { createEarthTexture, createCloudTexture, createMoonTexture, createNightLightsTexture } from './TextureFactory.js';
import { createGlowTexture } from './Galaxy.js';

function atmosphereMaterial(color='#65c9ff') {
  return new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uColor:{value:new THREE.Color(color)}},vertexShader:`varying vec3 vNormal;varying vec3 vWorld;void main(){vNormal=normalize(normalMatrix*normal);vec4 w=modelMatrix*vec4(position,1.0);vWorld=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`varying vec3 vNormal;varying vec3 vWorld;uniform vec3 uColor;void main(){vec3 viewDir=normalize(cameraPosition-vWorld);float fres=pow(1.0-max(dot(vNormal,viewDir),0.0),3.2);gl_FragColor=vec4(uColor,fres*.52);}`});
}

export function createEarthSystem({z=-8330,radius=64,withMoon=false,moonDistance=185}={}) {
  const group=new THREE.Group();group.position.z=z;
  const earth=new THREE.Mesh(new THREE.SphereGeometry(radius,96,64),new THREE.MeshStandardMaterial({map:createEarthTexture(),roughness:.72,metalness:0}));earth.rotation.z=-.409;group.add(earth);
  const clouds=new THREE.Mesh(new THREE.SphereGeometry(radius*1.008,96,64),new THREE.MeshPhongMaterial({map:createCloudTexture(),transparent:true,opacity:.72,depthWrite:false,blending:THREE.NormalBlending}));clouds.rotation.z=earth.rotation.z;group.add(clouds);
  const night=new THREE.Mesh(new THREE.SphereGeometry(radius*1.003,96,64),new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uMap:{value:createNightLightsTexture()}},
    vertexShader:`varying vec2 vUv;varying vec3 vNormalWorld;void main(){vUv=uv;vNormalWorld=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`varying vec2 vUv;varying vec3 vNormalWorld;uniform sampler2D uMap;void main(){vec4 tex=texture2D(uMap,vUv);vec3 lightDir=normalize(vec3(-.61,.29,.73));float day=max(dot(normalize(vNormalWorld),lightDir),0.0);float darkness=pow(1.0-day,3.2);gl_FragColor=vec4(tex.rgb,tex.a*darkness*.88);}`
  }));night.rotation.z=earth.rotation.z;group.add(night);
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(radius*1.055,96,64),atmosphereMaterial());group.add(atmosphere);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:createGlowTexture('#4dbdff'),transparent:true,opacity:.11,depthWrite:false,blending:THREE.AdditiveBlending}));glow.scale.set(radius*3.0,radius*3.0,1);group.add(glow);
  const key=new THREE.DirectionalLight('#fff6e9',5.2);key.position.set(-150,70,180);key.target=earth;group.add(key);group.add(new THREE.AmbientLight('#536682',.42));
  const interactives=[{object:earth,id:withMoon?'earth-system':'earth-globe'}];
  let moonPivot=null,moon=null;
  if(withMoon){moonPivot=new THREE.Group();group.add(moonPivot);moon=new THREE.Mesh(new THREE.SphereGeometry(radius*.27,64,40),new THREE.MeshStandardMaterial({map:createMoonTexture(),roughness:1}));moon.position.x=moonDistance;moonPivot.add(moon);interactives.push({object:moon,id:'moon'});}
  group.userData.update=(time)=>{earth.rotation.y=time*.015;night.rotation.y=earth.rotation.y;clouds.rotation.y=time*.021;if(moonPivot)moonPivot.rotation.y=.7+time*.008};
  return {group,earth,atmosphere,moon,interactives};
}
