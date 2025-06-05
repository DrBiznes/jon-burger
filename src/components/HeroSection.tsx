 import React from 'react';
import ExplodingBurger from './ExplodingBurger/ExplodingBurger';
// Example: If you have an SVG starburst icon you can import
// import StarburstIcon from '@/assets/starburst.svg?react'; // Using Vite's ?react import for SVGs

const HeroSection: React.FC = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center relative text-center px-4 overflow-hidden">
      {/* Title with Starburst */}
      <div className="relative mb-2 md:mb-0"> {/* Adjusted margin for burger overlap */}
        {/* Placeholder for Starburst - you can replace with an SVG */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 flex items-center justify-center z-0 opacity-30"
        >
          <div className="text-yellow-400 w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[450px] lg:h-[450px]"
            style={{
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' ,
              background: 'currentColor'
            }}
          />
          {/* If using an imported SVG component: 
          <StarburstIcon className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[450px] lg:h-[450px] text-yellow-400 opacity-30" /> 
          */}
        </div>
        <h1 className="relative z-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-800 dark:text-white select-none">
          <span className="block">JON BURGER</span>
          <span className="block">COMPANY</span>
        </h1>
      </div>

      {/* Exploding Burger will be positioned via its own internal absolute/fixed positioning */}
      <ExplodingBurger />
      
      {/* Ingredient list will be part of ExplodingBurger's overlay */}
    </main>
  );
};

export default HeroSection;