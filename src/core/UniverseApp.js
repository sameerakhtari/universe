import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { STAGES } from '../data/stages.js';
import { detectQuality } from './Quality.js';
import { CameraJourney } from './CameraJourney.js';
import { Interaction } from './Interaction.js';
import { UniverseWorld } from '../world/UniverseWorld.js';
import { Hud } from '../ui/Hud.js';

export class UniverseApp {
  constructor(canvas) {
    this.canvas=canvas;this.quality=detectQuality();this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(54,innerWidth/innerHeight,.1,14000);this.camera.position.set(...STAGES[0].camera.position);
    this.pointerScreen={x:innerWidth/2,y:innerHeight/2};this.clock=new THREE.Clock();
  }

  async init() {
    this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:this.quality.antialias,powerPreference:'high-performance',alpha:false});
    this.renderer.setPixelRatio(this.quality.pixelRatio);this.renderer.setSize(innerWidth,innerHeight,false);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.0;
    this.composer=new EffectComposer(this.renderer);this.composer.setPixelRatio(this.quality.pixelRatio);this.composer.addPass(new RenderPass(this.scene,this.camera));
    const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),this.quality.bloom,.38,.84);bloom.threshold=.72;bloom.strength=this.quality.bloom;bloom.radius=.34;this.composer.addPass(bloom);this.composer.addPass(new OutputPass());

    this.hud=new Hud(STAGES);
    this.journey=new CameraJourney(this.camera,STAGES,document.querySelector('#journeySections'));
    this.world=new UniverseWorld(this.scene,this.quality,STAGES);this.world.build();
    this.interaction=new Interaction(this.camera,this.canvas,document.querySelector('#cursor'));
    this.world.interactives.forEach(({object,data})=>this.interaction.register(object,data));
    this.interaction.onHover=(data)=>this.hud.showHover(data,this.pointerScreen.x,this.pointerScreen.y);
    this.interaction.onSelect=(data)=>this.hud.openInspector(data);
    this.hud.onNavigate=(index)=>this.journey.jumpTo(index,!this.quality.reduced);

    addEventListener('pointermove',(event)=>{this.pointerScreen.x=event.clientX;this.pointerScreen.y=event.clientY;this.journey.setPointer((event.clientX/innerWidth-.5)*2,-(event.clientY/innerHeight-.5)*2)},{passive:true});
    addEventListener('resize',()=>this.resize(),{passive:true});
    addEventListener('keydown',(event)=>this.onKey(event));
    document.querySelector('#restartButton').addEventListener('click',()=>scrollTo({top:0,behavior:this.quality.reduced?'auto':'smooth'}));
    this._wireSound();

    this.camera.lookAt(new THREE.Vector3(...STAGES[0].camera.target));
    this.resize();
    requestAnimationFrame(()=>document.querySelector('#loading')?.classList.add('done'));
    this.animate();
  }

  resize(){this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setPixelRatio(this.quality.pixelRatio);this.renderer.setSize(innerWidth,innerHeight,false);this.composer.setSize(innerWidth,innerHeight)}
  onKey(event){if(event.key==='Escape')this.hud.closeInspector();if(['ArrowDown','PageDown'].includes(event.key)){event.preventDefault();this.journey.jumpTo(Math.min(STAGES.length-1,this.journey.stageIndex+1),!this.quality.reduced)}if(['ArrowUp','PageUp'].includes(event.key)){event.preventDefault();this.journey.jumpTo(Math.max(0,this.journey.stageIndex-1),!this.quality.reduced)}if(event.key==='Home'){event.preventDefault();scrollTo({top:0,behavior:this.quality.reduced?'auto':'smooth'})}if(event.key==='End'){event.preventDefault();this.journey.jumpTo(STAGES.length-1,!this.quality.reduced)}}

  _wireSound(){const button=document.querySelector('#soundButton');let audio=null,on=false;button.addEventListener('click',async()=>{if(!audio){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audio=new AC();const gain=audio.createGain();gain.gain.value=.0001;const a=audio.createOscillator(),b=audio.createOscillator(),lfo=audio.createOscillator(),lg=audio.createGain();a.frequency.value=46;b.frequency.value=69;b.detune.value=-9;lfo.frequency.value=.045;lg.gain.value=5;a.connect(gain);b.connect(gain);lfo.connect(lg).connect(a.frequency);gain.connect(audio.destination);a.start();b.start();lfo.start();audio._gain=gain}if(audio.state==='suspended')await audio.resume();on=!on;audio._gain.gain.cancelScheduledValues(audio.currentTime);audio._gain.gain.linearRampToValueAtTime(on ? .012 : .0001,audio.currentTime+.8);button.setAttribute('aria-pressed',String(on))})}

  animate=()=>{requestAnimationFrame(this.animate);const time=this.clock.getElapsedTime();this.journey.update();this.world.update(time);this.hud.update(this.journey.stageIndex,this.journey.localProgress,this.journey.globalProgress);this.interaction.update(STAGES[this.journey.stageIndex].id);this.composer.render()}
}
