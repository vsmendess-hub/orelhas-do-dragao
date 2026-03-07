'use client';

import { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/lib/hooks/use-touch-gestures';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => void | Promise<void>;
  children: ReactNode;
  className?: string;
}

export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
  const { ref, isPulling, pullDistance, threshold } = usePullToRefresh(onRefresh);

  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const rotation = (pullDistance / threshold) * 360;

  return (
    <div ref={ref} className={cn('relative overflow-auto', className)}>
      {/* Pull Indicator */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 flex items-center justify-center transition-all',
          isPulling ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          height: `${pullDistance}px`,
          transform: `translateY(-${Math.max(0, threshold - pullDistance)}px)`,
        }}
      >
        <div className="glass-card-light rounded-full p-3">
          <RefreshCw
            className={cn(
              'h-6 w-6 transition-colors',
              progress >= 100 ? 'text-purple-400' : 'text-gray-400'
            )}
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: isPulling ? `translateY(${pullDistance}px)` : undefined,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
