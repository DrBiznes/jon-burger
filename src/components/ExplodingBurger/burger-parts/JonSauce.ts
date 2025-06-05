import * as THREE from 'three';
import type { BurgerPartData } from '../types';

export const JonSauce: BurgerPartData = {
  name: "Jon Sauce",
  createMesh: () => {
    const sauceGroup = new THREE.Group();
    const sauceGeometry = new THREE.SphereGeometry(0.8, 16, 8);
    const sauceMaterial = new THREE.MeshPhongMaterial({
      color: 0xFF6B6B,  // Pinkish-orange
      shininess: 100,
      specular: 0xFFFFFF,
      emissive: 0xFF6B6B,
      emissiveIntensity: 0.1
    });
    const sauce = new THREE.Mesh(sauceGeometry, sauceMaterial);
    sauce.scale.y = 0.15;
    sauce.castShadow = true;
    sauce.receiveShadow = true;

    // Add sauce drips
    const dripPositions = [
      { x: 0.3, z: 0.4, scale: 0.7 },
      { x: -0.4, z: -0.2, scale: 0.5 },
      { x: 0.2, z: -0.5, scale: 0.6 }
    ];

    dripPositions.forEach(pos => {
      const dripGeometry = new THREE.SphereGeometry(0.15 * pos.scale, 8, 6);
      const drip = new THREE.Mesh(dripGeometry, sauceMaterial);
      drip.position.set(pos.x, -0.05, pos.z);
      drip.scale.y = 0.3;
      sauce.add(drip);
    });

    sauceGroup.add(sauce);
    return sauceGroup;
  },
  originalY: 0.37,
  explodedY: 2.8,
  rotationSpeed: 0.001
};