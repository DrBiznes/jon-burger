import * as THREE from 'three';
import type { BurgerPartData } from '../types';

export const Patty: BurgerPartData = {
  name: "Beef Patty",
  createMesh: () => {
    const pattyGroup = new THREE.Group();

    // Create a more realistic patty with beveled edges
    const pattyShape = new THREE.Shape();
    const radius = 1.2;
    const irregularity = 0.08;
    const points = 32;

    // Create an irregular circular shape
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const variation = 1 + (Math.sin(angle * 4) * irregularity + Math.cos(angle * 7) * irregularity * 0.5);
      const x = Math.cos(angle) * radius * variation;
      const y = Math.sin(angle) * radius * variation;
      
      if (i === 0) {
        pattyShape.moveTo(x, y);
      } else {
        pattyShape.lineTo(x, y);
      }
    }

    // Extrude with beveling for realistic edges
    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.08,
      bevelSegments: 3,
      curveSegments: 32
    };

    const pattyGeometry = new THREE.ExtrudeGeometry(pattyShape, extrudeSettings);
    
    // Center the geometry
    pattyGeometry.center();
    
    // Rotate to lie flat
    pattyGeometry.rotateX(-Math.PI / 2);

    const pattyMaterial = new THREE.MeshPhongMaterial({
      color: 0x6B4423,  // Rich brown color
      shininess: 15,
      specular: 0x222222,
      emissive: 0x3E2723,
      emissiveIntensity: 0.2
    });

    const patty = new THREE.Mesh(pattyGeometry, pattyMaterial);

    // Add char marks (darker spots)
    const charMarkCount = 8;
    for (let i = 0; i < charMarkCount; i++) {
      const charGeometry = new THREE.SphereGeometry(0.12 + Math.random() * 0.06, 8, 6);
      const charMaterial = new THREE.MeshPhongMaterial({
        color: 0x3E2723,
        emissive: 0x1A0E0A,
        emissiveIntensity: 0.3
      });
      const charMark = new THREE.Mesh(charGeometry, charMaterial);

      const angle = (i / charMarkCount) * Math.PI * 2 + Math.random() * 0.3;
      const radius = 0.2 + Math.random() * 0.6;
      charMark.position.x = Math.cos(angle) * radius;
      charMark.position.z = Math.sin(angle) * radius;
      charMark.position.y = 0.18 + Math.random() * 0.02;
      charMark.scale.y = 0.2;
      charMark.scale.x = 1 + Math.random() * 0.4;
      charMark.scale.z = 1 + Math.random() * 0.4;
      charMark.rotation.y = Math.random() * Math.PI;

      patty.add(charMark);
    }

    // Add grill marks - cleaner and more visible
    const grillMarkGeometry = new THREE.BoxGeometry(2.2, 0.02, 0.06);
    const grillMarkMaterial = new THREE.MeshPhongMaterial({
      color: 0x2E1A0E,
      emissive: 0x1A0E0A,
      emissiveIntensity: 0.2
    });

    for (let i = -3; i <= 3; i++) {
      const grillMark = new THREE.Mesh(grillMarkGeometry, grillMarkMaterial);
      grillMark.position.set(0, 0.176, i * 0.18);
      grillMark.rotation.y = Math.PI / 5;
      patty.add(grillMark);
    }

    // Add juicy highlights on the surface
    const highlightCount = 5;
    for (let i = 0; i < highlightCount; i++) {
      const highlightGeometry = new THREE.SphereGeometry(0.06, 6, 4);
      const highlightMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B6239,
        shininess: 100,
        specular: 0xFFFFFF,
        transparent: true,
        opacity: 0.8
      });
      const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.7;
      highlight.position.x = Math.cos(angle) * radius;
      highlight.position.z = Math.sin(angle) * radius;
      highlight.position.y = 0.15 + Math.random() * 0.05;
      highlight.scale.y = 0.4;

      patty.add(highlight);
    }

    patty.castShadow = true;
    patty.receiveShadow = true;
    pattyGroup.add(patty);
    return pattyGroup;
  },
  originalY: -0.15,
  explodedY: 0.6,
  rotationSpeed: 0.003
};