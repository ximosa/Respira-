import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, RotateCcw, Play, Pause, ChevronLeft, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';

export default function Gym() {
  const [restTime, setRestTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a subtle sound or vibration notification would be nice
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(restTime);
  };

  const setTime = (seconds: number) => {
    setRestTime(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-10 flex flex-col items-center">
      <header className="w-full flex items-center justify-between">
        <Link to="/" className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10">
          <ChevronLeft size={20} />
        </Link>
        <h2 className="text-xl font-medium">Modo Gym</h2>
        <div className="w-10" />
      </header>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-full border border-orange-500/20 mb-4">
          <Zap className="text-orange-400" size={28} />
        </div>
        <h3 className="text-2xl font-light">Descanso entre series</h3>
        <p className="text-white/40 text-sm">Optimiza tu recuperación</p>
      </div>

      <div className="relative">
        <motion.div 
          animate={isActive ? {
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-orange-500/10 rounded-full blur-3xl -z-10"
        />
        <div className="text-8xl font-light font-mono tracking-tighter">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="w-full space-y-8">
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={resetTimer}
            className="p-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10"
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={toggleTimer}
            className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
          >
            {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
          </button>

          <div className="w-14" />
        </div>

        <GlassCard className="p-4">
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-4 text-center">Configurar Descanso</p>
          <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[30, 45, 60, 90, 120, 180].map((s) => (
              <button
                key={s}
                onClick={() => setTime(s)}
                className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${restTime === s ? 'bg-orange-500 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}
              >
                {s >= 60 ? `${s/60}m` : `${s}s`}
              </button>
            ))}
          </div>
        </GlassCard>

        <section className="space-y-4">
          <h4 className="text-sm font-medium text-white/60 px-2">Tips de recuperación</h4>
          <GlassCard className="p-4 bg-white/[0.02]">
            <p className="text-xs text-white/50 leading-relaxed italic">
              "Durante el descanso, inhala profundamente por la nariz durante 4 segundos y exhala prolongadamente por la boca durante 6 para bajar las pulsaciones."
            </p>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
