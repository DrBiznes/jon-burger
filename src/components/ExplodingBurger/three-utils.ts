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
  animateBurger: (toExploded: boolean, immediate?: boolean) => void;
  cleanup: () => void;
  setMouseDragState: (isDragging: boolean) => void;
}

const MAX_TILT_X = Math.PI / 8; 
const MIN_TILT_X = -Math.PI / 12; 

export function setupThreeScene(
  mountElement: HTMLDivElement,
  isExplodedState: React.MutableRefObject<boolean>,
  setIsAnimating: (value: boolean) => void,
  isMouseDraggingRef: React.MutableRefObject<boolean>
): ThreeBurgerSetup {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(50, mountElement.clientWidth / mountElement.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 11); 
  camera.lookAt(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1; 
  mountElement.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.5); 
  mainLight.position.set(7, 12, 8); 
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 35;
  mainLight.shadow.bias = -0.0005;
  mainLight.shadow.camera.left = -10;
  mainLight.shadow.camera.right = 10;
  mainLight.shadow.camera.top = 10;
  mainLight.shadow.camera.bottom = -10;
  scene.add(mainLight);

  const rimLight = new THREE.PointLight(0xffcc88, 0.8, 35); 
  rimLight.position.set(-7, 4, 5);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xccccff, 0.5, 35); 
  fillLight.position.set(5, -2, -7);
  scene.add(fillLight);

  const burgerGroup = new THREE.Group();
  burgerGroup.position.y = 1.0;
  burgerGroup.rotation.x = Math.PI / 16; 
  scene.add(burgerGroup);

  const burgerParts: BurgerPartData[] = [
    TopBun, JonSauce, Lettuce, RedOnion, Tomato, Cheese, Patty, Pickles, BottomBun
  ];

  const components: BurgerComponent[] = burgerParts.map(part => {
    const mesh = part.createMesh();
    burgerGroup.add(mesh);
    return { ...part, mesh };
  });

  components.forEach(component => {
    component.mesh.position.y = isExplodedState.current ? component.explodedY : component.originalY;
  });

  const groundGeometry = new THREE.PlaneGeometry(30, 30);
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.1 }); 
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.55; 
  ground.receiveShadow = true;
  scene.add(ground);

  let animationFrameId: number;
  let currentAnimationProgress: number | null = null;
  let animationTargetExploded: boolean;
  let animationStartTime: number;

  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0; 
  const rotationSpeedFactor = 0.007;
  const tiltSpeedFactor = 0.005; 
  const defaultSpinSpeed = 0.002;

  const onMouseDown = (event: MouseEvent) => {
    isDragging = true;
    isMouseDraggingRef.current = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const deltaX = event.clientX - previousMouseX;
      const deltaY = event.clientY - previousMouseY;

      burgerGroup.rotation.y += deltaX * rotationSpeedFactor;

      let newRotationX = burgerGroup.rotation.x + deltaY * tiltSpeedFactor;
      newRotationX = Math.max(MIN_TILT_X, Math.min(MAX_TILT_X, newRotationX));
      burgerGroup.rotation.x = newRotationX;

      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
    }
  };
  
  const onMouseUp = () => {
    if (isDragging) {
      isDragging = false;
      isMouseDraggingRef.current = false;
    }
  };
  
  const onMouseLeave = () => {
    if (isDragging) {
      isDragging = false;
      isMouseDraggingRef.current = false;
    }
  };

  mountElement.addEventListener('mousedown', onMouseDown);
  mountElement.addEventListener('mousemove', onMouseMove);
  mountElement.addEventListener('mouseup', onMouseUp);
  mountElement.addEventListener('mouseleave', onMouseLeave);

  const animateBurger = (toExploded: boolean, immediate: boolean = false) => {
    if (currentAnimationProgress !== null && !immediate) return;

    setIsAnimating(true);
    animationTargetExploded = toExploded;
    
    if (immediate) {
      components.forEach((component) => {
        component.mesh.position.y = toExploded ? component.explodedY : component.originalY;
        component.mesh.rotation.set(0,0,0);
        component.mesh.scale.set(1,1,1);
      });
      setIsAnimating(false);
      isExplodedState.current = toExploded;
      currentAnimationProgress = null;
      return;
    }
    
    animationStartTime = Date.now();
    currentAnimationProgress = 0;

    const easeInOutBack = (t: number) => { 
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
        component.mesh.rotation.x = wobble * 0.5;
        
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
          component.mesh.rotation.x = 0;
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
    
    if (currentAnimationProgress === null) { 
      if (!isMouseDraggingRef.current) { 
        burgerGroup.rotation.y += defaultSpinSpeed;
      }
      if(isExplodedState.current){
        components.forEach(component => {
           component.mesh.rotation.y += component.rotationSpeed;
        });
      }
    }
    
    rimLight.intensity = 0.8 + Math.sin(time * 0.7) * 0.2;
    rimLight.position.x = Math.sin(time * 0.4) * 7; // slightly wider movement for rim
    rimLight.position.z = Math.cos(time * 0.4) * 7;
    
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
    components.forEach(c => {
        c.mesh.traverse((object: THREE.Object3D) => {
            if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
                object.material.dispose();
            } else if (Array.isArray(object.material)) {
                object.material.forEach(mat => mat.dispose());
            }
            }
      });
    });
    scene.clear();
  };

  const setMouseDragState = (isDraggingValue: boolean) => {
    isMouseDraggingRef.current = isDraggingValue;
  };

  return { scene, camera, renderer, burgerGroup, components, animateBurger, cleanup, setMouseDragState };
}