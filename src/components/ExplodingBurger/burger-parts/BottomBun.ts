import * as THREE from 'three';
import type { BurgerPartData } from './TopBun'; // Assuming BurgerPartData is correctly accessible

const BUN_RADIUS = 1.5;
const BOTTOM_BUN_HEIGHT = 0.45; // Tunable height for the bottom bun
const LATHE_SEGMENTS = 32; // For smoother bun surface

export const BottomBun: BurgerPartData = {
  name: "Bottom Bun",
  createMesh: () => {
    const bottomBunGroup = new THREE.Group();

    // Define the 2D profile for the bottom bun
    // Starts from center of (flat) top surface, goes to edge, curves down, then forms flat bottom.
    // Y values will be 0 (top) to -BOTTOM_BUN_HEIGHT (bottom).
    const bottomBunPoints = [
      new THREE.Vector2(0, 0), // Center of (flat) top surface
      new THREE.Vector2(BUN_RADIUS * 0.98, 0), // Edge of (flat) top surface
      new THREE.Vector2(BUN_RADIUS, -BOTTOM_BUN_HEIGHT * 0.2), // Start curving down
      new THREE.Vector2(BUN_RADIUS * 0.95, -BOTTOM_BUN_HEIGHT * 0.7), // Mid-curve
      new THREE.Vector2(BUN_RADIUS * 0.85, -BOTTOM_BUN_HEIGHT * 0.98), // Approaching bottom edge
      new THREE.Vector2(BUN_RADIUS * 0.8, -BOTTOM_BUN_HEIGHT), // Outer edge of flat bottom
      new THREE.Vector2(0, -BOTTOM_BUN_HEIGHT) // Center of flat bottom
    ];

    const bottomBunGeometry = new THREE.LatheGeometry(bottomBunPoints, LATHE_SEGMENTS);
    const bottomBunMaterial = new THREE.MeshPhongMaterial({
      color: 0x8B4513, // Saddle brown - same as top bun
      shininess: 25,
      specular: 0x111111
    });

    const bottomBunMesh = new THREE.Mesh(bottomBunGeometry, bottomBunMaterial);
    bottomBunMesh.castShadow = true;
    bottomBunMesh.receiveShadow = true;
    bottomBunGroup.add(bottomBunMesh);

    return bottomBunGroup;
  },
  originalY: -0.35,
  explodedY: -0.5,
  rotationSpeed: 0.002
};