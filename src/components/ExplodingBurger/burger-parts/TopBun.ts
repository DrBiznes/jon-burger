import * as THREE from 'three';
import type { BurgerPartData } from '../types';

const BUN_RADIUS = 1.5;
const TOP_BUN_HEIGHT = 0.7; // Tunable height for the top bun dome
const LATHE_SEGMENTS = 32; // For smoother bun surface

export const TopBun: BurgerPartData = {
  name: "Top Bun",
  createMesh: () => {
    const topBunGroup = new THREE.Group();

    // Define the 2D profile for the top bun (points in XY plane, to be rotated around Y axis)
    // Starts from the center of the flat base, goes to the edge, then curves up to the apex.
    const topBunPoints = [
      new THREE.Vector2(0, 0), // Center of base
      new THREE.Vector2(BUN_RADIUS * 0.99, 0.01), // Edge of flat base, small y to ensure it's part of the lathe
      new THREE.Vector2(BUN_RADIUS, TOP_BUN_HEIGHT * 0.15),
      new THREE.Vector2(BUN_RADIUS * 0.9, TOP_BUN_HEIGHT * 0.6),
      new THREE.Vector2(BUN_RADIUS * 0.65, TOP_BUN_HEIGHT * 0.9),
      new THREE.Vector2(BUN_RADIUS * 0.35, TOP_BUN_HEIGHT * 0.98),
      new THREE.Vector2(0, TOP_BUN_HEIGHT) // Apex of the dome
    ];

    const topBunGeometry = new THREE.LatheGeometry(topBunPoints, LATHE_SEGMENTS);
    const topBunMaterial = new THREE.MeshPhongMaterial({
      color: 0xC4844C,  // Lighter brown color
      shininess: 30,     // Increased shininess
      specular: 0x333333 // Brighter specular highlights
    });
    const topBunMesh = new THREE.Mesh(topBunGeometry, topBunMaterial);
    topBunMesh.castShadow = true;
    topBunMesh.receiveShadow = true;
    topBunGroup.add(topBunMesh);

    // Add sesame seeds
    const seedCount = 50; // Increased for better coverage
    const seedGeometry = new THREE.SphereGeometry(0.035, 5, 3); // Slightly smaller seeds
    const seedMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFAE6, // Slightly warmer white for seeds
      shininess: 20,
      specular: 0x222222
    });

    // Create a spline from the dome part of the profile for seed placement
    // Points from edge of base curving to apex
    const domeProfilePoints = topBunPoints.slice(1); // Exclude (0,0) center base point
    const domeProfileCurve = new THREE.SplineCurve(domeProfilePoints);

    for (let i = 0; i < seedCount; i++) {
      const seed = new THREE.Mesh(seedGeometry, seedMaterial);

      // Get a random point along the length of the dome curve
      // Avoid extreme ends: u from 0.05 (near base edge) to 0.95 (near apex)
      const u = 0.05 + Math.random() * 0.9;
      const profilePoint = domeProfileCurve.getPointAt(u);

      const seedRadiusOnBun = profilePoint.x;
      const seedHeightOnBun = profilePoint.y;
      const theta = Math.random() * Math.PI * 2; // Random angle around the bun

      seed.position.set(
        seedRadiusOnBun * Math.cos(theta),
        seedHeightOnBun,
        seedRadiusOnBun * Math.sin(theta)
      );
      
      // Orient seeds to somewhat follow the bun's curvature
      const lookAtPosition = seed.position.clone();
      if (Math.abs(lookAtPosition.x) < 0.01 && Math.abs(lookAtPosition.z) < 0.01) {
        // If seed is at the apex, look "up" along Y axis relative to its position
        lookAtPosition.y += 0.1;
      } else {
         // Look slightly "outward" from the Y-axis and "up" along the curve
        lookAtPosition.x *= 1.2;
        lookAtPosition.z *= 1.2;
        lookAtPosition.y += 0.05; // Small upward tilt
      }
      seed.lookAt(lookAtPosition);

      seed.castShadow = true;
      topBunGroup.add(seed);
    }
    return topBunGroup;
  },
  originalY: 0.4,
  explodedY: 3.2,
  rotationSpeed: 0.003
};