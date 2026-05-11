import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function Background() {
  const location = useLocation();
  
  // Dynamic colors based on route
  const getColors = () => {
    switch (location.pathname) {
      case '/breathing':
        return 'from-teal-900/40 via-blue-900/40 to-black';
      case '/sleep':
        return 'from-indigo-950/50 via-purple-950/30 to-black';
      case '/focus':
        return 'from-emerald-900/30 via-slate-900/50 to-black';
      case '/gym':
        return 'from-orange-900/30 via-red-950/40 to-black';
      default:
        return 'from-violet-900/30 via-blue-950/20 to-black';
    }
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base Gradient */}
      <motion.div 
        animate={{ filter: ['blur(60px)', 'blur(80px)', 'blur(60px)'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 bg-gradient-to-tr ${getColors()} transition-colors duration-1000`} 
      />
      
      {/* Floating Blobs for depth */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[100px]"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] -right-[5%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[100px]"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 20, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px]"
      />
    </div>
  );
}
