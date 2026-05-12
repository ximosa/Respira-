import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Wind, Moon, Target, Dumbbell, ArrowRight, X, ShieldAlert, Sparkles, HeartPulse } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';

const quickActions = [
  { title: 'Respira', icon: Wind, color: 'bg-blue-500/20 text-blue-300', path: '/breathing', desc: 'Reduce estrés al instante' },
  { title: 'Duerma', icon: Moon, color: 'bg-indigo-500/20 text-indigo-300', path: '/sleep', desc: 'Sonidos para un descanso profundo' },
  { title: 'Enfoque', icon: Target, color: 'bg-emerald-500/20 text-emerald-300', path: '/focus', desc: 'Aumenta tu productividad' },
  { title: 'Recupera', icon: Dumbbell, color: 'bg-orange-500/20 text-orange-300', path: '/gym', desc: 'Respiración post-entreno' },
];

export default function Home() {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(0);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = window.localStorage.getItem('respira_onboarding_done');
    if (!hasSeenOnboarding) setShowOnboarding(true);
  }, []);

  const closeOnboarding = () => {
    window.localStorage.setItem('respira_onboarding_done', 'true');
    setShowOnboarding(false);
    setStep(0);
    setShowMore(false);
  };

  const goToModeFromOnboarding = (path: string) => {
    closeOnboarding();
    navigate(path);
  };

  const steps = [
    {
      title: 'Como usar Respira+',
      icon: Sparkles,
      body: 'Elige un modo segun tu objetivo: calma, enfoque, descanso o recuperacion. Pulsa play y sigue la guia visual y de voz.',
      action: 'Siguiente',
    },
    {
      title: 'Ajusta tiempos a tu capacidad',
      icon: HeartPulse,
      body: 'Empieza suave y sube poco a poco. Si notas mareo, tension o incomodidad, para la sesion y reduce tiempos.',
      action: 'Siguiente',
    },
    {
      title: 'Seguridad primero',
      icon: ShieldAlert,
      body: 'Hazlo sentado o tumbado. Nunca en agua, conduciendo ni usando maquinaria. Si tienes condicion medica, consulta a un profesional.',
      action: 'Empezar',
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="w-full space-y-12">
      <header className="space-y-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/60 tracking-widest uppercase"
        >
          Bienvenido a Respira+
        </motion.div>
        <motion.h1 
          className="text-5xl font-light tracking-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Tu pausa <br /> <span className="font-medium">consciente</span>
        </motion.h1>
        <button
          onClick={() => setShowOnboarding(true)}
          className="text-xs uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors border border-white/10 rounded-full px-4 py-2 bg-white/5"
        >
          Ver guia completa
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4">
        {quickActions.map((action, i) => (
          <Link key={action.path} to={action.path}>
            <GlassCard
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 group flex items-center gap-6"
            >
              <div className={`p-4 rounded-2xl ${action.color}`}>
                <action.icon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium">{action.title}</h3>
                <p className="text-white/40 text-sm">{action.desc}</p>
              </div>
              <ArrowRight className="text-white/20 group-hover:text-white/60 transition-colors" size={20} />
            </GlassCard>
          </Link>
        ))}
      </section>

      <footer className="text-center pb-8">
        <p className="text-white/20 text-xs tracking-widest uppercase font-medium">Instala para uso offline</p>
      </footer>

      <AnimatePresence>
        {showOnboarding && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl px-6 py-8 pb-32 flex flex-col overflow-y-auto"
          >
            <div className="w-full max-w-lg mx-auto h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs text-white/50 uppercase tracking-widest">Onboarding</p>
                <button
                  onClick={closeOnboarding}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  aria-label="Cerrar onboarding"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-8">
                {steps.map((item, index) => (
                  <div
                    key={item.title}
                    className={`h-1.5 rounded-full transition-all ${index <= step ? 'bg-white w-14' : 'bg-white/20 w-8'}`}
                  />
                ))}
              </div>

              <motion.div
                key={currentStep.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
                  <currentStep.icon size={28} />
                </div>
                <h3 className="text-3xl font-light tracking-tight mb-4">{currentStep.title}</h3>
                <p className="text-white/75 text-base leading-relaxed">{currentStep.body}</p>

                <button
                  onClick={() => setShowMore((prev) => !prev)}
                  className="mt-6 text-xs uppercase tracking-widest text-white/60 hover:text-white border border-white/15 rounded-full px-4 py-2 bg-white/5 transition-colors"
                >
                  {showMore ? 'Ver menos' : 'Ver mas'}
                </button>

                <AnimatePresence>
                  {showMore && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3 overflow-hidden"
                    >
                      <div className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 p-3">
                        <p className="text-xs uppercase tracking-widest text-emerald-200 mb-1">Beneficios</p>
                        <p className="text-sm text-white/80">Mejor control del estres, mayor foco mental, mejor sensacion de calma y mejor tolerancia al esfuerzo respiratorio.</p>
                      </div>
                      <div className="rounded-xl border border-sky-300/20 bg-sky-500/10 p-3">
                        <p className="text-xs uppercase tracking-widest text-sky-200 mb-1">Mejora de rendimiento</p>
                        <p className="text-sm text-white/80">Semana 1: usa tiempos base sin forzar. Semana 2: sube 1s en inspiracion o expiracion. Semana 3: sube 1s en aguante solo si no hay mareo. Mantente 1 semana por nivel antes de volver a subir.</p>
                      </div>
                      <div className="rounded-xl border border-amber-300/20 bg-amber-500/10 p-3">
                        <p className="text-xs uppercase tracking-widest text-amber-200 mb-1">Senales para bajar intensidad</p>
                        <p className="text-sm text-white/80">Si notas mareo, hormigueo intenso, vision borrosa o ansiedad, para la sesion, respira normal 2 minutos y reduce tiempos en la siguiente practica.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => goToModeFromOnboarding('/breathing')}
                    className="rounded-xl border border-blue-300/40 bg-blue-500/20 py-3 text-sm font-medium text-blue-100"
                  >
                    Ir a Respira
                  </button>
                  <button
                    onClick={() => goToModeFromOnboarding('/focus')}
                    className="rounded-xl border border-emerald-300/40 bg-emerald-500/20 py-3 text-sm font-medium text-emerald-100"
                  >
                    Ir a Enfoque
                  </button>
                  <button
                    onClick={() => goToModeFromOnboarding('/sleep')}
                    className="rounded-xl border border-indigo-300/40 bg-indigo-500/20 py-3 text-sm font-medium text-indigo-100"
                  >
                    Ir a Sueno
                  </button>
                  <button
                    onClick={() => goToModeFromOnboarding('/gym')}
                    className="rounded-xl border border-orange-300/40 bg-orange-500/20 py-3 text-sm font-medium text-orange-100"
                  >
                    Ir a Recupera
                  </button>
                </div>
              </motion.div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={closeOnboarding}
                  className="flex-1 py-3 rounded-xl border border-white/15 bg-white/5 text-white/80"
                >
                  Omitir
                </button>
                <button
                  onClick={() => {
                    if (step >= steps.length - 1) closeOnboarding();
                    else setStep((prev) => prev + 1);
                  }}
                  className="flex-1 py-3 rounded-xl bg-white text-black font-medium"
                >
                  {currentStep.action}
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
