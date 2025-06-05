import React from 'react';

// Placeholder images - replace with your actual pop-up photos
const photos = [
  "https://via.placeholder.com/400x300/FFD700/000000?text=Pop-Up+1",
  "https://via.placeholder.com/300x400/FF6347/FFFFFF?text=Pop-Up+2",
  "https://via.placeholder.com/400x400/ADFF2F/000000?text=Delicious!",
  "https://via.placeholder.com/350x300/87CEEB/FFFFFF?text=Crowd+Fave",
  "https://via.placeholder.com/300x350/FFB6C1/000000?text=Burger+Art",
  "https://via.placeholder.com/450x300/DDA0DD/FFFFFF?text=Good+Times",
];

const PhotoGallery: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gray-100 dark:bg-gray-800 font-sans">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-5xl sm:text-6xl text-center mb-12 sm:mb-16 text-gray-800 dark:text-white">
          From Our Pop-Ups!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`
                bg-white dark:bg-gray-700 p-2 border-4 border-gray-800 dark:border-yellow-400 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#FFD700]
                hover:transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_#000000] dark:hover:shadow-[12px_12px_0px_#FFD700] 
                transition-all duration-200
                ${index % 2 === 0 ? 'sm:rotate-[-1deg]' : 'sm:rotate-[1deg]'}
                ${index % 3 === 0 ? 'md:mt-[-10px]' : ''}
                ${index % 3 === 1 ? 'md:mt-[10px]' : ''}
              `}
            >
              <img 
                src={photo} 
                alt={`Pop-up scene ${index + 1}`} 
                className="w-full h-auto object-cover border-2 border-gray-300 dark:border-gray-600" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;