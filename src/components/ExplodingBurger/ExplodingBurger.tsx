import React, { useRef, useState, useEffect, useCallback } from 'react';
import { setupThreeScene, type BurgerComponent } from './three-utils';

const SCROLL_THRESHOLD = 50; // Pixels to scroll to trigger assemble

const ExplodingBurger: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(true); // Start exploded
  const [isAnimating, setIsAnimating] = useState(false);
  const animateBurgerRef = useRef<((toExploded: boolean, immediate?: boolean) => void) | null>(null);
  const burgerComponentsRef = useRef<BurgerComponent[]>([]);
  const isExplodedStateRef = useRef(isExploded);
  const isMouseDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    isExplodedStateRef.current = isExploded;
  }, [isExploded]);

  const handleScroll = useCallback(() => {
    if (isAnimating) return;

    const currentScrollY = window.scrollY;
    const shouldBeExploded = currentScrollY < SCROLL_THRESHOLD;

    if (shouldBeExploded !== isExplodedStateRef.current) {
      if (animateBurgerRef.current) {
        animateBurgerRef.current(shouldBeExploded);
        setIsExploded(shouldBeExploded);
      }
    }
  }, [isAnimating]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!mountRef.current) return;

    const { animateBurger, components, cleanup, setMouseDragState } = setupThreeScene(
      mountRef.current,
      isExplodedStateRef,
      setIsAnimating,
      isMouseDraggingRef
    );
    animateBurgerRef.current = animateBurger;
    burgerComponentsRef.current = components;
    
    // Ensure initial state is visually set if it was exploded
    if (animateBurgerRef.current && isExplodedStateRef.current) {
        animateBurgerRef.current(true, true); // immediate update
    }


    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full pointer-events-auto" 
      />
      
      <div className="absolute inset-0 pointer-events-none">
        {isExploded && !isAnimating && (
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 space-y-1.5 md:space-y-2 pointer-events-auto">
            {burgerComponentsRef.current.map((component) => (
              <div key={component.name} className="text-white backdrop-blur-sm bg-black/40 dark:bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-md shadow-md">
                <p className={`text-xs md:text-sm font-semibold font-sans ${
                  component.name.includes('Bun') ? 'text-yellow-300' :
                  component.name.includes('Lettuce') ? 'text-green-300' :
                  component.name.includes('Sauce') ? 'text-pink-300' :
                  component.name.includes('Onion') ? 'text-purple-300' :
                  component.name.includes('Tomato') ? 'text-red-300' :
                  component.name.includes('Cheese') ? 'text-yellow-400' :
                  component.name.includes('Patty') ? 'text-amber-600 dark:text-amber-500' :
                  component.name.includes('Pickle') ? 'text-lime-400' :
                  'text-gray-200'
                }`}>
                  {component.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplodingBurger;