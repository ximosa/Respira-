import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Home from './pages/Home';
import Breathing from './pages/Breathing';
import Sleep from './pages/Sleep';
import Focus from './pages/Focus';
import Gym from './pages/Gym';
import Navigation from './components/layout/Navigation';
import Background from './components/layout/Background';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/breathing" element={<PageWrapper><Breathing /></PageWrapper>} />
        <Route path="/sleep" element={<PageWrapper><Sleep /></PageWrapper>} />
        <Route path="/focus" element={<PageWrapper><Focus /></PageWrapper>} />
        <Route path="/gym" element={<PageWrapper><Gym /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen w-full flex flex-col items-center justify-center pt-16 pb-24"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-white/20 selection:text-white">
        <Background />
        <Navigation />
        <main className="relative z-10 w-full max-w-lg mx-auto px-6">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}
