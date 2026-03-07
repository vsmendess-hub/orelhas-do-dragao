'use client';

import { ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  snapPoints?: number[]; // Snap positions as percentages (0-100)
  defaultSnap?: number; // Default snap point index
}

export function MobileSheet({
  open,
  onClose,
  children,
  title,
  description,
  snapPoints = [90, 50],
  defaultSnap = 0,
}: MobileSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [currentSnap, setCurrentSnap] = useState(snapPoints[defaultSnap]);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  useEffect(() => {
    // Mount check for SSR
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) {
      // Prevent body scroll when sheet is open
      document.body.style.overflow = 'hidden';
      setCurrentSnap(snapPoints[defaultSnap]);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open, defaultSnap, snapPoints]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaY = currentY - startY;
    const threshold = 50;

    // Close if dragged down significantly
    if (deltaY > threshold) {
      const nextSnapIndex = snapPoints.indexOf(currentSnap) + 1;
      if (nextSnapIndex >= snapPoints.length) {
        onClose();
      } else {
        setCurrentSnap(snapPoints[nextSnapIndex]);
      }
    }
    // Snap up if dragged up
    else if (deltaY < -threshold) {
      const prevSnapIndex = snapPoints.indexOf(currentSnap) - 1;
      if (prevSnapIndex >= 0) {
        setCurrentSnap(snapPoints[prevSnapIndex]);
      }
    }

    setStartY(0);
    setCurrentY(0);
  };

  if (!mounted) return null;

  const sheetContent = (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          'fixed left-0 right-0 bottom-0 z-50 transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{
          height: `${currentSnap}vh`,
          transform: isDragging
            ? `translateY(${Math.max(0, currentY - startY)}px)`
            : undefined,
        }}
      >
        <div className="glass-card h-full rounded-t-3xl border-t border-white/10 flex flex-col overflow-hidden">
          {/* Handle */}
          <div
            className="flex flex-col items-center py-3 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1.5 rounded-full bg-white/20 mb-2" />

            {/* Header */}
            {(title || description) && (
              <div className="w-full px-6 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h2 className="text-lg font-semibold text-white truncate">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-sm text-gray-400 mt-1">{description}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(sheetContent, document.body);
}
