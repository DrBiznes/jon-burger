import * as THREE from 'three';
import { BurgerPartData } from './TopBun';

export const RedOnion: BurgerPartData = {
  name: "Red Onion",
  createMesh: () => {
    const onionGroup = new THREE.Group();
    const onionRingCount = 3;

    for (let i = 0; i < onionRingCount; i++) {
      const onionGeometry = new THREE.TorusGeometry(0.5 + i * 0.15, 0.08, 8, 32);
      const onionMaterial = new THREE.MeshPhongMaterial({
        color: 0x9C27B0,  // Purple-red onion color
        shininess: 60,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      const onionRing = new THREE.Mesh(onionGeometry, onionMaterial);
      onionRing.rotation.x = Math.PI / 2;
      onionRing.position.x = (i - 1) * 0.3;
      onionRing.position.z = (i - 1) * 0.2;
      onionRing.position.y = i * 0.02;
      onionRing.castShadow = true;
      onionRing.receiveShadow = true;
      onionGroup.add(onionRing);
    }
    return onionGroup;
  },
  originalY: 0.25,
  explodedY: 2.0,
  rotationSpeed: 0.006
};