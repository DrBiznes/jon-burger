import * as THREE from 'three';
import { TopBun, type BurgerPartData } from './burger-parts/TopBun';
import { JonSauce } from './burger-parts/JonSauce';
import { Lettuce } from './burger-parts/Lettuce';
import { RedOnion } from './burger-parts/RedOnion';
import { Tomato } from './burger-parts/Tomato';
import { Cheese } from './burger-parts/Cheese';
import { Patty } from './burger-parts/Patty';
import { Pickles } from './burger-parts/Pickles';
import { BottomBun } from './burger-parts/BottomBun';

export interface BurgerComponent extends BurgerPartData {
  mesh: THREE.Group;
}

interface ThreeBurgerSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  burgerGroup: THREE.Group;
  components: BurgerComponent[];
  animateBurger: (toExploded: boolean) => void;
  cleanup: () => void;
}

export function setupThreeScene(mountElement: HTMLDivElement,
                                 isExplodedState: React.MutableRefObject<boolean>,
                                 setIsAnimating: (value: boolean) => void): ThreeBurgerSetup {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  scene.fog = new THREE.Fog(0x1a1a1a, 10, 50);

  const camera = new THREE.PerspectiveCamera(60, mountElement.clientWidth / mountElement.clientHeight, 0.1, 1000);
  camera.position.set(5, 3, 8);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  mountElement.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 50;
  mainLight.shadow.camera.left = -10;
  mainLight.shadow.camera.right = 10;
  mainLight.shadow.camera.top = 10;
  mainLight.shadow.camera.bottom = -10;
  scene.add(mainLight);

  const rimLight = new THREE.PointLight(0xff9955, 0.8, 20);
  rimLight.position.set(-5, 2, 3);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0x5599ff, 0.3, 20);
  fillLight.position.set(3, -2, -5);
  scene.add(fillLight);

  // Create burger group
  const burgerGroup = new THREE.Group();
  scene.add(burgerGroup);

  // Burger components with proper sizing
  const burgerParts: BurgerPartData[] = [
    TopBun, JonSauce, Lettuce, RedOnion, Tomato, Cheese, Patty, Pickles, BottomBun
  ];

  const components: BurgerComponent[] = burgerParts.map(part => {
    const mesh = part.createMesh();
    burgerGroup.add(mesh);
    return { ...part, mesh };
  });

  // Set initial positions based on isExplodedState ref
  components.forEach(component => {
    component.mesh.position.y = isExplodedState.current ? component.explodedY : component.originalY;
  });

  // Ground plane
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;
  ground.receiveShadow = true;
  scene.add(ground);

  let animationFrameId: number;
  let currentAnimationProgress: number | null = null;
  let animationTargetExploded: boolean;
  let animationStartTime: number;

  const animateBurger = (toExploded: boolean) => {
    if (currentAnimationProgress !== null) return; // Already animating

    setIsAnimating(true);
    animationTargetExploded = toExploded;
    animationStartTime = Date.now();
    currentAnimationProgress = 0;

    const easeInOutBack = (t: number) => {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    };

    const animateTransition = () => {
      const duration = 1200;
      const elapsed = Date.now() - animationStartTime;
      const progress = Math.min(elapsed / duration, 1);
      currentAnimationProgress = progress;
      
      const easedProgress = easeInOutBack(progress);

      components.forEach((component) => {
        const startY = animationTargetExploded ? component.originalY : component.explodedY;
        const endY = animationTargetExploded ? component.explodedY : component.originalY;
        
        component.mesh.position.y = startY + (endY - startY) * easedProgress;
        
        // Add wobble effect
        const wobble = Math.sin(progress * Math.PI * 2) * 0.05 * (1 - progress);
        component.mesh.rotation.y = wobble;
        component.mesh.rotation.z = wobble * 0.5;
        
        // Scale effect during animation
        const scale = 1 + Math.sin(progress * Math.PI) * 0.1;
        component.mesh.scale.set(scale, scale, scale);
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateTransition);
      } else {
        setIsAnimating(false);
        isExplodedState.current = animationTargetExploded;
        currentAnimationProgress = null;
        
        // Reset transforms
        components.forEach(component => {
          component.mesh.rotation.y = 0;
          component.mesh.rotation.z = 0;
          component.mesh.scale.set(1, 1, 1);
        });
      }
    };
    animateTransition();
  };

  // Render loop
  let time = 0;
  const renderLoop = () => {
    animationFrameId = requestAnimationFrame(renderLoop);
    time += 0.01;
    
    // Only rotate if not currently animating
    if (currentAnimationProgress === null) {
      burgerGroup.rotation.y += 0.005;
      components.forEach(component => {
        component.mesh.rotation.y += component.rotationSpeed;
      });
    }
    
    // Animate lights
    rimLight.intensity = 0.8 + Math.sin(time) * 0.2;
    rimLight.position.x = Math.sin(time * 0.5) * 5;
    rimLight.position.z = Math.cos(time * 0.5) * 5;
    
    renderer.render(scene, camera);
  };
  renderLoop();

  // Handle resize
  const handleResize = () => {
    camera.aspect = mountElement.clientWidth / mountElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
  };
  window.addEventListener('resize', handleResize);

  const cleanup = () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
    mountElement.removeChild(renderer.domElement);
    // Dispose of geometries and materials
    components.forEach(c => {
      c.mesh.traverse((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
    });
    scene.clear();
  };

  return { scene, camera, renderer, burgerGroup, components, animateBurger, cleanup };
}