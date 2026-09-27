import { useMotionValue, useSpring } from 'framer-motion';

/**
 * Per-card hover tilt + subtle magnetic pull toward the cursor.
 * `ref` must point to the DOM node the listeners attach to.
 */
export function useCardTilt(ref, { tiltStrength = 8, magnetStrength = 12 } = {}) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(rx, { stiffness: 300, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 300, damping: 20 });
  const magX = useSpring(mx, { stiffness: 300, damping: 20 });
  const magY = useSpring(my, { stiffness: 300, damping: 20 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * tiltStrength);
    rx.set(-py * tiltStrength);
    mx.set(px * magnetStrength);
    my.set(py * magnetStrength);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(0);
    my.set(0);
  };

  return { rotateX, rotateY, magX, magY, handleMove, handleLeave };
}
