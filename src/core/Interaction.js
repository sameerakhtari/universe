import * as THREE from 'three';

export class Interaction {
  constructor(camera, canvas, cursor) {
    this.camera = camera;
    this.canvas = canvas;
    this.cursor = cursor;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(2, 2);
    this.objects = [];
    this.hovered = null;
    this.onHover = () => {};
    this.onSelect = () => {};

    addEventListener('pointermove', (event) => {
      this.pointer.x = (event.clientX / innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / innerHeight) * 2 + 1;
      if (this.cursor) this.cursor.style.transform = `translate(${event.clientX}px,${event.clientY}px)`;
    }, { passive: true });
    addEventListener('pointerleave', () => { this.pointer.set(2, 2); });
    canvas.addEventListener('click', () => {
      if (this.hovered?.userData?.interactive) this.onSelect(this.hovered.userData.interactive);
    });
  }

  register(object, data) {
    object.userData.interactive = data;
    this.objects.push(object);
    return object;
  }

  update(activeStageId) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const visible = this.objects.filter((object) => {
      if (!object.visible || !object.parent?.visible) return false;
      const meta = object.userData.interactive;
      return !meta?.stageId || meta.stageId === activeStageId;
    });
    const hit = this.raycaster.intersectObjects(visible, true).find((item) => {
      let node = item.object;
      while (node && !node.userData.interactive) node = node.parent;
      if (node?.userData?.interactive) {
        item.object = node;
        return true;
      }
      return false;
    });
    const next = hit?.object || null;
    if (next !== this.hovered) {
      this.hovered = next;
      this.cursor?.classList.toggle('hot', Boolean(next));
      this.onHover(next?.userData?.interactive || null);
    }
  }
}
