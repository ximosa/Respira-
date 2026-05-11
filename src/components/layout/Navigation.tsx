import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Wind, Moon, Target, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Inicio', path: '/' },
  { icon: Wind, label: 'Respira', path: '/breathing' },
  { icon: Moon, label: 'Sueño', path: '/sleep' },
  { icon: Target, label: 'Foco', path: '/focus' },
  { icon: Dumbbell, label: 'Gym', path: '/gym' },
];

export default function Navigation() {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              cn(
                "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                isActive ? "text-white" : "text-white/40 hover:text-white/70"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={1.5} />
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                ) }
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
