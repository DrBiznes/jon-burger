import React from 'react';
import ExplodingBurger from './ExplodingBurger/ExplodingBurger';

// Star SVG directly defined as a React component
const StarBurstIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <polygon points="50,0 61,39 100,39 69,61 79,100 50,75 21,100 31,61 0,39 39,39" fill="currentColor"/>
  </svg>
);

const HeroSection: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative text-center px-4 pt-16 sm:pt-20 md:pt-24 overflow-hidden">
      <div className="relative mb-4 md:mb-6">
        <div 
          aria-hidden="true" 
          className="absolute inset-0 flex items-center justify-center z-0"
        >
          <StarBurstIcon className="w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] text-yellow-400 opacity-40 dark:opacity-30" />
        </div>
        <h1 className="relative z-10 font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gray-800 dark:text-white select-none leading-none">
          <span className="block">JON BURGER</span>
          <span className="block mt-[-0.1em] sm:mt-[-0.15em]">COMPANY</span>
        </h1>
      </div>

      <ExplodingBurger />
      {/* Ingredient list is part of ExplodingBurger's overlay */}
    </main>
  );
};

export default HeroSection;