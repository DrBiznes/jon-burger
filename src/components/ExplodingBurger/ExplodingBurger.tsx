import React, { useRef, useState, useEffect, useCallback } from 'react';
import { setupThreeScene } from './three-utils';

const SCROLL_THRESHOLD = window.innerHeight; // One full viewport to trigger assemble

const ExplodingBurger: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(true); // Start exploded
  const [isAnimating, setIsAnimating] = useState(false);
  const animateBurgerRef = useRef<((toExploded: boolean, immediate?: boolean) => void) | null>(null);
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

    const { animateBurger, cleanup } = setupThreeScene(
      mountRef.current,
      isExplodedStateRef,
      setIsAnimating,
      isMouseDraggingRef
    );
    animateBurgerRef.current = animateBurger;
    
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
    </div>
  );
};

export default ExplodingBurger;