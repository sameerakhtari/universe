import * as THREE from 'three';

const smooth = (t) => t * t * (3 - 2 * t);

export class CameraJourney {
  constructor(camera, stages, container) {
    this.camera = camera;
    this.stages = stages;
    this.container = container;
    this.sections = [];
    this.stageIndex = 0;
    this.localProgress = 0;
    this.globalProgress = 0;
    this.basePosition = new THREE.Vector3();
    this.baseTarget = new THREE.Vector3();
    this.target = new THREE.Vector3();
    this.pointer = new THREE.Vector2();
    this.pointerSmoothed = new THREE.Vector2();
    this.currentFov = camera.fov;
    this._buildSections();
  }

  _buildSections() {
    this.stages.forEach((stage, index) => {
      const section = document.createElement('section');
      section.className = 'journey-stage';
      section.dataset.stage = index;
      section.style.setProperty('--stage-height', `${Math.round(138 * (stage.hold || 1))}svh`);
      this.container.append(section);
      this.sections.push(section);
    });
  }

  setPointer(x, y) {
    this.pointer.set(x, y);
  }

  update() {
    const probe = scrollY + innerHeight * 0.48;
    let index = 0;
    for (let i = 0; i < this.sections.length; i += 1) {
      if (probe >= this.sections[i].offsetTop) index = i;
      else break;
    }
    index = Math.min(index, this.stages.length - 1);
    const start = this.sections[index].offsetTop;
    const end = index < this.sections.length - 1
      ? this.sections[index + 1].offsetTop
      : start + this.sections[index].offsetHeight;
    const local = THREE.MathUtils.clamp((probe - start) / Math.max(1, end - start), 0, 1);
    const first = this.sections[0].offsetTop;
    const lastSection = this.sections.at(-1);
    const last = lastSection.offsetTop + lastSection.offsetHeight - innerHeight * 0.15;

    this.stageIndex = index;
    this.localProgress = local;
    this.globalProgress = THREE.MathUtils.clamp((probe - first) / Math.max(1, last - first), 0, 1);

    const a = this.stages[index].camera;
    const b = this.stages[Math.min(index + 1, this.stages.length - 1)].camera;
    const transition = smooth(THREE.MathUtils.clamp((local - 0.18) / 0.82, 0, 1));

    this.basePosition.set(...a.position).lerp(new THREE.Vector3(...b.position), transition);
    this.baseTarget.set(...a.target).lerp(new THREE.Vector3(...b.target), transition);
    const fov = THREE.MathUtils.lerp(a.fov, b.fov, transition);

    this.pointerSmoothed.lerp(this.pointer, 0.045);
    const travelScale = index >= 11 ? 2.5 : index >= 8 ? 5 : 9;
    const px = this.pointerSmoothed.x * travelScale;
    const py = this.pointerSmoothed.y * travelScale * 0.6;

    const forward = this.baseTarget.clone().sub(this.basePosition).normalize();
    const right = new THREE.Vector3().crossVectors(forward, this.camera.up).normalize();
    const up = new THREE.Vector3().crossVectors(right, forward).normalize();

    const desiredPosition = this.basePosition.clone().addScaledVector(right, px).addScaledVector(up, py);
    this.target.copy(this.baseTarget).addScaledVector(right, px * 0.18).addScaledVector(up, py * 0.15);

    this.camera.position.lerp(desiredPosition, 0.08);
    this.currentFov = THREE.MathUtils.lerp(this.currentFov, fov, 0.08);
    if (Math.abs(this.camera.fov - this.currentFov) > 0.01) {
      this.camera.fov = this.currentFov;
      this.camera.updateProjectionMatrix();
    }
    this.camera.lookAt(this.target);
  }

  jumpTo(index, smoothScroll = true) {
    const section = this.sections[index];
    if (!section) return;
    scrollTo({ top: Math.max(0, section.offsetTop - innerHeight * 0.18), behavior: smoothScroll ? 'smooth' : 'auto' });
  }
}
