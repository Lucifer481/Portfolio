import React from 'react';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="border-t border-white/5 bg-[#030014] py-12 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="text-center md:text-left">
          <a href="#" className="text-2xl font-bold tracking-tighter text-white mb-2 block">
            SUSHAN<span className="text-cyan-400">.</span>
          </a>
          <p className="text-neutral-500 text-xs font-mono">
            © {new Date().getFullYear()} Sushan Bhadel. Protected with Cyber Shield.
          </p>
        </div>

        <div className="flex gap-6">
          <a href="#" className="text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-cyan-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-cyan-400 transition-colors">
            Terms of Service
          </a>
        </div>

        <button 
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] border border-white/10 transition-all cursor-pointer group"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
