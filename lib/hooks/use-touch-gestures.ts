import { useEffect, useRef, useState, RefObject } from 'react';

export interface TouchGestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onPinchZoom?: (scale: number) => void;
}

interface TouchGestureOptions {
  threshold?: number; // Minimum distance for swipe (px)
  longPressDelay?: number; // Delay for long press (ms)
  doubleTapDelay?: number; // Max delay between taps (ms)
  preventDefaultOnSwipe?: boolean;
}

export function useTouchGestures(
  ref: RefObject<HTMLElement>,
  handlers: TouchGestureHandlers,
  options: TouchGestureOptions = {}
) {
  const {
    threshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    preventDefaultOnSwipe = true,
  } = options;

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTap = useRef<number>(0);
  const pinchDistance = useRef<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Touch Start
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Start long press timer
      if (handlers.onLongPress) {
        longPressTimer.current = setTimeout(() => {
          handlers.onLongPress?.();
        }, longPressDelay);
      }

      // Handle pinch zoom start
      if (e.touches.length === 2 && handlers.onPinchZoom) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        pinchDistance.current = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
      }
    };

    // Touch Move
    const handleTouchMove = (e: TouchEvent) => {
      // Cancel long press on move
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      // Handle pinch zoom
      if (e.touches.length === 2 && handlers.onPinchZoom && pinchDistance.current) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const newDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const scale = newDistance / pinchDistance.current;
        handlers.onPinchZoom(scale);
        pinchDistance.current = newDistance;
      }
    };

    // Touch End
    const handleTouchEnd = (e: TouchEvent) => {
      // Clear long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Reset pinch
      pinchDistance.current = 0;

      // Check for swipe
      if (Math.max(absDeltaX, absDeltaY) > threshold) {
        if (preventDefaultOnSwipe) {
          e.preventDefault();
        }

        // Determine swipe direction
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
      }
      // Check for double tap
      else if (handlers.onDoubleTap && deltaTime < 200) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTap.current;

        if (timeSinceLastTap < doubleTapDelay && timeSinceLastTap > 0) {
          handlers.onDoubleTap();
          lastTap.current = 0; // Reset to prevent triple tap
        } else {
          lastTap.current = now;
        }
      }

      touchStart.current = null;
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);

      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [handlers, threshold, longPressDelay, doubleTapDelay, preventDefaultOnSwipe]);
}

// Hook for swipeable navigation
export function useSwipeNavigation(
  onNext?: () => void,
  onPrevious?: () => void
) {
  const ref = useRef<HTMLDivElement>(null);

  useTouchGestures(ref, {
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
  });

  return ref;
}

// Hook for pull-to-refresh
export function usePullToRefresh(onRefresh: () => void | Promise<void>) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const threshold = 80;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only if scrolled to top
      if (element.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === 0) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;

      if (distance > 0 && element.scrollTop === 0) {
        setIsPulling(true);
        setPullDistance(Math.min(distance, threshold * 1.5));
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold) {
        await onRefresh();
      }

      setIsPulling(false);
      setPullDistance(0);
      startY.current = 0;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, onRefresh]);

  return { ref, isPulling, pullDistance, threshold };
}
