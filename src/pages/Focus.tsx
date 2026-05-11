import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronLeft, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

type SessionPhase = 'breathing' | 'hold' | 'recovery' | 'completed';
type Intensity = 'beginner' | 'advanced';

const PROTOCOLS = {
  beginner: {
    rounds: 2,
    breathsPerRound: 10,
    holdSeconds: 30,
    recoverySeconds: 15,
    label: 'Principiante',
  },
  advanced: {
    rounds: 3,
    breathsPerRound: 20,
    holdSeconds: 60,
    recoverySeconds: 15,
    label: 'Avanzado',
  },
} as const;

export default function Focus() {
  const [intensity, setIntensity] = useState<Intensity>('beginner');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<SessionPhase>('breathing');
  const [round, setRound] = useState(1);
  const [breathCount, setBreathCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const protocol = PROTOCOLS[intensity];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive || phase === 'completed') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    if (phase === 'breathing') {
      timerRef.current = setInterval(() => {
        setBreathCount((prev) => {
          const next = prev + 1;
          if (next >= protocol.breathsPerRound) {
            setPhase('hold');
            setTimeLeft(protocol.holdSeconds);
            return protocol.breathsPerRound;
          }
          return next;
        });
      }, 2000);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (phase === 'hold') {
              setPhase('recovery');
              return protocol.recoverySeconds;
            }

            if (round >= protocol.rounds) {
              setPhase('completed');
              setIsActive(false);
              return 0;
            }

            setRound((current) => current + 1);
            setPhase('breathing');
            setBreathCount(0);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, phase, round, protocol.breathsPerRound, protocol.holdSeconds, protocol.recoverySeconds, protocol.rounds]);

  const toggleTimer = () => {
    if (phase === 'completed') return;
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setPhase('breathing');
    setRound(1);
    setBreathCount(0);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress =
    phase === 'breathing'
      ? (breathCount / protocol.breathsPerRound) * 100
      : phase === 'hold'
        ? (1 - timeLeft / protocol.holdSeconds) * 100
        : phase === 'recovery'
          ? (1 - timeLeft / protocol.recoverySeconds) * 100
          : 100;

  const phaseTitle =
    phase === 'breathing'
      ? 'Respira Profundo'
      : phase === 'hold'
        ? 'Retencion'
        : phase === 'recovery'
          ? 'Recuperacion'
          : 'Sesion Completada';

  return (
    <div className="w-full max-w-md mx-auto space-y-12 flex flex-col items-center">
      <header className="w-full flex items-center justify-between">
        <Link to="/" className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h2 className="text-xl font-medium">Modo Enfoque Wim Hof</h2>
        <div className="p-2 bg-white/5 rounded-full border border-white/10">
          <Brain size={20} />
        </div>
      </header>

      <section className="relative w-64 h-64 flex items-center justify-center">
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
            stroke={phase === 'hold' ? '#3b82f6' : '#10b981'}
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 120}
            animate={{ strokeDashoffset: (2 * Math.PI * 120) * (1 - progress / 100) }}
            transition={{ type: 'spring', bounce: 0, duration: 1 }}
            strokeLinecap="round"
          />
        </svg>

        <div className="text-center space-y-1 z-10">
          <p className="text-sm font-medium text-white/40 uppercase tracking-widest">{phaseTitle}</p>
          {phase === 'breathing' && <p className="text-6xl font-light tracking-tight font-mono">{breathCount}/{protocol.breathsPerRound}</p>}
          {(phase === 'hold' || phase === 'recovery') && <p className="text-7xl font-light tracking-tight font-mono">{formatTime(timeLeft)}</p>}
          {phase === 'completed' && <p className="text-4xl font-light tracking-tight">Listo</p>}
          <p className="text-xs text-white/50">Ronda {round} de {protocol.rounds}</p>
        </div>
      </section>

      <div className="w-full space-y-8">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setIntensity('beginner');
              resetTimer();
            }}
            className={`py-3 rounded-xl border transition-colors ${intensity === 'beginner' ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300' : 'bg-white/5 border-white/10 text-white/70'}`}
          >
            Principiante
          </button>
          <button
            onClick={() => {
              setIntensity('advanced');
              resetTimer();
            }}
            className={`py-3 rounded-xl border transition-colors ${intensity === 'advanced' ? 'bg-blue-500/20 border-blue-400/50 text-blue-300' : 'bg-white/5 border-white/10 text-white/70'}`}
          >
            Avanzado
          </button>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={resetTimer}
            className="p-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={24} />
          </button>

          <button
            onClick={toggleTimer}
            disabled={phase === 'completed'}
            className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:hover:scale-100"
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <div className="w-14" />
        </div>

        <p className="text-center text-sm text-white/60 leading-relaxed px-4">
          {protocol.label}: {protocol.rounds} rondas, {protocol.breathsPerRound} respiraciones, retencion de {protocol.holdSeconds}s y recuperacion de {protocol.recoverySeconds}s. Hazlo sentado y nunca en agua ni conduciendo.
        </p>
      </div>
    </div>
  );
}
