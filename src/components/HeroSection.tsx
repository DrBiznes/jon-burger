import React from 'react';
import ExplodingBurger from './ExplodingBurger/ExplodingBurger';
import Star16 from './stars/s16';

const HeroSection: React.FC = () => {
  return (
    <main className="relative h-[200vh] flex flex-col items-center px-4 pt-12 overflow-hidden bg-[#FFFDF7] dark:bg-gray-900">
      {/* Logo Section - Normal positioning */}
      <div className="relative flex flex-col items-center mt-14 mb-24 z-20">
        {/* Star background */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 flex items-center justify-center z-0 scale-125"
        >
          <Star16 
            size={450}
            color="var(--color-chart-1)"
            className="opacity-40 dark:opacity-30"
          />
        </div>
        
        {/* Text content */}
        <div className="relative z-10 text-center">
          <p className="font-['Luckiest_Guy'] text-2xl text-primary mb-4 tracking-wider transform -rotate-3">
            ALWAYS FRESH
          </p>
          <h1 className="font-['Sarina'] text-7xl sm:text-8xl md:text-8xl text-primary tracking-wide drop-shadow-md transform rotate-2">
            <span className="block leading-none hover:scale-105 transition-transform">JON</span>
            <span className="block leading-none hover:scale-105 transition-transform">BURGER</span>
            <span className="block leading-tight text-4xl sm:text-5xl md:text-6xl tracking-widest text-chart-1 -rotate-3">
              COMPANY
            </span>
          </h1>
        </div>
      </div>

      {/* Burger Section - Covers full hero area */}
      <div className="absolute inset-0 z-10">
        <ExplodingBurger />
      </div>
    </main>
  );
};

export default HeroSection;