import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
  ];

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 w-full z-40 flex justify-center py-4 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-6'
        }`}
      >
        <div
          className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 border border-white/5 ${
            scrolled 
              ? 'glass w-[90%] max-w-4xl shadow-[0_0_20px_rgba(0,255,255,0.08)]' 
              : 'w-[90%] max-w-6xl bg-transparent border-transparent'
          }`}
        >
          <a href="#" className="text-xl font-bold tracking-tighter text-white">
            SUSHAN<span className="text-cyan-400">.</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-cyan-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden md:block px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all hover:scale-105"
          >
            Let's Talk
          </a>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[70px] z-30 mx-auto w-[90%] rounded-3xl glass p-6 border border-white/10 shadow-[0_15px_30px_rgba(0,20,50,0.5)] md:hidden flex flex-col items-center space-y-6"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-mono uppercase tracking-widest text-neutral-300 hover:text-cyan-400 transition-colors py-2 w-full text-center"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 w-full text-center text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
            >
              Let's Talk
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNavbar;
