import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import BreathingCircle from '../components/breathing/BreathingCircle';
import { BREATHING_MODES, BreathingMode } from '../types';
import GlassCard from '../components/ui/GlassCard';

type Phase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'idle';

export default function Breathing() {
  const [activeMode, setActiveMode] = useState<BreathingMode>(BREATHING_MODES[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      if (phase === 'idle') {
        startPhase('inhale');
      }
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            nextPhase();
            return 0;
          }
          return prev - 1;
        });
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase]);

  const startPhase = (newPhase: Phase) => {
    setPhase(newPhase);
    let duration = 0;
    if (newPhase === 'inhale') duration = activeMode.inhale;
    else if (newPhase === 'holdIn') duration = activeMode.holdIn;
    else if (newPhase === 'exhale') duration = activeMode.exhale;
    else if (newPhase === 'holdOut') duration = activeMode.holdOut;
    
    // Skip phases with 0 duration
    if (duration === 0 && newPhase !== 'idle') {
      nextPhase(newPhase);
    } else {
      setTimeLeft(duration);
    }
  };

  const nextPhase = (currentPhaseOverride?: Phase) => {
    const current = currentPhaseOverride || phase;
    if (current === 'inhale') {
      activeMode.holdIn > 0 ? startPhase('holdIn') : startPhase('exhale');
    } else if (current === 'holdIn') {
      startPhase('exhale');
    } else if (current === 'exhale') {
      activeMode.holdOut > 0 ? startPhase('holdOut') : startPhase('inhale');
    } else if (current === 'holdOut') {
      startPhase('inhale');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setPhase('idle');
    setTimeLeft(0);
    setTotalSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 flex flex-col items-center">
      <header className="w-full flex items-center justify-between">
        <Link to="/" className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h2 className="text-xl font-medium">Respiración</h2>
        <button className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <Info size={20} />
        </button>
      </header>

      <div className="py-12 flex flex-col items-center gap-4">
        <BreathingCircle 
          phase={phase} 
          duration={timeLeft || 4} 
          mode={activeMode} 
        />
        <div className="text-center">
          <p className="text-sm text-white/40 uppercase tracking-widest font-medium">Tiempo Sesión</p>
          <p className="text-2xl font-mono">{formatTime(totalSeconds)}</p>
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={resetTimer}
            className="p-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={toggleTimer}
            className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <div className="w-14" /> {/* Spacer */}
        </div>

        {/* Mode Selector */}
        <div className="space-y-3">
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold px-2">Selecciona un modo</p>
          <div className="grid grid-cols-2 gap-3">
            {BREATHING_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode);
                  resetTimer();
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                  activeMode.id === mode.id 
                    ? 'bg-white/10 border-white/20 shadow-lg' 
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${mode.color} mb-2`} />
                <h4 className="font-medium text-sm">{mode.name}</h4>
                <p className="text-[10px] text-white/30 leading-tight mt-1 truncate">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
