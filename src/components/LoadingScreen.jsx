import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total
    const intervalTime = 25;
    const step = 100 / (duration / intervalTime);
    
    const timer = setInterval(() => {
      setPercent((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 bg-[#030014] z-50 flex flex-col items-center justify-center font-sans overflow-hidden"
    >
      {/* Abstract background grids/circles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="relative flex flex-col items-center justify-center max-w-md w-full px-8">
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-8"
        >
          SUSHAN<span className="text-cyan-400">.</span>
        </motion.div>
        
        {/* Loading track */}
        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden mb-4 relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Counter */}
        <div className="flex justify-between w-full text-xs font-mono text-neutral-400">
          <span>SYSTEM_INIT</span>
          <span className="text-cyan-400">{Math.round(percent)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
