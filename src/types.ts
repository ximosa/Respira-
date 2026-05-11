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
    description: 'Equilibra el sistema nervioso y reduce tension.',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'relax',
    name: 'Relajacion (4-7-8)',
    description: 'Perfecta para reducir ansiedad y preparar el sueno.',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    color: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'focus',
    name: 'Concentracion',
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
    description: 'Maxima oxigenacion y calma profunda.',
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
  {
    id: 'rain',
    name: 'Lluvia',
    icon: 'CloudRain',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2022/04/16/audio_520eb6a5cc.mp3?filename=light-rain-109591.mp3'
  },
  {
    id: 'forest',
    name: 'Bosque',
    icon: 'Trees',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_6b294070f5.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3'
  },
  {
    id: 'waves',
    name: 'Oceano',
    icon: 'Waves',
    type: 'stream',
    url: 'https://cdn.pixabay.com/download/audio/2022/06/07/audio_b9bd4170e4.mp3?filename=ocean-waves-112906.mp3'
  },
  {
    id: 'night',
    name: 'Noche Suave',
    icon: 'Zap',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_c4d98b122c.mp3?filename=summer-night-piano-solo-6885.mp3'
  },
];
