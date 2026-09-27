import { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useCardTilt } from './useCardTilt';

/**
 * A single floating media card. Three independent transform layers,
 * each on its own nested element so they compose without conflict:
 *  1. entrance + continuous float drift (outer)
 *  2. mouse parallax offset, depth-scaled (middle)
 *  3. hover tilt + magnetic pull + scale (inner, listens for mouse)
 */
export default function FloatingCard({
  label,
  palette = ['#222', '#000'],
  mouseX,
  mouseY,
  depth = 50,
  floatRange = { x: 10, y: 15, rotate: 2 },
  floatDuration = 7,
  floatDelay = 0,
  entryFrom = { x: 0, y: 0 },
  entryDelay = 0,
  reduceMotion = false,
}) {
  const ref = useRef(null);
  const { rotateX, rotateY, magX, magY, handleMove, handleLeave } = useCardTilt(ref);

  const parallaxX = useTransform(mouseX, (v) => v * depth);
  const parallaxY = useTransform(mouseY, (v) => v * depth);

  const floatAnimate = reduceMotion
    ? {}
    : {
        y: [-floatRange.y, floatRange.y, -floatRange.y],
        x: [-floatRange.x, floatRange.x, -floatRange.x],
        rotate: [-floatRange.rotate, floatRange.rotate, -floatRange.rotate],
      };
  const floatTransition = reduceMotion
    ? { duration: 0 }
    : { duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' };

  return (
    <motion.div
      style={{ willChange: 'transform' }}
      initial={{ opacity: 0, scale: 0.8, x: entryFrom.x, y: entryFrom.y }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16, delay: entryDelay }}
    >
      <motion.div animate={floatAnimate} transition={floatTransition} style={{ willChange: 'transform' }}>
        <motion.div style={{ x: parallaxX, y: parallaxY, willChange: 'transform' }}>
          <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              rotateX, rotateY, x: magX, y: magY, transformPerspective: 600,
              position: 'relative', width: '100%', height: '100%',
              borderRadius: 24, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              willChange: 'transform',
            }}
          >
            <div
              style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 12,
                background: `linear-gradient(155deg, ${palette[0]} 0%, ${palette[1]} 100%)`,
              }}
            >
              {label && (
                <span style={{
                  fontFamily: '"DM Sans",sans-serif', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.4)', padding: '4px 8px',
                }}>
                  {label}
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
