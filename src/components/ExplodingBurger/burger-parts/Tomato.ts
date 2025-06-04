import * as THREE from 'three';
import type { BurgerPartData } from './TopBun'; // CHANGE: Add 'type'

export const Tomato: BurgerPartData = {
  name: "Tomato Slice",
  createMesh: () => {
    const tomatoGroup = new THREE.Group();
    const tomatoGeometry = new THREE.CylinderGeometry(1.1, 1.1, 0.2, 32);
    const tomatoMaterial = new THREE.MeshPhongMaterial({
      color: 0xe53935,
      shininess: 80,
      specular: 0x222222
    });
    const tomato = new THREE.Mesh(tomatoGeometry, tomatoMaterial);
    tomato.castShadow = true;
    tomato.receiveShadow = true;
    tomatoGroup.add(tomato);
    return tomatoGroup;
  },
  originalY: 0.15,
  explodedY: 1.7,
  rotationSpeed: 0.005
};