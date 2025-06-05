import React from 'react';

const menuItems = [
  { name: "Jon Burger", price: "$6" },
  { name: "Double Jon", price: "$8" },
  { name: "Coke", price: "$2" },
  { name: "Fries", price: "$4" },
];

const FloatingDock: React.FC = () => {
  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 p-3 sm:p-4 shadow-2xl border-2 border-gray-700 dark:border-gray-300">
        <ul className="flex flex-col sm:flex-row gap-x-4 sm:gap-x-6 gap-y-2 items-center justify-center font-mono text-sm sm:text-base">
          {menuItems.map(item => (
            <li key={item.name} className="flex justify-between sm:block items-center w-full sm:w-auto">
              <span className="font-bold tracking-tight">{item.name}</span>
              <span className="sm:hidden mx-1">-</span>
              <span className="bg-yellow-400 text-gray-900 px-1.5 py-0.5 text-xs sm:text-sm font-bold ml-0 sm:ml-1">
                {item.price}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default FloatingDock;