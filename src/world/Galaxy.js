import * as THREE from 'three';

function rand(seed){const x=Math.sin(seed*73.17)*43758.5453;return x-Math.floor(x)}

export function createSpiralGalaxy({radius=110,count=9000,arms=3,seed=1,flatten=.30,rotation=0,colorBias=0}={}){
  const group=new THREE.Group();group.rotation.z=rotation;
  const positions=new Float32Array(count*3),colors=new Float32Array(count*3),sizes=new Float32Array(count);
  const warm=new THREE.Color('#ffd49a'),cool=new THREE.Color('#9fc5ff'),white=new THREE.Color('#eff5ff');
  for(let i=0;i<count;i+=1){
    const q=Math.pow(rand(seed+i*2.71),.65),arm=i%arms,noise=(rand(seed*11+i*3.9)-.5);
    const angle=arm*Math.PI*2/arms+q*10.2+noise*(.22+.35*q);
    const r=(.035+q*.96)*radius*(.90+rand(seed*17+i*5.1)*.18);
    positions[i*3]=Math.cos(angle)*r+(rand(seed+i*9)-.5)*radius*.025;
    positions[i*3+1]=(rand(seed+i*8.2)-.5)*radius*flatten*(.15+.85*q);
    positions[i*3+2]=Math.sin(angle)*r+(rand(seed+i*6.4)-.5)*radius*.025;
    let c=q<.26?warm:cool.clone().lerp(white,.35+rand(seed+i*4)*.45);if(colorBias>.5)c.lerp(new THREE.Color('#ccb7ff'),.25);
    colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;sizes[i]=.55+rand(seed+i*12)*1.75*(1-q*.45);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));geometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexColors:true,blending:THREE.AdditiveBlending,vertexShader:`
    attribute float aSize; varying vec3 vColor; void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=clamp(aSize*(120.0/max(60.0,-mv.z)),.7,3.4);gl_Position=projectionMatrix*mv;}
  `,fragmentShader:`varying vec3 vColor;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=smoothstep(.5,.06,d);gl_FragColor=vec4(vColor,a*.82);}`});
  group.add(new THREE.Points(geometry,material));

  const coreMat=new THREE.SpriteMaterial({map:createGlowTexture('#fff0c0'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.72});
  const core=new THREE.Sprite(coreMat);core.scale.set(radius*.68,radius*.68,1);group.add(core);

  const dustMat=new THREE.MeshBasicMaterial({color:'#080609',transparent:true,opacity:.32,depthWrite:false,side:THREE.DoubleSide});
  for(let a=0;a<2;a+=1){const curve=[];for(let i=0;i<72;i+=1){const q=i/71,ang=a*Math.PI+q*7.7+.45,r=(.16+q*.68)*radius;curve.push(new THREE.Vector3(Math.cos(ang)*r,(a?1:-1)*.35,Math.sin(ang)*r))}const tube=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curve),90,radius*.012,5,false);tube.scale.y=flatten;group.add(new THREE.Mesh(tube,dustMat));}
  return group;
}

export function createGlowTexture(color='#ffffff'){
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d');const g=ctx.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,color);g.addColorStop(.14,color);g.addColorStop(.38,'rgba(255,220,170,.25)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
