import * as THREE from 'three';
import type { BurgerPartData } from '../types';

export const Pickles: BurgerPartData = {
  name: "Pickle Chips",
  createMesh: () => {
    const picklesGroup = new THREE.Group();
    const pickleCount = 2;

    for (let i = 0; i < pickleCount; i++) {
      // Create wavy pickle chip using a custom shape
      const pickleShape = new THREE.Shape();
      const radius = 0.35;
      const waves = 20;

      for (let j = 0; j <= waves; j++) {
        const angle = (j / waves) * Math.PI * 2;
        const waveRadius = radius + Math.sin(angle * 6) * 0.03;
        const x = Math.cos(angle) * waveRadius;
        const y = Math.sin(angle) * waveRadius;
        if (j === 0) {
          pickleShape.moveTo(x, y);
        } else {
          pickleShape.lineTo(x, y);
        }
      }

      const pickleExtrudeSettings = {
        depth: 0.06,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.01,
        bevelSegments: 2
      };

      const pickleGeometry = new THREE.ExtrudeGeometry(pickleShape, pickleExtrudeSettings);
      const pickleMaterial = new THREE.MeshPhongMaterial({
        color: 0x6B8E23,  // Olive green pickle color
        shininess: 80,
        specular: 0x444444,
        side: THREE.DoubleSide
      });

      const pickle = new THREE.Mesh(pickleGeometry, pickleMaterial);
      pickle.rotation.x = Math.PI / 2;
      pickle.position.x = (i - 0.5) * 0.6;
      pickle.position.z = i === 0 ? 0.15 : -0.2;
      pickle.position.y = 0;
      pickle.rotation.z = Math.random() * Math.PI / 6 - Math.PI / 12;

      // Add some darker spots for realism
    
      pickle.castShadow = true;
      pickle.receiveShadow = true;
      picklesGroup.add(pickle);
    }
    return picklesGroup;
  },
  originalY: -0.3,
  explodedY: -0.1,
  rotationSpeed: 0.004
};