import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Howl } from 'howler';
import { Moon, Volume2, VolumeX, Clock, ChevronLeft, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { SOUND_MODES } from '../types';
import { cn } from '@/lib/utils';

export default function Sleep() {
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [activeVolume, setActiveVolume] = useState(0.5);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeHowlRef = useRef<Howl | null>(null);

  const stopActiveSound = () => {
    if (activeHowlRef.current) {
      activeHowlRef.current.stop();
      activeHowlRef.current.unload();
      activeHowlRef.current = null;
    }
    setActiveSoundId(null);
  };

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev && prev > 0) return prev - 1;
          stopActiveSound();
          setSleepTimer(null);
          return null;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (activeHowlRef.current) {
        activeHowlRef.current.stop();
        activeHowlRef.current.unload();
      }
    };
  }, []);

  const toggleSound = (soundId: string) => {
    const sound = SOUND_MODES.find((item) => item.id === soundId);
    if (!sound) return;

    if (activeSoundId === soundId) {
      stopActiveSound();
      return;
    }

    stopActiveSound();

    const howl = new Howl({
      src: [sound.url],
      loop: true,
      volume: activeVolume,
      html5: true,
    });

    howl.play();
    activeHowlRef.current = howl;
    setActiveSoundId(soundId);
  };

  const updateVolume = (volume: number) => {
    setActiveVolume(volume);
    if (activeHowlRef.current) {
      activeHowlRef.current.volume(volume);
    }
  };

  const startSleepTimer = (minutes: number) => {
    setSleepTimer(minutes);
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <Link to="/" className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10">
          <ChevronLeft size={20} />
        </Link>
        <h2 className="text-xl font-medium">Modo Sueno</h2>
        <div className="w-10" />
      </header>

      <section className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-4">
          <Moon className="text-indigo-400" size={32} />
        </div>
        <h3 className="text-2xl font-light">Ambiente Relajante</h3>
        <p className="text-white/40 text-sm">Un solo sonido a la vez para evitar mezcla</p>
      </section>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-white/40" />
            <span className="text-sm font-medium">Temporizador de apagado</span>
          </div>
          {timeLeft !== null && (
            <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">{formatTime(timeLeft)}</span>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[15, 30, 45, 60, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => startSleepTimer(mins)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap',
                sleepTimer === mins
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              )}
            >
              {mins} min
            </button>
          ))}
          {sleepTimer && (
            <button
              onClick={() => {
                setSleepTimer(null);
                setTimeLeft(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30"
            >
              Cancelar
            </button>
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4">
        {SOUND_MODES.map((sound) => {
          const isPlaying = activeSoundId === sound.id;
          return (
            <GlassCard key={sound.id} className="p-4 flex items-center gap-4">
              <button
                onClick={() => toggleSound(sound.id)}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                  isPlaying ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/40 border border-white/5'
                )}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1">
                <span className="text-sm font-medium">{sound.name}</span>
                {isPlaying && (
                  <div className="flex items-center gap-3">
                    <VolumeX size={12} className="text-white/20" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={activeVolume}
                      onChange={(e) => updateVolume(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                    />
                    <Volume2 size={12} className="text-white/20" />
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {activeSoundId && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={stopActiveSound}
          className="w-full py-4 rounded-2xl bg-white text-black font-medium tracking-tight shadow-xl hover:bg-white/90 active:scale-[0.98] transition-all"
        >
          Silenciar Todo
        </motion.button>
      )}
    </div>
  );
}
