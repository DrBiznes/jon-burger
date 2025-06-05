import HeroSection from './components/HeroSection';
import FloatingDock from './components/FloatingDock';
import PhotoGallery from './components/PhotoGallery';

function App() {
  return (
    // Ensure main app bg is set if not relying on body's checkerboard for full coverage
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900"> 
      <HeroSection />
      <PhotoGallery />
      <FloatingDock />
    </div>
  );
}

export default App;