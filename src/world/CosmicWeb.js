import * as THREE from 'three';
function rand(seed){const x=Math.sin(seed*61.91)*43758.5453;return x-Math.floor(x)}
export function createCosmicWeb({count=70,span=360,seed=1,color='#718dff'}={}){
  const group=new THREE.Group();const nodes=[];for(let i=0;i<count;i+=1)nodes.push(new THREE.Vector3((rand(seed+i*2)-.5)*span,(rand(seed+i*5)-.5)*span*.58,(rand(seed+i*9)-.5)*span));
  const linePos=[];for(let i=0;i<nodes.length;i+=1){const nearest=nodes.map((p,j)=>({j,d:j===i?Infinity:p.distanceToSquared(nodes[i])})).sort((a,b)=>a.d-b.d).slice(0,3);nearest.forEach(({j,d})=>{if(j>i&&d<span*span*.09){linePos.push(nodes[i].x,nodes[i].y,nodes[i].z,nodes[j].x,nodes[j].y,nodes[j].z)}})}
  const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(linePos,3));const lines=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color,transparent:true,opacity:.17,blending:THREE.AdditiveBlending,depthWrite:false}));group.add(lines);
  const pg=new THREE.BufferGeometry().setFromPoints(nodes);const points=new THREE.Points(pg,new THREE.PointsMaterial({color:'#b4d8ff',size:2.1,transparent:true,opacity:.62,blending:THREE.AdditiveBlending,depthWrite:false}));group.add(points);group.userData.nodes=nodes;return group;
}
