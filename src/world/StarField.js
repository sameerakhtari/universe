import * as THREE from 'three';

const COLORS = [new THREE.Color('#8fb8ff'),new THREE.Color('#b8d2ff'),new THREE.Color('#edf3ff'),new THREE.Color('#fff6df'),new THREE.Color('#ffd7a2'),new THREE.Color('#ffae77')];
function rand(seed){const x=Math.sin(seed*91.733)*43758.5453;return x-Math.floor(x)}

export function createStarField(count=8000) {
  const positions=new Float32Array(count*3),colors=new Float32Array(count*3),sizes=new Float32Array(count),phases=new Float32Array(count);
  for(let i=0;i<count;i+=1){
    const radius=450+Math.pow(rand(i*2.31),.45)*10400;
    const theta=rand(i*5.17)*Math.PI*2;
    const phi=Math.acos(2*rand(i*7.93)-1);
    positions[i*3]=Math.sin(phi)*Math.cos(theta)*radius;
    positions[i*3+1]=Math.cos(phi)*radius*.62;
    positions[i*3+2]=420-Math.sin(phi)*Math.sin(theta)*radius;
    const c=COLORS[Math.floor(rand(i*11.71)*COLORS.length)];colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;
    const bright=Math.pow(rand(i*13.7),4);sizes[i]=.65+bright*3.5;phases[i]=rand(i*17.4)*Math.PI*2;
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));geometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));geometry.setAttribute('aPhase',new THREE.BufferAttribute(phases,1));
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexColors:true,uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(devicePixelRatio,2)}},vertexShader:`
    attribute float aSize; attribute float aPhase; varying vec3 vColor; varying float vAlpha; uniform float uTime; uniform float uPixelRatio;
    void main(){ vColor=color; vec4 mv=modelViewMatrix*vec4(position,1.0); float twinkle=.88+.12*sin(uTime*.65+aPhase); gl_PointSize=aSize*uPixelRatio*twinkle*(185.0/max(85.0,-mv.z)); gl_PointSize=clamp(gl_PointSize,.65,5.2); vAlpha=twinkle; gl_Position=projectionMatrix*mv; }
  `,fragmentShader:`
    varying vec3 vColor; varying float vAlpha;
    void main(){ vec2 p=gl_PointCoord-vec2(.5); float d=length(p); if(d>.5) discard; float core=smoothstep(.5,0.0,d); float halo=smoothstep(.5,.18,d)*.28; gl_FragColor=vec4(vColor,(core+halo)*vAlpha); }
  `});
  const points=new THREE.Points(geometry,material);points.frustumCulled=false;points.renderOrder=-20;
  points.userData.update=(time)=>{material.uniforms.uTime.value=time};
  return points;
}
