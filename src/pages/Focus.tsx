import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronLeft, Brain, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';

type SessionPhase = 'breathing' | 'hold' | 'recovery' | 'completed';
type BreathPhase = 'inhale' | 'hold' | 'exhale';

const DEFAULT_PROTOCOL = {
  rounds: 2,
  breathsPerRound: 10,
  holdSeconds: 30,
  recoverySeconds: 15,
  inhaleSeconds: 4,
  breathHoldSeconds: 2,
  exhaleSeconds: 4,
  label: 'Base',
} as const;

const clampValue = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function Focus() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<SessionPhase>('breathing');
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [round, setRound] = useState(1);
  const [breathCount, setBreathCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [guidedAudioEnabled, setGuidedAudioEnabled] = useState(true);

  const protocol = DEFAULT_PROTOCOL;

  const [inhaleSeconds, setInhaleSeconds] = useState(protocol.inhaleSeconds);
  const [breathHoldSeconds, setBreathHoldSeconds] = useState(protocol.breathHoldSeconds);
  const [exhaleSeconds, setExhaleSeconds] = useState(protocol.exhaleSeconds);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastVoiceCueRef = useRef('');

  const getBreathPhaseDuration = (currentPhase: BreathPhase) => {
    if (currentPhase === 'inhale') return inhaleSeconds;
    if (currentPhase === 'hold') return breathHoldSeconds;
    return exhaleSeconds;
  };

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
      if (timeLeft <= 0) {
        setTimeLeft(getBreathPhaseDuration(breathPhase));
        return;
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return breathHoldSeconds;
            }

            if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return exhaleSeconds;
            }

            setBreathCount((currentBreaths) => {
              const next = currentBreaths + 1;
              if (next >= protocol.breathsPerRound) {
                setPhase('hold');
                setTimeLeft(protocol.holdSeconds);
                return protocol.breathsPerRound;
              }

              return next;
            });
            setBreathPhase('inhale');
            return inhaleSeconds;
          }

          return prev - 1;
        });
      }, 1000);
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
            setBreathPhase('inhale');
            setBreathCount(0);
            return inhaleSeconds;
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
  }, [
    isActive,
    phase,
    breathPhase,
    round,
    timeLeft,
    protocol.breathsPerRound,
    protocol.holdSeconds,
    protocol.recoverySeconds,
    protocol.rounds,
    inhaleSeconds,
    breathHoldSeconds,
    exhaleSeconds,
  ]);

  useEffect(() => {
    if (!guidedAudioEnabled || !isActive || phase === 'completed' || typeof window === 'undefined' || !window.speechSynthesis) return;

    const cueText =
      phase === 'breathing'
        ? breathPhase === 'inhale'
          ? 'Inspira'
          : breathPhase === 'hold'
            ? 'Aguanta'
            : 'Expira'
        : phase === 'hold'
          ? 'Reten'
          : phase === 'recovery'
            ? 'Recupera'
            : '';

    const cueKey = `${phase}-${breathPhase}-${round}-${breathCount}`;
    if (!cueText || cueKey === lastVoiceCueRef.current) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cueText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    lastVoiceCueRef.current = cueKey;
  }, [guidedAudioEnabled, isActive, phase, breathPhase, round, breathCount]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleTimer = () => {
    if (phase === 'completed') return;
    if (isActive && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (!isActive && phase === 'breathing' && timeLeft <= 0) {
      setTimeLeft(getBreathPhaseDuration(breathPhase));
    }
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setPhase('breathing');
    setBreathPhase('inhale');
    setRound(1);
    setBreathCount(0);
    setTimeLeft(0);
    lastVoiceCueRef.current = '';
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
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
      ? breathPhase === 'inhale'
        ? 'Inspiracion'
        : breathPhase === 'hold'
          ? 'Aguante'
          : 'Expiracion'
      : phase === 'hold'
        ? 'Retencion'
        : phase === 'recovery'
          ? 'Recuperacion'
          : 'Sesion Completada';

  const breathingStepsSummary = `Respiracion: ${inhaleSeconds}s inspiracion, ${breathHoldSeconds}s aguante y ${exhaleSeconds}s expiracion.`;
  const innerCircleStrokeColor =
    phase === 'breathing'
      ? breathPhase === 'inhale'
        ? '#34d399'
        : breathPhase === 'hold'
          ? '#f59e0b'
          : '#22d3ee'
      : phase === 'hold'
        ? '#60a5fa'
        : phase === 'recovery'
          ? '#a78bfa'
          : '#e5e7eb';

  return (
    <div className="w-full max-w-md mx-auto space-y-12 flex flex-col items-center">
      <header className="w-full flex items-center justify-between">
        <Link to="/" className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h2 className="text-xl font-medium">Modo Enfoque Wim Hof</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setGuidedAudioEnabled((prev) => {
                const next = !prev;
                if (!next && typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
                return next;
              });
            }}
            className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
            aria-label={guidedAudioEnabled ? 'Desactivar audio guiado' : 'Activar audio guiado'}
            title={guidedAudioEnabled ? 'Audio guiado activado' : 'Audio guiado desactivado'}
          >
            {guidedAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <div className="p-2 bg-white/5 rounded-full border border-white/10">
            <Brain size={20} />
          </div>
        </div>
      </header>

      <section className="w-full flex flex-col items-center gap-5">
        <div className="relative w-64 h-64 flex items-center justify-center">
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

        <motion.div
          className="absolute z-0 w-36 h-36"
          animate={{ scale: phase === 'breathing' && breathPhase === 'inhale' ? 1.08 : 0.95, opacity: 0.95 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="62"
              fill="transparent"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="8"
            />
            <circle
              cx="72"
              cy="72"
              r="62"
              fill="transparent"
              stroke={innerCircleStrokeColor}
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-white/40 uppercase tracking-widest">{phaseTitle}</p>
          {phase === 'breathing' && <p className="text-5xl font-light tracking-tight font-mono">{breathCount}/{protocol.breathsPerRound}</p>}
          {(phase === 'breathing' || phase === 'hold' || phase === 'recovery') && (
            <p className="text-3xl font-light tracking-tight font-mono text-white/80">{formatTime(timeLeft)}</p>
          )}
          {phase === 'completed' && <p className="text-4xl font-light tracking-tight">Listo</p>}
          <p className="text-xs text-white/50">Ronda {round} de {protocol.rounds}</p>
        </div>
      </section>

      <div className="w-full space-y-8">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/40 uppercase tracking-widest">Tiempos personalizados (segundos)</p>

          <label className="block text-sm text-white/80">
            Inspiracion
            <input
              type="number"
              min={1}
              max={15}
              value={inhaleSeconds}
              onChange={(event) => {
                setInhaleSeconds(clampValue(Number(event.target.value) || 1, 1, 15));
                resetTimer();
              }}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 font-mono text-white"
            />
          </label>

          <label className="block text-sm text-white/80">
            Aguante
            <input
              type="number"
              min={1}
              max={15}
              value={breathHoldSeconds}
              onChange={(event) => {
                setBreathHoldSeconds(clampValue(Number(event.target.value) || 1, 1, 15));
                resetTimer();
              }}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 font-mono text-white"
            />
          </label>

          <label className="block text-sm text-white/80">
            Expiracion
            <input
              type="number"
              min={1}
              max={20}
              value={exhaleSeconds}
              onChange={(event) => {
                setExhaleSeconds(clampValue(Number(event.target.value) || 1, 1, 20));
                resetTimer();
              }}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 font-mono text-white"
            />
          </label>
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
          Base: {protocol.rounds} rondas, {protocol.breathsPerRound} respiraciones, retencion de {protocol.holdSeconds}s y recuperacion de {protocol.recoverySeconds}s. {breathingStepsSummary} Hazlo sentado y nunca en agua ni conduciendo.
        </p>

        <section className="w-full rounded-2xl border border-sky-300/20 bg-sky-500/10 p-4 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-sky-200">Tutorial: adapta los tiempos</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Empieza con un ritmo comodo y sin mareo: 3-4s inspiracion, 1-2s aguante y 4-6s expiracion. Si puedes terminar una ronda completa con respiracion nasal o diafragmatica sin tension en cuello/hombros, sube solo 1 segundo a la fase que notes mas estable.
          </p>
          <p className="text-sm text-white/80 leading-relaxed">
            Para mejorar la oxigenacion, prioriza respiraciones profundas y controladas, postura erguida y expiracion completa. Evita forzar hiperventilacion: si aparece hormigueo fuerte, vision borrosa o mareo, para, vuelve a respiracion normal y reduce tiempos en la siguiente sesion.
          </p>
          <p className="text-xs text-white/60 leading-relaxed">
            Nota de seguridad: esta app no sustituye consejo medico. Si tienes enfermedad respiratoria/cardiaca, ansiedad intensa, embarazo o saturacion de O2 baja, consulta con un profesional antes de intensificar.
          </p>
        </section>
      </div>
    </div>
  );
}
