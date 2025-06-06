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
    <div className="fixed right-8 top-1/3 mt-8 transform -translate-y-1/2 z-20 transition-all duration-300">
      {/* Ultra minimalist panel */}
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 p-8 w-72 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
            Ingredients
          </h2>
          <div className="w-8 h-px bg-gray-300"></div>
        </div>

        {/* Ingredients list */}
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start">
              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="font-mono text-xs text-gray-600 leading-relaxed">
                {ingredient}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="font-mono text-[10px] text-gray-400 text-center tracking-wider">
            100% FRESH
          </p>
        </div>
      </div>
    </div>
  );
};

export default IngredientsPanel;