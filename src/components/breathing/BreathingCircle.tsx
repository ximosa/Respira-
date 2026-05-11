import { motion } from 'motion/react';
import { BreathingMode } from '../../types';

interface BreathingCircleProps {
  phase: 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'idle';
  duration: number;
  mode: BreathingMode;
}

export default function BreathingCircle({ phase, duration, mode }: BreathingCircleProps) {
  const getScale = () => {
    switch (phase) {
      case 'inhale': return 1.5;
      case 'holdIn': return 1.5;
      case 'exhale': return 1;
      case 'holdOut': return 1;
      default: return 1.2;
    }
  };

  const getOpacity = () => {
    switch (phase) {
      case 'inhale': return 0.8;
      case 'exhale': return 0.4;
      default: return 0.6;
    }
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: getScale(),
          opacity: getOpacity(),
        }}
        transition={{ duration, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${mode.color} blur-[50px] opacity-20`}
      />

      {/* Main Circle */}
      <motion.div
        animate={{
          scale: getScale(),
        }}
        transition={{ duration, ease: "easeInOut" }}
        className={`relative z-10 w-48 h-48 rounded-full bg-gradient-to-br ${mode.color} shadow-2xl flex items-center justify-center border border-white/20`}
      >
        {/* Inner Ripple */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-4 rounded-full border border-white/30"
        />
        
        {/* Text Indicator */}
        <motion.span
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-white font-medium text-lg tracking-wider uppercase"
        >
          {phase === 'inhale' && 'Inhalar'}
          {phase === 'holdIn' && 'Mantener'}
          {phase === 'exhale' && 'Exhalar'}
          {phase === 'holdOut' && 'Vacío'}
          {phase === 'idle' && 'Listo?'}
        </motion.span>
      </motion.div>

      {/* Pulsing Outer Rings */}
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: getScale() * (1 + i * 0.2),
            opacity: [0, 0.1, 0],
          }}
          transition={{ duration: duration, ease: "easeOut", repeat: Infinity }}
          className={`absolute inset-0 rounded-full border border-white/10`}
        />
      ))}
    </div>
  );
}
