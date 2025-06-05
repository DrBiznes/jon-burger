import * as THREE from 'three';

export interface BurgerPartData {
  name: string;
  createMesh: () => THREE.Group;
  originalY: number;
  explodedY: number;
  rotationSpeed: number;
}