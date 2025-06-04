import * as THREE from 'three';

export interface BurgerPartData {
  name: string;
  createMesh: () => THREE.Group;
  originalY: number;
  explodedY: number;
  rotationSpeed: number;
}

export const TopBun: BurgerPartData = {
  name: "Top Bun",
  createMesh: () => {
    const topBunGroup = new THREE.Group();
    const topBunGeometry = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const topBunMaterial = new THREE.MeshPhongMaterial({
      color: 0x8B4513,  // Saddle brown
      shininess: 25,
      specular: 0x111111
    });
    const topBun = new THREE.Mesh(topBunGeometry, topBunMaterial);
    topBun.scale.y = 0.5; // Flatten
    topBun.castShadow = true;
    topBun.receiveShadow = true;
    topBunGroup.add(topBun);

    // Add sesame seeds
    const seedCount = 40;
    const seedGeometry = new THREE.SphereGeometry(0.04, 6, 4);
    const seedMaterial = new THREE.MeshPhongMaterial({
      color: 0xfff8dc,
      shininess: 20
    });

    for (let i = 0; i < seedCount; i++) {
      const seed = new THREE.Mesh(seedGeometry, seedMaterial);
      const phi = Math.random() * Math.PI * 0.35;
      const theta = Math.random() * Math.PI * 2;

      const r = 1.5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi) * 0.5;

      seed.position.set(x, y, z);
      seed.lookAt(x * 2, y * 4, z * 2);
      seed.castShadow = true;
      topBunGroup.add(seed);
    }
    return topBunGroup;
  },
  originalY: 0.4,
  explodedY: 3.2,
  rotationSpeed: 0.003
};