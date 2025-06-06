import * as THREE from 'three';
import type { BurgerPartData } from '../types';

/**
 * Creates procedural textures for the lettuce, including veins and a bumpy surface.
 */
const createLettuceTextures = () => {
  const size = 256;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorContext = colorCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpContext = bumpCanvas.getContext('2d');

  if (!colorContext || !bumpContext) {
    console.error("Could not get 2d context for lettuce textures");
    return null;
  }

  // Base lettuce color and bump
  colorContext.fillStyle = '#7cb342';
  colorContext.fillRect(0, 0, size, size);
  bumpContext.fillStyle = 'rgb(128, 128, 128)'; // Neutral gray for bump
  bumpContext.fillRect(0, 0, size, size);

  // Add a subtle bumpy/wrinkled texture to the bump map
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 1.2;
    const color = Math.random() > 0.5 ? 'rgb(135, 135, 135)' : 'rgb(121, 121, 121)';
    bumpContext.fillStyle = color;
    bumpContext.beginPath();
    bumpContext.arc(x, y, radius, 0, Math.PI * 2);
    bumpContext.fill();
  }
  
  // Draw organic-looking veins
  const veinCount = 15;
  for (let i = 0; i < veinCount; i++) {
    const startX = size / 2;
    const startY = size / 2;
    const endX = Math.random() * size;
    const endY = Math.random() * size;

    const cp1X = startX + (Math.random() - 0.5) * size;
    const cp1Y = startY + (Math.random() - 0.5) * size;
    const cp2X = endX + (Math.random() - 0.5) * size;
    const cp2Y = endY + (Math.random() - 0.5) * size;

    // Lighter green veins on the color map
    colorContext.strokeStyle = '#9CCC65';
    colorContext.lineWidth = Math.random() * 1.5 + 0.5;
    colorContext.beginPath();
    colorContext.moveTo(startX, startY);
    colorContext.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    colorContext.stroke();

    // Slightly raised veins on the bump map (lighter gray)
    bumpContext.strokeStyle = 'rgb(132, 132, 132)';
    bumpContext.lineWidth = Math.random() * 1.5 + 0.5;
    bumpContext.beginPath();
    bumpContext.moveTo(startX, startY);
    bumpContext.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    bumpContext.stroke();
  }

  return {
    colorMap: new THREE.CanvasTexture(colorCanvas),
    bumpMap: new THREE.CanvasTexture(bumpCanvas)
  };
}


export const Lettuce: BurgerPartData = {
  name: "Lettuce",
  createMesh: () => {
    const lettuceGroup = new THREE.Group();
    const lettuceShape = new THREE.Shape();
    const waveCount = 12;
    for (let i = 0; i <= waveCount; i++) {
      const angle = (i / waveCount) * Math.PI * 2;
      const radius = 1.3 + Math.sin(angle * 3) * 0.1;
      lettuceShape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }

    const lettuceGeometry = new THREE.ExtrudeGeometry(lettuceShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2
    });

    const textures = createLettuceTextures();

    const lettuceMaterial = new THREE.MeshPhongMaterial({
      map: textures?.colorMap,
      bumpMap: textures?.bumpMap,
      bumpScale: 0.01,
      shininess: 30,
      specular: 0x111111,
      side: THREE.DoubleSide
    });

    const lettuce = new THREE.Mesh(lettuceGeometry, lettuceMaterial);
    lettuce.rotation.x = Math.PI / 2;
    lettuce.castShadow = true;
    lettuce.receiveShadow = true;
    lettuceGroup.add(lettuce);
    return lettuceGroup;
  },
  originalY: 0.35,
  explodedY: 2.5,
  rotationSpeed: 0.004
};