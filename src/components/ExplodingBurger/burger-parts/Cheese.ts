import * as THREE from 'three';
import { BurgerPartData } from './TopBun';

export const Cheese: BurgerPartData = {
  name: "Melted Cheese",
  createMesh: () => {
    const cheeseGroup = new THREE.Group();

    // Create melty cheese using a plane with displacement
    const cheeseSize = 2;
    const cheeseGeometry = new THREE.PlaneGeometry(cheeseSize, cheeseSize, 16, 16);
    const cheeseMaterial = new THREE.MeshPhongMaterial({
      color: 0xffc107,
      shininess: 60,
      specular: 0x111111,
      side: THREE.DoubleSide
    });

    // Modify vertices to create melted effect
    const positions = cheeseGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const distance = Math.sqrt(x * x + y * y);

      // Create drooping effect at edges
      if (distance > 0.7) {
        const droopAmount = (distance - 0.7) * 0.3;
        positions.setZ(i, -droopAmount);
      }

      // Add some random bumps for texture
      positions.setZ(i, positions.getZ(i) + (Math.random() - 0.5) * 0.02);
    }

    cheeseGeometry.computeVertexNormals();

    const cheese = new THREE.Mesh(cheeseGeometry, cheeseMaterial);
    cheese.rotation.x = -Math.PI / 2;
    cheese.rotation.z = Math.PI / 4;
    cheese.castShadow = true;
    cheese.receiveShadow = true;

    cheeseGroup.add(cheese);
    return cheeseGroup;
  },
  originalY: 0.05,
  explodedY: 1.3,
  rotationSpeed: 0.002
};