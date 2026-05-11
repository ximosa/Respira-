export interface BreathingMode {
  id: string;
  name: string;
  description: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  color: string;
}

export const BREATHING_MODES: BreathingMode[] = [
  {
    id: 'box',
    name: 'Cuadrada',
    description: 'Equilibra el sistema nervioso y reduce tensión.',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'relax',
    name: 'Relajación (4-7-8)',
    description: 'Perfecta para reducir ansiedad y preparar el sueño.',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    color: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'focus',
    name: 'Concentración',
    description: 'Estimula la claridad mental y el enfoque.',
    inhale: 4,
    holdIn: 2,
    exhale: 4,
    holdOut: 2,
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'deep',
    name: 'Profunda',
    description: 'Máxima oxigenación y calma profunda.',
    inhale: 6,
    holdIn: 0,
    exhale: 6,
    holdOut: 0,
    color: 'from-blue-500 to-indigo-600'
  }
];

export interface SoundMode {
  id: string;
  name: string;
  icon: string;
  url: string;
}

export const SOUND_MODES: SoundMode[] = [
  { id: 'rain', name: 'Lluvia', icon: 'CloudRain', url: 'https://assets.mixkit.co/active_storage/sfx/2418/2418-preview.mp3' },
  { id: 'forest', name: 'Bosque', icon: 'Trees', url: 'https://assets.mixkit.co/active_storage/sfx/2437/2437-preview.mp3' },
  { id: 'waves', name: 'Océano', icon: 'Waves', url: 'https://assets.mixkit.co/active_storage/sfx/2431/2431-preview.mp3' },
  { id: 'white-noise', name: 'Ruido Blanco', icon: 'Zap', url: 'https://assets.mixkit.co/active_storage/sfx/2435/2435-preview.mp3' },
];
