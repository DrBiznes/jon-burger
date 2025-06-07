import HeroSection from './components/HeroSection';
import FloatingDock from './components/FloatingDock';
import PhotoGallery from './components/PhotoGallery';
import IngredientsPanel from './components/IngredientsPanel';

function App() {
  return (
    <div className="min-h-screen flex flex-col"> 
      <HeroSection />
      <IngredientsPanel />
      
      {/* Content that appears after hero section */}
      <div className="relative z-30">
        <PhotoGallery />
      </div>
      
      <FloatingDock />
    </div>
  );
}

export default App;