import { motion } from 'motion/react';
import { Wind, Moon, Target, Dumbbell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';

const quickActions = [
  { title: 'Respira', icon: Wind, color: 'bg-blue-500/20 text-blue-300', path: '/breathing', desc: 'Reduce estrés al instante' },
  { title: 'Duerma', icon: Moon, color: 'bg-indigo-500/20 text-indigo-300', path: '/sleep', desc: 'Sonidos para un descanso profundo' },
  { title: 'Enfoque', icon: Target, color: 'bg-emerald-500/20 text-emerald-300', path: '/focus', desc: 'Aumenta tu productividad' },
  { title: 'Recupera', icon: Dumbbell, color: 'bg-orange-500/20 text-orange-300', path: '/gym', desc: 'Respiración post-entreno' },
];

export default function Home() {
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
    </div>
  );
}
