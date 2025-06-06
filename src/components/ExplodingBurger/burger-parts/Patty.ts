import * as THREE from 'three';
import type { BurgerPartData } from '../types';

// Constants for the patty shape
const PATTY_RADIUS = 1.3;
const PATTY_HEIGHT = 0.4;
const LATHE_SEGMENTS = 32;

// Function to create a procedural bump texture for the patty surface.
// This adds realistic, non-uniform texture without extra geometry.
const createPattyTexture = () => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  
  if (!context) {
    console.error("Could not get 2d context for patty texture");
    return null;
  }

  // Fill with a mid-gray for the bump map (0.5 means no bump)
  context.fillStyle = 'rgb(128, 128, 128)';
  context.fillRect(0, 0, size, size);

  // Add random lighter/darker spots for texture
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 1.5;
    // Lighter spots (bumps out) or darker spots (dents in)
    const color = Math.random() > 0.5 ? 'rgb(160, 160, 160)' : 'rgb(100, 100, 100)';
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  return new THREE.CanvasTexture(canvas);
}


export const Patty: BurgerPartData = {
  name: "Beef Patty",
  createMesh: () => {
    const pattyGroup = new THREE.Group();

    // Define the 2D profile for the patty using a lathe, for a rounded, "cooked" look.
    // This profile is for half the patty, to be revolved around the Y-axis.
    const pattyProfile = [
      new THREE.Vector2(0, -PATTY_HEIGHT / 2),                   // Center bottom
      new THREE.Vector2(PATTY_RADIUS * 0.8, -PATTY_HEIGHT / 2),  // Edge of flat bottom
      new THREE.Vector2(PATTY_RADIUS, -PATTY_HEIGHT / 4),        // Mid-side, curving outwards
      new THREE.Vector2(PATTY_RADIUS * 0.95, PATTY_HEIGHT / 3),  // Upper-side, curving inwards
      new THREE.Vector2(0, PATTY_HEIGHT / 2)                     // Center top (creating a slight dome)
    ];

    const pattyGeometry = new THREE.LatheGeometry(pattyProfile, LATHE_SEGMENTS);
    
    // Create a procedural bump map for a more organic surface
    const bumpTexture = createPattyTexture();
    
    const pattyMaterial = new THREE.MeshPhongMaterial({
      color: 0x6B4423,      // Rich, dark brown for a cooked look
      shininess: 10,         // Low shininess for a meaty texture
      specular: 0x111111,   // Dark specular highlights
      bumpMap: bumpTexture,
      bumpScale: 0.015,      // Adjust for desired bumpiness
    });

    const patty = new THREE.Mesh(pattyGeometry, pattyMaterial);
    
    // The geometry is created around the Y-axis, so it's already centered horizontally
    // and vertically, ready to be placed.

    patty.castShadow = true;
    patty.receiveShadow = true;
    
    pattyGroup.add(patty);
    
    return pattyGroup;
  },
  originalY: -0.15,
  explodedY: 0.6,
  rotationSpeed: 0.003
};