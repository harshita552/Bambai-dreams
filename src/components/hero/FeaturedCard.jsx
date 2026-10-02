import { motion, useTransform } from 'framer-motion';

export default function FeaturedCard({ mouseX, mouseY, depth = 10 }) {
  const parallaxX = useTransform(mouseX, (v) => v * depth);
  const parallaxY = useTransform(mouseY, (v) => v * depth);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 18, delay: 0.1 }}
      style={{
        x: parallaxX, y: parallaxY,
        position: 'relative', zIndex: 20,
        width: 'min(62vw,640px)', height: 'min(68vh,560px)',
        borderRadius: 24, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
        willChange: 'transform',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, #3a3a3a 0%, #0a0a0a 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 'max(calc(18px * var(--k) * var(--fm)), var(--fs-min))',
          backdropFilter: 'blur(4px)', background: 'rgba(255,255,255,0.05)',
        }}>▶</div>
      </div>
      <span style={{
        position: 'absolute', bottom: 16, left: 16,
        fontFamily: '"DM Sans",sans-serif', fontSize: 'max(calc(10px * var(--k) * var(--fm)), var(--fs-min))', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.45)', padding: '4px 10px',
      }}>
        Placeholder Reel — Featured
      </span>
    </motion.div>
  );
}
