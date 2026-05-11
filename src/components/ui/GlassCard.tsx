import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export default function GlassCard({ children, className, intensity = 'medium', ...props }: GlassCardProps) {
  const intensities = {
    low: 'bg-white/[0.02] border-white/[0.05] backdrop-blur-md',
    medium: 'bg-white/[0.05] border-white/10 backdrop-blur-xl',
    high: 'bg-white/[0.08] border-white/[0.15] backdrop-blur-2xl',
  };

  return (
    <motion.div
      className={cn(
        "rounded-3xl border overflow-hidden shadow-2xl",
        intensities[intensity],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
