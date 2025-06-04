import * as THREE from 'three';
import type { BurgerPartData } from './TopBun'; // CHANGE: Add 'type'

export const Lettuce: BurgerPartData = {
  name: "Lettuce",
  createMesh: () => {
    const lettuceGroup = new THREE.Group();
    const lettuceShape = new THREE.Shape();
    const waveCount = 12;
    for (let i = 0; i <= waveCount; i++) {
      const angle = (i / waveCount) * Math.PI * 2;
      const radius = 1.3 + Math.sin(angle * 3) * 0.1;
      lettuceShape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }

    const lettuceGeometry = new THREE.ExtrudeGeometry(lettuceShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2
    });

    const lettuceMaterial = new THREE.MeshPhongMaterial({
      color: 0x7cb342,
      shininess: 50,
      side: THREE.DoubleSide
    });

    const lettuce = new THREE.Mesh(lettuceGeometry, lettuceMaterial);
    lettuce.rotation.x = Math.PI / 2;
    lettuce.castShadow = true;
    lettuce.receiveShadow = true;
    lettuceGroup.add(lettuce);
    return lettuceGroup;
  },
  originalY: 0.35,
  explodedY: 2.5,
  rotationSpeed: 0.004
};