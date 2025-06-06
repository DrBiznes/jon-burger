import React, { useState, useEffect } from 'react';

// Easy to edit ingredients list
const ingredients = [
  "Sesame Seed Bun",
  "Jon's Special Sauce", 
  "Fresh Lettuce",
  "Red Onion",
  "Vine Tomato",
  "Melted Cheese",
  "Beef Patty",
  "Pickle Chips",
  "Toasted Bottom Bun"
];

const IngredientsPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const halfScreen = window.innerHeight * 0.5;
      const twoScreens = window.innerHeight * 2;
      
      // Show after half screen scroll, hide after two screens
      setIsVisible(scrollY > halfScreen && scrollY < twoScreens);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20 transition-all duration-300">
      {/* Neo-brutalist ingredients panel */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] p-6 w-80">
        {/* Header */}
        <div className="border-b-4 border-black pb-3 mb-4">
          <h2 className="font-['Cherry_Bomb_One'] text-2xl text-black tracking-tight">
            INGREDIENTS
          </h2>
          <div className="bg-red-500 h-2 w-16 mt-2"></div>
        </div>

        {/* Ingredients list */}
        <ul className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center">
              {/* Bold square bullet */}
              <div className="w-4 h-4 bg-black mr-3 flex-shrink-0"></div>
              <span className="font-['Cherry_Bomb_One'] text-sm text-black">
                {ingredient}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="border-t-4 border-black pt-3 mt-4">
          <p className="font-['Cherry_Bomb_One'] text-xs text-black text-center">
            100% FRESH • NO PRESERVATIVES
          </p>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 border-2 border-black"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 border-2 border-black"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 border-2 border-black"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-2 border-black"></div>
      </div>
    </div>
  );
};

export default IngredientsPanel;