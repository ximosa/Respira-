import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Target, Play, Pause, RotateCcw, ChevronLeft, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';

export default function Focus() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (mode === 'work') {
      alert('¡Tiempo de trabajo completado! Tómate un respiro.');
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      alert('¡Descanso terminado! Volvamos al trabajo.');
      setMode('work');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? (1 - timeLeft / (25 * 60)) * 100 
    : (1 - timeLeft / (5 * 60)) * 100;

  return (
    <div className="w-full max-w-md mx-auto space-y-12 flex flex-col items-center">
      <header className="w-full flex items-center justify-between">
        <Link to="/" className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h2 className="text-xl font-medium">Modo Foco</h2>
        <button className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <Bell size={20} />
        </button>
      </header>

      <section className="relative w-64 h-64 flex items-center justify-center">
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128" cy="128" r="120"
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          <motion.circle
            cx="128" cy="128" r="120"
            fill="transparent"
            stroke={mode === 'work' ? '#10b981' : '#3b82f6'}
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 120}
            animate={{ strokeDashoffset: (2 * Math.PI * 120) * (1 - progress / 100) }}
            transition={{ type: "spring", bounce: 0, duration: 1 }}
            strokeLinecap="round"
          />
        </svg>

        <div className="text-center space-y-1 z-10">
          <p className="text-sm font-medium text-white/40 uppercase tracking-widest">
            {mode === 'work' ? 'Enfocado' : 'Descanso'}
          </p>
          <p className="text-7xl font-light tracking-tight font-mono">{formatTime(timeLeft)}</p>
        </div>
      </section>

      <div className="w-full space-y-8">
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

          <div className="w-14" />
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => { setMode('work'); setTimeLeft(25 * 60); setIsActive(false); }}
            className={`flex-1 py-4 rounded-2xl border transition-all ${mode === 'work' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-white/40'}`}
          >
            Pomodoro
          </button>
          <button 
            onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
            className={`flex-1 py-4 rounded-2xl border transition-all ${mode === 'break' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/5 text-white/40'}`}
          >
            Descanso
          </button>
        </div>
      </div>
    </div>
  );
}
