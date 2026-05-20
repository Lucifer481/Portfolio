import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import FloatingNavbar from './components/FloatingNavbar';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import NotFound from './sections/NotFound';
import Admin from './sections/Admin';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleGoHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  const isHome = currentPath === '/' || currentPath === '/index.html' || currentPath === '';
  const isAdmin = currentPath === '/admin';

  return (
    <>
      <CustomCursor />
      {isHome && <ScrollProgress />}
      
      <AnimatePresence mode="wait">
        {isAdmin ? (
          <Admin key="admin" onGoHome={handleGoHome} />
        ) : !isHome ? (
          <NotFound key="notfound" onGoHome={handleGoHome} />
        ) : isLoading ? (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <div key="content" className="bg-[#030014] min-h-screen text-white select-none">
            <FloatingNavbar />
            
            <main className="relative z-0">
              <Hero />
              <About />
              <Services />
              <Projects />
              <Skills />
              <Experience />
              <Testimonials />
              <Contact />
            </main>

            <Footer />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
