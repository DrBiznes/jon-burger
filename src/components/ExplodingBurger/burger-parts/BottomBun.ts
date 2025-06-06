import * as THREE from 'three';
import type { BurgerPartData } from '../types';

const BUN_RADIUS = 1.5;
const BOTTOM_BUN_HEIGHT = 0.45;
const LATHE_SEGMENTS = 24; // Reduced from 32 for better performance

export const BottomBun: BurgerPartData = {
  name: "Bottom Bun",
  createMesh: () => {
    const bottomBunGroup = new THREE.Group();

    // Define the 2D profile for the bottom bun
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

    // Create crust material for sides and bottom
    const crustMaterial = new THREE.MeshPhongMaterial({
      color: 0xC4844C, // Lighter brown color
      shininess: 30,
      specular: 0x333333,
    });

    // Create the main bun mesh with crust material
    const bottomBunMesh = new THREE.Mesh(bottomBunGeometry, crustMaterial);
    bottomBunMesh.castShadow = true;
    bottomBunMesh.receiveShadow = true;
    bottomBunGroup.add(bottomBunMesh);

    // Create the porous cut surface on top
    const cutSurfaceGeometry = new THREE.CircleGeometry(BUN_RADIUS * 0.98, LATHE_SEGMENTS);
    
    // Create a canvas texture for the porous bread surface
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Fill with base bread color
    ctx.fillStyle = '#E5C8A8';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add pores/holes for bread texture
    const poreCount = 150;
    for (let i = 0; i < poreCount; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 3 + 1;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 140, 100, ${Math.random() * 0.5 + 0.3})`;
      ctx.fill();
    }
    
    // Add some lighter spots
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 2 + 1;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 225, 195, ${Math.random() * 0.3 + 0.2})`;
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create porous bread material
    const breadMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0xF5DEB3, // Wheat color tint
      shininess: 10, // Less shiny than crust
      specular: 0x222222,
      bumpScale: 0.3,
    });

    const cutSurface = new THREE.Mesh(cutSurfaceGeometry, breadMaterial);
    cutSurface.rotation.x = -Math.PI / 2;
    cutSurface.position.y = 0.01; // Slightly above to avoid z-fighting
    cutSurface.receiveShadow = true;
    bottomBunGroup.add(cutSurface);

    // Add subtle rim highlight where cut surface meets crust
    const rimGeometry = new THREE.TorusGeometry(BUN_RADIUS * 0.98, 0.02, 4, LATHE_SEGMENTS);
    const rimMaterial = new THREE.MeshPhongMaterial({
      color: 0xD4A574,
      shininess: 50,
      specular: 0x444444,
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.005;
    bottomBunGroup.add(rim);

    return bottomBunGroup;
  },
  originalY: -0.35,
  explodedY: -0.5,
  rotationSpeed: 0.002
};