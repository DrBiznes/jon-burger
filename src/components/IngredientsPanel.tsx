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
    <div className="fixed right-8 top-1/3 mt-8 transform -translate-y-1/2 z-20">
      {/* Ultra minimalist panel */}
      <div className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 p-6 shadow-2xl border-2 border-gray-700 dark:border-gray-300">
        {/* Header */}
        <div className="mb-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
            Ingredients
          </h2>
          <div className="w-8 h-px bg-gray-700 dark:bg-gray-400 mt-2"></div>
        </div>

        {/* Ingredients list */}
        <ul className="space-y-2.5">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="font-mono text-sm flex items-center">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3 flex-shrink-0"></span>
              <span className="text-gray-100 dark:text-gray-800">
                {ingredient}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700 dark:border-gray-300">
          <p className="font-mono text-[10px] text-yellow-400 text-center tracking-wider">
            100% FRESH
          </p>
        </div>
      </div>
    </div>
  );
};

export default IngredientsPanel;