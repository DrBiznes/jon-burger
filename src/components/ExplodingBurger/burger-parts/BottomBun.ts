import * as THREE from 'three';
import { BurgerPartData } from './TopBun';

export const BottomBun: BurgerPartData = {
  name: "Bottom Bun",
  createMesh: () => {
    const bottomBunGroup = new THREE.Group();

    const topBunMaterial = new THREE.MeshPhongMaterial({ // Reusing material from TopBun
      color: 0x8B4513,
      shininess: 25,
      specular: 0x111111
    });

    // Create custom geometry for bottom bun with flat bottom
    const bottomBunGeometry = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, Math.PI * 0.6, Math.PI * 0.4);
    const bottomBun = new THREE.Mesh(bottomBunGeometry, topBunMaterial);
    bottomBun.scale.y = 0.4; // Even flatter for bottom bun
    bottomBun.castShadow = true;
    bottomBun.receiveShadow = true;
    bottomBunGroup.add(bottomBun);

    // Add flat bottom
    const bottomGeometry = new THREE.CircleGeometry(1.5, 32);
    const bottomMesh = new THREE.Mesh(bottomGeometry, topBunMaterial);
    bottomMesh.rotation.x = -Math.PI / 2;
    bottomMesh.position.y = 0;
    bottomMesh.receiveShadow = true;
    bottomBunGroup.add(bottomMesh);

    return bottomBunGroup;
  },
  originalY: -0.35,
  explodedY: -0.5,
  rotationSpeed: 0.002
};