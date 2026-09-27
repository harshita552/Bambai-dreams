import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [isTouch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 1400, damping: 60, mass: 0.1 });
  const y = useSpring(my, { stiffness: 1400, damping: 60, mass: 0.1 });

  useEffect(() => {
    if (isTouch) return;
    const move = e => { mx.set(e.clientX); my.set(e.clientY); };
    const enter = e => { if (e.target?.closest?.('[data-cursor]')) setHovered(true); };
    const leave = () => setHovered(false);

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseenter', enter, true);
    document.addEventListener('mouseleave', leave, true);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseenter', enter, true);
      document.removeEventListener('mouseleave', leave, true);
    };
  }, [isTouch, mx, my]);

  if (isTouch) return null;

  return (
    <motion.div
      style={{
        x, y,
        translateX: '-50%', translateY: '-50%',
        position: 'fixed', pointerEvents: 'none', zIndex: 99999,
      }}
      animate={{ scale: hovered ? 1.8 : 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: 'var(--yellow)',
        boxShadow: '0 0 12px rgba(255,203,49,0.45)',
      }} />
    </motion.div>
  );
}
