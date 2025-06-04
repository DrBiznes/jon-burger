import React, { useRef, useState, useEffect } from 'react';
import { setupThreeScene, type BurgerComponent } from './three-utils'; // CHANGE: Add 'type'
import { Button } from '@/components/ui/button'; // Import Shadcn Button

const ExplodingBurger: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const animateBurgerRef = useRef<((toExploded: boolean) => void) | null>(null);
  const burgerComponentsRef = useRef<BurgerComponent[]>([]);
  const isExplodedStateRef = useRef(isExploded); // Use a ref to keep track of isExploded state inside Three.js animation loop

  useEffect(() => {
    isExplodedStateRef.current = isExploded;
  }, [isExploded]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Pass the isExplodedStateRef and setIsAnimating to the setup function
    const { animateBurger, components, cleanup } = setupThreeScene(mountRef.current, isExplodedStateRef, setIsAnimating);
    animateBurgerRef.current = animateBurger;
    burgerComponentsRef.current = components;

    return () => {
      cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!isAnimating && animateBurgerRef.current) {
      animateBurgerRef.current(!isExploded);
      setIsExploded(prev => !prev); // Update React state
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="absolute top-8 left-8">
          <h1 className="text-5xl font-black text-white mb-2">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              BURGER STACK
            </span>
          </h1>
          <p className="text-gray-400 text-lg font-medium">Interactive 3D Assembly</p>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 left-8 bg-black/50 backdrop-blur-sm rounded-lg p-6 max-w-md">
          <p className="text-white text-xl font-semibold mb-2">
            {isExploded ? '🍔 Click to assemble!' : '✨ Click to explode!'}
          </p>
          <p className="text-gray-300">
            Watch as the burger {isExploded ? 'magically comes together' : 'separates into its delicious components'}
          </p>
          {/* Example Shadcn Button */}
          <Button 
            className="mt-4 pointer-events-auto"
            onClick={handleClick}
            disabled={isAnimating}
          >
            {isAnimating ? 'Animating...' : (isExploded ? 'Assemble Burger' : 'Explode Burger')}
          </Button>
        </div>

        {/* Status */}
        <div className="absolute top-8 right-8">
          <div className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${
            isAnimating 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
              : isExploded 
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50' 
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
          }`}>
            {isAnimating ? '⚡ Animating' : isExploded ? '💥 Exploded' : '🍔 Assembled'}
          </div>
        </div>

        {/* Ingredient labels when exploded */}
        {isExploded && !isAnimating && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right space-y-2">
            {burgerComponentsRef.current.map((component) => (
              <div key={component.name} className="text-white/80 backdrop-blur-sm bg-black/30 px-4 py-2 rounded">
                <p className={`text-sm font-bold ${
                  component.name.includes('Bun') ? 'text-yellow-400' :
                  component.name.includes('Lettuce') ? 'text-green-400' :
                  component.name.includes('Sauce') ? 'text-pink-400' :
                  component.name.includes('Onion') ? 'text-purple-400' :
                  component.name.includes('Tomato') ? 'text-red-400' :
                  component.name.includes('Cheese') ? 'text-yellow-500' :
                  component.name.includes('Patty') ? 'text-amber-700' :
                  component.name.includes('Pickle') ? 'text-green-600' :
                  'text-white'
                }`}>
                  {component.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Click handler for the whole scene */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleClick}
        style={{ pointerEvents: isAnimating ? 'none' : 'auto' }}
      />
    </div>
  );
};

export default ExplodingBurger;