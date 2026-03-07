import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'light' | 'purple';
}

export function GlassCard({ children, className, variant = 'default' }: GlassCardProps) {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300';

  const variantClasses = {
    default: 'glass-card',
    light: 'glass-card-light',
    purple: 'bg-gradient-to-br from-purple-600/20 to-violet-600/20 backdrop-blur-xl border border-purple-500/30',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
}
