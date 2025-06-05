import * as THREE from 'three';
// ... (import all burger parts as before) ...
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
  animateBurger: (toExploded: boolean, immediate?: boolean) => void; // Added immediate flag
  cleanup: () => void;
  setMouseDragState: (isDragging: boolean) => void; // To inform three-utils
}

export function setupThreeScene(
  mountElement: HTMLDivElement,
  isExplodedState: React.MutableRefObject<boolean>,
  setIsAnimating: (value: boolean) => void,
  isMouseDraggingRef: React.MutableRefObject<boolean> // Receive the ref
): ThreeBurgerSetup {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff); // White background
  // scene.fog = new THREE.Fog(0xffffff, 15, 40); // Lighter fog, or remove if not desired

  const camera = new THREE.PerspectiveCamera(50, mountElement.clientWidth / mountElement.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 10); // Adjusted camera slightly for better view with title
  camera.lookAt(0, 1, 0); // Look slightly higher due to Y positioning

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent bg if needed over CSS
  renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9; // Adjusted exposure for white background
  mountElement.appendChild(renderer.domElement);

  // Lighting Adjustments for White Background
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Slightly brighter ambient
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0); // Slightly softer main light
  mainLight.position.set(8, 10, 6);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 30; // Adjusted far plane
  mainLight.shadow.bias = -0.0005; // May need to tweak shadow bias
  mainLight.shadow.camera.left = -10;
  mainLight.shadow.camera.right = 10;
  mainLight.shadow.camera.top = 10;
  mainLight.shadow.camera.bottom = -10;
  scene.add(mainLight);
  
  // Optional: Helper to visualize directional light shadow camera
  // const shadowCamHelper = new THREE.CameraHelper(mainLight.shadow.camera);
  // scene.add(shadowCamHelper);


  const rimLight = new THREE.PointLight(0xffaa55, 0.6, 30); // Softer rim
  rimLight.position.set(-6, 3, 4);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xaaaaff, 0.3, 30); // Softer fill
  fillLight.position.set(4, -1, -6);
  scene.add(fillLight);

  const burgerGroup = new THREE.Group();
  burgerGroup.position.y = 1.0; // Lift the whole burger slightly
  scene.add(burgerGroup);

  const burgerParts: BurgerPartData[] = [
    TopBun, JonSauce, Lettuce, RedOnion, Tomato, Cheese, Patty, Pickles, BottomBun
  ];

  const components: BurgerComponent[] = burgerParts.map(part => {
    const mesh = part.createMesh();
    burgerGroup.add(mesh);
    return { ...part, mesh };
  });

  // Set initial positions (Burger starts exploded)
  components.forEach(component => {
    component.mesh.position.y = isExplodedState.current ? component.explodedY : component.originalY;
  });

  // Ground plane (subtler for white background)
  const groundGeometry = new THREE.PlaneGeometry(30, 30);
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.15 }); // More transparent shadow
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.55; // Relative to burgerGroup's new Y position
  ground.receiveShadow = true;
  scene.add(ground); // Add ground to scene, not burgerGroup

  let animationFrameId: number;
  let currentAnimationProgress: number | null = null;
  let animationTargetExploded: boolean;
  let animationStartTime: number;

  // Mouse interaction variables
  let isDragging = false;
  let previousMouseX = 0;
  const rotationSpeedFactor = 0.007; // Adjust for sensitivity
  const defaultSpinSpeed = 0.002; // Slower default spin

  const onMouseDown = (event: MouseEvent) => {
    isDragging = true;
    isMouseDraggingRef.current = true; // Inform React state
    previousMouseX = event.clientX;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const deltaX = event.clientX - previousMouseX;
      burgerGroup.rotation.y += deltaX * rotationSpeedFactor;
      previousMouseX = event.clientX;
    }
  };

  const onMouseUp = () => {
    if (isDragging) {
      isDragging = false;
      isMouseDraggingRef.current = false; // Inform React state
    }
  };
  
  const onMouseLeave = () => { // Stop dragging if mouse leaves canvas
    if (isDragging) {
      isDragging = false;
      isMouseDraggingRef.current = false;
    }
  };

  mountElement.addEventListener('mousedown', onMouseDown);
  mountElement.addEventListener('mousemove', onMouseMove);
  mountElement.addEventListener('mouseup', onMouseUp);
  mountElement.addEventListener('mouseleave', onMouseLeave); // Handle mouse leaving the canvas

  const animateBurger = (toExploded: boolean, immediate: boolean = false) => {
    if (currentAnimationProgress !== null && !immediate) return;

    setIsAnimating(true);
    animationTargetExploded = toExploded;
    
    if (immediate) {
      components.forEach((component) => {
        component.mesh.position.y = toExploded ? component.explodedY : component.originalY;
        component.mesh.rotation.set(0,0,0); // Reset any animation artifacts
        component.mesh.scale.set(1,1,1);
      });
      setIsAnimating(false);
      isExplodedState.current = toExploded;
      currentAnimationProgress = null;
      return;
    }
    
    animationStartTime = Date.now();
    currentAnimationProgress = 0;

    const easeInOutBack = (t: number) => { /* ... same easing function ... */ 
      const c1 = 1.70158; const c2 = c1 * 1.525;
      return t < 0.5 ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
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
        
        const wobble = Math.sin(progress * Math.PI * 2) * 0.05 * (1 - progress);
        // component.mesh.rotation.y = wobble; // Keep individual part rotation for its own default spin
        component.mesh.rotation.x = wobble * 0.5; // Use X or Z for wobble to not interfere with Y spin
        
        const scale = 1 + Math.sin(progress * Math.PI) * 0.1;
        component.mesh.scale.set(scale, scale, scale);
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateTransition);
      } else {
        setIsAnimating(false);
        isExplodedState.current = animationTargetExploded;
        currentAnimationProgress = null;
        
        components.forEach(component => {
          component.mesh.rotation.x = 0; // Reset wobble rotation
          component.mesh.rotation.z = 0;
          component.mesh.scale.set(1, 1, 1);
        });
      }
    };
    animateTransition();
  };

  let time = 0;
  const renderLoop = () => {
    animationFrameId = requestAnimationFrame(renderLoop);
    time += 0.01;
    
    if (currentAnimationProgress === null) { // Not animating explode/assemble
      if (!isMouseDraggingRef.current) { // Not actively dragging with mouse
        burgerGroup.rotation.y += defaultSpinSpeed;
      }
      // Individual parts rotation (only when exploded and not animating)
      if(isExplodedState.current){
        components.forEach(component => {
          component.mesh.rotation.y += component.rotationSpeed;
        });
      }
    }
    
    rimLight.intensity = 0.6 + Math.sin(time * 0.7) * 0.15;
    rimLight.position.x = Math.sin(time * 0.4) * 6;
    rimLight.position.z = Math.cos(time * 0.4) * 6;
    
    renderer.render(scene, camera);
  };
  renderLoop();

  const handleResize = () => {
    camera.aspect = mountElement.clientWidth / mountElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
  };
  window.addEventListener('resize', handleResize);

  const cleanup = () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    mountElement.removeEventListener('mousedown', onMouseDown);
    mountElement.removeEventListener('mousemove', onMouseMove);
    mountElement.removeEventListener('mouseup', onMouseUp);
    mountElement.removeEventListener('mouseleave', onMouseLeave);
    renderer.dispose();
    if (mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
    }
    components.forEach(c => { /* ... dispose geometry/material ... */ });
    scene.clear();
  };

  const setMouseDragState = (isDraggingValue: boolean) => {
    isMouseDraggingRef.current = isDraggingValue;
  };

  return { scene, camera, renderer, burgerGroup, components, animateBurger, cleanup, setMouseDragState };
}