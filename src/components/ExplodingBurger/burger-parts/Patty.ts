import * as THREE from 'three';
import type { BurgerPartData } from './TopBun'; // CHANGE: Add 'type'

export const Patty: BurgerPartData = {
  name: "Beef Patty",
  createMesh: () => {
    const pattyGroup = new THREE.Group();

    // Create a more realistic patty with irregular shape
    const pattyGeometry = new THREE.CylinderGeometry(1.2, 1.15, 0.4, 32, 1, false);

    // Modify vertices for more organic shape
    const pattyPositions = pattyGeometry.attributes.position;
    for (let i = 0; i < pattyPositions.count; i++) {
      const x = pattyPositions.getX(i);
      const y = pattyPositions.getY(i);
      const z = pattyPositions.getZ(i);

      // Add irregularities to the edges
      const angle = Math.atan2(z, x);
      const radiusVariation = 1 + Math.sin(angle * 5) * 0.05 + Math.cos(angle * 7) * 0.03;

      pattyPositions.setX(i, x * radiusVariation);
      pattyPositions.setZ(i, z * radiusVariation);

      // Add surface texture
      if (Math.abs(y) < 0.15) {
        const textureNoise = (Math.sin(x * 20) * Math.cos(z * 20)) * 0.01;
        pattyPositions.setY(i, y + textureNoise);
      }
    }

    pattyGeometry.computeVertexNormals();

    const pattyMaterial = new THREE.MeshPhongMaterial({
      color: 0x6B4423,  // Rich brown color
      shininess: 15,
      specular: 0x222222,
      emissive: 0x3E2723,
      emissiveIntensity: 0.2
    });

    const patty = new THREE.Mesh(pattyGeometry, pattyMaterial);

    // Add char marks (darker spots)
    const charMarkCount = 6;
    for (let i = 0; i < charMarkCount; i++) {
      const charGeometry = new THREE.SphereGeometry(0.15, 8, 6);
      const charMaterial = new THREE.MeshPhongMaterial({
        color: 0x3E2723,
        emissive: 0x1A0E0A,
        emissiveIntensity: 0.3
      });
      const charMark = new THREE.Mesh(charGeometry, charMaterial);

      const angle = (i / charMarkCount) * Math.PI * 2;
      const radius = 0.3 + Math.random() * 0.5;
      charMark.position.x = Math.cos(angle) * radius;
      charMark.position.z = Math.sin(angle) * radius;
      charMark.position.y = 0.201;
      charMark.scale.y = 0.2;
      charMark.scale.x = 1 + Math.random() * 0.3;
      charMark.scale.z = 1 + Math.random() * 0.3;
      charMark.rotation.y = Math.random() * Math.PI;

      patty.add(charMark);
    }

    // Add grill marks
    const grillMarkGeometry = new THREE.BoxGeometry(1.8, 0.01, 0.04);
    const grillMarkMaterial = new THREE.MeshPhongMaterial({
      color: 0x2E1A0E,
      emissive: 0x1A0E0A,
      emissiveIntensity: 0.2
    });

    for (let i = -3; i <= 3; i++) {
      const grillMark = new THREE.Mesh(grillMarkGeometry, grillMarkMaterial);
      grillMark.position.set(0, 0.201, i * 0.15);
      grillMark.rotation.y = Math.PI / 5;
      patty.add(grillMark);
    }

    // Add juicy highlights
    const highlightCount = 4;
    for (let i = 0; i < highlightCount; i++) {
      const highlightGeometry = new THREE.SphereGeometry(0.08, 6, 4);
      const highlightMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B6239,
        shininess: 100,
        specular: 0xFFFFFF,
        transparent: true,
        opacity: 0.7
      });
      const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.8;
      highlight.position.x = Math.cos(angle) * radius;
      highlight.position.z = Math.sin(angle) * radius;
      highlight.position.y = 0.15 + Math.random() * 0.05;
      highlight.scale.y = 0.5;

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