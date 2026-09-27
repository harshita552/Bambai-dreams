import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * Tracks normalized mouse position (-1..1 on each axis) within a container.
 * Returns springed motion values consumed by cards to derive their own
 * depth-scaled parallax offset.
 */
export function useMouseParallax(containerRef, disabled = false) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.5 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || disabled) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rawX.set(px * 2);
      rawY.set(py * 2);
    };
    const reset = () => {
      rawX.set(0);
      rawY.set(0);
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', reset);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', reset);
    };
  }, [containerRef, disabled, rawX, rawY]);

  return { x, y };
}
